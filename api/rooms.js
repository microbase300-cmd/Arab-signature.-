// Vercel Serverless Function: Real-Time Shared Hotel Room Inventory
// Backed by persistent cloud storage (MantleDB) for instant multi-window, multi-profile, and multi-device sync.

const MANTLE_ENDPOINT = 'https://mantledb.sh/v2/arab-signature-hotel-34rooms-v2/inventory';

// 1. Initial Room Inventory (34 Authentic Rooms Across 2 Buildings in Nsugbe, Onitsha)
const DEFAULT_INVENTORY = [
  // ==========================================
  // MAIN BUILDING (20 Rooms total • 600 Wing)
  // Super Exec (₦60k), Exec (₦50k), Superior (₦40k), Deluxe (₦35k), Standard (₦30k)
  // ==========================================
  { roomNumber: "601", building: "Main Building", floor: "Main Building", type: "executive", name: "Executive Room", price: 50000, status: "reserved", currentGuest: "Alhaji Ibrahim Musa", checkOut: "2026-10-23" },
  { roomNumber: "602", building: "Main Building", floor: "Main Building", type: "deluxe", name: "Deluxe Room", price: 35000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "603", building: "Main Building", floor: "Main Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "604", building: "Main Building", floor: "Main Building", type: "deluxe", name: "Deluxe Room", price: 35000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "605", building: "Main Building", floor: "Main Building", type: "super-executive", name: "Super Executive Room", price: 60000, status: "occupied", currentGuest: "Senator Chuka Nwosu", checkOut: "2026-10-23" },
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
  { roomNumber: "620", building: "Main Building", floor: "Main Building", type: "deluxe", name: "Deluxe Room", price: 35000, status: "cleaning", currentGuest: null, checkOut: null },

  // ==========================================
  // EXTENSION BUILDING (14 Rooms total • 100 Wing)
  // Suites (₦120k), Super-Exec (₦60k), Exec (₦50k), Superior (₦40k)
  // ==========================================
  { roomNumber: "101", building: "Extension Building", floor: "Extension Building", type: "superior", name: "Superior Room", price: 40000, status: "occupied", currentGuest: "Dr. Ngozi Adeleke", checkOut: "2026-10-22" },
  { roomNumber: "102", building: "Extension Building", floor: "Extension Building", type: "super-executive", name: "Super Executive Room", price: 60000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "103", building: "Extension Building", floor: "Extension Building", type: "executive", name: "Executive Room", price: 50000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "104", building: "Extension Building", floor: "Extension Building", type: "executive", name: "Executive Room", price: 50000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "105", building: "Extension Building", floor: "Extension Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "106", building: "Extension Building", floor: "Extension Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "107", building: "Extension Building", floor: "Extension Building", type: "suites", name: "Diplomatic Suite", price: 120000, status: "occupied", currentGuest: "Chief Emeka Obi", checkOut: "2026-10-24" },
  { roomNumber: "108", building: "Extension Building", floor: "Extension Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "109", building: "Extension Building", floor: "Extension Building", type: "super-executive", name: "Super Executive Room", price: 60000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "110", building: "Extension Building", floor: "Extension Building", type: "executive", name: "Executive Room", price: 50000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "111", building: "Extension Building", floor: "Extension Building", type: "executive", name: "Executive Room", price: 50000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "112", building: "Extension Building", floor: "Extension Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "113", building: "Extension Building", floor: "Extension Building", type: "superior", name: "Superior Room", price: 40000, status: "available", currentGuest: null, checkOut: null },
  { roomNumber: "114", building: "Extension Building", floor: "Extension Building", type: "suites", name: "Diplomatic Suite", price: 120000, status: "available", currentGuest: null, checkOut: null }
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
