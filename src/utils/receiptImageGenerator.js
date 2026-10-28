// Arab Signature Hotel & Suites — Luxury Folio Receipt Image Generator
// Generates high-resolution PNG receipt image slips directly in-browser using HTML5 Canvas
// Mirrors the exact official printed folio with golden emblem, booking details, and big green PAID IN FULL stamp.

import { formatWhatsAppPhone } from './printFolio';

/**
 * Helper to draw cross-browser rounded rectangles on 2D canvas
 */
function drawRoundRect(ctx, x, y, width, height, radius, fill = false, stroke = false) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

/**
 * Truncate text with ellipsis if it exceeds max width
 */
function fitText(ctx, text, maxWidth) {
  if (!text) return '';
  let str = String(text);
  if (ctx.measureText(str).width <= maxWidth) return str;
  while (str.length > 3 && ctx.measureText(str + '...').width > maxWidth) {
    str = str.slice(0, -1);
  }
  return str + '...';
}

/**
 * Generate full 2D Canvas matching the Official Guest Folio Receipt
 */
export function generateReceiptCanvas(booking = {}) {
  const canvas = document.createElement('canvas');
  // High resolution 1000px × 1460px (crisp 2x A4 aspect ratio)
  canvas.width = 1000;
  canvas.height = 1460;
  const ctx = canvas.getContext('2d');

  // Format data
  const code = booking.id || booking.bookingCode || 'ARS-CONFIRMED';
  const isExt = code.includes('EXT') || String(booking.roomNumber || '').startsWith('1') || (booking.roomName || '').toLowerCase().includes('ext');
  const wing = booking.buildingLabel || (isExt ? 'Extension Building (100 Wing)' : 'Main Building (600 Wing)');
  const amountFormatted = Number(booking.amount || 0).toLocaleString();
  const nights = Number(booking.nights) || 1;
  const nightlyRate = Math.round((Number(booking.amount) || 0) / nights).toLocaleString();
  const paystackRef = booking.paystackReference || booking.paymentRef || 'PAYSTACK-VERIFIED';
  const paymentMethod = booking.paymentMethod || 'Paystack (Online Verified)';
  const roomNumberDisplay = booking.roomNumber && booking.roomNumber !== 'Unassigned' ? `#${booking.roomNumber}` : 'Front Desk Keycard Allocation';
  const receiptDate = new Date().toLocaleDateString('en-GB');

  // 1. Pristine White Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle top luxury banner gradient
  const topGrad = ctx.createLinearGradient(0, 0, canvas.width, 16);
  topGrad.addColorStop(0, '#3d0519');
  topGrad.addColorStop(0.5, '#d4af37');
  topGrad.addColorStop(1, '#3d0519');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, canvas.width, 12);

  // Outer Double Border with Gold Inset
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  drawRoundRect(ctx, 22, 22, 956, 1416, 16, false, true);

  ctx.strokeStyle = '#f3e5ab';
  ctx.lineWidth = 1;
  drawRoundRect(ctx, 28, 28, 944, 1404, 12, false, true);

  // -------------------------------------------------------------
  // 2. HEADER: Brand Crest, Title, Subtitle & Booking Badge
  // -------------------------------------------------------------
  // Royal Crest Emblem Circle (Burgundy with Double Gold Border)
  const emblemX = 85;
  const emblemY = 95;
  const emblemR = 40;

  ctx.beginPath();
  ctx.arc(emblemX, emblemY, emblemR, 0, Math.PI * 2);
  ctx.fillStyle = '#3d0519';
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Inner gold ring in crest
  ctx.beginPath();
  ctx.arc(emblemX, emblemY, emblemR - 4, 0, Math.PI * 2);
  ctx.strokeStyle = '#f3e5ab';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Crest "AS" text
  ctx.fillStyle = '#f3e5ab';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AS', emblemX, emblemY + 2);

  // Brand Name & Subtitle
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#3d0519';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.fillText('ARAB SIGNATURE HOTEL & SUITES', 145, 85);

  ctx.fillStyle = '#666666';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Nsugbe, Onitsha, Anambra State, Nigeria', 145, 110);
  ctx.fillText('Front Desk Concierge: +234 812 578 6875 • reception@arabsignature.com', 145, 132);

  // Official Receipt Title & Code Badge (Top Right)
  ctx.textAlign = 'right';
  ctx.fillStyle = '#3d0519';
  ctx.font = '800 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('OFFICIAL GUEST FOLIO RECEIPT', 940, 78);

  // Booking Code Badge Box
  const badgeW = 260;
  const badgeH = 46;
  const badgeX = 940 - badgeW;
  const badgeY = 92;

  ctx.fillStyle = '#fbf7f0';
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.8;
  drawRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, 8, true, true);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 19px "Courier New", Courier, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(code, badgeX + badgeW / 2, badgeY + badgeH / 2 + 1);

  // Gold Horizontal Separator
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(45, 160);
  ctx.lineTo(955, 160);
  ctx.stroke();

  // -------------------------------------------------------------
  // 3. TWO CARDS: GUEST REGISTRATION & SUITE SCHEDULE
  // -------------------------------------------------------------
  const cardW = 440;
  const cardH = 265;
  const cardY = 180;
  const card1X = 45;
  const card2X = 515;

  // Helper to draw a luxury card
  const drawInfoCard = (x, y, w, h, title, rows) => {
    ctx.fillStyle = '#faf8f5';
    ctx.strokeStyle = '#e5dcce';
    ctx.lineWidth = 1.2;
    drawRoundRect(ctx, x, y, w, h, 8, true, true);

    // Card Header Bar
    ctx.fillStyle = '#f4ede2';
    drawRoundRect(ctx, x, y, w, 36, 8, true, false);
    ctx.fillRect(x, y + 20, w, 16); // fill bottom corners of header

    ctx.fillStyle = '#8c764b';
    ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(title.toUpperCase(), x + 16, y + 18);

    // Rows
    ctx.textBaseline = 'alphabetic';
    let rowY = y + 62;
    rows.forEach(r => {
      ctx.fillStyle = '#666666';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(r.label + ':', x + 16, rowY);

      ctx.fillStyle = r.color || '#111111';
      ctx.font = (r.bold ? 'bold ' : '600 ') + '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'right';
      const valText = fitText(ctx, r.value, w - 160);
      ctx.fillText(valText, x + w - 16, rowY);

      rowY += 34;
    });
  };

  // Card 1: Guest Stay Registration
  const guestRows = [
    { label: 'Primary Guest', value: booking.guestName || 'Valued Guest', bold: true },
    { label: 'Phone / WhatsApp', value: booking.phone || 'N/A' },
    { label: 'Email Address', value: booking.email || 'N/A' },
    { label: 'Residential Address', value: booking.homeAddress || 'Registered on Arrival' },
    { label: 'Next of Kin', value: booking.nextOfKinName ? `${booking.nextOfKinName} (${booking.nextOfKinPhone || ''}${booking.nextOfKinRelationship ? ' • ' + booking.nextOfKinRelationship : ''})` : 'Archived at Reception' },
  ];
  drawInfoCard(card1X, cardY, cardW, cardH, 'Guest Stay Registration', guestRows);

  // Card 2: Suite & Stay Schedule
  const scheduleRows = [
    { label: 'Suite Reserved', value: booking.roomName || 'Executive Suite', bold: true },
    { label: 'Assigned Suite', value: roomNumberDisplay, bold: true, color: '#3d0519' },
    { label: 'Building Wing', value: wing },
    { label: 'Check-In Date', value: `${booking.checkIn || 'Confirmed'} (from 2:00 PM)` },
    { label: 'Check-Out Date', value: `${booking.checkOut || 'Confirmed'} (by 12:00 PM)` },
    { label: 'Duration of Stay', value: `${nights} ${nights === 1 ? 'Night' : 'Nights'}`, bold: true },
  ];
  drawInfoCard(card2X, cardY, cardW, cardH, 'Suite & Stay Schedule', scheduleRows);

  // -------------------------------------------------------------
  // 4. ITEMIZED BILLING TABLE
  // -------------------------------------------------------------
  const tableX = 45;
  const tableY = 470;
  const tableW = 910;
  const thH = 38;

  // Table Header Background (Deep Burgundy)
  ctx.fillStyle = '#3d0519';
  drawRoundRect(ctx, tableX, tableY, tableW, thH, 6, true, false);

  ctx.fillStyle = '#f3e5ab';
  ctx.font = '800 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textBaseline = 'middle';
  
  ctx.textAlign = 'left';
  ctx.fillText('DESCRIPTION & PARTICULARS', tableX + 16, tableY + thH / 2);

  ctx.textAlign = 'center';
  ctx.fillText('NIGHTS', tableX + 560, tableY + thH / 2);

  ctx.textAlign = 'right';
  ctx.fillText('RATE / NIGHT', tableX + 720, tableY + thH / 2);
  ctx.fillText('AMOUNT (NGN)', tableX + tableW - 16, tableY + thH / 2);

  // Table Row 1 (Item)
  const row1Y = tableY + thH;
  const row1H = 75;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(tableX, row1Y, tableW, row1H);
  ctx.strokeStyle = '#e5dcce';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(tableX, row1Y + row1H);
  ctx.lineTo(tableX + tableW, row1Y + row1H);
  ctx.stroke();

  // Suite title & description
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#111111';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(booking.roomName || 'Luxury Suite Accommodation', tableX + 16, row1Y + 30);

  ctx.fillStyle = '#777777';
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${wing} • Check-in: ${booking.checkIn} • Check-out: ${booking.checkOut}`, tableX + 16, row1Y + 54);

  // Numbers
  ctx.textAlign = 'center';
  ctx.fillStyle = '#222222';
  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(String(nights), tableX + 560, row1Y + 42);

  ctx.textAlign = 'right';
  ctx.fillText(`₦${nightlyRate}`, tableX + 720, row1Y + 42);

  ctx.fillStyle = '#111111';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`₦${amountFormatted}`, tableX + tableW - 16, row1Y + 42);

  // Table Row 2 (Total Paid in Full)
  const totalRowY = row1Y + row1H;
  const totalRowH = 65;

  ctx.fillStyle = '#faf7f0';
  ctx.fillRect(tableX, totalRowY, tableW, totalRowH);

  // Double gold borders on total row
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(tableX, totalRowY);
  ctx.lineTo(tableX + tableW, totalRowY);
  ctx.moveTo(tableX, totalRowY + totalRowH);
  ctx.lineTo(tableX + tableW, totalRowY + totalRowH);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#3d0519';
  ctx.font = '800 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('TOTAL PAID IN FULL (SETTLED):', tableX + 16, totalRowY + 38);

  ctx.textAlign = 'right';
  ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`₦${amountFormatted}`, tableX + tableW - 16, totalRowY + 40);

  // -------------------------------------------------------------
  // 5. THE BIG GREEN OFFICIAL "PAID IN FULL" STAMP & PAYMENT META
  // -------------------------------------------------------------
  const stampBoxX = 55;
  const stampBoxY = 680;
  const stampW = 420;
  const stampH = 185;

  ctx.save();
  // Rotate slightly (-3.5 degrees) for authentic stamp look
  ctx.translate(stampBoxX + stampW / 2, stampBoxY + stampH / 2);
  ctx.rotate((-3.5 * Math.PI) / 180);
  ctx.translate(-(stampBoxX + stampW / 2), -(stampBoxY + stampH / 2));

  // Stamp Background
  ctx.fillStyle = '#f0fdf4';
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 3.5;
  drawRoundRect(ctx, stampBoxX, stampBoxY, stampW, stampH, 12, true, true);

  // Inner dashed stamp border
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  drawRoundRect(ctx, stampBoxX + 6, stampBoxY + 6, stampW - 12, stampH - 12, 8, false, true);
  ctx.setLineDash([]);

  // Stamp Header
  ctx.fillStyle = '#15803d';
  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('★ OFFICIAL SETTLEMENT STAMP ★', stampBoxX + stampW / 2, stampBoxY + 32);

  // Big Bold PAID IN FULL Text
  ctx.fillStyle = '#15803d';
  ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('✓ PAID IN FULL', stampBoxX + stampW / 2, stampBoxY + 75);

  // Subtitle
  ctx.fillStyle = '#166534';
  ctx.font = '800 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('PAYSTACK VERIFIED ONLINE (100%)', stampBoxX + stampW / 2, stampBoxY + 104);

  // Details
  ctx.fillStyle = '#14532d';
  ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Ref: ${fitText(ctx, paystackRef, 360)}`, stampBoxX + stampW / 2, stampBoxY + 132);
  ctx.fillText(`Date: ${receiptDate} • Arab Signature Audit`, stampBoxX + stampW / 2, stampBoxY + 154);

  ctx.restore();

  // Payment Details Subcard (below stamp)
  const payCardY = 890;
  ctx.fillStyle = '#faf8f5';
  ctx.strokeStyle = '#e5dcce';
  ctx.lineWidth = 1;
  drawRoundRect(ctx, 45, payCardY, 440, 160, 8, true, true);

  ctx.fillStyle = '#3d0519';
  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('TRANSACTION SETTLEMENT AUDIT', 62, payCardY + 28);

  const payAuditRows = [
    { label: 'Payment Channel', val: paymentMethod },
    { label: 'Paystack Reference', val: fitText(ctx, paystackRef, 240) },
    { label: 'Settlement Status', val: 'Settled & Verified (100%)', color: '#15803d' },
    { label: 'Transaction Audit Date', val: `${receiptDate} (Automated)` }
  ];

  let pY = payCardY + 58;
  payAuditRows.forEach(item => {
    ctx.fillStyle = '#666666';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(item.label + ':', 62, pY);

    ctx.fillStyle = item.color || '#111111';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(item.val, 465, pY);
    pY += 26;
  });

  // -------------------------------------------------------------
  // 6. RIGHT SIDE: COMPLIMENTARY WI-FI & ARRIVAL PROTOCOL
  // -------------------------------------------------------------
  // Wi-Fi Card
  const wifiCardY = 680;
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.2;
  drawRoundRect(ctx, 515, wifiCardY, 440, 175, 8, true, true);

  // Wi-Fi Header Bar
  ctx.fillStyle = '#0f172a';
  drawRoundRect(ctx, 515, wifiCardY, 440, 34, 8, true, false);
  ctx.fillRect(515, wifiCardY + 18, 440, 16);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('📶 COMPLIMENTARY VIP HIGH-SPEED WI-FI ACCESS', 532, wifiCardY + 21);

  ctx.fillStyle = '#334155';
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Network (SSID):', 532, wifiCardY + 68);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px "Courier New", Courier, monospace';
  ctx.fillText('Arab_Signature_HighSpeed_Guest', 532, wifiCardY + 90);

  ctx.fillStyle = '#334155';
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Password / Security Key:', 532, wifiCardY + 122);
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 16px "Courier New", Courier, monospace';
  ctx.fillText('ArabSignatureVIP', 532, wifiCardY + 146);

  // Arrival Protocol & Front Desk Card
  const arrivalCardY = 875;
  ctx.fillStyle = '#fffbeb';
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 1.2;
  drawRoundRect(ctx, 515, arrivalCardY, 440, 175, 8, true, true);

  ctx.fillStyle = '#92400e';
  ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🏨 FRONT DESK ARRIVAL & KEYCARD PROTOCOL', 532, arrivalCardY + 28);

  const protocols = [
    '1. Present this Official Folio Receipt or Booking Code at Front Desk.',
    '2. Front Desk Concierge will program and issue your RFID keycard.',
    '3. In-Suite VIP Dining & Bar Room Service available 24/7.',
    '4. Complimentary secured parking and 24-hr uninterrupted power.'
  ];

  let protY = arrivalCardY + 60;
  protocols.forEach(line => {
    ctx.fillStyle = '#451a03';
    ctx.font = '11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(line, 532, protY);
    protY += 27;
  });

  // -------------------------------------------------------------
  // 7. SIMULATED BARCODE & SECURITY WATERMARK STRIP
  // -------------------------------------------------------------
  const barY = 1070;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#d5c8b5';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(45, barY);
  ctx.lineTo(955, barY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw simulated barcode pattern based on booking code
  const barStartX = 340;
  const barW = 320;
  const barH = 50;
  const barBoxY = barY + 25;

  // Pseudo-random pseudo barcode
  ctx.fillStyle = '#1a1a1a';
  let curX = barStartX;
  const seed = code.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  for (let i = 0; i < 48; i++) {
    const bit = ((seed * (i + 13)) % 7);
    const stripeW = bit > 4 ? 4 : bit > 2 ? 2.5 : 1.5;
    ctx.fillRect(curX, barBoxY, stripeW, barH);
    curX += stripeW + (bit % 3 === 0 ? 3.5 : 2);
    if (curX > barStartX + barW) break;
  }

  ctx.fillStyle = '#444444';
  ctx.font = 'bold 12px "Courier New", Courier, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`* ${code} *`, canvas.width / 2, barBoxY + barH + 20);

  // -------------------------------------------------------------
  // 8. LEGAL NOTICE & FOOTER
  // -------------------------------------------------------------
  const footerY = 1200;
  ctx.fillStyle = '#faf8f5';
  ctx.strokeStyle = '#e5dcce';
  ctx.lineWidth = 1;
  drawRoundRect(ctx, 45, footerY, 910, 165, 8, true, true);

  ctx.fillStyle = '#444444';
  ctx.font = '11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'Thank you for choosing Arab Signature Hotel & Suites.',
    canvas.width / 2,
    footerY + 35
  );

  ctx.fillStyle = '#666666';
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(
    `Please present this Official Folio Receipt or your Booking Code (${code}) at the Front Desk reception to collect your RFID keycard.`,
    canvas.width / 2,
    footerY + 62
  );
  ctx.fillText(
    'This is a verified legal financial transaction slip. All suite amenities, air-conditioning, and 24-hr security are inclusive.',
    canvas.width / 2,
    footerY + 85
  );

  // Bottom Copyright / Gold Seal
  ctx.fillStyle = '#3d0519';
  ctx.font = 'bold 12px Georgia, serif';
  ctx.fillText(
    'ARAB SIGNATURE HOTEL & SUITES • LUXURY • COMFORT • SECURITY',
    canvas.width / 2,
    footerY + 125
  );

  ctx.fillStyle = '#888888';
  ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(
    `Official Digital Folio System v2.6 • Generated on ${new Date().toLocaleString('en-GB')} • www.arabsignature.com`,
    canvas.width / 2,
    footerY + 145
  );

  return canvas;
}

