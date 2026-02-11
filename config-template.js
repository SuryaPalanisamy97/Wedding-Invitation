// ==================== //
// WEDDING WEBSITE CONFIGURATION
// ==================== //
// Copy this file and customize with your details
// Then integrate values into index.html and app.js

const WEDDING_CONFIG = {
    // ==================== //
    // COUPLE INFORMATION
    // ==================== //
    couple: {
        name1: "Sarah",
        name2: "Michael",
        hashtag: "#SarahAndMichael2026"
    },

    // ==================== //
    // WEDDING DATE & TIME
    // ==================== //
    date: {
        // Format: YYYY-MM-DDTHH:MM:SS
        datetime: "2026-06-15T15:00:00",
        displayDay: "Saturday",
        displayDate: "June 15, 2026"
    },

    // ==================== //
    // VENUE INFORMATION
    // ==================== //
    venue: {
        name: "The Grand Ballroom",
        address: {
            street: "123 Celebration Avenue",
            city: "Downtown",
            state: "CA",
            zip: "12345"
        },
        // Google Maps search query
        mapsQuery: "The+Grand+Ballroom+Downtown+CA"
    },

    // ==================== //
    // SCHEDULE
    // ==================== //
    schedule: [
        {
            time: "3:00 PM",
            title: "Ceremony",
            description: "Join us as we exchange vows"
        },
        {
            time: "4:30 PM",
            title: "Cocktail Hour",
            description: "Drinks and hors d'oeuvres"
        },
        {
            time: "6:00 PM",
            title: "Reception",
            description: "Dinner, dancing, and celebration"
        },
        {
            time: "11:00 PM",
            title: "Grand Finale",
            description: "Send-off celebration"
        }
    ],

    // ==================== //
    // RSVP SETTINGS
    // ==================== //
    rsvp: {
        deadline: "May 15, 2026",
        maxGuestsPerRSVP: 10,
        // Backend integration (choose one)
        backend: {
            type: "formspree", // Options: "formspree", "emailjs", "google-forms", "custom"
            endpoint: "https://formspree.io/f/YOUR_FORM_ID",
            // For EmailJS
            emailjs: {
                serviceId: "YOUR_SERVICE_ID",
                templateId: "YOUR_TEMPLATE_ID",
                userId: "YOUR_USER_ID"
            }
        }
    },

    // ==================== //
    // ADDITIONAL INFO
    // ==================== //
    info: {
        dressCode: {
            icon: "👗",
            title: "Dress Code",
            description: "Semi-formal attire"
        },
        registry: {
            icon: "🎁",
            title: "Registry",
            description: "Your presence is our present"
        },
        photos: {
            icon: "📸",
            title: "Photos",
            description: "Share your photos with #SarahAndMichael2026"
        },
        parking: {
            icon: "🚗",
            title: "Parking",
            description: "Free parking available on-site"
        }
    },

    // ==================== //
    // CONTACT
    // ==================== //
    contact: {
        email: "wedding@example.com",
        phone: "+1 (555) 123-4567" // Optional
    },

    // ==================== //
    // DESIGN THEME
    // ==================== //
    theme: {
        colors: {
            primary: "#d4a574",      // Main accent color
            secondary: "#8b7355",    // Secondary color
            accent: "#f4e4d7",       // Background tint
            textDark: "#2c2c2c",     // Main text
            textLight: "#666"        // Secondary text
        },
        // Icon/emoji for hero section
        heroIcon: "💍"
    },

    // ==================== //
    // PWA SETTINGS
    // ==================== //
    pwa: {
        name: "Sarah & Michael's Wedding",
        shortName: "Our Wedding",
        description: "Wedding invitation and RSVP for Sarah & Michael's special day",
        themeColor: "#f4e4d7",
        backgroundColor: "#f4e4d7"
    },

    // ==================== //
    // OPTIONAL FEATURES
    // ==================== //
    features: {
        showCountdown: true,
        showInstallPrompt: true,
        enableOfflineMode: true,
        rememberRSVP: true // Save RSVP in localStorage
    }
};

// ==================== //
// EXPORT (if using modules)
// ==================== //
// export default WEDDING_CONFIG;

// ==================== //
// HOW TO USE
// ==================== //
// 1. Copy this file
// 2. Customize all values above
// 3. Update index.html with your values
// 4. Update app.js with your values
// 5. Update manifest.json with PWA settings
// 6. Update styles.css with theme colors
