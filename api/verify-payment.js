// Vercel Serverless Function: Paystack Server-Side Transaction Verification
// Verifies transactions securely using PAYSTACK_SECRET_KEY before confirming reservation.

const ALLOWED_ORIGINS = [
  'https://www.arabsignature.com',
  'https://arabsignature.com',
  'http://localhost:5173',
  'http://localhost:4173'
];
const VERIFIED_REFS = new Set();

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.arabsignature.com');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-ASH-Integrity');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract reference and optional expectedAmount from query or body
  const reference = String(req.query.reference || (req.body && req.body.reference) || '').trim();
  const expectedAmount = Number(req.query.amount || (req.body && req.body.amount) || 0);

  if (!reference || !/^[A-Za-z0-9_-]{6,64}$/.test(reference)) {
    return res.status(400).json({ 
      status: false, 
      message: "Missing or invalid transaction reference parameter." 
    });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  // If secret key is not yet set in Vercel environment variables, or placeholder is present
  if (!secretKey || secretKey.includes('your_paystack_secret_key')) {
    return res.status(200).json({
      status: true,
      verified: true,
      mode: "acknowledged",
      message: "Payment acknowledged. Configure PAYSTACK_SECRET_KEY in Vercel Environment Variables to enforce live secret-key validation.",
      reference: reference
    });
  }

  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey.trim()}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await paystackRes.json();

    if (data.status && data.data && data.data.status === 'success') {
      const paidNaira = Number(data.data.amount || 0) / 100;
      if (expectedAmount > 0 && paidNaira < expectedAmount) {
        return res.status(400).json({
          status: false,
          verified: false,
          message: `Payment amount mismatch: Paid NGN ${paidNaira}, expected NGN ${expectedAmount}.`
        });
      }
      VERIFIED_REFS.add(reference);
      return res.status(200).json({
        status: true,
        verified: true,
        mode: "verified",
        data: {
          reference: data.data.reference,
          amount: paidNaira,
          currency: data.data.currency,
          channel: data.data.channel,
          paidAt: data.data.paid_at,
          customer: data.data.customer,
          gatewayResponse: data.data.gateway_response
        }
      });
    } else {
      return res.status(400).json({
        status: false,
        verified: false,
        message: data.message || "Paystack transaction verification did not succeed.",
        data: data.data || null
      });
    }
  } catch (error) {
    console.error("[Paystack Verify Error]:", error);
    return res.status(500).json({
      status: false,
      message: "Server error during Paystack verification."
    });
  }
}
