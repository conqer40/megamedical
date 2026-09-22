/* ==========================================================================
   MegaMedical — Three.js 3D DNA Helix & Medical Particle Network
   ========================================================================== */

function initHero3DScene() {
  const container = document.getElementById('hero-3d-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 45;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group for the entire DNA structure
  const dnaGroup = new THREE.Group();
  scene.add(dnaGroup);

  // Create Double Helix with glowing spheres and rungs
  const strandCount = 42;
  const radius = 6.5;
  const heightStep = 1.1;
  const twist = 0.28;

  const sphereGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const cyanMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
  const blueMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
  const orangeMat = new THREE.MeshBasicMaterial({ color: 0xff7700 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.35 });

  for (let i = 0; i < strandCount; i++) {
    const y = (i - strandCount / 2) * heightStep;
    const angle = i * twist;

    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;

    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;

    // Node 1 (Cyan / Blue)
    const sphere1 = new THREE.Mesh(sphereGeo, i % 3 === 0 ? orangeMat : cyanMat);
    sphere1.position.set(x1, y, z1);
    dnaGroup.add(sphere1);

    // Node 2 (Opposite strand)
    const sphere2 = new THREE.Mesh(sphereGeo, i % 2 === 0 ? blueMat : cyanMat);
    sphere2.position.set(x2, y, z2);
    dnaGroup.add(sphere2);

    // Connecting rung
    const points = [new THREE.Vector3(x1, y, z1), new THREE.Vector3(x2, y, z2)];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const rung = new THREE.Line(lineGeo, lineMat);
    dnaGroup.add(rung);
  }

  // Floating background star particles
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 200;
  const posArray = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 60;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.35,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.7
  });
  const particleMesh = new THREE.Points(particleGeo, particleMat);
  scene.add(particleMesh);

  // Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotationY = mouseX * 0.8;
    targetRotationX = mouseY * 0.5;
  });

  // Resize handler
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Continuous smooth rotation + mouse reaction
    dnaGroup.rotation.y += 0.008;
    dnaGroup.rotation.x += (targetRotationX - dnaGroup.rotation.x) * 0.05;
    dnaGroup.rotation.z += (targetRotationY - dnaGroup.rotation.z) * 0.05;

    particleMesh.rotation.y -= 0.002;

    renderer.render(scene, camera);
  }
  animate();
}

document.addEventListener('DOMContentLoaded', initHero3DScene);
