"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Radio, ArrowRight, ArrowLeft, Satellite } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GlassCard } from "@/components/auth/GlassCard";
import { AnimatedInput } from "@/components/auth/AnimatedInput";
import { PrimaryButton } from "@/components/auth/PrimaryButton";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
      setTimeout(() => {
        router.push("/verify-otp");
      }, 1200);
    }, 1000);
  };

  return (
    <AuthLayout focusedBody="satellite">
      <div className="w-full max-w-md my-auto">
        <GlassCard glowColor="cyan" className="p-8 sm:p-10 text-center relative overflow-hidden">
          {/* Radar Transmission Signal Visual Accent */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-75" />
            <div className="absolute inset-2 rounded-full border border-sky-400/40 animate-pulse" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-cyan-500 p-[1px] shadow-[0_0_30px_rgba(0,229,255,0.5)]">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center text-cyan-400">
                <Satellite className="w-7 h-7 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
            Recover Explorer Access
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Enter your registered explorer email. We will broadcast a 6-digit satellite security code (OTP) to reset your authorization credentials.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
            <AnimatedInput
              label="Registered Email"
              icon={Mail}
              type="email"
              placeholder="explorer@cosmora.space"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PrimaryButton
              type="submit"
              icon={ArrowRight}
              isLoading={isLoading}
              variant="cyan"
              className="mt-2"
            >
              {sent ? "Satellite Signal Transmitting..." : "Broadcast Security OTP"}
            </PrimaryButton>
          </form>

          {/* Radar Signal Telemetry Indicator */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <Link
              href="/login"
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>

            <div className="flex items-center gap-1.5 text-cyan-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>BEACON ONLINE</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </AuthLayout>
  );
}
