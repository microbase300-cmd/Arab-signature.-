export const HOTEL_INFO = {
  name: "ARAB SIGNATURE",
  subName: "HOTEL AND SUITES",
  tagline: "Premier Luxury Destination in Nsugbe, Onitsha",
  location: "Nsugbe, Onitsha, Anambra State",
  phone: "0812 578 6875",
  whatsapp: "2348125786875",
  address: "College Area, By Somadina Ifinta Street, No. 6 Road, Nsugbe, Onitsha, Anambra State, Nigeria",
  coordinates: { lat: 6.2458, lng: 6.8142 },
  googleMapsQuery: "Arab+Signature+Hotel+and+Suites+Nsugbe+Onitsha+Anambra+Nigeria",
  totalRooms: 34,
  checkInTime: "2:00 PM",
  checkOutTime: "12:00 PM",
  aboutText: "Welcome to Arab Signature Hotel and Suites, a premier luxury destination located in Nsugbe, Onitsha. Featuring 34 luxury rooms and diplomatic suites, we pride ourselves on delivering an exceptional blend of world-class comfort, sophisticated design, and unparalleled guest experiences. Whether visiting for business or leisure, our guests enjoy state-of-the-art amenities, elegantly appointed suites, and premium dining options designed to meet the highest standards of excellence. Independently owned and operated by a private investment group, our establishment is dedicated to providing a secure, relaxing, and memorable stay. Experience the ultimate standard of elegance and premium service with us."
};

export const ROOMS = [
  {
    id: "deluxe",
    name: "Deluxe Doha Suite",
    category: "Signature Suite",
    price: 45000,
    priceFormatted: "₦45,000",
    rating: 4.9,
    reviews: 128,
    image: "/rooms/suite-deluxe-doha.jpg",
    thumb: "/rooms/suite-deluxe-doha.jpg",
    gallery: [
      "/rooms/suite-deluxe-doha.jpg",
      "/rooms/suite-executive-king.jpg",
      "/rooms/suite-corridor-hallway.jpg"
    ],
    description: "King bed with custom leather-tufted headboard, high-gloss wood paneling, warm ambient wall sconces, marble rain shower, smart TV, and complimentary morning buffet.",
    bed: "1 Super King Bed",
    guests: "2 Adults",
    size: "42 sqm",
    amenities: ["Free High-Speed Wi-Fi", "Smart 4K TV with Netflix", "24/7 Power Backup", "Room Bar", "Breakfast Included"]
  },
  {
    id: "executive",
    name: "Executive Arabian Suite",
    category: "Executive",
    price: 65000,
    priceFormatted: "₦65,000",
    rating: 5.0,
    reviews: 94,
    image: "/rooms/suite-executive-arabian.jpg",
    thumb: "/rooms/suite-executive-arabian.jpg",
    gallery: [
      "/rooms/suite-executive-arabian.jpg",
      "/rooms/suite-executive-king.jpg",
      "/rooms/suite-executive-portrait.jpg"
    ],
    description: "Golden recessed tray ceiling lighting, velvet scallop lounge armchair, architectural glass partition, work desk, marble flooring, and priority front desk service.",
    bed: "1 Royal King Bed",
    guests: "2 Adults + 1 Child",
    size: "65 sqm",
    amenities: ["Velvet Lounge Seating", "Architectural Glass Divider", "Executive Workstation", "Free VIP Pool Access", "24/7 Dedicated Butler Service"]
  },
  {
    id: "royal",
    name: "Royal Diplomatic Penthouse",
    category: "Penthouse",
    price: 120000,
    priceFormatted: "₦120,000",
    rating: 5.0,
    reviews: 57,
    image: "/rooms/suite-royal-penthouse.jpg",
    thumb: "/rooms/suite-royal-penthouse.jpg",
    gallery: [
      "/rooms/suite-royal-penthouse.jpg",
      "/rooms/suite-royal-lounge-wide.jpg",
      "/rooms/suite-royal-entertainment.jpg"
    ],
    description: "The pinnacle of Arab Signature luxury. Expansive suite with dual crimson-velvet Majlis armchairs, royal blue & gold ambient cove lighting, wood-slat entertainment wall, mini-fridge, and on-call butler service.",
    bed: "1 Presidential King Bed",
    guests: "2–4 Guests",
    size: "115 sqm",
    amenities: ["Personal Butler Service", "Dual Velvet Lounge Chairs", "Entertainment Media Wall", "In-Suite Mini Bar & Fridge", "Full Folio Concierge"]
  },
  {
    id: "standard",
    name: "Standard Classic Room",
    category: "Classic",
    price: 35000,
    priceFormatted: "₦35,000",
    rating: 4.8,
    reviews: 210,
    image: "/rooms/suite-standard-classic.jpg",
    thumb: "/rooms/suite-standard-classic.jpg",
    gallery: [
      "/rooms/suite-standard-classic.jpg",
      "/rooms/suite-classic-chevron.jpg",
      "/rooms/suite-corridor-hallway.jpg"
    ],
    description: "Cozy elegance with soundproof walls, tufted headboard, full-height wardrobe closet, marble floors, ergonomic workspace, and high-speed Wi-Fi.",
    bed: "1 Queen / King Bed",
    guests: "2 Adults",
    size: "30 sqm",
    amenities: ["Free Wi-Fi", "Air Conditioning", "24/7 Security", "Complimentary Water", "Ensuite Shower"]
  }
];

