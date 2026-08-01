"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ACT_NAMES } from "./SymphonyTimelineBar";

interface ActCardsGridProps {
  activeAct: number;
  onSelectAct: (index: number) => void;
  onExploreAct: (index: number) => void;
}

export function ActCardsGrid({ activeAct, onSelectAct, onExploreAct }: ActCardsGridProps) {
  const actThumbnails = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800", // Act I
    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800", // Act II
    "https://images.unsplash.com/photo-1532635241-17e820acc59f?q=80&w=800", // Act III
    "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800", // Act IV
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {ACT_NAMES.map((act, index) => {
        const isActive = activeAct === index;
        return (
          <div
            key={act.number}
            onClick={() => onSelectAct(index)}
            className={`group relative glass-panel rounded-3xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 cursor-pointer border ${
              isActive
                ? "border-purple-500/80 bg-purple-950/40 shadow-2xl shadow-purple-500/20 ring-2 ring-purple-500/40 translate-y-[-4px]"
                : "border-white/10 hover:border-purple-500/40 hover:bg-slate-900/60"
            }`}
          >
            {/* Background Image Preview Accent */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none"
              style={{ backgroundImage: `url(${actThumbnails[index]})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300">
                  ACT {act.number}
                </span>
                {isActive && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 font-bold">
                    <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                    ACTIVE 3D WORLD
                  </span>
                )}
              </div>

              <h3 className="text-lg font-extrabold text-white mb-2 font-display group-hover:text-purple-300 transition-colors">
                {act.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                {act.desc}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExploreAct(index);
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "btn-gradient-purple text-white shadow-lg shadow-purple-500/20"
                    : "glass-button text-slate-300 hover:text-white hover:border-white/20"
                }`}
              >
                <span>Explore Act {act.number}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
