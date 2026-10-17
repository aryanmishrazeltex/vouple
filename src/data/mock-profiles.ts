import { Profile } from "@/types/profile";

export const MOCK_PROFILES: Profile[] = [
  {
    id: "p1",
    name: "Riya Sharma",
    age: 23,
    profession: "Product Designer & Cafe Hopping",
    college: "Design School, Jabalpur",
    city: "Jabalpur",
    neighborhood: "Wright Town",
    intent_timeline: "Looking for something real & intentional",
    prompt_question: "A perfect Jabalpur Sunday for us looks like...",
    prompt_answer: "Morning flat white at Wright Town, afternoon thrift hunting, and golden hour boat ride at Bhedaghat talking about life and 90s rock.",
    photos: [
      "/images/riya.jpg"
    ],
    is_verified: true,
    bio: "Obsessed with cozy coffee spots, handwritten notes, and spontaneous late-night chai drives. Swipe right if you can make me laugh with dry humor.",
    hobbies: ["Art & Coffee", "Indie Rock", "Photography", "Pottery"],
    height: "5' 5\"",
    zodiac: "Libra",
    drinking: "Socially",
    smoking: "No"
  },
  {
    id: "p2",
    name: "Kabir Verma",
    age: 25,
    profession: "Tech Lead & Weekend Cyclist",
    college: "IIIT Jabalpur (Alum)",
    city: "Jabalpur",
    neighborhood: "Civil Lines",
    intent_timeline: "Intentional dating → Long-term partnership",
    prompt_question: "My absolute non-negotiable is...",
    prompt_answer: "Emotional honesty over polite silence, loving dogs, and being ready to drive 30 minutes just to grab your favorite midnight dessert.",
    photos: [
      "/images/kabir.jpg"
    ],
    is_verified: true,
    bio: "Working remote for a fintech startup. When offline, you'll find me on cycling trails toward Bargi Dam or experimenting with pour-over brews.",
    hobbies: ["Road Cycling", "Filter Coffee", "Acoustic Guitar", "Trekking"],
    height: "5' 11\"",
    zodiac: "Taurus",
    drinking: "Socially",
    smoking: "No"
  },
  {
    id: "p3",
    name: "Ananya Dubey",
    age: 24,
    profession: "Heritage Architect & Writer",
    college: "NLIU / Architecture Fellow",
    city: "Jabalpur",
    neighborhood: "Napier Town",
    intent_timeline: "Committed relationship within 1–2 years",
    prompt_question: "What my friends would roast me for...",
    prompt_answer: "Stopping to take photos of old colonial brickwork every 5 minutes, and knowing the lyrics to every single Jagjit Singh ghazal.",
    photos: [
      "/images/ananya.jpg"
    ],
    is_verified: true,
    bio: "Preserving historical spaces by day, bingeing true crime podcasts by night. Looking for someone genuine who values deep conversations.",
    hobbies: ["Heritage Walks", "Book Clubs", "Classical Music", "Badminton"],
    height: "5' 6\"",
    zodiac: "Cancer",
    drinking: "Non-drinker",
    smoking: "No"
  }
];
