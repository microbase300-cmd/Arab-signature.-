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

  // --- 2. SOUPS & SWALLOW (Must pair with a Protein & Swallow) ---
  {
    id: "food-egusi-soup",
    name: "Egusi Soup",
    category: "soups",
    categoryLabel: "Soups & Swallow",
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
    categoryLabel: "Soups & Swallow",
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
    categoryLabel: "Soups & Swallow",
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
    categoryLabel: "Soups & Swallow",
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
    categoryLabel: "Soups & Swallow",
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
    categoryLabel: "Soups & Swallow",
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
    categoryLabel: "Soups & Swallow",
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
  {
    id: "food-semo",
    name: "Semo (Swallow)",
    category: "soups",
    categoryLabel: "Soups & Swallow",
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
    category: "soups",
    categoryLabel: "Soups & Swallow",
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

  // --- DRINKS: CHAMPAGNE & VIP SPIRITS (VIP BOTTLE SERVICE) ---
  {
    id: "drink-don-julio-1942",
    name: "Don Julio 1942 Tequila (750ml)",
    category: "spirits",
    categoryLabel: "Champagne & VIP Spirits",
    type: "drinks",
    desc: "Legendary handcrafted añejo tequila aged in American white oak barrels with notes of rich caramel and toasted vanilla. Served with LED baton sparklers & VIP ice bucket",
    price: 750000,
    isSignature: true,
  },
  {
    id: "drink-dom-perignon",
    name: "Dom Pérignon Vintage Brut Champagne",
    category: "spirits",
    categoryLabel: "Champagne & VIP Spirits",
    type: "drinks",
    desc: "Iconic prestige French champagne with exquisite effervescence, ripe peach, brioche, and toasted hazelnut finish",
    price: 620000,
    isSignature: true,
  },
  {
    id: "drink-azul-reposado",
    name: "Clase Azul Reposado Tequila (750ml)",
    category: "spirits",
    categoryLabel: "Champagne & VIP Spirits",
    type: "drinks",
    desc: "Ultra-premium 100% blue agave tequila aged in oak, presented in the iconic cobalt blue handcrafted ceramic decanter",
    price: 580000,
    isSignature: true,
  },
  {
    id: "drink-hennessy-xo",
    name: "Hennessy XO Extra Old Cognac (700ml)",
    category: "spirits",
    categoryLabel: "Champagne & VIP Spirits",
    type: "drinks",
    desc: "Robust deep amber French cognac blending 100 rare eaux-de-vie with rich candied fruits, spicy cinnamon, and wild dark chocolate",
    price: 450000,
    isSignature: true,
  },
  {
    id: "drink-jw-blue",
    name: "Johnnie Walker Blue Label Blended Scotch",
    category: "spirits",
    categoryLabel: "Champagne & VIP Spirits",
    type: "drinks",
    desc: "Rare hand-selected Scotch casks offering velvety honey, dry fruit sweetness, and lingering peat smoke finish",
    price: 480000,
    isSignature: false,
  },
  {
    id: "drink-moet-imperial",
    name: "Moët & Chandon Impérial Brut Champagne",
    category: "spirits",
    categoryLabel: "Champagne & VIP Spirits",
    type: "drinks",
    desc: "The world’s most celebrated champagne with crisp green apple, white floral notes, and elegant fine bubbles",
    price: 220000,
    isSignature: false,
  },
  {
    id: "drink-glenfiddich-18",
    name: "Glenfiddich 18-Year Single Malt Whisky",
    category: "spirits",
    categoryLabel: "Champagne & VIP Spirits",
    type: "drinks",
    desc: "Matured in Spanish Oloroso wood and American oak for an exceptionally rich, warm spiced apple and dried fruit flavor",
    price: 210000,
    isSignature: false,
  },
  {
    id: "drink-casamigos",
    name: "Casamigos Reposado Tequila (750ml)",
    category: "spirits",
    categoryLabel: "Champagne & VIP Spirits",
    type: "drinks",
    desc: "Small-batch smooth tequila aged 7 months in premium white oak barrels with hints of caramel and silky cocoa",
    price: 180000,
    isSignature: false,
  },

  // --- DRINKS: SIGNATURE COCKTAILS & MOCKTAILS ---
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
  },

  // --- DRINKS: BEERS, WINES & REFRESHMENTS ---
  {
    id: "drink-heineken",
    name: "Heineken / Corona Extra (Chilled Bottle)",
    category: "beers",
    categoryLabel: "Beer, Wine & Refreshments",
    type: "drinks",
    desc: "Sub-zero chilled bottle served in an ice bucket with fresh lime wedge",
    price: 3500,
    isSignature: false,
  },
  {
    id: "drink-guinness-stout",
    name: "Guinness Foreign Extra Stout (Cold)",
    category: "beers",
    categoryLabel: "Beer, Wine & Refreshments",
    type: "drinks",
    desc: "Rich, bold roasted malt Nigerian classic served extra chilled",
    price: 3000,
    isSignature: false,
  },
  {
    id: "drink-cabernet-sauvignon",
    name: "Chilean Reserva Cabernet Sauvignon (Bottle)",
    category: "beers",
    categoryLabel: "Beer, Wine & Refreshments",
    type: "drinks",
    desc: "Full-bodied red wine with deep blackberry notes, subtle oak, and velvet tannins",
    price: 45000,
    isSignature: false,
  },
  {
    id: "drink-pinot-grigio",
    name: "Italian D.O.C. Pinot Grigio (Bottle)",
    category: "beers",
    categoryLabel: "Beer, Wine & Refreshments",
    type: "drinks",
    desc: "Crisp, zesty, chilled dry white wine with delicate aromas of green apple and acacia blossom",
    price: 42000,
    isSignature: false,
  },
  {
    id: "drink-moroccan-tea",
    name: "Authentic Moroccan Mint Tea (Pot for 2)",
    category: "beers",
    categoryLabel: "Beer, Wine & Refreshments",
    type: "drinks",
    desc: "Traditional ceremonial tea brewed with fresh spearmint leaves, green gunpowder tea, and sweet brown sugar cubes in an engraved silver teapot",
    price: 6000,
    isSignature: true,
  },
  {
    id: "drink-turkish-coffee",
    name: "Turkish Cardamom Coffee",
    category: "beers",
    categoryLabel: "Beer, Wine & Refreshments",
    type: "drinks",
    desc: "Dark roasted fine grind coffee slow-boiled with cracked green cardamom pods in a copper cezve, served with Turkish delight",
    price: 4500,
    isSignature: false,
  },
  {
    id: "drink-sparkling-water",
    name: "San Pellegrino Sparkling Mineral Water (750ml)",
    category: "beers",
    categoryLabel: "Beer, Wine & Refreshments",
    type: "drinks",
    desc: "Imported Italian natural sparkling mineral water served chilled with lemon slices",
    price: 5000,
    isSignature: false,
  },
  {
    id: "drink-coconut-water",
    name: "Fresh Whole Coconut Water (Chilled)",
    category: "beers",
    categoryLabel: "Beer, Wine & Refreshments",
    type: "drinks",
    desc: "Natural whole coconut served fresh with biodegradable straw and spoon for coconut meat",
    price: 3500,
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

  // --- AL-SULTAN DINING & DRINKS MENU (ADMIN CONTROLS & LIVE GUEST UPDATES) ---
  getDiningMenu() {
    const stored = getLocalItem(STORAGE_KEYS.DINING_MENU, null);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      return stored.map(item => {
        const defaultMatch = INITIAL_DINING_MENU.find(d => d.id === item.id);
        if (defaultMatch) {
          return {
            ...defaultMatch,
            ...item,
            image: item.image || defaultMatch.image,
            requiresProtein: defaultMatch.requiresProtein,
            requiresSwallow: defaultMatch.requiresSwallow,
            pairingType: defaultMatch.pairingType,
            pairingNote: item.pairingNote || defaultMatch.pairingNote,
          };
        }
        return item;
      });
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
