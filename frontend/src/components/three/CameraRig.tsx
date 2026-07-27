"use client";

import { useFrame } from "@react-three/fiber";

export function CameraRig() {
  useFrame((state) => {
    // Subtle mouse parallax camera positioning
    const targetX = state.pointer.x * 0.8;
    const targetY = state.pointer.y * 0.8;

    state.camera.position.x += (targetX - state.camera.position.x) * 0.05;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.05;

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
