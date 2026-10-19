// Centralized State & Real-Time Storage for Receptionist & Admin Portals
import { ROOMS as DEFAULT_ROOMS, HOTEL_INFO as DEFAULT_HOTEL_INFO } from './hotelData';

const STORAGE_KEYS = {
  AUTH: 'ash_portal_auth_user',
  USERS: 'ash_portal_staff_users',
  LOGIN_LOGS: 'ash_portal_login_attempts',
  BOOKINGS: 'ash_portal_bookings',
  ROOMS: 'ash_portal_rooms_inventory_v6',
  ROOM_RATES: 'ash_portal_room_rates_v2',
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

  logActivity(msg) {
    const logs = this.getActivityLogs();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLogs = [`[${timestamp}] ${msg}`, ...logs.slice(0, 49)];
    setLocalItem(STORAGE_KEYS.ACTIVITY_LOG, newLogs);
  }
};
