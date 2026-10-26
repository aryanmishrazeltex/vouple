"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";


interface FaqItem {
  id: string;
  number: string;
  question: string;
  answer: string;
  tag: string;
}

const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    number: "01",
    question: "What is Vouple?",
    answer:
      "Vouple is an independent dating platform constructed around shared pursuits, aesthetic inclinations, and clearly declared intentions. Rather than gamifying romance through high-frequency swipe cards, it emphasizes intentional introductions where both parties understand context from the very first moment.",
    tag: "Curated Intentionality · Zero Swiping",
  },
  {
    id: "faq-2",
    number: "02",
    question: "How is it intended to work?",
    answer:
      "Members curate their dossier highlighting specific creative, intellectual, or lifestyle interests alongside unambiguous relationship intentions. When introducing prospective members, Vouple transparently surfaces the exact areas of common ground, facilitating meaningful discussions rather than repetitive pleasantries.",
    tag: "Transparent Overlap · Concrete Reasons",
  },
  {
    id: "faq-3",
    number: "03",
    question: "Where is Vouple starting?",
    answer:
      "Our inaugural release is exclusively centered in Jabalpur, Madhya Pradesh. We are deliberately investing in localized community authenticity and trust dynamics before expanding into further tier-one and tier-two cities across the country and abroad.",
    tag: "Cohort № 001 · Jabalpur Exclusive",
  },
  {
    id: "faq-4",
    number: "04",
    question: "Is the product available yet?",
    answer:
      "Not currently. Vouple is in active, rigorous development. Waitlist participants will receive private progress briefs, early feature demonstrations, and priority admission into the first closed beta group in Jabalpur.",
    tag: "In Active Architecture · 2025 Beta Rollout",
  },
  {
    id: "faq-5",
    number: "05",
    question: "Who can join the waitlist?",
    answer:
      "Any adult aged 18 or above who seeks a more mindful, dignified approach to romantic introductions. While initial cohorts are physically restricted to Jabalpur, individuals outside the region may join to register interest for upcoming territorial launches.",
    tag: "Adults 18+ · Global Early Registry Open",
  },
  {
    id: "faq-6",
    number: "06",
    question: "How will privacy and safety be approached?",
    answer:
      "We operate under zero-tolerance safety policies with required age validation, mutual authorization prerequisites before messaging privileges are granted, strict data privacy protocols, and human steward moderation.",
    tag: "Zero Surveillance Capitalism · Bilateral Authorization",
  },
  {
    id: "faq-7",
    number: "07",
    question: "When will dating access open?",
    answer:
      "Invitations to the first Jabalpur cohort will roll out gradually over the coming quarters as technical milestones and safety benchmarks are met. Members of the early registry will receive notifications directly via email.",
    tag: "Staggered Dispatches · Priority to Early Registry",
  },
];

