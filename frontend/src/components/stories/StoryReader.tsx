"use client";

import { Chapter } from "@/services/storyService";
import { BookOpen } from "lucide-react";

interface StoryReaderProps {
  chapter: Chapter;
  fontSize: number;
  fontFamily: "sans" | "serif" | "mono";
}

export function StoryReader({ chapter, fontSize, fontFamily }: StoryReaderProps) {
  const fontClass =
    fontFamily === "serif"
      ? "font-serif"
      : fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  return (
    <article className="glass-panel rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl mb-8">
      {/* Chapter Number & Subtitle Header */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">
          Chapter {chapter.chapterNumber} • {chapter.readTimeMinutes} min read
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-white font-display mb-2">
          {chapter.title}
        </h2>
        <span className="text-xs md:text-sm text-slate-400 font-mono italic">
          {chapter.subtitle}
        </span>
      </div>

      {/* Paragraph Content */}
      <div
        style={{ fontSize: `${fontSize}px` }}
        className={`space-y-6 leading-relaxed text-slate-200 ${fontClass}`}
      >
        {chapter.content.map((paragraph, i) => (
          <p key={i} className="first-letter:text-4xl first-letter:font-bold first-letter:text-cyan-400 first-letter:mr-2 first-letter:float-left">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
