"use client";

import React from "react";
import Image from "next/image";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { ContextPreview } from "./context-preview";
import { Flame, ShieldCheck, Sparkles, Heart, Users, MapPin } from "lucide-react";

interface HeroSectionProps {
  onOpenPrivacy?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenPrivacy }) => {
  return (
    <section className="relative pt-6 pb-20 sm:pt-12 sm:pb-28 lg:pt-16 lg:pb-32 overflow-hidden">
      {/* Background radial gradients for romantic lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#FF4458]/15 via-[#FF655B]/5 to-transparent blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#FF5864]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#FFA034]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Bold Headline & Form */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Top Pill / Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-200 tracking-wide mb-6 shadow-md backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF4458] animate-ping" />
              <span className="text-[#FFA034]">Jabalpur Launch</span>
              <span className="text-gray-500">•</span>
              <span>18+ Verified Singles Only</span>
            </div>

            {/* Giant Punchy Headline (Tinder / Bumble Energy) */}
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black text-white tracking-tight leading-[1.08] mb-6">
              Single? <br />
              <span className="gradient-text">Not for long.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-gray-300 font-normal leading-relaxed mb-8 max-w-[560px]">
              Tired of dry &apos;Hey&apos; texts, ghosting, and endless superficial swiping? Vouple connects verified singles in Jabalpur through genuine mutual intent, shared vibes, and effortless icebreakers.
            </p>

            {/* Waitlist Box */}
            <div className="w-full max-w-[520px] p-5 sm:p-6 rounded-3xl bg-[#12121A]/80 border border-white/10 backdrop-blur-xl shadow-2xl mb-6">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF4458] animate-pulse"></div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Priority Access</span>
                </div>
                <span className="text-[11px] font-semibold text-[#FFA034]">100% Free Forever VIP</span>
              </div>

              <WaitlistForm
                idPrefix="hero"
                onOpenPrivacy={onOpenPrivacy}
              />
            </div>

            {/* Social proof & Trust markers */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full border-2 border-[#0B0B0F] overflow-hidden bg-gray-800">
                    <Image src="/images/riya.jpg" alt="Member" width={28} height={28} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 border-[#0B0B0F] overflow-hidden bg-gray-800">
                    <Image src="/images/kabir.jpg" alt="Member" width={28} height={28} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 border-[#0B0B0F] overflow-hidden bg-gray-800">
                    <Image src="/images/ananya.jpg" alt="Member" width={28} height={28} className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-gray-300 font-semibold">Priority VIP Waitlist Active</span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Fake Profiles</span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-300">
                <MapPin className="w-4 h-4 text-[#FF5E62]" />
                <span>Jabalpur Exclusive</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <ContextPreview />
          </div>

        </div>
      </div>
    </section>
  );
};
