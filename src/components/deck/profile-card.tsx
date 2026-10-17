"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, X, ShieldCheck } from "lucide-react";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  profile: Profile;
  onLike?: () => void;
  onPass?: () => void;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onLike,
  onPass,
  className,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPhotoIndex < profile.photos.length - 1) {
      setCurrentPhotoIndex((prev) => prev + 1);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full aspect-portrait max-w-[390px] mx-auto select-none rounded-[32px] overflow-hidden bg-stone-900 shadow-2xl transition-all",
        className
      )}
    >
      {/* Photo layer */}
      <div className="relative w-full h-full">
        <Image
          src={profile.photos[currentPhotoIndex] || profile.photos[0]}
          alt={profile.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 390px"
          className="object-cover object-center pointer-events-none"
        />

        {/* Top Vignette for story bar clarity */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

        {/* Single clean High-contrast Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none z-10" />

        {/* Touch zones for story navigation */}
        <div className="absolute inset-0 flex z-10">
          <div
            onClick={prevPhoto}
            className="w-1/2 h-2/3 cursor-pointer"
            aria-label="Previous photo"
          />
          <div
            onClick={nextPhoto}
            className="w-1/2 h-2/3 cursor-pointer"
            aria-label="Next photo"
          />
        </div>

        {/* Story Pagination Bars */}
        <div className="absolute top-4 inset-x-5 flex gap-1.5 z-20">
          {profile.photos.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1 rounded-full flex-1 transition-all duration-300",
                idx === currentPhotoIndex ? "bg-white shadow" : "bg-white/30"
              )}
            />
          ))}
        </div>

        {/* Unified Bottom Info Container - Clean Vertical Flex Layout with NO overlapping positionings */}
        <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col gap-3">
          
          {/* Name & Age */}
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-white leading-tight">
              {profile.name}, {profile.age}
            </h2>
            {profile.is_verified && (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
          </div>

          {/* Profession */}
          <p className="text-sm text-stone-300 font-light leading-snug line-clamp-1">
            {profile.profession}
          </p>

          {/* Single Subtle Glassmorphic Intent Pill */}
          <div className="pt-0.5">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-gold-light font-medium tracking-wide">
              {profile.intent_timeline || "Seeking commitment in 1–2 yrs"}
            </span>
          </div>

          {/* Action Buttons: 2 Minimal Circular Floating Buttons */}
          <div className="flex items-center justify-center gap-6 pt-2">
            {/* Pass ✕ */}
            <button
              type="button"
              onClick={onPass}
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 active:scale-90 transition-all text-white border border-white/20 flex items-center justify-center shadow-lg hover:shadow-xl"
              aria-label="Pass"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Connect ♥ */}
            <button
              type="button"
              onClick={onLike}
              className="w-14 h-14 rounded-full bg-white hover:bg-stone-100 active:scale-90 transition-all text-obsidian flex items-center justify-center shadow-xl hover:shadow-2xl"
              aria-label="Connect"
            >
              <Heart className="w-6 h-6 fill-obsidian stroke-[2]" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
