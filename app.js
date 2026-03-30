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

// Update countdown every second for real-time accuracy
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

    // Validation
    if (!name) {
        alert('Please enter your name');
        document.getElementById('guestName').focus();
        return;
    }

    // Prepare RSVP data
    const rsvpData = {
        name: name,
        email: email,
        phone: phone,
        attending: attending,
        guestCount: attending ? guestCount : 0,
        specialRequests: specialRequests,
        timestamp: new Date().toISOString()
    };

    // Store RSVP locally
    saveRSVPLocally(rsvpData);

    // Send RSVP to email
    const success = await sendRSVP(rsvpData);

    if (success) {
        // Show success message
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
// SETUP INSTRUCTIONS:
// 1. Create a Google Sheet with columns: Timestamp, Name, Email, Phone, Attending, Guest Count, Special Requests
// 2. Go to Extensions → Apps Script
// 3. Paste the code from GOOGLE-SHEETS-SETUP.md
// 4. Deploy as Web App
// 5. Copy the deployment URL and paste it below
// ==================== //
async function sendRSVP(data) {
    // IMPORTANT: Replace with your Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL'; // Get this after deploying Apps Script
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
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

        // Note: no-cors mode doesn't allow reading the response
        // But if we reach here without error, it likely succeeded
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

    // Scroll to success message
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Event listeners for RSVP buttons
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
            // Pre-fill form with existing data
            document.getElementById('guestName').value = data.name || '';
            document.getElementById('guestEmail').value = data.email || '';
            document.getElementById('guestPhone').value = data.phone || '';
            
            // Show a notification that they already RSVP'd
            if (data.attending !== undefined) {
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #4caf50;
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    z-index: 1000;
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

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show the install prompt after a delay
    setTimeout(() => {
        installPrompt.style.display = 'block';
    }, 5000); // Show after 5 seconds
});

// Handle install button click
installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
        return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the deferredPrompt
    deferredPrompt = null;
    
    // Hide the install prompt
    installPrompt.style.display = 'none';
});

// Handle close button
closeInstallPrompt.addEventListener('click', () => {
    installPrompt.style.display = 'none';
    // Don't show again for this session
    sessionStorage.setItem('installPromptClosed', 'true');
});

// Check if prompt was already closed
if (sessionStorage.getItem('installPromptClosed')) {
    installPrompt.style.display = 'none';
}

// Listen for successful installation
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    installPrompt.style.display = 'none';
    
    // Show a thank you message
    const thankYou = document.createElement('div');
    thankYou.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4caf50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        text-align: center;
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
// Scroll Indicator with Haptic Feedback
// ==================== //
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        // Haptic feedback for mobile
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
    
    // Hide scroll indicator after scrolling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100 && scrollIndicator) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// ==================== //
// Intersection Observer for Scroll Animations
// ==================== //
const observerOptions = {
    threshold: 0.1,
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

// Observe all sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ==================== //
// Add Ripple Effect to Buttons
// ==================== //
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    });
});

// ==================== //
// Analytics (Optional)
// ==================== //
// Track page views
function trackPageView() {
    console.log('Page viewed at:', new Date().toISOString());
    // You can integrate with Google Analytics or similar here
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
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
    `;
    offlineNotice.textContent = 'You\'re offline. Some features may not work.';
    document.body.appendChild(offlineNotice);
    
    setTimeout(() => offlineNotice.remove(), 5000);
});
