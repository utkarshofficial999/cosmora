"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

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
  const g = x.createRadialGradient(1024, 512, 100, 1024, 512, 1024);
  g.addColorStop(0, "#fff7ed"); g.addColorStop(0.3, "#fbbf24");
  g.addColorStop(0.6, "#f97316"); g.addColorStop(1, "#c2410c");
  x.fillStyle = g; x.fillRect(0, 0, 2048, 1024);
  for (let i = 0; i < 5000; i++) {
    const px = Math.random() * 2048, py = Math.random() * 1024;
    x.fillStyle = `rgba(255,${180 + Math.random() * 75|0},${60 + Math.random() * 80|0},${(0.12 + Math.random() * 0.18).toFixed(2)})`;
    x.beginPath(); x.arc(px, py, 2 + Math.random() * 8, 0, Math.PI * 2); x.fill();
  }
  for (let i = 0; i < 10; i++) {
    x.fillStyle = `rgba(120,40,0,${(0.35 + Math.random() * 0.3).toFixed(2)})`;
    x.beginPath(); x.arc(300 + Math.random() * 1400, 300 + Math.random() * 400, 8 + Math.random() * 22, 0, Math.PI * 2); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeMercuryTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  x.fillStyle = "#78716c"; x.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 800; i++) {
    const px = Math.random() * 1024, py = Math.random() * 512, r = 2 + Math.random() * 18;
    x.fillStyle = `rgba(${50 + Math.random() * 40|0},${45 + Math.random() * 35|0},${40 + Math.random() * 30|0},${(0.25 + Math.random() * 0.4).toFixed(2)})`;
    x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
    x.strokeStyle = `rgba(180,170,160,${(0.1 + Math.random() * 0.15).toFixed(2)})`; x.lineWidth = 1;
    x.beginPath(); x.arc(px, py, r + 1, 0, Math.PI * 2); x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeVenusTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 1024, 512);
  g.addColorStop(0, "#e7c46c"); g.addColorStop(0.5, "#d4a84b"); g.addColorStop(1, "#c4923a");
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  for (let y = 0; y < 512; y += 6) {
    x.fillStyle = `rgba(${200 + (y % 40)},${160 + (y % 30)},${80 + (y % 20)},0.3)`;
    x.fillRect(0, y, 1024, 3 + Math.sin(y * 0.05) * 4);
  }
  for (let i = 0; i < 250; i++) {
    x.fillStyle = `rgba(240,210,140,${(0.08 + Math.random() * 0.12).toFixed(2)})`;
    x.beginPath(); x.ellipse(Math.random() * 1024, Math.random() * 512, 15 + Math.random() * 40, 5 + Math.random() * 10, Math.random() * Math.PI, 0, Math.PI * 2); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeEarthTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = 2048; c.height = 1024;
  const x = c.getContext("2d")!;
  const og = x.createLinearGradient(0, 0, 0, 1024);
  og.addColorStop(0, "#0c2461"); og.addColorStop(0.3, "#0a3d6e"); og.addColorStop(0.5, "#1e5290"); og.addColorStop(0.7, "#0a3d6e"); og.addColorStop(1, "#0c2461");
  x.fillStyle = og; x.fillRect(0, 0, 2048, 1024);
  const continents = [
    { cx: 400, cy: 350, r: 180, col: "#2d6a4f" }, { cx: 350, cy: 250, r: 150, col: "#40916c" },
    { cx: 600, cy: 400, r: 100, col: "#1b4332" }, { cx: 750, cy: 350, r: 120, col: "#52b788" },
    { cx: 1200, cy: 300, r: 200, col: "#2d6a4f" }, { cx: 1150, cy: 500, r: 160, col: "#40916c" },
    { cx: 900, cy: 800, r: 130, col: "#d4a373" }, { cx: 350, cy: 120, r: 110, col: "#e9edc9" },
    { cx: 1024, cy: 960, r: 200, col: "#f0efeb" },
  ];
  for (const ct of continents) {
    for (let i = 0; i < 60; i++) {
      const px = ct.cx + Math.sin(i * 73.7) * ct.r * 0.8;
      const py = ct.cy + Math.cos(i * 41.3) * ct.r * 0.6;
      x.fillStyle = ct.col; x.globalAlpha = 0.6 + Math.random() * 0.4;
      x.beginPath(); x.arc(px, py, ct.r * 0.2 + (i % 7) * 8, 0, Math.PI * 2); x.fill();
    }
  }
  x.globalAlpha = 1;
  x.fillStyle = "rgba(255,255,255,0.1)";
  for (let i = 0; i < 180; i++) {
    x.beginPath(); x.ellipse(Math.random() * 2048, Math.random() * 1024, 30 + Math.random() * 60, 4 + Math.random() * 10, Math.random() * Math.PI, 0, Math.PI * 2); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeMarsTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#b45309"); g.addColorStop(0.3, "#c2410c"); g.addColorStop(0.6, "#9a3412"); g.addColorStop(1, "#7c2d12");
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 400; i++) {
    x.fillStyle = `rgba(${80 + Math.random() * 60|0},${20 + Math.random() * 30|0},${10 + Math.random() * 20|0},${(0.2 + Math.random() * 0.25).toFixed(2)})`;
    x.beginPath(); x.arc(Math.random() * 1024, Math.random() * 512, 5 + Math.random() * 22, 0, Math.PI * 2); x.fill();
  }
  x.strokeStyle = "rgba(60,15,5,0.45)"; x.lineWidth = 4;
  x.beginPath(); x.moveTo(300, 280); x.quadraticCurveTo(500, 255, 700, 300); x.stroke();
  x.fillStyle = "rgba(180,100,50,0.45)"; x.beginPath(); x.arc(220, 200, 32, 0, Math.PI * 2); x.fill();
  x.fillStyle = "rgba(255,250,240,0.5)"; x.fillRect(0, 0, 1024, 38); x.fillRect(0, 477, 1024, 35);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeJupiterTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = 2048; c.height = 1024;
  const x = c.getContext("2d")!;
  const bands = ["#e8c39e","#c17c3e","#d4915a","#a0522d","#f5deb3","#cd853f","#8b4513","#deb887","#d2691e","#f5deb3","#c17c3e","#a0522d"];
  const bh = 1024 / bands.length;
  for (let i = 0; i < bands.length; i++) { x.fillStyle = bands[i]; x.fillRect(0, i * bh, 2048, bh + 2); }
  for (let i = 0; i < 1200; i++) {
    x.fillStyle = `rgba(${150 + Math.random() * 100|0},${100 + Math.random() * 80|0},${50 + Math.random() * 60|0},0.1)`;
    x.beginPath(); x.ellipse(Math.random() * 2048, Math.random() * 1024, 20 + Math.random() * 50, 3 + Math.random() * 8, Math.random() * 0.3, 0, Math.PI * 2); x.fill();
  }
  const gx = 1400, gy = 620;
  const rg = x.createRadialGradient(gx, gy, 10, gx, gy, 70);
  rg.addColorStop(0, "rgba(180,40,20,0.85)"); rg.addColorStop(0.5, "rgba(200,80,40,0.6)"); rg.addColorStop(1, "rgba(210,130,80,0.25)");
  x.fillStyle = rg; x.beginPath(); x.ellipse(gx, gy, 72, 42, 0, 0, Math.PI * 2); x.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeSaturnTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  const bands = ["#e8d5a3","#d4b86a","#c9a84c","#e2c98a","#b8923a","#f0e0b0","#c9a84c","#d4b86a"];
  const bh = 512 / bands.length;
  for (let i = 0; i < bands.length; i++) { x.fillStyle = bands[i]; x.fillRect(0, i * bh, 1024, bh + 2); }
  for (let i = 0; i < 500; i++) {
    x.fillStyle = `rgba(${200 + Math.random() * 55|0},${170 + Math.random() * 60|0},${100 + Math.random() * 50|0},0.08)`;
    x.beginPath(); x.ellipse(Math.random() * 1024, Math.random() * 512, 15 + Math.random() * 25, 2 + Math.random() * 5, 0, 0, Math.PI * 2); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeSaturnRingTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 64;
  const x = c.getContext("2d")!;
  const ringColors = [
    "rgba(180,160,120,0.0)","rgba(200,180,140,0.55)","rgba(180,155,110,0.75)",
    "rgba(210,190,150,0.88)","rgba(160,140,100,0.35)","rgba(190,170,130,0.82)",
    "rgba(220,200,160,0.92)","rgba(200,180,140,0.65)","rgba(170,150,110,0.25)",
    "rgba(210,190,150,0.75)","rgba(190,170,130,0.55)","rgba(160,140,100,0.12)",
    "rgba(180,160,120,0.0)",
  ];
  const sw = 1024 / ringColors.length;
  for (let i = 0; i < ringColors.length; i++) { x.fillStyle = ringColors[i]; x.fillRect(i * sw, 0, sw + 2, 64); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeUranusTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#7dd3c0"); g.addColorStop(0.5, "#5eead4"); g.addColorStop(1, "#99f6e4");
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  for (let y = 0; y < 512; y += 8) {
    x.fillStyle = `rgba(${100 + (y % 30)},${210 + (y % 20)},${200 + (y % 15)},0.18)`;
    x.fillRect(0, y, 1024, 4);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function makeNeptuneTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#3730a3"); g.addColorStop(0.5, "#4338ca"); g.addColorStop(1, "#312e81");
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  for (let y = 0; y < 512; y += 10) {
    x.fillStyle = `rgba(${70 + (y % 40)},${60 + (y % 35)},${180 + (y % 30)},0.22)`;
    x.fillRect(0, y, 1024, 5);
  }
  x.fillStyle = "rgba(20,15,80,0.45)";
  x.beginPath(); x.ellipse(600, 280, 48, 28, 0, 0, Math.PI * 2); x.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ──────────────── Planet Config ──────────────── */
interface PlanetConfig {
  slug: string;
  name: string;
  dist: number;
  size: number;
  orbitalSpeed: number;
  rotationSpeed: number;
  axialTilt: number;
  color: number;
  makeTexture: () => THREE.CanvasTexture;
  hasRings?: boolean;
  hasAtmo?: boolean;
  atmoColor?: number;
  hasMoon?: boolean;
}

const PLANET_CONFIGS: PlanetConfig[] = [
  { slug: "mercury", name: "Mercury",  dist: 6.5,   size: 0.38, orbitalSpeed: 0.42, rotationSpeed: 0.02,  axialTilt: 0.001,  color: 0xa8a29e, makeTexture: makeMercuryTexture },
  { slug: "venus",   name: "Venus",    dist: 9.5,   size: 0.58, orbitalSpeed: 0.32, rotationSpeed: -0.01, axialTilt: 3.096,  color: 0xd4a84b, makeTexture: makeVenusTexture, hasAtmo: true, atmoColor: 0xe8c468 },
  { slug: "earth",   name: "Earth",    dist: 13.0,  size: 0.65, orbitalSpeed: 0.26, rotationSpeed: 0.5,   axialTilt: 0.409,  color: 0x3b82f6, makeTexture: makeEarthTexture, hasAtmo: true, atmoColor: 0x60a5fa, hasMoon: true },
  { slug: "mars",    name: "Mars",     dist: 17.0,  size: 0.45, orbitalSpeed: 0.20, rotationSpeed: 0.48,  axialTilt: 0.44,   color: 0xdc2626, makeTexture: makeMarsTexture, hasAtmo: true, atmoColor: 0xf97316 },
  { slug: "jupiter", name: "Jupiter",  dist: 23.0,  size: 1.8,  orbitalSpeed: 0.11, rotationSpeed: 1.2,   axialTilt: 0.055,  color: 0xd97706, makeTexture: makeJupiterTexture },
  { slug: "saturn",  name: "Saturn",   dist: 30.0,  size: 1.5,  orbitalSpeed: 0.08, rotationSpeed: 1.1,   axialTilt: 0.467,  color: 0xca8a04, makeTexture: makeSaturnTexture, hasRings: true },
  { slug: "uranus",  name: "Uranus",   dist: 37.0,  size: 1.0,  orbitalSpeed: 0.05, rotationSpeed: 0.7,   axialTilt: 1.706,  color: 0x2dd4bf, makeTexture: makeUranusTexture },
  { slug: "neptune", name: "Neptune",  dist: 43.5,  size: 0.95, orbitalSpeed: 0.035,rotationSpeed: 0.67,  axialTilt: 0.494,  color: 0x6366f1, makeTexture: makeNeptuneTexture },
];

/* ──────────────── Main Component ──────────────── */
export function SolarSystemCanvas({
  speedFactor = 1,
  nightMode = false,
  selectedSlug = "earth",
  onSelectPlanet,
}: SolarSystemCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(speedFactor);
  const selectedRef = useRef(selectedSlug);

  // Keep refs in sync without re-creating the entire scene
  useEffect(() => { speedRef.current = speedFactor; }, [speedFactor]);
  useEffect(() => { selectedRef.current = selectedSlug; }, [selectedSlug]);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // ─── Scene ───
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.004);

    // ─── Camera ───
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 28, 52);

    // ─── WebGL Renderer ───
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = nightMode ? 0.6 : 1.4;
    container.appendChild(renderer.domElement);

    // ─── CSS2D Label Renderer ───
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.left = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    container.appendChild(labelRenderer.domElement);

    // ─── OrbitControls ───
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 8;
    controls.maxDistance = 120;
    controls.zoomSpeed = 0.8;
    controls.rotateSpeed = 0.5;
    controls.panSpeed = 0.5;
    controls.enablePan = true;

    // ─── Lighting ───
    scene.add(new THREE.AmbientLight(0xffffff, nightMode ? 0.08 : 0.3));
    const sunLight = new THREE.PointLight(0xfff5ea, nightMode ? 3 : 5, 500, 1.5);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // ─── Sun ───
    const sunTexture = makeSunTexture();
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3.5, 64, 64),
      new THREE.MeshBasicMaterial({ map: sunTexture })
    );
    scene.add(sunMesh);

    const sunCorona = new THREE.Mesh(
      new THREE.SphereGeometry(4.0, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0xff9944, transparent: true, opacity: 0.3, side: THREE.BackSide, blending: THREE.AdditiveBlending })
    );
    scene.add(sunCorona);

    const sunOuter = new THREE.Mesh(
      new THREE.SphereGeometry(5.2, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.08, side: THREE.BackSide, blending: THREE.AdditiveBlending })
    );
    scene.add(sunOuter);

    // ─── Planets ───
    const ringTex = makeSaturnRingTexture();
    const textureLoader = new THREE.TextureLoader();
    const planets: {
      pivot: THREE.Group;
      mesh: THREE.Mesh;
      config: PlanetConfig;
      moonPivot?: THREE.Group;
      label: CSS2DObject;
    }[] = [];

    for (const cfg of PLANET_CONFIGS) {
      // Orbit ring
      const orbitPts: THREE.Vector3[] = [];
      for (let i = 0; i <= 256; i++) {
        const a = (i / 256) * Math.PI * 2;
        orbitPts.push(new THREE.Vector3(Math.cos(a) * cfg.dist, 0, Math.sin(a) * cfg.dist));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
      const orbitLine = new THREE.Line(
        orbitGeo,
        new THREE.LineBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.18 })
      );
      scene.add(orbitLine);

      // Pivot
      const pivot = new THREE.Group();
      scene.add(pivot);

      // Planet mesh
      const tex = cfg.makeTexture();
      const geo = new THREE.SphereGeometry(cfg.size, 64, 64);
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.1 });

      if (cfg.slug === "earth") {
        const realEarthMap = textureLoader.load("/textures/planets/earth_blue_marble.jpg");
        realEarthMap.colorSpace = THREE.SRGBColorSpace;
        mat.map = realEarthMap;

        const realNormalMap = textureLoader.load("/textures/planets/earth_normal_2048.jpg");
        mat.normalMap = realNormalMap;
        mat.normalScale = new THREE.Vector2(0.85, 0.85);

        const realSpecMap = textureLoader.load("/textures/planets/earth_specular_2048.jpg");
        mat.roughnessMap = realSpecMap;
        mat.roughness = 0.35;
        mat.metalness = 0.1;
      }

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = cfg.dist;
      mesh.userData = { slug: cfg.slug };

      // Group for axial tilt
      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.z = cfg.axialTilt;
      tiltGroup.position.x = cfg.dist;
      pivot.add(tiltGroup);
      tiltGroup.add(mesh);
      mesh.position.x = 0; // inside tiltGroup now

      // Atmosphere
      if (cfg.hasAtmo && cfg.atmoColor !== undefined) {
        const atmo = new THREE.Mesh(
          new THREE.SphereGeometry(cfg.size * 1.06, 32, 32),
          new THREE.MeshBasicMaterial({ color: cfg.atmoColor, transparent: true, opacity: 0.2, side: THREE.BackSide, blending: THREE.AdditiveBlending })
        );
        mesh.add(atmo);
      }

      // Saturn Realistic Ring System
      if (cfg.hasRings) {
        const ringGeo = new THREE.RingGeometry(cfg.size * 1.4, cfg.size * 2.5, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xeab308,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        mesh.add(ringMesh);
      }

      // Orbiting Moon for Earth
      let moonPivot: THREE.Group | undefined;
      if (cfg.hasMoon) {
        moonPivot = new THREE.Group();
        mesh.add(moonPivot);
        const moonGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const moonTexture = textureLoader.load("/textures/planets/moon_1024.jpg");
        moonTexture.colorSpace = THREE.SRGBColorSpace;
        const moonMat = new THREE.MeshStandardMaterial({ map: moonTexture, roughness: 0.9 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.x = 1.3;
        moonPivot.add(moonMesh);
      }

      // Label
      const labelDiv = document.createElement("div");
      labelDiv.className = "planet-label";
      labelDiv.textContent = cfg.name.toUpperCase();
      labelDiv.style.cssText = `
        padding: 2px 8px; border-radius: 6px; font-size: 10px; font-family: ui-monospace, monospace;
        font-weight: 700; letter-spacing: 0.08em; white-space: nowrap; backdrop-filter: blur(12px);
        transition: all 0.3s;
        background: rgba(2,6,23,0.6); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.1);
      `;
      const label = new CSS2DObject(labelDiv);
      label.position.set(0, cfg.size + 0.5, 0);
      mesh.add(label);

      planets.push({ pivot, mesh, config: cfg, moonPivot, label });
    }

    // ─── Asteroid Belt ───
    const asteroidCount = 4000;
    const astPos = new Float32Array(asteroidCount * 3);
    for (let i = 0; i < asteroidCount; i++) {
      const d = 19.5 + Math.random() * 3.0;
      const a = Math.random() * Math.PI * 2;
      astPos[i * 3] = Math.cos(a) * d;
      astPos[i * 3 + 1] = (Math.random() - 0.5) * 1.0;
      astPos[i * 3 + 2] = Math.sin(a) * d;
    }
    const astGeo = new THREE.BufferGeometry();
    astGeo.setAttribute("position", new THREE.BufferAttribute(astPos, 3));
    const asteroidBelt = new THREE.Points(astGeo, new THREE.PointsMaterial({ size: 0.2, color: 0x94a3b8, transparent: true, opacity: 0.6 }));
    scene.add(asteroidBelt);

    // ─── Starfield ───
    const starCount = 6000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 100 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.9, color: 0xffffff, transparent: true, opacity: 0.85 })));

    // ─── Raycaster Click ───
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(planets.map((p) => p.mesh));
      if (hits.length > 0) {
        const slug = hits[0].object.userData.slug;
        if (slug && onSelectPlanet) onSelectPlanet(slug);
      }
    };
    renderer.domElement.addEventListener("click", handleClick);

    // ─── Resize ───
    const handleResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ─── Animation Loop ───
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const spd = speedRef.current;

      sunMesh.rotation.y += delta * 0.08;
      sunCorona.rotation.y -= delta * 0.04;
      sunCorona.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.03);
      sunOuter.scale.setScalar(1 + Math.sin(Date.now() * 0.001) * 0.05);
      asteroidBelt.rotation.y += delta * 0.015 * spd;

      for (const p of planets) {
        p.pivot.rotation.y += delta * p.config.orbitalSpeed * spd;
        p.mesh.rotation.y += delta * p.config.rotationSpeed * spd;
        if (p.moonPivot) p.moonPivot.rotation.y += delta * 1.2 * spd;

        // Update label style based on selection
        const isSelected = selectedRef.current === p.config.slug;
        const el = p.label.element as HTMLDivElement;
        if (isSelected) {
          el.style.background = "rgba(0,229,255,0.2)";
          el.style.color = "#a5f3fc";
          el.style.border = "1px solid rgba(0,229,255,0.5)";
          el.style.boxShadow = "0 0 14px rgba(0,229,255,0.4)";
        } else {
          el.style.background = "rgba(2,6,23,0.6)";
          el.style.color = "#cbd5e1";
          el.style.border = "1px solid rgba(255,255,255,0.1)";
          el.style.boxShadow = "none";
        }
      }

      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    // ─── Cleanup ───
    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      if (container.contains(labelRenderer.domElement)) container.removeChild(labelRenderer.domElement);
      renderer.dispose();
    };
  }, [nightMode, onSelectPlanet]);

  return <div ref={mountRef} className="fixed inset-0 z-0 overflow-hidden cursor-grab active:cursor-grabbing" />;
}
