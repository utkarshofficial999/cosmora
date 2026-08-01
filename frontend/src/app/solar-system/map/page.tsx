"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Radio, Compass, Rocket } from "lucide-react";
import { SpaceMapCanvas } from "@/components/solar-system/3d/SpaceMapCanvas";
import { MOCK_SPACECRAFT } from "@/mocks/solar-system/space-map";

export default function SpaceMapPage() {
  const [timeOffsetYears, setTimeOffsetYears] = useState(0);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* 3D Space Map Canvas */}
      <SpaceMapCanvas timeOffsetYears={timeOffsetYears} />

      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 z-30 p-6 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            href="/solar-system"
            className="p-3 rounded-2xl bg-slate-950/80 border border-white/15 backdrop-blur-2xl text-slate-300 hover:text-white transition-all shadow-2xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-wide font-sans">
              Interactive Space Map & Trajectories
            </h1>
            <span className="text-[10px] font-mono text-cyan-400">
              ORBITAL ALIGNMENTS & DEEP SPACE CRAFT TRACKING
            </span>
          </div>
        </div>
      </header>

      {/* Bottom Floating Time-Travel Controls Slider */}
      <div className="fixed bottom-6 inset-x-6 z-20 max-w-2xl mx-auto p-6 rounded-3xl bg-slate-950/85 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,229,255,0.2)] flex flex-col gap-3 font-mono text-xs pointer-events-auto">
        <div className="flex items-center justify-between text-cyan-400 font-bold">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>ORBITAL TIME-TRAVEL ALIGNMENT</span>
          </div>
          <span className="text-white bg-cyan-950 px-3 py-1 rounded-full border border-cyan-500/40">
            {timeOffsetYears === 0
              ? "PRESENT (2026)"
              : timeOffsetYears > 0
              ? `+${timeOffsetYears} YEARS (FUTURE)`
              : `${timeOffsetYears} YEARS (PAST)`}
          </span>
        </div>

        <input
          type="range"
          min={-50}
          max={50}
          value={timeOffsetYears}
          onChange={(e) => setTimeOffsetYears(Number(e.target.value))}
          className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-white/10"
        />

        <div className="flex justify-between text-[10px] text-slate-500">
          <span>-50 YEARS (1976)</span>
          <span>PRESENT (2026)</span>
          <span>+50 YEARS (2076)</span>
        </div>
      </div>

      {/* Left Active Spacecraft Telemetry Panel */}
      <div className="fixed top-24 left-6 z-20 w-80 p-5 rounded-3xl bg-slate-950/85 border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col gap-3 font-mono text-xs pointer-events-auto hidden lg:flex">
        <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-white/10 pb-2">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>ACTIVE SPACECRAFT ({MOCK_SPACECRAFT.length})</span>
        </div>

        <div className="flex flex-col gap-2">
          {MOCK_SPACECRAFT.map((craft) => (
            <div
              key={craft.id}
              className="p-3 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col gap-1"
            >
              <div className="flex justify-between text-cyan-300 font-bold">
                <span>{craft.name}</span>
                <span className="text-[10px] text-slate-400">{craft.agency}</span>
              </div>
              <span className="text-[10px] text-slate-400">Target: {craft.target}</span>
              <div className="flex justify-between text-[10px] text-emerald-400 pt-1 border-t border-white/5">
                <span>{craft.currentDistanceAU} AU</span>
                <span>{craft.speedKms} KM/S</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
