// ==================== //
// Wedding Date Configuration
// ==================== //
const WEDDING_DATE = new Date('2026-05-29T18:00:00').getTime(); // 6:00 PM reception time

// ==================== //
// Countdown Timer (Dynamic - Updates Every Second)
// ==================== //
function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<p style="text-align: center; font-size: 1.2rem;">The big day is here! 🎉</p>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ==================== //
// Smooth Scrolling
// ==================== //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== //
// Scroll Indicator
// ==================== //
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
}

// ==================== //
// Scroll-Reveal Couple Names
// ==================== //
const scrollRevealNames = document.getElementById('scrollRevealNames');
let namesRevealed = false;

function handleNameReveal() {
    const scrollY = window.scrollY;
    const triggerPoint = window.innerHeight * 0.15;

    if (scrollY > triggerPoint && !namesRevealed) {
        namesRevealed = true;
        scrollRevealNames.classList.add('visible');

        const names = scrollRevealNames.querySelectorAll('.couple-names-reveal');
        const ampersand = scrollRevealNames.querySelector('.ampersand-reveal');
        const tagline = scrollRevealNames.querySelector('.tagline-reveal');

        names.forEach((name, i) => {
            setTimeout(() => name.classList.add('animate-in'), i * 250);
        });
        if (ampersand) {
            setTimeout(() => ampersand.classList.add('animate-in'), 200);
        }
        if (tagline) {
            setTimeout(() => tagline.classList.add('animate-in'), 500);
        }
    }

    if (scrollY <= 10) {
        namesRevealed = false;
        scrollRevealNames.classList.remove('visible');
        scrollRevealNames.querySelectorAll('.animate-in').forEach(el => {
            el.classList.remove('animate-in');
        });
    }
}

// ==================== //
// Scroll Indicator Fade
// ==================== //
function handleScrollIndicatorFade() {
    if (!scrollIndicator) return;
    if (window.scrollY > 80) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
    } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
    }
}

// ==================== //
// Parallax Effect for Hero Elements
// ==================== //
function handleParallax() {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax);
        el.style.transform = `translateY(${scrollY * speed}px)`;
    });
}

// ==================== //
// Section Reveal on Scroll (Intersection Observer)
// ==================== //
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.section-reveal').forEach(section => {
    revealObserver.observe(section);
});

// ==================== //
// Unified Scroll Handler (throttled via rAF)
// ==================== //
let ticking = false;

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleNameReveal();
            handleScrollIndicatorFade();
            handleParallax();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ==================== //
// Button Ripple / Haptic
// ==================== //
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    });
});

// ==================== //
// Analytics (Optional)
// ==================== //
function trackPageView() {
    console.log('Page viewed at:', new Date().toISOString());
}

trackPageView();

