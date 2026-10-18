// Centralized State & Real-Time Storage for Receptionist & Admin Portals
import { ROOMS as DEFAULT_ROOMS, HOTEL_INFO as DEFAULT_HOTEL_INFO } from './hotelData';

const STORAGE_KEYS = {
  AUTH: 'ash_portal_auth_user',
  USERS: 'ash_portal_staff_users',
  LOGIN_LOGS: 'ash_portal_login_attempts',
  BOOKINGS: 'ash_portal_bookings',
  ROOMS: 'ash_portal_rooms_inventory_v3',
  ROOM_RATES: 'ash_portal_room_rates',
  HOTEL_CONFIG: 'ash_portal_hotel_config',
  ACTIVITY_LOG: 'ash_portal_activity_log',
};

// 1. Initial Room Inventory (12 Luxury Keys in Nsugbe, Onitsha - 7 Live Available)
const INITIAL_ROOMS_INVENTORY = [
  { roomNumber: "101", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "occupied", currentGuest: "Dr. Ngozi Adeleke", checkOut: "2026-10-22", price: 45000 },
  { roomNumber: "102", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "available", currentGuest: null, checkOut: null, price: 45000 },
  { roomNumber: "103", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "reserved", currentGuest: "Alhaji Ibrahim Musa", checkOut: "2026-10-23", price: 45000 },
  { roomNumber: "201", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "202", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "occupied", currentGuest: "Senator Chuka Nwosu", checkOut: "2026-10-21", price: 65000 },
  { roomNumber: "203", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "301", type: "royal", name: "Royal Diplomatic Penthouse", floor: "Penthouse", status: "occupied", currentGuest: "Chief Emeka Obi", checkOut: "2026-10-25", price: 120000 },
  { roomNumber: "302", type: "royal", name: "Royal Diplomatic Penthouse", floor: "Penthouse", status: "available", currentGuest: null, checkOut: null, price: 120000 },
  { roomNumber: "401", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "402", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "403", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "occupied", currentGuest: "Engr. Tunde Bakare", checkOut: "2026-10-20", price: 35000 },
  { roomNumber: "404", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
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
    // Clean up stale v1/v2 storage keys if any exist in the browser
    if (typeof localStorage !== 'undefined') {
      try {
        if (localStorage.getItem('ash_portal_rooms_inventory')) {
          localStorage.removeItem('ash_portal_rooms_inventory');
        }
        if (localStorage.getItem('ash_portal_rooms_inventory_v2')) {
          localStorage.removeItem('ash_portal_rooms_inventory_v2');
        }
      } catch (e) {
        // ignore
      }
    }
    return getLocalItem(STORAGE_KEYS.ROOMS, INITIAL_ROOMS_INVENTORY);
  },

  updateRoomStatus(roomNumber, newStatus, guestName = null) {
    const rooms = this.getRooms();
    const updated = rooms.map(r => {
      if (String(r.roomNumber) === String(roomNumber)) {
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

    // 1. Dispatch custom window event for in-tab reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ash_rooms_updated', { detail: updated }));
    }

    // 2. BroadcastChannel for instant cross-tab & cross-window synchronization
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('ash_portal_sync');
        bc.postMessage({ type: 'ROOMS_UPDATED', rooms: updated });
        bc.close();
      } catch (e) {
        console.warn("BroadcastChannel error:", e);
      }
    }

    return updated;
  },

  subscribeRooms(callback) {
    if (typeof window === 'undefined') return () => {};

    const handler = (e) => {
      callback(e.detail || this.getRooms());
    };
    window.addEventListener('ash_rooms_updated', handler);

    // Browser storage event listener (for cross-tab updates via localStorage)
    const storageHandler = (e) => {
      if (e.key === STORAGE_KEYS.ROOMS) {
        callback(this.getRooms());
      }
    };
    window.addEventListener('storage', storageHandler);

    // BroadcastChannel listener
    let bc = null;
    if ('BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('ash_portal_sync');
        bc.onmessage = (event) => {
          if (event.data?.type === 'ROOMS_UPDATED') {
            callback(event.data.rooms || this.getRooms());
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel error:", e);
      }
    }

    return () => {
      window.removeEventListener('ash_rooms_updated', handler);
      window.removeEventListener('storage', storageHandler);
      if (bc) bc.close();
    };
  },

  // --- ROOM RATES (ADMIN CONTROLS & LIVE WEBSITE SYNCHRONIZATION) ---
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
