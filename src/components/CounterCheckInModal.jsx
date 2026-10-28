// Arab Signature Hotel & Suites — Counter Check-In & Booking Verification Modal
// Empowers Front Desk receptionists (Main Building & Extension Building) to verify online booking codes,
// confirm Paystack payment settlement, allocate keycard rooms, and complete guest check-in.

import React, { useState, useEffect } from 'react';
import { portalStore } from '../data/portalStore';
import { 
  X, Search, Key, CheckCircle2, User, Phone, Mail, MapPin, 
  Building2, Calendar, Clock, CreditCard, ShieldCheck, Printer, 
  MessageSquare, AlertCircle, Copy, Check, ArrowRight, Sparkles, Heart
} from 'lucide-react';
import { printFolioReceipt } from '../utils/printFolio';
import { shareReceiptImageToWhatsApp } from '../utils/receiptImageGenerator';

export default function CounterCheckInModal({
  isOpen,
  onClose,
  deskBuilding = 'Main Building',
  currentStaffName = 'Front Desk Receptionist',
  rooms = [],
  onOpenReceipt = null
}) {
  const [codeInput, setCodeInput] = useState('');
  const [searchedBooking, setSearchedBooking] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [isCheckInSuccess, setIsCheckInSuccess] = useState(false);
  const [checkedInRecord, setCheckedInRecord] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [recentPendingBookings, setRecentPendingBookings] = useState([]);

  // Load recent confirmed reservations awaiting check-in
  useEffect(() => {
    if (isOpen) {
      const allBookings = portalStore.getBookings();
      const pending = allBookings
        .filter(b => b.status === 'Confirmed')
        .slice(0, 6);
      setRecentPendingBookings(pending);
      setCodeInput('');
      setSearchedBooking(null);
      setSearchError('');
      setIsCheckInSuccess(false);
      setCheckedInRecord(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Lookup by code or phone
  const handleLookup = (codeToSearch = codeInput) => {
    const query = (codeToSearch || '').trim();
    if (!query) {
      setSearchError('Please enter a booking code or guest phone number.');
      setSearchedBooking(null);
      return;
    }

    setSearchError('');
    const found = portalStore.findBookingByCode(query);

    if (!found) {
      setSearchError(`No reservation found matching "${query}". Please check the code from the customer's phone or email receipt.`);
      setSearchedBooking(null);
      return;
    }

    setSearchedBooking(found);
    setIsCheckInSuccess(found.status === 'Checked In');

    // Auto-select or suggest an available room number
    if (found.roomNumber && found.roomNumber !== 'Unassigned') {
      setSelectedRoomNumber(found.roomNumber);
    } else {
      // Find first available room of matching type in the designated building
      const isExt = found.roomName?.toLowerCase().includes('ext') || found.id?.includes('EXT');
      const targetBldg = isExt ? 'Extension Building' : 'Main Building';
      const available = rooms.find(r => 
        r.status === 'available' && 
        (r.building === targetBldg || (isExt ? String(r.roomNumber).startsWith('1') : String(r.roomNumber).startsWith('6')))
      );
      setSelectedRoomNumber(available ? available.roomNumber : (isExt ? '101' : '601'));
    }
  };

  // Perform Check-In
  const handleConfirmCheckIn = () => {
    if (!searchedBooking) return;
    if (!selectedRoomNumber) {
      setSearchError('Please select a room number to allocate keycard.');
      return;
    }

    try {
      const updated = portalStore.checkInGuestByCode(
        searchedBooking.id,
        selectedRoomNumber,
        currentStaffName
      );
      setCheckedInRecord(updated);
      setIsCheckInSuccess(true);
      setSearchedBooking(updated);
    } catch (err) {
      setSearchError(err.message || 'Check-in failed.');
    }
  };

  // Available rooms for this booking's wing
  const isBookingExtension = searchedBooking && (
    searchedBooking.roomName?.toLowerCase().includes('ext') || 
    searchedBooking.id?.includes('EXT') ||
    String(searchedBooking.roomNumber || '').startsWith('1')
  );
  const bookingWingName = isBookingExtension ? 'Extension Building (100 Wing)' : 'Main Building (600 Wing)';
  const isCrossDesk = deskBuilding !== 'all' && (
    (deskBuilding === 'Main Building' && isBookingExtension) ||
    (deskBuilding === 'Extension Building' && !isBookingExtension)
  );

  const candidateRooms = rooms.filter(r => {
    if (isBookingExtension) {
      return String(r.roomNumber).startsWith('1') || r.building === 'Extension Building';
    }
    return String(r.roomNumber).startsWith('6') || r.building === 'Main Building';
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#14121a] border-2 border-[#d4af37]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#3d0519] via-[#4d0721] to-[#250210]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#f3e5ab]">
              <Key size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#f3e5ab]">
                  Front Desk Counter Check-In
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono font-bold">
                  {deskBuilding === 'all' ? 'All Wings' : deskBuilding}
                </span>
              </div>
              <p className="text-[11px] text-gray-300">
                Confirm guest booking code, verify Paystack payment &amp; issue RFID room keycard
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close check-in modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">

          {/* Quick Search Bar */}
          <div className="p-4 rounded-2xl bg-[#1b050f] border border-[#d4af37]/30 space-y-3">
            <label className="block text-xs uppercase tracking-wider text-[#f3e5ab] font-bold flex items-center gap-1.5">
              <Search size={14} className="text-[#d4af37]" /> Enter Customer Booking Code / Phone
            </label>
            
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    setSearchError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLookup();
                  }}
                  placeholder="e.g. ARS-BGD-7548BD or 08123456789"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white text-sm font-mono tracking-wider focus:border-[#d4af37] focus:outline-none uppercase placeholder:normal-case placeholder:text-gray-500"
                />
              </div>

              <button
                type="button"
                onClick={() => handleLookup()}
                className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #ffe58f 0%, #d4af37 50%, #b8860b 100%)',
                  color: '#000000',
                  fontWeight: '900'
                }}
              >
                <Search size={15} className="stroke-[2.5]" />
                <span>Verify Code</span>
              </button>
            </div>

            {/* Recent Pending Quick Selector */}
            {recentPendingBookings.length > 0 && !searchedBooking && (
              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] text-gray-400 block mb-1.5 font-medium">
                  Quick Select Arriving Online Reservations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recentPendingBookings.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setCodeInput(b.id);
                        handleLookup(b.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="text-[#f3e5ab] font-bold">{b.id}</span>
                      <span className="text-gray-400">({b.guestName})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Error Banner */}
          {searchError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Success Check-In State */}
          {isCheckInSuccess && checkedInRecord && (
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0a2315] to-[#04140b] border-2 border-emerald-400 text-center space-y-4 animate-fadeIn shadow-2xl">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={34} />
              </div>

              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-300 uppercase">
                  COUNTER CHECK-IN COMPLETE
                </span>
                <h4 className="text-xl font-cinzel font-bold text-white mt-1">
                  Guest Checked In to Room #{checkedInRecord.roomNumber}!
                </h4>
                <p className="text-xs text-gray-300 mt-1">
                  Primary Guest: <strong className="text-[#f3e5ab]">{checkedInRecord.guestName}</strong> &bull; Keycard RFID programmed &bull; Room status is now <span className="text-rose-400 font-bold uppercase">Occupied</span>.
                </p>
              </div>

              {/* Wi-Fi & Quick Info */}
              <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 text-xs text-left grid grid-cols-2 gap-2 text-gray-300 font-mono">
                <div>
                  <span className="text-[10px] text-gray-400 block">Wi-Fi Network:</span>
                  <strong className="text-white">Arab_Signature_HighSpeed_Guest</strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Wi-Fi Password:</span>
                  <strong className="text-[#f3e5ab]">ArabSignatureVIP</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => printFolioReceipt(checkedInRecord)}
                  className="py-2.5 px-3 rounded-xl bg-[#3d0519] hover:bg-[#520722] text-[#f3e5ab] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#d4af37]/40 shadow-md"
                >
                  <Printer size={14} />
                  <span>Print Receipt Folio</span>
                </button>

                <button
                  type="button"
                  onClick={() => shareReceiptImageToWhatsApp(checkedInRecord.phone, checkedInRecord)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <MessageSquare size={14} />
                  <span>Send WhatsApp Slip</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Verified Reservation Details (Before Check-In) */}
          {searchedBooking && !isCheckInSuccess && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Header Status Bar */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    VERIFIED RESERVATION RECORD
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    {searchedBooking.paymentStatus === 'Paid' ? 'PAID IN FULL (Paystack)' : 'COUNTER PAYMENT REQUIRED'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                    {searchedBooking.status}
                  </span>
                </div>
              </div>

              {/* Cross-Desk Wing Notice */}
              {isCrossDesk && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
                  <Building2 size={16} className="text-amber-400 shrink-0" />
                  <span>
                    <strong>Cross-Wing Notice:</strong> This suite belongs to <strong>{bookingWingName}</strong>. You may check them in directly from here and issue a {bookingWingName} keycard.
                  </span>
                </div>
              )}

              {/* 2-Column Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* Guest Particulars */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-white/10 pb-1 flex items-center justify-between">
                    <span>Guest Information</span>
                    <User size={12} className="text-[#d4af37]" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Primary Guest:</span>
                    <strong className="text-white text-sm">{searchedBooking.guestName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Phone / WhatsApp:</span>
                    <span className="text-gray-200 font-mono">{searchedBooking.phone || 'N/A'}</span>
                  </div>
                  {searchedBooking.email && (
                    <div>
                      <span className="text-gray-400 text-[10px] block">Email Address:</span>
                      <span className="text-gray-200 font-mono truncate block">{searchedBooking.email}</span>
                    </div>
                  )}
                  {searchedBooking.homeAddress && (
                    <div>
                      <span className="text-gray-400 text-[10px] block">Residential Address:</span>
                      <span className="text-gray-300 text-[11px] truncate block">{searchedBooking.homeAddress}</span>
                    </div>
                  )}
                  {searchedBooking.nextOfKinName && (
                    <div>
                      <span className="text-gray-400 text-[10px] block">Emergency Contact:</span>
                      <span className="text-gray-300 text-[11px]">
                        {searchedBooking.nextOfKinName} ({searchedBooking.nextOfKinPhone})
                      </span>
                    </div>
                  )}
                </div>

                {/* Stay & Billing */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-white/10 pb-1 flex items-center justify-between">
                    <span>Stay &amp; Settlement</span>
                    <Building2 size={12} className="text-[#d4af37]" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Suite Reserved:</span>
                    <strong className="text-[#f3e5ab] text-sm">{searchedBooking.roomName || 'Executive Suite'}</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-400 text-[10px] block">Check-In:</span>
                      <span className="text-white font-medium">{searchedBooking.checkIn}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block">Check-Out:</span>
                      <span className="text-white font-medium">{searchedBooking.checkOut}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-400 text-[10px] block">Duration:</span>
                      <span className="text-white font-medium">{searchedBooking.nights} Night(s)</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block">Total Amount:</span>
                      <strong className="text-emerald-400">₦{Number(searchedBooking.amount || 0).toLocaleString()}</strong>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Payment Reference:</span>
                    <span className="text-gray-300 font-mono text-[10px] truncate block">
                      {searchedBooking.paystackReference || searchedBooking.paymentRef || 'Verified'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Room Keycard Allocation Selector */}
              <div className="p-3.5 rounded-xl bg-[#1b050f] border border-[#d4af37]/40 space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#f3e5ab] font-bold flex items-center justify-between">
                  <span>Allocate Physical Suite Keycard (Room Number)</span>
                  <span className="text-[10px] text-gray-400 font-normal">Wing: {bookingWingName}</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <select
                      value={selectedRoomNumber}
                      onChange={(e) => setSelectedRoomNumber(e.target.value)}
                      className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:border-[#d4af37] focus:outline-none"
                    >
                      <option value="">-- Choose Keycard Suite --</option>
                      {candidateRooms.map(r => (
                        <option key={r.roomNumber} value={r.roomNumber}>
                          Room #{r.roomNumber} - {r.name} ({r.status.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center text-xs text-gray-300 px-2">
                    {selectedRoomNumber ? (
                      <span className="text-emerald-300 flex items-center gap-1 font-mono">
                        <Check size={14} className="text-emerald-400" />
                        Keycard RFID programmed for <strong>Room #{selectedRoomNumber}</strong>
                      </span>
                    ) : (
                      <span className="text-amber-300 text-[11px]">Please select keycard suite number</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Primary Check-In Button */}
              <button
                type="button"
                onClick={handleConfirmCheckIn}
                className="w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all cursor-pointer active:scale-[0.99] hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)',
                  color: '#ffffff',
                  border: '2px solid #a7f3d0',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.45)',
                  fontWeight: '900',
                  letterSpacing: '0.04em'
                }}
              >
                <CheckCircle2 size={18} className="stroke-[2.5]" />
                <span>Confirm Booking Code &amp; Check In Guest</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
