"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MOCK_SPACECRAFT } from "@/mocks/solar-system/space-map";

interface SpaceMapCanvasProps {
  timeOffsetYears?: number; // -50 to +50 years
}

export function SpaceMapCanvas({ timeOffsetYears = 0 }: SpaceMapCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.005);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 45, 60);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 3. Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffaa00, 4, 400);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Sun Mesh
    const sunGeo = new THREE.SphereGeometry(3.0, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // 4. Planets with Time Shift Rotation
    const planetDistances = [
      { name: "Mercury", dist: 6, color: 0xa1a1aa, speed: 4.0 },
      { name: "Venus", dist: 9, color: 0xfde047, speed: 2.8 },
      { name: "Earth", dist: 12, color: 0x38bdf8, speed: 2.0 },
      { name: "Mars", dist: 16, color: 0xef4444, speed: 1.5 },
      { name: "Jupiter", dist: 22, color: 0xf97316, speed: 0.8 },
      { name: "Saturn", dist: 28, color: 0xeab308, speed: 0.5 },
      { name: "Uranus", dist: 35, color: 0x38bdf8, speed: 0.3 },
      { name: "Neptune", dist: 42, color: 0x6366f1, speed: 0.2 },
    ];

    planetDistances.forEach((p) => {
      // Orbit Path Line
      const orbitGeo = new THREE.RingGeometry(p.dist - 0.08, p.dist + 0.08, 128);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: p.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      });
      const orbitLine = new THREE.Mesh(orbitGeo, orbitMat);
      orbitLine.rotation.x = Math.PI / 2;
      scene.add(orbitLine);

      // Shifted Planet Position based on timeOffsetYears
      const angle = (timeOffsetYears * p.speed * 0.1) % (Math.PI * 2);
      const x = Math.cos(angle) * p.dist;
      const z = Math.sin(angle) * p.dist;

      const pGeo = new THREE.SphereGeometry(0.7, 32, 32);
      const pMat = new THREE.MeshStandardMaterial({ color: p.color });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(x, 0, z);
      scene.add(pMesh);
    });

    // 5. Spacecraft Trajectory Vectors
    MOCK_SPACECRAFT.forEach((craft) => {
      const cGeo = new THREE.ConeGeometry(0.5, 1.2, 8);
      const cMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.position.set(craft.coordinates.x / 3, craft.coordinates.y / 3, craft.coordinates.z / 3);
      scene.add(cMesh);

      // Trajectory Line to Sun
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(craft.coordinates.x / 3, craft.coordinates.y / 3, craft.coordinates.z / 3),
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.4 });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
    });

    // Mouse Controls & Animation
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      sunMesh.rotation.y += delta * 0.1;

      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 4 + 45 - camera.position.y) * 0.05;
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
  }, [timeOffsetYears]);

  return <div ref={mountRef} className="fixed inset-0 z-0 overflow-hidden" />;
}
