"use client";

import { useState, useEffect } from "react";
import {
  UserAccount,
  UserProfile,
  MatchRecord,
  MessageRecord,
  BlockRecord,
  ReportRecord,
  LikeAction,
  ReportCategory,
  ResolutionAction,
} from "@/types/app";
import {
  DEV_CURRENT_USER,
  DEV_CURRENT_PROFILE,
  DEV_FICTIONAL_PROFILES,
  calculateConnectionContext,
} from "@/lib/app-mock-data";

const STORAGE_KEYS = {
  USER: "vpl_app_user",
  PROFILE: "vpl_app_profile",
  CANDIDATES: "vpl_app_candidates",
  LIKES: "vpl_app_likes",
  MATCHES: "vpl_app_matches",
  MESSAGES: "vpl_app_messages",
  BLOCKS: "vpl_app_blocks",
  REPORTS: "vpl_app_reports",
};

interface StoredLike {
  senderId: string;
  receiverId: string;
  action: LikeAction;
  createdAt: string;
}

export function useVoupleStore() {
  const [currentUser, setCurrentUser] = useState<UserAccount>(DEV_CURRENT_USER);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(DEV_CURRENT_PROFILE);
  const [candidates, setCandidates] = useState<UserProfile[]>(DEV_FICTIONAL_PROFILES);
  const [likes, setLikes] = useState<StoredLike[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [blocks, setBlocks] = useState<BlockRecord[]>([]);
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial load from localStorage (or fallback to fixtures)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const savedCandidates = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      const savedLikes = localStorage.getItem(STORAGE_KEYS.LIKES);
      const savedMatches = localStorage.getItem(STORAGE_KEYS.MATCHES);
      const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      const savedBlocks = localStorage.getItem(STORAGE_KEYS.BLOCKS);
      const savedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);

      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedProfile) setCurrentProfile(JSON.parse(savedProfile));
      if (savedCandidates) setCandidates(JSON.parse(savedCandidates));
      if (savedLikes) setLikes(JSON.parse(savedLikes));
      
      if (savedMatches) {
        setMatches(JSON.parse(savedMatches));
      } else {
        setMatches([]);
      }

      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([]);
      }

      if (savedBlocks) setBlocks(JSON.parse(savedBlocks));
      if (savedReports) setReports(JSON.parse(savedReports));
    } catch (e) {
      console.error("[VoupleStore] Storage load error:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  const persist = (key: string, data: unknown) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("[VoupleStore] Storage write error:", e);
    }
  };

  // 1. Adult Verification Update
  const verifyAdultAccess = (method = "prototype_audit_v1") => {
    const updated: UserAccount = {
      ...currentUser,
      isAdultVerified: true,
      adultVerificationTimestamp: new Date().toISOString(),
      adultVerificationMethod: method,
      status: "active",
      updatedAt: new Date().toISOString(),
    };
    setCurrentUser(updated);
    persist(STORAGE_KEYS.USER, updated);
  };

  // 2. Profile Updates
  const updateProfile = (changes: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...currentProfile,
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    setCurrentProfile(updated);
    persist(STORAGE_KEYS.PROFILE, updated);
  };

  // 3. Like / Pass Action
  const submitLikeAction = (
    candidateId: string,
    action: LikeAction
  ): { isMatch: boolean; match?: MatchRecord } => {
    const newLike: StoredLike = {
      senderId: currentUser.id,
      receiverId: candidateId,
      action,
      createdAt: new Date().toISOString(),
    };

    const nextLikes = [...likes, newLike];
    setLikes(nextLikes);
    persist(STORAGE_KEYS.LIKES, nextLikes);

    // If action is pass, no match
    if (action === "pass") {
      return { isMatch: false };
    }

    // Determine mutual match:
    // In our prototype, candidate Riya or Ananya reciprocate positive likes
    const candidateProfile = candidates.find((c) => c.id === candidateId);
    if (!candidateProfile) return { isMatch: false };

    const newMatch: MatchRecord = {
      id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user1Id: currentUser.id,
      user2Id: candidateId,
      isActive: true,
      matchedAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      partnerProfile: candidateProfile,
      context: calculateConnectionContext(currentProfile, candidateProfile),
    };

    const nextMatches = [newMatch, ...matches];
    setMatches(nextMatches);
    persist(STORAGE_KEYS.MATCHES, nextMatches);

    return { isMatch: true, match: newMatch };
  };

  // 4. Send Message in Mutual Match
  const sendMessage = (matchId: string, text: string): { success: boolean; message?: MessageRecord; error?: string } => {
    const trimmed = text.trim();
    if (!trimmed) return { success: false, error: "Message cannot be empty." };
    if (trimmed.length > 1000) return { success: false, error: "Message exceeds 1,000 characters." };

    const targetMatch = matches.find((m) => m.id === matchId && m.isActive);
    if (!targetMatch) return { success: false, error: "Match is inactive or not found." };

    // Check if either is blocked
    const isBlocked = blocks.some(
      (b) =>
        (b.blockerId === targetMatch.user1Id && b.blockedId === targetMatch.user2Id) ||
        (b.blockerId === targetMatch.user2Id && b.blockedId === targetMatch.user1Id)
    );
    if (isBlocked) return { success: false, error: "Cannot send message to a blocked account." };

    const newMsg: MessageRecord = {
      id: `msg_${Date.now()}`,
      matchId,
      senderId: currentUser.id,
      content: trimmed,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    persist(STORAGE_KEYS.MESSAGES, nextMessages);

    // Update match preview
    const nextMatches = matches.map((m) =>
      m.id === matchId
        ? {
            ...m,
            lastMessageAt: newMsg.createdAt,
            lastMessagePreview: trimmed,
          }
        : m
    );
    setMatches(nextMatches);
    persist(STORAGE_KEYS.MATCHES, nextMatches);

    return { success: true, message: newMsg };
  };

  // 5. Block User
  const blockUser = (targetUserId: string) => {
    const newBlock: BlockRecord = {
      id: `blk_${Date.now()}`,
      blockerId: currentUser.id,
      blockedId: targetUserId,
      createdAt: new Date().toISOString(),
    };

    const nextBlocks = [...blocks, newBlock];
    setBlocks(nextBlocks);
    persist(STORAGE_KEYS.BLOCKS, nextBlocks);

    // Deactivate mutual matches with target user
    const nextMatches = matches.filter(
      (m) => !(m.user1Id === targetUserId || m.user2Id === targetUserId)
    );
    setMatches(nextMatches);
    persist(STORAGE_KEYS.MATCHES, nextMatches);
  };

  // 6. Report User
  const reportUser = (
    targetUserId: string,
    category: ReportCategory,
    details: string
  ) => {
    const reportedProfile = candidates.find((c) => c.id === targetUserId) ||
      matches.find((m) => m.partnerProfile?.id === targetUserId)?.partnerProfile;

    const newReport: ReportRecord = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      reportedId: targetUserId,
      category,
      details: details.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
      reportedProfile,
      reporterEmail: currentUser.email,
    };

    const nextReports = [newReport, ...reports];
    setReports(nextReports);
    persist(STORAGE_KEYS.REPORTS, nextReports);

    // Auto-block upon report for safety
    blockUser(targetUserId);
  };

  // 7. Admin Moderation Actions
  const resolveReport = (
    reportId: string,
    action: ResolutionAction,
    moderatorNotes?: string
  ) => {
    const nextReports = reports.map((r) =>
      r.id === reportId
        ? {
            ...r,
            status: action === "none" ? ("resolved_dismissed" as const) : ("resolved_action_taken" as const),
            resolutionAction: action,
            moderatorId: currentUser.id,
            moderatorNotes,
            resolvedAt: new Date().toISOString(),
          }
        : r
    );
    setReports(nextReports);
    persist(STORAGE_KEYS.REPORTS, nextReports);
  };

  // Reset demo data to defaults
  const resetDemoData = () => {
    localStorage.clear();
    setCurrentUser(DEV_CURRENT_USER);
    setCurrentProfile(DEV_CURRENT_PROFILE);
    setCandidates(DEV_FICTIONAL_PROFILES);
    setLikes([]);
    setBlocks([]);
    setReports([]);
    window.location.reload();
  };

  // Filtered Discovery Candidates: not self, not blocked, not already acted on
  const activeCandidates = candidates.filter((candidate) => {
    if (candidate.id === currentUser.id) return false;
    const isBlocked = blocks.some(
      (b) => b.blockedId === candidate.id || b.blockerId === candidate.id
    );
    if (isBlocked) return false;
    const alreadyActed = likes.some((l) => l.receiverId === candidate.id);
    return !alreadyActed;
  });

  return {
    isLoaded,
    currentUser,
    currentProfile,
    candidates: activeCandidates,
    likes,
    matches,
    messages,
    blocks,
    reports,
    verifyAdultAccess,
    updateProfile,
    submitLikeAction,
    sendMessage,
    blockUser,
    reportUser,
    resolveReport,
    resetDemoData,
  };
}
