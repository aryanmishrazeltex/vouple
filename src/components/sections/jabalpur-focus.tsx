"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, MapPin, Sparkles, Heart } from "lucide-react";

interface JabalpurFocusSectionProps {
  onJoinClick?: () => void;
}

const NEIGHBORHOODS = [
  "Wright Town",
  "Civil Lines",
  "Napier Town",
  "South Civil Lines",
  "Vijay Nagar",
  "Gorakhpur",
];

export const JabalpurFocusSection: React.FC<JabalpurFocusSectionProps> = ({ onJoinClick }) => {
  const cta = () => {
    if (onJoinClick) return onJoinClick();
    const el = document.getElementById("hero-email-input") || document.getElementById("waitlist-email-input");
    el?.focus();
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section
      id="jabalpur"
      className="py-20 sm:py-28 relative scroll-mt-20 overflow-hidden bg-[#0B0B0F]"
      aria-labelledby="jabalpur-headline"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Cinematic Photo of young couple laughing */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[36px] overflow-hidden border border-white/10 shadow-2xl group">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/couple.jpg"
                  alt="Couple laughing on a date in Jabalpur"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>

              {/* Floating Story Toast */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#12121A]/90 backdrop-blur-md border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-flame flex items-center justify-center shadow-lg">
                    <Heart className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">First Dates at Wright Town</p>
                    <p className="text-xs text-gray-300">Designed for real Jabalpur meetups</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#FFA034]">Context-First</span>
              </div>
            </div>
          </div>

          {/* Right: Local Culture & Launch Story */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#FF5E62] uppercase tracking-wider mb-4">
              <MapPin className="w-3.5 h-3.5 text-[#FF5E62]" />
              <span>Starting Right Here</span>
            </div>

            <h2
              id="jabalpur-headline"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5"
            >
              Made for Jabalpur. <br />
              <span className="gradient-text">Not Silicon Valley.</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
              Global dating apps treat tier-2 cities like an afterthought, matching you with ghost profiles 400 kilometers away. Vouple is handcrafted exclusively for Jabalpur&apos;s singles.
            </p>

            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Whether it&apos;s sunset drives to Bhedaghat Marble Rocks, Sunday filter coffee at Sadar, or late night conversations along the Narmada ghats—find someone who loves your city as much as you do.
            </p>

            {/* Neighborhood Pills */}
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Active Waitlist Across Jabalpur
              </p>
              <div className="flex flex-wrap gap-2">
                {NEIGHBORHOODS.map((hood) => (
                  <span
                    key={hood}
                    className="px-3 py-1.5 rounded-full bg-[#161622] border border-white/10 text-xs font-semibold text-gray-300"
                  >
                    📍 {hood}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={cta}
              className="px-7 py-3.5 rounded-full gradient-flame text-white text-sm font-bold shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Join Your Jabalpur Cohort</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
