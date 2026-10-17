export interface Profile {
  id: string;
  name: string;
  age: number;
  profession: string;
  college: string;
  city: string; // e.g., "Jabalpur"
  intent_timeline: string; // e.g., "Marriage within 1-2 years", "Intentional partnership leading to marriage"
  prompt_question: string; // e.g., "Non-negotiable value in my partner"
  prompt_answer: string;
  photos: string[]; // High-res portrait URLs (3:4 ratio)
  is_verified: boolean; // Green shield badge (Mama/Admin reviewed)
  bio?: string;
  neighborhood?: string; // e.g., "Civil Lines, Jabalpur" or "Napier Town"
  hobbies?: string[];
  height?: string;
  zodiac?: string;
  drinking?: string;
  smoking?: string;
}

export type SwipeDirection = 'left' | 'right' | 'up';
