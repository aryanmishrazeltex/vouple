import { NextRequest, NextResponse } from "next/server";
import { validateInvitation } from "@/lib/invitation-service";

// Rate limiting map for validation attempts (prevents brute-force)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 15;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return true;
  }
  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "127.0.0.1";

  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      {
        valid: false,
        errorCode: "RATE_LIMITED",
        message: "Too many validation attempts. Please wait 15 minutes before trying again.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.code) {
      return NextResponse.json(
        {
          valid: false,
          errorCode: "INVALID_REQUEST",
          message: "Invitation code is required.",
        },
        { status: 400 }
      );
    }

    const result = await validateInvitation(body.code, body.email);

    if (!result.valid) {
      return NextResponse.json(
        {
          valid: false,
          errorCode: result.errorCode,
          message: result.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: "Invitation is valid.",
      invitation: result.invitation,
    });
  } catch (err: any) {
    console.error("[Validate Invitation API Error]:", err);
    return NextResponse.json(
      {
        valid: false,
        errorCode: "SERVER_ERROR",
        message: "An unexpected error occurred while validating the invitation.",
      },
      { status: 500 }
    );
  }
}
