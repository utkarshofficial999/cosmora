"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "blue" | "orange";
  intensity?: "normal" | "high";
}

export function GlassCard({
  children,
  className = "",
  glowColor = "cyan",
  intensity = "normal",
}: GlassCardProps) {
  const glowStyles = {
    cyan: "hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(0,229,255,0.15)]",
    purple: "hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
    blue: "hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(77,168,255,0.15)]",
    orange: "hover:border-orange-500/40 hover:shadow-[0_0_40px_rgba(255,123,84,0.15)]",
  };

  const glowOrb = {
    cyan: "from-cyan-500/10 via-sky-500/5 to-transparent",
    purple: "from-purple-500/10 via-indigo-500/5 to-transparent",
    blue: "from-blue-500/10 via-cyan-500/5 to-transparent",
    orange: "from-orange-500/10 via-amber-500/5 to-transparent",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-slate-950/65 border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-500 ${
        glowStyles[glowColor]
      } ${className}`}
    >
      {/* Top Edge Ambient Highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      {/* Atmospheric Ambient Glow Orb */}
      <div
        className={`absolute -top-24 -left-24 w-72 h-72 rounded-full bg-radial ${glowOrb[glowColor]} blur-3xl pointer-events-none opacity-60`}
      />

      {/* Space Mesh Grid Subtle Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
