"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, X, Star, Sparkles, MapPin, CheckCircle2, MessageCircle, Shield, ChevronRight, RotateCcw } from "lucide-react";
import { MOCK_PROFILES } from "@/data/mock-profiles";

export const ContextPreview: React.FC = () => {
  const [profileIndex, setProfileIndex] = useState(0);
  const [matched, setMatched] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const currentProfile = MOCK_PROFILES[profileIndex] || MOCK_PROFILES[0];

  const handleLike = (isSuper = false) => {
    setLastAction(isSuper ? "superlike" : "like");
    setMatched(true);
  };

  const handlePass = () => {
    setMatched(false);
    setProfileIndex((prev) => (prev + 1) % MOCK_PROFILES.length);
  };

  const handleNext = () => {
    setMatched(false);
    setProfileIndex((prev) => (prev + 1) % MOCK_PROFILES.length);
  };

  const scrollToWaitlist = () => {
    const el = document.getElementById("hero-email-input") || document.getElementById("waitlist-email-input");
    el?.focus();
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none" aria-label="Interactive dating app profile card">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FF4458]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#FFA034]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Match Celebration Modal */}
      {matched && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-[#0B0B0F]/95 backdrop-blur-md rounded-[36px] border border-[#FF4458]/40 animate-match-pop text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full gradient-flame flex items-center justify-center mb-4 shadow-lg shadow-pink-500/50 animate-bounce">
            <Sparkles className="w-8 h-8 text-white fill-white" />
          </div>
          <h3 className="text-3xl font-black text-white tracking-tight mb-1">
            IT&apos;S A MATCH! 🔥
          </h3>
          <p className="text-sm text-gray-300 max-w-[280px] mb-5 leading-relaxed">
            You and <span className="text-[#FF5E62] font-bold">{currentProfile.name}</span> both share mutual intentions in <span className="text-white font-medium">{currentProfile.city}</span>!
          </p>

          <div className="flex items-center justify-center -space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-[#0B0B0F] overflow-hidden shadow-lg">
              <Image
                src={currentProfile.photos[0]}
                alt={currentProfile.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-[#0B0B0F] bg-gradient-to-tr from-[#FF4458] to-[#FFA034] flex items-center justify-center text-white font-black text-xl shadow-lg">
              YOU
            </div>
          </div>

          <button
            onClick={scrollToWaitlist}
            className="w-full py-3.5 px-6 rounded-full gradient-flame text-white font-bold text-sm shadow-xl shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all mb-2.5 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join Waitlist to Chat First</span>
          </button>
          
          <button
            onClick={handleNext}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 py-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Keep previewing profiles</span>
          </button>
        </div>
      )}

      {/* Main Dating Card Shell */}
      <div className="relative bg-[#161622] rounded-[36px] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        
        {/* Top Status Bar Inside Card */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>App Preview · Jabalpur</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white/80">
            <span>{profileIndex + 1} of {MOCK_PROFILES.length}</span>
          </div>
        </div>

        {/* Hero Photo Box */}
        <div className="relative w-full h-[360px] sm:h-[400px] overflow-hidden bg-gray-900">
          <Image
            src={currentProfile.photos[0]}
            alt={currentProfile.name}
            fill
            priority
            sizes="(max-width: 480px) 100vw, 420px"
            className="object-cover object-top transition-transform duration-700 hover:scale-105"
          />
          {/* Subtle bottom shadow gradient over photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161622] via-[#161622]/40 to-transparent"></div>

          {/* Overlaid Profile Info at bottom of photo */}
          <div className="absolute bottom-4 left-5 right-5 z-10">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                {currentProfile.name}, {currentProfile.age}
              </h2>
              <div className="w-6 h-6 rounded-full bg-emerald-500/90 backdrop-blur-sm flex items-center justify-center shadow-md" title="18+ Verified Profile">
                <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            </div>

            <p className="text-sm font-medium text-gray-200 flex items-center gap-1.5 drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-[#FF5E62]" />
              <span>{currentProfile.neighborhood}, {currentProfile.city}</span>
            </p>
          </div>
        </div>

        {/* Card Body & Intent Showcase */}
        <div className="p-5 space-y-4">
          
          {/* Mutual Intent Pill */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF4458] to-[#FFA034] flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#FFA034]">Looking for</p>
              <p className="text-xs font-semibold text-white leading-snug">{currentProfile.intent_timeline}</p>
            </div>
          </div>

          {/* Hinge-style Prompt Card */}
          <div className="p-4 rounded-2xl bg-[#1C1C2B] border border-white/10 relative group">
            <p className="text-[11px] font-bold text-gray-400 mb-1.5 flex items-center gap-1">
              <span>{currentProfile.prompt_question}</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-100 font-medium leading-relaxed italic">
              &ldquo;{currentProfile.prompt_answer}&rdquo;
            </p>
          </div>

          {/* Interest Tags */}
          <div className="flex flex-wrap gap-1.5">
            {currentProfile.hobbies?.slice(0, 4).map((hobby) => (
              <span
                key={hobby}
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-gray-300"
              >
                {hobby}
              </span>
            ))}
          </div>

          {/* Interactive Tinder/Bumble Action Bar */}
          <div className="pt-2 flex items-center justify-center gap-4">
            
            {/* Pass Button */}
            <button
              onClick={handlePass}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/15 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:border-red-500/50 hover:text-red-400 hover:scale-110 active:scale-95 transition-all shadow-lg"
              title="Pass / Next profile"
              aria-label="Pass"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>

            {/* Super Like Button */}
            <button
              onClick={() => handleLike(true)}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/15 text-sky-400 flex items-center justify-center hover:bg-sky-500/20 hover:border-sky-400 hover:scale-110 active:scale-95 transition-all shadow-lg"
              title="Super Like"
              aria-label="Super Like"
            >
              <Star className="w-5 h-5 fill-sky-400 text-sky-400" />
            </button>

            {/* Match / Like Heart Button */}
            <button
              onClick={() => handleLike(false)}
              className="w-14 h-14 rounded-full gradient-flame text-white flex items-center justify-center shadow-xl shadow-pink-500/40 hover:scale-110 active:scale-95 transition-all"
              title="Like / Match"
              aria-label="Like"
            >
              <Heart className="w-6 h-6 fill-white text-white" />
            </button>

            {/* Next Profile Button */}
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/15 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-lg"
              title="Next Profile"
              aria-label="Next Profile"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center pt-1">
            <span className="text-[11px] font-medium text-gray-400">
              💡 Tap <span className="text-[#FF5E62] font-semibold">Heart</span> to see how instant matching feels!
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