export default function LandingPage() {
  // Sticky header state
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 3D tilt card ref
  const tiltCardRef = useRef<HTMLDivElement>(null);

  // Spotlight card mouse tracking
  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  // FAQ Accordion state (open index 0 by default)
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaqIndex((prev) => (prev === index ? null : index));
  };

  // Waitlist form state
  const [emailInput, setEmailInput] = useState("");
  const [isAdultChecked, setIsAdultChecked] = useState(false);
  const [isUpdatesChecked, setIsUpdatesChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<{ type: "error" | "duplicate" | "info"; message: string } | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Handle real waitlist form submission
  const handleSubmitWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setBannerNotice(null);

    const trimmedEmail = emailInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Email format check
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      setBannerNotice({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    // 2. Adult confirmation check (18+)
    if (!isAdultChecked) {
      setBannerNotice({
        type: "error",
        message: "You must confirm you are 18 years of age or older to join the waitlist.",
      });
      return;
    }

    // 3. Clear consent verification
    if (!isUpdatesChecked) {
      setBannerNotice({
        type: "error",
        message: "Please confirm your consent to receive Vouple launch updates.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          isAdult: isAdultChecked,
          consentGiven: isUpdatesChecked,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 201 && data?.success) {
        setIsSubmitted(true);
      } else if (response.status === 409) {
        setBannerNotice({
          type: "duplicate",
          message: data?.message || "This email address is already on the waitlist.",
        });
      } else {
        setBannerNotice({
          type: "error",
          message: data?.message || "Unable to process signup at this moment. Please try again shortly.",
        });
      }
    } catch {
      setBannerNotice({
        type: "error",
        message: "Unable to connect to the server. Please check your network connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetWaitlist = () => {
    setIsSubmitted(false);
    setEmailInput("");
    setIsAdultChecked(false);
    setIsUpdatesChecked(false);
    setBannerNotice(null);
    setEmailError(null);
  };

  // Smooth scroll handler
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Effects: Scroll header & 3D tilt
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const card = tiltCardRef.current;
    if (!card || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // IntersectionObserver for scroll reveal
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            }
          });
        },
        { rootMargin: "0px 0px -60px 0px", threshold: 0.1 }
      );

      revealElements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    } else {
      revealElements.forEach((el) => el.classList.add("is-visible"));
    }
  }, []);

  return (
    <div className="bg-background font-body-md text-on-surface antialiased selection:bg-secondary/20 selection:text-secondary min-h-screen">
      {/* 1. FIXED HEADER */}
      <header
        id="mainHeader"
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-b border-on-surface/5"
            : "bg-background/85 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="h-16 sm:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => scrollToSection(e, "#")}
            className="flex items-center gap-1 group py-1"
          >
            <span className="font-headline-md text-xl sm:text-headline-md tracking-tighter lowercase text-on-surface group-hover:opacity-80 transition-opacity">
              vouple
            </span>
            <span className="w-2 h-2 rounded-full bg-secondary-container mb-0.5 sm:mb-1 transition-transform group-hover:scale-125 duration-300"></span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-space-lg">
            <a
              href="#the-idea"
              onClick={(e) => scrollToSection(e, "#the-idea")}
              className="nav-link font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              The Idea
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, "#how-it-works")}
              className="nav-link font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              How It Works
            </a>
            <a
              href="#safety"
              onClick={(e) => scrollToSection(e, "#safety")}
              className="nav-link font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Safety
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, "#faq")}
              className="nav-link font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Right CTA & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/invite"
              className="hidden sm:inline-flex items-center text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5 rounded-full border border-on-surface/15 hover:border-on-surface/30"
            >
              Claim Invite
            </Link>
            <a
              href="#waitlist"
              onClick={(e) => scrollToSection(e, "#waitlist")}
              className="btn-shimmer inline-flex items-center justify-center px-3.5 sm:px-space-md py-2 sm:py-space-sm rounded-full bg-gradient-to-r from-secondary-container via-secondary to-tertiary-fixed font-headline-sm text-xs sm:text-body-sm font-bold text-on-primary shadow-sm hover:shadow-md transition-all duration-300 min-h-[38px] sm:min-h-[42px]"
            >
              <span className="hidden sm:inline">Join the Jabalpur waitlist</span>
              <span className="sm:hidden">Join waitlist</span>
            </a>

            {/* Mobile Menu Button with clear 44px touch target */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container/70 border border-on-surface/10 text-on-surface hover:text-secondary focus:outline-none transition-colors active:scale-95"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/98 backdrop-blur-xl border-b border-on-surface/10 px-4 sm:px-6 py-4 space-y-2 shadow-2xl animate-hero-1">
            <a
              href="#the-idea"
              onClick={(e) => scrollToSection(e, "#the-idea")}
              className="flex items-center justify-between font-body-md text-on-surface hover:text-secondary py-2.5 px-3 rounded-lg hover:bg-surface-container transition-colors"
            >
              <span>The Idea</span>
              <span className="material-symbols-outlined text-base text-on-surface-variant">arrow_forward</span>
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, "#how-it-works")}
              className="flex items-center justify-between font-body-md text-on-surface hover:text-secondary py-2.5 px-3 rounded-lg hover:bg-surface-container transition-colors"
            >
              <span>How It Works</span>
              <span className="material-symbols-outlined text-base text-on-surface-variant">arrow_forward</span>
            </a>
            <a
              href="#safety"
              onClick={(e) => scrollToSection(e, "#safety")}
              className="flex items-center justify-between font-body-md text-on-surface hover:text-secondary py-2.5 px-3 rounded-lg hover:bg-surface-container transition-colors"
            >
              <span>Safety &amp; Trust</span>
              <span className="material-symbols-outlined text-base text-on-surface-variant">arrow_forward</span>
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, "#faq")}
              className="flex items-center justify-between font-body-md text-on-surface hover:text-secondary py-2.5 px-3 rounded-lg hover:bg-surface-container transition-colors"
            >
              <span>FAQ</span>
              <span className="material-symbols-outlined text-base text-on-surface-variant">arrow_forward</span>
            </a>
            <Link
              href="/invite"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between font-body-md text-on-surface hover:text-secondary py-2.5 px-3 rounded-lg hover:bg-surface-container transition-colors"
            >
              <span>Claim Invitation</span>
              <span className="material-symbols-outlined text-base text-secondary">vpn_key</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between font-body-md text-on-surface hover:text-secondary py-2.5 px-3 rounded-lg hover:bg-surface-container transition-colors"
            >
              <span>Member Sign In</span>
              <span className="material-symbols-outlined text-base text-secondary">login</span>
            </Link>
            <Link
              href="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between font-body-md text-on-surface-variant hover:text-secondary py-2.5 px-3 rounded-lg hover:bg-surface-container transition-colors text-sm"
            >
              <span>Privacy Notice</span>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">lock</span>
            </Link>
            <div className="pt-2 border-t border-on-surface/10">
              <a
                href="#waitlist"
                onClick={(e) => scrollToSection(e, "#waitlist")}
                className="btn-shimmer w-full py-3 rounded-full bg-gradient-to-r from-secondary-container via-secondary to-[#FF9D67] text-white font-headline-sm text-sm font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <span>Join the Jabalpur waitlist</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 sm:pt-20 bg-background">
        <div className="flex flex-col w-full">
          {/* SECTION ONE: HERO SECTION */}
          <section className="relative w-full bg-background px-4 sm:px-6 lg:px-8 pt-6 sm:pt-space-lg pb-10 sm:pb-space-xl overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-5 sm:gap-space-lg">
              {/* Eyebrow & Status Flag */}
              <div className="animate-hero-1 flex items-center justify-between border-b border-on-surface/10 pb-3 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(185,19,72,0.6)] flex-shrink-0"></span>
                  <p className="font-label-caps text-[10px] sm:text-label-caps text-on-surface tracking-wider sm:tracking-widest uppercase truncate sm:overflow-visible">
                    In Development · Starting in Jabalpur, India · 18+
                  </p>
                </div>
                <p className="hidden sm:block font-label-serif text-xs sm:text-label-serif italic text-on-surface-variant flex-shrink-0">
                  Cohort № 001 Registration
                </p>
              </div>

              {/* Main Editorial Hero Title & Asymmetric Media */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-space-lg gap-y-8 sm:gap-y-space-lg items-end pt-2 sm:pt-space-xs">
                <div className="lg:col-span-8 space-y-4 sm:space-y-space-md">
                  <div className="animate-hero-2">
                    <h1
                      className="text-[2.6rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] text-on-surface font-normal leading-[1.08] sm:leading-[1.03] tracking-[-0.035em]"
                      style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif' }}
                    >
                      Dating should give you <br />
                      <span
                        className="italic font-normal text-secondary underline decoration-secondary-container/30 underline-offset-8 sm:underline-offset-[12px]"
                        style={{
                          fontFamily: 'Fraunces, "Instrument Serif", Newsreader, serif',
                          fontSize: "1.06em",
                          fontFeatureSettings: '"swsh", "dlig"',
                        }}
                      >
                        more to go on.
                      </span>
                    </h1>
                  </div>

                  <div className="animate-hero-3 max-w-2xl pt-1 sm:pt-space-sm space-y-3 sm:space-y-space-sm">
                    <p
                      className="text-base sm:text-body-lg text-on-surface-variant font-normal leading-relaxed tracking-[-0.01em]"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      Vouple is building an intentional dating experience shaped by shared pursuits and stated intentions—giving you tangible context before deciding whether to connect.
                    </p>
                    <div className="border-l-2 border-secondary/40 pl-3.5 sm:pl-4 py-1.5 my-2 bg-secondary/5 rounded-r-lg">
                      <p
                        className="text-xl sm:text-[1.65rem] leading-snug sm:leading-[2.15rem] italic text-on-surface tracking-[-0.015em] font-normal"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        “Every introduction should have a reason.”
                      </p>
                      <span
                        className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-secondary font-semibold block pt-1"
                        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                      >
                        The Vouple Standard
                      </span>
                    </div>
                  </div>

                  <div className="animate-hero-4 pt-2 sm:pt-space-md flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-space-md">
                    <a
                      href="#waitlist"
                      onClick={(e) => scrollToSection(e, "#waitlist")}
                      className="btn-shimmer group inline-flex items-center justify-center gap-2 px-6 sm:px-space-lg py-3.5 sm:py-space-md rounded-full bg-gradient-to-r from-secondary-container via-secondary to-[#FF9D67] text-on-primary font-headline-sm text-sm sm:text-body-md font-bold tracking-tight shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/35 transition-all duration-300 min-h-[48px] text-center"
                    >
                      <span>Join the Jabalpur waitlist</span>
                      <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </a>
                    <a
                      href="#the-idea"
                      onClick={(e) => scrollToSection(e, "#the-idea")}
                      className="inline-flex items-center justify-center sm:justify-start gap-2.5 font-headline-sm text-xs sm:text-body-sm text-on-surface hover:text-secondary uppercase tracking-wider py-2 sm:py-space-sm transition-colors group min-h-[44px]"
                    >
                      <span>Discover the idea</span>
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-on-surface/20 flex items-center justify-center group-hover:border-secondary group-hover:bg-secondary/5 transition-all flex-shrink-0">
                        <span className="material-symbols-outlined text-sm sm:text-base group-hover:translate-y-0.5 transition-transform">
                          arrow_downward
                        </span>
                      </span>
                    </a>
                  </div>

                  <div className="animate-hero-4 flex items-center gap-2 pt-1 sm:pt-space-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/60 flex-shrink-0"></span>
                    <p className="font-label-caps text-[10px] sm:text-label-caps text-on-surface-variant/70 tracking-wider sm:tracking-widest uppercase">
                      Adults 18+ only · Priority Cohort · Dating access opens 2025
                    </p>
                  </div>
                </div>

                {/* Asymmetric Editorial Visual with 3D Tilt */}
                <div className="lg:col-span-4 relative mt-4 lg:mt-0 animate-hero-card tilt-card-container max-w-sm sm:max-w-md mx-auto lg:max-w-none w-full">
                  <div
                    ref={tiltCardRef}
                    id="heroTiltCard"
                    className="tilt-card relative bg-surface-container-high/90 border border-on-surface/10 p-2.5 sm:p-3 rounded-2xl shadow-2xl backdrop-blur-sm cursor-pointer"
                  >
                    <div className="relative overflow-hidden aspect-[4/5] rounded-xl bg-surface-dim shadow-inner group">
                      <Image
                        src="/images/editorial-cafe.jpg"
                        alt="A warm cinematic Parisian cafe ambiance with stylish young friends laughing naturally over wine, espresso cups and dinner plates under soft amber bistro lighting, editorial film grain photography"
                        width={600}
                        height={750}
                        priority
                        className="w-full h-full object-cover grayscale-[15%] contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md text-[10px] uppercase tracking-widest font-semibold text-on-surface shadow-sm">
                          Figure 01
                        </span>
                      </div>
                    </div>
                    <div className="pt-3 pb-1 px-1 flex items-start justify-between gap-2">
                      <div>
                        <span className="font-label-caps text-[0.65rem] text-secondary font-bold uppercase tracking-widest block">
                          Editorial Dossier
                        </span>
                        <span
                          className="text-[11px] text-on-surface-variant font-medium"
                          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                        >
                          Curated Social Resonance
                        </span>
                      </div>
                      <span className="font-label-serif text-label-serif italic text-on-surface-variant text-right leading-tight max-w-[140px] text-xs">
                        Editorial mood · Intentional atmosphere
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION TWO: THE CORE IDEA */}
          <section
            id="the-idea"
            className="reveal-on-scroll w-full bg-surface-container-low px-4 sm:px-6 lg:px-8 py-10 sm:py-space-xl border-t border-on-surface/10"
          >
            <div className="max-w-7xl mx-auto flex flex-col gap-space-md sm:gap-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-space-md pb-4 sm:pb-space-md border-b border-on-surface/10">
                <div className="max-w-2xl space-y-2 sm:space-y-space-xs">
                  <span
                    className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-secondary font-semibold"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    The Premise
                  </span>
                  <h2
                    className="text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[4rem] text-on-surface font-normal leading-[1.1] sm:leading-[1.08] tracking-[-0.03em]"
                    style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}
                  >
                    Before the hello, find the{" "}
                    <span className="italic text-on-surface-variant" style={{ fontFamily: "Fraunces, serif" }}>
                      common ground.
                    </span>
                  </h2>
                </div>
                <p
                  className="font-body-md text-sm sm:text-body-md text-on-surface-variant max-w-md leading-relaxed tracking-[-0.01em]"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  An introduction becomes inherently easier to navigate when you know a little about what you already share.
                </p>
              </div>

              {/* Open Horizontal Broadside Structure */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2 sm:pt-space-md">
                {/* 01 Pursuits */}
                <div className="reveal-item bg-surface-container/50 border border-on-surface/10 hover:border-secondary/40 hover:shadow-xl hover:-translate-y-1.5 rounded-2xl p-5 sm:p-7 flex flex-col justify-between space-y-5 sm:space-y-6 transition-all duration-300 group">
                  <div className="space-y-3.5 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-2xl font-normal tracking-[-0.04em] text-secondary inline-block pb-1 transition-transform group-hover:translate-x-0.5"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        01 —
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 group-hover:bg-secondary/20 text-secondary text-[10px] font-semibold tracking-wider uppercase transition-colors">
                        Pursuits
                      </span>
                    </div>
                    <h3
                      className="text-lg font-semibold text-on-surface tracking-tight group-hover:text-secondary transition-colors"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      Shared Interests
                    </h3>
                    <p
                      className="font-body-md text-sm sm:text-body-md text-on-surface-variant leading-relaxed"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      Specific artistic obsessions, subcultures, literature, and active pursuits. We replace shallow photo carousels with genuine points of reference that give first words real traction.
                    </p>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-on-surface/10 flex items-center justify-between">
                    <span
                      className="text-label-serif italic text-on-surface text-sm sm:text-base"
                      style={{ fontFamily: "Fraunces, serif" }}
                    >
                      No algorithmic guesswork.
                    </span>
                    <span className="material-symbols-outlined text-secondary opacity-60 text-lg group-hover:opacity-100 group-hover:scale-110 transition-all">
                      explore
                    </span>
                  </div>
                </div>

                {/* 02 Clarity */}
                <div className="reveal-item bg-surface-container/50 border border-on-surface/10 hover:border-secondary/40 hover:shadow-xl hover:-translate-y-1.5 rounded-2xl p-5 sm:p-7 flex flex-col justify-between space-y-5 sm:space-y-6 transition-all duration-300 group">
                  <div className="space-y-3.5 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-2xl font-normal tracking-[-0.04em] text-secondary inline-block pb-1 transition-transform group-hover:translate-x-0.5"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        02 —
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 group-hover:bg-secondary/20 text-secondary text-[10px] font-semibold tracking-wider uppercase transition-colors">
                        Clarity
                      </span>
                    </div>
                    <h3
                      className="text-lg font-semibold text-on-surface tracking-tight group-hover:text-secondary transition-colors"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      Stated Intentions
                    </h3>
                    <p
                      className="font-body-md text-sm sm:text-body-md text-on-surface-variant leading-relaxed"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      Transparent definitions of what someone is here for from day one. Whether seeking an intentional lifelong partner or curated companionship, ambiguity is respectfully removed.
                    </p>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-on-surface/10 flex items-center justify-between">
                    <span
                      className="text-label-serif italic text-on-surface text-sm sm:text-base"
                      style={{ fontFamily: "Fraunces, serif" }}
                    >
                      Zero hidden agendas.
                    </span>
                    <span className="material-symbols-outlined text-secondary opacity-60 text-lg group-hover:opacity-100 group-hover:scale-110 transition-all">
                      verified
                    </span>
                  </div>
                </div>

                {/* 03 Consent */}
                <div className="reveal-item bg-surface-container/50 border border-on-surface/10 hover:border-secondary/40 hover:shadow-xl hover:-translate-y-1.5 rounded-2xl p-5 sm:p-7 flex flex-col justify-between space-y-5 sm:space-y-6 transition-all duration-300 group">
                  <div className="space-y-3.5 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-2xl font-normal tracking-[-0.04em] text-secondary inline-block pb-1 transition-transform group-hover:translate-x-0.5"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        03 —
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 group-hover:bg-secondary/20 text-secondary text-[10px] font-semibold tracking-wider uppercase transition-colors">
                        Consent
                      </span>
                    </div>
                    <h3
                      className="text-lg font-semibold text-on-surface tracking-tight group-hover:text-secondary transition-colors"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      Your Choice
                    </h3>
                    <p
                      className="font-body-md text-sm sm:text-body-md text-on-surface-variant leading-relaxed"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      Every dialogue demands deliberate bilateral consent. No unsolicited cold broadcasts, no ghosting gamification, and absolute agency over who is welcomed into your orbit.
                    </p>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-on-surface/10 flex items-center justify-between">
                    <span
                      className="text-label-serif italic text-on-surface text-sm sm:text-base"
                      style={{ fontFamily: "Fraunces, serif" }}
                    >
                      Mutual, deliberate pace.
                    </span>
                    <span className="material-symbols-outlined text-secondary opacity-60 text-lg group-hover:opacity-100 group-hover:scale-110 transition-all">
                      handshake
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION THREE: SIGNATURE PRODUCT IDEA (Full-bleed Deep Dark) */}
          <section
            id="how-it-works"
            className="reveal-on-scroll w-full bg-primary text-on-primary px-4 sm:px-6 lg:px-8 py-10 sm:py-space-xl overflow-hidden relative"
          >
            {/* Ambient breathing animated radial gradients */}
            <div className="animate-breathe-coral absolute top-1/2 left-1/2 w-[320px] sm:w-[720px] h-[320px] sm:h-[520px] bg-[#ff3366] blur-[90px] sm:blur-[150px] rounded-full pointer-events-none"></div>
            <div className="animate-breathe-amber absolute top-1/4 right-0 sm:right-10 w-[240px] sm:w-[420px] h-[240px] sm:h-[420px] bg-[#ff9933] blur-[80px] sm:blur-[140px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:gap-space-xl relative z-10">
              {/* Header Block */}
              <div className="max-w-3xl space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF9D67] inline-block animate-pulse"></span>
                  <span
                    className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-[#FF9D67]"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    The Contextual Introduction
                  </span>
                </div>
                <h2
                  className="text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[4.25rem] tracking-[-0.035em] text-surface font-normal leading-[1.1] sm:leading-[1.06]"
                  style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}
                >
                  Not a mysterious score. <br />
                  <span
                    className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-secondary-container via-secondary to-[#FF9D67]"
                    style={{ fontFamily: '"Fraunces", "Newsreader", serif' }}
                  >
                    A visible reason.
                  </span>
                </h2>
                <p
                  className="text-sm sm:text-[17px] text-[#ded9d4]/80 pt-1 max-w-2xl leading-relaxed tracking-[-0.01em]"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  Vouple is being architected from the ground up without opaque matchmaking algorithms or gamified scorecards. Introductions are conceptualized around transparent points of resonance and explicit parameters voluntarily delineated by each person.
                </p>
              </div>

              {/* Ultra-Luxury Editorial Dossier Architecture with Spotlight Mouse Sheen */}
              <div className="relative w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
                  {/* Pillar 01 */}
                  <div
                    onMouseMove={handleSpotlightMouseMove}
                    className="reveal-item spotlight-card bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md flex flex-col justify-between space-y-5 sm:space-y-6 hover:border-white/25 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="space-y-4 sm:space-y-5 relative z-10">
                      <div className="flex justify-between items-center border-b border-white/10 pb-3 sm:pb-3.5">
                        <div className="space-y-0.5">
                          <span
                            className="text-[10px] uppercase tracking-[0.2em] text-surface/50 font-semibold block"
                            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                          >
                            Conceptual Pillar 01
                          </span>
                          <span
                            className="text-xs font-semibold uppercase tracking-wider text-surface"
                            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                          >
                            Input &amp; Identity
                          </span>
                        </div>
                        <span className="text-[10px] text-[#FF9D67] tracking-wider uppercase bg-[#FF9D67]/10 border border-[#FF9D67]/20 px-2.5 py-1 rounded-full font-medium hover:border-[#FF9D67]/50 hover:shadow-[0_0_12px_rgba(255,157,103,0.3)] transition-all">
                          User-Delineated
                        </span>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <h3
                          className="text-lg sm:text-xl font-normal text-surface tracking-tight"
                          style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}
                        >
                          Shared Pursuits &amp; Interests
                        </h3>
                        <p
                          className="text-xs sm:text-[14px] text-surface/80 leading-relaxed"
                          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                        >
                          Specific artistic disciplines, cultural pursuits, literature, and active weekend endeavors explicitly defined by each person—bypassing superficial carousels.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-3 sm:pt-4 flex items-center justify-between text-surface/50 text-[11px] font-mono relative z-10">
                      <span className="uppercase tracking-wider">Phase · Profiling</span>
                      <span className="material-symbols-outlined text-secondary-container text-base">draw</span>
                    </div>
                  </div>

                  {/* Pillar 02 */}
                  <div
                    onMouseMove={handleSpotlightMouseMove}
                    className="reveal-item spotlight-card bg-gradient-to-b from-[#2a1722] via-[#20121c] to-[#170e15] border border-secondary-container/40 rounded-2xl p-5 sm:p-7 shadow-[0_0_60px_rgba(255,79,120,0.18)] backdrop-blur-md flex flex-col justify-between space-y-5 sm:space-y-6 hover:border-secondary-container/60 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="space-y-4 sm:space-y-5 relative z-10">
                      <div className="flex justify-between items-center border-b border-white/10 pb-3 sm:pb-3.5">
                        <div className="space-y-0.5">
                          <span
                            className="text-[10px] uppercase tracking-[0.2em] text-[#FF9D67] font-semibold block"
                            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                          >
                            Conceptual Pillar 02
                          </span>
                          <span
                            className="text-xs font-semibold uppercase tracking-wider text-surface"
                            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                          >
                            System Transparency
                          </span>
                        </div>
                        <span className="text-[10px] text-secondary-container tracking-wider uppercase bg-secondary-container/10 border border-secondary-container/30 px-2.5 py-1 rounded-full font-medium hover:border-secondary-container/60 hover:shadow-[0_0_12px_rgba(255,79,120,0.4)] transition-all">
                          No Black Box
                        </span>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <h3
                          className="text-lg sm:text-xl font-normal text-surface tracking-tight"
                          style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}
                        >
                          Context Behind An Introduction
                        </h3>
                        <p
                          className="text-xs sm:text-[14px] text-surface/90 leading-relaxed"
                          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                        >
                          Transparent overlap revealed prior to connection. Both individuals understand the clear, tangible reason for discovery before any message is dispatched.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-3 sm:pt-4 flex items-center justify-between text-[#FF9D67] text-[11px] font-mono relative z-10">
                      <span className="uppercase tracking-wider">Phase · Clarity</span>
                      <span className="material-symbols-outlined text-lg">all_inclusive</span>
                    </div>
                  </div>

                  {/* Pillar 03 */}
                  <div
                    onMouseMove={handleSpotlightMouseMove}
                    className="reveal-item spotlight-card bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md flex flex-col justify-between space-y-5 sm:space-y-6 hover:border-white/25 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="space-y-4 sm:space-y-5 relative z-10">
                      <div className="flex justify-between items-center border-b border-white/10 pb-3 sm:pb-3.5">
                        <div className="space-y-0.5">
                          <span
                            className="text-[10px] uppercase tracking-[0.2em] text-surface/50 font-semibold block"
                            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                          >
                            Conceptual Pillar 03
                          </span>
                          <span
                            className="text-xs font-semibold uppercase tracking-wider text-surface"
                            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                          >
                            Interaction Protocol
                          </span>
                        </div>
                        <span className="text-[10px] text-[#FF9D67] tracking-wider uppercase bg-[#FF9D67]/10 border border-[#FF9D67]/20 px-2.5 py-1 rounded-full font-medium hover:border-[#FF9D67]/50 hover:shadow-[0_0_12px_rgba(255,157,103,0.3)] transition-all">
                          Bilateral Agency
                        </span>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <h3
                          className="text-lg sm:text-xl font-normal text-surface tracking-tight"
                          style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}
                        >
                          Mutual, Deliberate Choice
                        </h3>
                        <p
                          className="text-xs sm:text-[14px] text-surface/80 leading-relaxed"
                          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                        >
                          Strict bilateral consent with zero unsolicited cold broadcasts, gamified urgency triggers, or manipulative engagement loops.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-3 sm:pt-4 flex items-center justify-between text-surface/50 text-[11px] font-mono relative z-10">
                      <span className="uppercase tracking-wider">Phase · Connection</span>
                      <span className="material-symbols-outlined text-secondary-container text-base">lock</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descriptive Footnote */}
              <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-surface/60 text-xs sm:text-sm border-t border-white/10 pt-4 gap-2"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                <span className="tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                  No swipe carousels. No compulsive refreshes.
                </span>
                <span
                  className="italic text-surface/80 text-xs sm:text-[15px]"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  A thoughtful framework designed for mutual, unpressured introductions.
                </span>
              </div>
            </div>
          </section>

          {/* SECTION FOUR: JABALPUR FIRST, GLOBAL AMBITION */}
          <section className="reveal-on-scroll w-full bg-background px-4 sm:px-6 lg:px-8 py-10 sm:py-space-xl">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-md sm:gap-space-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-space-lg items-start">
                <div className="lg:col-span-5 space-y-3 sm:space-y-space-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-secondary inline-block flex-shrink-0"></span>
                    <span
                      className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-on-surface font-semibold"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    >
                      Planned First Market: Jabalpur, India
                    </span>
                  </div>
                  <h2
                    className="text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[4.25rem] text-on-surface font-normal tracking-[-0.035em] leading-[1.1] sm:leading-[1.06]"
                    style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}
                  >
                    Starting in Jabalpur. <br />
                    <span className="italic font-normal text-on-surface-variant" style={{ fontFamily: "Fraunces, serif" }}>
                      Building for a wider world.
                    </span>
                  </h2>
                  <p
                    className="font-body-md text-sm sm:text-body-md text-on-surface-variant leading-relaxed"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    Most dating platforms begin in homogeneous tech capitals where attention is cheap and transactional fatigue is highest. Vouple is doing the opposite.
                  </p>
                  <p
                    className="font-body-md text-sm sm:text-body-md text-on-surface leading-relaxed"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    We are planning our inaugural release in Jabalpur—a city with rich literary heritage, quiet urban density, and people who value deliberate social trust. By first testing context and stated intentions in this community, we aim to shape a dignified standard that can expand to a wider world.
                  </p>
                  <div className="pt-2 sm:pt-space-sm flex items-center gap-4 sm:gap-space-lg">
                    <div>
                      <p
                        className="text-xl sm:text-2xl font-normal text-on-surface tracking-tight"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        Initial Phase
                      </p>
                      <p
                        className="font-label-caps text-[0.65rem] text-on-surface-variant uppercase tracking-[0.16em]"
                        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                      >
                        Waitlist &amp; Architecture
                      </p>
                    </div>
                    <div className="h-8 w-px bg-on-surface/10"></div>
                    <div>
                      <p
                        className="text-xl sm:text-2xl font-normal text-on-surface tracking-tight"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        18+ Only
                      </p>
                      <p
                        className="font-label-caps text-[0.65rem] text-on-surface-variant uppercase tracking-[0.16em]"
                        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                      >
                        Planned Onboarding Standard
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scenic Editorial Mosaic */}
                <div className="lg:col-span-7 flex flex-col gap-space-xs mt-4 lg:mt-0">
                  <div className="group relative bg-surface-container-high/60 border border-on-surface/10 p-2.5 sm:p-3 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-container-high shadow-inner">
                      <Image
                        src="/images/jabalpur-marble-rocks.jpg"
                        alt="Breathtaking golden hour view of Marble Rocks Narmada river gorge at sunset with boat reflections in Jabalpur India"
                        width={960}
                        height={540}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-2 text-white/90 text-[10px] sm:text-[11px] font-medium border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-[#FF9D67] radar-beacon"></span>
                        <span>Narmada River Valley</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 sm:pt-3 px-1 gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-label-caps text-[0.65rem] text-secondary font-bold uppercase tracking-widest">
                          Inaugural Market:
                        </span>
                        <span className="text-[11px] text-on-surface-variant">Bhedaghat Marble Rocks, Jabalpur</span>
                      </div>
                      <span className="hidden sm:inline font-label-serif text-label-serif italic text-on-surface-variant text-right text-xs">
                        Planned cohort № 001
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION FIVE: SAFETY AND TRUST */}
          <section
            id="safety"
            className="reveal-on-scroll w-full bg-surface-container px-4 sm:px-6 lg:px-8 py-10 sm:py-space-xl border-t border-on-surface/5"
          >
            <div className="max-w-7xl mx-auto flex flex-col gap-space-md sm:gap-space-lg">
              <div className="max-w-2xl space-y-2 sm:space-y-space-xs">
                <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary font-bold">
                  Integrity First
                </span>
                <h2
                  className="text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[4rem] text-on-surface font-normal leading-[1.1] sm:leading-[1.08] tracking-[-0.03em]"
                  style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}
                >
                  Trust should be earned,{" "}
                  <span className="italic text-secondary" style={{ fontFamily: "Fraunces, serif" }}>
                    not advertised.
                  </span>
                </h2>
                <p className="font-body-md text-sm sm:text-body-md text-on-surface-variant">
                  Safety is built into the architecture from inception, not tacked on as a response to crisis.
                </p>
              </div>

              {/* 2-Column Editorial Lines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2 sm:pt-space-sm">
                {/* 01 */}
                <div className="reveal-item bg-surface-container-low/70 border border-on-surface/10 hover:border-secondary/35 rounded-2xl p-4 sm:p-6 flex items-start gap-3.5 sm:gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary/10 border border-secondary/20 group-hover:bg-secondary group-hover:text-white transition-all duration-300 flex items-center justify-center font-headline-sm text-xs sm:text-body-sm text-secondary font-bold flex-shrink-0 group-hover:shadow-[0_0_16px_rgba(185,19,72,0.35)]">
                    01
                  </span>
                  <div className="space-y-1 sm:space-y-1.5">
                    <h3 className="font-headline-sm text-base sm:text-headline-sm text-on-surface group-hover:text-secondary transition-colors">
                      Adults-Only Eligibility
                    </h3>
                    <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant leading-relaxed">
                      Strict 18+ requirement planned for onboarding to foster maturity and intentional dialogue across all members.
                    </p>
                  </div>
                </div>

                {/* 02 */}
                <div className="reveal-item bg-surface-container-low/70 border border-on-surface/10 hover:border-secondary/35 rounded-2xl p-4 sm:p-6 flex items-start gap-3.5 sm:gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary/10 border border-secondary/20 group-hover:bg-secondary group-hover:text-white transition-all duration-300 flex items-center justify-center font-headline-sm text-xs sm:text-body-sm text-secondary font-bold flex-shrink-0 group-hover:shadow-[0_0_16px_rgba(185,19,72,0.35)]">
                    02
                  </span>
                  <div className="space-y-1 sm:space-y-1.5">
                    <h3 className="font-headline-sm text-base sm:text-headline-sm text-on-surface group-hover:text-secondary transition-colors">
                      Granular Visibility Controls
                    </h3>
                    <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant leading-relaxed">
                      Architecture designed to give you sovereignty over your dossier, limiting exposure strictly to vetted parameters you define.
                    </p>
                  </div>
                </div>

                {/* 03 */}
                <div className="reveal-item bg-surface-container-low/70 border border-on-surface/10 hover:border-secondary/35 rounded-2xl p-4 sm:p-6 flex items-start gap-3.5 sm:gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary/10 border border-secondary/20 group-hover:bg-secondary group-hover:text-white transition-all duration-300 flex items-center justify-center font-headline-sm text-xs sm:text-body-sm text-secondary font-bold flex-shrink-0 group-hover:shadow-[0_0_16px_rgba(185,19,72,0.35)]">
                    03
                  </span>
                  <div className="space-y-1 sm:space-y-1.5">
                    <h3 className="font-headline-sm text-base sm:text-headline-sm text-on-surface group-hover:text-secondary transition-colors">
                      Privacy-Conscious Architecture
                    </h3>
                    <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant leading-relaxed">
                      Built on principles of zero surveillance capitalism and zero data brokering. We will never monetize personal habits or chat content.
                    </p>
                  </div>
                </div>

                {/* 04 */}
                <div className="reveal-item bg-surface-container-low/70 border border-on-surface/10 hover:border-secondary/35 rounded-2xl p-4 sm:p-6 flex items-start gap-3.5 sm:gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary/10 border border-secondary/20 group-hover:bg-secondary group-hover:text-white transition-all duration-300 flex items-center justify-center font-headline-sm text-xs sm:text-body-sm text-secondary font-bold flex-shrink-0 group-hover:shadow-[0_0_16px_rgba(185,19,72,0.35)]">
                    04
                  </span>
                  <div className="space-y-1 sm:space-y-1.5">
                    <h3 className="font-headline-sm text-base sm:text-headline-sm text-on-surface group-hover:text-secondary transition-colors">
                      Mutual Permission Inboxes
                    </h3>
                    <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant leading-relaxed">
                      Designed so direct messaging requires bilateral agreement before any conversation begins—preventing unsolicited messages.
                    </p>
                  </div>
                </div>

                {/* 05 */}
                <div className="reveal-item bg-surface-container-low/70 border border-on-surface/10 hover:border-secondary/35 rounded-2xl p-4 sm:p-6 flex items-start gap-3.5 sm:gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary/10 border border-secondary/20 group-hover:bg-secondary group-hover:text-white transition-all duration-300 flex items-center justify-center font-headline-sm text-xs sm:text-body-sm text-secondary font-bold flex-shrink-0 group-hover:shadow-[0_0_16px_rgba(185,19,72,0.35)]">
                    05
                  </span>
                  <div className="space-y-1 sm:space-y-1.5">
                    <h3 className="font-headline-sm text-base sm:text-headline-sm text-on-surface group-hover:text-secondary transition-colors">
                      Discreet Tooling
                    </h3>
                    <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant leading-relaxed">
                      Planned one-tap block, silence, and discreet report tools to maintain a dignified space without friction.
                    </p>
                  </div>
                </div>

                {/* 06 */}
                <div className="reveal-item bg-surface-container-low/70 border border-on-surface/10 hover:border-secondary/35 rounded-2xl p-4 sm:p-6 flex items-start gap-3.5 sm:gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary/10 border border-secondary/20 group-hover:bg-secondary group-hover:text-white transition-all duration-300 flex items-center justify-center font-headline-sm text-xs sm:text-body-sm text-secondary font-bold flex-shrink-0 group-hover:shadow-[0_0_16px_rgba(185,19,72,0.35)]">
                    06
                  </span>
                  <div className="space-y-1 sm:space-y-1.5">
                    <h3 className="font-headline-sm text-base sm:text-headline-sm text-on-surface group-hover:text-secondary transition-colors">
                      Responsible Human Moderation
                    </h3>
                    <p className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant leading-relaxed">
                      Commitment to human-supervised review workflows sensitive to local cultural nuances, rather than unmonitored automated systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION SIX: WAITLIST CONVERSION SECTION */}
          <section
            id="waitlist"
            className="reveal-on-scroll w-full bg-primary text-on-primary px-4 sm:px-6 lg:px-8 py-10 sm:py-space-xl relative overflow-hidden"
          >
            {/* Subtle glow accent background */}
            <div className="absolute -right-24 -bottom-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>

            <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-space-sm sm:gap-space-md relative z-10">
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary-container">
                Early Access
              </span>
              <h2
                className="text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[4.5rem] text-surface font-normal tracking-[-0.035em] leading-[1.1] sm:leading-[1.08]"
                style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}
              >
                Be part of Vouple's{" "}
                <span className="italic text-secondary-fixed" style={{ fontFamily: "Fraunces, serif" }}>
                  beginning.
                </span>
              </h2>
              <p className="font-body-lg text-sm sm:text-body-lg text-surface-container-high/80 max-w-xl">
                We're starting right here in Jabalpur. Join the waitlist for private dispatch notes and cohort opening dates.
              </p>

              {/* Waitlist Interactive Form or Success Banner */}
              {!isSubmitted ? (
                <form
                  id="waitlistForm"
                  noValidate
                  onSubmit={handleSubmitWaitlist}
                  className="w-full max-w-lg space-y-space-md text-left transition-all duration-300 mt-2"
                >
                  <div className="bg-[#1f191e]/90 border border-white/10 p-4 sm:p-7 md:p-8 rounded-2xl shadow-2xl backdrop-blur-md space-y-4 sm:space-y-5 transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(255,79,120,0.12)]">
                    {/* In-Form Dynamic Banner (for errors / notices) */}
                    {bannerNotice && (
                      <div
                        className={`p-3 sm:p-3.5 rounded-xl border text-xs font-medium space-y-1 block transition-all duration-300 ${
                          bannerNotice.type === "error"
                            ? "border-red-500/40 bg-red-500/10 text-red-200"
                            : bannerNotice.type === "duplicate"
                            ? "border-[#FF9D67]/40 bg-[#FF9D67]/10 text-[#FFdbca]"
                            : "border-secondary-container/40 bg-secondary-container/10 text-secondary-fixed"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm flex-shrink-0">
                            {bannerNotice.type === "duplicate" ? "info" : "error"}
                          </span>
                          <span>{bannerNotice.message}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label
                        htmlFor="waitlistEmail"
                        className="font-label-caps text-[10px] sm:text-[11px] uppercase tracking-wider text-surface/80 flex items-center justify-between"
                      >
                        <span>Your Email Address</span>
                        <span className="text-[#FF9D67] text-[10px] tracking-widest font-normal">
                          INVITATION ONLY
                        </span>
                      </label>
                      <div className="relative group">
                        <input
                          id="waitlistEmail"
                          type="email"
                          value={emailInput}
                          onChange={(e) => {
                            setEmailInput(e.target.value);
                            if (emailError) setEmailError(null);
                          }}
                          placeholder="name@example.com"
                          className={`w-full bg-white/5 border rounded-xl px-4 py-3 sm:py-3.5 text-surface font-body-md text-base placeholder:text-surface/30 focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner ${
                            emailError
                              ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                              : "border-white/15 focus:border-secondary-container focus:ring-secondary-container/30"
                          }`}
                        />
                      </div>
                      {emailError && (
                        <p className="text-xs text-secondary-container font-medium pt-1">
                          {emailError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 pt-1 border-t border-white/10">
                      {/* Checkbox 1: Age (Required) - min 44px tap area */}
                      <label htmlFor="checkAge" className="flex items-start gap-3 cursor-pointer group select-none min-h-[44px] py-1">
                        <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
                          <input
                            id="checkAge"
                            type="checkbox"
                            checked={isAdultChecked}
                            onChange={(e) => setIsAdultChecked(e.target.checked)}
                            className="custom-checkbox sr-only"
                          />
                          <div
                            className={`checkbox-box w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                              isAdultChecked
                                ? "bg-secondary-container border-secondary-container"
                                : "border-surface/40 bg-surface/10 group-hover:border-secondary-container"
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-[13px] text-white transition-opacity ${
                                isAdultChecked ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              check
                            </span>
                          </div>
                        </div>
                        <span className="font-body-sm text-xs sm:text-body-sm text-surface/70 group-hover:text-surface transition-colors leading-tight sm:leading-normal">
                          I confirm I am 18 years of age or older.
                        </span>
                      </label>

                      {/* Checkbox 2: Updates Consent (Required) - min 44px tap area */}
                      <label htmlFor="checkUpdates" className="flex items-start gap-3 cursor-pointer group select-none min-h-[44px] py-1">
                        <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
                          <input
                            id="checkUpdates"
                            type="checkbox"
                            checked={isUpdatesChecked}
                            onChange={(e) => setIsUpdatesChecked(e.target.checked)}
                            className="custom-checkbox sr-only"
                          />
                          <div
                            className={`checkbox-box w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                              isUpdatesChecked
                                ? "bg-secondary-container border-secondary-container"
                                : "border-surface/40 bg-surface/10 group-hover:border-secondary-container"
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-[13px] text-white transition-opacity ${
                                isUpdatesChecked ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              check
                            </span>
                          </div>
                        </div>
                        <span className="font-body-sm text-xs sm:text-body-sm text-surface/70 group-hover:text-surface transition-colors leading-tight sm:leading-normal">
                          Keep me updated on Vouple launch announcements and Jabalpur city access.
                        </span>
                      </label>
                    </div>

                    <button
                      id="waitlistSubmitBtn"
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-shimmer w-full py-3.5 sm:py-4 px-4 sm:px-space-md rounded-full bg-gradient-to-r from-secondary-container via-secondary to-[#FF9D67] text-on-primary font-headline-sm text-xs sm:text-body-md font-bold uppercase tracking-wider shadow-lg hover:shadow-secondary/35 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed min-h-[48px]"
                    >
                      {isSubmitting && (
                        <svg
                          className="w-5 h-5 text-white animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      )}
                      <span>
                        {isSubmitting ? "Joining waitlist..." : "Request Jabalpur Invitation"}
                      </span>
                      {!isSubmitting && (
                        <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">
                          arrow_forward
                        </span>
                      )}
                    </button>

                    <div className="text-center pt-1">
                      <a
                        href="/privacy"
                        className="font-label-serif text-label-serif italic text-surface/50 hover:text-surface transition-colors underline decoration-surface/20 text-xs"
                      >
                        Read our commitment to user privacy &amp; data minimization
                      </a>
                    </div>
                  </div>
                </form>
              ) : (
                /* Feedback Banner / Real Success State Container */
                <div
                  id="waitlistFeedback"
                  className="w-full max-w-lg p-5 sm:p-space-lg bg-[#1f191e]/95 border border-secondary-container/50 rounded-2xl text-center space-y-4 transition-all duration-500 backdrop-blur-md shadow-2xl animate-hero-1 mt-2"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-secondary-container/20 border border-secondary-container/40 flex items-center justify-center shadow-[0_0_24px_rgba(255,79,120,0.35)]">
                    <svg
                      className="w-7 h-7 sm:w-8 sm:h-8 text-secondary-container"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path className="animate-check-draw" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3
                      className="text-2xl sm:text-3xl text-surface font-normal tracking-[-0.02em]"
                      style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}
                    >
                      You're on the list.
                    </h3>
                    <p className="font-body-md text-sm sm:text-body-md text-surface/90 leading-relaxed max-w-md mx-auto">
                      Thanks for your interest in Vouple. We'll email you when there are meaningful updates about our planned launch in Jabalpur.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <p className="font-body-sm text-xs text-surface/60 italic">
                      Joining the waitlist does not create a dating account or guarantee beta access.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleResetWaitlist}
                      className="text-xs uppercase tracking-wider text-surface/60 hover:text-white underline decoration-white/30 transition-colors py-1 inline-block"
                    >
                      Register another address
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SECTION SEVEN: FAQ ACCORDION */}
          <section
            id="faq"
            className="reveal-on-scroll w-full bg-background px-4 sm:px-6 lg:px-8 py-10 sm:py-space-xl border-t border-on-surface/10"
          >
            <div className="max-w-5xl mx-auto flex flex-col gap-space-md sm:gap-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-space-md pb-3 sm:pb-space-sm border-b border-on-surface/10">
                <div className="space-y-1 sm:space-y-space-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
                    <span className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-secondary font-bold">
                      Questions &amp; Clarity
                    </span>
                  </div>
                  <h2
                    className="text-[2.2rem] sm:text-4xl md:text-5xl lg:text-[4rem] text-on-surface font-normal tracking-[-0.03em] leading-[1.1] sm:leading-[1.08]"
                    style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}
                  >
                    Frequently asked{" "}
                    <span className="italic text-on-surface-variant" style={{ fontFamily: "Fraunces, serif" }}>
                      questions
                    </span>
                  </h2>
                </div>
                <p
                  className="font-body-sm text-xs sm:text-body-sm text-on-surface-variant max-w-xs leading-relaxed"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  Deliberate details regarding our inaugural Jabalpur release, methodology, and privacy standard.
                </p>
              </div>

              {/* Elevated Editorial Accordion Stack */}
              <div className="flex flex-col gap-2.5 sm:gap-3.5 pt-1 sm:pt-space-xs">
                {FAQS.map((faq, idx) => {
                  const isOpen = activeFaqIndex === idx;
                  return (
                    <div
                      key={faq.id}
                      className={`faq-item overflow-hidden transition-all ${isOpen ? "active" : ""}`}
                    >
                      <span aria-hidden="true" className="faq-accent-bar"></span>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between text-left px-4 sm:px-7 py-3.5 sm:py-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 rounded-2xl transition-all group min-h-[52px]"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-4 pr-3 sm:pr-4">
                          <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-secondary tracking-widest uppercase flex-shrink-0">
                            {faq.number}
                          </span>
                          <span
                            className="font-headline-sm text-base sm:text-lg sm:text-xl text-on-surface group-hover:text-secondary transition-colors leading-snug"
                            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                          >
                            {faq.question}
                          </span>
                        </div>
                        <span aria-hidden="true" className="faq-icon-badge flex-shrink-0 w-8 h-8 sm:w-[38px] sm:h-[38px]">
                          <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-on-surface-variant faq-icon-glyph">
                            add
                          </span>
                        </span>
                      </button>

                      <div className="faq-content">
                        <div className="faq-content-inner px-4 sm:px-7 pb-4 sm:pb-6 pt-1">
                          <div className="border-t border-on-surface/8 pt-3 sm:pt-4 space-y-2.5 sm:space-y-3">
                            <p
                              className="text-sm sm:text-[15.5px] text-[#443a3d] leading-[1.7] sm:leading-[1.75] font-normal"
                              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                            >
                              {faq.answer}
                            </p>
                            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-secondary/8 border border-secondary/15 text-[10px] sm:text-[11px] font-medium text-secondary">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                              <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                {faq.tag}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-low mt-10 sm:mt-space-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-space-xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 sm:gap-space-lg pb-6 sm:pb-space-lg">
            <div className="space-y-1.5 sm:space-y-space-xs">
              <div
                onClick={(e) => scrollToSection(e as any, "#")}
                className="flex items-center gap-1 group cursor-pointer inline-flex"
              >
                <span className="font-headline-md text-xl sm:text-headline-md tracking-tighter lowercase text-on-surface">
                  vouple
                </span>
                <span className="w-2 h-2 rounded-full bg-secondary-container mb-0.5 sm:mb-1 group-hover:scale-125 transition-transform duration-300"></span>
              </div>
              <p className="font-editorial-quote text-sm sm:text-editorial-quote italic text-on-surface-variant max-w-sm">
                Every introduction should have a reason.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-4 sm:gap-x-space-lg gap-y-2 items-center">
              <a
                href="#the-idea"
                onClick={(e) => scrollToSection(e, "#the-idea")}
                className="nav-link font-body-sm text-xs sm:text-body-sm text-on-surface-variant hover:text-on-surface transition-colors py-1"
              >
                The Idea
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, "#how-it-works")}
                className="nav-link font-body-sm text-xs sm:text-body-sm text-on-surface-variant hover:text-on-surface transition-colors py-1"
              >
                How It Works
              </a>
              <a
                href="#safety"
                onClick={(e) => scrollToSection(e, "#safety")}
                className="nav-link font-body-sm text-xs sm:text-body-sm text-on-surface-variant hover:text-on-surface transition-colors py-1"
              >
                Safety
              </a>
              <a
                href="#faq"
                onClick={(e) => scrollToSection(e, "#faq")}
                className="nav-link font-body-sm text-xs sm:text-body-sm text-on-surface-variant hover:text-on-surface transition-colors py-1"
              >
                FAQ
              </a>
              <a
                href="#waitlist"
                onClick={(e) => scrollToSection(e, "#waitlist")}
                className="nav-link font-body-sm text-xs sm:text-body-sm text-on-surface-variant hover:text-on-surface transition-colors py-1"
              >
                Join Waitlist
              </a>
              <Link
                href="/privacy"
                className="nav-link font-body-sm text-xs sm:text-body-sm text-on-surface-variant hover:text-on-surface transition-colors py-1"
              >
                Privacy Notice
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-4 sm:pt-space-md border-t border-outline-variant/30 text-xs text-on-surface-variant">
            <p className="font-label-caps text-[11px] sm:text-label-caps">
              © 2025 Vouple. Designed for intentional encounters in Jabalpur.
            </p>
            <p className="font-body-sm text-[11px] sm:text-body-sm">
              Private invitation &amp; vetted cohort platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
