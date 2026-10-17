"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, Heart, User, MessageCircle } from "lucide-react";
import { CardStack } from "@/components/deck/card-stack";
import { WaitlistModal } from "@/components/landing/waitlist-modal";
import { MOCK_PROFILES } from "@/data/mock-profiles";

export default function FeedPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between">
      {/* Top Mobile App Bar */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-[#EAE2DA] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Landing</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-lg tracking-widest text-obsidian uppercase">
              Vouple
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              Jabalpur
            </span>
          </div>

          <button
            type="button"
            onClick={() => setWaitlistOpen(true)}
            className="text-[11px] font-medium text-gold-dark hover:text-obsidian"
          >
            Member Status
          </button>
        </div>
      </header>

      {/* Main Interactive Deck Section */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-center">
        <CardStack 
          profiles={MOCK_PROFILES} 
          onOpenWaitlist={() => setWaitlistOpen(true)}
        />
      </main>

      {/* Bottom App Navigation Bar */}
      <nav className="sticky bottom-0 z-30 w-full bg-white/90 backdrop-blur-md border-t border-[#EAE2DA] py-2.5 px-6">
        <div className="max-w-md mx-auto flex items-center justify-around text-stone-400">
          <button 
            type="button"
            className="flex flex-col items-center gap-1 text-obsidian font-medium text-[10px]"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <span>Daily 5</span>
          </button>

          <button 
            type="button"
            onClick={() => setWaitlistOpen(true)}
            className="flex flex-col items-center gap-1 hover:text-stone-700 text-[10px]"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span>Chats</span>
          </button>

          <button 
            type="button"
            onClick={() => setWaitlistOpen(true)}
            className="flex flex-col items-center gap-1 hover:text-stone-700 text-[10px]"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <span>Admirers</span>
          </button>

          <button 
            type="button"
            onClick={() => setWaitlistOpen(true)}
            className="flex flex-col items-center gap-1 hover:text-stone-700 text-[10px]"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span>Profile</span>
          </button>
        </div>
      </nav>

      {/* Waitlist / Cohort Modal */}
      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </div>
  );
}
