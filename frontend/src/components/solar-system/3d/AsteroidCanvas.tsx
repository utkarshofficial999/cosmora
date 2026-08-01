"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MOCK_ASTEROIDS } from "@/mocks/solar-system/asteroids";

interface AsteroidCanvasProps {
  onSelectAsteroid?: (id: string) => void;
}

export function AsteroidCanvas({ onSelectAsteroid }: AsteroidCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.01);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffaa00, 3.5, 200);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Sun Mesh
    const sunGeo = new THREE.SphereGeometry(2.0, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // 4. Asteroid Belt Particles Mesh (2500 particles)
    const count = 2500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const dist = 10.0 + Math.random() * 12.0;
      const angle = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * 2.5;

      positions[i * 3] = Math.cos(angle) * dist;
      positions[i * 3 + 1] = h;
      positions[i * 3 + 2] = Math.sin(angle) * dist;

      if (i % 8 === 0) {
        // Red Hazardous Asteroid Highlight
        colors[i * 3] = 0.93; colors[i * 3 + 1] = 0.27; colors[i * 3 + 2] = 0.27;
      } else {
        // Slate/Grey Asteroid
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.65; colors[i * 3 + 2] = 0.7;
      }
    }

    const astGeo = new THREE.BufferGeometry();
    astGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    astGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const astMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const asteroidCloud = new THREE.Points(astGeo, astMat);
    scene.add(asteroidCloud);

    // 5. Named NEO Orbit Markers
    const neoGroup = new THREE.Group();
    scene.add(neoGroup);

    MOCK_ASTEROIDS.forEach((ast, idx) => {
      const dist = 8 + idx * 3.5;
      const geo = new THREE.DodecahedronGeometry(ast.hazardous ? 0.6 : 0.45, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: ast.hazardous ? 0xef4444 : 0x38bdf8,
        roughness: 0.9,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(dist, (idx % 2 === 0 ? 0.8 : -0.8), 0);
      mesh.userData = { id: ast.id };
      neoGroup.add(mesh);
    });

    // Mouse Interaction
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

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      asteroidCloud.rotation.y += delta * 0.05;
      neoGroup.rotation.y += delta * 0.08;

      camera.position.x += (mouseX * 4 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 3 + 15 - camera.position.y) * 0.04;
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
  }, [onSelectAsteroid]);

  return <div ref={mountRef} className="fixed inset-0 z-0 overflow-hidden" />;
}
