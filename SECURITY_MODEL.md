# VOUPLE — SECURITY MODEL & ACCESS CONTROL

**Standard:** Zero-Trust Privacy, Defense-in-Depth, Row-Level Security (RLS)  
**Regulatory Baseline:** Adult Only (18+ Mandatory), Data Minimization Principle.

---

## 1. Threat Model & Mitigations

| Threat | Attack Vector | Vouple Architectural Mitigation |
| :--- | :--- | :--- |
| **Underage User Access** | Falsified self-declared birthdate | Mandatory adult verification gate. Users without `is_adult_verified = true` are blocked from Discovery and Messaging at database/API level. |
| **Profile Scraping / Harvest** | Automated crawler querying `/api/profiles` | Profiles are only accessible through authenticated sessions. Discovery is rate-limited (max 30 profiles/day per user in Jabalpur cohort). Email, phone, and audit data are excluded from query projections. |
| **Ghost Messaging / Harassment** | Attacker crafting direct message API payload to un-matched user | Messages table enforces foreign key check against active `matches`. Server verifies both `user_1_id` or `user_2_id = auth.uid()` AND `is_active = true` AND no active `blocks`. |
| **Unilateral Match Forgery** | Malicious client inventing a mutual match | Client cannot insert into `matches`. Matches are only created by trusted server-side trigger when two reciprocal positive records exist in `likes`. |
| **Privilege Escalation** | Client modifying `role = 'admin'` | Client can never write to `users.role`. Moderation endpoints verify JWT claims signed by server secret. |
| **Post-Block Stalking** | Blocked user continuing to read updates | `blocks` table creates a bidirectional read-barrier in discovery and messaging queries. |

---

## 2. Row Level Security (RLS) Policy Blueprint (PostgreSQL)

### 2.1 `users` Table RLS
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- User can only read their own private account data
CREATE POLICY users_read_own ON public.users
  FOR SELECT USING (auth.uid() = id);

-- User can update limited personal settings (cannot change role or verified status)
CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.users WHERE id = auth.uid())
    AND is_adult_verified = (SELECT is_adult_verified FROM public.users WHERE id = auth.uid())
  );
```

### 2.2 `profiles` Table RLS
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Active, verified adults can view other active profiles (excluding blocked users)
CREATE POLICY profiles_read_discovery ON public.profiles
  FOR SELECT USING (
    is_active = TRUE
    AND id != auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM public.blocks 
      WHERE (blocker_id = auth.uid() AND blocked_id = profiles.id)
         OR (blocker_id = profiles.id AND blocked_id = auth.uid())
    )
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_adult_verified = TRUE AND status = 'active'
    )
  );

-- User can edit only their own profile
CREATE POLICY profiles_write_own ON public.profiles
  FOR ALL USING (auth.uid() = id);
```

### 2.3 `likes` Table RLS
```sql
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- User can only view likes they have sent (cannot read who liked them without mutual match)
CREATE POLICY likes_read_own ON public.likes
  FOR SELECT USING (auth.uid() = sender_id);

-- User can only submit likes as themselves
CREATE POLICY likes_insert_own ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
```

### 2.4 `messages` Table RLS
```sql
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- User can only read messages in active matches where they are a participant
CREATE POLICY messages_read_match ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      WHERE m.id = messages.match_id
        AND m.is_active = TRUE
        AND (m.user_1_id = auth.uid() OR m.user_2_id = auth.uid())
        AND NOT EXISTS (
          SELECT 1 FROM public.blocks b
          WHERE (b.blocker_id = m.user_1_id AND b.blocked_id = m.user_2_id)
             OR (b.blocker_id = m.user_2_id AND b.blocked_id = m.user_1_id)
        )
    )
  );

-- User can only send messages into matches they belong to
CREATE POLICY messages_send_match ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.matches m
      WHERE m.id = messages.match_id
        AND m.is_active = TRUE
        AND (m.user_1_id = auth.uid() OR m.user_2_id = auth.uid())
    )
  );
```

---

## 3. Adult Verification Standard (18+)

1. **Self-Declaration is Insufficient:** Simple birthdate inputs are easily bypassed.
2. **Phase 1-2 Prototype Standard:** An explicit verification simulation recording:
   - Audit timestamp
   - Cryptographic confirmation receipt (`vpl_adult_hash`)
   - Mandatory affirmation under Indian Digital Personal Data Protection (DPDP) Act rules.
3. **Phase 3 Production Standard:** Integration with zero-storage identity proofs (e.g. Digilocker verifiable credential or liveness selfie audit). No raw ID photos stored on unencrypted public buckets.

---

## 4. Role-Based Access Control (RBAC) Matrix

| Operation | Member | Verified Adult | Moderator | Admin |
| :--- | :---: | :---: | :---: | :---: |
| View Public Landing Page | ✅ | ✅ | ✅ | ✅ |
| Join Waitlist | ✅ | ✅ | ✅ | ✅ |
| Access Discovery Deck | ❌ | ✅ | ✅ | ✅ |
| Submit Like / Pass | ❌ | ✅ | ✅ | ✅ |
| Send Messages in Match | ❌ | ✅ | ✅ | ✅ |
| Block User | ❌ | ✅ | ✅ | ✅ |
| Report User | ❌ | ✅ | ✅ | ✅ |
| View Moderation Queue | ❌ | ❌ | ✅ | ✅ |
| Suspend / Ban Account | ❌ | ❌ | ❌ | ✅ |
