import { NextRequest, NextResponse } from "next/server";
import { isOperatorAuthorized } from "@/lib/admin-auth";
import {
  createInvitation,
  listAllInvitations,
} from "@/lib/invitation-service";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isOperatorAuthorized(req)) {
    return NextResponse.json(
      {
        success: false,
        error: "UNAUTHORIZED",
        message: "Operator authorization required.",
      },
      { status: 401 }
    );
  }

  const invitations = await listAllInvitations();

  return NextResponse.json({
    success: true,
    total: invitations.length,
    invitations,
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isOperatorAuthorized(req)) {
    return NextResponse.json(
      {
        success: false,
        error: "UNAUTHORIZED",
        message: "Operator authorization required.",
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.email || typeof body.email !== "string" || !body.email.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_REQUEST",
          message: "A recipient email is required to issue an invitation.",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = body.email.trim().toLowerCase();
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_EMAIL",
          message: "Please provide a valid recipient email address.",
        },
        { status: 400 }
      );
    }

    const expiresInHours = body.expiresInHours ? Number(body.expiresInHours) : 168; // 7 days

    const invitation = await createInvitation({
      email: normalizedEmail,
      expiresInHours: isNaN(expiresInHours) ? 168 : expiresInHours,
      waitlistSignupId: body.waitlistSignupId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Single-use invitation generated successfully.",
        invitation,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[Admin Invitations POST Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to generate invitation.",
      },
      { status: 500 }
    );
  }
}
