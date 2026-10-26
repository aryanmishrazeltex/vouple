import crypto from "crypto";
import fs from "fs";
import path from "path";
import os from "os";
import { getSupabaseServerClient } from "@/lib/supabase-client";
import {
  InvitationRecord,
  InvitationStatus,
  CreateInvitationInput,
  ValidateInvitationResult,
  RedeemInvitationResult,
} from "@/types/invitation";

// Serverless-safe fallback directory
const isServerless = Boolean(
  process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
);

const DATA_DIR = isServerless
  ? path.join(os.tmpdir(), "vouple-data")
  : path.join(process.cwd(), ".data");
const INVITATIONS_FILE = path.join(DATA_DIR, "invitations.json");

// Safe alphabet omitting ambiguous characters: 0, O, 1, I, L
const CHARSET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateSecureInvitationCode(): string {
  const getBlock = (len: number) => {
    let result = "";
    for (let i = 0; i < len; i++) {
      const idx = crypto.randomInt(0, CHARSET.length);
      result += CHARSET[idx];
    }
    return result;
  };
  return `VPL-${getBlock(4)}-${getBlock(4)}-${getBlock(4)}`;
}

export function normalizeInvitationCode(raw: string): string {
  if (!raw) return "";
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  // If user entered without VPL prefix
  if (cleaned.startsWith("VPL")) {
    const rest = cleaned.substring(3);
    if (rest.length === 12) {
      return `VPL-${rest.substring(0, 4)}-${rest.substring(4, 8)}-${rest.substring(8, 12)}`;
    }
  } else if (cleaned.length === 12) {
    return `VPL-${cleaned.substring(0, 4)}-${cleaned.substring(4, 8)}-${cleaned.substring(8, 12)}`;
  }
  return raw.trim().toUpperCase();
}

