"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "https://vouple-xzg9.vercel.app";
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${origin}/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setIsSent(true);
    } catch {
      setError("Network error while connecting to authentication service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B090A] text-[#EDE8E1] font-sans flex flex-col justify-between selection:bg-[#FF4458] selection:text-white">
      {/* Top Header */}
      <header className="w-full border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-gray-200">
            VOUPLE
          </span>
          <span className="w-2 h-2 rounded-full bg-[#FF4458]"></span>
        </Link>

        <Link
          href="/login"
          className="text-xs text-white/60 hover:text-white underline decoration-white/20 transition-colors"
        >
          ← Back to Sign In
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        <div className="bg-[#141216] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Password Recovery
            </h1>
            <p className="text-xs text-white/60">
              Enter your member email to receive password reset instructions.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isSent ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Check Your Inbox</h3>
                <p className="text-xs text-white/70">
                  If an account exists for <strong>{email}</strong>, Supabase Auth has queued a password reset email.
                </p>
              </div>
              <p className="text-[11px] text-white/40 pt-2">
                Note: If custom SMTP is unconfigured in Supabase Project Settings, default platform email quotas apply.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-block px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">
                  Member Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-white/5 border border-white/15 focus:border-[#ff4f78] rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ff4f78]/30"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ff4f78] to-[#b91348] text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#ff4f78]/20"
                >
                  {loading ? "Sending Request..." : "Send Reset Instructions"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-white/5 text-[11px] text-white/40">
        Vouple Private Dating Club · Jabalpur Cohort № 001 · 18+ Only
      </footer>
    </div>
  );
}
