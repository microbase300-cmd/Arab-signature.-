/**
 * ARAB SIGNATURE HOTEL & SUITES — AI TRAINING DATA & KNOWLEDGE BASE
 * 
 * DEVELOPER INSTRUCTIONS:
 * To train the AI on new information, simply add an entry to the `CUSTOM_TRAINING_DATA` array below.
 * Each entry accepts:
 * - id: unique string identifier
 * - category: topic area (e.g., 'dining', 'suites', 'location', 'policies', 'events')
 * - keywords: list of words or phrases that trigger this knowledge
 * - answer: the exact, polished, luxury response the AI should give
 */

export const HOTEL_CORE_PROFILE = {
  name: "Arab Signature Hotel & Suites",
  tagline: "The Only Verified Signature in Nsugbe",
  location: "Nsugbe, Onitsha, Anambra State, Nigeria",
  phone: "0812 578 6875",
  whatsapp: "2348125786875",
  whatsappLink: "https://wa.me/2348125786875",
  checkInTime: "2:00 PM",
  checkOutTime: "12:00 PM",
  powerSupply: "24/7 Uninterrupted Electricity with silent heavy-duty industrial backup & solar microgrid",
  security: "24/7 Armed diplomatic security, continuous CCTV coverage, and secure gated perimeter in Nsugbe",
  totalRooms: 12
};

export const CUSTOM_TRAINING_DATA = [
  // 1. LOCATION & DIRECTIONS
  {
    id: "location-directions",
    category: "location",
    keywords: ["where", "location", "address", "find you", "how to get", "nsugbe", "onitsha", "directions", "landmark", "road"],
    answer: "Arab Signature Hotel & Suites is situated in the serene, upscale residential district of Nsugbe, Onitsha, Anambra State, Nigeria. We are conveniently accessible from the 3-3 Junction and Nkwelle Ezunaka axis, offering guests a peaceful, diplomatic retreat away from urban congestion while remaining only minutes from the commercial heartbeat of Onitsha."
  },
  {
    id: "airport-transport",
    category: "location",
    keywords: ["airport", "pickup", "shuttle", "transport", "cab", "uber", "driver"],
    answer: "We offer private executive airport transfers from Asaba International Airport (approx. 35–45 minutes drive) and Chinua Achebe International Airport, Umueri. Kindly notify our front desk at 0812 578 6875 or via WhatsApp at least 24 hours prior to arrival to schedule your VIP chauffeur."
  },

  // 2. CHECK-IN, CHECK-OUT & POLICIES
  {
    id: "checkin-checkout-times",
    category: "policies",
    keywords: ["check in", "check out", "check-in", "check-out", "time", "early check in", "late check out"],
    answer: "Our standard check-in commences at 2:00 PM, and check-out is at 12:00 PM (noon). Early check-in and late check-out can be arranged with the front desk concierge based on room availability."
  },
  {
    id: "payment-methods",
    category: "policies",
    keywords: ["payment", "pay", "paystack", "card", "transfer", "cash", "pos", "mastercard", "visa"],
    answer: "We accept secure instant online payments via Paystack (Debit Cards, Bank Transfer, USSD), as well as on-site POS card terminals and direct bank transfers at our front desk reception in Nsugbe."
  },
  {
    id: "cancellation-refund",
    category: "policies",
    keywords: ["cancel", "cancellation", "refund", "reschedule", "change date"],
    answer: "Reservations can be rescheduled or cancelled with full credit up to 48 hours prior to scheduled check-in. Cancellations made within 24 hours of arrival are subject to a 50% retention charge."
  },

  // 3. AMENITIES & FACILITIES
  {
    id: "power-electricity",
    category: "amenities",
    keywords: ["light", "power", "electricity", "generator", "24/7", "solar", "nepa"],
    answer: "Arab Signature Hotel guarantees 100% 24/7 uninterrupted electric power. Our facility runs on dual industrial CAT soundproof generators coupled with a modern solar hybrid microgrid, ensuring zero power fluctuations for our esteemed guests."
  },
  {
    id: "security-safety",
    category: "amenities",
    keywords: ["security", "safe", "safety", "guard", "police", "secure"],
    answer: "Guest security and privacy are paramount. The premises feature round-the-clock trained security personnel, armed diplomatic patrol escorts, 24/7 high-definition CCTV surveillance across perimeter zones, and biometric access controls."
  },
  {
    id: "swimming-pool",
    category: "amenities",
    keywords: ["pool", "swimming", "cabana", "swim", "water"],
    answer: "Our crystal-clear Olympic-standard swimming pool is reserved exclusively for checked-in suite guests and VIP cabana reservation holders. Poolside drink service and private draped cabanas are available daily from 7:00 AM to 10:00 PM."
  },
  {
    id: "wifi-internet",
    category: "amenities",
    keywords: ["wifi", "internet", "network", "speed", "data", "browse"],
    answer: "Complimentary ultra-high-speed fiber optic Wi-Fi is provided throughout all suites, penthouses, the restaurant, and poolside lounge areas. Login credentials are provided upon check-in."
  },

  // 4. DINING & AL-SULTAN RESTAURANT
  {
    id: "restaurant-dining",
    category: "dining",
    keywords: ["food", "eat", "restaurant", "menu", "dining", "dinner", "lunch", "breakfast", "al sultan", "drink", "bar"],
    answer: "Our flagship Al-Sultan Restaurant serves gourmet continental delicacies, Middle Eastern specialties (shawarma, grilled lamb kofta, saffron rice), and authentic Nigerian luxury dishes (Ofe Owerri, Nkwobi, Fisherman soup, pepper soup). Complimentary morning buffet breakfast is included with all suite bookings."
  },
  {
    id: "room-service",
    category: "dining",
    keywords: ["room service", "in room dining", "order food", "eat in room"],
    answer: "24-hour in-suite dining and private butler room service is available for all guests. Simply dial front desk speed-dial from your suite telephone."
  },

  // 5. SUITE CATEGORIES & LIVING
  {
    id: "suite-types",
    category: "suites",
    keywords: ["suite", "room", "rooms", "types", "category", "penthouse", "deluxe", "executive", "standard"],
    answer: "We offer 4 distinct luxury categories: 1) Deluxe Doha Suite (₦45,000/night), 2) Executive Arabian Suite with private majlis lounge (₦65,000/night), 3) Royal Diplomatic Penthouse with dual master suites (₦120,000/night), and 4) Standard Classic Suite (₦35,000/night). All suites feature marble bathrooms, plush king beds, and soundproof acoustics."
  },

  // 6. SPECIAL EVENTS & MEETINGS
  {
    id: "events-celebrations",
    category: "events",
    keywords: ["event", "hall", "meeting", "birthday", "party", "wedding", "conference", "boardroom"],
    answer: "We accommodate intimate executive board meetings, VIP private dinners, bridal showers, and exclusive poolside gatherings. Please speak directly with our General Manager or WhatsApp 0812 578 6875 for bespoke corporate and private booking packages."
  }
];
