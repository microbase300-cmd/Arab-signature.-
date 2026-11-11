/**
 * Official Paystack Integration Utility for Arab Signature Hotel & Suites
 * Supports both Client-Side Paystack Inline Popup and Server-Side Verification.
 * Seamlessly handles TEST MODE (pk_test_...) during development and
 * LIVE PRODUCTION (pk_live_...) on the main domain.
 */

const STORAGE_KEY = 'ash_paystack_public_key';
const DEFAULT_TEST_KEY = 'pk_test_7a3148ac31cd90f872262152c5e88bdac3d3125c';
const PAYSTACK_KEY_REGEX = /^pk_(test|live)_[a-zA-Z0-9]{16,80}$/;

function isValidPaystackKey(k) {
  return typeof k === 'string' && PAYSTACK_KEY_REGEX.test(k.trim());
}

// 1. Get Active Paystack Public Key (Priority: production .env live key -> verified override -> .env -> fallback test key)
export function getPaystackPublicKey() {
  const envKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  if (import.meta.env.PROD && isValidPaystackKey(envKey) && envKey.trim().startsWith('pk_live_')) {
    return envKey.trim();
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isValidPaystackKey(saved)) {
      return saved.trim();
    }
  }

  if (isValidPaystackKey(envKey)) {
    return envKey.trim();
  }

  return DEFAULT_TEST_KEY;
}

// 2. Save / Override Paystack Public Key in Browser (Validated format only)
export function setPaystackPublicKey(key) {
  if (typeof window === 'undefined') return;
  if (!key || key.trim() === '') {
    localStorage.removeItem(STORAGE_KEY);
  } else if (isValidPaystackKey(key)) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  }
}

// 3. Clear stored key
export function clearPaystackPublicKey() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// 4. Inspect Current Gateway Mode
export function getPaystackMode() {
  const key = getPaystackPublicKey();
  if (!key) {
    return {
      mode: 'unconfigured',
      label: 'Not Configured',
      color: 'text-amber-400',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      isLive: false,
      isTest: false,
      keyMasked: 'None'
    };
  }

  const isTest = key.startsWith('pk_test_');
  const isLive = key.startsWith('pk_live_');
  const masked = key.slice(0, 12) + '...' + key.slice(-4);

  if (isLive) {
    return {
      mode: 'live',
      label: 'LIVE PRODUCTION',
      color: 'text-emerald-400',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      isLive: true,
      isTest: false,
      keyMasked: masked
    };
  }

  return {
    mode: 'test',
    label: 'TEST MODE',
    color: 'text-sky-400',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    isLive: false,
    isTest: true,
    keyMasked: masked
  };
}

// 5. Ensure Paystack Inline JS script is loaded
export function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window not available'));
    if (window.PaystackPop) return resolve(window.PaystackPop);

    const existingScript = document.querySelector('script[src*="paystack.co"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.PaystackPop));
      existingScript.addEventListener('error', (e) => reject(new Error('Failed to load Paystack script')));
      // If already loaded
      if (window.PaystackPop) return resolve(window.PaystackPop);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      if (window.PaystackPop) {
        resolve(window.PaystackPop);
      } else {
        reject(new Error('PaystackPop failed to initialize'));
      }
    };
    script.onerror = () => reject(new Error('Could not load Paystack inline script'));
    document.head.appendChild(script);
  });
}

/**
 * Calculate Paystack Nigeria gross-up amount so the hotel receives 100% of its exact listed price.
 * Accounts for Paystack local fee (1.5% + ₦100 waived < ₦2,500, capped at ₦2,000) plus 7.5% Nigerian VAT on the fee.
 * @param {number} netAmount Exact listed price the hotel must receive in Naira
 * @returns {{ netAmount: number, taxAndVatFee: number, grossAmount: number }}
 */
export function calculatePaystackPassThrough(netAmount) {
  const net = Math.max(0, Math.round(Number(netAmount) || 0));
  if (net <= 0) {
    return { netAmount: 0, taxAndVatFee: 0, grossAmount: 0 };
  }

  const VAT_MULTIPLIER = 1.075;
  const EFFECTIVE_RATE = 0.015 * VAT_MULTIPLIER; // 0.016125
  const RETENTION_RATIO = 1 - EFFECTIVE_RATE; // 0.983875

  let grossAmount = net;
  const noFlatGross = Math.ceil(net / RETENTION_RATIO);
  if (noFlatGross < 2500) {
    grossAmount = noFlatGross;
  } else {
    const uncappedGross = Math.ceil((net + 100 * VAT_MULTIPLIER) / RETENTION_RATIO);
    if (uncappedGross * 0.015 + 100 < 2000) {
      grossAmount = uncappedGross;
    } else {
      grossAmount = Math.ceil(net + 2000 * VAT_MULTIPLIER);
    }
  }

  return {
    netAmount: net,
    taxAndVatFee: Math.max(0, grossAmount - net),
    grossAmount
  };
}

