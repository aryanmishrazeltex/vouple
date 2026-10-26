import fs from "fs";
import path from "path";
import os from "os";
import { WaitlistRecord } from "@/types/waitlist";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase-client";

// In serverless environments (e.g. Vercel / AWS Lambda), process.cwd() is read-only.
// Use os.tmpdir() (/tmp) so disk fallback doesn't throw EROFS.
const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);

const DATA_DIR = isServerless
  ? path.join(os.tmpdir(), "vouple-data")
  : path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

function ensureLocalStorage(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("[Waitlist Storage] Local storage init error:", err);
  }
}

export function getLocalWaitlistEntries(): WaitlistRecord[] {
  ensureLocalStorage();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as WaitlistRecord[];
  } catch (err) {
    console.error("[Waitlist Storage] Local read error:", err);
    return [];
  }
}

export async function getAllWaitlistEntries(): Promise<WaitlistRecord[]> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("waitlist_signups")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          email: row.email,
          isAdult: row.is_adult,
          consentGiven: row.consent_given,
          consentTimestamp: row.consent_timestamp,
          consentVersion: row.consent_version || "v1.0",
          createdAt: row.created_at,
          city: row.city || "Jabalpur",
          emailDeliveryStatus: row.email_delivery_status || "unconfigured",
          emailDeliveredAt: row.email_delivered_at || undefined,
          emailError: row.email_error || undefined,
          userAgent: row.user_agent || undefined,
        }));
      }
    } catch (err) {
      console.warn("[Waitlist Storage] Supabase query failed, falling back to local file:", err);
    }
  }

  return getLocalWaitlistEntries();
}

export async function findWaitlistEntryByEmail(
  email: string
): Promise<WaitlistRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("waitlist_signups")
        .select("*")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          email: data.email,
          isAdult: data.is_adult,
          consentGiven: data.consent_given,
          consentTimestamp: data.consent_timestamp,
          consentVersion: data.consent_version || "v1.0",
          createdAt: data.created_at,
          city: data.city || "Jabalpur",
          emailDeliveryStatus: data.email_delivery_status || "unconfigured",
          emailDeliveredAt: data.email_delivered_at || undefined,
          emailError: data.email_error || undefined,
          userAgent: data.user_agent || undefined,
        };
      }
    } catch (err) {
      console.warn("[Waitlist Storage] Supabase find error, checking local store:", err);
    }
  }

  const entries = getLocalWaitlistEntries();
  const found = entries.find((e) => e.email.toLowerCase() === normalizedEmail);
  return found || null;
}

export async function saveWaitlistEntry(entry: {
  email: string;
  isAdult: boolean;
  consentGiven: boolean;
  consentVersion?: string;
  city?: string;
  userAgent?: string;
  ipAddress?: string;
}): Promise<{ record: WaitlistRecord }> {
  const normalizedEmail = entry.email.trim().toLowerCase();
  const consentTimestamp = new Date().toISOString();
  const consentVersion = entry.consentVersion || "v1.0";
  const city = entry.city || "Jabalpur";

  // Check if duplicate exists
  const existing = await findWaitlistEntryByEmail(normalizedEmail);
  if (existing) {
    throw new Error("ALREADY_REGISTERED");
  }

  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("waitlist_signups")
        .insert({
          email: normalizedEmail,
          is_adult: true,
          consent_given: true,
          consent_timestamp: consentTimestamp,
          consent_version: consentVersion,
          city,
          email_delivery_status: "pending",
          user_agent: entry.userAgent,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("ALREADY_REGISTERED");
        }
        console.error("[Waitlist Storage] Supabase insert error:", error);
        throw new Error("STORAGE_WRITE_FAILED");
      }

      return {
        record: {
          id: data.id,
          email: data.email,
          isAdult: data.is_adult,
          consentGiven: data.consent_given,
          consentTimestamp: data.consent_timestamp,
          consentVersion: data.consent_version,
          createdAt: data.created_at,
          city: data.city,
          emailDeliveryStatus: data.email_delivery_status,
          userAgent: data.user_agent,
        },
      };
    } catch (err: any) {
      if (err.message === "ALREADY_REGISTERED") {
        throw err;
      }
      console.warn("[Waitlist Storage] Supabase write failed, falling back to local file:", err);
    }
  }

  // Persistent storage fallback in .data/waitlist.json
  ensureLocalStorage();
  const entries = getLocalWaitlistEntries();

  // Double check duplicates locally
  if (entries.some((e) => e.email.toLowerCase() === normalizedEmail)) {
    throw new Error("ALREADY_REGISTERED");
  }

  const newRecord: WaitlistRecord = {
    id: `vpl_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    email: normalizedEmail,
    isAdult: true,
    consentGiven: true,
    consentTimestamp,
    consentVersion,
    createdAt: new Date().toISOString(),
    city,
    emailDeliveryStatus: "pending",
    userAgent: entry.userAgent,
    ipAddress: entry.ipAddress,
  };

  entries.push(newRecord);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
  } catch (err) {
    console.error("[Waitlist Storage] Local disk write error:", err);
    throw new Error("STORAGE_WRITE_FAILED");
  }

  return { record: newRecord };
}

export async function updateWaitlistEmailStatus(
  recordId: string,
  status: "sent" | "failed" | "unconfigured",
  errorMessage?: string
): Promise<void> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      await supabase
        .from("waitlist_signups")
        .update({
          email_delivery_status: status,
          email_delivered_at: status === "sent" ? new Date().toISOString() : null,
          email_error: errorMessage || null,
        })
        .eq("id", recordId);
      return;
    } catch (err) {
      console.warn("[Waitlist Storage] Failed to update email status in Supabase:", err);
    }
  }

  // Update in local file
  ensureLocalStorage();
  const entries = getLocalWaitlistEntries();
  const record = entries.find((e) => e.id === recordId);
  if (record) {
    record.emailDeliveryStatus = status;
    if (status === "sent") {
      record.emailDeliveredAt = new Date().toISOString();
    }
    if (errorMessage) {
      record.emailError = errorMessage;
    }
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
    } catch (err) {
      console.error("[Waitlist Storage] Failed to persist email status update:", err);
    }
  }
}
