// Centralized State & Real-Time Storage for Receptionist & Admin Portals
import { ROOMS as DEFAULT_ROOMS, HOTEL_INFO as DEFAULT_HOTEL_INFO } from './hotelData';

const STORAGE_KEYS = {
  AUTH: 'ash_portal_auth_user',
  BOOKINGS: 'ash_portal_bookings',
  ROOMS: 'ash_portal_rooms_inventory',
  ROOM_RATES: 'ash_portal_room_rates',
  HOTEL_CONFIG: 'ash_portal_hotel_config',
  ACTIVITY_LOG: 'ash_portal_activity_log',
};

// 1. Initial Room Inventory (12 Luxury Keys in Nsugbe, Onitsha)
const INITIAL_ROOMS_INVENTORY = [
  { roomNumber: "101", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "occupied", currentGuest: "Dr. Ngozi Adeleke", checkOut: "2026-10-22", price: 45000 },
  { roomNumber: "102", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "available", currentGuest: null, checkOut: null, price: 45000 },
  { roomNumber: "103", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "reserved", currentGuest: "Alhaji Ibrahim Musa", checkOut: "2026-10-23", price: 45000 },
  { roomNumber: "201", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "202", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "occupied", currentGuest: "Senator Chuka Nwosu", checkOut: "2026-10-21", price: 65000 },
  { roomNumber: "203", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "cleaning", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "301", type: "royal", name: "Royal Diplomatic Penthouse", floor: "Penthouse", status: "occupied", currentGuest: "Chief Emeka Obi", checkOut: "2026-10-25", price: 120000 },
  { roomNumber: "302", type: "royal", name: "Royal Diplomatic Penthouse", floor: "Penthouse", status: "available", currentGuest: null, checkOut: null, price: 120000 },
  { roomNumber: "401", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "402", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "403", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "occupied", currentGuest: "Engr. Tunde Bakare", checkOut: "2026-10-20", price: 35000 },
  { roomNumber: "404", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "cleaning", currentGuest: null, checkOut: null, price: 35000 },
];

// 2. Pre-Seeded Real Bookings
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
    status: "Checked In", // Confirmed, Checked In, Completed, Cancelled
    paymentMethod: "Paystack (Online)",
    paymentStatus: "Paid",
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
    paymentStatus: "Paid",
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
    paymentMethod: "Bank Transfer",
    paymentStatus: "Paid",
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
    paymentStatus: "Paid",
    source: "Front Desk Walk-In",
    createdAt: "2026-10-17 07:10"
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

export const portalStore = {
  // --- AUTHENTICATION ---
  // Preset secure credentials
  USERS: [
    {
      id: "u-admin",
      username: "admin@arabsignature.com",
      password: "admin2026",
      name: "Engr. K. O. (General Manager)",
      role: "admin",
      badge: "Executive Admin"
    },
    {
      id: "u-reception",
      username: "reception@arabsignature.com",
      password: "reception2026",
      name: "Front Desk Concierge Desk 1",
      role: "reception",
      badge: "Lead Receptionist"
    }
  ],

  login(usernameOrEmail, password) {
    const cleanedUser = usernameOrEmail.trim().toLowerCase();
    const user = this.USERS.find(
      u => u.username.toLowerCase() === cleanedUser && u.password === password
    );

    if (!user) {
      throw new Error("Invalid access credentials. Please verify username and password.");
    }

    const session = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      badge: user.badge,
      loginTime: new Date().toISOString()
    };

    setLocalItem(STORAGE_KEYS.AUTH, session);
    this.logActivity(`User ${user.name} logged into ${user.role} portal.`);
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

  // --- BOOKINGS LEDGER ---
  getBookings() {
    return getLocalItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },

  addBooking(bookingData) {
    const bookings = this.getBookings();
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
      paymentMethod: bookingData.paymentMethod || "Paystack (Online)",
      paymentStatus: bookingData.paymentStatus || "Paid",
      source: bookingData.source || "Direct Website",
      createdAt: new Date().toLocaleString()
    };

    const updated = [newBooking, ...bookings];
    setLocalItem(STORAGE_KEYS.BOOKINGS, updated);
    this.logActivity(`New reservation booked: ${newBooking.id} for ${newBooking.guestName} (${newBooking.roomName})`);
    return newBooking;
  },

  updateBookingStatus(bookingId, newStatus, assignedRoom = null) {
    const bookings = this.getBookings();
    const rooms = this.getRooms();

    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        const updatedBooking = { ...b, status: newStatus };
        if (assignedRoom) updatedBooking.roomNumber = assignedRoom;
        return updatedBooking;
      }
      return b;
    });

    setLocalItem(STORAGE_KEYS.BOOKINGS, updated);

    // If Checked In, update room inventory to occupied
    if (newStatus === "Checked In" && assignedRoom) {
      this.updateRoomStatus(assignedRoom, "occupied", bookings.find(b => b.id === bookingId)?.guestName);
    } else if (newStatus === "Completed" && assignedRoom) {
      this.updateRoomStatus(assignedRoom, "cleaning", null);
    }

    this.logActivity(`Booking ${bookingId} status updated to '${newStatus}'`);
    return updated;
  },

  // --- ROOMS INVENTORY ---
  getRooms() {
    return getLocalItem(STORAGE_KEYS.ROOMS, INITIAL_ROOMS_INVENTORY);
  },

  updateRoomStatus(roomNumber, newStatus, guestName = null) {
    const rooms = this.getRooms();
    const updated = rooms.map(r => {
      if (r.roomNumber === roomNumber) {
        return {
          ...r,
          status: newStatus,
          currentGuest: newStatus === 'occupied' ? (guestName || r.currentGuest) : (newStatus === 'cleaning' ? null : null)
        };
      }
      return r;
    });
    setLocalItem(STORAGE_KEYS.ROOMS, updated);
    this.logActivity(`Room ${roomNumber} status set to '${newStatus}'`);
    return updated;
  },

  // --- ROOM RATES (ADMIN CONTROLS) ---
  getRoomRates() {
    return getLocalItem(STORAGE_KEYS.ROOM_RATES, DEFAULT_ROOMS);
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
    return updated;
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
      `System initialized with 12 luxury suites in Nsugbe, Onitsha.`,
      `Reception portal ready for check-ins.`
    ]);
  },

  logActivity(msg) {
    const logs = this.getActivityLogs();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLogs = [`[${timestamp}] ${msg}`, ...logs.slice(0, 49)];
    setLocalItem(STORAGE_KEYS.ACTIVITY_LOG, newLogs);
  }
};
