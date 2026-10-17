import { NextRequest, NextResponse } from "next/server";
import {
  saveWaitlistEntry,
  updateWaitlistEmailStatus,
  getLocalWaitlistEntries,
} from "@/lib/waitlist-storage";
import { sendWaitlistConfirmationEmail } from "@/lib/email-service";
import { WaitlistSubmissionRequest, WaitlistResponse } from "@/types/waitlist";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONSENT_VERSION = "v1.0";

// Server-side IP rate limiting map
const ipRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 mins

function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    ipRateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: NextRequest): Promise<NextResponse<WaitlistResponse>> {
  try {
    // 1. IP Rate Limiting & Spam Protection
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "127.0.0.1";

    if (isIpRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMITED",
          message: "Too many attempts from your connection. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    const body = (await req.json().catch(() => null)) as Partial<
      WaitlistSubmissionRequest & { honeypot?: string; website?: string }
    > | null;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_JSON",
          message: "Invalid request payload.",
        },
        { status: 400 }
      );
    }

    // Honeypot check (anti-bot)
    if (body.honeypot || body.website) {
      return NextResponse.json(
        {
          success: false,
          error: "BOT_DETECTED",
          message: "Submission rejected.",
        },
        { status: 400 }
      );
    }

    const fieldErrors: { email?: string; isAdult?: string; consentGiven?: string } = {};

    // 2. Email validation
    if (!body.email || typeof body.email !== "string" || !body.email.trim()) {
      fieldErrors.email = "Please provide an email address.";
    } else {
      const normalized = body.email.trim().toLowerCase();
      if (!EMAIL_REGEX.test(normalized)) {
        fieldErrors.email = "Please enter a valid email address.";
      }
    }

    // 3. Required adult eligibility check (18+)
    if (body.isAdult !== true) {
      fieldErrors.isAdult = "You must be 18 years of age or older to join the waitlist.";
    }

    // 4. Required explicit consent for launch updates
    if (body.consentGiven !== true) {
      fieldErrors.consentGiven = "Please confirm your consent to receive Vouple launch updates.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_FAILED",
          message: "Please complete all required fields.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const normalizedEmail = body.email!.trim().toLowerCase();

    // 5. Persist signup to database / storage
    let savedRecord;
    try {
      const saveResult = await saveWaitlistEntry({
        email: normalizedEmail,
        isAdult: true,
        consentGiven: true,
        consentVersion: CONSENT_VERSION,
        city: "Jabalpur",
        userAgent: req.headers.get("user-agent") || undefined,
        ipAddress: clientIp,
      });
      savedRecord = saveResult.record;
    } catch (storageErr: any) {
      if (storageErr?.message === "ALREADY_REGISTERED") {
        return NextResponse.json(
          {
            success: false,
            error: "ALREADY_REGISTERED",
            message: "This email address is already on the waitlist.",
          },
          { status: 409 }
        );
      }

      console.error("[Waitlist API Error]:", storageErr);
      return NextResponse.json(
        {
          success: false,
          error: "STORAGE_ERROR",
          message: "Unable to process signup at this moment. Please try again shortly.",
        },
        { status: 500 }
      );
    }

    // 6. Send automatic confirmation email
    let emailStatus: "sent" | "failed" | "unconfigured" = "unconfigured";
    try {
      const emailResult = await sendWaitlistConfirmationEmail(savedRecord.email);
      emailStatus = emailResult.status;

      await updateWaitlistEmailStatus(
        savedRecord.id,
        emailResult.status,
        emailResult.error
      );
    } catch (emailErr: any) {
      console.error("[Waitlist API] Confirmation email error:", emailErr);
      await updateWaitlistEmailStatus(
        savedRecord.id,
        "failed",
        emailErr?.message || "Failed to trigger email dispatch"
      );
      emailStatus = "failed";
    }

    // 7. Return clean success response (never exposing full list or database secrets)
    return NextResponse.json(
      {
        success: true,
        message: "You're on the list. Thanks for your interest in Vouple.",
        emailStatus,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[Waitlist API Uncaught Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: "An unexpected error occurred. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}

// Public GET endpoint: Returns ONLY non-sensitive operational metadata
// NEVER returns email addresses or personal user data
export async function GET(): Promise<NextResponse> {
  const entries = getLocalWaitlistEntries();
  return NextResponse.json({
    status: "operational",
    totalWaitlistCount: entries.length,
    market: "Jabalpur, Madhya Pradesh, India",
    stage: "Pre-launch development & demand validation",
  });
}
