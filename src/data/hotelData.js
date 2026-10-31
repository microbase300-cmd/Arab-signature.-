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
  buildingsCount: 2,
  mainBuildingRooms: 20,
  extensionBuildingRooms: 14,
  checkInTime: "2:00 PM",
  checkOutTime: "12:00 PM",
  aboutText: "Welcome to Arab Signature Hotel and Suites, a premier luxury destination located in Nsugbe, Onitsha. Featuring 34 luxury rooms and diplomatic suites across two private wings (Main Building & Extension Building), we pride ourselves on delivering an exceptional blend of world-class comfort, sophisticated design, and unparalleled guest experiences. Whether visiting for business or leisure, our guests enjoy state-of-the-art amenities, elegantly appointed suites, and premium dining options designed to meet the highest standards of excellence. Independently owned and operated by a private investment group, our establishment is dedicated to providing a secure, relaxing, and memorable stay. Experience the ultimate standard of elegance and premium service with us."
};

// Hotel Buildings & Wing Groupings
export const HOTEL_BUILDINGS = [
  {
    id: "main",
    name: "Main Building",
    wing: "600 Wing",
    totalRooms: 20,
    roomRange: "Rooms 601 – 620",
    priceRange: "₦30,000 – ₦60,000",
    description: "The primary hotel building housing 20 premium rooms ranging from Standard to Super Executive.",
    categories: [
      { name: "Super Executive", type: "super-executive", price: 60000, priceFormatted: "₦60,000", rooms: ["605", "612", "615"], count: 3 },
      { name: "Executive", type: "executive", price: 50000, priceFormatted: "₦50,000", rooms: ["601", "609", "619"], count: 3 },
      { name: "Superior", type: "superior", price: 40000, priceFormatted: "₦40,000", rooms: ["603", "607", "611", "613", "617"], count: 5 },
      { name: "Deluxe", type: "deluxe", price: 35000, priceFormatted: "₦35,000", rooms: ["602", "604", "606", "608", "610", "620"], count: 6 },
      { name: "Standard", type: "standard", price: 30000, priceFormatted: "₦30,000", rooms: ["614", "616", "618"], count: 3 }
    ]
  },
  {
    id: "extension",
    name: "Extension Building",
    wing: "100 Wing",
    totalRooms: 14,
    roomRange: "Rooms 101 – 114",
    priceRange: "₦40,000 – ₦120,000",
    description: "The private annex building housing 14 luxury residences including the flagship ₦120,000 Diplomatic Suites.",
    categories: [
      { name: "Suites", type: "suites", price: 120000, priceFormatted: "₦120,000", rooms: ["107", "114"], count: 2 },
      { name: "Super-Executive", type: "super-executive", price: 60000, priceFormatted: "₦60,000", rooms: ["102", "109"], count: 2 },
      { name: "Executive", type: "executive", price: 50000, priceFormatted: "₦50,000", rooms: ["103", "104", "110", "111"], count: 4 },
      { name: "Superior", type: "superior", price: 40000, priceFormatted: "₦40,000", rooms: ["101", "105", "106", "108", "112", "113"], count: 6 }
    ]
  }
];

