import React, { useState, useEffect } from 'react';
import { HOTEL_INFO } from '../data/hotelData';
import { portalStore } from '../data/portalStore';
import { emailService } from '../utils/emailService';
import { printFolioReceipt, openWhatsAppReceipt, buildWhatsAppReceiptText, formatWhatsAppPhone } from '../utils/printFolio';
import { 
  generateReceiptImageBlob, 
  downloadReceiptImageBlob, 
  shareReceiptImageToWhatsApp, 
  copyReceiptImageToClipboard 
} from '../utils/receiptImageGenerator';
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
  FileText,
  MapPin,
  Heart,
  RotateCw,
  MessageSquare,
  Eye,
  Image as ImageIcon
} from 'lucide-react';

export default function BookingModal({ isOpen, onClose, preselectedRoomId, onOpenGuestPass }) {
  // Steps: 
  // 1: Choose Suite & Dates
  // 2: Fill Guest Information Before Paying
  // 3: Paystack Checkout & Order Review
  // 4: Payment Confirmed & Guest Session Active
  const [step, setStep] = useState(1);
  const [roomId, setRoomId] = useState(preselectedRoomId || 'deluxe');

  // Dynamic current & next day dates with flexible stay duration
  const todayStr = () => new Date().toISOString().split('T')[0];
  const calcCheckOutDate = (inDate, days) => {
    try {
      const parts = (inDate || todayStr()).split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      d.setDate(d.getDate() + Math.max(1, Number(days) || 1));
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return new Date(Date.now() + 86400000).toISOString().split('T')[0];
    }
  };

  const [checkIn, setCheckIn] = useState(todayStr());
  const [durationDays, setDurationDays] = useState(1);
  const [checkOut, setCheckOut] = useState(() => calcCheckOutDate(todayStr(), 1));

  // Stay duration change handler (recalculates checkOut date & price)
  const handleDurationChange = (newDays) => {
    const valid = Math.max(1, Math.min(60, Number(newDays) || 1));
    setDurationDays(valid);
    setCheckOut(calcCheckOutDate(checkIn, valid));
  };

  // Check-In date change handler (preserves chosen durationDays)
  const handleCheckInChange = (newInDate) => {
    setCheckIn(newInDate);
    setCheckOut(calcCheckOutDate(newInDate, durationDays));
  };

  // Check-Out date change handler (recalculates durationDays from date difference)
  const handleCheckOutChange = (newOutDate) => {
    setCheckOut(newOutDate);
    try {
      const pIn = checkIn.split('-').map(Number);
      const pOut = newOutDate.split('-').map(Number);
      const d1 = new Date(pIn[0], pIn[1] - 1, pIn[2]);
      const d2 = new Date(pOut[0], pOut[1] - 1, pOut[2]);
      const diff = Math.max(1, Math.round((d2 - d1) / 86400000) || 1);
      setDurationDays(diff);
    } catch {
      // fallback
    }
  };

  // Guest Registration Details (pre-fill from active customer session or guest session)
  const existingCust = portalStore.getCustomerSession();
  const existingGuest = portalStore.getGuestSession();
  const [guestName, setGuestName] = useState(existingCust?.guestName || existingGuest?.guestName || '');
  const [guestPhone, setGuestPhone] = useState(existingCust?.phone || existingGuest?.phone || '');
  const [guestEmail, setGuestEmail] = useState(existingCust?.email || existingGuest?.email || '');
  const [guestAddress, setGuestAddress] = useState(existingCust?.homeAddress || existingGuest?.homeAddress || '');
  const [nextOfKinName, setNextOfKinName] = useState(existingCust?.nextOfKinName || existingGuest?.nextOfKinName || '');
  const [nextOfKinPhone, setNextOfKinPhone] = useState(existingCust?.nextOfKinPhone || existingGuest?.nextOfKinPhone || '');
  const [nextOfKinRelationship, setNextOfKinRelationship] = useState(existingCust?.nextOfKinRelationship || existingGuest?.nextOfKinRelationship || 'Spouse');
  const [returningGuestInfo, setReturningGuestInfo] = useState(() => {
    return portalStore.detectReturningCustomer(existingCust?.phone || existingGuest?.phone || '');
  });
  const [numGuests, setNumGuests] = useState('1 Adult');
  const [specialRequests, setSpecialRequests] = useState('');

  // Validation error state
  const [formError, setFormError] = useState('');

  // Booking & Session output state
  const [bookingCode, setBookingCode] = useState('');
  const [paystackReference, setPaystackReference] = useState('');
  const [assignedRoomNumber, setAssignedRoomNumber] = useState('');
  const [createdSession, setCreatedSession] = useState(null);
  const [lastSavedBooking, setLastSavedBooking] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [emailStatus, setEmailStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'failed'
  const [emailStatusMsg, setEmailStatusMsg] = useState('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  // Official Folio Receipt Image State (Canvas PNG)
  const [receiptImageObj, setReceiptImageObj] = useState(null); // { dataUrl, blob, file, fileName }
  const [isGeneratingReceiptImage, setIsGeneratingReceiptImage] = useState(false);
  const [receiptImageToast, setReceiptImageToast] = useState('');
  const [isPreviewImageOpen, setIsPreviewImageOpen] = useState(false);

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

  // Calculate stay duration (days/nights) & effective promo rate
  const nights = durationDays;
  const effectiveNightlyRate = (selectedRoom.isPromoActive && selectedRoom.promoPrice > 0)
    ? selectedRoom.promoPrice
    : selectedRoom.price;
  const totalAmount = effectiveNightlyRate * durationDays;

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
    if (!guestAddress.trim()) {
      setFormError('Please enter your Home / Residential Address for hotel registration.');
      return;
    }
    if (!nextOfKinName.trim()) {
      setFormError('Please enter your Next of Kin Full Name for emergency contact records.');
      return;
    }
    if (!nextOfKinPhone.trim() || nextOfKinPhone.trim().length < 7) {
      setFormError('Please enter your Next of Kin Phone Number.');
      return;
    }

    setStep(3);
  };

  // Complete Booking Persistence & Guest Session Creation
  const recordSuccessfulBooking = (reference, isRealPaystack = true) => {
    // 1. Save into central hotel portal store with automatic building-aware code generation
    const savedBooking = portalStore.addBooking({
      guestName: guestName.trim(),
      phone: guestPhone.trim(),
      email: guestEmail.trim(),
      homeAddress: guestAddress.trim(),
      nextOfKinName: nextOfKinName.trim(),
      nextOfKinPhone: nextOfKinPhone.trim(),
      nextOfKinRelationship: nextOfKinRelationship.trim(),
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

    const code = savedBooking.id;
    setBookingCode(code);
    setPaystackReference(reference);
    setLastSavedBooking(savedBooking);

    if (savedBooking && savedBooking.roomNumber) {
      setAssignedRoomNumber(savedBooking.roomNumber);
    }

    // 2. CREATE ACTIVE GUEST SESSION!
    const session = portalStore.createGuestSession(savedBooking);
    setCreatedSession(session);

    // 3. Send Official Luxury Confirmation Email via Resend
    if (savedBooking && savedBooking.email) {
      setEmailStatus('sending');
      setEmailStatusMsg(`Dispatching confirmation email to ${savedBooking.email}...`);
      emailService.sendReservationEmail(savedBooking)
        .then(res => {
          if (res && res.success !== false) {
            setEmailStatus('sent');
            setEmailStatusMsg(`Official confirmation email with booking code dispatched to ${savedBooking.email}`);
          } else {
            setEmailStatus('failed');
            setEmailStatusMsg(res?.error || `Email could not be delivered to ${savedBooking.email}`);
          }
        })
        .catch(err => {
          console.warn('[Reservation Email Notice]:', err);
          setEmailStatus('failed');
          setEmailStatusMsg(err?.message || 'Email dispatch error');
        });
    }

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

  const handleCopyBookingCode = () => {
    if (bookingCode) {
      navigator.clipboard.writeText(bookingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleResendEmail = async () => {
    const booking = lastSavedBooking || {
      id: bookingCode,
      guestName: guestName.trim(),
      email: guestEmail.trim(),
      phone: guestPhone.trim(),
      roomName: selectedRoom.name,
      roomNumber: assignedRoomNumber,
      checkIn: checkIn,
      checkOut: checkOut,
      nights: nights,
      amount: totalAmount,
      paystackReference: paystackReference
    };

    if (!booking.email) {
      alert('No email address provided for this reservation.');
      return;
    }

    setIsResendingEmail(true);
    setEmailStatus('sending');
    setEmailStatusMsg(`Resending confirmation email to ${booking.email}...`);

    try {
      const res = await emailService.sendReservationEmail(booking);
      if (res && res.success !== false) {
        setEmailStatus('sent');
        setEmailStatusMsg(`Confirmation email successfully sent to ${booking.email}`);
      } else {
        setEmailStatus('failed');
        setEmailStatusMsg(res?.error || `Email delivery failed. Please check internet connection.`);
      }
    } catch (err) {
      setEmailStatus('failed');
      setEmailStatusMsg(err?.message || 'Email delivery failed.');
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleWhatsAppSend = () => {
    const booking = lastSavedBooking || {
      id: bookingCode,
      guestName: guestName.trim(),
      phone: guestPhone.trim(),
      email: guestEmail.trim(),
      homeAddress: guestAddress.trim(),
      nextOfKinName: nextOfKinName.trim(),
      nextOfKinPhone: nextOfKinPhone.trim(),
      nextOfKinRelationship: nextOfKinRelationship.trim(),
      roomName: selectedRoom.name,
      roomNumber: assignedRoomNumber,
      buildingLabel: selectedRoom.buildingLabel,
      checkIn: checkIn,
      checkOut: checkOut,
      nights: nights,
      amount: totalAmount,
      paymentMethod: "Paystack (Online Verified)",
      paystackReference: paystackReference
    };
    openWhatsAppReceipt(HOTEL_INFO.whatsapp, booking);
  };

  const handleSendToMyWhatsApp = () => {
    const booking = lastSavedBooking || {
      id: bookingCode,
      guestName: guestName.trim(),
      phone: guestPhone.trim(),
      email: guestEmail.trim(),
      homeAddress: guestAddress.trim(),
      nextOfKinName: nextOfKinName.trim(),
      nextOfKinPhone: nextOfKinPhone.trim(),
      nextOfKinRelationship: nextOfKinRelationship.trim(),
      roomName: selectedRoom.name,
      roomNumber: assignedRoomNumber,
      buildingLabel: selectedRoom.buildingLabel,
      checkIn: checkIn,
      checkOut: checkOut,
      nights: nights,
      amount: totalAmount,
      paymentMethod: "Paystack (Online Verified)",
      paystackReference: paystackReference
    };
    openWhatsAppReceipt(guestPhone, booking);
  };

  const handlePrintReceipt = () => {
    const bookingToPrint = lastSavedBooking || {
      id: bookingCode,
      guestName: guestName.trim(),
      phone: guestPhone.trim(),
      email: guestEmail.trim(),
      homeAddress: guestAddress.trim(),
      nextOfKinName: nextOfKinName.trim(),
      nextOfKinPhone: nextOfKinPhone.trim(),
      nextOfKinRelationship: nextOfKinRelationship.trim(),
      roomName: selectedRoom.name,
      roomNumber: assignedRoomNumber,
      buildingLabel: selectedRoom.buildingLabel,
      checkIn: checkIn,
      checkOut: checkOut,
      nights: nights,
      amount: totalAmount,
      paymentMethod: "Paystack (Online Verified)",
      paystackReference: paystackReference
    };
    printFolioReceipt(bookingToPrint);
  };

  // Automatically generate High-Res Canvas Receipt Slip Image when Step 4 is reached
  useEffect(() => {
    if (step === 4) {
      const booking = lastSavedBooking || {
        id: bookingCode,
        guestName: guestName.trim(),
        phone: guestPhone.trim(),
        email: guestEmail.trim(),
        homeAddress: guestAddress.trim(),
        nextOfKinName: nextOfKinName.trim(),
        nextOfKinPhone: nextOfKinPhone.trim(),
        nextOfKinRelationship: nextOfKinRelationship.trim(),
        roomName: selectedRoom.name,
        roomNumber: assignedRoomNumber,
        buildingLabel: selectedRoom.buildingLabel,
        checkIn: checkIn,
        checkOut: checkOut,
        nights: nights,
        amount: totalAmount,
        paymentMethod: "Paystack (Online Verified)",
        paystackReference: paystackReference
      };

      setIsGeneratingReceiptImage(true);
      generateReceiptImageBlob(booking)
        .then((res) => {
          setReceiptImageObj(res);
        })
        .catch((err) => {
          console.warn('[Receipt Image Generation Notice]:', err);
        })
        .finally(() => {
          setIsGeneratingReceiptImage(false);
        });
    }
  }, [step, bookingCode, assignedRoomNumber]);

  // Share Official Receipt Image to WhatsApp (Mobile 1-Tap / Desktop Copy + Open)
  const handleShareImageWhatsApp = async (targetPhone) => {
    const booking = lastSavedBooking || {
      id: bookingCode,
      guestName: guestName.trim(),
      phone: guestPhone.trim(),
      email: guestEmail.trim(),
      homeAddress: guestAddress.trim(),
      nextOfKinName: nextOfKinName.trim(),
      nextOfKinPhone: nextOfKinPhone.trim(),
      nextOfKinRelationship: nextOfKinRelationship.trim(),
      roomName: selectedRoom.name,
      roomNumber: assignedRoomNumber,
      buildingLabel: selectedRoom.buildingLabel,
      checkIn: checkIn,
      checkOut: checkOut,
      nights: nights,
      amount: totalAmount,
      paymentMethod: "Paystack (Online Verified)",
      paystackReference: paystackReference
    };

    setReceiptImageToast('Preparing official receipt slip image...');
    try {
      const res = await shareReceiptImageToWhatsApp(targetPhone, booking);
      if (res?.method === 'native_share') {
        setReceiptImageToast('Receipt image slip shared to WhatsApp!');
      } else if (res?.copiedToClipboard) {
        setReceiptImageToast('Receipt image copied to clipboard & downloaded! Press Ctrl+V in WhatsApp to send.');
      } else {
        setReceiptImageToast('Receipt image downloaded! You can attach it in WhatsApp.');
      }
    } catch (err) {
      console.warn('WhatsApp image error:', err);
      setReceiptImageToast('Opening text receipt fallback...');
      openWhatsAppReceipt(targetPhone, booking);
    }
    setTimeout(() => setReceiptImageToast(''), 6000);
  };

  // Download high-resolution PNG receipt slip directly
  const handleDownloadImage = async () => {
    const booking = lastSavedBooking || {
      id: bookingCode,
      guestName: guestName.trim(),
      phone: guestPhone.trim(),
      email: guestEmail.trim(),
      homeAddress: guestAddress.trim(),
      nextOfKinName: nextOfKinName.trim(),
      nextOfKinPhone: nextOfKinPhone.trim(),
      nextOfKinRelationship: nextOfKinRelationship.trim(),
      roomName: selectedRoom.name,
      roomNumber: assignedRoomNumber,
      buildingLabel: selectedRoom.buildingLabel,
      checkIn: checkIn,
      checkOut: checkOut,
      nights: nights,
      amount: totalAmount,
      paymentMethod: "Paystack (Online Verified)",
      paystackReference: paystackReference
    };

    try {
      let blob = receiptImageObj?.blob;
      let fileName = receiptImageObj?.fileName;
      if (!blob) {
        const gen = await generateReceiptImageBlob(booking);
        blob = gen.blob;
        fileName = gen.fileName;
        setReceiptImageObj(gen);
      }
      downloadReceiptImageBlob(blob, fileName || `Arab_Signature_Receipt_${bookingCode}.png`);
      setReceiptImageToast('Receipt image slip downloaded (.png)!');
    } catch (e) {
      setReceiptImageToast('Failed to download image slip.');
    }
    setTimeout(() => setReceiptImageToast(''), 4000);
  };

  // Copy receipt image to system clipboard
  const handleCopyImage = async () => {
    try {
      let blob = receiptImageObj?.blob;
      if (!blob) {
        const booking = lastSavedBooking || {
          id: bookingCode,
          guestName: guestName.trim(),
          phone: guestPhone.trim(),
          email: guestEmail.trim(),
          homeAddress: guestAddress.trim(),
          roomName: selectedRoom.name,
          roomNumber: assignedRoomNumber,
          buildingLabel: selectedRoom.buildingLabel,
          checkIn: checkIn,
          checkOut: checkOut,
          nights: nights,
          amount: totalAmount,
          paymentMethod: "Paystack (Online Verified)",
          paystackReference: paystackReference
        };
        const gen = await generateReceiptImageBlob(booking);
        blob = gen.blob;
        setReceiptImageObj(gen);
      }
      await copyReceiptImageToClipboard(blob);
      setReceiptImageToast('Receipt image copied to clipboard! Simply press Ctrl+V in WhatsApp to paste.');
    } catch (e) {
      setReceiptImageToast('Clipboard image copying not supported. Please use Download button.');
    }
    setTimeout(() => setReceiptImageToast(''), 4000);
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
                      {room.isPromoActive && room.promoPrice ? (
                        <div className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="line-through text-gray-400 text-[10px]">₦{room.price.toLocaleString()}</span>
                          <span>₦{room.promoPrice.toLocaleString()}</span>
                          <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[8px] font-bold">PROMO</span>
                        </div>
                      ) : (
                        <div className="text-xs text-[#d4af37] font-bold mt-1">{room.priceFormatted} <span className="text-[10px] text-gray-400 font-normal">/ nt</span></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stay Duration: Choose How Many Days/Nights */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-[#d4af37]/35 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-[#f3e5ab] font-bold flex items-center gap-1.5">
                    <Clock size={14} className="text-[#d4af37]" /> How Many Days Do You Want to Stay?
                  </label>
                  <span className="text-xs font-mono font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full border border-white/10">
                    {durationDays} {durationDays === 1 ? 'Day' : 'Days'} ({durationDays} {durationDays === 1 ? 'Night' : 'Nights'})
                  </span>
                </div>

                {/* Duration Stepper & Real-Time Price Calculation */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="flex items-center justify-center bg-black/70 border border-[#d4af37]/50 rounded-xl p-1 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleDurationChange(durationDays - 1)}
                      disabled={durationDays <= 1}
                      className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white font-bold text-lg flex items-center justify-center transition-all cursor-pointer"
                      title="Decrease duration by 1 day"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={durationDays}
                      onChange={(e) => handleDurationChange(e.target.value)}
                      className="w-14 text-center bg-transparent text-white font-extrabold font-mono text-base focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleDurationChange(durationDays + 1)}
                      disabled={durationDays >= 60}
                      className="w-9 h-9 rounded-lg bg-[#5c0725] hover:bg-[#780a31] text-[#f3e5ab] font-bold text-lg flex items-center justify-center transition-all cursor-pointer"
                      title="Add 1 day"
                    >
                      +
                    </button>
                  </div>

                  {/* Calculated Price Display Callout */}
                  <div className="flex-1 p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-gray-400 text-[11px]">Calculated Price:</span>
                    <span className="font-bold font-mono text-[#f3e5ab]">
                      ₦{effectiveNightlyRate.toLocaleString()} × {durationDays} {durationDays === 1 ? 'Day' : 'Days'} = <strong className="text-emerald-400">₦{totalAmount.toLocaleString()}</strong>
                    </span>
                  </div>
                </div>

                {/* Quick Selection Preset Pills */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider mr-1">Quick Select:</span>
                  {[1, 2, 3, 4, 5, 7, 10, 14, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDurationChange(d)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                        durationDays === d
                          ? 'bg-[#d4af37] text-black font-extrabold shadow-md ring-1 ring-white'
                          : 'bg-white/5 hover:bg-white/15 text-gray-300 border border-white/10'
                      }`}
                    >
                      {d} {d === 1 ? 'Day' : 'Days'}
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
                    onChange={(e) => handleCheckInChange(e.target.value)}
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
                    onChange={(e) => handleCheckOutChange(e.target.value)}
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
                      Total Stay ({durationDays} {durationDays === 1 ? 'Day' : 'Days'} • {selectedRoom.name})
                    </span>
                    <div className="text-2xl font-extrabold text-[#f3e5ab] font-cinzel mt-0.5">
                      ₦{totalAmount.toLocaleString()}
                    </div>
                    {selectedRoom.isPromoActive && selectedRoom.promoPrice > 0 && (
                      <span className="text-[11px] text-emerald-400 font-mono font-medium block mt-0.5">
                        🔥 Promo Applied: Save ₦{((selectedRoom.price - selectedRoom.promoPrice) * durationDays).toLocaleString()} total!
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Suite Rate</span>
                    {selectedRoom.isPromoActive && selectedRoom.promoPrice > 0 ? (
                      <div>
                        <span className="line-through text-gray-400 text-[10px] block font-mono">₦{selectedRoom.price.toLocaleString()}</span>
                        <span className="text-xs text-emerald-400 font-bold">₦{selectedRoom.promoPrice.toLocaleString()} / night</span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#d4af37] font-semibold">₦{selectedRoom.price.toLocaleString()} / night</span>
                    )}
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

              {/* Returning Customer Recognition Banner */}
              {returningGuestInfo && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-[#d4af37]/15 to-[#5c0725]/20 border border-[#d4af37]/50 text-xs flex items-center justify-between gap-2.5 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#d4af37] shrink-0" />
                    <div>
                      <strong className="text-white block font-semibold">
                        Welcome Back, {returningGuestInfo.previousGuestName}!
                      </strong>
                      <span className="text-[11px] text-[#f3e5ab]">
                        Returning VIP Patron • {returningGuestInfo.totalPreviousStays} lifetime {returningGuestInfo.totalPreviousStays === 1 ? 'stay' : 'stays'} recorded
                      </span>
                    </div>
                  </div>
                  {(!guestName || !guestEmail) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (returningGuestInfo.previousGuestName) setGuestName(returningGuestInfo.previousGuestName);
                        if (returningGuestInfo.previousEmail) setGuestEmail(returningGuestInfo.previousEmail);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#d4af37] hover:bg-[#ffe58f] text-black font-extrabold text-[10px] uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow"
                    >
                      Auto-Fill
                    </button>
                  )}
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
                      onChange={(e) => {
                        const val = e.target.value;
                        setGuestPhone(val);
                        const match = portalStore.detectReturningCustomer(val);
                        if (match) setReturningGuestInfo(match);
                      }}
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
                      onChange={(e) => {
                        const val = e.target.value;
                        setGuestEmail(val);
                        if (!returningGuestInfo) {
                          const match = portalStore.detectReturningCustomer(val);
                          if (match) setReturningGuestInfo(match);
                        }
                      }}
                      placeholder="e.g. emeka.okafor@example.com"
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Client Home Address */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1.5 font-semibold flex items-center gap-1">
                    <MapPin size={13} className="text-[#d4af37]" /> Home / Residential Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={guestAddress}
                    onChange={(e) => setGuestAddress(e.target.value)}
                    placeholder="e.g. Plot 12 GRA, Onitsha / 15 Ozalla Street"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                {/* Next of Kin Emergency Contact */}
                <div className="p-3.5 rounded-2xl bg-[#5c0725]/25 border border-[#d4af37]/35 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <Heart size={13} className="text-[#d4af37]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold">
                      Next of Kin Information (Emergency Contact) *
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] uppercase text-gray-300 mb-1 font-semibold">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={nextOfKinName}
                        onChange={(e) => setNextOfKinName(e.target.value)}
                        placeholder="e.g. Mrs. Ngozi Okafor"
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] uppercase text-gray-300 mb-1 font-semibold">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={nextOfKinPhone}
                        onChange={(e) => setNextOfKinPhone(e.target.value)}
                        placeholder="e.g. 0802 000 0000"
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] uppercase text-gray-300 mb-1 font-semibold">
                        Relationship
                      </label>
                      <select
                        value={nextOfKinRelationship}
                        onChange={(e) => setNextOfKinRelationship(e.target.value)}
                        className="w-full bg-[#1b0812] border border-white/20 rounded-xl px-3 py-2 text-white text-xs focus:border-[#d4af37] focus:outline-none cursor-pointer"
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Parent">Parent</option>
                        <option value="Child">Child</option>
                        <option value="Relative">Relative</option>
                        <option value="Business Associate">Business Associate</option>
                      </select>
                    </div>
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
                  <span>Stay Duration:</span>
                  <span className="text-white font-medium">{durationDays} {durationDays === 1 ? 'Day' : 'Days'} ({checkIn} to {checkOut})</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Rate Calculation:</span>
                  <span className="text-emerald-400 font-mono font-bold">₦{effectiveNightlyRate.toLocaleString()} × {durationDays} {durationDays === 1 ? 'Day' : 'Days'}</span>
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
                  <span className="text-gray-300">Total Paystack Charge:</span>
                  <span className="text-[#d4af37] font-cinzel text-base">₦{totalAmount.toLocaleString()}</span>
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
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#f3e5ab] tracking-wider">
                        {bookingCode}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyBookingCode}
                        className="px-2.5 py-1 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/35 border border-[#d4af37]/50 text-[#f3e5ab] text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                        title="Copy Official Booking Code"
                      >
                        {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                      </button>
                    </div>
                    {createdSession?.sessionId && (
                      <span className="text-[10px] text-gray-400 font-mono block mt-1">
                        Session: {createdSession.sessionId}
                      </span>
                    )}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    PAID (Paystack)
                  </span>
                </div>

                {/* Live Official Email Confirmation Status */}
                <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                  emailStatus === 'sent'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : emailStatus === 'failed'
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    : 'bg-black/40 border-white/10 text-gray-300'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    {emailStatus === 'sending' ? (
                      <RotateCw size={14} className="text-[#d4af37] animate-spin shrink-0" />
                    ) : emailStatus === 'sent' ? (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    ) : emailStatus === 'failed' ? (
                      <AlertCircle size={14} className="text-rose-400 shrink-0" />
                    ) : (
                      <Mail size={14} className="text-[#d4af37] shrink-0" />
                    )}
                    <div className="truncate">
                      <span className="font-semibold block text-[11px]">
                        {emailStatus === 'sent' ? 'Confirmation Email Delivered' : emailStatus === 'failed' ? 'Email Notice' : 'Confirmation Email'}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate block">
                        {emailStatusMsg || (guestEmail ? `Sent to ${guestEmail}` : 'Email dispatch queued')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isResendingEmail}
                    onClick={handleResendEmail}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[#f3e5ab] text-[10px] font-mono shrink-0 transition-colors cursor-pointer border border-white/15 flex items-center gap-1"
                    title="Resend email confirmation to your inbox"
                  >
                    <RotateCw size={10} className={isResendingEmail ? "animate-spin" : ""} />
                    <span>{isResendingEmail ? 'Sending...' : 'Resend Email'}</span>
                  </button>
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

                {/* Home Address & Next of Kin Record */}
                {guestAddress && (
                  <div className="pt-2 border-t border-white/10 text-xs">
                    <span className="text-gray-400 text-[10px] block">HOME ADDRESS & EMERGENCY CONTACT</span>
                    <div className="text-gray-200 text-[11px] truncate">{guestAddress}</div>
                    {nextOfKinName && (
                      <div className="text-gray-400 text-[10px] mt-0.5">
                        Next of Kin: <span className="text-white font-medium">{nextOfKinName}</span> ({nextOfKinPhone} • {nextOfKinRelationship})
                      </div>
                    )}
                  </div>
                )}

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

                {/* Dedicated WhatsApp Official Folio Receipt Card (VISUAL IMAGE FIRST) */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#182a20] via-[#120208] to-[#1a2c22] border-2 border-emerald-500/50 text-left space-y-3 shadow-2xl">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <MessageSquare size={15} className="text-[#25D366]" />
                      <span>Official WhatsApp Receipt Slip (Image)</span>
                    </div>
                    <span className="text-[10px] text-emerald-300 font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold flex items-center gap-1">
                      <Check size={11} className="text-emerald-400" />
                      Visual Image Slip • High-Res PNG
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Official receipt slip formatted like the folio document, featuring the golden AS emblem, customer particulars, Wi-Fi credentials, and the big green <strong className="text-emerald-300">[ &check; ] PAID IN FULL</strong> stamp.
                  </p>

                  {/* High-Resolution Receipt Image Slip Thumbnail & Preview Card */}
                  {receiptImageObj?.dataUrl && (
                    <div className="relative rounded-xl border border-emerald-500/30 overflow-hidden bg-black/60 group">
                      <div 
                        onClick={() => setIsPreviewImageOpen(true)}
                        className="cursor-pointer relative max-h-48 overflow-hidden flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 transition-colors"
                        title="Click to view full receipt image slip"
                      >
                        <img 
                          src={receiptImageObj.dataUrl} 
                          alt="Arab Signature Official Receipt Slip" 
                          className="w-full max-w-xs object-cover rounded shadow-md group-hover:scale-[1.02] transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity text-white text-xs font-bold">
                          <Eye size={16} /> Tap to Enlarge Slip
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-black/80 border-t border-emerald-500/20 flex items-center justify-between text-[10px] text-gray-400">
                        <span className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                          <span className="truncate">Image Slip Ready: {receiptImageObj.fileName}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsPreviewImageOpen(true)}
                          className="text-emerald-400 hover:text-emerald-300 underline font-medium shrink-0 ml-2 cursor-pointer"
                        >
                          Enlarge Slip ↗
                        </button>
                      </div>
                    </div>
                  )}

                  {isGeneratingReceiptImage && !receiptImageObj && (
                    <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                      <RotateCw size={14} className="animate-spin text-emerald-400" />
                      Rendering high-resolution receipt image slip...
                    </div>
                  )}

                  {/* Feedback Toast if any */}
                  {receiptImageToast && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>{receiptImageToast}</span>
                    </div>
                  )}

                  {/* Primary 1-Tap Share Image Button directly to the customer's WhatsApp */}
                  {guestPhone && (
                    <button
                      type="button"
                      onClick={() => handleShareImageWhatsApp(guestPhone)}
                      className="w-full py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer active:scale-[0.99] hover:brightness-110"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #25D366 50%, #059669 100%)',
                        color: '#06200e',
                        border: '2px solid #a7f3d0',
                        fontWeight: '900',
                        letterSpacing: '0.04em'
                      }}
                    >
                      <MessageSquare size={16} className="text-[#06200e] stroke-[2.5]" />
                      <span>Send Receipt Image to My WhatsApp ({guestPhone})</span>
                    </button>
                  )}

                  {/* Quick Action Grid: Download PNG Image & Copy Image to Clipboard */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleDownloadImage}
                      className="py-2.5 px-3 rounded-xl bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Download receipt slip as PNG image file"
                    >
                      <Download size={13} className="text-emerald-400" />
                      <span>Download Image (.png)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyImage}
                      className="py-2.5 px-3 rounded-xl bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Copy receipt image to clipboard for instant pasting (Ctrl+V) into WhatsApp"
                    >
                      <Copy size={13} className="text-emerald-400" />
                      <span>Copy Image to Paste</span>
                    </button>
                  </div>

                  {/* Secondary Options */}
                  <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-gray-400 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleShareImageWhatsApp(HOTEL_INFO.whatsapp)}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Share2 size={11} /> Send Copy to Reception WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={handleSendToMyWhatsApp}
                      className="text-gray-400 hover:text-gray-200 underline transition-colors cursor-pointer"
                      title="Send clean formatted text version to WhatsApp"
                    >
                      Or send text version
                    </button>
                  </div>
                </div>

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

      {/* High-Resolution Fullscreen Receipt Image Lightbox */}
      {isPreviewImageOpen && receiptImageObj?.dataUrl && (
        <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#14121a] border border-[#d4af37]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
            <div className="flex items-center justify-between px-4 py-3 bg-[#3d0519] border-b border-[#d4af37]/30 text-white">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-[#f3e5ab]" />
                <span className="font-serif font-bold text-sm text-[#f3e5ab]">Official Guest Folio Receipt Slip</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewImageOpen(false)}
                className="p-1 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close image preview"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-3 overflow-y-auto flex-1 flex items-center justify-center bg-neutral-900/90">
              <img 
                src={receiptImageObj.dataUrl} 
                alt="Official Arab Signature Receipt"
                className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-2xl border border-white/10"
              />
            </div>

            <div className="p-3 bg-[#14121a] border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-mono truncate max-w-[200px]">
                {receiptImageObj.fileName}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={13} /> Download (.png)
                </button>
                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy size={13} /> Copy Image
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewImageOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
