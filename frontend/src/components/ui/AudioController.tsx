"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSoundStore } from "@/hooks/useSound";

export function AudioController() {
  const { isPlaying, toggleSound } = useSoundStore();

  return (
    <button
      onClick={toggleSound}
      className="glass-button p-2.5 rounded-full text-slate-300 hover:text-cyan-400 focus:outline-none"
      title={isPlaying ? "Mute Ambient Space Sound" : "Play Ambient Space Sound"}
    >
      {isPlaying ? <Volume2 className="w-5 h-5 text-cyan-400 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
}
