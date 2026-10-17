"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Lock } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "female",
    profession: "",
    college: "",
    neighborhood: "Civil Lines",
    phone: "",
    intent_timeline: "Marriage within 1-2 years",
  });
  const [queueNumber, setQueueNumber] = useState<number>(142);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate realistic queue number
    const randomQueue = Math.floor(100 + Math.random() * 850);
    setQueueNumber(randomQueue);

    // Save locally for instant persistence
    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("vouple_applicants") || "[]");
        existing.push({ ...formData, queueNumber: randomQueue, timestamp: new Date().toISOString() });
        localStorage.setItem("vouple_applicants", JSON.stringify(existing));
      } catch {
        // ignore storage errors
      }
    }

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-[28px] bg-white border border-[#EAE2DA] shadow-2xl overflow-hidden relative">
        {/* Header Ribbon */}
        <div className="p-6 bg-obsidian text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-xs font-serif font-bold">
              V
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium">Jabalpur Cohort #1 Application</h3>
              <p className="text-[10px] text-stone-300">Curated & 100% ID Verified Membership</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-mono tracking-widest text-gold-dark uppercase font-semibold">
                Application Received
              </span>
              <h4 className="font-serif text-2xl text-stone-900 mt-1">
                You are in Queue #{queueNumber}
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed mt-2">
                Thank you, <strong>{formData.name}</strong>. Our local Jabalpur community steward will review your application details. You will receive an invitation link on <strong>{formData.phone}</strong> once verified.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-ivory-100 border border-[#EAE2DA] text-xs text-stone-700 max-w-sm mx-auto flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-left">
                Zero spam promise. We never sell your number or share your profile without verified mutual interest.
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full max-w-xs mx-auto py-3 rounded-full bg-obsidian text-white text-xs font-medium hover:bg-black transition-all"
            >
              Done & Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Only candidates with verified high intent & genuine local ties are admitted.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Raghav Singhania"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Age</label>
                <input
                  type="number"
                  required
                  min={21}
                  max={45}
                  placeholder="e.g. 27"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Profession / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Resident Doctor / Software Dev"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">College / Alma Mater</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NSCB / IIITDM / NLIU"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Jabalpur Locality</label>
                <select
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold bg-white"
                >
                  <option value="Civil Lines">Civil Lines</option>
                  <option value="Napier Town">Napier Town</option>
                  <option value="Wright Town">Wright Town</option>
                  <option value="South Civil Lines">South Civil Lines</option>
                  <option value="Gorakhpur">Gorakhpur</option>
                  <option value="Madan Mahal">Madan Mahal</option>
                  <option value="Vijay Nagar">Vijay Nagar</option>
                  <option value="Other">Other Jabalpur Area</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">WhatsApp / Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9826012345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Intent Timeline</label>
              <select
                value={formData.intent_timeline}
                onChange={(e) => setFormData({ ...formData, intent_timeline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-gold bg-white"
              >
                <option value="Marriage within 12 months">Marriage within 12 months</option>
                <option value="Marriage within 1-2 years">Marriage within 1-2 years</option>
                <option value="Committed courtship leading to marriage">Committed courtship leading to marriage</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-obsidian hover:bg-black text-ivory text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Submit for Verification Audit</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
              </button>
            </div>

            <p className="text-[10px] text-stone-400 text-center">
              100% Free to apply • Zero paid subscriptions required for beta cohort
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