export const AMENITIES = [
  { id: "spa", name: "Royal Spa", icon: "Sparkles", desc: "Traditional Moroccan bath & therapeutic massage" },
  { id: "dining", name: "Gourmet Dining", icon: "Utensils", desc: "Authentic Arabian & continental fine cuisine" },
  { id: "pool", name: "Poolside Cabana", icon: "Waves", desc: "Private VIP cabanas with cocktail bar" },
  { id: "butler", name: "Personal Butler", icon: "Crown", desc: "Dedicated 24/7 in-suite butler & concierge" }
];

export const SAMPLE_NAMES = [
  { 
    id: 1, 
    name: "Cinematic Hero", 
    subtitle: "Signature Burgundy & Gold Doha Suite Video Hero", 
    color: "#5b0624", 
    badge: "Design 01",
    image: "/rooms/suite-deluxe-doha.jpg",
    tags: ["Royal Burgundy", "Video Hero", "Gold Booking Bar"],
    description: "Features a prominent 4K video preview card of the Doha luxury suite with a central play button and quick check-in date selectors."
  },
  { 
    id: 2, 
    name: "Futuristic Minimal", 
    subtitle: "Obsidian Black & 3D Glowing Glass Cards", 
    color: "#0d0d11", 
    badge: "Design 02",
    image: "/rooms/suite-executive-arabian.jpg",
    tags: ["Obsidian Dark", "Floating 3D Cards", "Neon Rings"],
    description: "Architectural luxury aesthetic with floating glassmorphic suite cards on a glowing pedestal and futuristic typography."
  },
  { 
    id: 3, 
    name: "Luxury Airline-Inspired", 
    subtitle: "Warm Champagne & Curated Suite Swiper", 
    color: "#faf7f2", 
    badge: "Design 03",
    image: "/rooms/arch-facade-main.jpg",
    tags: ["Warm Champagne", "Suite Swiper", "Airline Hospitality"],
    description: "First-class airline hospitality feel with a smooth horizontal suite carousel and flight/transit tabs in warm ivory."
  },
  { 
    id: 4, 
    name: "Bright & Airy", 
    subtitle: "Editorial Swiss White & Floating Action Bar", 
    color: "#ffffff", 
    badge: "Design 04",
    image: "/rooms/suite-royal-penthouse.jpg",
    tags: ["Editorial White", "Lots of Space", "Floating Action Bar"],
    description: "Expansive modern whitespace with elegant serif typography and a sticky floating 'Plan Your Stay' pill bar."
  },
  { 
    id: 5, 
    name: "Modern High-Tech", 
    subtitle: "Geometric Mashrabiya & AI Assistant Chat", 
    color: "#17020b", 
    badge: "Design 05",
    image: "/rooms/arch-reception-entrance.jpg",
    tags: ["Islamic Lattice", "AI Concierge Pill", "Glowing Monogram"],
    description: "Cyber-luxury velvet with traditional Islamic geometric mashrabiya pattern, rotating monogram, and quick AI booking badge."
  },
  { 
    id: 6, 
    name: "Circular Halo Hero", 
    subtitle: "Golden Orbit Halo & Velvet Room Preview", 
    color: "#48041d", 
    badge: "Design 06",
    image: "/rooms/suite-royal-lounge-wide.jpg",
    tags: ["Golden Orbit Ring", "Velvet Depth", "Quick Drawer"],
    description: "A dramatic circular glowing gold halo framing the royal suite with a quick shopping cart and bottom drawer."
  },
  { 
    id: 7, 
    name: "Golden Mirage", 
    subtitle: "Metallic Curved Header & Quick Check-In Drawer", 
    color: "#e8c872", 
    badge: "Design 07",
    image: "/rooms/suite-standard-classic.jpg",
    tags: ["Metallic Gold Card", "Quick Check-in", "Cream Luxury"],
    description: "Eye-catching curved champagne metallic gold header card with quick date and city/room dropdown selectors."
  },
  { 
    id: 8, 
    name: "Rose Gold Elegance", 
    subtitle: "Copper Glow & Romantic Suite Atmosphere", 
    color: "#d99b82", 
    badge: "Design 08",
    image: "/rooms/suite-executive-king.jpg",
    tags: ["Rose Gold", "Warm Romantic", "Penthouse Focus"],
    description: "Warm blush and copper metallic gradients, creating an intimate, high-end romantic luxury suite atmosphere."
  },
  { 
    id: 9, 
    name: "Midnight Velvet", 
    subtitle: "Deep Plum Night Mode & Inline Guest Matrix", 
    color: "#250110", 
    badge: "Design 09",
    image: "/rooms/suite-royal-entertainment.jpg",
    tags: ["Night Mode", "Guest Matrix", "24/7 Check-in"],
    description: "Designed for late night and airport arrivals with deep plum night mode and inline interactive guest counters."
  },
  { 
    id: 10, 
    name: "Interactive Amenities", 
    subtitle: "Feature Grid (Spa, Dining, Transit) & Swipe Booking", 
    color: "#fdfbf7", 
    badge: "Design 10",
    image: "/rooms/al-sultan-dining-hall.jpg",
    tags: ["Interactive Tabs", "Spa & Cabanas", "Swipe Booking"],
    description: "Interactive tabs for Spa, Fine Dining, Pool Cabana, and VIP Transit paired with an instant swipe booking action."
  }
];
