"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { StarfieldCanvas } from "@/components/three/StarfieldCanvas";
import { Footer } from "@/components/ui/Footer";

export default function FeaturesPage() {
  const featureRows = [
    {
      kick: "Explore",
      title: "Interactive Solar System",
      desc: "Fly through a real-scale, physics-aware model of our solar system. Pinch, orbit and dive into any world to unlock its story, moons and missions.",
      color: "#4DA8FF",
      bullets: ["Real orbital mechanics", "Tap-to-explore every body", "60fps on any device"],
      link: "/solar-system",
    },
    {
      kick: "Immerse",
      title: "Story Universe",
      desc: "Scroll-driven cinematic narratives that blend real telemetry, archival imagery and spatial audio into experiences you feel, not just read.",
      color: "#8B5CF6",
      bullets: ["1,240+ chapters", "Spatial audio narration", "Cited, accurate science"],
      link: "/stories",
    },
    {
      kick: "Track",
      title: "Mission Control",
      desc: "Follow every active and upcoming launch worldwide with live countdowns, telemetry and trajectory visualizations as they happen.",
      color: "#FF7B54",
      bullets: ["Live global launch feed", "Countdown & windows", "Trajectory replays"],
      link: "/missions",
    },
    {
      kick: "Understand",
      title: "Space Timeline",
      desc: "A living timeline from Sputnik to Starship. Scrub through 70 years of spaceflight and see how each milestone set up the next.",
      color: "#4DA8FF",
      bullets: ["Every milestone linked", "Filter by agency & era", "Jump into any story"],
      link: "/analytics",
    },
    {
      kick: "Learn",
      title: "Space Theories",
      desc: "Interactive explainers for the ideas that shape the frontier — orbital mechanics, relativity, black holes — visualized, not lectured.",
      color: "#00E5FF",
      bullets: ["Visual-first explainers", "Interactive simulations", "Beginner to expert"],
      link: "/analytics",
    },
    {
      kick: "Ask",
      title: "AI Assistant — Nova",
      desc: "Ask anything about the cosmos and get sourced, visual answers. Nova can build a guided tour of any topic on the spot.",
      color: "#8B5CF6",
      bullets: ["Sourced answers", "Generates guided tours", "Voice enabled"],
      link: "/ai-assistant",
    },
  ];

  const moreFeatures = [
    { title: "Analytics", desc: "Personal dashboards of what you've explored and learned.", color: "#4DA8FF" },
    { title: "Achievements", desc: "Unlock badges as you journey deeper into the cosmos.", color: "#FF7B54" },
    { title: "Learning System", desc: "Structured paths for classrooms and self-learners.", color: "#8B5CF6" },
    { title: "3D Experiences", desc: "Photoreal, downloadable 3D models of every spacecraft.", color: "#00E5FF" },
    { title: "Command Search", desc: "Jump to any planet, mission or story with ⌘K.", color: "#4DA8FF" },
    { title: "Voice Assistant", desc: "Explore hands-free — just ask, and Nova responds.", color: "#8B5CF6" },
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#F5F7FA] overflow-x-hidden selection:bg-[#4DA8FF]/30 selection:text-white pt-24">
      {/* 2D Canvas Starfield Background */}
      <StarfieldCanvas />

      {/* Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(1200px_800px_at_20%_-10%,rgba(77,168,255,0.16),transparent_60%),radial-gradient(1000px_700px_at_90%_20%,rgba(139,92,246,0.13),transparent_55%)]" />

      {/* HERO */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-[#00E5FF]/30 backdrop-blur-md text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
          The Platform
        </div>
        <h1 className="font-['Space_Grotesk'] font-bold text-4xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-6">
          Everything you need to{" "}
          <span className="bg-gradient-to-r from-[#4DA8FF] via-[#8B5CF6] to-[#00E5FF] bg-clip-text text-transparent bg-[length:200%_auto] animate-[aurora_6s_ease_infinite]">
            explore the universe
          </span>
        </h1>
        <p className="text-base sm:text-xl text-[#F5F7FA]/70 max-w-xl mx-auto leading-relaxed">
          Twelve deeply-built experiences, one seamless universe. Each designed to turn curiosity into understanding.
        </p>
      </section>

      {/* FEATURE ROWS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-12 space-y-16">
        {featureRows.map((row, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            } gap-12 items-center pt-8 ${idx !== 0 ? "border-t border-white/6" : ""}`}
          >
            <div className="flex-1">
              <div
                className="text-xs font-mono tracking-[2px] uppercase mb-3"
                style={{ color: row.color }}
              >
                {row.kick}
              </div>
              <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl tracking-tight mb-4 text-white">
                {row.title}
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-6">{row.desc}</p>
              <div className="space-y-3 mb-8">
                {row.bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-3 text-sm text-white/90">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: `${row.color}22`,
                        borderColor: `${row.color}55`,
                        color: row.color,
                      }}
                    >
                      ✓
                    </span>
                    {b}
                  </div>
                ))}
              </div>
              <Link
                href={row.link}
                className="inline-flex items-center gap-2 font-semibold text-sm hover:opacity-80 transition-opacity"
                style={{ color: row.color }}
              >
                Explore {row.title} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Feature Graphic / Card */}
            <div className="flex-1 w-full">
              <div className="rounded-3xl p-8 border border-white/10 bg-white/6 backdrop-blur-md min-h-[300px] flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div
                  className="w-36 h-36 rounded-full absolute -top-10 -right-10 opacity-30 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${row.color}, transparent 70%)` }}
                />
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border"
                  style={{
                    backgroundColor: `${row.color}22`,
                    borderColor: `${row.color}55`,
                  }}
                >
                  <span className="font-['Space_Grotesk'] font-bold text-2xl" style={{ color: row.color }}>
                    ✦
                  </span>
                </div>
                <div className="font-['Space_Grotesk'] font-semibold text-xl text-white mb-2">
                  {row.title}
                </div>
                <div className="text-white/50 text-xs max-w-xs">{row.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* BUILT INTO EVERY CORNER */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="text-center mb-12">
          <div className="text-[#8B5CF6] text-xs font-mono tracking-[3px] uppercase mb-3">
            And More
          </div>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl tracking-tight">
            Built into every corner
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moreFeatures.map((m, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-7 border border-white/10 bg-white/6 backdrop-blur-md hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="w-10 h-1 rounded-full mb-5" style={{ backgroundColor: m.color }} />
              <h3 className="font-['Space_Grotesk'] font-semibold text-xl mb-2 text-white">
                {m.title}
              </h3>
              <p className="text-white/65 text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-16">
        <div className="rounded-3xl p-10 md:p-14 text-center border border-[#4DA8FF]/25 bg-[radial-gradient(700px_400px_at_50%_0%,rgba(77,168,255,0.25),transparent_60%),linear-gradient(160deg,rgba(139,92,246,0.15),rgba(3,7,18,0.6))]">
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl tracking-tight mb-4">
            Start exploring, free
          </h2>
          <p className="text-white/70 max-w-md mx-auto text-sm sm:text-base mb-8">
            No signup required to fly through the solar system. Create an account to save your journey.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-gradient-to-r from-[#4DA8FF] to-[#8B5CF6] text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            See Plans
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
