import { NextRequest, NextResponse } from "next/server";
import { validateInvitation, redeemInvitationAtomically } from "@/lib/invitation-service";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "INVALID_REQUEST", message: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    const { code, email, password, fullName } = body;

    // 1. Input format validation
    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { success: false, error: "MISSING_CODE", message: "Invitation code is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "MISSING_EMAIL", message: "Email address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "INVALID_EMAIL", message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "WEAK_PASSWORD",
          message: "Password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    // 2. Validate Invitation existence, expiry, status, and email match WITHOUT consuming it
    const validation = await validateInvitation(code, normalizedEmail);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errorCode,
          message: validation.message,
        },
        { status: 400 }
      );
    }

    // 3. Supabase Auth Account Creation
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    let authUserId = "";
    let requiresEmailConfirmation = false;
    let authSession = null;

    if (url && anonKey) {
      const supabase = createClient(url, anonKey, { auth: { persistSession: false } });

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName || "",
            role: "member",
            invitation_code_prefix: code.substring(0, 8),
          },
        },
      });

      if (signUpError) {
        // Safe retry/failure handling: Invitation is NOT consumed if auth creation fails
        return NextResponse.json(
          {
            success: false,
            error: "AUTH_SIGNUP_FAILED",
            message: signUpError.message || "Failed to create account with Supabase Auth.",
          },
          { status: 400 }
        );
      }

      if (!signUpData?.user?.id) {
        return NextResponse.json(
          {
            success: false,
            error: "USER_CREATION_FAILED",
            message: "Unable to retrieve user credentials from Supabase Auth.",
          },
          { status: 500 }
        );
      }

      authUserId = signUpData.user.id;
      // If session is null or confirmed_at is null, Supabase Auth requires email verification
      requiresEmailConfirmation = !signUpData.session && !signUpData.user.confirmed_at;
      authSession = signUpData.session;
    } else {
      // Mock / Offline fallback when Supabase is not configured
      authUserId = `user_${Date.now()}`;
      requiresEmailConfirmation = false;
    }

    // 4. Atomically redeem the invitation now that user account creation succeeded
    const redemption = await redeemInvitationAtomically(code, normalizedEmail, authUserId);
    if (!redemption.success) {
      return NextResponse.json(
        {
          success: false,
          error: redemption.errorCode,
          message: redemption.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: requiresEmailConfirmation
          ? "Account registered successfully! Supabase Auth is configured to require email verification. Please check your inbox for the confirmation link."
          : "Account created and invitation redeemed successfully! Welcome to Vouple.",
        user: {
          id: authUserId,
          email: normalizedEmail,
          fullName: fullName || "",
        },
        requiresEmailConfirmation,
        session: authSession,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[Register With Invite API Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An unexpected error occurred during account creation.",
      },
      { status: 500 }
    );
  }
}
