"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Clock, LucideIcon } from "lucide-react";
import { CarouselItem } from "@/mocks/home";

interface RecommendationCarouselProps {
  title: string;
  icon?: LucideIcon;
  items: CarouselItem[];
}

export function RecommendationCarousel({
  title,
  icon: Icon,
  items,
}: RecommendationCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-4 my-8">
      {/* Section Title & Navigation Arrows */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-5 h-5 text-cyan-400" />}
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ duration: 0.3 }}
            className="relative shrink-0 w-72 sm:w-80 rounded-2xl bg-slate-950/70 border border-white/10 overflow-hidden backdrop-blur-xl group cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.2)] flex flex-col justify-between"
          >
            {/* Image Thumbnail */}
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

              {/* Badge Tag */}
              {item.badge && (
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-400/40 text-[10px] font-mono text-cyan-300 font-bold">
                  {item.badge}
                </span>
              )}

              {/* Rating */}
              {item.rating && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 border border-white/10 text-[10px] font-mono text-amber-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{item.rating}</span>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-cyan-400">{item.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {item.readTime}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h3>

              {/* Optional Progress Bar */}
              {item.progressPercent !== undefined && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#00e5ff]"
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
