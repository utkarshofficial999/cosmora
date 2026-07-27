"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { EarthPanel } from "./EarthPanel";
import { BottomModules } from "./BottomModules";
import { LiveUpdatesTicker } from "./LiveUpdatesTicker";
import { DemoVideoModal } from "@/components/modals/DemoVideoModal";

export function HeroOverlay() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <>
      <DemoVideoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />

      <div className="relative z-10 pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between min-h-[calc(100vh-5rem)]">
        {/* Main Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explore • Discover • Understand</span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-white font-display tracking-tight leading-[1.1]">
              Journey Through{" "}
              <span className="text-gradient-purple-cyan block">
                Space & Beyond
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-light leading-relaxed">
              Cosmora is a story-driven space education platform powered by real-time 3D planetary orbits, live rocket telemetry, and grounded AI intelligence.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/solar-system"
                className="btn-gradient-primary px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 text-white shadow-xl shadow-purple-500/25 hover:scale-105 transition-transform"
              >
                <span>🚀 Explore Solar System</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setDemoModalOpen(true)}
                className="glass-button px-6 py-3.5 rounded-2xl text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 backdrop-blur-md"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span>▶ Watch Demo</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/10 max-w-lg font-mono">
              <div>
                <span className="block text-xl font-bold text-white">8</span>
                <span className="text-[10px] text-slate-400 uppercase">Planets</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-cyan-400">250+</span>
                <span className="text-[10px] text-slate-400 uppercase">Missions</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-purple-400">500+</span>
                <span className="text-[10px] text-slate-400 uppercase">Stories</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-emerald-400">10K+</span>
                <span className="text-[10px] text-slate-400 uppercase">Explorers</span>
              </div>
            </div>
          </div>

          {/* Right Column: Earth Inspector Floating Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <EarthPanel />
          </div>
        </div>

        {/* Bottom Modules & Live Ticker */}
        <div className="space-y-6">
          <BottomModules />
          <LiveUpdatesTicker />
        </div>
      </div>
    </>
  );
}
