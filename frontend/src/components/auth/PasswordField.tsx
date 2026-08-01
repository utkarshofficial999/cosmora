"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { AnimatedInput } from "./AnimatedInput";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

interface PasswordFieldProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  showStrengthMeter?: boolean;
}

export function PasswordField({
  label = "Password",
  value,
  onChange,
  placeholder = "••••••••••••",
  error,
  showStrengthMeter = false,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <AnimatedInput
          label={label}
          icon={Lock}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          error={error}
        />
        {/* Toggle Eye Button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-[34px] text-slate-400 hover:text-cyan-400 transition-colors duration-200 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {showStrengthMeter && <PasswordStrengthMeter password={value} />}
    </div>
  );
}
