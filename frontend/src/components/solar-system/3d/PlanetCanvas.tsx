"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PlanetDetail } from "@/mocks/solar-system/planets";

interface PlanetCanvasProps {
  planet: PlanetDetail;
}

/* ════════════════════════════════════════════════════════════════
   4K PROCEDURAL TEXTURE GENERATORS  —  one per planet
   ════════════════════════════════════════════════════════════════ */

// Seeded pseudo-random for deterministic textures
function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

/* ── Mercury ── */
function makeMercuryTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  // Base grey-brown surface
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#8d8680"); g.addColorStop(0.5, "#a09890"); g.addColorStop(1, "#7a7268");
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  // Surface variation
  const rng = seededRandom(42);
  for (let i = 0; i < 3000; i++) {
    const px = rng() * w, py = rng() * h, r = 1 + rng() * 6;
    const v = 60 + rng() * 80;
    x.fillStyle = `rgba(${v},${v - 5},${v - 10},${(0.15 + rng() * 0.2).toFixed(2)})`;
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
  }
  // Craters
  for (let i = 0; i < 600; i++) {
    const px = rng() * w, py = rng() * h, r = 3 + rng() * 28;
    // shadow
    x.fillStyle = `rgba(40,35,30,${(0.2 + rng() * 0.3).toFixed(2)})`;
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
    // inner floor
    x.fillStyle = `rgba(${100 + rng() * 40|0},${90 + rng() * 35|0},${80 + rng() * 30|0},${(0.4 + rng() * 0.3).toFixed(2)})`;
    x.beginPath(); x.arc(px, py, r * 0.7, 0, Math.PI * 2); x.fill();
    // rim highlight
    x.strokeStyle = `rgba(190,180,170,${(0.15 + rng() * 0.2).toFixed(2)})`;
    x.lineWidth = 1.5; x.beginPath(); x.arc(px - 1, py - 1, r, -0.8, 1.2); x.stroke();
  }
  // Caloris Basin
  const rg = x.createRadialGradient(w * 0.3, h * 0.35, 10, w * 0.3, h * 0.35, 80);
  rg.addColorStop(0, "rgba(130,120,100,0.5)"); rg.addColorStop(1, "rgba(100,90,75,0)");
  x.fillStyle = rg; x.beginPath(); x.arc(w * 0.3, h * 0.35, 80, 0, Math.PI * 2); x.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeMercuryBump(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  x.fillStyle = "#808080"; x.fillRect(0, 0, w, h);
  const rng = seededRandom(42);
  for (let i = 0; i < 600; i++) {
    const px = rng() * w, py = rng() * h, r = 3 + rng() * 28;
    x.fillStyle = `rgba(40,40,40,${(0.3 + rng() * 0.3).toFixed(2)})`;
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
    x.fillStyle = `rgba(160,160,160,${(0.2 + rng() * 0.2).toFixed(2)})`;
    x.beginPath(); x.arc(px - 2, py - 2, r * 0.4, 0, Math.PI * 2); x.fill();
  }
  return new THREE.CanvasTexture(c);
}

/* ── Venus ── */
function makeVenusTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#e8c96c"); g.addColorStop(0.3, "#d4a84b"); g.addColorStop(0.6, "#c4923a"); g.addColorStop(1, "#b8862f");
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  // Cloud bands
  const rng = seededRandom(99);
  for (let y = 0; y < h; y += 4) {
    const offset = Math.sin(y * 0.012 + rng() * 10) * 40;
    x.fillStyle = `rgba(${210 + (y % 30)},${175 + (y % 25)},${100 + (y % 20)},0.25)`;
    x.fillRect(offset, y, w, 3 + Math.sin(y * 0.04) * 3);
  }
  // Swirling vortices
  for (let i = 0; i < 400; i++) {
    const px = rng() * w, py = rng() * h;
    const rw = 20 + rng() * 80, rh = 4 + rng() * 12;
    x.fillStyle = `rgba(${230 + rng() * 25|0},${200 + rng() * 30|0},${130 + rng() * 40|0},${(0.06 + rng() * 0.12).toFixed(2)})`;
    x.beginPath(); x.ellipse(px, py, rw, rh, rng() * Math.PI, 0, Math.PI * 2); x.fill();
  }
  // Polar brightening
  x.fillStyle = "rgba(255,240,200,0.15)"; x.fillRect(0, 0, w, 60); x.fillRect(0, h - 60, w, 60);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ── Earth ── */
function makeEarthTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  // Deep ocean
  const og = x.createLinearGradient(0, 0, 0, h);
  og.addColorStop(0, "#071e3d"); og.addColorStop(0.15, "#0a3057"); og.addColorStop(0.4, "#0d4170");
  og.addColorStop(0.6, "#0d4170"); og.addColorStop(0.85, "#0a3057"); og.addColorStop(1, "#071e3d");
  x.fillStyle = og; x.fillRect(0, 0, w, h);
  // Ocean depth variation
  const rng = seededRandom(777);
  for (let i = 0; i < 1000; i++) {
    x.fillStyle = `rgba(${8 + rng() * 20|0},${40 + rng() * 40|0},${80 + rng() * 40|0},0.15)`;
    x.beginPath(); x.ellipse(rng() * w, rng() * h, 20 + rng() * 60, 10 + rng() * 30, rng() * Math.PI, 0, Math.PI * 2); x.fill();
  }
  // Continents
  const continents: { cx: number; cy: number; r: number; col: string; patches: number }[] = [
    { cx: 0.22, cy: 0.2, r: 0.07, col: "#2d6a4f", patches: 35 },   // Europe
    { cx: 0.22, cy: 0.38, r: 0.1, col: "#1b4332", patches: 50 },    // Africa
    { cx: 0.32, cy: 0.35, r: 0.05, col: "#40916c", patches: 25 },   // Middle East
    { cx: 0.38, cy: 0.38, r: 0.06, col: "#52b788", patches: 30 },   // India
    { cx: 0.45, cy: 0.3, r: 0.08, col: "#2d6a4f", patches: 40 },    // China/Asia
    { cx: 0.5, cy: 0.38, r: 0.04, col: "#40916c", patches: 20 },    // SE Asia
    { cx: 0.58, cy: 0.72, r: 0.06, col: "#95734a", patches: 25 },   // Australia
    { cx: 0.75, cy: 0.25, r: 0.12, col: "#2d6a4f", patches: 55 },   // N America
    { cx: 0.72, cy: 0.5, r: 0.08, col: "#40916c", patches: 40 },    // C America
    { cx: 0.7, cy: 0.6, r: 0.09, col: "#1b4332", patches: 45 },     // S America
    { cx: 0.12, cy: 0.25, r: 0.04, col: "#52b788", patches: 15 },   // UK
    { cx: 0.5, cy: 0.93, r: 0.14, col: "#e8e4de", patches: 45 },    // Antarctica
    { cx: 0.3, cy: 0.05, r: 0.08, col: "#d4cfc8", patches: 30 },    // Arctic
  ];
  for (const ct of continents) {
    const cx = ct.cx * w, cy = ct.cy * h, cr = ct.r * w;
    for (let i = 0; i < ct.patches; i++) {
      const angle = rng() * Math.PI * 2;
      const dist = rng() * cr;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist * 0.7;
      const pr = cr * 0.15 + rng() * cr * 0.25;
      x.fillStyle = ct.col; x.globalAlpha = 0.55 + rng() * 0.45;
      x.beginPath(); x.arc(px, py, pr, 0, Math.PI * 2); x.fill();
    }
    // Darker terrain detail
    for (let i = 0; i < ct.patches * 0.4; i++) {
      const px = cx + (rng() - 0.5) * cr * 1.5;
      const py = cy + (rng() - 0.5) * cr;
      x.fillStyle = `rgba(20,60,30,0.2)`; x.globalAlpha = 0.3 + rng() * 0.3;
      x.beginPath(); x.arc(px, py, 3 + rng() * 12, 0, Math.PI * 2); x.fill();
    }
  }
  x.globalAlpha = 1;
  // Desert regions
  const deserts = [
    { cx: 0.2, cy: 0.35, r: 0.04 }, // Sahara
    { cx: 0.35, cy: 0.35, r: 0.03 }, // Arabian
    { cx: 0.55, cy: 0.7, r: 0.025 }, // Aussie outback
  ];
  for (const d of deserts) {
    for (let i = 0; i < 15; i++) {
      x.fillStyle = `rgba(${180 + rng() * 40|0},${150 + rng() * 30|0},${90 + rng() * 30|0},0.4)`;
      x.beginPath(); x.arc(d.cx * w + (rng() - 0.5) * d.r * w, d.cy * h + (rng() - 0.5) * d.r * h * 0.7, 5 + rng() * 15, 0, Math.PI * 2); x.fill();
    }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeEarthClouds(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  x.clearRect(0, 0, w, h);
  const rng = seededRandom(333);
  // Cloud bands
  for (let i = 0; i < 500; i++) {
    const px = rng() * w, py = rng() * h;
    const rw = 30 + rng() * 120, rh = 8 + rng() * 25;
    x.fillStyle = `rgba(255,255,255,${(0.08 + rng() * 0.2).toFixed(2)})`;
    x.beginPath(); x.ellipse(px, py, rw, rh, rng() * 0.5, 0, Math.PI * 2); x.fill();
  }
  // ITCZ cloud belt near equator
  for (let i = 0; i < 80; i++) {
    x.fillStyle = `rgba(255,255,255,${(0.1 + rng() * 0.15).toFixed(2)})`;
    x.beginPath(); x.ellipse(rng() * w, h * 0.48 + (rng() - 0.5) * 60, 40 + rng() * 100, 10 + rng() * 20, rng() * 0.3, 0, Math.PI * 2); x.fill();
  }
  // Cyclone spirals
  for (let s = 0; s < 5; s++) {
    const sx = rng() * w, sy = h * 0.3 + rng() * h * 0.4;
    for (let a = 0; a < 12; a++) {
      const angle = a * 0.5 + rng() * 0.3;
      const dist = 5 + a * 4;
      x.fillStyle = `rgba(255,255,255,${(0.12 - a * 0.008).toFixed(2)})`;
      x.beginPath(); x.arc(sx + Math.cos(angle) * dist, sy + Math.sin(angle) * dist, 6 + rng() * 10, 0, Math.PI * 2); x.fill();
    }
  }
  return new THREE.CanvasTexture(c);
}

/* ── Mars ── */
function makeMarsTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#a0522d"); g.addColorStop(0.15, "#b8602f"); g.addColorStop(0.5, "#c2410c");
  g.addColorStop(0.85, "#b8602f"); g.addColorStop(1, "#a0522d");
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  const rng = seededRandom(555);
  // Terrain variation
  for (let i = 0; i < 2000; i++) {
    const v = 120 + rng() * 80;
    x.fillStyle = `rgba(${v|0},${v * 0.45|0},${v * 0.2|0},${(0.1 + rng() * 0.15).toFixed(2)})`;
    x.beginPath(); x.arc(rng() * w, rng() * h, 3 + rng() * 15, 0, Math.PI * 2); x.fill();
  }
  // Dark volcanic highlands
  const highlands = [{ cx: 0.4, cy: 0.55, r: 0.15 }, { cx: 0.7, cy: 0.4, r: 0.12 }];
  for (const hl of highlands) {
    for (let i = 0; i < 80; i++) {
      x.fillStyle = `rgba(60,20,8,${(0.1 + rng() * 0.2).toFixed(2)})`;
      x.beginPath(); x.arc(hl.cx * w + (rng() - 0.5) * hl.r * w, hl.cy * h + (rng() - 0.5) * hl.r * h, 5 + rng() * 25, 0, Math.PI * 2); x.fill();
    }
  }
  // Valles Marineris
  x.strokeStyle = "rgba(80,25,8,0.6)"; x.lineWidth = 6; x.lineCap = "round";
  x.beginPath(); x.moveTo(w * 0.2, h * 0.5); x.bezierCurveTo(w * 0.35, h * 0.48, w * 0.5, h * 0.46, w * 0.65, h * 0.5); x.stroke();
  x.strokeStyle = "rgba(60,18,5,0.4)"; x.lineWidth = 12;
  x.beginPath(); x.moveTo(w * 0.2, h * 0.5); x.bezierCurveTo(w * 0.35, h * 0.48, w * 0.5, h * 0.46, w * 0.65, h * 0.5); x.stroke();
  // Olympus Mons
  const omx = w * 0.15, omy = h * 0.35;
  const omg = x.createRadialGradient(omx, omy, 5, omx, omy, 50);
  omg.addColorStop(0, "rgba(200,120,60,0.6)"); omg.addColorStop(0.5, "rgba(180,100,45,0.3)"); omg.addColorStop(1, "rgba(160,80,30,0)");
  x.fillStyle = omg; x.beginPath(); x.arc(omx, omy, 50, 0, Math.PI * 2); x.fill();
  // Caldera
  x.fillStyle = "rgba(80,30,10,0.4)"; x.beginPath(); x.arc(omx, omy, 8, 0, Math.PI * 2); x.fill();
  // Polar ice caps
  for (const [py, ph] of [[0, 55], [h - 50, 50]] as [number, number][]) {
    const pg = x.createLinearGradient(0, py, 0, py + ph);
    pg.addColorStop(0, py === 0 ? "rgba(240,235,225,0.7)" : "rgba(240,235,225,0)");
    pg.addColorStop(1, py === 0 ? "rgba(240,235,225,0)" : "rgba(240,235,225,0.65)");
    x.fillStyle = pg; x.fillRect(0, py, w, ph);
  }
  // Craters
  for (let i = 0; i < 120; i++) {
    const px = rng() * w, py = rng() * h, r = 2 + rng() * 12;
    x.fillStyle = `rgba(70,25,8,${(0.15 + rng() * 0.2).toFixed(2)})`;
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ── Jupiter ── */
function makeJupiterTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  const bands = ["#f5deb3","#deb887","#cd853f","#d2691e","#f5deb3","#c17c3e","#a0522d","#e8c39e","#d4915a","#8b4513","#deb887","#c17c3e","#cd853f","#f5deb3","#a0522d","#d2691e"];
  const bh = h / bands.length;
  for (let i = 0; i < bands.length; i++) {
    x.fillStyle = bands[i]; x.fillRect(0, i * bh, w, bh + 2);
  }
  const rng = seededRandom(123);
  // Band edge turbulence
  for (let i = 0; i < 4000; i++) {
    const py = rng() * h;
    const bandIdx = Math.floor(py / bh);
    const nearEdge = Math.abs((py % bh) - bh / 2) > bh * 0.35;
    if (!nearEdge && rng() > 0.3) continue;
    x.fillStyle = `rgba(${140 + rng() * 115|0},${90 + rng() * 100|0},${40 + rng() * 80|0},${(0.08 + rng() * 0.12).toFixed(2)})`;
    x.beginPath(); x.ellipse(rng() * w, py, 15 + rng() * 60, 2 + rng() * 6, rng() * 0.4, 0, Math.PI * 2); x.fill();
  }
  // Great Red Spot
  const gx = w * 0.68, gy = h * 0.6;
  // Outer swirl
  for (let a = 0; a < 50; a++) {
    const angle = a * 0.4 + rng() * 0.3;
    const dist = 25 + a * 1.8;
    x.fillStyle = `rgba(${180 + rng() * 40|0},${70 + rng() * 50|0},${20 + rng() * 30|0},${(0.15 - a * 0.002).toFixed(3)})`;
    x.beginPath(); x.ellipse(gx + Math.cos(angle) * dist, gy + Math.sin(angle) * dist * 0.6, 10 + rng() * 20, 3 + rng() * 6, angle, 0, Math.PI * 2); x.fill();
  }
  // Core
  const rg = x.createRadialGradient(gx, gy, 5, gx, gy, 55);
  rg.addColorStop(0, "rgba(180,30,15,0.9)"); rg.addColorStop(0.4, "rgba(200,70,30,0.7)"); rg.addColorStop(1, "rgba(210,120,70,0.2)");
  x.fillStyle = rg; x.beginPath(); x.ellipse(gx, gy, 60, 36, 0, 0, Math.PI * 2); x.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ── Saturn ── */
function makeSaturnTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  const bands = ["#f0e6c8","#e8d5a3","#d4b86a","#c9a84c","#e2c98a","#b8923a","#f0e0b0","#c9a84c","#d4b86a","#e8d5a3","#c9a84c","#b8923a"];
  const bh = h / bands.length;
  for (let i = 0; i < bands.length; i++) { x.fillStyle = bands[i]; x.fillRect(0, i * bh, w, bh + 2); }
  const rng = seededRandom(456);
  for (let i = 0; i < 2000; i++) {
    x.fillStyle = `rgba(${200 + rng() * 55|0},${170 + rng() * 60|0},${100 + rng() * 55|0},${(0.05 + rng() * 0.1).toFixed(2)})`;
    x.beginPath(); x.ellipse(rng() * w, rng() * h, 15 + rng() * 40, 2 + rng() * 5, rng() * 0.2, 0, Math.PI * 2); x.fill();
  }
  // Subtle north polar hexagon hint
  x.strokeStyle = "rgba(180,160,120,0.12)"; x.lineWidth = 3;
  x.beginPath(); for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const px = w * 0.5 + Math.cos(a) * 60, py = 50 + Math.sin(a) * 20;
    i === 0 ? x.moveTo(px, py) : x.lineTo(px, py);
  } x.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeSaturnRingTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = 2048; c.height = 64;
  const x = c.getContext("2d")!;
  const bands = [
    [0, 0.03, "rgba(180,160,120,0)"], [0.03, 0.08, "rgba(200,180,140,0.4)"],
    [0.08, 0.15, "rgba(190,170,130,0.7)"], [0.15, 0.22, "rgba(210,190,150,0.85)"],
    [0.22, 0.28, "rgba(220,200,160,0.92)"], [0.28, 0.32, "rgba(160,140,100,0.3)"],
    [0.32, 0.42, "rgba(200,185,145,0.88)"], [0.42, 0.55, "rgba(215,195,155,0.95)"],
    [0.55, 0.62, "rgba(190,170,130,0.75)"], [0.62, 0.68, "rgba(170,150,110,0.5)"],
    [0.68, 0.78, "rgba(205,185,145,0.82)"], [0.78, 0.88, "rgba(185,165,125,0.6)"],
    [0.88, 0.95, "rgba(160,140,100,0.25)"], [0.95, 1.0, "rgba(140,120,90,0)"],
  ];
  for (const [start, end, col] of bands) {
    x.fillStyle = col as string;
    x.fillRect((start as number) * 2048, 0, ((end as number) - (start as number)) * 2048 + 2, 64);
  }
  // Fine ring detail
  const rng = seededRandom(789);
  for (let i = 0; i < 300; i++) {
    const px = rng() * 2048;
    x.fillStyle = `rgba(${160 + rng() * 60|0},${140 + rng() * 50|0},${100 + rng() * 40|0},${(0.05 + rng() * 0.1).toFixed(2)})`;
    x.fillRect(px, 0, 1 + rng() * 3, 64);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ── Uranus ── */
function makeUranusTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#7dd3c0"); g.addColorStop(0.25, "#5eead4"); g.addColorStop(0.5, "#2dd4bf");
  g.addColorStop(0.75, "#5eead4"); g.addColorStop(1, "#7dd3c0");
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  const rng = seededRandom(111);
  for (let y = 0; y < h; y += 4) {
    x.fillStyle = `rgba(${90 + (y % 35)},${200 + (y % 25)},${190 + (y % 20)},0.12)`;
    x.fillRect(0, y, w, 3);
  }
  for (let i = 0; i < 200; i++) {
    x.fillStyle = `rgba(${100 + rng() * 60|0},${220 + rng() * 35|0},${210 + rng() * 30|0},0.06)`;
    x.beginPath(); x.ellipse(rng() * w, rng() * h, 30 + rng() * 80, 5 + rng() * 12, rng() * 0.2, 0, Math.PI * 2); x.fill();
  }
  // Polar brightening
  x.fillStyle = "rgba(200,250,245,0.12)"; x.fillRect(0, 0, w, 80); x.fillRect(0, h - 80, w, 80);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ── Neptune ── */
function makeNeptuneTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#2d2b80"); g.addColorStop(0.3, "#3730a3"); g.addColorStop(0.5, "#4338ca");
  g.addColorStop(0.7, "#3730a3"); g.addColorStop(1, "#2d2b80");
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  const rng = seededRandom(222);
  for (let y = 0; y < h; y += 6) {
    x.fillStyle = `rgba(${50 + (y % 40)},${45 + (y % 35)},${160 + (y % 40)},0.18)`;
    x.fillRect(0, y, w, 4);
  }
  for (let i = 0; i < 300; i++) {
    x.fillStyle = `rgba(${60 + rng() * 50|0},${55 + rng() * 45|0},${170 + rng() * 50|0},0.08)`;
    x.beginPath(); x.ellipse(rng() * w, rng() * h, 20 + rng() * 70, 4 + rng() * 10, rng() * 0.3, 0, Math.PI * 2); x.fill();
  }
  // Great Dark Spot
  const dx = w * 0.55, dy = h * 0.45;
  const dg = x.createRadialGradient(dx, dy, 5, dx, dy, 50);
  dg.addColorStop(0, "rgba(15,12,60,0.7)"); dg.addColorStop(0.6, "rgba(25,20,80,0.4)"); dg.addColorStop(1, "rgba(40,35,100,0)");
  x.fillStyle = dg; x.beginPath(); x.ellipse(dx, dy, 55, 30, -0.15, 0, Math.PI * 2); x.fill();
  // White companion cloud
  x.fillStyle = "rgba(200,220,255,0.3)";
  x.beginPath(); x.ellipse(dx - 10, dy - 40, 40, 8, -0.1, 0, Math.PI * 2); x.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ════════════════════════════════════════════════════════════════
   TEXTURE MAP — slug → generators
   ════════════════════════════════════════════════════════════════ */
function getTexturesForPlanet(slug: string) {
  switch (slug) {
    case "mercury": return { map: makeMercuryTexture(), bump: makeMercuryBump() };
    case "venus":   return { map: makeVenusTexture() };
    case "earth":   return { map: makeEarthTexture(), clouds: makeEarthClouds() };
    case "mars":    return { map: makeMarsTexture() };
    case "jupiter": return { map: makeJupiterTexture() };
    case "saturn":  return { map: makeSaturnTexture(), ring: makeSaturnRingTexture() };
    case "uranus":  return { map: makeUranusTexture() };
    case "neptune": return { map: makeNeptuneTexture() };
    default:        return { map: makeEarthTexture() };
  }
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */
export function PlanetCanvas({ planet }: PlanetCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 550;

    // ─── Scene ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 7);

    // ─── Renderer ───
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // ─── OrbitControls ───
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 15;
    controls.rotateSpeed = 0.4;
    controls.zoomSpeed = 0.6;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // ─── Lighting ───
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const sunLight = new THREE.DirectionalLight(0xfff8f0, 3.0);
    sunLight.position.set(10, 6, 8);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.4);
    fillLight.position.set(-8, -4, -6);
    scene.add(fillLight);

    const hexColor = planet.color.startsWith("#") ? parseInt(planet.color.replace("#", ""), 16) : 0x38bdf8;
    const rimLight = new THREE.PointLight(hexColor, 1.5, 30);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    // ─── Textures ───
    const textures = getTexturesForPlanet(planet.slug);

    // ─── Planet ───
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const radius = 2.5;
    const pGeo = new THREE.SphereGeometry(radius, 128, 128);
    const pMat = new THREE.MeshStandardMaterial({
      map: textures.map,
      bumpMap: textures.bump,
      bumpScale: textures.bump ? 0.04 : 0,
      roughness: planet.slug === "venus" ? 0.7 : 0.5,
      metalness: 0.08,
    });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    planetGroup.add(pMesh);

    // ─── Earth Cloud Layer ───
    let cloudMesh: THREE.Mesh | undefined;
    if (textures.clouds) {
      const cloudGeo = new THREE.SphereGeometry(radius * 1.012, 96, 96);
      const cloudMat = new THREE.MeshStandardMaterial({
        map: textures.clouds,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });
      cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      planetGroup.add(cloudMesh);
    }

    // ─── Atmosphere Glow (Fresnel-like) ───
    const atmoGeo = new THREE.SphereGeometry(radius * 1.04, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: hexColor,
      transparent: true,
      opacity: planet.slug === "mercury" ? 0.05 : 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    planetGroup.add(new THREE.Mesh(atmoGeo, atmoMat));

    // Second atmosphere layer for gas giants
    if (["jupiter", "saturn", "uranus", "neptune"].includes(planet.slug)) {
      const atmo2 = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.08, 32, 32),
        new THREE.MeshBasicMaterial({ color: hexColor, transparent: true, opacity: 0.06, side: THREE.BackSide, blending: THREE.AdditiveBlending })
      );
      planetGroup.add(atmo2);
    }

    // ─── Saturn Rings ───
    if (planet.slug === "saturn" && textures.ring) {
      const ringGeo = new THREE.RingGeometry(radius * 1.3, radius * 2.5, 128);
      // Fix ring UV mapping for radial texture
      const pos = ringGeo.attributes.position;
      const uv = ringGeo.attributes.uv;
      const v3 = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i);
        const len = v3.length();
        (uv as THREE.BufferAttribute).setXY(i, (len - radius * 1.3) / (radius * 1.2), 0.5);
      }
      const ringMat = new THREE.MeshBasicMaterial({
        map: textures.ring,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.1;
      pMesh.add(ringMesh);
    }

    // ─── Orbiting Moon ───
    const moonGroup = new THREE.Group();
    planetGroup.add(moonGroup);
    const moonGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({ color: 0xc8d6e5, roughness: 0.85 });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(4.5, 0.3, 0);
    moonGroup.add(moonMesh);

    // ─── Background Stars ───
    const starCount = 800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 30 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.5, color: 0xffffff, transparent: true, opacity: 0.7 })));

    // ─── Resize ───
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth, h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ─── Animation ───
    let animId: number;
    const clock = new THREE.Clock();

    const rotSpeed = planet.slug === "venus" ? -0.05 : planet.slug === "mercury" ? 0.03 : 0.12;

    const animate = () => {
      const delta = clock.getDelta();
      pMesh.rotation.y += delta * rotSpeed;
      if (cloudMesh) cloudMesh.rotation.y += delta * rotSpeed * 1.15;
      moonGroup.rotation.y += delta * 0.35;
      moonMesh.rotation.y += delta * 0.15;
      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [planet]);

  return <div ref={mountRef} className="w-full h-full min-h-[550px] relative overflow-hidden" />;
}
