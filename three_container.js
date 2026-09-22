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
    const child = boxesGroup.children[0];
    if (child.geometry) child.geometry.dispose();
    boxesGroup.remove(child);
  }

  const cart = (typeof getCart === 'function') ? getCart() : {};
  const is40 = containerCurrentType === 'fcl40';
  const maxCbm = is40 ? 65.0 : 28.0;

  let totalCartons = 0;
  let totalCbm = 0;
  Object.keys(cart).forEach(id => {
    const q = cart[id];
    totalCartons += q;
    totalCbm += q * 0.055;
  });

  if (totalCartons === 0) return;

  // Calculate true physical fill percentage
  const fillRatio = Math.min(totalCbm / maxCbm, 1.0);

  const length = is40 ? 23 : 12;
  const height = is40 ? 5.2 : 4.6;
  const width = 4.8;

  const boxSize = 0.92;
  const gap = 0.08;
  const pitch = boxSize + gap; // 1.0
  const cols = Math.floor(length / pitch);   // 12 for 20ft, 23 for 40ft
  const rows = Math.floor(height / pitch);   // 4 for 20ft, 5 for 40ft
  const layers = Math.floor(width / pitch);  // 4

  const totalSlots = cols * rows * layers; // 192 for 20ft, 460 for 40ft
  
  // Calculate exact number of boxes to render matching the container volume percentage
  // 50% volume = 50% container filled; 100% volume = 100% container completely filled!
  let boxesToRender = Math.round(fillRatio * totalSlots);
  if (totalCartons > 0 && boxesToRender === 0) boxesToRender = 1;
  boxesToRender = Math.min(boxesToRender, totalSlots);

  const cartonGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  
  // Realistic export carton materials
  const kraftCartonMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Salhy export gold-orange kraft cardboard
    roughness: 0.6,
    metalness: 0.05
  });
  const cyanCartonMat = new THREE.MeshStandardMaterial({
    color: 0x00f2fe, // MegaMedical sterile cyan packaging
    roughness: 0.35,
    metalness: 0.25
  });
  const alertOverloadMat = new THREE.MeshStandardMaterial({
    color: 0xef4444, // Red highlight if overloaded
    roughness: 0.4,
    metalness: 0.2
  });

  const isOverloaded = totalCbm > maxCbm;

  let count = 0;
  // Fill slice by slice along length (X: from front bulkhead towards cargo doors)
  // Inside each slice, stack from floor (Y) up, wall to wall (Z)
  for (let x = 0; x < cols && count < boxesToRender; x++) {
    for (let y = 0; y < rows && count < boxesToRender; y++) {
      for (let z = 0; z < layers && count < boxesToRender; z++) {
        const posX = -length / 2 + (boxSize / 2) + 0.1 + x * pitch;
        const posY = -height / 2 + (boxSize / 2) + 0.1 + y * pitch;
        const posZ = -width / 2 + (boxSize / 2) + 0.1 + z * pitch;

        let mat = kraftCartonMat;
        if (isOverloaded && y === rows - 1) {
          mat = alertOverloadMat;
        } else if ((x + y + z) % 3 === 0) {
          mat = cyanCartonMat;
        }

        const mesh = new THREE.Mesh(cartonGeo, mat);
        mesh.position.set(posX, posY, posZ);
        boxesGroup.add(mesh);
        count++;
      }
    }
  }
}
