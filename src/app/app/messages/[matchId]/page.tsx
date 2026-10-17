"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  ShieldAlert,
  Sparkles,
  MapPin,
  CheckCircle2,
  Lock,
  Coffee,
} from "lucide-react";
import { useVoupleStore } from "@/lib/store/vouple-store";
import { SafetyModal } from "@/components/app/safety-modal";

export default function MessageThreadPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  const {
    isLoaded,
    currentUser,
    matches,
    messages,
    sendMessage,
    blockUser,
    reportUser,
  } = useVoupleStore();

  const [inputVal, setInputVal] = useState("");
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMatch = matches.find((m) => m.id === matchId);
  const partner = currentMatch?.partnerProfile;

  // Filter messages for this specific match
  const threadMessages = messages.filter((m) => m.matchId === matchId);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF4458] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Safety authorization check: match must exist and be active
  if (!currentMatch || !currentMatch.isActive || !partner) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col justify-center items-center px-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Conversation Unavailable</h2>
        <p className="text-xs text-gray-400 max-w-xs mb-6">
          This match session is inactive, blocked, or does not exist.
        </p>
        <Link
          href="/app/matches"
          className="px-6 py-2.5 rounded-full bg-white/10 text-white text-xs font-bold"
        >
          Return to Matches
        </Link>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const res = sendMessage(matchId, inputVal);
    if (res.success) {
      setInputVal("");
    }
  };

  const handleSuggestedClick = (text: string) => {
    sendMessage(matchId, text);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col justify-between max-w-md mx-auto border-x border-white/5">
      
      {/* Chat Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#12121A]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/app/matches"
            className="p-1.5 -ml-1.5 rounded-lg bg-white/5 text-gray-300 hover:text-white"
            aria-label="Back to matches"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Partner Mini Avatar */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-800">
            <Image
              src={partner.photos[0]}
              alt={partner.displayName}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1">
              <span>{partner.displayName}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </h2>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-[#FF5E62]" />
              <span>{partner.neighborhood}, Jabalpur</span>
            </p>
          </div>
        </div>

        {/* Safety & Report Trigger */}
        <button
          onClick={() => setSafetyModalOpen(true)}
          className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors"
          title="Report or Block user"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </header>

      {/* Message Stream */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        
        {/* Context Banner at top of chat */}
        {currentMatch.context && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1C1C2B] to-[#14141E] border border-[#FF4458]/20 shadow-md mb-4 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FFA034] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5E62]" />
              <span>Why you matched</span>
            </div>
            <p className="text-xs text-gray-200 mb-2 font-medium">
              {currentMatch.context.intentSummary}
            </p>
            <button
              onClick={() => handleSuggestedClick(currentMatch.context!.suggestedIcebreaker)}
              className="text-[11px] text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 py-1.5 px-3 rounded-full italic transition-colors inline-flex items-center gap-1.5"
            >
              <Coffee className="w-3 h-3 text-[#FFA034]" />
              <span>Tap to ask: &ldquo;{currentMatch.context.suggestedIcebreaker}&rdquo;</span>
            </button>
          </div>
        )}

        <div className="text-center my-3">
          <span className="text-[10px] text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5 inline-flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            <span>Private 1-on-1 text encryption</span>
          </span>
        </div>

        {/* Messages */}
        {threadMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isMe
                    ? "gradient-flame text-white font-medium rounded-br-xs shadow-md"
                    : "bg-[#1C1C2B] border border-white/10 text-gray-100 rounded-bl-xs"
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[9px] text-gray-400 mt-1 px-1">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </main>

      {/* Chat Text Input Bar */}
      <footer className="sticky bottom-0 z-30 bg-[#12121A] border-t border-white/10 p-3">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            maxLength={1000}
            placeholder="Type your message..."
            className="flex-1 h-12 px-4 rounded-2xl bg-white/5 border border-white/15 text-sm text-white placeholder-gray-400 outline-none focus:border-[#FF5E62] focus:ring-1 focus:ring-[#FF5E62]/30"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="w-12 h-12 rounded-2xl gradient-flame text-white flex items-center justify-center shadow-lg shadow-pink-500/25 disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>

      {/* Safety & Reporting Modal */}
      <SafetyModal
        targetUserId={partner.id}
        targetUserName={partner.displayName}
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
        onSubmitReport={(cat, details) => {
          reportUser(partner.id, cat, details);
          router.push("/app/matches");
        }}
        onBlockOnly={() => {
          blockUser(partner.id);
          router.push("/app/matches");
        }}
      />
    </div>
  );
}
