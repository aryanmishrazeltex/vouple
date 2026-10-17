"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/app/app-header";
import { BottomNav } from "@/components/app/bottom-nav";
import { useVoupleStore } from "@/lib/store/vouple-store";
import {
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  Trash2,
  RotateCcw,
  ShieldAlert,
  Lock,
  ChevronRight,
  UserCheck,
} from "lucide-react";

export default function SettingsPage() {
  const {
    isLoaded,
    currentUser,
    currentProfile,
    updateProfile,
    resetDemoData,
  } = useVoupleStore();

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF4458] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const togglePauseAccount = () => {
    updateProfile({ isActive: !currentProfile.isActive });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col justify-between">
      <AppHeader title="Settings & Privacy" />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 sm:py-6 space-y-6">
        
        {/* Adult Verification Card */}
        <div className="p-5 rounded-3xl bg-[#14141E] border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">18+ Adult Eligibility</h3>
              <p className="text-[11px] text-emerald-400 font-semibold">
                Status: Verified Adult
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            Your account has satisfied the Vouple age-eligibility protocol for the Jabalpur adult dating cohort.
          </p>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[10px] text-gray-400 space-y-1">
            <p><strong>Audit Method:</strong> {currentUser.adultVerificationMethod}</p>
            <p><strong>Timestamp:</strong> {currentUser.adultVerificationTimestamp || "N/A"}</p>
          </div>
        </div>

        {/* Account Discovery Visibility */}
        <div className="p-5 rounded-3xl bg-[#14141E] border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">Discovery Visibility</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentProfile.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
              {currentProfile.isActive ? "Active in Discovery" : "Paused / Hidden"}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            {currentProfile.isActive
              ? "Your profile is visible to eligible singles in Jabalpur."
              : "Your profile is hidden from discovery. Existing matches can still message you."}
          </p>
          <button
            onClick={togglePauseAccount}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-2 ${
              currentProfile.isActive
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
            }`}
          >
            {currentProfile.isActive ? (
              <>
                <PauseCircle className="w-4 h-4" />
                <span>Pause Account (Take a Break)</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" />
                <span>Resume Discovery Visibility</span>
              </>
            )}
          </button>
        </div>

        {/* Admin Dashboard Jump (if role is admin) */}
        {currentUser.role === "admin" && (
          <div className="p-5 rounded-3xl bg-[#1E1624] border border-[#FF4458]/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FF5E62]" />
                <h3 className="text-sm font-bold text-white">Moderator Console</h3>
              </div>
              <span className="text-[10px] font-bold text-[#FFA034] bg-white/10 px-2 py-0.5 rounded-full">
                Role: Admin
              </span>
            </div>
            <p className="text-xs text-gray-300 mb-4">
              Review flagged reports, inspect incidents, and manage suspensions across Jabalpur.
            </p>
            <Link
              href="/admin"
              className="w-full py-2.5 px-4 rounded-xl bg-[#FF4458]/20 border border-[#FF4458]/40 text-xs font-bold text-white hover:bg-[#FF4458]/30 transition-colors flex items-center justify-center gap-2"
            >
              <span>Open Admin Moderation Queue</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Developer QA Controls */}
        <div className="p-5 rounded-3xl bg-[#14141E] border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-white">Testing & Prototype Controls</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Reset candidate profiles, clear chat messages, and re-initialize test data back to default fixtures.
          </p>
          <button
            onClick={resetDemoData}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Demo State</span>
          </button>
        </div>

        {/* Delete Account */}
        <div className="p-5 rounded-3xl bg-red-950/20 border border-red-500/20 space-y-3">
          <h3 className="text-sm font-bold text-red-400">Danger Zone</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Permanently delete your profile, mutual matches, and chat history. This action cannot be undone.
          </p>
          {confirmDelete ? (
            <div className="space-y-2">
              <button
                onClick={resetDemoData}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Yes, Permanently Delete My Account
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-full py-2 text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          )}
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
