"use client";

import Link from "next/link";
import { ArrowLeft, Rocket, Compass, Bot } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-16 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
      {/* 404 Badge */}
      <div className="glass-panel px-4 py-1.5 rounded-full border border-purple-500/30 text-purple-300 font-mono text-xs mb-6 shadow-lg shadow-purple-500/20">
        ● Signal Lost • Error 404
      </div>

      <h1 className="text-6xl md:text-8xl font-black text-white font-display tracking-tight mb-4 text-gradient-purple-cyan">
        404
      </h1>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        You&apos;ve Drifted Into Deep Space Void
      </h2>

      <p className="text-slate-400 text-sm max-w-lg mb-8 leading-relaxed font-light">
        The celestial coordinate or page vector you requested could not be located in Cosmora RAG telemetry database.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="btn-gradient-primary px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 text-white shadow-xl shadow-purple-500/30"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Sol System
        </Link>

        <Link
          href="/solar-system"
          className="glass-button px-5 py-3 rounded-2xl text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          Explore 3D Solar System
        </Link>

        <Link
          href="/ai-assistant"
          className="glass-button px-5 py-3 rounded-2xl text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2"
        >
          <Bot className="w-4 h-4 text-yellow-300" />
          Ask AI Assistant
        </Link>
      </div>
    </div>
  );
}
