"use client";

import Link from "next/link";
import { Globe, ArrowRight, Compass, Weight, Anchor, Moon, Thermometer } from "lucide-react";

export function EarthPanel() {
  return (
    <aside className="w-full lg:w-80 glass-panel rounded-3xl p-6 flex flex-col justify-between shadow-2xl border border-white/10 hover:border-cyan-500/30 transition-all">
      <div>
        {/* Header Preview */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
              <Globe className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">Earth</h3>
            <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Sol System • 3rd Planet
            </span>
          </div>
        </div>

        {/* Short Summary */}
        <p className="text-xs text-slate-300 leading-relaxed mb-5 font-light">
          Our home planet, the only known world to support life. A dynamic and diverse planet with rich geological and atmospheric history.
        </p>

        {/* Telemetry Grid */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="flex items-center gap-2 text-slate-400">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Radius
            </span>
            <span className="font-semibold text-white">6,371 km</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="flex items-center gap-2 text-slate-400">
              <Weight className="w-3.5 h-3.5 text-indigo-400" />
              Mass
            </span>
            <span className="font-semibold text-white">5.97 × 10²⁴ kg</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="flex items-center gap-2 text-slate-400">
              <Anchor className="w-3.5 h-3.5 text-purple-400" />
              Gravity
            </span>
            <span className="font-semibold text-white">9.81 m/s²</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="flex items-center gap-2 text-slate-400">
              <Moon className="w-3.5 h-3.5 text-yellow-400" />
              Moons
            </span>
            <span className="font-semibold text-white">1 (Moon)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="flex items-center gap-2 text-slate-400">
              <Thermometer className="w-3.5 h-3.5 text-pink-400" />
              Temp
            </span>
            <span className="font-semibold text-white">-89°C to 58°C</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <Link
        href="/solar-system"
        className="mt-6 w-full btn-gradient-primary py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 group"
      >
        <span>View Details</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </aside>
  );
}
