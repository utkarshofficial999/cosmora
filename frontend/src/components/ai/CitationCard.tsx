"use client";

import Link from "next/link";
import { Citation } from "@/services/aiService";
import { ExternalLink, Compass, Rocket, BookOpen } from "lucide-react";

interface CitationCardProps {
  citation: Citation;
}

export function CitationCard({ citation }: CitationCardProps) {
  const getIcon = () => {
    switch (citation.type) {
      case "Planet":
        return <Compass className="w-3.5 h-3.5 text-cyan-400" />;
      case "Mission":
        return <Rocket className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <Link
      href={citation.link}
      className="glass-panel p-3 rounded-2xl border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-400 flex items-center gap-1">
            {getIcon()}
            {citation.type}
          </span>
          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
        </div>

        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
          {citation.title}
        </h4>

        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-light">
          {citation.snippet}
        </p>
      </div>
    </Link>
  );
}
