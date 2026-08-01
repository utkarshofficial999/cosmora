"use client";

import React, { useEffect, useRef } from "react";

const PALETTE = {
  blue: "#4DA8FF",
  purple: "#8B5CF6",
  cyan: "#00E5FF",
  orange: "#FF7B54",
  white: "#F5F7FA",
};

interface StarfieldCanvasProps {
  density?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function StarfieldCanvas({
  density = 0.00016,
  className = "",
  style,
}: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Array<{
      x: number;
      y: number;
      z: number;
      r: number;
      tw: number;
      sp: number;
      c: string;
    }> = [];
    let shooting: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
    }> = [];
    let raf: number;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;

    const tints = [PALETTE.white, PALETTE.blue, PALETTE.cyan, PALETTE.purple];

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor(w * h * density);
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random(),
          r: Math.random() * 1.3 + 0.2,
          tw: Math.random() * Math.PI * 2,
          sp: 0.6 + Math.random() * 1.6,
          c: tints[Math.floor(Math.random() * tints.length)],
        });
      }
    }

    function spawnShoot() {
      if (Math.random() < 0.006 && shooting.length < 2) {
        shooting.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.5,
          vx: 6 + Math.random() * 6,
          vy: 2 + Math.random() * 3,
          life: 1,
        });
      }
    }

    let t = 0;
    function draw() {
      if (!ctx) return;
      t += 0.016;
      tx += (mx - tx) * 0.05;
      ty += (my - ty) * 0.05;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const px = s.x + tx * (s.z * 22);
        const py = s.y + ty * (s.z * 22);
        const a = 0.35 + Math.sin(t * s.sp + s.tw) * 0.35 + s.z * 0.3;
        ctx.globalAlpha = Math.max(0.05, Math.min(1, a));
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(px, py, s.r * (0.6 + s.z), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      spawnShoot();

      for (let i = shooting.length - 1; i >= 0; i--) {
        const sh = shooting[i];
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= 0.012;

        const g = ctx.createLinearGradient(
          sh.x,
          sh.y,
          sh.x - sh.vx * 8,
          sh.y - sh.vy * 8
        );
        g.addColorStop(0, `rgba(245,247,250,${Math.max(0, sh.life)})`);
        g.addColorStop(1, "rgba(245,247,250,0)");

        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 8, sh.y - sh.vy * 8);
        ctx.stroke();

        if (sh.life <= 0 || sh.x > w || sh.y > h) {
          shooting.splice(i, 1);
        }
      }

      raf = requestAnimationFrame(draw);
    }

    function onMove(e: PointerEvent) {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
