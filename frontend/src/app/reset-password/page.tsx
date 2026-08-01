"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, CheckCircle2, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GlassCard } from "@/components/auth/GlassCard";
import { PasswordField } from "@/components/auth/PasswordField";
import { PrimaryButton } from "@/components/auth/PrimaryButton";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }, 1200);
  };

  return (
    <AuthLayout focusedBody="galaxy">
      <div className="w-full max-w-md my-auto">
        <GlassCard glowColor="purple" className="p-8 sm:p-10">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                {/* Header */}
                <div className="flex flex-col gap-2 mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono w-fit">
                    <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                    <span>CREDENTIAL OVERHAUL</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                    Reset Authorization Password
                  </h1>
                  <p className="text-xs text-slate-400">
                    Construct your new quantum encryption key to regain platform command.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <PasswordField
                    label="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    showStrengthMeter={true}
                  />

                  <PasswordField
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    error={
                      confirmPassword && password !== confirmPassword
                        ? "Passwords do not match"
                        : undefined
                    }
                  />

                  {error && (
                    <div className="text-red-400 text-xs font-mono bg-red-950/40 border border-red-500/30 p-2.5 rounded-lg flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <PrimaryButton
                    type="submit"
                    icon={ArrowRight}
                    isLoading={isLoading}
                    variant="purple"
                    className="mt-3"
                  >
                    Update Password & Key
                  </PrimaryButton>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 flex flex-col items-center text-center gap-4"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-950/60 border border-emerald-500/40 p-4 text-emerald-400 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">Password Updated!</h2>
                  <p className="text-xs text-slate-400">
                    Your credentials have been securely updated. Redirecting to Login Terminal...
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-cyan-400 text-xs font-mono bg-slate-900/80 px-4 py-2 rounded-full border border-cyan-500/20">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  <span>DEEP SPACE PROTOCOLS SYNCED</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </AuthLayout>
  );
}
