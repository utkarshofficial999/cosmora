"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  subtitle?: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export function ProgressStepper({
  steps,
  currentStep,
  onStepClick,
}: ProgressStepperProps) {
  return (
    <div className="w-full flex items-center justify-between relative px-2 py-4">
      {/* Background Connecting Line */}
      <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-800 -translate-y-1/2 -z-0" />

      {/* Active Connecting Line Fill */}
      <motion.div
        className="absolute top-1/2 left-8 h-0.5 bg-gradient-to-r from-sky-400 to-cyan-400 -translate-y-1/2 -z-0 shadow-[0_0_10px_rgba(0,229,255,0.5)]"
        initial={{ width: "0%" }}
        animate={{
          width: `${((currentStep - 1) / Math.max(steps.length - 1, 1)) * 100}%`,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />

      {steps.map((step) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;

        return (
          <div
            key={step.id}
            onClick={() => isCompleted && onStepClick?.(step.id)}
            className={`relative z-10 flex flex-col items-center group ${
              isCompleted ? "cursor-pointer" : "cursor-default"
            }`}
          >
            {/* Step Circle Node */}
            <motion.div
              initial={false}
              animate={{
                scale: isCurrent ? 1.15 : 1,
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                isCompleted
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  : isCurrent
                  ? "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 border-2 border-white shadow-[0_0_20px_rgba(0,229,255,0.7)]"
                  : "bg-slate-900 border border-white/15 text-slate-500"
              }`}
            >
              {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
            </motion.div>

            {/* Step Label */}
            <span
              className={`mt-2 text-[11px] font-medium tracking-wider uppercase transition-colors duration-200 ${
                isCurrent
                  ? "text-cyan-300 font-semibold"
                  : isCompleted
                  ? "text-slate-300"
                  : "text-slate-500"
              }`}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
