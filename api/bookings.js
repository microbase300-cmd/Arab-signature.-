// Vercel Serverless Function: High-Speed Multi-Device Shared Hotel Bookings Registry
// Backed by persistent cloud ledger (MantleDB + restful-api.dev) + ntfy real-time pub/sub.

const MANTLE_LEDGER_URL = 'https://mantledb.sh/v2/arab-signature-hotel-bookings-prod-v1/ledger';
const RESTFUL_API_LEDGER_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a187be010f4d86';
const NTFY_TOPIC_URL = 'https://ntfy.sh/arab-signature-hotel-bookings-sync-v1';

// Production Clean Slate: 0 active demo bookings
const INITIAL_BOOKINGS = [];
const ALLOWED_ORIGINS = [
  'https://www.arabsignature.com',
  'https://arabsignature.com',
  'http://localhost:5173',
  'http://localhost:4173'
];
const ASH_CLIENT_INTEGRITY_TOKEN = 'ash-v2-verified-origin-9481';

let memoryCache = [...INITIAL_BOOKINGS];
let lastSyncTimestamp = null;

function stripScriptTags(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/on\w+\s*=/gi, '');
}

function sanitizeBooking(b) {
  if (!b || typeof b !== 'object') return null;
  const copy = { ...b };
  for (const key of Object.keys(copy)) {
    if (typeof copy[key] === 'string' && key !== 'proofOfPaymentImage') {
      copy[key] = stripScriptTags(copy[key]).slice(0, 1000);
    }
  }
  if (copy.proofOfPaymentImage && copy.proofOfPaymentImage.length > 500) {
    copy.proofOfPaymentImage = '[Image Uploaded to Server]';
  }
  return copy;
}

function matchBooking(b, query) {
  if (!b || !query) return false;
  const cleanQuery = String(query).trim().toUpperCase();
  const alphaQuery = cleanQuery.replace(/[^A-Z0-9]/g, '');
  const bId = String(b.id || b.bookingCode || '').trim().toUpperCase();
  const bAlpha = bId.replace(/[^A-Z0-9]/g, '');

  if (bId === cleanQuery || bAlpha === alphaQuery) return true;

  // Suffix exact match
  const strippedBId = bId.replace(/^(ARS-BGD-|ARS-EXT-|ASH-)/, '');
  const strippedClean = cleanQuery.replace(/^(ARS-BGD-|ARS-EXT-|ASH-)/, '');
  if (strippedBId && strippedClean && strippedBId === strippedClean) return true;

  const alphaStrippedBId = strippedBId.replace(/[^A-Z0-9]/g, '');
  const alphaStrippedClean = strippedClean.replace(/[^A-Z0-9]/g, '');
  if (alphaStrippedBId && alphaStrippedClean && alphaStrippedBId === alphaStrippedClean) return true;

  // Strict Phone match (full number: 10+ digits)
  const phoneDigits = String(b.phone || '').replace(/[^0-9]/g, '');
  if (alphaQuery.length >= 10 && phoneDigits.endsWith(alphaQuery)) return true;

  return false;
}

// Fetch master ledger from MantleDB (with restful-api.dev fallback)
async function fetchCloudLedger() {
  // 1. Primary: MantleDB
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(`${MANTLE_LEDGER_URL}?_t=${Date.now()}`, {
      headers: { 'Accept': 'application/json' },
      signal: ctrl.signal
    });
    clearTimeout(t);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.bookings)) {
        return data.bookings;
      }
    }
  } catch (e) {}

  // 2. Secondary fallback: restful-api.dev
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2000);
    const res = await fetch(RESTFUL_API_LEDGER_URL, {
      headers: { 'Accept': 'application/json' },
      signal: ctrl.signal
    });
    clearTimeout(t);
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.bookings && Array.isArray(data.data.bookings)) {
        return data.data.bookings;
      }
    }
  } catch (e) {}

  return null;
}

