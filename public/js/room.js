// room.js

document.addEventListener('DOMContentLoaded', function() {
    
    // Selecciona TODOS los contenedores de sliders en la página
    const allSliderContainers = document.querySelectorAll('.slider-container');

    // Si no hay sliders, no hacemos nada
    if (allSliderContainers.length === 0) return;

    // Recorremos cada contenedor y lo inicializamos por separado
    allSliderContainers.forEach(container => {
        // Variables específicas para CADA slider
        const slider = container.querySelector('.slider');
        const images = slider.querySelectorAll('img');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const indicatorsContainer = container.querySelector('.indicators');
        
        let currentIndex = 0;
        let autoPlayInterval;
        let isTransitioning = false;
        
        // --- Funciones para este slider ---
        
        function createIndicators() {
            indicatorsContainer.innerHTML = '';
            images.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                if (index === 0) indicator.classList.add('active');
                
                indicator.addEventListener('click', () => {
                    if (!isTransitioning) {
                        goToSlide(index);
                        resetAutoPlay();
                    }
                });
                
                indicatorsContainer.appendChild(indicator);
            });
        }
        
        function updateIndicators() {
            const indicators = indicatorsContainer.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            if (isTransitioning || index === currentIndex) return;
            
            isTransitioning = true;
            currentIndex = index;
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateIndicators();
            
            setTimeout(() => {
                isTransitioning = false;
            }, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--transition-duration')) * 1000);
        }
        
        function nextSlide() {
            const nextIndex = (currentIndex + 1) % images.length;
            goToSlide(nextIndex);
        }
        
        function prevSlide() {
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            goToSlide(prevIndex);
        }
        
        function startAutoPlay() {
            const interval = getComputedStyle(document.documentElement).getPropertyValue('--auto-play-interval');
            autoPlayInterval = setInterval(nextSlide, parseInt(interval));
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }
        
        // --- Event Listeners para ESTE slider ---
        
        nextBtn.addEventListener('click', () => {
            if (!isTransitioning) {
                nextSlide();
                resetAutoPlay();
            }
        });
        
        prevBtn.addEventListener('click', () => {
            if (!isTransitioning) {
                prevSlide();
                resetAutoPlay();
            }
        });
        
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
        
        // Inicializar este slider
        createIndicators();
        startAutoPlay();
    });
});