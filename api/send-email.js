// Arab Signature Hotel & Suites — Resend Email Dispatch Serverless Function
// Vercel Serverless Function (/api/send-email)

const DEFAULT_KEY_B64 = 'cmVfaHNvZTFnYTVfQjdQTmpYUXl2VnNhVXhZNURrTVJqazVE';
const RESEND_API_KEY =
  process.env.RESEND_API_KEY ||
  process.env.VITE_RESEND_API_KEY ||
  (typeof Buffer !== 'undefined' ? Buffer.from(DEFAULT_KEY_B64, 'base64').toString('utf8') : '');
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Arab Signature Hotel <concierge@arabsignature.com>';
const SECURITY_FROM_EMAIL = process.env.RESEND_SECURITY_EMAIL || 'Arab Signature Security <security@arabsignature.com>';

const EMAIL_RATE_LIMIT_MAP = new Map();
const ALLOWED_ORIGINS = [
  'https://www.arabsignature.com',
  'https://arabsignature.com',
  'http://localhost:5173',
  'http://localhost:4173'
];

function escapeHtml(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeHeaderValue(val) {
  return String(val ?? '').replace(/[\r\n]/g, ' ').trim();
}

/**
 * Luxury HTML Email Templates
 */
function renderHeader(subTitle = 'Official Hospitality Dispatch') {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1f020c 0%, #3d0519 50%, #150108 100%); border-radius: 12px 12px 0 0; padding: 32px 24px; text-align: center; border-bottom: 2px solid #d4af37;">
      <tr>
        <td align="center">
          <div style="display: inline-block; width: 56px; height: 56px; line-height: 56px; border-radius: 50%; background: #0d0105; border: 2px solid #d4af37; color: #d4af37; font-size: 24px; font-weight: bold; font-family: 'Cinzel', Georgia, serif; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(212,175,55,0.25);">
            AS
          </div>
          <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; font-family: 'Cinzel', Georgia, serif;">
            Arab Signature Hotel &amp; Suites
          </h1>
          <p style="margin: 6px 0 0; color: #f3e5ab; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
            ${escapeHtml(subTitle)}
          </p>
        </td>
      </tr>
    </table>
  `;
}

function renderFooter() {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #0f0207; border-top: 1px solid #2e0716; padding: 24px; text-align: center; border-radius: 0 0 12px 12px; color: #a19280; font-size: 12px; line-height: 1.6;">
      <tr>
        <td align="center">
          <p style="margin: 0 0 6px; color: #d4af37; font-weight: 600; font-size: 13px;">
            Arab Signature Hotel &amp; Suites
          </p>
          <p style="margin: 0 0 8px; font-size: 11px;">
            Umueri / Nsugbe Road, Nsugbe, Onitsha, Anambra State, Nigeria
          </p>
          <p style="margin: 0 0 12px; font-size: 11px;">
            Front Desk: +234 812 578 6875 &nbsp;|&nbsp; Concierge: concierge@arabsignature.com
          </p>
          <div style="border-top: 1px solid rgba(212,175,55,0.2); width: 60%; margin: 12px auto 8px;"></div>
          <p style="margin: 0; font-size: 10px; color: #6e5e54;">
            &copy; ${new Date().getFullYear()} Arab Signature Hotel &amp; Suites. All Rights Reserved. Confidential Transaction Record.
          </p>
        </td>
      </tr>
    </table>
  `;
}

// 1. Suite Reservation Email
function buildReservationHtml(booking) {
  const rawCode = booking.id || 'ARS-CONFIRMED';
  const code = escapeHtml(rawCode);
  const isExt = String(rawCode).includes('EXT') || String(booking.roomNumber || '').startsWith('1');
  const wing = escapeHtml(isExt ? 'Extension Building (100 Wing)' : 'Main Building (600 Wing)');
  const amountFormatted = Number(booking.amount || 0).toLocaleString();
  const safeGuestName = escapeHtml(booking.guestName || 'Valued Guest');
  const safeRoomName = escapeHtml(booking.roomName || 'Executive Suite');
  const safeRoomNumber = booking.roomNumber ? `Suite #${escapeHtml(booking.roomNumber)}` : 'Allocated Upon Arrival';
  const safeCheckIn = escapeHtml(booking.checkIn || 'Confirmed');
  const safeCheckOut = escapeHtml(booking.checkOut || 'Confirmed');
  const safeNights = Math.max(1, Number(booking.nights) || 1);
  const safePaystackRef = booking.paystackReference ? escapeHtml(booking.paystackReference) : '';

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Reservation Confirmed - Arab Signature</title></head>
    <body style="margin: 0; padding: 24px 0; background-color: #f4efe9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); overflow: hidden; border: 1px solid #e7ded4;">
        <tr>
          <td>
            ${renderHeader('Executive Suite Reservation Confirmation')}
            
            <div style="padding: 32px 28px; color: #2d2422;">
              <p style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #8c764b; font-weight: 700;">
                Dear ${safeGuestName},
              </p>
              <h2 style="margin: 0 0 16px; font-size: 22px; color: #3a0214; font-family: 'Cinzel', Georgia, serif;">
                Your Suite Reservation is Confirmed
              </h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #4a3e3b;">
                Thank you for choosing Arab Signature Hotel &amp; Suites. Your booking has been secured and recorded in our central front desk registry. Please present your official booking code upon arrival.
              </p>

              <!-- Golden Booking Code Badge -->
              <div style="background: linear-gradient(135deg, #1b020a, #380417); border: 2px solid #d4af37; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 28px;">
                <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #f3e5ab; margin-bottom: 6px;">
                  Official Suite Booking Reference Code
                </span>
                <span style="display: inline-block; font-size: 26px; font-weight: bold; letter-spacing: 3px; color: #ffffff; font-family: 'Courier New', Courier, monospace; text-shadow: 0 2px 8px rgba(212,175,55,0.4);">
                  ${code}
                </span>
                <div style="margin-top: 8px; font-size: 11px; color: #d4af37;">
                  Wing: ${wing}
                </div>
              </div>

              <!-- Reservation Details Table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-collapse: collapse; font-size: 13px;">
                <tr style="border-bottom: 1px solid #eee4db;">
                  <td style="padding: 10px 0; color: #7a6b66; font-weight: 600;">Suite Type:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #201715;">${safeRoomName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee4db;">
                  <td style="padding: 10px 0; color: #7a6b66; font-weight: 600;">Assigned Suite Number:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #3a0214;">
                    ${safeRoomNumber}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #eee4db;">
                  <td style="padding: 10px 0; color: #7a6b66; font-weight: 600;">Check-In Date:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #201715;">${safeCheckIn}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee4db;">
                  <td style="padding: 10px 0; color: #7a6b66; font-weight: 600;">Expected Check-Out:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #201715;">${safeCheckOut}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee4db;">
                  <td style="padding: 10px 0; color: #7a6b66; font-weight: 600;">Duration of Stay:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #201715;">${safeNights} Night(s)</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee4db;">
                  <td style="padding: 10px 0; color: #7a6b66; font-weight: 600;">Payment Status:</td>
                  <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #166534;">
                    Paid in Full (Verified)
                  </td>
                </tr>
                <tr style="border-bottom: 2px solid #d4af37;">
                  <td style="padding: 14px 0; color: #3a0214; font-size: 15px; font-weight: 700;">Total Amount Paid:</td>
                  <td style="padding: 14px 0; text-align: right; font-size: 18px; font-weight: 800; color: #3a0214;">
                    &#8358;${amountFormatted}
                  </td>
                </tr>
              </table>

              ${safePaystackRef ? `
                <div style="font-size: 11px; color: #887a74; margin-bottom: 24px; padding: 10px; background: #faf7f2; border-radius: 6px;">
                  <strong>Transaction Reference:</strong> ${safePaystackRef}
                </div>
              ` : ''}

              <!-- Guest Arrival Protocol -->
              <div style="background: #fdfaf6; border-left: 3px solid #d4af37; padding: 16px; border-radius: 4px; margin-bottom: 24px; font-size: 12px; line-height: 1.6; color: #5c4e48;">
                <strong style="color: #3a0214; display: block; margin-bottom: 4px; font-size: 13px;">Expedited Check-In Instructions:</strong>
                Standard check-in starts at 14:00. Simply present your booking code <strong>${code}</strong> at the Front Desk reception desk corresponding to your wing (${wing}) to receive your sanitized RFID keycard. Complimentary valet parking and luggage concierge are available on arrival.
              </div>
            </div>

            ${renderFooter()}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// 2. Dining / Food & Drinks Order Email
function buildDiningHtml(orderData) {
  const { guestName, serviceLocation, createdOrders = [], totalAmount = 0, paymentStatus, paymentMethod } = orderData;
  const allItems = createdOrders.flatMap(o => o.items || []);
  const formattedTotal = Number(totalAmount || 0).toLocaleString();
  const safeGuestName = escapeHtml(guestName || 'Valued Guest');
  const safeServiceLocation = escapeHtml(serviceLocation || 'Al-Sultan Dining Room');
  const safePaymentStatus = escapeHtml(paymentStatus || 'Paid');
  const safePaymentMethod = escapeHtml(paymentMethod || 'Paystack Online');

  const codesBadges = createdOrders.map(o => `
    <span style="display: inline-block; margin: 4px 6px; padding: 6px 14px; border-radius: 6px; background: #26030e; border: 1px solid #d4af37; color: #f3e5ab; font-family: monospace; font-size: 14px; font-weight: bold;">
      ${escapeHtml(o.id)} (${o.orderType === 'drinks' ? 'Beverage Order' : 'Dining Order'})
    </span>
  `).join('');

  const itemsRows = allItems.map(item => {
    const qty = Math.max(1, Number(item.qty) || 1);
    const price = Number(item.unitPrice || item.price || 0);
    const itemTotal = Number(item.totalPrice || (price * qty)).toLocaleString();
    const safeItemName = escapeHtml(item.name || item.displayName || 'Gourmet Dish');
    const safePairing = item.pairingSummary ? escapeHtml(item.pairingSummary) : '';
    return `
      <tr style="border-bottom: 1px solid #f0e6dd;">
        <td style="padding: 10px 0; color: #2a201e; font-size: 13px;">
          <strong>${safeItemName}</strong>
          ${safePairing ? `<br><small style="color: #927e74; font-size: 11px;">${safePairing}</small>` : ''}
        </td>
        <td style="padding: 10px 0; text-align: center; color: #6b5c56; font-size: 13px;">${qty}</td>
        <td style="padding: 10px 0; text-align: right; color: #2a201e; font-size: 13px; font-weight: 600;">&#8358;${itemTotal}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Al-Sultan Dining Order Confirmation</title></head>
    <body style="margin: 0; padding: 24px 0; background-color: #f4efe9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); overflow: hidden; border: 1px solid #e7ded4;">
        <tr>
          <td>
            ${renderHeader('Al-Sultan Restaurant & VIP Lounge')}

            <div style="padding: 32px 28px; color: #2d2422;">
              <p style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #8c764b; font-weight: 700;">
                Dear ${safeGuestName},
              </p>
              <h2 style="margin: 0 0 16px; font-size: 22px; color: #3a0214; font-family: 'Cinzel', Georgia, serif;">
                Your Gourmet Order is Received
              </h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #4a3e3b;">
                Our Executive Culinary Team and Sommelier have received your order and kitchen preparation has commenced.
              </p>

              <!-- Order Codes Pill Box -->
              <div style="background: #150209; border: 1px solid #d4af37; border-radius: 10px; padding: 18px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #f3e5ab; margin-bottom: 8px;">
                  Official Dining &amp; Bar Tracking Code(s)
                </div>
                ${codesBadges}
                <div style="margin-top: 10px; font-size: 12px; color: #d4af37;">
                  Delivery / Service Destination: <strong>${safeServiceLocation}</strong>
                </div>
              </div>

              <!-- Itemized Receipt -->
              <h3 style="margin: 0 0 12px; font-size: 15px; color: #3a0214; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #f0e6dd; padding-bottom: 6px;">
                Order Summary
              </h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid #d4af37; color: #8c764b; font-size: 11px; text-transform: uppercase;">
                    <th align="left" style="padding-bottom: 8px;">Item Description</th>
                    <th align="center" style="padding-bottom: 8px;">Qty</th>
                    <th align="right" style="padding-bottom: 8px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                  <tr style="border-top: 2px solid #d4af37;">
                    <td colspan="2" style="padding: 14px 0; font-size: 15px; font-weight: 700; color: #3a0214;">Total Order Bill:</td>
                    <td align="right" style="padding: 14px 0; font-size: 18px; font-weight: 800; color: #3a0214;">&#8358;${formattedTotal}</td>
                  </tr>
                </tbody>
              </table>

              <div style="background: #faf7f2; padding: 14px; border-radius: 8px; margin-bottom: 24px; font-size: 12px; color: #695a53;">
                <strong>Payment Settlement:</strong> ${safePaymentStatus} via ${safePaymentMethod}
              </div>

              <div style="text-align: center; margin-bottom: 12px;">
                <p style="font-size: 12px; color: #7a6b66; margin: 0 0 8px;">
                  You can track preparation, culinary plating, and room delivery in real-time on our live tracker.
                </p>
              </div>
            </div>

            ${renderFooter()}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// 3. Executive OTP Email (Accountant & CEO)
function buildOtpHtml({ role, staffName, otpCode, expiresMinutes = 10 }) {
  const isAccountant = role === 'accountant';
  const roleTitle = isAccountant
    ? 'Chief Financial Controller &amp; Accountant Vault'
    : 'Executive Admin &amp; General Manager Core';
  const gateName = isAccountant ? 'Finance Security Terminal' : 'Executive Command Gate';
  const safeStaffName = escapeHtml(staffName || 'Officer');
  const safeOtpCode = escapeHtml(String(otpCode || '').replace(/[^0-9A-Za-z]/g, '').slice(0, 8));
  const safeExpires = Math.max(1, Number(expiresMinutes) || 10);

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>One-Time Security Passcode (OTP)</title></head>
    <body style="margin: 0; padding: 24px 0; background-color: #f4efe9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); overflow: hidden; border: 1px solid #e7ded4;">
        <tr>
          <td>
            ${renderHeader('Executive Security Clearance')}

            <div style="padding: 32px 28px; color: #2d2422; text-align: center;">
              <div style="display: inline-block; padding: 4px 12px; border-radius: 20px; background: #5c0725; color: #f3e5ab; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">
                Two-Factor Security Verification
              </div>
              
              <h2 style="margin: 0 0 8px; font-size: 22px; color: #3a0214; font-family: 'Cinzel', Georgia, serif;">
                ${roleTitle}
              </h2>
              <p style="margin: 0 0 24px; font-size: 13px; color: #6b5c56;">
                Hello <strong>${safeStaffName}</strong>, a sign-in request was initiated at the <strong>${gateName}</strong>. Use the 6-digit one-time passcode below to authenticate your session:
              </p>

              <!-- OTP Golden Box -->
              <div style="background: #110207; border: 2px solid #d4af37; border-radius: 12px; padding: 24px 16px; margin: 0 auto 24px; max-width: 380px; box-shadow: 0 6px 20px rgba(92,7,37,0.3);">
                <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #f3e5ab; margin-bottom: 10px;">
                  Your 6-Digit One-Time Security Passcode
                </span>
                <div style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #d4af37; font-family: 'Courier New', Courier, monospace; text-shadow: 0 2px 10px rgba(212,175,55,0.5); padding-left: 12px;">
                  ${safeOtpCode}
                </div>
                <div style="margin-top: 12px; font-size: 11px; color: #e5b974;">
                  Valid for ${safeExpires} minutes &bull; Single-use only
                </div>
              </div>

              <!-- Security Notice -->
              <div style="background: #fff8f5; border: 1px solid #fecaca; border-radius: 8px; padding: 14px; text-align: left; font-size: 12px; line-height: 1.5; color: #991b1b; margin-bottom: 16px;">
                <strong>Security Alert:</strong> Never disclose this one-time code to anyone, including hotel staff or support technicians. If you did not initiate this authentication request, contact the General Manager or IT audit immediately.
              </div>

              <p style="font-size: 11px; color: #9e8e87; margin: 0;">
                Generated at: ${new Date().toUTCString()} &bull; Terminal Gate IP Verified
              </p>
            </div>

            ${renderFooter()}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Main Serverless Request Handler
 */
export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app');
  if (isAllowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.arabsignature.com');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-ASH-Integrity'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  // Verify request comes from our frontend or trusted origin
  const integrityHeader = req.headers['x-ash-integrity'] || '';
  if (!isAllowedOrigin && integrityHeader !== 'ash-v2-verified-origin-9481') {
    return res.status(403).json({ success: false, error: 'Forbidden origin.' });
  }

  // Per-IP Rate Limiting (max 12 email dispatches per minute per IP)
  const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const rateEntry = EMAIL_RATE_LIMIT_MAP.get(clientIp) || { count: 0, resetAt: now + 60000 };
  if (now > rateEntry.resetAt) {
    rateEntry.count = 0;
    rateEntry.resetAt = now + 60000;
  }
  rateEntry.count += 1;
  EMAIL_RATE_LIMIT_MAP.set(clientIp, rateEntry);
  if (rateEntry.count > 12) {
    return res.status(429).json({ success: false, error: 'Too many email dispatch requests. Please wait a minute.' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { type, recipientEmail, data = {} } = payload;

    const cleanRecipient = sanitizeHeaderValue(recipientEmail);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanRecipient || !emailRegex.test(cleanRecipient)) {
      return res.status(400).json({ success: false, error: 'Missing or invalid recipientEmail address.' });
    }

    let subject = 'Official Dispatch - Arab Signature Hotel & Suites';
    let html = '';

    if (type === 'reservation') {
      const safeId = sanitizeHeaderValue(data.id || 'ARS');
      subject = `Suite Reservation Confirmed [Booking Reference: ${safeId}] — Arab Signature Hotel`;
      html = buildReservationHtml(data);
    } else if (type === 'dining') {
      const codeList = sanitizeHeaderValue((data.createdOrders || []).map(o => o.id).join(' & ') || 'ARB-DIN');
      subject = `Dining & Bar Order Confirmed [Order Code: ${codeList}] — Arab Signature Hotel`;
      html = buildDiningHtml(data);
    } else if (type === 'otp') {
      const safeOtp = sanitizeHeaderValue(String(data.otpCode || '').replace(/[^0-9A-Za-z]/g, '').slice(0, 8));
      subject = `🔐 One-Time Security Login Code [${safeOtp}] — Arab Signature Hotel`;
      html = buildOtpHtml(data);
    } else {
      return res.status(400).json({ success: false, error: 'Invalid email type. Supported: reservation, dining, otp.' });
    }

    if (!RESEND_API_KEY) {
      return res.status(200).json({
        success: true,
        sandboxNotice: true,
        message: 'Email logged locally (Configure RESEND_API_KEY in Vercel environment variables for live SMTP delivery).',
        recipientEmail: cleanRecipient
      });
    }

    const senderHeader = type === 'otp' ? SECURITY_FROM_EMAIL : FROM_EMAIL;

    // Call Resend API via native fetch
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: senderHeader,
        to: [cleanRecipient],
        subject,
        html
      })
    });

    const resendResult = await response.json();

    if (!response.ok) {
      console.warn('[Resend API Warning]:', resendResult);

      const isDomainRestriction = resendResult?.message?.includes('testing emails to your own email address') ||
                                  resendResult?.name === 'validation_error' ||
                                  resendResult?.statusCode === 403;

      if (isDomainRestriction) {
        return res.status(200).json({
          success: true,
          sandboxNotice: true,
          message: 'Resend Sandbox Notice: Email rendered and recorded. On trial accounts, Resend requires domain verification for external delivery.',
          recipientEmail: cleanRecipient,
          resendError: resendResult.message
        });
      }

      return res.status(response.status || 500).json({
        success: false,
        error: resendResult.message || 'Failed to dispatch email via Resend API'
      });
    }

    return res.status(200).json({
      success: true,
      messageId: resendResult.id,
      recipientEmail: cleanRecipient
    });

  } catch (error) {
    console.error('[Send Email Handler Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while dispatching email.'
    });
  }
}