/**
 * Generate Blob and File from Canvas
 */
export async function generateReceiptImageBlob(booking = {}) {
  const canvas = generateReceiptCanvas(booking);
  const code = booking.id || booking.bookingCode || 'ARS-RECEIPT';
  const fileName = `Arab_Signature_Receipt_${code}.png`;

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create receipt image blob'));
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      const file = new File([blob], fileName, { type: 'image/png', lastModified: Date.now() });
      resolve({ canvas, dataUrl, blob, file, fileName });
    }, 'image/png');
  });
}

/**
 * Trigger immediate browser download of the receipt image
 */
export function downloadReceiptImageBlob(blob, fileName = 'Arab_Signature_Receipt.png') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    try {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {}
  }, 500);
}

/**
 * Copy Receipt Image directly to user's system clipboard
 */
export async function copyReceiptImageToClipboard(blob) {
  if (!navigator.clipboard || !window.ClipboardItem) {
    throw new Error('Clipboard image copying is not supported on this browser.');
  }
  const item = new ClipboardItem({ 'image/png': blob });
  await navigator.clipboard.write([item]);
  return true;
}

/**
 * Send / Share Receipt Image to WhatsApp:
 * 1. Native mobile share sheet via Web Share API (attaches the real PNG image directly into WhatsApp)
 * 2. Desktop fallback: copies image to clipboard, downloads PNG file, and opens WhatsApp with quick-paste instruction.
 */
