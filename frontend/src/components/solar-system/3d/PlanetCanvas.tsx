"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PlanetDetail } from "@/mocks/solar-system/planets";

interface PlanetCanvasProps {
  planet: PlanetDetail;
}

/* ════════════════════════════════════════════════════════════════
   HIGH-DEFINITION PROCEDURAL TEXTURE GENERATORS (2048x1024)
   Crisp landmass coastlines, biomes, bump maps, and cloud systems
   ════════════════════════════════════════════════════════════════ */

// Seeded PRNG for deterministic procedural textures
function seededPRNG(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Smooth Organic Blob Helper for Coastlines ── */
function drawOrganicBlob(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  points: number,
  roughness: number,
  rng: () => number
) {
  ctx.beginPath();
  const angleStep = (Math.PI * 2) / points;
  const radii: number[] = [];
  for (let i = 0; i < points; i++) {
    radii.push(1 + (rng() - 0.5) * roughness);
  }
  for (let i = 0; i <= points; i++) {
    const idx = i % points;
    const angle = i * angleStep;
    const rX = radiusX * radii[idx];
    const rY = radiusY * radii[idx];
    const x = centerX + Math.cos(angle) * rX;
    const y = centerY + Math.sin(angle) * rY;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/* ─────────────────────────────────────────────────────────────
   1. EARTH: CRISP CONTINENTS, COASTAL SHELVES, BIOMES & BUMP
   ───────────────────────────────────────────────────────────── */
function makeEarthTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;

  // 1. Deep Ocean Base
  const og = x.createLinearGradient(0, 0, 0, h);
  og.addColorStop(0, "#051329");
  og.addColorStop(0.2, "#082142");
  og.addColorStop(0.5, "#0b2e5c");
  og.addColorStop(0.8, "#082142");
  og.addColorStop(1, "#051329");
  x.fillStyle = og;
  x.fillRect(0, 0, w, h);

  const rng = seededPRNG(1001);

  // 2. Continental Definitions & Coastlines
  const landmasses = [
    // Eurasia
    { cx: 0.38, cy: 0.28, rx: 0.18, ry: 0.12, col: "#2d6a4f", shelf: "#1a708a" },
    { cx: 0.48, cy: 0.25, rx: 0.14, ry: 0.1, col: "#387d59", shelf: "#1b7894" },
    { cx: 0.28, cy: 0.24, rx: 0.07, ry: 0.06, col: "#40916c", shelf: "#1e82a0" }, // Europe
    // Africa
    { cx: 0.25, cy: 0.52, rx: 0.09, ry: 0.14, col: "#688d40", shelf: "#1b7894" },
    // North America
    { cx: 0.78, cy: 0.26, rx: 0.13, ry: 0.1, col: "#2d6a4f", shelf: "#1a708a" },
    // South America
    { cx: 0.73, cy: 0.62, rx: 0.07, ry: 0.13, col: "#1b4332", shelf: "#18667e" },
    // Australia
    { cx: 0.58, cy: 0.72, rx: 0.07, ry: 0.06, col: "#aa8245", shelf: "#2294b5" },
    // Greenland
    { cx: 0.84, cy: 0.12, rx: 0.05, ry: 0.04, col: "#dce7eb", shelf: "#2ca5c8" },
    // Antarctica & Arctic
    { cx: 0.5, cy: 0.95, rx: 0.48, ry: 0.07, col: "#f0f4f8", shelf: "#3bb8dc" },
    { cx: 0.5, cy: 0.03, rx: 0.45, ry: 0.04, col: "#e6eef2", shelf: "#30aed2" },
  ];

  // Draw Shallow Water Coastal Shelves first
  for (const lm of landmasses) {
    x.fillStyle = lm.shelf;
    x.globalAlpha = 0.5;
    drawOrganicBlob(x, lm.cx * w, lm.cy * h, lm.rx * w * 1.15, lm.ry * h * 1.15, 24, 0.3, rng);
    x.fill();
  }

  // Draw Solid Landmasses
  for (const lm of landmasses) {
    x.fillStyle = lm.col;
    x.globalAlpha = 1.0;
    drawOrganicBlob(x, lm.cx * w, lm.cy * h, lm.rx * w, lm.ry * h, 28, 0.35, rng);
    x.fill();

    // Inner terrain variations (Forests, Tundra, Mountains)
    for (let i = 0; i < 15; i++) {
      const px = (lm.cx + (rng() - 0.5) * lm.rx * 1.4) * w;
      const py = (lm.cy + (rng() - 0.5) * lm.ry * 1.4) * h;
      const prx = lm.rx * w * (0.15 + rng() * 0.2);
      const pry = lm.ry * h * (0.15 + rng() * 0.2);
      x.fillStyle = rng() > 0.5 ? "#1b4332" : "#52b788";
      x.globalAlpha = 0.6;
      drawOrganicBlob(x, px, py, prx, pry, 16, 0.4, rng);
      x.fill();
    }
  }

  // Desert Belts (Sahara, Arabian, Australian Outback)
  const deserts = [
    { cx: 0.24, cy: 0.42, rx: 0.07, ry: 0.04, col: "#d4a359" }, // Sahara
    { cx: 0.33, cy: 0.4, rx: 0.04, ry: 0.03, col: "#c99447" },  // Arabian
    { cx: 0.58, cy: 0.72, rx: 0.05, ry: 0.04, col: "#c27c38" }, // Outback
  ];
  for (const d of deserts) {
    x.fillStyle = d.col;
    x.globalAlpha = 0.85;
    drawOrganicBlob(x, d.cx * w, d.cy * h, d.rx * w, d.ry * h, 18, 0.3, rng);
    x.fill();
  }

  // Mountain Ranges (Himalayas, Andes, Rockies)
  x.strokeStyle = "rgba(40, 30, 20, 0.4)";
  x.lineWidth = 4;
  x.globalAlpha = 0.7;
  // Himalayas
  x.beginPath(); x.moveTo(w * 0.34, h * 0.32); x.lineTo(w * 0.42, h * 0.34); x.stroke();
  // Andes
  x.beginPath(); x.moveTo(w * 0.69, h * 0.52); x.lineTo(w * 0.67, h * 0.78); x.stroke();
  // Rockies
  x.beginPath(); x.moveTo(w * 0.73, h * 0.2); x.lineTo(w * 0.75, h * 0.35); x.stroke();

  x.globalAlpha = 1.0;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ── Earth Specular Map (Ocean Reflective, Land Matte) ── */
function makeEarthSpecularMap(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  // Bright white oceans = specular shine
  x.fillStyle = "#ffffff";
  x.fillRect(0, 0, w, h);

  const rng = seededPRNG(1001);
  const landmasses = [
    { cx: 0.38, cy: 0.28, rx: 0.18, ry: 0.12 },
    { cx: 0.48, cy: 0.25, rx: 0.14, ry: 0.1 },
    { cx: 0.28, cy: 0.24, rx: 0.07, ry: 0.06 },
    { cx: 0.25, cy: 0.52, rx: 0.09, ry: 0.14 },
    { cx: 0.78, cy: 0.26, rx: 0.13, ry: 0.1 },
    { cx: 0.73, cy: 0.62, rx: 0.07, ry: 0.13 },
    { cx: 0.58, cy: 0.72, rx: 0.07, ry: 0.06 },
    { cx: 0.84, cy: 0.12, rx: 0.05, ry: 0.04 },
    { cx: 0.5, cy: 0.95, rx: 0.48, ry: 0.07 },
    { cx: 0.5, cy: 0.03, rx: 0.45, ry: 0.04 },
  ];
  // Dark land = non-reflective matte
  x.fillStyle = "#111111";
  for (const lm of landmasses) {
    drawOrganicBlob(x, lm.cx * w, lm.cy * h, lm.rx * w, lm.ry * h, 28, 0.35, rng);
    x.fill();
  }
  return new THREE.CanvasTexture(c);
}

/* ── Earth Crisp Cloud System (Smooth Weather Swirls, No Blob Rings) ── */
function makeEarthClouds(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  x.clearRect(0, 0, w, h);

  const rng = seededPRNG(3003);

  // Smooth continuous cloud bands
  for (let b = 0; b < 12; b++) {
    const cy = (0.15 + (b / 12) * 0.7) * h;
    const bandHeight = 25 + rng() * 40;

    x.beginPath();
    x.moveTo(0, cy);
    for (let px = 0; px <= w; px += 40) {
      const py = cy + Math.sin(px * 0.008 + b * 1.5) * 35 + (rng() - 0.5) * 15;
      x.lineTo(px, py);
    }
    x.strokeStyle = `rgba(255, 255, 255, ${(0.25 + rng() * 0.35).toFixed(2)})`;
    x.lineWidth = bandHeight;
    x.lineCap = "round";
    x.stroke();
  }

  // Cyclonic Storm Swirls
  const storms = [
    { cx: 0.3, cy: 0.35, r: 80 },
    { cx: 0.75, cy: 0.3, r: 95 },
    { cx: 0.5, cy: 0.65, r: 70 },
  ];
  for (const st of storms) {
    const sx = st.cx * w, sy = st.cy * h;
    x.strokeStyle = "rgba(255, 255, 255, 0.5)";
    x.lineWidth = 8;
    for (let a = 0; a < 8; a++) {
      const angle = a * 0.8;
      const r = st.r * (0.2 + a * 0.1);
      x.beginPath();
      x.arc(sx, sy, r, angle, angle + 1.8);
      x.stroke();
    }
  }

  return new THREE.CanvasTexture(c);
}

/* ── Earth Topography Bump Map ── */
function makeEarthBump(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  x.fillStyle = "#808080";
  x.fillRect(0, 0, w, h);

  const rng = seededPRNG(1001);
  const landmasses = [
    { cx: 0.38, cy: 0.28, rx: 0.18, ry: 0.12 },
    { cx: 0.48, cy: 0.25, rx: 0.14, ry: 0.1 },
    { cx: 0.28, cy: 0.24, rx: 0.07, ry: 0.06 },
    { cx: 0.25, cy: 0.52, rx: 0.09, ry: 0.14 },
    { cx: 0.78, cy: 0.26, rx: 0.13, ry: 0.1 },
    { cx: 0.73, cy: 0.62, rx: 0.07, ry: 0.13 },
    { cx: 0.58, cy: 0.72, rx: 0.07, ry: 0.06 },
  ];

  x.fillStyle = "#b0b0b0";
  for (const lm of landmasses) {
    drawOrganicBlob(x, lm.cx * w, lm.cy * h, lm.rx * w, lm.ry * h, 28, 0.35, rng);
    x.fill();
  }
  // Mountain Ridge Highs
  x.strokeStyle = "#ffffff";
  x.lineWidth = 6;
  x.beginPath(); x.moveTo(w * 0.34, h * 0.32); x.lineTo(w * 0.42, h * 0.34); x.stroke();
  x.beginPath(); x.moveTo(w * 0.69, h * 0.52); x.lineTo(w * 0.67, h * 0.78); x.stroke();
  x.beginPath(); x.moveTo(w * 0.73, h * 0.2); x.lineTo(w * 0.75, h * 0.35); x.stroke();

  return new THREE.CanvasTexture(c);
}

/* ─────────────────────────────────────────────────────────────
   2. MARS: VALLES MARINERIS, OLYMPUS MONS, POLAR CAPS & BASALTS
   ───────────────────────────────────────────────────────────── */
function makeMarsTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;

  // Base Red Regolith
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#8a2f10");
  g.addColorStop(0.2, "#b8471b");
  g.addColorStop(0.5, "#cd5422");
  g.addColorStop(0.8, "#b8471b");
  g.addColorStop(1, "#8a2f10");
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);

  const rng = seededPRNG(5005);

  // Dark Basaltic Maria Regions (Syrtis Major, Acidalia)
  const maria = [
    { cx: 0.45, cy: 0.52, rx: 0.12, ry: 0.14, col: "#3d1408" },
    { cx: 0.68, cy: 0.38, rx: 0.15, ry: 0.12, col: "#48180a" },
    { cx: 0.22, cy: 0.65, rx: 0.1, ry: 0.08, col: "#3b1206" },
  ];
  for (const m of maria) {
    x.fillStyle = m.col;
    x.globalAlpha = 0.8;
    drawOrganicBlob(x, m.cx * w, m.cy * h, m.rx * w, m.ry * h, 22, 0.4, rng);
    x.fill();
  }

  // Valles Marineris Canyon System
  x.globalAlpha = 1.0;
  x.strokeStyle = "#240a04";
  x.lineWidth = 14;
  x.lineCap = "round";
  x.beginPath();
  x.moveTo(w * 0.22, h * 0.48);
  x.bezierCurveTo(w * 0.35, h * 0.46, w * 0.48, h * 0.44, w * 0.62, h * 0.48);
  x.stroke();

  x.strokeStyle = "#e86b36";
  x.lineWidth = 3;
  x.beginPath();
  x.moveTo(w * 0.22, h * 0.47);
  x.bezierCurveTo(w * 0.35, h * 0.45, w * 0.48, h * 0.43, w * 0.62, h * 0.47);
  x.stroke();

  // Olympus Mons Volcano Shield & Caldera
  const omx = w * 0.16, omy = h * 0.36;
  const omg = x.createRadialGradient(omx, omy, 4, omx, omy, 65);
  omg.addColorStop(0, "#f0834e");
  omg.addColorStop(0.4, "#b84f21");
  omg.addColorStop(1, "rgba(138, 47, 16, 0)");
  x.fillStyle = omg;
  x.beginPath(); x.arc(omx, omy, 65, 0, Math.PI * 2); x.fill();
  // Caldera Crater Rim
  x.fillStyle = "#240a04";
  x.beginPath(); x.arc(omx, omy, 10, 0, Math.PI * 2); x.fill();

  // Crisp Polar Ice Caps
  x.fillStyle = "#f5f2eb";
  // North Pole Cap
  x.beginPath();
  x.ellipse(w * 0.5, h * 0.04, w * 0.4, h * 0.05, 0, 0, Math.PI * 2);
  x.fill();
  // South Pole Cap
  x.beginPath();
  x.ellipse(w * 0.5, h * 0.96, w * 0.35, h * 0.04, 0, 0, Math.PI * 2);
  x.fill();

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeMarsBump(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  x.fillStyle = "#808080";
  x.fillRect(0, 0, w, h);

  // Valles Marineris Depth Trench
  x.strokeStyle = "#101010";
  x.lineWidth = 14;
  x.beginPath();
  x.moveTo(w * 0.22, h * 0.48);
  x.bezierCurveTo(w * 0.35, h * 0.46, w * 0.48, h * 0.44, w * 0.62, h * 0.48);
  x.stroke();

  // Olympus Mons Elevation Peak
  const omx = w * 0.16, omy = h * 0.36;
  const omg = x.createRadialGradient(omx, omy, 2, omx, omy, 65);
  omg.addColorStop(0, "#ffffff");
  omg.addColorStop(1, "#808080");
  x.fillStyle = omg;
  x.beginPath(); x.arc(omx, omy, 65, 0, Math.PI * 2); x.fill();

  return new THREE.CanvasTexture(c);
}

/* ─────────────────────────────────────────────────────────────
   3. JUPITER: CRISP ATMOSPHERIC BELTS & DETAILED GREAT RED SPOT
   ───────────────────────────────────────────────────────────── */
function makeJupiterTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;

  const bands = [
    "#ebd4b5", "#ba7843", "#d89660", "#9e4e29", "#f2d6b3", "#c77c44",
    "#7e361b", "#dfaa7c", "#c87d46", "#8a3a1f", "#e4b993", "#b96f3a"
  ];
  const bh = h / bands.length;

  for (let i = 0; i < bands.length; i++) {
    x.fillStyle = bands[i];
    x.fillRect(0, i * bh, w, bh + 2);
  }

  // Harmonic Wave Distortions on Band Edges
  for (let i = 0; i < bands.length; i++) {
    const yEdge = i * bh;
    x.beginPath();
    x.moveTo(0, yEdge);
    for (let px = 0; px <= w; px += 20) {
      const dy = Math.sin(px * 0.015 + i * 2.1) * 8 + Math.cos(px * 0.03) * 4;
      x.lineTo(px, yEdge + dy);
    }
    x.lineTo(w, yEdge + bh);
    x.lineTo(0, yEdge + bh);
    x.closePath();
    x.fillStyle = bands[(i + 1) % bands.length];
    x.globalAlpha = 0.4;
    x.fill();
  }
  x.globalAlpha = 1.0;

  // Great Red Spot with Multi-layered Swirl Rings
  const gx = w * 0.65, gy = h * 0.58;
  const grsGrad = x.createRadialGradient(gx, gy, 4, gx, gy, 70);
  grsGrad.addColorStop(0, "#cc2c16");
  grsGrad.addColorStop(0.4, "#e05828");
  grsGrad.addColorStop(0.8, "#d1855a");
  grsGrad.addColorStop(1, "rgba(224, 88, 40, 0)");
  x.fillStyle = grsGrad;
  x.beginPath(); x.ellipse(gx, gy, 75, 42, 0, 0, Math.PI * 2); x.fill();

  // Spiral Vortex Rings inside GRS
  x.strokeStyle = "rgba(140, 25, 10, 0.6)";
  x.lineWidth = 4;
  for (let r = 12; r < 38; r += 8) {
    x.beginPath();
    x.ellipse(gx, gy, r * 1.6, r, 0.2, 0, Math.PI * 2);
    x.stroke();
  }

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ─────────────────────────────────────────────────────────────
   4. SATURN: ATMOSPHERIC BELTS & CRISP RING SYSTEM
   ───────────────────────────────────────────────────────────── */
function makeSaturnTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;

  const bands = ["#f2e8cf", "#e3d1a4", "#d1b873", "#c7a858", "#dec283", "#b59241", "#ebdcae"];
  const bh = h / bands.length;
  for (let i = 0; i < bands.length; i++) {
    x.fillStyle = bands[i];
    x.fillRect(0, i * bh, w, bh + 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeSaturnRingTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = 2048; c.height = 64;
  const x = c.getContext("2d")!;
  const ringBands = [
    { start: 0.0, end: 0.05, col: "rgba(0,0,0,0)" },
    { start: 0.05, end: 0.22, col: "rgba(180, 160, 120, 0.6)" },
    { start: 0.22, end: 0.26, col: "rgba(0,0,0,0.15)" }, // Cassini Division
    { start: 0.26, end: 0.65, col: "rgba(215, 195, 150, 0.95)" },
    { start: 0.65, end: 0.88, col: "rgba(195, 175, 130, 0.75)" },
    { start: 0.88, end: 1.0, col: "rgba(0,0,0,0)" },
  ];
  for (const rb of ringBands) {
    x.fillStyle = rb.col;
    x.fillRect(rb.start * 2048, 0, (rb.end - rb.start) * 2048 + 2, 64);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ─────────────────────────────────────────────────────────────
   5. MERCURY: CRATERS, CALORIS BASIN & BUMP MAP
   ───────────────────────────────────────────────────────────── */
function makeMercuryTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  x.fillStyle = "#8a837c";
  x.fillRect(0, 0, w, h);

  const rng = seededPRNG(9009);

  // Craters with crisp lighting rims
  for (let i = 0; i < 450; i++) {
    const px = rng() * w, py = rng() * h, r = 4 + rng() * 24;
    // Crater Floor
    x.fillStyle = "#5c5650";
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
    // Sunlit Rim
    x.strokeStyle = "#cfc8c0";
    x.lineWidth = 2;
    x.beginPath(); x.arc(px - 1, py - 1, r, -1.2, 0.8); x.stroke();
    // Shadow Rim
    x.strokeStyle = "#38332e";
    x.beginPath(); x.arc(px + 1, py + 1, r, 1.8, 3.8); x.stroke();
  }

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeMercuryBump(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  x.fillStyle = "#808080";
  x.fillRect(0, 0, w, h);

  const rng = seededPRNG(9009);
  for (let i = 0; i < 450; i++) {
    const px = rng() * w, py = rng() * h, r = 4 + rng() * 24;
    x.fillStyle = "#303030";
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
    x.fillStyle = "#ffffff";
    x.beginPath(); x.arc(px - 2, py - 2, r * 0.3, 0, Math.PI * 2); x.fill();
  }
  return new THREE.CanvasTexture(c);
}

/* ─────────────────────────────────────────────────────────────
   6. VENUS, URANUS, NEPTUNE
   ───────────────────────────────────────────────────────────── */
function makeVenusTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  
  // Base Golden Volcanic Regolith
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#a06a20");
  g.addColorStop(0.3, "#d89c3e");
  g.addColorStop(0.5, "#e5b054");
  g.addColorStop(0.7, "#d89c3e");
  g.addColorStop(1, "#a06a20");
  x.fillStyle = g; x.fillRect(0, 0, w, h);

  const rng = seededPRNG(9090);

  // Volcanic Lava Flow Highlands (Aphrodite & Ishtar Terra)
  const terra = [
    { cx: 0.35, cy: 0.45, rx: 0.22, ry: 0.12, col: "#844f10" },
    { cx: 0.65, cy: 0.3, rx: 0.18, ry: 0.1, col: "#6e3f08" },
    { cx: 0.52, cy: 0.65, rx: 0.15, ry: 0.14, col: "#844f10" },
  ];
  for (const t of terra) {
    x.fillStyle = t.col;
    x.globalAlpha = 0.75;
    drawOrganicBlob(x, t.cx * w, t.cy * h, t.rx * w, t.ry * h, 26, 0.4, rng);
    x.fill();
  }

  // Bright Lava Fractures & Maxwell Montes Ridges
  x.strokeStyle = "rgba(255, 230, 160, 0.6)";
  x.lineWidth = 4;
  x.globalAlpha = 0.8;
  for (let i = 0; i < 10; i++) {
    const py = (0.2 + rng() * 0.6) * h;
    x.beginPath();
    x.moveTo(rng() * w, py);
    x.bezierCurveTo(rng() * w, py - 30, rng() * w, py + 30, rng() * w, py);
    x.stroke();
  }
  x.globalAlpha = 1.0;

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeUranusTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#7dd3c0"); g.addColorStop(0.5, "#2dd4bf"); g.addColorStop(1, "#7dd3c0");
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeNeptuneTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#2d2b80"); g.addColorStop(0.5, "#4338ca"); g.addColorStop(1, "#2d2b80");
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  // Great Dark Spot
  const dx = w * 0.55, dy = h * 0.45;
  const dg = x.createRadialGradient(dx, dy, 5, dx, dy, 50);
  dg.addColorStop(0, "rgba(15,12,60,0.8)"); dg.addColorStop(1, "rgba(40,35,100,0)");
  x.fillStyle = dg; x.beginPath(); x.ellipse(dx, dy, 60, 32, -0.15, 0, Math.PI * 2); x.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ─────────────────────────────────────────────────────────────
   7. SUN: HIGH-DEFINITION 4K SOLAR PLASMA, GRANULATION & SUNSPOTS
   ───────────────────────────────────────────────────────────── */
function makeSunTexture(w = 2048, h = 1024): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!;

  // Radiant Glowing Plasma Base Gradient
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#ffe066");
  g.addColorStop(0.25, "#ffb700");
  g.addColorStop(0.5, "#ff7700");
  g.addColorStop(0.75, "#ff9900");
  g.addColorStop(1, "#ffe066");
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);

  const rng = seededPRNG(8888);

  // Solar Convection Granulation Cells (10,000+ granules)
  for (let i = 0; i < 10000; i++) {
    const px = rng() * w, py = rng() * h;
    const r = 2 + rng() * 6;
    const lum = rng();
    if (lum > 0.6) {
      x.fillStyle = `rgba(255, 245, 180, ${(0.15 + rng() * 0.25).toFixed(2)})`;
    } else if (lum > 0.3) {
      x.fillStyle = `rgba(255, 150, 20, ${(0.12 + rng() * 0.2).toFixed(2)})`;
    } else {
      x.fillStyle = `rgba(180, 50, 0, ${(0.1 + rng() * 0.15).toFixed(2)})`;
    }
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
  }

  // Active Sunspot Clusters with Umbra, Penumbra & Faculae
  const sunspots = [
    { cx: 0.35, cy: 0.42, rx: 28, ry: 20 },
    { cx: 0.38, cy: 0.45, rx: 18, ry: 14 },
    { cx: 0.65, cy: 0.55, rx: 32, ry: 22 },
    { cx: 0.68, cy: 0.52, rx: 20, ry: 16 },
    { cx: 0.52, cy: 0.32, rx: 22, ry: 18 },
    { cx: 0.22, cy: 0.6, rx: 16, ry: 12 },
  ];

  for (const ss of sunspots) {
    const px = ss.cx * w, py = ss.cy * h;

    // Bright Faculae Magnetic Aura
    const fg = x.createRadialGradient(px, py, ss.rx * 0.5, px, py, ss.rx * 2.4);
    fg.addColorStop(0, "rgba(255, 255, 240, 0.65)");
    fg.addColorStop(0.5, "rgba(255, 200, 80, 0.35)");
    fg.addColorStop(1, "rgba(255, 140, 0, 0)");
    x.fillStyle = fg;
    drawOrganicBlob(x, px, py, ss.rx * 2.2, ss.ry * 2.2, 20, 0.3, rng);
    x.fill();

    // Penumbra (Wispy Reddish-Brown Transition Halo)
    x.fillStyle = "#8a2a00";
    x.globalAlpha = 0.85;
    drawOrganicBlob(x, px, py, ss.rx, ss.ry, 24, 0.4, rng);
    x.fill();

    // Umbra (Cooler Dark Magnetic Core Pores)
    x.fillStyle = "#1e0600";
    x.globalAlpha = 0.95;
    drawOrganicBlob(x, px, py, ss.rx * 0.5, ss.ry * 0.5, 20, 0.45, rng);
    x.fill();

    // Micro-pores around main sunspot
    for (let p = 0; p < 5; p++) {
      const mpx = px + (rng() - 0.5) * ss.rx * 2.5;
      const mpy = py + (rng() - 0.5) * ss.ry * 2.5;
      x.fillStyle = "#2a0a00";
      x.beginPath();
      x.arc(mpx, mpy, 2 + rng() * 4, 0, Math.PI * 2);
      x.fill();
    }
  }
  x.globalAlpha = 1.0;

  // Solar Prominence / Flare Arcs
  x.strokeStyle = "rgba(255, 255, 220, 0.4)";
  x.lineWidth = 5;
  for (let i = 0; i < 8; i++) {
    const py = (0.2 + rng() * 0.6) * h;
    x.beginPath();
    x.moveTo(rng() * w, py);
    x.bezierCurveTo(rng() * w, py - 40, rng() * w, py + 40, rng() * w, py);
    x.stroke();
  }

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeNeptuneRingTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = 2048; c.height = 64;
  const x = c.getContext("2d")!;
  const ringBands = [
    { start: 0.0, end: 0.08, col: "rgba(0,0,0,0)" },
    { start: 0.08, end: 0.12, col: "rgba(100, 160, 255, 0.4)" }, // Galle Ring
    { start: 0.12, end: 0.28, col: "rgba(0,0,0,0)" },
    { start: 0.28, end: 0.32, col: "rgba(140, 180, 255, 0.65)" }, // Le Verrier Ring
    { start: 0.32, end: 0.48, col: "rgba(90, 130, 220, 0.25)" }, // Lassell Ring
    { start: 0.48, end: 0.62, col: "rgba(0,0,0,0)" },
    { start: 0.62, end: 0.68, col: "rgba(180, 210, 255, 0.85)" }, // Adams Ring & Arcs
    { start: 0.68, end: 0.76, col: "rgba(120, 170, 255, 0.5)" }, // Outer Ring
    { start: 0.76, end: 1.0, col: "rgba(0,0,0,0)" },
  ];
  for (const rb of ringBands) {
    x.fillStyle = rb.col;
    x.fillRect(rb.start * 2048, 0, (rb.end - rb.start) * 2048 + 2, 64);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ════════════════════════════════════════════════════════════════
   TEXTURE DISPATCHER
   ════════════════════════════════════════════════════════════════ */
function getTexturesForPlanet(slug: string) {
  switch (slug) {
    case "sun":     return { map: makeSunTexture() };
    case "mercury": return { map: makeMercuryTexture(), bump: makeMercuryBump() };
    case "venus":   return { map: makeVenusTexture() };
    case "earth":   return { map: makeEarthTexture(), bump: makeEarthBump(), specular: makeEarthSpecularMap(), clouds: makeEarthClouds() };
    case "mars":    return { map: makeMarsTexture(), bump: makeMarsBump() };
    case "jupiter": return { map: makeJupiterTexture() };
    case "saturn":  return { map: makeSaturnTexture(), ring: makeSaturnRingTexture() };
    case "uranus":  return { map: makeUranusTexture() };
    case "neptune": return { map: makeNeptuneTexture(), ring: makeNeptuneRingTexture() };
    default:        return { map: makeEarthTexture(), bump: makeEarthBump(), specular: makeEarthSpecularMap(), clouds: makeEarthClouds() };
  }
}

/* ════════════════════════════════════════════════════════════════
   MAIN PLANET CANVAS RENDERER COMPONENT
   ════════════════════════════════════════════════════════════════ */
export function PlanetCanvas({ planet }: PlanetCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 550;

    // ─── Scene & Camera ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 7);

    // ─── WebGL Renderer ───
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // ─── OrbitControls (Drag to rotate, Scroll to zoom) ───
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

    // ─── Lighting Setup ───
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const sunLight = new THREE.DirectionalLight(0xfff8f0, 3.2);
    sunLight.position.set(10, 6, 8);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.35);
    fillLight.position.set(-8, -4, -6);
    scene.add(fillLight);

    const hexColor = planet.color.startsWith("#") ? parseInt(planet.color.replace("#", ""), 16) : 0x38bdf8;
    const rimLight = new THREE.PointLight(hexColor, 1.5, 30);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    // ─── Load Procedural Textures & NASA Satellite Maps ───
    const textures = getTexturesForPlanet(planet.slug);

    // ─── Planet Mesh Group ───
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const radius = 2.5;
    const pGeo = new THREE.SphereGeometry(radius, 128, 128);
    let pMat: THREE.Material;
    if (planet.slug === "sun") {
      pMat = new THREE.MeshBasicMaterial({
        map: textures.map,
      });
    } else {
      pMat = new THREE.MeshStandardMaterial({
        map: textures.map,
        bumpMap: textures.bump,
        bumpScale: textures.bump ? 0.05 : 0,
        roughness: planet.slug === "earth" ? 0.45 : planet.slug === "venus" ? 0.7 : 0.55,
        metalness: 0.08,
      });
      if (textures.specular) {
        (pMat as THREE.MeshStandardMaterial).roughnessMap = textures.specular;
      }
    }

    // ─── NASA Satellite Texture & Real Cloud Loader Override ───
    const textureLoader = new THREE.TextureLoader();

    if (planet.slug === "earth") {
      const realEarthMap = textureLoader.load("/textures/planets/earth_blue_marble.jpg");
      realEarthMap.colorSpace = THREE.SRGBColorSpace;
      (pMat as THREE.MeshStandardMaterial).map = realEarthMap;

      const realNormalMap = textureLoader.load("/textures/planets/earth_normal_2048.jpg");
      (pMat as THREE.MeshStandardMaterial).normalMap = realNormalMap;
      (pMat as THREE.MeshStandardMaterial).normalScale = new THREE.Vector2(0.65, 0.65);

      const realSpecMap = textureLoader.load("/textures/planets/earth_specular_2048.jpg");
      (pMat as THREE.MeshStandardMaterial).roughnessMap = realSpecMap;
      (pMat as THREE.MeshStandardMaterial).roughness = 0.35;
      (pMat as THREE.MeshStandardMaterial).metalness = 0.05;
    } else if (planet.slug === "mercury") {
      const realMercuryMap = textureLoader.load("/textures/planets/mercury_2048.jpg");
      realMercuryMap.colorSpace = THREE.SRGBColorSpace;
      (pMat as THREE.MeshStandardMaterial).map = realMercuryMap;
      (pMat as THREE.MeshStandardMaterial).roughness = 0.92;
      (pMat as THREE.MeshStandardMaterial).metalness = 0.15;
    } else if (planet.slug === "venus") {
      const realVenusMap = textureLoader.load("/textures/planets/venus_2048.jpg");
      realVenusMap.colorSpace = THREE.SRGBColorSpace;
      (pMat as THREE.MeshStandardMaterial).map = realVenusMap;
      (pMat as THREE.MeshStandardMaterial).roughness = 0.72;
      (pMat as THREE.MeshStandardMaterial).metalness = 0.05;
    } else if (planet.slug === "mars") {
      const realMarsMap = textureLoader.load("/textures/planets/mars_2048.jpg");
      realMarsMap.colorSpace = THREE.SRGBColorSpace;
      (pMat as THREE.MeshStandardMaterial).map = realMarsMap;
      (pMat as THREE.MeshStandardMaterial).roughness = 0.88;
      (pMat as THREE.MeshStandardMaterial).metalness = 0.04;
    } else if (planet.slug === "jupiter") {
      const realJupiterMap = textureLoader.load("/textures/planets/jupiter_2048.jpg");
      realJupiterMap.colorSpace = THREE.SRGBColorSpace;
      (pMat as THREE.MeshStandardMaterial).map = realJupiterMap;
      (pMat as THREE.MeshStandardMaterial).roughness = 0.62;
      (pMat as THREE.MeshStandardMaterial).metalness = 0.02;
    } else if (planet.slug === "neptune") {
      const realNeptuneMap = textureLoader.load("/textures/planets/neptune_2048.jpg");
      realNeptuneMap.colorSpace = THREE.SRGBColorSpace;
      (pMat as THREE.MeshStandardMaterial).map = realNeptuneMap;
      (pMat as THREE.MeshStandardMaterial).roughness = 0.55;
      (pMat as THREE.MeshStandardMaterial).metalness = 0.02;
    }

    const pMesh = new THREE.Mesh(pGeo, pMat);
    planetGroup.add(pMesh);

    // ─── Real NASA Satellite Cloud Layer (Earth) ───
    let cloudMesh: THREE.Mesh | undefined;
    if (planet.slug === "earth") {
      const realCloudMap = textureLoader.load("/textures/planets/earth_clouds_2048.jpg");
      realCloudMap.colorSpace = THREE.SRGBColorSpace;
      const cloudGeo = new THREE.SphereGeometry(radius * 1.015, 96, 96);
      const cloudMat = new THREE.MeshStandardMaterial({
        map: realCloudMap,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      planetGroup.add(cloudMesh);
    }

    // ─── Multi-Layered Solar Corona Flare Halos (Sun) ───
    let sunCoronaOuter: THREE.Mesh | undefined;
    if (planet.slug === "sun") {
      const sunCoronaInner = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.06, 64, 64),
        new THREE.MeshBasicMaterial({
          color: 0xffaa00,
          transparent: true,
          opacity: 0.45,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
        })
      );
      planetGroup.add(sunCoronaInner);

      sunCoronaOuter = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.18, 64, 64),
        new THREE.MeshBasicMaterial({
          color: 0xff3300,
          transparent: true,
          opacity: 0.3,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
        })
      );
      planetGroup.add(sunCoronaOuter);

      const sunAura = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.35, 32, 32),
        new THREE.MeshBasicMaterial({
          color: 0xff1100,
          transparent: true,
          opacity: 0.15,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
        })
      );
      planetGroup.add(sunAura);
    }

    // ─── Realistic Atmospheric Rayleigh Glow Shell (Planets) ───
    if (planet.slug !== "sun") {
      const atmoGeo = new THREE.SphereGeometry(radius * 1.022, 64, 64);
      const atmoMat = new THREE.MeshBasicMaterial({
        color: planet.slug === "earth" ? 0x00d5ff : planet.slug === "venus" ? 0xeab308 : planet.slug === "mars" ? 0xd97706 : planet.slug === "neptune" ? 0x3b82f6 : hexColor,
        transparent: true,
        opacity: planet.slug === "earth" ? 0.12 : planet.slug === "venus" ? 0.24 : planet.slug === "mars" ? 0.08 : planet.slug === "neptune" ? 0.22 : planet.slug === "mercury" ? 0.04 : 0.18,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      });
      planetGroup.add(new THREE.Mesh(atmoGeo, atmoMat));
    }

    // ─── Planetary Ring Systems (Saturn & Neptune) ───
    if (textures.ring) {
      const innerR = planet.slug === "neptune" ? radius * 1.35 : radius * 1.3;
      const outerR = planet.slug === "neptune" ? radius * 2.4 : radius * 2.5;
      const ringGeo = new THREE.RingGeometry(innerR, outerR, 128);
      // Map ring radial UVs
      const pos = ringGeo.attributes.position;
      const uv = ringGeo.attributes.uv;
      const v3 = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i);
        const len = v3.length();
        (uv as THREE.BufferAttribute).setXY(i, (len - innerR) / (outerR - innerR), 0.5);
      }
      const ringMat = new THREE.MeshBasicMaterial({
        map: textures.ring,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: planet.slug === "neptune" ? 0.75 : 0.9,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.15;
      pMesh.add(ringMesh);
    }

    // ─── Orbiting Moons (Only for planets, not the Sun) ───
    const moonGroup = new THREE.Group();
    if (planet.slug !== "sun") {
      planetGroup.add(moonGroup);

      if (planet.slug === "mars") {
        const moonTexture = textureLoader.load("/textures/planets/moon_1024.jpg");
        moonTexture.colorSpace = THREE.SRGBColorSpace;

        // Phobos (Larger inner Martian moon)
        const phobosGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const phobosMat = new THREE.MeshStandardMaterial({ map: moonTexture, color: 0xc4b2a3, roughness: 0.9 });
        const phobosMesh = new THREE.Mesh(phobosGeo, phobosMat);
        phobosMesh.scale.set(1.4, 1.0, 0.85); // Irregular cratered asteroid shape
        phobosMesh.position.set(3.8, 0.2, 0);
        moonGroup.add(phobosMesh);

        // Deimos (Smaller outer Martian moon)
        const deimosGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const deimosMat = new THREE.MeshStandardMaterial({ map: moonTexture, color: 0x9e8c7c, roughness: 0.95 });
        const deimosMesh = new THREE.Mesh(deimosGeo, deimosMat);
        deimosMesh.scale.set(1.2, 0.8, 1.0);
        deimosMesh.position.set(5.2, -0.4, 0);
        moonGroup.add(deimosMesh);
      } else if (planet.slug === "jupiter") {
        const moonTexture = textureLoader.load("/textures/planets/moon_1024.jpg");
        moonTexture.colorSpace = THREE.SRGBColorSpace;

        // Io (Sulfur Volcanic Moon - Yellowish)
        const ioGeo = new THREE.SphereGeometry(0.24, 32, 32);
        const ioMat = new THREE.MeshStandardMaterial({ map: moonTexture, color: 0xf5d061, roughness: 0.75 });
        const ioMesh = new THREE.Mesh(ioGeo, ioMat);
        ioMesh.position.set(4.0, 0.3, 0);
        moonGroup.add(ioMesh);

        // Europa (Icy Crust Ocean Moon - Smooth Pale White)
        const europaGeo = new THREE.SphereGeometry(0.2, 32, 32);
        const europaMat = new THREE.MeshStandardMaterial({ map: moonTexture, color: 0xe2e8f0, roughness: 0.35 });
        const europaMesh = new THREE.Mesh(europaGeo, europaMat);
        europaMesh.position.set(5.5, -0.2, 0);
        moonGroup.add(europaMesh);
      } else if (planet.slug === "neptune") {
        const moonTexture = textureLoader.load("/textures/planets/moon_1024.jpg");
        moonTexture.colorSpace = THREE.SRGBColorSpace;

        // Triton (Large Retrograde Icy Cryovolcanic Moon)
        const tritonGeo = new THREE.SphereGeometry(0.28, 32, 32);
        const tritonMat = new THREE.MeshStandardMaterial({ map: moonTexture, color: 0xdbeafe, roughness: 0.65 });
        const tritonMesh = new THREE.Mesh(tritonGeo, tritonMat);
        tritonMesh.position.set(4.8, 0.4, 0);
        moonGroup.add(tritonMesh);
      } else {
        const moonGeo = new THREE.SphereGeometry(0.3, 32, 32);
        const moonTexture = textureLoader.load("/textures/planets/moon_1024.jpg");
        moonTexture.colorSpace = THREE.SRGBColorSpace;
        const moonMat = new THREE.MeshStandardMaterial({ map: moonTexture, roughness: 0.85 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(4.5, 0.3, 0);
        moonGroup.add(moonMesh);
      }
    }

    // ─── Background Starfield ───
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

    // ─── Resize Handler ───
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth, h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ─── Animation Loop ───
    let animId: number;
    const clock = new THREE.Clock();
    const rotSpeed = planet.slug === "venus" ? -0.05 : planet.slug === "mercury" ? 0.03 : 0.12;

    const animate = () => {
      const delta = clock.getDelta();
      pMesh.rotation.y += delta * rotSpeed;
      if (cloudMesh) cloudMesh.rotation.y += delta * rotSpeed * 1.18;
      if (planet.slug !== "sun") {
        moonGroup.rotation.y += delta * 0.35;
      }
      if (sunCoronaOuter) {
        sunCoronaOuter.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 3) * 0.04);
      }

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
