"use client";

import { useState } from "react";
import { Play, Pause, Volume2, FastForward, RotateCcw } from "lucide-react";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("1.0x");

  const speeds = ["1.0x", "1.25x", "1.5x"];

  const toggleSpeed = () => {
    const idx = speeds.indexOf(speed);
    setSpeed(speeds[(idx + 1) % speeds.length]);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-4 mb-6 shadow-xl">
      {/* Left Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <div>
          <span className="text-xs font-bold text-white block">
            Audio Narration
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {isPlaying ? "Playing AI Narration • 02:45 / 08:00" : "Click to stream audio narrative"}
          </span>
        </div>
      </div>

      {/* Center Waveform Graphic */}
      <div className="hidden md:flex items-center gap-1">
        {[40, 70, 30, 85, 60, 90, 45, 75, 35, 65].map((h, i) => (
          <div
            key={i}
            style={{ height: `${isPlaying ? h : 20}%` }}
            className="w-1 bg-cyan-400/60 rounded-full transition-all duration-300 min-h-[8px]"
          />
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 font-mono text-xs">
        <button
          onClick={toggleSpeed}
          className="px-2.5 py-1 rounded-lg glass-button text-cyan-300 hover:text-white"
        >
          {speed}
        </button>
        <button className="p-2 rounded-lg glass-button text-slate-400 hover:text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
