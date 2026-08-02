"use client";

import React from "react";
import { Sparkles, Clock, Compass, Activity, Radio, Pause, Play } from "lucide-react";
import { ACT_NAMES } from "./SymphonyTimelineBar";

interface ActSideCaptionProps {
  activeAct: number;
  isAutoPlay?: boolean;
  onToggleAutoPlay?: () => void;
}

export function ActSideCaption({ activeAct, isAutoPlay = true, onToggleAutoPlay }: ActSideCaptionProps) {
  const actNarratives = [
    {
      time: "13.8 Billion Years Ago",
      phase: "Primordial Inflation & First Black Holes",
      quote: "The universe erupts from a subatomic singularity. In 10⁻³² seconds of cosmic inflation, space expands faster than light, ripping quantum fluctuations into cosmic filaments. Dense gas collapses into primordial Supermassive Black Holes—the gravitational monsters around which all future galaxies gather.",
      metrics: [
        { label: "SINGULARITY TEMP", val: "10³² Kelvin" },
        { label: "INFLATION SPEED", val: "> c (Superluminal)" },
        { label: "FIRST BLACK HOLE MASS", val: "10⁹ M☉ (Solar Masses)" },
      ],
      badge: "ACT I — THE GREAT FRACTURE",
      color: "from-purple-500 to-pink-500",
    },
    {
      time: "10 Billion Years Ago",
      phase: "Galactic Vortex & Sagittarius A*",
      quote: "Gravity pulls primordial gas clouds and ancient globular star clusters together into a vast rotating vortex. At its core lies Sagittarius A*, a supermassive black hole engine drawing millions of newly ignited stars into four grand spiral arms.",
      metrics: [
        { label: "GALAXY DIAMETER", val: "100,000 Light-Years" },
        { label: "ESTIMATED STARS", val: "100B – 400B Stars" },
        { label: "GALACTIC CORE", val: "Sagittarius A* (4.1M M☉)" },
      ],
      badge: "ACT II — GATHERING IN THE DARK",
      color: "from-cyan-500 to-purple-500",
    },
    {
      time: "4.6 Billion Years Ago",
      phase: "Supernova Shockwave & Accretion Disk",
      quote: "A nearby supernova shockwave triggers the gravitational collapse of a dense solar nebula. Nuclear fusion ignites at the core to birth the Sun, while dust grains in the spinning protoplanetary accretion disk coalesce into emerging planets in real time.",
      metrics: [
        { label: "SOLAR IGNITION", val: "4.6 Billion Years Ago" },
        { label: "CORE FUSION PRESSURE", val: "250 Billion Atm" },
        { label: "ACCRETION DISK SPAN", val: "100 Astronomical Units" },
      ],
      badge: "ACT III — STARDUST AND FIRE",
      color: "from-amber-500 to-orange-500",
    },
    {
      time: "Present Day",
      phase: "Earth, Atmosphere & Self-Awareness",
      quote: "Earth orbits a humble star in a quiet spiral arm. Oceans form, clouds drift, and polar auroras glow under a protective magnetic shield. Life awakens, evolves, and constructs orbiting space stations to gaze back into the void.",
      metrics: [
        { label: "HABITABLE ZONE", val: "1.0 AU (Goldilocks Zone)" },
        { label: "ISS ORBITAL SPEED", val: "27,600 km/h (400 km LEO)" },
        { label: "FINAL QUOTE", val: "'We are stardust conscious of itself'" },
      ],
      badge: "ACT IV — THE LEGACY",
      color: "from-blue-500 to-cyan-400",
    },
  ];

  const current = actNarratives[activeAct] || actNarratives[0];

  return (
    <div className="fixed top-28 left-6 z-30 w-80 md:w-96 max-w-full glass-panel rounded-3xl p-5 md:p-6 border border-purple-500/40 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-purple-950/80 animate-fade-in transition-all duration-500">
      {/* Top Header Badge & Pause Button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold tracking-wider uppercase">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          {current.badge}
        </span>
        {onToggleAutoPlay && (
          <button
            onClick={onToggleAutoPlay}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isAutoPlay
                ? "bg-purple-600/30 border border-purple-400 text-purple-200"
                : "bg-amber-500/30 border border-amber-400 text-amber-200"
            }`}
          >
            {isAutoPlay ? (
              <>
                <Pause className="w-3 h-3 text-cyan-400" />
                <span>Pause Tour</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-amber-300" />
                <span>Resume Tour</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Title Phase */}
      <h3 className="text-lg md:text-xl font-black text-white font-display mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-200">
        {current.phase}
      </h3>

      {/* Synchronized Narrative Text */}
      <p className="text-xs text-slate-200 leading-relaxed font-sans mb-4 border-l-2 border-purple-500/60 pl-3 italic">
        "{current.quote}"
      </p>

      {/* Telemetry Metrics Grid */}
      <div className="space-y-2 pt-3 border-t border-white/10">
        <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>REAL-TIME COSMIC TELEMETRY</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {current.metrics.map((m, i) => (
            <div key={i} className="flex items-center justify-between text-[11px] font-mono px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400">{m.label}:</span>
              <span className="font-bold text-purple-200">{m.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
