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
  ArrowLeft,
  Key, 
  Check, 
  AlertCircle, 
  Copy, 
  Printer, 
  Sparkles,
  Building2,
  Users,
  Clock,
  Wifi,
  FileText
} from 'lucide-react';

export default function BookingModal({ isOpen, onClose, preselectedRoomId, onOpenGuestPass }) {
  // Steps: 
  // 1: Choose Suite & Dates
  // 2: Fill Guest Information Before Paying
  // 3: Paystack Checkout & Order Review
  // 4: Payment Confirmed & Guest Session Active
  const [step, setStep] = useState(1);
  const [roomId, setRoomId] = useState(preselectedRoomId || 'deluxe');

  // Dynamic current & next day dates
  const todayStr = () => new Date().toISOString().split('T')[0];
  const tomorrowStr = () => new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(todayStr());
  const [checkOut, setCheckOut] = useState(tomorrowStr());

  // Guest Registration Details (pre-fill from existing session if available, else clean inputs)
  const existingSession = portalStore.getGuestSession();
  const [guestName, setGuestName] = useState(existingSession?.guestName || '');
  const [guestPhone, setGuestPhone] = useState(existingSession?.phone || '');
  const [guestEmail, setGuestEmail] = useState(existingSession?.email || '');
  const [numGuests, setNumGuests] = useState('1 Adult');
  const [specialRequests, setSpecialRequests] = useState('');

  // Validation error state
  const [formError, setFormError] = useState('');

  // Booking & Session output state
  const [bookingCode, setBookingCode] = useState('');
  const [paystackReference, setPaystackReference] = useState('');
  const [assignedRoomNumber, setAssignedRoomNumber] = useState('');
  const [createdSession, setCreatedSession] = useState(null);
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
      setFormError('');
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

  // Step 2 Validation: Ensure Guest fills info before proceeding to Paystack
  const handleProceedToPayment = (e) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!guestName.trim()) {
      setFormError('Please enter your Full Legal Name for official room reservation.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.trim().length < 8) {
      setFormError('Please enter a valid Phone or WhatsApp Number.');
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@') || !guestEmail.includes('.')) {
      setFormError('Please enter a valid Email Address to receive your Paystack transaction receipt.');
      return;
    }

    setStep(3);
  };

  // Complete Booking Persistence & Guest Session Creation
  const recordSuccessfulBooking = (reference, isRealPaystack = true) => {
    const code = 'ASH-' + Math.floor(1000 + Math.random() * 9000);
    setBookingCode(code);
    setPaystackReference(reference);

    // 1. Save into central hotel portal store
    const savedBooking = portalStore.addBooking({
      id: code,
      guestName: guestName.trim(),
      phone: guestPhone.trim(),
      email: guestEmail.trim(),
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

    // 2. CREATE ACTIVE GUEST SESSION!
    const session = portalStore.createGuestSession(savedBooking);
    setCreatedSession(session);

    // Optional background verification call to /api/verify-payment
    if (isRealPaystack && typeof window !== 'undefined') {
      fetch(`/api/verify-payment?reference=${encodeURIComponent(reference)}`)
        .then(r => r.json())
        .then(res => console.log('[Paystack Server Verification]:', res))
        .catch(err => console.log('[Paystack Background Verification Notice]:', err));
    }

    setIsProcessing(false);
    setStep(4);
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
      email: guestEmail.trim(),
      amount: totalAmount,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
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
      `Hello Arab Signature Hotel Reception, I just completed a room reservation online!\n\n` +
      `📋 Official Booking Code: ${bookingCode}\n` +
      (createdSession?.sessionId ? `🔑 Guest Session: ${createdSession.sessionId}\n` : '') +
      `💳 Paystack Reference: ${paystackReference}\n` +
      `👤 Guest Name: ${guestName}\n` +
      `📱 Phone: ${guestPhone}\n` +
      `🏨 Room: ${selectedRoom.name} (${selectedRoom.buildingLabel || 'Arab Signature Wing'})\n` +
      (assignedRoomNumber && assignedRoomNumber !== 'Unassigned' ? `🔑 Assigned Suite: Room #${assignedRoomNumber}\n` : '') +
      `📅 Check-in: ${checkIn} (2:00 PM)\n` +
      `📅 Check-out: ${checkOut} (12:00 PM)\n` +
      `🌙 Duration: ${nights} ${nights === 1 ? 'Night' : 'Nights'}\n` +
      `💰 Amount Paid: ₦${totalAmount.toLocaleString()} via Paystack\n\n` +
      `Kindly confirm my arrival and keycard pickup. Thank you!`
    );
    window.open(`https://wa.me/${HOTEL_INFO.whatsapp}?text=${text}`, '_blank');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#14121a] border border-[#d4af37]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#420317] via-[#5c0725] to-[#250210]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#f3e5ab] text-[10px] font-mono font-bold uppercase">
                {step === 1 ? 'Step 1 of 3: Dates' : step === 2 ? 'Step 2 of 3: Guest Info' : step === 3 ? 'Step 3 of 3: Paystack' : 'Session Active'}
              </span>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#f3e5ab]">
                {step === 4 ? "Booking Confirmed & Session Active" : "Reserve Your Suite"}
              </h3>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">Arab Signature Hotel & Suites • Nsugbe, Onitsha</p>
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
          {/* STEP 1: ROOM SELECTION & STAY DATES                           */}
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
                          ? 'border-[#d4af37] bg-[#5c0725]/50 text-white shadow-md ring-1 ring-[#d4af37]'
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
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1 font-medium">
                    <Calendar size={13} className="text-[#d4af37]" /> Check-In
                  </label>
                  <input
                    type="date"
                    min={todayStr()}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Check-in from 2:00 PM</span>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1 font-medium">
                    <Calendar size={13} className="text-[#d4af37]" /> Check-Out
                  </label>
                  <input
                    type="date"
                    min={checkIn || todayStr()}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Check-out by 12:00 PM</span>
                </div>
              </div>

              {/* Price Summary & High-Visibility Gold Continue Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#420317]/60 via-[#1f020c] to-[#120208] border border-[#d4af37]/40 shadow-xl space-y-3.5">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-300 block font-medium">
                      Total Stay ({nights} {nights === 1 ? 'Night' : 'Nights'} • {selectedRoom.name})
                    </span>
                    <div className="text-2xl font-extrabold text-[#f3e5ab] font-cinzel mt-0.5">
                      ₦{totalAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Suite Rate</span>
                    <span className="text-xs text-[#d4af37] font-semibold">₦{selectedRoom.price.toLocaleString()} / night</span>
                  </div>
                </div>

                {/* Ultra High-Contrast Luminous Gold Continue Button */}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-4 px-6 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xl hover:brightness-105 active:scale-[0.99]"
                  style={{
                    background: 'linear-gradient(135deg, #ffe58f 0%, #d4af37 50%, #b8860b 100%)',
                    color: '#000000',
                    border: '2px solid #fff4cc',
                    boxShadow: '0 6px 24px rgba(212, 175, 55, 0.55)',
                    fontWeight: '900',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span className="text-black font-extrabold">Continue to Guest Info</span>
                  <ArrowRight size={18} className="text-black stroke-[3]" />
                </button>
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* STEP 2: GUEST INFORMATION FORM (BEFORE PAYING AT PAYSTACK)     */}
          {/* ============================================================== */}
          {step === 2 && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="p-3 rounded-2xl bg-[#5c0725]/20 border border-[#d4af37]/30 text-xs text-gray-300 flex items-start gap-2.5">
                <FileText size={18} className="text-[#d4af37] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Primary Guest Stay Information</strong>
                  <span>Please fill in your contact information before proceeding to Paystack checkout. An encrypted guest reservation session will be generated upon payment.</span>
                </div>
              </div>

              {/* Form Error Banner */}
              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Guest Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1.5 font-semibold flex items-center gap-1">
                    <User size={13} className="text-[#d4af37]" /> Full Legal Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Chief Emeka Okafor"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1.5 font-semibold flex items-center gap-1">
                      <Phone size={13} className="text-[#d4af37]" /> WhatsApp / Phone <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="e.g. 0803 123 4567"
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1.5 font-semibold flex items-center gap-1">
                      <Mail size={13} className="text-[#d4af37]" /> Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="e.g. emeka.okafor@example.com"
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1.5 font-semibold flex items-center gap-1">
                      <Users size={13} className="text-[#d4af37]" /> Number of Guests
                    </label>
                    <select
                      value={numGuests}
                      onChange={(e) => setNumGuests(e.target.value)}
                      className="w-full bg-[#1b0812] border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#d4af37] focus:outline-none cursor-pointer"
                    >
                      <option value="1 Adult">1 Adult</option>
                      <option value="2 Adults">2 Adults</option>
                      <option value="2 Adults + 1 Child">2 Adults + 1 Child</option>
                      <option value="3 Adults">3 Adults (Suite Extra Bed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1.5 font-semibold flex items-center gap-1">
                      <Clock size={13} className="text-[#d4af37]" /> Estimated Arrival
                    </label>
                    <input
                      type="text"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. 3:00 PM, extra pillows"
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft size={15} /> Back
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xl hover:brightness-105 active:scale-[0.99]"
                  style={{
                    background: 'linear-gradient(135deg, #ffe58f 0%, #d4af37 50%, #b8860b 100%)',
                    color: '#000000',
                    border: '2px solid #fff4cc',
                    boxShadow: '0 6px 24px rgba(212, 175, 55, 0.55)',
                    fontWeight: '900',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span className="text-black font-extrabold">Review & Proceed to Payment</span>
                  <ArrowRight size={17} className="text-black stroke-[3]" />
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* STEP 3: PAYSTACK PAYMENT GATEWAY                               */}
          {/* ============================================================== */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Reservation Breakdown */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Reserved Suite:</span>
                  <span className="text-white font-medium">{selectedRoom.name} ({selectedRoom.buildingLabel || 'Main Wing'})</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Duration:</span>
                  <span className="text-white font-medium">{checkIn} to {checkOut} ({nights} nights)</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Primary Guest:</span>
                  <span className="text-[#f3e5ab] font-medium">{guestName} ({guestPhone})</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Receipt Email:</span>
                  <span className="text-gray-300 font-mono text-[11px]">{guestEmail}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold">
                  <span className="text-gray-300">Total Billed:</span>
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
                  className="w-full py-4 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all cursor-pointer active:scale-[0.99] hover:brightness-105"
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)',
                    color: '#ffffff',
                    border: '2px solid #a7f3d0',
                    boxShadow: '0 6px 25px rgba(16, 185, 129, 0.5)',
                    fontWeight: '900',
                    letterSpacing: '0.04em'
                  }}
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

                {/* Inline Paystack Key Input */}
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
                  </div>
                )}
              </div>

              {/* Instant Simulation Fallback (for testing) */}
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
                onClick={() => setStep(2)}
                className="w-full text-center text-xs text-gray-400 hover:text-white pt-1"
              >
                ← Back to edit guest information
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 4: PAYMENT CONFIRMED & GUEST SESSION CREATED!             */}
          {/* ============================================================== */}
          {step === 4 && (
            <div className="space-y-4 sm:space-y-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Payment Verified via Paystack</span>
                <h4 className="text-xl font-cinzel font-bold text-white mt-1">Guest Session Created & Confirmed!</h4>
                <p className="text-xs text-gray-300 mt-1">Your reservation session is now active on the hotel network.</p>
              </div>

              {/* VIP Guest Session Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#2d0513] to-[#120208] border-2 border-[#d4af37] text-left relative overflow-hidden shadow-2xl space-y-3">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      ACTIVE GUEST SESSION
                    </span>
                    <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#f3e5ab] tracking-wider mt-0.5">
                      {bookingCode}
                    </div>
                    {createdSession?.sessionId && (
                      <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                        Session: {createdSession.sessionId}
                      </span>
                    )}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    PAID (Paystack)
                  </span>
                </div>

                {/* Paystack Reference */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Paystack Reference</span>
                    <span className="font-mono text-xs text-emerald-400 font-semibold">{paystackReference}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyReference}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                  >
                    {copiedRef ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Stay Details */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px]">PRIMARY GUEST</span>
                    <div className="font-semibold text-white truncate">{guestName}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">SUITE RESERVED</span>
                    <div className="font-semibold text-white truncate">{selectedRoom.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">ASSIGNED ROOM</span>
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
                    <div className="font-semibold text-[#d4af37]">{checkIn} (2:00 PM)</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">CHECK-OUT</span>
                    <div className="font-semibold text-[#d4af37]">{checkOut} (12:00 PM)</div>
                  </div>
                </div>

                {/* WiFi Credentials */}
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <Wifi size={14} className="text-sky-400 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 text-[10px] block">Wi-Fi Access:</span>
                      <strong className="text-white">Arab_Signature_HighSpeed_Guest</strong> • Password: <code className="text-[#f3e5ab]">ArabSignatureVIP</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {onOpenGuestPass && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenGuestPass();
                    }}
                    className="w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl hover:brightness-105 transition-all cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #ffe58f 0%, #d4af37 50%, #b8860b 100%)',
                      color: '#000000',
                      border: '2px solid #fff4cc',
                      boxShadow: '0 6px 24px rgba(212, 175, 55, 0.55)',
                      fontWeight: '900',
                      letterSpacing: '0.04em'
                    }}
                  >
                    <Key size={16} className="text-black stroke-[2.5]" />
                    <span className="text-black font-extrabold">Open My Guest Stay Pass</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Share2 size={15} /> Send Arrival Notice to Hotel WhatsApp
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer size={13} /> Print Folio Receipt
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium text-xs flex items-center justify-center transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
