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
// Guest Counter
// ==================== //
let guestCount = 1;
const maxGuests = 10;

document.getElementById('increaseGuests').addEventListener('click', () => {
    if (guestCount < maxGuests) {
        guestCount++;
        document.getElementById('guestNumber').textContent = guestCount;
    }
});

document.getElementById('decreaseGuests').addEventListener('click', () => {
    if (guestCount > 1) {
        guestCount--;
        document.getElementById('guestNumber').textContent = guestCount;
    }
});

// ==================== //
// RSVP Functionality
// ==================== //
async function handleRSVP(attending) {
    const name = document.getElementById('guestName').value.trim();
    const email = document.getElementById('guestEmail').value.trim();
    const phone = document.getElementById('guestPhone').value.trim();
    const specialRequests = document.getElementById('specialRequests').value.trim();

    if (!name) {
        alert('Please enter your name');
        document.getElementById('guestName').focus();
        return;
    }

    const rsvpData = {
        name: name,
        email: email,
        phone: phone,
        attending: attending,
        guestCount: attending ? guestCount : 0,
        specialRequests: specialRequests,
        timestamp: new Date().toISOString()
    };

    saveRSVPLocally(rsvpData);

    const success = await sendRSVP(rsvpData);

    if (success) {
        showSuccessMessage(attending, name);
    } else {
        alert('There was an error sending your RSVP. Your response has been saved locally. Please contact us directly to confirm.');
        showSuccessMessage(attending, name);
    }
}

function saveRSVPLocally(data) {
    try {
        localStorage.setItem('wedding_rsvp', JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save RSVP locally:', e);
    }
}

// ==================== //
// Send RSVP to Google Sheets
// ==================== //
async function sendRSVP(data) {
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL';
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                phone: data.phone,
                attending: data.attending,
                guestCount: data.guestCount,
                specialRequests: data.specialRequests,
                timestamp: data.timestamp
            })
        });

        console.log('✓ RSVP sent to Google Sheets');
        return true;
        
    } catch (error) {
        console.error('✗ Error sending RSVP to Google Sheets:', error);
        return false;
    }
}

function showSuccessMessage(attending, name) {
    const form = document.getElementById('rsvpForm');
    const success = document.getElementById('rsvpSuccess');
    const successMessage = document.getElementById('successMessage');
    const successDetails = document.getElementById('successDetails');

    form.style.display = 'none';
    success.style.display = 'block';

    if (attending) {
        successMessage.textContent = `Thank you, ${name}! 🎉`;
        successDetails.textContent = `We can't wait to celebrate with you on May 29, 2026!`;
    } else {
        successMessage.textContent = `Thank you for letting us know, ${name}.`;
        successDetails.textContent = `You'll be missed, but we understand. We hope to celebrate with you another time!`;
    }

    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.getElementById('acceptBtn').addEventListener('click', () => handleRSVP(true));
document.getElementById('declineBtn').addEventListener('click', () => handleRSVP(false));

// ==================== //
// Check for existing RSVP
// ==================== //
function checkExistingRSVP() {
    try {
        const existingRSVP = localStorage.getItem('wedding_rsvp');
        if (existingRSVP) {
            const data = JSON.parse(existingRSVP);
            document.getElementById('guestName').value = data.name || '';
            document.getElementById('guestEmail').value = data.email || '';
            document.getElementById('guestPhone').value = data.phone || '';
            
            if (data.attending !== undefined) {
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--temple-teal, #1a7a6d);
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                    z-index: 1000;
                    font-family: 'Josefin Sans', sans-serif;
                    animation: fadeInUp 0.5s ease-out;
                `;
                notification.textContent = `Welcome back, ${data.name}! You can update your RSVP below.`;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transition = 'opacity 0.5s';
                    setTimeout(() => notification.remove(), 500);
                }, 4000);
            }
        }
    } catch (e) {
        console.error('Failed to check existing RSVP:', e);
    }
}

checkExistingRSVP();

// ==================== //
// PWA Installation
// ==================== //
let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');
const closeInstallPrompt = document.getElementById('closeInstallPrompt');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    setTimeout(() => {
        installPrompt.style.display = 'block';
    }, 5000);
});

installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
        return;
    }
    
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    deferredPrompt = null;
    installPrompt.style.display = 'none';
});

closeInstallPrompt.addEventListener('click', () => {
    installPrompt.style.display = 'none';
    sessionStorage.setItem('installPromptClosed', 'true');
});

if (sessionStorage.getItem('installPromptClosed')) {
    installPrompt.style.display = 'none';
}

window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    installPrompt.style.display = 'none';
    
    const thankYou = document.createElement('div');
    thankYou.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1a7a6d;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        text-align: center;
        font-family: 'Josefin Sans', sans-serif;
    `;
    thankYou.textContent = '✓ Added to home screen!';
    document.body.appendChild(thankYou);
    
    setTimeout(() => {
        thankYou.style.opacity = '0';
        thankYou.style.transition = 'opacity 0.5s';
        setTimeout(() => thankYou.remove(), 500);
    }, 3000);
});

// ==================== //
// Service Worker Registration
// ==================== //
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

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

// ==================== //
// Offline Detection
// ==================== //
window.addEventListener('online', () => {
    console.log('Back online');
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
    const offlineNotice = document.createElement('div');
    offlineNotice.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff9800;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        font-family: 'Josefin Sans', sans-serif;
    `;
    offlineNotice.textContent = 'You\'re offline. Some features may not work.';
    document.body.appendChild(offlineNotice);
    
    setTimeout(() => offlineNotice.remove(), 5000);
});
