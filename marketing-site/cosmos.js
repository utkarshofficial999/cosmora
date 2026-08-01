/* Cosmora shared cosmic visuals: 2D starfield + three.js Earth/Moon hero.
   Loaded in <helmet> after three.min.js. Exposes window.Cosmos. */
(function () {
  const PALETTE = {
    blue: '#4DA8FF', purple: '#8B5CF6', cyan: '#00E5FF',
    orange: '#FF7B54', white: '#F5F7FA'
  };

  // ---- 2D animated starfield (parallax on pointer) ----
  function starfield(canvas, opts) {
    opts = opts || {};
    const ctx = canvas.getContext('2d');
    let w, h, dpr, stars = [], shooting = [], raf, mx = 0, my = 0, tx = 0, ty = 0;
    const density = opts.density || 0.00016;
    const tints = [PALETTE.white, PALETTE.blue, PALETTE.cyan, PALETTE.purple];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor(w * h * density);
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w, y: Math.random() * h,
          z: Math.random(), r: Math.random() * 1.3 + 0.2,
          tw: Math.random() * Math.PI * 2, sp: 0.6 + Math.random() * 1.6,
          c: tints[Math.floor(Math.random() * tints.length)]
        });
      }
    }
    function spawnShoot() {
      if (Math.random() < 0.006 && shooting.length < 2) {
        shooting.push({ x: Math.random() * w, y: Math.random() * h * 0.5,
          vx: 6 + Math.random() * 6, vy: 2 + Math.random() * 3, life: 1 });
      }
    }
    let t = 0;
    function draw() {
      t += 0.016;
      tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const px = s.x + tx * (s.z * 22), py = s.y + ty * (s.z * 22);
        const a = 0.35 + Math.sin(t * s.sp + s.tw) * 0.35 + s.z * 0.3;
        ctx.globalAlpha = Math.max(0.05, Math.min(1, a));
        ctx.fillStyle = s.c;
        ctx.beginPath(); ctx.arc(px, py, s.r * (0.6 + s.z), 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      spawnShoot();
      for (let i = shooting.length - 1; i >= 0; i--) {
        const sh = shooting[i];
        sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.012;
        const g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 8, sh.y - sh.vy * 8);
        g.addColorStop(0, 'rgba(245,247,250,' + Math.max(0, sh.life) + ')');
        g.addColorStop(1, 'rgba(245,247,250,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 8, sh.y - sh.vy * 8); ctx.stroke();
        if (sh.life <= 0 || sh.x > w || sh.y > h) shooting.splice(i, 1);
      }
      raf = requestAnimationFrame(draw);
    }
    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove); };
  }

  // ---- three.js Earth + Moon + orbit hero ----
  function earthHero(canvas, opts) {
    opts = opts || {};
    if (!window.THREE) return function () {};
    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.4, 6.2);

    function toColor(hex) { return new THREE.Color(hex); }

    // Procedural Earth: gradient ocean + noise "continents" via fragment shader
    const earthUniforms = {
      uTime: { value: 0 },
      uOcean: { value: toColor('#0a2a5e') },
      uOcean2: { value: toColor('#0e5aa7') },
      uLand: { value: toColor('#1f6f4a') },
      uLand2: { value: toColor('#3a8a5e') },
      uLight: { value: new THREE.Vector3(1, 0.5, 0.8) }
    };
    const earthMat = new THREE.ShaderMaterial({
      uniforms: earthUniforms,
      vertexShader: `
        varying vec3 vN; varying vec3 vP; varying vec3 vW;
        void main(){ vN = normalize(normalMatrix * normal); vP = position; vW = normalize(mat3(modelMatrix)*normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        precision highp float;
        uniform float uTime; uniform vec3 uOcean; uniform vec3 uOcean2; uniform vec3 uLand; uniform vec3 uLand2; uniform vec3 uLight;
        varying vec3 vN; varying vec3 vP; varying vec3 vW;
        vec3 hash3(vec3 p){ p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6))); return -1.0+2.0*fract(sin(p)*43758.5453123); }
        float noise(vec3 p){ vec3 i=floor(p); vec3 f=fract(p); vec3 u=f*f*(3.0-2.0*f);
          return mix(mix(mix(dot(hash3(i+vec3(0,0,0)),f-vec3(0,0,0)),dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
            mix(dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)),dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
            mix(mix(dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)),dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
            mix(dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)),dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z); }
        float fbm(vec3 p){ float v=0.0; float a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5;} return v; }
        void main(){
          vec3 p = normalize(vP);
          float c = fbm(p*2.4);
          float land = smoothstep(0.02, 0.18, c);
          float ice = smoothstep(0.72, 0.9, abs(p.y));
          vec3 ocean = mix(uOcean, uOcean2, 0.5+0.5*fbm(p*4.0+10.0));
          vec3 landc = mix(uLand, uLand2, 0.5+0.5*fbm(p*6.0));
          vec3 col = mix(ocean, landc, land);
          col = mix(col, vec3(0.85,0.9,0.95), ice*0.8);
          float d = clamp(dot(normalize(vN), normalize(uLight)), 0.0, 1.0);
          float night = pow(1.0-d, 2.0);
          col *= 0.15 + 1.05*d;
          col += vec3(0.9,0.7,0.35)*night*land*0.12; // city glow on dark side
          gl_FragColor = vec4(col, 1.0);
        }`
    });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1.6, 96, 96), earthMat);
    earth.rotation.z = 0.35;
    scene.add(earth);

    // Atmosphere fresnel glow
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      uniforms: { uColor: { value: toColor('#4DA8FF') } },
      vertexShader: `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
      fragmentShader: `varying vec3 vN; uniform vec3 uColor; void main(){ float i=pow(0.72-dot(vN,vec3(0,0,1.0)),3.0); gl_FragColor=vec4(uColor, clamp(i,0.0,1.0)); }`
    });
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.78, 64, 64), atmoMat);
    scene.add(atmo);

    // Clouds
    const cloudMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec3 vP; varying vec3 vN; void main(){ vP=position; vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
      fragmentShader: `precision highp float; uniform float uTime; varying vec3 vP; varying vec3 vN;
        vec3 h3(vec3 p){p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));return -1.0+2.0*fract(sin(p)*43758.5453);}
        float n(vec3 p){vec3 i=floor(p);vec3 f=fract(p);vec3 u=f*f*(3.0-2.0*f);return mix(mix(mix(dot(h3(i),f),dot(h3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),mix(dot(h3(i+vec3(0,1,0)),f-vec3(0,1,0)),dot(h3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),mix(mix(dot(h3(i+vec3(0,0,1)),f-vec3(0,0,1)),dot(h3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),mix(dot(h3(i+vec3(0,1,1)),f-vec3(0,1,1)),dot(h3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);}
        float fb(vec3 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.2;a*=0.5;}return v;}
        void main(){ vec3 p=normalize(vP); float c=fb(p*3.0+vec3(uTime*0.02,0.0,0.0)); float m=smoothstep(0.05,0.35,c); float d=clamp(dot(vN,vec3(0.6,0.3,0.7)),0.0,1.0); gl_FragColor=vec4(vec3(1.0)*(0.3+0.9*d), m*0.55); }`
    });
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.64, 72, 72), cloudMat);
    scene.add(clouds);

    // Moon
    const moonMat = new THREE.MeshStandardMaterial({ color: 0x9aa0aa, roughness: 1, metalness: 0 });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(0.34, 48, 48), moonMat);
    const moonPivot = new THREE.Group(); moonPivot.add(moon); moon.position.set(3.4, 0.3, -1.0);
    scene.add(moonPivot);

    // Orbit ring
    const ringGeo = new THREE.RingGeometry(3.35, 3.37, 128);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4DA8FF, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat); ring.rotation.x = Math.PI / 2.1; scene.add(ring);

    // Lights
    scene.add(new THREE.AmbientLight(0x2b3a55, 1.2));
    const key = new THREE.DirectionalLight(0xfff2e0, 2.4); key.position.set(4, 2, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0x8B5CF6, 1.1); rim.position.set(-4, -1, -2); scene.add(rim);

    // Starfield points
    const starGeo = new THREE.BufferGeometry();
    const N = 1400, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { const r = 20 + Math.random() * 18, th = Math.random() * 6.28, ph = Math.acos(2 * Math.random() - 1);
      pos[i*3]=r*Math.sin(ph)*Math.cos(th); pos[i*3+1]=r*Math.sin(ph)*Math.sin(th); pos[i*3+2]=r*Math.cos(ph); }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.09, transparent: true, opacity: 0.8 }));
    scene.add(stars);

    let px = 0, py = 0, tpx = 0, tpy = 0;
    function onMove(e) { tpx = (e.clientX / window.innerWidth - 0.5); tpy = (e.clientY / window.innerHeight - 0.5); }
    window.addEventListener('pointermove', onMove);

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    resize(); window.addEventListener('resize', resize);

    let raf, t = 0;
    function loop() {
      t += 0.016;
      earth.rotation.y += 0.0016; clouds.rotation.y += 0.0022;
      earthUniforms.uTime.value = t; cloudMat.uniforms.uTime.value = t;
      moonPivot.rotation.y += 0.004; moon.rotation.y += 0.01;
      ring.rotation.z += 0.0006; stars.rotation.y += 0.0002;
      px += (tpx - px) * 0.04; py += (tpy - py) * 0.04;
      camera.position.x = px * 0.9; camera.position.y = 0.4 - py * 0.6;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove); renderer.dispose(); };
  }

  window.Cosmos = { starfield, earthHero, PALETTE };
})();
