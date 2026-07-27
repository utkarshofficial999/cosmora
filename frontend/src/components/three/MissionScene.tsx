"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface MissionSceneProps {
  viewMode: "launch" | "orbit";
  targetName: string;
}

export function MissionScene({ viewMode, targetName }: MissionSceneProps) {
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

    // Initial Camera Placement
    if (viewMode === "launch") {
      camera.position.set(0, 3, 12);
    } else {
      camera.position.set(0, 4, 14);
    }

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(10, 15, 8);
    scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 1.5, 30);
    cyanPoint.position.set(-5, 5, 5);
    scene.add(cyanPoint);

    const launchSpot = new THREE.SpotLight(0xa855f7, 3.0, 40, Math.PI / 6);
    launchSpot.position.set(0, 15, 0);
    scene.add(launchSpot);

    // 4. Group Containers for Toggle Modes
    const launchGroup = new THREE.Group();
    const orbitGroup = new THREE.Group();
    scene.add(launchGroup);
    scene.add(orbitGroup);

    // ── Launch Pad & Rocket Assembly ──────────────
    // Launch Platform Pad
    const padGeo = new THREE.CylinderGeometry(4, 4.5, 0.4, 32);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.5,
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.set(0, -2, 0);
    launchGroup.add(padMesh);

    // Gantry Tower Structure
    const gantryGeo = new THREE.BoxGeometry(0.6, 8, 0.6);
    const gantryMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.3,
    });
    const gantryMesh = new THREE.Mesh(gantryGeo, gantryMat);
    gantryMesh.position.set(-2, 2, 0);
    launchGroup.add(gantryMesh);

    // Rocket Fuselage
    const rocketGeo = new THREE.CylinderGeometry(0.4, 0.5, 4.5, 32);
    const rocketMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.3,
      roughness: 0.2,
    });
    const rocketMesh = new THREE.Mesh(rocketGeo, rocketMat);
    rocketMesh.position.set(0, 0.2, 0);
    launchGroup.add(rocketMesh);

    // Rocket Nose Cone
    const noseGeo = new THREE.ConeGeometry(0.4, 1.2, 32);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4 });
    const noseMesh = new THREE.Mesh(noseGeo, noseMat);
    noseMesh.position.set(0, 3.0, 0);
    launchGroup.add(noseMesh);

    // Thruster Exhaust Flame Glow
    const flameGeo = new THREE.ConeGeometry(0.35, 1.8, 16);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.85,
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.rotation.x = Math.PI;
    flameMesh.position.set(0, -2.8, 0);
    launchGroup.add(flameMesh);

    // Thruster Smoke Particles
    const smokeCount = 150;
    const smokePos = new Float32Array(smokeCount * 3);
    for (let i = 0; i < smokeCount; i++) {
      smokePos[i * 3] = (Math.random() - 0.5) * 3;
      smokePos[i * 3 + 1] = -2 - Math.random() * 2;
      smokePos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    const smokeGeo = new THREE.BufferGeometry();
    smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePos, 3));
    const smokeMat = new THREE.PointsMaterial({
      size: 0.8,
      color: 0x64748b,
      transparent: true,
      opacity: 0.4,
    });
    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    launchGroup.add(smokeParticles);

    // ── Orbital Trajectory Assembly ──────────────
    // Earth Globe in Orbit Mode
    const earthGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.6,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.set(-5, 0, 0);
    orbitGroup.add(earthMesh);

    // Destination Body (Moon/Mars)
    const destGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const destMat = new THREE.MeshStandardMaterial({
      color: targetName.toLowerCase().includes("mars") ? 0xef4444 : 0x94a3b8,
      roughness: 0.8,
    });
    const destMesh = new THREE.Mesh(destGeo, destMat);
    destMesh.position.set(5, 1, 0);
    orbitGroup.add(destMesh);

    // Orbital Path Trajectory Curve Arc
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-5, 0, 0),
      new THREE.Vector3(0, 3.5, 2),
      new THREE.Vector3(5, 1, 0)
    );
    const points = curve.getPoints(50);
    const pathGeo = new THREE.BufferGeometry().setFromPoints(points);
    const pathMat = new THREE.LineDashedMaterial({
      color: 0x06b6d4,
      dashSize: 0.3,
      gapSize: 0.15,
    });
    const trajectoryLine = new THREE.Line(pathGeo, pathMat);
    trajectoryLine.computeLineDistances();
    orbitGroup.add(trajectoryLine);

    // Spacecraft Probe traveling along arc
    const probeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const probeMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      metalness: 0.9,
    });
    const probeMesh = new THREE.Mesh(probeGeo, probeMat);
    orbitGroup.add(probeMesh);

    // 5. Starfield Background
    const starCount = 2000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 25 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.5,
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.8,
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // Mouse Parallax & Window Resize
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

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let progress = 0;

    const animate = () => {
      const delta = clock.getDelta();

      // Launch Mode Animations
      if (viewMode === "launch") {
        launchGroup.visible = true;
        orbitGroup.visible = false;

        flameMesh.scale.set(
          1 + Math.sin(clock.getElapsedTime() * 20) * 0.15,
          1 + Math.cos(clock.getElapsedTime() * 15) * 0.2,
          1
        );
        rocketMesh.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.1;
        noseMesh.position.y = 2.8 + Math.sin(clock.getElapsedTime() * 2) * 0.1;

        // Camera positioning for Launch
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (3 - mouseY - camera.position.y) * 0.05;
        camera.lookAt(0, 1, 0);
      } else {
        // Orbit Mode Animations
        launchGroup.visible = false;
        orbitGroup.visible = true;

        earthMesh.rotation.y += delta * 0.1;
        destMesh.rotation.y += delta * 0.05;

        // Spacecraft Probe movement along arc curve
        progress = (progress + delta * 0.15) % 1;
        const pt = curve.getPoint(progress);
        probeMesh.position.copy(pt);
        probeMesh.rotation.y += delta * 2;

        // Camera positioning for Orbit
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (4 - mouseY - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
      }

      starfield.rotation.y += delta * 0.005;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [viewMode, targetName]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
}
