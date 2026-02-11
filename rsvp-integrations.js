// ==================== //
// RSVP BACKEND INTEGRATIONS
// ==================== //
// Choose one of these methods and replace the sendRSVP() function in app.js

// ==================== //
// METHOD 1: FORMSPREE (Recommended - Easy & Free)
// ==================== //
// 1. Sign up at https://formspree.io
// 2. Create a new form
// 3. Get your form endpoint
// 4. Replace YOUR_FORM_ID below

async function sendRSVP_Formspree(data) {
    try {
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                phone: data.phone,
                attending: data.attending ? 'Yes' : 'No',
                guestCount: data.guestCount,
                specialRequests: data.specialRequests,
                timestamp: data.timestamp
            })
        });

        if (response.ok) {
            console.log('RSVP sent successfully via Formspree');
            return true;
        } else {
            console.error('Formspree error:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error sending RSVP:', error);
        return false;
    }
}

// ==================== //
// METHOD 2: EMAILJS (Free tier available)
// ==================== //
// 1. Sign up at https://www.emailjs.com/
// 2. Create email service
// 3. Create email template
// 4. Get your IDs
// 5. Add EmailJS SDK to index.html:
//    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
// 6. Initialize in app.js: emailjs.init('YOUR_USER_ID');

async function sendRSVP_EmailJS(data) {
    try {
        const response = await emailjs.send(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            {
                to_name: 'Wedding Couple',
                from_name: data.name,
                guest_email: data.email,
                guest_phone: data.phone,
                attending: data.attending ? 'Yes ✓' : 'No ✗',
                guest_count: data.guestCount,
                special_requests: data.specialRequests || 'None',
                timestamp: new Date(data.timestamp).toLocaleString()
            }
        );

        console.log('RSVP sent successfully via EmailJS:', response);
        return true;
    } catch (error) {
        console.error('EmailJS error:', error);
        return false;
    }
}

// ==================== //
// METHOD 3: GOOGLE SHEETS via Google Apps Script
// ==================== //
// 1. Create a Google Sheet
// 2. Tools → Script Editor
// 3. Paste this code:
/*
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.phone,
    data.attending,
    data.guestCount,
    data.specialRequests
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
*/
// 4. Deploy as Web App
// 5. Get the deployment URL

async function sendRSVP_GoogleSheets(data) {
    try {
        const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        console.log('RSVP sent to Google Sheets');
        return true;
    } catch (error) {
        console.error('Google Sheets error:', error);
        return false;
    }
}

// ==================== //
// METHOD 4: AIRTABLE (Free tier available)
// ==================== //
// 1. Create Airtable account at https://airtable.com
// 2. Create a base with fields: Name, Email, Phone, Attending, GuestCount, SpecialRequests, Timestamp
// 3. Get your API key from account settings
// 4. Get your base ID and table name

async function sendRSVP_Airtable(data) {
    const AIRTABLE_API_KEY = 'YOUR_API_KEY';
    const BASE_ID = 'YOUR_BASE_ID';
    const TABLE_NAME = 'RSVPs';

    try {
        const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fields: {
                    'Name': data.name,
                    'Email': data.email,
                    'Phone': data.phone,
                    'Attending': data.attending,
                    'Guest Count': data.guestCount,
                    'Special Requests': data.specialRequests,
                    'Timestamp': data.timestamp
                }
            })
        });

        if (response.ok) {
            console.log('RSVP sent to Airtable');
            return true;
        } else {
            console.error('Airtable error:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error sending to Airtable:', error);
        return false;
    }
}

// ==================== //
// METHOD 5: NETLIFY FORMS (If hosted on Netlify)
// ==================== //
// 1. Add this to your HTML form:
//    <form name="rsvp" method="POST" data-netlify="true">
// 2. Netlify automatically handles form submissions
// 3. View submissions in Netlify dashboard

// For JavaScript submission:
async function sendRSVP_NetlifyForms(data) {
    try {
        const formData = new FormData();
        formData.append('form-name', 'rsvp');
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('attending', data.attending);
        formData.append('guestCount', data.guestCount);
        formData.append('specialRequests', data.specialRequests);

        const response = await fetch('/', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('RSVP sent via Netlify Forms');
            return true;
        } else {
            console.error('Netlify Forms error:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error sending RSVP:', error);
        return false;
    }
}

// ==================== //
// METHOD 6: WEBHOOK (Generic)
// ==================== //
// Use any webhook service like:
// - Zapier (https://zapier.com)
// - Make (https://www.make.com)
// - n8n (https://n8n.io)

async function sendRSVP_Webhook(data) {
    try {
        const response = await fetch('YOUR_WEBHOOK_URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('RSVP sent via webhook');
            return true;
        } else {
            console.error('Webhook error:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error sending to webhook:', error);
        return false;
    }
}

// ==================== //
// METHOD 7: FIREBASE FIRESTORE
// ==================== //
// 1. Create Firebase project
// 2. Enable Firestore
// 3. Add Firebase SDK to index.html
// 4. Initialize Firebase

async function sendRSVP_Firebase(data) {
    // Assuming Firebase is initialized
    try {
        const db = firebase.firestore();
        await db.collection('rsvps').add({
            name: data.name,
            email: data.email,
            phone: data.phone,
            attending: data.attending,
            guestCount: data.guestCount,
            specialRequests: data.specialRequests,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('RSVP saved to Firebase');
        return true;
    } catch (error) {
        console.error('Firebase error:', error);
        return false;
    }
}

// ==================== //
// METHOD 8: SUPABASE (Open source Firebase alternative)
// ==================== //
// 1. Create Supabase project at https://supabase.com
// 2. Create 'rsvps' table
// 3. Get your API URL and anon key
// 4. Add Supabase client to index.html

async function sendRSVP_Supabase(data) {
    const SUPABASE_URL = 'YOUR_SUPABASE_URL';
    const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rsvps`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('RSVP saved to Supabase');
            return true;
        } else {
            console.error('Supabase error:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error sending to Supabase:', error);
        return false;
    }
}

// ==================== //
// HOW TO USE
// ==================== //
// 1. Choose one method above
// 2. Set up the service (sign up, get API keys, etc.)
// 3. Copy the function you want to use
// 4. Replace the sendRSVP() function in app.js
// 5. Update the handleRSVP() function to use async/await:

/*
async function handleRSVP(attending) {
    const name = document.getElementById('guestName').value.trim();
    // ... validation code ...

    const rsvpData = {
        // ... data preparation ...
    };

    // Save locally
    saveRSVPLocally(rsvpData);

    // Send to backend
    const success = await sendRSVP(rsvpData);

    if (success) {
        showSuccessMessage(attending, name);
    } else {
        alert('There was an error sending your RSVP. Please try again or contact us directly.');
    }
}
*/

// ==================== //
// COMPARISON
// ==================== //
/*
METHOD          | EASE | COST    | FEATURES
----------------|------|---------|------------------
Formspree       | ⭐⭐⭐⭐⭐ | Free    | Email notifications
EmailJS         | ⭐⭐⭐⭐  | Free    | Custom templates
Google Sheets   | ⭐⭐⭐   | Free    | Spreadsheet format
Airtable        | ⭐⭐⭐⭐  | Free    | Database features
Netlify Forms   | ⭐⭐⭐⭐⭐ | Free    | Built-in (Netlify only)
Webhook         | ⭐⭐⭐   | Varies  | Very flexible
Firebase        | ⭐⭐⭐   | Free    | Real-time database
Supabase        | ⭐⭐⭐   | Free    | PostgreSQL database

RECOMMENDATION: Start with Formspree for simplicity!
*/
