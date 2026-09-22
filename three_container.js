/* ==========================================================================
   MegaMedical — Three.js Interactive 3D FCL Container Visualizer
   ========================================================================== */

let containerScene, containerCamera, containerRenderer;
let containerMeshGroup, boxesGroup;
let isDragging = false;
let prevMousePos = { x: 0, y: 0 };
let containerCurrentType = 'fcl20';

function init3DContainerVisualizer() {
  const canvasStage = document.getElementById('container-3d-stage');
  if (!canvasStage || typeof THREE === 'undefined') return;

  containerScene = new THREE.Scene();
  containerCamera = new THREE.PerspectiveCamera(40, canvasStage.clientWidth / canvasStage.clientHeight, 0.1, 1000);
  containerCamera.position.set(16, 12, 22);
  containerCamera.lookAt(0, 0, 0);

  containerRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  containerRenderer.setSize(canvasStage.clientWidth, canvasStage.clientHeight);
  containerRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasStage.appendChild(containerRenderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  containerScene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x00f2fe, 1.2);
  dirLight.position.set(15, 25, 20);
  containerScene.add(dirLight);

  const orangeLight = new THREE.PointLight(0xff7700, 1.5, 50);
  orangeLight.position.set(-10, 5, -10);
  containerScene.add(orangeLight);

  containerMeshGroup = new THREE.Group();
  containerScene.add(containerMeshGroup);

  boxesGroup = new THREE.Group();
  containerMeshGroup.add(boxesGroup);

  build3DContainerFrame('fcl20');

  // Mouse Orbit Drag Controls
  canvasStage.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMousePos.x;
    const deltaY = e.clientY - prevMousePos.y;

    containerMeshGroup.rotation.y += deltaX * 0.01;
    containerMeshGroup.rotation.x += deltaY * 0.01;

    prevMousePos = { x: e.clientX, y: e.clientY };
  });

  // Touch controls for mobile
  canvasStage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMousePos.x;
    const deltaY = e.touches[0].clientY - prevMousePos.y;

    containerMeshGroup.rotation.y += deltaX * 0.01;
    containerMeshGroup.rotation.x += deltaY * 0.01;

    prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });

  // Resize handler
  window.addEventListener('resize', () => {
    if (!canvasStage) return;
    containerCamera.aspect = canvasStage.clientWidth / canvasStage.clientHeight;
    containerCamera.updateProjectionMatrix();
    containerRenderer.setSize(canvasStage.clientWidth, canvasStage.clientHeight);
  });

  function renderLoop() {
    requestAnimationFrame(renderLoop);
    if (!isDragging) {
      containerMeshGroup.rotation.y += 0.003; // subtle idle rotation
    }
    containerRenderer.render(containerScene, containerCamera);
  }
  renderLoop();
}

function build3DContainerFrame(type) {
  containerCurrentType = type;
  // Remove existing container wireframe
  while (containerMeshGroup.children.length > 0) {
    containerMeshGroup.remove(containerMeshGroup.children[0]);
  }
  boxesGroup = new THREE.Group();
  containerMeshGroup.add(boxesGroup);

  // 20ft: Length 14, Height 5.5, Width 5.5
  // 40ft: Length 26, Height 6.2, Width 5.5
  const length = type === 'fcl40' ? 24 : 13;
  const height = type === 'fcl40' ? 5.8 : 5.2;
  const width = 5.2;

  // Outer semi-transparent container glass
  const boxGeo = new THREE.BoxGeometry(length, height, width);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.14,
    roughness: 0.2,
    metalness: 0.8
  });
  const containerShell = new THREE.Mesh(boxGeo, glassMat);
  containerMeshGroup.add(containerShell);

  // Wireframe edges with neon cyan lines
  const edges = new THREE.EdgesGeometry(boxGeo);
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, linewidth: 2 });
  const wireframe = new THREE.LineSegments(edges, edgeMat);
  containerMeshGroup.add(wireframe);

  // Vertical container ribbed corrugated panels effect
  const ribCount = type === 'fcl40' ? 18 : 10;
  const ribStep = length / (ribCount + 1);
  const ribMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3 });

  for (let i = 1; i <= ribCount; i++) {
    const rx = -length / 2 + i * ribStep;
    const pts = [
      new THREE.Vector3(rx, -height / 2, width / 2),
      new THREE.Vector3(rx, height / 2, width / 2),
      new THREE.Vector3(rx, height / 2, -width / 2),
      new THREE.Vector3(rx, -height / 2, -width / 2)
    ];
    const ribGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const ribLine = new THREE.Line(ribGeo, ribMat);
    containerMeshGroup.add(ribLine);
  }

  update3DContainerBoxes();
}

function update3DContainerBoxes() {
  if (!boxesGroup) return;

  // Clear previous cartons
  while (boxesGroup.children.length > 0) {
    boxesGroup.remove(boxesGroup.children[0]);
  }

  const cart = (typeof getCart === 'function') ? getCart() : {};
  const totalCartons = Object.values(cart).reduce((sum, q) => sum + q, 0);

  if (totalCartons === 0) return;

  // Maximum visual boxes to render without dropping frame rates
  const visualMax = Math.min(Math.ceil(totalCartons / 15), 180);

  const length = containerCurrentType === 'fcl40' ? 23 : 12;
  const height = containerCurrentType === 'fcl40' ? 5.2 : 4.6;
  const width = 4.8;

  const boxSize = 0.9;
  const gap = 0.15;
  const cols = Math.floor(length / (boxSize + gap));
  const rows = Math.floor(height / (boxSize + gap));
  const layers = Math.floor(width / (boxSize + gap));

  const cartonGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  const cartonMat = new THREE.MeshStandardMaterial({
    color: 0xff7700,
    roughness: 0.5,
    metalness: 0.1
  });
  const cyanCartonMat = new THREE.MeshStandardMaterial({
    color: 0x00f2fe,
    roughness: 0.3,
    metalness: 0.4
  });

  let count = 0;
  for (let x = 0; x < cols && count < visualMax; x++) {
    for (let y = 0; y < rows && count < visualMax; y++) {
      for (let z = 0; z < layers && count < visualMax; z++) {
        const posX = -length / 2 + (boxSize / 2) + x * (boxSize + gap);
        const posY = -height / 2 + (boxSize / 2) + y * (boxSize + gap);
        const posZ = -width / 2 + (boxSize / 2) + z * (boxSize + gap);

        const mesh = new THREE.Mesh(cartonGeo, (x + y + z) % 3 === 0 ? cyanCartonMat : cartonMat);
        mesh.position.set(posX, posY, posZ);
        boxesGroup.add(mesh);
        count++;
      }
    }
  }
}
