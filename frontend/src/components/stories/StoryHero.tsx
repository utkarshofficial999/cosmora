"use client";

import { StoryDetail } from "@/services/storyService";
import { Clock, Star, Eye, User, Sparkles, BookOpen } from "lucide-react";

interface StoryHeroProps {
  story: StoryDetail;
}

export function StoryHero({ story }: StoryHeroProps) {
  return (
    <div className="glass-panel rounded-3xl p-8 border border-white/10 mb-8 relative overflow-hidden shadow-2xl">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Category & Metadata Badges */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          {story.category}
        </span>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-cyan-300 font-mono">
          Difficulty: {story.difficulty}
        </span>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-emerald-300 font-mono flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          {story.readTime}
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl md:text-5xl font-black text-white font-display leading-tight mb-4 tracking-tight">
        {story.title}
      </h1>

      {/* Summary */}
      <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed mb-6 font-light">
        {story.summary}
      </p>

      {/* Author & Telemetry Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            <User className="w-4 h-4" />
          </div>
          <div>
            <span className="block font-bold text-white">{story.author}</span>
            <span className="text-[10px] text-slate-500">Published {story.publishedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-yellow-400" />
            {story.rating} Rating
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <Eye className="w-4 h-4 text-cyan-400" />
            {story.views.toLocaleString()} Reads
          </span>
        </div>
      </div>
    </div>
  );
}
