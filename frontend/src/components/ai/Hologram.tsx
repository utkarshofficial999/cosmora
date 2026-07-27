"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface HologramProps {
  state: "idle" | "thinking" | "speaking";
}

export function Hologram({ state }: HologramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 3.5, 20);
    cyanPoint.position.set(0, 0, 4);
    scene.add(cyanPoint);

    const purplePoint = new THREE.PointLight(0xa855f7, 3.0, 20);
    purplePoint.position.set(0, 0, -4);
    scene.add(purplePoint);

    // 3. Central Energy Core Sphere
    const coreGeo = new THREE.IcosahedronGeometry(1.4, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Inner Inner Solid Glow Core
    const innerGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // 4. Gyroscopic Outer Hologram Rings
    const ring1Geo = new THREE.TorusGeometry(2.2, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    scene.add(ring1Mesh);

    const ring2Geo = new THREE.TorusGeometry(2.6, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.5,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = Math.PI / 3;
    scene.add(ring2Mesh);

    // 5. Floating Dust Light Particles
    const particleCount = 400;
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 10;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Resize Handler
    const onResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", onResize);

    // 6. Animation Loop & State Reactive Motion
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (state === "thinking") {
        // Fast rotation & energetic pulsing during AI retrieval/thinking
        coreMesh.rotation.x += 0.05;
        coreMesh.rotation.y += 0.07;
        ring1Mesh.rotation.z += 0.08;
        ring2Mesh.rotation.y += 0.09;

        const pulseScale = 1 + Math.sin(elapsed * 12) * 0.15;
        innerMesh.scale.set(pulseScale, pulseScale, pulseScale);
      } else if (state === "speaking") {
        // Smooth audio reactive wave pulsing
        coreMesh.rotation.x += 0.02;
        coreMesh.rotation.y += 0.03;
        ring1Mesh.rotation.z += 0.03;
        ring2Mesh.rotation.y += 0.04;

        const speakScale = 1 + Math.sin(elapsed * 8) * 0.12;
        innerMesh.scale.set(speakScale, speakScale, speakScale);
      } else {
        // Idle gentle floating & breathing rotation
        coreMesh.rotation.x += 0.008;
        coreMesh.rotation.y += 0.012;
        ring1Mesh.rotation.z += 0.01;
        ring2Mesh.rotation.y += 0.015;

        const idleScale = 1 + Math.sin(elapsed * 2) * 0.05;
        innerMesh.scale.set(idleScale, idleScale, idleScale);
      }

      particleSystem.rotation.y += 0.003;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [state]);

  return <div ref={containerRef} className="w-full h-full min-h-[300px]" />;
}
