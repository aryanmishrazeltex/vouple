# VOUPLE — PRODUCT SPECIFICATION (MVP)

**Version:** 1.0.0 (MVP)  
**Target Market:** Jabalpur, Madhya Pradesh, India  
**Target Demographic:** Adults aged 18+ seeking intentional, context-rich relationships  
**Brand Line:** *"Every introduction should have a reason."*  
**Budget Constraint:** ₹0 (Zero rupees) — 100% Free Tiers (Vercel, Supabase Free Tier)

---

## 1. Executive Summary & Positioning Hypothesis

Traditional consumer dating platforms (Tinder, Bumble) suffer from severe fatigue in Tier-2 Indian cities like Jabalpur:
1. **The 'Hey' Epidemic:** 85%+ of matches never start a conversation, or stall after a dry "Hey".
2. **Intent Mismatch:** One person is seeking marriage within 12 months; the other is casually exploring. Both waste weeks figuring it out.
3. **Low Trust & Safety:** Catfish profiles, bots, lack of age verification, and fear of harassment (especially for women).
4. **Geographic Irrelevance:** Being shown profiles 400km away across Madhya Pradesh instead of trusted local neighborhoods.

### The Vouple Solution: "Context-First Dating"
* **"Why you might connect" (Signature Experience):** Before swiping, users see an explicit, transparent breakdown of shared lifestyles, common Jabalpur spots, and compatible relationship timelines.
* **Curated Intentionality:** Every profile explicitly declares their timeline (e.g. *Marriage in 12–18 months*, *Committed Partnership*, *Intentional Dating*).
* **Local Trust Engine:** Verified 18+ cohort, localized date spots (Wright Town, Civil Lines, Bhedaghat), private in-app communication.

---

## 2. User Personas

### Persona A: Riya (24, UI Designer, Wright Town, Jabalpur)
* **Goal:** Wants to meet an ambitious, respectful creative who lives in Jabalpur and values deep conversations.
* **Frustration:** Tired of creepy unsolicited Instagram DMs and Tinder matches who don't reply or expect instant phone numbers.
* **Vouple Need:** High safety, private chat without revealing phone number, verified 18+ identity, prompt-based icebreakers.

### Persona B: Kabir (26, Remote Systems Engineer, Civil Lines, Jabalpur)
* **Goal:** Looking for a serious long-term relationship leading towards marriage in the next 1–2 years.
* **Frustration:** Matrimony sites are too conservative and family-dominated; swipe apps are too frivolous.
* **Vouple Need:** Upfront intent timeline transparency, mutual lifestyle overlap (cycling, coffee, reading), authentic profiles.

---

## 3. Core Feature Set (MVP Scope)

| Feature | Scope in MVP | Deferred to Post-Pilot |
| :--- | :--- | :--- |
| **Public Landing & Waitlist** | High-energy Tinder/Bumble vibe landing page with instant local waitlist | Advanced referral loop |
| **Adult Age Gating (18+)** | Prototype verification outcome gate + audit trail | Digilocker / Aadhaar API (cost prohibitive at ₹0) |
| **Profile Creation** | 3:4 portrait photos, intent timeline, 3 prompts, Jabalpur neighborhood, hobbies | Video prompts, audio voice notes |
| **Discovery Deck** | "Why you might connect" contextual card, Like/Pass with daily limits | Unlimited rewinds, travel passport mode |
| **Mutual Matching** | Server-validated two-way likes generating an active match session | Algorithmic predictive scoring |
| **Text Messaging** | 1-on-1 text chat between active mutual matches only | Image/voice attachments, video calling |
| **Safety & Moderation** | Instant block, 6-category report form, account pause, account deletion | Automated computer vision image scanning |
| **Admin Dashboard** | Role-restricted report queue, evidence view, suspend/ban/restore actions | Multi-tenant moderation permissions |

---

## 4. Key User Journeys

### Journey 1: Adult Onboarding & Profile Setup
1. User enters application at `/app/onboarding`.
2. Adult Verification Check: Confirms 18+ eligibility and safety code of conduct.
3. Profile setup: Display name, age, neighborhood (Civil Lines, Wright Town, Napier Town, etc.), relationship timeline, 3 prompt answers, and profile photos.
4. User enters Discovery.

### Journey 2: Discovery & "Why You Might Connect"
1. User browses curated candidate profiles in Jabalpur.
2. Card highlights **"Why You Might Connect"**:
   - Shared Interest overlap (e.g. *Both enjoy Filter Coffee & Indie Music*)
   - Intent Compatibility (e.g. *Both seeking committed partnership within 1–2 years*)
   - Suggested Icebreaker (e.g. *"Ask about their favorite Sunday routine at Sadar"*)
3. User chooses **Like** or **Pass**.
4. If mutual like occurs, an **"It's a Match!"** state is created.

### Journey 3: Mutual Match Messaging
1. User navigates to `/app/matches`.
2. Active matches are listed with shared context reminder.
3. User taps into conversation thread at `/app/messages/[matchId]`.
4. Sender can send messages complying with length and rate constraints.
5. If either user blocks the other, conversation is immediately frozen and removed from discovery.

### Journey 4: Safety, Reporting & Admin Moderation
1. If a user encounters inappropriate behavior, they tap **Report & Block** on the profile or chat.
2. Selects category: *Harassment*, *Underage Concern*, *Impersonation/Fake*, *Spam*, *Inappropriate Content*, *Other*.
3. Account is immediately blocked locally and server-side.
4. Report enters the `/admin` moderation queue.
5. Authorized admin reviews report evidence and can **Dismiss**, **Warn**, **Suspend**, or **Ban** the offender.

---

## 5. Non-Functional Requirements
* **Mobile-First Responsive Design:** Optimized for 360px–430px viewports (standard smartphone screens) and desktop.
* **Latency:** Local state transitions < 100ms; messaging interactions responsive without layout shifts.
* **Zero External Paid SaaS:** Operable entirely within free tiers.
