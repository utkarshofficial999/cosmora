"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  LayoutDashboard,
  Compass,
  Orbit,
  BookOpen,
  Bot,
  BarChart3,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
  Sparkles,
  Volume2,
  Menu,
} from "lucide-react";
import { DashboardSpaceCanvas } from "@/components/3d/DashboardSpaceCanvas";
import { MOCK_EXPLORER } from "@/mocks/dashboard";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { name: "Mission Control", href: "/dashboard", icon: LayoutDashboard },
    { name: "Home Feed", href: "/home", icon: Compass },
    { name: "Missions", href: "/missions", icon: Rocket },
    { name: "Solar System", href: "/solar-system", icon: Orbit },
    { name: "Stories", href: "/stories", icon: BookOpen },
    { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
  ];

  return (
    <div className="relative min-h-screen w-full flex bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* 3D WebGL Space Background */}
      <DashboardSpaceCanvas />

      {/* Collapsible Sci-Fi Sidebar */}
      <aside
        className={`relative z-30 h-screen sticky top-0 flex flex-col justify-between border-r border-white/10 bg-slate-950/80 backdrop-blur-2xl transition-all duration-300 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(0,229,255,0.4)] shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-mono text-base font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                  COSMORA
                </span>
                <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase -mt-1">
                  MISSION CONTROL
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 group ${
                  isActive
                    ? "bg-cyan-950/70 border border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 hover:border-white/10 border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-300"}`} />
                {!isSidebarCollapsed && <span>{item.name}</span>}

                {isActive && (
                  <motion.span
                    layoutId="activeSideBarNav"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Explorer Clearance Telemetry Footer */}
        {!isSidebarCollapsed && (
          <div className="p-4 m-3 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center font-mono font-bold text-cyan-300 text-xs shrink-0">
              L{MOCK_EXPLORER.level}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-white truncate">{MOCK_EXPLORER.callsign}</span>
              <span className="text-[10px] text-emerald-400 font-mono">● STREAK: {MOCK_EXPLORER.streakDays} DAYS</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Mission Control Body */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Telemetry Header Bar */}
        <header className="sticky top-0 z-20 w-full px-6 py-4 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search universe, stories, missions, or planets... (Press /)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400/80 focus:shadow-[0_0_15px_rgba(0,229,255,0.2)] font-mono transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-white/10">
              /
            </span>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-4">
            {/* Audio Telemetry Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-white/10 text-xs font-mono text-slate-300">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-cyan-300">TELEMETRY AUDIO: ACTIVE</span>
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 p-4 rounded-2xl bg-slate-950/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-50 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                      <span className="font-mono font-bold text-white uppercase">MISSION ALERTS</span>
                      <span className="text-[10px] text-cyan-400 font-mono">3 NEW</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col gap-1">
                        <span className="font-semibold text-cyan-300">SpaceX Starship T-Minus 4d</span>
                        <span className="text-slate-400 text-[11px]">Flight Test 6 target date updated.</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col gap-1">
                        <span className="font-semibold text-purple-300">Daily Streak Maintained</span>
                        <span className="text-slate-400 text-[11px]">You earned +150 EXP points today!</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-purple-600 p-[1px]">
                  <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center font-mono text-cyan-300 font-bold text-xs">
                    AV
                  </div>
                </div>
                <span className="hidden md:inline text-xs font-semibold text-slate-200">
                  {MOCK_EXPLORER.callsign}
                </span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 p-4 rounded-2xl bg-slate-950/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-50 text-xs flex flex-col gap-3"
                  >
                    <div className="border-b border-white/10 pb-3">
                      <div className="font-bold text-white text-sm">{MOCK_EXPLORER.name}</div>
                      <div className="text-[11px] text-cyan-400 font-mono">{MOCK_EXPLORER.rank}</div>
                    </div>
                    <Link
                      href="/welcome"
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-900 text-slate-300 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Re-run Onboarding</span>
                    </Link>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-900 text-red-400 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Logout Terminal</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
