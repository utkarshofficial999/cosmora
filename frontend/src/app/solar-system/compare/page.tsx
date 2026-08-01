"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Scale, Orbit, Sparkles } from "lucide-react";
import { ComparisonCard } from "@/components/solar-system/ComparisonCard";
import { MOCK_COMPARISONS } from "@/mocks/solar-system/comparison";

export default function ComparePage() {
  const [selectedPairKey, setSelectedPairKey] = useState<string>("earth-vs-mars");
  const pair = MOCK_COMPARISONS[selectedPairKey] || MOCK_COMPARISONS["earth-vs-mars"];

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/solar-system"
            className="p-3 rounded-2xl bg-slate-900 border border-white/15 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-sans">
              Space Object Comparison
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Side-by-side telemetry analysis of planetary scale, mass, and habitability.
            </p>
          </div>
        </div>

        {/* Pair Selector Dropdown */}
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-cyan-400" />
          <select
            value={selectedPairKey}
            onChange={(e) => setSelectedPairKey(e.target.value)}
            className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl px-4 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 backdrop-blur-xl cursor-pointer"
          >
            <option value="earth-vs-mars">Earth vs Mars</option>
            <option value="jupiter-vs-saturn">Jupiter vs Saturn</option>
            <option value="moon-vs-europa">The Moon vs Europa</option>
          </select>
        </div>
      </div>

      {/* Main Comparison Component Card */}
      <ComparisonCard pair={pair} />
    </div>
  );
}
