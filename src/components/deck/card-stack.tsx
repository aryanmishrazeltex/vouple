"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, RefreshCw, Send, CheckCircle2 } from "lucide-react";
import { Profile } from "@/types/profile";
import { ProfileCard } from "./profile-card";

interface CardStackProps {
  profiles: Profile[];
  onOpenWaitlist?: () => void;
}

export const CardStack: React.FC<CardStackProps> = ({ 
  profiles,
  onOpenWaitlist
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteSent, setNoteSent] = useState(false);

  const activeProfile = profiles[currentIndex];
  const isDeckFinished = currentIndex >= profiles.length;

  const handleNext = () => {
    if (currentIndex < profiles.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSendNote = () => {
    if (!noteText.trim()) return;
    setNoteSent(true);
    setTimeout(() => {
      setNoteSent(false);
      setNoteModalOpen(false);
      setNoteText("");
      handleNext();
    }, 1400);
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
      {/* Daily Drop Counter Bar */}
      <div className="w-full flex items-center justify-between px-3 py-2 mb-3 rounded-full bg-white/70 backdrop-blur-md border border-[#EAE2DA] text-xs text-stone-600 shadow-sm">
        <div className="flex items-center gap-1.5 font-medium text-stone-800">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Daily Curated 5 Drop</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-stone-900">
            {Math.min(currentIndex + 1, profiles.length)} / {profiles.length}
          </span>
          <span className="text-[10px] text-stone-400">• Jabalpur</span>
        </div>
      </div>

      {/* Card Stack Area */}
      <div className="relative w-full h-[620px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {!isDeckFinished && activeProfile ? (
            <motion.div
              key={activeProfile.id}
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ 
                x: 300, 
                opacity: 0, 
                rotate: 15,
                transition: { duration: 0.35 } 
              }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="w-full"
            >
              <ProfileCard
                profile={activeProfile}
                onPass={handleNext}
                onLike={() => {
                  handleNext();
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full flex flex-col items-center justify-center p-8 text-center rounded-[28px] bg-white border border-[#EAE2DA] shadow-luxury"
            >
              <div className="w-16 h-16 rounded-full bg-ivory-200 border border-gold/30 flex items-center justify-center mb-5 text-gold">
                <Clock className="w-8 h-8" />
              </div>

              <span className="text-[11px] font-semibold tracking-widest text-gold-dark uppercase mb-1">
                You are all caught up
              </span>
              <h3 className="font-serif text-2xl text-stone-900 mb-2">
                That&apos;s all for today&apos;s drop
              </h3>
              <p className="text-xs text-stone-600 max-w-xs leading-relaxed mb-6">
                Vouple eliminates infinite swiping to protect your dignity and intent. 
                Your next 5 curated Jabalpur matches unlock tomorrow at <strong className="text-stone-900">9:00 AM</strong>.
              </p>

              <div className="flex flex-col gap-2.5 w-full max-w-xs">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-obsidian text-white text-xs font-medium hover:bg-black transition-all shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gold" />
                  <span>Revisit Today&apos;s 5 Profiles</span>
                </button>

                {onOpenWaitlist && (
                  <button
                    type="button"
                    onClick={onOpenWaitlist}
                    className="w-full py-3 rounded-full border border-stone-300 text-stone-800 text-xs font-medium hover:bg-stone-50 transition-all"
                  >
                    Request Priority Cohort Access
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* High-Intent Connect Note Modal */}
      {noteModalOpen && activeProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-[24px] bg-white border border-[#EAE2DA] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-semibold text-gold-dark tracking-widest uppercase">
                  High-Intent Feature
                </span>
                <h4 className="font-serif text-lg text-stone-900">
                  Send a Connect Note to {activeProfile.name.split(" ")[0]}
                </h4>
              </div>
              <button 
                onClick={() => setNoteModalOpen(false)}
                className="text-stone-400 hover:text-stone-800 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {noteSent ? (
              <div className="py-8 flex flex-col items-center text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
                <h5 className="font-serif text-base text-stone-900">Connect Note Dispatched</h5>
                <p className="text-xs text-stone-500">
                  Your personalized note has been queued for {activeProfile.name.split(" ")[0]}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed">
                  Connect Notes bypass the regular queue and attach your message directly to their morning drop.
                </p>

                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                  <div className="text-[10px] text-stone-400 uppercase font-medium mb-0.5">
                    Answering Prompt
                  </div>
                  <div className="text-stone-700 italic">
                    &ldquo;{activeProfile.prompt_question}&rdquo;
                  </div>
                </div>

                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write a thoughtful, respectful note..."
                  rows={3}
                  className="w-full p-3 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold resize-none"
                />

                <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                  <span>Commitment fee:</span>
                  <span className="font-semibold text-stone-900 font-mono">₹99 (Direct intent gate)</span>
                </div>

                <button
                  type="button"
                  onClick={handleSendNote}
                  disabled={!noteText.trim()}
                  className="w-full py-3 rounded-full bg-obsidian text-gold-light hover:bg-black font-medium text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-gold" />
                  <span>Send Note with Verification Badge</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
