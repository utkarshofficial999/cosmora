"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Star, ArrowRight, Bookmark } from "lucide-react";

export default function StoriesPage() {
  const stories = [
    {
      id: "apollo-11-legacy",
      title: "Apollo 11: The First Footsteps",
      category: "Historical Missions",
      readTime: "8 min read",
      rating: "4.9",
      excerpt: "Relive Neil Armstrong and Buzz Aldrin's nerve-wracking descent in the Lunar Module Eagle to the Sea of Tranquility.",
    },
    {
      id: "james-webb-deep-space",
      title: "James Webb: Peering into Creation",
      category: "Modern Astrophysics",
      readTime: "12 min read",
      rating: "5.0",
      excerpt: "How the golden hexagonal mirrors of JWST unraveled the light of galaxies formed 13.5 billion years ago.",
    },
    {
      id: "mars-perseverance-rover",
      title: "Perseverance: Searching for Martian Life",
      category: "Planetary Science",
      readTime: "10 min read",
      rating: "4.8",
      excerpt: "Exploring Jezero Crater's ancient river delta and caching core rock samples for future sample return missions.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl glass-button text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide font-display">
              Space Story Universe
            </h1>
            <p className="text-xs text-slate-400">Narrative space exploration & historical milestones</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            All Stories
          </button>
          <button className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-button text-slate-400">
            Missions
          </button>
          <button className="px-3 py-1.5 rounded-xl text-xs font-semibold glass-button text-slate-400">
            Astrophysics
          </button>
        </div>
      </div>

      {/* Grid of Stories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map((s) => (
          <div
            key={s.id}
            className="group glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/10 hover:border-purple-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300">
                  {s.category}
                </span>
                <button className="text-slate-500 hover:text-yellow-400">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-xl font-bold text-white mb-2 font-display group-hover:text-purple-300 transition-colors">
                {s.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {s.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  {s.rating}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {s.excerpt}
              </p>
            </div>

            <Link
              href={`/stories/${s.id}`}
              className="w-full btn-gradient-purple py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 text-white shadow-lg shadow-purple-500/20 hover:scale-102 transition-transform"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Story Chapter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
