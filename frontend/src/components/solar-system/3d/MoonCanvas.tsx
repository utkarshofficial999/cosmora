"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MoonDetail, LandingSite } from "@/mocks/solar-system/moons";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Rocket } from "lucide-react";

interface MoonCanvasProps {
  moon: MoonDetail;
}

export function MoonCanvas({ moon }: MoonCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedSite, setSelectedSite] = useState<LandingSite | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 480;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(10, 8, 10);
    scene.add(sunLight);

    // 4. Moon Sphere Mesh
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const moonGeo = new THREE.SphereGeometry(2.4, 64, 64);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xc8d6e5,
      roughness: 0.85,
      metalness: 0.1,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moonMesh);

    // 5. Landing Site Pins
    const pinMeshes: { mesh: THREE.Mesh; site: LandingSite }[] = [];

    moon.landingSites.forEach((site) => {
      // Convert lat/long to 3D Cartesian coordinates on sphere surface (r = 2.45)
      const phi = (90 - site.lat) * (Math.PI / 180);
      const theta = (site.long + 180) * (Math.PI / 180);
      const r = 2.48;

      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);

      const pinGeo = new THREE.ConeGeometry(0.12, 0.3, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(x, y, z);
      pinMesh.lookAt(0, 0, 0);
      pinMesh.rotation.x += Math.PI;
      moonGroup.add(pinMesh);

      pinMeshes.push({ mesh: pinMesh, site });
    });

    // Raycaster for Pin Click
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(pinMeshes.map((p) => p.mesh));

      if (intersects.length > 0) {
        const found = pinMeshes.find((p) => p.mesh === intersects[0].object);
        if (found) setSelectedSite(found.site);
      }
    };

    const domElement = mountRef.current;
    domElement.addEventListener("click", handleClick);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      moonGroup.rotation.y += delta * 0.1;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 480;
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
  }, [moon]);

  return (
    <div ref={mountRef} className="w-full h-full min-h-[480px] relative overflow-hidden group">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
        <MapPin className="w-3.5 h-3.5 animate-pulse" />
        <span>CLICK 3D LANDING SITE PINS (APOLLO / CHANDRAYAAN)</span>
      </div>

      {/* Selected Site Modal Overlay */}
      <AnimatePresence>
        {selectedSite && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-4 z-20 p-6 rounded-2xl bg-slate-950/90 border border-cyan-400/50 backdrop-blur-2xl flex flex-col justify-between shadow-[0_0_35px_rgba(0,229,255,0.4)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-bold text-white font-sans">{selectedSite.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSite(null)}
                className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed my-3 font-sans">
              {selectedSite.description}
            </p>

            <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-white/10">
                <span className="text-slate-500 block text-[10px]">AGENCY</span>
                <span className="text-cyan-300 font-bold">{selectedSite.agency}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-white/10">
                <span className="text-slate-500 block text-[10px]">YEAR</span>
                <span className="text-cyan-300 font-bold">{selectedSite.year}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-white/10">
                <span className="text-slate-500 block text-[10px]">COORDINATES</span>
                <span className="text-cyan-300 font-bold">
                  {selectedSite.lat}°N, {selectedSite.long}°E
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
