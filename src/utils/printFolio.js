// Arab Signature Hotel & Suites — High-Performance Clean Folio Printer
// Resolves browser "Loading preview..." freeze by printing via an isolated, unblurred iframe

export function printFolioReceipt(booking) {
  if (!booking) return;

  // Cleanup any lingering print iframes
  const oldIframe = document.getElementById('ash-print-iframe');
  if (oldIframe) {
    try { oldIframe.remove(); } catch (e) {}
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'ash-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.style.width = '1000px';
  iframe.style.height = '1000px';
  iframe.style.border = 'none';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  const code = booking.id || booking.bookingCode || 'ARS-CONFIRMED';
  const isExt = code.includes('EXT') || String(booking.roomNumber || '').startsWith('1') || (booking.roomName || '').toLowerCase().includes('ext');
  const wing = booking.buildingLabel || (isExt ? 'Extension Building (100 Wing)' : 'Main Building (600 Wing)');
  const amountFormatted = Number(booking.amount || 0).toLocaleString();
  const nights = Number(booking.nights) || 1;
  const nightlyRate = Math.round((Number(booking.amount) || 0) / nights).toLocaleString();
  const paystackRef = booking.paystackReference || booking.paymentRef || 'PAYSTACK-VERIFIED';
  const paymentMethod = booking.paymentMethod || 'Paystack (Online Verified)';
  const roomNumberDisplay = booking.roomNumber && booking.roomNumber !== 'Unassigned' ? `#${booking.roomNumber}` : 'Front Desk Keycard Allocation';

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Folio Receipt - ${code} - Arab Signature Hotel</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #ffffff !important;
      color: #1a1a1a !important;
      padding: 10px;
      line-height: 1.45;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2.5px solid #d4af37;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .emblem {
      width: 52px;
      height: 52px;
      background: #3d0519;
      border: 2px solid #d4af37;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #d4af37;
      font-size: 22px;
      font-weight: bold;
      font-family: Georgia, serif;
    }
    .brand-title {
      font-size: 19px;
      font-weight: 800;
      color: #3d0519;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-family: Georgia, serif;
    }
    .brand-sub {
      font-size: 11px;
      color: #666;
      margin-top: 2px;
    }
    .receipt-meta {
      text-align: right;
    }
    .receipt-title {
      font-size: 14px;
      font-weight: 800;
      color: #3d0519;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .code-badge {
      display: inline-block;
      margin-top: 4px;
      padding: 5px 12px;
      background: #fbf7f0;
      border: 1.5px solid #d4af37;
      border-radius: 6px;
      font-family: "Courier New", Courier, monospace;
      font-size: 16px;
      font-weight: bold;
      color: #000;
      letter-spacing: 1.5px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 18px;
    }
    .card {
      border: 1px solid #e5dcce;
      border-radius: 8px;
      padding: 12px 14px;
      background: #faf8f5;
    }
    .card-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8c764b;
      border-bottom: 1px solid #e5dcce;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 5px;
    }
    .row:last-child {
      margin-bottom: 0;
    }
    .label {
      color: #666;
    }
    .val {
      font-weight: 600;
      color: #111;
      text-align: right;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      font-size: 12px;
    }
    th {
      background: #3d0519;
      color: #f3e5ab;
      text-align: left;
      padding: 8px 12px;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.8px;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5dcce;
    }
    .total-row td {
      border-top: 2px solid #d4af37;
      border-bottom: 2.5px solid #d4af37;
      font-size: 15px;
      font-weight: 800;
      color: #3d0519;
      padding: 12px;
    }
    .bottom-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px dashed #d5c8b5;
    }
    .stamp-box {
      border: 2px solid #15803d;
      border-radius: 6px;
      padding: 8px 14px;
      display: inline-block;
      color: #15803d;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 1px;
      transform: rotate(-2deg);
      background: #f0fdf4;
    }
    .payment-meta {
      font-size: 11px;
      color: #555;
      margin-top: 8px;
      line-height: 1.5;
    }
    .wifi-box {
      text-align: right;
      font-size: 11px;
      color: #555;
      line-height: 1.6;
    }
    .footer {
      margin-top: 25px;
      text-align: center;
      font-size: 10px;
      color: #888;
      border-top: 1px solid #eee;
      padding-top: 10px;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="emblem">AS</div>
      <div>
        <div class="brand-title">Arab Signature Hotel &amp; Suites</div>
        <div class="brand-sub">Nsugbe, Onitsha, Anambra State, Nigeria &bull; Front Desk: 0812 578 6875</div>
      </div>
    </div>
    <div class="receipt-meta">
      <div class="receipt-title">Official Guest Folio Receipt</div>
      <div class="code-badge">${code}</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Guest Stay Registration</div>
      <div class="row"><span class="label">Primary Guest:</span><span class="val">${booking.guestName || 'Valued Guest'}</span></div>
      <div class="row"><span class="label">Phone / WhatsApp:</span><span class="val">${booking.phone || 'N/A'}</span></div>
      <div class="row"><span class="label">Email Address:</span><span class="val">${booking.email || 'N/A'}</span></div>
      ${booking.homeAddress ? `<div class="row"><span class="label">Residential Address:</span><span class="val">${booking.homeAddress}</span></div>` : ''}
      ${booking.nextOfKinName ? `<div class="row"><span class="label">Next of Kin:</span><span class="val">${booking.nextOfKinName} (${booking.nextOfKinPhone || ''}${booking.nextOfKinRelationship ? ' • ' + booking.nextOfKinRelationship : ''})</span></div>` : ''}
    </div>

    <div class="card">
      <div class="card-title">Suite &amp; Stay Schedule</div>
      <div class="row"><span class="label">Suite Reserved:</span><span class="val">${booking.roomName || 'Executive Suite'}</span></div>
      <div class="row"><span class="label">Assigned Suite:</span><span class="val" style="color: #3d0519; font-weight: bold;">${roomNumberDisplay}</span></div>
      <div class="row"><span class="label">Building Wing:</span><span class="val">${wing}</span></div>
      <div class="row"><span class="label">Check-In Date:</span><span class="val">${booking.checkIn || 'Confirmed'} (from 2:00 PM)</span></div>
      <div class="row"><span class="label">Check-Out Date:</span><span class="val">${booking.checkOut || 'Confirmed'} (by 12:00 PM)</span></div>
      <div class="row"><span class="label">Duration of Stay:</span><span class="val">${nights} ${nights === 1 ? 'Night' : 'Nights'}</span></div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center;">Nights</th>
        <th style="text-align: right;">Rate / Night</th>
        <th style="text-align: right;">Amount (NGN)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong>${booking.roomName || 'Luxury Suite Accommodation'}</strong>
          <div style="font-size: 11px; color: #666; margin-top: 2px;">
            ${wing} &bull; Check-in: ${booking.checkIn} &bull; Check-out: ${booking.checkOut}
          </div>
        </td>
        <td style="text-align: center;">${nights}</td>
        <td style="text-align: right;">₦${nightlyRate}</td>
        <td style="text-align: right; font-weight: bold;">₦${amountFormatted}</td>
      </tr>
      <tr class="total-row">
        <td colspan="3">Total Paid in Full:</td>
        <td style="text-align: right;">₦${amountFormatted}</td>
      </tr>
    </tbody>
  </table>

  <div class="bottom-section">
    <div>
      <div class="stamp-box">&#10003; PAID IN FULL &bull; ONLINE VERIFIED</div>
      <div class="payment-meta">
        <div>Channel: <strong>${paymentMethod}</strong></div>
        <div>Paystack Ref: <strong>${paystackRef}</strong></div>
        <div>Receipt Date: <strong>${new Date().toLocaleDateString('en-GB')}</strong></div>
      </div>
    </div>

    <div class="wifi-box">
      <div><strong>Complimentary Wi-Fi Access:</strong></div>
      <div>SSID: <strong>Arab_Signature_HighSpeed_Guest</strong></div>
      <div>Password: <strong>ArabSignatureVIP</strong></div>
      <div style="margin-top: 4px; color: #777;">Concierge: concierge@arabsignature.com</div>
    </div>
  </div>

  <div class="footer">
    Thank you for choosing Arab Signature Hotel &amp; Suites. Please present this Official Folio Receipt or your Booking Code <strong>(${code})</strong> at the Front Desk reception to collect your RFID keycard. Confidential transaction record.
  </div>
</body>
</html>`);
  doc.close();

  // Trigger print cleanly on the isolated iframe
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.warn('[Print Folio Notice]: Fallback to window.print', e);
      window.print();
    }
  }, 250);
}
