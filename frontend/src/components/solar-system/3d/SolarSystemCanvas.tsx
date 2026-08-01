"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";

/* ──────────────── Props ──────────────── */
interface SolarSystemCanvasProps {
  speedFactor?: number;
  nightMode?: boolean;
  selectedSlug?: string;
  onSelectPlanet?: (slug: string) => void;
}

/* ──────────────── Procedural Texture Generators ──────────────── */

function makeSunTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 2048; c.height = 1024;
  const x = c.getContext("2d")!;
  // base gradient
  const g = x.createRadialGradient(1024, 512, 100, 1024, 512, 1024);
  g.addColorStop(0, "#fff7ed");
  g.addColorStop(0.3, "#fbbf24");
  g.addColorStop(0.6, "#f97316");
  g.addColorStop(1, "#c2410c");
  x.fillStyle = g; x.fillRect(0, 0, 2048, 1024);
  // granulation
  for (let i = 0; i < 6000; i++) {
    const px = Math.random() * 2048, py = Math.random() * 1024;
    const r = 2 + Math.random() * 8;
    x.fillStyle = `rgba(255,${180 + Math.random() * 75},${60 + Math.random() * 80},${0.15 + Math.random() * 0.2})`;
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
  }
  // sunspots
  for (let i = 0; i < 12; i++) {
    const px = 300 + Math.random() * 1400, py = 300 + Math.random() * 400;
    x.fillStyle = `rgba(120,40,0,${0.4 + Math.random() * 0.3})`;
    x.beginPath(); x.arc(px, py, 8 + Math.random() * 25, 0, Math.PI * 2); x.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeMercuryTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  x.fillStyle = "#78716c"; x.fillRect(0, 0, 1024, 512);
  // craters
  for (let i = 0; i < 800; i++) {
    const px = Math.random() * 1024, py = Math.random() * 512;
    const r = 2 + Math.random() * 18;
    x.fillStyle = `rgba(${50 + Math.random() * 40},${45 + Math.random() * 35},${40 + Math.random() * 30},${0.3 + Math.random() * 0.4})`;
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
    // rim highlight
    x.strokeStyle = `rgba(180,170,160,${0.15 + Math.random() * 0.15})`;
    x.lineWidth = 1;
    x.beginPath(); x.arc(px, py, r + 1, 0, Math.PI * 2); x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeVenusTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 1024, 512);
  g.addColorStop(0, "#e7c46c"); g.addColorStop(0.5, "#d4a84b"); g.addColorStop(1, "#c4923a");
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  // swirling cloud bands
  for (let y = 0; y < 512; y += 6) {
    x.fillStyle = `rgba(${200 + (y % 40)},${160 + (y % 30)},${80 + (y % 20)},0.35)`;
    x.fillRect(0, y, 1024, 3 + Math.sin(y * 0.05) * 4);
  }
  for (let i = 0; i < 300; i++) {
    const px = Math.random() * 1024, py = Math.random() * 512;
    x.fillStyle = `rgba(240,210,140,${0.1 + Math.random() * 0.15})`;
    x.beginPath(); x.ellipse(px, py, 15 + Math.random() * 40, 5 + Math.random() * 10, Math.random() * Math.PI, 0, Math.PI * 2); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeEarthTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 2048; c.height = 1024;
  const x = c.getContext("2d")!;
  // deep ocean
  const og = x.createLinearGradient(0, 0, 0, 1024);
  og.addColorStop(0, "#0c2461"); og.addColorStop(0.3, "#0a3d6e"); og.addColorStop(0.5, "#1e5290"); og.addColorStop(0.7, "#0a3d6e"); og.addColorStop(1, "#0c2461");
  x.fillStyle = og; x.fillRect(0, 0, 2048, 1024);
  // continents — deterministic noise blobs
  const continents = [
    { cx: 400, cy: 350, r: 180, col: "#2d6a4f" },  // Africa
    { cx: 350, cy: 250, r: 150, col: "#40916c" },  // Europe
    { cx: 600, cy: 400, r: 100, col: "#1b4332" },  // India
    { cx: 750, cy: 350, r: 120, col: "#52b788" },  // SE Asia
    { cx: 1200, cy: 300, r: 200, col: "#2d6a4f" }, // N America
    { cx: 1150, cy: 500, r: 160, col: "#40916c" }, // S America
    { cx: 900, cy: 800, r: 130, col: "#d4a373" },  // Australia
    { cx: 350, cy: 120, r: 110, col: "#e9edc9" },  // Arctic
    { cx: 1024, cy: 960, r: 200, col: "#f0efeb" }, // Antarctica
  ];
  for (const ct of continents) {
    for (let i = 0; i < 60; i++) {
      const px = ct.cx + (Math.sin(i * 73.7) * ct.r * 0.8);
      const py = ct.cy + (Math.cos(i * 41.3) * ct.r * 0.6);
      const r = ct.r * 0.2 + (i % 7) * 8;
      x.fillStyle = ct.col;
      x.globalAlpha = 0.6 + Math.random() * 0.4;
      x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
    }
  }
  x.globalAlpha = 1;
  // cloud wisps
  x.fillStyle = "rgba(255,255,255,0.12)";
  for (let i = 0; i < 200; i++) {
    const px = Math.random() * 2048, py = Math.random() * 1024;
    x.beginPath(); x.ellipse(px, py, 30 + Math.random() * 60, 4 + Math.random() * 10, Math.random() * Math.PI, 0, Math.PI * 2); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeMarsTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#b45309"); g.addColorStop(0.3, "#c2410c"); g.addColorStop(0.6, "#9a3412"); g.addColorStop(1, "#7c2d12");
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  // highlands / darker regions
  for (let i = 0; i < 500; i++) {
    const px = Math.random() * 1024, py = Math.random() * 512;
    x.fillStyle = `rgba(${80 + Math.random() * 60},${20 + Math.random() * 30},${10 + Math.random() * 20},${0.2 + Math.random() * 0.3})`;
    x.beginPath(); x.arc(px, py, 5 + Math.random() * 25, 0, Math.PI * 2); x.fill();
  }
  // Valles Marineris
  x.strokeStyle = "rgba(60,15,5,0.5)"; x.lineWidth = 4;
  x.beginPath(); x.moveTo(300, 280); x.quadraticCurveTo(500, 260, 700, 300); x.stroke();
  // Olympus Mons
  x.fillStyle = "rgba(180,100,50,0.5)"; x.beginPath(); x.arc(220, 200, 35, 0, Math.PI * 2); x.fill();
  // polar caps
  x.fillStyle = "rgba(255,250,240,0.55)";
  x.fillRect(0, 0, 1024, 40); x.fillRect(0, 475, 1024, 37);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeJupiterTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 2048; c.height = 1024;
  const x = c.getContext("2d")!;
  // alternating bands
  const bands = ["#e8c39e","#c17c3e","#d4915a","#a0522d","#f5deb3","#cd853f","#8b4513","#deb887","#d2691e","#f5deb3","#c17c3e","#a0522d"];
  const bh = 1024 / bands.length;
  for (let i = 0; i < bands.length; i++) {
    x.fillStyle = bands[i];
    x.fillRect(0, i * bh, 2048, bh + 2);
  }
  // turbulence within bands
  for (let i = 0; i < 1500; i++) {
    const px = Math.random() * 2048, py = Math.random() * 1024;
    x.fillStyle = `rgba(${150 + Math.random() * 100},${100 + Math.random() * 80},${50 + Math.random() * 60},0.12)`;
    x.beginPath(); x.ellipse(px, py, 20 + Math.random() * 50, 3 + Math.random() * 8, Math.random() * 0.3, 0, Math.PI * 2); x.fill();
  }
  // Great Red Spot
  const gx = 1400, gy = 620;
  const rg = x.createRadialGradient(gx, gy, 10, gx, gy, 70);
  rg.addColorStop(0, "rgba(180,40,20,0.9)");
  rg.addColorStop(0.5, "rgba(200,80,40,0.7)");
  rg.addColorStop(1, "rgba(210,130,80,0.3)");
  x.fillStyle = rg;
  x.beginPath(); x.ellipse(gx, gy, 75, 45, 0, 0, Math.PI * 2); x.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeSaturnTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  const bands = ["#e8d5a3","#d4b86a","#c9a84c","#e2c98a","#b8923a","#f0e0b0","#c9a84c","#d4b86a"];
  const bh = 512 / bands.length;
  for (let i = 0; i < bands.length; i++) {
    x.fillStyle = bands[i]; x.fillRect(0, i * bh, 1024, bh + 2);
  }
  for (let i = 0; i < 600; i++) {
    const px = Math.random() * 1024, py = Math.random() * 512;
    x.fillStyle = `rgba(${200 + Math.random() * 55},${170 + Math.random() * 60},${100 + Math.random() * 50},0.1)`;
    x.beginPath(); x.ellipse(px, py, 15 + Math.random() * 30, 2 + Math.random() * 5, 0, 0, Math.PI * 2); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeSaturnRingTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 64;
  const x = c.getContext("2d")!;
  // radial ring bands from inner to outer
  const ringColors = [
    "rgba(180,160,120,0.0)","rgba(200,180,140,0.6)","rgba(180,155,110,0.8)",
    "rgba(210,190,150,0.9)","rgba(160,140,100,0.4)","rgba(190,170,130,0.85)",
    "rgba(220,200,160,0.95)","rgba(200,180,140,0.7)","rgba(170,150,110,0.3)",
    "rgba(210,190,150,0.8)","rgba(190,170,130,0.6)","rgba(160,140,100,0.15)",
    "rgba(180,160,120,0.0)",
  ];
  const sw = 1024 / ringColors.length;
  for (let i = 0; i < ringColors.length; i++) {
    x.fillStyle = ringColors[i]; x.fillRect(i * sw, 0, sw + 2, 64);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeUranusTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#7dd3c0"); g.addColorStop(0.5, "#5eead4"); g.addColorStop(1, "#99f6e4");
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  for (let y = 0; y < 512; y += 8) {
    x.fillStyle = `rgba(${100 + (y % 30)},${210 + (y % 20)},${200 + (y % 15)},0.2)`;
    x.fillRect(0, y, 1024, 4);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeNeptuneTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#3730a3"); g.addColorStop(0.5, "#4338ca"); g.addColorStop(1, "#312e81");
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  for (let y = 0; y < 512; y += 10) {
    x.fillStyle = `rgba(${70 + (y % 40)},${60 + (y % 35)},${180 + (y % 30)},0.25)`;
    x.fillRect(0, y, 1024, 5);
  }
  // Great Dark Spot
  x.fillStyle = "rgba(20,15,80,0.5)";
  x.beginPath(); x.ellipse(600, 280, 50, 30, 0, 0, Math.PI * 2); x.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ──────────────── Planet Config ──────────────── */
interface PlanetConfig {
  slug: string;
  name: string;
  dist: number;
  size: number;
  orbitalSpeed: number;      // rad/s at 1x speed
  rotationSpeed: number;     // rad/s self-rotation
  axialTilt: number;         // radians
  color: string;
  hasRings?: boolean;
  hasAtmo?: boolean;
  atmoColor?: string;
  hasMoon?: boolean;
}

const PLANET_CONFIGS: PlanetConfig[] = [
  { slug: "mercury", name: "Mercury",  dist: 6.5,   size: 0.38, orbitalSpeed: 0.42, rotationSpeed: 0.02,  axialTilt: 0.001,  color: "#a8a29e" },
  { slug: "venus",   name: "Venus",    dist: 9.5,   size: 0.58, orbitalSpeed: 0.32, rotationSpeed: -0.01, axialTilt: 3.096,  color: "#d4a84b", hasAtmo: true, atmoColor: "#e8c468" },
  { slug: "earth",   name: "Earth",    dist: 13.0,  size: 0.65, orbitalSpeed: 0.26, rotationSpeed: 0.5,   axialTilt: 0.409,  color: "#3b82f6", hasAtmo: true, atmoColor: "#60a5fa", hasMoon: true },
  { slug: "mars",    name: "Mars",     dist: 17.0,  size: 0.45, orbitalSpeed: 0.20, rotationSpeed: 0.48,  axialTilt: 0.44,   color: "#dc2626", hasAtmo: true, atmoColor: "#f97316" },
  { slug: "jupiter", name: "Jupiter",  dist: 23.0,  size: 1.8,  orbitalSpeed: 0.11, rotationSpeed: 1.2,   axialTilt: 0.055,  color: "#d97706" },
  { slug: "saturn",  name: "Saturn",   dist: 30.0,  size: 1.5,  orbitalSpeed: 0.08, rotationSpeed: 1.1,   axialTilt: 0.467,  color: "#ca8a04", hasRings: true },
  { slug: "uranus",  name: "Uranus",   dist: 37.0,  size: 1.0,  orbitalSpeed: 0.05, rotationSpeed: 0.7,   axialTilt: 1.706,  color: "#2dd4bf" },
  { slug: "neptune", name: "Neptune",  dist: 43.5,  size: 0.95, orbitalSpeed: 0.035,rotationSpeed: 0.67,  axialTilt: 0.494,  color: "#6366f1" },
];

/* ──────────────── Planet Component ──────────────── */
interface PlanetProps {
  config: PlanetConfig;
  texture: THREE.CanvasTexture;
  speedFactor: number;
  isSelected: boolean;
  onClick: () => void;
  ringTexture?: THREE.CanvasTexture;
}

function Planet({ config, texture, speedFactor, isSelected, onClick, ringTexture }: PlanetProps) {
  const pivotRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const moonPivotRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (pivotRef.current) {
      pivotRef.current.rotation.y += delta * config.orbitalSpeed * speedFactor;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * config.rotationSpeed * speedFactor;
    }
    if (moonPivotRef.current) {
      moonPivotRef.current.rotation.y += delta * 1.2 * speedFactor;
    }
  });

  return (
    <group ref={pivotRef}>
      <group position={[config.dist, 0, 0]} rotation={[config.axialTilt, 0, 0]}>
        {/* Planet Sphere */}
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          userData={{ slug: config.slug }}
        >
          <sphereGeometry args={[config.size, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.55}
            metalness={0.1}
          />
        </mesh>

        {/* Atmosphere Glow Shell */}
        {config.hasAtmo && (
          <mesh>
            <sphereGeometry args={[config.size * 1.06, 32, 32]} />
            <meshBasicMaterial
              color={config.atmoColor}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Saturn Rings */}
        {config.hasRings && ringTexture && (
          <mesh rotation={[Math.PI / 2.2, 0, 0]}>
            <ringGeometry args={[config.size * 1.35, config.size * 2.6, 128]} />
            <meshBasicMaterial
              map={ringTexture}
              side={THREE.DoubleSide}
              transparent
              opacity={0.88}
            />
          </mesh>
        )}

        {/* Earth Moon */}
        {config.hasMoon && (
          <group ref={moonPivotRef}>
            <mesh position={[1.4, 0, 0]}>
              <sphereGeometry args={[0.16, 24, 24]} />
              <meshStandardMaterial color="#c8d6e5" roughness={0.9} />
            </mesh>
          </group>
        )}

        {/* Floating Label */}
        <Html
          position={[0, config.size + 0.5, 0]}
          center
          distanceFactor={18}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider whitespace-nowrap transition-all backdrop-blur-xl border ${
              isSelected
                ? "bg-cyan-500/30 text-cyan-200 border-cyan-400/60 shadow-[0_0_14px_rgba(0,229,255,0.5)]"
                : "bg-slate-950/60 text-slate-300 border-white/10"
            }`}
          >
            {config.name.toUpperCase()}
          </div>
        </Html>
      </group>
    </group>
  );
}

/* ──────────────── Orbit Rings ──────────────── */
function OrbitRing({ dist, color, isSelected }: { dist: number; color: string; isSelected: boolean }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 256; i++) {
      const angle = (i / 256) * Math.PI * 2;
      pts.push([Math.cos(angle) * dist, 0, Math.sin(angle) * dist]);
    }
    return pts;
  }, [dist]);

  return (
    <Line
      points={points}
      color={color}
      transparent
      opacity={isSelected ? 0.55 : 0.15}
      lineWidth={1}
    />
  );
}

/* ──────────────── Asteroid Belt ──────────────── */
function AsteroidBelt({ speedFactor }: { speedFactor: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const count = 4000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const d = 19.5 + Math.random() * 3.0;
      const a = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * 1.0;
      arr[i * 3] = Math.cos(a) * d;
      arr[i * 3 + 1] = h;
      arr[i * 3 + 2] = Math.sin(a) * d;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015 * speedFactor;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.2} color="#94a3b8" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ──────────────── Starfield ──────────────── */
function Starfield() {
  const positions = useMemo(() => {
    const count = 6000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 100 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const sizes = useMemo(() => {
    const count = 6000;
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = 0.4 + Math.random() * 1.2;
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.9} color="#ffffff" transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

/* ──────────────── Sun ──────────────── */
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const coronaRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);

  const texture = useMemo(() => makeSunTexture(), []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.08;
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= delta * 0.04;
      coronaRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.03);
    }
    if (outerRef.current) {
      outerRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.001) * 0.05);
    }
  });

  return (
    <group>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      {/* Inner corona */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[4.0, 64, 64]} />
        <meshBasicMaterial color="#ff9944" transparent opacity={0.3} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Outer glow */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[5.2, 32, 32]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.08} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Light */}
      <pointLight color="#fff5ea" intensity={5} distance={500} decay={1.5} />
    </group>
  );
}

/* ──────────────── Scene Content ──────────────── */
function SceneContent({
  speedFactor,
  nightMode,
  selectedSlug,
  onSelectPlanet,
}: SolarSystemCanvasProps) {
  // Memoize all textures so they're only created once
  const textures = useMemo(() => ({
    mercury: makeMercuryTexture(),
    venus: makeVenusTexture(),
    earth: makeEarthTexture(),
    mars: makeMarsTexture(),
    jupiter: makeJupiterTexture(),
    saturn: makeSaturnTexture(),
    saturnRing: makeSaturnRingTexture(),
    uranus: makeUranusTexture(),
    neptune: makeNeptuneTexture(),
  }), []);

  const textureMap: Record<string, THREE.CanvasTexture> = {
    mercury: textures.mercury,
    venus: textures.venus,
    earth: textures.earth,
    mars: textures.mars,
    jupiter: textures.jupiter,
    saturn: textures.saturn,
    uranus: textures.uranus,
    neptune: textures.neptune,
  };

  const handleSelect = useCallback((slug: string) => {
    onSelectPlanet?.(slug);
  }, [onSelectPlanet]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={nightMode ? 0.08 : 0.3} />

      {/* Sun */}
      <Sun />

      {/* Orbit Rings */}
      {PLANET_CONFIGS.map((p) => (
        <OrbitRing key={`orbit-${p.slug}`} dist={p.dist} color={p.color} isSelected={selectedSlug === p.slug} />
      ))}

      {/* Planets */}
      {PLANET_CONFIGS.map((p) => (
        <Planet
          key={p.slug}
          config={p}
          texture={textureMap[p.slug]}
          speedFactor={speedFactor ?? 1}
          isSelected={selectedSlug === p.slug}
          onClick={() => handleSelect(p.slug)}
          ringTexture={p.hasRings ? textures.saturnRing : undefined}
        />
      ))}

      {/* Asteroid Belt */}
      <AsteroidBelt speedFactor={speedFactor ?? 1} />

      {/* Starfield */}
      <Starfield />

      {/* OrbitControls — full drag/zoom/pan */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={8}
        maxDistance={120}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
        panSpeed={0.5}
        enableDamping
        dampingFactor={0.08}
        makeDefault
      />
    </>
  );
}

/* ──────────────── Main Exported Canvas ──────────────── */
export function SolarSystemCanvas(props: SolarSystemCanvasProps) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 28, 52], fov: 45, near: 0.1, far: 2000 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: props.nightMode ? 0.6 : 1.4,
        }}
        dpr={[1, 2]}
        style={{ background: "#030712" }}
      >
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
}
