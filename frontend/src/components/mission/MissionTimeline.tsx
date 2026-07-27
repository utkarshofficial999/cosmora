"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { MissionMilestone } from "@/services/missionService";

interface MissionTimelineProps {
  milestones: MissionMilestone[];
}

export function MissionTimeline({ milestones }: MissionTimelineProps) {
  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white font-display">
            Mission Telemetry Timeline & Milestones
          </h3>
          <span className="text-xs text-slate-400">Sequential flight phase progression</span>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
          ● Active Sequence
        </span>
      </div>

      <div className="space-y-4">
        {milestones.map((m, index) => (
          <div
            key={m.id}
            className={`flex items-start gap-4 p-3.5 rounded-2xl border transition-all ${
              m.completed
                ? "bg-slate-900/60 border-cyan-500/30 text-white"
                : "bg-slate-950/40 border-white/5 text-slate-400"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {m.completed ? (
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white">
                  {index + 1}. {m.title}
                </span>
                <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {m.timestamp}
                </span>
              </div>

              <span className="text-[10px] font-semibold font-mono text-purple-400 uppercase tracking-widest block mb-1">
                Phase: {m.stage}
              </span>

              <p className="text-xs text-slate-300 leading-relaxed">
                {m.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
