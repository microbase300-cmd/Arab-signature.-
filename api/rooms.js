// Vercel Serverless Function: Real-Time Shared Hotel Room Inventory
// Backed by persistent cloud storage (MantleDB) for instant multi-window, multi-profile, and multi-device sync.

const MANTLE_ENDPOINT = 'https://mantledb.sh/v2/arab-signature-hotel-2026/inventory';

// Default initial inventory (12 luxury suites in Nsugbe, Onitsha - 7 live available baseline)
const DEFAULT_INVENTORY = [
  { roomNumber: "101", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "occupied", currentGuest: "Dr. Ngozi Adeleke", checkOut: "2026-10-22", price: 45000 },
  { roomNumber: "102", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "occupied", currentGuest: "Walk-In Guest", checkOut: "2026-10-20", price: 45000 },
  { roomNumber: "103", type: "deluxe", name: "Deluxe Doha Suite", floor: "Floor 1", status: "reserved", currentGuest: "Alhaji Ibrahim Musa", checkOut: "2026-10-23", price: 45000 },
  { roomNumber: "201", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "202", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "occupied", currentGuest: "Senator Chuka Nwosu", checkOut: "2026-10-21", price: 65000 },
  { roomNumber: "203", type: "executive", name: "Executive Arabian Suite", floor: "Floor 2", status: "available", currentGuest: null, checkOut: null, price: 65000 },
  { roomNumber: "301", type: "royal", name: "Royal Diplomatic Penthouse", floor: "Penthouse", status: "available", currentGuest: null, checkOut: null, price: 120000 },
  { roomNumber: "302", type: "royal", name: "Royal Diplomatic Penthouse", floor: "Penthouse", status: "available", currentGuest: null, checkOut: null, price: 120000 },
  { roomNumber: "401", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "402", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 },
  { roomNumber: "403", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "occupied", currentGuest: "Engr. Tunde Bakare", checkOut: "2026-10-20", price: 35000 },
  { roomNumber: "404", type: "standard", name: "Standard Classic Room", floor: "Floor 4", status: "available", currentGuest: null, checkOut: null, price: 35000 }
];

let memoryCache = null;
let lastSyncTimestamp = null;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Disable caching so updates are received with 0 delay across all devices
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Receptionist updates room inventory (e.g. Occupy, Make Available, Check Out)
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {}
      }

      const { rooms } = body || {};
      if (rooms && Array.isArray(rooms) && rooms.length > 0) {
        lastSyncTimestamp = Date.now();
        memoryCache = rooms;

        // Persist to MantleDB
        try {
          await fetch(MANTLE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rooms, updatedAt: lastSyncTimestamp }),
            signal: AbortSignal.timeout(3000)
          });
        } catch (storageErr) {
          console.warn('MantleDB write warning in /api/rooms:', storageErr);
        }

        const availableCount = rooms.filter(r => r.status === 'available').length;
        return res.status(200).json({
          success: true,
          availableCount,
          totalRooms: rooms.length,
          updatedAt: lastSyncTimestamp
        });
      }

      return res.status(400).json({ error: 'Invalid room inventory format' });
    } catch (err) {
      console.error('API /api/rooms POST error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // GET: AI Concierge, Guest Site, and Receptionist fetch the latest real-time inventory
  try {
    const cloudRes = await fetch(MANTLE_ENDPOINT, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(2500)
    });

    if (cloudRes.ok) {
      const data = await cloudRes.json();
      if (data && Array.isArray(data.rooms) && data.rooms.length > 0) {
        memoryCache = data.rooms;
        lastSyncTimestamp = data.updatedAt || Date.now();
        return res.status(200).json({
          rooms: data.rooms,
          availableCount: data.rooms.filter(r => r.status === 'available').length,
          updatedAt: lastSyncTimestamp,
          source: 'cloud_mantledb'
        });
      }
    }
  } catch (err) {
    console.warn('MantleDB read warning in /api/rooms:', err);
  }

  // Fallback to memory cache or baseline inventory
  const activeRooms = memoryCache || DEFAULT_INVENTORY;
  return res.status(200).json({
    rooms: activeRooms,
    availableCount: activeRooms.filter(r => r.status === 'available').length,
    updatedAt: lastSyncTimestamp || Date.now(),
    source: memoryCache ? 'memory_cache' : 'default_inventory'
  });
}
