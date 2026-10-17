import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Notice & Data Minimization — Vouple",
  description:
    "Vouple's privacy commitment for Jabalpur Cohort № 001. We practice strict data minimization and zero surveillance capitalism.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fef9f2] text-[#1d1b18] font-sans antialiased selection:bg-[#b91348]/20 selection:text-[#b91348]">
      {/* Header */}
      <header className="w-full border-b border-[#1d1b18]/10 bg-[#fef9f2]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="font-bold text-2xl tracking-tighter lowercase text-[#1d1b18]">vouple</span>
            <span className="w-2 h-2 rounded-full bg-[#ff4f78] mb-1"></span>
          </Link>
          <Link
            href="/"
            className="text-xs uppercase tracking-wider text-[#1d1b18]/70 hover:text-[#b91348] transition-colors"
          >
            ← Return to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-4 border-b border-[#1d1b18]/10 pb-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b91348]">
            Legal &amp; Ethical Standard
          </span>
          <h1
            className="text-4xl sm:text-5xl font-normal tracking-[-0.03em] text-[#1d1b18]"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            Privacy Notice &amp; Data Minimization
          </h1>
          <p className="text-sm text-[#4b4549] font-mono">
            Version 1.0 · Active for Jabalpur Waitlist Cohort № 001
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-[#1d1b18]">
            1. What We Collect at the Waitlist Stage
          </h2>
          <p className="text-[#4b4549] text-base leading-relaxed">
            During our early access and demand-validation phase for Jabalpur, Vouple adheres to the principle of <strong>strict data minimization</strong>. We only collect:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#4b4549] text-base">
            <li><strong>Email Address:</strong> To send launch announcements and private cohort dispatches.</li>
            <li><strong>Adult Eligibility Confirmation (18+):</strong> To verify compliance with our strict adults-only requirement.</li>
            <li><strong>Consent Record:</strong> Explicit consent timestamp and version to document your communication preferences.</li>
          </ul>
          <p className="text-[#4b4549] text-base leading-relaxed">
            We <em>do not</em> collect names, birth dates, phone numbers, profile photographs, precise GPS locations, financial information, or personal preferences at the waitlist stage.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-[#1d1b18]">
            2. How Your Data Is Stored &amp; Protected
          </h2>
          <p className="text-[#4b4549] text-base leading-relaxed">
            Waitlist records are stored in a dedicated, secure database with Row-Level Security (RLS) enabled. Public visitors cannot read the waitlist, search for records, or enumerate other members. Access is restricted strictly to authorized Vouple operators.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-[#1d1b18]">
            3. Zero Surveillance Capitalism &amp; No Data Brokering
          </h2>
          <p className="text-[#4b4549] text-base leading-relaxed">
            Vouple does not sell, rent, license, or broker your personal information to third parties or advertising networks. We will never monetize your email address or personal habits.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-[#1d1b18]">
            4. Withdrawing Consent &amp; Deletion
          </h2>
          <p className="text-[#4b4549] text-base leading-relaxed">
            You maintain full sovereignty over your information. You may withdraw your consent and request complete deletion of your waitlist record at any time by:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#4b4549] text-base">
            <li>Replying directly to any email dispatch from Vouple.</li>
            <li>Writing to <a href="mailto:privacy@vouple.in" className="text-[#b91348] underline">privacy@vouple.in</a> with your registered email address.</li>
          </ul>
          <p className="text-[#4b4549] text-base leading-relaxed">
            Upon receipt of a deletion request, your record is purged permanently within 48 hours.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-4 border-t border-[#1d1b18]/10 pt-8">
          <h2 className="text-xl font-bold tracking-tight text-[#1d1b18]">
            5. Contact Information
          </h2>
          <p className="text-[#4b4549] text-base leading-relaxed">
            For any inquiries regarding data protection or our launch in Jabalpur, India, contact us at:
          </p>
          <p className="text-sm font-mono text-[#1d1b18]">
            privacy@vouple.in · Vouple Trust &amp; Safety Team
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#1d1b18]/10 py-8 bg-[#f8f3ed]">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7c7579]">
          <p>© 2025 Vouple. Designed for intentional encounters in Jabalpur.</p>
          <Link href="/" className="hover:text-[#1d1b18] underline transition-colors">
            Return to Landing Page
          </Link>
        </div>
      </footer>
    </div>
  );
}
