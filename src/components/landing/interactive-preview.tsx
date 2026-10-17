"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Send, 
  CheckCheck, 
  ArrowRight, 
  Smartphone, 
  Shield, 
  UserCheck 
} from "lucide-react";

export const InteractivePreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"chat" | "deck" | "admin">("chat");

  return (
    <section id="safety" className="py-20 md:py-28 bg-[#F4EFEA] border-t border-[#EAE2DA] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/60 text-stone-700 text-xs font-semibold tracking-widest uppercase mb-3">
            Product Technology
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-obsidian tracking-tight mb-4">
            See the technology in action.
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
            Experience our patent-pending Screenshot Shield™, the high-intent chat system, and our community verification engine.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-white border border-[#EAE2DA] shadow-sm gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "chat"
                  ? "bg-obsidian text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-gold" />
              <span>Screenshot Shield™ Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "admin"
                  ? "bg-obsidian text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Identity Verification Audit</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("deck")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "deck"
                  ? "bg-obsidian text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Intent Milestones</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="max-w-2xl mx-auto">
          {activeTab === "chat" && (
            <div className="rounded-[28px] bg-white border border-[#EAE2DA] shadow-luxury-lg overflow-hidden animate-fadeIn">
              {/* Chat Header */}
              <div className="p-4 bg-obsidian text-white flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/40 relative">
                    <Image
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                      alt="Dr. Aarohi"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-sm font-medium">Dr. Aarohi Sharma</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-[10px] text-stone-400">Civil Lines • Marriage in 12-18 mos</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Shield Active</span>
                </div>
              </div>

              {/* Watermarked Message Area */}
              <div className="p-6 bg-ivory-100 min-h-[340px] relative flex flex-col justify-between overflow-hidden">
                {/* Dynamic Watermark Layer - Anti Screenshot Leak */}
                <div className="absolute inset-0 select-none pointer-events-none flex flex-wrap gap-12 p-4 opacity-[0.06] text-black font-mono text-[11px] transform -rotate-12 leading-relaxed">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i}>VOUPLE-ID: +91-9826******</span>
                  ))}
                </div>

                {/* Conversation bubbles */}
                <div className="space-y-4 relative z-10">
                  {/* Security Notice */}
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[10px] text-amber-800">
                      🛡️ End-to-end encrypted • Watermarked to +91-9826******
                    </span>
                  </div>

                  {/* Bubble 1 */}
                  <div className="flex flex-col items-start max-w-[80%]">
                    <div className="p-3.5 rounded-2xl rounded-tl-sm bg-white border border-[#EAE2DA] text-xs text-stone-800 shadow-sm leading-relaxed">
                      Hello! I read your answer regarding Haruki Murakami and Dal Bafla at Sadar. That was genuinely refreshing.
                    </div>
                    <span className="text-[9px] text-stone-400 mt-1 pl-1">Aarohi • 10:14 AM</span>
                  </div>

                  {/* Bubble 2 */}
                  <div className="flex flex-col items-end ml-auto max-w-[80%]">
                    <div className="p-3.5 rounded-2xl rounded-tr-sm bg-obsidian text-white text-xs shadow-sm leading-relaxed">
                      Thank you Aarohi. I saw you are completing pediatric residency at NSCB. My sister graduated from there as well!
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-stone-400 mt-1 pr-1">
                      <span>10:16 AM</span>
                      <CheckCheck className="w-3 h-3 text-emerald-500" />
                    </div>
                  </div>

                  {/* High Intent Prompt Milestone */}
                  <div className="p-3 rounded-xl bg-gold/10 border border-gold/30 text-xs text-stone-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-stone-900 block text-[11px]">Mutual Horizon Match</span>
                      <span className="text-[11px] text-stone-600">Both profiles looking for marriage in 12–18 months.</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-gold-dark font-bold">100% ALIGNED</span>
                  </div>
                </div>

                {/* Mock Input Bar */}
                <div className="pt-4 border-t border-[#EAE2DA] flex items-center gap-2 relative z-10">
                  <div className="flex-1 py-2.5 px-4 rounded-full bg-white border border-[#EAE2DA] text-xs text-stone-400">
                    Write a thoughtful message...
                  </div>
                  <button className="w-9 h-9 rounded-full bg-obsidian text-gold flex items-center justify-center">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "admin" && (
            <div className="rounded-[28px] bg-white border border-[#EAE2DA] shadow-luxury-lg p-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-5">
                <div>
                  <span className="text-[10px] font-semibold text-gold-dark uppercase tracking-widest block">
                    Community Trust Protocol
                  </span>
                  <h4 className="font-serif text-lg text-stone-900">
                    Manual Identity Verification (Mama Audit)
                  </h4>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Audit Pass Rate: 34%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-stone-900">Government Identity Authentication</h5>
                    <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                      Aadhaar / Voter ID verification cross-referenced with full legal name, date of birth, and residency.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-stone-900">Live Video/Selfie Liveness Verification</h5>
                    <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                      Ensures the individual behind the screen exactly matches their 3:4 portrait card, eliminating catfishing 100%.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-stone-900">Family & Intent Declaration</h5>
                    <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                      Verified timeline and family openness commitments ensure zero bad actors enter the Jabalpur cohort.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "deck" && (
            <div className="rounded-[28px] bg-white border border-[#EAE2DA] shadow-luxury-lg p-6 animate-fadeIn">
              <div className="pb-4 border-b border-stone-200 mb-5">
                <span className="text-[10px] font-semibold text-gold-dark uppercase tracking-widest block">
                  Transparency Engine
                </span>
                <h4 className="font-serif text-lg text-stone-900">
                  Upfront Milestones & Non-Negotiables
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-ivory-100 border border-[#EAE2DA]">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">Category 01</span>
                  <h5 className="font-serif text-sm text-stone-900 font-semibold mb-1">Marriage Horizon</h5>
                  <p className="text-xs text-stone-600">
                    Explicit timeline tags: &quot;Within 12 months&quot;, &quot;1-2 years&quot;, or &quot;Committed courtship&quot;.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-ivory-100 border border-[#EAE2DA]">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">Category 02</span>
                  <h5 className="font-serif text-sm text-stone-900 font-semibold mb-1">Geographic Rooting</h5>
                  <p className="text-xs text-stone-600">
                    Clarifies whether the candidate is settled in Jabalpur or planning relocation to metro hubs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-ivory-100 border border-[#EAE2DA]">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">Category 03</span>
                  <h5 className="font-serif text-sm text-stone-900 font-semibold mb-1">Family Involvement</h5>
                  <p className="text-xs text-stone-600">
                    Transparent expectations around when families are introduced into the conversation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-ivory-100 border border-[#EAE2DA]">
                  <span className="text-[10px] font-mono text-stone-400 uppercase">Category 04</span>
                  <h5 className="font-serif text-sm text-stone-900 font-semibold mb-1">Career & Ambition</h5>
                  <p className="text-xs text-stone-600">
                    Verified degrees (NSCB, IIITDM, NLIU, BITS) and professional credentials.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
