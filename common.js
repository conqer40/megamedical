/* ==========================================================================
   Mega Medical — Shared Experience Controller & Micro-Interactions
   ========================================================================== */

// Audio Synthesizer via Web Audio API (No external sound files required)
let audioCtx = null;
let soundMuted = false;

function playUiSound(type = 'click') {
  if (soundMuted) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'add') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  } catch (e) {
    // Audio context not allowed until first interaction
  }
}

function toggleSound() {
  soundMuted = !soundMuted;
  const btn = document.getElementById('sound-toggle');
  if (btn) {
    btn.textContent = soundMuted ? '🔇 Sound Off' : '🔊 Sound FX';
  }
}

// Persistent Basket / FCL Cart State across pages
function getCart() {
  try {
    const raw = localStorage.getItem('megamedical_fcl_cart');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem('megamedical_fcl_cart', JSON.stringify(cart));
  } catch (e) {}
}

function addToCart(productId, qty = 50) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart(cart);
  playUiSound('add');
  updateNavCartBadge();
}

function updateNavCartBadge() {
  const cart = getCart();
  const totalCartons = Object.values(cart).reduce((a, b) => a + b, 0);
  const badge = document.getElementById('nav-cart-badge');
  if (badge) {
    badge.textContent = totalCartons > 0 ? ` (${totalCartons} ctns)` : '';
  }
}

/* ==========================================================================
   CUSTOM GLOWING CURSOR WITH FLUID TRAIL
   ========================================================================== */
function initCustomCursor() {
  if (window.innerWidth < 992) return; // Only on desktop
  
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  document.body.appendChild(dot);

  const trail = document.createElement('div');
  trail.className = 'custom-cursor-trail';
  document.body.appendChild(trail);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = mouseX;
  let trailY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderTrail() {
    trailX += (mouseX - trailX) * 0.18;
    trailY += (mouseY - trailY) * 0.18;
    trail.style.left = `${trailX}px`;
    trail.style.top = `${trailY}px`;
    requestAnimationFrame(renderTrail);
  }
  renderTrail();

  // Expand trail when hovering over buttons, cards, or links
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, input, select, textarea, .product-tilt-card, .container-select-card')) {
      document.body.classList.add('cursor-hover');
      playUiSound('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, input, select, textarea, .product-tilt-card, .container-select-card')) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

/* ==========================================================================
   AMBIENT BACKGROUND PARTICLES
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.min(Math.floor((w * h) / 22000), 55);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 1,
      cyan: Math.random() > 0.4
    });
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.cyan ? 'rgba(0, 242, 254, 0.65)' : 'rgba(2, 132, 199, 0.5)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${ (1 - dist / 120) * 0.22 })`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}

/* ==========================================================================
   3D CARD TILT INTERACTION
   ========================================================================== */
function initTiltEffect() {
  if (window.innerWidth < 992) return;

  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.product-tilt-card, .hero-3d-featured-card, .subsidiary-neon-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      } else {
        if (!card.matches(':hover')) {
          card.style.transform = '';
        }
      }
    });
  });
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initAmbientCanvas();
  initTiltEffect();
  updateNavCartBadge();

  // Sound toggle button setup
  const soundBtn = document.getElementById('sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', toggleSound);
  }

  // Mobile drawer toggle
  const mobileToggle = document.getElementById('nav-toggle-btn');
  const navMenu = document.getElementById('nav-menu-list');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.style.display === 'flex';
      navMenu.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = 'rgba(3, 7, 18, 0.98)';
        navMenu.style.padding = '24px';
        navMenu.style.borderBottom = '1px solid var(--border-neon)';
      }
    });
  }

  // Navbar scroll background change
  const navbar = document.querySelector('.main-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });
});
