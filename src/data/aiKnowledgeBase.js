/**
 * ARAB SIGNATURE HOTEL & SUITES — AI TRAINING DATA & KNOWLEDGE BASE
 * 
 * Comprehensive Memory & Knowledge Base for Amira — Royal AI Concierge.
 * Covers all 34 luxury suites, Main Building vs. Extension Building, 
 * the 120k Diplomatic Apartment with Parlour, Interactive Pool 360° View,
 * Al-Sultan Restaurant & VIP Bar Lounge Catalog, Step-by-Step Online Booking,
 * Paystack Stay Duration Calculation, Customer Guest Portal, and Location.
 */

export const HOTEL_CORE_PROFILE = {
  name: "Arab Signature Hotel & Suites",
  subName: "Hotel and Suites",
  aiName: "Amira",
  aiTitle: "Amira — Royal AI Concierge",
  tagline: "The Only Verified Signature in Nsugbe",
  address: "College Area, By Somadina Ifinta Street, No. 6 Road, Nsugbe, Onitsha, Anambra State, Nigeria",
  locationShort: "Nsugbe, Onitsha, Anambra State, Nigeria",
  phone: "0812 578 6875",
  whatsapp: "2348125786875",
  whatsappLink: "https://wa.me/2348125786875",
  websiteUrl: "https://www.arabsignature.com",
  checkInTime: "2:00 PM",
  checkOutTime: "12:00 PM (Noon)",
  totalRooms: 34,
  buildingsCount: 2,
  mainBuildingRooms: 20,
  extensionBuildingRooms: 14,
  powerSupply: "24/7 Uninterrupted Electricity with dual heavy-duty CAT soundproof industrial generators & solar hybrid microgrid",
  security: "24/7 Armed diplomatic security, continuous perimeter & interior HD CCTV surveillance, gated biometric controls",
  wifi: "Complimentary ultra-fast fiber optic Wi-Fi across all suites, lounges, restaurant, and poolside"
};

