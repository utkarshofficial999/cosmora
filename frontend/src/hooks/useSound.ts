"use client";

import { create } from "zustand";

interface SoundStore {
  isPlaying: boolean;
  toggleSound: () => void;
}

export const useSoundStore = create<SoundStore>((set) => ({
  isPlaying: false,
  toggleSound: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
