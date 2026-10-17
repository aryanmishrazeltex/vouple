# VOUPLE — DATA MODEL SPECIFICATION

**Architecture:** Relational / PostgreSQL (Supabase Compatible) with Dual-Mode Memory/Local Store  
**Privacy Principle:** Strict segregation between Private Account Data and Public Profile Projections.

---

## 1. Schema Diagram & Relationships

```
                     +-----------------------+
                     |         Users         |
                     | (auth.users / private)|
                     +-----------+-----------+
                                 | 1:1
                     +-----------v-----------+
                     |    User Profiles      |
                     |  (Public Projection)  |
                     +-----+-----+-----+-----+
                           |     |     |     |
              +------------+     |     |     +------------+
              | 1:N              | 1:N | 1:N              | 1:N
     +--------v-------+          |     |          +-------v--------+
     |     Likes      |          |     |          |     Blocks     |
     | (sender/recvr) |          |     |          | (blocker/blocked)
     +--------+-------+          |     |          +----------------+
              |                  |     |
              | triggers         |     |
     +--------v-------+          |     |          +----------------+
     | Mutual Matches <----------+     +---------->    Reports     |
     | (user_1/user_2)|                           | (reporter/target)
     +--------+-------+                           +----------------+
              | 1:N
     +--------v-------+
     |    Messages    |
     | (sender/match) |
     +----------------+
```

---

## 2. Table Specifications

### 2.1 `users` (Private Account & Eligibility)
Stores private identity, contact info, and legal age audit details. **Never exposed to other users.**
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('pending_verification', 'active', 'paused', 'suspended', 'banned')),
  is_adult_verified BOOLEAN DEFAULT FALSE,
  adult_verification_timestamp TIMESTAMPTZ,
  adult_verification_method TEXT DEFAULT 'selfie_audit_v1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 `profiles` (Public Dating Projection)
Publicly viewable by other active, verified members during discovery.
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  city TEXT DEFAULT 'Jabalpur' NOT NULL,
  neighborhood TEXT NOT NULL,
  bio TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  intent_timeline TEXT NOT NULL, -- e.g. 'Marriage in 12–18 months', 'Committed relationship'
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
```

### 2.3 `user_preferences` (Private Matching Preferences)
Private to the user. Used strictly by server-side discovery queries.
```sql
CREATE TABLE public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  min_age INTEGER DEFAULT 18 CHECK (min_age >= 18),
  max_age INTEGER DEFAULT 35,
  preferred_intent TEXT[] DEFAULT '{}',
  preferred_neighborhoods TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.4 `likes` (One-Way Gestures)
Stores one-way like and pass actions. Strictly private to the sender.
```sql
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'superlike', 'pass')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id)
);
```

### 2.5 `matches` (Active Mutual Match Sessions)
Created **only when both users have submitted a positive like**.
```sql
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_1_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_2_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_1_id, user_2_id)
);
```

### 2.6 `messages` (Post-Match 1-on-1 Text)
```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(trim(content)) > 0 AND length(content) <= 1000),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.7 `blocks` (Safety Access Control)
```sql
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);
```

### 2.8 `reports` (Moderation Audit & Evidence)
```sql
CREATE TABLE public.reports (
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
```

---

## 3. Context Calculation Contract ("Why you might connect")

The application computes a deterministic context object between User A and User B:
```typescript
interface ConnectionContext {
  sharedHobbies: string[];
  intentMatch: boolean;
  intentSummary: string;
  locationProximity: string;
  suggestedIcebreaker: string;
}
```
* **No black-box AI or fake percentages.**
* Rules:
  - If both share 2+ hobbies: list shared hobbies.
  - If intent matches or has overlap: highlight the mutual horizon.
  - Generates a localized Jabalpur date question (e.g. coffee at Sadar or sunset at Bhedaghat).
