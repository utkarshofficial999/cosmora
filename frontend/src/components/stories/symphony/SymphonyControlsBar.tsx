"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Maximize, Box, Sparkles, MonitorPlay } from "lucide-react";
import { ACT_NAMES } from "./SymphonyTimelineBar";

interface SymphonyControlsBarProps {
  activeAct: number;
  onSelectAct: (index: number) => void;
  isNarrationOn: boolean;
  onToggleNarration: () => void;
  is3DMode: boolean;
  onToggle3DMode: () => void;
}

export function SymphonyControlsBar({
  activeAct,
  onSelectAct,
  isNarrationOn,
  onToggleNarration,
  is3DMode,
  onToggle3DMode,
}: SymphonyControlsBarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const actThumbnails = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200", // Act I
    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=200", // Act II
    "https://images.unsplash.com/photo-1532635241-17e820acc59f?q=80&w=200", // Act III
    "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=200", // Act IV
  ];

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-4xl glass-panel rounded-2xl p-3 border border-purple-500/30 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-purple-950/40 flex items-center justify-between gap-4">
      {/* Audio Narration Toggle */}
      <button
        onClick={onToggleNarration}
        className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
          isNarrationOn
            ? "bg-purple-600/30 border border-purple-500/50 text-purple-200 shadow-md shadow-purple-500/20"
            : "glass-button text-slate-400 border-white/10 hover:text-white"
        }`}
      >
        {isNarrationOn ? (
          <>
            <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Narration On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-slate-500" />
            <span>Narration Off</span>
          </>
        )}
      </button>

      {/* MiniMap Carousel Thumbnails matching bottom screenshot row */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10">
        {ACT_NAMES.map((act, index) => {
          const isActive = activeAct === index;
          return (
            <button
              key={act.number}
              onClick={() => onSelectAct(index)}
              className={`relative w-12 h-9 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                isActive
                  ? "border-purple-500 ring-2 ring-purple-400/50 scale-105"
                  : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/50"
              }`}
            >
              <img src={actThumbnails[index]} alt={act.shortTitle} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/30" />
              <span className="absolute bottom-0.5 right-1 text-[9px] font-bold font-mono text-white">
                {act.number}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3D Mode Toggle & Fullscreen */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggle3DMode}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
            is3DMode
              ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/20"
              : "glass-button text-slate-400 border-white/10 hover:text-white"
          }`}
        >
          <Box className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">3D Mode</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40">
            {is3DMode ? "ON" : "OFF"}
          </span>
        </button>

        <button
          onClick={handleToggleFullscreen}
          className="p-2.5 rounded-xl glass-button text-slate-400 hover:text-white border border-white/10 cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
