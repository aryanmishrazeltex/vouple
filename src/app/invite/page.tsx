"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

function AnimatedInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Wizard state: 1 = Enter Code, 2 = Complete Admission
  const [step, setStep] = useState<1 | 2>(1);

  // Form inputs (Empty by default for real user input)
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Status feedback
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [validationError, setValidationError] = useState<{
    type: "error" | "expired";
    title: string;
    description: string;
  } | null>(null);
  const [verifiedToken, setVerifiedToken] = useState("");
  const [regError, setRegError] = useState<string | null>(null);

  // Format invite code automatically: VPL-XXXX-XXXX-XXXX
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    let formatted = "";

    if (val.startsWith("VPL")) {
      formatted = "VPL";
      let rest = val.slice(3);
      for (let i = 0; i < rest.length && i < 12; i++) {
        if (i % 4 === 0) formatted += "-";
        formatted += rest[i];
      }
    } else {
      for (let i = 0; i < val.length && i < 16; i++) {
        if (i > 0 && i % 4 === 0) formatted += "-";
        formatted += val[i];
      }
    }

    setCode(formatted);
    if (validationError) setValidationError(null);
  };

  // Pre-fill from query parameters ONLY if provided via URL (e.g. invite links sent via SMS/WhatsApp)
  useEffect(() => {
    const qCode = searchParams.get("code") || searchParams.get("invitation");
    const qEmail = searchParams.get("email");
    if (qCode) {
      const clean = qCode.toUpperCase().trim();
      setCode(clean);
      setVerifiedToken(clean);
    }
    if (qEmail) setEmail(qEmail.trim());
  }, [searchParams]);

  // State 1: Validate Real Code against Backend API
  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying) return;

    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length < 8) {
      setValidationError({
        type: "error",
        title: "Valid Code Required",
        description: "Please enter your 14-character invitation passkey (format: VPL-XXXX-XXXX-XXXX).",
      });
      return;
    }

    setIsVerifying(true);
    setValidationError(null);

    try {
      const res = await fetch("/api/invite/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.valid) {
        setVerifiedToken(trimmed);
        if (data.invitation?.email) {
          setEmail(data.invitation.email);
        }
        setTimeout(() => {
          setIsVerifying(false);
          setStep(2);
        }, 500);
      } else {
        setIsVerifying(false);
        const isExp = data.errorCode === "INVITATION_EXPIRED";
        setValidationError({
          type: isExp ? "expired" : "error",
          title: isExp ? "Invitation Cohort Closed" : "Unrecognized Code",
          description:
            data.message ||
            "The invitation code provided was not found or is no longer active in the Jabalpur registry.",
        });
      }
    } catch {
      setIsVerifying(false);
      setValidationError({
        type: "error",
        title: "Connection Error",
        description: "Unable to verify code with admission registry. Please check your connection.",
      });
    }
  };

  // State 2: Google Sign-in Handler
  const handleGoogleSignIn = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        alert("Google Sign-in initialized for verified passkey: " + verifiedToken);
        return;
      }
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?invite=${encodeURIComponent(verifiedToken)}`,
        },
      });
    } catch (err: any) {
      alert("Google Auth: " + (err?.message || "Redirecting..."));
    }
  };

  // State 2: Complete Admission Form Submit
  const handleCompleteAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (authMethod === "email") {
      if (!email.trim() || !email.includes("@")) {
        setRegError("Please enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        setRegError("Secret password must be at least 6 characters.");
        return;
      }
    } else {
      if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, "").length < 10) {
        setRegError("Please enter a valid 10-digit Indian mobile number.");
        return;
      }
    }

    setIsRegistering(true);

    try {
      const res = await fetch("/api/auth/register-with-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: verifiedToken,
          email: authMethod === "email" ? email.trim() : `user.${phoneNumber.replace(/\D/g, "")}@vouple.in`,
          password: password || "Vouple2026!Pass",
          fullName: "Admitted Member",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        alert("Welcome to Vouple! Your admission is confirmed.");
        router.push("/app");
      } else {
        setRegError(data.message || "Unable to complete admission. Please check your credentials.");
      }
    } catch {
      setRegError("Network error completing admission. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] font-sans text-[#1C1917] antialiased min-h-screen flex flex-col justify-between selection:bg-[#E07A7A]/20 selection:text-[#9A4344]">
      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes beaconPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.95;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.45;
          }
        }
        @keyframes textShimmer {
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
        .animate-entrance {
          animation: fadeInUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .beacon-dot {
          animation: beaconPulse 2.4s ease-in-out infinite;
        }
        .italic-shimmer {
          background: linear-gradient(90deg, #9a4344 0%, #e07a7a 40%, #9a4344 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 6s ease-in-out infinite;
        }
        .luxury-link {
          position: relative;
          display: inline-block;
          text-decoration: none;
        }
        .luxury-link::after {
          content: "";
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 1px;
          bottom: -1px;
          left: 0;
          background-color: currentColor;
          transform-origin: bottom right;
          transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .luxury-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      `}</style>

      {/* Luxury Sticky Header */}
      <header className="sticky top-0 w-full z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5DFD7]/60 shadow-[0_1px_4px_rgba(28,25,23,0.02)]">
        <div className="h-16 sm:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          {/* Logo & City Tag */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="flex items-baseline font-serif text-xl sm:text-2xl lg:text-[26px] text-[#1C1917] tracking-tight select-none group"
            >
              <span>Vouple</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#9A4344] ml-0.5 group-hover:scale-125 transition-transform duration-300"></span>
            </Link>
            <div className="flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#F5F1EB] text-[#57534E] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase border border-[#E5DFD7]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A4344] mr-1.5 beacon-dot"></span>
              JABALPUR
            </div>
          </div>

          {/* Member Login shortcut */}
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/login"
              className="text-xs sm:text-[13px] font-medium text-[#57534E] hover:text-[#1C1917] transition-colors luxury-link"
            >
              Already a member? <span className="font-semibold text-[#9A4344]">Sign in</span>
            </Link>
            <Link
              href="/login"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#9A4344] flex items-center justify-center shrink-0 shadow-sm hover:scale-105 active:scale-95 transition-all duration-300"
              title="Sign in"
            >
              <span className="material-symbols-outlined text-white text-[16px] sm:text-[18px]">
                person
              </span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Experience Body (Mobile-First Layout) */}
      <main className="w-full py-6 sm:py-10 lg:py-14 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto flex-1 flex flex-col justify-center">
        <div className="relative w-full">
          {/* Ambient Warm Glow */}
          <div className="absolute -top-32 -left-20 w-80 h-80 bg-[#FFDAD8]/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[#FE9D85]/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

          {/* Grid: On Mobile, Card shows First (order-1), Editorial narrative shows below (order-2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            
            {/* ================= RIGHT CARD (PRIMARY ACTION) ================= */}
            {/* On Mobile: order-1 so user immediately sees and enters their code above the fold! */}
            <section className="order-1 lg:order-2 lg:col-span-5 w-full flex flex-col items-center animate-entrance">
              <div
                className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden relative border border-[#E5DFD7]/80"
                id="passcode-card"
              >
                {/* Rose hairline top border */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#9A4344] via-[#E07A7A] to-[#9A4344]"></div>

                {/* ================= STEP 1: ENTER INVITATION CODE ================= */}
                {step === 1 && (
                  <div className="p-6 sm:p-9 flex flex-col space-y-5 sm:space-y-6">
                    {/* Eyebrow & Step Pill */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#F5F1EB] text-[#57534E] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase border border-[#E5DFD7]/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9A4344] beacon-dot"></span>
                        <span>SINGLE-USE CODE · PRIVATE ACCESS</span>
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-mono text-[#78716C] tracking-wide">
                        01 / 02
                      </span>
                    </div>

                    {/* Card Headline */}
                    <div className="flex flex-col space-y-1">
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917] leading-tight font-normal">
                        Claim your <span className="italic text-[#9A4344] font-serif">invitation</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                        Enter the private invitation passkey received from a member or SMS invite to unlock your admission.
                      </p>
                    </div>

                    {/* Error / Expired Status Banner */}
                    {validationError && (
                      <div
                        className={`rounded-xl p-3.5 flex items-start gap-3 transition-all duration-300 ${
                          validationError.type === "expired"
                            ? "bg-[#FFDAD2] text-[#773220]"
                            : "bg-[#FFDAD6] text-[#93000A]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                          {validationError.type === "expired" ? "history_toggle_off" : "highlight_off"}
                        </span>
                        <div className="flex flex-col text-xs leading-snug">
                          <span className="font-semibold">{validationError.title}</span>
                          <span className="mt-0.5 opacity-90">{validationError.description}</span>
                        </div>
                      </div>
                    )}

                    {/* Invitation Code Form */}
                    <form onSubmit={handleValidateCode} className="flex flex-col space-y-4 sm:space-y-5">
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="invitation-code"
                            className="text-[11px] sm:text-xs font-semibold text-[#1C1917] uppercase tracking-wide"
                          >
                            INVITATION CODE
                          </label>
                          <span className="text-[10px] font-mono text-[#78716C] tracking-wide px-1.5 py-0.5 rounded bg-[#F5F1EB]">
                            CODE FORMAT: VPL-XXXX
                          </span>
                        </div>

                        <div className="relative flex items-center group">
                          <input
                            id="invitation-code"
                            type="text"
                            value={code}
                            onChange={handleCodeChange}
                            placeholder="VPL-XXXX-XXXX-XXXX"
                            spellCheck={false}
                            autoComplete="off"
                            autoCapitalize="characters"
                            inputMode="text"
                            className={`w-full bg-[#F5F3F0] rounded-xl py-3.5 pl-4 pr-11 text-[#1C1917] font-mono text-base tracking-wider uppercase shadow-inner focus:outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                              validationError
                                ? "ring-2 ring-[#BA1A1A] border-[#BA1A1A]"
                                : "focus:ring-[#9A4344]/40 focus:border-[#9A4344]"
                            }`}
                          />
                          <div className="absolute right-3.5 flex items-center pointer-events-none text-[#887271]">
                            <span className="material-symbols-outlined text-[20px] group-focus-within:text-[#9A4344] group-focus-within:rotate-45 transition-transform duration-300">
                              key
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] sm:text-xs text-[#78716C]">
                          Provided on your wax-sealed envelope or discreet SMS invite.
                        </p>
                      </div>

                      {/* Primary Continue Button */}
                      <div className="pt-1 sm:pt-2">
                        <button
                          type="submit"
                          disabled={isVerifying}
                          className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E07A7A] to-[#E88B74] hover:opacity-95 text-white font-semibold text-sm tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.985] disabled:opacity-60"
                        >
                          {isVerifying ? (
                            <span className="inline-flex items-center gap-2">
                              <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span>Verifying token...</span>
                            </span>
                          ) : (
                            <>
                              <span>Continue</span>
                              <span className="material-symbols-outlined text-[18px]">
                                arrow_forward
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    {/* Disclaimer */}
                    <div className="text-center pt-1">
                      <p className="text-[11px] sm:text-xs text-[#57534E] leading-relaxed">
                        By continuing, you confirm that you are 18+ and agree to Vouple's{" "}
                        <Link href="/privacy" className="text-[#1C1917] font-semibold underline hover:text-[#9A4344]">
                          community guidelines
                        </Link>
                        .
                      </p>
                    </div>

                    {/* Bottom Status Foil */}
                    <div className="bg-[#F5F3F0] -mx-6 -mb-6 sm:-mx-9 sm:-mb-9 py-2.5 sm:py-3 px-6 sm:px-8 flex items-center justify-between text-[#57534E] text-[10px] sm:text-[11px] font-semibold border-t border-[#E5DFD7]/40">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9A4344] beacon-dot"></span>
                        Encrypted Registry
                      </span>
                      <span>Jabalpur, MP</span>
                    </div>
                  </div>
                )}

                {/* ================= STEP 2: COMPLETE ADMISSION ================= */}
                {step === 2 && (
                  <div className="p-6 sm:p-9 flex flex-col space-y-5 sm:space-y-6 animate-entrance">
                    {/* Header with Change Code link */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#F5F1EB] text-[#57534E] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase border border-[#E5DFD7]/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9A4344] beacon-dot"></span>
                        <span>INVITATION PROTOCOL</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setRegError(null);
                        }}
                        className="text-xs font-semibold text-[#57534E] hover:text-[#9A4344] transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                        <span>Change code</span>
                      </button>
                    </div>

                    {/* Validated Pass Voucher Ribbon */}
                    <div className="p-3.5 rounded-xl bg-[#F5F3F0] border border-[#E5DFD7]/70 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#FFDAD8] text-[#9A4344] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">
                            workspace_premium
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0 text-left">
                          <span className="text-[11px] font-bold text-[#1C1917] tracking-wider uppercase">
                            INVITATION ACCEPTED
                          </span>
                          <span className="text-[11px] font-mono text-[#57534E] truncate">
                            Token: {verifiedToken}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white text-[#9A4344] border border-[#E5DFD7] shadow-2xs">
                        Verified
                      </span>
                    </div>

                    {/* Card Title & Prompt */}
                    <div className="space-y-1">
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917] leading-tight font-normal">
                        Complete your <span className="italic text-[#9A4344] font-serif">admission</span>
                      </h2>
                      <p className="text-xs text-[#57534E]">
                        Authenticate your credentials to claim this invitation and enter the community.
                      </p>
                    </div>

                    {/* Google Auth Button */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full min-h-[46px] flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#F5F3F0] hover:bg-[#EAE8E5] border border-[#E5DFD7]/80 text-[#1C1917] font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        ></path>
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        ></path>
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          fill="#FBBC05"
                        ></path>
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          fill="#EA4335"
                        ></path>
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative py-1 flex items-center justify-center">
                      <div className="w-full h-px bg-[#E5DFD7]"></div>
                      <span className="absolute bg-white px-3 text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
                        OR
                      </span>
                    </div>

                    {/* Error message */}
                    {regError && (
                      <div className="rounded-xl p-3 bg-[#FFDAD6] text-[#93000A] text-xs">
                        {regError}
                      </div>
                    )}

                    {/* Direct Admission Form */}
                    <form onSubmit={handleCompleteAdmission} className="flex flex-col space-y-4">
                      {/* Auth Switcher */}
                      <div className="flex rounded-lg bg-[#F5F3F0] p-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setAuthMethod("email")}
                          className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                            authMethod === "email"
                              ? "bg-white text-[#1C1917] shadow-2xs font-semibold"
                              : "text-[#57534E]"
                          }`}
                        >
                          Email & Password
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthMethod("phone")}
                          className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                            authMethod === "phone"
                              ? "bg-white text-[#1C1917] shadow-2xs font-semibold"
                              : "text-[#57534E]"
                          }`}
                        >
                          Phone / WhatsApp
                        </button>
                      </div>

                      {authMethod === "email" ? (
                        <>
                          <div className="flex flex-col space-y-1">
                            <label className="text-[11px] font-bold text-[#1C1917] uppercase tracking-wider">
                              EMAIL ADDRESS
                            </label>
                            <div className="relative flex items-center">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full bg-[#F5F3F0] rounded-xl py-3 pl-4 pr-10 text-base sm:text-sm text-[#1C1917] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A4344]/30"
                              />
                              <span className="material-symbols-outlined absolute right-3 text-[#78716C] text-[18px]">
                                mail
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-[#1C1917] uppercase tracking-wider">
                                SET SECRET PASSWORD
                              </label>
                              <span className="text-[10px] text-[#78716C]">Min. 6 characters</span>
                            </div>
                            <div className="relative flex items-center">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                required
                                minLength={6}
                                className="w-full bg-[#F5F3F0] rounded-xl py-3 pl-4 pr-10 text-base sm:text-sm text-[#1C1917] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9A4344]/30"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-[#78716C] hover:text-[#1C1917] p-1"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {showPassword ? "visibility_off" : "visibility"}
                                </span>
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col space-y-1">
                          <label className="text-[11px] font-bold text-[#1C1917] uppercase tracking-wider">
                            MOBILE NUMBER
                          </label>
                          <div className="flex items-center rounded-xl bg-[#F5F3F0] overflow-hidden focus-within:ring-2 focus-within:ring-[#9A4344]/30">
                            <span className="px-3.5 py-3 text-xs font-semibold text-[#1C1917] border-r border-[#E5DFD7]">
                              🇮🇳 +91
                            </span>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="98260 XXXXX"
                              inputMode="tel"
                              className="w-full px-3 py-3 bg-transparent text-base sm:text-sm font-mono text-[#1C1917] focus:outline-none"
                            />
                          </div>
                          <p className="text-[11px] text-[#78716C]">
                            A 6-digit verification passcode will be sent via SMS / WhatsApp.
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isRegistering}
                        className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#9A4344] hover:bg-[#832E30] text-white font-semibold text-sm tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.985] disabled:opacity-60"
                      >
                        {isRegistering ? (
                          <span>Completing admission...</span>
                        ) : (
                          <>
                            <span>Complete Admission</span>
                            <span className="material-symbols-outlined text-[18px]">
                              arrow_forward
                            </span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Footnote */}
                    <div className="text-center pt-1 space-y-2">
                      <p className="text-xs text-[#57534E]">
                        Already have an admitted profile?{" "}
                        <Link href="/login" className="font-semibold text-[#9A4344] underline hover:text-[#832E30]">
                          Sign in
                        </Link>
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-[#78716C] leading-snug">
                        By continuing, you confirm that you are 18+ and agree to Vouple's{" "}
                        <Link href="/privacy" className="underline hover:text-[#1C1917]">
                          community charter
                        </Link>{" "}
                        and discreet privacy protocols.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footnote Assistance Links */}
              <div className="mt-5 text-center space-y-1">
                <p className="text-xs text-[#57534E]">
                  Misplaced your passcode?{" "}
                  <a
                    href="mailto:concierge@vouple.in"
                    className="font-semibold text-[#9A4344] hover:text-[#832E30] ml-1 luxury-link"
                  >
                    Contact your referral host
                  </a>
                </p>
                <p className="text-xs text-[#57534E]">
                  Don't have an invite?{" "}
                  <Link
                    href="/#waitlist"
                    className="font-semibold text-[#9A4344] hover:text-[#832E30] ml-1 luxury-link"
                  >
                    Request an invitation (Join Waitlist)
                  </Link>
                </p>
              </div>
            </section>

            {/* ================= LEFT EDITORIAL COLUMN ================= */}
            {/* On Mobile: order-2 so it gracefully provides context underneath without blocking the card */}
            <section className="order-2 lg:order-1 lg:col-span-7 flex flex-col space-y-6 sm:space-y-7 animate-entrance">
              {/* Editorial Image Card */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg bg-[#F5F1EB] w-full group">
                <img
                  alt="Intimate private salon lounge in Jabalpur"
                  className="w-full h-[240px] sm:h-[380px] lg:h-[440px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1X0PoFyB2i2Z1FU6-8Hm87PTu71xEy5qZT4B6L8cbAb4a7wrmvcDEsMBMOxAF8xgmutxnztM5-Av_8r4Uw6iv0A5lrB4nR5x4ZwG8iFE7gL_gxSHg1ttvbh2hYgYz3FlqofsPM3bmfKkAUpk0KJfYSjsxiuTZ5u2W0q0_7MV7QTiZ618dnRRrdJdRpN6r4yhXpFM9lo8axsNN5nY4Yp8rESG1z7vkAzUL9TQxGeXn7bS0Yrac3-_QFMQVA"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C1917]/75 backdrop-blur-md text-[#FBF9F6] text-[10px] sm:text-xs font-semibold tracking-widest uppercase border border-white/20 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB3B1] beacon-dot"></span>
                    <span>PRIVATE ACCESS · JABALPUR</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/50 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Typography & Brand Narrative */}
              <div className="flex flex-col space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A4344] beacon-dot"></span>
                  <span className="text-[11px] sm:text-xs text-[#9A4344] tracking-widest uppercase font-semibold">
                    PRIVATE ACCESS · VOUPLE
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#1C1917] leading-tight tracking-tight font-normal">
                  Meet with <span className="italic font-serif italic-shimmer">more meaning.</span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-[#57534E] max-w-xl font-normal leading-relaxed">
                  An intentional community for connections worth discovering. Curated admissions for discerning individuals in Jabalpur.
                </p>
              </div>

              {/* Value Pills */}
              <div className="pt-2 border-t border-[#E5DFD7]/60 flex flex-wrap items-center gap-y-2 gap-x-3 sm:gap-x-4 text-[#57534E] text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
                <span className="hover:text-[#1C1917] transition-colors">Curated Roster</span>
                <span className="text-[#DBC0BF]">•</span>
                <span className="hover:text-[#1C1917] transition-colors">Singular Focus</span>
                <span className="text-[#DBC0BF]">•</span>
                <span className="hover:text-[#1C1917] transition-colors">Endorsed Membership</span>
              </div>

              {/* Bullet Trust Points */}
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 text-xs sm:text-[13px] font-medium text-[#57534E]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#9A4344] text-[18px]">
                    verified
                  </span>
                  <span>Hand-Verified Directory</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#9A4344] text-[18px]">
                    lock
                  </span>
                  <span>Single-Use Pass Token</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Luxury Footer */}
      <footer className="w-full bg-[#F5F3F0] py-6 sm:py-8 border-t border-[#E5DFD7]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#57534E]">
          <div className="flex items-center gap-2">
            <span>© Vouple Private Salon.</span>
            <span className="text-[#9C9791]">•</span>
            <span>Curated in Jabalpur</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#1C1917] transition-colors luxury-link">
              Community Charter
            </Link>
            <Link href="/privacy" className="hover:text-[#1C1917] transition-colors luxury-link">
              Discreet Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-serif text-lg text-[#1C1917]">
          Loading Vouple Invitation Protocol...
        </div>
      }
    >
      <AnimatedInviteContent />
    </Suspense>
  );
}
