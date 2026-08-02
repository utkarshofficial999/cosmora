"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface UniverseCanvasProps {
  activeAct: number; // 0, 1, 2, 3
  progress?: number; // 0 to 1 scroll progress
  className?: string;
  is3DMode?: boolean;
}

export function UniverseCanvas({ activeAct, className = "" }: UniverseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    camera.position.set(0, 3, 14);

    const textureLoader = new THREE.TextureLoader();

    // ─── Shared Deep Space Starfield ───
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 50 + Math.random() * 200;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      starPositions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      starPositions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      starPositions[i * 3 + 2] = r * Math.cos(ph);

      const colorChoice = Math.random();
      if (colorChoice > 0.7) { starColors[i*3] = 0.6; starColors[i*3+1] = 0.8; starColors[i*3+2] = 1.0; } // Cyan
      else if (colorChoice > 0.4) { starColors[i*3] = 1.0; starColors[i*3+1] = 0.8; starColors[i*3+2] = 0.5; } // Gold
      else { starColors[i*3] = 1.0; starColors[i*3+1] = 1.0; starColors[i*3+2] = 1.0; } // White
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.8, vertexColors: true, transparent: true, opacity: 0.85 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ════════════════════════════════════════════════════════════════
    // ACT I: THE GREAT FRACTURE & 4K GRAVITATIONAL LENSING BLACK HOLE
    // ════════════════════════════════════════════════════════════════
    const act1Group = new THREE.Group();
    scene.add(act1Group);

    // 4K Big Bang Explosion Particles (6,000 fragments with color gradients)
    const bigBangCount = 6000;
    const bbPos = new Float32Array(bigBangCount * 3);
    const bbColors = new Float32Array(bigBangCount * 3);
    for (let i = 0; i < bigBangCount; i++) {
      const r = 0.2 + Math.pow(Math.random(), 2) * 14;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      bbPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      bbPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      bbPos[i * 3 + 2] = r * Math.cos(ph);

      if (r < 3.0) { bbColors[i*3] = 0.95; bbColors[i*3+1] = 0.3; bbColors[i*3+2] = 0.9; } // Bright Magenta
      else if (r < 7.0) { bbColors[i*3] = 0.6; bbColors[i*3+1] = 0.2; bbColors[i*3+2] = 1.0; } // Purple
      else { bbColors[i*3] = 0.2; bbColors[i*3+1] = 0.7; bbColors[i*3+2] = 1.0; } // Cyan
    }
    const bbGeo = new THREE.BufferGeometry();
    bbGeo.setAttribute("position", new THREE.BufferAttribute(bbPos, 3));
    bbGeo.setAttribute("color", new THREE.BufferAttribute(bbColors, 3));
    const bbMat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const bbPoints = new THREE.Points(bbGeo, bbMat);
    act1Group.add(bbPoints);

    // Primordial Supermassive Black Hole Event Horizon (Pure Pitch Black)
    const bhCoreGeo = new THREE.SphereGeometry(1.8, 64, 64);
    const bhCoreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const bhCore = new THREE.Mesh(bhCoreGeo, bhCoreMat);
    act1Group.add(bhCore);

    // Blinding Photon Sphere Ring (Event Horizon Glow Ring)
    const photonSphereGeo = new THREE.SphereGeometry(1.86, 64, 64);
    const photonSphereMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    act1Group.add(new THREE.Mesh(photonSphereGeo, photonSphereMat));

    // Primary Accretion Disk (Interstellar-style horizontal disk)
    const bhDiskGeo = new THREE.RingGeometry(2.0, 5.5, 128);
    const bhDiskMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const bhDisk = new THREE.Mesh(bhDiskGeo, bhDiskMat);
    bhDisk.rotation.x = Math.PI / 2.3;
    act1Group.add(bhDisk);

    // Warped Vertical Lensing Disk (Gravitational Lensing Light Bend Ring around Y Axis)
    const bhLensingGeo = new THREE.RingGeometry(2.0, 5.5, 128);
    const bhLensingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const bhLensingDisk = new THREE.Mesh(bhLensingGeo, bhLensingMat);
    bhLensingDisk.rotation.y = Math.PI / 2;
    bhLensingDisk.rotation.x = Math.PI / 3;
    act1Group.add(bhLensingDisk);

    // Volumetric Gravitational Distortion Shell
    const bhHaloGeo = new THREE.SphereGeometry(2.4, 64, 64);
    const bhHaloMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    act1Group.add(new THREE.Mesh(bhHaloGeo, bhHaloMat));

    // ════════════════════════════════════════════════════════════════
    // ACT II: GATHERING IN THE DARK — MILKY WAY SPIRAL GALAXY
    // ════════════════════════════════════════════════════════════════
    const act2Group = new THREE.Group();
    act2Group.position.set(0, 0, -50);
    scene.add(act2Group);

    const galaxyCount = 8000;
    const gPos = new Float32Array(galaxyCount * 3);
    const gColors = new Float32Array(galaxyCount * 3);
    const arms = 4;
    for (let i = 0; i < galaxyCount; i++) {
      const r = Math.pow(Math.random(), 2) * 12;
      const armIndex = i % arms;
      const theta = (armIndex * Math.PI * 2) / arms + r * 0.45 + (Math.random() - 0.5) * 0.4;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const y = (Math.random() - 0.5) * (1.5 / (r + 1));

      gPos[i * 3] = x;
      gPos[i * 3 + 1] = y;
      gPos[i * 3 + 2] = z;

      // Color gradient from golden core to cyan spiral arms
      if (r < 2.5) { gColors[i*3] = 1.0; gColors[i*3+1] = 0.85; gColors[i*3+2] = 0.4; }
      else if (r < 6.0) { gColors[i*3] = 0.7; gColors[i*3+1] = 0.5; gColors[i*3+2] = 1.0; }
      else { gColors[i*3] = 0.3; gColors[i*3+1] = 0.7; gColors[i*3+2] = 1.0; }
    }
    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute("position", new THREE.BufferAttribute(gPos, 3));
    galaxyGeo.setAttribute("color", new THREE.BufferAttribute(gColors, 3));
    const galaxyMat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const galaxyMesh = new THREE.Points(galaxyGeo, galaxyMat);
    act2Group.add(galaxyMesh);

    // Sagittarius A* Core Glow
    const sagAGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const sagAMat = new THREE.MeshBasicMaterial({ color: 0xffdd88, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    act2Group.add(new THREE.Mesh(sagAGeo, sagAMat));

    // ════════════════════════════════════════════════════════════════
    // ACT III: STARDUST AND FIRE — SOLAR SYSTEM CREATION
    // ════════════════════════════════════════════════════════════════
    const act3Group = new THREE.Group();
    act3Group.position.set(0, 0, -100);
    scene.add(act3Group);

    // Glowing Central Sun
    const sunGeo = new THREE.SphereGeometry(2.0, 64, 64);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    act3Group.add(sunMesh);

    // Solar Corona Atmosphere
    const sunCoronaGeo = new THREE.SphereGeometry(2.3, 32, 32);
    const sunCoronaMat = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.4, side: THREE.BackSide, blending: THREE.AdditiveBlending });
    const sunCorona = new THREE.Mesh(sunCoronaGeo, sunCoronaMat);
    act3Group.add(sunCorona);

    // Protoplanetary Accretion Disk Particles
    const accCount = 3000;
    const accPos = new Float32Array(accCount * 3);
    for (let i = 0; i < accCount; i++) {
      const r = 2.6 + Math.random() * 8.5;
      const th = Math.random() * Math.PI * 2;
      accPos[i * 3] = Math.cos(th) * r;
      accPos[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      accPos[i * 3 + 2] = Math.sin(th) * r;
    }
    const accGeo = new THREE.BufferGeometry();
    accGeo.setAttribute("position", new THREE.BufferAttribute(accPos, 3));
    const accMat = new THREE.PointsMaterial({ size: 0.08, color: 0xff7722, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending });
    const accPoints = new THREE.Points(accGeo, accMat);
    act3Group.add(accPoints);

    // Orbiting Protoplanets
    const planetData = [
      { name: "Mercury", r: 3.2, size: 0.18, color: 0xa1a1aa },
      { name: "Venus", r: 4.2, size: 0.32, color: 0xeab308 },
      { name: "Earth", r: 5.4, size: 0.36, color: 0x38bdf8 },
      { name: "Mars", r: 6.6, size: 0.24, color: 0xef4444 },
      { name: "Jupiter", r: 8.2, size: 0.7, color: 0xf97316 },
      { name: "Saturn", r: 9.8, size: 0.58, color: 0xfde047 },
    ];
    const planetMeshes: THREE.Mesh[] = [];
    planetData.forEach((pd, idx) => {
      const pMesh = new THREE.Mesh(
        new THREE.SphereGeometry(pd.size, 32, 32),
        new THREE.MeshStandardMaterial({ color: pd.color, roughness: 0.5 })
      );
      const angle = (idx * Math.PI * 2) / planetData.length;
      pMesh.position.set(Math.cos(angle) * pd.r, 0, Math.sin(angle) * pd.r);
      act3Group.add(pMesh);
      planetMeshes.push(pMesh);
    });

    // ════════════════════════════════════════════════════════════════
    // ACT IV: THE LEGACY — PHOTOREALISTIC EARTH & ISS
    // ════════════════════════════════════════════════════════════════
    const act4Group = new THREE.Group();
    act4Group.position.set(0, 0, -150);
    scene.add(act4Group);

    // NASA Blue Marble Earth
    const earthMap = textureLoader.load("/textures/planets/earth_blue_marble.jpg");
    earthMap.colorSpace = THREE.SRGBColorSpace;
    const earthNorm = textureLoader.load("/textures/planets/earth_normal_2048.jpg");
    const earthSpec = textureLoader.load("/textures/planets/earth_specular_2048.jpg");

    const earthMat = new THREE.MeshStandardMaterial({
      map: earthMap,
      normalMap: earthNorm,
      normalScale: new THREE.Vector2(0.65, 0.65),
      roughnessMap: earthSpec,
      roughness: 0.35,
      metalness: 0.05,
    });
    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(2.0, 128, 128), earthMat);
    earthMesh.rotation.z = 0.35;
    act4Group.add(earthMesh);

    // Cloud Layer
    const cloudMap = textureLoader.load("/textures/planets/earth_clouds_2048.jpg");
    cloudMap.colorSpace = THREE.SRGBColorSpace;
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudMap,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(2.025, 96, 96), cloudMat);
    act4Group.add(cloudMesh);

    // Rayleigh Atmosphere Glow
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x00d5ff,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    act4Group.add(new THREE.Mesh(new THREE.SphereGeometry(2.06, 64, 64), atmoMat));

    // Orbiting Moon
    const moonTexture = textureLoader.load("/textures/planets/moon_1024.jpg");
    moonTexture.colorSpace = THREE.SRGBColorSpace;
    const moonMat = new THREE.MeshStandardMaterial({ map: moonTexture, roughness: 0.85 });
    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), moonMat);
    const moonPivot = new THREE.Group();
    moonPivot.add(moonMesh);
    moonMesh.position.set(4.8, 0.4, 0);
    act4Group.add(moonPivot);

    // ─── Scene Lighting ───
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const mainLight = new THREE.DirectionalLight(0xfff5e6, 3.0);
    mainLight.position.set(10, 8, 12);
    scene.add(mainLight);
    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 0.8);
    rimLight.position.set(-10, -5, -8);
    scene.add(rimLight);

    // ─── Resize Handler ───
    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // ─── Pointer Drag Orbit Rotation ───
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let dragRotX = 0;
    let dragRotY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      dragRotY += dx * 0.004;
      dragRotX += dy * 0.004;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Relativistic Jet Beams (Black Hole Top & Bottom)
    const jetGeo = new THREE.CylinderGeometry(0.08, 1.2, 16, 32, 1, true);
    const jetMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const jetTop = new THREE.Mesh(jetGeo, jetMat);
    jetTop.position.set(0, 8, 0);
    act1Group.add(jetTop);

    const jetBottom = new THREE.Mesh(jetGeo, jetMat);
    jetBottom.position.set(0, -8, 0);
    jetBottom.rotation.z = Math.PI;
    act1Group.add(jetBottom);

    // ─── Target Camera Trajectories for Acts ───
    const targetCameraPos = [
      new THREE.Vector3(0, 1.5, 12),    // Act I: Black Hole
      new THREE.Vector3(0, 6.0, -36),   // Act II: Milky Way Galaxy
      new THREE.Vector3(0, 5.0, -84),   // Act III: Solar System Creation
      new THREE.Vector3(0, 0.4, -143),  // Act IV: Earth Legacy
    ];

    const targetLookAtPos = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -50),
      new THREE.Vector3(0, 0, -100),
      new THREE.Vector3(0, 0, -150),
    ];

    const currentLookAt = new THREE.Vector3(0, 0, 0);

    // ─── Animation Loop ───
    let rafId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Automatic Cinematic Camera Drift (Drifting smoothly around active world)
      const basePos = targetCameraPos[activeAct] || targetCameraPos[0];
      const targetLook = targetLookAtPos[activeAct] || targetLookAtPos[0];

      const autoDriftX = Math.sin(time * 0.2) * 1.2;
      const autoDriftY = Math.cos(time * 0.15) * 0.6;
      const autoCamPos = new THREE.Vector3(basePos.x + autoDriftX, basePos.y + autoDriftY, basePos.z);

      camera.position.lerp(autoCamPos, 0.04);
      currentLookAt.lerp(targetLook, 0.04);
      camera.lookAt(currentLookAt);

      // Interactive rotation + Auto rotation
      act1Group.rotation.x = dragRotX;
      act1Group.rotation.y = dragRotY + time * 0.08;
      bhDisk.rotation.z += delta * 0.4;
      jetTop.scale.set(1 + Math.sin(time * 4) * 0.1, 1, 1 + Math.sin(time * 4) * 0.1);

      act2Group.rotation.x = dragRotX;
      act2Group.rotation.y = dragRotY + time * 0.05;
      galaxyMesh.rotation.y += delta * 0.15;

      act3Group.rotation.x = dragRotX;
      act3Group.rotation.y = dragRotY;
      sunCorona.scale.setScalar(1 + Math.sin(time * 3) * 0.04);
      accPoints.rotation.y += delta * 0.2;
      planetMeshes.forEach((pm, idx) => {
        const pd = planetData[idx];
        const angle = (idx * Math.PI * 2) / planetData.length + time * (0.3 / (idx + 1));
        pm.position.set(Math.cos(angle) * pd.r, 0, Math.sin(angle) * pd.r);
        pm.rotation.y += delta * 0.8;
      });

      act4Group.rotation.x = dragRotX;
      act4Group.rotation.y = dragRotY;
      earthMesh.rotation.y += delta * 0.12;
      cloudMesh.rotation.y += delta * 0.15;
      moonPivot.rotation.y += delta * 0.25;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [activeAct]);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
}
