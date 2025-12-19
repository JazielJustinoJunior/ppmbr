// ============================================
// PPMBR - TACTICAL INTERFACE INTERACTIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // === PLAYER COUNT ANIMATION ===
    const playerCountElement = document.getElementById('playerCount');

    function animatePlayerCount() {
        const currentCount = parseInt(playerCountElement.textContent.split('/')[0]);
        const maxPlayers = 64;
        const variation = Math.floor(Math.random() * 5) - 2; // -2 a +2
        let newCount = Math.max(0, Math.min(maxPlayers, currentCount + variation));

        playerCountElement.textContent = `${newCount}/${maxPlayers}`;
    }

    // Atualiza a cada 10 segundos
    setInterval(animatePlayerCount, 10000);


    // === GLITCH EFFECT ON HOVER ===
    const glitchTitle = document.querySelector('.hero-title');

    function triggerGlitch() {
        glitchTitle.classList.add('glitching');
        setTimeout(() => {
            glitchTitle.classList.remove('glitching');
        }, 300);
    }

    if (glitchTitle) {
        glitchTitle.addEventListener('mouseenter', triggerGlitch);
    }


    // === CROSSHAIR CURSOR ON ARSENAL CARDS ===
    const arsenalCards = document.querySelectorAll('.arsenal-card');

    arsenalCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'crosshair';
        });
    });


    // === TACTICAL GRID ANIMATION ===
    const heroGrid = document.querySelector('.hero-grid');
    let gridOpacity = 0.2;
    let increasing = true;

    function animateGrid() {
        if (increasing) {
            gridOpacity += 0.002;
            if (gridOpacity >= 0.35) increasing = false;
        } else {
            gridOpacity -= 0.002;
            if (gridOpacity <= 0.2) increasing = true;
        }
        if (heroGrid) {
            heroGrid.style.opacity = gridOpacity;
        }
        requestAnimationFrame(animateGrid);
    }

    animateGrid();


    // === INTEL BAR FLICKER EFFECT ===
    const intelBar = document.querySelector('.intel-bar');

    function flickerIntelBar() {
        const shouldFlicker = Math.random() > 0.95; // 5% chance
        if (shouldFlicker && intelBar) {
            intelBar.style.opacity = '0.7';
            setTimeout(() => {
                intelBar.style.opacity = '1';
            }, 50);
        }
    }

    setInterval(flickerIntelBar, 100);


    // === SCROLL REVEAL ANIMATIONS ===
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.arsenal-card, .briefing-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });


    // === RANDOM GLITCH EFFECT ON TITLE ===
    function randomGlitch() {
        const chance = Math.random();
        if (chance > 0.98 && glitchTitle) { // 2% chance a cada segundo
            triggerGlitch();
        }
    }

    setInterval(randomGlitch, 1000);


    // === CORNER BRACKET ANIMATIONS ===
    const corners = document.querySelectorAll('.corner');

    function animateCorners() {
        corners.forEach((corner, index) => {
            setTimeout(() => {
                corner.style.opacity = '0.5';
                setTimeout(() => {
                    corner.style.opacity = '1';
                }, 100);
            }, index * 100);
        });
    }

    // Anima os cantos a cada 5 segundos
    setInterval(animateCorners, 5000);
    corners.forEach(corner => {
        corner.style.transition = 'opacity 0.2s ease';
    });


    // === TYPING EFFECT ON BRIEFING (PRIMEIRA VEZ) ===
    const briefingMain = document.querySelector('.briefing-main');

    const briefingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                entry.target.classList.add('typed');
                typeWriter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (briefingMain) {
        const originalText = briefingMain.innerHTML;
        briefingMain.setAttribute('data-original', originalText);
        briefingObserver.observe(briefingMain);
    }

    function typeWriter(element) {
        const text = element.getAttribute('data-original');
        element.innerHTML = '';
        element.style.opacity = '1';

        let i = 0;
        const speed = 20; // ms por caractere

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.innerHTML = text; // Garante que HTML tags sejam renderizadas
            }
        }

        type();
    }


    // === PARALLAX EFFECT ON HERO ===
    const heroVideo = document.querySelector('.hero-video');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroVideo) {
            heroVideo.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });


    // === CTA BUTTON SOUND EFFECT (SIMULADO COM VIBRAÇÃO) ===
    const ctaButton = document.querySelector('.cta-button');

    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            // Vibração no mobile (se suportado)
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }

            // Efeito visual de "disparo"
            ctaButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                ctaButton.style.transform = 'scale(1)';
            }, 100);
        });
    }


    // === CONSOLE LOG TÁTICO ===
    console.log('%c[PPMBR] SISTEMA INICIADO', 'color: #cf2e2e; font-weight: bold; font-size: 14px;');
    console.log('%c[INTEL] Interface tática carregada com sucesso', 'color: #4caf50; font-size: 12px;');
    console.log('%c[STATUS] Todos os sistemas operacionais', 'color: #4caf50; font-size: 12px;');

});


// === ADICIONAR CLASSE DE GLITCH NO CSS ===
const style = document.createElement('style');
style.textContent = `
    .hero-title.glitching {
        animation: glitch-shake 0.3s ease;
    }

    @keyframes glitch-shake {
        0%, 100% { transform: translate(0); }
        10% { transform: translate(-5px, 5px); }
        20% { transform: translate(5px, -5px); }
        30% { transform: translate(-5px, -5px); }
        40% { transform: translate(5px, 5px); }
        50% { transform: translate(-5px, 5px); }
        60% { transform: translate(5px, -5px); }
        70% { transform: translate(-5px, -5px); }
        80% { transform: translate(5px, 5px); }
        90% { transform: translate(-5px, 5px); }
    }
`;
document.head.appendChild(style);
