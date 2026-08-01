"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { LucideIcon, Loader2 } from "lucide-react";
import { ReactNode } from "react";

export interface PrimaryButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  icon?: LucideIcon;
  isLoading?: boolean;
  variant?: "cosmic" | "cyan" | "purple" | "outline";
  fullWidth?: boolean;
}

export function PrimaryButton({
  children,
  icon: Icon,
  isLoading = false,
  variant = "cosmic",
  fullWidth = true,
  className = "",
  disabled,
  ...props
}: PrimaryButtonProps) {
  const variants = {
    cosmic:
      "bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] border border-white/20",
    cyan:
      "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.7)] border border-cyan-300/40",
    purple:
      "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_25px_rgba(147,51,234,0.4)] hover:shadow-[0_0_35px_rgba(147,51,234,0.7)] border border-purple-400/30",
    outline:
      "bg-slate-950/40 backdrop-blur-md border border-white/15 text-slate-200 hover:border-cyan-400/50 hover:bg-slate-900/60 hover:text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.015, y: disabled || isLoading ? 0 : -1 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={`relative group overflow-hidden rounded-xl py-3.5 px-6 font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 ${
        fullWidth ? "w-full" : "w-auto"
      } ${variants[variant]} ${
        disabled || isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      {...props}
    >
      {/* Shimmer Effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

      {/* Button Body Content */}
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          <span>{children}</span>
          {Icon && (
            <Icon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </>
      )}
    </motion.button>
  );
}
