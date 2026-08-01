"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-[#030712]/70 backdrop-blur-md flex items-start justify-center pt-[14vh]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[min(600px,92vw)] rounded-2xl bg-[#08111F]/95 border border-white/14 overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] text-white"
      >
        <div className="flex items-center gap-3 p-[18px_22px] border-b border-white/10">
          <Search className="w-5 h-5 text-[#4DA8FF]" />
          <input
            autoFocus
            placeholder="Search planets, missions, stories…"
            className="flex-1 bg-transparent border-none outline-none text-white text-base font-sans"
          />
          <kbd className="text-xs text-white/40 border border-white/15 rounded-md px-1.5 py-0.5">
            ESC
          </kbd>
        </div>
        <div className="p-3">
          <div className="text-[11px] tracking-[2px] text-white/40 p-[8px_12px] uppercase font-mono">
            QUICK JUMP
          </div>
          <Link
            href="/solar-system"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-[#4DA8FF]/12 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#4DA8FF]" />
            Interactive Solar System
          </Link>
          <Link
            href="/missions"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-[#4DA8FF]/12 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF7B54]" />
            Live Mission Control
          </Link>
          <Link
            href="/ai-assistant"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-[#4DA8FF]/12 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
            AI Space Assistant (Nova)
          </Link>
          <Link
            href="/stories"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-[#4DA8FF]/12 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            Immersive Stories & Narratives
          </Link>
        </div>
      </div>
    </div>
  );
}
