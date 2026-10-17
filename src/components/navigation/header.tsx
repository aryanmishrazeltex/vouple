"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, ArrowRight, Menu, X, Sparkles, ShieldCheck } from "lucide-react";

interface HeaderProps {
  onJoinClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onJoinClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCta = () => {
    setMenuOpen(false);
    if (onJoinClick) {
      onJoinClick();
    } else {
      const el = document.getElementById("hero-email-input") || document.getElementById("waitlist-email-input");
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#0B0B0F]/90 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/50"
          : "bg-transparent border-b border-white/5"
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2.5 group select-none" aria-label="Vouple home">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-flame flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform duration-200">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
              VOUPLE
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4458] animate-pulse"></span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFA034] -mt-1 hidden sm:block">
              Jabalpur · 18+
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300" aria-label="Primary">
          <button onClick={() => go("why-vouple")} className="hover:text-white transition-colors flex items-center gap-1.5">
            Why Vouple
          </button>
          <button onClick={() => go("experience")} className="hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF655B]" />
            Experience
          </button>
          <button onClick={() => go("safety")} className="hover:text-white transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Safety
          </button>
          <button onClick={() => go("faq")} className="hover:text-white transition-colors">
            FAQ
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Jabalpur VIP Waitlist Active</span>
          </div>

          <Link
            href="/app"
            className="hidden sm:inline-flex items-center gap-1.5 h-11 px-5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-bold transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#FF5E62]" />
            <span>Open App</span>
          </Link>

          <button
            onClick={handleCta}
            className="hidden sm:inline-flex items-center gap-2 h-11 px-6 rounded-full gradient-flame text-white text-sm font-bold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Get VIP Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#12121A]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Jabalpur Pioneer Cohort · 18+ Only</span>
          </div>
          <button onClick={() => go("why-vouple")} className="block w-full text-left py-2 text-base font-semibold text-gray-200">
            Why Vouple
          </button>
          <button onClick={() => go("experience")} className="block w-full text-left py-2 text-base font-semibold text-gray-200">
            The Experience
          </button>
          <button onClick={() => go("safety")} className="block w-full text-left py-2 text-base font-semibold text-gray-200">
            Safety & Verification
          </button>
          <button onClick={() => go("faq")} className="block w-full text-left py-2 text-base font-semibold text-gray-200">
            FAQ
          </button>
          <Link
            href="/app"
            onClick={() => setMenuOpen(false)}
            className="w-full h-12 rounded-full bg-white/10 border border-white/15 text-white text-sm font-bold flex items-center justify-center gap-2 mb-2"
          >
            <Sparkles className="w-4 h-4 text-[#FF5E62]" />
            <span>Open Member App</span>
          </Link>
          <button
            onClick={handleCta}
            className="w-full h-12 rounded-full gradient-flame text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25"
          >
            <span>Get VIP Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
