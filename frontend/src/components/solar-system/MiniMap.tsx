"use client";

import { Compass } from "lucide-react";

export function MiniMap() {
  const planetColors = [
    "#a1a1aa", // Mercury
    "#fde047", // Venus
    "#38bdf8", // Earth
    "#ef4444", // Mars
    "#f97316", // Jupiter
    "#eab308", // Saturn
  ];

  return (
    <div className="relative w-36 h-36 rounded-2xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-2xl p-2 flex flex-col justify-between shadow-[0_0_20px_rgba(0,229,255,0.15)] font-mono text-[9px]">
      <div className="flex items-center justify-between text-cyan-400 border-b border-white/10 pb-1">
        <span className="flex items-center gap-1">
          <Compass className="w-3 h-3 animate-spin-slow" />
          <span>RADAR MAP</span>
        </span>
        <span className="text-[8px] text-emerald-400">● LIVE</span>
      </div>

      {/* Top-Down Schematic Orbits */}
      <div className="relative flex-1 flex items-center justify-center my-1">
        {/* Sun Dot */}
        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] z-10" />

        {/* Orbit Rings */}
        {planetColors.map((color, idx) => {
          const r = 12 + idx * 8;
          return (
            <div
              key={idx}
              style={{ width: `${r * 2}px`, height: `${r * 2}px` }}
              className="absolute rounded-full border border-white/10 flex items-center justify-center pointer-events-none"
            >
              {/* Planet Dot */}
              <span
                style={{
                  backgroundColor: color,
                  transform: `rotate(${idx * 60 + 30}deg) translate(${r}px)`,
                }}
                className="w-1.5 h-1.5 rounded-full block shadow-[0_0_4px_currentColor]"
              />
            </div>
          );
        })}
      </div>

      <div className="text-center text-[8px] text-slate-500 border-t border-white/10 pt-1">
        TOP-DOWN ORBITAL PLANE
      </div>
    </div>
  );
}
