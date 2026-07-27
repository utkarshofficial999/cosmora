"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Rocket,
  Search,
  Maximize2,
  Compass,
  Radio,
  SlidersHorizontal,
} from "lucide-react";
import { fetchMissions, SpaceMission } from "@/services/missionService";
import { MissionScene } from "@/components/three/MissionScene";
import { Countdown } from "@/components/mission/Countdown";
import { AgencyFilter } from "@/components/mission/AgencyFilter";
import { MissionTimeline } from "@/components/mission/MissionTimeline";
import { MissionDetails } from "@/components/mission/MissionDetails";

export default function MissionsPage() {
  const [missions, setMissions] = useState<SpaceMission[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState<string>("artemis-iii");
  const [selectedAgency, setSelectedAgency] = useState<string>("ALL");
  const [sceneMode, setSceneMode] = useState<"launch" | "orbit">("launch");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchMissions().then((data) => {
      setMissions(data);
    });
  }, []);

  const activeMission =
    missions.find((m) => m.id === selectedMissionId) || missions[0] || {
      id: "artemis-iii",
      name: "Artemis III",
      agency: "NASA",
      target: "Moon - South Pole",
      launchDate: "2026-09-15T12:00:00Z",
      status: "Scheduled",
      type: "Human Lunar Landing",
      description: "First human landing on the lunar South Pole region.",
      crew: ["Reid Wiseman", "Victor Glover"],
      duration: "30 Days",
      objectives: ["Land 2 astronauts near lunar South Pole"],
      telemetrySpeed: "1.02 km/s",
      distanceFromEarth: "384,400 km",
      color: "from-blue-600 to-indigo-600",
      milestones: [],
    };

  const filteredMissions = missions.filter((m) => {
    const matchAgency = selectedAgency === "ALL" || m.agency === selectedAgency;
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.target.toLowerCase().includes(searchQuery.toLowerCase());
    return matchAgency && matchSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* 3D WebGL Background Scene (Launch Pad & Orbital Path) */}
      <MissionScene viewMode={sceneMode} targetName={activeMission.target} />

      {/* Top Header Command Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 z-10 relative">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl glass-button text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide font-display">
              Mission Control Command Center
            </h1>
            <p className="text-xs text-slate-400">
              Live flight telemetry, 3D trajectory visualizer & countdowns
            </p>
          </div>
        </div>

        {/* Agency Tabs & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <AgencyFilter
            selectedAgency={selectedAgency}
            onSelect={setSelectedAgency}
          />
          <div className="relative w-48 hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search missions..."
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Real-time Countdown Banner for Next Scheduled Flight */}
      <div className="mb-6 z-10 relative">
        <Countdown
          launchDate={activeMission.launchDate}
          missionName={activeMission.name}
          agency={activeMission.agency}
        />
      </div>

      {/* Main Command Stage: 3D Scene Controls + Mission Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 z-10 relative">
        {/* Left Column: 3D Stage View Toggle & Mission Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3D Scene Mode Selector Overlay Bar */}
          <div className="glass-panel rounded-2xl p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-ping" />
              Active 3D Telemetry Stage: {sceneMode === "launch" ? "Launch Pad Gantry" : "Orbital Trajectory Arc"}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSceneMode("launch")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  sceneMode === "launch"
                    ? "btn-gradient-primary text-white"
                    : "glass-button text-slate-400 hover:text-white"
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                Launch Pad 3D
              </button>

              <button
                onClick={() => setSceneMode("orbit")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  sceneMode === "orbit"
                    ? "btn-gradient-primary text-white"
                    : "glass-button text-slate-400 hover:text-white"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Orbital Arc 3D
              </button>
            </div>
          </div>

          {/* Mission Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {filteredMissions.map((m) => {
              const isSelected = selectedMissionId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMissionId(m.id)}
                  className={`text-left glass-panel p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? "border-cyan-400 bg-slate-900/90 shadow-xl shadow-cyan-500/20"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-white/10">
                      {m.agency}
                    </span>
                    <span className="text-[9px] font-semibold text-emerald-400">
                      {m.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">
                    {m.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono block mb-2">
                    {m.target}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Milestone Telemetry Timeline */}
          <MissionTimeline milestones={activeMission.milestones} />
        </div>

        {/* Right Column: Mission Details & Telemetry Inspector Panel */}
        <div className="z-10 relative">
          <MissionDetails mission={activeMission} />
        </div>
      </div>
    </div>
  );
}
