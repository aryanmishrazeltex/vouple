"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, MessageCircle, ArrowRight, X } from "lucide-react";
import { MatchRecord } from "@/types/app";

interface MatchModalProps {
  match: MatchRecord;
  onClose: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({ match, onClose }) => {
  const partner = match.partnerProfile;
  if (!partner) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-up"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-sm rounded-[36px] bg-[#14141E] border border-[#FF4458]/40 p-6 text-center shadow-2xl overflow-hidden">
        
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FF4458]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Flame Badge */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl gradient-flame flex items-center justify-center shadow-xl shadow-pink-500/40 animate-bounce">
          <Sparkles className="w-8 h-8 text-white fill-white" />
        </div>

        <h3 className="text-3xl font-black text-white tracking-tight mb-2">
          IT&apos;S A MATCH! 🔥
        </h3>

        <p className="text-xs text-gray-300 max-w-[260px] mx-auto mb-6 leading-relaxed">
          You and <span className="text-[#FF5E62] font-bold">{partner.displayName}</span> both liked each other&apos;s intent in <span className="text-white font-medium">{partner.city}</span>!
        </p>

        {/* Overlapping Avatars */}
        <div className="flex items-center justify-center -space-x-4 mb-6">
          <div className="w-18 h-18 rounded-full border-4 border-[#14141E] overflow-hidden shadow-2xl relative">
            <Image
              src="/images/kabir.jpg"
              alt="You"
              width={72}
              height={72}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-18 h-18 rounded-full border-4 border-[#14141E] overflow-hidden shadow-2xl relative">
            <Image
              src={partner.photos[0]}
              alt={partner.displayName}
              width={72}
              height={72}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Context Reminder */}
        {match.context && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300 mb-6 italic">
            &ldquo;{match.context.suggestedIcebreaker}&rdquo;
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Link
            href={`/app/messages/${match.id}`}
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-full gradient-flame text-white font-bold text-sm shadow-xl shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send First Message</span>
          </Link>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Keep Swiping
          </button>
        </div>

      </div>
    </div>
  );
};
