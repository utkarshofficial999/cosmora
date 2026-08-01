"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Compass, ShieldAlert, Sparkles, Orbit, Clock } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GlassCard } from "@/components/auth/GlassCard";
import { AnimatedInput } from "@/components/auth/AnimatedInput";
import { PasswordField } from "@/components/auth/PasswordField";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { SocialButton } from "@/components/auth/SocialButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/welcome");
    }, 1200);
  };

  return (
    <AuthLayout focusedBody="earth">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Glass Auth Panel */}
        <div className="lg:col-span-6 xl:col-span-5 w-full">
          <GlassCard glowColor="cyan" className="p-8 sm:p-10">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono w-fit">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                <span>EXPLORER GATEWAY</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                Welcome Back
              </h1>
              <p className="text-sm text-slate-400">
                Authenticate your mission credentials to access the Cosmora universe.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <AnimatedInput
                label="Explorer Email"
                icon={Mail}
                type="email"
                placeholder="commander@cosmora.space"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <label className="flex items-center gap-2 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-white/20 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember Session</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline underline-offset-4 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <PrimaryButton
                type="submit"
                icon={ArrowRight}
                isLoading={isLoading}
                variant="cosmic"
                className="mt-2"
              >
                Initiate Launch & Login
              </PrimaryButton>
            </form>

            {/* Social Auth Divider */}
            <div className="relative my-7 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-slate-950/80 text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                OR CONNECT VIA OAUTH
              </span>
            </div>

            {/* Social Buttons */}
            <div className="flex items-center gap-3">
              <SocialButton
                provider="google"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => router.push("/welcome"), 1000);
                }}
              />
              <SocialButton
                provider="github"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => router.push("/welcome"), 1000);
                }}
              />
            </div>

            {/* Footer Link */}
            <div className="mt-8 text-center text-xs text-slate-400">
              New explorer to the space program?{" "}
              <Link
                href="/register"
                className="text-cyan-400 font-semibold hover:text-cyan-300 underline underline-offset-4 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: 3D Mission Showcase & Quote */}
        <div className="lg:col-span-6 xl:col-span-7 hidden lg:flex flex-col gap-6 pl-6">
          {/* Mission Countdown Widget */}
          <GlassCard glowColor="purple" className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                    NEXT DEEP SPACE MISSION
                  </h3>
                  <p className="text-xs text-slate-400">Orion Nebula Expedition #84</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  T-MINUS 04:18:22
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
                  ● LAUNCH PADS READY
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Featured Atmospheric Telemetry Quote Card */}
          <GlassCard glowColor="cyan" className="p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Orbit className="w-40 h-40 text-cyan-400" />
            </div>

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Cosmora Cosmic Log #01</span>
              </div>

              <blockquote className="text-xl sm:text-2xl font-extralight italic text-slate-100 leading-relaxed font-sans">
                &ldquo;Your journey through the universe begins here. Explore infinite star systems, uncover cosmic mysteries, and pioneer deep space.&rdquo;
              </blockquote>

              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-400/40 flex items-center justify-center font-mono font-bold text-cyan-300 text-xs">
                    C42
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Commander Alex Vance</div>
                    <div className="text-[11px] text-slate-400">Deep Space Mission Lead</div>
                  </div>
                </div>

                <div className="text-xs font-mono text-cyan-400/80 bg-slate-900/60 px-3 py-1 rounded-full border border-cyan-500/20">
                  ORBITAL POSITION: 400KM
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </AuthLayout>
  );
}