export const ROOMS = [
  {
    id: "suites",
    name: "Diplomatic Apartment with Parlour",
    boardTitle: "120K DIPLOMATIC APARTMENT & PARLOUR",
    category: "Diplomatic Apartment & Parlour",
    price: 120000,
    priceFormatted: "₦120,000",
    hasParlour: true,
    apartmentType: "Executive Apartment with Private Parlour & King Bedroom",
    buildings: ["Extension Building"],
    buildingLabel: "Extension Building • Suites 107, 114",
    roomNumbers: ["107", "114"],
    mainBuildingRooms: [],
    extensionBuildingRooms: ["107", "114"],
    totalRooms: 2,
    rating: 5.0,
    reviews: 64,
    image: "/rooms/ext-120k-apartment-parlour-1.webp",
    thumb: "/rooms/ext-120k-apartment-parlour-1.webp",
    extensionBuildingPhotos: [
      "/rooms/ext-120k-apartment-parlour-1.webp",
      "/rooms/ext-120k-apartment-parlour-2.webp",
      "/rooms/ext-120k-apartment-parlour-3.webp",
      "/rooms/ext-120k-apartment-parlour-4.webp",
      "/rooms/ext-120k-apartment-parlour-5.webp",
      "/rooms/ext-120k-apartment-parlour-6.webp",
      "/rooms/ext-120k-apartment-parlour-7.webp",
      "/rooms/ext-120k-apartment-parlour-8.webp"
    ],
    mainBuildingPhotos: [],
    gallery: [
      "/rooms/ext-120k-apartment-parlour-1.webp",
      "/rooms/ext-120k-apartment-parlour-2.webp",
      "/rooms/ext-120k-apartment-parlour-3.webp",
      "/rooms/ext-120k-apartment-parlour-4.webp",
      "/rooms/ext-120k-apartment-parlour-5.webp",
      "/rooms/ext-120k-apartment-parlour-6.webp",
      "/rooms/ext-120k-apartment-parlour-7.webp",
      "/rooms/ext-120k-apartment-parlour-8.webp",
      "/rooms/suite-royal-penthouse.jpg",
      "/rooms/suite-royal-lounge-wide.jpg"
    ],
    description: "The premier luxury offering at Arab Signature Hotel Extension Building. An expansive ₦120,000 VIP diplomatic apartment featuring a spacious private parlour/living room with plush executive sofa seating, separate master king bedroom, ambient royal blue & gold tray ceiling, dual smart entertainment displays, mini-bar, ensuite luxury marble bathroom, and dedicated 24/7 butler service.",
    bed: "1 Presidential King Bed + Private Executive Parlour Suite",
    guests: "2–4 Guests",
    size: "125 sqm",
    amenities: [
      "Spacious Private Executive Parlour / Living Room",
      "Separate Master King Bedroom",
      "Personal Butler Service",
      "Dual Smart 4K TVs (Parlour & Bedroom)",
      "In-Suite Mini Bar & Refrigerator",
      "Ensuite Marble Rain Shower & Amenities",
      "Complimentary Gourmet Breakfast",
      "Uninterrupted 24/7 Power Backup & Free High-Speed Wi-Fi"
    ]
  },
  {
    id: "super-executive",
    name: "Super Executive Room",
    boardTitle: "SUPER EXECUTIVE",
    category: "Super Executive",
    price: 60000,
    priceFormatted: "₦60,000",
    buildings: ["Main Building", "Extension Building"],
    buildingLabel: "Main Building (3) & Extension Building (2)",
    roomNumbers: ["102", "109", "605", "612", "615"],
    mainBuildingRooms: ["605", "612", "615"],
    extensionBuildingRooms: ["102", "109"],
    totalRooms: 5,
    rating: 4.9,
    reviews: 92,
    image: "/rooms/ext-60k-super-executive-1.webp",
    thumb: "/rooms/ext-60k-super-executive-1.webp",
    extensionBuildingPhotos: [
      "/rooms/ext-60k-super-executive-1.webp",
      "/rooms/ext-60k-super-executive-2.webp",
      "/rooms/ext-60k-super-executive-3.webp",
      "/rooms/ext-60k-super-executive-4.webp",
      "/rooms/ext-60k-super-executive-5.webp"
    ],
    mainBuildingPhotos: [
      "/rooms/suite-executive-arabian.jpg",
      "/rooms/suite-executive-king.jpg",
      "/rooms/suite-executive-portrait.jpg"
    ],
    gallery: [
      "/rooms/ext-60k-super-executive-1.webp",
      "/rooms/ext-60k-super-executive-2.webp",
      "/rooms/ext-60k-super-executive-3.webp",
      "/rooms/ext-60k-super-executive-4.webp",
      "/rooms/ext-60k-super-executive-5.webp",
      "/rooms/suite-executive-arabian.jpg",
      "/rooms/suite-executive-king.jpg"
    ],
    description: "Available across both Main Building (Suites 605, 612, 615) and Extension Building (Suites 102, 109). Premium ₦60,000 executive room featuring golden architectural tray ceilings, velvet scallop lounge armchair, glass architectural partitions, marble tile finishes, and ergonomic workstation.",
    bed: "1 Royal King Bed",
    guests: "2 Adults + 1 Child",
    size: "55 sqm",
    amenities: ["Royal King Bed", "Velvet Scallop Armchair", "Architectural Glass Partition", "Executive Workstation", "Smart 4K TV", "Free High-Speed Wi-Fi", "Complimentary Breakfast", "24/7 Power"]
  },
  {
    id: "executive",
    name: "Executive Room",
    boardTitle: "EXECUTIVE",
    category: "Executive",
    price: 50000,
    priceFormatted: "₦50,000",
    buildings: ["Main Building", "Extension Building"],
    buildingLabel: "Main Building (3) & Extension Building (4)",
    roomNumbers: ["103", "104", "110", "111", "601", "609", "619"],
    mainBuildingRooms: ["601", "609", "619"],
    extensionBuildingRooms: ["103", "104", "110", "111"],
    totalRooms: 7,
    rating: 4.9,
    reviews: 118,
    image: "/rooms/ext-50k-executive-1.webp",
    thumb: "/rooms/ext-50k-executive-1.webp",
    extensionBuildingPhotos: [
      "/rooms/ext-50k-executive-1.webp",
      "/rooms/ext-50k-executive-2.webp",
      "/rooms/ext-50k-executive-3.webp"
    ],
    mainBuildingPhotos: [
      "/rooms/suite-deluxe-doha.jpg",
      "/rooms/suite-executive-king.jpg",
      "/rooms/suite-corridor-hallway.jpg"
    ],
    gallery: [
      "/rooms/ext-50k-executive-1.webp",
      "/rooms/ext-50k-executive-2.webp",
      "/rooms/ext-50k-executive-3.webp",
      "/rooms/suite-deluxe-doha.jpg",
      "/rooms/suite-executive-king.jpg"
    ],
    description: "Available across Main Building (3 rooms) and Extension Building (4 rooms). Contemporary ₦50,000 luxury room with custom leather-tufted headboard, warm ambient wall sconces, executive work desk, smart TV, and complimentary breakfast.",
    bed: "1 King Bed",
    guests: "2 Adults",
    size: "46 sqm",
    amenities: ["Custom Tufted Headboard", "Smart 4K TV with Streaming", "Executive Work Desk", "Ensuite Rain Shower", "Room Service", "24/7 Security & Power"]
  },
  {
    id: "superior",
    name: "Superior Room",
    boardTitle: "SUPERIOR",
    category: "Superior",
    price: 40000,
    priceFormatted: "₦40,000",
    buildings: ["Main Building", "Extension Building"],
    buildingLabel: "Main Building (5) & Extension Building (6)",
    roomNumbers: ["101", "105", "106", "108", "112", "113", "603", "607", "611", "613", "617"],
    mainBuildingRooms: ["603", "607", "611", "613", "617"],
    extensionBuildingRooms: ["101", "105", "106", "108", "112", "113"],
    totalRooms: 11,
    rating: 4.8,
    reviews: 152,
    image: "/rooms/ext-40k-superior-1.webp",
    thumb: "/rooms/ext-40k-superior-1.webp",
    extensionBuildingPhotos: [
      "/rooms/ext-40k-superior-1.webp",
      "/rooms/ext-40k-superior-2.webp",
      "/rooms/ext-40k-superior-3.webp",
      "/rooms/ext-40k-superior-4.webp",
      "/rooms/ext-40k-superior-5.webp"
    ],
    mainBuildingPhotos: [
      "/rooms/suite-classic-chevron.jpg",
      "/rooms/suite-deluxe-doha.jpg",
      "/rooms/suite-corridor-hallway.jpg"
    ],
    gallery: [
      "/rooms/ext-40k-superior-1.webp",
      "/rooms/ext-40k-superior-2.webp",
      "/rooms/ext-40k-superior-3.webp",
      "/rooms/ext-40k-superior-4.webp",
      "/rooms/ext-40k-superior-5.webp",
      "/rooms/suite-classic-chevron.jpg"
    ],
    description: "Our popular ₦40,000 category spanning 11 rooms across Main Building (5) and Extension Building (6). Elegantly appointed with comfortable king/queen bed, acoustic soundproofing, modern ensuite bathroom, and high-speed Wi-Fi.",
    bed: "1 King / Queen Bed",
    guests: "2 Adults",
    size: "40 sqm",
    amenities: ["Plush King/Queen Bedding", "Air Conditioning", "Free High-Speed Wi-Fi", "Soundproof Acoustic Walls", "Ensuite Rain Shower", "24/7 Power Backup"]
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    boardTitle: "DELUXE",
    category: "Deluxe",
    price: 35000,
    priceFormatted: "₦35,000",
    buildings: ["Main Building"],
    buildingLabel: "Main Building • Rooms 602, 604, 606, 608, 610, 620",
    roomNumbers: ["602", "604", "606", "608", "610", "620"],
    mainBuildingRooms: ["602", "604", "606", "608", "610", "620"],
    extensionBuildingRooms: [],
    totalRooms: 6,
    rating: 4.8,
    reviews: 98,
    image: "/rooms/suite-standard-classic.jpg",
    thumb: "/rooms/suite-standard-classic.jpg",
    mainBuildingPhotos: [
      "/rooms/suite-standard-classic.jpg",
      "/rooms/suite-classic-chevron.jpg",
      "/rooms/suite-corridor-hallway.jpg"
    ],
    extensionBuildingPhotos: [],
    gallery: [
      "/rooms/suite-standard-classic.jpg",
      "/rooms/suite-classic-chevron.jpg",
      "/rooms/suite-corridor-hallway.jpg"
    ],
    description: "Located in the Main Building (6 rooms). Contemporary comfort with tufted headboard, wardrobe closet, marble tile flooring, smart TV, air conditioning, and pristine ensuite bathroom.",
    bed: "1 Queen / King Bed",
    guests: "2 Adults",
    size: "36 sqm",
    amenities: ["Queen/King Bed", "Smart TV", "Air Conditioning", "Wardrobe Closet", "Complimentary Water", "Ensuite Shower"]
  },
  {
    id: "standard",
    name: "Standard Room",
    boardTitle: "STANDARD",
    category: "Standard",
    price: 30000,
    priceFormatted: "₦30,000",
    buildings: ["Main Building"],
    buildingLabel: "Main Building • Rooms 614, 616, 618",
    roomNumbers: ["614", "616", "618"],
    mainBuildingRooms: ["614", "616", "618"],
    extensionBuildingRooms: [],
    totalRooms: 3,
    rating: 4.7,
    reviews: 130,
    image: "/rooms/suite-standard-classic.jpg",
    thumb: "/rooms/suite-standard-classic.jpg",
    mainBuildingPhotos: [
      "/rooms/suite-standard-classic.jpg",
      "/rooms/suite-corridor-hallway.jpg"
    ],
    extensionBuildingPhotos: [],
    gallery: [
      "/rooms/suite-standard-classic.jpg",
      "/rooms/suite-corridor-hallway.jpg"
    ],
    description: "Located in the Main Building (3 rooms). Cozy, peaceful, and fully air-conditioned accommodations providing signature Arab Signature hospitality, comfortable queen bed, and reliable 24/7 security.",
    bed: "1 Queen Bed",
    guests: "2 Adults",
    size: "30 sqm",
    amenities: ["Comfortable Queen Bed", "Air Conditioning", "Free Wi-Fi", "Private Ensuite Shower", "24/7 Security & Power"]
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
    subtitle: "Signature Burgundy & Gold Arab Suite Video Hero", 
    color: "#5b0624", 
    badge: "Design 01",
    image: "/rooms/suite-deluxe-doha.jpg",
    tags: ["Royal Burgundy", "Video Hero", "Gold Booking Bar"],
    description: "Features a prominent 4K video preview card of the Arab luxury suite with a central play button and quick check-in date selectors."
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
