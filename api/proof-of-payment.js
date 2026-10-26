// Vercel Serverless Function: Upload, Compress & Persist Proof of Payment Slips
// Backed by persistent cloud storage (MantleDB) and memory cache so Admin and Accountant can inspect receipts across all devices.

const MANTLE_ENDPOINT = 'https://mantledb.sh/v2/arab-signature-hotel-34rooms-prod-v1/proofs';

let proofsMemoryCache = {};

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

  // POST: Receptionist or customer uploads compressed proof of payment image
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {}
      }

      const { bookingId, imageBase64, reference, guestName, uploadedBy, metadata } = body || {};

      if (!bookingId || !imageBase64) {
        return res.status(400).json({ error: 'Missing bookingId or imageBase64 payload' });
      }

      const proofRecord = {
        bookingId,
        imageBase64,
        reference: reference || '',
        guestName: guestName || '',
        uploadedBy: uploadedBy || 'Receptionist',
        uploadedAt: new Date().toISOString(),
        metadata: metadata || {}
      };

      // Store in memory cache
      proofsMemoryCache[bookingId] = proofRecord;

      // Persist to MantleDB Cloud Store
      try {
        await fetch(`${MANTLE_ENDPOINT}-${encodeURIComponent(bookingId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(proofRecord),
          signal: AbortSignal.timeout(4000)
        });
      } catch (storageErr) {
        console.warn('MantleDB proof write warning in /api/proof-of-payment:', storageErr);
      }

      return res.status(200).json({
        success: true,
        bookingId,
        uploadedAt: proofRecord.uploadedAt,
        message: 'Proof of payment saved successfully to server'
      });
    } catch (err) {
      console.error('API /api/proof-of-payment POST error:', err);
      return res.status(500).json({ error: 'Internal Server Error saving proof' });
    }
  }

  // GET: Admin or Accountant retrieves proof of payment for a booking
  if (req.method === 'GET') {
    try {
      const { bookingId } = req.query || {};

      if (!bookingId) {
        // Return summary list of cached proofs
        const summary = Object.keys(proofsMemoryCache).map((id) => ({
          bookingId: id,
          guestName: proofsMemoryCache[id]?.guestName,
          reference: proofsMemoryCache[id]?.reference,
          uploadedAt: proofsMemoryCache[id]?.uploadedAt
        }));
        return res.status(200).json({ proofs: summary });
      }

      if (proofsMemoryCache[bookingId]) {
        return res.status(200).json(proofsMemoryCache[bookingId]);
      }

      // Fetch from MantleDB Cloud
      try {
        const cloudRes = await fetch(`${MANTLE_ENDPOINT}-${encodeURIComponent(bookingId)}`, {
          signal: AbortSignal.timeout(4000)
        });
        if (cloudRes.ok) {
          const data = await cloudRes.json();
          if (data && data.imageBase64) {
            proofsMemoryCache[bookingId] = data;
            return res.status(200).json(data);
          }
        }
      } catch (cloudErr) {
        console.warn('MantleDB proof read warning in /api/proof-of-payment:', cloudErr);
      }

      return res.status(404).json({ error: 'Proof of payment not found for this booking' });
    } catch (err) {
      console.error('API /api/proof-of-payment GET error:', err);
      return res.status(500).json({ error: 'Internal Server Error retrieving proof' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
