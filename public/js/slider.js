// ════════════════════════════════════
// Room Gallery Slider
// ════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const slidesContainer = document.getElementById('roomSlides');
  const dotsContainer = document.getElementById('slideDots');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');

  if (!slidesContainer) return;

  const slides = slidesContainer.querySelectorAll('img');
  const total = slides.length;
  let current = 0;
  let autoplayTimer = null;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.dot');

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + total) % total;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetAutoplay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Autoplay
  function startAutoplay() {
    autoplayTimer = setInterval(next, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();

  // Pause on hover
  slidesContainer.closest('.room-slider').addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  slidesContainer.closest('.room-slider').addEventListener('mouseleave', startAutoplay);

  // Touch/swipe support
  let touchStartX = 0;
  slidesContainer.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slidesContainer.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) delta > 0 ? prev() : next();
  });
});
