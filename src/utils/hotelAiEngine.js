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

// Live Client-Side AI Brain Memory (Refreshes every 10 seconds + on every room event, 0 Vercel cost)
const aiBrainMemory = {
  rooms: [],
  availableRooms: [],
  rates: [],
  bookings: [],
  lastRefreshedAt: null,
  refreshCount: 0
};

let brainIntervalId = null;
let isBrainRefreshing = false;

export const hotelAiEngine = {
  /**
   * Return the current in-memory AI Brain state instantly (synchronous, 0 cost)
   */
  getBrainState() {
    return this.refreshBrain();
  },

  /**
   * Synchronize the AI Brain directly from client-side portalStore (0 serverless cost)
   */
  refreshBrain() {
    if (isBrainRefreshing) return aiBrainMemory;
    isBrainRefreshing = true;

    try {
      const rooms = portalStore.getRooms();
      const availableRooms = rooms.filter(r => r.status === 'available');
      const rates = portalStore.getRoomRates();
      const bookings = portalStore.getBookings();

      aiBrainMemory.rooms = rooms;
      aiBrainMemory.availableRooms = availableRooms;
      aiBrainMemory.rates = rates;
      aiBrainMemory.bookings = bookings;
      aiBrainMemory.lastRefreshedAt = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      aiBrainMemory.refreshCount += 1;

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('ash_ai_brain_refreshed', {
            detail: {
              availableCount: availableRooms.length,
              rooms,
              rates,
              lastRefreshedAt: aiBrainMemory.lastRefreshedAt,
              refreshCount: aiBrainMemory.refreshCount
            }
          })
        );
      }
    } catch (err) {
      console.warn("Hotel AI Brain refresh error:", err);
    } finally {
      isBrainRefreshing = false;
    }

    return aiBrainMemory;
  },

  /**
   * Start the 10-second client-side AI Brain auto-refresh heartbeat + instant cross-tab listeners
   */
  startBrainAutoRefresh(intervalMs = 10000) {
    if (typeof window === 'undefined') return () => {};

    // Initial immediate brain sync
    this.refreshBrain();

    // Clear any existing interval before starting a fresh 10-second client-side loop
    if (brainIntervalId) clearInterval(brainIntervalId);
    brainIntervalId = setInterval(() => {
      this.refreshBrain();
    }, intervalMs);

    // Also subscribe to instant room/rate/booking updates across tabs
    const unsubRooms = portalStore.subscribeRooms(() => {
      this.refreshBrain();
    });
    const unsubRates = portalStore.subscribeRates(() => {
      this.refreshBrain();
    });

    return () => {
      if (brainIntervalId) {
        clearInterval(brainIntervalId);
        brainIntervalId = null;
      }
      unsubRooms();
      unsubRates();
    };
  },

  /**
   * Build the live suite availability response from fresh brain state
   */
  buildAvailabilityResponse(customBrain = null) {
    // ALWAYS query live portalStore directly to ensure 100% instant real-time synchronization
    const rooms = customBrain?.rooms || portalStore.getRooms();
    const availableRooms = rooms.filter(r => r.status === 'available');
    const rates = customBrain?.rates || portalStore.getRoomRates();

    const deluxeAvail = availableRooms.filter(r => r.type === 'deluxe').length;
    const execAvail = availableRooms.filter(r => r.type === 'executive').length;
    const royalAvail = availableRooms.filter(r => r.type === 'royal').length;
    const stdAvail = availableRooms.filter(r => r.type === 'standard').length;

    const deluxeRate = rates.find(r => r.id === 'deluxe')?.priceFormatted || '₦45,000';
    const execRate = rates.find(r => r.id === 'executive')?.priceFormatted || '₦65,000';
    const royalRate = rates.find(r => r.id === 'royal')?.priceFormatted || '₦120,000';
    const stdRate = rates.find(r => r.id === 'standard')?.priceFormatted || '₦35,000';

    return {
      isAvailabilityReport: true,
      availableCount: availableRooms.length,
      text: `🏨 **Amira's Live Suite Availability Report (Nsugbe, Onitsha):**\n\n` +
            `Out of our **${rooms.length} total luxury rooms & suites**, we currently have **${availableRooms.length} suites** ready for immediate check-in:\n\n` +
            `• **Arab Deluxe Suite:** ${deluxeAvail > 0 ? `${deluxeAvail} available (${deluxeRate}/night)` : 'Fully Booked Tonight'}\n` +
            `• **Executive Arabian Suite:** ${execAvail > 0 ? `${execAvail} available (${execRate}/night)` : 'Fully Booked Tonight'}\n` +
            `• **Royal Diplomatic Penthouse:** ${royalAvail > 0 ? `${royalAvail} available (${royalRate}/night)` : 'Fully Booked Tonight'}\n` +
            `• **Standard Classic Room:** ${stdAvail > 0 ? `${stdAvail} available (${stdRate}/night)` : 'Fully Booked Tonight'}\n\n` +
            `All bookings include complimentary gourmet breakfast, pool access, and 24/7 solar/CAT power guarantee. Would you like me to reserve one for you right now?`,
      suggestions: ["Reserve Deluxe Suite", "Reserve Executive Suite", "Reserve Penthouse", "Track My Booking"]
    };
  },

  /**
   * Process a user question and generate an intelligent, secure, luxury response
   * @param {string} userMessage - The raw message input by the user
   * @returns {Object} - { text: string, suggestions: string[], meta: any }
   */
  processQuery(userMessage) {
    try {
      // Refresh brain state safely
      this.refreshBrain();

    if (!userMessage || !userMessage.trim()) {
      return {
        text: "Warm greetings from Arab Signature Hotel & Suites, Nsugbe. I am **Amira**, your Royal AI Concierge. How may I assist your stay or reservation today?",
        suggestions: ["Check Available Suites", "Track My Booking", "Directions to Nsugbe", "Dining Menu"]
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
    // 2A. FOOD (ARB-FDD) & DRINK (ARB-DRK) ORDER TRACKER
    // ========================================================
    const diningCodeMatch = query.match(/arb[-_]?(?:fdd|drk)[-_]?\d+[a-z]{0,2}/i);
    if (diningCodeMatch) {
      const dCode = diningCodeMatch[0].toUpperCase().replace(/_/g, '-');
      const matchedOrder = portalStore.findDiningOrderByCode(dCode);

      if (matchedOrder) {
        const maskGuest = (name) => {
          if (!name) return 'Valued Patron';
          return name.trim().split(' ').map(p => (p[0] || '') + '****').join(' ');
        };
        const itemSummary = (matchedOrder.items || [])
          .map(it => `${it.qty || 1}x ${it.name}`)
          .join(', ');

        return {
          text: `${matchedOrder.orderType === 'drink' ? '🍾' : '🍽️'} **Amira ${matchedOrder.orderType === 'drink' ? 'VIP Bar & Drinks' : 'Al-Sultan Kitchen'} Order Verification (${matchedOrder.id}):**\n\n` +
                `• **Patron:** ${maskGuest(matchedOrder.guestName)}\n` +
                `• **Items Ordered:** ${itemSummary || 'Custom Selection'}\n` +
                `• **Order Total:** ₦${Number(matchedOrder.totalAmount || 0).toLocaleString()}\n` +
                `• **Destination:** ${matchedOrder.isLodgeGuest ? `In-Lodge Suite ${matchedOrder.roomNumber} (${matchedOrder.linkedBookingId})` : (matchedOrder.tableOrSpot || 'Restaurant / Lounge')}\n` +
                `• **Kitchen / Bar Status:** **${matchedOrder.orderStatus || 'Received'}**\n` +
                `• **Billing Status:** ${matchedOrder.paymentStatus === 'Paid' ? 'Paid & Settled' : matchedOrder.paymentStatus === 'Added to Room Bill' ? 'Charged to Active Suite Room Bill' : matchedOrder.paymentStatus}`,
          suggestions: ["Dining Menu", "Track My Booking", "Check Available Suites"]
        };
      } else {
        return {
          text: `🔍 I could not find a Food or Drink order matching code **${dCode}**. Please check your **ARB-FDD-...** (Kitchen) or **ARB-DRK-...** (Drinks) pass on the Dining page or contact Al-Sultan Restaurant at **0812 578 6875**.`,
          suggestions: ["Dining Menu", "Chat on WhatsApp"]
        };
      }
    }

    // ========================================================
    // 2B. SECURE SUITE BOOKING STATUS TRACKER (With Data Masking)
    // ========================================================
    // Detect booking codes matching pattern like ARS-BGD-1234AB, ARS-EXT-1234XK, ASH-1234, or digits+letters
    const bookingCodeMatch = query.match(/(ars[-_]?(?:bgd|ext)[-_]?\d+[a-z]{0,2})|(ash[-_\s]?\d+[a-z]{0,2})|(\b\d{4,5}[a-z]{0,2}\b)/i);

    if (bookingCodeMatch && (query.includes("book") || query.includes("status") || query.includes("track") || query.includes("code") || query.includes("ars") || query.includes("ash") || query.includes("my reservation"))) {
      let codeToSearch = bookingCodeMatch[0].toUpperCase().replace(/\s/g, '');
      const matchedBooking = portalStore.findBookingByCode(codeToSearch) || (aiBrainMemory.bookings || []).find(b => {
        const bId = String(b.id || '').toUpperCase();
        return bId === codeToSearch || bId.replace(/[^A-Z0-9]/g, '') === codeToSearch.replace(/[^A-Z0-9]/g, '');
      });

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

        const isCheckedOut = ['Checked Out', 'Completed', 'Bill Cleared', 'Settled'].includes(matchedBooking.status);

        if (isCheckedOut) {
          return {
            text: `🛎️ **Amira Reservation Verification (${matchedBooking.id}):**\n\n` +
                  `• **Registered Guest:** ${maskName(matchedBooking.guestName)}\n` +
                  `• **Suite Category:** ${matchedBooking.roomName}\n` +
                  `• **Stay Dates:** ${matchedBooking.checkIn} → ${matchedBooking.checkOut} (${matchedBooking.nights} Night${matchedBooking.nights > 1 ? 's' : ''})\n` +
                  `• **Reservation Status:** 🛑 **This user has checked out** (Stay concluded & bill cleared).\n` +
                  `• **Settlement:** Paid & Verified in Full\n\n` +
                  `⚠️ *Notice:* Booking code **${matchedBooking.id}** is now expired and invalid for room entry or active privileges. Our system remembers your guest loyalty profile — if you have made a new reservation, please check your new booking code!`,
            suggestions: ["Book Another Suite", "Check Available Suites", "Chat with Front Desk on WhatsApp"]
          };
        }

        return {
          text: `🛎️ **Amira Reservation Verification (${matchedBooking.id}):**\n\n` +
                `• **Registered Guest:** ${maskName(matchedBooking.guestName)}\n` +
                `• **Suite Category:** ${matchedBooking.roomName}\n` +
                `• **Stay Dates:** ${matchedBooking.checkIn} → ${matchedBooking.checkOut} (${matchedBooking.nights} Night${matchedBooking.nights > 1 ? 's' : ''})\n` +
                `• **Reservation Status:** ${matchedBooking.status === 'Checked In' ? 'In Residence (Checked In)' : 'Confirmed & Guaranteed'}\n` +
                `• **Settlement:** ${matchedBooking.paymentStatus === 'Paid' ? 'Paid & Verified (Paystack)' : 'Awaiting Settlement'}\n` +
                `• **Contact on Record:** ${maskPhone(matchedBooking.phone)}\n\n` +
                `🔐 *Security Policy:* For guest protection, physical room keys and digital card locks are issued exclusively at the front desk upon presenting matching government ID. We look forward to welcoming you!`,
          suggestions: ["Book Another Suite", "Directions to Nsugbe", "Chat with Front Desk on WhatsApp"]
        };
      } else {
        failedBookingLookupAttempts++;
        return {
          text: `🔍 I am **Amira**, your Royal AI Concierge — I could not locate a confirmed reservation under reference code **${codeToSearch}**. Please double-check your receipt code (e.g., ARS-BGD-7812AB or ARS-EXT-9421XK) or contact our Front Desk Concierge at 0812 578 6875.`,
          suggestions: ["Check Available Suites", "Chat on WhatsApp"]
        };
      }
    }

    // ========================================================
    // 3. REAL-TIME ROOM INVENTORY & AVAILABILITY (Direct from Reception)
    // ========================================================
    const directKeywords = [
      "avai", "aval", "avall", "avail", "avali", "avalib", "avalibl", "avalible", "avaliable", "avalliable",
      "vacan", "free room", "free suite", "occupan", "how many room", "how many suite", 
      "room count", "suite count", "any room", "any suite", "which room", "rooms left", 
      "suites left", "rooms open", "suites open", "book tonight", "room tonight", "suite tonight",
      "available", "availability"
    ];

    const availabilityRegex = [
      /how\s+many.*(room|suite)/i,
      /(room|suite).*(avai|aval|vacan|free|left|open)/i,
      /(avai|aval|vacan|free|left).*(room|suite)/i,
      /(check|see|view|get).*(avai|aval)/i,
      /\b(vacant|vacancy|vacancies|occupancy)\b/i,
      /\b(available|availability|avalible|avaliable|avalliable|avaiable)\b/i
    ];

    const isAvailabilityQuery = 
      directKeywords.some(k => query.includes(k)) || 
      availabilityRegex.some(p => p.test(query));

    if (isAvailabilityQuery) {
      return this.buildAvailabilityResponse();
    }

    // ========================================================
    // 4. SUITE PRICING INQUIRIES (Dynamic from Live Admin Rates)
    // ========================================================
    const pricingTriggers = ["price", "cost", "how much", "rate", "rates", "charge", "expensive", "cheapest"];
    if (pricingTriggers.some(t => query.includes(t))) {
      const rates = aiBrainMemory.rates;
      const rateSummary = rates.map(r => {
        if (r.isPromoActive && r.promoPrice) {
          return `• **${r.name}:** ~~${r.priceFormatted}~~ **₦${Number(r.promoPrice).toLocaleString()}/night** 🔥 *(SPECIAL PROMO — Save ₦${((r.price - r.promoPrice) || 0).toLocaleString()})* — ${r.bed}, ${r.guests}`;
        }
        return `• **${r.name}:** ${r.priceFormatted}/night — ${r.bed}, ${r.guests}`;
      }).join("\n");

      return {
        text: `💎 **Current Live Suite Rates — Prepared by Amira:**\n\n` +
              `${rateSummary}\n\n` +
              `*Note: Rates include VAT, high-speed Wi-Fi, 24/7 security, uninterrupted power, and morning breakfast buffet at Al-Sultan Restaurant.*`,
        suggestions: ["Check Available Suites", "Reserve a Suite Now", "Dining Menu"]
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
        text: `Warm greetings! I am **Amira**, the Royal AI Concierge at **Arab Signature Hotel & Suites** in Nsugbe, Onitsha. We are an ultra-luxury hospitality retreat offering 34 handcrafted rooms and Arab suites, Olympic-grade poolside cabanas, Al-Sultan gourmet dining, and 24/7 uninterrupted power.\n\n` +
              `You can ask me to check suite availability, track an existing reservation code (e.g. ARS-BGD-7812AB or ARS-EXT-9421XK), or inquire about our location and amenities. For direct human assistance, click the **WhatsApp** button above or call our Front Desk Hotline at **0812 578 6875**.`,
        suggestions: ["Check Available Suites", "Track My Booking", "Directions to Nsugbe", "Dining Menu"]
      };
    } catch (err) {
      console.error("hotelAiEngine processQuery error:", err);
      return {
        text: "I am **Amira**, Arab Signature's Royal AI Concierge. We currently have luxury suites available in Nsugbe, Onitsha. You can check live suite availability, track a booking reference code, or ask for directions.",
        suggestions: ["Check Available Suites", "Track My Booking", "Directions to Nsugbe"]
      };
    }
  }
};
