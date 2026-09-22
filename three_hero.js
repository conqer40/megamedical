/* ==========================================================================
   MegaMedical — Bio-Pulse Sterile Wave Lattice & ECG Heartbeat (Three.js WebGL)
   High-Fidelity Luminous Silk Ribbons, Organic Medical Mesh & Real-Time ECG Pulse
   ========================================================================== */

function initHero3DScene() {
  const container = document.getElementById('hero-3d-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Clear any existing canvas
  container.innerHTML = '';

  const getWidth = () => container.clientWidth || window.innerWidth;
  const getHeight = () => container.clientHeight || 700;

  let width = getWidth();
  let height = getHeight();

  // Scene, Camera & Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
  camera.position.set(0, 2, 36);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const masterSceneGroup = new THREE.Group();
  scene.add(masterSceneGroup);

  // Position the 3D group slightly to the right to frame the hero content
  masterSceneGroup.position.set(6, -1, 0);

  // Colors
  const COLOR_CYAN = new THREE.Color(0x00f2fe);
  const COLOR_AZURE = new THREE.Color(0x0284c7);
  const COLOR_ELECTRIC = new THREE.Color(0x38bdf8);
  const COLOR_DEEP = new THREE.Color(0x0c4a6e);

  // --------------------------------------------------------------------------
  // 1. LUMINOUS SILK WAVE RIBBONS (Dense Multi-Layered Flowing Curves)
  // --------------------------------------------------------------------------
  const ribbonCount = 28;
  const pointsPerRibbon = 160;
  const ribbonSpanX = 52;
  const ribbons = [];

  const ribbonGroup = new THREE.Group();
  masterSceneGroup.add(ribbonGroup);

  for (let r = 0; r < ribbonCount; r++) {
    const points = [];
    const normR = r / ribbonCount;

    for (let p = 0; p < pointsPerRibbon; p++) {
      const x = (p / (pointsPerRibbon - 1)) * ribbonSpanX - ribbonSpanX / 2;
      points.push(new THREE.Vector3(x, 0, 0));
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);

    // Color gradient from center to edges
    const colorMix = COLOR_CYAN.clone().lerp(COLOR_AZURE, normR * 0.7);
    if (r % 3 === 0) colorMix.lerp(COLOR_ELECTRIC, 0.4);

    const mat = new THREE.LineBasicMaterial({
      color: colorMix,
      transparent: true,
      opacity: 0.35 + Math.sin(normR * Math.PI) * 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const line = new THREE.Line(geo, mat);
    ribbonGroup.add(line);

    ribbons.push({
      mesh: line,
      geo: geo,
      offsetZ: (r - ribbonCount / 2) * 0.85,
      speed: 1.2 + normR * 0.4,
      phase: normR * Math.PI * 2.2,
      freqX: 0.12 + (r % 4) * 0.015,
      ampY: 3.8 + Math.sin(normR * Math.PI) * 2.2
    });
  }

  // --------------------------------------------------------------------------
  // 2. ORGANIC LATTICE CROSS-CONNECTING FIBERS (The "Lattice" Mesh)
  // --------------------------------------------------------------------------
  const latticeCrossGroup = new THREE.Group();
  masterSceneGroup.add(latticeCrossGroup);

  const crossLineCount = 36;
  const crossLines = [];

  const crossMat = new THREE.LineBasicMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  for (let c = 0; c < crossLineCount; c++) {
    const points = [];
    for (let r = 0; r < ribbonCount; r += 2) {
      points.push(new THREE.Vector3(0, 0, 0));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geo, crossMat);
    latticeCrossGroup.add(line);

    const pointIdx = Math.floor((c / crossLineCount) * pointsPerRibbon);
    crossLines.push({ geo: geo, pointIdx: pointIdx });
  }

  // --------------------------------------------------------------------------
  // 3. DENSE GLOWING BIO-PARTICLE CLOUD (Flowing Along the Wave Crests)
  // --------------------------------------------------------------------------
  const particleCount = 700;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * ribbonSpanX;
    const z = (Math.random() - 0.5) * 26;
    const y = (Math.random() - 0.5) * 8;

    particlePos[i * 3] = x;
    particlePos[i * 3 + 1] = y;
    particlePos[i * 3 + 2] = z;

    const pColor = Math.random() > 0.3 ? COLOR_CYAN : COLOR_AZURE;
    particleColors[i * 3] = pColor.r;
    particleColors[i * 3 + 1] = pColor.g;
    particleColors[i * 3 + 2] = pColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.32,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleCloud = new THREE.Points(particleGeo, particleMat);
  masterSceneGroup.add(particleCloud);

  // --------------------------------------------------------------------------
  // 4. ELECTRIC NEON ECG HEARTBEAT LINE (Clinical P-Q-R-S-T Waveform)
  // --------------------------------------------------------------------------
  const ecgGroup = new THREE.Group();
  masterSceneGroup.add(ecgGroup);

  const ecgSpanX = 46;
  const ecgResolution = 260;
  const ecgPoints = [];

  for (let i = 0; i <= ecgResolution; i++) {
    const x = (i / ecgResolution) * ecgSpanX - ecgSpanX / 2;
    ecgPoints.push(new THREE.Vector3(x, 0, 7));
  }

  const ecgGeo = new THREE.BufferGeometry().setFromPoints(ecgPoints);

  // Outer Neon Glow Layer
  const ecgGlowMat = new THREE.LineBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    linewidth: 2,
    depthWrite: false
  });
  const ecgGlowLine = new THREE.Line(ecgGeo, ecgGlowMat);
  ecgGroup.add(ecgGlowLine);

  // Inner Hot Core Layer
  const ecgCoreMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const ecgCoreLine = new THREE.Line(ecgGeo, ecgCoreMat);
  ecgGroup.add(ecgCoreLine);

  // ECG Position in scene
  ecgGroup.position.set(0, 1.8, 4);
  ecgGroup.rotation.x = 0.18;

  // Accurate Hospital ECG (P-Q-R-S-T) Mathematical Function
  function calculateECG(x, travelingOffset) {
    // Pulse wavelength repeats every 14 units
    const wavelength = 14;
    const normX = ((x - travelingOffset) % wavelength + wavelength) % wavelength;

    // Baseline resting
    if (normX < 2.0 || normX > 9.5) return 0;

    // P-Wave (Small initial atrium dome)
    if (normX >= 2.0 && normX < 3.2) {
      return Math.sin(((normX - 2.0) / 1.2) * Math.PI) * 0.85;
    }

    // PR Segment (Flat baseline)
    if (normX >= 3.2 && normX < 4.2) return 0;

    // Q-Wave (Sharp small downward dip)
    if (normX >= 4.2 && normX < 4.6) {
      return -Math.sin(((normX - 4.2) / 0.4) * Math.PI) * 0.95;
    }

    // R-Wave (MASSIVE SHARP VENTRICLE SPIKE!)
    if (normX >= 4.6 && normX < 5.4) {
      const spikeNorm = (normX - 4.6) / 0.8;
      // Ultra-sharp triangular bell curve
      return Math.sin(spikeNorm * Math.PI) * 5.8;
    }

    // S-Wave (Sharp deep downward rebound dip)
    if (normX >= 5.4 && normX < 6.0) {
      return -Math.sin(((normX - 5.4) / 0.6) * Math.PI) * 1.8;
    }

    // ST Segment (Baseline)
    if (normX >= 6.0 && normX < 7.0) return 0;

    // T-Wave (Smooth recovery dome)
    if (normX >= 7.0 && normX < 9.0) {
      return Math.sin(((normX - 7.0) / 2.0) * Math.PI) * 1.6;
    }

    return 0;
  }

  // --------------------------------------------------------------------------
  // 5. TRAVELING BEACON PHOTONS (Glowing Sparks on the ECG Peak)
  // --------------------------------------------------------------------------
  const sparkGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const sparkMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    blending: THREE.AdditiveBlending
  });
  const sparkMesh = new THREE.Mesh(sparkGeo, sparkMat);
  ecgGroup.add(sparkMesh);

  // Spark halo ring
  const haloGeo = new THREE.RingGeometry(0.6, 1.1, 24);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.rotation.x = Math.PI / 2;
  ecgGroup.add(haloMesh);

  // --------------------------------------------------------------------------
  // 6. LARGE AMBIENT BOKEH LIGHT ORBS (Deep Optical Glow)
  // --------------------------------------------------------------------------
  const bokehCount = 18;
  const bokehGroup = new THREE.Group();
  masterSceneGroup.add(bokehGroup);

  const bokehGeo = new THREE.SphereGeometry(1.2, 16, 16);
  const bokehOrbs = [];

  for (let b = 0; b < bokehCount; b++) {
    const isOrange = b % 5 === 0;
    const bColor = isOrange ? 0xff7700 : (b % 2 === 0 ? 0x00f2fe : 0x0284c7);
    const bMat = new THREE.MeshBasicMaterial({
      color: bColor,
      transparent: true,
      opacity: isOrange ? 0.25 : 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const orb = new THREE.Mesh(bokehGeo, bMat);
    const startPos = new THREE.Vector3(
      (Math.random() - 0.5) * 44,
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 18 - 4
    );
    orb.position.copy(startPos);
    const scale = 0.6 + Math.random() * 1.8;
    orb.scale.set(scale, scale, scale);

    bokehGroup.add(orb);

    bokehOrbs.push({
      mesh: orb,
      basePos: startPos.clone(),
      speed: 0.5 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2
    });
  }

  // Initial Scene Orientation
  masterSceneGroup.rotation.x = 0.22;
  masterSceneGroup.rotation.y = -0.15;

  // --------------------------------------------------------------------------
  // 7. SMOOTH MOUSE INTERACTION (Tilt & Organic Fluid Damping)
  // --------------------------------------------------------------------------
  let mouseX = 0;
  let mouseY = 0;
  let targetRotY = -0.15;
  let targetRotX = 0.22;
  let mouseVelY = 0;
  let mouseVelX = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    targetRotY = -0.15 + mouseX * 0.35;
    targetRotX = 0.22 + mouseY * 0.2;
  });

  // Resize Handler
  window.addEventListener('resize', () => {
    if (!container) return;
    width = getWidth();
    height = getHeight();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  // --------------------------------------------------------------------------
  // 8. 60 FPS ANIMATION LOOP
  // --------------------------------------------------------------------------
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Damped camera / master group rotation
    masterSceneGroup.rotation.y += (targetRotY - masterSceneGroup.rotation.y) * 0.04;
    masterSceneGroup.rotation.x += (targetRotX - masterSceneGroup.rotation.x) * 0.04;

    // 1. Animate Flowing Silk Wave Ribbons
    ribbons.forEach(rib => {
      const posAttr = rib.geo.attributes.position;
      const t = time * rib.speed;

      for (let p = 0; p < pointsPerRibbon; p++) {
        const x = (p / (pointsPerRibbon - 1)) * ribbonSpanX - ribbonSpanX / 2;

        // Smooth multi-frequency sine harmonics (Silk fabric physics)
        const y = 
          Math.sin(x * rib.freqX + t + rib.phase) * rib.ampY * 0.65 +
          Math.cos(x * 0.08 - t * 0.7 + rib.phase * 0.5) * (rib.ampY * 0.45) +
          Math.sin((x + rib.offsetZ) * 0.15 + t * 1.8) * 1.2;

        const z = rib.offsetZ + Math.sin(x * 0.1 + t * 0.5 + rib.phase) * 2.8;

        posAttr.setXYZ(p, x, y, z);
      }
      posAttr.needsUpdate = true;
    });

    // 2. Update Lattice Cross Lines
    crossLines.forEach(cl => {
      const linePosAttr = cl.geo.attributes.position;
      let nodeIdx = 0;
      for (let r = 0; r < ribbonCount; r += 2) {
        const ribbonPosAttr = ribbons[r].geo.attributes.position;
        linePosAttr.setXYZ(
          nodeIdx,
          ribbonPosAttr.getX(cl.pointIdx),
          ribbonPosAttr.getY(cl.pointIdx),
          ribbonPosAttr.getZ(cl.pointIdx)
        );
        nodeIdx++;
      }
      linePosAttr.needsUpdate = true;
    });

    // 3. Animate Bio-Particle Cloud (Organic Flow along wave)
    const pPosAttr = particleGeo.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      const px = pPosAttr.getX(i);
      const pz = pPosAttr.getZ(i);

      // Flowing drift in X
      let newX = px + 0.045;
      if (newX > ribbonSpanX / 2) newX = -ribbonSpanX / 2;

      // Ride wave height
      const newY = Math.sin(newX * 0.15 + time * 1.5) * 3.2 + Math.cos(pz * 0.2 + time) * 1.5;
      pPosAttr.setXYZ(i, newX, newY, pz);
    }
    pPosAttr.needsUpdate = true;

    // 4. Animate Real-Time ECG Heartbeat Waveform
    const ecgTravelingOffset = time * 9.5;
    const ecgPos = ecgGeo.attributes.position;

    for (let i = 0; i <= ecgResolution; i++) {
      const x = (i / ecgResolution) * ecgSpanX - ecgSpanX / 2;
      const y = calculateECG(x, ecgTravelingOffset);
      ecgPos.setY(i, y);
    }
    ecgPos.needsUpdate = true;

    // Position Spark & Pulsing Halo on Leading ECG Peak
    const sparkX = ((ecgTravelingOffset % ecgSpanX) - ecgSpanX / 2);
    const sparkY = calculateECG(sparkX, ecgTravelingOffset);
    sparkMesh.position.set(sparkX, sparkY, 7);
    haloMesh.position.set(sparkX, sparkY, 7);

    const pulseScale = 1 + Math.sin(time * 12) * 0.35;
    haloMesh.scale.set(pulseScale, pulseScale, pulseScale);

    // 5. Float Ambient Bokeh Orbs
    bokehOrbs.forEach(b => {
      b.mesh.position.y = b.basePos.y + Math.sin(time * b.speed + b.phase) * 1.8;
      b.mesh.position.x = b.basePos.x + Math.cos(time * 0.4 * b.speed + b.phase) * 1.2;
    });

    renderer.render(scene, camera);
  }

  animate();
}

// Auto-run
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero3DScene);
} else {
  initHero3DScene();
}
