"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AppHeader } from "@/components/app/app-header";
import { BottomNav } from "@/components/app/bottom-nav";
import { useVoupleStore } from "@/lib/store/vouple-store";
import { CheckCircle2, MapPin, Sparkles, Save, User, Camera } from "lucide-react";

const JABALPUR_NEIGHBORHOODS = [
  "Civil Lines",
  "Wright Town",
  "Napier Town",
  "South Civil Lines",
  "Vijay Nagar",
  "Gorakhpur",
  "Sadar",
  "Adhartal",
];

const INTENT_OPTIONS = [
  "Intentional dating → Long-term partnership",
  "Marriage in 12–18 months",
  "Committed relationship",
  "Looking for something real & intentional",
];

const ALL_HOBBIES = [
  "Filter Coffee",
  "Road Cycling",
  "Indie Music",
  "Photography",
  "Trekking",
  "Acoustic Guitar",
  "Heritage Walks",
  "Book Clubs",
  "Classical Music",
  "Art & Coffee",
  "Badminton",
];

export default function ProfilePage() {
  const { isLoaded, currentProfile, updateProfile } = useVoupleStore();

  const [displayName, setDisplayName] = useState(currentProfile.displayName);
  const [neighborhood, setNeighborhood] = useState(currentProfile.neighborhood);
  const [intentTimeline, setIntentTimeline] = useState(currentProfile.intentTimeline);
  const [bio, setBio] = useState(currentProfile.bio);
  const [promptAnswer, setPromptAnswer] = useState(currentProfile.promptAnswer);
  const [hobbies, setHobbies] = useState<string[]>(currentProfile.hobbies);
  const [savedToast, setSavedToast] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF4458] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const toggleHobby = (h: string) => {
    if (hobbies.includes(h)) {
      setHobbies(hobbies.filter((item) => item !== h));
    } else {
      if (hobbies.length < 5) setHobbies([...hobbies, h]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      neighborhood,
      intentTimeline,
      bio,
      promptAnswer,
      hobbies,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col justify-between">
      <AppHeader title="Edit Profile" />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 sm:py-6">
        
        {/* Profile Avatar & Verified State */}
        <div className="p-6 rounded-3xl bg-[#14141E] border border-white/10 text-center mb-6 relative overflow-hidden shadow-xl">
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-3xl overflow-hidden border-2 border-[#FF4458] shadow-lg">
            <Image
              src={currentProfile.photos[0]}
              alt={displayName}
              fill
              sizes="96px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white flex items-center justify-center gap-1.5 mb-1">
            <span>{displayName}, {currentProfile.age}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </h2>

          <p className="text-xs text-gray-400 flex items-center justify-center gap-1 mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#FF5E62]" />
            <span>{neighborhood}, Jabalpur</span>
          </p>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400">
            ✓ 18+ Adult Verified Profile
          </span>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Display Name */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 block">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-2xl bg-[#14141E] border border-white/10 text-sm text-white focus:border-[#FF5E62] outline-none"
            />
          </div>

          {/* Neighborhood in Jabalpur */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 block">
              Jabalpur Neighborhood
            </label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-[#14141E] border border-white/10 text-sm text-white focus:border-[#FF5E62] outline-none cursor-pointer"
            >
              {JABALPUR_NEIGHBORHOODS.map((hood) => (
                <option key={hood} value={hood} className="bg-[#14141E] text-white">
                  {hood}
                </option>
              ))}
            </select>
          </div>

          {/* Intent Timeline */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 block">
              Relationship Intent Timeline
            </label>
            <select
              value={intentTimeline}
              onChange={(e) => setIntentTimeline(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-[#14141E] border border-white/10 text-sm text-white focus:border-[#FF5E62] outline-none cursor-pointer"
            >
              {INTENT_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#14141E] text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 block">
              About Me (Bio)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={300}
              className="w-full p-4 rounded-2xl bg-[#14141E] border border-white/10 text-xs sm:text-sm text-white focus:border-[#FF5E62] outline-none leading-relaxed"
            />
          </div>

          {/* Hinge-style Prompt */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 block">
              Signature Prompt: {currentProfile.promptQuestion}
            </label>
            <textarea
              value={promptAnswer}
              onChange={(e) => setPromptAnswer(e.target.value)}
              rows={3}
              maxLength={300}
              className="w-full p-4 rounded-2xl bg-[#14141E] border border-white/10 text-xs sm:text-sm text-white focus:border-[#FF5E62] outline-none leading-relaxed italic"
            />
          </div>

          {/* Hobbies / Lifestyle selection */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 block">
              Lifestyles & Passions (Select up to 5)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_HOBBIES.map((h) => {
                const isSelected = hobbies.includes(h);
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => toggleHobby(h)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? "gradient-flame text-white border-transparent shadow-md"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}{h}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 pb-8">
            <button
              type="submit"
              className="w-full h-12 rounded-2xl gradient-flame text-white font-bold text-sm shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
            {savedToast && (
              <p className="text-center text-xs text-emerald-400 font-bold mt-2">
                ✓ Profile changes saved successfully!
              </p>
            )}
          </div>

        </form>

      </main>

      <BottomNav />
    </div>
  );
}
