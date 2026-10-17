"use client";

import React from "react";
import Link from "next/link";

interface NavbarProps {
  onSignIn?: () => void;
  onGetInvite?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSignIn, onGetInvite }) => {
  return (
    <header className="w-full px-6 py-6 md:px-12 flex items-center justify-between z-30">
      {/* Minimal Wordmark */}
      <Link href="/" className="group">
        <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-obsidian">
          Vouple<span className="text-gold">.</span>
        </span>
      </Link>

      {/* Single Subtle Right Action */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSignIn || onGetInvite}
          className="text-xs font-medium text-stone-600 hover:text-obsidian transition-colors px-4 py-2 rounded-full hover:bg-stone-200/50"
        >
          Sign In
        </button>
      </div>
    </header>
  );
};
