"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Sparkles, Award, Flame, Orbit, Bot, ArrowRight } from "lucide-react";
import { MOCK_JOURNEY_STORIES, MOCK_ACHIEVEMENTS } from "@/mocks/dashboard";

export function MyJourneySection() {
  const iconMap: Record<string, any> = {
    Sparkles,
    Orbit,
    Bot,
    Flame,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
      {/* Continue Reading & Journey Stories (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <BookOpen className="w-4 h-4" />
            <span className="font-bold tracking-wider uppercase text-white">
              MY JOURNEY & CONTINUE READING
            </span>
          </div>
          <Link
            href="/stories"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_JOURNEY_STORIES.map((story) => (
            <motion.div
              key={story.id}
              whileHover={{ y: -3, scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl bg-slate-950/70 border border-white/10 p-4 backdrop-blur-xl flex flex-col justify-between group shadow-[0_8px_25px_rgba(0,0,0,0.5)]"
            >
              <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                  {story.category}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                  {story.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  {story.remainingMinutes} min left • {story.readCount}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 pt-2 border-t border-white/10">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>PROGRESS</span>
                  <span className="text-cyan-300 font-bold">{story.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,229,255,0.6)]"
                    style={{ width: `${story.progressPercent}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements Badges (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
            <Award className="w-4 h-4" />
            <span className="font-bold tracking-wider uppercase text-white">ACHIEVEMENTS</span>
          </div>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-500/30">
            4 UNLOCKED
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MOCK_ACHIEVEMENTS.map((ach) => {
            const IconComp = iconMap[ach.iconName] || Award;

            return (
              <div
                key={ach.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-purple-500/30 backdrop-blur-xl flex flex-col gap-2 hover:border-purple-400 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/30 group-hover:scale-110 transition-transform">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-purple-300 border border-white/10">
                    {ach.rarity}
                  </span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">{ach.title}</h5>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
