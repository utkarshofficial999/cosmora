"use client";

import React, { useEffect } from "react";
import { Play, X } from "lucide-react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrailerModal({ isOpen, onClose }: TrailerModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-[#030712]/85 backdrop-blur-md flex items-center justify-center p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[min(900px,94vw)] aspect-video rounded-2xl overflow-hidden border border-white/14 relative bg-[radial-gradient(600px_400px_at_50%_40%,rgba(139,92,246,0.4),transparent_60%),#08111F] grid place-items-center text-white"
      >
        <div className="text-center p-6">
          <div className="w-20 h-20 rounded-full bg-white/12 grid place-items-center mx-auto mb-4 animate-[glowpulse_3s_infinite]">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
          <div className="font-['Space_Grotesk'] font-semibold text-2xl">
            Cosmora — Official Platform Trailer
          </div>
          <div className="text-white/55 text-sm mt-2">
            Experience story-driven space exploration in real-time 3D
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/12 hover:bg-white/20 border-none text-white transition-colors grid place-items-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
