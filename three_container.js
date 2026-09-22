/* ==========================================================================
   MegaMedical — Three.js Interactive 3D FCL Container Visualizer
   Multi-Color Product Loading & Dynamic Cargo Stacking
   ========================================================================== */

let containerScene, containerCamera, containerRenderer;
let containerMeshGroup, boxesGroup;
let isDragging = false;
let prevMousePos = { x: 0, y: 0 };
let containerCurrentType = 'fcl20';

// Distinct, vibrant color palette for each medical product line (MM-01 to MM-20)
const PRODUCT_PALETTE = {
  1:  { hex: 0x2563eb, css: '#2563eb', label: 'Nitrile Exam Gloves' },
  2:  { hex: 0x06b6d4, css: '#06b6d4', label: 'Latex Surgical Gloves' },
  3:  { hex: 0x0284c7, css: '#0284c7', label: 'Syringes 3-Part' },
  4:  { hex: 0x3b82f6, css: '#3b82f6', label: 'Auto-Disable Syringes' },
  5:  { hex: 0x6366f1, css: '#6366f1', label: 'Insulin Syringes' },
  6:  { hex: 0x8b5cf6, css: '#8b5cf6', label: 'IV Infusion Sets' },
  7:  { hex: 0xa855f7, css: '#a855f7', label: 'IV Infusion with Burette' },
  8:  { hex: 0xd946ef, css: '#d946ef', label: 'Blood Transfusion Sets' },
  9:  { hex: 0xe11d48, css: '#e11d48', label: 'IV Cannula with Port' },
  10: { hex: 0xf97316, css: '#f97316', label: 'Scalp Vein Sets' },
  11: { hex: 0xf59e0b, css: '#f59e0b', label: '3-Way Stopcock' },
  12: { hex: 0x10b981, css: '#10b981', label: 'Foley Balloon Catheter 2-Way' },
  13: { hex: 0x059669, css: '#059669', label: 'Foley Balloon Catheter 3-Way' },
  14: { hex: 0x84cc16, css: '#84cc16', label: 'Nelaton Urinary Catheter' },
  15: { hex: 0x14b8a6, css: '#14b8a6', label: 'Sterile Suction Catheter' },
  16: { hex: 0x0ea5e9, css: '#0ea5e9', label: 'Urine Drainage Bag 2000ml' },
  17: { hex: 0x64748b, css: '#64748b', label: 'Hemodialysis Blood Tubing' },
  18: { hex: 0xd97706, css: '#d97706', label: 'AV Fistula Needles' },
  19: { hex: 0x0891b2, css: '#0891b2', label: 'Endotracheal Tube Cuffed' },
  20: { hex: 0x7c3aed, css: '#7c3aed', label: 'Surgical Face Mask 3-Ply' }
};
window.PRODUCT_PALETTE = PRODUCT_PALETTE;

// Material cache for optimal performance and smooth rendering
const cartonMaterialCache = {};

function getCartonMaterial(productId, isOverload = false) {
  if (isOverload) {
    if (!cartonMaterialCache['overload']) {
      cartonMaterialCache['overload'] = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.35,
        metalness: 0.2
      });
    }
    return cartonMaterialCache['overload'];
  }

  const pId = parseInt(productId, 10);
  const colorDef = PRODUCT_PALETTE[pId] || { hex: 0x0284c7 };
  const key = 'prod_' + pId;

  if (!cartonMaterialCache[key]) {
    cartonMaterialCache[key] = new THREE.MeshStandardMaterial({
      color: colorDef.hex,
      roughness: 0.45,
      metalness: 0.15
    });
  }
  return cartonMaterialCache[key];
}

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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  containerScene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
  dirLight.position.set(15, 25, 20);
  containerScene.add(dirLight);

  const cyanLight = new THREE.DirectionalLight(0x00f2fe, 0.6);
  cyanLight.position.set(-15, 10, -10);
  containerScene.add(cyanLight);

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

  const length = type === 'fcl40' ? 24 : 13;
  const height = type === 'fcl40' ? 5.8 : 5.2;
  const width = 5.2;

  // Outer semi-transparent container glass
  const boxGeo = new THREE.BoxGeometry(length, height, width);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.12,
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
  const ribMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });

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
  const activeProductIds = [];

  Object.keys(cart).forEach(id => {
    const q = cart[id];
    if (q > 0) {
      totalCartons += q;
      totalCbm += q * 0.055;
      activeProductIds.push(id);
    }
  });

  if (totalCartons === 0 || activeProductIds.length === 0) return;

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
  
  let boxesToRender = Math.round(fillRatio * totalSlots);
  if (totalCartons > 0 && boxesToRender === 0) boxesToRender = 1;
  boxesToRender = Math.min(boxesToRender, totalSlots);

  // Proportional multi-color allocation per product
  const boxProductMap = [];
  activeProductIds.forEach(id => {
    const q = cart[id];
    let countForThis = Math.round((q / totalCartons) * boxesToRender);
    if (countForThis === 0 && q > 0) countForThis = 1;
    for (let b = 0; b < countForThis; b++) {
      boxProductMap.push(id);
    }
  });

  // Adjust if rounding caused slight mismatch
  while (boxProductMap.length < boxesToRender && activeProductIds.length > 0) {
    boxProductMap.push(activeProductIds[activeProductIds.length - 1]);
  }
  if (boxProductMap.length > boxesToRender) {
    boxProductMap.length = boxesToRender;
  }

  const cartonGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  const isOverloaded = totalCbm > maxCbm;

  let count = 0;
  // Fill slice by slice along length (X: from front bulkhead towards cargo doors)
  // Inside each slice, stack from floor (Y) up, wall to wall (Z)
  for (let x = 0; x < cols && count < boxesToRender; x++) {
    for (let y = 0; y < rows && count < boxesToRender; y++) {
      for (let z = 0; z < layers && count < boxesToRender; z++) {
        const prodId = boxProductMap[count];
        const posX = -length / 2 + (boxSize / 2) + 0.1 + x * pitch;
        const posY = -height / 2 + (boxSize / 2) + 0.1 + y * pitch;
        const posZ = -width / 2 + (boxSize / 2) + 0.1 + z * pitch;

        const isTopOverload = isOverloaded && y === rows - 1;
        const mat = getCartonMaterial(prodId, isTopOverload);

        const mesh = new THREE.Mesh(cartonGeo, mat);
        mesh.position.set(posX, posY, posZ);
        boxesGroup.add(mesh);
        count++;
      }
    }
  }
}
