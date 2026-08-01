"use client";

import React from "react";
import { Play, Film, Sparkles, Compass } from "lucide-react";

interface SymphonyHeroProps {
  onBeginJourney: () => void;
  onWatchTrailer: () => void;
}

export function SymphonyHero({ onBeginJourney, onWatchTrailer }: SymphonyHeroProps) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden glass-panel p-8 md:p-12 mb-10 border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-slate-950/80 to-blue-950/40 shadow-2xl shadow-purple-500/10">
      {/* Background Subtle Particle Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>Flagship Immersive Story — Act I to IV</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight font-display mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-200">
          The Symphony of the Void
        </h1>

        <p className="text-base md:text-xl text-slate-300 leading-relaxed font-sans mb-8 max-w-2xl">
          A cosmic journey from the birth of space to the formation of black holes, the Milky Way galaxy, and our Solar System.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onBeginJourney}
            className="px-6 py-3.5 rounded-2xl btn-gradient-purple text-white text-sm font-bold flex items-center gap-2.5 shadow-xl shadow-purple-500/25 hover:scale-105 active:scale-98 transition-transform cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Begin Journey</span>
          </button>

          <button
            onClick={onWatchTrailer}
            className="px-6 py-3.5 rounded-2xl glass-button text-slate-200 hover:text-white text-sm font-bold flex items-center gap-2.5 border border-white/20 hover:border-purple-400/50 hover:scale-105 active:scale-98 transition-transform cursor-pointer"
          >
            <Film className="w-4 h-4 text-cyan-400" />
            <span>Watch Trailer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
