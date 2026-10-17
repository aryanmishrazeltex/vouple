"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app/app-header";
import { useVoupleStore } from "@/lib/store/vouple-store";
import { ShieldCheck, ArrowRight, Sparkles, CheckCircle2, AlertTriangle, Lock } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { verifyAdultAccess, updateProfile } = useVoupleStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [confirmedAdult, setConfirmedAdult] = useState(false);
  const [pledgeChecked, setPledgeChecked] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState("Intentional dating → Long-term partnership");

  const handleCompleteStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedAdult || !pledgeChecked) return;
    setStep(2);
  };

  const handleCompleteStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAdultAccess("prototype_audit_v1");
    updateProfile({ intentTimeline: selectedIntent });
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col justify-between">
      <AppHeader title="Adult Verification" />

      <main className="flex-1 max-w-md w-full mx-auto px-5 py-8 flex flex-col justify-center">
        
        {step === 1 ? (
          <div className="p-7 rounded-[36px] bg-[#14141E] border border-white/10 shadow-2xl space-y-6">
            
            <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFA034] block mb-1">
                Step 1 of 2 · Eligibility Gate
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Adult-Only Community
              </h1>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Vouple is strictly restricted to adults aged 18 and older. We maintain a zero-tolerance policy for minors and impersonation.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2 text-white font-bold">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verification & DPDP Standards</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Your verification status will be cryptographically audited. Underaged users attempting entry will be permanently denied access.
              </p>
            </div>

            <form onSubmit={handleCompleteStep1} className="space-y-4 pt-2">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedAdult}
                  onChange={(e) => setConfirmedAdult(e.target.checked)}
                  className="mt-0.5 accent-[#FF4458] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-gray-200 leading-snug">
                  I solemnly affirm that I am <strong className="text-white">18 years of age or older</strong>.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pledgeChecked}
                  onChange={(e) => setPledgeChecked(e.target.checked)}
                  className="mt-0.5 accent-[#FF4458] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-gray-200 leading-snug">
                  I agree to treat all members with respect, zero harassment, and authenticity.
                </span>
              </label>

              <button
                type="submit"
                disabled={!confirmedAdult || !pledgeChecked}
                className="w-full h-12 rounded-2xl gradient-flame text-white font-bold text-sm shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Continue to Intent Declaration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="p-7 rounded-[36px] bg-[#14141E] border border-white/10 shadow-2xl space-y-6">
            
            <div className="w-14 h-14 rounded-3xl gradient-flame flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Sparkles className="w-7 h-7 text-white fill-white" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFA034] block mb-1">
                Step 2 of 2 · Mutual Context
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">
                What are you looking for?
              </h1>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Vouple eliminates mixed signals. State your relationship timeline so you only connect with people who share your horizon.
              </p>
            </div>

            <form onSubmit={handleCompleteStep2} className="space-y-3">
              {[
                { id: "Intentional dating → Long-term partnership", label: "Intentional Dating", desc: "Dating with substance and long-term potential" },
                { id: "Marriage in 12–18 months", label: "Marriage within 12–18 months", desc: "Ready to settle down in Jabalpur with an equal partner" },
                { id: "Committed relationship", label: "Committed Relationship", desc: "Monogamous, deep partnership" },
                { id: "Looking for something real & intentional", label: "Exploring with Purpose", desc: "Open to seeing where mutual chemistry leads" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    selectedIntent === opt.id
                      ? "bg-[#FF4458]/10 border-[#FF4458]"
                      : "bg-white/5 border-white/5 hover:border-white/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="intent"
                    value={opt.id}
                    checked={selectedIntent === opt.id}
                    onChange={() => setSelectedIntent(opt.id)}
                    className="mt-1 accent-[#FF4458]"
                  />
                  <div>
                    <p className="text-sm font-bold text-white">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                </label>
              ))}

              <button
                type="submit"
                className="w-full h-12 rounded-2xl gradient-flame text-white font-bold text-sm shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
              >
                <span>Enter Vouple Discovery</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

      </main>

      <footer className="text-center py-4 text-xs text-gray-500">
        Jabalpur, MP · Adults 18+ Only
      </footer>
    </div>
  );
}
