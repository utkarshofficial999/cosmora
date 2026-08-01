"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { StarfieldCanvas } from "@/components/three/StarfieldCanvas";
import { Footer } from "@/components/ui/Footer";

export default function AboutPage() {
  const problems = [
    {
      color: "#4DA8FF",
      title: "Scattered everywhere",
      desc: "Data lives across dozens of agency portals, PDFs and press pages — no single place to follow the story.",
    },
    {
      color: "#FF7B54",
      title: "Written for experts",
      desc: "Most sources assume a physics degree. Wonder dies in jargon before it ever begins.",
    },
    {
      color: "#8B5CF6",
      title: "Static and lifeless",
      desc: "Flat pages and stock images can't convey the scale, motion and drama of real spaceflight.",
    },
  ];

  const compareRows = [
    { feature: "Story-driven narratives", nasa: false, isro: false, esa: false, cosmora: true },
    { feature: "Interactive real-scale 3D", nasa: false, isro: false, esa: false, cosmora: true },
    { feature: "Unified NASA + ISRO + ESA + SpaceX", nasa: false, isro: false, esa: false, cosmora: true },
    { feature: "Live mission control", nasa: true, isro: true, esa: false, cosmora: true },
    { feature: "Built-in AI assistant", nasa: false, isro: false, esa: false, cosmora: true },
    { feature: "Designed for learners", nasa: false, isro: true, esa: false, cosmora: true },
  ];

  const timeline = [
    { year: "2023", title: "The spark", desc: "A late-night frustration: why is the most exciting thing humans do so hard to follow?" },
    { year: "2024", title: "First prototype", desc: "A single interactive solar system demo — 10,000 people explored it in a week." },
    { year: "2025", title: "The platform", desc: "Stories, missions and timeline launch. Cosmora becomes a place, not a page." },
    { year: "2026", title: "Going global", desc: "ISRO, ESA and educator partnerships. Cosmora reaches classrooms on five continents." },
  ];

  const values = [
    { title: "Wonder first", desc: "Every decision optimizes for awe, not engagement metrics." },
    { title: "Scientifically honest", desc: "Real data, cited sources, no sensationalism." },
    { title: "Radically accessible", desc: "If a curious kid can't use it, we haven't finished." },
  ];

  const techStack = [
    "WebGL / three.js",
    "Real-time data pipeline",
    "Edge streaming",
    "AI narration",
    "Spatial audio",
    "PWA offline",
  ];

  const roadmap = [
    { color: "#4DA8FF", quarter: "Q3 2026", title: "VR Mode", desc: "Walk the surface of Mars in headset." },
    { color: "#FF7B54", quarter: "Q4 2026", title: "Community", desc: "Explorer-made stories & guided tours." },
    { color: "#8B5CF6", quarter: "2027", title: "Enterprise", desc: "Cosmora for museums & agencies." },
    { color: "#00E5FF", quarter: "2027", title: "Live Ops", desc: "Real-time mission broadcast overlays." },
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#F5F7FA] overflow-x-hidden selection:bg-[#4DA8FF]/30 selection:text-white pt-24">
      {/* 2D Canvas Starfield Background */}
      <StarfieldCanvas />

      {/* Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(1200px_800px_at_80%_-10%,rgba(139,92,246,0.16),transparent_60%),radial-gradient(1000px_700px_at_5%_30%,rgba(77,168,255,0.1),transparent_55%)]" />

      {/* HERO */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-14 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-[#00E5FF]/30 backdrop-blur-md text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
          Our Mission
        </div>
        <h1 className="font-['Space_Grotesk'] font-bold text-4xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-6">
          We&apos;re building the{" "}
          <span className="bg-gradient-to-r from-[#4DA8FF] via-[#8B5CF6] to-[#00E5FF] bg-clip-text text-transparent">
            operating system
          </span>{" "}
          for wonder
        </h1>
        <p className="text-base sm:text-xl text-[#F5F7FA]/70 max-w-2xl mx-auto leading-relaxed">
          Cosmora exists to make humanity&apos;s greatest journey feel personal — turning scattered data, papers and press releases into one living, story-driven universe anyone can explore.
        </p>
      </section>

      {/* MISSION & VISION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl p-10 border border-white/10 bg-gradient-to-br from-[#4DA8FF]/12 to-transparent bg-white/6 backdrop-blur-md">
            <div className="text-[#4DA8FF] text-xs font-mono tracking-widest uppercase mb-4">
              Mission
            </div>
            <h2 className="font-['Space_Grotesk'] font-bold text-3xl leading-snug mb-3">
              Make the cosmos legible to everyone
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              Connect every mission, discovery and theory into one continuous narrative — so a curious ten-year-old and a working engineer can both fall down the same rabbit hole and come out understanding more.
            </p>
          </div>

          <div className="rounded-3xl p-10 border border-white/10 bg-gradient-to-br from-[#8B5CF6]/14 to-transparent bg-white/6 backdrop-blur-md">
            <div className="text-[#8B5CF6] text-xs font-mono tracking-widest uppercase mb-4">
              Vision
            </div>
            <h2 className="font-['Space_Grotesk'] font-bold text-3xl leading-snug mb-3">
              A billion explorers by 2040
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              The next generation of scientists, storytellers and dreamers won&apos;t be recruited by textbooks — they&apos;ll be recruited by experiences. Cosmora is that first experience.
            </p>
          </div>
        </div>
      </section>

      {/* WHY COSMORA EXISTS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="max-w-2xl mb-10">
          <div className="text-[#FF7B54] text-xs font-mono tracking-[3px] uppercase mb-3">
            Why Cosmora Exists
          </div>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl tracking-tight leading-tight">
            Space content is everywhere — and unreachable
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-7 border border-white/10 bg-white/6 backdrop-blur-md"
            >
              <div
                className="w-11 h-11 rounded-xl border flex items-center justify-center font-['Space_Grotesk'] font-bold text-xl mb-4"
                style={{
                  backgroundColor: `${p.color}1f`,
                  borderColor: `${p.color}44`,
                  color: p.color,
                }}
              >
                !
              </div>
              <h3 className="font-['Space_Grotesk'] font-semibold text-xl mb-2 text-white">
                {p.title}
              </h3>
              <p className="text-white/65 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="text-center mb-10">
          <div className="text-[#00E5FF] text-xs font-mono tracking-[3px] uppercase mb-3">
            How Cosmora Is Different
          </div>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl tracking-tight">
            Not another agency website
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/6 backdrop-blur-md">
          <div className="grid grid-cols-5 font-['Space_Grotesk'] font-semibold text-sm bg-white/4 p-4 border-b border-white/8 text-white/60">
            <div>Feature</div>
            <div className="text-center">NASA</div>
            <div className="text-center">ISRO</div>
            <div className="text-center">ESA</div>
            <div className="text-center text-[#00E5FF]">Cosmora</div>
          </div>
          {compareRows.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-5 items-center p-4 border-b border-white/6 text-sm ${
                idx % 2 === 1 ? "bg-white/2" : ""
              }`}
            >
              <div className="text-white font-medium">{row.feature}</div>
              <div className="text-center text-white/30">{row.nasa ? <Check className="w-5 h-5 mx-auto text-white/80" /> : "—"}</div>
              <div className="text-center text-white/30">{row.isro ? <Check className="w-5 h-5 mx-auto text-white/80" /> : "—"}</div>
              <div className="text-center text-white/30">{row.esa ? <Check className="w-5 h-5 mx-auto text-white/80" /> : "—"}</div>
              <div className="text-center bg-[#00E5FF]/5 py-2 rounded-lg text-[#00E5FF] font-bold">
                {row.cosmora ? <Check className="w-5 h-5 mx-auto text-[#00E5FF]" /> : "—"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 py-14">
        <div className="text-center mb-12">
          <div className="text-[#4DA8FF] text-xs font-mono tracking-[3px] uppercase mb-3">
            Journey
          </div>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl tracking-tight">
            From a spark to a universe
          </h2>
        </div>

        <div className="relative pl-8 border-l-2 border-gradient-to-b from-[#4DA8FF] via-[#8B5CF6] to-[#00E5FF] space-y-10">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[#08111F] border-2 border-[#4DA8FF] shadow-[0_0_12px_#4DA8FF]" />
              <div className="text-[#00E5FF] font-['Space_Grotesk'] font-bold text-sm mb-1">
                {item.year}
              </div>
              <h3 className="font-['Space_Grotesk'] font-semibold text-xl mb-1 text-white">
                {item.title}
              </h3>
              <p className="text-white/65 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDER'S NOTE */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-14">
        <div className="rounded-3xl p-10 md:p-12 border border-white/10 bg-[radial-gradient(600px_300px_at_90%_10%,rgba(139,92,246,0.2),transparent_60%),rgba(255,255,255,0.06)] backdrop-blur-md grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
          <div className="w-28 h-28 rounded-3xl bg-[conic-gradient(from_200deg,#4DA8FF,#8B5CF6,#00E5FF,#FF7B54,#4DA8FF)] shadow-[0_0_40px_rgba(77,168,255,0.4)]" />
          <div>
            <div className="text-[#00E5FF] text-xs font-mono tracking-widest uppercase mb-3">
              Founder&apos;s Note
            </div>
            <p className="font-['Space_Grotesk'] text-xl sm:text-2xl leading-snug text-white mb-4 italic">
              &ldquo;I grew up watching launches on a grainy screen, certain the universe was for someone else. Cosmora is the platform I wish I&apos;d had — one that says the frontier is yours.&rdquo;
            </p>
            <div className="font-semibold text-base text-white">Arjun Mehta</div>
            <div className="text-white/50 text-sm">Founder & CEO, Cosmora</div>
          </div>
        </div>
      </section>

      {/* VALUES & STACK */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-[#FF7B54] text-xs font-mono tracking-[3px] uppercase mb-4">
            Core Values
          </div>
          <div className="space-y-4">
            {values.map((v, idx) => (
              <div key={idx} className="rounded-2xl p-6 border border-white/10 bg-white/6 backdrop-blur-md">
                <h3 className="font-['Space_Grotesk'] font-semibold text-lg mb-1 text-white">{v.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[#8B5CF6] text-xs font-mono tracking-[3px] uppercase mb-4">
            Technology
          </div>
          <div className="rounded-2xl p-7 border border-white/10 bg-white/6 backdrop-blur-md h-full flex flex-col justify-between">
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Built on a real-time data pipeline that ingests feeds from NASA, ISRO, ESA and SpaceX, rendered through a WebGL engine tuned for cinematic 60fps exploration on any device.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-2 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-xs text-[#c9b8ff]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="text-center mb-10">
          <div className="text-[#00E5FF] text-xs font-mono tracking-[3px] uppercase mb-3">
            What&apos;s Next
          </div>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl tracking-tight">
            Future Roadmap
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {roadmap.map((item, idx) => (
            <div key={idx} className="rounded-2xl p-6 border border-white/10 bg-white/6 backdrop-blur-md">
              <div className="font-['Space_Grotesk'] font-bold text-sm mb-2" style={{ color: item.color }}>
                {item.quarter}
              </div>
              <h3 className="font-['Space_Grotesk'] font-semibold text-lg mb-1 text-white">{item.title}</h3>
              <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-16">
        <div className="rounded-3xl p-10 md:p-14 text-center border border-[#4DA8FF]/25 bg-[radial-gradient(700px_400px_at_50%_0%,rgba(77,168,255,0.25),transparent_60%),linear-gradient(160deg,rgba(139,92,246,0.15),rgba(3,7,18,0.6))]">
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl tracking-tight mb-4">
            Join the journey
          </h2>
          <p className="text-white/70 max-w-md mx-auto text-sm sm:text-base mb-8">
            Explore the platform free, or partner with us to bring Cosmora to your classroom or organization.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/solar-system"
              className="bg-gradient-to-r from-[#4DA8FF] to-[#8B5CF6] text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Explore Features
            </Link>
            <Link
              href="/contact"
              className="bg-white/6 border border-white/16 text-white px-7 py-3.5 rounded-xl font-medium text-sm hover:bg-white/12 transition-colors"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
