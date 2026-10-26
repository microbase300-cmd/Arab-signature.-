import React, { useState } from 'react';
import { HOTEL_INFO } from '../data/hotelData';
import { portalStore } from '../data/portalStore';
import { 
  X, Key, Wifi, Phone, ShieldCheck, Printer, Calendar, Clock, 
  MapPin, Check, Copy, Utensils, LogOut, Sparkles, Building2
} from 'lucide-react';

export default function GuestSessionPassModal({ isOpen, onClose, onNavigate }) {
  const [session, setSession] = useState(() => portalStore.getGuestSession());
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setSession(portalStore.getGuestSession());
    }
  }, [isOpen]);

  if (!isOpen || !session) return null;

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(session.wifiAccess?.code || 'ArabSignatureVIP');
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(session.bookingId || '');
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleWhatsAppDesk = () => {
    const text = encodeURIComponent(
      `Hello Arab Signature Front Desk Concierge, I am currently in Room #${session.roomNumber} (${session.guestName}).\nBooking Code: ${session.bookingId}.\nI would like to make an inquiry.`
    );
    window.open(`https://wa.me/${HOTEL_INFO.whatsapp}?text=${text}`, '_blank');
  };

  const handleEndSession = () => {
    if (window.confirm("End this active guest session on your browser? You can always access your booking using your official booking code.")) {
      portalStore.clearGuestSession();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#14121a] border border-[#d4af37]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#420317] via-[#5c0725] to-[#250210] border-b border-[#d4af37]/30 flex items-center justify-between text-[#f3e5ab]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab]">
              <Key size={18} />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold">
                Guest Stay Pass & Suite Folio
              </h3>
              <p className="text-[11px] text-gray-300">Arab Signature Hotel & Suites</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Active Session Status Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1b0812] to-[#2a0616] border border-[#d4af37]/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE GUEST SESSION
              </span>
              <span className="font-mono text-[10px] text-gray-400">
                {session.sessionId}
              </span>
            </div>

            <div className="flex items-start justify-between border-t border-white/10 pt-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Assigned Suite</span>
                <div className="text-base font-bold text-white font-cinzel mt-0.5">
                  Room #{session.roomNumber}
                </div>
                <div className="text-xs text-[#f3e5ab] font-medium">{session.roomName}</div>
                <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <Building2 size={12} className="text-[#d4af37]" />
                  <span>{session.buildingLabel || 'Main Building (600 Wing)'}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Booking Ref</span>
                <div className="text-xs font-mono font-bold text-[#d4af37] flex items-center gap-1 justify-end mt-0.5">
                  <span>{session.bookingId}</span>
                  <button 
                    onClick={handleCopyBookingId}
                    className="p-1 hover:text-white text-gray-400"
                    title="Copy Booking ID"
                  >
                    {copiedRef ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 inline-block mt-1">
                  Paid via Paystack
                </span>
              </div>
            </div>

            {/* Dates & Guest */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px]">
              <div>
                <span className="text-gray-400 block text-[10px]">Registered Guest:</span>
                <strong className="text-white">{session.guestName}</strong>
                <div className="text-gray-400 text-[10px] font-mono">{session.phone}</div>
                {session.homeAddress && (
                  <div className="text-gray-300 text-[10px] truncate mt-0.5" title={session.homeAddress}>
                    Addr: {session.homeAddress}
                  </div>
                )}
                {session.nextOfKinName && (
                  <div className="text-amber-300/80 text-[10px] truncate" title={`${session.nextOfKinName} (${session.nextOfKinPhone})`}>
                    Kin: {session.nextOfKinName} ({session.nextOfKinPhone})
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="text-gray-400 block text-[10px]">
                  {session.bookingMode === 'Reservation Hold' ? 'Reservation Hold:' : 'Stay Schedule:'}
                </span>
                <strong className="text-[#f3e5ab]">
                  {session.bookingMode === 'Reservation Hold' && session.reservationDate
                    ? `Res: ${session.reservationDate}`
                    : `${session.checkIn} → ${session.checkOut}`}
                </strong>
                <div className="text-gray-400 text-[10px]">{session.nights} {session.nights === 1 ? 'Night' : 'Nights'} Duration</div>
                {session.proofOfPayment && (
                  <div className="text-gray-300 font-mono text-[9px] truncate" title={session.proofOfPayment}>
                    Proof: {session.proofOfPayment}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hotel Amenity Access: Wi-Fi Credentials */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <Wifi size={16} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Complimentary High-Speed Wi-Fi</span>
                <div className="text-xs text-white font-mono font-bold">
                  Network: {session.wifiAccess?.network || 'Arab_Signature_HighSpeed_Guest'}
                </div>
                <div className="text-xs text-[#f3e5ab] font-mono">
                  Password: <strong className="text-white">{session.wifiAccess?.code || 'ArabSignatureVIP'}</strong>
                </div>
              </div>
            </div>
            <button
              onClick={handleCopyWifi}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] flex items-center gap-1 transition-all"
            >
              {copiedWifi ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedWifi ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Quick Service Dispatch Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleWhatsAppDesk}
              className="py-3 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Phone size={14} />
              <span>Front Desk Concierge</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onNavigate) onNavigate('dining');
              }}
              className="py-3 px-3 rounded-xl bg-[#5c0725]/60 hover:bg-[#5c0725] border border-[#d4af37]/40 text-[#f3e5ab] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Utensils size={14} />
              <span>Room Dining Order</span>
            </button>
          </div>

          {/* Print Folio & End Session */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-gray-400 text-[11px]">
            <button
              onClick={() => window.print()}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Printer size={13} />
              <span>Print Folio Receipt</span>
            </button>

            <button
              onClick={handleEndSession}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <LogOut size={13} />
              <span>Exit Guest Session</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
