"use client";

import { X, Play, Sparkles } from "lucide-react";

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoVideoModal({ isOpen, onClose }: DemoVideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl glass-panel rounded-3xl p-6 border border-purple-500/40 shadow-2xl shadow-purple-500/20 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white font-display">
              Cosmora 3D Platform Showcase Demo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl glass-button text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Stage Frame */}
        <div className="aspect-video w-full rounded-2xl bg-slate-900 border border-white/10 overflow-hidden relative flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-purple-500/30 mb-4 animate-pulse">
            <Play className="w-8 h-8 text-slate-950 ml-1 fill-slate-950" />
          </div>
          <h4 className="text-xl font-bold text-white font-display mb-2">
            Cosmora v1.0 3D Interactive Trailer
          </h4>
          <p className="text-xs text-slate-400 max-w-md font-mono mb-4">
            Showcasing WebGL 3D Solar System, Rocket Launch Controls, Grounded RAG AI Assistant, and Immersive Chapter Storytelling.
          </p>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
            ● 60 FPS Real-time WebGL Engine Active
          </span>
        </div>
      </div>
    </div>
  );
}
