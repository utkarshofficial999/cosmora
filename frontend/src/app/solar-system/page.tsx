"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Orbit } from "lucide-react";
import { SolarSystemCanvas } from "@/components/solar-system/3d/SolarSystemCanvas";
import { SpeedController } from "@/components/solar-system/SpeedController";
import { MiniMap } from "@/components/solar-system/MiniMap";
import { SearchBar } from "@/components/solar-system/SearchBar";
import { MOCK_PLANETS } from "@/mocks/solar-system/planets";

export default function SolarSystemPage() {
  const router = useRouter();
  const [speedFactor, setSpeedFactor] = useState(1);
  const [nightMode, setNightMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSlug, setSelectedSlug] = useState<string>("earth");

  const planet = MOCK_PLANETS[selectedSlug] || MOCK_PLANETS.earth;

  const filteredPlanets = Object.values(MOCK_PLANETS).filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Full-Screen Live Dynamic 3D WebGL Solar System Canvas */}
      <SolarSystemCanvas
        speedFactor={speedFactor}
        nightMode={nightMode}
        selectedSlug={selectedSlug}
        onSelectPlanet={(slug) => {
          setSelectedSlug(slug);
        }}
      />

      {/* Top Floating HUD Header */}
      <header className="fixed top-0 inset-x-0 z-30 p-6 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-none">
        {/* Brand & Sub-Navigation */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            href="/"
            className="p-3 rounded-2xl bg-slate-950/80 border border-white/15 backdrop-blur-2xl text-cyan-400 font-mono font-bold text-xs hover:border-cyan-400 transition-all flex items-center gap-2 shadow-2xl"
          >
            <Orbit className="w-4 h-4 animate-spin-slow" />
            <span>COSMORA ORBITAL</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl text-xs font-mono">
            <Link
              href="/solar-system"
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold"
            >
              Overview
            </Link>
            <Link
              href="/solar-system/asteroids"
              className="px-3.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Asteroids
            </Link>
            <Link
              href="/solar-system/compare"
              className="px-3.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/solar-system/map"
              className="px-3.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Space Map
            </Link>
          </div>
        </div>

        {/* Time Speed Control Bar */}
        <div className="pointer-events-auto">
          <SpeedController
            speedFactor={speedFactor}
            onSpeedChange={setSpeedFactor}
            nightMode={nightMode}
            onNightModeToggle={() => setNightMode(!nightMode)}
          />
        </div>
      </header>

      {/* Floating Left Search & Filter HUD Panel */}
      <div className="fixed top-24 left-6 z-20 w-80 hidden lg:flex flex-col gap-4 pointer-events-auto">
        <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/15 backdrop-blur-2xl shadow-2xl">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Quick Planet Pick List */}
          <div className="mt-4 flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
            {filteredPlanets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedSlug(p.slug)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-mono transition-all ${
                  selectedSlug === p.slug
                    ? "bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold"
                    : "bg-slate-900/50 border-white/5 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span>{p.name}</span>
                </div>
                <span className="text-[10px] text-slate-500">{p.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Radar Mini-Map */}
        <MiniMap />
      </div>

      {/* Right Floating Planet Telemetry Inspector */}
      <motion.div
        key={planet.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-24 right-6 z-20 w-80 sm:w-96 p-6 rounded-3xl bg-slate-950/85 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,229,255,0.2)] flex flex-col justify-between max-h-[80vh] overflow-y-auto pointer-events-auto"
      >
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full shadow-[0_0_12px_currentColor]"
                style={{ backgroundColor: planet.color, color: planet.color }}
              />
              <div>
                <h2 className="text-xl font-bold text-white font-sans">{planet.name}</h2>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">
                  {planet.subtitle}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
              {planet.category}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
            {planet.description}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-6">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10">
              <span className="text-[10px] text-slate-500 block">RADIUS</span>
              <span className="text-cyan-300 font-bold">{planet.radius}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10">
              <span className="text-[10px] text-slate-500 block">GRAVITY</span>
              <span className="text-cyan-300 font-bold">{planet.gravity}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10">
              <span className="text-[10px] text-slate-500 block">ORBIT</span>
              <span className="text-cyan-300 font-bold">{planet.orbitalPeriod}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10">
              <span className="text-[10px] text-slate-500 block">MOONS</span>
              <span className="text-cyan-300 font-bold">{planet.moonsCount}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push(`/solar-system/planet/${planet.slug}`)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.7)] transition-all flex items-center justify-center gap-2"
        >
          <span>Explore 3D Surface & Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