// Persist master ledger to MantleDB and restful-api.dev
async function persistCloudLedger(bookings) {
  // 1. Primary: MantleDB
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3500);
    await fetch(MANTLE_LEDGER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookings,
        updatedAt: Date.now()
      }),
      signal: ctrl.signal
    });
    clearTimeout(t);
  } catch (e) {}

  // 2. Secondary: restful-api.dev (if within rate limits)
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    await fetch(RESTFUL_API_LEDGER_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'arab_signature_hotel_ledger_v1',
        data: {
          bookings,
          updatedAt: Date.now()
        }
      }),
      signal: ctrl.signal
    });
    clearTimeout(t);
  } catch (e) {}
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.arabsignature.com');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-ASH-Integrity'
  );
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Save or update booking(s), or clear ledger if empty array passed
  if (req.method === 'POST') {
    try {
      const integrityHeader = req.headers['x-ash-integrity'] || '';
      const referer = req.headers.referer || '';
      const isTrustedOrigin =
        integrityHeader === ASH_CLIENT_INTEGRITY_TOKEN ||
        ALLOWED_ORIGINS.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        referer.includes('arabsignature.com') ||
        referer.includes('localhost');

      if (!isTrustedOrigin) {
        return res.status(403).json({ error: 'Forbidden: Untrusted request origin' });
      }

      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {}
      }

      const { booking, bookings } = body || {};

      // Explicit clear ledger command requires integrity header
      if (Array.isArray(bookings) && bookings.length === 0 && !booking) {
        if (integrityHeader !== ASH_CLIENT_INTEGRITY_TOKEN) {
          return res.status(403).json({ error: 'Forbidden: Ledger reset requires authorized staff session token' });
        }
        lastSyncTimestamp = Date.now();
        memoryCache = [];
        await persistCloudLedger([]);
        return res.status(200).json({
          success: true,
          count: 0,
          cleared: true,
          updatedAt: lastSyncTimestamp
        });
      }

      const incomingList = (bookings || (booking ? [booking] : [])).map(sanitizeBooking).filter(Boolean);

      if (incomingList.length > 0) {
        lastSyncTimestamp = Date.now();

        // 1. First fetch latest cloud ledger to prevent wiping out other devices' reservations
        const remoteBookings = await fetchCloudLedger();
        const baseList = remoteBookings || memoryCache;

        // 2. Merge incoming into base
        const map = new Map();
        baseList.forEach(b => {
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

        // 3. Persist asynchronously to MantleDB
        persistCloudLedger(memoryCache).catch(() => {});

        // 4. Broadcast to ntfy.sh for instant real-time SSE delivery (<100ms)
        const primarySingle = incomingList[0];
        if (primarySingle) {
          fetch(NTFY_TOPIC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(primarySingle)
          }).catch(() => {});
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

  if (queryCode) {
    const cleanQuery = String(queryCode).trim();

    // 1. Check memory cache
    const memoryMatch = memoryCache.find(b => matchBooking(b, cleanQuery));
    if (memoryMatch) {
      return res.status(200).json({
        success: true,
        booking: memoryMatch,
        source: 'memory_cache'
      });
    }

    // 2. Check cloud ledger
    const cloudBookings = await fetchCloudLedger();
    if (cloudBookings) {
      memoryCache = cloudBookings;
      const found = cloudBookings.find(b => matchBooking(b, cleanQuery));
      if (found) {
        return res.status(200).json({
          success: true,
          booking: found,
          source: 'cloud_ledger'
        });
      }
    }

    return res.status(404).json({
      success: false,
      error: `Booking code '${cleanQuery}' was not found in central reservation registry.`
    });
  }

  // Return all bookings
  const cloudBookings = await fetchCloudLedger();
  if (cloudBookings) {
    memoryCache = cloudBookings;
  }

  return res.status(200).json({
    success: true,
    bookings: memoryCache,
    count: memoryCache.length,
    updatedAt: lastSyncTimestamp || Date.now(),
    source: cloudBookings ? 'cloud_ledger' : 'memory_cache'
  });
}
