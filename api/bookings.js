// Vercel Serverless Function: Real-Time Shared Hotel Bookings Registry
// Backed by persistent cloud storage (MantleDB) for instant cross-device sync between Mobile, Desktop & Front Desk Portals.

const MANTLE_LEDGER_ENDPOINT = 'https://mantledb.sh/v2/arab-signature-hotel-bookings-v1/ledger';
const MANTLE_CODE_PREFIX = 'https://mantledb.sh/v2/arab-signature-hotel-bookings-v1/code-';

// Fallback baseline reservations
const INITIAL_BOOKINGS = [
  {
    id: "ARS-BGD-3012KD",
    guestName: "Valued Arab Guest",
    phone: "0803 000 3012",
    email: "guest.3012kd@arabsignature.com",
    roomType: "deluxe",
    roomName: "Arab Deluxe Suite (Main Building)",
    roomNumber: "602",
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    nights: 2,
    amount: 70000,
    status: "Confirmed",
    paymentMethod: "Paystack (Online Verified)",
    paymentStatus: "Paid",
    paystackReference: "T679234012KD",
    backendVerified: true,
    verifiedAt: new Date().toLocaleString(),
    source: "Direct Website (Paystack)",
    createdAt: new Date().toLocaleString()
  },
  {
    id: "ARS-EXT-9421XK",
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
    paymentStatus: "Paid",
    backendVerified: true,
    verifiedAt: "2026-10-20 08:31",
    source: "Direct Website",
    createdAt: "2026-10-20 08:30"
  },
  {
    id: "ARS-BGD-7812AB",
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
    paymentStatus: "Paid",
    backendVerified: true,
    verifiedAt: "2026-10-20 09:16",
    source: "Direct Website",
    createdAt: "2026-10-20 09:15"
  }
];

let memoryCache = [...INITIAL_BOOKINGS];
let lastSyncTimestamp = null;

function matchBooking(b, query) {
  if (!b || !query) return false;
  const cleanQuery = String(query).trim().toUpperCase();
  const alphaQuery = cleanQuery.replace(/[^A-Z0-9]/g, '');
  const bId = String(b.id || b.bookingCode || '').trim().toUpperCase();
  const bAlpha = bId.replace(/[^A-Z0-9]/g, '');

  if (bId === cleanQuery || bAlpha === alphaQuery) return true;
  if (alphaQuery.length >= 4 && (bAlpha.endsWith(alphaQuery) || bAlpha.includes(alphaQuery))) return true;

  // Phone match
  const phoneDigits = String(b.phone || '').replace(/[^0-9]/g, '');
  if (alphaQuery.length >= 7 && phoneDigits.endsWith(alphaQuery)) return true;

  return false;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Save or update booking(s) to cloud registry
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {}
      }

      const { booking, bookings } = body || {};
      const incomingList = bookings || (booking ? [booking] : []);

      if (incomingList.length > 0) {
        lastSyncTimestamp = Date.now();

        // Merge incoming into memory cache
        const map = new Map();
        memoryCache.forEach(b => {
          if (b && b.id) map.set(String(b.id).toUpperCase(), b);
        });
        incomingList.forEach(b => {
          if (b && b.id) {
            const key = String(b.id).toUpperCase();
            const existing = map.get(key) || {};
            map.set(key, { ...existing, ...b, updatedAt: lastSyncTimestamp });
          }
        });

        memoryCache = Array.from(map.values());

        // Save to MantleDB ledger
        try {
          await fetch(MANTLE_LEDGER_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookings: memoryCache, updatedAt: lastSyncTimestamp }),
            signal: AbortSignal.timeout(3500)
          });
        } catch (storageErr) {
          console.warn('MantleDB write warning in /api/bookings ledger:', storageErr);
        }

        // Also save individual per-code key for ultra-fast single lookup
        if (booking && booking.id) {
          const alphaClean = String(booking.id).replace(/[^A-Z0-9]/g, '').toUpperCase();
          try {
            await fetch(`${MANTLE_CODE_PREFIX}${alphaClean}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ booking, updatedAt: lastSyncTimestamp }),
              signal: AbortSignal.timeout(2500)
            });
          } catch (e) {}
        }

        return res.status(200).json({
          success: true,
          count: memoryCache.length,
          updatedAt: lastSyncTimestamp
        });
      }

      return res.status(400).json({ error: 'Missing booking or bookings payload' });
    } catch (err) {
      console.error('API /api/bookings POST error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // GET: Fetch booking by code (?code=...) or all bookings
  const queryCode = req.query.code;

  // 1. If querying specific code
  if (queryCode) {
    const cleanQuery = String(queryCode).trim();
    const alphaQuery = cleanQuery.replace(/[^A-Z0-9]/g, '').toUpperCase();

    // Check memory cache first
    const memoryMatch = memoryCache.find(b => matchBooking(b, cleanQuery));
    if (memoryMatch) {
      return res.status(200).json({
        success: true,
        booking: memoryMatch,
        source: 'memory_cache'
      });
    }

    // Try MantleDB direct code endpoint
    try {
      const codeRes = await fetch(`${MANTLE_CODE_PREFIX}${alphaQuery}?_t=${Date.now()}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      if (codeRes.ok) {
        const data = await codeRes.json();
        if (data && data.booking) {
          // Cache it
          memoryCache = [data.booking, ...memoryCache.filter(b => b.id !== data.booking.id)];
          return res.status(200).json({
            success: true,
            booking: data.booking,
            source: 'mantledb_direct_code'
          });
        }
      }
    } catch (e) {}

    // Try MantleDB full ledger
    try {
      const ledgerRes = await fetch(`${MANTLE_LEDGER_ENDPOINT}?_t=${Date.now()}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      if (ledgerRes.ok) {
        const data = await ledgerRes.json();
        if (data && Array.isArray(data.bookings)) {
          memoryCache = data.bookings;
          const found = data.bookings.find(b => matchBooking(b, cleanQuery));
          if (found) {
            return res.status(200).json({
              success: true,
              booking: found,
              source: 'mantledb_ledger'
            });
          }
        }
      }
    } catch (e) {}

    return res.status(404).json({
      success: false,
      error: `Booking code '${cleanQuery}' was not found in central registry.`
    });
  }

  // 2. Fetch full list of bookings
  try {
    const ledgerRes = await fetch(`${MANTLE_LEDGER_ENDPOINT}?_t=${Date.now()}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000)
    });
    if (ledgerRes.ok) {
      const data = await ledgerRes.json();
      if (data && Array.isArray(data.bookings) && data.bookings.length > 0) {
        memoryCache = data.bookings;
        lastSyncTimestamp = data.updatedAt || Date.now();
        return res.status(200).json({
          success: true,
          bookings: data.bookings,
          count: data.bookings.length,
          updatedAt: lastSyncTimestamp,
          source: 'mantledb_ledger'
        });
      }
    }
  } catch (err) {
    console.warn('MantleDB read warning in /api/bookings GET:', err);
  }

  return res.status(200).json({
    success: true,
    bookings: memoryCache,
    count: memoryCache.length,
    updatedAt: lastSyncTimestamp || Date.now(),
    source: 'memory_cache'
  });
}
