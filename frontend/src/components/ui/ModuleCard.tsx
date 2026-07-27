"use client";

import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  badge: string;
  gradient: string;
}

export function ModuleCard({
  title,
  description,
  icon: Icon,
  href,
  badge,
  gradient,
}: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="group relative glass-panel p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-colors">
            {badge}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
        <span>Explore Module</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
