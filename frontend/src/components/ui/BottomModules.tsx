"use client";

import Link from "next/link";
import { Compass, Rocket, BookOpen, Bot, BarChart2, ArrowRight } from "lucide-react";

export function BottomModules() {
  const modules = [
    {
      title: "Solar System",
      description: "Explore all planets and celestial bodies",
      icon: Compass,
      href: "/solar-system",
      color: "text-cyan-400",
      borderHover: "hover:border-cyan-500/40",
      glow: "hover:shadow-cyan-500/20",
    },
    {
      title: "Missions",
      description: "Track real space missions & discoveries",
      icon: Rocket,
      href: "/missions",
      color: "text-indigo-400",
      borderHover: "hover:border-indigo-500/40",
      glow: "hover:shadow-indigo-500/20",
    },
    {
      title: "Stories",
      description: "Immersive space stories & journeys",
      icon: BookOpen,
      href: "/stories",
      color: "text-purple-400",
      borderHover: "hover:border-purple-500/40",
      glow: "hover:shadow-purple-500/20",
    },
    {
      title: "AI Assistant",
      description: "Ask anything about space & universe",
      icon: Bot,
      href: "/ai-assistant",
      color: "text-yellow-400",
      borderHover: "hover:border-yellow-500/40",
      glow: "hover:shadow-yellow-500/20",
    },
    {
      title: "Analytics",
      description: "Discover space data & insights",
      icon: BarChart2,
      href: "/analytics",
      color: "text-emerald-400",
      borderHover: "hover:border-emerald-500/40",
      glow: "hover:shadow-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {modules.map((m) => {
        const Icon = m.icon;
        return (
          <Link
            key={m.title}
            href={m.href}
            className={`group glass-panel p-4 rounded-2xl border border-white/10 ${m.borderHover} ${m.glow} hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 group-hover:scale-110 transition-transform">
                  <Icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {m.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-tight">
                {m.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