export async function shareReceiptImageToWhatsApp(phone, booking = {}, options = {}) {
  const code = booking.id || booking.bookingCode || 'ARS-CONFIRMED';
  const cleanPhone = formatWhatsAppPhone(phone);
  
  // 1. Generate crisp image
  const { blob, file, dataUrl, fileName } = await generateReceiptImageBlob(booking);

  // 2. Mobile Native Share API Check (Android / iOS)
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `Arab Signature Hotel Receipt - ${code}`,
        text: `Official Folio Receipt for Booking ${code} - Arab Signature Hotel & Suites (PAID IN FULL)`
      });
      return { success: true, method: 'native_share', dataUrl };
    } catch (shareErr) {
      if (shareErr.name === 'AbortError') {
        return { success: false, aborted: true };
      }
      console.warn('Native share failed or declined, falling back to clipboard + WhatsApp Web:', shareErr);
    }
  }

  // 3. Fallback for Desktop and browsers without direct file sharing:
  let copied = false;
  try {
    await copyReceiptImageToClipboard(blob);
    copied = true;
  } catch (clipErr) {
    console.warn('Clipboard write failed:', clipErr);
  }

  // 4. Download file
  try {
    downloadReceiptImageBlob(blob, fileName);
  } catch (dlErr) {
    console.warn('Download error:', dlErr);
  }

  // 5. Open WhatsApp Web / App
  const caption = 
`👑 *ARAB SIGNATURE HOTEL & SUITES*
🧾 *Official Folio & Payment Receipt Slip*
📋 *Booking Code:* *${code}*
✅ *STATUS:* *[ ✓ ] PAID IN FULL • PAYSTACK VERIFIED*
🏨 *Nsugbe, Onitsha, Anambra State*

${copied ? '📋 *Receipt Image is copied to your clipboard!* Simply press *Ctrl + V* (or Paste) to send the visual slip.' : '📥 *Receipt Image downloaded to your device.* You can attach it directly to this chat.'}`;

  const encoded = encodeURIComponent(caption);
  const whatsappUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encoded}` 
    : `https://wa.me/?text=${encoded}`;

  window.open(whatsappUrl, '_blank');

  return {
    success: true,
    method: 'clipboard_and_whatsapp',
    copiedToClipboard: copied,
    fileName,
    dataUrl
  };
}
