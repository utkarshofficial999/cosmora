"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Moon() {
  const moonRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);

  // Generate procedural Moon crater texture
  const moonTexture = useMemo(() => {
    if (typeof window === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#888888";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Craters
      ctx.fillStyle = "#666666";
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = 3 + Math.random() * 15;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * 0.08;
    }
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={orbitGroupRef}>
      <mesh ref={moonRef} position={[5.5, 0.8, 0]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          map={moonTexture || undefined}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}
