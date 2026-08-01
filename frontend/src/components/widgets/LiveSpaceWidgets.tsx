"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Satellite,
  Sun,
  Activity,
  Maximize2,
  Clock,
  Sparkles,
  Zap,
  Globe2,
  X,
} from "lucide-react";
import {
  MOCK_LAUNCHES,
  MOCK_ISS,
  MOCK_SPACE_WEATHER,
} from "@/mocks/dashboard";

export function LiveSpaceWidgets() {
  const [activeLaunchIdx, setActiveLaunchIdx] = useState(0);
  const [showJwstModal, setShowJwstModal] = useState(false);
  const currentLaunch = MOCK_LAUNCHES[activeLaunchIdx];

  // Countdown clock calculation
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 9, mins: 14, secs: 32 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        return { ...prev, secs: 59, mins: prev.mins > 0 ? prev.mins - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
      {/* 1. Upcoming Launch Countdown Widget */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-slate-950/70 border border-cyan-500/30 p-6 backdrop-blur-2xl flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
            <Rocket className="w-4 h-4 animate-bounce text-cyan-400" />
            <span className="uppercase tracking-wider font-bold">UPCOMING LAUNCH</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
            ● {currentLaunch.status}
          </span>
        </div>

        <div className="my-4">
          <h3 className="text-xl font-bold text-white font-sans">{currentLaunch.missionName}</h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            {currentLaunch.agency} • {currentLaunch.rocket}
          </p>
        </div>

        {/* Countdown Timer Display */}
        <div className="grid grid-cols-4 gap-2 text-center font-mono my-2">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10">
            <span className="text-xl font-bold text-cyan-300">{timeLeft.days}</span>
            <span className="text-[9px] text-slate-400 block">DAYS</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10">
            <span className="text-xl font-bold text-cyan-300">{timeLeft.hours}</span>
            <span className="text-[9px] text-slate-400 block">HOURS</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10">
            <span className="text-xl font-bold text-cyan-300">{timeLeft.mins}</span>
            <span className="text-[9px] text-slate-400 block">MINS</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10">
            <span className="text-xl font-bold text-cyan-300">{timeLeft.secs}</span>
            <span className="text-[9px] text-slate-400 block">SECS</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-white/10">
          <span className="truncate">{currentLaunch.launchPad}</span>
          <button
            type="button"
            onClick={() => setActiveLaunchIdx((prev) => (prev + 1) % MOCK_LAUNCHES.length)}
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 shrink-0 ml-2"
          >
            Next Launch »
          </button>
        </div>
      </motion.div>

      {/* 2. ISS Orbital Position & Telemetry */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl bg-slate-950/70 border border-sky-500/30 p-6 backdrop-blur-2xl flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono">
            <Satellite className="w-4 h-4 animate-spin-slow text-sky-400" />
            <span className="uppercase tracking-wider font-bold">ISS ORBITAL TELEMETRY</span>
          </div>
          <span className="text-[10px] font-mono text-sky-300 bg-sky-950 px-2 py-0.5 rounded-full border border-sky-500/30">
            LIVE FEED
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-4 font-mono">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10">
            <span className="text-slate-500 text-[10px] block">LAT / LONG</span>
            <span className="text-sm font-bold text-white">
              {MOCK_ISS.latitude.toFixed(2)}° N, {MOCK_ISS.longitude.toFixed(2)}° W
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10">
            <span className="text-slate-500 text-[10px] block">VELOCITY</span>
            <span className="text-sm font-bold text-emerald-400">
              {MOCK_ISS.velocityKmh.toLocaleString()} KM/H
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10">
            <span className="text-slate-500 text-[10px] block">ALTITUDE</span>
            <span className="text-sm font-bold text-cyan-300">{MOCK_ISS.altitudeKm} KM</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10">
            <span className="text-slate-500 text-[10px] block">ORBIT PHASE</span>
            <span className="text-xs font-bold text-slate-300 truncate block">
              {MOCK_ISS.visibility}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-white/10">
          <span>{MOCK_ISS.orbitPhase}</span>
          <span className="text-emerald-400 flex items-center gap-1">● SYNCED</span>
        </div>
      </motion.div>

      {/* 3. Solar Weather & JWST Latest Capture */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-3xl bg-slate-950/70 border border-purple-500/30 p-6 backdrop-blur-2xl flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono">
            <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="uppercase tracking-wider font-bold">SOLAR & JWST FEED</span>
          </div>
          <button
            type="button"
            onClick={() => setShowJwstModal(true)}
            className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3 my-3">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-500/20 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">SOLAR FLARE CLASS</span>
              <span className="text-amber-400 font-bold text-sm">
                {MOCK_SPACE_WEATHER.solarFlareClass}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">SOLAR WIND</span>
              <span className="text-cyan-300 font-bold">
                {MOCK_SPACE_WEATHER.solarWindSpeedKms} KM/S
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">GEOMAGNETIC STORM</span>
              <span className="text-purple-300 font-bold">
                {MOCK_SPACE_WEATHER.geomagneticStormIndex}
              </span>
            </div>
            <Zap className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-white/10">
          <span className="truncate">{MOCK_SPACE_WEATHER.auroraForecast}</span>
        </div>
      </motion.div>

      {/* JWST Image Modal */}
      <AnimatePresence>
        {showJwstModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="relative max-w-3xl w-full rounded-3xl bg-slate-950 border border-purple-500/40 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-purple-400 font-bold">
                  JWST HIGH-RES DEEP FIELD CAPTURE
                </span>
                <button
                  type="button"
                  onClick={() => setShowJwstModal(false)}
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80"
                  alt="JWST Capture"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                Gravitational Lensing in Galaxy Cluster SMACS 0723: Capturing infrared photons emitted over 13.1 billion light-years away.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
