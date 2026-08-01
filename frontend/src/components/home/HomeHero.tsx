"use client";

import { motion } from "framer-motion";
import { Play, Bookmark, Sparkles, Star, Clock } from "lucide-react";
import { MOCK_HOME_HERO } from "@/mocks/home";

export function HomeHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-[480px] sm:h-[520px] rounded-3xl overflow-hidden border border-white/15 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] group mb-10"
    >
      {/* Background Image with Cinematic Backdrop Gradients */}
      <img
        src={MOCK_HOME_HERO.imageUrl}
        alt={MOCK_HOME_HERO.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />

      {/* Hero Content Overlay */}
      <div className="relative z-10 h-full p-8 sm:p-12 flex flex-col justify-end max-w-3xl gap-4">
        {/* Category & Match Score Pill */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md">
            {MOCK_HOME_HERO.category}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 text-xs font-mono font-bold">
            {MOCK_HOME_HERO.matchScore}% MATCH FOR YOU
          </span>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-mono">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{MOCK_HOME_HERO.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none font-sans drop-shadow-lg">
          {MOCK_HOME_HERO.title}
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl line-clamp-3">
          {MOCK_HOME_HERO.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {MOCK_HOME_HERO.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-md bg-slate-900/80 text-[10px] font-mono text-slate-300 border border-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.7)] transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Watch / Read Story</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/80 border border-white/15 hover:border-cyan-400/50 text-slate-200 text-xs font-mono font-medium backdrop-blur-md transition-all hover:scale-105"
          >
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <span>Add to Library</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
