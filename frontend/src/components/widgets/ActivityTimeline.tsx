"use client";

import { Activity, BookCheck, Award, Bot, Rocket } from "lucide-react";
import { MOCK_TIMELINE } from "@/mocks/dashboard";

export function ActivityTimeline() {
  const getIcon = (type: string) => {
    switch (type) {
      case "story_completed":
        return <BookCheck className="w-4 h-4 text-cyan-400" />;
      case "achievement_unlocked":
        return <Award className="w-4 h-4 text-purple-400" />;
      case "ai_chat":
        return <Bot className="w-4 h-4 text-emerald-400" />;
      case "mission_joined":
        return <Rocket className="w-4 h-4 text-sky-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950/70 border border-white/10 p-6 backdrop-blur-2xl my-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Activity className="w-4 h-4" />
          <span className="font-bold tracking-wider uppercase text-white">
            RECENT ACTIVITY TIMELINE
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">LIVE FEED</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
        {MOCK_TIMELINE.map((item) => (
          <div key={item.id} className="relative flex items-start justify-between gap-4">
            <div className="absolute -left-6 top-1 p-1 rounded-full bg-slate-950 border border-white/20">
              {getIcon(item.type)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{item.title}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
            </div>

            <span className="text-[10px] font-mono text-slate-500 shrink-0">{item.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
