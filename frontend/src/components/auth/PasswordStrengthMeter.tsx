"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password?: string;
  showDetails?: boolean;
}

export function PasswordStrengthMeter({
  password = "",
  showDetails = true,
}: PasswordStrengthMeterProps) {
  const criteria = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number (0-9)", met: /[0-9]/.test(password) },
    { label: "Special symbol", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = criteria.filter((c) => c.met).length;

  const getStrengthLabel = () => {
    if (password.length === 0) return { text: "Security Assessment", color: "text-slate-500" };
    if (score <= 1) return { text: "Weak Encryption", color: "text-red-400" };
    if (score <= 3) return { text: "Moderate Shielding", color: "text-amber-400" };
    if (score === 4) return { text: "High Security", color: "text-cyan-400" };
    return { text: "Quantum Grade Protection", color: "text-emerald-400" };
  };

  const strength = getStrengthLabel();

  return (
    <div className="flex flex-col gap-2 mt-1">
      {/* Strength Header */}
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider">
        <span className="text-slate-400">Password Strength</span>
        <span className={`font-semibold ${strength.color}`}>{strength.text}</span>
      </div>

      {/* 5-Segment Progress Bar */}
      <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full bg-slate-900/80 rounded-full p-0.5 border border-white/5">
        {[1, 2, 3, 4, 5].map((level) => {
          const isActive = score >= level;
          let barBg = "bg-slate-800";
          if (isActive) {
            if (score <= 1) barBg = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]";
            else if (score <= 3) barBg = "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]";
            else if (score === 4) barBg = "bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]";
            else barBg = "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]";
          }

          return (
            <motion.div
              key={level}
              className={`h-full rounded-full transition-all duration-300 ${barBg}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: level * 0.05 }}
            />
          );
        })}
      </div>

      {/* Criteria Breakdown */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
          {criteria.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[11px]">
              {item.met ? (
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <X className="w-3 h-3 text-slate-600 shrink-0" />
              )}
              <span className={item.met ? "text-slate-300" : "text-slate-500"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
