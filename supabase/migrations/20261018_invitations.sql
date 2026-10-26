-- Vouple Phase 2: Invitations & Redemption Tracking Migration
-- Execute this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/bamqbppidwlqptwfghah/sql/new

-- 1. Create Invitations Table
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    code_hash TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'unused' CHECK (status IN ('unused', 'redeemed', 'expired', 'revoked')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    redeemed_at TIMESTAMPTZ,
    redeemed_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    revoked_at TIMESTAMPTZ,
    waitlist_signup_id TEXT
);

-- 2. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_invitations_code_hash ON public.invitations (code_hash);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations (status);

-- 3. Row Level Security (RLS) - Principle of Least Privilege
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Deny all direct public/anonymous operations
-- Service Role key bypasses RLS and handles administrative operations on the server side.

-- Authenticated users may only view their own redeemed invitation record
DROP POLICY IF EXISTS "Members can view their own redeemed invitation" ON public.invitations;
CREATE POLICY "Members can view their own redeemed invitation"
    ON public.invitations
    FOR SELECT
    TO authenticated
    USING (auth.uid() = redeemed_by_user_id);

-- 4. Atomic Invitation Redemption Function (guards against concurrency/race conditions)
CREATE OR REPLACE FUNCTION public.redeem_invitation(
    p_code_hash TEXT,
    p_email TEXT,
    p_user_id UUID
) RETURNS TABLE (
    success BOOLEAN,
    error_code TEXT,
    invitation_id UUID
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_inv RECORD;
BEGIN
    -- Acquire exclusive row-level lock
    SELECT * INTO v_inv
    FROM public.invitations
    WHERE code_hash = p_code_hash
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'INVITATION_NOT_FOUND', NULL::UUID;
        RETURN;
    END IF;

    IF LOWER(v_inv.email) <> LOWER(p_email) THEN
        RETURN QUERY SELECT FALSE, 'EMAIL_MISMATCH', v_inv.id;
        RETURN;
    END IF;

    IF v_inv.status = 'revoked' THEN
        RETURN QUERY SELECT FALSE, 'INVITATION_REVOKED', v_inv.id;
        RETURN;
    END IF;

    IF v_inv.status = 'redeemed' THEN
        RETURN QUERY SELECT FALSE, 'ALREADY_REDEEMED', v_inv.id;
        RETURN;
    END IF;

    IF v_inv.expires_at < timezone('utc'::text, now()) THEN
        UPDATE public.invitations
        SET status = 'expired'
        WHERE id = v_inv.id;

        RETURN QUERY SELECT FALSE, 'INVITATION_EXPIRED', v_inv.id;
        RETURN;
    END IF;

    -- Atomically consume the single-use invitation
    UPDATE public.invitations
    SET status = 'redeemed',
        redeemed_at = timezone('utc'::text, now()),
        redeemed_by_user_id = p_user_id
    WHERE id = v_inv.id;

    RETURN QUERY SELECT TRUE, NULL::TEXT, v_inv.id;
END;
$$;
