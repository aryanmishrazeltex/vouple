"use client";

import React, { useState } from "react";
import { ArrowRight, Check, AlertCircle, Loader2, Sparkles, Flame, ShieldCheck } from "lucide-react";
import { WaitlistResponse } from "@/types/waitlist";

interface WaitlistFormProps {
  idPrefix?: string;
  onOpenPrivacy?: () => void;
  variant?: "default" | "dark";
  className?: string;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({
  idPrefix = "waitlist",
  onOpenPrivacy,
  variant = "default",
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [isAdult, setIsAdult] = useState(true); // default true for consumer convenience, can be toggled
  const [consentGiven, setConsentGiven] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successData, setSuccessData] = useState<{ message: string; position?: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateClient = (): boolean => {
    const errors: Record<string, string> = {};
    if (!email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!isAdult) errors.isAdult = "You must confirm you are 18 or older.";
    if (!consentGiven) errors.consentGiven = "Please accept the community guidelines.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!validateClient()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), isAdult, consentGiven }),
      });
      const data = (await res.json()) as WaitlistResponse;
      if (res.status === 201 && data.success) {
        setSubmitted(true);
        setSuccessData({ message: data.message });
      } else if (res.status === 409) {
        setErrorMessage("You're already on the VIP list! We will notify you when early access drops.");
      } else {
        setErrorMessage(data.message || "Something went wrong. Please try again.");
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
      }
    } catch {
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted && successData) {
    return (
      <div className={`p-6 rounded-3xl bg-gradient-to-br from-[#1C1C2B] to-[#12121A] border border-[#FF4458]/40 shadow-2xl animate-match-pop ${className}`} role="status">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl gradient-flame flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
              <span>You&apos;re In! Welcome to VIP</span>
              <Sparkles className="w-4 h-4 text-[#FFA034]" />
            </h4>
            <p className="text-xs text-gray-400">Jabalpur Pioneer Batch #1</p>
          </div>
        </div>

        <p className="text-sm text-gray-200 leading-relaxed mb-4">
          We&apos;ve reserved your priority spot with email <span className="text-white font-semibold underline decoration-[#FF4458]">{email}</span>. You get an exclusive 15-day Vouple Gold VIP pass for free when we open doors!
        </p>

        {successData.position && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>VIP Pioneer Rank: #{successData.position}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={`space-y-3.5 ${className}`} aria-label="Join Vouple VIP Waitlist">
      {/* Email input + CTA Button */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            id={`${idPrefix}-email-input`}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: "" }));
            }}
            placeholder="Enter your email for VIP access"
            disabled={loading}
            className={`w-full h-13 px-4 py-3.5 rounded-2xl text-sm font-medium bg-[#161622] text-white placeholder-gray-400 border transition-all outline-none ${
              fieldErrors.email
                ? "border-red-500 ring-2 ring-red-500/20"
                : "border-white/15 focus:border-[#FF5E62] focus:ring-2 focus:ring-[#FF5E62]/30"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-13 px-7 rounded-2xl gradient-flame text-white text-sm font-bold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Reserving...</span>
            </>
          ) : (
            <>
              <span>Get VIP Pass</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {fieldErrors.email && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{fieldErrors.email}</span>
        </p>
      )}

      {/* Compliance / 18+ checkboxes */}
      <div className="space-y-2 pt-1 text-xs text-gray-400">
        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={isAdult}
            onChange={(e) => {
              setIsAdult(e.target.checked);
              if (fieldErrors.isAdult) setFieldErrors((p) => ({ ...p, isAdult: "" }));
            }}
            disabled={loading}
            className="w-4 h-4 rounded bg-[#161622] border-white/20 text-[#FF4458] focus:ring-0 cursor-pointer accent-[#FF4458]"
          />
          <span className="group-hover:text-gray-200 transition-colors flex items-center gap-1">
            I confirm I am <strong className="text-white font-semibold">18 years or older</strong>.
          </span>
        </label>
        {fieldErrors.isAdult && <p className="text-xs text-red-400 pl-6">{fieldErrors.isAdult}</p>}

        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => {
              setConsentGiven(e.target.checked);
              if (fieldErrors.consentGiven) setFieldErrors((p) => ({ ...p, consentGiven: "" }));
            }}
            disabled={loading}
            className="w-4 h-4 rounded bg-[#161622] border-white/20 text-[#FF4458] focus:ring-0 cursor-pointer accent-[#FF4458]"
          />
          <span className="group-hover:text-gray-200 transition-colors">
            I agree to receive VIP updates.{" "}
            {onOpenPrivacy ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenPrivacy();
                }}
                className="underline text-gray-300 hover:text-white"
              >
                Privacy notice
              </button>
            ) : (
              <span className="underline">Privacy notice</span>
            )}
            .
          </span>
        </label>
        {fieldErrors.consentGiven && <p className="text-xs text-red-400 pl-6">{fieldErrors.consentGiven}</p>}
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </form>
  );
};
