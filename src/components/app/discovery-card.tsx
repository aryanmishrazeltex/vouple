"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserProfile, ConnectionContext } from "@/types/app";
import {
  Heart,
  X,
  Star,
  Sparkles,
  MapPin,
  CheckCircle2,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Coffee,
} from "lucide-react";

interface DiscoveryCardProps {
  candidate: UserProfile;
  context: ConnectionContext;
  onLike: () => void;
  onSuperlike: () => void;
  onPass: () => void;
  onOpenReport: () => void;
}

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({
  candidate,
  context,
  onLike,
  onSuperlike,
  onPass,
  onOpenReport,
}) => {
  const [showFullContext, setShowFullContext] = useState(true);

  return (
    <div className="relative w-full max-w-md mx-auto select-none rounded-[36px] bg-[#14141E] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
      
      {/* Top action: Report / Block icon */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={onOpenReport}
          className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-gray-300 hover:text-red-400 hover:bg-black/80 transition-all shadow-md"
          title="Report or Block profile"
          aria-label="Report or Block profile"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Image Container */}
      <div className="relative w-full h-[380px] bg-gray-900 overflow-hidden">
        <Image
          src={candidate.photos[0]}
          alt={candidate.displayName}
          fill
          priority
          sizes="(max-width: 480px) 100vw, 420px"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14141E] via-[#14141E]/30 to-transparent"></div>

        {/* Profile Info overlay */}
        <div className="absolute bottom-4 left-5 right-5">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
              {candidate.displayName}, {candidate.age}
            </h2>
            {candidate.isVerified && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </span>
            )}
          </div>

          <p className="text-xs font-semibold text-gray-200 flex items-center gap-1.5 drop-shadow">
            <MapPin className="w-3.5 h-3.5 text-[#FF5E62]" />
            <span>{candidate.neighborhood}, {candidate.city}</span>
          </p>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        
        {/* SIGNATURE: "Why you might connect" Context Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E1B2E] via-[#181826] to-[#14141E] border border-[#FF4458]/30 shadow-lg">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowFullContext(!showFullContext)}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg gradient-flame flex items-center justify-center shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFA034]">
                Why you might connect
              </span>
            </div>
            {showFullContext ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>

          {showFullContext && (
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5 text-xs">
              
              {/* Intent Alignment */}
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4458] mt-1.5 shrink-0"></span>
                <p className="text-gray-200 font-medium">
                  {context.intentSummary}
                </p>
              </div>

              {/* Shared Hobbies */}
              {context.sharedHobbies.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-gray-400 font-semibold">Shared:</span>
                  {context.sharedHobbies.map((hobby) => (
                    <span
                      key={hobby}
                      className="px-2 py-0.5 rounded-full bg-[#FF4458]/15 border border-[#FF4458]/30 text-[10px] font-bold text-[#FF5E62]"
                    >
                      ✓ {hobby}
                    </span>
                  ))}
                </div>
              )}

              {/* Suggested Icebreaker */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-300 italic flex items-start gap-2">
                <Coffee className="w-3.5 h-3.5 text-[#FFA034] shrink-0 mt-0.5" />
                <span>{context.suggestedIcebreaker}</span>
              </div>

            </div>
          )}
        </div>

        {/* Prompt Card */}
        <div className="p-4 rounded-2xl bg-[#1C1C2B] border border-white/10">
          <p className="text-[11px] font-bold text-gray-400 mb-1">
            {candidate.promptQuestion}
          </p>
          <p className="text-xs sm:text-sm text-gray-100 font-medium leading-relaxed italic">
            &ldquo;{candidate.promptAnswer}&rdquo;
          </p>
        </div>

        {/* Hobbies / Badges */}
        <div className="flex flex-wrap gap-1.5">
          {candidate.hobbies.map((h) => (
            <span
              key={h}
              className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-gray-300"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Interactive Action Bar (Pass, Superlike, Like) */}
        <div className="pt-2 flex items-center justify-center gap-6">
          <button
            onClick={onPass}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/15 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:border-red-500/50 hover:text-red-400 hover:scale-110 active:scale-95 transition-all shadow-xl"
            title="Pass"
            aria-label="Pass"
          >
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>

          <button
            onClick={onSuperlike}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/15 text-sky-400 flex items-center justify-center hover:bg-sky-500/20 hover:border-sky-400 hover:scale-110 active:scale-95 transition-all shadow-lg"
            title="Super Like"
            aria-label="Super Like"
          >
            <Star className="w-5 h-5 fill-sky-400 text-sky-400" />
          </button>

          <button
            onClick={onLike}
            className="w-16 h-16 rounded-full gradient-flame text-white flex items-center justify-center shadow-2xl shadow-pink-500/50 hover:scale-110 active:scale-95 transition-all"
            title="Like / Match"
            aria-label="Like"
          >
            <Heart className="w-7 h-7 fill-white text-white" />
          </button>
        </div>

      </div>
    </div>
  );
};
