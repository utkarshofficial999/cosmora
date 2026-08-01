"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Compass,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Microscope,
  BookOpen,
  Code,
  Heart,
  Globe2,
  Orbit,
  Zap,
  ArrowRight,
  ChevronLeft,
  Activity,
  Cpu,
  Layers,
} from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GlassCard } from "@/components/auth/GlassCard";
import { ProgressStepper } from "@/components/auth/ProgressStepper";
import { PrimaryButton } from "@/components/auth/PrimaryButton";

const ONBOARDING_STEPS = [
  { id: 1, title: "Welcome" },
  { id: 2, title: "Interests" },
  { id: 3, title: "Role" },
  { id: 4, title: "Preview" },
  { id: 5, title: "Launch" },
];

const INTEREST_OPTIONS = [
  { id: "solar", name: "Solar System", icon: Orbit, desc: "Planets, moons, solar flare dynamics" },
  { id: "blackholes", name: "Black Holes", icon: Zap, desc: "Event horizons, singularity physics" },
  { id: "isro", name: "ISRO", icon: Globe2, desc: "Chandrayaan, Gaganyaan missions" },
  { id: "nasa", name: "NASA", icon: Rocket, desc: "Artemis, James Webb, Deep Space" },
  { id: "spacex", name: "SpaceX", icon: Activity, desc: "Starship interplanetary telemetry" },
  { id: "deepspace", name: "Deep Space", icon: Sparkles, desc: "Distant galaxies, nebulae, quasars" },
  { id: "astrophysics", name: "Astrophysics", icon: Cpu, desc: "Cosmology, dark energy, quantum space" },
  { id: "mars", name: "Mars Exploration", icon: Compass, desc: "Red planet terraforming & rovers" },
  { id: "moon", name: "Lunar Base", icon: Layers, desc: "Moon outposts, polar ice deposits" },
  { id: "exoplanets", name: "Exoplanets", icon: Globe2, desc: "Habitable worlds, biosignatures" },
];

