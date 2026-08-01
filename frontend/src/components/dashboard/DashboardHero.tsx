"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Rocket,
  Orbit,
  BookOpen,
  Bot,
  Search,
  Sparkles,
  Flame,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { MOCK_EXPLORER } from "@/mocks/dashboard";

export function DashboardHero() {
  const quickActions = [
    { name: "Continue Reading", href: "/stories", icon: BookOpen, color: "text-cyan-400" },
    { name: "Explore Solar System", href: "/solar-system", icon: Orbit, color: "text-purple-400" },
    { name: "Mission Control", href: "/missions", icon: Rocket, color: "text-sky-400" },
    { name: "AI Assistant", href: "/ai-assistant", icon: Bot, color: "text-emerald-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-slate-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
    >
      {/* Top Edge Ambient Ambient Glow */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top Explorer Greeting Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COSMORA MISSION COMMAND</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Good Morning, {MOCK_EXPLORER.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Welcome back to Cosmora telemetry. All planetary orbits are nominal, and 3 new deep space logs have been synced.
            </p>
          </div>

          {/* Live Explorer Status Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-xs font-mono">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <div>
                <span className="text-slate-400 text-[10px] block">DAILY STREAK</span>
                <span className="text-amber-300 font-bold">{MOCK_EXPLORER.streakDays} DAYS</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-400 text-[10px] block">RANK & EXP</span>
                <span className="text-cyan-300 font-bold">LVL {MOCK_EXPLORER.level} ({MOCK_EXPLORER.expPoints} XP)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Launcher Grid */}
        <div className="border-t border-white/10 pt-6">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-3">
            QUICK ACTION LAUNCHER
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/50 hover:bg-slate-800/80 transition-all duration-300 group shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                >
                  <div className="p-2 rounded-xl bg-slate-950 border border-white/10 group-hover:scale-110 transition-transform">
                    <Icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {action.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
