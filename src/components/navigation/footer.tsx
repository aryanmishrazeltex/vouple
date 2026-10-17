"use client";

import React from "react";
import { Flame, Heart, ShieldCheck } from "lucide-react";

interface FooterProps {
  onOpenPrivacy?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy }) => {
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-[#09090D] py-14 sm:py-16 text-gray-400">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-flame flex items-center justify-center shadow-md">
                <Flame className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                VOUPLE
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Jabalpur&apos;s context-first dating app. Connecting verified 18+ singles through genuine mutual intent, shared tastes, and effortless icebreakers.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white font-semibold">18+ Only</span>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[#FF5E62] font-semibold">Jabalpur Cohort</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white">Explore</p>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => go("why-vouple")} className="hover:text-white transition-colors">
                  Why Vouple
                </button>
              </li>
              <li>
                <button onClick={() => go("experience")} className="hover:text-white transition-colors">
                  The Experience
                </button>
              </li>
              <li>
                <button onClick={() => go("safety")} className="hover:text-white transition-colors">
                  Safety & Verification
                </button>
              </li>
              <li>
                <button onClick={() => go("jabalpur")} className="hover:text-white transition-colors">
                  Jabalpur Launchpad
                </button>
              </li>
              <li>
                <button onClick={() => go("faq")} className="hover:text-white transition-colors">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white">Trust & Community</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Fake Accounts Policy</span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-white underline transition-colors"
                >
                  Privacy Notice & Guidelines
                </button>
              </li>
              <li className="text-xs text-gray-400 pt-2">
                Questions or early partnership inquiries: <br />
                <span className="text-white font-medium">founders@vouple.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Vouple Technologies. All rights reserved. 18+ adults only.</p>
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#FF4458] fill-[#FF4458]" />
            <span>for Jabalpur singles</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
