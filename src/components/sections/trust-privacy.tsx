"use client";

import React from "react";
import { ShieldCheck, EyeOff, UserCheck, Lock, PhoneOff, AlertTriangle } from "lucide-react";

const SAFETY_PILLARS = [
  {
    icon: UserCheck,
    title: "100% Selfie-Verified Profiles",
    desc: "Every member must pass a real-time selfie check before their profile is visible. Zero catfish, zero impersonation.",
  },
  {
    icon: PhoneOff,
    title: "Private Phone Numbers",
    desc: "Chat securely within Vouple. You never have to hand out your personal WhatsApp or Instagram until you feel 100% comfortable.",
  },
  {
    icon: ShieldCheck,
    title: "Strict 18+ Age Gating",
    desc: "Adults only. Age verification is mandatory at onboarding to guarantee a safe, mature dating ecosystem.",
  },
  {
    icon: AlertTriangle,
    title: "Zero-Tolerance for Creeps",
    desc: "1-tap instant block and report. Any harassment or unsolicited content results in an immediate permanent ban.",
  },
];

export const TrustPrivacySection: React.FC = () => {
  return (
    <section
      id="safety"
      className="py-20 sm:py-28 relative scroll-mt-20 overflow-hidden bg-[#0D0D14]"
      aria-labelledby="safety-headline"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Headline & Trust Statement */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safety First Standard</span>
            </div>

            <h2
              id="safety-headline"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5"
            >
              Your peace of mind is <br />
              <span className="text-emerald-400">non-negotiable.</span>
            </h2>

            <p className="text-gray-300 text-base leading-relaxed mb-6">
              Unlike generic dating apps where anyone can upload a celebrity photo or create a spam account, Vouple is built with bank-grade safety, selfie verification, and proactive moderation.
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-gray-300 font-medium">
                End-to-end encrypted messaging. Your private chats are never readable by third parties.
              </p>
            </div>
          </div>

          {/* Right: 4 Safety Feature Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAFETY_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-6 rounded-3xl bg-[#14141E] border border-white/5 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
