"use client";

import React from "react";
import { XCircle, CheckCircle2, ShieldAlert, Award } from "lucide-react";

export const Manifesto: React.FC = () => {
  return (
    <section id="manifesto" className="py-20 md:py-28 bg-[#F4EFEA] border-y border-[#EAE2DA] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/60 text-stone-700 text-xs font-semibold tracking-widest uppercase mb-3">
            The Philosophy
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-obsidian tracking-tight mb-4">
            Why modern dating is broken, and what we are doing about it.
          </h2>
          <p className="text-base text-stone-600 font-light leading-relaxed">
            Mainstream dating apps are built like slot machines. They monetize your loneliness by keeping you trapped in infinite swipes. Vouple was engineered for permanence.
          </p>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* The Casual Swipe Apps */}
          <div className="p-8 rounded-[28px] bg-white/70 border border-stone-300/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6 text-rose-deep font-serif text-xl">
                <ShieldAlert className="w-5 h-5 text-rose-deep" />
                <span>The Conventional Swipe Apps</span>
              </div>

              <ul className="space-y-4 text-stone-600 text-sm">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-deep shrink-0 mt-0.5" />
                  <span><strong>Mindless infinite scrolling</strong> designed to maximize app addiction rather than meaningful life partnerships.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-deep shrink-0 mt-0.5" />
                  <span><strong>Zero intent clarity:</strong> You waste months discovering if the other person wants marriage, a casual fling, or just Instagram followers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-deep shrink-0 mt-0.5" />
                  <span><strong>Fear of reputation leaks:</strong> Anyone can take screenshots of your photos and chats to share in private WhatsApp groups.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-deep shrink-0 mt-0.5" />
                  <span><strong>Rampant ghosting and low-effort texts:</strong> Men send 500 &quot;Hey&quot;s; women get overwhelmed with low-quality spam.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-200 text-xs text-stone-500 italic">
              Result: Burnout, cynicism, and zero high-intent matches in Tier-2 communities.
            </div>
          </div>

          {/* The Vouple Standard */}
          <div className="p-8 rounded-[28px] bg-obsidian text-white border border-gold/40 shadow-luxury-lg flex flex-col justify-between relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 text-gold font-serif text-xl">
                <Award className="w-5 h-5 text-gold" />
                <span>The Vouple Standard</span>
              </div>

              <ul className="space-y-4 text-stone-200 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span><strong>Daily 5 Curated Matches at 9 AM:</strong> Intentional pacing. You review five thoughtful profiles, make your choice, and go live your day.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span><strong>Upfront Intent Timelines:</strong> Every profile states their horizon (&quot;Marriage in 1-2 years&quot;) before you connect.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span><strong>Screenshot Shield™ Technology:</strong> Dynamic invisible/subtle watermarking prevents leaks and protects family dignity.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span><strong>High-Intent Connect Notes:</strong> Meaningful micro-commitments (₹99) ensure messages are respectful, genuine, and prioritized.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-gold-light italic relative z-10">
              Result: High signal-to-noise ratio, genuine emotional safety, and real lifelong compatibility.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
