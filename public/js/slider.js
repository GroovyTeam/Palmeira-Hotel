// ════════════════════════════════════
// Hotel Palmeira's Sliders Lógica
// ════════════════════════════════════

/**
 * Inicializa un slider genérico con soporte de autoplay, controles, dots y gestos táctiles.
 * Detiene permanentemente el autoplay en interacciones de click/swipe.
 */
function setupSlider({ containerId, dotsId, prevId, nextId, hoverContainerSelector, autoplayInterval = 5000 }) {
  const slidesContainer = document.getElementById(containerId);
  const dotsContainer = document.getElementById(dotsId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);

  if (!slidesContainer) return;

  const slides = slidesContainer.querySelectorAll('img');
  const total = slides.length;
  if (total === 0) return;

  let current = 0;
  let autoplayTimer = null;
  let isStopped = false; // Indica si el autoplay se ha detenido permanentemente

  // Limpiar dots previos y crear nuevos
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        isStopped = true;
        clearInterval(autoplayTimer);
        goTo(i);
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + total) % total;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      isStopped = true;
      clearInterval(autoplayTimer);
      prev();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      isStopped = true;
      clearInterval(autoplayTimer);
      next();
    });
  }

  // Autoplay
  function startAutoplay() {
    if (isStopped) return;
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(next, autoplayInterval);
  }

  startAutoplay();

  // Pausar reproducción automática en hover y reanudar al salir (si no está detenido permanentemente)
  const hoverContainer = hoverContainerSelector ? slidesContainer.closest(hoverContainerSelector) : null;
  if (hoverContainer) {
    hoverContainer.addEventListener('mouseenter', () => {
      clearInterval(autoplayTimer);
    });
    hoverContainer.addEventListener('mouseleave', () => {
      if (!isStopped) startAutoplay();
    });
  }

  // Soporte para gestos deslizantes (Touch/Swipe)
  let touchStartX = 0;
  slidesContainer.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slidesContainer.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) {
      isStopped = true;
      clearInterval(autoplayTimer);
      delta > 0 ? prev() : next();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar slider de Habitaciones (5 segundos de cambio)
  setupSlider({
    containerId: 'roomSlides',
    dotsId: 'slideDots',
    prevId: 'slidePrev',
    nextId: 'slideNext',
    hoverContainerSelector: '.room-slider',
    autoplayInterval: 5000
  });

  // Inicializar slider de Momentos en la Playa (2 segundos de cambio)
  setupSlider({
    containerId: 'beachSlides',
    dotsId: 'beachDots',
    prevId: 'beachPrev',
    nextId: 'beachNext',
    hoverContainerSelector: '.beach-moments-slider',
    autoplayInterval: 2000
  });
});
