"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface SymphonyTimelineBarProps {
  activeAct: number;
  onSelectAct: (actIndex: number) => void;
}

export const ACT_NAMES = [
  {
    number: "I",
    title: "The Birth of Space & The First Monsters",
    shortTitle: "The Great Fracture",
    subtitle: "Big Bang & Black Holes",
    desc: "The universe erupts from the Primordial Seed. Space expands, matter forms, and the first Supermassive Black Holes collapse.",
  },
  {
    number: "II",
    title: "Gathering in the Dark",
    shortTitle: "Milky Way Cosmic Hub",
    subtitle: "Formation of Milky Way",
    desc: "A supermassive black hole pulls gas, dust, and star clusters together to forge our majestic spiral galaxy.",
  },
  {
    number: "III",
    title: "Stardust and Fire",
    shortTitle: "Birth of Sun & Planets",
    subtitle: "Creation of Solar System",
    desc: "A supernova shockwave collapses a solar nebula. The Sun ignites, and planets coalesce from the accretion disk.",
  },
  {
    number: "IV",
    title: "The Legacy",
    shortTitle: "Earth & Human Consciousness",
    subtitle: "Earth, Atmosphere & Life",
    desc: "Earth orbits in the habitable zone. Oceans form, life evolves, and humanity looks back into the void.",
  },
];

export function SymphonyTimelineBar({ activeAct, onSelectAct }: SymphonyTimelineBarProps) {
  return (
    <div className="w-full glass-panel rounded-2xl p-4 md:p-6 mb-8 border border-white/15 bg-slate-950/60 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>ACTS TIMELINE</span>
        </div>
        <span className="text-xs font-mono text-purple-300 font-semibold">
          ACT {ACT_NAMES[activeAct].number} OF IV — {ACT_NAMES[activeAct].subtitle}
        </span>
      </div>

      {/* Acts Selector Buttons Grid matching Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ACT_NAMES.map((act, index) => {
          const isActive = activeAct === index;
          return (
            <button
              key={act.number}
              onClick={() => onSelectAct(index)}
              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 border ${
                isActive
                  ? "bg-purple-900/40 border-purple-500/80 text-white shadow-lg shadow-purple-500/20 ring-1 ring-purple-400/50"
                  : "glass-button border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black font-mono shrink-0 transition-colors ${
                  isActive
                    ? "bg-purple-500 text-white shadow-md shadow-purple-500/40"
                    : "bg-white/10 text-slate-400"
                }`}
              >
                {act.number}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate font-display">
                  {act.shortTitle}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  ({act.subtitle})
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
