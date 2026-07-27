"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Nebula() {
  const nebulaRef = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = -15 + (Math.random() - 0.5) * 30;
    }

    return pos;
  }, []);

  useFrame((_, delta) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.z += delta * 0.005;
    }
  });

  return (
    <group ref={nebulaRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={4.0}
          color="#6366f1"
          transparent={true}
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
