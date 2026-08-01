"use client";

import React, { useState, InputHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  success?: boolean;
}

export function AnimatedInput({
  label,
  icon: Icon,
  error,
  success,
  type = "text",
  value,
  onChange,
  className = "",
  placeholder,
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  return (
    <div className={`relative flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-300 px-1">
        <label className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-slate-400 font-semibold">
          {label}
        </label>
        {error && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-red-400 text-[11px] font-normal tracking-normal flex items-center gap-1"
          >
            ● {error}
          </motion.span>
        )}
      </div>

      {/* Input Outer Container with Animated Border Glow */}
      <div
        className={`relative flex items-center rounded-xl transition-all duration-300 ${
          error
            ? "border border-red-500/50 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            : success
            ? "border border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            : isFocused
            ? "border border-cyan-400/80 bg-slate-900/80 shadow-[0_0_20px_rgba(0,229,255,0.25)]"
            : "border border-white/10 bg-slate-950/50 hover:border-white/20"
        }`}
      >
        {/* Sci-Fi Corner Accents on Focus */}
        {isFocused && (
          <>
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm pointer-events-none" />
            <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm pointer-events-none" />
            <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400 rounded-bl-sm pointer-events-none" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400 rounded-br-sm pointer-events-none" />
          </>
        )}

        {/* Prefix Icon */}
        {Icon && (
          <div className="pl-3.5 text-slate-400 transition-colors duration-200">
            <Icon className={`w-4 h-4 ${isFocused ? "text-cyan-400" : "text-slate-400"}`} />
          </div>
        )}

        {/* Input Control */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3.5 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          {...props}
        />
      </div>
    </div>
  );
}
