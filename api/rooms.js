// Vercel Serverless Function: Real-Time Shared Hotel Room Inventory
// Enables live synchronization across all browser windows, profiles, and devices.

// In-memory persistent cache on warm Vercel execution environment
let liveRoomInventory = null;
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
        } catch (e) {
          // keep as is
        }
      }

      const { rooms } = body || {};
      if (rooms && Array.isArray(rooms) && rooms.length > 0) {
        liveRoomInventory = rooms;
        lastSyncTimestamp = Date.now();

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
  // Edge cache: 2s max-age to prevent hammering, while keeping live updates instantaneous
  res.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate=15');
  
  return res.status(200).json({
    rooms: liveRoomInventory,
    availableCount: liveRoomInventory ? liveRoomInventory.filter(r => r.status === 'available').length : null,
    updatedAt: lastSyncTimestamp
  });
}
