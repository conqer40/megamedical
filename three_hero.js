/* ==========================================================================
   MegaMedical — Bio-Pulse Sterile Wave Lattice & ECG Heartbeat (Three.js WebGL)
   Interactive 3D Fluid Organic Silk Mesh with Dynamic Hospital Pulse Waves
   ========================================================================== */

function initHero3DScene() {
  const container = document.getElementById('hero-3d-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Reset container
  container.innerHTML = '';

  const width = container.clientWidth || 650;
  const height = container.clientHeight || 600;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 8, 38);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Master Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // 1. Interactive 3D Fluid Wave Lattice (Point Mesh)
  const cols = 55;
  const rows = 45;
  const spacingX = 0.95;
  const spacingZ = 0.95;
  const totalCount = cols * rows;

  const waveGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(totalCount * 3);
  const colors = new Float32Array(totalCount * 3);
  const originalX = new Float32Array(totalCount);
  const originalZ = new Float32Array(totalCount);

  const cyanColor = new THREE.Color(0x00f2fe);
  const sapphireColor = new THREE.Color(0x0284c7);
  const deepColor = new THREE.Color(0x0c4a6e);

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - cols / 2) * spacingX;
      const z = (r - rows / 2) * spacingZ;

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = 0;
      positions[idx * 3 + 2] = z;

      originalX[idx] = x;
      originalZ[idx] = z;

      // Color gradient from center outward
      const distFromCenter = Math.sqrt(x * x + z * z) / 22;
      const colorMix = (c / cols) * 0.5 + (r / rows) * 0.5;
      const finalColor = cyanColor.clone().lerp(sapphireColor, colorMix).lerp(deepColor, Math.min(distFromCenter, 1) * 0.6);

      colors[idx * 3] = finalColor.r;
      colors[idx * 3 + 1] = finalColor.g;
      colors[idx * 3 + 2] = finalColor.b;

      idx++;
    }
  }

  waveGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  waveGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const waveMat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  const waveMesh = new THREE.Points(waveGeo, waveMat);
  waveMesh.rotation.x = 0.35;
  waveMesh.rotation.y = -0.25;
  masterGroup.add(waveMesh);

  // 2. Secondary Flowing Ribbon Lines connecting nodes for a silk cloth effect
  const lineGroup = new THREE.Group();
  masterGroup.add(lineGroup);

  const lineCount = 14;
  const lineSegments = [];
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.28
  });

  for (let l = 0; l < lineCount; l++) {
    const rowIdx = Math.floor((l / lineCount) * rows);
    const linePoints = [];
    for (let c = 0; c < cols; c++) {
      const i = rowIdx * cols + c;
      linePoints.push(new THREE.Vector3(originalX[i], 0, originalZ[i]));
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMesh = new THREE.Line(lineGeo, lineMat);
    lineGroup.add(lineMesh);
    lineSegments.push({ mesh: lineMesh, rowIdx: rowIdx, geo: lineGeo });
  }

  // 3. Dynamic ECG Heartbeat Neon Pulse Line
  const ecgPoints = [];
  const ecgSpan = 38;
  const ecgResolution = 140;

  for (let i = 0; i <= ecgResolution; i++) {
    const t = (i / ecgResolution) * ecgSpan - ecgSpan / 2;
    ecgPoints.push(new THREE.Vector3(t, 0, 8));
  }

  const ecgGeo = new THREE.BufferGeometry().setFromPoints(ecgPoints);
  const ecgMat = new THREE.LineBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.9,
    linewidth: 2
  });
  const ecgLine = new THREE.Line(ecgGeo, ecgMat);
  ecgLine.position.y = 4.5;
  ecgLine.rotation.x = 0.15;
  masterGroup.add(ecgLine);

  // Function to calculate ECG pulse shape (P-Q-R-S-T wave)
  function getECGValue(x, waveOffset) {
    // Normalise x with traveling pulse
    const pos = (x + waveOffset) % 18;
    const p = Math.abs(pos);

    if (p < 0.6) {
      // P wave
      return Math.sin((p / 0.6) * Math.PI) * 0.6;
    } else if (p >= 0.8 && p < 1.0) {
      // Q wave (dip)
      return -0.5 * Math.sin(((p - 0.8) / 0.2) * Math.PI);
    } else if (p >= 1.0 && p < 1.7) {
      // R wave (high spike!)
      return Math.sin(((p - 1.0) / 0.7) * Math.PI) * 4.2;
    } else if (p >= 1.7 && p < 2.1) {
      // S wave (negative dip)
      return -1.1 * Math.sin(((p - 1.7) / 0.4) * Math.PI);
    } else if (p >= 2.6 && p < 3.6) {
      // T wave (smooth dome)
      return Math.sin(((p - 2.6) / 1.0) * Math.PI) * 1.2;
    }
    return 0;
  }

  // Glowing traveling photon along ECG
  const photonGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const photonMat = new THREE.MeshBasicMaterial({ color: 0xffa500 });
  const photonMesh = new THREE.Mesh(photonGeo, photonMat);
  photonMesh.position.y = 4.5;
  masterGroup.add(photonMesh);

  // 4. Floating Sterile Bio-Spheres (Suspended Nanocells)
  const cellCount = 35;
  const cellGroup = new THREE.Group();
  masterGroup.add(cellGroup);

  const cellGeo = new THREE.SphereGeometry(0.45, 16, 16);
  const cellMat1 = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.65 });
  const cellMat2 = new THREE.MeshBasicMaterial({ color: 0xff7700, transparent: true, opacity: 0.75 });
  const cellMat3 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });

  const cells = [];
  for (let i = 0; i < cellCount; i++) {
    const mat = (i % 3 === 0) ? cellMat2 : (i % 2 === 0 ? cellMat1 : cellMat3);
    const cell = new THREE.Mesh(cellGeo, mat);
    const initialPos = new THREE.Vector3(
      (Math.random() - 0.5) * 36,
      (Math.random() - 0.5) * 16 + 2,
      (Math.random() - 0.5) * 20
    );
    cell.position.copy(initialPos);
    cellGroup.add(cell);

    cells.push({
      mesh: cell,
      basePos: initialPos.clone(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.8 + Math.random() * 0.8
    });
  }

  // Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let mouseRippleIntensity = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotationY = mouseX * 0.45;
    targetRotationX = mouseY * 0.25;
    mouseRippleIntensity = Math.min(mouseRippleIntensity + 0.05, 1.5);
  });

  // Resize Handler
  window.addEventListener('resize', () => {
    if (!container) return;
    const nw = container.clientWidth || 650;
    const nh = container.clientHeight || 600;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });

  // Animation Loop (60 FPS)
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Smooth camera / group tilt damping
    masterGroup.rotation.y += (targetRotationY - masterGroup.rotation.y) * 0.05;
    masterGroup.rotation.x += (targetRotationX - masterGroup.rotation.x) * 0.05;

    // Decay ripple
    mouseRippleIntensity *= 0.96;

    // 1. Animate Wave Lattice Vertices
    const posAttr = waveGeo.attributes.position;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const ox = originalX[i];
        const oz = originalZ[i];

        // Harmonic dual-sine wave with mouse ripple
        const d = Math.sqrt(ox * ox + oz * oz);
        const elevation = 
          Math.sin(ox * 0.25 + time * 1.6) * 1.8 +
          Math.cos(oz * 0.35 + time * 1.2) * 1.4 +
          Math.sin(d * 0.4 - time * 2.2) * (0.8 + mouseRippleIntensity * 0.6);

        posAttr.setY(i, elevation);
      }
    }
    posAttr.needsUpdate = true;

    // 2. Animate Ribbon Lines
    lineSegments.forEach(seg => {
      const linePosAttr = seg.geo.attributes.position;
      for (let c = 0; c < cols; c++) {
        const i = seg.rowIdx * cols + c;
        linePosAttr.setY(c, posAttr.getY(i));
      }
      linePosAttr.needsUpdate = true;
    });

    // 3. Animate ECG Heartbeat Line
    const ecgPosAttr = ecgGeo.attributes.position;
    const travelingWave = time * 7.5;

    for (let i = 0; i <= ecgResolution; i++) {
      const x = (i / ecgResolution) * ecgSpan - ecgSpan / 2;
      const yVal = getECGValue(x, travelingWave);
      ecgPosAttr.setY(i, yVal);
    }
    ecgPosAttr.needsUpdate = true;

    // Position photon at the current ECG peak
    const photonX = ((time * 7.5) % ecgSpan) - ecgSpan / 2;
    const photonY = getECGValue(photonX, travelingWave) + 4.5;
    photonMesh.position.set(photonX, photonY, 8);

    // 4. Animate Floating Bio-Cells
    cells.forEach(c => {
      c.mesh.position.y = c.basePos.y + Math.sin(time * c.speed + c.phase) * 1.4;
      c.mesh.position.x = c.basePos.x + Math.cos(time * 0.5 * c.speed + c.phase) * 0.8;
      c.mesh.position.z = c.basePos.z + Math.sin(time * 0.3 * c.speed + c.phase) * 0.8;
    });

    renderer.render(scene, camera);
  }

  animate();
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero3DScene);
} else {
  initHero3DScene();
}
