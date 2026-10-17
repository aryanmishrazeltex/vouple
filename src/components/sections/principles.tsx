"use client";

import React from "react";
import { Sparkles, HeartHandshake, ShieldCheck, Flame } from "lucide-react";

const VALUES = [
  {
    icon: Flame,
    color: "text-[#FF4458]",
    bg: "bg-[#FF4458]/10 border-[#FF4458]/20",
    title: "Swipe Right on Real Chemistry",
    desc: "A pretty photo gets you curious. But knowing they love 90s rock, Sunday morning cycling, and filter coffee is what creates the spark.",
  },
  {
    icon: HeartHandshake,
    color: "text-[#FFA034]",
    bg: "bg-[#FFA034]/10 border-[#FFA034]/20",
    title: "Zero Mixed Signals",
    desc: "No more wondering 'Where is this going?' after 3 months. Everyone states their timeline upfront—whether looking for true love, committed partnership, or marriage.",
  },
  {
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    title: "Empowering & Safe by Design",
    desc: "Women set the pace. Private phone numbers, verified selfies, zero tolerance for disrespect, and immediate 1-tap blocking.",
  },
];

export const PrinciplesSection: React.FC = () => {
  return (
    <section
      id="principles"
      className="py-20 sm:py-28 relative scroll-mt-20 overflow-hidden"
      aria-labelledby="principles-headline"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#FF5E62] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 fill-[#FF5E62]" />
            <span>Our Core Standard</span>
          </div>
          <h2
            id="principles-headline"
            className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4"
          >
            Dating culture, <br />
            <span className="gradient-text">finally upgraded.</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            We are creating a modern dating space where young adults in Jabalpur feel respected, excited, and confident.
          </p>
        </div>

        {/* 3 Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="p-8 rounded-3xl bg-[#14141E] border border-white/5 hover:border-white/15 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${val.bg} border flex items-center justify-center mb-6`}>
                    <Icon className={`w-6 h-6 ${val.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {val.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {val.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF4458]"></span>
                  <span className="text-xs font-semibold text-gray-400">Vouple Promise</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
