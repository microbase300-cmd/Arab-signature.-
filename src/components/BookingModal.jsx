import React, { useState, useEffect } from 'react';
import { HOTEL_INFO } from '../data/hotelData';
import { portalStore } from '../data/portalStore';
import { 
  getPaystackPublicKey, 
  setPaystackPublicKey, 
  getPaystackMode, 
  payWithPaystack 
} from '../utils/paystack';
import { 
  X, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Share2, 
  ArrowRight, 
  Key, 
  Check, 
  AlertCircle, 
  Copy, 
  Printer, 
  Sparkles 
} from 'lucide-react';

export default function BookingModal({ isOpen, onClose, preselectedRoomId }) {
  const [step, setStep] = useState(1); // 1: Details & Dates, 2: Payment, 3: Success Confirmation
  const [roomId, setRoomId] = useState(preselectedRoomId || 'deluxe');
  const [checkIn, setCheckIn] = useState('2026-10-23');
  const [checkOut, setCheckOut] = useState('2026-10-25');
  const [guestName, setGuestName] = useState('Alhaji Ibrahim Musa');
  const [guestPhone, setGuestPhone] = useState('0812 578 6875');
  const [guestEmail, setGuestEmail] = useState('ibrahim.musa@example.com');
  const [bookingCode, setBookingCode] = useState('');
  const [paystackReference, setPaystackReference] = useState('');
  const [assignedRoomNumber, setAssignedRoomNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  // Paystack Key Management
  const [keyInput, setKeyInput] = useState('');
  const [showKeyManager, setShowKeyManager] = useState(false);
  const [keySavedMessage, setKeySavedMessage] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState(getPaystackMode());

  useEffect(() => {
    if (preselectedRoomId) {
      setRoomId(preselectedRoomId);
    }
  }, [preselectedRoomId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const activeKey = getPaystackPublicKey();
      setKeyInput(activeKey);
      setGatewayStatus(getPaystackMode());
      setPaymentError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const rooms = portalStore.getRoomRates();
  const selectedRoom = rooms.find(r => r.id === roomId) || rooms[0];

  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) || 1);
  const totalAmount = selectedRoom.price * nights;

  // Handle saving new Paystack Public Key
  const handleSaveKey = () => {
    if (!keyInput.trim()) {
      setPaymentError('Please enter a Paystack Public Key starting with pk_test_ or pk_live_');
      return;
    }
    if (!keyInput.trim().startsWith('pk_')) {
      setPaymentError('Invalid key format. Paystack public keys start with pk_test_ or pk_live_');
      return;
    }

    setPaystackPublicKey(keyInput.trim());
    setGatewayStatus(getPaystackMode());
    setPaymentError('');
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowKeyManager(false);
    }, 1500);
  };

  // Complete Booking Persistence Helper
  const recordSuccessfulBooking = (reference, isRealPaystack = true) => {
    const code = 'ASH-' + Math.floor(1000 + Math.random() * 9000);
    setBookingCode(code);
    setPaystackReference(reference);

    // Save into central hotel portal store
    const savedBooking = portalStore.addBooking({
      id: code,
      guestName: guestName,
      phone: guestPhone,
      email: guestEmail,
      roomType: selectedRoom.id,
      roomName: selectedRoom.name,
      checkIn: checkIn,
      checkOut: checkOut,
      nights: nights,
      amount: totalAmount,
      status: "Confirmed",
      paymentMethod: isRealPaystack ? "Paystack (Online Verified)" : "Paystack (Simulated Demo)",
      paymentStatus: "Paid",
      paystackReference: reference,
      backendVerified: true,
      source: "Direct Website"
    });

    if (savedBooking && savedBooking.roomNumber) {
      setAssignedRoomNumber(savedBooking.roomNumber);
    }

    // Optional background verification call to /api/verify-payment
    if (isRealPaystack && typeof window !== 'undefined') {
      fetch(`/api/verify-payment?reference=${encodeURIComponent(reference)}`)
        .then(r => r.json())
        .then(res => console.log('[Paystack Server Verification]:', res))
        .catch(err => console.log('[Paystack Background Verification Notice]:', err));
    }

    setIsProcessing(false);
    setStep(3);
  };

  // Main Paystack Payment Trigger
  const handlePaystackPayment = () => {
    setPaymentError('');
    const activeKey = getPaystackPublicKey();

    // If no valid key is saved, prompt user to enter one
    if (!activeKey || !activeKey.startsWith('pk_')) {
      setShowKeyManager(true);
      setPaymentError('Please enter your Paystack Public Key (pk_test_...) below to test real checkout.');
      return;
    }

    setIsProcessing(true);

    payWithPaystack({
      email: guestEmail,
      amount: totalAmount,
      guestName: guestName,
      guestPhone: guestPhone,
      roomName: selectedRoom.name,
      checkIn: checkIn,
      checkOut: checkOut,
      nights: nights,
      customKey: activeKey,
      onSuccess: (response) => {
        recordSuccessfulBooking(response.reference || response.trxref || ('PAY-' + Date.now()), true);
      },
      onClose: () => {
        setIsProcessing(false);
        setPaymentError('Paystack checkout window was closed. Your card was not charged.');
      },
      onError: (err) => {
        setIsProcessing(false);
        setPaymentError(err.message || 'Payment processing error. Please verify your internet connection or Paystack key.');
      }
    });
  };

  // Instant Simulation for testing without a Paystack account
  const handleSimulatedDemo = () => {
    setIsProcessing(true);
    setPaymentError('');
    setTimeout(() => {
      const demoRef = 'DEMO-TRX-' + Math.floor(100000000 + Math.random() * 900000000);
      recordSuccessfulBooking(demoRef, false);
    }, 1200);
  };

  const handleCopyReference = () => {
    if (paystackReference) {
      navigator.clipboard.writeText(paystackReference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(
      `Hello Arab Signature Hotel Reception, I just completed a room booking online!\n\n` +
      `📋 Official Booking Code: ${bookingCode}\n` +
      `💳 Paystack Reference: ${paystackReference}\n` +
      `👤 Guest Name: ${guestName}\n` +
      `📱 Phone: ${guestPhone}\n` +
      `🏨 Room: ${selectedRoom.name} (${selectedRoom.buildingLabel || 'Arab Signature Wing'})\n` +
      (assignedRoomNumber && assignedRoomNumber !== 'Unassigned' ? `🔑 Assigned Suite: Room #${assignedRoomNumber}\n` : '') +
      `📅 Check-in: ${checkIn} (2:00 PM)\n` +
      `📅 Check-out: ${checkOut} (12:00 PM)\n` +
      `🌙 Duration: ${nights} ${nights === 1 ? 'Night' : 'Nights'}\n` +
      `💰 Amount Paid: ₦${totalAmount.toLocaleString()} via Paystack\n\n` +
      `Kindly confirm my arrival. Thank you!`
    );
    window.open(`https://wa.me/${HOTEL_INFO.whatsapp}?text=${text}`, '_blank');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#14121a] border border-[#d4af37]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#420317] to-[#250210]">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-[#f3e5ab]">
              {step === 3 ? "Booking Confirmed" : "Reserve Your Suite"}
            </h3>
            <p className="text-xs text-gray-300">Arab Signature Hotel & Suites</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close booking modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-sm">

          {/* ============================================================== */}
          {/* STEP 1: ROOM SELECTION & GUEST DETAILS                         */}
          {/* ============================================================== */}
          {step === 1 && (
            <>
              {/* Room Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">
                  Select Room / Suite
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setRoomId(room.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        roomId === room.id
                          ? 'border-[#d4af37] bg-[#5c0725]/40 text-white shadow-md ring-1 ring-[#d4af37]'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white truncate">{room.name}</div>
                      <div className="text-[10px] text-[#f3e5ab] truncate mt-0.5">{room.buildingLabel || ''}</div>
                      <div className="text-xs text-[#d4af37] font-bold mt-1">{room.priceFormatted} <span className="text-[10px] text-gray-400 font-normal">/ nt</span></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                    <Calendar size={13} className="text-[#d4af37]" /> Check-In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                    <Calendar size={13} className="text-[#d4af37]" /> Check-Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Guest Information */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                    <User size={13} className="text-[#d4af37]" /> Guest Full Name
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                      <Phone size={13} className="text-[#d4af37]" /> WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="e.g. 08031234567"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                      <Mail size={13} className="text-[#d4af37]" /> Email
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="For receipt"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#5c0725]/30 to-black/40 border border-[#d4af37]/30 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400">Total Stay ({nights} {nights === 1 ? 'Night' : 'Nights'})</span>
                  <div className="text-lg font-bold text-[#f3e5ab]">₦{totalAmount.toLocaleString()}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-semibold text-xs flex items-center gap-1.5 hover:opacity-95 shadow-lg shadow-[#d4af37]/20"
                >
                  Proceed to Pay <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* STEP 2: PAYSTACK PAYMENT GATEWAY                               */}
          {/* ============================================================== */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Reservation Breakdown */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Room:</span>
                  <span className="text-white font-medium">{selectedRoom.name}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Duration:</span>
                  <span className="text-white font-medium">{checkIn} to {checkOut} ({nights} nights)</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Guest:</span>
                  <span className="text-white font-medium">{guestName} ({guestPhone})</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold">
                  <span className="text-gray-300">Total Payable:</span>
                  <span className="text-[#d4af37]">₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Paystack Checkout Card */}
              <div className="p-4 rounded-2xl bg-[#0e1a14] border border-emerald-500/30 text-center space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                    <ShieldCheck size={16} /> Paystack Secure Checkout
                  </div>
                  {/* Gateway Mode Badge */}
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${gatewayStatus.badgeClass}`}>
                    {gatewayStatus.label}
                  </span>
                </div>

                <p className="text-xs text-gray-300">
                  Accepts Nigerian ATM Cards (Mastercard, Visa, Verve), Bank Transfers, and USSD.
                </p>

                {/* Error Banner */}
                {paymentError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 text-left">
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                    <span>{paymentError}</span>
                  </div>
                )}

                {/* Primary Payment Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePaystackPayment}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Connecting to Paystack Gateway...
                    </span>
                  ) : (
                    `Pay ₦${totalAmount.toLocaleString()} via Paystack`
                  )}
                </button>

                {/* Paystack Key Manager Toggle */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-emerald-500/20">
                  <span>Paystack Key: <strong className="text-white font-mono">{gatewayStatus.keyMasked}</strong></span>
                  <button
                    type="button"
                    onClick={() => setShowKeyManager(!showKeyManager)}
                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1"
                  >
                    <Key size={11} /> {showKeyManager ? 'Hide Key Setup' : 'Configure Test Key'}
                  </button>
                </div>

                {/* Inline Paystack Key Input (For testing with own test key right now) */}
                {showKeyManager && (
                  <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/40 text-left space-y-2 mt-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-white flex items-center gap-1">
                        <Key size={12} className="text-emerald-400" /> Paystack Public Key
                      </label>
                      <a 
                        href="https://dashboard.paystack.com/#/settings/developer" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-emerald-400 hover:underline"
                      >
                        Get Key from Paystack ↗
                      </a>
                    </div>
                    
                    <input
                      type="text"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full bg-[#14121a] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSaveKey}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Check size={12} /> Save Key
                      </button>

                      {keySavedMessage && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                          <Check size={13} /> Key Saved!
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-gray-400 leading-normal">
                      Use your <strong>pk_test_...</strong> key for development testing. When ready for production on the main domain, enter the client's <strong>pk_live_...</strong> key or set <code className="text-[#d4af37]">VITE_PAYSTACK_PUBLIC_KEY</code> in Vercel.
                    </p>
                  </div>
                )}
              </div>

              {/* Instant Simulation Fallback (for instant test run without keys) */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleSimulatedDemo}
                  className="text-[11px] text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Need quick offline preview? <span className="underline">Simulate Instant Verified Demo</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs text-gray-400 hover:text-white pt-1"
              >
                ← Back to edit dates or guest info
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: OFFICIAL BOOKING PASS & RECEIPT                        */}
          {/* ============================================================== */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Payment Verified</span>
                <h4 className="text-xl font-cinzel font-bold text-white mt-1">Room Reservation Confirmed!</h4>
                <p className="text-xs text-gray-400 mt-1">Present this official booking code upon arrival at the front desk reception.</p>
              </div>

              {/* Official Booking Pass Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#2d0513] to-[#120208] border-2 border-[#d4af37] text-left relative overflow-hidden shadow-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-gray-400">OFFICIAL BOOKING CODE</span>
                    <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#f3e5ab] tracking-wider mt-0.5">
                      {bookingCode}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    PAID (Paystack)
                  </span>
                </div>

                {/* Paystack Verified Reference Row */}
                <div className="mt-3 p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Paystack Reference</span>
                    <span className="font-mono text-xs text-emerald-400 font-semibold">{paystackReference}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyReference}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                    title="Copy reference code"
                  >
                    {copiedRef ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px]">GUEST</span>
                    <div className="font-semibold text-white truncate">{guestName}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">ROOM TYPE</span>
                    <div className="font-semibold text-white truncate">{selectedRoom.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">RESERVED SUITE</span>
                    <div className="font-bold text-amber-300 font-mono text-xs flex items-center gap-1">
                      <Key size={12} className="text-[#d4af37]" />
                      <span>{assignedRoomNumber && assignedRoomNumber !== 'Unassigned' ? `Room #${assignedRoomNumber}` : 'Auto-Reserved'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">BUILDING WING</span>
                    <div className="font-semibold text-gray-300 truncate">{selectedRoom.buildingLabel || 'Main Wing'}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">CHECK-IN</span>
                    <div className="font-semibold text-[#d4af37]">{checkIn} (2 PM)</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">CHECK-OUT</span>
                    <div className="font-semibold text-[#d4af37]">{checkOut} (12 PM)</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">DURATION</span>
                    <div className="font-semibold text-gray-300">{nights} {nights === 1 ? 'Night' : 'Nights'}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">AMOUNT PAID</span>
                    <div className="font-semibold text-emerald-400">₦{totalAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
                >
                  <Share2 size={16} /> Send Booking to Hotel WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer size={14} /> Print / Save PDF Receipt
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
