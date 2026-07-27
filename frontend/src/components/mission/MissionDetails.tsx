"use client";

import Link from "next/link";
import { SpaceMission } from "@/services/missionService";
import { Users, Target, Activity, Compass, BookOpen, Bot, ShieldCheck } from "lucide-react";

interface MissionDetailsProps {
  mission: SpaceMission;
}

export function MissionDetails({ mission }: MissionDetailsProps) {
  return (
    <aside className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
      <div>
        {/* Title & Agency */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
            {mission.agency} • {mission.type}
          </span>
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            Verified
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 font-display">
          {mission.name}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">
          {mission.description}
        </p>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-6">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-400 block mb-0.5">Velocity</span>
            <span className="font-bold text-cyan-400">{mission.telemetrySpeed}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-400 block mb-0.5">Distance</span>
            <span className="font-bold text-indigo-400">{mission.distanceFromEarth}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-400 block mb-0.5">Destination</span>
            <span className="font-bold text-purple-400">{mission.target}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5">
            <span className="text-[10px] text-slate-400 block mb-0.5">Duration</span>
            <span className="font-bold text-yellow-400">{mission.duration}</span>
          </div>
        </div>

        {/* Flight Crew */}
        <div className="mb-6">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2 mb-2 font-mono">
            <Users className="w-4 h-4 text-cyan-400" />
            Flight Crew
          </span>
          <div className="space-y-1.5">
            {mission.crew.map((member, i) => (
              <div
                key={i}
                className="text-xs text-slate-200 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {member}
              </div>
            ))}
          </div>
        </div>

        {/* Objectives */}
        <div className="mb-6">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2 mb-2 font-mono">
            <Target className="w-4 h-4 text-indigo-400" />
            Core Objectives
          </span>
          <ul className="space-y-1.5">
            {mission.objectives.map((obj, i) => (
              <li
                key={i}
                className="text-xs text-slate-300 leading-normal flex items-start gap-2"
              >
                <span className="text-cyan-400 font-bold">•</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/stories"
            className="glass-button py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 text-slate-200 hover:text-white"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            View Story
          </Link>
          <Link
            href="/solar-system"
            className="glass-button py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 text-slate-200 hover:text-white"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Destination
          </Link>
        </div>

        <Link
          href="/ai-assistant"
          className="w-full btn-gradient-purple py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"
        >
          <Bot className="w-4 h-4 text-yellow-300" />
          Ask AI About {mission.name}
        </Link>
      </div>
    </aside>
  );
}
