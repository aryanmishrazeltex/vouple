# VOUPLE — TEST PLAN & VERIFICATION MATRIX

**Test Suite Coverage:** Unit, Integration, Access Control, Security Edge Cases, Responsive UX  
**Scope:** Vouple MVP (Next.js 14, TypeScript, Dual-Mode Storage Adapter)

---

## 1. Test Categories & Acceptance Criteria

### Test Suite 1: Authentication & Adult Access Gate (18+)
- [ ] **TC-1.1:** Non-verified user accessing `/app/discovery` is intercepted and redirected to `/app/onboarding`.
- [ ] **TC-1.2:** Verification process validates age >= 18; under-18 values are strictly rejected.
- [ ] **TC-1.3:** Suspended or banned accounts receive an explicit status lock with no access to Discovery or Messaging.

### Test Suite 2: Profile Isolation & Privacy
- [ ] **TC-2.1:** Public profile queries exclude `email`, `phone`, `audit_hash`, and private matching preferences.
- [ ] **TC-2.2:** Profile editing prevents setting age < 18 or injecting HTML/scripts into prompts.
- [ ] **TC-2.3:** Pausing account hides the profile from all other users' discovery queues immediately.

### Test Suite 3: Context-First Discovery ("Why You Might Connect")
- [ ] **TC-3.1:** Context explanation displays accurate shared hobbies without fabricating matches.
- [ ] **TC-3.2:** Relationship intent mismatch is surfaced transparently (e.g. "Different timelines").
- [ ] **TC-3.3:** Passed profiles do not reappear in current session.

### Test Suite 4: Matching Logic & Rate Limiting
- [ ] **TC-4.1:** Submitting a Like records a one-way gesture; recipient cannot see the like without reciprocal action.
- [ ] **TC-4.2:** Reciprocal positive like triggers atomic mutual match creation (`matches` record created).
- [ ] **TC-4.3:** "It's a Match!" celebration modal surfaces with direct link to post-match messaging.

### Test Suite 5: Post-Match Messaging & Security
- [ ] **TC-5.1:** Non-matched users cannot send messages or access message threads.
- [ ] **TC-5.2:** Message input enforces non-empty string and maximum length (1,000 chars).
- [ ] **TC-5.3:** New messages update `last_message_at` on the match record.

### Test Suite 6: Safety, Blocking & Moderation Queue
- [ ] **TC-6.1:** Blocking User B immediately hides B from User A's matches and hides A from B's matches.
- [ ] **TC-6.2:** Messaging is instantly frozen if either party blocks the other.
- [ ] **TC-6.3:** Report submission captures category, description, and enters the Admin Moderation Queue.
- [ ] **TC-6.4:** Admin dashboard (`/admin`) allows moderators to Review, Dismiss, Suspend, or Ban accounts.
- [ ] **TC-6.5:** Banned users are logged out and unable to initiate discovery sessions.

---

## 2. Automated Test Script Execution

We maintain automated test verification scripts in `src/tests/` runnable via:
```bash
npm run test # or npx ts-node src/tests/run-all-tests.ts
```

---

## 3. Manual Browser Verification Checklist (Mobile Viewport)
1. Navigate to `/app` on mobile screen simulation (390px x 844px).
2. Complete simulated adult verification on `/app/onboarding`.
3. Swipe through 3 candidate profiles on `/app/discovery`, inspect "Why you might connect" breakdown.
4. Like a profile, trigger mutual match.
5. Open conversation on `/app/messages/[matchId]`, send 3 messages.
6. Trigger Block action from chat menu. Verify chat immediately closes and profile disappears from matches.
7. Open `/admin`, verify report appears in queue, take administrative action.
