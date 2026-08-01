"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  Layers,
  Rocket,
  Sparkles,
  ShieldCheck,
  Bot,
  Thermometer,
  Weight,
  Clock,
  Compass,
  ArrowRight,
} from "lucide-react";
import { PlanetCanvas } from "@/components/solar-system/3d/PlanetCanvas";
import { MOCK_PLANETS } from "@/mocks/solar-system/planets";
import { MOCK_MOONS } from "@/mocks/solar-system/moons";

interface PlanetPageProps {
  params: Promise<{ slug: string }>;
}

export default function PlanetDetailPage({ params }: PlanetPageProps) {
  const resolvedParams = use(params);
  const planet = MOCK_PLANETS[resolvedParams.slug];

  if (!planet) {
    notFound();
  }

  const relatedMoons = Object.values(MOCK_MOONS).filter(
    (m) => m.planetSlug === planet.slug
  );

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/solar-system"
            className="p-2.5 rounded-2xl bg-slate-900 border border-white/15 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: planet.color }}
              />
              <h1 className="text-2xl font-bold text-white tracking-tight">{planet.name}</h1>
            </div>
            <span className="text-xs text-slate-400 font-mono">{planet.subtitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-semibold">
            {planet.category}
          </span>
        </div>
      </div>

      {/* Main Grid: 3D Stage Left (7 cols) vs Telemetry Inspector Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* 3D Planet Viewer Stage */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-2xl p-6 relative overflow-hidden min-h-[500px] shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
              ● Live 3D Atmosphere Renderer
            </span>
            <span className="text-xs font-mono text-slate-400">DISTANCE: {planet.distanceSun}</span>
          </div>

          <PlanetCanvas planet={planet} />

          <div className="z-10 p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
            <span>ROTATION: {planet.rotationPeriod}</span>
            <span>SURFACE TEMP: {planet.tempAvg}</span>
          </div>
        </div>

        {/* Right Telemetry Details */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* AI Summary Card */}
          <div className="p-6 rounded-3xl bg-purple-950/20 border border-purple-500/40 backdrop-blur-2xl">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold mb-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>ASTRO-AI PLATFORM INSIGHT</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{planet.aiSummary}</p>
          </div>

          {/* Physical & Orbital Stats */}
          <div className="p-6 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-2xl">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-4">
              PHYSICAL & ORBITAL TELEMETRY
            </h3>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-500 block mb-0.5">EQUATORIAL RADIUS</span>
                <span className="text-white font-bold">{planet.radius}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-500 block mb-0.5">PLANETARY MASS</span>
                <span className="text-white font-bold">{planet.mass}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-500 block mb-0.5">SURFACE GRAVITY</span>
                <span className="text-white font-bold">{planet.gravity}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-500 block mb-0.5">ORBITAL PERIOD</span>
                <span className="text-white font-bold">{planet.orbitalPeriod}</span>
              </div>
            </div>
          </div>

          {/* Major Moons Link if available */}
          {relatedMoons.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-2xl">
              <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-3">
                MAJOR SATELLITES & MOONS ({relatedMoons.length})
              </h3>
              <div className="flex flex-col gap-2">
                {relatedMoons.map((moon) => (
                  <Link
                    key={moon.id}
                    href={`/solar-system/moon/${moon.slug}`}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-400 transition-colors flex items-center justify-between text-xs font-mono text-slate-200"
                  >
                    <span>{moon.name}</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Atmosphere & Internal Structure Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
        {/* Atmosphere Layers */}
        <div className="p-6 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-2xl">
          <h3 className="text-sm font-bold text-white tracking-tight mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Atmosphere Layers</span>
          </h3>
          <div className="flex flex-col gap-3">
            {planet.atmosphereLayers.map((layer, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 font-mono text-xs"
              >
                <div className="flex justify-between font-bold text-cyan-300 mb-1">
                  <span>{layer.name}</span>
                  <span className="text-[10px] text-slate-500">{layer.altitude}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Structure */}
        <div className="p-6 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-2xl">
          <h3 className="text-sm font-bold text-white tracking-tight mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span>Internal Geologic Structure</span>
          </h3>
          <div className="flex flex-col gap-3">
            {planet.internalStructure.map((layer, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 font-mono text-xs"
              >
                <div className="flex justify-between font-bold text-purple-300 mb-1">
                  <span>{layer.layer}</span>
                  <span className="text-[10px] text-slate-500">{layer.thickness}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
