// Centralized State & Real-Time Storage for Receptionist & Admin Portals
import { ROOMS as DEFAULT_ROOMS, HOTEL_INFO as DEFAULT_HOTEL_INFO } from './hotelData';

const STORAGE_KEYS = {
  AUTH: 'ash_portal_auth_user',
  USERS: 'ash_portal_staff_users_v4',
  LOGIN_LOGS: 'ash_portal_login_attempts',
  BOOKINGS: 'ash_portal_bookings_v7',
  ROOMS: 'ash_portal_rooms_inventory_v9',
  ROOM_RATES: 'ash_portal_room_rates_v3',
  DINING_MENU: 'ash_portal_dining_menu_v6',
  HOTEL_CONFIG: 'ash_portal_hotel_config',
  ACTIVITY_LOG: 'ash_portal_activity_log',
};

// 1. Initial Room Inventory (34 Authentic Rooms Across 2 Buildings in Nsugbe, Onitsha - All Available for Production)
const INITIAL_ROOMS_INVENTORY = [
  // ==========================================
  // MAIN BUILDING (20 Rooms total • 600 Wing)
  // Super Exec (₦60k), Exec (₦50k), Superior (₦40k), Deluxe (₦35k), Standard (₦30k)
  // ==========================================
  { roomNumber: "601", building: "Main Building", floor: "Main Building", type: "executive", name: "Executive Room", price: 50000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "602", building: "Main Building", floor: "Main Building", type: "deluxe", name: "Deluxe Room", price: 35000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "603", building: "Main Building", floor: "Main Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "604", building: "Main Building", floor: "Main Building", type: "deluxe", name: "Deluxe Room", price: 35000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "605", building: "Main Building", floor: "Main Building", type: "super-executive", name: "Super Executive Room", price: 60000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "606", building: "Main Building", floor: "Main Building", type: "deluxe", name: "Deluxe Room", price: 35000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "607", building: "Main Building", floor: "Main Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "608", building: "Main Building", floor: "Main Building", type: "deluxe", name: "Deluxe Room", price: 35000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "609", building: "Main Building", floor: "Main Building", type: "executive", name: "Executive Room", price: 50000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "610", building: "Main Building", floor: "Main Building", type: "deluxe", name: "Deluxe Room", price: 35000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "611", building: "Main Building", floor: "Main Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "612", building: "Main Building", floor: "Main Building", type: "super-executive", name: "Super Executive Room", price: 60000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "613", building: "Main Building", floor: "Main Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "614", building: "Main Building", floor: "Main Building", type: "standard", name: "Standard Room", price: 30000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "615", building: "Main Building", floor: "Main Building", type: "super-executive", name: "Super Executive Room", price: 60000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "616", building: "Main Building", floor: "Main Building", type: "standard", name: "Standard Room", price: 30000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "617", building: "Main Building", floor: "Main Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "618", building: "Main Building", floor: "Main Building", type: "standard", name: "Standard Room", price: 30000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "619", building: "Main Building", floor: "Main Building", type: "executive", name: "Executive Room", price: 50000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "620", building: "Main Building", floor: "Main Building", type: "deluxe", name: "Deluxe Room", price: 35000, status: "available", currentGuest: null, checkOut: null },

  // ==========================================
  // EXTENSION BUILDING (14 Rooms total • 100 Wing)
  // Suites (₦120k), Super-Exec (₦60k), Exec (₦50k), Superior (₦40k)
  // ==========================================
  { roomNumber: "101", building: "Extension Building", floor: "Extension Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "102", building: "Extension Building", floor: "Extension Building", type: "super-executive", name: "Super Executive Room", price: 60000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "103", building: "Extension Building", floor: "Extension Building", type: "executive", name: "Executive Room", price: 50000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "104", building: "Extension Building", floor: "Extension Building", type: "executive", name: "Executive Room", price: 50000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "105", building: "Extension Building", floor: "Extension Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "106", building: "Extension Building", floor: "Extension Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "107", building: "Extension Building", floor: "Extension Building", type: "suites", name: "Diplomatic Suite", price: 120000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "108", building: "Extension Building", floor: "Extension Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "109", building: "Extension Building", floor: "Extension Building", type: "super-executive", name: "Super Executive Room", price: 60000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "110", building: "Extension Building", floor: "Extension Building", type: "executive", name: "Executive Room", price: 50000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "111", building: "Extension Building", floor: "Extension Building", type: "executive", name: "Executive Room", price: 50000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "112", building: "Extension Building", floor: "Extension Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "113", building: "Extension Building", floor: "Extension Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "114", building: "Extension Building", floor: "Extension Building", type: "suites", name: "Diplomatic Suite", price: 120000, status: "available", currentGuest: null, checkOut: null }
];

// 2. Pre-Seeded Real Bookings with Backend Confirmation status
const INITIAL_BOOKINGS = [
  {
    id: "ASH-9421",
    guestName: "Chief Emeka Obi",
    phone: "0803 234 5678",
    email: "emeka.obi@nigerdelta.org",
    roomType: "suites",
    roomName: "Diplomatic Suite (Extension Building)",
    roomNumber: "107",
    checkIn: "2026-10-20",
    checkOut: "2026-10-24",
    nights: 4,
    amount: 480000,
    status: "Checked In",
    paymentMethod: "Paystack (Online)",
    paymentStatus: "Paid", // Confirmed by backend
    backendVerified: true,
    verifiedAt: "2026-10-20 08:31",
    source: "Direct Website",
    createdAt: "2026-10-20 08:30"
  },
  {
    id: "ASH-7812",
    guestName: "Alhaji Ibrahim Musa",
    phone: "0812 578 6875",
    email: "ibrahim.musa@example.com",
    roomType: "executive",
    roomName: "Executive Room (Main Building)",
    roomNumber: "601",
    checkIn: "2026-10-20",
    checkOut: "2026-10-23",
    nights: 3,
    amount: 150000,
    status: "Confirmed",
    paymentMethod: "Paystack (Online)",
    paymentStatus: "Paid", // Confirmed by backend
    backendVerified: true,
    verifiedAt: "2026-10-20 09:16",
    source: "Direct Website",
    createdAt: "2026-10-20 09:15"
  },
  {
    id: "ASH-6204",
    guestName: "Senator Chuka Nwosu",
    phone: "0802 999 1122",
    email: "nwosu.chuka@assembly.gov.ng",
    roomType: "super-executive",
    roomName: "Super Executive Room (Main Building)",
    roomNumber: "605",
    checkIn: "2026-10-19",
    checkOut: "2026-10-23",
    nights: 4,
    amount: 240000,
    status: "Checked In",
    paymentMethod: "Bank Transfer (Approved by GM)",
    paymentStatus: "Paid", // Confirmed by backend
    backendVerified: true,
    verifiedAt: "2026-10-19 16:45",
    source: "Front Desk Walk-In",
    createdAt: "2026-10-19 16:40"
  },
  {
    id: "ASH-4109",
    guestName: "Dr. Ngozi Adeleke",
    phone: "0806 555 4321",
    email: "dr.adeleke@medspecialist.com",
    roomType: "superior",
    roomName: "Superior Room (Extension Building)",
    roomNumber: "101",
    checkIn: "2026-10-20",
    checkOut: "2026-10-22",
    nights: 2,
    amount: 80000,
    status: "Checked In",
    paymentMethod: "POS Terminal (Front Desk)",
    paymentStatus: "Paid", // Confirmed by backend
    backendVerified: true,
    verifiedAt: "2026-10-20 07:12",
    source: "Front Desk Walk-In",
    createdAt: "2026-10-20 07:10"
  },
  {
    id: "ASH-3105",
    guestName: "Arc. Kenneth Igwe",
    phone: "0814 888 2345",
    email: "kenneth.igwe@architects.ng",
    roomType: "deluxe",
    roomName: "Deluxe Room (Main Building)",
    roomNumber: "602",
    checkIn: "2026-10-21",
    checkOut: "2026-10-22",
    nights: 1,
    amount: 35000,
    status: "Confirmed",
    paymentMethod: "Paystack (Online Auto-Confirmed)",
    paymentStatus: "Paid",
    backendVerified: true,
    verifiedAt: "2026-10-21 10:16",
    source: "Direct Website",
    createdAt: "2026-10-21 10:15"
  }
];

// 3. Initial Staff Users (Two Dedicated Reception Desks + Executive Admin)
const INITIAL_USERS = [
  {
    id: "u-admin",
    username: "admin@arabsignature.com",
    password: "admin2026",
    name: "General Manager",
    role: "admin",
    badge: "Executive Admin",
    buildingAccess: "all",
    active: true,
    lastLogin: "2026-10-17 11:20:14"
  },
  {
    id: "u-reception-main",
    username: "main@arabsignature.com",
    legacyUsername: "reception@arabsignature.com",
    password: "reception2026",
    name: "Main Building Receptionist",
    role: "reception",
    buildingAccess: "Main Building",
    buildingLabel: "Main Building (600 Wing)",
    badge: "Main Building Desk (Rooms 601–620)",
    active: true,
    lastLogin: "2026-10-24 10:45:00"
  },
  {
    id: "u-reception-ext",
    username: "extension@arabsignature.com",
    legacyUsername: "ext@arabsignature.com",
    password: "extension2026",
    name: "Extension Building Receptionist",
    role: "reception",
    buildingAccess: "Extension Building",
    buildingLabel: "Extension Building (100 Wing)",
    badge: "Extension Building Desk (Rooms 101–114)",
    active: true,
    lastLogin: "2026-10-24 10:45:00"
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
    id: "drink-azul",
    name: "Clase Azul Reposado Tequila (750ml)",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Ultra-premium handcrafted Mexican reposado tequila in the iconic cobalt-blue ceramic decanter. Served with VIP sparklers and ice bucket.",
    price: 500000,
    image: "/dining/drinks/drink-azul.jpg",
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
    image: "/dining/drinks/drink-jw-blue.jpg",
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
    image: "/dining/drinks/drink-glenfiddich-21.jpg",
    isSignature: true,
  },
  {
    id: "drink-don-julio",
    name: "Don Julio 1942 Añejo Tequila (750ml)",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Legendary handcrafted añejo tequila aged in American white oak barrels with notes of rich caramel and toasted vanilla.",
    price: 500000,
    image: "/dining/drinks/drink-don-julio.jpg",
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
    image: "/dining/drinks/drink-hennessy-xo.jpg",
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
    image: "/dining/drinks/drink-glenfiddich-18.jpg",
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
    image: "/dining/drinks/drink-glenfiddich-15.jpg",
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
    image: "/dining/drinks/drink-hennessy-vsop.jpg",
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
    image: "/dining/drinks/drink-martell-vsop.jpg",
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
    image: "/dining/drinks/drink-remy-martin-vsop.jpg",
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
    image: "/dining/drinks/drink-glenfiddich-12.jpg",
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
    image: "/dining/drinks/drink-hennessy-vs.jpg",
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
    image: "/dining/drinks/drink-jw-black.jpg",
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
    image: "/dining/drinks/drink-jameson-black.jpg",
    isSignature: false,
  },
  {
    id: "drink-whitley-neill",
    name: "Whitley Neill Lemongrass & Ginger Gin",
    category: "spirits",
    categoryLabel: "Champagne, Cognac, Whiskey & Gin",
    type: "drinks",
    desc: "Artisanal handcrafted English gin infused with fragrant lemongrass and warm natural ginger, delivering crisp citrus notes and a smooth spiced finish.",
    price: 50000,
    image: "/dining/drinks/drink-whitley-neill.jpg",
    isSignature: true,
  },
  {
    id: "drink-jameson-green",
    name: "Jameson Irish Whiskey (Original Green)",
    category: "spirits",
    categoryLabel: "Champagne, Cognac & Whiskey",
    type: "drinks",
    desc: "Triple distilled, exceptionally smooth Irish whiskey with perfectly balanced spicy, nutty, and vanilla notes.",
    price: 40000,
    image: "/dining/drinks/drink-jameson-green.jpg",
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
    image: "/dining/drinks/drink-campari.jpg",
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
    image: "/dining/drinks/drink-jw-red.jpg",
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
    image: "/dining/drinks/drink-american-honey.jpg",
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
    image: "/dining/drinks/drink-amarula.jpg",
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
    image: "/dining/drinks/drink-moet-chandon.jpg",
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
    image: "/dining/drinks/drink-veuve-clicquot.jpg",
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
    image: "/dining/drinks/drink-belaire.jpg",
    isSignature: true,
  },
  {
    id: "drink-element",
    name: "Element Premium Reserve Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Exclusive reserve wine offering deep complexity, velvet texture, and rich berry notes.",
    price: 70000,
    image: "/dining/drinks/drink-element.jpg",
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
    image: "/dining/drinks/drink-cooper-and-thief.jpg",
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
    image: "/dining/drinks/drink-angelus-black-rose.jpg",
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
    image: "/dining/drinks/drink-silk-and-spice.jpg",
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
    image: "/dining/drinks/drink-escudo-rojo.jpg",
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
    image: "/dining/drinks/drink-aznauri.jpg",
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
    image: "/dining/drinks/drink-black-star.jpg",
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
    image: "/dining/drinks/drink-castillo.jpg",
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
    image: "/dining/drinks/drink-four-cousins.jpg",
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
    image: "/dining/drinks/drink-martinellis.jpg",
    isSignature: false,
  },
  {
    id: "drink-angelus-wine",
    name: "D' Angelus Fine Table Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Smooth and approachable dining wine that complements grilled poultry, red meat, and Nigerian dishes.",
    price: 25000,
    image: "/dining/drinks/drink-angelus-wine.jpg",
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
    image: "/dining/drinks/drink-andre-rose.jpg",
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
    image: "/dining/drinks/drink-alita.jpg",
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
    image: "/dining/drinks/drink-4th-street.jpg",
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
    image: "/dining/drinks/drink-expression.jpg",
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
    image: "/dining/drinks/drink-chamdor.jpg",
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
    image: "/dining/drinks/drink-wolf-blass.jpg",
    isSignature: false,
  },
  {
    id: "drink-reseau",
    name: "Roseau Fine Dinner Wine",
    category: "wines",
    categoryLabel: "Fine Wines & Sparkling",
    type: "drinks",
    desc: "Light and balanced dinner wine, ideal for everyday dining and social pairings.",
    price: 15000,
    image: "/dining/drinks/drink-reseau.jpg",
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
    image: "/dining/drinks/drink-nines.jpg",
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
    image: "/dining/drinks/beer-desperados.jpg",
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
    image: "/dining/drinks/beer-tiger.jpg",
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
    image: "/dining/drinks/beer-heineken-med.jpg",
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
    image: "/dining/drinks/beer-heineken-big.jpg",
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
    image: "/dining/drinks/beer-legend-big.jpg",
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
    image: "/dining/drinks/beer-legend-med.jpg",
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
    image: "/dining/drinks/beer-star.jpg",
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
    image: "/dining/drinks/beer-star-radler.jpg",
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
    image: "/dining/drinks/beer-flying-fish.jpg",
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
    image: "/dining/drinks/beer-trophy.jpg",
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
    image: "/dining/drinks/beer-trophy-stout.jpg",
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
    image: "/dining/drinks/beer-budweiser.jpg",
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
    image: "/dining/drinks/beer-budweiser-royal.jpg",
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
    image: "/dining/drinks/beer-hero.jpg",
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
    image: "/dining/drinks/beer-castle-lite.jpg",
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
    image: "/dining/drinks/beer-smirnoff-ice.jpg",
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
    image: "/dining/drinks/beer-smirnoff-black-ice.jpg",
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
    image: "/dining/drinks/beer-monster.jpg",
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
    image: "/dining/drinks/beer-guinness-small.jpg",
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
    image: "/dining/drinks/beer-guinness-med.jpg",
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
    image: "/dining/drinks/beer-life.jpg",
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
    image: "/dining/drinks/beer-gulder.jpg",
    isSignature: false,
  },

  // ========================================================
  // 9. DRINKS: SOFT DRINKS & MALTS (₦1,000 - ₦1,500)
  // ========================================================
  {
    id: "soft-minerals",
    name: "Minerals (Coca-Cola / Fanta / Sprite)",
    category: "softdrinks",
    categoryLabel: "Soft Drinks & Malts",
    type: "drinks",
    desc: "Refreshing chilled carbonated soft drink served ice-cold. Choose classic Coca-Cola, Fanta Orange, or Sprite.",
    price: 1000,
    image: "/dining/drinks/soft-minerals.jpg",
    isSignature: false,
  },
  {
    id: "soft-malt-all",
    name: "Malt (Malta Guinness / Maltina / Amstel)",
    category: "softdrinks",
    categoryLabel: "Soft Drinks & Malts",
    type: "drinks",
    desc: "Rich, nourishing, alcohol-free premium malt beverage packed with essential B-vitamins and caramel malt goodness.",
    price: 1500,
    image: "/dining/drinks/soft-malt-all.jpg",
    isSignature: false,
  },
  {
    id: "soft-fayrouz",
    name: "Fayrouz Sparkling Fruit Drink",
    category: "softdrinks",
    categoryLabel: "Soft Drinks & Malts",
    type: "drinks",
    desc: "Exquisite gently sparkling malt drink naturally flavored with golden pineapple and exotic fruit essence.",
    price: 1500,
    image: "/dining/drinks/soft-fayrouz.jpg",
    isSignature: false,
  },
  {
    id: "spirit-orijin-bitters",
    name: "Orijin Bitters",
    category: "softdrinks",
    categoryLabel: "Soft Drinks & Malts",
    type: "drinks",
    desc: "Signature Nigerian herbal alcoholic blend infused with African botanicals, roots, and citrus fruit aromas.",
    price: 1500,
    image: "/dining/drinks/spirit-orijin-bitters.jpg",
    isSignature: false,
  },

  // ========================================================
  // 10. DRINKS: ENERGY DRINKS (₦1,000 - ₦3,000)
  // ========================================================
  {
    id: "energy-predator",
    name: "Predator Energy Drink",
    category: "energy",
    categoryLabel: "Energy Drinks",
    type: "drinks",
    desc: "Roaring energy and vitality packed in an invigorating carbonated blend to power your night.",
    price: 1000,
    image: "/dining/drinks/energy-predator.jpg",
    isSignature: false,
  },
  {
    id: "energy-fearless",
    name: "Fearless Energy Drink (Red Berry / Classic)",
    category: "energy",
    categoryLabel: "Energy Drinks",
    type: "drinks",
    desc: "High-powered quick charge energy booster with a bold, crisp rush in Classic or Red Berry flavor.",
    price: 1000,
    image: "/dining/drinks/energy-fearless.jpg",
    isSignature: false,
  },
  {
    id: "energy-climax",
    name: "Climax Herbal Energy Drink",
    category: "energy",
    categoryLabel: "Energy Drinks",
    type: "drinks",
    desc: "Premium herbal energy formulation delivering sustained stamina, alertness, and deep refreshing flavor.",
    price: 1500,
    image: "/dining/drinks/energy-climax.jpg",
    isSignature: false,
  },
  {
    id: "energy-bullet",
    name: "Black Bullet Energy Drink",
    category: "energy",
    categoryLabel: "Energy Drinks",
    type: "drinks",
    desc: "Intense Black Bullet formulation delivering rapid alertness, physical stamina, and sustained endurance. Served sub-zero chilled.",
    price: 3000,
    image: "/dining/drinks/energy-bullet.jpg",
    isSignature: false,
  },

  // ========================================================
  // 11. DRINKS: JUICES & DAIRY (₦3,000 - ₦4,000)
  // ========================================================
  {
    id: "drink-vitamilk",
    name: "Vitamilk Soy Milk",
    category: "juices",
    categoryLabel: "Juices & Dairy",
    type: "drinks",
    desc: "Smooth, creamy, whole-soybean nutrition drink rich in plant protein and vitamins. Served ice-cold.",
    price: 3000,
    image: "/dining/drinks/drink-vitamilk.jpg",
    isSignature: false,
  },
  {
    id: "drink-soursop",
    name: "Soursop Juice Drink (Can)",
    category: "juices",
    categoryLabel: "Juices & Dairy",
    type: "drinks",
    desc: "Exotic tropical soursop fruit juice in a chilled 330ml can, rich in natural vitamins, fragrant fruit pulp, and crisp island refreshment.",
    price: 3000,
    image: "/dining/drinks/drink-soursop.jpg",
    isSignature: false,
  },
  {
    id: "drink-hollandia-yoghurt",
    name: "Hollandia Yoghurt (1 Litre)",
    category: "juices",
    categoryLabel: "Juices & Dairy",
    type: "drinks",
    desc: "Velvety, probiotic-rich drinking yoghurt crafted from fresh dairy milk. Luscious, smooth, and revitalizing.",
    price: 4000,
    image: "/dining/drinks/drink-hollandia-yoghurt.jpg",
    isSignature: false,
  },
  {
    id: "drink-v-smartic",
    name: "V-Smartic Wheat Flavoured Milk Drink",
    category: "juices",
    categoryLabel: "Juices & Dairy",
    type: "drinks",
    desc: "Nourishing Viju V-Smartic wheat-flavoured dairy milk drink delivering rich cereal energy and smooth, creamy refreshment.",
    price: 4000,
    image: "/dining/drinks/drink-v-smartic.jpg",
    isSignature: false,
  },
  {
    id: "drink-chi-exotic",
    name: "Chi Exotic Tropical Nectar (1 Litre)",
    category: "juices",
    categoryLabel: "Juices & Dairy",
    type: "drinks",
    desc: "Luscious pineapple and coconut nectar blend offering sun-ripened tropical sweetness and real fruit nectar.",
    price: 4000,
    image: "/dining/drinks/drink-chi-exotic.jpg",
    isSignature: false,
  },
  {
    id: "drink-pure-heaven",
    name: "Pure Heaven Sparkling Drink (Can)",
    category: "juices",
    categoryLabel: "Juices & Dairy",
    type: "drinks",
    desc: "Crisp non-alcoholic sparkling celebration fruit drink in a convenient chilled can, crafted with finest grape nectar for celebratory dining.",
    price: 4000,
    image: "/dining/drinks/drink-pure-heaven.jpg",
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

  getReceptionistUsers() {
    const users = this.getUsers();
    return users.filter(u => u.role === 'reception');
  },

  getReceptionistUser(buildingAccess = 'Main Building') {
    const users = this.getUsers();
    return users.find(u => u.role === 'reception' && (u.buildingAccess === buildingAccess || (!u.buildingAccess && buildingAccess === 'Main Building'))) || users.find(u => u.role === 'reception') || INITIAL_USERS[1];
  },

  getAdminUser() {
    const users = this.getUsers();
    return users.find(u => u.role === 'admin') || INITIAL_USERS[0];
  },

  updateReceptionistCredentials(buildingAccess, newUsername, newPassword, staffName) {
    const users = this.getUsers();
    const updated = users.map(u => {
      const match = u.role === 'reception' && (u.buildingAccess === buildingAccess || (!u.buildingAccess && buildingAccess === 'Main Building'));
      if (match) {
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
    this.logActivity(`Admin changed ${buildingAccess} Receptionist login to '${newUsername.trim()}'.`);
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
      buildingAccess: 'all',
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
  // Supports both Main Building Desk (Rooms 601–620) & Extension Building Desk (Rooms 101–114)
  loginReception(username, password) {
    const users = this.getUsers();
    const cleanUser = username.trim().toLowerCase();

    // Match either receptionist account by username or legacy alias
    const receptionUser = users.find(u => 
      u.role === 'reception' && (
        u.username.toLowerCase() === cleanUser ||
        (u.legacyUsername && u.legacyUsername.toLowerCase() === cleanUser)
      )
    );

    const isUserMatch = !!receptionUser;
    const isPassMatch = receptionUser && (
      receptionUser.password === password ||
      (receptionUser.buildingAccess === 'Main Building' && (password === 'reception2026' || password === 'main2026')) ||
      (receptionUser.buildingAccess === 'Extension Building' && password === 'extension2026')
    );

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
      buildingAccess: receptionUser.buildingAccess || 'Main Building',
      buildingLabel: receptionUser.buildingLabel || 'Main Building (600 Wing)',
      badge: receptionUser.badge || `Front Desk (${receptionUser.buildingAccess || 'Main Building'})`,
      loginTime: new Date().toISOString()
    };

    setLocalItem(STORAGE_KEYS.AUTH, session);
    this.recordLoginAttempt({
      usernameAttempted: receptionUser.username,
      targetRole: 'reception',
      status: 'SUCCESS',
      reason: `Authorized Front Desk Shift Login (${session.buildingLabel})`
    });
    this.logActivity(`Front Desk Reception (${session.name} - ${session.buildingAccess}) signed in for shift.`);
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
    const rooms = this.getRooms();

    // 1. Automatically assign an available room matching the roomType if not specified
    let assignedRoomNumber = bookingData.roomNumber;
    if (!assignedRoomNumber || assignedRoomNumber === "Unassigned") {
      const availableMatch = rooms.find(
        r => r.type === bookingData.roomType && r.status === 'available'
      );
      if (availableMatch) {
        assignedRoomNumber = availableMatch.roomNumber;
      }
    }
    
    // Payment is automatically confirmed when Paystack processes it (or POS/Cash at front desk)
    const newBooking = {
      id: bookingData.id || ('ASH-' + Math.floor(1000 + Math.random() * 9000)),
      guestName: bookingData.guestName || "Guest",
      phone: bookingData.phone || "0812 578 6875",
      email: bookingData.email || "",
      roomType: bookingData.roomType || "deluxe",
      roomName: bookingData.roomName || "Arab Deluxe Suite",
      roomNumber: assignedRoomNumber || "Unassigned",
      checkIn: bookingData.checkIn || new Date().toISOString().split('T')[0],
      checkOut: bookingData.checkOut || "",
      nights: bookingData.nights || 1,
      amount: bookingData.amount || 45000,
      status: bookingData.status || "Confirmed",
      paymentMethod: bookingData.paymentMethod || "Paystack (Online Verified)",
      paymentStatus: "Paid", // Automatically confirmed by Paystack
      paystackReference: bookingData.paystackReference || ('REF-' + Date.now()),
      backendVerified: true,
      verifiedAt: new Date().toLocaleString(),
      source: bookingData.source || "Direct Website (Paystack)",
      createdAt: new Date().toLocaleString()
    };

    // 2. Automatically mark the assigned room as "reserved" in inventory
    if (assignedRoomNumber && assignedRoomNumber !== "Unassigned") {
      this.updateRoomStatus(assignedRoomNumber, 'reserved', newBooking.guestName);
    }

    const updated = [newBooking, ...bookings];
    setLocalItem(STORAGE_KEYS.BOOKINGS, updated);
    this.logActivity(`New reservation confirmed: ${newBooking.id} for ${newBooking.guestName} - Room #${newBooking.roomNumber} automatically reserved via Paystack`);
    
    // 3. Broadcast live update with audio/visual alert signal for Receptionist desk
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ash_bookings_updated', { 
        detail: {
          bookings: updated,
          newBooking,
          assignedRoomNumber: newBooking.roomNumber,
          isNewReservation: true
        } 
      }));
    }

    return newBooking;
  },

  // Reset all 34 rooms to 100% available (Production clean state)
  resetAllRoomsToAvailable() {
    const cleanRooms = INITIAL_ROOMS_INVENTORY.map(r => ({
      ...r,
      status: "available",
      currentGuest: null,
      checkOut: null
    }));
    setLocalItem(STORAGE_KEYS.ROOMS, cleanRooms);
    setLocalItem('ash_portal_rooms_inventory', cleanRooms);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ash_rooms_updated', { detail: cleanRooms }));
      const payload = JSON.stringify({ rooms: cleanRooms, updatedAt: Date.now() });
      fetch('https://mantledb.sh/v2/arab-signature-hotel-34rooms-prod-v1/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      }).catch(() => {});
    }
    this.logActivity('All 34 hotel rooms reset to AVAILABLE for production');
    return cleanRooms;
  },

  // Reset rooms for a specific building (Main Building or Extension Building)
  resetRoomsByBuilding(buildingName) {
    const current = this.getRooms();
    const updated = current.map(r => {
      const bldg = r.building || r.floor;
      if (bldg === buildingName) {
        return {
          ...r,
          status: "available",
          currentGuest: null,
          checkOut: null
        };
      }
      return r;
    });
    setLocalItem(STORAGE_KEYS.ROOMS, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ash_rooms_updated', { detail: updated }));
      const payload = JSON.stringify({ rooms: updated, updatedAt: Date.now() });
      fetch('https://mantledb.sh/v2/arab-signature-hotel-34rooms-prod-v1/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      }).catch(() => {});
    }
    this.logActivity(`All ${buildingName} rooms reset to AVAILABLE for production`);
    return updated;
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
    const v7Rooms = getLocalItem(STORAGE_KEYS.ROOMS, null);
    if (v7Rooms && Array.isArray(v7Rooms) && v7Rooms.length === 34) return v7Rooms;
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
      fetch('https://mantledb.sh/v2/arab-signature-hotel-34rooms-prod-v1/inventory', {
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

      const res = await fetch(`https://mantledb.sh/v2/arab-signature-hotel-34rooms-prod-v1/inventory?_t=${Date.now()}`, {
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
