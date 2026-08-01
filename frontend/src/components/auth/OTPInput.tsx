"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, CheckCircle2 } from "lucide-react";

interface OTPInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  onResend?: () => void;
}

export function OTPInput({
  length = 6,
  onComplete,
  onResend,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;

    const newOtp = [...otp];
    newOtp[idx] = val[val.length - 1]; // take last char
    setOtp(newOtp);

    // Auto move next
    if (idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
      setActiveIdx(idx + 1);
    }

    const completeCode = newOtp.join("");
    if (completeCode.length === length && !newOtp.includes("")) {
      setIsSubmitted(true);
      if (onComplete) onComplete(completeCode);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[idx]) {
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        newOtp[idx - 1] = "";
        setOtp(newOtp);
        inputRefs.current[idx - 1]?.focus();
        setActiveIdx(idx - 1);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
      setActiveIdx(idx - 1);
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
      setActiveIdx(idx + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
    if (!pasteData) return;

    const newOtp = Array(length).fill("");
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);

    const nextFocus = Math.min(pasteData.length, length - 1);
    inputRefs.current[nextFocus]?.focus();
    setActiveIdx(nextFocus);

    if (pasteData.length === length) {
      setIsSubmitted(true);
      if (onComplete) onComplete(pasteData);
    }
  };

  const handleResendClick = () => {
    if (!canResend) return;
    setOtp(Array(length).fill(""));
    setTimer(60);
    setCanResend(false);
    setIsSubmitted(false);
    inputRefs.current[0]?.focus();
    if (onResend) onResend();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 6 Digit Box Grid */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3 w-full">
        {otp.map((digit, idx) => {
          const isCurrent = activeIdx === idx;
          const hasValue = digit !== "";

          return (
            <motion.div
              key={idx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.06 }}
              className="relative"
            >
              <input
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                onFocus={() => setActiveIdx(idx)}
                className={`w-11 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl bg-slate-900/90 border transition-all duration-300 focus:outline-none ${
                  isSubmitted
                    ? "border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-950/20"
                    : isCurrent
                    ? "border-cyan-400 text-white shadow-[0_0_20px_rgba(0,229,255,0.3)] scale-105"
                    : hasValue
                    ? "border-sky-500/50 text-cyan-300 bg-slate-900"
                    : "border-white/10 text-slate-400 hover:border-white/20"
                }`}
              />
              {/* Active indicator dot */}
              {isCurrent && !isSubmitted && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Success Pulse Badge when verified */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-4 py-2 rounded-full text-xs font-mono tracking-wider"
          >
            <CheckCircle2 className="w-4 h-4 animate-bounce" />
            SATELLITE HANDSHAKE VERIFIED
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown Timer & Resend Controls */}
      <div className="flex items-center justify-between w-full px-1 text-xs text-slate-400">
        <span className="font-mono">
          {timer > 0 ? (
            <span className="text-cyan-400">
              Resend code in {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </span>
          ) : (
            <span className="text-slate-500">Code expired</span>
          )}
        </span>

        <button
          type="button"
          disabled={!canResend}
          onClick={handleResendClick}
          className={`flex items-center gap-1.5 font-medium transition-all ${
            canResend
              ? "text-cyan-400 hover:text-cyan-300 cursor-pointer underline underline-offset-4"
              : "text-slate-600 cursor-not-allowed opacity-60"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${!canResend ? "" : "hover:rotate-180 transition-transform duration-500"}`} />
          Resend OTP
        </button>
      </div>
    </div>
  );
}
