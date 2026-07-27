"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface StoryBackgroundProps {
  theme: "moon" | "mars" | "deep-space" | "iss";
}

export function StoryBackground({ theme }: StoryBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Ambient Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(
      theme === "mars" ? 0xf97316 : 0x38bdf8,
      2.0
    );
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // 3. Subject Mesh Based on Theme
    let mainMesh: THREE.Mesh | null = null;

    if (theme === "moon") {
      const geo = new THREE.SphereGeometry(3.0, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.9,
      });
      mainMesh = new THREE.Mesh(geo, mat);
      mainMesh.position.set(4, -1, -2);
      scene.add(mainMesh);
    } else if (theme === "mars") {
      const geo = new THREE.SphereGeometry(3.2, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.8,
      });
      mainMesh = new THREE.Mesh(geo, mat);
      mainMesh.position.set(4, -1, -2);
      scene.add(mainMesh);
    } else {
      // Deep Space Volumetric Nebula
      const geo = new THREE.SphereGeometry(3.5, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      });
      mainMesh = new THREE.Mesh(geo, mat);
      mainMesh.position.set(4, 0, -3);
      scene.add(mainMesh);
    }

    // 4. Starfield Particles
    const count = 2500;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.5,
      color: theme === "mars" ? 0xfed7aa : 0xbae6fd,
      transparent: true,
      opacity: 0.7,
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 1.2;
    };
    window.addEventListener("mousemove", onMouseMove);

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
      if (mainMesh) {
        mainMesh.rotation.y += delta * 0.04;
      }
      starfield.rotation.y += delta * 0.005;

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
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
}
