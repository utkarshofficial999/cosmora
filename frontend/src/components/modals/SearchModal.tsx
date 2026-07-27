"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, X, Compass, Rocket, BookOpen, Bot } from "lucide-react";

interface SearchResult {
  title: string;
  category: "Planet" | "Mission" | "Story" | "AI";
  href: string;
  snippet: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent state handler
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results: SearchResult[] = [
    {
      title: "Earth — 3rd Sol Planet",
      category: "Planet" as const,
      href: "/solar-system",
      snippet: "Radius 6,371km, mass 5.97x10²⁴kg, 1 moon.",
    },
    {
      title: "Artemis III Lunar Landing",
      category: "Mission" as const,
      href: "/missions",
      snippet: "NASA human flight to lunar South Pole.",
    },
    {
      title: "Apollo 11: The First Footsteps",
      category: "Story" as const,
      href: "/stories/apollo-11-legacy",
      snippet: "Neil Armstrong & Buzz Aldrin lunar descent.",
    },
    {
      title: "James Webb: Peering into Creation",
      category: "Story" as const,
      href: "/stories/james-webb-deep-space",
      snippet: "JWST 18 beryllium gold mirrors deep field.",
    },
    {
      title: "Cosmora 3D Hologram Assistant",
      category: "AI" as const,
      href: "/ai-assistant",
      snippet: "Ask AI grounded RAG space queries.",
    },
  ].filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.snippet.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search planets, missions, stories, or AI queries (Press Esc to close)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg glass-button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-none">
          {results.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 font-mono">
              No matching space records found for &quot;{query}&quot;
            </div>
          ) : (
            results.map((r, i) => (
              <Link
                key={i}
                href={r.href}
                onClick={onClose}
                className="block p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-400/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {r.title}
                  </h4>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-white/10">
                    {r.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono line-clamp-1">
                  {r.snippet}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
