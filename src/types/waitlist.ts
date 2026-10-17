export interface WaitlistSubmissionRequest {
  email: string;
  isAdult: boolean;
  consentGiven: boolean;
}

export interface WaitlistRecord {
  id: string;
  email: string;
  isAdult: boolean;
  consentGiven: boolean;
  consentTimestamp: string;
  consentVersion: string;
  createdAt: string;
  emailDeliveryStatus: "pending" | "sent" | "failed" | "unconfigured";
  emailDeliveredAt?: string;
  emailError?: string;
  city: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  error?: string;
  fieldErrors?: {
    email?: string;
    isAdult?: string;
    consentGiven?: string;
  };
  emailStatus?: "sent" | "failed" | "unconfigured";
}

export interface WaitlistAdminStats {
  totalSignups: number;
  confirmedAdults: number;
  consentCount: number;
  emailsSent: number;
  emailsFailed: number;
  emailsUnconfigured: number;
}
