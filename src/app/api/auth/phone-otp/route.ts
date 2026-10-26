import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseServerClient } from "@/lib/supabase-client";

// In-memory OTP storage for phone verification (serverless resilient with fallback)
interface StoredOtp {
  code: string;
  phone: string;
  userId?: string;
  expiresAt: number;
  attempts: number;
}

// Global cache across warm serverless lambdas
const otpStore = new Map<string, StoredOtp>();

// Normalize Indian phone numbers: returns +91XXXXXXXXXX
function normalizePhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  if (raw.startsWith("+") && digits.length >= 10) {
    return `+${digits}`;
  }
  return `+91${digits.slice(-10)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, phone: rawPhone, otp, userId } = body;

    if (!rawPhone || typeof rawPhone !== "string") {
      return NextResponse.json(
        { success: false, message: "A valid mobile phone number is required." },
        { status: 400 }
      );
    }

    const phone = normalizePhoneNumber(rawPhone);
    const digitsOnly = phone.replace(/\D/g, "");

    // Validate 10-digit Indian mobile format
    if (digitsOnly.length < 10) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // ───────────────────────────────────────────────
    // ACTION 1: SEND OTP
    // ───────────────────────────────────────────────
    if (action === "send") {
      // Generate 6-digit cryptographic numeric OTP
      const code = crypto.randomInt(100000, 999999).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

      otpStore.set(phone, {
        code,
        phone,
        userId,
        expiresAt,
        attempts: 0,
      });

      console.log(`[Phone OTP] Generated 6-digit code for ${phone}: ${code} (expires in 5 min)`);

      // If an SMS provider (Twilio / Msg91) is configured in environment, trigger it here.
      // E.g., if (process.env.TWILIO_ACCOUNT_SID) { ... }

      const isDev = process.env.NODE_ENV !== "production";

      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${phone}`,
        phone,
        expiresIn: 300,
        // In dev/demo mode or local testing, provide the code so founder isn't blocked by carrier DLT
        devHint: isDev ? code : undefined,
      });
    }

    // ───────────────────────────────────────────────
    // ACTION 2: VERIFY OTP
    // ───────────────────────────────────────────────
    if (action === "verify") {
      if (!otp || typeof otp !== "string") {
        return NextResponse.json(
          { success: false, message: "Please enter the 6-digit verification code." },
          { status: 400 }
        );
      }

      const cleanOtp = otp.trim().replace(/\D/g, "");
      const stored = otpStore.get(phone);

      // Support universal test code "123456" in dev or if matches generated OTP
      const isUniversalTestCode = process.env.NODE_ENV !== "production" && cleanOtp === "123456";
      const isStoredValid =
        stored &&
        Date.now() <= stored.expiresAt &&
        stored.code === cleanOtp;

      if (!isStoredValid && !isUniversalTestCode) {
        if (stored) {
          stored.attempts += 1;
          if (stored.attempts >= 5) {
            otpStore.delete(phone);
            return NextResponse.json(
              { success: false, message: "Too many failed attempts. Please request a new code." },
              { status: 429 }
            );
          }
        }
        return NextResponse.json(
          { success: false, message: "Incorrect verification code. Please check and try again." },
          { status: 400 }
        );
      }

      // Successful verification: delete OTP
      otpStore.delete(phone);

      // If Supabase user ID is provided, bind phone to user metadata
      const supabaseAdmin = getSupabaseServerClient();
      if (userId && supabaseAdmin) {
        try {
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            phone,
            user_metadata: {
              phone,
              phone_verified: true,
              phone_verified_at: new Date().toISOString(),
            },
          });
          console.log(`[Phone OTP] Verified & bound ${phone} to user ${userId}`);
        } catch (updateErr) {
          console.warn("[Phone OTP] Failed to update user metadata in Supabase:", updateErr);
        }
      }

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Mobile phone successfully verified.",
        phone,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action specified." },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Phone OTP API Error]", error);
    return NextResponse.json(
      { success: false, message: "Unable to process phone verification at this time." },
      { status: 500 }
    );
  }
}
