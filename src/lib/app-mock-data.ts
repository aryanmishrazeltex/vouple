import { UserAccount, UserProfile, ConnectionContext } from "@/types/app";

/**
 * DEVELOPMENT FIXTURE DATA NOTICE:
 * All accounts and profiles below are strictly fictional test personas created
 * for local development and QA validation of the Vouple MVP.
 * They are not real people and will never be seeded into production datasets.
 */

export const DEV_CURRENT_USER: UserAccount = {
  id: "usr_dev_tester",
  email: "tester.jabalpur@vouple.test",
  role: "admin", // Allows testing both member features and /admin moderation
  status: "active",
  isAdultVerified: true,
  adultVerificationTimestamp: new Date().toISOString(),
  adultVerificationMethod: "prototype_audit_v1",
  createdAt: "2026-10-10T10:00:00Z",
  updatedAt: "2026-10-14T10:00:00Z",
};

export const DEV_CURRENT_PROFILE: UserProfile = {
  id: "usr_dev_tester",
  displayName: "Aarav Sharma",
  age: 25,
  city: "Jabalpur",
  neighborhood: "Civil Lines",
  bio: "Software developer by day, avid cyclist and filter coffee brewer by evening. Looking for someone genuine to explore quiet corners of Jabalpur with.",
  photos: [
    "/images/kabir.jpg"
  ],
  intentTimeline: "Intentional dating → Long-term partnership",
  promptQuestion: "A perfect Jabalpur Sunday looks like...",
  promptAnswer: "Early morning cycling ride towards Bhedaghat, reading Haruki Murakami by the river, and evening chai at Sadar.",
  hobbies: ["Filter Coffee", "Road Cycling", "Indie Music", "Photography"],
  height: "5' 11\"",
  zodiac: "Taurus",
  drinking: "Socially",
  smoking: "No",
  isVerified: true,
  isActive: true,
  createdAt: "2026-10-10T10:00:00Z",
  updatedAt: "2026-10-14T10:00:00Z",
};

export const DEV_FICTIONAL_PROFILES: UserProfile[] = [
  {
    id: "usr_mock_riya",
    displayName: "Riya Sen [Dev Persona]",
    age: 23,
    city: "Jabalpur",
    neighborhood: "Wright Town",
    bio: "Product designer, cafe hopper, and analog photography enthusiast. Always up for spontaneous drives to Bhedaghat.",
    photos: ["/images/riya.jpg"],
    intentTimeline: "Looking for something real & intentional",
    promptQuestion: "The quickest way to win me over is...",
    promptAnswer: "Knowing a quiet coffee spot in Wright Town where we can actually talk about music, art, and life without shouting.",
    hobbies: ["Filter Coffee", "Indie Music", "Art & Coffee", "Photography"],
    height: "5' 5\"",
    zodiac: "Libra",
    drinking: "Socially",
    smoking: "No",
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-11T12:00:00Z",
    updatedAt: "2026-10-14T12:00:00Z",
  },
  {
    id: "usr_mock_ananya",
    displayName: "Ananya Dubey [Dev Persona]",
    age: 24,
    city: "Jabalpur",
    neighborhood: "Napier Town",
    bio: "Heritage architect exploring colonial history across Madhya Pradesh. Melts over stray animals and old classic ghazals.",
    photos: ["/images/ananya.jpg"],
    intentTimeline: "Committed relationship within 1–2 years",
    promptQuestion: "My friends would roast me for...",
    promptAnswer: "Stopping to take photos of antique doorway carvings every 2 minutes and knowing every lyric of Jagjit Singh.",
    hobbies: ["Heritage Walks", "Book Clubs", "Classical Music", "Badminton"],
    height: "5' 6\"",
    zodiac: "Cancer",
    drinking: "Non-drinker",
    smoking: "No",
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-12T14:00:00Z",
    updatedAt: "2026-10-14T14:00:00Z",
  },
  {
    id: "usr_mock_kabir",
    displayName: "Kabir Verma [Dev Persona]",
    age: 26,
    city: "Jabalpur",
    neighborhood: "South Civil Lines",
    bio: "Working remote for fintech. Weekend trekker and classical guitar amateur.",
    photos: ["/images/kabir.jpg"],
    intentTimeline: "Marriage in 12–18 months",
    promptQuestion: "My absolute non-negotiable is...",
    promptAnswer: "Emotional honesty over polite silence, loving animals, and kindness to service staff.",
    hobbies: ["Road Cycling", "Trekking", "Filter Coffee", "Acoustic Guitar"],
    height: "6' 0\"",
    zodiac: "Aries",
    drinking: "Socially",
    smoking: "No",
    isVerified: true,
    isActive: true,
    createdAt: "2026-10-13T09:00:00Z",
    updatedAt: "2026-10-14T09:00:00Z",
  }
];

/**
 * Deterministic Context Computation ("Why you might connect")
 */
export function calculateConnectionContext(
  currentUser: UserProfile,
  candidate: UserProfile
): ConnectionContext {
  const sharedHobbies = candidate.hobbies.filter((h) =>
    currentUser.hobbies.includes(h)
  );

  const intentMatch =
    currentUser.intentTimeline === candidate.intentTimeline ||
    (currentUser.intentTimeline.includes("Committed") && candidate.intentTimeline.includes("Marriage")) ||
    (currentUser.intentTimeline.includes("Intentional") && candidate.intentTimeline.includes("real"));

  let intentSummary = "Both are aligned on dating with purpose rather than endless swiping.";
  if (intentMatch) {
    intentSummary = `Both prioritize: ${candidate.intentTimeline}`;
  }

  const locationProximity = `${candidate.neighborhood}, Jabalpur (~3-5 km away)`;

  let suggestedIcebreaker = `Ask ${candidate.displayName.split(" ")[0]} about their favorite coffee place in ${candidate.neighborhood}.`;
  if (sharedHobbies.includes("Filter Coffee")) {
    suggestedIcebreaker = `Ask ${candidate.displayName.split(" ")[0]}: "Where do you get the best morning brew in Jabalpur?"`;
  } else if (sharedHobbies.includes("Road Cycling") || sharedHobbies.includes("Trekking")) {
    suggestedIcebreaker = `Ask: "Have you ever done the early morning sunrise ride towards Bhedaghat?"`;
  } else if (sharedHobbies.includes("Indie Music") || sharedHobbies.includes("Classical Music")) {
    suggestedIcebreaker = `Ask: "What 90s track are you listening to on repeat right now?"`;
  }

  return {
    sharedHobbies,
    intentMatch,
    intentSummary,
    locationProximity,
    suggestedIcebreaker,
  };
}
