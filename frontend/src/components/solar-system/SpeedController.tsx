"use client";

import { Play, Pause, Sun, Moon, Gauge } from "lucide-react";

interface SpeedControllerProps {
  speedFactor: number;
  onSpeedChange: (speed: number) => void;
  nightMode: boolean;
  onNightModeToggle: () => void;
}

export function SpeedController({
  speedFactor,
  onSpeedChange,
  nightMode,
  onNightModeToggle,
}: SpeedControllerProps) {
  const speeds = [0.1, 1, 2, 5, 10];
  const isPaused = speedFactor === 0;

  return (
    <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-950/80 border border-white/15 backdrop-blur-2xl font-mono text-xs shadow-2xl">
      {/* Play/Pause Toggle */}
      <button
        type="button"
        onClick={() => onSpeedChange(isPaused ? 1 : 0)}
        className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
          isPaused
            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
            : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
        }`}
      >
        {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
      </button>

      {/* Speed Multiplier Buttons */}
      <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/10">
        <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1" />
        {speeds.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSpeedChange(s)}
            className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-bold ${
              speedFactor === s
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_#00e5ff]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Night Mode Toggle */}
      <button
        type="button"
        onClick={onNightModeToggle}
        className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
          nightMode
            ? "bg-purple-950 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            : "bg-slate-900 text-slate-400 border border-white/10 hover:text-white"
        }`}
      >
        {nightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>
    </div>
  );
}
