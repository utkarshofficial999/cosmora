"use client";

import Link from "next/link";
import { ArrowLeft, BarChart2, TrendingUp, Users, Activity, Eye, FileSpreadsheet } from "lucide-react";
import { exportAnalyticsCSV } from "@/utils/exportCsv";
import { showToast } from "@/components/ui/Toast";

export default function AnalyticsPage() {
  const handleExport = () => {
    exportAnalyticsCSV();
    showToast(
      "CSV Report Downloaded",
      "Executive telemetry report saved to your downloads folder.",
      "success"
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl glass-button text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide font-display">
              Platform Analytics & Data Insights
            </h1>
            <p className="text-xs text-slate-400">Real-time exploration telemetry & user engagements</p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="btn-gradient-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 text-white shadow-lg shadow-purple-500/20 hover:scale-102 transition-transform"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Report (CSV)
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">Active Explorers</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl font-bold text-white font-mono block mb-1">10,482</span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% this week
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">3D Orbit Views</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl font-bold text-white font-mono block mb-1">142,900</span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +22.8% this month
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">AI RAG Queries</span>
            <Activity className="w-4 h-4 text-yellow-400" />
          </div>
          <span className="text-2xl font-bold text-white font-mono block mb-1">38,120</span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.5% this week
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">Cache Hit Ratio</span>
            <BarChart2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-white font-mono block mb-1">98.5%</span>
          <span className="text-[10px] text-cyan-400 font-semibold">Redis Acceleration Active</span>
        </div>
      </div>
    </div>
  );
}
