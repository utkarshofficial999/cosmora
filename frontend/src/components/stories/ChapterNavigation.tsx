"use client";

import { Chapter } from "@/services/storyService";
import { ArrowLeft, ArrowRight, List } from "lucide-react";

interface ChapterNavigationProps {
  chapters: Chapter[];
  currentChapterIndex: number;
  onSelectChapterIndex: (index: number) => void;
}

export function ChapterNavigation({
  chapters,
  currentChapterIndex,
  onSelectChapterIndex,
}: ChapterNavigationProps) {
  const hasPrev = currentChapterIndex > 0;
  const hasNext = currentChapterIndex < chapters.length - 1;

  return (
    <div className="glass-panel rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-4 mb-8">
      <button
        disabled={!hasPrev}
        onClick={() => hasPrev && onSelectChapterIndex(currentChapterIndex - 1)}
        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
          hasPrev
            ? "glass-button text-white hover:border-cyan-400/50"
            : "opacity-40 cursor-not-allowed text-slate-500"
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Previous Chapter
      </button>

      <span className="text-xs font-mono text-cyan-400 font-bold">
        Chapter {currentChapterIndex + 1} of {chapters.length}
      </span>

      <button
        disabled={!hasNext}
        onClick={() => hasNext && onSelectChapterIndex(currentChapterIndex + 1)}
        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
          hasNext
            ? "btn-gradient-primary text-white"
            : "opacity-40 cursor-not-allowed text-slate-500"
        }`}
      >
        Next Chapter
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
