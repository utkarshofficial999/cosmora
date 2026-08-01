"use client";

import { motion } from "framer-motion";
import { ComparisonPair } from "@/mocks/solar-system/comparison";

interface ComparisonCardProps {
  pair: ComparisonPair;
}

export function ComparisonCard({ pair }: ComparisonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/40 backdrop-blur-2xl flex flex-col gap-6 shadow-[0_15px_40px_rgba(0,229,255,0.15)] font-sans"
    >
      {/* Header Comparison Titles */}
      <div className="grid grid-cols-2 gap-4 text-center border-b border-white/10 pb-4">
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
          <h3 className="text-xl font-bold text-cyan-300">{pair.bodyA}</h3>
          <span className="text-[10px] text-slate-400 font-mono">OBJECT A</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-purple-500/30">
          <h3 className="text-xl font-bold text-purple-300">{pair.bodyB}</h3>
          <span className="text-[10px] text-slate-400 font-mono">OBJECT B</span>
        </div>
      </div>

      {/* Summary Note */}
      <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/50 p-4 rounded-2xl border border-white/5">
        {pair.summary}
      </p>

      {/* Detailed Comparative Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex justify-between items-center">
          <span className="text-slate-400 text-[11px]">RADIUS RATIO</span>
          <span className="text-cyan-300 font-bold">{pair.metrics.radiusRatio}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex justify-between items-center">
          <span className="text-slate-400 text-[11px]">MASS RATIO</span>
          <span className="text-cyan-300 font-bold">{pair.metrics.massRatio}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex justify-between items-center">
          <span className="text-slate-400 text-[11px]">GRAVITY RATIO</span>
          <span className="text-cyan-300 font-bold">{pair.metrics.gravityRatio}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex justify-between items-center">
          <span className="text-slate-400 text-[11px]">TEMP DIFFERENCE</span>
          <span className="text-cyan-300 font-bold">{pair.metrics.tempDelta}</span>
        </div>
      </div>

      {/* Habitability Score Comparison Bars */}
      <div className="space-y-3 border-t border-white/10 pt-4">
        <span className="text-[11px] font-mono text-slate-400 uppercase">
          HABITABILITY INDEX COMPARISON
        </span>

        <div>
          <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
            <span>{pair.bodyA} Habitability Score</span>
            <span className="text-cyan-300 font-bold">{pair.metrics.habitabilityScoreA}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-cyan-400 rounded-full shadow-[0_0_10px_#00e5ff]"
              style={{ width: `${pair.metrics.habitabilityScoreA}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
            <span>{pair.bodyB} Habitability Score</span>
            <span className="text-purple-300 font-bold">{pair.metrics.habitabilityScoreB}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-purple-400 rounded-full shadow-[0_0_10px_#c084fc]"
              style={{ width: `${pair.metrics.habitabilityScoreB}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
