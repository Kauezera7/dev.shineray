// script.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carrossel inicializando...');
    
    // Elementos
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const currentSlideEl = document.getElementById('current-slide');
    const totalSlidesEl = document.getElementById('total-slides');
    
    // Variáveis
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;
    
    // Inicializar
    function init() {
        console.log('Total de slides:', totalSlides);
        
        // Atualizar total
        totalSlidesEl.textContent = totalSlides.toString().padStart(2, '0');
        
        // Mostrar primeiro slide
        showSlide(currentIndex);
        
        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
        
        // Teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
        
        // Swipe para mobile
        setupSwipe();
        
        // Auto-play ajustado para dispositivo
        setupAutoPlay();
        
        // Ajustar para orientação da tela
        window.addEventListener('resize', adjustForScreen);
        adjustForScreen();
    }
    
    // Mostrar slide
    function showSlide(index) {
        console.log('Mostrando slide', index + 1);
        
        // Esconder todos
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Mostrar atual
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Atualizar número
        currentSlideEl.textContent = (index + 1).toString().padStart(2, '0');
        
        currentIndex = index;
    }
    
    // Próximo slide
    function nextSlide() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= totalSlides) nextIndex = 0;
        showSlide(nextIndex);
        resetAutoPlay();
    }
    
    // Slide anterior
    function prevSlide() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = totalSlides - 1;
        showSlide(prevIndex);
        resetAutoPlay();
    }
    
    // Ir para slide específico
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            showSlide(index);
            resetAutoPlay();
        }
    }
    
    // Configurar swipe para mobile
    function setupSwipe() {
        const container = document.querySelector('.slides-wrapper');
        let startX = 0;
        let endX = 0;
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe(startX, endX);
        }, { passive: true });
    }
    
    function handleSwipe(start, end) {
        const minSwipe = 50; // Mínimo de pixels para considerar swipe
        
        if (start - end > minSwipe) {
            // Swipe para esquerda = próximo
            nextSlide();
        } else if (end - start > minSwipe) {
            // Swipe para direita = anterior
            prevSlide();
        }
    }
    
    // Auto-play ajustado por dispositivo
    function setupAutoPlay() {
        const isMobile = window.innerWidth <= 768;
        const delay = isMobile ? 8000 : 8000; // Mais lento em mobile
        
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, delay);
        
        // Pausar no hover (somente desktop)
        if (!isMobile) {
            const container = document.querySelector('.carrossel-container');
            container.addEventListener('mouseenter', stopAutoPlay);
            container.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(nextSlide, delay);
            });
        }
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        setupAutoPlay();
    }
    
    // Ajustar para tamanho da tela
    function adjustForScreen() {
        const width = window.innerWidth;
        console.log('Largura da tela:', width, 'px');
        
        // Ajustar altura do container
        const container = document.querySelector('.carrossel-container');
        if (width <= 480) {
            container.style.height = '400px';
        } else if (width <= 768) {
            container.style.height = '450px';
        } else {
            container.style.height = '500px';
        }
        
        // Reconfigurar auto-play se necessário
        stopAutoPlay();
        setupAutoPlay();
    }
    
    // Iniciar
    init();
    console.log('Carrossel pronto!');
});