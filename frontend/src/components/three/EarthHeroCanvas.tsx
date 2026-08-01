"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function EarthHeroCanvas({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.4, 6.2);

    // ─── Texture Loader for NASA Satellite Maps ───
    const textureLoader = new THREE.TextureLoader();

    // 1. Earth Base Mesh
    const earthMap = textureLoader.load("/textures/planets/earth_blue_marble.jpg");
    earthMap.colorSpace = THREE.SRGBColorSpace;
    const normalMap = textureLoader.load("/textures/planets/earth_normal_2048.jpg");
    const specMap = textureLoader.load("/textures/planets/earth_specular_2048.jpg");

    const earthMat = new THREE.MeshStandardMaterial({
      map: earthMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.65, 0.65),
      roughnessMap: specMap,
      roughness: 0.35,
      metalness: 0.05,
    });

    const earth = new THREE.Mesh(new THREE.SphereGeometry(1.6, 128, 128), earthMat);
    earth.rotation.z = 0.35;
    scene.add(earth);

    // 2. Realistic Rayleigh Atmosphere Limb Glow
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x00d5ff,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.64, 64, 64), atmoMat);
    scene.add(atmo);

    // 3. Real 2K NASA Cloud Layer
    const cloudMap = textureLoader.load("/textures/planets/earth_clouds_2048.jpg");
    cloudMap.colorSpace = THREE.SRGBColorSpace;
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudMap,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.62, 96, 96), cloudMat);
    scene.add(clouds);

    // 4. Photorealistic Orbiting Moon
    const moonTexture = textureLoader.load("/textures/planets/moon_1024.jpg");
    moonTexture.colorSpace = THREE.SRGBColorSpace;
    const moonMat = new THREE.MeshStandardMaterial({ map: moonTexture, roughness: 0.85 });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(0.34, 48, 48), moonMat);
    const moonPivot = new THREE.Group();
    moonPivot.add(moon);
    moon.position.set(3.4, 0.3, -1.0);
    scene.add(moonPivot);

    // Orbit ring
    const ringGeo = new THREE.RingGeometry(3.35, 3.37, 128);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4da8ff, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.1;
    scene.add(ring);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xfff8f0, 3.0);
    key.position.set(5, 3, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8b5cf6, 0.6);
    rim.position.set(-4, -1, -2);
    scene.add(rim);

    // Starfield Points
    const starGeo = new THREE.BufferGeometry();
    const N = 1400;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 20 + Math.random() * 18;
      const th = Math.random() * 6.28;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.09, transparent: true, opacity: 0.8 })
    );
    scene.add(stars);

    let px = 0;
    let py = 0;
    let tpx = 0;
    let tpy = 0;

    const onMove = (e: PointerEvent) => {
      tpx = e.clientX / window.innerWidth - 0.5;
      tpy = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);

    const resize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf: number;
    let t = 0;
    const loop = () => {
      t += 0.016;
      earth.rotation.y += 0.0016;
      clouds.rotation.y += 0.0022;
      moonPivot.rotation.y += 0.004;
      moon.rotation.y += 0.01;
      ring.rotation.z += 0.0006;
      stars.rotation.y += 0.0002;
      px += (tpx - px) * 0.04;
      py += (tpy - py) * 0.04;
      camera.position.x = px * 0.9;
      camera.position.y = 0.4 - py * 0.6;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={style} />;
}
