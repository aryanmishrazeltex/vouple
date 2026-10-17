"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, MessageCircle, User, Settings } from "lucide-react";
import { useVoupleStore } from "@/lib/store/vouple-store";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { matches } = useVoupleStore();

  const activeMatchesCount = matches.filter((m) => m.isActive).length;

  const navItems = [
    {
      href: "/app",
      label: "Discovery",
      icon: Sparkles,
      exact: true,
    },
    {
      href: "/app/matches",
      label: "Matches",
      icon: MessageCircle,
      badge: activeMatchesCount > 0 ? activeMatchesCount : undefined,
    },
    {
      href: "/app/profile",
      label: "Profile",
      icon: User,
    },
    {
      href: "/app/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="sticky bottom-0 z-40 w-full bg-[#101018]/95 backdrop-blur-xl border-t border-white/10 py-2 px-4 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
                isActive
                  ? "text-white scale-105"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-[#FF4458]" : "text-gray-400"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#FF4458] text-[9px] font-black text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-tight ${isActive ? "text-white" : "text-gray-400"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
