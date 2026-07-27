"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Starfield() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Radius distribution from 20 to 120
      const r = 20 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Star color variation (blue, cyan, white, yellow)
      const colorType = Math.random();
      if (colorType > 0.8) {
        // Cyan Star
        col[i * 3] = 0.2;
        col[i * 3 + 1] = 0.8;
        col[i * 3 + 2] = 1.0;
      } else if (colorType > 0.6) {
        // Gold Star
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.8;
        col[i * 3 + 2] = 0.4;
      } else {
        // White-Blue Star
        col[i * 3] = 0.9;
        col[i * 3 + 1] = 0.95;
        col[i * 3 + 2] = 1.0;
      }
    }

    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        vertexColors={true}
        transparent={true}
        opacity={0.85}
        sizeAttenuation={true}
      />
    </points>
  );
}