export const CUSTOM_TRAINING_DATA = [
  // ==========================================================================
  // 0. AI IDENTITY & GREETINGS (AMIRA)
  // ==========================================================================
  {
    id: "ai-identity-amira",
    category: "identity",
    keywords: ["your name", "who are you", "amira", "what are you", "introduce yourself", "hello", "hi", "good morning", "good afternoon", "good evening", "hey"],
    answer: "Warm royal greetings! 👑 I am **Amira**, the Royal AI Concierge of **Arab Signature Hotel & Suites** in Nsugbe, Onitsha.\n\nI am here 24/7 to guide you with:\n1. **Live Suite Availability & Booking** across all 34 rooms in our Main & Extension Wings.\n2. **The ₦120,000 Diplomatic Apartment with Parlour** details & photos.\n3. **Pool 360° Panoramic View** & VIP Cabana access.\n4. **Al-Sultan Restaurant Menu & VIP Bar Catalog** with step-by-step ordering.\n5. **Guest Portal Access (#guest-portal)** to view your digital room pass or charge meals to your room bill.\n6. **Step-by-step driving directions to Nsugbe** from anywhere in Anambra.\n\nHow may I gracefully assist your stay today?"
  },

  // ==========================================================================
  // 1. STEP-BY-STEP HOW TO BOOK A ROOM & PAYSTACK CHECKOUT
  // ==========================================================================
  {
    id: "how-to-book-step-by-step",
    category: "booking",
    keywords: ["how to book", "how do i book", "how to make reservation", "booking steps", "how to pay", "paystack booking", "book online", "reserve room", "steps to book", "duration", "how many days"],
    answer: "Here is your **step-by-step guide to booking your suite online at Arab Signature Hotel**:\n\n" +
            "1. **Choose Your Suite**: Browse our Suites page (`#suites`) or click any **'Book a Suite'** button.\n" +
            "2. **Select Stay Duration**: Pick your **Check-in** and **Check-out** dates. You can select 1, 2, 3, 4, 5+ nights. Our system automatically calculates the exact total price matching your chosen nights.\n" +
            "3. **Enter Guest Details**: Provide your Full Name, Active Phone / WhatsApp Number, and Email Address.\n" +
            "4. **Complete Secure Paystack Payment**: Click **'Pay with Paystack'** to pay securely using your Debit Card, Direct Bank Transfer, or USSD.\n" +
            "5. **Instant Confirmation Code**: As soon as payment succeeds, you will receive an official Booking Code (e.g., `ARS-BGD-7812AB` for Main Building or `ARS-EXT-9421XK` for Extension Wing) along with an immediate email receipt.\n" +
            "6. **Swift Front Desk Check-In**: On arrival at our gate in Nsugbe, show your booking code to the Receptionist for immediate room key handover!\n\n" +
            "Would you like me to open the booking window for you right now?"
  },

  // ==========================================================================
  // 2. SUITE CATEGORIES, PRICING & WINGS (34 ROOMS TOTAL)
  // ==========================================================================
  {
    id: "suite-categories-all",
    category: "suites",
    keywords: ["room types", "suite types", "categories", "how many rooms", "room rates", "prices", "price list", "how much", "cost of rooms", "rooms", "suites", "all rooms"],
    answer: "Arab Signature Hotel & Suites features **34 handcrafted luxury rooms across two distinct hotel complexes** in Nsugbe, Onitsha:\n\n" +
            "🏛️ **MAIN BUILDING (600 Wing • 20 Rooms Total):**\n" +
            "• **Super Executive Room — ₦60,000 / night**: Rooms 605, 612, 615 (65 sqm, King Bed, rain shower, workstation)\n" +
            "• **Executive Room — ₦50,000 / night**: Rooms 601, 609, 619 (50 sqm, King Bed, plush velvet seating)\n" +
            "• **Superior Room — ₦40,000 / night**: Rooms 603, 607, 611, 613, 617 (40 sqm, Queen/King Bed, modern ensuite)\n" +
            "• **Deluxe Room — ₦35,000 / night**: Rooms 602, 604, 606, 608, 610, 620 (35 sqm, Queen Bed, smart TV)\n" +
            "• **Standard Room — ₦30,000 / night**: Rooms 614, 616, 618 (28 sqm, Queen Bed, cozy executive comfort)\n\n" +
            "👑 **EXTENSION BUILDING (100 Wing • 14 Luxury Residences):**\n" +
            "• **Diplomatic Apartment with Parlour — ₦120,000 / night**: Rooms 107 & 114 (125 sqm, Private Executive Parlour Living Room + Master King Bedroom)\n" +
            "• **Super Executive Room — ₦60,000 / night**: Rooms 102, 109\n" +
            "• **Executive Room — ₦50,000 / night**: Rooms 103, 104, 110, 111\n" +
            "• **Superior Room — ₦40,000 / night**: Rooms 101, 105, 106, 108, 112, 113\n\n" +
            "✨ *All rooms include complimentary morning breakfast buffet, swimming pool access, fiber Wi-Fi, and 24/7 solar/generator power guarantee.*"
  },

  // ==========================================================================
  // 3. THE ₦120,000 DIPLOMATIC APARTMENT WITH PARLOUR (FLAGSHIP SUITE)
  // ==========================================================================
  {
    id: "diplomatic-apartment-120k",
    category: "suites",
    keywords: ["120k", "120,000", "120000", "diplomatic", "apartment", "parlour", "parlor", "presidential", "suite with parlour", "living room", "room 107", "room 114"],
    answer: "👑 **The ₦120,000 Diplomatic Apartment with Parlour** is the crown jewel of Arab Signature Hotel & Suites, located exclusively in the **Extension Building (Suites 107 & 114)**:\n\n" +
            "• **Layout & Design**: An expansive 125 sqm luxury executive apartment featuring a **spacious private parlour living room** with plush velvet sofas, gold coffee tables, guest seating, and dual smart 4K entertainment screens, opening into an en-suite **master king bedroom**.\n" +
            "• **Royal Ambiance**: Arabian architectural arches, ambient royal blue & gold tray ceiling lighting, private minibar, and luxury Italian marble bathroom with dual rain shower heads.\n" +
            "• **Capacity**: Accommodates 2 adults and up to 2 children comfortably.\n" +
            "• **VIP Privileges**: Dedicated 24/7 private butler assistance, express in-apartment check-in, complimentary morning buffet, and reserved poolside daybed cabana table.\n\n" +
            "You can click the **'Photos & Details'** button on the Diplomatic Apartment card to view all 8 authentic 4K interior photographs of the parlour and bedroom!"
  },

  // ==========================================================================
  // 4. MAIN BUILDING VS. EXTENSION BUILDING
  // ==========================================================================
  {
    id: "main-vs-extension-buildings",
    category: "suites",
    keywords: ["main building", "extension building", "difference between buildings", "wings", "600 wing", "100 wing", "annex"],
    answer: "Arab Signature Hotel operates across two private, interconnected wings in Nsugbe:\n\n" +
            "1. **Main Building (600 Wing)**: Houses 20 luxury rooms (Rooms 601 to 620) offering Super Executive (₦60k), Executive (₦50k), Superior (₦40k), Deluxe (₦35k), and Standard (₦30k). Located right by the central reception and Al-Sultan Royal Dining Hall.\n\n" +
            "2. **Extension Building (100 Wing)**: Houses 14 private luxury residences (Rooms 101 to 114), including the exclusive ₦120,000 Diplomatic Apartments with Parlour (Suites 107 & 114), Super Executive (₦60k), Executive (₦50k), and Superior (₦40k). This wing offers maximum privacy, discreet VIP parking, and direct terrace access.\n\n" +
            "Guests in both wings enjoy 100% access to all hotel amenities including the swimming pool, restaurant, bar, and 24/7 security."
  },

  // ==========================================================================
  // 5. PHOTOS & DETAILS MODAL (VIEWING ROOM PHOTOS)
  // ==========================================================================
  {
    id: "photos-details-modal",
    category: "suites",
    keywords: ["see picture", "see photos", "view room pictures", "photo of room", "gallery of room", "how to see rooms", "photos and details"],
    answer: "Every room category on our website features a dedicated **'Photos & Details'** button! When clicked, an interactive high-definition gallery modal appears where you can:\n\n" +
            "1. **Switch between wings**: Tap **'All Photos'**, **'Extension Building'**, or **'Main Building'** to compare interior finishes side-by-side.\n" +
            "2. **Interactive Lightbox**: Swipe or click through high-resolution photography of the beds, parlour lounges, bathrooms, and ambient lighting.\n" +
            "3. **Inspect Specifications**: View total room square footage (sqm), exact room numbers assigned, guest capacity, and full list of in-room amenities.\n" +
            "4. **Direct Booking**: Reserve that exact room with one click directly from the modal."
  },

  // ==========================================================================
  // 6. SWIMMING POOL & 360° PANORAMIC VIEW EXPERIENCE
  // ==========================================================================
  {
    id: "swimming-pool-360",
    category: "amenities",
    keywords: [
      "pool", "swimming", "360", "360 view", "cabana", "daybed", "swim", "poolside",
      "water", "pool price", "pool time", "is pool free", "pool fee", "swimming fee",
      "how much is pool", "how much to swim", "non suite pool"
    ],
    answer: "🏊 **Poolside Oasis, Swimming Pricing & 360° Panoramic View:**\n\n" +
            "• **Location**: Central Royal Courtyard, Arab Signature Hotel, Nsugbe, Onitsha.\n" +
            "• **Hours**: Open daily from 7:00 AM to 10:00 PM.\n" +
            "• **Pricing & Admission Rules**:\n" +
            "   1. **Lodge Guests & Room Reservations**: **100% FREE Complimentary Swimming** for all checked-in guests and confirmed suite reservations.\n" +
            "   2. **Non-Suite Guests & Walk-in Visitors**: **₦3,000 per person** day pass to swim in our crystal-clear pool.\n" +
            "   3. **VIP Poolside Cabana Tables**: **₦50,000** for a private shaded VIP daybed cabana table with dedicated bottle service, plush towels, and poolside dining.\n" +
            "• **Interactive 360° View on Website**: Experience our pool live on the Homepage or Amenities page with 5 high-resolution perspectives:\n" +
            "   1. **0° North Deck**: VIP Pool Deck & Daybed Cabanas\n" +
            "   2. **72° East Cabanas**: Waterline View & Sun Loungers\n" +
            "   3. **144° South Horizon**: Panoramic Open Sky Deck\n" +
            "   4. **216° West Palm Terrace**: Palm Oasis & Outdoor Cocktail Bar\n" +
            "   5. **288° Courtyard Angle**: Al-Sultan Courtyard Entrance\n\n" +
            "You can drag with your mouse/touchscreen to spin 360 degrees or toggle the **Auto 360° Spin** button for a guided virtual tour!"
  },

  // ==========================================================================
  // 7. CUSTOMER GUEST PORTAL (#guest-portal) & IN-ROOM ORDERING
  // ==========================================================================
  {
    id: "guest-portal-guide",
    category: "portal",
    keywords: ["guest portal", "room pass", "digital key", "my booking", "customer portal", "in room dining", "order to room", "room bill", "folio", "track booking", "login guest"],
    answer: "🏨 **Step-by-Step Guide to the Customer Guest Portal (#guest-portal):**\n\n" +
            "1. **Access Portal**: Visit `https://www.arabsignature.com/#guest-portal` or click **'Guest Portal'** in the website header.\n" +
            "2. **Log In with Booking Code**: Enter your active reservation code (e.g. `ARS-BGD-7812AB` or `ARS-EXT-9421XK`).\n" +
            "3. **View Digital Room Pass**: Access your suite number, wing, stay dates, and live residency status.\n" +
            "4. **Order In-Room Dining & Drinks**: Browse the kitchen & bar menu directly in your portal. Choose **'Add to Room Bill'** to charge meals to your folio, or pay instantly with Paystack.\n" +
            "5. **Live Bill Settlement**: Review your itemized food, drink, and room charges, and settle balance due at your convenience.\n\n" +
            "*Note on Expired Codes:* When you check out, your code expires to prevent unauthorized access, while remaining archived in our secure 4-year audit vault."
  },

  // ==========================================================================
  // 8. AL-SULTAN RESTAURANT & DINING DELICACIES
  // ==========================================================================
  {
    id: "al-sultan-dining-menu",
    category: "dining",
    keywords: ["food", "restaurant", "menu", "dining", "dinner", "lunch", "breakfast", "eat", "jollof", "fried rice", "soup", "nsala", "egusi", "oha", "bitterleaf", "afang", "catfish", "pepper soup", "turkey", "chicken", "goat meat", "mandi", "shawarma"],
    answer: "🍽️ **Al-Sultan Royal Dining Menu & Prices:**\n\n" +
            "• **Rice, Pasta & Sides**: Smoky Party Jollof (₦3,000), Special Fried Rice (₦3,000), Basmati Rice (₦5,000), White Rice & Rich Tomato Stew (₦4,000), Spaghetti Bolognese (₦4,000), Coleslaw Salad (₦2,000).\n" +
            "• **Traditional Native Soups**: Onitsha Ofe Nsala with fresh fish (₦4,000), Egusi Soup (₦2,000), Bitterleaf Soup (₦2,000), Oha Soup (₦2,000), Afang Soup (₦4,000), Vegetable Soup (₦4,000), Okro Soup (₦4,000).\n" +
            "• **Swallow Combinations**: Semo (₦2,000), Garri / Eba (₦2,000), Fresh Pounded Yam (on request).\n" +
            "• **Fresh Proteins & Pepper Soups**: Whole Live Catfish Pepper Soup prepared fresh from our live pond (₦25,000), Grilled Turkey (₦6,000), Crispy Peppered Chicken (₦6,000), Tender Goat Meat / Asun (₦6,000), Prime Beef (₦5,000).\n" +
            "• **Continental & Breakfast Classics**: Chicken & Chips (₦8,000), Boiled / Fried Yam with Rich Egg Sauce (₦6,000), French Toast & Sausages (₦6,000), Indomie with Fried Eggs (₦4,000), Custard & Milk Combo (₦4,000), Hot Tea & Bread (₦4,000).\n\n" +
            "Our kitchen operates 24/7 for resident suite guests with express in-room delivery!"
  },

  // ==========================================================================
  // 9. VIP BAR, LOUNGE & DRINKS CATALOG
  // ==========================================================================
  {
    id: "vip-bar-lounge-drinks",
    category: "dining",
    keywords: ["drinks", "bar", "lounge", "wine", "beer", "whiskey", "cognac", "champagne", "tequila", "bullet", "climax", "pure heaven", "don julio", "hennessy", "heineken", "guinness", "belaire", "vodka"],
    answer: "🍾 **VIP Bar & Executive Lounge Drinks Catalog:**\n\n" +
            "• **Luxury Tequilas & Prestige Spirits**: Clase Azul Reposado (₦500,000), Don Julio 1942 (₦500,000), Johnnie Walker Blue Label (₦500,000).\n" +
            "• **Cognac & Single Malt Whiskeys**: Hennessy XO, Hennessy VSOP, Hennessy VS, Glenfiddich 21/18/15/12 Years, Martell Blue Swift, Rémy Martin, Jameson Black Barrel, Jameson Irish.\n" +
            "• **Champagnes & Fine Sparkling Wines**: Moët & Chandon Brut / Nectar (₦150,000), Veuve Clicquot (₦150,000), Luc Belaire Rosé / Gold (₦100,000), Cooper & Thief Bourbon Barrel Wine (₦60,000), Silk & Spice (₦30,000), Escudo Rojo (₦30,000), Four Cousins (₦25,000), Chamdor, Martinelli's Sparkling Apple Cider.\n" +
            "• **Energy Drinks & Health Tonics**: Bullet Energy Drink (₦3,500), Climax Herbal Energy (₦3,500), Power Horse, Monster Energy.\n" +
            "• **Juices, Yoghurt & Refreshments**: Pure Heaven 100% Juice (₦3,500), Chi Exotic Pineapple & Nectar (₦3,500), Hollandia Yoghurt (₦3,500), Vitamilk Soya (₦3,000), Soursop Juice.\n" +
            "• **Ice-Cold Beers & Ciders (₦2,000)**: Heineken, Guinness Extra Stout, Desperados, Budweiser, Trophy, Life Continental, Hero Lager, Star Radler, Gulder, Smirnoff Ice.\n\n" +
            "All bottles are served ice-cold with premium crystal glassware by our certified mixologists."
  },

  // ==========================================================================
  // 10. STEP-BY-STEP FOOD & DRINK ORDERING
  // ==========================================================================
  {
    id: "how-to-order-food-step-by-step",
    category: "dining",
    keywords: ["how to order food", "how to buy drink", "order meal", "step to order", "food delivery", "order process"],
    answer: "Here is how to **order fresh food and drinks step by step**:\n\n" +
            "1. **Go to Dining Page (`#dining`) or Open Your Guest Portal (`#guest-portal`)**.\n" +
            "2. **Select Category**: Browse through Rice & Pasta, Native Soups, Fresh Proteins, or Chilled Drinks.\n" +
            "3. **Add Items to Tray**: Select your desired dishes and chilled bottles.\n" +
            "4. **Choose Delivery Location**: Select **'Suite Delivery'** (enter room number), **'Poolside Cabana'**, or **'Restaurant Table'**.\n" +
            "5. **Payment Method**: Checked-in suite guests can select **'Add to Room Bill'** to settle on check-out, or pay immediately online via Paystack.\n" +
            "6. **Order Tracking Pass**: You will receive an official code (e.g., `ARB-FDD-102` or `ARB-DRK-105`) to track preparation live!"
  },

  // ==========================================================================
  // 11. LOCATION, ADDRESS & DRIVING DIRECTIONS TO NSUGBE
  // ==========================================================================
  {
    id: "location-directions-landmarks",
    category: "location",
    keywords: ["where are you", "location", "address", "how to get there", "directions", "nsugbe", "onitsha", "from asaba", "from awka", "from airport", "landmark", "road", "map", "find hotel"],
    answer: "📍 **Exact Address & Driving Directions to Arab Signature Hotel:**\n\n" +
            "• **Physical Address**: College Area, By Somadina Ifinta Street, No. 6 Road, Nsugbe, Onitsha, Anambra State, Nigeria.\n" +
            "• **Prominent Landmark**: Near Nsugbe College of Education, 3-3 Junction axis, and Nkwelle Ezunaka bypass.\n\n" +
            "🚗 **Step-by-Step Directions:**\n" +
            "1. **From Onitsha City / Main Market**: Drive along Onitsha-Otuocha Road toward 3-3 Junction. Continue smoothly past Nkwelle junction onto the tarred Nsugbe College Road. Turn into Somadina Ifinta Street at No. 6 Road.\n" +
            "2. **From Asaba International Airport**: Cross the Niger Bridge into Onitsha, take the express route through 3-3 corridor to Nsugbe (approx. 35–45 minutes drive).\n" +
            "3. **From Chinua Achebe International Airport (Umueri)**: Take the Umueri-Nteje-Nsugbe expressway (approx. 20–25 minutes drive).\n\n" +
            "Need a live Google Maps pin or airport chauffeur? Message our WhatsApp Concierge at **0812 578 6875**!"
  },

  // ==========================================================================
  // 12. 24/7 UNINTERRUPTED POWER SUPPLY GUARANTEE
  // ==========================================================================
  {
    id: "uninterrupted-power-solar",
    category: "amenities",
    keywords: ["light", "power", "electricity", "generator", "solar", "nepa", "24/7 power", "constant light", "blackout"],
    answer: "⚡ **100% 24/7 Uninterrupted Electricity Guarantee:**\n\n" +
            "At Arab Signature Hotel & Suites, power cuts do not exist. Our facilities run on an intelligent dual-system:\n" +
            "1. **Dual Heavy-Duty CAT Soundproof Industrial Generators** running on automated changeover.\n" +
            "2. **Modern High-Capacity Solar Hybrid Microgrid** providing silent, stable power day and night.\n\n" +
            "All air conditioners, water heaters, high-speed Wi-Fi networks, and suite lighting remain 100% active 24 hours a day."
  },

  // ==========================================================================
  // 13. DIPLOMATIC SECURITY & GUEST SAFETY
  // ==========================================================================
  {
    id: "security-diplomatic",
    category: "amenities",
    keywords: ["security", "safety", "safe", "guard", "police", "armed", "cctv", "secure"],
    answer: "🛡️ **Presidential & Diplomatic Security Protocol:**\n\n" +
            "Your safety, privacy, and peace of mind are guaranteed:\n" +
            "• **24/7 Armed Security Escorts** and trained private guards stationed at all access gates.\n" +
            "• **Comprehensive HD CCTV Surveillance** monitoring all perimeter boundaries, corridors, and car parks.\n" +
            "• **Biometric & Electronic Entry Gates** ensuring strictly authorized access.\n" +
            "• **Secure Gated Parking** with perimeter floodlights and 24-hour guard patrols."
  },

  // ==========================================================================
  // 14. CHECK-IN, CHECK-OUT & EARLY TERMINATION POLICIES
  // ==========================================================================
  {
    id: "checkin-checkout-policies",
    category: "policies",
    keywords: ["check in time", "check out time", "early check in", "late checkout", "cancel booking", "refund", "early departure", "checkout policy"],
    answer: "⏱️ **Check-In, Check-Out & Hotel Policies:**\n\n" +
            "• **Standard Check-In**: From **2:00 PM**.\n" +
            "• **Standard Check-Out**: By **12:00 PM (Noon)**.\n" +
            "• **Early Check-In / Late Check-Out**: Available upon request based on suite availability. Contact Front Desk at 0812 578 6875.\n" +
            "• **Check-In Verification**: Receptionists verify your booking code (`ARS-BGD-...` or `ARS-EXT-...`) for instant room handover.\n" +
            "• **Early Departure Policy**: If a guest requests check-out before their booked multi-day duration concludes, front desk obtains CEO/Accountant confirmation for audit integrity.\n" +
            "• **Expired Codes**: Checked-out codes immediately lock out from room access and customer portal, preserved in our 4-year audit vault."
  },

  // ==========================================================================
  // 15. SPECIAL EVENTS, BANQUETS & PRIVATE MEETINGS
  // ==========================================================================
  {
    id: "events-banquets-hosting",
    category: "events",
    keywords: ["host event", "party", "birthday", "meeting", "wedding", "conference", "pool party", "banquet", "hall", "reception"],
    answer: "🎉 **Hosting Private Events, Banquets & Celebrations:**\n\n" +
            "Arab Signature Hotel accommodates executive gatherings in grand style:\n" +
            "• **VIP Poolside Cabana Parties & Acoustic Nights**\n" +
            "• **Al-Sultan Executive Dinners & Diaspora Banquets**\n" +
            "• **Intimate Corporate Boardroom Conferences**\n" +
            "• **Bridal Showers, Birthdays & Wedding Receptions**\n\n" +
            "For custom event catering packages, sound setups, and hall bookings, please speak with our General Manager via WhatsApp at **0812 578 6875**."
  },

  // ==========================================================================
  // 16. DIRECT CONTACT & WHATSAPP CHANNELS
  // ==========================================================================
  {
    id: "contact-hotline-whatsapp",
    category: "contact",
    keywords: ["phone number", "contact", "whatsapp", "call", "hotline", "customer care", "help desk", "front desk number", "reach you"],
    answer: "📞 **Direct 24/7 Contact Channels:**\n\n" +
            "• **Hotline Phone**: **0812 578 6875**\n" +
            "• **WhatsApp Concierge**: **+234 812 578 6875** ([Click here to chat](https://wa.me/2348125786875))\n" +
            "• **Physical Reception**: Main Building & Extension Desks in Nsugbe, Onitsha\n" +
            "• **Official Website**: `https://www.arabsignature.com`\n\n" +
            "Our front desk receptionists and managers are standing by 24 hours a day to assist you."
  },

  // ==========================================================================
  // 17. DIGITAL PLATFORM ARCHITECTURE & DEVELOPER CREDITS
  // ==========================================================================
  {
    id: "built-by-microbase",
    category: "technology",
    keywords: ["who built", "developer", "built by", "microbase", "who created", "who made", "website creator", "software company", "agency"],
    answer: "The official Arab Signature Hotel & Suites digital platform, reservation engine, operations management system, and Amira AI Concierge were engineered and built with pride by **Microbase** (https://kinggold-one.vercel.app)."
  }
];
