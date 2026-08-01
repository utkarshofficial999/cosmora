"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Rocket, Layers, Sparkles, ShieldCheck } from "lucide-react";
import { MoonCanvas } from "@/components/solar-system/3d/MoonCanvas";
import { MOCK_MOONS } from "@/mocks/solar-system/moons";

interface MoonPageProps {
  params: Promise<{ slug: string }>;
}

export default function MoonDetailPage({ params }: MoonPageProps) {
  const resolvedParams = use(params);
  const moon = MOCK_MOONS[resolvedParams.slug];

  if (!moon) {
    notFound();
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/solar-system"
            className="p-2.5 rounded-2xl bg-slate-900 border border-white/15 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{moon.name}</h1>
            <span className="text-xs text-slate-400 font-mono">
              Natural Satellite of {moon.planetSlug.toUpperCase()}
            </span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 font-mono text-xs border border-cyan-500/30">
          ● Interactive Landing Markers
        </span>
      </div>

      {/* 3D Moon Stage & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        {/* 3D Stage */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-2xl p-6 relative overflow-hidden min-h-[480px] shadow-2xl">
          <MoonCanvas moon={moon} />
        </div>

        {/* Right Inspector */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-2xl">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-4">
              LUNAR TELEMETRY
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
              {moon.description}
            </p>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-500 block mb-0.5">RADIUS</span>
                <span className="text-white font-bold">{moon.radius}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-500 block mb-0.5">GRAVITY</span>
                <span className="text-white font-bold">{moon.gravity}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-500 block mb-0.5">ORBIT PERIOD</span>
                <span className="text-white font-bold">{moon.orbitalPeriod}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] text-slate-500 block mb-0.5">SURFACE TEMP</span>
                <span className="text-white font-bold">{moon.surfaceTemp}</span>
              </div>
            </div>
          </div>

          {/* Landing Sites List */}
          {moon.landingSites.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-cyan-500/30 backdrop-blur-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-3">
                <MapPin className="w-4 h-4" />
                <span>KEY LANDING SITES ({moon.landingSites.length})</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {moon.landingSites.map((site) => (
                  <div
                    key={site.name}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 font-mono text-xs"
                  >
                    <div className="flex justify-between text-cyan-300 font-bold">
                      <span>{site.name}</span>
                      <span className="text-[10px] text-slate-400">{site.agency} ({site.year})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-1 leading-snug">
                      {site.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
