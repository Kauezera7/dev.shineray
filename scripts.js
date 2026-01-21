// script.js - VERSÃO CORRIGIDA
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Carrossel iniciando...');
    
    // ================= CONFIGURAÇÃO =================
    // CONTROLE DO TEMPO AQUI ↓ (em milissegundos)
    const DESKTOP_DELAY = 5000;    // 5 segundos para desktop
    const MOBILE_DELAY = 7000;     // 7 segundos para mobile
    const TABLET_DELAY = 6000;     // 6 segundos para tablet
    // ================================================
    
    // Elementos
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const currentSlideEl = document.getElementById('current-slide');
    const totalSlidesEl = document.getElementById('total-slides');
    const carrosselContainer = document.querySelector('.carrossel-container');
    
    // Variáveis
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval = null;
    let isAutoPlayActive = true;
    
    // ================= FUNÇÕES PRINCIPAIS =================
    
    // Inicializar
    function initCarousel() {
        console.log(`📊 Total de slides: ${totalSlides}`);
        
        // Atualizar contador total
        if (totalSlidesEl) {
            totalSlidesEl.textContent = totalSlides.toString().padStart(2, '0');
        }
        
        // Mostrar primeiro slide
        showSlide(currentIndex);
        
        // Configurar eventos
        setupEventListeners();
        
        // Iniciar auto-play
        startAutoPlay();
        
        console.log('✅ Carrossel inicializado com sucesso!');
    }
    
    // Mostrar slide específico
    function showSlide(index) {
        // Validar índice
        if (index < 0 || index >= totalSlides) return;
        
        console.log(`▶️ Mostrando slide ${index + 1}/${totalSlides}`);
        
        // Esconder todos os slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remover active de todos os dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Mostrar slide atual
        slides[index].classList.add('active');
        
        // Ativar dot correspondente
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        // Atualizar contador atual
        if (currentSlideEl) {
            currentSlideEl.textContent = (index + 1).toString().padStart(2, '0');
        }
        
        // Atualizar índice atual
        currentIndex = index;
    }
    
    // Próximo slide
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % totalSlides;
        showSlide(nextIndex);
    }
    
    // Slide anterior
    function prevSlide() {
        const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex);
    }
    
    // Ir para slide específico
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            showSlide(index);
            resetAutoPlay(); // Resetar timer quando clicar manualmente
        }
    }
    
    // ================= CONTROLE DE TEMPO =================
    
    // Obter delay baseado no dispositivo
    function getAutoPlayDelay() {
        const width = window.innerWidth;
        
        if (width <= 480) {
            console.log('📱 Dispositivo: Celular pequeno');
            return MOBILE_DELAY;
        } else if (width <= 768) {
            console.log('📱 Dispositivo: Celular/Tablet pequeno');
            return TABLET_DELAY;
        } else if (width <= 1024) {
            console.log('💻 Dispositivo: Tablet');
            return TABLET_DELAY;
        } else {
            console.log('🖥️  Dispositivo: Desktop');
            return DESKTOP_DELAY;
        }
    }
    
    // Iniciar auto-play
    function startAutoPlay() {
        // Se auto-play já está rodando, não fazer nada
        if (autoPlayInterval !== null) {
            console.log('⚠️ Auto-play já está ativo');
            return;
        }
        
        if (!isAutoPlayActive) {
            console.log('⏸️ Auto-play desativado');
            return;
        }
        
        const delay = getAutoPlayDelay();
        console.log(`⏱️ Iniciando auto-play: ${delay/1000} segundos`);
        
        autoPlayInterval = setInterval(() => {
            console.log('🔄 Auto-play: mudando para próximo slide');
            nextSlide();
        }, delay);
    }
    
    // Parar auto-play
    function stopAutoPlay() {
        if (autoPlayInterval !== null) {
            console.log('⏸️ Parando auto-play');
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // Resetar auto-play
    function resetAutoPlay() {
        console.log('🔄 Resetando auto-play');
        stopAutoPlay();
        
        if (isAutoPlayActive) {
            // Pequeno delay antes de reiniciar
            setTimeout(() => {
                startAutoPlay();
            }, 100);
        }
    }
    
    // ================= EVENT LISTENERS =================
    
    function setupEventListeners() {
        // Botões de navegação
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('⬅️ Botão anterior clicado');
                prevSlide();
                resetAutoPlay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('➡️ Botão próximo clicado');
                nextSlide();
                resetAutoPlay();
            });
        }
        
        // Dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`• Dot ${index} clicado`);
                goToSlide(index);
            });
        });
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                console.log('⌨️ Tecla: Seta esquerda');
                prevSlide();
                resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                console.log('⌨️ Tecla: Seta direita');
                nextSlide();
                resetAutoPlay();
            }
        });
        
        // Pausar auto-play no hover (somente desktop)
        if (carrosselContainer && window.innerWidth > 768) {
            carrosselContainer.addEventListener('mouseenter', () => {
                console.log('🐭 Mouse entrou no carrossel');
                stopAutoPlay();
            });
            
            carrosselContainer.addEventListener('mouseleave', () => {
                console.log('🐭 Mouse saiu do carrossel');
                if (isAutoPlayActive) {
                    startAutoPlay();
                }
            });
        }
        
        // Swipe para mobile
        setupSwipeEvents();
        
        // Redimensionamento da janela
        window.addEventListener('resize', handleResize);
    }
    
    // Swipe para dispositivos touch
    function setupSwipeEvents() {
        const slidesWrapper = document.querySelector('.slides-wrapper');
        if (!slidesWrapper) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;
        
        slidesWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            console.log('👆 Touch iniciado');
            stopAutoPlay();
        }, { passive: true });
        
        slidesWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const distance = touchStartX - touchEndX;
            
            if (Math.abs(distance) > minSwipeDistance) {
                if (distance > 0) {
                    console.log('👈 Swipe para esquerda');
                    nextSlide();
                } else {
                    console.log('👉 Swipe para direita');
                    prevSlide();
                }
                resetAutoPlay();
            }
            
            // Retomar auto-play depois de 3 segundos
            setTimeout(() => {
                if (isAutoPlayActive) {
                    startAutoPlay();
                }
            }, 3000);
        }, { passive: true });
    }
    
    // Lidar com redimensionamento
    function handleResize() {
        console.log(`📐 Janela redimensionada: ${window.innerWidth}px`);
        
        // Se o auto-play está ativo, ajustar o timer
        if (isAutoPlayActive && autoPlayInterval !== null) {
            resetAutoPlay();
        }
    }
    
    // ================= INICIALIZAÇÃO =================
    
    // Verificar se todos os elementos existem
    if (slides.length === 0) {
        console.error('❌ Nenhum slide encontrado!');
        return;
    }
    
    if (!prevBtn || !nextBtn) {
        console.error('❌ Botões de navegação não encontrados!');
        return;
    }
    
    // Iniciar carrossel
    initCarousel();
    
    // Informações de debug no console
    console.log('===============================');
    console.log('⚙️  CONFIGURAÇÃO DO CARROSSEL');
    console.log('===============================');
    console.log(`🖥️  Desktop: ${DESKTOP_DELAY/1000}s`);
    console.log(`📱 Mobile: ${MOBILE_DELAY/1000}s`);
    console.log(`💻 Tablet: ${TABLET_DELAY/1000}s`);
    console.log(`📊 Total slides: ${totalSlides}`);
    console.log('===============================');
    
    // Opcional: Mostrar tempo atual em um elemento na tela (útil para debug)
    function showDebugInfo() {
        const debugDiv = document.createElement('div');
        debugDiv.id = 'carrossel-debug';
        debugDiv.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 8px 12px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            border: 1px solid #be0b0b;
            display: none; /* Mude para 'block' para ver */
        `;
        
        const delay = getAutoPlayDelay();
        debugDiv.innerHTML = `
            ⏱️ Slide: ${delay/1000}s<br>
            📱 Slide: ${currentIndex + 1}/${totalSlides}<br>
            🖥️ Largura: ${window.innerWidth}px
        `;
        
        document.body.appendChild(debugDiv);
        
        // Atualizar a cada 5 segundos
        setInterval(() => {
            const currentDelay = getAutoPlayDelay();
            debugDiv.innerHTML = `
                ⏱️ Tempo: ${currentDelay/1000}s<br>
                📱 Slide: ${currentIndex + 1}/${totalSlides}<br>
                🖥️ Largura: ${window.innerWidth}px
            `;
        }, 5000);
    }
    
    // Descomente a linha abaixo para ver informações de debug na tela
    // showDebugInfo();
});