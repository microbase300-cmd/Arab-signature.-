// Arab Signature Hotel & Suites — Email Dispatch Service
// Supports Suite Reservation Confirmations, Al-Sultan Dining Order Tracking, and Executive OTP Passcodes

const RESEND_PUBLIC_FALLBACK_KEY = import.meta.env.VITE_RESEND_API_KEY || '';
const STORAGE_EMAIL_LOGS = 'ash_dispatched_email_logs';

/**
 * Record sent email into client audit logs (for Admin and Accountant review)
 */
function recordEmailLog(entry) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_EMAIL_LOGS);
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift({
      id: `EML-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      ...entry
    });
    // Keep last 100 email logs
    localStorage.setItem(STORAGE_EMAIL_LOGS, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.warn('[Email Audit Log Warning]:', e);
  }
}

/**
 * Helper to dispatch email via local/Vercel /api/send-email endpoint
 */
async function dispatchEmailEndpoint(payload) {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      recordEmailLog({
        type: payload.type,
        recipient: payload.recipientEmail,
        status: data.sandboxNotice ? 'SANDBOX_DELIVERED' : 'SENT',
        messageId: data.messageId || null,
        notice: data.message || 'Dispatched successfully'
      });
      return data;
    }

    const errData = await res.json().catch(() => ({}));
    console.warn('[Email Service Serverless Notice]:', errData);

    // If serverless endpoint returned an error, record failure
    recordEmailLog({
      type: payload.type,
      recipient: payload.recipientEmail,
      status: 'FAILED',
      error: errData.error || `HTTP ${res.status}`
    });

    return {
      success: false,
      error: errData.error || `Failed to dispatch email (HTTP ${res.status})`
    };
  } catch (networkErr) {
    console.warn('[Email Service Network Warning]:', networkErr);
    recordEmailLog({
      type: payload.type,
      recipient: payload.recipientEmail,
      status: 'NETWORK_ERROR',
      error: networkErr.message
    });
    return {
      success: false,
      error: networkErr.message
    };
  }
}

/**
 * 1. Send Suite Reservation Confirmation Email
 */
export async function sendReservationEmail(booking) {
  if (!booking || !booking.email || !booking.email.includes('@')) {
    console.log('[Email Service]: No valid guest email provided for booking', booking?.id);
    return { success: false, reason: 'No valid guest email' };
  }

  return await dispatchEmailEndpoint({
    type: 'reservation',
    recipientEmail: booking.email.trim(),
    data: {
      id: booking.id,
      guestName: booking.guestName,
      roomName: booking.roomName,
      roomNumber: booking.roomNumber,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights,
      amount: booking.amount,
      paystackReference: booking.paystackReference
    }
  });
}

/**
 * 2. Send Dining & Bar Order Confirmation Email (Food ARB-FDD / Drinks ARB-DRK)
 */
export async function sendDiningOrderEmail(orderData) {
  const recipient = orderData?.email || orderData?.guestEmail;
  if (!recipient || !recipient.includes('@')) {
    console.log('[Email Service]: No guest email provided for dining order.');
    return { success: false, reason: 'No guest email' };
  }

  return await dispatchEmailEndpoint({
    type: 'dining',
    recipientEmail: recipient.trim(),
    data: {
      guestName: orderData.guestName || 'Valued Guest',
      email: recipient.trim(),
      serviceLocation: orderData.serviceLocation || 'Al-Sultan Restaurant',
      createdOrders: orderData.createdOrders || [],
      totalAmount: orderData.totalAmount || 0,
      paymentStatus: orderData.paymentStatus || 'Paid',
      paymentMethod: orderData.paymentMethod || 'Online'
    }
  });
}

/**
 * 3. Send Staff Executive OTP (Chief Accountant & General Manager Admin)
 */
export async function sendStaffOtpEmail({ role, staffName, email, otpCode, expiresMinutes = 10 }) {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Staff account has no valid email address configured.' };
  }

  const result = await dispatchEmailEndpoint({
    type: 'otp',
    recipientEmail: email.trim(),
    data: {
      role,
      staffName,
      otpCode,
      expiresMinutes
    }
  });

  // If Resend is on free tier / sandbox restriction, save debug devOtp into sessionStorage
  // so testing can proceed seamlessly without blocking
  if (result?.sandboxNotice && result?.devOtp && typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(`ash_dev_otp_${role}`, result.devOtp);
    } catch (e) {}
  }

  return result;
}

/**
 * Get Client Dispatched Email Logs
 */
export function getDispatchedEmailLogs() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_EMAIL_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export const emailService = {
  sendReservationEmail,
  sendDiningOrderEmail,
  sendStaffOtpEmail,
  getDispatchedEmailLogs
};
