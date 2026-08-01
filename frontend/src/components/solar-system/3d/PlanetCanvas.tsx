"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PlanetDetail } from "@/mocks/solar-system/planets";

interface PlanetCanvasProps {
  planet: PlanetDetail;
}

export function PlanetCanvas({ planet }: PlanetCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mountRef.current.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(12, 8, 10);
    scene.add(sunLight);

    const rimLight = new THREE.PointLight(
      THREE.Color.NAMES[planet.color as keyof typeof THREE.Color.NAMES] || 0x38bdf8,
      2.0,
      30
    );
    rimLight.position.set(-10, -6, -5);
    scene.add(rimLight);

    // 4. Planet Sphere Mesh
    const hexColor = planet.color.startsWith("#")
      ? parseInt(planet.color.replace("#", "0x"))
      : 0x38bdf8;

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const pGeo = new THREE.SphereGeometry(2.5, 64, 64);
    const pMat = new THREE.MeshStandardMaterial({
      color: hexColor,
      roughness: 0.5,
      metalness: 0.2,
    });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    planetGroup.add(pMesh);

    // Cloud / Atmosphere Outer Shell
    const atmoGeo = new THREE.SphereGeometry(2.62, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: hexColor,
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    planetGroup.add(atmoMesh);

    // Saturn Ring rendering if planet is Saturn
    if (planet.slug === "saturn") {
      const ringGeo = new THREE.RingGeometry(3.2, 5.0, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hexColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.3;
      pMesh.add(ringMesh);
    }

    // Orbiting Moon Mesh
    const moonGroup = new THREE.Group();
    planetGroup.add(moonGroup);

    const moonGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({ color: 0xc8d6e5, roughness: 0.8 });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(4.8, 0.4, 0);
    moonGroup.add(moonMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      pMesh.rotation.y += delta * 0.15;
      atmoMesh.rotation.y += delta * 0.08;
      moonGroup.rotation.y += delta * 0.4;
      moonMesh.rotation.y += delta * 0.2;

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [planet]);

  return <div ref={mountRef} className="w-full h-full min-h-[480px] relative overflow-hidden" />;
}
