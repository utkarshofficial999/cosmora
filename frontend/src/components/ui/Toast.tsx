"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: "success" | "info";
}

let toastListener: ((toast: ToastMessage) => void) | null = null;

export function showToast(title: string, description: string, type: "success" | "info" = "success") {
  if (toastListener) {
    toastListener({
      id: Date.now().toString(),
      title,
      description,
      type,
    });
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastListener = (newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    return () => {
      toastListener = null;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto glass-panel p-4 rounded-2xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="mt-0.5 shrink-0">
            {t.type === "info" ? (
              <Info className="w-5 h-5 text-indigo-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            )}
          </div>

          <div className="flex-1">
            <h4 className="text-xs font-bold text-white font-display mb-0.5">
              {t.title}
            </h4>
            <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
              {t.description}
            </p>
          </div>

          <button
            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
            className="text-slate-500 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
