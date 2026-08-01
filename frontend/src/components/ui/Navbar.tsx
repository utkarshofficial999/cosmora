"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Search, User, Menu, X } from "lucide-react";
import { AudioController } from "./AudioController";
import { SearchModal } from "@/components/modals/SearchModal";
import { ToastContainer, showToast } from "./Toast";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Solar system pages have their own HUD header — hide the main navbar
  if (pathname?.startsWith("/solar-system")) return null;

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Solar System", href: "/solar-system" },
    { label: "Missions", href: "/missions" },
  ];

  const handleSignInClick = () => {
    showToast(
      "Authentication Module",
      "Sign-in & User Accounts will be active in Day 21 release!",
      "info"
    );
  };

  return (
    <>
      <ToastContainer />
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 rounded-2xl p-3 bg-transparent backdrop-blur-sm border border-white/[0.06] shadow-none">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-base font-black text-white tracking-widest font-display block">
                COSMORA
              </span>
              <span className="text-[9px] font-mono text-cyan-400 tracking-wider block -mt-1">
                3D SPACE PLATFORM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-white/5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? "text-white bg-purple-500/20 border border-purple-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2.5 rounded-xl glass-button text-slate-300 hover:text-white flex items-center gap-2 text-xs"
              title="Search Space Records (Ctrl + K)"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline text-slate-400 font-mono text-[10px]">
                Ctrl K
              </span>
            </button>

            <AudioController />

            <button
              onClick={handleSignInClick}
              className="btn-gradient-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-white shadow-lg shadow-purple-500/25 hover:scale-105 transition-transform"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl glass-button text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 glass-panel rounded-2xl p-4 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold ${
                    pathname === item.href
                      ? "text-white bg-purple-500/20 border border-purple-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
