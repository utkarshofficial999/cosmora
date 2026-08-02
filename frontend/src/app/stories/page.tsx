"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Sparkles, Eye, EyeOff, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight, Play, Pause, RotateCw } from "lucide-react";
import { ActSideCaption } from "@/components/stories/symphony/ActSideCaption";
import { UniverseCanvas } from "@/components/stories/symphony/UniverseCanvas";
import { SymphonyHero } from "@/components/stories/symphony/SymphonyHero";
import { SymphonyTimelineBar, ACT_NAMES } from "@/components/stories/symphony/SymphonyTimelineBar";
import { ActCardsGrid } from "@/components/stories/symphony/ActCardsGrid";
import { SymphonyControlsBar } from "@/components/stories/symphony/SymphonyControlsBar";
import { ActDetailModal } from "@/components/stories/symphony/ActDetailModal";
import { TrailerModal } from "@/components/stories/symphony/TrailerModal";

export default function StoriesPage() {
  const [activeAct, setActiveAct] = useState(0); // 0 = Act I, 1 = Act II, 2 = Act III, 3 = Act IV
  const [isPure3D, setIsPure3D] = useState(true); // DEFAULT TO PURE 3D (ZERO TEXT BOXES)
  const [isAutoPlay, setIsAutoPlay] = useState(true); // AUTOMATIC CONTINUOUS SPACE FLIGHT!
  const [autoProgress, setAutoProgress] = useState(0);

  const [selectedModalAct, setSelectedModalAct] = useState<number | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isNarrationOn, setIsNarrationOn] = useState(true);

  // ─── Automatic Space Flight Tour Timer ───
  useEffect(() => {
    if (!isAutoPlay) return;

    const intervalMs = 100;
    const totalMs = 10000; // 10 seconds per Act world
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalMs;
      const pct = (elapsed / totalMs) * 100;
      setAutoProgress(pct);

      if (elapsed >= totalMs) {
        elapsed = 0;
        setAutoProgress(0);
        setActiveAct((prev) => (prev + 1) % 4);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isAutoPlay, activeAct]);

  // ─── Keyboard Spacebar Pause/Play Shortcut Handler ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsAutoPlay((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectAct = (index: number) => {
    setActiveAct(index);
    setAutoProgress(0);
  };

  const handleExploreAct = (index: number) => {
    setActiveAct(index);
    setSelectedModalAct(index);
  };

  const handleBeginJourney = () => {
    setActiveAct(0);
    setIsPure3D(true);
    setIsAutoPlay(true);
    setAutoProgress(0);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 bg-slate-950 overflow-hidden font-sans selection:bg-purple-500/30">
      {/* ─── 4K 3D Universe WebGL Canvas (Click & Drag Interactive!) ─── */}
      <div className={`fixed inset-0 z-0 ${isPure3D ? "pointer-events-auto cursor-grab active:cursor-grabbing" : "pointer-events-none"}`}>
        <UniverseCanvas activeAct={activeAct} className="w-full h-full" />
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* PURE 3D STORY MODE HUD (AUTOMATIC 4K CINEMA & PROMINENT PAUSE BUTTON) */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {isPure3D ? (
        <>
          {/* Synchronized 3D Side Caption Subtitles & Telemetry */}
          <ActSideCaption
            activeAct={activeAct}
            isAutoPlay={isAutoPlay}
            onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
          />

          {/* Top Minimal Holographic HUD Header with 4K Auto Progress Bar */}
          <header className="fixed top-6 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-2xl">
            <div className="glass-panel rounded-2xl p-4 border border-purple-500/40 bg-slate-950/85 backdrop-blur-2xl shadow-2xl shadow-purple-950/60 relative overflow-hidden flex items-center justify-between gap-4">
              {/* Auto Transition Progress Bar Filler */}
              {isAutoPlay && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500 transition-all duration-100 ease-linear"
                  style={{ width: `${autoProgress}%` }}
                />
              )}

              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-xl btn-gradient-purple flex items-center justify-center shadow-md shadow-purple-500/30">
                  <Sparkles className="w-4 h-4 text-white animate-spin" />
                </div>
                <span className="text-sm font-black text-white tracking-wider font-display hidden sm:inline">COSMORA 4K</span>
              </Link>

              {/* Active Act Title Display */}
              <div className="text-center">
                <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isAutoPlay ? "bg-cyan-400 animate-ping" : "bg-amber-400"}`} />
                  ACT {ACT_NAMES[activeAct].number} OF IV — {isAutoPlay ? "AUTO CINEMA TOUR" : "PAUSED (FREE EXPLORE)"}
                </div>
                <div className="text-sm md:text-base font-extrabold text-white font-display tracking-tight">
                  {ACT_NAMES[activeAct].title}
                </div>
              </div>

              {/* Prominent Main Pause / Play Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                    isAutoPlay
                      ? "bg-purple-600/40 border border-purple-400 text-purple-200 shadow-purple-500/30 hover:bg-purple-600/60"
                      : "bg-amber-500/40 border border-amber-400 text-amber-100 shadow-amber-500/30 hover:bg-amber-500/60 ring-2 ring-amber-400/50"
                  }`}
                  title="Press Spacebar to Pause/Resume"
                >
                  {isAutoPlay ? (
                    <>
                      <Pause className="w-4 h-4 text-cyan-400" />
                      <span>⏸ PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>▶ RESUME</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsPure3D(false)}
                  className="px-3 py-2 rounded-xl glass-button text-xs font-bold text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 cursor-pointer"
                  title="Show Cards UI"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Cards</span>
                </button>
              </div>
            </div>
          </header>

          {/* Floating Helper Pill */}
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className={`px-4 py-1.5 rounded-full border text-[11px] font-mono backdrop-blur-md flex items-center gap-2 transition-colors ${
              isAutoPlay
                ? "bg-slate-950/70 border-white/10 text-slate-300"
                : "bg-amber-950/80 border-amber-500/50 text-amber-200 shadow-lg shadow-amber-950/50 animate-pulse"
            }`}>
              <RotateCw className={`w-3 h-3 ${isAutoPlay ? "text-cyan-400 animate-spin" : "text-amber-400"}`} />
              <span>{isAutoPlay ? "4K Automatic Space Flight • Press Space or ⏸ to pause" : "⏸ TOUR PAUSED — Freely drag mouse/touch to rotate & explore 3D scene"}</span>
            </div>
          </div>

          {/* Floating Bottom Sleek 3D Control Bar */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-3xl glass-panel rounded-2xl p-3 border border-purple-500/40 bg-slate-950/90 backdrop-blur-2xl shadow-2xl shadow-purple-950/80 flex items-center justify-between gap-3">
            {/* Previous Act Arrow */}
            <button
              onClick={() => handleSelectAct(Math.max(0, activeAct - 1))}
              disabled={activeAct === 0}
              className="p-2.5 rounded-xl glass-button text-slate-300 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Act Pills Switcher */}
            <div className="flex items-center gap-2">
              {ACT_NAMES.map((act, index) => {
                const isActive = activeAct === index;
                return (
                  <button
                    key={act.number}
                    onClick={() => handleSelectAct(index)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer border ${
                      isActive
                        ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/40 ring-1 ring-purple-300/50 scale-105"
                        : "glass-button border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    ACT {act.number}
                  </button>
                );
              })}
            </div>

            {/* Next Act Arrow */}
            <button
              onClick={() => handleSelectAct(Math.min(3, activeAct + 1))}
              disabled={activeAct === 3}
              className="p-2.5 rounded-xl glass-button text-slate-300 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Audio & Fullscreen Quick Actions */}
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
              <button
                onClick={() => setIsNarrationOn(!isNarrationOn)}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isNarrationOn ? "bg-purple-500/30 text-purple-300 border border-purple-500/40" : "glass-button text-slate-500"
                }`}
                title="Toggle Speech Narration"
              >
                {isNarrationOn ? <Volume2 className="w-4 h-4 text-purple-300 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={handleToggleFullscreen}
                className="p-2.5 rounded-xl glass-button text-slate-400 hover:text-white cursor-pointer"
                title="Toggle Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* ════════════════════════════════════════════════════════════════ */
        /* STANDARD OVERLAY LAYOUT WITH CARDS UI */
        /* ════════════════════════════════════════════════════════════════ */
        <>
          {/* Header Navigation Bar */}
          <header className="relative z-30 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="glass-panel rounded-2xl p-3.5 md:px-6 flex items-center justify-between gap-4 border border-white/10 bg-slate-950/70 backdrop-blur-xl">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl btn-gradient-purple flex items-center justify-center shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-base font-black text-white tracking-wider font-display block">COSMORA</span>
                  <span className="text-[9px] font-mono text-purple-400 tracking-widest uppercase block -mt-1">3D SPACE PLATFORM</span>
                </div>
              </Link>

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
              </nav>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPure3D(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/50 text-purple-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-500/20"
                >
                  <EyeOff className="w-4 h-4 text-purple-300" />
                  <span>3D Only Mode</span>
                </button>
                <Link href="/login" className="px-4 py-2 rounded-xl text-xs font-bold btn-gradient-purple text-white shadow-md shadow-purple-500/20">
                  Sign In
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content Container */}
          <main className="relative z-10 pt-8 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
            <SymphonyHero
              onBeginJourney={handleBeginJourney}
              onWatchTrailer={() => setIsTrailerOpen(true)}
            />

            <SymphonyTimelineBar
              activeAct={activeAct}
              onSelectAct={handleSelectAct}
            />

            <ActCardsGrid
              activeAct={activeAct}
              onSelectAct={handleSelectAct}
              onExploreAct={handleExploreAct}
            />
          </main>

          <SymphonyControlsBar
            activeAct={activeAct}
            onSelectAct={handleSelectAct}
            isNarrationOn={isNarrationOn}
            onToggleNarration={() => setIsNarrationOn(!isNarrationOn)}
            is3DMode={isPure3D}
            onToggle3DMode={() => setIsPure3D(!isPure3D)}
          />
        </>
      )}

      {/* Interactive Act Detail Reader Modal */}
      <ActDetailModal
        actIndex={selectedModalAct}
        onClose={() => setSelectedModalAct(null)}
        onNavigateAct={(nextIndex) => {
          setActiveAct(nextIndex);
          setSelectedModalAct(nextIndex);
        }}
      />

      {/* Cinematic Trailer Video Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        onBeginJourney={handleBeginJourney}
      />
    </div>
  );
}
