"use client";

import { Search, Mic, Filter } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export function SearchBar({
  value,
  onChange,
  selectedCategory,
  onCategoryChange,
}: SearchBarProps) {
  const categories = ["All", "Terrestrial", "Gas Giants", "Ice Giants", "Moons", "Asteroids"];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
        <input
          type="text"
          placeholder="Search planets, moons, asteroids, or missions... (Press /)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,229,255,0.25)] backdrop-blur-2xl transition-all"
        />
        <button
          type="button"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-400 transition-colors"
          title="Voice Search Ready"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-mono transition-all shrink-0 ${
              selectedCategory === cat
                ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_#00e5ff]"
                : "bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
