// Script JavaScript
        const slider = document.getElementById('autoSlider');
        const items = slider.getElementsByClassName('slide-item');
        const totalSlides = items.length;
        let currentIndex = 0;
        const intervalTime = 3000; // 3000ms = 3 segundos

        function nextSlide() {
            // Incrementa el índice y vuelve a 0 si llega al final
            currentIndex = (currentIndex + 1) % totalSlides;
            
            // Calcula la posición de desplazamiento (por ejemplo, si es el slide 1, se desplaza -100%)
            const offset = -currentIndex * (100 / totalSlides);
            
            // Aplica la transformación CSS para desplazar el contenedor
            slider.style.transform = `translateX(${offset}%)`;
        }

        // Inicia el auto-desplazamiento
        // Ejecuta la función nextSlide() cada 'intervalTime' milisegundos
        setInterval(nextSlide, intervalTime);