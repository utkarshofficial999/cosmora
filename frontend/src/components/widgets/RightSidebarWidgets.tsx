"use client";

import { Sparkles, Newspaper, ShieldAlert, Sun, ArrowUpRight } from "lucide-react";
import { MOCK_SPACE_NEWS, MOCK_SPACE_WEATHER } from "@/mocks/dashboard";

export function RightSidebarWidgets() {
  return (
    <div className="flex flex-col gap-6">
      {/* 1. Today's Cosmic Quote */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950/70 border border-purple-500/30 p-6 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-mono mb-3">
          <Sparkles className="w-4 h-4" />
          <span className="font-bold uppercase tracking-wider">COSMIC QUOTE OF THE DAY</span>
        </div>
        <blockquote className="text-sm font-extralight italic text-slate-200 leading-relaxed font-sans">
          &ldquo;Somewhere, something incredible is waiting to be known.&rdquo;
        </blockquote>
        <div className="mt-3 pt-3 border-t border-white/10 text-[11px] font-mono text-purple-300 flex justify-between">
          <span>— Dr. Carl Sagan</span>
          <span>Astrobiologist</span>
        </div>
      </div>

      {/* 2. Critical Mission Alert */}
      <div className="rounded-3xl bg-red-950/20 border border-red-500/30 p-5 backdrop-blur-2xl flex flex-col gap-2">
        <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold">
          <ShieldAlert className="w-4 h-4 animate-bounce" />
          <span>CRITICAL MISSION ALERT</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Solar Flare Class {MOCK_SPACE_WEATHER.solarFlareClass} detected. High-frequency HF radio blackouts active in polar regions.
        </p>
      </div>

      {/* 3. Space News Feed */}
      <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-6 backdrop-blur-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Newspaper className="w-4 h-4" />
            <span className="font-bold tracking-wider uppercase text-white">LATEST SPACE NEWS</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">LIVE</span>
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_SPACE_NEWS.map((news) => (
            <div
              key={news.id}
              className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-400/40 transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span className="text-cyan-400">{news.source}</span>
                <span>{news.timeAgo}</span>
              </div>
              <h5 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                {news.title}
              </h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
