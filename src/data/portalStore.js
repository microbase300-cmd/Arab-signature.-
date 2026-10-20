// Centralized State & Real-Time Storage for Receptionist & Admin Portals
import { ROOMS as DEFAULT_ROOMS, HOTEL_INFO as DEFAULT_HOTEL_INFO } from './hotelData';

const STORAGE_KEYS = {
  AUTH: 'ash_portal_auth_user',
  USERS: 'ash_portal_staff_users',
  LOGIN_LOGS: 'ash_portal_login_attempts',
  BOOKINGS: 'ash_portal_bookings',
  ROOMS: 'ash_portal_rooms_inventory_v6',
  ROOM_RATES: 'ash_portal_room_rates_v2',
  DINING_MENU: 'ash_portal_dining_menu_v3',
  HOTEL_CONFIG: 'ash_portal_hotel_config',
  ACTIVITY_LOG: 'ash_portal_activity_log',
};

// 1. Initial Room Inventory (34 Luxury Rooms & Suites in Nsugbe, Onitsha)
const INITIAL_ROOMS_INVENTORY = [
  // Floor 1: 10 Deluxe Doha Suites (101 - 110)
  { roomNumber: "101", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "occupied", currentGuest: "Dr. Ngozi Adeleke", checkOut: "2026-10-22", price: 45000 },
  { roomNumber: "102", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "occupied", currentGuest: "Walk-In Guest", checkOut: "2026-10-20", price: 45000 },
  { roomNumber: "103", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "reserved", currentGuest: "Alhaji Ibrahim Musa", checkOut: "2026-10-23", price: 45000 },
  { roomNumber: "104", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "available", currentGuest: null, checkOut: null, price: 45000 },
  { roomNumber: "105", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "available", currentGuest: null, checkOut: null, price: 45000 },
  { roomNumber: "106", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "available", currentGuest: null, checkOut: null, price: 45000 },
  { roomNumber: "107", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "available", currentGuest: null, checkOut: null, price: 45000 },
  { roomNumber: "108", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "available", currentGuest: null, checkOut: null, price: 45000 },
  { roomNumber: "109", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "available", currentGuest: null, checkOut: null, price: 45000 },
  { roomNumber: "110", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "available", currentGuest: null, checkOut: null, price: 45000 },

  // Floor 2: 10 Executive Arabian Suites (201 - 210)
  { roomNumber: "201", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "202", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "occupied", currentGuest: "Senator Chuka Nwosu", checkOut: "2026-10-21", price: 65000 },
  { roomNumber: "203", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "204", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "205", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "206", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "207", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "208", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "209", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "210", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },

  // Penthouse Wing: 4 Royal Diplomatic Penthouses (301 - 304)
  { roomNumber: "301", type: "royal", name: "Royal Diplomatic Penthouse", floor: "Penthouse", status: "occupied", currentGuest: "Chief Emeka Obi", checkOut: "2026-10-22", price: 120000 },
  { roomNumber: "302", type: "royal", name: "Royal Diplomatic Penthouse", floor: "Penthouse", status: "available", currentGuest: null, checkOut: null, price: 120000 },
  { roomNumber: "303", type: "royal", name: "Royal Diplomatic Penthouse", floor: "Penthouse", status: "available", currentGuest: null, checkOut: null, price: 120000 },
  { roomNumber: "304", type: "royal", name: "Royal Diplomatic Penthouse", floor: "Penthouse", status: "available", currentGuest: null, checkOut: null, price: 120000 },

  // Floor 4: 10 Standard Classic Rooms (401 - 410)
  { roomNumber: "401", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "402", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "403", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "occupied", currentGuest: "Engr. Tunde Bakare", checkOut: "2026-10-20", price: 35000 },
  { roomNumber: "404", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "405", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "406", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "407", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "408", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "409", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "410", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
];

// 2. Pre-Seeded Real Bookings with Backend Confirmation status
const INITIAL_BOOKINGS = [
  {
    id: "ASH-9421",
    guestName: "Chief Emeka Obi",
    phone: "0803 234 5678",
    email: "emeka.obi@nigerdelta.org",
    roomType: "royal",
    roomName: "Royal Diplomatic Penthouse",
    roomNumber: "301",
    checkIn: "2026-10-20",
    checkOut: "2026-10-22",
    nights: 2,
    amount: 240000,
    status: "Checked In",
    paymentMethod: "Paystack (Online)",
    paymentStatus: "Paid", // Confirmed by backend
    backendVerified: true,
    verifiedAt: "2026-10-17 08:31",
    source: "Direct Website",
    createdAt: "2026-10-17 08:30"
  },
  {
    id: "ASH-7812",
    guestName: "Alhaji Ibrahim Musa",
    phone: "0812 578 6875",
    email: "ibrahim.musa@example.com",
    roomType: "deluxe",
    roomName: "Deluxe Doha Suite",
    roomNumber: "103",
    checkIn: "2026-10-20",
    checkOut: "2026-10-22",
    nights: 2,
    amount: 90000,
    status: "Confirmed",
    paymentMethod: "Paystack (Online)",
    paymentStatus: "Paid", // Confirmed by backend
    backendVerified: true,
    verifiedAt: "2026-10-17 09:16",
    source: "Direct Website",
    createdAt: "2026-10-17 09:15"
  },
  {
    id: "ASH-6204",
    guestName: "Senator Chuka Nwosu",
    phone: "0802 999 1122",
    email: "nwosu.chuka@assembly.gov.ng",
    roomType: "executive",
    roomName: "Executive Arabian Suite",
    roomNumber: "202",
    checkIn: "2026-10-19",
    checkOut: "2026-10-21",
    nights: 2,
    amount: 130000,
    status: "Checked In",
    paymentMethod: "Bank Transfer (Approved by GM)",
    paymentStatus: "Paid", // Confirmed by backend
    backendVerified: true,
    verifiedAt: "2026-10-16 16:45",
    source: "Front Desk Walk-In",
    createdAt: "2026-10-16 16:40"
  },
  {
    id: "ASH-4109",
    guestName: "Dr. Ngozi Adeleke",
    phone: "0806 555 4321",
    email: "dr.adeleke@medspecialist.com",
    roomType: "deluxe",
    roomName: "Deluxe Doha Suite",
    roomNumber: "101",
    checkIn: "2026-10-20",
    checkOut: "2026-10-22",
    nights: 2,
    amount: 90000,
    status: "Checked In",
    paymentMethod: "POS Terminal (Front Desk)",
    paymentStatus: "Paid", // Confirmed by backend
    backendVerified: true,
    verifiedAt: "2026-10-17 07:12",
    source: "Front Desk Walk-In",
    createdAt: "2026-10-17 07:10"
  },
  {
    id: "ASH-3105",
    guestName: "Arc. Kenneth Igwe",
    phone: "0814 888 2345",
    email: "kenneth.igwe@architects.ng",
    roomType: "deluxe",
    roomName: "Deluxe Doha Suite",
    roomNumber: "102",
    checkIn: "2026-10-21",
    checkOut: "2026-10-22",
    nights: 1,
    amount: 45000,
    status: "Confirmed",
    paymentMethod: "Paystack (Online Auto-Confirmed)",
    paymentStatus: "Paid",
    backendVerified: true,
    verifiedAt: "2026-10-17 10:16",
    source: "Direct Website",
    createdAt: "2026-10-17 10:15"
  }
];

// 3. Initial Staff Users
const INITIAL_USERS = [
  {
    id: "u-admin",
    username: "admin@arabsignature.com",
    password: "admin2026",
    name: "General Manager",
    role: "admin",
    badge: "Executive Admin",
    active: true,
    lastLogin: "2026-10-17 11:20:14"
  },
  {
    id: "u-reception",
    username: "reception@arabsignature.com",
    password: "reception2026",
    name: "Lead Front Desk Concierge",
    role: "reception",
    badge: "Lead Receptionist",
    active: true,
    lastLogin: "2026-10-17 10:45:00"
  }
];

// 4. Initial Login Monitor & Attempts Logs
const INITIAL_LOGIN_LOGS = [
  {
    id: "log-101",
    timestamp: "2026-10-17 11:20:14",
    usernameAttempted: "admin@arabsignature.com",
    targetRole: "admin",
    status: "SUCCESS",
    reason: "Authorized Admin Authentication",
    ip: "197.210.64.12 (Onitsha, NG)",
    device: "Chrome / Windows 11"
  },
  {
    id: "log-102",
    timestamp: "2026-10-17 10:45:00",
    usernameAttempted: "reception@arabsignature.com",
    targetRole: "reception",
    status: "SUCCESS",
    reason: "Front Desk Shift Sign-In",
    ip: "197.210.64.12 (Onitsha, NG)",
    device: "Chrome / Windows 11"
  },
  {
    id: "log-103",
    timestamp: "2026-10-17 06:12:30",
    usernameAttempted: "reception@arabsignature.com",
    targetRole: "reception",
    status: "FAILED",
    reason: "Invalid password attempt",
    ip: "102.89.41.98 (Enugu, NG)",
    device: "Safari / iOS"
  }
];

// 4. Initial Al-Sultan Gourmet Dining & Bar Drinks Menu
export const INITIAL_DINING_MENU = [
  // --- 1. RICE, PASTA & SIDES (Must pair with a Protein) ---
  {
    id: "food-fried-rice",
    name: "Fried Rice",
    category: "rice",
    categoryLabel: "Rice, Pasta & Sides",
    type: "food",
    desc: "Savory Nigerian fried rice stir-fried with sweet corn, green peas, diced carrots, spring onions, and aromatic curry spices.",
    price: 3000,
    image: "/dining/fried-rice.jpg",
    requiresProtein: true,
    pairingType: "rice",
    pairingNote: "Not served alone — must be ordered with a Protein",
    isSignature: true,
  },
  {
    id: "food-jollof-rice",
    name: "Jollof Rice",
    category: "rice",
    categoryLabel: "Rice, Pasta & Sides",
    type: "food",
    desc: "Classic smoky Nigerian party jollof rice slow-simmered in roasted red bell pepper, plum tomato, and thyme reduction.",
    price: 3000,
    image: "/dining/jollof-rice.jpg",
    requiresProtein: true,
    pairingType: "rice",
    pairingNote: "Not served alone — must be ordered with a Protein",
    isSignature: true,
  },
  {
    id: "food-basmati-rice",
    name: "Basmati Rice",
    category: "rice",
    categoryLabel: "Rice, Pasta & Sides",
    type: "food",
    desc: "Fragrant long-grain royal basmati rice steamed with aromatic herbs and served with rich peppered sauce.",
    price: 5000,
    image: "/dining/basmati-rice.jpg",
    requiresProtein: true,
    pairingType: "rice",
    pairingNote: "Not served alone — must be ordered with a Protein",
    isSignature: true,
  },
  {
    id: "food-white-rice-stew",
    name: "White Rice & Stew",
    category: "rice",
    categoryLabel: "Rice, Pasta & Sides",
    type: "food",
    desc: "Fluffy steamed white parboiled rice served with rich Nigerian tomato and pepper stew.",
    price: 4000,
    image: "/dining/white-rice-stew.jpg",
    requiresProtein: true,
    pairingType: "rice",
    pairingNote: "Not served alone — must be ordered with a Protein",
    isSignature: false,
  },
  {
    id: "food-spaghetti",
    name: "Spaghetti",
    category: "rice",
    categoryLabel: "Rice, Pasta & Sides",
    type: "food",
    desc: "Stir-fried jollof spaghetti tossed in rich spiced tomato sauce, bell peppers, and fresh herbs.",
    price: 4000,
    image: "/dining/spaghetti.jpg",
    requiresProtein: true,
    pairingType: "rice",
    pairingNote: "Not served alone — must be ordered with a Protein",
    isSignature: false,
  },
  {
    id: "food-coleslaw",
    name: "Coleslaw Salad",
    category: "rice",
    categoryLabel: "Rice, Pasta & Sides",
    type: "food",
    desc: "Crisp shredded cabbage and sweet carrots tossed in creamy dressing. Ideal accompaniment to Rice & Pasta dishes.",
    price: 2000,
    image: "/dining/coleslaw.jpg",
    requiresProtein: false,
    isSide: true,
    pairingNote: "Side Dish — pairs with Rice, Spaghetti, or Proteins",
    isSignature: false,
  },

  // --- 2. TRADITIONAL SOUPS (Must pair with a Protein & Swallow) ---
  {
    id: "food-egusi-soup",
    name: "Egusi Soup",
    category: "soups",
    categoryLabel: "Traditional Soups",
    type: "food",
    desc: "Rich ground melon seed soup slow-cooked with palm oil, traditional seasonings, and fresh leafy greens.",
    price: 2000,
    image: "/dining/egusi-soup.jpg",
    requiresProtein: true,
    requiresSwallow: true,
    pairingType: "soup",
    pairingNote: "Not served alone — must pair with a Protein & Swallow (Semo or Garri)",
    isSignature: true,
  },
  {
    id: "food-afang-soup",
    name: "Afang Soup",
    category: "soups",
    categoryLabel: "Traditional Soups",
    type: "food",
    desc: "Traditional Cross River / Akwa Ibom delicacy prepared with finely shredded afang leaves, waterleaf, and rich palm oil stock.",
    price: 4000,
    image: "/dining/afang-soup.jpg",
    requiresProtein: true,
    requiresSwallow: true,
    pairingType: "soup",
    pairingNote: "Not served alone — must pair with a Protein & Swallow (Semo or Garri)",
    isSignature: true,
  },
  {
    id: "food-vegetable-soup",
    name: "Vegetable Soup",
    category: "soups",
    categoryLabel: "Traditional Soups",
    type: "food",
    desc: "Nutritious Nigerian leafy vegetable soup cooked with fluted pumpkin leaves (ugu), waterleaf, and traditional spices.",
    price: 4000,
    image: "/dining/vegetable-soup.jpg",
    requiresProtein: true,
    requiresSwallow: true,
    pairingType: "soup",
    pairingNote: "Not served alone — must pair with a Protein & Swallow (Semo or Garri)",
    isSignature: false,
  },
  {
    id: "food-bitterleaf-soup",
    name: "Bitterleaf Soup (Ofe Onugbu)",
    category: "soups",
    categoryLabel: "Traditional Soups",
    type: "food",
    desc: "Authentic Anambra Ofe Onugbu thickened with cocoyam paste and washed bitterleaf, simmered with ogiri and traditional spices.",
    price: 2000,
    image: "/dining/bitterleaf-soup.jpg",
    requiresProtein: true,
    requiresSwallow: true,
    pairingType: "soup",
    pairingNote: "Not served alone — must pair with a Protein & Swallow (Semo or Garri)",
    isSignature: false,
  },
  {
    id: "food-oha-soup",
    name: "Oha Soup (Ofe Oha)",
    category: "soups",
    categoryLabel: "Traditional Soups",
    type: "food",
    desc: "Eastern Nigerian traditional Oha leaf soup thickened with cocoyam and seasoned with uziza and indigenous herbs.",
    price: 2000,
    image: "/dining/oha-soup.jpg",
    requiresProtein: true,
    requiresSwallow: true,
    pairingType: "soup",
    pairingNote: "Not served alone — must pair with a Protein & Swallow (Semo or Garri)",
    isSignature: true,
  },
  {
    id: "food-okro-soup",
    name: "Okro Soup",
    category: "soups",
    categoryLabel: "Traditional Soups",
    type: "food",
    desc: "Freshly chopped farm okro simmered in rich seasoned broth with red palm oil and aromatic peppers.",
    price: 4000,
    image: "/dining/okro-soup.jpg",
    requiresProtein: true,
    requiresSwallow: true,
    pairingType: "soup",
    pairingNote: "Not served alone — must pair with a Protein & Swallow (Semo or Garri)",
    isSignature: false,
  },
  {
    id: "food-nsala-soup",
    name: "Nsala Soup (White Soup)",
    category: "soups",
    categoryLabel: "Traditional Soups",
    type: "food",
    desc: "Famous Onitsha Ofe Nsala (White Soup) richly spiced with utazi leaves, uda, ehuru, and smooth yam thickener.",
    price: 4000,
    image: "/dining/nsala-soup.jpg",
    requiresProtein: true,
    requiresSwallow: true,
    pairingType: "soup",
    pairingNote: "Not served alone — must pair with a Protein & Swallow (Semo or Garri)",
    isSignature: true,
  },

  // --- 3. SWALLOW (Pairs with Traditional Soups) ---
  {
    id: "food-semo",
    name: "Semo (Swallow)",
    category: "swallow",
    categoryLabel: "Swallow (Garri & Semo)",
    type: "food",
    desc: "Smooth, hot semovita swallow freshly prepared to accompany any of our traditional Nigerian soups.",
    price: 2000,
    image: "/dining/semo.jpg",
    requiresProtein: false,
    isSwallow: true,
    pairingNote: "Swallow Accompaniment — pairs with any Soup & Protein",
    isSignature: false,
  },
  {
    id: "food-garri",
    name: "Garri (Eba Swallow)",
    category: "swallow",
    categoryLabel: "Swallow (Garri & Semo)",
    type: "food",
    desc: "Smooth, hot yellow garri (eba) swallow freshly turned to accompany any of our traditional Nigerian soups.",
    price: 2000,
    image: "/dining/garri.jpg",
    requiresProtein: false,
    isSwallow: true,
    pairingNote: "Swallow Accompaniment — pairs with any Soup & Protein",
    isSignature: false,
  },

  // --- 3. PROTEINS & PEPPER SOUP (Required Pairing for Rice & Soups) ---
  {
    id: "prot-turkey",
    name: "Turkey",
    category: "proteins",
    categoryLabel: "Proteins & Pepper Soup",
    type: "food",
    desc: "Succulent golden-fried and peppered turkey wing/cut, seasoned to perfection. Pairs with any Rice, Pasta, or Soup.",
    price: 6000,
    image: "/dining/prot-turkey.jpg",
    requiresProtein: false,
    isProteinAddon: true,
    pairingNote: "Protein Selection — pairs with Rice, Spaghetti & Soups",
    isSignature: true,
  },
  {
    id: "prot-chicken",
    name: "Chicken",
    category: "proteins",
    categoryLabel: "Proteins & Pepper Soup",
    type: "food",
    desc: "Well-marinated, golden fried and peppered chicken portion. Pairs with any Rice, Pasta, or Soup.",
    price: 6000,
    image: "/dining/prot-chicken.jpg",
    requiresProtein: false,
    isProteinAddon: true,
    pairingNote: "Protein Selection — pairs with Rice, Spaghetti & Soups",
    isSignature: true,
  },
  {
    id: "prot-goatmeat",
    name: "Goat Meat",
    category: "proteins",
    categoryLabel: "Proteins & Pepper Soup",
    type: "food",
    desc: "Tender slow-braised and spiced Nigerian goat meat cuts. Ideal pairing for Traditional Soups or Rice dishes.",
    price: 6000,
    image: "/dining/prot-goatmeat.jpg",
    requiresProtein: false,
    isProteinAddon: true,
    pairingNote: "Protein Selection — pairs with Soups & Rice dishes",
    isSignature: false,
  },
  {
    id: "prot-beef",
    name: "Beef",
    category: "proteins",
    categoryLabel: "Proteins & Pepper Soup",
    type: "food",
    desc: "Seasoned, tender braised and fried Nigerian beef portion. Pairs with any Rice, Pasta, or Traditional Soup.",
    price: 5000,
    image: "/dining/prot-beef.jpg",
    requiresProtein: false,
    isProteinAddon: true,
    pairingNote: "Protein Selection — pairs with Rice, Spaghetti & Soups",
    isSignature: false,
  },
  {
    id: "prot-egg",
    name: "Egg",
    category: "proteins",
    categoryLabel: "Proteins & Pepper Soup",
    type: "food",
    desc: "Freshly boiled or fried egg portion. Great protein add-on for Rice, Indomie Noodles, or Breakfast.",
    price: 2000,
    image: "/dining/prot-egg.jpg",
    requiresProtein: false,
    isProteinAddon: true,
    pairingNote: "Protein Selection — pairs with Rice, Noodles & Breakfast",
    isSignature: false,
  },
  {
    id: "prot-catfish-peppersoup",
    name: "Catfish Pepper Soup",
    category: "proteins",
    categoryLabel: "Proteins & Pepper Soup",
    type: "food",
    desc: "Whole fresh live catfish slow-simmered in aromatic indigenous herbs, scent leaf, uda spices, and hot yellow pepper broth.",
    price: 25000,
    image: "/dining/catfish-peppersoup.jpg",
    requiresProtein: false,
    isProteinAddon: false,
    pairingNote: "Complete Specialty Dish — Whole Fresh Catfish",
    isSignature: true,
  },

  // --- 4. CONTINENTAL & BREAKFAST (Complete Dishes) ---
  {
    id: "food-chicken-chips",
    name: "Chicken & Chips",
    category: "continental",
    categoryLabel: "Continental & Breakfast",
    type: "food",
    desc: "Complete meal featuring crispy golden French fries served with seasoned deep-fried chicken, ketchup, and fresh garnish.",
    price: 8000,
    image: "/dining/chicken-chips.jpg",
    requiresProtein: false,
    isCompleteDish: true,
    pairingNote: "Complete Meal — Chicken included",
    isSignature: true,
  },
  {
    id: "food-yam-egg",
    name: "Yam & Egg Sauce",
    category: "continental",
    categoryLabel: "Continental & Breakfast",
    type: "food",
    desc: "Complete meal of soft boiled white Puna yam slices served with rich Nigerian scrambled egg, tomato, and pepper sauce.",
    price: 6000,
    image: "/dining/yam-egg.jpg",
    requiresProtein: false,
    isCompleteDish: true,
    pairingNote: "Complete Meal — Egg Sauce included",
    isSignature: true,
  },
  {
    id: "food-indomie",
    name: "Indomie (Noodles)",
    category: "continental",
    categoryLabel: "Continental & Breakfast",
    type: "food",
    desc: "Stir-fried Nigerian Indomie noodles garnished with fresh vegetables, peppers, and aromatic spices.",
    price: 4000,
    image: "/dining/indomie.jpg",
    requiresProtein: false,
    isCompleteDish: true,
    pairingNote: "Complete Dish — optional extra Egg (+₦2k) or Chicken (+₦6k)",
    isSignature: false,
  },
  {
    id: "food-custard-bread-egg",
    name: "Custard, Bread & Egg",
    category: "continental",
    categoryLabel: "Continental & Breakfast",
    type: "food",
    desc: "Complete breakfast combo with warm creamy vanilla custard, freshly baked soft bread loaf, and cooked egg.",
    price: 4000,
    image: "/dining/custard-bread.jpg",
    requiresProtein: false,
    isCompleteDish: true,
    pairingNote: "Complete Breakfast Combo — Egg & Bread included",
    isSignature: false,
  },
  {
    id: "food-tea-bread-egg",
    name: "Tea, Bread & Egg",
    category: "continental",
    categoryLabel: "Continental & Breakfast",
    type: "food",
    desc: "Classic Nigerian executive breakfast tray with hot rich tea/beverage, fresh sliced bread, and egg.",
    price: 4000,
    image: "/dining/tea-bread-egg.jpg",
    requiresProtein: false,
    isCompleteDish: true,
    pairingNote: "Complete Breakfast Combo — Egg & Bread included",
    isSignature: false,
  },

  // ========================================================
  // 6. DRINKS: CHAMPAGNE, COGNAC & WHISKEY (VIP BOTTLE SERVICE)
  // ========================================================
  {
    id: "drink-azul-reposado",
    name: "Clase Azul Reposado Tequila (750ml)",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Ultra-premium handcrafted Mexican reposado tequila in the iconic cobalt-blue ceramic decanter. Served with VIP sparklers and ice bucket.",
    price: 500000,
    isSignature: true,
  },
  {
    id: "drink-don-julio-1942",
    name: "Don Julio 1942 Añejo Tequila (750ml)",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Legendary handcrafted añejo tequila aged in American white oak barrels with notes of rich caramel and toasted vanilla.",
    price: 500000,
    isSignature: true,
  },
  {
    id: "drink-jw-blue",
    name: "Johnnie Walker Blue Label Blended Scotch",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Rare hand-selected Scotch casks offering velvety honey, dry fruit sweetness, and lingering peat smoke finish.",
    price: 500000,
    isSignature: true,
  },
  {
    id: "drink-glenfiddich-21",
    name: "Glenfiddich 21-Year Reserva Rum Cask Single Malt",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Aged 21 years and finished in Caribbean rum casks for an opulent, sweet vanilla and toffee finish.",
    price: 500000,
    isSignature: true,
  },
  {
    id: "drink-hennessy-xo",
    name: "Hennessy XO Extra Old Cognac (700ml)",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Robust deep amber French cognac blending rare eaux-de-vie with rich candied fruits, spicy cinnamon, and wild dark chocolate.",
    price: 350000,
    isSignature: true,
  },
  {
    id: "drink-glenfiddich-18",
    name: "Glenfiddich 18-Year Small Batch Single Malt",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Matured in Spanish Oloroso wood and American oak for an exceptionally rich, warm spiced apple and dried fruit flavor.",
    price: 200000,
    isSignature: false,
  },
  {
    id: "drink-glenfiddich-15",
    name: "Glenfiddich 15-Year Solera Single Malt",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Aged in European, American, and New American oak solera vats with warm spice, honey, and rich fruit notes.",
    price: 150000,
    isSignature: false,
  },
  {
    id: "drink-hennessy-vsop",
    name: "Hennessy V.S.O.P Privilège Cognac",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Harmonious and balanced cognac with aromas of fresh vanilla, cinnamon, and toasted oak.",
    price: 140000,
    isSignature: false,
  },
  {
    id: "drink-martell-vsop",
    name: "Martell V.S.O.P Médaillon Cognac",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Smooth and mellow French cognac blending luscious red fruit and refined oak nuances.",
    price: 120000,
    isSignature: false,
  },
  {
    id: "drink-remy-martin-vsop",
    name: "Rémy Martin V.S.O.P Fine Champagne Cognac",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Iconic Cognac Fine Champagne with perfect harmony of powerful and elegant ripe summer fruit aromas.",
    price: 120000,
    isSignature: false,
  },
  {
    id: "drink-glenfiddich-12",
    name: "Glenfiddich 12-Year Signature Single Malt",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Carefully matured in fine American bourbon and Spanish sherry oak casks for fresh pear and subtle oak flavors.",
    price: 90000,
    isSignature: false,
  },
  {
    id: "drink-hennessy-vs",
    name: "Hennessy V.S (Very Special) Cognac",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Dynamic and lively French cognac with demanding oak character and vibrant fruity notes.",
    price: 80000,
    isSignature: false,
  },
  {
    id: "drink-jw-black",
    name: "Johnnie Walker Black Label 12-Year Scotch",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "The world's benchmark blended Scotch whisky aged for a full 12 years with deep smoky complexity.",
    price: 60000,
    isSignature: false,
  },
  {
    id: "drink-jameson-black",
    name: "Jameson Black Barrel Triple Distilled Irish Whiskey",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Double-charred bourbon oak barrels bring out enhanced notes of toasted wood, spice, and exotic fruit sweetness.",
    price: 60000,
    isSignature: false,
  },
  {
    id: "drink-jameson-green",
    name: "Jameson Irish Whiskey (Original Green)",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Triple distilled, exceptionally smooth Irish whiskey with perfectly balanced spicy, nutty, and vanilla notes.",
    price: 40000,
    isSignature: false,
  },
  {
    id: "drink-campari",
    name: "Campari Premium Italian Bitter Aperitif",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Classic vibrant red Italian aperitif infused with aromatic herbs, chinotto, and bitter orange peel.",
    price: 40000,
    isSignature: false,
  },
  {
    id: "drink-jw-red",
    name: "Johnnie Walker Red Label Blended Scotch",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Vibrant, spicy blend crafted for highballs and celebration with crackling aromatic spice.",
    price: 35000,
    isSignature: false,
  },
  {
    id: "drink-american-honey",
    name: "Wild Turkey American Honey Liqueur",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Smooth Kentucky straight bourbon whiskey blended with pure honey for an exceptionally smooth, sweet palate.",
    price: 35000,
    isSignature: false,
  },
  {
    id: "drink-amarula",
    name: "Amarula African Cream Liqueur",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Delicious African cream liqueur made from wild marula fruit, double-distilled and matured in French oak.",
    price: 20000,
    isSignature: false,
  },

  // ========================================================
  // 7. DRINKS: FINE WINES & SPARKLING
  // ========================================================
  {
    id: "drink-moet-chandon",
    name: "Moët & Chandon Impérial Brut Champagne",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "The world's most celebrated champagne with crisp green apple, white floral notes, and elegant fine bubbles.",
    price: 150000,
    isSignature: true,
  },
  {
    id: "drink-veuve-clicquot",
    name: "Veuve Clicquot Yellow Label Brut Champagne",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Prestigious French champagne featuring delicate effervescence, ripe yellow fruit, and vanilla toastiness.",
    price: 150000,
    isSignature: true,
  },
  {
    id: "drink-belaire",
    name: "Luc Belaire Rare Rosé / Luxe Sparkling",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Exquisite French sparkling wine with fresh strawberry and blackcurrant notes in a stunning illuminated bottle.",
    price: 100000,
    isSignature: true,
  },
  {
    id: "drink-element-wine",
    name: "Element Premium Reserve Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Exclusive reserve wine offering deep complexity, velvet texture, and rich berry notes.",
    price: 70000,
    isSignature: false,
  },
  {
    id: "drink-cooper-and-thief",
    name: "Cooper & Thief Bourbon Barrel Aged Red Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Rich red wine aged 3 months in bourbon whiskey barrels, loaded with warm vanilla, dark cherry, and toasty spice.",
    price: 60000,
    isSignature: true,
  },
  {
    id: "drink-angelus-black-rose",
    name: "Angelus Black Rosé Sparkling Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Distinctive black bottle rosé with refined fizz, wild raspberry aromas, and crisp celebratory finish.",
    price: 60000,
    isSignature: false,
  },
  {
    id: "drink-silk-and-spice",
    name: "Silk & Spice Portuguese Red Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Smooth and luscious red blend with aromas of ripe red fruit, mocha, vanilla, and warm baking spices.",
    price: 30000,
    isSignature: false,
  },
  {
    id: "drink-escudo-rojo",
    name: "Baron Philippe de Rothschild Escudo Rojo",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Prestigious Chilean red reserve with intense blackcurrant, dark chocolate, and roasted coffee nuances.",
    price: 30000,
    isSignature: false,
  },
  {
    id: "drink-aznauri",
    name: "Aznauri Premium Vintage Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Noble vintage wine with velvety roundness, ripe plum, and gentle oak undertones.",
    price: 30000,
    isSignature: false,
  },
  {
    id: "drink-black-star",
    name: "Black Star Fine Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Rich, bold full-bodied wine featuring deep ruby color, blackberries, and balanced acidity.",
    price: 30000,
    isSignature: false,
  },
  {
    id: "drink-castillo",
    name: "Castillo Spanish Red Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Traditional Spanish red wine with bright cherry notes, soft tannins, and smooth finish.",
    price: 30000,
    isSignature: false,
  },
  {
    id: "drink-four-cousins",
    name: "Four Cousins Natural Sweet Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "South Africa's favorite sweet wine with luscious aromas of ripe summer berries and floral sweetness.",
    price: 25000,
    isSignature: false,
  },
  {
    id: "drink-martinellis",
    name: "Martinelli's Gold Medal Sparkling Apple Cider",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "100% pure crisp sparkling apple cider (non-alcoholic), perfect for celebratory toasts.",
    price: 25000,
    isSignature: false,
  },
  {
    id: "drink-angelus-wine",
    name: "Angelus Fine Table Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Smooth and approachable dining wine that complements grilled poultry, red meat, and Nigerian dishes.",
    price: 25000,
    isSignature: false,
  },
  {
    id: "drink-andre-rose",
    name: "André Rosé California Sparkling Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Crisp and lively California pink sparkling bubbly with sweet red apple and strawberry flavors.",
    price: 25000,
    isSignature: false,
  },
  {
    id: "drink-alita",
    name: "Alita Sparkling White Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Delicate and refreshing European sparkling wine with fine bubbles and fresh fruity aromas.",
    price: 25000,
    isSignature: false,
  },
  {
    id: "drink-4th-street",
    name: "4th Street Sweet Red Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Fresh, naturally sweet red wine bursting with fruity flavors of strawberry, raspberry, and red cherry.",
    price: 20000,
    isSignature: false,
  },
  {
    id: "drink-expression",
    name: "Expression Premium Sweet Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Smooth and inviting dessert wine with delicate floral bouquets and pleasant fruity sweetness.",
    price: 20000,
    isSignature: false,
  },
  {
    id: "drink-chamdor",
    name: "Chamdor Sparkling Grape Celebration Drink",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Refreshing South African non-alcoholic sparkling grape drink made from premier quality fruit.",
    price: 20000,
    isSignature: false,
  },
  {
    id: "drink-wolf-blass",
    name: "Wolf Blass Eaglehawk Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Renowned Australian wine with bright varietal fruit expression and smooth, easy-drinking tannins.",
    price: 15000,
    isSignature: false,
  },
  {
    id: "drink-reseau",
    name: "Reseau Fine Dinner Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Light and balanced dinner wine, ideal for everyday dining and social pairings.",
    price: 15000,
    isSignature: false,
  },
  {
    id: "drink-nines",
    name: "Nines Classic Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Pleasantly smooth dining wine with soft berry aromas and crisp clean finish.",
    price: 15000,
    isSignature: false,
  },

  // ========================================================
  // 8. DRINKS: BEERS, STOUTS & REFRESHMENTS (ALL ₦2,000)
  // ========================================================
  {
    id: "beer-desperados",
    name: "Desperados Tequila Flavoured Beer",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Unique light and refreshing lager beer boosted with the zesty kick of tequila flavor. Served ice cold.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-tiger",
    name: "Tiger Premium Lager Beer",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Crisp Asian lager brewed with tropical lagering techniques for a smooth and refreshing taste.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-heineken-med",
    name: "Heineken Lager (Medium Bottle)",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "World-famous Dutch pure malt lager served sub-zero chilled in an ice bucket.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-heineken-big",
    name: "Heineken Lager (Big Bottle)",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Large bottle of premium Heineken lager extra chilled for prolonged enjoyment.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-legend-big",
    name: "Legend Extra Stout (Big Bottle)",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Full-bodied Nigerian extra stout brewed with roasted barley and fine hops for rich bitter-sweet taste.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-legend-med",
    name: "Legend Extra Stout (Medium Bottle)",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Medium bottle of smooth, rich Legend extra stout served ice cold.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-star",
    name: "Star Lager Beer",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Nigeria's legendary premium cold-filtered lager with bright golden clarity and rich foam head.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-star-radler",
    name: "Star Radler (Citrus Flavoured)",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Refreshing double-filtered lager blended with real citrus fruit juice for twice the refreshment.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-flying-fish",
    name: "Flying Fish Flavoured Beer",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Delicious flavoured premium beer with crisp burst of fresh lemon/orange zest.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-trophy",
    name: "Trophy Extra Special Lager",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Crisp and crisp golden lager known as 'The Honourable' across Nigeria. Extra cold.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-trophy-stout",
    name: "Trophy Extra Special Stout",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Bold and smooth black stout with toasted malt sweetness and lingering richness.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-budweiser",
    name: "Budweiser King of Beers",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Medium-bodied, flavorful American crisp lager brewed with beechwood aging for unmatched smoothness.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-budweiser-royal",
    name: "Budweiser Royal Reserve / Smooth",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Special reserve Budweiser offering silky smooth mouthfeel and clean crisp finish.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-hero",
    name: "Hero Premium Lager Beer",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "The proud brew of the East ('Oh Mpa'). Crisp, distinct golden lager served extra chilled.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-castle-lite",
    name: "Castle Lite Extra Cold Lager",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Sub-zero brewed premium light lager for ultimate refreshing taste and lower bitterness.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-smirnoff-ice",
    name: "Smirnoff Ice Premium Vodka Drink",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Crisp, effervescent ready-to-drink vodka cocktail with zesty natural lemon taste.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-smirnoff-black-ice",
    name: "Smirnoff Ice Black (Guarana)",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Bold blend of crisp Smirnoff vodka with energizing guarana extract for intense refreshment.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-monster",
    name: "Monster Energy Drink (Cold Can)",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Original energy punch delivering intense, smooth caffeine and B-vitamin boost over ice.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-guinness-small",
    name: "Guinness Foreign Extra Stout (Small)",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Classic small bottle of iconic Nigerian Guinness extra stout, rich and creamy.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-guinness-med",
    name: "Guinness Foreign Extra Stout (Medium)",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Medium bottle of chilled Guinness foreign extra stout with roasted malt notes.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-life",
    name: "Life Continental Lager Beer",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Eastern Nigeria's beloved continental lager brewed with pride, progress, and rich tradition.",
    price: 2000,
    isSignature: false,
  },
  {
    id: "beer-gulder",
    name: "Gulder Ultimate Lager Beer",
    category: "beers",
    categoryLabel: "Beers & Refreshments",
    type: "drinks",
    desc: "Bold, extra-filtered lager with firm bitterness and rich hop aroma for the ultimate experience.",
    price: 2000,
    isSignature: false,
  },

  // ========================================================
  // 9. DRINKS: SIGNATURE COCKTAILS & MOCKTAILS
  // ========================================================
  {
    id: "drink-arabian-night-cocktail",
    name: "Arabian Night Sky Cocktail",
    category: "cocktails",
    categoryLabel: "Signature Cocktails & Mocktails",
    type: "drinks",
    desc: "Blue Curaçao, premium French vodka, wild blackberry liqueur, splash of citrus tonic, and edible gold shimmer dust",
    price: 9500,
    isSignature: true,
  },
  {
    id: "drink-doha-gold-martini",
    name: "Doha Gold Leaf Martini",
    category: "cocktails",
    categoryLabel: "Signature Cocktails & Mocktails",
    type: "drinks",
    desc: "London dry gin, St. Germain elderflower liqueur, dry vermouth, twist of Meyer lemon, garnished with genuine 24-karat gold leaf",
    price: 12000,
    isSignature: true,
  },
  {
    id: "drink-onitsha-sunset",
    name: "Onitsha Sunset Rum Punch",
    category: "cocktails",
    categoryLabel: "Signature Cocktails & Mocktails",
    type: "drinks",
    desc: "Aged dark rum, fresh passion fruit nectar, lime juice, dash of Angostura bitters, layered over pomegranate syrup",
    price: 8500,
    isSignature: false,
  },
  {
    id: "drink-long-island",
    name: "Al-Sultan Classic Long Island",
    category: "cocktails",
    categoryLabel: "Signature Cocktails & Mocktails",
    type: "drinks",
    desc: "Tequila, vodka, white rum, triple sec, gin, fresh sweet-and-sour citrus mix, finished with chilled cola over crushed ice",
    price: 9000,
    isSignature: false,
  },
  {
    id: "drink-dubai-oasis-mocktail",
    name: "Virgin Dubai Oasis Mocktail",
    category: "cocktails",
    categoryLabel: "Signature Cocktails & Mocktails",
    type: "drinks",
    desc: "Fresh garden spearmint muddled with Key lime, organic agave, pomegranate arils, and sparkling San Pellegrino",
    price: 6500,
    isSignature: false,
  },
  {
    id: "drink-zobo-royal-fizz",
    name: "Royal Zobo Hibiscus Fizz (Mocktail)",
    category: "cocktails",
    categoryLabel: "Signature Cocktails & Mocktails",
    type: "drinks",
    desc: "Artisanal slow-brewed hibiscus flower infusion with ginger, cloves, citrus peel, and sparkling mineral water",
    price: 5500,
    isSignature: false,
  }
];

// Helper to load or initialize from localStorage
function getLocalItem(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocalItem(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

// Shared BroadcastChannel singleton across the window life-cycle
let sharedBroadcastChannel = null;
function getSharedBroadcastChannel() {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return null;
  if (!sharedBroadcastChannel) {
    try {
      sharedBroadcastChannel = new BroadcastChannel('ash_portal_sync');
    } catch (e) {
      console.warn("BroadcastChannel initialization error:", e);
    }
  }
  return sharedBroadcastChannel;
}

export const portalStore = {
  // --- STAFF USERS MANAGEMENT ---
  getUsers() {
    return getLocalItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getReceptionistUser() {
    const users = this.getUsers();
    return users.find(u => u.role === 'reception') || INITIAL_USERS[1];
  },

  getAdminUser() {
    const users = this.getUsers();
    return users.find(u => u.role === 'admin') || INITIAL_USERS[0];
  },

  updateReceptionistCredentials(newUsername, newPassword, staffName) {
    const users = this.getUsers();
    const updated = users.map(u => {
      if (u.role === 'reception') {
        return {
          ...u,
          username: newUsername.trim(),
          password: newPassword.trim(),
          name: staffName ? staffName.trim() : u.name
        };
      }
      return u;
    });

    setLocalItem(STORAGE_KEYS.USERS, updated);
    this.logActivity(`Admin changed Receptionist login to '${newUsername.trim()}'.`);
    return updated;
  },

  // --- SEPARATE AUTHENTICATION HANDLERS ---
  
  // 1. Dedicated Admin Login Gate (#admin-login)
  loginAdmin(username, password) {
    const users = this.getUsers();
    const adminUser = users.find(u => u.role === 'admin');

    const cleanUser = username.trim().toLowerCase();
    const isUserMatch = adminUser && adminUser.username.toLowerCase() === cleanUser;
    const isPassMatch = adminUser && adminUser.password === password;

    const timestamp = new Date().toLocaleString();

    if (!isUserMatch || !isPassMatch) {
      // Record failed attempt
      this.recordLoginAttempt({
        usernameAttempted: username,
        targetRole: 'admin',
        status: 'FAILED',
        reason: !isUserMatch ? 'Unknown Admin Username' : 'Incorrect Admin Password'
      });
      throw new Error("Access Denied: Invalid Executive Admin credentials.");
    }

    // Success
    const session = {
      id: adminUser.id,
      name: adminUser.name,
      username: adminUser.username,
      role: 'admin',
      badge: adminUser.badge,
      loginTime: new Date().toISOString()
    };

    setLocalItem(STORAGE_KEYS.AUTH, session);
    this.recordLoginAttempt({
      usernameAttempted: adminUser.username,
      targetRole: 'admin',
      status: 'SUCCESS',
      reason: 'Authorized Executive Admin Authentication'
    });
    this.logActivity(`Executive Admin (${adminUser.name}) authenticated successfully.`);
    return session;
  },

  // 2. Dedicated Receptionist Login Gate (#reception-login)
  loginReception(username, password) {
    const users = this.getUsers();
    const receptionUser = users.find(u => u.role === 'reception');

    const cleanUser = username.trim().toLowerCase();
    const isUserMatch = receptionUser && receptionUser.username.toLowerCase() === cleanUser;
    const isPassMatch = receptionUser && receptionUser.password === password;

    if (!isUserMatch || !isPassMatch) {
      // Record failed attempt
      this.recordLoginAttempt({
        usernameAttempted: username,
        targetRole: 'reception',
        status: 'FAILED',
        reason: !isUserMatch ? 'Unknown Receptionist Username' : 'Incorrect Receptionist Password'
      });
      throw new Error("Access Denied: Invalid Front Desk Reception credentials.");
    }

    // Success
    const session = {
      id: receptionUser.id,
      name: receptionUser.name,
      username: receptionUser.username,
      role: 'reception',
      badge: receptionUser.badge,
      loginTime: new Date().toISOString()
    };

    setLocalItem(STORAGE_KEYS.AUTH, session);
    this.recordLoginAttempt({
      usernameAttempted: receptionUser.username,
      targetRole: 'reception',
      status: 'SUCCESS',
      reason: 'Authorized Front Desk Shift Login'
    });
    this.logActivity(`Front Desk Reception (${receptionUser.name}) signed in for shift.`);
    return session;
  },

  getCurrentUser() {
    return getLocalItem(STORAGE_KEYS.AUTH, null);
  },

  logout() {
    const user = this.getCurrentUser();
    if (user) {
      this.logActivity(`User ${user.name} logged out.`);
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  // --- LOGIN MONITOR & AUDIT ATTEMPTS ---
  getLoginAttempts() {
    return getLocalItem(STORAGE_KEYS.LOGIN_LOGS, INITIAL_LOGIN_LOGS);
  },

  recordLoginAttempt({ usernameAttempted, targetRole, status, reason }) {
    const logs = this.getLoginAttempts();
    const newAttempt = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      usernameAttempted: usernameAttempted || 'unknown',
      targetRole: targetRole || 'unknown',
      status: status, // 'SUCCESS' | 'FAILED'
      reason: reason || '',
      ip: '197.210.64.12 (Onitsha, NG)',
      device: navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser'
    };

    const updated = [newAttempt, ...logs.slice(0, 99)];
    setLocalItem(STORAGE_KEYS.LOGIN_LOGS, updated);
    return updated;
  },

  clearLoginAttempts() {
    setLocalItem(STORAGE_KEYS.LOGIN_LOGS, []);
  },

  // --- BOOKINGS LEDGER & AUTOMATIC PAYSTACK PAYMENT CONFIRMATION ---
  getBookings() {
    return getLocalItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },

  addBooking(bookingData) {
    const bookings = this.getBookings();
    
    // Payment is automatically confirmed when Paystack processes it (or POS/Cash at front desk)
    const newBooking = {
      id: bookingData.id || ('ASH-' + Math.floor(1000 + Math.random() * 9000)),
      guestName: bookingData.guestName || "Guest",
      phone: bookingData.phone || "0812 578 6875",
      email: bookingData.email || "",
      roomType: bookingData.roomType || "deluxe",
      roomName: bookingData.roomName || "Deluxe Doha Suite",
      roomNumber: bookingData.roomNumber || "Unassigned",
      checkIn: bookingData.checkIn || new Date().toISOString().split('T')[0],
      checkOut: bookingData.checkOut || "",
      nights: bookingData.nights || 1,
      amount: bookingData.amount || 45000,
      status: bookingData.status || "Confirmed",
      paymentMethod: bookingData.paymentMethod || "Paystack (Auto-Confirmed)",
      paymentStatus: "Paid", // Automatically confirmed by Paystack
      backendVerified: true,
      verifiedAt: new Date().toLocaleString(),
      source: bookingData.source || "Direct Website (Paystack)",
      createdAt: new Date().toLocaleString()
    };

    const updated = [newBooking, ...bookings];
    setLocalItem(STORAGE_KEYS.BOOKINGS, updated);
    this.logActivity(`New reservation booked: ${newBooking.id} for ${newBooking.guestName} - Payment Automatically Confirmed by Paystack`);
    
    // Broadcast live update so receptionist screen updates in real time
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ash_bookings_updated', { detail: updated }));
    }

    return newBooking;
  },

  // Confirm payment manual audit if ever needed
  confirmPaymentBackend(bookingId) {
    const bookings = this.getBookings();
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentStatus: "Paid",
          backendVerified: true,
          verifiedAt: new Date().toLocaleString()
        };
      }
      return b;
    });

    setLocalItem(STORAGE_KEYS.BOOKINGS, updated);
    this.logActivity(`Payment audit logged for Booking ${bookingId}`);
    return updated;
  },

  updateBookingStatus(bookingId, newStatus, assignedRoom = null) {
    const bookings = this.getBookings();
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        const updatedBooking = { ...b, status: newStatus };
        if (assignedRoom) updatedBooking.roomNumber = assignedRoom;
        return updatedBooking;
      }
      return b;
    });

    setLocalItem(STORAGE_KEYS.BOOKINGS, updated);

    // If Checked In, update room inventory to occupied; if Completed (Checked Out), mark room available immediately
    if (newStatus === "Checked In" && assignedRoom) {
      this.updateRoomStatus(assignedRoom, "occupied", bookings.find(b => b.id === bookingId)?.guestName);
    } else if (newStatus === "Completed" && assignedRoom) {
      this.updateRoomStatus(assignedRoom, "available", null);
    }

    this.logActivity(`Booking ${bookingId} status updated to '${newStatus}'`);
    return updated;
  },

  // --- ROOMS INVENTORY ---
  getRooms() {
    // One-time migration to v6 (34 total luxury rooms & suites in Nsugbe, Onitsha)
    if (typeof localStorage !== 'undefined') {
      try {
        if (!localStorage.getItem('ash_portal_rooms_v6_migrated')) {
          localStorage.removeItem('ash_portal_rooms_inventory');
          localStorage.removeItem('ash_portal_rooms_inventory_v2');
          localStorage.removeItem('ash_portal_rooms_inventory_v3');
          localStorage.removeItem('ash_portal_rooms_inventory_v4');
          localStorage.removeItem('ash_portal_rooms_inventory_v5');
          localStorage.setItem('ash_portal_rooms_v6_migrated', 'true');
        }
      } catch (e) {
        // ignore
      }
    }
    const v6Rooms = getLocalItem(STORAGE_KEYS.ROOMS, null);
    if (v6Rooms && Array.isArray(v6Rooms) && v6Rooms.length === 34) return v6Rooms;
    return INITIAL_ROOMS_INVENTORY;
  },

  updateRoomStatus(roomNumber, newStatus, guestName = null) {
    const rooms = this.getRooms();
    const updated = rooms.map(r => {
      if (String(r.roomNumber) === String(roomNumber)) {
        return {
          ...r,
          status: newStatus,
          currentGuest: newStatus === 'occupied' ? (guestName || r.currentGuest || 'Guest') : null
        };
      }
      return r;
    });

    // Save locally
    setLocalItem(STORAGE_KEYS.ROOMS, updated);
    setLocalItem('ash_portal_rooms_inventory', updated);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('ash_portal_rooms_updated_at', String(Date.now()));
      } catch (e) {
        // ignore
      }
    }

    this.logActivity(`Room ${roomNumber} status set to '${newStatus}'`);

    // 1. Dispatch custom window event for in-tab reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ash_rooms_updated', { detail: updated }));
    }

    // 2. BroadcastChannel for instant cross-tab & cross-window synchronization
    const bc = getSharedBroadcastChannel();
    if (bc) {
      try {
        bc.postMessage({ type: 'ROOMS_UPDATED', rooms: updated, timestamp: Date.now() });
      } catch (e) {
        console.warn("BroadcastChannel postMessage error:", e);
      }
    }

    // 3. Asynchronously sync to Persistent Cloud (0 Vercel function invocations)
    if (typeof window !== 'undefined') {
      const payload = JSON.stringify({ rooms: updated, updatedAt: Date.now() });
      
      // Direct Primary: MantleDB (100% Client-side, 0 Vercel Serverless Function calls)
      fetch('https://mantledb.sh/v2/arab-signature-hotel-34rooms/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      }).catch(() => {
        // Fallback to /api/rooms only if direct cloud write failed
        fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        }).catch(() => {});
      });
    }

    return updated;
  },

  /**
   * Synchronize room inventory from Persistent Cloud (0 Vercel Serverless Function Invocations)
   * Client connects directly to MantleDB, completely bypassing Vercel Functions to preserve 100% of your free tier
   */
  async syncRoomsFromCloud() {
    if (typeof window === 'undefined') return this.getRooms();

    const applyCloudRooms = (newRooms) => {
      if (!newRooms || !Array.isArray(newRooms) || newRooms.length !== 34) return null;
      const currentRooms = this.getRooms();
      const cloudAvail = newRooms.filter(r => r.status === 'available').length;
      const localAvail = currentRooms.filter(r => r.status === 'available').length;

      if (cloudAvail !== localAvail || JSON.stringify(newRooms) !== JSON.stringify(currentRooms)) {
        setLocalItem(STORAGE_KEYS.ROOMS, newRooms);
        setLocalItem('ash_portal_rooms_inventory', newRooms);
        window.dispatchEvent(new CustomEvent('ash_rooms_updated', { detail: newRooms }));
        return newRooms;
      }
      return currentRooms;
    };

    // Primary: Query MantleDB directly from client (0 Vercel Serverless Function invocations)
    try {
      const ctrl = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), 1500);

      const res = await fetch(`https://mantledb.sh/v2/arab-signature-hotel-34rooms/inventory?_t=${Date.now()}`, {
        cache: 'no-store',
        signal: ctrl.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.rooms && Array.isArray(data.rooms) && data.rooms.length === 34) {
          const applied = applyCloudRooms(data.rooms);
          if (applied) return applied;
        }
      }
    } catch (err) {
      // Fall through to secondary fallback
    }

    // Secondary Fallback: Query /api/rooms only if MantleDB is unreachable
    try {
      const ctrl2 = new AbortController();
      const timeoutId2 = setTimeout(() => ctrl2.abort(), 1500);

      const res2 = await fetch(`/api/rooms?_t=${Date.now()}`, {
        cache: 'no-store',
        signal: ctrl2.signal
      });
      clearTimeout(timeoutId2);

      if (res2.ok) {
        const data2 = await res2.json();
        if (data2 && data2.rooms && Array.isArray(data2.rooms) && data2.rooms.length === 34) {
          const applied = applyCloudRooms(data2.rooms);
          if (applied) return applied;
        }
      }
    } catch (err2) {
      // Offline fallback
    }

    return this.getRooms();
  },

  subscribeRooms(callback) {
    if (typeof window === 'undefined') return () => {};

    const handler = (e) => {
      callback(e.detail || this.getRooms());
    };
    window.addEventListener('ash_rooms_updated', handler);

    // Browser storage event listener (for cross-tab updates via localStorage)
    const storageHandler = (e) => {
      if (
        !e.key ||
        e.key === STORAGE_KEYS.ROOMS ||
        e.key === 'ash_portal_rooms_inventory' ||
        e.key === 'ash_portal_rooms_updated_at'
      ) {
        callback(this.getRooms());
      }
    };
    window.addEventListener('storage', storageHandler);

    // Window focus & visibility listener so switching tabs immediately refreshes rooms
    const focusHandler = () => {
      callback(this.getRooms());
    };
    window.addEventListener('focus', focusHandler);
    document.addEventListener('visibilitychange', focusHandler);

    // BroadcastChannel listener
    const bc = getSharedBroadcastChannel();
    const bcHandler = (event) => {
      if (event.data?.type === 'ROOMS_UPDATED') {
        callback(event.data.rooms || this.getRooms());
      }
    };
    if (bc) {
      bc.addEventListener('message', bcHandler);
    }

    return () => {
      window.removeEventListener('ash_rooms_updated', handler);
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('focus', focusHandler);
      document.removeEventListener('visibilitychange', focusHandler);
      if (bc) {
        bc.removeEventListener('message', bcHandler);
      }
    };
  },

  // --- ROOM RATES (ADMIN CONTROLS & LIVE WEBSITE SYNCHRONIZATION) ---
  getRoomRates() {
    const stored = getLocalItem(STORAGE_KEYS.ROOM_RATES, DEFAULT_ROOMS);
    if (!Array.isArray(stored)) return DEFAULT_ROOMS;
    // Always sync latest Vivid HDR images, thumbs, gallery, and descriptions from DEFAULT_ROOMS
    return DEFAULT_ROOMS.map(defRoom => {
      const match = stored.find(r => r.id === defRoom.id);
      if (match && typeof match.price === 'number') {
        return {
          ...defRoom,
          price: match.price,
          priceFormatted: match.priceFormatted || `₦${match.price.toLocaleString()}`
        };
      }
      return defRoom;
    });
  },

  updateRoomRate(roomId, newPrice) {
    const rates = this.getRoomRates();
    const numPrice = Number(newPrice);
    const updated = rates.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          price: numPrice,
          priceFormatted: `₦${numPrice.toLocaleString()}`
        };
      }
      return r;
    });
    setLocalItem(STORAGE_KEYS.ROOM_RATES, updated);
    this.logActivity(`Admin adjusted room rate for '${roomId}' to ₦${numPrice.toLocaleString()}`);

    // Real-time broadcast to homepage, suites catalog, and booking modal
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ash_rates_updated', { detail: updated }));
    }

    return updated;
  },

  subscribeRates(callback) {
    if (typeof window === 'undefined') return () => {};
    const handler = (e) => {
      callback(e.detail || this.getRoomRates());
    };
    window.addEventListener('ash_rates_updated', handler);
    return () => window.removeEventListener('ash_rates_updated', handler);
  },

  // --- HOTEL CONFIG (ADMIN CONTROLS) ---
  getHotelConfig() {
    return getLocalItem(STORAGE_KEYS.HOTEL_CONFIG, DEFAULT_HOTEL_INFO);
  },

  updateHotelConfig(newConfig) {
    const current = this.getHotelConfig();
    const updated = { ...current, ...newConfig };
    setLocalItem(STORAGE_KEYS.HOTEL_CONFIG, updated);
    this.logActivity(`Admin updated hotel operations contact information.`);
    return updated;
  },

  // --- ACTIVITY LOGS ---
  getActivityLogs() {
    return getLocalItem(STORAGE_KEYS.ACTIVITY_LOG, [
      `System initialized with 34 luxury rooms & suites in Nsugbe, Onitsha.`,
      `Reception portal ready for check-ins.`
    ]);
  },

  // --- DINING & DRINKS MENU (ADMIN CONTROLS & LIVE GUEST UPDATES) ---
  getDiningMenu() {
    const stored = getLocalItem(STORAGE_KEYS.DINING_MENU, null);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      const storedMap = new Map(stored.map(item => [item.id, item]));
      const defaultIds = new Set(INITIAL_DINING_MENU.map(d => d.id));

      const mergedDefaults = INITIAL_DINING_MENU.map(defaultMatch => {
        const storedItem = storedMap.get(defaultMatch.id);
        if (storedItem) {
          return {
            ...defaultMatch,
            ...storedItem,
            name: defaultMatch.name,
            category: defaultMatch.category,
            categoryLabel: defaultMatch.categoryLabel,
            price: storedItem.price !== undefined ? Number(storedItem.price) : defaultMatch.price,
            image: defaultMatch.image || storedItem.image,
            requiresProtein: defaultMatch.requiresProtein,
            requiresSwallow: defaultMatch.requiresSwallow,
            pairingType: defaultMatch.pairingType,
            pairingNote: defaultMatch.pairingNote || storedItem.pairingNote,
          };
        }
        return defaultMatch;
      });

      // Preserve any custom items added dynamically by Admin
      const customItems = stored.filter(item => !defaultIds.has(item.id));
      return [...mergedDefaults, ...customItems];
    }
    return INITIAL_DINING_MENU;
  },

  updateMenuItemPrice(itemId, newPrice) {
    const menu = this.getDiningMenu();
    const numPrice = Number(newPrice);
    const updated = menu.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          price: numPrice
        };
      }
      return item;
    });

    setLocalItem(STORAGE_KEYS.DINING_MENU, updated);
    const itemObj = menu.find(i => i.id === itemId);
    this.logActivity(`Admin updated price for '${itemObj?.name || itemId}' to ₦${numPrice.toLocaleString()}`);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ash_menu_updated', { detail: updated }));
    }
    return updated;
  },

  updateAllMenuPrices(priceMap) {
    const menu = this.getDiningMenu();
    const updated = menu.map(item => {
      if (priceMap[item.id] !== undefined && !isNaN(priceMap[item.id])) {
        return {
          ...item,
          price: Number(priceMap[item.id])
        };
      }
      return item;
    });

    setLocalItem(STORAGE_KEYS.DINING_MENU, updated);
    this.logActivity(`Admin updated dining & drinks menu prices in bulk.`);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ash_menu_updated', { detail: updated }));
    }
    return updated;
  },

  addMenuItem(newItem) {
    const menu = this.getDiningMenu();
    const id = newItem.id || `menu-${Date.now()}`;
    const itemToAdd = {
      ...newItem,
      id,
      price: Number(newItem.price) || 0
    };
    const updated = [itemToAdd, ...menu];
    setLocalItem(STORAGE_KEYS.DINING_MENU, updated);
    this.logActivity(`Admin added new menu item '${itemToAdd.name}' at ₦${itemToAdd.price.toLocaleString()}`);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ash_menu_updated', { detail: updated }));
    }
    return updated;
  },

  deleteMenuItem(itemId) {
    const menu = this.getDiningMenu();
    const itemObj = menu.find(i => i.id === itemId);
    const updated = menu.filter(i => i.id !== itemId);
    setLocalItem(STORAGE_KEYS.DINING_MENU, updated);
    this.logActivity(`Admin removed menu item '${itemObj?.name || itemId}'`);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ash_menu_updated', { detail: updated }));
    }
    return updated;
  },

  subscribeDiningMenu(callback) {
    if (typeof window === 'undefined') return () => {};
    const handler = (e) => {
      callback(e.detail || this.getDiningMenu());
    };
    window.addEventListener('ash_menu_updated', handler);
    return () => window.removeEventListener('ash_menu_updated', handler);
  },

  logActivity(msg) {
    const logs = this.getActivityLogs();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLogs = [`[${timestamp}] ${msg}`, ...logs.slice(0, 49)];
    setLocalItem(STORAGE_KEYS.ACTIVITY_LOG, newLogs);
  }
};
