"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-white/8 bg-[#08111F]/60 backdrop-blur-md text-slate-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-full bg-[conic-gradient(from_180deg,#4DA8FF,#8B5CF6,#00E5FF,#4DA8FF)] inline-block shadow-[0_0_20px_rgba(77,168,255,0.6)]" />
            <span className="font-['Space_Grotesk'] font-bold text-xl text-white tracking-wide">
              COSMORA
            </span>
          </div>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
            The world&apos;s first story-driven space exploration platform. Past, present and future — in one universe.
          </p>
        </div>

        <div>
          <div className="font-['Space_Grotesk'] font-semibold mb-4 text-sm text-white uppercase tracking-wider">
            Explore
          </div>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/solar-system" className="text-slate-400 hover:text-[#4DA8FF] transition-colors">
              Solar System
            </Link>
            <Link href="/missions" className="text-slate-400 hover:text-[#4DA8FF] transition-colors">
              Missions
            </Link>
            <Link href="/stories" className="text-slate-400 hover:text-[#4DA8FF] transition-colors">
              Stories
            </Link>
            <Link href="/analytics" className="text-slate-400 hover:text-[#4DA8FF] transition-colors">
              Analytics & Timeline
            </Link>
          </div>
        </div>

        <div>
          <div className="font-['Space_Grotesk'] font-semibold mb-4 text-sm text-white uppercase tracking-wider">
            Platform
          </div>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/ai-assistant" className="text-slate-400 hover:text-[#4DA8FF] transition-colors">
              AI Assistant (Nova)
            </Link>
            <Link href="/pricing" className="text-slate-400 hover:text-[#4DA8FF] transition-colors">
              Pricing & Tiers
            </Link>
            <Link href="/about" className="text-slate-400 hover:text-[#4DA8FF] transition-colors">
              About Cosmora
            </Link>
            <Link href="/contact" className="text-slate-400 hover:text-[#4DA8FF] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        <div>
          <div className="font-['Space_Grotesk'] font-semibold mb-4 text-sm text-white uppercase tracking-wider">
            Connect
          </div>
          <div className="flex flex-col gap-2.5 text-sm">
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#00E5FF] transition-colors">
              Discord Community
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#00E5FF] transition-colors">
              GitHub Repository
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#00E5FF] transition-colors">
              Twitter / X
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 border-t border-white/6 flex flex-col md:flex-row justify-between items-center gap-3 text-slate-500 text-xs">
        <span>© 2026 Cosmora. All systems nominal.</span>
        <span>Made for explorers of Earth and beyond.</span>
      </div>
    </footer>
  );
}
