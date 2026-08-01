"use client";

import React, { useState, useEffect } from "react";
import { X, Volume2, VolumeX, Sparkles, Rocket, Globe, BookOpen, Layers, CheckCircle2, ChevronRight, Share2 } from "lucide-react";
import { ACT_NAMES } from "./SymphonyTimelineBar";

interface ActDetailModalProps {
  actIndex: number | null;
  onClose: () => void;
  onNavigateAct: (nextIndex: number) => void;
}

export function ActDetailModal({ actIndex, onClose, onNavigateAct }: ActDetailModalProps) {
  if (actIndex === null) return null;

  const act = ACT_NAMES[actIndex];
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [activeTab, setActiveTab] = useState<"narrative" | "facts" | "missions" | "gallery">("narrative");

  // Web Speech Synthesis Narration
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
    } else {
      const textToSpeak = `${act.title}. ${act.desc}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingSpeech(false);
      utterance.onerror = () => setIsPlayingSpeech(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingSpeech(true);
    }
  };

  const actScientificFacts = [
    [
      { label: "Cosmic Inflation Epoch", val: "10⁻³² seconds after Big Bang" },
      { label: "Expansion Velocity", val: "Superluminal (faster than c)" },
      { label: "Primordial Singularity", val: "T = 10³² Kelvin" },
      { label: "First Black Hole Mass", val: "10³ to 10⁹ Solar Masses" },
    ],
    [
      { label: "Milky Way Diameter", val: "100,000 Light-Years" },
      { label: "Central Supermassive Black Hole", val: "Sagittarius A* (4.1M M☉)" },
      { label: "Estimated Star Count", val: "100 Billion – 400 Billion" },
      { label: "Galactic Rotational Velocity", val: "220 km/s at Sun's orbit" },
    ],
    [
      { label: "Solar System Ignition", val: "4.6 Billion Years Ago" },
      { label: "Solar Fusion Core Pressure", val: "250 Billion Atmospheres" },
      { label: "Protoplanetary Disk Span", val: "100 Astronomical Units" },
      { label: "Terrestrial vs Gas Giants", val: "Inner Rocky / Outer Gas-Ice" },
    ],
    [
      { label: "Earth Radius & Gravity", val: "6,371 km / 9.81 m/s²" },
      { label: "Atmosphere Composition", val: "78% N₂, 21% O₂, 0.9% Ar" },
      { label: "International Space Station", val: "400 km LEO / 27,600 km/h" },
      { label: "Moon Orbital Distance", val: "384,400 km" },
    ],
  ];

  const actMissions = [
    [
      { name: "James Webb Space Telescope", agency: "NASA / ESA / CSA", desc: "Observing the first light of primordial galaxies and cosmic dawn." },
      { name: "Planck Observatory", agency: "ESA", desc: "Mapped Cosmic Microwave Background radiation fluctuations." },
    ],
    [
      { name: "Gaia Observatory", agency: "ESA", desc: "Creating a 3D stellar map of 1 billion stars in the Milky Way." },
      { name: "Event Horizon Telescope (EHT)", agency: "Global Array", desc: "Imaged Sagittarius A* black hole shadow." },
    ],
    [
      { name: "Parker Solar Probe", agency: "NASA", desc: "Touched the Sun's corona to measure solar flare magnetic fields." },
      { name: "Voyager 1 & 2", agency: "NASA", desc: "Traversed the outer planets into interstellar space." },
    ],
    [
      { name: "International Space Station", agency: "NASA / Roscosmos / ESA / JAXA", desc: "Continuous human orbital presence observing Earth." },
      { name: "Artemis III", agency: "NASA", desc: "Returning humans to the Lunar South Pole." },
    ],
  ];

  const actGalleries = [
    [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800",
    ],
    [
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800",
      "https://images.unsplash.com/photo-1532635241-17e820acc59f?q=80&w=800",
    ],
    [
      "https://images.unsplash.com/photo-1532635241-17e820acc59f?q=80&w=800",
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800",
    ],
    [
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=800",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    ],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl p-6 md:p-10 border border-purple-500/40 bg-slate-950/90 shadow-2xl shadow-purple-950/60 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 rounded-2xl glass-button text-slate-400 hover:text-white border border-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300">
            ACT {act.number} OF IV
          </span>
          <span className="text-xs font-mono text-cyan-400 font-bold">
            ● {act.subtitle}
          </span>
        </div>

        <h2 className="text-2xl md:text-4xl font-black text-white font-display mb-3">
          {act.title}
        </h2>

        {/* Speech Audio Narration Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleToggleSpeech}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              isPlayingSpeech
                ? "bg-purple-600 border border-purple-400 text-white shadow-lg shadow-purple-500/30"
                : "glass-button text-slate-300 hover:text-white"
            }`}
          >
            {isPlayingSpeech ? (
              <>
                <Volume2 className="w-4 h-4 text-purple-200 animate-pulse" />
                <span>Playing Voice Narration...</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>Listen to Voice Narration</span>
              </>
            )}
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-6">
          <button
            onClick={() => setActiveTab("narrative")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "narrative"
                ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Chapter Narrative
          </button>
          <button
            onClick={() => setActiveTab("facts")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "facts"
                ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Scientific Facts
          </button>
          <button
            onClick={() => setActiveTab("missions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "missions"
                ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Mission References
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "gallery"
                ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Gallery
          </button>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[220px]">
          {activeTab === "narrative" && (
            <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed font-sans">
              <p>{act.desc}</p>
              {actIndex === 0 && (
                <p>
                  As space expands, quantum foam fluctuations are magnified into vast cosmic filaments. The matter density triggers runaway gravitational collapse, forging the first generation of Supermassive Black Holes at cosmic dawn.
                </p>
              )}
              {actIndex === 1 && (
                <p>
                  Millions of newly ignited main-sequence stars are drawn into orbit around Sagittarius A*. Spiral density waves compress interstellar gas clouds, forming star nurseries across the galaxy's spiral arms.
                </p>
              )}
              {actIndex === 2 && (
                <p>
                  In the protoplanetary accretion disk, rocky planetesimals collide and merge. Terrestrial worlds settle into inner warm orbits while gas giants sweep up hydrogen and helium in the outer cold zone.
                </p>
              )}
              {actIndex === 3 && (
                <blockquote className="p-4 rounded-2xl glass-panel border border-purple-500/30 text-purple-200 font-serif italic text-center text-lg my-4">
                  "We are the universe becoming conscious of itself."
                </blockquote>
              )}
            </div>
          )}

          {activeTab === "facts" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {actScientificFacts[actIndex]?.map((f, i) => (
                <div key={i} className="glass-panel p-4 rounded-2xl border border-white/10">
                  <div className="text-xs font-mono text-purple-400 mb-1">{f.label}</div>
                  <div className="text-sm font-bold text-white font-mono">{f.val}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "missions" && (
            <div className="space-y-4">
              {actMissions[actIndex]?.map((m, i) => (
                <div key={i} className="glass-panel p-4 rounded-2xl border border-white/10 flex items-start gap-4">
                  <Rocket className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                  <div>
                    <div className="text-sm font-bold text-white font-display">{m.name}</div>
                    <div className="text-xs font-mono text-purple-300 mb-1">{m.agency}</div>
                    <div className="text-xs text-slate-300">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {actGalleries[actIndex]?.map((url, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-white/10 h-40">
                  <img src={url} alt={`Act ${act.number} Gallery`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
          <button
            onClick={() => onNavigateAct(Math.max(0, actIndex - 1))}
            disabled={actIndex === 0}
            className="px-4 py-2.5 rounded-xl glass-button text-xs font-bold text-slate-300 disabled:opacity-30 cursor-pointer"
          >
            ← Previous Act
          </button>

          <button
            onClick={() => {
              if (actIndex < 3) onNavigateAct(actIndex + 1);
              else onClose();
            }}
            className="px-6 py-2.5 rounded-xl btn-gradient-purple text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20"
          >
            <span>{actIndex < 3 ? `Continue to Act ${ACT_NAMES[actIndex + 1].number}` : "Finish Journey"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