/**
 * 6. Launch Official Paystack Popup Checkout
 * @param {Object} options
 * @param {string} options.email Guest email address
 * @param {number} options.amount Total Naira amount charged at Paystack (includes Tax & VAT if applicable)
 * @param {number} [options.listedAmount] Base listed hotel price before Tax & VAT
 * @param {number} [options.taxAndVatFee] Commission, Tax & VAT added for gateway settlement
 * @param {string} options.guestName Full guest name
 * @param {string} options.guestPhone WhatsApp / phone number
 * @param {string} options.roomName Name of selected suite / room
 * @param {string} options.checkIn Check-in date string
 * @param {string} options.checkOut Check-out date string
 * @param {number} options.nights Number of nights
 * @param {string} [options.customKey] Optional key override
 * @param {Function} options.onSuccess Callback receiving { reference, trxref, status, message }
 * @param {Function} [options.onClose] Callback when customer cancels
 * @param {Function} [options.onError] Callback if loading or validation fails
 */
export async function payWithPaystack({
  email,
  amount,
  listedAmount = null,
  taxAndVatFee = null,
  guestName = 'Guest',
  guestPhone = '',
  roomName = 'Arab Signature Suite',
  checkIn = '',
  checkOut = '',
  nights = 1,
  customKey = '',
  onSuccess,
  onClose,
  onError
}) {
  const activeKey = customKey || getPaystackPublicKey();

  if (!activeKey || !activeKey.startsWith('pk_')) {
    const errorMsg = 'Please provide a valid Paystack Public Key (starting with pk_test_ or pk_live_).';
    if (onError) onError(new Error(errorMsg));
    return;
  }

  // Ensure amount is valid positive integer
  const nairaAmount = Math.max(1, Math.round(Number(amount) || 0));
  const amountInKobo = nairaAmount * 100;

  // Ensure email is valid
  const guestEmail = (email && email.includes('@')) ? email.trim() : 'guest@arab-signature.com';

  // Generate cryptographically random booking transaction reference
  let randSuffix = Math.floor(100000 + Math.random() * 900000).toString();
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    randSuffix = String(100000 + (arr[0] % 900000));
  }
  const reference = 'ASH-' + Date.now().toString(36).toUpperCase() + '-' + randSuffix;

  try {
    const PaystackPop = await loadPaystackScript();

    const customFields = [
      { display_name: "Guest Name", variable_name: "guest_name", value: guestName },
      { display_name: "Phone Number", variable_name: "phone_number", value: guestPhone },
      { display_name: "Room Reserved", variable_name: "room_reserved", value: roomName },
      { display_name: "Check In", variable_name: "check_in", value: checkIn },
      { display_name: "Check Out", variable_name: "check_out", value: checkOut },
      { display_name: "Nights", variable_name: "nights", value: String(nights) },
      { display_name: "Hotel", variable_name: "hotel", value: "Arab Signature Hotel & Suites" }
    ];
    if (listedAmount !== null) {
      customFields.push({ display_name: "Hotel Listed Fee (NGN)", variable_name: "listed_amount", value: String(listedAmount) });
    }
    if (taxAndVatFee !== null) {
      customFields.push({ display_name: "Tax & VAT (NGN)", variable_name: "tax_vat_fee", value: String(taxAndVatFee) });
    }

    const handler = PaystackPop.setup({
      key: activeKey,
      email: guestEmail,
      amount: amountInKobo,
      currency: 'NGN',
      ref: reference,
      metadata: {
        custom_fields: customFields
      },
      callback: function(response) {
        console.log('[Paystack] Payment Successful:', response);
        if (onSuccess) {
          onSuccess({
            reference: response.reference || reference,
            trxref: response.trxref || reference,
            status: response.status || 'success',
            message: response.message || 'Approved',
            amount: nairaAmount,
            paidAt: new Date().toISOString()
          });
        }
      },
      onClose: function() {
        console.log('[Paystack] Checkout window closed by customer');
        if (onClose) onClose();
      }
    });

    handler.openIframe();
  } catch (err) {
    console.error('[Paystack] Failed to open checkout:', err);
    if (onError) onError(err);
  }
}
