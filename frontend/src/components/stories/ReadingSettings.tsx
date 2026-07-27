"use client";

import { Type, Maximize2, Minimize2 } from "lucide-react";

interface ReadingSettingsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: "sans" | "serif" | "mono";
  setFontFamily: (font: "sans" | "serif" | "mono") => void;
  focusMode: boolean;
  setFocusMode: (focus: boolean) => void;
}

export function ReadingSettings({
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  focusMode,
  setFocusMode,
}: ReadingSettingsProps) {
  return (
    <div className="glass-panel rounded-2xl p-3 border border-white/10 flex items-center justify-between gap-4 mb-6 text-xs font-mono">
      {/* Font Size Adjuster */}
      <div className="flex items-center gap-2">
        <Type className="w-4 h-4 text-cyan-400" />
        <span className="text-slate-400">Size:</span>
        <button
          onClick={() => setFontSize(Math.max(14, fontSize - 2))}
          className="w-6 h-6 rounded glass-button text-slate-300 hover:text-white"
        >
          -
        </button>
        <span className="text-white font-bold px-1">{fontSize}px</span>
        <button
          onClick={() => setFontSize(Math.min(24, fontSize + 2))}
          className="w-6 h-6 rounded glass-button text-slate-300 hover:text-white"
        >
          +
        </button>
      </div>

      {/* Font Family Selector */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setFontFamily("sans")}
          className={`px-2 py-1 rounded transition-colors ${
            fontFamily === "sans" ? "bg-cyan-500/20 text-cyan-300 font-sans font-bold" : "text-slate-400"
          }`}
        >
          Sans
        </button>
        <button
          onClick={() => setFontFamily("serif")}
          className={`px-2 py-1 rounded transition-colors ${
            fontFamily === "serif" ? "bg-purple-500/20 text-purple-300 font-serif font-bold" : "text-slate-400"
          }`}
        >
          Serif
        </button>
        <button
          onClick={() => setFontFamily("mono")}
          className={`px-2 py-1 rounded transition-colors ${
            fontFamily === "mono" ? "bg-indigo-500/20 text-indigo-300 font-mono font-bold" : "text-slate-400"
          }`}
        >
          Mono
        </button>
      </div>

      {/* Focus Mode Toggle */}
      <button
        onClick={() => setFocusMode(!focusMode)}
        className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition-all ${
          focusMode ? "bg-cyan-500 text-slate-950 font-bold" : "glass-button text-slate-300"
        }`}
      >
        {focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        {focusMode ? "Exit Focus" : "Focus Mode"}
      </button>
    </div>
  );
}
