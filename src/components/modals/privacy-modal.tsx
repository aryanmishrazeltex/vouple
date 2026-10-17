"use client";

import React, { useEffect } from "react";
import { X, ShieldCheck, Lock } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#14141E] rounded-3xl border border-white/15 shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 id="privacy-modal-title" className="text-xl font-bold text-white tracking-tight">
                Privacy Notice
              </h3>
              <p className="text-xs text-gray-400">Vouple Safety & Confidentiality Commitment</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 text-sm text-gray-300 leading-relaxed">
          <div>
            <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
              <span>1. Information We Collect</span>
            </h4>
            <p className="text-xs sm:text-sm text-gray-400">
              During this VIP waitlist phase, we collect solely your <strong className="text-white">email address</strong>, your affirmation that you are <strong className="text-white">18 years or older</strong>, and your consent to receive private beta rollout notices.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-white mb-1">2. Zero Social Exposure</h4>
            <p className="text-xs sm:text-sm text-gray-400">
              Your waitlist status is 100% confidential. We never broadcast your signup to social networks or search engines.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-1">3. Zero Data Brokering</h4>
            <p className="text-xs sm:text-sm text-gray-400">
              We do not sell, rent, or trade your personal contact info to any advertisers or commercial brokers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-1">4. Opt-Out Anytime</h4>
            <p className="text-xs sm:text-sm text-gray-400">
              You can remove your email from our priority list anytime with a single click or by messaging <strong className="text-white">privacy@vouple.in</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-gray-400">Jabalpur Cohort #1</span>
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-6 rounded-full gradient-flame text-white text-xs font-bold shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
