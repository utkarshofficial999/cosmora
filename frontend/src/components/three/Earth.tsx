"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Generate high-resolution procedural Earth texture canvas
  const [earthTexture, cloudTexture] = useMemo(() => {
    if (typeof window === "undefined") return [null, null];

    // 1. Earth Surface Texture Canvas
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Deep Ocean Background
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      oceanGrad.addColorStop(0, "#030e2e");
      oceanGrad.addColorStop(0.5, "#081b4b");
      oceanGrad.addColorStop(1, "#020a22");
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Continent Noise & Landmasses
      ctx.fillStyle = "#1e3a1e";
      for (let i = 0; i < 400; i++) {
        const x = (Math.sin(i * 99) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(i * 33) * 0.5 + 0.5) * canvas.height;
        const r = 30 + (i % 60);

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "#1b4332" : "#2d6a4f";
        ctx.fill();
      }

      // Night City Lights
      for (let i = 0; i < 600; i++) {
        const x = (Math.sin(i * 147) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(i * 77) * 0.5 + 0.5) * canvas.height;

        ctx.fillStyle = "rgba(255, 200, 100, 0.8)";
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // 2. Cloud Layer Texture Canvas
    const cloudCanvas = document.createElement("canvas");
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cloudCtx = cloudCanvas.getContext("2d");

    if (cloudCtx) {
      cloudCtx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);
      cloudCtx.fillStyle = "rgba(255, 255, 255, 0.4)";

      for (let i = 0; i < 250; i++) {
        const x = (Math.sin(i * 88) * 0.5 + 0.5) * cloudCanvas.width;
        const y = (Math.cos(i * 44) * 0.5 + 0.5) * cloudCanvas.height;
        const r = 20 + (i % 40);

        cloudCtx.beginPath();
        cloudCtx.arc(x, y, r, 0, Math.PI * 2);
        cloudCtx.fill();
      }
    }

    const t1 = new THREE.CanvasTexture(canvas);
    const t2 = new THREE.CanvasTexture(cloudCanvas);

    return [t1, t2];
  }, []);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.07;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Primary Earth Globe */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture || undefined}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[2.53, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture || undefined}
          transparent={true}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.62, 64, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
