"use client";

import React from "react";
import { X, Film, Sparkles, Play } from "lucide-react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBeginJourney: () => void;
}

export function TrailerModal({ isOpen, onClose, onBeginJourney }: TrailerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/90 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden border border-purple-500/40 bg-slate-950/95 shadow-2xl shadow-purple-950/80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-3 rounded-2xl glass-button text-slate-300 hover:text-white border border-white/20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cinematic Video Simulation / Trailer Box */}
        <div className="relative w-full h-[360px] md:h-[480px] bg-slate-950 flex flex-col justify-between p-8 md:p-12 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200"
            alt="Cosmora Cinematic Trailer"
            className="absolute inset-0 w-full h-full object-cover opacity-40 animate-pulse"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2 text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
            <Film className="w-4 h-4 text-purple-400" />
            <span>COSMORA CINEMATIC TRAILER</span>
          </div>

          <div className="relative z-10 text-center max-w-xl mx-auto my-auto">
            <h3 className="text-3xl md:text-5xl font-black text-white font-display mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-300">
              The Symphony of the Void
            </h3>
            <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed mb-6">
              Witness 13.8 billion years of cosmic genesis unfolded in an interactive 3D universe.
            </p>
            <button
              onClick={() => {
                onClose();
                onBeginJourney();
              }}
              className="px-8 py-3.5 rounded-2xl btn-gradient-purple text-white font-bold text-sm inline-flex items-center gap-3 shadow-xl shadow-purple-500/30 hover:scale-105 transition-transform cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Full Interactive 3D Experience</span>
            </button>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Runtime: 02:45 (4K 60FPS WebGL)</span>
            <span>Unreal Engine 5 PBR Asset Pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
