"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AppHeader } from "@/components/app/app-header";
import { BottomNav } from "@/components/app/bottom-nav";
import { useVoupleStore } from "@/lib/store/vouple-store";
import { MessageCircle, Sparkles, MapPin, CheckCircle2, ChevronRight, HeartHandshake } from "lucide-react";

export default function MatchesPage() {
  const { matches, isLoaded } = useVoupleStore();

  const activeMatches = matches.filter((m) => m.isActive);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF4458] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col justify-between">
      <AppHeader title="Matches & Chats" />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 sm:py-6">
        
        {/* Top summary banner */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              Mutual Connections
            </h1>
            <p className="text-xs text-gray-400">
              {activeMatches.length} active match{activeMatches.length === 1 ? "" : "es"} in Jabalpur
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FFA034]">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Mutual Intent</span>
          </div>
        </div>

        {/* Matches List */}
        {activeMatches.length > 0 ? (
          <div className="space-y-3">
            {activeMatches.map((match) => {
              const partner = match.partnerProfile;
              if (!partner) return null;

              return (
                <Link
                  key={match.id}
                  href={`/app/messages/${match.id}`}
                  className="p-4 rounded-3xl bg-[#14141E] border border-white/5 hover:border-white/15 transition-all flex items-center gap-4 group shadow-lg"
                >
                  {/* Avatar */}
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-gray-800">
                    <Image
                      src={partner.photos[0]}
                      alt={partner.displayName}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    {partner.isVerified && (
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  {/* Info & Message Preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-[#FF5E62] transition-colors">
                        {partner.displayName}, {partner.age}
                      </h3>
                      <span className="text-[10px] text-gray-400">
                        {match.lastMessageAt
                          ? new Date(match.lastMessageAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "New"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 truncate font-medium mb-1">
                      {match.lastMessagePreview ||
                        (match.context?.suggestedIcebreaker
                          ? `Start with: "${match.context.suggestedIcebreaker}"`
                          : "Say hi and start a conversation!")}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF5E62]" />
                        <span>{partner.neighborhood}</span>
                      </span>
                      <span>•</span>
                      <span className="text-[#FFA034] truncate max-w-[140px]">
                        {partner.intentTimeline}
                      </span>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-6 rounded-3xl bg-[#14141E] border border-white/5 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">No Mutual Matches Yet</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              When someone in Jabalpur reciprocates your like on Discovery, your match and chat room will appear right here.
            </p>
            <div className="pt-2">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-flame text-white text-xs font-bold shadow-lg shadow-pink-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Go to Discovery</span>
              </Link>
            </div>
          </div>
        )}

      </main>

      <BottomNav />
    </div>
  );
}
