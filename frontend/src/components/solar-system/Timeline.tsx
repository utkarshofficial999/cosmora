"use client";

import { motion } from "framer-motion";
import { Clock, Rocket, Flag } from "lucide-react";

interface TimelineEvent {
  year: string;
  mission: string;
  agency: string;
  target: string;
  desc: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  { year: "1969", mission: "Apollo 11", agency: "NASA", target: "Moon", desc: "First human landing on Moon." },
  { year: "1977", mission: "Voyager 1 & 2", agency: "NASA", target: "Outer Planets", desc: "Grand tour of gas giants." },
  { year: "1997", mission: "Cassini-Huygens", agency: "NASA/ESA", target: "Saturn & Titan", desc: "Explored Saturn rings and Titan surface." },
  { year: "2013", mission: "Mangalyaan (MOM)", agency: "ISRO", target: "Mars", desc: "India reached Martian orbit on first attempt." },
  { year: "2020", mission: "Perseverance Rover", agency: "NASA", target: "Mars Jezero", desc: "Collecting core samples for Earth return." },
  { year: "2023", mission: "Chandrayaan-3", agency: "ISRO", target: "Lunar South Pole", desc: "Historic landing near Moon South Pole." },
  { year: "2026", mission: "Artemis III", agency: "NASA", target: "Moon Crewed", desc: "First crewed landing at Moon South Pole." },
];

export function Timeline() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
        <Clock className="w-4 h-4" />
        <span className="font-bold tracking-wider uppercase text-white">
          SOLAR SYSTEM EXPLORATION TIMELINE
        </span>
      </div>

      <div className="relative flex items-center gap-4 overflow-x-auto scrollbar-none py-4 px-1">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-0" />

        {TIMELINE_EVENTS.map((event, idx) => (
          <motion.div
            key={event.mission}
            whileHover={{ y: -4, scale: 1.03 }}
            className="relative z-10 shrink-0 w-64 p-4 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl flex flex-col gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:border-cyan-400/50"
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30">
                {event.year}
              </span>
              <span className="text-[10px] text-slate-400">{event.agency}</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Rocket className="w-4 h-4 text-cyan-400 shrink-0" />
              <h4 className="text-xs font-bold text-white leading-tight">{event.mission}</h4>
            </div>

            <span className="text-[10px] font-mono text-purple-300">TARGET: {event.target}</span>
            <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{event.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