const EXPERIENCE_OPTIONS = [
  {
    id: "student",
    title: "Student",
    icon: GraduationCap,
    desc: "Curious learner exploring space sciences and orbital mechanics.",
  },
  {
    id: "researcher",
    title: "Researcher",
    icon: Microscope,
    desc: "Astrophysicist or data scientist analyzing cosmic datasets.",
  },
  {
    id: "explorer",
    title: "Explorer",
    icon: Compass,
    desc: "Avid space enthusiast following real-time missions & discoveries.",
  },
  {
    id: "teacher",
    title: "Teacher",
    icon: BookOpen,
    desc: "Educator seeking interactive 3D visualizations for students.",
  },
  {
    id: "enthusiast",
    title: "Space Enthusiast",
    icon: Heart,
    desc: "Passionate fan of rockets, starships, and astronomy.",
  },
  {
    id: "developer",
    title: "Developer",
    icon: Code,
    desc: "Engineer building open space tech, APIs, and simulations.",
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "solar",
    "deepspace",
    "nasa",
  ]);
  const [selectedExperience, setSelectedExperience] = useState<string>("explorer");
  const [isLaunching, setIsLaunching] = useState(false);

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLaunching(true);
      setTimeout(() => {
        router.push("/");
      }, 1800);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AuthLayout focusedBody={currentStep === 5 ? "galaxy" : "earth"}>
      <div className="w-full max-w-3xl my-auto flex flex-col gap-6">
        {/* Step Progress Bar Header */}
        <GlassCard glowColor="cyan" className="p-4 sm:p-6">
          <ProgressStepper
            steps={ONBOARDING_STEPS}
            currentStep={currentStep}
            onStepClick={(s) => setCurrentStep(s)}
          />
        </GlassCard>

        {/* Step Content Card */}
        <GlassCard glowColor="purple" className="p-8 sm:p-10 min-h-[460px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* STEP 1: WELCOME EXPLORER */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center gap-6 my-auto"
              >
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 p-[1.5px] shadow-[0_0_40px_rgba(0,229,255,0.4)]">
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-cyan-400">
                    <Rocket className="w-12 h-12 animate-bounce" />
                  </div>
                </div>

                <div className="space-y-2 max-w-lg">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>COSMORA PROTOCOL #001</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                    Welcome Explorer!
                  </h1>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    You are now authenticated into Cosmora&apos;s deep space network. Let&apos;s customize your telemetry feed and personal dashboard before departure.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 w-full max-w-md pt-4 text-left text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                    <span className="text-slate-500 block">STATUS</span>
                    <span className="text-emerald-400 font-bold">READY</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                    <span className="text-slate-500 block">CLEARANCE</span>
                    <span className="text-cyan-300 font-bold">LEVEL 4</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                    <span className="text-slate-500 block">COMM</span>
                    <span className="text-purple-300 font-bold">ENCRYPTED</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CHOOSE INTERESTS */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Select Your Cosmic Interests
                  </h2>
                  <p className="text-xs text-slate-400">
                    Choose one or more topics to personalize your universe exploration feed.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {INTEREST_OPTIONS.map((item) => {
                    const isSelected = selectedInterests.includes(item.id);
                    const IconComp = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleInterest(item.id)}
                        className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all duration-200 ${
                          isSelected
                            ? "bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                            : "bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <IconComp
                            className={`w-4 h-4 ${isSelected ? "text-cyan-400" : "text-slate-500"}`}
                          />
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <div>
                          <div className="text-xs font-semibold">{item.name}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: CHOOSE EXPERIENCE */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Select Your Space Designation
                  </h2>
                  <p className="text-xs text-slate-400">
                    Tell us your role so we can optimize your telemetry complexity.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {EXPERIENCE_OPTIONS.map((item) => {
                    const isSelected = selectedExperience === item.id;
                    const IconComp = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedExperience(item.id)}
                        className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-300 ${
                          isSelected
                            ? "bg-purple-950/60 border-purple-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.25)]"
                            : "bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-xl ${
                            isSelected
                              ? "bg-purple-600 text-white"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{item.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: PERSONAL DASHBOARD PREVIEW */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Telemetry & Feed Calibration
                  </h2>
                  <p className="text-xs text-slate-400">
                    Previewing your customized explorer dashboard configuration.
                  </p>
                </div>

                {/* Dashboard Spec Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">
                      SELECTED FOCUS
                    </span>
                    <span className="text-xl font-bold text-white">
                      {selectedInterests.length} Topics
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedInterests.map((id) => (
                        <span
                          key={id}
                          className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 text-[10px] font-mono uppercase"
                        >
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-purple-400 uppercase">
                      DESIGNATION
                    </span>
                    <span className="text-xl font-bold text-white capitalize">
                      {selectedExperience}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Customized telemetry metrics active.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      AI ASSISTANT
                    </span>
                    <span className="text-xl font-bold text-white">ASTRO-AI 3.0</span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                      ● SYNCED & ONLINE
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                    <span>ORBITAL FEED ALGORITHM PREPARED</span>
                  </div>
                  <span className="text-emerald-400 font-bold">100% READY</span>
                </div>
              </motion.div>
            )}

            {/* STEP 5: START EXPLORING CTA */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center gap-6 my-auto"
              >
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 p-[2px] shadow-[0_0_50px_rgba(0,229,255,0.6)] animate-pulse">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-400">
                    <Rocket className="w-14 h-14" />
                  </div>
                </div>

                <div className="space-y-2 max-w-md">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    All Systems Nominal!
                  </h1>
                  <p className="text-sm text-slate-400">
                    Your personal space hub is fully configured. Step into the Cosmora universe and begin your journey.
                  </p>
                </div>

                {isLaunching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-cyan-400 font-mono text-xs animate-bounce"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>ENGAGING WARP DRIVES... LAUNCHING PLATFORM!</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls Row */}
          <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-6">
            <button
              type="button"
              disabled={currentStep === 1 || isLaunching}
              onClick={handlePrev}
              className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${
                currentStep === 1
                  ? "opacity-0 pointer-events-none"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Step
            </button>

            <div className="w-48 sm:w-56">
              <PrimaryButton
                type="button"
                onClick={handleNext}
                isLoading={isLaunching}
                variant={currentStep === 5 ? "cyan" : "cosmic"}
                icon={currentStep === 5 ? Rocket : ArrowRight}
              >
                {currentStep === 5 ? "Start Exploring" : "Continue"}
              </PrimaryButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </AuthLayout>
  );
}
