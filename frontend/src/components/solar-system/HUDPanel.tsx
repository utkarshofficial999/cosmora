"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HUDPanelProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "amber" | "emerald";
}

export function HUDPanel({ children, className = "", glowColor = "cyan" }: HUDPanelProps) {
  const glowStyles = {
    cyan: "border-cyan-500/40 shadow-[0_0_35px_rgba(0,229,255,0.15)]",
    purple: "border-purple-500/40 shadow-[0_0_35px_rgba(168,85,247,0.15)]",
    amber: "border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.15)]",
    emerald: "border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.15)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl bg-slate-950/75 border backdrop-blur-2xl p-6 transition-all duration-300 ${glowStyles[glowColor]} ${className}`}
    >
      {/* Sci-Fi Corner Accents */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-md pointer-events-none" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-md pointer-events-none" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl-md pointer-events-none" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-md pointer-events-none" />

      {/* Grid Scanline Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
