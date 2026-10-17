"use client";

import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQS = [
  {
    id: "faq-1",
    q: "When does Vouple launch in Jabalpur?",
    a: "Private beta invites for waitlist members roll out in waves starting this season. Joining the VIP waitlist guarantees you'll be in Cohort #1 before public App Store & Google Play release.",
  },
  {
    id: "faq-2",
    q: "Is it really 100% free for early waitlist members?",
    a: "Yes! Every single person who joins the waitlist before public release receives an exclusive 15-Day Free Pass to Vouple Gold VIP—including unlimited rewinds, priority matching, and the exclusive Founder Pioneer badge.",
  },
  {
    id: "faq-3",
    q: "Can my friends, family, or colleagues see that I joined?",
    a: "No, absolutely not. Your waitlist signup is completely confidential. We do not post to social media, and your profile is only visible to verified matches once you actively set up your app profile.",
  },
  {
    id: "faq-4",
    q: "How do you prevent fake profiles, bots, and catfish?",
    a: "Every member must undergo real-time selfie liveness verification and strict 18+ ID validation before entering the pool. Anyone exhibiting predatory behavior is permanently banned.",
  },
  {
    id: "faq-5",
    q: "What if I'm looking for marriage, but others want casual?",
    a: "That's exactly why Vouple exists! Every member selects their relationship intent timeline (e.g. 'Marriage in 12–18 months', 'Committed relationship', 'Exploring'). Our matching system only connects you with singles who want the exact same thing.",
  },
];

export const FaqAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 relative scroll-mt-20 overflow-hidden bg-[#0D0D14]"
      aria-labelledby="faq-headline"
    >
      <div className="max-w-[760px] mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#FFA034] uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#FFA034]" />
            <span>Got Questions?</span>
          </div>
          <h2 id="faq-headline" className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Everything you need <br />
            <span className="gradient-text">to know.</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            No small print. Clear answers for Jabalpur singles.
          </p>
        </div>

        {/* Accordion Items */}
        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#14141E] border border-white/5 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  id={`btn-${faq.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`content-${faq.id}`}
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-snug">
                    {faq.q}
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${isOpen ? "bg-[#FF4458] text-white rotate-180" : "bg-white/10 text-gray-300"}`}>
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`content-${faq.id}`}
                    role="region"
                    aria-labelledby={`btn-${faq.id}`}
                    className="px-5 sm:px-6 pb-6 text-sm text-gray-300 font-normal leading-relaxed border-t border-white/5 pt-4"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
