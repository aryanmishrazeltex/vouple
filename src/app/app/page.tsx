"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/app/app-header";
import { BottomNav } from "@/components/app/bottom-nav";
import { DiscoveryCard } from "@/components/app/discovery-card";
import { MatchModal } from "@/components/app/match-modal";
import { SafetyModal } from "@/components/app/safety-modal";
import { useVoupleStore } from "@/lib/store/vouple-store";
import { calculateConnectionContext } from "@/lib/app-mock-data";
import { MatchRecord } from "@/types/app";
import { Sparkles, ShieldCheck, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";

export default function DiscoveryPage() {
  const {
    isLoaded,
    currentUser,
    currentProfile,
    candidates,
    submitLikeAction,
    blockUser,
    reportUser,
    resetDemoData,
  } = useVoupleStore();

  const [activeMatch, setActiveMatch] = useState<MatchRecord | null>(null);
  const [reportingCandidateId, setReportingCandidateId] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF4458] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Adult verification gate
  if (!currentUser.isAdultVerified) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex flex-col justify-between">
        <AppHeader />
        <main className="flex-1 max-w-md w-full mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#FF4458]/15 border border-[#FF4458]/30 flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-[#FF5E62]" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            18+ Verification Required
          </h2>
          <p className="text-sm text-gray-400 mb-8 max-w-xs">
            Vouple is an adult-only dating community for Jabalpur. Please verify your adult status to access discovery.
          </p>
          <Link
            href="/app/onboarding"
            className="w-full py-3.5 px-6 rounded-full gradient-flame text-white font-bold text-sm shadow-xl shadow-pink-500/25"
          >
            Complete Adult Verification
          </Link>
        </main>
        <BottomNav />
      </div>
    );
  }

  const currentCandidate = candidates[0];
  const reportingCandidate = candidates.find((c) => c.id === reportingCandidateId);

  const handleLike = () => {
    if (!currentCandidate) return;
    const result = submitLikeAction(currentCandidate.id, "like");
    if (result.isMatch && result.match) {
      setActiveMatch(result.match);
    }
  };

  const handleSuperlike = () => {
    if (!currentCandidate) return;
    const result = submitLikeAction(currentCandidate.id, "superlike");
    if (result.isMatch && result.match) {
      setActiveMatch(result.match);
    }
  };

  const handlePass = () => {
    if (!currentCandidate) return;
    submitLikeAction(currentCandidate.id, "pass");
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col justify-between selection:bg-[#FF4458] selection:text-white">
      {/* Top App Header */}
      <AppHeader />

      {/* Main Discovery Deck Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center">
        {currentCandidate ? (
          <DiscoveryCard
            candidate={currentCandidate}
            context={calculateConnectionContext(currentProfile, currentCandidate)}
            onLike={handleLike}
            onSuperlike={handleSuperlike}
            onPass={handlePass}
            onOpenReport={() => setReportingCandidateId(currentCandidate.id)}
          />
        ) : (
          <div className="text-center py-16 px-6 rounded-[36px] bg-[#14141E] border border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">
              You&apos;re All Caught Up!
            </h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              You&apos;ve reviewed all available candidate profiles in Jabalpur today. New curated introductions arrive every morning at 9 AM.
            </p>
            <div className="pt-4">
              <button
                onClick={resetDemoData}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Candidates</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Mobile Navigation */}
      <BottomNav />

      {/* Mutual Match Celebration Modal */}
      {activeMatch && (
        <MatchModal
          match={activeMatch}
          onClose={() => setActiveMatch(null)}
        />
      )}

      {/* Safety & Report Modal */}
      {reportingCandidate && (
        <SafetyModal
          targetUserId={reportingCandidate.id}
          targetUserName={reportingCandidate.displayName}
          isOpen={!!reportingCandidateId}
          onClose={() => setReportingCandidateId(null)}
          onSubmitReport={(cat, details) => {
            reportUser(reportingCandidate.id, cat, details);
          }}
          onBlockOnly={() => {
            blockUser(reportingCandidate.id);
          }}
        />
      )}
    </div>
  );
}
