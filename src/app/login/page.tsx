"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 1. Continue with Google
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/app`,
        },
      });

      if (oAuthError) {
        setError(oAuthError.message || "Unable to sign in with Google.");
        setGoogleLoading(false);
      }
    } catch {
      setError("Network error connecting to Google Auth.");
      setGoogleLoading(false);
    }
  };

  // 2. Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        if (signInError.message.toLowerCase().includes("invalid login credentials")) {
          setError("Invalid email address or password. Please verify your credentials.");
        } else if (signInError.message.toLowerCase().includes("email not confirmed")) {
          setError("Email not confirmed. Please check your inbox for the verification email.");
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push("/app");
      }
    } catch {
      setError("Network error while connecting to authentication service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-[#1D1B19] font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-[#AF2244] selection:text-white overflow-x-clip">
      {/* Stitch Keyframes & Micro-Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes brandPulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(175, 34, 68, 0.45);
          }
          50% {
            transform: scale(1.15);
            box-shadow: 0 0 12px 3px rgba(209, 61, 91, 0.55);
          }
        }
        @keyframes shimmerGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-entrance-header {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-entrance-left {
          animation: fadeInUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.12s forwards;
          opacity: 0;
        }
        .animate-entrance-card {
          animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.22s forwards;
          opacity: 0;
        }
        .animate-entrance-footer {
          animation: fadeInUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards;
          opacity: 0;
        }
        .brand-dot-pulse {
          animation: brandPulse 3.2s ease-in-out infinite;
        }
        .editorial-shimmer {
          background-size: 200% 200%;
          animation: shimmerGradient 7s ease infinite;
        }
        .custom-input {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-input:focus {
          background-color: #ffffff;
          border-color: rgba(209, 61, 91, 0.6);
          box-shadow: 0 0 0 4px rgba(209, 61, 91, 0.12),
            0 2px 8px -2px rgba(175, 34, 68, 0.08);
        }
        .active-press:active {
          transform: scale(0.985);
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-entrance-header,
          .animate-entrance-left,
          .animate-entrance-card,
          .animate-entrance-footer,
          .brand-dot-pulse,
          .editorial-shimmer {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Main Responsive Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex flex-col justify-between min-h-screen">
        
        {/* Top Micro Brand Status Header */}
        <header className="animate-entrance-header flex items-center justify-between pb-5 mb-4 sm:mb-8 border-b border-[#ECE7E3]/80">
          <Link href="/" className="flex items-baseline space-x-0.5 group focus:outline-none">
            <span className="font-serif text-2xl font-semibold tracking-tight text-[#1D1B19] group-hover:text-stone-900 transition-colors duration-200">
              Vouple
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#AF2244] ml-0.5 brand-dot-pulse"></span>
          </Link>
        </header>

        {/* Main Split-Screen Architecture */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center flex-1 my-auto py-4">
          
          {/* Left Column: Editorial Identity & Atmospheric Storytelling */}
          <section className="animate-entrance-left lg:col-span-6 xl:col-span-7 flex flex-col justify-center pr-0 lg:pr-8 py-2">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 self-start mb-5 sm:mb-6 px-3 py-1 rounded-full bg-[#F3EDE9] border border-[#E0BEC1]/50 transition-transform duration-300 hover:scale-[1.02]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AF2244] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#AF2244]"></span>
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#594143]">
                Private Access · Jabalpur
              </span>
            </div>

            {/* Primary Headline */}
            <h1 className="font-serif text-[36px] sm:text-[46px] lg:text-[52px] font-medium text-[#1D1B19] leading-[1.12] tracking-tight max-w-xl">
              Meet with{" "}
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#AF2244] via-[#D13D5B] to-[#FF6B6B] pr-1 editorial-shimmer">
                more meaning.
              </span>
            </h1>

            {/* Supporting Editorial Prose */}
            <p className="mt-4 text-[15px] sm:text-[17px] text-[#594143] max-w-lg leading-relaxed font-normal">
              Thoughtful introductions, shaped by shared interests and what matters to you.
            </p>

            {/* Location Stamp */}
            <div className="mt-7 sm:mt-8 flex items-center gap-3 text-[13px] text-[#594143]/80">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8C7072] animate-pulse"></span>
              <span>Jabalpur, Madhya Pradesh · Strictly Adults 18+</span>
            </div>
          </section>

          {/* Right Column: Card Authentication Form */}
          <section className="animate-entrance-card lg:col-span-6 xl:col-span-5 w-full">
            <div className="relative bg-[#FFFDFB] rounded-[28px] sm:rounded-3xl border border-stone-200/90 shadow-[0_25px_60px_-15px_rgba(224,72,102,0.07),0_0_1px_1px_rgba(224,72,102,0.12),0_12px_24px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_-12px_rgba(224,72,102,0.11),0_0_1px_1px_rgba(224,72,102,0.16),0_16px_32px_-6px_rgba(0,0,0,0.05)] transition-shadow duration-500 p-6 sm:p-10 lg:p-11 ring-1 ring-black/[0.03]">
              
              {/* Ambient Corner Sheen Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#AF2244]/[0.08] via-[#FF6B6B]/[0.04] to-transparent rounded-tr-3xl pointer-events-none blur-2xl"></div>

              {/* Card Header & Status */}
              <div className="relative flex justify-between items-start mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-0.5 rounded-full bg-[#F3EDE9] border border-[#E0BEC1]/50 transition-all duration-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AF2244] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#AF2244]"></span>
                    </span>
                    <span className="text-[10.5px] uppercase tracking-[0.22em] text-[#AF2244] font-semibold">
                      Member Access
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight">
                    Welcome back.
                  </h2>
                </div>
              </div>

              <p className="text-[13.5px] text-stone-500 font-normal leading-relaxed mb-6 -mt-1">
                Sign in to continue your Vouple experience.
              </p>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3.5 rounded-xl border border-red-500/25 bg-red-500/10 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <span className="text-red-500 font-bold shrink-0">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Google Trusted Auth Button */}
              <button
                id="google-auth-btn"
                type="button"
                disabled={googleLoading || loading}
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white border border-stone-200/90 hover:border-stone-300/90 hover:bg-stone-50/80 hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all duration-200 text-stone-700 text-[13.5px] font-medium focus:outline-none focus:ring-2 focus:ring-[#AF2244]/25 active:translate-y-0 active:scale-[0.99] group cursor-pointer disabled:opacity-60"
              >
                {googleLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-stone-300 border-t-[#AF2244] rounded-full animate-spin"></span>
                    <span className="whitespace-nowrap font-medium tracking-wide">
                      Connecting to Google...
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="whitespace-nowrap font-medium tracking-wide">
                      Continue with Google
                    </span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200/70"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#FFFDFB] px-3.5 text-[10.5px] uppercase tracking-[0.22em] text-stone-400 font-medium select-none">
                    Or sign in with email
                  </span>
                </div>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4" id="vouple-login-form">
                {/* Email Field */}
                <div className="group/field space-y-1.5">
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider text-stone-600 group-focus-within/field:text-[#AF2244] transition-colors duration-200 cursor-pointer"
                    htmlFor="member-email"
                  >
                    Email address
                  </label>
                  <input
                    id="member-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aditi.sharma@example.com"
                    className="custom-input w-full px-4 py-2.5 rounded-xl bg-stone-50/70 text-[16px] sm:text-[14px] text-stone-900 placeholder:text-stone-400 border border-stone-200/90 focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Password Field */}
                <div className="group/field space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="block text-xs font-semibold uppercase tracking-wider text-stone-600 group-focus-within/field:text-[#AF2244] transition-colors duration-200 cursor-pointer"
                      htmlFor="member-password"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#AF2244] hover:text-[#AE2445] underline underline-offset-4 decoration-[#AF2244]/30 hover:decoration-[#AF2244] transition-all font-medium focus:outline-none rounded px-0.5"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      id="member-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="custom-input w-full pl-4 pr-11 py-2.5 rounded-xl bg-stone-50/70 text-[16px] sm:text-[14px] text-stone-900 placeholder:text-stone-400 border border-stone-200/90 focus:outline-none transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 text-stone-400 hover:text-stone-700 active:scale-90 focus:outline-none transition-all duration-150 p-1"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submission Trigger */}
                <button
                  id="submit-button"
                  type="submit"
                  disabled={loading || googleLoading}
                  className="active-press w-full mt-2.5 group relative flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-[14px] font-semibold text-white bg-gradient-to-r from-[#AF2244] via-[#D13D5B] to-[#FF6B6B] bg-[length:180%_auto] hover:bg-right hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] transition-all duration-300 shadow-[0_10px_26px_-4px_rgba(175,34,68,0.38)] hover:shadow-[0_16px_34px_-4px_rgba(175,34,68,0.52)] focus:outline-none focus:ring-2 focus:ring-[#AF2244]/40 focus:ring-offset-2 border border-white/25 cursor-pointer disabled:opacity-60"
                >
                  <span className="tracking-wide">
                    {loading ? "Authenticating..." : "Sign in"}
                  </span>
                  {!loading && (
                    <span className="text-base transition-transform duration-200 ease-out group-hover:translate-x-1.5">
                      →
                    </span>
                  )}
                </button>
              </form>

              {/* Card Subtle Divider */}
              <div className="my-5 border-t border-stone-200/70"></div>

              {/* Waitlist Concierge Prompt */}
              <div className="text-center">
                <p className="text-[13px] text-stone-500">
                  New to Vouple?{" "}
                  <Link
                    href="/"
                    className="group/link inline-flex items-center text-[#AF2244] font-medium hover:text-[#AE2445] transition-colors ml-1 focus:outline-none"
                  >
                    <span className="underline underline-offset-4 decoration-[#AF2244]/40 group-hover/link:decoration-[#AF2244] transition-all">
                      Join the Jabalpur waitlist
                    </span>
                    <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1 ml-0.5">
                      →
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Structural Hairline Footer Ledger */}
        <footer className="animate-entrance-footer mt-8 pt-6 border-t border-[#ECE7E3] flex flex-col md:flex-row items-center justify-between text-[13px] text-[#594143] gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            <span className="font-semibold tracking-wider text-[#1D1B19] uppercase text-[11px]">
              Vouple · Jabalpur, India
            </span>
            <span className="text-[#594143]/40 hidden sm:inline">|</span>
            <span>Private Access · Adults 18+ Only</span>
          </div>
          <div className="text-center md:text-right text-[#594143]/80 text-[12.5px]">
            <span>© 2026 Vouple. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
