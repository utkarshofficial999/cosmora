"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Plus, Minus } from "lucide-react";
import { StarfieldCanvas } from "@/components/three/StarfieldCanvas";
import { Footer } from "@/components/ui/Footer";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: "Free Explorer",
      monthlyPrice: 0,
      yearlyPrice: 0,
      sub: "For the endlessly curious",
      features: ["Interactive solar system", "50 stories / month", "Public mission feed", "Community access"],
      cta: "Start Free",
      href: "/solar-system",
      accent: "#4DA8FF",
      isPopular: false,
    },
    {
      name: "Premium Explorer",
      monthlyPrice: 12,
      yearlyPrice: 115,
      sub: "For serious space lovers",
      features: [
        "Everything in Free",
        "Unlimited stories & timeline",
        "AI assistant — Nova",
        "Live telemetry & alerts",
        "Early access to VR",
        "Offline mode",
      ],
      cta: "Go Premium",
      href: "/contact",
      accent: "#8B5CF6",
      isPopular: true,
    },
    {
      name: "Future Enterprise",
      monthlyPrice: null,
      yearlyPrice: null,
      sub: "Museums, schools & agencies",
      features: [
        "Everything in Premium",
        "Classroom management",
        "Custom stories & branding",
        "SSO & analytics",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      href: "/contact",
      accent: "#FF7B54",
      isPopular: false,
    },
  ];

  const compareRows = [
    { name: "Interactive solar system", free: true, premium: true, enterprise: true },
    { name: "Stories per month", free: "50", premium: "Unlimited", enterprise: "Unlimited" },
    { name: "AI assistant (Nova)", free: false, premium: true, enterprise: true },
    { name: "Live telemetry & alerts", free: false, premium: true, enterprise: true },
    { name: "Offline mode", free: false, premium: true, enterprise: true },
    { name: "VR early access", free: false, premium: true, enterprise: true },
    { name: "Classroom management", free: false, premium: false, enterprise: true },
    { name: "SSO & analytics", free: false, premium: false, enterprise: true },
    { name: "Dedicated support", free: false, premium: false, enterprise: true },
  ];

  const benefits = [
    { title: "Unlimited", desc: "Stories & timeline access" },
    { title: "Nova AI", desc: "Your personal space guide" },
    { title: "Live Telemetry", desc: "Real-time launch alerts" },
    { title: "Offline Access", desc: "Explore without a signal" },
    { title: "VR Experience", desc: "Early access to VR modes" },
    { title: "Ad-Free", desc: "Pure, cinematic focus" },
  ];

  const faqs = [
    {
      q: "Is Cosmora really free?",
      a: "Yes — the Free Explorer plan is free forever and includes the full interactive solar system and 50 stories a month. No credit card required.",
    },
    {
      q: "Can I switch plans anytime?",
      a: "Absolutely. Upgrade, downgrade or cancel at any time. Yearly plans are prorated if you switch mid-cycle.",
    },
    {
      q: "Do you offer education discounts?",
      a: "Yes. Schools and non-profits get significant discounts through our Enterprise plan — reach out via our contact page.",
    },
    {
      q: "When does VR mode launch?",
      a: "VR mode enters early access in Q3 2026 for Premium Explorers. Join the waitlist to be first in line.",
    },
    {
      q: "What data sources power Cosmora?",
      a: "We ingest live feeds from NASA, ISRO, ESA and SpaceX, plus peer-reviewed archives — every fact is cited in-app.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#F5F7FA] overflow-x-hidden selection:bg-[#4DA8FF]/30 selection:text-white pt-24">
      {/* Starfield Background */}
      <StarfieldCanvas />

      {/* Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(1200px_800px_at_50%_-10%,rgba(139,92,246,0.18),transparent_60%),radial-gradient(1000px_700px_at_10%_40%,rgba(77,168,255,0.1),transparent_55%)]" />

      {/* HERO */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-[#00E5FF]/30 backdrop-blur-md text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
          Pricing & Subscriptions
        </div>
        <h1 className="font-['Space_Grotesk'] font-bold text-4xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-6">
          Choose your{" "}
          <span className="bg-gradient-to-r from-[#4DA8FF] via-[#8B5CF6] to-[#00E5FF] bg-clip-text text-transparent bg-[length:200%_auto] animate-[aurora_6s_ease_infinite]">
            orbit
          </span>
        </h1>
        <p className="text-base sm:text-xl text-[#F5F7FA]/70 max-w-lg mx-auto leading-relaxed mb-8">
          Start free forever. Upgrade when you&apos;re ready to go deeper into the cosmos.
        </p>

        {/* Toggle Billing */}
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/6 border border-white/12 backdrop-blur-md">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              !isYearly ? "bg-gradient-to-r from-[#4DA8FF] to-[#8B5CF6] text-white" : "text-white/60 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              isYearly ? "bg-gradient-to-r from-[#4DA8FF] to-[#8B5CF6] text-white" : "text-white/60 hover:text-white"
            }`}
          >
            Yearly <span className="text-xs opacity-80">-20%</span>
          </button>
        </div>
      </section>

      {/* PLANS CARDS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 backdrop-blur-md border transition-all ${
                p.isPopular
                  ? "border-[#8B5CF6]/50 bg-gradient-to-b from-[#8B5CF6]/20 to-white/6 shadow-[0_20px_60px_rgba(139,92,246,0.25)] md:-translate-y-2"
                  : "border-white/10 bg-white/6"
              }`}
            >
              {p.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#4DA8FF] to-[#8B5CF6] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </span>
              )}
              <div className="font-['Space_Grotesk'] font-semibold text-xl mb-1" style={{ color: p.accent }}>
                {p.name}
              </div>
              <div className="text-white/55 text-sm mb-6">{p.sub}</div>

              <div className="mb-6">
                {p.monthlyPrice === null ? (
                  <>
                    <div className="font-['Space_Grotesk'] font-bold text-4xl text-white">Custom</div>
                    <div className="text-white/50 text-xs mt-1">Let&apos;s build your orbit</div>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="font-['Space_Grotesk'] font-bold text-5xl text-white">
                        ${isYearly ? Math.round((p.yearlyPrice || 0) / 12) : p.monthlyPrice}
                      </span>
                      <span className="text-white/50 text-sm">/mo</span>
                    </div>
                    <div className="text-white/50 text-xs mt-1">
                      {p.monthlyPrice === 0
                        ? "Free forever"
                        : isYearly
                        ? `Billed $${p.yearlyPrice}/yr`
                        : "Billed monthly"}
                    </div>
                  </>
                )}
              </div>

              <Link
                href={p.href}
                className={`block text-center w-full py-3.5 rounded-xl font-semibold text-sm transition-all mb-8 ${
                  p.isPopular
                    ? "bg-gradient-to-r from-[#4DA8FF] to-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30"
                    : "bg-white/6 border border-white/16 text-white hover:bg-white/12"
                }`}
              >
                {p.cta}
              </Link>

              <div className="space-y-3">
                {p.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-3 text-sm text-white/85">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{
                        backgroundColor: `${p.accent}22`,
                        borderColor: `${p.accent}55`,
                        color: p.accent,
                      }}
                    >
                      ✓
                    </span>
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARE MATRIX */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="text-center mb-10">
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl tracking-tight">
            Compare every detail
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/6 backdrop-blur-md">
          <div className="grid grid-cols-4 font-['Space_Grotesk'] font-semibold text-sm bg-white/4 p-4 border-b border-white/8 text-white/60">
            <div>Feature</div>
            <div className="text-center">Free</div>
            <div className="text-center text-[#00E5FF]">Premium</div>
            <div className="text-center">Enterprise</div>
          </div>

          {compareRows.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-4 items-center p-4 border-b border-white/6 text-sm ${
                idx % 2 === 1 ? "bg-white/2" : ""
              }`}
            >
              <div className="text-white font-medium">{row.name}</div>
              <div className="text-center text-white/60">
                {typeof row.free === "boolean" ? (row.free ? <Check className="w-5 h-5 mx-auto text-white/80" /> : "—") : row.free}
              </div>
              <div className="text-center bg-[#00E5FF]/4 py-2 rounded-lg text-[#00E5FF] font-bold">
                {typeof row.premium === "boolean" ? (row.premium ? <Check className="w-5 h-5 mx-auto text-[#00E5FF]" /> : "—") : row.premium}
              </div>
              <div className="text-center text-white/60">
                {typeof row.enterprise === "boolean" ? (row.enterprise ? <Check className="w-5 h-5 mx-auto text-white/80" /> : "—") : row.enterprise}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS & EARLY ACCESS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          <div className="rounded-3xl p-10 border border-white/10 bg-[radial-gradient(500px_300px_at_100%_0%,rgba(139,92,246,0.22),transparent_60%),rgba(255,255,255,0.06)] backdrop-blur-md">
            <div className="text-[#8B5CF6] text-xs font-mono tracking-widest uppercase mb-3">
              Premium Benefits
            </div>
            <h2 className="font-['Space_Grotesk'] font-bold text-3xl mb-6">Everything, unlocked</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 flex items-center justify-center text-xs text-[#c9b8ff] mt-0.5">
                    ✓
                  </span>
                  <div>
                    <div className="font-semibold text-sm text-white">{b.title}</div>
                    <div className="text-white/55 text-xs">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl p-10 border border-[#FF7B54]/30 bg-[radial-gradient(400px_300px_at_0%_100%,rgba(255,123,84,0.2),transparent_60%),rgba(255,255,255,0.06)] backdrop-blur-md flex flex-col justify-center">
            <div className="text-[#FF7B54] text-xs font-mono tracking-widest uppercase mb-3">
              Early Access
            </div>
            <h2 className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl mb-3 leading-snug">
              Be first to walk on Mars — in VR
            </h2>
            <p className="text-white/65 text-sm leading-relaxed mb-6">
              Premium Explorers get early access to every new experience, including our upcoming VR mode.
            </p>
            <Link
              href="/contact"
              className="inline-block self-start bg-gradient-to-r from-[#FF7B54] to-[#8B5CF6] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Join the waitlist
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 py-14">
        <div className="text-center mb-10">
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="rounded-2xl border border-white/10 bg-white/6 backdrop-blur-md overflow-hidden cursor-pointer transition-colors"
              >
                <div className="p-6 flex justify-between items-center">
                  <h3 className="font-['Space_Grotesk'] font-semibold text-lg text-white">
                    {faq.q}
                  </h3>
                  <span className="text-[#00E5FF] text-xl font-bold ml-4">
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </span>
                </div>
                {isOpen && (
                  <div className="px-6 pb-6 text-white/65 text-sm leading-relaxed border-t border-white/6 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
