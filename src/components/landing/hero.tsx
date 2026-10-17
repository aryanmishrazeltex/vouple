"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, ArrowRight, Lock, CheckCircle, Users } from "lucide-react";
import { Profile } from "@/types/profile";
import { ProfileCard } from "@/components/deck/profile-card";

interface HeroProps {
  featuredProfile: Profile;
  onOpenWaitlist: () => void;
}

export const Hero: React.FC<HeroProps> = ({ featuredProfile, onOpenWaitlist }) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-ivory bg-grain">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#E2CEB2]/30 via-[#F4EFEA]/20 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#EAE2DA] text-stone-700 text-xs font-medium mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-stone-900 font-semibold">Jabalpur Cohort #1 Admissions Open</span>
              <span className="text-stone-400">|</span>
              <span className="text-gold-dark font-mono text-[11px]">Strict ID Audit</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-obsidian tracking-tight leading-[1.12] mb-6">
              Dating designed for <span className="italic font-normal text-gold-dark">permanence</span>, not endless swiping.
            </h1>

            {/* Editorial Subheadline */}
            <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed mb-8 max-w-xl">
              Vouple is an exclusive, high-intent matchmaking platform for cultured professionals and families in Jabalpur. 
              No casual ghosting. No fake bios. Just <strong>5 curated, 100% verified matches</strong> delivered to your phone every morning at 9:00 AM.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                type="button"
                onClick={onOpenWaitlist}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-obsidian hover:bg-black text-ivory text-sm font-semibold tracking-wide shadow-luxury hover:shadow-luxury-lg hover:-translate-y-0.5 transition-all"
              >
                <span>Request Member Invitation</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </button>

              <Link
                href="/feed"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-stone-50 border border-[#EAE2DA] text-stone-800 text-sm font-medium transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-gold" />
                <span>Test Interactive Deck</span>
              </Link>
            </div>

            {/* Trust Proof Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#EAE2DA] w-full max-w-lg">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% ID Verified</span>
                </div>
                <p className="text-[11px] text-stone-500">Manual review by community stewards</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 mb-0.5">
                  <Lock className="w-3.5 h-3.5 text-gold-dark" />
                  <span>Privacy Shield™</span>
                </div>
                <p className="text-[11px] text-stone-500">Anti-screenshot dynamic watermark</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 mb-0.5">
                  <Users className="w-3.5 h-3.5 text-stone-800" />
                  <span>Daily 5 Pacing</span>
                </div>
                <p className="text-[11px] text-stone-500">Zero infinite scroll fatigue</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Decorative frame badge */}
            <div className="absolute -top-3 -right-3 z-30 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-luxury border border-[#EAE2DA] text-xs font-medium text-stone-800">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Civil Lines, Jabalpur</span>
            </div>

            <div className="w-full max-w-[380px] transition-transform hover:scale-[1.01] duration-300">
              <ProfileCard 
                profile={featuredProfile}
                onLike={() => {}}
                onPass={() => {}}
              />
            </div>

            <div className="mt-3 text-center">
              <span className="text-[11px] text-stone-500 italic">
                Interactive preview • Tap card details or flip photos
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
