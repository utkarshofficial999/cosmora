"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Compass,
  Globe,
  Weight,
  Anchor,
  Clock,
  Thermometer,
  Rocket,
  BookOpen,
  Bot,
  Layers,
  Maximize2,
  Info,
  Tag,
} from "lucide-react";

interface PlanetData {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  radius: string;
  orbitalPeriod: string;
  gravity: string;
  rotationPeriod: string;
  mass: string;
  temp: string;
  color: string;
  description: string;
  moons: number;
}

const PLANETS: Record<string, PlanetData> = {
  earth: {
    id: "earth",
    name: "Earth",
    subtitle: "Our Home Planet",
    type: "Terrestrial",
    radius: "6,371 km",
    orbitalPeriod: "365.25 days",
    gravity: "9.81 m/s²",
    rotationPeriod: "23.9 hrs",
    mass: "5.97 × 10²⁴ kg",
    temp: "15°C",
    color: "#38bdf8",
    description: "The third planet from the Sun and the only astronomical object known to harbor life.",
    moons: 1,
  },
  mars: {
    id: "mars",
    name: "Mars",
    subtitle: "The Red Planet",
    type: "Terrestrial",
    radius: "3,389 km",
    orbitalPeriod: "687 days",
    gravity: "3.72 m/s²",
    rotationPeriod: "24.6 hrs",
    mass: "6.42 × 10²³ kg",
    temp: "-63°C",
    color: "#ef4444",
    description: "Dusty, cold, desert world with a thin atmosphere. Home to Olympus Mons, the largest volcano in the Solar System.",
    moons: 2,
  },
  jupiter: {
    id: "jupiter",
    name: "Jupiter",
    subtitle: "Gas Giant King",
    type: "Gas Giant",
    radius: "69,911 km",
    orbitalPeriod: "11.86 years",
    gravity: "24.79 m/s²",
    rotationPeriod: "9.9 hrs",
    mass: "1.90 × 10²⁷ kg",
    temp: "-110°C",
    color: "#f97316",
    description: "More than twice as massive as all the other planets combined. Features the Great Red Spot storm.",
    moons: 95,
  },
  saturn: {
    id: "saturn",
    name: "Saturn",
    subtitle: "Ringed Wonder",
    type: "Gas Giant",
    radius: "58,232 km",
    orbitalPeriod: "29.45 years",
    gravity: "10.44 m/s²",
    rotationPeriod: "10.7 hrs",
    mass: "5.68 × 10²⁶ kg",
    temp: "-140°C",
    color: "#eab308",
    description: "Adorned with a dazzling, complex system of icy rings made of billions of small particles.",
    moons: 146,
  },
};

export default function SolarSystemPage() {
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>("earth");
  const [activeTab, setActiveTab] = useState<"overview" | "facts" | "moons" | "missions" | "stories">("overview");

  const planet = PLANETS[selectedPlanetId] || PLANETS.earth;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Top Header Controls Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/"
            className="p-2.5 rounded-xl glass-button text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide font-display">
              Solar System
            </h1>
            <p className="text-xs text-slate-400">Explore our cosmic neighborhood</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search planets..."
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500">
            <option>All Planets</option>
            <option>Terrestrial</option>
            <option>Gas Giants</option>
          </select>
        </div>
      </div>

      {/* Main Interactive Stage: 3D Orbit Canvas + Right Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Interactive 3D Solar Orbit Viewer Stage */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 min-h-[480px] relative flex flex-col justify-between overflow-hidden border border-white/10">
          {/* Top Stage Indicators */}
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/20">
              ● Live 3D Orbit Simulation
            </span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl glass-button text-slate-400 hover:text-white">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Planetary Orbits Schematic Visual */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Sun in Center */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300 shadow-[0_0_80px_rgba(249,115,22,0.8)] animate-pulse flex items-center justify-center">
              <span className="text-[10px] font-black text-slate-950 tracking-widest uppercase">
                SUN
              </span>
            </div>

            {/* Orbit Rings & Planet Selectors */}
            {Object.values(PLANETS).map((p, idx) => {
              const radius = 110 + idx * 65;
              const isSelected = selectedPlanetId === p.id;
              return (
                <div
                  key={p.id}
                  style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
                  className={`absolute rounded-full border transition-all ${
                    isSelected
                      ? "border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                      : "border-white/10"
                  }`}
                >
                  <button
                    onClick={() => setSelectedPlanetId(p.id)}
                    style={{
                      transform: `rotate(${idx * 90 + 45}deg) translate(${radius}px) rotate(-${
                        idx * 90 + 45
                      }deg)`,
                    }}
                    className={`absolute left-1/2 top-1/2 -ml-3 -mt-3 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? "scale-125 ring-4 ring-cyan-400/40" : "hover:scale-110"
                    }`}
                  >
                    <span
                      style={{ backgroundColor: p.color }}
                      className="w-5 h-5 rounded-full shadow-lg block"
                    />
                    <span className="absolute top-8 text-[10px] font-bold text-white font-mono bg-slate-950/80 px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap">
                      {p.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Controls Bar */}
          <div className="z-10 bg-slate-950/80 rounded-2xl p-2 border border-white/10 flex items-center justify-center gap-2 max-w-md mx-auto">
            <button className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Overview
            </button>
            <button className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Scale
            </button>
            <button className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Orbit
            </button>
            <button className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Labels
            </button>
            <button className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Info
            </button>
          </div>
        </div>

        {/* Right Planet Telemetry Inspector Panel */}
        <aside className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/10">
          <div>
            {/* Header & Planet Preview */}
            <div className="flex items-center gap-4 mb-4">
              <div
                style={{ backgroundColor: planet.color }}
                className="w-14 h-14 rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center justify-center p-0.5"
              >
                <div className="w-full h-full rounded-[14px] bg-slate-950/80 flex items-center justify-center">
                  <Globe className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-display">
                  {planet.name}
                </h2>
                <span className="text-xs text-slate-400 block mb-1">
                  {planet.subtitle}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                  {planet.type}
                </span>
              </div>
            </div>

            {/* Inspector Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-white/10 mb-4 text-xs font-semibold">
              {(["overview", "facts", "moons", "missions", "stories"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 capitalize transition-colors ${
                    activeTab === tab
                      ? "text-cyan-400 border-b-2 border-cyan-400"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {planet.description}
            </p>

            {/* Detailed Telemetry Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-6">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block mb-0.5">Radius</span>
                <span className="font-bold text-white">{planet.radius}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block mb-0.5">Orbital Period</span>
                <span className="font-bold text-white">{planet.orbitalPeriod}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block mb-0.5">Gravity</span>
                <span className="font-bold text-white">{planet.gravity}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block mb-0.5">Rotation</span>
                <span className="font-bold text-white">{planet.rotationPeriod}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block mb-0.5">Mass</span>
                <span className="font-bold text-white">{planet.mass}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block mb-0.5">Avg Temp</span>
                <span className="font-bold text-white">{planet.temp}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/missions"
                className="glass-button py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 text-slate-200 hover:text-white"
              >
                <Rocket className="w-3.5 h-3.5 text-indigo-400" />
                View Missions
              </Link>
              <Link
                href="/stories"
                className="glass-button py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 text-slate-200 hover:text-white"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                Read Stories
              </Link>
            </div>

            <Link
              href="/ai-assistant"
              className="w-full btn-gradient-purple py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-yellow-300" />
              Ask AI About {planet.name}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
