"use client";

import React from "react";
import { MessageSquare, Sparkles, ShieldCheck, HeartCrack, CheckCircle, Zap, Compass, Users } from "lucide-react";

export const TheIdeaSection: React.FC = () => {
  return (
    <section
      id="why-vouple"
      className="py-20 sm:py-28 relative scroll-mt-20 overflow-hidden"
      aria-labelledby="why-vouple-headline"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#FF5E62] uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 fill-[#FF5E62]" />
            <span>The Dating Upgrade</span>
          </div>
          <h2
            id="why-vouple-headline"
            className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4"
          >
            Built for real sparks. <br />
            <span className="gradient-text">Designed to be deleted.</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Stop collecting matches like pokemon cards that lead nowhere. Vouple is built around what actually makes two people click.
          </p>
        </div>

        {/* Old Apps vs Vouple Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          
          {/* Old Way Card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-[#14141E] border border-white/5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Traditional Dating Apps</span>
              <HeartCrack className="w-6 h-6 text-red-400" />
            </div>

            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✕</span>
                <span>Matches who never text, or open with dry &apos;Hey&apos;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✕</span>
                <span>Swiping on people 600km away who are just passing through</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✕</span>
                <span>Catfish profiles, bots, and unverified accounts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✕</span>
                <span>Zero clue if they want marriage or just casual games</span>
              </li>
            </ul>
          </div>

          {/* Vouple Way Card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1E1B2E] via-[#161622] to-[#14141E] border border-[#FF4458]/30 relative overflow-hidden shadow-2xl shadow-pink-500/10 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4458]/15 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFA034]">The Vouple Experience</span>
              <Sparkles className="w-6 h-6 text-[#FF5E62]" />
            </div>

            <ul className="space-y-4 text-sm text-gray-200">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</span>
                <span className="font-medium">Prompt icebreakers so your first chat is instantly fun</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</span>
                <span className="font-medium">Jabalpur local singles only (Wright Town, Civil Lines, Napier)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</span>
                <span className="font-medium">100% Selfie-Verified 18+ humans, zero bots</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</span>
                <span className="font-medium">Clear relationship intent & timeline stated upfront</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-[#12121A] border border-white/5 hover:border-white/15 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4458]/10 border border-[#FF4458]/20 flex items-center justify-center mb-5 text-[#FF4458]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Prompt-Powered Openers</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Every profile showcases answers to juicy conversation prompts, so saying something charming takes zero effort.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[#12121A] border border-white/5 hover:border-white/15 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFA034]/10 border border-[#FFA034]/20 flex items-center justify-center mb-5 text-[#FFA034]">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Zero Ambiguity</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Looking to marry in 1–2 years? Or intentional dating? Filter and match with people on the exact same wavelength.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[#12121A] border border-white/5 hover:border-white/15 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-5 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Safe & Verified</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Strict selfie verification, anti-harassment safeguards, and private in-app calling so your safety is always protected.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
