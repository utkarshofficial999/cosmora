"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { AuthBackgroundCanvas } from "./AuthBackgroundCanvas";
import { AuthFooter } from "./AuthFooter";
import { Rocket, Sparkles, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
  focusedBody?: "earth" | "deep-space" | "satellite" | "galaxy";
}

export function AuthLayout({ children, focusedBody = "earth" }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* 3D WebGL Space Background */}
      <AuthBackgroundCanvas focusedBody={focusedBody} />

      {/* Top Space Station Header Nav */}
      <header className="relative z-20 w-full px-6 lg:px-12 py-5 flex items-center justify-between border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(0,229,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.7)] transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Rocket className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-400">
              COSMORA
            </span>
            <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase -mt-1">
              AUTH TERMINAL v4.2
            </span>
          </div>
        </Link>

        {/* Quick Nav Links & Audio Telemetry Widget */}
        <div className="flex items-center gap-6 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-4 border-r border-white/10 pr-6 text-slate-400">
            <Link
              href="/login"
              className="hover:text-cyan-300 transition-colors"
            >
              LOGIN
            </Link>
            <Link
              href="/register"
              className="hover:text-cyan-300 transition-colors"
            >
              REGISTER
            </Link>
            <Link
              href="/welcome"
              className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-purple-300"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              ONBOARDING
            </Link>
          </div>

          {/* Telemetry Status Widget */}
          <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 px-3 py-1.5 rounded-full text-[11px] text-slate-300">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden md:inline text-slate-400">ATMOSPHERIC AUDIO:</span>
            <span className="text-cyan-300 font-semibold">ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 my-auto">
        {children}
      </main>

      {/* Futuristic Telemetry Footer */}
      <AuthFooter />
    </div>
  );
}
