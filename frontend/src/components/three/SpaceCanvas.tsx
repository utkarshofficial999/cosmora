"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function SpaceCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8.5);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(10, 10, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 0.5);
    pointLight.position.set(-10, -10, -10);
    scene.add(pointLight);

    // 4. Procedural Earth Texture Canvas
    const earthCanvas = document.createElement("canvas");
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const ctx = earthCanvas.getContext("2d");
    if (ctx) {
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, earthCanvas.height);
      oceanGrad.addColorStop(0, "#030e2e");
      oceanGrad.addColorStop(0.5, "#081b4b");
      oceanGrad.addColorStop(1, "#020a22");
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, earthCanvas.width, earthCanvas.height);

      ctx.fillStyle = "#1e3a1e";
      for (let i = 0; i < 400; i++) {
        const x = (Math.sin(i * 99) * 0.5 + 0.5) * earthCanvas.width;
        const y = (Math.cos(i * 33) * 0.5 + 0.5) * earthCanvas.height;
        const r = 30 + (i % 60);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "#1b4332" : "#2d6a4f";
        ctx.fill();
      }

      for (let i = 0; i < 600; i++) {
        const x = (Math.sin(i * 147) * 0.5 + 0.5) * earthCanvas.width;
        const y = (Math.cos(i * 77) * 0.5 + 0.5) * earthCanvas.height;
        ctx.fillStyle = "rgba(255, 200, 100, 0.8)";
        ctx.fillRect(x, y, 2, 2);
      }
    }

    const earthGeo = new THREE.SphereGeometry(2.5, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(earthCanvas),
      roughness: 0.6,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    // Atmosphere Glow
    const atmosphereGeo = new THREE.SphereGeometry(2.62, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // 5. Moon Setup
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const moonCanvas = document.createElement("canvas");
    moonCanvas.width = 512;
    moonCanvas.height = 256;
    const mctx = moonCanvas.getContext("2d");
    if (mctx) {
      mctx.fillStyle = "#888888";
      mctx.fillRect(0, 0, moonCanvas.width, moonCanvas.height);
      mctx.fillStyle = "#666666";
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * moonCanvas.width;
        const y = Math.random() * moonCanvas.height;
        const r = 3 + Math.random() * 15;
        mctx.beginPath();
        mctx.arc(x, y, r, 0, Math.PI * 2);
        mctx.fill();
      }
    }

    const moonGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(moonCanvas),
      roughness: 0.9,
      metalness: 0.05,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(5.5, 0.8, 0);
    moonGroup.add(moonMesh);

    // 6. Starfield Setup
    const starCount = 3000;
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 20 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);

      const colorType = Math.random();
      if (colorType > 0.8) {
        starCol[i * 3] = 0.2; starCol[i * 3 + 1] = 0.8; starCol[i * 3 + 2] = 1.0;
      } else if (colorType > 0.6) {
        starCol[i * 3] = 1.0; starCol[i * 3 + 1] = 0.8; starCol[i * 3 + 2] = 0.4;
      } else {
        starCol[i * 3] = 0.9; starCol[i * 3 + 1] = 0.95; starCol[i * 3 + 2] = 1.0;
      }
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // 7. Mouse Parallax Handler
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // 8. Animation Loop (60 FPS)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      earthMesh.rotation.y += delta * 0.05;
      atmosphereMesh.rotation.y += delta * 0.03;
      moonGroup.rotation.y += delta * 0.08;
      moonMesh.rotation.y += delta * 0.04;
      starfield.rotation.y += delta * 0.008;

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
}
