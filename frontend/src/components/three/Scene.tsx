"use client";

import { Earth } from "./Earth";
import { Moon } from "./Moon";
import { Starfield } from "./Starfield";
import { Nebula } from "./Nebula";
import { CameraRig } from "./CameraRig";

export function Scene() {
  return (
    <>
      {/* Lighting Setup */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={2.2}
        color="#ffffff"
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#38bdf8" />

      {/* Camera Rig Parallax */}
      <CameraRig />

      {/* Background Deep Space Particles & Nebulae */}
      <Starfield />
      <Nebula />

      {/* Foreground 3D Entities */}
      <Earth />
      <Moon />
    </>
  );
}
