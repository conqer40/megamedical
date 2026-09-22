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

/* ==========================================================================
   MegaMedical — Holographic Cleanroom Pod (Option C)
   Interactive 3D WebGL Inspection Chamber, Floating Crystal Syringe & Laser Scan
   ========================================================================== */

function initCleanroomPod3D() {
  const stage = document.getElementById('cleanroom-pod-stage');
  const canvas = document.getElementById('cleanroom-pod-canvas');
  if (!stage || !canvas || typeof THREE === 'undefined') return;

  const getWidth = () => stage.clientWidth || 450;
  const getHeight = () => stage.clientHeight || 330;

  let width = getWidth();
  let height = getHeight();

  // Scene, Camera & Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 1.2, 11.8);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x0a223e, 1.8);
  scene.add(ambientLight);

  const dirLightCyan = new THREE.DirectionalLight(0x00f2fe, 2.5);
  dirLightCyan.position.set(5, 7, 6);
  scene.add(dirLightCyan);

  const dirLightOrange = new THREE.DirectionalLight(0xff7700, 1.2);
  dirLightOrange.position.set(-6, -4, 4);
  scene.add(dirLightOrange);

  const pointLightCore = new THREE.PointLight(0x38bdf8, 2.0, 15);
  pointLightCore.position.set(0, 0, 3);
  scene.add(pointLightCore);

  // Master Pod Group (Tilts & Rotates)
  const masterPodGroup = new THREE.Group();
  scene.add(masterPodGroup);
  masterPodGroup.rotation.x = 0.22;

  // 1. BASE PEDESTAL PLATFORM
  const pedestalGroup = new THREE.Group();
  pedestalGroup.position.y = -3.2;
  masterPodGroup.add(pedestalGroup);

  // Dark metallic base
  const baseGeo = new THREE.CylinderGeometry(3.3, 3.5, 0.35, 48);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x07152b,
    roughness: 0.25,
    metalness: 0.85
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  pedestalGroup.add(baseMesh);

  // Base glowing neon rim
  const baseRimGeo = new THREE.TorusGeometry(3.32, 0.05, 16, 64);
  const neonCyanMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.85
  });
  const baseRimMesh = new THREE.Mesh(baseRimGeo, neonCyanMat);
  baseRimMesh.rotation.x = Math.PI / 2;
  baseRimMesh.position.y = 0.18;
  pedestalGroup.add(baseRimMesh);

  // Inner circular grid disk on platform
  const gridDiskGeo = new THREE.RingGeometry(0.1, 3.1, 32);
  const gridDiskMat = new THREE.MeshBasicMaterial({
    color: 0x0284c7,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide
  });
  const gridDiskMesh = new THREE.Mesh(gridDiskGeo, gridDiskMat);
  gridDiskMesh.rotation.x = Math.PI / 2;
  gridDiskMesh.position.y = 0.19;
  pedestalGroup.add(gridDiskMesh);

  // 2. CONCENTRIC HOLOGRAPHIC ENERGY RINGS
  // Outer Calibration Ring
  const outerRingGroup = new THREE.Group();
  masterPodGroup.add(outerRingGroup);

  const outerRingGeo = new THREE.RingGeometry(3.6, 3.75, 64);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0x0284c7,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
  });
  const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRingMesh.rotation.x = Math.PI / 2;
  outerRingMesh.position.y = -2.2;
  outerRingGroup.add(outerRingMesh);

  // Calibration tick lines on outer ring
  const tickCount = 36;
  const tickMat = new THREE.LineBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  const tickGeo = new THREE.BufferGeometry();
  const tickPositions = [];
  for (let i = 0; i < tickCount; i++) {
    const angle = (i / tickCount) * Math.PI * 2;
    const r1 = 3.55;
    const r2 = i % 4 === 0 ? 3.82 : 3.72;
    tickPositions.push(Math.cos(angle) * r1, -2.2, Math.sin(angle) * r1);
    tickPositions.push(Math.cos(angle) * r2, -2.2, Math.sin(angle) * r2);
  }
  tickGeo.setAttribute('position', new THREE.Float32BufferAttribute(tickPositions, 3));
  const tickLines = new THREE.LineSegments(tickGeo, tickMat);
  outerRingGroup.add(tickLines);

  // Middle Oblique Scanner Ring
  const middleRingGroup = new THREE.Group();
  masterPodGroup.add(middleRingGroup);
  middleRingGroup.rotation.z = 0.35;
  middleRingGroup.rotation.x = 0.45;

  const middleRingGeo = new THREE.TorusGeometry(3.1, 0.04, 16, 64);
  const middleRingMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });
  const middleRingMesh = new THREE.Mesh(middleRingGeo, middleRingMat);
  middleRingGroup.add(middleRingMesh);

  // Inner Rotating Equator Ring
  const innerRingGeo = new THREE.TorusGeometry(2.4, 0.025, 16, 48);
  const innerRingMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });
  const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRingMesh.rotation.x = Math.PI / 2.3;
  masterPodGroup.add(innerRingMesh);

  // 3. CENTRAL FLOATING 3D MEDICAL DEVICE (Crystal Medical Syringe & Cannula)
  const syringeGroup = new THREE.Group();
  masterPodGroup.add(syringeGroup);

  // Glass Barrel
  const barrelGeo = new THREE.CylinderGeometry(0.72, 0.72, 4.0, 32, 1, true);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xcffafe,
    roughness: 0.1,
    metalness: 0.15,
    transparent: true,
    opacity: 0.38,
    side: THREE.DoubleSide
  });
  const barrelMesh = new THREE.Mesh(barrelGeo, glassMat);
  barrelMesh.position.y = 0.2;
  syringeGroup.add(barrelMesh);

  // Finger Flange (Wings at top of barrel)
  const flangeGeo = new THREE.BoxGeometry(2.4, 0.14, 1.1);
  const flangeMat = new THREE.MeshStandardMaterial({
    color: 0x7dd3fc,
    roughness: 0.2,
    transparent: true,
    opacity: 0.65
  });
  const flangeMesh = new THREE.Mesh(flangeGeo, flangeMat);
  flangeMesh.position.y = 2.2;
  syringeGroup.add(flangeMesh);

  // Luer Lock Hub (Bottom connector)
  const luerGeo = new THREE.CylinderGeometry(0.18, 0.34, 0.55, 24);
  const luerMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.3,
    metalness: 0.3
  });
  const luerMesh = new THREE.Mesh(luerGeo, luerMat);
  luerMesh.position.y = -2.05;
  syringeGroup.add(luerMesh);

  // Stainless Steel Cannula / Needle
  const needleGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.0, 16);
  const needleMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.95,
    roughness: 0.1
  });
  const needleMesh = new THREE.Mesh(needleGeo, needleMat);
  needleMesh.position.y = -3.25;
  syringeGroup.add(needleMesh);

  // Needle Beveled Tip Glint Point
  const tipGlowGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const tipGlowMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const tipGlow = new THREE.Mesh(tipGlowGeo, tipGlowMat);
  tipGlow.position.y = -4.25;
  syringeGroup.add(tipGlow);

  // Plunger Rod inside barrel
  const plungerRodGeo = new THREE.CylinderGeometry(0.22, 0.22, 3.8, 16);
  const plungerMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.3,
    metalness: 0.4
  });
  const plungerRod = new THREE.Mesh(plungerRodGeo, plungerMat);
  plungerRod.position.y = 1.9;
  syringeGroup.add(plungerRod);

  // Plunger Rubber Stopper (Piston)
  const stopperGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.48, 32);
  const stopperMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.8
  });
  const stopper = new THREE.Mesh(stopperGeo, stopperMat);
  stopper.position.y = 0.3;
  syringeGroup.add(stopper);

  // Plunger Top Thumb Rest (Push Disc)
  const thumbGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.12, 32);
  const thumbMesh = new THREE.Mesh(thumbGeo, flangeMat);
  thumbMesh.position.y = 3.8;
  syringeGroup.add(thumbMesh);

  // Graduation Tick Mark Lines along Barrel
  const gradLinesGroup = new THREE.Group();
  syringeGroup.add(gradLinesGroup);
  for (let g = 0; g < 14; g++) {
    const gy = -1.5 + g * 0.26;
    const isMajor = g % 3 === 0;
    const gGeo = new THREE.RingGeometry(0.725, 0.74, 32);
    const gMat = new THREE.MeshBasicMaterial({
      color: isMajor ? 0xffffff : 0x38bdf8,
      transparent: true,
      opacity: isMajor ? 0.85 : 0.45,
      side: THREE.DoubleSide
    });
    const gMesh = new THREE.Mesh(gGeo, gMat);
    gMesh.rotation.x = Math.PI / 2;
    gMesh.position.y = gy;
    gradLinesGroup.add(gMesh);
  }

  // 4. ACTIVE VERTICAL LASER SCANNING BEAM
  const laserScanGroup = new THREE.Group();
  masterPodGroup.add(laserScanGroup);

  // Glowing planar sweep disk
  const laserPlaneGeo = new THREE.RingGeometry(0.08, 2.7, 48);
  const laserPlaneMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
  });
  const laserPlaneMesh = new THREE.Mesh(laserPlaneGeo, laserPlaneMat);
  laserPlaneMesh.rotation.x = Math.PI / 2;
  laserScanGroup.add(laserPlaneMesh);

  // Perimeter laser ring
  const laserRingGeo = new THREE.TorusGeometry(2.7, 0.035, 16, 48);
  const laserRingMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const laserRingMesh = new THREE.Mesh(laserRingGeo, laserRingMat);
  laserRingMesh.rotation.x = Math.PI / 2;
  laserScanGroup.add(laserRingMesh);

  // 5. CLEANROOM IONIZED STERILE PARTICLES
  const particleCount = 130;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSpeeds = [];

  for (let p = 0; p < particleCount; p++) {
    const angle = Math.random() * Math.PI * 2;
    const rad = 0.5 + Math.random() * 2.8;
    particlePositions[p * 3] = Math.cos(angle) * rad;
    particlePositions[p * 3 + 1] = (Math.random() - 0.5) * 6.5;
    particlePositions[p * 3 + 2] = Math.sin(angle) * rad;

    particleSpeeds.push({
      y: 0.006 + Math.random() * 0.012,
      rot: (Math.random() - 0.5) * 0.015
    });
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 0.08,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const particlePoints = new THREE.Points(particleGeo, particleMat);
  masterPodGroup.add(particlePoints);

  // 6. SHOCKWAVE STERILIZATION PULSE RING
  const shockwaveGeo = new THREE.TorusGeometry(0.3, 0.06, 16, 64);
  const shockwaveMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending
  });
  const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
  shockwaveMesh.rotation.x = Math.PI / 2;
  masterPodGroup.add(shockwaveMesh);

  let isPulseActive = false;
  let pulseProgress = 0;

  function triggerPulse() {
    isPulseActive = true;
    pulseProgress = 0;
    shockwaveMesh.scale.set(0.2, 0.2, 0.2);
    shockwaveMat.opacity = 1.0;

    const readout = document.getElementById('pod-sensor-readout');
    const status = document.getElementById('pod-cycle-status');
    if (readout) {
      readout.textContent = '0.00 PPM · 100% STERILE';
      readout.style.color = '#10b981';
    }
    if (status) {
      status.textContent = '⚡ PULSE DISCHARGED: 100%';
    }

    // Audio feedback if enabled
    if (window.soundFXEnabled && typeof window.playAudioBeep === 'function') {
      window.playAudioBeep(880, 0.15);
    }

    setTimeout(() => {
      if (readout) {
        readout.textContent = '0.00 PPM / Sterile';
        readout.style.color = '#ffffff';
      }
      if (status) {
        status.textContent = 'Laser Sweep: 99.8%';
      }
    }, 2400);
  }

  const pulseBtn = document.getElementById('btn-trigger-pulse');
  if (pulseBtn) {
    pulseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerPulse();
    });
  }

  stage.addEventListener('click', () => {
    triggerPulse();
  });

  // 7. MOUSE DRAG ORBIT & HOVER TILT
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let rotVelocityX = 0;
  let rotVelocityY = 0;
  let targetTiltX = 0.22;
  let targetTiltY = 0;

  stage.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      rotVelocityY = deltaX * 0.006;
      rotVelocityX = deltaY * 0.006;
      masterPodGroup.rotation.y += rotVelocityY;
      masterPodGroup.rotation.x += rotVelocityX;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    } else {
      const rect = stage.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetTiltY = nx * 0.35;
        targetTiltX = 0.22 - ny * 0.25;
      }
    }
  });

  // Touch handling
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      masterPodGroup.rotation.y += deltaX * 0.008;
      masterPodGroup.rotation.x += deltaY * 0.008;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  // Handle Window Resize
  function handleResize() {
    const w = getWidth();
    const h = getHeight();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', handleResize);

  // 8. ANIMATION LOOP
  let clock = new THREE.Clock();

  function animatePod() {
    requestAnimationFrame(animatePod);
    const elapsedTime = clock.getElapsedTime();

    // Subtle drift / damping
    if (!isDragging) {
      masterPodGroup.rotation.y += 0.004;
      masterPodGroup.rotation.x += (targetTiltX - masterPodGroup.rotation.x) * 0.05;
    }

    // Rings rotation
    outerRingGroup.rotation.y += 0.005;
    middleRingGroup.rotation.y -= 0.008;
    middleRingGroup.rotation.x += 0.003;
    innerRingMesh.rotation.z += 0.01;

    // Central Syringe Floating Bob & Axial Spin
    syringeGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.18;
    syringeGroup.rotation.y += 0.01;

    // Needle glint pulse
    tipGlow.scale.setScalar(1.0 + Math.sin(elapsedTime * 6.0) * 0.35);

    // Active Vertical Laser Scan Sweep (oscillates -2.4 to +2.4)
    const laserY = Math.sin(elapsedTime * 2.4) * 2.3;
    laserScanGroup.position.y = laserY;
    laserPlaneMat.opacity = 0.28 + Math.sin(elapsedTime * 8.0) * 0.12;

    // Particle Mist Drift
    const pPos = particleGeo.attributes.position;
    for (let p = 0; p < particleCount; p++) {
      let py = pPos.getY(p);
      py += particleSpeeds[p].y;
      if (py > 3.2) py = -3.2;
      pPos.setY(p, py);

      // Orbital drift
      let px = pPos.getX(p);
      let pz = pPos.getZ(p);
      const angle = particleSpeeds[p].rot;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      pPos.setX(p, px * cosA - pz * sinA);
      pPos.setZ(p, px * sinA + pz * cosA);
    }
    pPos.needsUpdate = true;

    // Shockwave pulse expansion
    if (isPulseActive) {
      pulseProgress += 0.035;
      const currentScale = 0.2 + pulseProgress * 14.0;
      shockwaveMesh.scale.set(currentScale, currentScale, currentScale);
      shockwaveMat.opacity = Math.max(0, 1.0 - pulseProgress);
      if (pulseProgress >= 1.0) {
        isPulseActive = false;
        shockwaveMat.opacity = 0;
      }
    }

    renderer.render(scene, camera);
  }

  animatePod();
}

// Master Initialization
function initAllHeroScenes() {
  initHero3DScene();
  initCleanroomPod3D();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllHeroScenes);
} else {
  initAllHeroScenes();
}
