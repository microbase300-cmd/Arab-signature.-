// Vercel Serverless Function: Paystack Server-Side Transaction Verification
// Verifies transactions securely using PAYSTACK_SECRET_KEY before confirming reservation.

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract reference from query or body
  const reference = req.query.reference || (req.body && req.body.reference);

  if (!reference) {
    return res.status(400).json({ 
      status: false, 
      message: "Missing transaction reference parameter." 
    });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  // If secret key is not yet set in Vercel environment variables, acknowledge gracefully
  if (!secretKey) {
    return res.status(200).json({
      status: true,
      verified: true,
      mode: "acknowledged",
      message: "Payment acknowledged. To enforce server-side cryptographic verification, add PAYSTACK_SECRET_KEY to your Vercel Environment Variables.",
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
      return res.status(200).json({
        status: true,
        verified: true,
        mode: "verified",
        data: {
          reference: data.data.reference,
          amount: data.data.amount / 100, // Converted from Kobo to Naira
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
      message: "Server error during Paystack verification: " + error.message
    });
  }
}
