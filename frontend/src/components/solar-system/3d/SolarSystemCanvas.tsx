"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface SolarSystemCanvasProps {
  speedFactor?: number;
  nightMode?: boolean;
  selectedSlug?: string;
  onSelectPlanet?: (planetSlug: string) => void;
}

export function SolarSystemCanvas({
  speedFactor = 1,
  nightMode = false,
  selectedSlug = "earth",
  onSelectPlanet,
}: SolarSystemCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.006);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 26, 48);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = nightMode ? 0.6 : 1.4;
    mountRef.current.appendChild(renderer.domElement);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, nightMode ? 0.12 : 0.35);
    scene.add(ambientLight);

    const sunPointLight = new THREE.PointLight(0xfff5ea, nightMode ? 2.5 : 5.0, 400);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    // 4. Procedural Textures Helper Functions
    // A. Sun Texture
    const createSunTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, "#fbbf24");
        grad.addColorStop(0.5, "#f97316");
        grad.addColorStop(1, "#ea580c");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 512);

        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        for (let i = 0; i < 300; i++) {
          const x = Math.random() * 1024;
          const y = Math.random() * 512;
          const r = 5 + Math.random() * 20;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return new THREE.CanvasTexture(canvas);
    };

    // B. Earth Texture
    const createEarthTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
        oceanGrad.addColorStop(0, "#020b26");
        oceanGrad.addColorStop(0.5, "#081d4f");
        oceanGrad.addColorStop(1, "#02071a");
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, 0, 1024, 512);

        ctx.fillStyle = "#1e3a2b";
        for (let i = 0; i < 400; i++) {
          const x = (Math.sin(i * 123) * 0.5 + 0.5) * 1024;
          const y = (Math.cos(i * 47) * 0.5 + 0.5) * 512;
          const r = 20 + (i % 55);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? "#143823" : "#2d6a4f";
          ctx.fill();
        }
      }
      return new THREE.CanvasTexture(canvas);
    };

    // C. Jupiter Texture (Bands & Great Red Spot)
    const createJupiterTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#c2410c";
        ctx.fillRect(0, 0, 1024, 512);

        // Bands
        const colors = ["#ea580c", "#fb923c", "#f97316", "#7c2d12", "#fed7aa", "#c2410c"];
        for (let y = 0; y < 512; y += 16) {
          ctx.fillStyle = colors[(y / 16) % colors.length];
          ctx.fillRect(0, y, 1024, 16 + (y % 8));
        }

        // Great Red Spot
        ctx.fillStyle = "#b91c1c";
        ctx.beginPath();
        ctx.ellipse(650, 320, 60, 35, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    // D. Saturn Texture
    const createSaturnTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const colors = ["#ca8a04", "#eab308", "#fef08a", "#a16207", "#fef9c3"];
        for (let y = 0; y < 512; y += 12) {
          ctx.fillStyle = colors[(y / 12) % colors.length];
          ctx.fillRect(0, y, 1024, 12);
        }
      }
      return new THREE.CanvasTexture(canvas);
    };

    // 5. Sun Mesh
    const sunGeo = new THREE.SphereGeometry(3.4, 64, 64);
    const sunMat = new THREE.MeshBasicMaterial({ map: createSunTexture() });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // Sun Outer Volumetric Corona Glow
    const sunCoronaGeo = new THREE.SphereGeometry(3.9, 64, 64);
    const sunCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xff7b54,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const sunCorona = new THREE.Mesh(sunCoronaGeo, sunCoronaMat);
    scene.add(sunCorona);

    // 6. Real 3D Planet Objects & Orbits
    const planetConfigs = [
      { slug: "mercury", dist: 6.2, size: 0.4, speed: 1.6, color: 0xa1a1aa, texture: null },
      { slug: "venus", dist: 9.0, size: 0.6, speed: 1.2, color: 0xfde047, texture: null },
      { slug: "earth", dist: 12.5, size: 0.7, speed: 1.0, color: 0x38bdf8, texture: createEarthTexture() },
      { slug: "mars", dist: 16.0, size: 0.5, speed: 0.8, color: 0xef4444, texture: null },
      { slug: "jupiter", dist: 22.0, size: 1.6, speed: 0.45, color: 0xf97316, texture: createJupiterTexture() },
      { slug: "saturn", dist: 28.5, size: 1.3, speed: 0.32, color: 0xeab308, texture: createSaturnTexture(), hasRings: true },
      { slug: "uranus", dist: 35.0, size: 0.95, speed: 0.22, color: 0x38bdf8, texture: null },
      { slug: "neptune", dist: 41.5, size: 0.9, speed: 0.16, color: 0x6366f1, texture: null },
    ];

    const planetMeshes: { mesh: THREE.Mesh; pivot: THREE.Group; slug: string }[] = [];

    planetConfigs.forEach((p) => {
      // Glow Orbit Path Line
      const orbitGeo = new THREE.RingGeometry(p.dist - 0.06, p.dist + 0.06, 128);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: p.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: selectedSlug === p.slug ? 0.6 : 0.2,
      });
      const orbitLine = new THREE.Mesh(orbitGeo, orbitMat);
      orbitLine.rotation.x = Math.PI / 2;
      scene.add(orbitLine);

      // Pivot Group
      const pivot = new THREE.Group();
      scene.add(pivot);

      // Planet Mesh
      const geo = new THREE.SphereGeometry(p.size, 64, 64);
      const mat = new THREE.MeshStandardMaterial({
        map: p.texture || undefined,
        color: p.texture ? 0xffffff : p.color,
        roughness: 0.5,
        metalness: 0.15,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = p.dist;
      mesh.userData = { slug: p.slug };
      pivot.add(mesh);

      // Atmosphere Shell for Earth & Venus
      if (p.slug === "earth" || p.slug === "venus") {
        const atmoGeo = new THREE.SphereGeometry(p.size * 1.05, 32, 32);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: p.color,
          transparent: true,
          opacity: 0.25,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
        });
        const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
        mesh.add(atmoMesh);
      }

      // Saturn Realistic Ring System
      if (p.hasRings) {
        const ringGeo = new THREE.RingGeometry(p.size * 1.4, p.size * 2.5, 64);
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
      if (p.slug === "earth") {
        const moonPivot = new THREE.Group();
        mesh.add(moonPivot);
        const moonGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xc8d6e5, roughness: 0.9 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.x = 1.3;
        moonPivot.add(moonMesh);
      }

      planetMeshes.push({ mesh, pivot, slug: p.slug });
    });

    // 7. Asteroid Belt Particles (3,000 Particles)
    const asteroidCount = 3000;
    const asteroidPositions = new Float32Array(asteroidCount * 3);
    for (let i = 0; i < asteroidCount; i++) {
      const dist = 18.0 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 1.2;

      asteroidPositions[i * 3] = Math.cos(angle) * dist;
      asteroidPositions[i * 3 + 1] = height;
      asteroidPositions[i * 3 + 2] = Math.sin(angle) * dist;
    }

    const astGeo = new THREE.BufferGeometry();
    astGeo.setAttribute("position", new THREE.BufferAttribute(asteroidPositions, 3));
    const astMat = new THREE.PointsMaterial({
      size: 0.28,
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.7,
    });
    const asteroidBelt = new THREE.Points(astGeo, astMat);
    scene.add(asteroidBelt);

    // 8. Deep Starfield Particles
    const starCount = 4500;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 80 + Math.random() * 350;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.8, color: 0xffffff, transparent: true, opacity: 0.85 });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // Mouse Controls
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Raycaster Click Handler
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseVector, camera);

      const intersects = raycaster.intersectObjects(planetMeshes.map((p) => p.mesh));
      if (intersects.length > 0) {
        const slug = intersects[0].object.userData.slug;
        if (slug && onSelectPlanet) {
          onSelectPlanet(slug);
        }
      }
    };
    window.addEventListener("click", handleClick);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      sunMesh.rotation.y += delta * 0.1;
      sunCorona.rotation.y += delta * 0.05;
      asteroidBelt.rotation.y += delta * 0.02 * speedFactor;
      starfield.rotation.y += delta * 0.002;

      planetMeshes.forEach((item, idx) => {
        const config = planetConfigs[idx];
        item.pivot.rotation.y += delta * config.speed * 0.12 * speedFactor;
        item.mesh.rotation.y += delta * 0.6 * speedFactor;
      });

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      camera.position.x = targetX * 6;
      camera.position.y = 26 + targetY * -5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", onResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [speedFactor, nightMode, selectedSlug, onSelectPlanet]);

  return <div ref={mountRef} className="fixed inset-0 z-0 overflow-hidden cursor-grab active:cursor-grabbing" />;
}
