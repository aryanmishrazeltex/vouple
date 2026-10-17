// ==============================================================================
// VOUPLE — SUPABASE EDGE FUNCTION: waitlist-signup
// Deno TypeScript environment for Supabase Edge Runtime
// Validates submissions, enforces adult & consent terms, prevents duplicates,
// persists to PostgreSQL, and triggers transactional confirmation email.
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONSENT_VERSION = "v1.0";

// Basic in-memory rate limiting by IP (per edge instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "METHOD_NOT_ALLOWED", message: "Only POST requests are permitted." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";

    if (clientIp !== "unknown" && isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "RATE_LIMITED",
          message: "Too many signup attempts from your connection. Please try again in a few minutes.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      return new Response(
        JSON.stringify({ success: false, error: "INVALID_BODY", message: "Invalid request payload." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, isAdult, consentGiven } = payload;
    const errors: Record<string, string> = {};

    // 1. Email validation
    if (!email || typeof email !== "string" || !email.trim()) {
      errors.email = "Please provide an email address.";
    } else {
      const normalized = email.trim().toLowerCase();
      if (!EMAIL_REGEX.test(normalized)) {
        errors.email = "Please enter a valid email address.";
      }
    }

    // 2. Adult eligibility verification (18+)
    if (isAdult !== true) {
      errors.isAdult = "You must confirm you are 18 years of age or older.";
    }

    // 3. Explicit consent for launch updates
    if (consentGiven !== true) {
      errors.consentGiven = "You must give explicit consent to receive launch updates.";
    }

    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "VALIDATION_FAILED",
          message: "Please complete all required fields.",
          fieldErrors: errors,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = (email as string).trim().toLowerCase();
    const consentTimestamp = new Date().toISOString();

    // Initialize Supabase admin client using server secrets
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[waitlist-signup] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(
        JSON.stringify({
          success: false,
          error: "CONFIGURATION_ERROR",
          message: "Database connection parameters are not fully configured.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Check for duplicate normalized email
    const { data: existingEntry, error: checkError } = await supabase
      .from("waitlist_signups")
      .select("id, email")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (checkError) {
      console.error("[waitlist-signup] Database check error:", checkError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "DATABASE_ERROR",
          message: "Database query failed. Please try again shortly.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (existingEntry) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "ALREADY_REGISTERED",
          message: "This email address is already on the waitlist.",
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert new waitlist signup
    const insertPayload = {
      email: normalizedEmail,
      is_adult: true,
      consent_given: true,
      consent_timestamp: consentTimestamp,
      consent_version: CONSENT_VERSION,
      city: "Jabalpur",
      email_delivery_status: "pending",
      user_agent: req.headers.get("user-agent") || undefined,
    };

    const { data: insertedRecord, error: insertError } = await supabase
      .from("waitlist_signups")
      .insert(insertPayload)
      .select("id, email, created_at")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        // Unique violation
        return new Response(
          JSON.stringify({
            success: false,
            error: "ALREADY_REGISTERED",
            message: "This email address is already on the waitlist.",
          }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.error("[waitlist-signup] Insert error:", insertError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "INSERT_FAILED",
          message: "Unable to record signup at this moment. Please try again shortly.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Attempt to send transactional confirmation email via Resend
    let emailStatus: "sent" | "failed" | "unconfigured" = "unconfigured";
    let emailErrorMsg: string | undefined = undefined;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const emailFrom = Deno.env.get("EMAIL_FROM") || "Vouple <waitlist@vouple.in>";

    if (resendApiKey) {
      try {
        const emailBody = `Hi,

Thanks for your interest in Vouple.

You're on our waitlist for updates about our planned launch in Jabalpur, India.

We're building a dating experience centred on shared interests and clearly stated relationship intentions.

Vouple is still in development. Joining the waitlist does not create a dating account or guarantee access to the beta.

We'll email you when we have meaningful launch updates, in line with your consent preferences.

Thanks,
Team Vouple

---
Privacy Notice: https://vouple.in/privacy
To withdraw consent or remove yourself from the waitlist, contact privacy@vouple.in`;

        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: emailFrom,
            to: [normalizedEmail],
            subject: "You're on the Vouple waitlist",
            text: emailBody,
          }),
        });

        if (resendResponse.ok) {
          emailStatus = "sent";
          await supabase
            .from("waitlist_signups")
            .update({
              email_delivery_status: "sent",
              email_delivered_at: new Date().toISOString(),
            })
            .eq("id", insertedRecord.id);
        } else {
          emailStatus = "failed";
          const resendError = await resendResponse.text();
          emailErrorMsg = `Resend HTTP ${resendResponse.status}: ${resendError}`;
          console.error("[waitlist-signup] Resend error:", emailErrorMsg);

          await supabase
            .from("waitlist_signups")
            .update({
              email_delivery_status: "failed",
              email_error: emailErrorMsg.substring(0, 500),
            })
            .eq("id", insertedRecord.id);
        }
      } catch (err: any) {
        emailStatus = "failed";
        emailErrorMsg = err?.message || "Unknown email transport error";
        console.error("[waitlist-signup] Email dispatch exception:", err);

        await supabase
          .from("waitlist_signups")
          .update({
            email_delivery_status: "failed",
            email_error: emailErrorMsg.substring(0, 500),
          })
          .eq("id", insertedRecord.id);
      }
    } else {
      // Record unconfigured status in database
      await supabase
        .from("waitlist_signups")
        .update({
          email_delivery_status: "unconfigured",
          email_error: "RESEND_API_KEY environment secret is not configured.",
        })
        .eq("id", insertedRecord.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "You're on the list. Thanks for your interest in Vouple.",
        emailStatus,
        id: insertedRecord.id,
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[waitlist-signup] Unhandled exception:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "INTERNAL_ERROR",
        message: "An unexpected server error occurred. Please try again.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
