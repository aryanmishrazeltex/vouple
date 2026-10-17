export type UserRole = "member" | "moderator" | "admin";
export type UserStatus = "pending_verification" | "active" | "paused" | "suspended" | "banned";
export type LikeAction = "like" | "superlike" | "pass";
export type ReportCategory = 
  | "harassment"
  | "underage_concern"
  | "impersonation_fake"
  | "spam"
  | "inappropriate_content"
  | "other";

export type ReportStatus = "pending" | "investigating" | "resolved_dismissed" | "resolved_action_taken";
export type ResolutionAction = "none" | "warning_issued" | "suspended" | "banned";

export interface UserAccount {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  isAdultVerified: boolean;
  adultVerificationTimestamp?: string;
  adultVerificationMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string; // matches UserAccount.id
  displayName: string;
  age: number;
  city: string; // default "Jabalpur"
  neighborhood: string; // e.g. "Civil Lines", "Wright Town"
  bio: string;
  photos: string[];
  intentTimeline: string; // e.g. "Marriage in 12–18 months", "Committed relationship", "Intentional dating"
  promptQuestion: string;
  promptAnswer: string;
  hobbies: string[];
  height?: string;
  zodiac?: string;
  drinking?: string;
  smoking?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  userId: string;
  minAge: number;
  maxAge: number;
  preferredIntent: string[];
  preferredNeighborhoods: string[];
}

export interface ConnectionContext {
  sharedHobbies: string[];
  intentMatch: boolean;
  intentSummary: string;
  locationProximity: string;
  suggestedIcebreaker: string;
}

export interface MatchRecord {
  id: string;
  user1Id: string;
  user2Id: string;
  isActive: boolean;
  matchedAt: string;
  lastMessageAt: string;
  lastMessagePreview?: string;
  // Resolved profile for UI rendering
  partnerProfile?: UserProfile;
  context?: ConnectionContext;
}

export interface MessageRecord {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface BlockRecord {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: string;
}

export interface ReportRecord {
  id: string;
  reporterId: string;
  reportedId: string;
  category: ReportCategory;
  details: string;
  status: ReportStatus;
  resolutionAction?: ResolutionAction;
  moderatorId?: string;
  moderatorNotes?: string;
  createdAt: string;
  resolvedAt?: string;
  // UI helpers
  reportedProfile?: UserProfile;
  reporterEmail?: string;
}
