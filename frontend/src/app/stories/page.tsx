"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Sparkles, BookOpen, Film, ArrowRight } from "lucide-react";
import { UniverseCanvas } from "@/components/stories/symphony/UniverseCanvas";
import { SymphonyHero } from "@/components/stories/symphony/SymphonyHero";
import { SymphonyTimelineBar } from "@/components/stories/symphony/SymphonyTimelineBar";
import { ActCardsGrid } from "@/components/stories/symphony/ActCardsGrid";
import { SymphonyControlsBar } from "@/components/stories/symphony/SymphonyControlsBar";
import { ActDetailModal } from "@/components/stories/symphony/ActDetailModal";
import { TrailerModal } from "@/components/stories/symphony/TrailerModal";

export default function StoriesPage() {
  const [activeAct, setActiveAct] = useState(0); // 0 = Act I, 1 = Act II, 2 = Act III, 3 = Act IV
  const [selectedModalAct, setSelectedModalAct] = useState<number | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isNarrationOn, setIsNarrationOn] = useState(true);
  const [is3DMode, setIs3DMode] = useState(true);

  const handleSelectAct = (index: number) => {
    setActiveAct(index);
  };

  const handleExploreAct = (index: number) => {
    setActiveAct(index);
    setSelectedModalAct(index);
  };

  const handleBeginJourney = () => {
    setActiveAct(0);
    setSelectedModalAct(0);
  };

  return (
    <div className="relative min-h-screen text-slate-100 bg-slate-950 overflow-x-hidden font-sans selection:bg-purple-500/30">
      {/* ─── Background 3D Universe Canvas ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <UniverseCanvas activeAct={activeAct} is3DMode={is3DMode} className="w-full h-full" />
      </div>

      {/* ─── Header Navigation Bar matching Screenshot ─── */}
      <header className="relative z-30 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="glass-panel rounded-2xl p-3.5 md:px-6 flex items-center justify-between gap-4 border border-white/10 bg-slate-950/70 backdrop-blur-xl">
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl btn-gradient-purple flex items-center justify-center shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-black text-white tracking-wider font-display block">COSMORA</span>
              <span className="text-[9px] font-mono text-purple-400 tracking-widest uppercase block -mt-1">3D SPACE PLATFORM</span>
            </div>
          </Link>

          {/* Navigation Links matching Screenshot */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10 text-xs font-semibold">
            <Link href="/" className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
              Explore
            </Link>
            <Link href="/stories" className="px-3.5 py-1.5 rounded-lg bg-purple-600/30 text-purple-200 border border-purple-500/40">
              Stories
            </Link>
            <Link href="/solar-system" className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
              Solar System
            </Link>
            <Link href="/missions" className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
              Missions
            </Link>
            <Link href="/timeline" className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
              Timeline
            </Link>
            <Link href="/analytics" className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
              Theories
            </Link>
            <Link href="/about" className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
              Community
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl glass-button text-slate-400 hover:text-white border border-white/10">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl glass-button text-slate-400 hover:text-white border border-white/10 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
            </button>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold btn-gradient-purple text-white shadow-md shadow-purple-500/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Main Content Container ─── */}
      <main className="relative z-10 pt-8 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Flagship Hero Banner */}
        <SymphonyHero
          onBeginJourney={handleBeginJourney}
          onWatchTrailer={() => setIsTrailerOpen(true)}
        />

        {/* Horizontal Acts Timeline Selector matching Screenshot */}
        <SymphonyTimelineBar
          activeAct={activeAct}
          onSelectAct={handleSelectAct}
        />

        {/* Act Cards Grid matching Screenshot */}
        <ActCardsGrid
          activeAct={activeAct}
          onSelectAct={handleSelectAct}
          onExploreAct={handleExploreAct}
        />
      </main>

      {/* ─── Floating Bottom Controls Bar matching Screenshot ─── */}
      <SymphonyControlsBar
        activeAct={activeAct}
        onSelectAct={handleSelectAct}
        isNarrationOn={isNarrationOn}
        onToggleNarration={() => setIsNarrationOn(!isNarrationOn)}
        is3DMode={is3DMode}
        onToggle3DMode={() => setIs3DMode(!is3DMode)}
      />

      {/* ─── Interactive Act Detail Reader Modal ─── */}
      <ActDetailModal
        actIndex={selectedModalAct}
        onClose={() => setSelectedModalAct(null)}
        onNavigateAct={(nextIndex) => {
          setActiveAct(nextIndex);
          setSelectedModalAct(nextIndex);
        }}
      />

      {/* ─── Cinematic Trailer Video Modal ─── */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        onBeginJourney={handleBeginJourney}
      />
    </div>
  );
}
