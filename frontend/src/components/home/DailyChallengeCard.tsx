"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, CheckCircle2, XCircle, Award, Sparkles } from "lucide-react";
import { MOCK_DAILY_QUIZ } from "@/mocks/home";

export function DailyChallengeCard() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelectedIdx(idx);
    setSubmitted(true);
  };

  const isCorrect = selectedIdx === MOCK_DAILY_QUIZ.correctIndex;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950/70 border border-cyan-500/40 p-6 sm:p-8 backdrop-blur-2xl my-8 shadow-[0_15px_40px_rgba(0,229,255,0.15)]">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-400">
          <HelpCircle className="w-5 h-5 animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-white">
            DAILY SPACE QUIZ CHALLENGE
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>+{MOCK_DAILY_QUIZ.points} EXP POINTS</span>
        </div>
      </div>

      <div className="max-w-2xl">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-6 font-sans">
          {MOCK_DAILY_QUIZ.question}
        </h3>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {MOCK_DAILY_QUIZ.options.map((option, idx) => {
            let optionStyle = "bg-slate-900/80 border-white/10 text-slate-300 hover:border-white/20";
            if (submitted) {
              if (idx === MOCK_DAILY_QUIZ.correctIndex) {
                optionStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
              } else if (idx === selectedIdx) {
                optionStyle = "bg-red-950/80 border-red-500 text-red-300";
              } else {
                optionStyle = "bg-slate-950/40 border-white/5 text-slate-600 opacity-50";
              }
            }

            return (
              <button
                key={option}
                type="button"
                disabled={submitted}
                onClick={() => handleSelect(idx)}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between text-xs font-mono font-semibold transition-all duration-300 ${optionStyle}`}
              >
                <span>{option}</span>
                {submitted && idx === MOCK_DAILY_QUIZ.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {submitted && idx === selectedIdx && idx !== MOCK_DAILY_QUIZ.correctIndex && (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Alert */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border text-xs font-mono leading-relaxed ${
                isCorrect
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                  : "bg-slate-900/80 border-white/10 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>{isCorrect ? "CORRECT ANSWER! +250 EXP ADDED" : "EXPLORATION EXPLANATION"}</span>
              </div>
              <p className="text-slate-400 font-sans text-xs">{MOCK_DAILY_QUIZ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
