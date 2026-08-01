"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Satellite, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GlassCard } from "@/components/auth/GlassCard";
import { OTPInput } from "@/components/auth/OTPInput";
import { PrimaryButton } from "@/components/auth/PrimaryButton";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleComplete = (completedCode: string) => {
    setCode(completedCode);
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
      setTimeout(() => {
        router.push("/reset-password");
      }, 1500);
    }, 1200);
  };

  const handleManualVerify = () => {
    if (code.length === 6) {
      handleComplete(code);
    }
  };

  return (
    <AuthLayout focusedBody="satellite">
      <div className="w-full max-w-lg my-auto">
        <GlassCard glowColor="cyan" className="p-8 sm:p-10 text-center">
          {/* Satellite Communication Header Visual */}
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-cyan-500/40 p-3 mx-auto mb-6 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.3)]">
            {verified ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
            ) : (
              <Satellite className="w-8 h-8 animate-pulse" />
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 font-sans">
            Satellite OTP Verification
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed mb-8 max-w-sm mx-auto">
            We sent a 6-digit satellite access code to your email address. Enter the authorization digits below.
          </p>

          {/* OTP Component */}
          <OTPInput
            length={6}
            onComplete={handleComplete}
            onResend={() => {
              // Simulated Resend notification
            }}
          />

          {/* Manual Verify Button */}
          <div className="mt-8">
            <PrimaryButton
              type="button"
              onClick={handleManualVerify}
              isLoading={isVerifying}
              variant="cyan"
            >
              {verified ? "Handshake Successful! Redirecting..." : "Verify Authorization Code"}
            </PrimaryButton>
          </div>

          {/* Telemetry Status Footer */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <Link
              href="/forgot-password"
              className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Request New OTP
            </Link>

            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HANDSHAKE SECURE</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </AuthLayout>
  );
}
