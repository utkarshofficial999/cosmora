"use client";

import Link from "next/link";
import { Rocket, ArrowRight } from "lucide-react";

export function LiveUpdatesTicker() {
  const updates = [
    "James Webb Telescope captures new galaxy image",
    "Artemis mission preparing for next lunar launch",
    "Mars rover sends latest geological discoveries",
    "ISRO Gaganyaan crew module flight test successful",
    "ESA Euclid space telescope delivers first deep sky survey",
  ];

  return (
    <div className="glass-panel rounded-2xl px-4 py-3 flex items-center justify-between overflow-hidden border border-white/10">
      {/* Left Live Badge */}
      <div className="flex items-center gap-2 pr-4 border-r border-white/10 shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
        </span>
        <Rocket className="w-4 h-4 text-purple-400" />
        <span className="text-xs font-bold text-white tracking-wide whitespace-nowrap">
          Live Space Updates
        </span>
      </div>

      {/* Center Ticker Container */}
      <div className="overflow-hidden flex-1 mx-4 relative">
        <div className="animate-ticker text-xs font-medium text-slate-300 gap-8">
          {updates.concat(updates).map((text, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Right Link */}
      <Link
        href="/missions"
        className="glass-button px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white shrink-0 flex items-center gap-1.5"
      >
        <span>View All Updates</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
