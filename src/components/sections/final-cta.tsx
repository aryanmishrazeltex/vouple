"use client";

import React from "react";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { Sparkles, Flame, Crown, ShieldCheck, Heart } from "lucide-react";

interface FinalCtaSectionProps {
  onOpenPrivacy?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenPrivacy }) => {
  return (
    <section
      id="waitlist"
      className="py-20 sm:py-28 relative scroll-mt-20 overflow-hidden"
      aria-labelledby="final-cta-headline"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        
        {/* Giant Glowing Card */}
        <div className="relative rounded-[40px] p-8 sm:p-14 lg:p-20 bg-gradient-to-b from-[#181826] via-[#12121A] to-[#0D0D14] border border-white/10 text-center overflow-hidden shadow-2xl">
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#FF4458]/20 via-[#FF6036]/20 to-[#FFA034]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#FFA034] uppercase tracking-wider mb-6">
              <Crown className="w-4 h-4 text-[#FFA034]" />
              <span>Limited Early Bird Access</span>
            </div>

            {/* Headline */}
            <h2
              id="final-cta-headline"
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-5"
            >
              Ready to delete your <br />
              <span className="gradient-text">other dating apps?</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
              Reserve your priority invitation for the Jabalpur private beta and get an exclusive 15-day Vouple Gold VIP pass for free.
            </p>

            {/* Waitlist Box */}
            <div className="max-w-md mx-auto mb-8">
              <WaitlistForm
                idPrefix="cta"
                variant="dark"
                onOpenPrivacy={onOpenPrivacy}
              />
            </div>

            {/* 3 VIP Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-4 h-4 text-[#FFA034]" />
                <span className="text-gray-300 font-semibold">15-Day Free VIP Pass</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300 font-semibold">100% Selfie-Verified</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-[#FF4458]" />
                <span className="text-gray-300 font-semibold">Local Jabalpur Singles</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
