"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Search,
  Globe,
  ShieldCheck,
  Bot,
  FileText,
  Clock,
  BarChart3,
  Quote,
  CheckCircle2,
} from "lucide-react";
import { StarfieldCanvas } from "@/components/three/StarfieldCanvas";
import { EarthHeroCanvas } from "@/components/three/EarthHeroCanvas";
import { TrailerModal } from "@/components/modals/TrailerModal";
import { SearchModal } from "@/components/modals/SearchModal";
import { Footer } from "@/components/ui/Footer";

export default function HomePage() {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  // Countdown timer target (47 days, 8 hrs from now)
  const [timeLeft, setTimeLeft] = useState({ d: "47", h: "08", m: "22", s: "45" });

  useEffect(() => {
    const target = Date.now() + (47 * 86400 + 8 * 3600 + 22 * 60) * 1000;
    const interval = setInterval(() => {
      let ms = target - Date.now();
      if (ms < 0) ms = 0;
      const d = Math.floor(ms / 86400000);
      const h = Math.floor(ms / 3600000) % 24;
      const m = Math.floor(ms / 60000) % 60;
      const s = Math.floor(ms / 1000) % 60;
      setTimeLeft({
        d: String(d).padStart(2, "0"),
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const featureItems = [
    {
      color: "#4DA8FF",
      title: "Interactive Solar System",
      desc: "Fly through a real-scale, physics-aware 3D solar system. Tap any world to dive into its story.",
      icon: Globe,
      link: "/solar-system",
    },
    {
      color: "#FF7B54",
      title: "Live Mission Control",
      desc: "Track every active and upcoming launch worldwide with live telemetry, windows and countdowns.",
      icon: ShieldCheck,
      link: "/missions",
    },
    {
      color: "#00E5FF",
      title: "AI Space Assistant",
      desc: "Ask anything about the cosmos. Nova answers with sources, visuals and guided tours.",
      icon: Bot,
      link: "/ai-assistant",
    },
    {
      color: "#8B5CF6",
      title: "Immersive Stories",
      desc: "Scroll-driven cinematic narratives with real telemetry, audio and archival imagery.",
      icon: FileText,
      link: "/stories",
    },
    {
      color: "#4DA8FF",
      title: "Space Timeline",
      desc: "From Sputnik to Starship — a living timeline of every milestone in human spaceflight.",
      icon: Clock,
      link: "/analytics",
    },
    {
      color: "#00E5FF",
      title: "Analytics & Theories",
      desc: "Explore the science — orbital mechanics, relativity and the frontier theories shaping tomorrow.",
      icon: BarChart3,
      link: "/analytics",
    },
  ];

  const testimonials = [
    {
      quote:
        "My students stopped watching space and started exploring it. Cosmora turned a lesson into a mission.",
      name: "Dr. Anaya Rao",
      role: "Astronomy Educator, Bengaluru",
      color: "#4DA8FF",
    },
    {
      quote:
        "The live mission control is the first thing I open every morning. It feels like a window onto the frontier.",
      name: "Marcus Vela",
      role: "Aerospace Engineer",
      color: "#FF7B54",
    },
    {
      quote:
        "Cinematic, accurate and addictive. This is what science communication should have always looked like.",
      name: "Lena Whitfield",
      role: "Science Journalist",
      color: "#8B5CF6",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#F5F7FA] overflow-x-hidden selection:bg-[#4DA8FF]/30 selection:text-white pt-20">
      {/* 2D Canvas Starfield Background */}
      <StarfieldCanvas />

      {/* Radial Gradient Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(1200px_800px_at_70%_-10%,rgba(139,92,246,0.18),transparent_60%),radial-gradient(1000px_700px_at_10%_20%,rgba(77,168,255,0.12),transparent_55%)]" />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <TrailerModal isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center z-10 py-12">
        {/* 3D Earth Hero Canvas */}
        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-80 md:opacity-100">
          <EarthHeroCanvas className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
          <div className="max-w-2xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-[#00E5FF]/30 backdrop-blur-md text-xs font-medium mb-7">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
              The world&apos;s first story-driven space platform
            </div>

            {/* Headline */}
            <h1 className="font-['Space_Grotesk'] font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
              Explore Humanity&apos;s
              <br />
              <span className="bg-gradient-to-r from-[#4DA8FF] via-[#8B5CF6] to-[#00E5FF] bg-clip-text text-transparent bg-[length:200%_auto] animate-[aurora_6s_ease_infinite]">
                Greatest Journey
              </span>
              <br />
              Through Space
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-[#F5F7FA]/70 max-w-xl mb-9">
              Journey through the past, present and future of space with immersive stories, live missions and interactive 3D exploration.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/solar-system"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#4DA8FF] to-[#8B5CF6] text-white px-7 py-4 rounded-xl font-semibold text-base shadow-[0_0_24px_rgba(77,168,255,0.5)] hover:shadow-[0_0_36px_rgba(139,92,246,0.7)] hover:scale-[1.02] transition-all"
              >
                Start Exploring
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setTrailerOpen(true)}
                className="inline-flex items-center gap-3 bg-white/6 border border-white/16 text-white px-6 py-4 rounded-xl font-medium text-base hover:bg-white/10 hover:border-[#4DA8FF]/60 backdrop-blur-md transition-all cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-white/12 grid place-items-center">
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </span>
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE STATISTICS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="text-xs font-mono tracking-[2px] text-white/55 uppercase mb-6 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#FF7B54] shadow-[0_0_10px_#FF7B54] animate-ping" />
          Live Platform Data
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-7 rounded-2xl bg-white/6 border border-white/10 backdrop-blur-md hover:border-[#4DA8FF]/40 transition-colors">
            <div className="font-['Space_Grotesk'] font-bold text-4xl lg:text-5xl text-[#4DA8FF]">
              $546B
            </div>
            <div className="text-white/65 text-sm mt-2">Global Space Economy (USD)</div>
          </div>

          <div className="p-7 rounded-2xl bg-white/6 border border-white/10 backdrop-blur-md hover:border-[#8B5CF6]/40 transition-colors">
            <div className="font-['Space_Grotesk'] font-bold text-4xl lg:text-5xl text-[#8B5CF6]">
              128
            </div>
            <div className="text-white/65 text-sm mt-2">Upcoming Missions Tracked</div>
          </div>

          <div className="p-7 rounded-2xl bg-white/6 border border-white/10 backdrop-blur-md hover:border-[#00E5FF]/40 transition-colors">
            <div className="font-['Space_Grotesk'] font-bold text-4xl lg:text-5xl text-[#00E5FF]">
              1,240+
            </div>
            <div className="text-white/65 text-sm mt-2">Immersive Stories</div>
          </div>

          <div className="p-7 rounded-2xl bg-white/6 border border-white/10 backdrop-blur-md hover:border-[#FF7B54]/40 transition-colors">
            <div className="font-['Space_Grotesk'] font-bold text-4xl lg:text-5xl text-[#FF7B54]">
              60+
            </div>
            <div className="text-white/65 text-sm mt-2">Interactive 3D Views</div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-[#00E5FF] text-xs font-mono tracking-[3px] uppercase mb-3">
            The Platform
          </div>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-5xl tracking-tight leading-tight">
            One universe. Every way to explore it.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.link}
                className="group relative rounded-2xl p-7 border border-white/10 bg-white/6 backdrop-blur-md overflow-hidden hover:-translate-y-2 hover:border-white/30 transition-all duration-300 block"
              >
                <div
                  className="absolute w-36 h-36 rounded-full -top-12 -right-10 pointer-events-none opacity-20 transition-opacity group-hover:opacity-40"
                  style={{
                    background: `radial-gradient(circle, ${item.color}, transparent 70%)`,
                  }}
                />
                <div
                  className="w-13 h-13 rounded-xl grid place-items-center mb-5 border"
                  style={{
                    backgroundColor: `${item.color}1f`,
                    borderColor: `${item.color}44`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <h3 className="font-['Space_Grotesk'] font-semibold text-xl mb-2.5 text-white">
                  {item.title}
                </h3>
                <p className="text-white/65 text-sm leading-relaxed">{item.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED STORY & NEXT LAUNCH COUNTDOWN */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          {/* Featured Story Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 min-h-[420px] bg-[radial-gradient(600px_400px_at_30%_30%,rgba(139,92,246,0.4),transparent_60%),radial-gradient(500px_400px_at_80%_80%,rgba(255,123,84,0.35),transparent_55%),#08111F] p-8 md:p-10 flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-90" />
            <div className="relative z-10">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono tracking-wider mb-4">
                FEATURED STORY
              </span>
              <h3 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl leading-tight mb-3">
                The Pale Blue Dot, Revisited
              </h3>
              <p className="text-white/75 text-sm sm:text-base max-w-lg mb-5 leading-relaxed">
                Trace Voyager&apos;s journey to the edge of the solar system in an immersive scrollable narrative — 12 chapters, real telemetry, cinematic sound.
              </p>
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 font-semibold text-[#4DA8FF] hover:text-[#00E5FF] transition-colors"
              >
                Read the story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Countdown & Highlights */}
          <div className="grid grid-rows-[1fr_auto] gap-6">
            {/* Countdown Box */}
            <div className="rounded-3xl p-7 border border-white/10 bg-gradient-to-br from-[#FF7B54]/12 via-[#8B5CF6]/8 to-white/6 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="text-[#FF7B54] text-xs font-mono tracking-widest uppercase mb-3">
                  Next Launch · ISRO
                </div>
                <h3 className="font-['Space_Grotesk'] font-bold text-2xl mb-1">
                  Gaganyaan G1
                </h3>
                <p className="text-white/60 text-xs mb-6">
                  Uncrewed orbital test flight & space capsule recovery
                </p>
              </div>

              {/* Countdown Numbers */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                  <div className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl text-white">
                    {timeLeft.d}
                  </div>
                  <div className="text-[10px] text-white/50 tracking-wider">DAYS</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                  <div className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl text-white">
                    {timeLeft.h}
                  </div>
                  <div className="text-[10px] text-white/50 tracking-wider">HRS</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                  <div className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl text-white">
                    {timeLeft.m}
                  </div>
                  <div className="text-[10px] text-white/50 tracking-wider">MIN</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                  <div className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl text-[#00E5FF]">
                    {timeLeft.s}
                  </div>
                  <div className="text-[10px] text-white/50 tracking-wider">SEC</div>
                </div>
              </div>
            </div>

            {/* JWST Spotlight Card */}
            <div className="rounded-3xl p-6 border border-white/10 bg-white/6 backdrop-blur-md flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex-shrink-0 bg-[radial-gradient(circle_at_35%_30%,#fff,#00E5FF_30%,#8B5CF6_70%,#030712)] shadow-[0_0_25px_rgba(0,229,255,0.4)]" />
              <div>
                <div className="text-[#00E5FF] text-[11px] font-mono tracking-wider uppercase mb-1">
                  Latest · JWST Deep Field
                </div>
                <h3 className="font-['Space_Grotesk'] font-semibold text-lg mb-1">
                  Carina Nebula, in 4K
                </h3>
                <p className="text-white/55 text-xs">New high-res infrared capture added today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="text-center mb-12">
          <div className="text-[#00E5FF] text-xs font-mono tracking-[3px] uppercase mb-3">
            Loved by Explorers
          </div>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl sm:text-4xl tracking-tight">
            From classrooms to mission control
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-7 border border-white/10 bg-white/6 backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <Quote className="w-7 h-7 mb-4 opacity-40" style={{ color: t.color }} />
                <p className="text-base text-white/90 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3.5 pt-4 border-t border-white/6">
                <span
                  className="w-10 h-10 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${t.color}, #8B5CF6)`,
                  }}
                />
                <div>
                  <div className="font-semibold text-sm text-white">{t.name}</div>
                  <div className="text-white/50 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-20">
        <div className="relative rounded-3xl p-10 md:p-14 text-center overflow-hidden border border-[#4DA8FF]/25 bg-[radial-gradient(700px_400px_at_50%_0%,rgba(77,168,255,0.25),transparent_60%),linear-gradient(160deg,rgba(139,92,246,0.15),rgba(3,7,18,0.6))]">
          <div className="absolute w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.3),transparent_65%)] -top-20 -right-10 animate-[drift_9s_ease-in-out_infinite] pointer-events-none" />

          <h2 className="relative font-['Space_Grotesk'] font-bold text-3xl sm:text-5xl tracking-tight mb-4">
            Get the cosmos in your inbox
          </h2>
          <p className="relative text-white/70 max-w-md mx-auto text-sm sm:text-base mb-8 leading-relaxed">
            Mission alerts, new stories and JWST drops — a weekly dispatch from the frontier.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="relative flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@galaxy.com"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/7 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#4DA8FF] transition-colors"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-xl border-none bg-gradient-to-r from-[#4DA8FF] to-[#8B5CF6] text-white font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap flex items-center justify-center gap-2"
            >
              {subscribed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Subscribed
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
