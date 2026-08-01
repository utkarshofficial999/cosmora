"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface AuthBackgroundCanvasProps {
  focusedBody?: "earth" | "deep-space" | "satellite" | "galaxy";
}

export function AuthBackgroundCanvas({ focusedBody = "earth" }: AuthBackgroundCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Initial camera position based on focused body context
    if (focusedBody === "deep-space" || focusedBody === "galaxy") {
      camera.position.set(0, 0, 14);
    } else if (focusedBody === "satellite") {
      camera.position.set(-3, 2, 9);
    } else {
      camera.position.set(2, 0, 8.5);
    }

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    sunLight.position.set(15, 12, 8);
    scene.add(sunLight);

    const cyanRimLight = new THREE.PointLight(0x00e5ff, 2.5, 30);
    cyanRimLight.position.set(-12, -8, -5);
    scene.add(cyanRimLight);

    const purpleGlowLight = new THREE.PointLight(0x8b5cf6, 2.0, 30);
    purpleGlowLight.position.set(8, -10, 5);
    scene.add(purpleGlowLight);

    // 4. Procedural Textures & Earth Mesh
    const earthCanvas = document.createElement("canvas");
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const ctx = earthCanvas.getContext("2d");
    if (ctx) {
      // Ocean Base
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, earthCanvas.height);
      oceanGrad.addColorStop(0, "#020b26");
      oceanGrad.addColorStop(0.5, "#081d4f");
      oceanGrad.addColorStop(1, "#02071a");
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, earthCanvas.width, earthCanvas.height);

      // Continents
      ctx.fillStyle = "#1e3a2b";
      for (let i = 0; i < 450; i++) {
        const x = (Math.sin(i * 123) * 0.5 + 0.5) * earthCanvas.width;
        const y = (Math.cos(i * 47) * 0.5 + 0.5) * earthCanvas.height;
        const r = 25 + (i % 65);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? "#143823" : i % 2 === 0 ? "#235338" : "#2d6a4f";
        ctx.fill();
      }

      // Night City Lights (Glow)
      for (let i = 0; i < 800; i++) {
        const x = (Math.sin(i * 187) * 0.5 + 0.5) * earthCanvas.width;
        const y = (Math.cos(i * 91) * 0.5 + 0.5) * earthCanvas.height;
        ctx.fillStyle = i % 5 === 0 ? "rgba(56, 189, 248, 0.9)" : "rgba(255, 210, 120, 0.85)";
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // Clouds texture
    const cloudCanvas = document.createElement("canvas");
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cctx = cloudCanvas.getContext("2d");
    if (cctx) {
      cctx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);
      cctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      for (let i = 0; i < 300; i++) {
        const x = (Math.sin(i * 77) * 0.5 + 0.5) * cloudCanvas.width;
        const y = (Math.cos(i * 37) * 0.5 + 0.5) * cloudCanvas.height;
        const r = 15 + (i % 45);
        cctx.beginPath();
        cctx.arc(x, y, r, 0, Math.PI * 2);
        cctx.fill();
      }
    }

    const earthGroup = new THREE.Group();
    earthGroup.position.set(focusedBody === "earth" ? 3.2 : 4.5, -0.5, -1);
    scene.add(earthGroup);

    // Earth Sphere
    const earthGeo = new THREE.SphereGeometry(2.6, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(earthCanvas),
      roughness: 0.55,
      metalness: 0.15,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Earth Cloud Layer
    const cloudGeo = new THREE.SphereGeometry(2.63, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(cloudCanvas),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // Atmosphere Glow Outer Shell
    const atmoGeo = new THREE.SphereGeometry(2.74, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    earthGroup.add(atmoMesh);

    // Orbit Ring around Earth
    const ringGeo = new THREE.RingGeometry(3.6, 3.65, 128);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    earthGroup.add(ringMesh);

    // 5. Moon Setup
    const moonGroup = new THREE.Group();
    earthGroup.add(moonGroup);

    const moonGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xc8d6e5,
      roughness: 0.9,
      metalness: 0.05,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(5.2, 0.6, -1);
    moonGroup.add(moonMesh);

    // 6. Mars Mesh (Distant Red Planet)
    const marsGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const marsMat = new THREE.MeshStandardMaterial({
      color: 0xdd4b2b,
      roughness: 0.7,
      metalness: 0.2,
    });
    const marsMesh = new THREE.Mesh(marsGeo, marsMat);
    marsMesh.position.set(-7, 4, -8);
    scene.add(marsMesh);

    // Mars Glow
    const marsGlowGeo = new THREE.SphereGeometry(1.28, 32, 32);
    const marsGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff7b54,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const marsGlowMesh = new THREE.Mesh(marsGlowGeo, marsGlowMat);
    marsMesh.add(marsGlowMesh);

    // 7. Satellite Geometry
    const satelliteGroup = new THREE.Group();
    // Satellite Body
    const satBodyGeo = new THREE.BoxGeometry(0.4, 0.4, 0.6);
    const satBodyMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.1,
    });
    const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);
    satelliteGroup.add(satBody);

    // Solar Wings
    const wingGeo = new THREE.BoxGeometry(1.6, 0.02, 0.35);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(1.0, 0, 0);
    satelliteGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(-1.0, 0, 0);
    satelliteGroup.add(rightWing);

    // Satellite Dish Antenna
    const dishGeo = new THREE.ConeGeometry(0.2, 0.15, 16);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8 });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = Math.PI / 2;
    dish.position.set(0, 0, 0.4);
    satelliteGroup.add(dish);

    satelliteGroup.position.set(-3.5, 1.8, 2);
    satelliteGroup.scale.set(0.7, 0.7, 0.7);
    scene.add(satelliteGroup);

    // 8. Starfield Particles
    const starCount = 3500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 30 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const colorChoice = Math.random();
      if (colorChoice > 0.85) {
        // Cyan Star
        starColors[i * 3] = 0.0; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 1.0;
      } else if (colorChoice > 0.7) {
        // Purple/Gold Star
        starColors[i * 3] = 0.7; starColors[i * 3 + 1] = 0.5; starColors[i * 3 + 2] = 1.0;
      } else {
        // Crisp White Star
        starColors[i * 3] = 0.95; starColors[i * 3 + 1] = 0.98; starColors[i * 3 + 2] = 1.0;
      }
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // 9. Nebula Glow Particles Mesh
    const nebulaCount = 600;
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    for (let i = 0; i < nebulaCount; i++) {
      nebulaPositions[i * 3] = (Math.random() - 0.5) * 30;
      nebulaPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      nebulaPositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    }
    const nebulaGeo = new THREE.BufferGeometry();
    nebulaGeo.setAttribute("position", new THREE.BufferAttribute(nebulaPositions, 3));
    const nebulaMat = new THREE.PointsMaterial({
      size: 1.8,
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const nebulaPoints = new THREE.Points(nebulaGeo, nebulaMat);
    scene.add(nebulaPoints);

    // 10. Mouse Parallax & Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

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

    // 11. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Earth rotations
      earthMesh.rotation.y += delta * 0.06;
      cloudMesh.rotation.y += delta * 0.08;
      atmoMesh.rotation.y += delta * 0.04;
      ringMesh.rotation.z += delta * 0.02;

      // Moon Orbit
      moonGroup.rotation.y += delta * 0.09;
      moonMesh.rotation.y += delta * 0.05;

      // Mars rotation & float
      marsMesh.rotation.y += delta * 0.03;
      marsMesh.position.y = 4 + Math.sin(time * 0.8) * 0.3;

      // Satellite orbit float & orientation
      satelliteGroup.position.x = -3.5 + Math.sin(time * 0.5) * 0.8;
      satelliteGroup.position.y = 1.8 + Math.cos(time * 0.6) * 0.4;
      satelliteGroup.rotation.y += delta * 0.15;
      satelliteGroup.rotation.z = Math.sin(time * 0.4) * 0.1;

      // Stars & Nebula slow spin
      starfield.rotation.y += delta * 0.005;
      nebulaPoints.rotation.y += delta * 0.008;

      // Smooth camera lerp parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = (focusedBody === "satellite" ? -2 : focusedBody === "earth" ? 1.5 : 0) + targetX * 0.8;
      camera.position.y = targetY * -0.6;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [focusedBody]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
}
