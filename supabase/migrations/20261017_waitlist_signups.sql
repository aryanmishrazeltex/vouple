-- ==============================================================================
-- VOUPLE — WAITLIST SIGNUPS SCHEMA & ROW LEVEL SECURITY (RLS)
-- Migration: 20261017_waitlist_signups.sql
-- Purpose: Secure, privacy-first storage for Vouple Phase 1 waitlist signups
-- Target Market: Jabalpur, Madhya Pradesh, India (18+ Adults Only)
-- ==============================================================================

-- 1. WAITLIST SIGNUPS TABLE
CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_adult BOOLEAN NOT NULL DEFAULT FALSE CHECK (is_adult = TRUE),
  consent_given BOOLEAN NOT NULL DEFAULT FALSE CHECK (consent_given = TRUE),
  consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  consent_version TEXT NOT NULL DEFAULT 'v1.0',
  city TEXT DEFAULT 'Jabalpur' NOT NULL,
  email_delivery_status TEXT DEFAULT 'pending' CHECK (email_delivery_status IN ('pending', 'sent', 'failed', 'unconfigured')),
  email_delivered_at TIMESTAMPTZ,
  email_error TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. PERFORMANCE & SECURITY INDEXES
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist_signups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_delivery_status ON public.waitlist_signups(email_delivery_status);

-- 3. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.set_waitlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_waitlist_updated_at ON public.waitlist_signups;
CREATE TRIGGER trigger_set_waitlist_updated_at
  BEFORE UPDATE ON public.waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.set_waitlist_updated_at();

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Zero-Trust: Public visitors must NEVER be able to read the waitlist or retrieve email addresses.
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- 4.1 DENY ALL PUBLIC/ANONYMOUS READS
-- Explicitly deny SELECT queries from unauthenticated public visitors
DROP POLICY IF EXISTS "Deny public select on waitlist" ON public.waitlist_signups;
CREATE POLICY "Deny public select on waitlist"
  ON public.waitlist_signups
  FOR SELECT
  TO anon, authenticated
  USING (
    -- Only authorized operators with admin or moderator role can read
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'moderator')
    )
  );

-- 4.2 SERVICE ROLE HAS FULL ACCESS
-- Used by Supabase Edge Functions and secure server-side API routes
DROP POLICY IF EXISTS "Service role full management" ON public.waitlist_signups;
CREATE POLICY "Service role full management"
  ON public.waitlist_signups
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4.3 CONTROLLED PUBLIC INSERTS WITH STRICT VALIDATION
-- Direct inserts must fulfill adult confirmation and consent terms
DROP POLICY IF EXISTS "Public insert with adult consent" ON public.waitlist_signups;
CREATE POLICY "Public insert with adult consent"
  ON public.waitlist_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    is_adult = TRUE
    AND consent_given = TRUE
    AND length(trim(email)) > 3
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );
