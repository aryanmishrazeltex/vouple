"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, MessageCircle, Heart, CheckCircle2, Coffee, Flame, ArrowRight } from "lucide-react";

interface Step {
  id: string;
  badge: string;
  title: string;
  desc: string;
  previewType: "prompts" | "match" | "meetup";
}

const STEPS: Step[] = [
  {
    id: "step-1",
    badge: "Step 01",
    title: "Craft your vibe, not just a bio",
    desc: "Pick your 3 favorite icebreaker prompts. Tell them where you get your favorite coffee in Jabalpur, your music taste, and what you're genuinely looking for.",
    previewType: "prompts",
  },
  {
    id: "step-2",
    badge: "Step 02",
    title: "Swipe on things that matter",
    desc: "Don't just like a face. Like their answer to 'A perfect Sunday in Jabalpur' or send a direct reply to their favorite playlist. Sparks start with conversation.",
    previewType: "match",
  },
  {
    id: "step-3",
    badge: "Step 03",
    title: "From chat to real coffee in 48 hours",
    desc: "We hate the endless 3-month pen-pal texting trap as much as you do. Vouple nudges you toward a relaxed, safe first meetup in Jabalpur's best spots.",
    previewType: "meetup",
  },
];

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="experience"
      className="py-20 sm:py-28 relative scroll-mt-20 overflow-hidden bg-[#0E0E15]"
      aria-labelledby="experience-headline"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#FFA034] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 fill-[#FFA034]" />
            <span>The Vouple Journey</span>
          </div>
          <h2
            id="experience-headline"
            className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4"
          >
            How you meet someone <br />
            <span className="gradient-text">you actually like.</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            No games. No ghost towns. Just intentional dating designed for young adults in Jabalpur.
          </p>
        </div>

        {/* 3 Step Cards in Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-7 rounded-3xl cursor-pointer transition-all duration-300 border ${
                activeStep === idx
                  ? "bg-gradient-to-b from-[#1E1B2E] to-[#14141E] border-[#FF4458]/40 shadow-xl shadow-pink-500/10 scale-[1.02]"
                  : "bg-[#14141E] border-white/5 hover:border-white/15"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-bold tracking-wider text-[#FFA034]">
                  {step.badge}
                </span>
                {idx === 0 && <Sparkles className="w-5 h-5 text-[#FF5E62]" />}
                {idx === 1 && <Heart className="w-5 h-5 text-[#FF4458] fill-[#FF4458]" />}
                {idx === 2 && <Coffee className="w-5 h-5 text-[#FFA034]" />}
              </div>

              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Live Interactive Step Showcase Box */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-[#14141E] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4458]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left explanation */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF5E62] mb-2 block">
                Feature Spotlight
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                {STEPS[activeStep].title}
              </h3>
              <p className="text-base text-gray-300 leading-relaxed mb-6">
                {STEPS[activeStep].desc}
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const el = document.getElementById("hero-email-input") || document.getElementById("waitlist-email-input");
                    el?.focus();
                    el?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="px-6 py-3 rounded-full gradient-flame text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Experience Early</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Free VIP invite on launch</span>
                </div>
              </div>
            </div>

            {/* Right visual preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] p-5 rounded-3xl bg-[#1C1C2B] border border-white/10 shadow-2xl space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                    <Image src="/images/riya.jpg" alt="Riya" width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-1">
                      <span>Riya, 23</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </p>
                    <p className="text-[11px] text-gray-400">Wright Town, Jabalpur</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#12121A] border border-white/5 space-y-1">
                  <p className="text-[11px] font-semibold text-[#FFA034]">Prompt: A perfect Jabalpur date</p>
                  <p className="text-xs text-gray-200 italic">&ldquo;Cold coffee at Sadar, then walking by the river talking about our favorite music.&rdquo;</p>
                </div>

                <div className="p-3 rounded-xl gradient-flame flex items-center justify-between shadow-lg">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 fill-white" />
                    <span>Send Icebreaker</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white">
                    Instant
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
