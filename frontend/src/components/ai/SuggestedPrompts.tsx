"use client";

import { Sparkles } from "lucide-react";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  const prompts = [
    "Tell me about Saturn ring structure.",
    "What happened during Apollo 11 descent?",
    "How does James Webb NIRCam detect deep infrared?",
    "Explain Artemis III lunar South Pole objectives.",
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
      <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
        <Sparkles className="w-3 h-3 text-purple-400" />
        Prompts:
      </span>
      {prompts.map((p, i) => (
        <button
          key={i}
          onClick={() => onSelectPrompt(p)}
          className="px-3 py-1 rounded-full text-[11px] font-mono glass-button text-slate-300 hover:text-white whitespace-nowrap border-white/10 hover:border-cyan-400/40 transition-all"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
