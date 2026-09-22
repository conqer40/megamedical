/* ==========================================================================
   MegaMedical — Hero Showcase Slider (Lightweight, High-Performance)
   Clean Vanilla JS, Zero Heavy WebGL Dependencies, Buttery Smooth Transitions
   ========================================================================== */

(function() {
  function initHeroSlider() {
    const sliderBox = document.getElementById('hero-slider-box');
    const slides = document.querySelectorAll('.hero-slide-item');
    const tabs = document.querySelectorAll('.slider-tab-dot');
    const prevBtn = document.getElementById('slider-prev-btn');
    const nextBtn = document.getElementById('slider-next-btn');
    const progressFill = document.getElementById('slider-progress-fill');

    if (!sliderBox || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    const slideDuration = 5000; // 5 seconds per slide
    let timer = null;
    let isPaused = false;

    function goToSlide(index, manual = false) {
      if (index === currentIndex && !manual) return;

      // Wrap around
      if (index >= totalSlides) index = 0;
      if (index < 0) index = totalSlides - 1;

      // Update slides
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update tabs
      tabs.forEach((tab, i) => {
        if (i === index) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      currentIndex = index;

      // Sound FX if active
      if (manual && typeof window.playUiSound === 'function') {
        window.playUiSound('hover');
      }

      resetProgress();
    }

    function nextSlide(manual = false) {
      goToSlide(currentIndex + 1, manual);
    }

    function prevSlide(manual = false) {
      goToSlide(currentIndex - 1, manual);
    }

    function resetProgress() {
      if (!progressFill) return;
      progressFill.style.transition = 'none';
      progressFill.style.width = '0%';
      // Force reflow
      void progressFill.offsetWidth;
      if (!isPaused) {
        progressFill.style.transition = `width ${slideDuration}ms linear`;
        progressFill.style.width = '100%';
      }
    }

    function startAutoPlay() {
      stopAutoPlay();
      resetProgress();
      timer = setInterval(() => {
        if (!isPaused) {
          nextSlide(false);
        }
      }, slideDuration);
    }

    function stopAutoPlay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Event Listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide(true);
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide(true);
        startAutoPlay();
      });
    }

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        goToSlide(idx, true);
        startAutoPlay();
      });
    });

    // Pause on hover
    sliderBox.addEventListener('mouseenter', () => {
      isPaused = true;
      if (progressFill) {
        const computedWidth = window.getComputedStyle(progressFill).width;
        progressFill.style.transition = 'none';
        progressFill.style.width = computedWidth;
      }
    });

    sliderBox.addEventListener('mouseleave', () => {
      isPaused = false;
      startAutoPlay();
    });

    // Mobile Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    sliderBox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isPaused = true;
    }, { passive: true });

    sliderBox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      isPaused = false;
      handleSwipe();
      startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          nextSlide(true); // Swiped left -> next
        } else {
          prevSlide(true); // Swiped right -> prev
        }
      }
    }

    // Keyboard navigation when page is active
    window.addEventListener('keydown', (e) => {
      const rect = sliderBox.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        nextSlide(true);
        startAutoPlay();
      } else if (e.key === 'ArrowLeft') {
        prevSlide(true);
        startAutoPlay();
      }
    });

    // Initialize first slide and timer
    goToSlide(0);
    startAutoPlay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSlider);
  } else {
    initHeroSlider();
  }
})();
