"use client";

import React from "react";
import { Clock, ShieldCheck, EyeOff, Sparkles, HeartHandshake, CheckCheck } from "lucide-react";

export const Pillars: React.FC = () => {
  const pillars = [
    {
      icon: Clock,
      title: "Daily 5 Drop at 9:00 AM",
      subtitle: "Mindful Pacing",
      description: "Every morning, our matching engine delivers five hyper-tailored profiles matching your values, education, and intent. Once you review them, your deck is locked until tomorrow.",
      tag: "Zero Doom-Scrolling"
    },
    {
      icon: ShieldCheck,
      title: "100% Verified Identities",
      subtitle: "Government ID + Live Photo",
      description: "No anonymous bots or catfish. Every member must pass an identity audit vetted by our community stewards before receiving the green Verified Jabalpur badge.",
      tag: "Vetted Community"
    },
    {
      icon: EyeOff,
      title: "Screenshot Shield™",
      subtitle: "Anti-Leak Protection",
      description: "Private conversations and photos are protected by an invisible, dynamic cryptographic watermark embedded with viewer credentials, preventing unauthorized sharing.",
      tag: "Total Discretion"
    },
    {
      icon: HeartHandshake,
      title: "Upfront Intent Timelines",
      subtitle: "Zero Guessing Games",
      description: "Know exactly where each person stands on marriage horizons (e.g. 12-18 months), family involvement, and non-negotiables before you ever exchange a word.",
      tag: "Radical Transparency"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-ivory relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EAE2DA] text-stone-700 text-xs font-semibold tracking-widest uppercase mb-3 shadow-sm">
            Architecture of Trust
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-obsidian tracking-tight mb-4">
            How Vouple protects your time, privacy, and future.
          </h2>
          <p className="text-base text-stone-600 font-light leading-relaxed">
            Four structural guardrails designed specifically for cultured Tier-2 communities where reputation, respect, and mutual intent matter deeply.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-[24px] bg-white border border-[#EAE2DA] shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-ivory-200 border border-gold/30 flex items-center justify-center text-obsidian mb-6 group-hover:bg-obsidian group-hover:text-gold transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-semibold text-gold-dark uppercase tracking-widest block mb-1">
                    {item.subtitle}
                  </span>

                  <h3 className="font-serif text-xl text-stone-900 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed font-light mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-stone-500">
                    {item.tag}
                  </span>
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
