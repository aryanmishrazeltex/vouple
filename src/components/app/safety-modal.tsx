"use client";

import React, { useState } from "react";
import { ShieldAlert, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ReportCategory } from "@/types/app";

interface SafetyModalProps {
  targetUserId: string;
  targetUserName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (category: ReportCategory, details: string) => void;
  onBlockOnly: () => void;
}

const CATEGORIES: { id: ReportCategory; label: string; desc: string }[] = [
  {
    id: "harassment",
    label: "Harassment or Disrespect",
    desc: "Inappropriate remarks, aggression, or unwanted pressure",
  },
  {
    id: "underage_concern",
    label: "Underage Account (< 18)",
    desc: "Suspected minor on adult-only platform",
  },
  {
    id: "impersonation_fake",
    label: "Fake Profile / Catfish",
    desc: "Using another person's photos or identity",
  },
  {
    id: "inappropriate_content",
    label: "Inappropriate Content",
    desc: "Explicit or offensive photos or prompts",
  },
  {
    id: "spam",
    label: "Spam or Commercial Solicitation",
    desc: "Promoting businesses, links, or soliciting funds",
  },
  {
    id: "other",
    label: "Other Safety Concern",
    desc: "Any other violation of Jabalpur community guidelines",
  },
];

export const SafetyModal: React.FC<SafetyModalProps> = ({
  targetUserName,
  isOpen,
  onClose,
  onSubmitReport,
  onBlockOnly,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>("harassment");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(selectedCategory, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-up"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-3xl bg-[#14141E] border border-white/10 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Safety & Reporting</h3>
              <p className="text-xs text-gray-400">Reporting {targetUserName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Report Submitted</h4>
            <p className="text-xs text-gray-300 max-w-xs mx-auto">
              Thank you. {targetUserName} has been immediately blocked from your discovery and messaging. Our moderation team has queued this incident.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <p className="text-xs text-gray-300">
              Select reason for reporting. Submitting a report will <strong className="text-white">automatically block</strong> this profile.
            </p>

            {/* Category selection */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    selectedCategory === cat.id
                      ? "bg-[#FF4458]/10 border-[#FF4458]/40"
                      : "bg-white/5 border-white/5 hover:border-white/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportCategory"
                    value={cat.id}
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.id)}
                    className="mt-1 accent-[#FF4458]"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{cat.label}</p>
                    <p className="text-[11px] text-gray-400">{cat.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Details input */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1 block">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Help our moderators understand what occurred..."
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-[#FF5E62]"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  onBlockOnly();
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:text-white"
              >
                Block Only (No Report)
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-500/20"
              >
                Submit Report & Block
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
