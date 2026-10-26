const path = require("path");
const fs = require("fs");

// Load .env.local
const envPath = path.join(__dirname, "../../.env.local");
let env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
  });
}

const ADMIN_SECRET = env.ADMIN_SECRET_KEY || "vouple-operator-2026";
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} ${details ? `(${details})` : ""}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log("=================================================");
  console.log("   VOUPLE PHASE 2 TEST SUITE: SECURE INVITATIONS  ");
  console.log("=================================================");
  console.log(`Testing against: ${BASE_URL}\n`);

  // Import service directly for isolated testing if server isn't running on BASE_URL
  const {
    createInvitation,
    validateInvitation,
    redeemInvitationAtomically,
    revokeInvitation,
    listAllInvitations,
    generateSecureInvitationCode,
    hashInvitationCode,
  } = require("../lib/invitation-service");

  // 1. Code Generation & Cryptographic Uniqueness Test
  console.log("[1] Testing Cryptographic Code Generation & Uniqueness");
  const code1 = generateSecureInvitationCode();
  const code2 = generateSecureInvitationCode();
  assert(code1.startsWith("VPL-"), "Code 1 starts with VPL- prefix", code1);
  assert(code2.startsWith("VPL-"), "Code 2 starts with VPL- prefix", code2);
  assert(code1 !== code2, "Codes are unique and not static", `${code1} vs ${code2}`);
  assert(code1.length === 16, "Code matches format VPL-XXXX-XXXX-XXXX", code1);

  // 2. Hash computation
  console.log("\n[2] Testing SHA-256 Code Hashing");
  const hash1 = hashInvitationCode(code1);
  const hash2 = hashInvitationCode(code1.toLowerCase()); // Case-insensitive normalization
  assert(hash1.length === 64, "SHA-256 hash length is 64 hex characters", hash1);
  assert(hash1 === hash2, "Hashing normalizes case insensitively");

  // 3. Issue Single-Use Invitation
  console.log("\n[3] Testing Invitation Issuance & Email Binding");
  const testEmail1 = `applicant.phase2.${Date.now()}@vouple.in`;
  const inv1 = await createInvitation({
    email: testEmail1,
    expiresInHours: 48,
  });
  assert(inv1.email === testEmail1, "Invitation is strictly bound to applicant email", inv1.email);
  assert(inv1.status === "unused", "Initial status is 'unused'", inv1.status);
  assert(Boolean(inv1.code), "Plaintext code returned to operator upon generation", inv1.code);

  // 4. Validate without consuming
  console.log("\n[4] Testing Validation Without Consuming");
  const valCheck1 = await validateInvitation(inv1.code, testEmail1);
  assert(valCheck1.valid === true, "Validation succeeds for correct code & email");
  const listAfterVal = await listAllInvitations();
  const foundAfterVal = listAfterVal.find((i) => i.id === inv1.id);
  assert(foundAfterVal.status === "unused", "Status remains 'unused' after validation check (not consumed!)");

  // 5. Wrong-Email Attempt
  console.log("\n[5] Testing Wrong-Email Rejection");
  const wrongEmailVal = await validateInvitation(inv1.code, "attacker@imposter.com");
  assert(wrongEmailVal.valid === false, "Wrong email attempt is rejected");
  assert(wrongEmailVal.errorCode === "EMAIL_MISMATCH", "Returns EMAIL_MISMATCH error code", wrongEmailVal.errorCode);

  // 6. Invalid / Fake Code Attempt
  console.log("\n[6] Testing Invalid / Fake Code Rejection");
  const fakeCodeVal = await validateInvitation("VPL-FAKE-CODE-1234", testEmail1);
  assert(fakeCodeVal.valid === false, "Fake code is rejected");
  assert(fakeCodeVal.errorCode === "INVITATION_NOT_FOUND", "Returns INVITATION_NOT_FOUND error code");

  // 7. Atomic Redemption & Race Condition / Concurrent Redemption Test
  console.log("\n[7] Testing Atomic Single-Use Redemption & Concurrency");
  const userIdA = "user_concurrent_winner";
  const userIdB = "user_concurrent_loser";

  // Fire two redemption requests at the exact same millisecond
  const [redeemResultA, redeemResultB] = await Promise.all([
    redeemInvitationAtomically(inv1.code, testEmail1, userIdA),
    redeemInvitationAtomically(inv1.code, testEmail1, userIdB),
  ]);

  const successCount = [redeemResultA.success, redeemResultB.success].filter(Boolean).length;
  assert(successCount === 1, "Exactly ONE concurrent redemption succeeded", `Successes: ${successCount}`);

  const failureResult = redeemResultA.success ? redeemResultB : redeemResultA;
  assert(failureResult.success === false, "Concurrent duplicate request was rejected");
  assert(
    failureResult.errorCode === "ALREADY_REDEEMED",
    "Rejected with ALREADY_REDEEMED error code",
    failureResult.errorCode
  );

  // 8. Already-Redeemed Retry Attempt
  console.log("\n[8] Testing Already-Redeemed Rejection");
  const retryVal = await validateInvitation(inv1.code, testEmail1);
  assert(retryVal.valid === false, "Subsequent validation fails");
  assert(retryVal.errorCode === "ALREADY_REDEEMED", "Returns ALREADY_REDEEMED on used code");

  // 9. Revoke Invitation Test
  console.log("\n[9] Testing Admin Revocation of Unused Invitation");
  const testEmail2 = `revoke.target.${Date.now()}@vouple.in`;
  const inv2 = await createInvitation({
    email: testEmail2,
    expiresInHours: 72,
  });
  assert(inv2.status === "unused", "Created second invitation for revocation test");

  const revokeResult = await revokeInvitation(inv2.id);
  assert(revokeResult.success === true, "Admin successfully revoked unused invitation");

  const revokedVal = await validateInvitation(inv2.code, testEmail2);
  assert(revokedVal.valid === false, "Validation fails for revoked code");
  assert(revokedVal.errorCode === "INVITATION_REVOKED", "Returns INVITATION_REVOKED error code");

  const revokedRedeem = await redeemInvitationAtomically(inv2.code, testEmail2, "user_revoked_try");
  assert(revokedRedeem.success === false, "Redemption fails for revoked code");
  assert(revokedRedeem.errorCode === "INVITATION_REVOKED", "Redemption blocked with INVITATION_REVOKED");

  // 10. Expired Invitation Test
  console.log("\n[10] Testing Expired Invitation Rejection");
  const testEmail3 = `expired.applicant.${Date.now()}@vouple.in`;
  const inv3 = await createInvitation({
    email: testEmail3,
    expiresInHours: -1, // Expired 1 hour ago
  });

  const expiredVal = await validateInvitation(inv3.code, testEmail3);
  assert(expiredVal.valid === false, "Validation fails for expired code");
  assert(expiredVal.errorCode === "INVITATION_EXPIRED", "Returns INVITATION_EXPIRED error code");

  const expiredRedeem = await redeemInvitationAtomically(inv3.code, testEmail3, "user_expired_try");
  assert(expiredRedeem.success === false, "Redemption fails for expired code");
  assert(expiredRedeem.errorCode === "INVITATION_EXPIRED", "Redemption blocked with INVITATION_EXPIRED");

  // 11. Cannot Revoke Already-Redeemed Invitation
  console.log("\n[11] Testing Cannot Revoke Already Redeemed Invitation");
  const cantRevokeUsed = await revokeInvitation(inv1.id);
  assert(cantRevokeUsed.success === false, "Cannot revoke an already redeemed invitation");

  console.log("\n=================================================");
  console.log(`TEST SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log("=================================================\n");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner threw an unhandled error:", err);
  process.exit(1);
});
