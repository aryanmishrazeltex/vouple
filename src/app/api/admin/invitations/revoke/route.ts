import { NextRequest, NextResponse } from "next/server";
import { isOperatorAuthorized } from "@/lib/admin-auth";
import { revokeInvitation } from "@/lib/invitation-service";

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
    if (!body || !body.invitationId) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_REQUEST",
          message: "Invitation ID is required to revoke an invitation.",
        },
        { status: 400 }
      );
    }

    const result = await revokeInvitation(body.invitationId);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "REVOCATION_FAILED",
          message: result.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    console.error("[Admin Invitations Revoke Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "Failed to revoke invitation.",
      },
      { status: 500 }
    );
  }
}
