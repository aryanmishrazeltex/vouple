-- ==============================================================================
-- VOUPLE DATING MVP — SUPABASE PRODUCTION SCHEMA & ROW LEVEL SECURITY (RLS)
-- Target: PostgreSQL 15+ (Supabase Free Tier Compatible)
-- Market: Jabalpur, India (18+ Adult-Only Context-First Dating)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS (Private Account & Eligibility)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('pending_verification', 'active', 'paused', 'suspended', 'banned')),
  is_adult_verified BOOLEAN DEFAULT FALSE,
  adult_verification_timestamp TIMESTAMPTZ,
  adult_verification_method TEXT DEFAULT 'prototype_audit_v1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES (Public Dating Projection)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  city TEXT DEFAULT 'Jabalpur' NOT NULL,
  neighborhood TEXT NOT NULL,
  bio TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  intent_timeline TEXT NOT NULL,
  prompt_question TEXT NOT NULL,
  prompt_answer TEXT NOT NULL,
  hobbies TEXT[] DEFAULT '{}',
  height TEXT,
  zodiac TEXT,
  drinking TEXT,
  smoking TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER PREFERENCES (Private Matching Preferences)
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  min_age INTEGER DEFAULT 18 CHECK (min_age >= 18),
  max_age INTEGER DEFAULT 35,
  preferred_intent TEXT[] DEFAULT '{}',
  preferred_neighborhoods TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LIKES (One-Way Gestures)
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'superlike', 'pass')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id)
);

-- 6. MATCHES (Active Mutual Match Sessions)
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_1_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_2_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_1_id, user_2_id)
);

-- 7. MESSAGES (Post-Match 1-on-1 Text)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(trim(content)) > 0 AND length(content) <= 1000),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BLOCKS (Safety Barrier)
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- 9. REPORTS (Safety Moderation Queue)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'harassment', 'underage_concern', 'impersonation_fake', 'spam', 'inappropriate_content', 'other'
  )),
  details TEXT NOT NULL CHECK (length(details) <= 2000),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved_dismissed', 'resolved_action_taken')),
  resolution_action TEXT CHECK (resolution_action IN ('none', 'warning_issued', 'suspended', 'banned')),
  moderator_id UUID REFERENCES public.users(id),
  moderator_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ==============================================================================
-- AUTOMATIC MUTUAL MATCH TRIGGER FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_mutual_match()
RETURNS TRIGGER AS $$
DECLARE
  reciprocal_like RECORD;
  u1 UUID;
  u2 UUID;
BEGIN
  -- Only evaluate positive likes
  IF NEW.action IN ('like', 'superlike') THEN
    SELECT * INTO reciprocal_like FROM public.likes
    WHERE sender_id = NEW.receiver_id 
      AND receiver_id = NEW.sender_id 
      AND action IN ('like', 'superlike');

    IF FOUND THEN
      -- Order user IDs consistently to satisfy UNIQUE(user_1_id, user_2_id)
      IF NEW.sender_id < NEW.receiver_id THEN
        u1 := NEW.sender_id;
        u2 := NEW.receiver_id;
      ELSE
        u1 := NEW.receiver_id;
        u2 := NEW.sender_id;
      END IF;

      INSERT INTO public.matches (user_1_id, user_2_id)
      VALUES (u1, u2)
      ON CONFLICT (user_1_id, user_2_id) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_like_created ON public.likes;
CREATE TRIGGER on_like_created
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_mutual_match();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 1. Users policies
CREATE POLICY users_read_own ON public.users FOR SELECT USING (auth.uid() = id);

-- 2. Profiles policies: Active adults see active, unblocked profiles
CREATE POLICY profiles_read_discovery ON public.profiles FOR SELECT USING (
  is_active = TRUE
  AND id != auth.uid()
  AND NOT EXISTS (
    SELECT 1 FROM public.blocks 
    WHERE (blocker_id = auth.uid() AND blocked_id = profiles.id)
       OR (blocker_id = profiles.id AND blocked_id = auth.uid())
  )
);
CREATE POLICY profiles_write_own ON public.profiles FOR ALL USING (auth.uid() = id);

-- 3. Likes policies
CREATE POLICY likes_read_own ON public.likes FOR SELECT USING (auth.uid() = sender_id);
CREATE POLICY likes_insert_own ON public.likes FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 4. Matches policies
CREATE POLICY matches_read_participants ON public.matches FOR SELECT USING (
  auth.uid() = user_1_id OR auth.uid() = user_2_id
);

-- 5. Messages policies
CREATE POLICY messages_read_match ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    WHERE m.id = messages.match_id
      AND m.is_active = TRUE
      AND (m.user_1_id = auth.uid() OR m.user_2_id = auth.uid())
  )
);
CREATE POLICY messages_send_match ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.matches m
    WHERE m.id = messages.match_id
      AND m.is_active = TRUE
      AND (m.user_1_id = auth.uid() OR m.user_2_id = auth.uid())
  )
);

-- 6. Blocks policies
CREATE POLICY blocks_read_own ON public.blocks FOR SELECT USING (auth.uid() = blocker_id);
CREATE POLICY blocks_insert_own ON public.blocks FOR INSERT WITH CHECK (auth.uid() = blocker_id);

-- 7. Reports policies: Members submit; only moderators read
CREATE POLICY reports_insert_own ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY reports_read_moderators ON public.reports FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('moderator', 'admin')
  )
);

-- ==============================================================================
-- 10. WAITLIST SIGNUPS (Private Demand Validation & Cohort 001 Access)
-- ==============================================================================
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

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist_signups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_delivery_status ON public.waitlist_signups(email_delivery_status);

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny public select on waitlist"
  ON public.waitlist_signups
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Service role full management"
  ON public.waitlist_signups
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

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

