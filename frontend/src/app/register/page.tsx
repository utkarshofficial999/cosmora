"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, ShieldCheck, UserCheck, ArrowRight, Sparkles } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GlassCard } from "@/components/auth/GlassCard";
import { AnimatedInput } from "@/components/auth/AnimatedInput";
import { PasswordField } from "@/components/auth/PasswordField";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { SocialButton } from "@/components/auth/SocialButton";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!acceptTerms) {
      setError("Please accept the exploration protocols");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/welcome");
    }, 1200);
  };

  return (
    <AuthLayout focusedBody="deep-space">
      <div className="w-full max-w-xl my-auto">
        <GlassCard glowColor="purple" className="p-8 sm:p-10">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono w-fit">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>NEW EXPLORER REGISTRATION</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
              Create Explorer Account
            </h1>
            <p className="text-sm text-slate-400">
              Join the Cosmora space program and begin your deep space voyage.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatedInput
                label="Full Name"
                icon={User}
                placeholder="Commander Shepard"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <AnimatedInput
                label="Username"
                icon={UserCheck}
                placeholder="shepard_n7"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <AnimatedInput
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="shepard@normandy.space"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex flex-col gap-3">
              <PasswordField
                label="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
              />

              <PasswordStrengthMeter password={password} />

              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                error={confirmPassword && !passwordsMatch ? "Passwords do not match" : undefined}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5 pt-2 text-xs text-slate-400">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded bg-slate-900 border-white/20 text-purple-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="terms" className="leading-relaxed cursor-pointer">
                I agree to the{" "}
                <span className="text-cyan-400 font-semibold underline">
                  Space Exploration Protocols
                </span>{" "}
                and Privacy Terms.
              </label>
            </div>

            {error && (
              <div className="text-red-400 text-xs font-mono bg-red-950/40 border border-red-500/30 p-2.5 rounded-lg flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <PrimaryButton
              type="submit"
              icon={ArrowRight}
              isLoading={isLoading}
              variant="purple"
              className="mt-2"
            >
              Create Account & Initialize
            </PrimaryButton>
          </form>

          {/* Social Auth */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative px-3 bg-slate-950/80 text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              QUICK REGISTER VIA OAUTH
            </span>
          </div>

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

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered on Cosmora?{" "}
            <Link
              href="/login"
              className="text-purple-400 font-semibold hover:text-purple-300 underline underline-offset-4 transition-colors"
            >
              Access Login Terminal
            </Link>
          </div>
        </GlassCard>
      </div>
    </AuthLayout>
  );
}
