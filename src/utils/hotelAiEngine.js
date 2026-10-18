/**
 * ARAB SIGNATURE HOTEL & SUITES — LIGHTWEIGHT AI CONCIERGE ENGINE
 * 
 * Runs 100% client-side with 0 serverless costs and 0 Vercel limits.
 * Integrates directly with:
 * - Real-time receptionist inventory (portalStore.getRooms())
 * - Live suite pricing (portalStore.getRoomRates())
 * - Developer-trained knowledge base (aiKnowledgeBase.js)
 * - Bank-grade privacy & security masking for booking inquiries
 */

import { CUSTOM_TRAINING_DATA, HOTEL_CORE_PROFILE } from '../data/aiKnowledgeBase';
import { portalStore } from '../data/portalStore';

// Session security tracker to prevent brute-force booking number scanning
let failedBookingLookupAttempts = 0;
const MAX_FAILED_ATTEMPTS = 4;

export const hotelAiEngine = {
  /**
   * Process a user question and generate an intelligent, secure, luxury response
   * @param {string} userMessage - The raw message input by the user
   * @returns {Object} - { text: string, suggestions: string[], meta: any }
   */
  processQuery(userMessage) {
    if (!userMessage || !userMessage.trim()) {
      return {
        text: "Warm greetings from Arab Signature Hotel & Suites, Nsugbe. How may I assist your stay or reservation today?",
        suggestions: ["Check Available Suites", "Track My Booking", "Directions to Nsugbe", "Al-Sultan Dining Menu"]
      };
    }

    const query = userMessage.trim().toLowerCase();

    // ========================================================
    // 1. SECURITY & CONFIDENTIALITY GUARD (Anti-Theft / Anti-Leak)
    // ========================================================
    const privacyTriggers = [
      "who is staying", "guest list", "all guests", "resident list", 
      "who checked in", "give me password", "admin password", "reception password",
      "hacked", "bypass", "owner name", "manager phone", "personal number"
    ];

    if (privacyTriggers.some(t => query.includes(t))) {
      return {
        text: "🛡️ Strict Hospitality Security Notice: Arab Signature Hotel upholds absolute diplomatic confidentiality for all resident guests and administrative systems. Resident registries and internal credentials are never disclosed. For authorized inquiries, please consult the Front Desk Concierge in person with valid government identification.",
        suggestions: ["Check Available Suites", "Track My Booking Ref", "Contact Concierge Desk"]
      };
    }

    // ========================================================
    // 2. SECURE BOOKING STATUS TRACKER (With Data Masking)
    // ========================================================
    // Detect booking codes matching pattern like ASH-1234 or isolated 4-digit codes
    const bookingCodeMatch = query.match(/ash[-_\s]?\d{4}/i) || query.match(/\b\d{4}\b/);

    if (bookingCodeMatch && (query.includes("book") || query.includes("status") || query.includes("track") || query.includes("code") || query.includes("ash") || query.includes("my reservation"))) {
      let codeToSearch = bookingCodeMatch[0].toUpperCase().replace(/\s/g, '');
      if (!codeToSearch.startsWith("ASH-")) {
        codeToSearch = "ASH-" + codeToSearch.replace(/\D/g, '');
      }

      // Check brute-force threshold
      if (failedBookingLookupAttempts >= MAX_FAILED_ATTEMPTS) {
        return {
          text: "🔒 Security Alert: For your protection, multiple booking status inquiries have been temporarily limited. To verify your reservation securely, please contact our Front Desk directly at 0812 578 6875 or send your confirmation via WhatsApp.",
          suggestions: ["Chat with Front Desk on WhatsApp", "Check Available Suites"]
        };
      }

      const allBookings = portalStore.getBookings();
      const matchedBooking = allBookings.find(b => b.id.toUpperCase() === codeToSearch);

      if (matchedBooking) {
        // Reset failed counter upon successful match
        failedBookingLookupAttempts = 0;

        // Privacy Masking Helpers (Prevents identity theft & leaks)
        const maskName = (name) => {
          if (!name) return "Valued Guest";
          const parts = name.trim().split(" ");
          return parts.map(p => p[0] + "****").join(" ");
        };

        const maskPhone = (phone) => {
          if (!phone) return "****";
          const clean = phone.replace(/\s+/g, '');
          if (clean.length < 7) return "****";
          return clean.slice(0, 4) + " •••• " + clean.slice(-3);
        };

        return {
          text: `🛎️ Reservation Verified: **${matchedBooking.id}**\n\n` +
                `• **Registered Guest:** ${maskName(matchedBooking.guestName)}\n` +
                `• **Suite Category:** ${matchedBooking.roomName}\n` +
                `• **Stay Dates:** ${matchedBooking.checkIn} → ${matchedBooking.checkOut} (${matchedBooking.nights} Night${matchedBooking.nights > 1 ? 's' : ''})\n` +
                `• **Reservation Status:** ${matchedBooking.status === 'Checked In' ? 'In Residence (Checked In)' : 'Confirmed & Guaranteed'}\n` +
                `• **Settlement:** ${matchedBooking.paymentStatus === 'Paid' ? 'Paid & Verified (Paystack)' : 'Awaiting Settlement'}\n` +
                `• **Contact on Record:** ${maskPhone(matchedBooking.phone)}\n\n` +
                `🔐 *Security Policy:* For guest protection, physical room keys and digital card locks are issued exclusively at the front desk upon presenting matching government ID. We look forward to your arrival!`,
          suggestions: ["Book Another Suite", "Directions to Nsugbe", "Chat with Front Desk on WhatsApp"]
        };
      } else {
        failedBookingLookupAttempts++;
        return {
          text: `🔍 I could not locate a confirmed reservation under reference code **${codeToSearch}**. Please double-check your receipt code (e.g., ASH-7812) or contact our Front Desk Concierge at 0812 578 6875.`,
          suggestions: ["Check Available Suites", "Chat on WhatsApp"]
        };
      }
    }

    // ========================================================
    // 3. REAL-TIME ROOM INVENTORY & AVAILABILITY (Direct from Reception)
    // ========================================================
    const directKeywords = [
      "avail", "avaliab", "avaiab", "vacan", "free room", "free suite", 
      "occupan", "how many room", "how many suite", "room count", "suite count",
      "any room", "any suite", "which room", "rooms left", "suites left",
      "rooms open", "suites open", "book tonight", "room tonight", "suite tonight",
      "available", "availability"
    ];

    const availabilityRegex = [
      /how\s+many.*(room|suite)/i,
      /(room|suite).*(avail|vacan|free|left|open)/i,
      /(avail|vacan|free|left).*(room|suite)/i,
      /(check|see|view|get).*(avail)/i,
      /\b(vacant|vacancy|vacancies|occupancy)\b/i,
      /\b(available|availability)\b/i
    ];

    const isAvailabilityQuery = 
      directKeywords.some(k => query.includes(k)) || 
      availabilityRegex.some(p => p.test(query));

    if (isAvailabilityQuery) {
      // Read 100% fresh real-time rooms directly from portalStore
      const rooms = portalStore.getRooms();
      const availableRooms = rooms.filter(r => r.status === 'available');
      const rates = portalStore.getRoomRates();

      // Count by category
      const deluxeAvail = availableRooms.filter(r => r.type === 'deluxe').length;
      const execAvail = availableRooms.filter(r => r.type === 'executive').length;
      const royalAvail = availableRooms.filter(r => r.type === 'royal').length;
      const stdAvail = availableRooms.filter(r => r.type === 'standard').length;

      const deluxeRate = rates.find(r => r.id === 'deluxe')?.priceFormatted || '₦45,000';
      const execRate = rates.find(r => r.id === 'executive')?.priceFormatted || '₦65,000';
      const royalRate = rates.find(r => r.id === 'royal')?.priceFormatted || '₦120,000';
      const stdRate = rates.find(r => r.id === 'standard')?.priceFormatted || '₦35,000';

      return {
        text: `🏨 **Live Suite Availability (Nsugbe, Onitsha):**\n\n` +
              `We currently have **${availableRooms.length} luxury suites** ready for immediate check-in:\n\n` +
              `• **Deluxe Doha Suite:** ${deluxeAvail > 0 ? `${deluxeAvail} available (${deluxeRate}/night)` : 'Fully Booked Tonight'}\n` +
              `• **Executive Arabian Suite:** ${execAvail > 0 ? `${execAvail} available with private Majlis lounge (${execRate}/night)` : 'Fully Booked Tonight'}\n` +
              `• **Royal Diplomatic Penthouse:** ${royalAvail > 0 ? `${royalAvail} available on top floor (${royalRate}/night)` : 'Fully Booked Tonight'}\n` +
              `• **Standard Classic Suite:** ${stdAvail > 0 ? `${stdAvail} available (${stdRate}/night)` : 'Fully Booked Tonight'}\n\n` +
              `All bookings include complimentary gourmet breakfast, Olympic pool access, and 24/7 solar/CAT power guarantee. Would you like to reserve one right now?`,
        suggestions: ["Reserve Deluxe Suite", "Reserve Executive Suite", "Reserve Penthouse", "Track My Booking"]
      };
    }

    // ========================================================
    // 4. SUITE PRICING INQUIRIES (Dynamic from Live Admin Rates)
    // ========================================================
    const pricingTriggers = ["price", "cost", "how much", "rate", "rates", "charge", "expensive", "cheapest"];
    if (pricingTriggers.some(t => query.includes(t))) {
      const rates = portalStore.getRoomRates();
      const rateSummary = rates.map(r => `• **${r.name}:** ${r.priceFormatted}/night — ${r.bed}, ${r.guests}`).join("\n");

      return {
        text: `💎 **Current Live Suite Rates (Arab Signature Hotel & Suites):**\n\n` +
              `${rateSummary}\n\n` +
              `*Note: Rates include VAT, high-speed Wi-Fi, 24/7 security, uninterrupted power, and morning breakfast buffet at Al-Sultan Restaurant.*`,
        suggestions: ["Check Available Suites", "Reserve a Suite Now", "Al-Sultan Dining Menu"]
      };
    }

    // ========================================================
    // 5. DEVELOPER-TRAINED KNOWLEDGE BASE SCANNER
    // ========================================================
    // Score each custom training entry based on keyword hits
    let bestMatch = null;
    let highestScore = 0;

    for (const item of CUSTOM_TRAINING_DATA) {
      let score = 0;
      for (const keyword of item.keywords) {
        if (query.includes(keyword.toLowerCase())) {
          score += keyword.length; // Weigh longer phrase matches higher
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    // If strong match found in knowledge base
    if (bestMatch && highestScore >= 3) {
      let suggestions = ["Check Available Suites", "Track My Booking"];
      if (bestMatch.category === 'location') {
        suggestions = ["Check Available Suites", "Chat on WhatsApp for Directions"];
      } else if (bestMatch.category === 'dining') {
        suggestions = ["Reserve a Suite", "Check Available Suites"];
      } else if (bestMatch.category === 'suites') {
        suggestions = ["Check Available Suites", "View Suite Rates"];
      }

      return {
        text: bestMatch.answer,
        suggestions: suggestions
      };
    }

    // ========================================================
    // 6. GENERAL LUXURY CONCIERGE FALLBACK
    // ========================================================
    return {
      text: `Thank you for contacting Arab Signature Hotel & Suites in Nsugbe, Onitsha. We are an ultra-luxury hospitality retreat offering 12 handcrafted Doha suites, Olympic-grade poolside cabanas, Al-Sultan gourmet dining, and 24/7 uninterrupted power.\n\n` +
            `You can check suite availability, track an existing reservation code (e.g. ASH-7812), or ask me about our location and amenities. For urgent VIP assistance, our Front Desk Hotline is **0812 578 6875**.`,
      suggestions: ["Check Available Suites", "Track My Booking", "Directions to Nsugbe", "Al-Sultan Dining Menu"]
    };
  }
};