export function hashInvitationCode(code: string): string {
  const normalized = normalizeInvitationCode(code);
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

function ensureFallbackStorage(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(INVITATIONS_FILE)) {
      fs.writeFileSync(INVITATIONS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("[Invitation Storage] Local storage init error:", err);
  }
}

function getLocalInvitations(): InvitationRecord[] {
  ensureFallbackStorage();
  try {
    const raw = fs.readFileSync(INVITATIONS_FILE, "utf-8");
    return JSON.parse(raw) as InvitationRecord[];
  } catch (err) {
    console.error("[Invitation Storage] Local read error:", err);
    return [];
  }
}

function saveLocalInvitations(records: InvitationRecord[]): void {
  ensureFallbackStorage();
  try {
    fs.writeFileSync(INVITATIONS_FILE, JSON.stringify(records, null, 2), "utf-8");
  } catch (err) {
    console.error("[Invitation Storage] Local write error:", err);
  }
}

// In-memory mutex for concurrency protection in local fallback
let localLock = Promise.resolve();
function acquireLocalLock<T>(fn: () => Promise<T>): Promise<T> {
  const result = localLock.then(fn);
  localLock = result.then(() => {}).catch(() => {});
  return result;
}

/**
 * Creates a unique invitation bound to a recipient's email address.
 * Never generates a shared code.
 */
export async function createInvitation(
  input: CreateInvitationInput
): Promise<InvitationRecord> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const expiresInHours = typeof input.expiresInHours === "number" ? input.expiresInHours : 168;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInHours * 60 * 60 * 1000).toISOString();
  const code = generateSecureInvitationCode();
  const codeHash = hashInvitationCode(code);

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .insert({
          email: normalizedEmail,
          code: code,
          code_hash: codeHash,
          status: "unused",
          expires_at: expiresAt,
          waitlist_signup_id: input.waitlistSignupId || null,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          email: data.email,
          code: data.code,
          codeHash: data.code_hash,
          status: data.status,
          expiresAt: data.expires_at,
          createdAt: data.created_at,
          redeemedAt: data.redeemed_at || undefined,
          redeemedByUserId: data.redeemed_by_user_id || undefined,
          revokedAt: data.revoked_at || undefined,
          waitlistSignupId: data.waitlist_signup_id || undefined,
        };
      } else if (error) {
        console.warn("[Invitation Service] Supabase insert failed, using fallback:", error.message);
      }
    } catch (err) {
      console.warn("[Invitation Service] Supabase connection error:", err);
    }
  }

  // Fallback storage
  return acquireLocalLock(async () => {
    const list = getLocalInvitations();
    const newRecord: InvitationRecord = {
      id: `inv_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      email: normalizedEmail,
      code,
      codeHash,
      status: "unused",
      expiresAt,
      createdAt: now.toISOString(),
      waitlistSignupId: input.waitlistSignupId,
    };
    list.unshift(newRecord);
    saveLocalInvitations(list);
    return newRecord;
  });
}

/**
 * Returns all invitations with dynamic expiry calculations.
 */
export async function listAllInvitations(): Promise<InvitationRecord[]> {
  const supabase = getSupabaseServerClient();
  const nowIso = new Date().toISOString();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((row) => {
          let status = row.status as InvitationStatus;
          if (status === "unused" && new Date(row.expires_at) < new Date()) {
            status = "expired";
          }
          return {
            id: row.id,
            email: row.email,
            code: row.code,
            codeHash: row.code_hash,
            status,
            expiresAt: row.expires_at,
            createdAt: row.created_at,
            redeemedAt: row.redeemed_at || undefined,
            redeemedByUserId: row.redeemed_by_user_id || undefined,
            revokedAt: row.revoked_at || undefined,
            waitlistSignupId: row.waitlist_signup_id || undefined,
          };
        });
      }
    } catch (err) {
      console.warn("[Invitation Service] Supabase list error:", err);
    }
  }

  // Fallback storage
  const list = getLocalInvitations();
  return list.map((inv) => {
    let status = inv.status;
    if (status === "unused" && new Date(inv.expiresAt) < new Date()) {
      status = "expired";
    }
    return { ...inv, status };
  });
}

/**
 * Revokes an unused invitation.
 */
export async function revokeInvitation(invitationId: string): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabaseServerClient();
  const nowIso = new Date().toISOString();

  if (supabase) {
    try {
      // First check status
      const { data: existing } = await supabase
        .from("invitations")
        .select("status")
        .eq("id", invitationId)
        .single();

      if (!existing) {
        return { success: false, message: "Invitation not found." };
      }
      if (existing.status === "redeemed") {
        return { success: false, message: "Cannot revoke an already redeemed invitation." };
      }

      const { error } = await supabase
        .from("invitations")
        .update({ status: "revoked", revoked_at: nowIso })
        .eq("id", invitationId);

      if (!error) {
        return { success: true, message: "Invitation successfully revoked." };
      }
    } catch (err) {
      console.warn("[Invitation Service] Supabase revoke error:", err);
    }
  }

  // Fallback storage
  return acquireLocalLock(async () => {
    const list = getLocalInvitations();
    const target = list.find((i) => i.id === invitationId);
    if (!target) {
      return { success: false, message: "Invitation not found." };
    }
    if (target.status === "redeemed") {
      return { success: false, message: "Cannot revoke an already redeemed invitation." };
    }
    target.status = "revoked";
    target.revokedAt = nowIso;
    saveLocalInvitations(list);
    return { success: true, message: "Invitation successfully revoked." };
  });
}

/**
 * Validates an invitation code and email WITHOUT consuming it.
 * Safe to call on page load or live validation.
 */
export async function validateInvitation(
  code: string,
  email?: string
): Promise<ValidateInvitationResult> {
  const normalizedCode = normalizeInvitationCode(code);
  const normalizedEmail = (email || "").trim().toLowerCase();

  if (!normalizedCode || normalizedCode.length < 8) {
    return {
      valid: false,
      errorCode: "INVALID_CODE_FORMAT",
      message: "Please enter a valid invitation code (format: VPL-XXXX-XXXX-XXXX).",
    };
  }

  // Strict validation against storage
  const codeHash = hashInvitationCode(normalizedCode);
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("code_hash", codeHash)
        .maybeSingle();

      if (!error && data) {
        // 1. Verify email match (only if email provided)
        if (normalizedEmail && data.email.toLowerCase() !== normalizedEmail) {
          return {
            valid: false,
            errorCode: "EMAIL_MISMATCH",
            message: "This invitation code was issued to a different email address.",
          };
        }

        // 2. Verify not revoked
        if (data.status === "revoked") {
          return {
            valid: false,
            errorCode: "INVITATION_REVOKED",
            message: "This invitation code has been revoked by an administrator.",
          };
        }

        // 3. Verify not already redeemed
        if (data.status === "redeemed") {
          return {
            valid: false,
            errorCode: "ALREADY_REDEEMED",
            message: "This invitation has already been redeemed and an account was created.",
          };
        }

        // 4. Verify expiry
        if (new Date(data.expires_at) < new Date()) {
          return {
            valid: false,
            errorCode: "INVITATION_EXPIRED",
            message: "This invitation code has expired.",
          };
        }

        return {
          valid: true,
          message: "Invitation is valid.",
          invitation: {
            id: data.id,
            email: data.email,
            expiresAt: data.expires_at,
            status: "unused",
          },
        };
      }
    } catch (err) {
      console.warn("[Invitation Service] Supabase validate error:", err);
    }
  }

  // Fallback storage check
  const list = getLocalInvitations();
  const found = list.find((i) => i.codeHash === codeHash || i.code === normalizedCode);

  if (!found) {
    return {
      valid: false,
      errorCode: "INVITATION_NOT_FOUND",
      message: "The invitation code provided was not found or is invalid.",
    };
  }

  if (normalizedEmail && found.email.toLowerCase() !== normalizedEmail) {
    return {
      valid: false,
      errorCode: "EMAIL_MISMATCH",
      message: "This invitation code was issued to a different email address.",
    };
  }

  if (found.status === "revoked") {
    return {
      valid: false,
      errorCode: "INVITATION_REVOKED",
      message: "This invitation code has been revoked by an administrator.",
    };
  }

  if (found.status === "redeemed") {
    return {
      valid: false,
      errorCode: "ALREADY_REDEEMED",
      message: "This invitation has already been redeemed.",
    };
  }

  if (new Date(found.expiresAt) < new Date()) {
    return {
      valid: false,
      errorCode: "INVITATION_EXPIRED",
      message: "This invitation code has expired.",
    };
  }

  return {
    valid: true,
    message: "Invitation is valid.",
    invitation: {
      id: found.id,
      email: found.email,
      expiresAt: found.expiresAt,
      status: "unused",
    },
  };
}

/**
 * Atomically redeems the invitation as part of account creation.
 * Guards against race conditions and concurrent requests.
 */
export async function redeemInvitationAtomically(
  code: string,
  email: string,
  userId: string
): Promise<RedeemInvitationResult> {
  const normalizedCode = normalizeInvitationCode(code);
  const normalizedEmail = (email || "").trim().toLowerCase();
  const codeHash = hashInvitationCode(normalizedCode);
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      // 1. Try PostgreSQL stored procedure with FOR UPDATE lock if present
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "redeem_invitation",
        {
          p_code_hash: codeHash,
          p_email: normalizedEmail,
          p_user_id: userId,
        }
      );

      if (!rpcError && rpcData && rpcData.length > 0) {
        const result = rpcData[0];
        if (result.success) {
          return {
            success: true,
            message: "Invitation redeemed successfully.",
            invitationId: result.invitation_id,
          };
        } else {
          return {
            success: false,
            errorCode: result.error_code,
            message: getFriendlyErrorMessage(result.error_code),
            invitationId: result.invitation_id,
          };
        }
      }

      // 2. If RPC not installed, execute atomic conditional update
      const nowIso = new Date().toISOString();
      const { data: updated, error: updateError } = await supabase
        .from("invitations")
        .update({
          status: "redeemed",
          redeemed_at: nowIso,
          redeemed_by_user_id: userId,
        })
        .eq("code_hash", codeHash)
        .eq("email", normalizedEmail)
        .eq("status", "unused")
        .gt("expires_at", nowIso)
        .select()
        .maybeSingle();

      if (!updateError && updated) {
        return {
          success: true,
          message: "Invitation redeemed successfully.",
          invitationId: updated.id,
        };
      }

      // If update matched 0 rows, check why it failed
      const val = await validateInvitation(code, email);
      return {
        success: false,
        errorCode: val.errorCode || "REDEMPTION_FAILED",
        message: val.message || "Failed to redeem invitation.",
      };
    } catch (err) {
      console.warn("[Invitation Service] Supabase atomic redemption error:", err);
    }
  }

  // Fallback storage with mutex lock
  return acquireLocalLock(async () => {
    const list = getLocalInvitations();
    const target = list.find((i) => i.codeHash === codeHash);

    if (!target) {
      return {
        success: false,
        errorCode: "INVITATION_NOT_FOUND",
        message: "The invitation code provided was not found.",
      };
    }

    // Update email to the actual account creating user if different
    if (target.email.toLowerCase() !== normalizedEmail) {
      target.email = normalizedEmail;
    }

    if (target.status === "revoked") {
      return {
        success: false,
        errorCode: "INVITATION_REVOKED",
        message: "This invitation code was revoked.",
      };
    }

    if (target.status === "redeemed") {
      return {
        success: false,
        errorCode: "ALREADY_REDEEMED",
        message: "This invitation code has already been redeemed.",
      };
    }

    if (new Date(target.expiresAt) < new Date()) {
      target.status = "expired";
      saveLocalInvitations(list);
      return {
        success: false,
        errorCode: "INVITATION_EXPIRED",
        message: "This invitation code has expired.",
      };
    }

    // Atomically consume
    target.status = "redeemed";
    target.redeemedAt = new Date().toISOString();
    target.redeemedByUserId = userId;
    saveLocalInvitations(list);

    return {
      success: true,
      message: "Invitation redeemed successfully.",
      invitationId: target.id,
    };
  });
}

function getFriendlyErrorMessage(errorCode?: string): string {
  switch (errorCode) {
    case "INVITATION_NOT_FOUND":
      return "The invitation code provided was not found.";
    case "EMAIL_MISMATCH":
      return "This invitation code was issued to a different email address.";
    case "ALREADY_REDEEMED":
      return "This invitation code has already been redeemed.";
    case "INVITATION_EXPIRED":
      return "This invitation code has expired.";
    case "INVITATION_REVOKED":
      return "This invitation code has been revoked.";
    default:
      return "Failed to redeem invitation code.";
  }
}
