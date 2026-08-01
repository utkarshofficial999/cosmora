"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Orbit, X, ExternalLink, Globe2 } from "lucide-react";
import Link from "next/link";

interface PlanetInfo {
  name: string;
  color: string;
  diameterKm: string;
  orbitPeriod: string;
  moons: number;
  description: string;
}

const PLANET_DATA: Record<string, PlanetInfo> = {
  Mercury: {
    name: "Mercury",
    color: "#a1a1aa",
    diameterKm: "4,879 km",
    orbitPeriod: "88 days",
    moons: 0,
    description: "The smallest planet in the Solar System and closest to the Sun with extreme temperature swings.",
  },
  Venus: {
    name: "Venus",
    color: "#fde047",
    diameterKm: "12,104 km",
    orbitPeriod: "225 days",
    moons: 0,
    description: "Earth's twin planet enveloped in thick toxic sulfuric acid clouds with a runaway greenhouse effect.",
  },
  Earth: {
    name: "Earth",
    color: "#38bdf8",
    diameterKm: "12,742 km",
    orbitPeriod: "365.25 days",
    moons: 1,
    description: "Our home planet—the only known world in the universe confirmed to harbor liquid water and life.",
  },
  Mars: {
    name: "Mars",
    color: "#ef4444",
    diameterKm: "6,779 km",
    orbitPeriod: "687 days",
    moons: 2,
    description: "The Red Planet featuring Olympus Mons, Valles Marineris, and ancient dry river valleys.",
  },
  Jupiter: {
    name: "Jupiter",
    color: "#fb923c",
    diameterKm: "139,820 km",
    orbitPeriod: "11.8 years",
    moons: 95,
    description: "Gas giant with the Great Red Spot storm, massive magnetosphere, and 95 known orbiting moons.",
  },
  Saturn: {
    name: "Saturn",
    color: "#fef08a",
    diameterKm: "116,460 km",
    orbitPeriod: "29.5 years",
    moons: 146,
    description: "Adorned by thousands of complex icy ringlets, Saturn is a giant ball of hydrogen and helium.",
  },
};

export function MiniSolarSystem() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetInfo | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 320;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 8, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 3, 50);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // 3. Sun Mesh
    const sunGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // Sun Glow Shell
    const sunGlowGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const sunGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff7b54,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
    scene.add(sunGlow);

    // 4. Planets Setup
    const planetsConfig = [
      { name: "Mercury", r: 0.22, dist: 2.2, speed: 1.2, color: 0xa1a1aa },
      { name: "Venus", r: 0.35, dist: 3.2, speed: 0.9, color: 0xfde047 },
      { name: "Earth", r: 0.38, dist: 4.4, speed: 0.7, color: 0x38bdf8 },
      { name: "Mars", r: 0.28, dist: 5.5, speed: 0.55, color: 0xef4444 },
      { name: "Jupiter", r: 0.75, dist: 7.2, speed: 0.35, color: 0xfb923c },
      { name: "Saturn", r: 0.65, dist: 9.0, speed: 0.25, color: 0xfef08a, hasRing: true },
    ];

    const planetMeshes: { mesh: THREE.Mesh; orbitGroup: THREE.Group; name: string }[] = [];

    planetsConfig.forEach((p) => {
      // Orbit Line
      const orbitGeo = new THREE.RingGeometry(p.dist - 0.02, p.dist + 0.02, 64);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1,
      });
      const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
      orbitRing.rotation.x = Math.PI / 2;
      scene.add(orbitRing);

      // Orbit Pivot Group
      const orbitGroup = new THREE.Group();
      scene.add(orbitGroup);

      // Planet Sphere Mesh
      const pGeo = new THREE.SphereGeometry(p.r, 32, 32);
      const pMat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.6 });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.x = p.dist;
      pMesh.userData = { name: p.name };
      orbitGroup.add(pMesh);

      if (p.hasRing) {
        const ringGeo = new THREE.RingGeometry(p.r * 1.4, p.r * 2.2, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: p.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        pMesh.add(ringMesh);
      }

      planetMeshes.push({ mesh: pMesh, orbitGroup, name: p.name });
    });

    // Raycaster for Planet Click Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetMeshes.map((p) => p.mesh));

      if (intersects.length > 0) {
        const hitName = intersects[0].object.userData.name as string;
        if (PLANET_DATA[hitName]) {
          setSelectedPlanet(PLANET_DATA[hitName]);
        }
      }
    };

    const domElement = mountRef.current;
    domElement.addEventListener("click", handleClick);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      sunMesh.rotation.y += delta * 0.2;
      sunGlow.rotation.y += delta * 0.1;

      planetMeshes.forEach((item, idx) => {
        const speed = planetsConfig[idx].speed;
        item.orbitGroup.rotation.y += delta * speed * 0.2;
        item.mesh.rotation.y += delta * 0.8;
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      if (domElement && renderer.domElement) {
        domElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl overflow-hidden group">
      {/* Header Accent */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
        <Orbit className="w-3.5 h-3.5 animate-spin-slow" />
        <span>INTERACTIVE SOLAR SYSTEM (CLICK PLANET)</span>
      </div>

      {/* WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-pointer" />

      {/* Selected Planet Detail Modal Overlay */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-4 z-20 p-5 rounded-2xl bg-slate-950/90 border border-cyan-400/50 backdrop-blur-2xl flex flex-col justify-between shadow-[0_0_30px_rgba(0,229,255,0.3)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-[0_0_10px_currentColor]"
                  style={{ backgroundColor: selectedPlanet.color, color: selectedPlanet.color }}
                />
                <h4 className="text-lg font-bold text-white font-sans">{selectedPlanet.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanet(null)}
                className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed my-2">
              {selectedPlanet.description}
            </p>

            <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-white/5">
                <span className="text-slate-500 block text-[10px]">DIAMETER</span>
                <span className="text-cyan-300 font-semibold">{selectedPlanet.diameterKm}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-white/5">
                <span className="text-slate-500 block text-[10px]">ORBIT</span>
                <span className="text-cyan-300 font-semibold">{selectedPlanet.orbitPeriod}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-white/5">
                <span className="text-slate-500 block text-[10px]">MOONS</span>
                <span className="text-cyan-300 font-semibold">{selectedPlanet.moons}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/solar-system"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition-colors"
              >
                <span>Full Solar Exploration</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
