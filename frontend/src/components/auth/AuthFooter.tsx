"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Wifi, Compass } from "lucide-react";

export function AuthFooter() {
  const [utcTime, setUtcTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().replace("T", " ").substring(0, 19) + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full py-4 px-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-lg flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-mono z-10 relative">
      {/* Security & System Telemetry */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SYSTEM OPERATIONAL (99.99%)</span>
        </div>

        <div className="flex items-center gap-1.5 text-cyan-300">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>256-BIT QUANTUM ENCRYPTION</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <Wifi className="w-3.5 h-3.5 text-sky-400" />
          <span>LATENCY: 14MS</span>
        </div>
      </div>

      {/* UTC Cosmic Clock & Copyright */}
      <div className="flex items-center gap-4 text-slate-400">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
          <span>{utcTime || "2026-08-01 08:00:00 UTC"}</span>
        </div>
        <span className="text-slate-600">|</span>
        <span>© COSMORA EXPLORATION</span>
      </div>
    </footer>
  );
}
