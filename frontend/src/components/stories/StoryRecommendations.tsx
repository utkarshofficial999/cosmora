"use client";

import Link from "next/link";
import { BookOpen, Rocket, Compass, ArrowRight } from "lucide-react";

export function StoryRecommendations() {
  const recommendations = [
    {
      title: "James Webb: Peering into Creation",
      type: "Story",
      href: "/stories/james-webb-deep-space",
      icon: BookOpen,
      color: "text-purple-400",
    },
    {
      title: "Artemis III Lunar Mission Control",
      type: "Mission",
      href: "/missions",
      icon: Rocket,
      color: "text-indigo-400",
    },
    {
      title: "3D Solar System Planetary Orbits",
      type: "3D Explorer",
      href: "/solar-system",
      icon: Compass,
      color: "text-cyan-400",
    },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 mt-12">
      <h3 className="text-xl font-bold text-white font-display mb-2">
        Continue Your Cosmic Discovery
      </h3>
      <p className="text-xs text-slate-400 mb-6">
        Recommended stories, 3D orbits, and missions based on this chapter
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((r, i) => {
          const Icon = r.icon;
          return (
            <Link
              key={i}
              href={r.href}
              className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-400">
                    {r.type}
                  </span>
                  <Icon className={`w-4 h-4 ${r.color}`} />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {r.title}
                </h4>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
