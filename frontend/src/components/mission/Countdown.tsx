"use client";

import { useState, useEffect } from "react";
import { Clock, Radio, Rocket } from "lucide-react";

interface CountdownProps {
  launchDate: string;
  missionName: string;
  agency: string;
}

export function Countdown({ launchDate, missionName, agency }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const target = new Date(launchDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        clearInterval(interval);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d.toString().padStart(2, "0"),
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [launchDate]);

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
      {/* Ambient Pulsing Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left Mission Info */}
      <div className="flex items-center gap-4 z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
          <Rocket className="w-7 h-7 text-white animate-pulse" />
        </div>
        <div>
          <span className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
            Live Telemetry • Next Scheduled Flight
          </span>
          <h2 className="text-2xl font-black text-white font-display">
            {missionName}
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Agency: {agency} • Pad 39B
          </span>
        </div>
      </div>

      {/* SpaceX / FUI Style Clock Digit Counters */}
      <div className="flex items-center gap-3 font-mono z-10">
        <div className="bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 text-center min-w-[70px]">
          <span className="block text-2xl md:text-3xl font-black text-white text-gradient-cyan">
            {timeLeft.days}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block mt-0.5">
            DAYS
          </span>
        </div>
        <span className="text-xl font-bold text-slate-600">:</span>

        <div className="bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 text-center min-w-[70px]">
          <span className="block text-2xl md:text-3xl font-black text-white text-gradient-cyan">
            {timeLeft.hours}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block mt-0.5">
            HRS
          </span>
        </div>
        <span className="text-xl font-bold text-slate-600">:</span>

        <div className="bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 text-center min-w-[70px]">
          <span className="block text-2xl md:text-3xl font-black text-white text-gradient-cyan">
            {timeLeft.minutes}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block mt-0.5">
            MINS
          </span>
        </div>
        <span className="text-xl font-bold text-slate-600">:</span>

        <div className="bg-slate-950/80 border border-cyan-500/40 rounded-2xl px-4 py-3 text-center min-w-[70px] shadow-lg shadow-cyan-500/10">
          <span className="block text-2xl md:text-3xl font-black text-cyan-400">
            {timeLeft.seconds}
          </span>
          <span className="text-[10px] text-cyan-300 uppercase tracking-widest block mt-0.5">
            SECS
          </span>
        </div>
      </div>
    </div>
  );
}
