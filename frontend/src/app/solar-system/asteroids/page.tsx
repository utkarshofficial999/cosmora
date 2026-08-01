"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, ShieldAlert, ShieldCheck, Orbit, Zap, DollarSign } from "lucide-react";
import { AsteroidCanvas } from "@/components/solar-system/3d/AsteroidCanvas";
import { MOCK_ASTEROIDS } from "@/mocks/solar-system/asteroids";

export default function AsteroidsPage() {
  const [filterHazard, setFilterHazard] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAsteroids = MOCK_ASTEROIDS.filter((ast) => {
    const matchesSearch =
      ast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ast.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHazard = filterHazard === null || ast.hazardous === filterHazard;
    return matchesSearch && matchesHazard;
  });

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* 3D Moving Asteroid Belt Canvas */}
      <AsteroidCanvas />

      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 z-30 p-6 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            href="/solar-system"
            className="p-3 rounded-2xl bg-slate-950/80 border border-white/15 backdrop-blur-2xl text-slate-300 hover:text-white transition-all shadow-2xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-white tracking-wide font-sans">
              Asteroid & NEO Explorer
            </h1>
            <span className="text-[10px] font-mono text-cyan-400">
              MAIN BELT & NEAR-EARTH OBJECT TELEMETRY
            </span>
          </div>
        </div>

        {/* Hazard Filter Controls */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-white/15 backdrop-blur-2xl text-xs font-mono pointer-events-auto">
          <button
            type="button"
            onClick={() => setFilterHazard(null)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterHazard === null
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Asteroids
          </button>
          <button
            type="button"
            onClick={() => setFilterHazard(true)}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              filterHazard === true
                ? "bg-red-500 text-white font-bold shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                : "text-slate-400 hover:text-red-400"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Hazardous (NEOs)</span>
          </button>
        </div>
      </header>

      {/* Right Asteroid Inspector Grid */}
      <div className="fixed top-24 right-6 z-20 w-80 sm:w-96 p-6 rounded-3xl bg-slate-950/85 border border-white/15 backdrop-blur-2xl shadow-2xl max-h-[82vh] overflow-y-auto flex flex-col gap-4 pointer-events-auto">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search asteroids (e.g. Apophis, Psyche)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex flex-col gap-3">
          {filteredAsteroids.map((ast) => (
            <div
              key={ast.id}
              className={`p-4 rounded-2xl border backdrop-blur-xl flex flex-col gap-2 transition-all ${
                ast.hazardous
                  ? "bg-red-950/30 border-red-500/40 hover:border-red-400"
                  : "bg-slate-900/60 border-white/10 hover:border-cyan-400"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-white text-sm">{ast.name}</span>
                {ast.hazardous ? (
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[9px] font-bold border border-red-500/40 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> HAZARD
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                    SAFE
                  </span>
                )}
              </div>

              <span className="text-[10px] font-mono text-slate-400">{ast.type}</span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{ast.description}</p>

              <div className="grid grid-cols-2 gap-2 font-mono text-[10px] pt-2 border-t border-white/10">
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <span className="text-slate-500 block">DIAMETER</span>
                  <span className="text-cyan-300 font-bold">{ast.diameterKm} km</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60">
                  <span className="text-slate-500 block">ORBIT DIST</span>
                  <span className="text-cyan-300 font-bold">{ast.orbitDistanceAU} AU</span>
                </div>
              </div>

              {ast.estimatedValueUsd && (
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono flex items-center justify-between text-emerald-400">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> MINING VALUE:
                  </span>
                  <span className="font-bold">{ast.estimatedValueUsd}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
