"use client";

import { motion } from "framer-motion";
import { BarChart3, Clock, BookOpen, Globe2, Rocket, Award, TrendingUp } from "lucide-react";
import { MOCK_TELEMETRY } from "@/mocks/dashboard";

export function AnalyticsSection() {
  const maxWeeklyHours = Math.max(...MOCK_TELEMETRY.weeklyProgress.map((w) => w.hours));

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl my-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-bold tracking-wider uppercase">
            EXPLORER TELEMETRY & ANALYTICS
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
          <TrendingUp className="w-4 h-4" />
          <span>+24.5% THIS WEEK</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Stat Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-col justify-between">
            <Clock className="w-5 h-5 text-cyan-400 mb-2" />
            <div>
              <span className="text-2xl font-bold text-white font-mono">
                {MOCK_TELEMETRY.readingHours}h
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">READING TIME</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex flex-col justify-between">
            <BookOpen className="w-5 h-5 text-purple-400 mb-2" />
            <div>
              <span className="text-2xl font-bold text-white font-mono">
                {MOCK_TELEMETRY.storiesCompleted}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">STORIES READ</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-sky-500/30 flex flex-col justify-between">
            <Globe2 className="w-5 h-5 text-sky-400 mb-2" />
            <div>
              <span className="text-2xl font-bold text-white font-mono">
                {MOCK_TELEMETRY.planetsExplored}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">PLANETS VISITED</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex flex-col justify-between">
            <Rocket className="w-5 h-5 text-emerald-400 mb-2" />
            <div>
              <span className="text-2xl font-bold text-white font-mono">
                {MOCK_TELEMETRY.missionsCompleted}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">MISSIONS DONE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Progress Bar Chart & Circular Progress */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
          {/* SVG Circular Progress Ring */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                className="text-cyan-400"
                strokeDasharray={`${MOCK_TELEMETRY.learningProgressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${MOCK_TELEMETRY.learningProgressPercent}, 100` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center font-mono">
              <span className="text-xl font-bold text-white">
                {MOCK_TELEMETRY.learningProgressPercent}%
              </span>
              <span className="text-[8px] text-slate-400 uppercase">LEVEL MASTERY</span>
            </div>
          </div>

          {/* Weekly Progress Bar Graph */}
          <div className="flex-1 w-full flex flex-col gap-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              WEEKLY ACTIVITY HOURS
            </span>
            <div className="flex items-end justify-between gap-1.5 h-20 pt-2 border-b border-white/10">
              {MOCK_TELEMETRY.weeklyProgress.map((item) => {
                const heightPercent = (item.hours / maxWeeklyHours) * 100;
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1 group">
                    <motion.div
                      className="w-full bg-gradient-to-t from-sky-500 to-cyan-400 rounded-t-md group-hover:from-purple-500 group-hover:to-cyan-300 transition-colors shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.8 }}
                    />
                    <span className="text-[9px] font-mono text-slate-400">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
