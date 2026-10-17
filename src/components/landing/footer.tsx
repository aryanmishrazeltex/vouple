"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-obsidian text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold border border-gold/40">
                <span className="font-serif font-bold text-sm">V</span>
              </div>
              <span className="font-serif text-xl tracking-[0.18em] font-medium text-white uppercase">
                Vouple
              </span>
            </div>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              The high-intent, curated matchmaking platform for tier-2 India. Starting with deep trust in Jabalpur.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold text-gold tracking-widest uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><a href="#manifesto" className="hover:text-white transition-colors">The Anti-Swipe Manifesto</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Daily 5 Curation</a></li>
              <li><a href="#safety" className="hover:text-white transition-colors">Screenshot Shield™</a></li>
              <li><Link href="/feed" className="hover:text-gold text-stone-300 font-medium transition-colors">Web App Demo</Link></li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-xs font-semibold text-gold tracking-widest uppercase mb-4">Trust & Safety</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><span className="hover:text-white cursor-pointer">ID Verification Guidelines</span></li>
              <li><span className="hover:text-white cursor-pointer">Community Standards</span></li>
              <li><span className="hover:text-white cursor-pointer">Anti-Harassment Protocols</span></li>
              <li><span className="hover:text-white cursor-pointer">Mama Admin Audit Manual</span></li>
            </ul>
          </div>

          {/* Cohort Locations */}
          <div>
            <h4 className="text-xs font-semibold text-gold tracking-widest uppercase mb-4">Cohorts</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center justify-between">
                <span className="text-white font-medium">Jabalpur (Cohort #1)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">Live</span>
              </li>
              <li className="flex items-center justify-between text-stone-500">
                <span>Indore</span>
                <span className="text-[10px] text-stone-500">Waitlist Q2</span>
              </li>
              <li className="flex items-center justify-between text-stone-500">
                <span>Bhopal</span>
                <span className="text-[10px] text-stone-500">Waitlist Q3</span>
              </li>
              <li className="flex items-center justify-between text-stone-500">
                <span>Lucknow</span>
                <span className="text-[10px] text-stone-500">Planning</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Vouple Matchmaking Technologies. Built with intention in Jabalpur, MP.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Crafted for permanence</span>
            <Heart className="w-3.5 h-3.5 text-rose fill-rose" />
          </div>
        </div>
      </div>
    </footer>
  );
};
