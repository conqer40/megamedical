/* ==========================================================================
   MegaMedical - Dedicated Products Catalogue Controller
   Parent Conglomerate: El Salhy Group (Established 1983)
   ========================================================================== */

let activeCategory = 'all';
let searchKeyword = '';
let currentViewMode = 'grid'; // 'grid' or 'table'

document.addEventListener('DOMContentLoaded', () => {
  initProductsCatalogue();
  setupProductEventListeners();
  updateCategoryBadges();
});

function initProductsCatalogue() {
  renderProducts();
}

function updateCategoryBadges() {
  const categories = ['all', 'gloves', 'syringes', 'infusion', 'urology', 'wound', 'critical', 'dialysis'];
  categories.forEach(cat => {
    const btn = document.querySelector(`.category-tab-btn[data-category="${cat}"]`);
    if (btn) {
      const count = cat === 'all' 
        ? productsData.length 
        : productsData.filter(p => p.category === cat).length;
      
      const badge = btn.querySelector('.tab-count-badge');
      if (badge) {
        badge.textContent = count;
      }
    }
  });
}

function renderProducts() {
  const gridContainer = document.getElementById('products-grid');
  if (!gridContainer) return;

  const q = searchKeyword.toLowerCase().trim();
  const filtered = productsData.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    if (!q) return matchesCat;

    const matchesSearch = 
      item.code.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q) ||
      item.hsCode.includes(q) ||
      item.specs.some(s => s.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  // Update total count indicator
  const countIndicator = document.getElementById('products-count');
  if (countIndicator) {
    countIndicator.textContent = `${filtered.length} / ${productsData.length}`;
  }

  const resultsSummary = document.getElementById('results-summary-text');
  if (resultsSummary) {
    resultsSummary.textContent = `Showing ${filtered.length} of ${productsData.length} certified medical items`;
  }

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="no-products-found">
        <div class="no-products-icon">🔍</div>
        <h3>No Medical Consumables Found</h3>
        <p>No products match your current search query "${escapeHtml(searchKeyword)}".</p>
        <button class="btn-reset-filters" onclick="resetCatalogueFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  // Get current cart from localStorage
  const savedCart = JSON.parse(localStorage.getItem('megamedical_fcl_cart') || '{}');

  gridContainer.innerHTML = filtered.map(item => {
    const cartQty = savedCart[item.id] || 0;
    const isAdded = cartQty > 0;

    return `
      <article class="product-tilt-card" data-id="${item.id}" data-tilt>
        <!-- Card Image Stage -->
        <div class="product-image-stage" onclick="openProductModal(${item.id})">
          <div class="product-badge-code">
            <span class="code-dot"></span>
            ${item.code}
          </div>
          <div class="product-badge-cert">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            ${item.certs[0] || 'CE Certified'}
          </div>
          <div class="product-img-frame">
            <img src="${item.image}" alt="${item.name}" class="product-image-tag" loading="lazy">
          </div>
          <div class="product-hover-overlay">
            <span class="btn-quick-inspect">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              Quick Specs
            </span>
          </div>
        </div>

        <!-- Card Content Area -->
        <div class="product-content-area">
          <div class="product-meta-row">
            <span class="product-tag-sub">${item.tag}</span>
            <span class="product-hs-chip">HS ${item.hsCode}</span>
          </div>

          <h3 class="product-heading" onclick="openProductModal(${item.id})" title="${item.name}">
            ${item.name}
          </h3>

          <ul class="product-specs-list">
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${item.specs[0] || 'Medical grade standard compliance'}</span>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${item.specs[1] || item.specs[2] || 'Export packaging designed for maritime FCL'}</span>
            </li>
          </ul>

          <div class="product-packing-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--salhy-orange)" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            <span>${item.packing}</span>
          </div>

          <!-- Card Footer Bar -->
          <div class="product-footer-bar">
            <button class="btn-view-specs" onclick="openProductModal(${item.id})" aria-label="View specifications for ${item.name}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span>Specs</span>
            </button>
            <button class="btn-add-container-cart ${isAdded ? 'is-added' : ''}" onclick="toggleFCLCart(${item.id})" id="fcl-btn-${item.id}">
              ${isAdded ? `✓ In FCL (${cartQty} ctns)` : '+ Add to FCL'}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Re-bind mouse tilt micro-interactions
  initTiltEffect();
}

function setupProductEventListeners() {
  // Search input
  const searchInput = document.getElementById('catalog-search-input');
  const clearBtn = document.getElementById('btn-clear-search');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchKeyword = e.target.value;
      if (clearBtn) clearBtn.style.display = searchKeyword ? 'flex' : 'none';
      renderProducts();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchKeyword = '';
      clearBtn.style.display = 'none';
      renderProducts();
      if (window.MegaAudio) window.MegaAudio.playClick();
    });
  }

  // Category filter tabs
  document.querySelectorAll('.category-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category') || 'all';
      if (window.MegaAudio) window.MegaAudio.playHover();
      renderProducts();
    });
  });

  // Modal Backdrop Click
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // ESC Key Listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function resetCatalogueFilters() {
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) searchInput.value = '';
  searchKeyword = '';
  activeCategory = 'all';

  document.querySelectorAll('.category-tab-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-category') === 'all');
  });

  const clearBtn = document.getElementById('btn-clear-search');
  if (clearBtn) clearBtn.style.display = 'none';

  if (window.MegaAudio) window.MegaAudio.playClick();
  renderProducts();
}

function toggleFCLCart(productId) {
  const item = productsData.find(p => p.id === productId);
  if (!item) return;

  const currentCart = JSON.parse(localStorage.getItem('megamedical_fcl_cart') || '{}');
  
  if (!currentCart[productId]) {
    currentCart[productId] = 50; // default initial carton allotment
    showToast(`✓ Added 50 cartons of ${item.code} to 3D Container Simulator`);
    if (window.MegaAudio) window.MegaAudio.playSuccess();
  } else {
    currentCart[productId] += 25;
    showToast(`✓ Increased ${item.code} to ${currentCart[productId]} cartons`);
    if (window.MegaAudio) window.MegaAudio.playClick();
  }

  localStorage.setItem('megamedical_fcl_cart', JSON.stringify(currentCart));

  // Update button visual
  const btn = document.getElementById(`fcl-btn-${productId}`);
  if (btn) {
    btn.classList.add('is-added');
    btn.textContent = `✓ In FCL (${currentCart[productId]} ctns)`;
  }
}

function openProductModal(productId) {
  const item = productsData.find(p => p.id === productId);
  if (!item) return;

  const modal = document.getElementById('product-modal');
  const modalBody = document.getElementById('modal-body');
  if (!modal || !modalBody) return;

  if (window.MegaAudio) window.MegaAudio.playClick();

  const savedCart = JSON.parse(localStorage.getItem('megamedical_fcl_cart') || '{}');
  const currentCartQty = savedCart[item.id] || 0;

  modalBody.innerHTML = `
    <div class="modal-product-layout">
      <!-- Left: High-Res Image & Inspection Showcase -->
      <div class="modal-gallery-col">
        <div class="modal-primary-image-frame">
          <span class="modal-code-badge">${item.code}</span>
          <img src="${item.image}" alt="${item.name}" class="modal-primary-img">
        </div>
        <div class="modal-origin-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Origin: ${item.origin}
        </div>
      </div>

      <!-- Right: Technical Specifications & Commercial Procurement Data -->
      <div class="modal-details-col">
        <div class="modal-header-meta">
          <span class="modal-tag-chip">${item.tag}</span>
          <div class="modal-certs-row">
            ${item.certs.map(c => `<span class="modal-cert-badge">${c}</span>`).join('')}
          </div>
        </div>

        <h2 class="modal-title-text">${item.name}</h2>

        <div class="modal-section-block">
          <h4 class="modal-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon-cyan)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Certified Clinical & Engineering Specifications
          </h4>
          <ul class="modal-specs-detailed">
            ${item.specs.map(spec => `
              <li>
                <span class="spec-check-icon">✓</span>
                <span>${spec}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="modal-export-matrix">
          <div class="matrix-cell">
            <span class="cell-label">Export Packaging Standard</span>
            <span class="cell-val">${item.packing}</span>
          </div>
          <div class="matrix-cell">
            <span class="cell-label">Harmonized Tariff Code</span>
            <span class="cell-val">HS ${item.hsCode}</span>
          </div>
          <div class="matrix-cell">
            <span class="cell-label">Quality & Regulatory Marks</span>
            <span class="cell-val">${item.certs.join(' · ')}</span>
          </div>
          <div class="matrix-cell">
            <span class="cell-label">Sterilization / Cleanroom</span>
            <span class="cell-val">ISO Class 7/8 · 100% EO Sterilized</span>
          </div>
        </div>

        <div class="modal-actions-toolbar">
          <button class="btn-modal-add-fcl" onclick="toggleFCLCart(${item.id}); updateModalCartButton(${item.id});">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            <span id="modal-fcl-btn-text">${currentCartQty > 0 ? `✓ In Container (${currentCartQty} Cartons)` : 'Add to 3D Container Calculator'}</span>
          </button>
          
          <a href="https://wa.me/201025930930?text=${encodeURIComponent('Hello MegaMedical Export Desk, I would like to request an official proforma quotation and technical spec sheet for ' + item.code + ' (' + item.name + ').')}" target="_blank" class="btn-modal-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <span>Direct WhatsApp Inquiry</span>
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateModalCartButton(productId) {
  const currentCart = JSON.parse(localStorage.getItem('megamedical_fcl_cart') || '{}');
  const qty = currentCart[productId] || 0;
  const label = document.getElementById('modal-fcl-btn-text');
  if (label) {
    label.textContent = `✓ In Container (${qty} Cartons)`;
  }
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function initTiltEffect() {
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('global-notification-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-notification-toast';
    toast.className = 'global-notification-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="toast-content">
      <span>${message}</span>
      <a href="calculator.html" class="toast-link">Open 3D Simulator →</a>
    </div>
  `;
  toast.classList.add('visible');

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
