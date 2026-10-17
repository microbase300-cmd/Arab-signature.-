import React, { useState } from 'react';
import { ROOMS, HOTEL_INFO } from '../data/hotelData';
import { portalStore } from '../data/portalStore';
import { X, Calendar, User, Phone, Mail, CheckCircle2, ShieldCheck, Download, Share2, ArrowRight } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, preselectedRoomId }) {
  const [step, setStep] = useState(1); // 1: Details & Dates, 2: Payment, 3: Success Confirmation
  const [roomId, setRoomId] = useState(preselectedRoomId || 'deluxe');
  const [checkIn, setCheckIn] = useState('2026-10-20');
  const [checkOut, setCheckOut] = useState('2026-10-22');
  const [guestName, setGuestName] = useState('Alhaji Ibrahim Musa');
  const [guestPhone, setGuestPhone] = useState('0812 578 6875');
  const [guestEmail, setGuestEmail] = useState('ibrahim.musa@example.com');
  const [bookingCode, setBookingCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const selectedRoom = ROOMS.find(r => r.id === roomId) || ROOMS[0];

  // Calculate nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) || 1);
  const totalAmount = selectedRoom.price * nights;

  const handlePaystackPayment = () => {
    setIsProcessing(true);
    // Simulate Paystack verified transaction
    setTimeout(() => {
      const randomCode = 'ASH-' + Math.floor(1000 + Math.random() * 9000);
      setBookingCode(randomCode);

      // Persist booking into real-time receptionist & admin portal store
      portalStore.addBooking({
        id: randomCode,
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
        paymentMethod: "Paystack (Online)",
        paymentStatus: "Paid",
        source: "Direct Website"
      });

      setIsProcessing(false);
      setStep(3);
    }, 1500);
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(
      `Hello Arab Signature Hotel Reception, I just booked a room online!\n\n` +
      `📋 Booking Code: ${bookingCode}\n` +
      `👤 Guest Name: ${guestName}\n` +
      `🏨 Room: ${selectedRoom.name}\n` +
      `📅 Check-in: ${checkIn} (2:00 PM)\n` +
      `📅 Check-out: ${checkOut} (12:00 PM)\n` +
      `💳 Amount Paid: ₦${totalAmount.toLocaleString()} via Paystack\n\n` +
      `Kindly confirm my reservation. Thank you!`
    );
    window.open(`https://wa.me/${HOTEL_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#14121a] border border-[#d4af37]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
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
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          
          {step === 1 && (
            <>
              {/* Room Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-medium">
                  Select Room / Suite
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROOMS.map((room) => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setRoomId(room.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        roomId === room.id
                          ? 'border-[#d4af37] bg-[#5c0725]/40 text-white shadow-md'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white truncate">{room.name}</div>
                      <div className="text-xs text-[#d4af37] font-bold mt-1">{room.priceFormatted} <span className="text-[10px] text-gray-400 font-normal">/ night</span></div>
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

          {step === 2 && (
            <div className="space-y-4">
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

              {/* Paystack Channel Simulation */}
              <div className="p-4 rounded-2xl bg-[#0e1a14] border border-emerald-500/30 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck size={16} /> Paystack Secure Checkout
                </div>
                <p className="text-xs text-gray-400">
                  Pay securely with Nigerian ATM Card, Bank Transfer, or USSD.
                </p>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePaystackPayment}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Verifying with Paystack...
                    </span>
                  ) : (
                    `Pay ₦${totalAmount.toLocaleString()} via Paystack`
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs text-gray-400 hover:text-white"
              >
                ← Back to edit dates or guest info
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Payment Verified</span>
                <h4 className="text-xl font-cinzel font-bold text-white mt-1">Room Reservation Confirmed!</h4>
                <p className="text-xs text-gray-400 mt-1">Present this code upon arrival at the front desk reception.</p>
              </div>

              {/* Official Booking Pass Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#2d0513] to-[#120208] border-2 border-[#d4af37] text-left relative overflow-hidden shadow-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-gray-400">OFFICIAL BOOKING CODE</span>
                    <div className="text-3xl font-mono font-extrabold text-[#f3e5ab] tracking-wider mt-1">
                      {bookingCode}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    PAID (Paystack)
                  </span>
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
                    <span className="text-gray-400 text-[10px]">CHECK-IN</span>
                    <div className="font-semibold text-[#d4af37]">{checkIn} (2 PM)</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">CHECK-OUT</span>
                    <div className="font-semibold text-[#d4af37]">{checkOut} (12 PM)</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
                >
                  <Share2 size={16} /> Send Booking to Hotel WhatsApp (₦0)
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Receipt downloaded for Booking Code: ${bookingCode}`)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-2"
                >
                  <Download size={14} /> Download PDF Receipt Card
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
