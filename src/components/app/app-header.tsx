"use client";

import React from "react";
import Link from "next/link";
import { Flame, ShieldCheck, RotateCcw, ShieldAlert, ArrowLeft } from "lucide-react";
import { useVoupleStore } from "@/lib/store/vouple-store";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, showBack = false }) => {
  const { currentUser, resetDemoData } = useVoupleStore();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0F]/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Left item */}
        <div className="flex items-center gap-2">
          {showBack ? (
            <Link
              href="/app"
              className="p-1.5 -ml-1.5 rounded-lg bg-white/5 text-gray-300 hover:text-white"
              aria-label="Back to discovery"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 group" title="Return to public landing">
              <div className="w-8 h-8 rounded-lg gradient-flame flex items-center justify-center shadow-md">
                <Flame className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-gray-200">
                VOUPLE
              </span>
            </Link>
          )}

          {title && (
            <span className="text-sm font-bold text-gray-200 border-l border-white/10 pl-2">
              {title}
            </span>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Location badge */}
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Jabalpur 18+
          </span>

          {/* Admin link if user is moderator/admin */}
          {currentUser.role === "admin" && (
            <Link
              href="/admin"
              className="px-2.5 py-1 rounded-full bg-[#FF4458]/15 border border-[#FF4458]/30 text-[10px] font-bold text-[#FF5E62] flex items-center gap-1 hover:bg-[#FF4458]/25 transition-colors"
              title="Open Moderator Dashboard"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          )}

          {/* Reset Demo button for tester convenience */}
          <button
            onClick={resetDemoData}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset dev fixtures / test state"
            aria-label="Reset test data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
