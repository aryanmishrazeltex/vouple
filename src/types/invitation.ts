export type InvitationStatus = "unused" | "redeemed" | "expired" | "revoked";

export interface InvitationRecord {
  id: string;
  email: string;
  code: string;
  codeHash: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  redeemedAt?: string;
  redeemedByUserId?: string;
  revokedAt?: string;
  waitlistSignupId?: string;
}

export interface CreateInvitationInput {
  email: string;
  expiresInHours?: number; // Defaults to 168 (7 days)
  waitlistSignupId?: string;
}

export interface ValidateInvitationResult {
  valid: boolean;
  errorCode?:
    | "INVITATION_NOT_FOUND"
    | "EMAIL_MISMATCH"
    | "ALREADY_REDEEMED"
    | "INVITATION_EXPIRED"
    | "INVITATION_REVOKED"
    | "INVALID_CODE_FORMAT";
  message: string;
  invitation?: {
    id: string;
    email: string;
    expiresAt: string;
    status: InvitationStatus;
  };
}

export interface RedeemInvitationResult {
  success: boolean;
  errorCode?: string;
  message: string;
  invitationId?: string;
}
