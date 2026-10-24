import React, { useState, useEffect } from 'react';
import { HOTEL_INFO } from '../data/hotelData';
import { portalStore } from '../data/portalStore';
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Key,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Copy,
  Check,
  Clock,
  Wifi,
  Utensils,
  Award,
  Sparkles,
  Building2,
  ExternalLink,
  LogOut,
  Search,
  ArrowRight,
  RefreshCw,
  FileText,
  AlertCircle,
  ChevronRight,
  CreditCard,
  History
} from 'lucide-react';

export default function CustomerDashboardModal({
  isOpen,
  onClose,
  onNavigate,
  onOpenBooking
}) {
  const [bookingCodeInput, setBookingCodeInput] = useState('');
  const [customerProfile, setCustomerProfile] = useState(() => portalStore.getCustomerSession());
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'history' | 'receipt'
  const [receiptStay, setReceiptStay] = useState(null);

  // Sync profile on modal open and subscribe to live changes
  useEffect(() => {
    if (isOpen) {
      const current = portalStore.getCustomerSession();
      setCustomerProfile(current);
      setLoginError('');
      if (current?.primaryBooking) {
        setReceiptStay(current.primaryBooking);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const unsub = portalStore.subscribeCustomerSession((prof) => {
      setCustomerProfile(prof);
      if (prof?.primaryBooking) {
        setReceiptStay(prof.primaryBooking);
      }
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  // Handle Login via Booking Number
  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = portalStore.loginCustomer(bookingCodeInput);
      setIsSubmitting(false);
      if (res.success) {
        setCustomerProfile(res.profile);
        setReceiptStay(res.profile.primaryBooking);
        setBookingCodeInput('');
      } else {
        setLoginError(res.error);
      }
    }, 400);
  };

  const handleQuickLogin = (code) => {
    setBookingCodeInput(code);
    setIsSubmitting(true);
    setLoginError('');
    setTimeout(() => {
      const res = portalStore.loginCustomer(code);
      setIsSubmitting(false);
      if (res.success) {
        setCustomerProfile(res.profile);
        setReceiptStay(res.profile.primaryBooking);
      } else {
        setLoginError(res.error);
      }
    }, 300);
  };

  const handleLogout = () => {
    portalStore.logoutCustomer();
    setCustomerProfile(null);
    setReceiptStay(null);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyWifi = () => {
    navigator.clipboard.writeText('ArabSignatureVIP');
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  const handleWhatsAppConcierge = (stay) => {
    const roomInfo = stay.roomNumber && stay.roomNumber !== 'Unassigned' ? `Room #${stay.roomNumber}` : stay.roomName;
    const text = encodeURIComponent(
      `Hello Arab Signature Hotel Front Desk Concierge, I am ${customerProfile.guestName} (${stay.id}).\n` +
      `Stay: ${roomInfo}\n` +
      `I would like to make an inquiry regarding my folio & stay.`
    );
    window.open(`https://wa.me/${HOTEL_INFO.whatsapp}?text=${text}`, '_blank');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleRebookNow = () => {
    onClose();
    if (onOpenBooking) {
      onOpenBooking(customerProfile?.primaryBooking?.roomType || 'deluxe');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#14121a] border border-[#d4af37]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* Modal Top Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#420317] via-[#5c0725] to-[#250210] border-b border-[#d4af37]/30 flex items-center justify-between text-[#f3e5ab]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab]">
              <Award size={18} />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold flex items-center gap-2">
                <span>Guest Folio & Customer Portal</span>
                {customerProfile && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40 text-[10px] font-mono">
                    {customerProfile.primaryBooking.id}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-gray-300">Arab Signature Hotel & Suites • Direct Guest Services</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {customerProfile && (
              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 text-gray-300 hover:text-rose-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                title="Sign out of current booking code"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Switch Code</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close Modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: LOGIN WITH BOOKING NUMBER                              */}
        {/* ============================================================== */}
        {!customerProfile ? (
          <div className="p-6 overflow-y-auto space-y-5">
            <div className="text-center space-y-2 py-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#5c0725]/40 border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#f3e5ab] shadow-lg shadow-[#d4af37]/10">
                <Key size={26} className="text-[#d4af37]" />
              </div>
              <h4 className="font-cinzel text-xl font-bold text-white">Access Your Guest Dashboard</h4>
              <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                Log in with the official booking code issued upon reservation (e.g. <strong className="text-[#f3e5ab] font-mono">ASH-9421</strong>). You can access your room folio, Wi-Fi credentials, settled invoice records, and returning customer history anytime—even after checkout.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-3.5">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 text-left">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 mb-1.5 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key size={13} className="text-[#d4af37]" /> Official Booking Code
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">Format: ASH-XXXX</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={bookingCodeInput}
                    onChange={(e) => setBookingCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. ASH-9421"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-base uppercase tracking-wider focus:border-[#d4af37] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setBookingCodeInput('ASH-9421')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] px-2 py-1 rounded bg-[#d4af37]/20 text-[#f3e5ab] hover:bg-[#d4af37]/30 border border-[#d4af37]/30 transition-all font-mono"
                  >
                    Use Sample
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !bookingCodeInput.trim()}
                className="w-full py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all cursor-pointer hover:brightness-105 active:scale-[0.99] disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #ffe58f 0%, #d4af37 50%, #b8860b 100%)',
                  color: '#000000',
                  border: '2px solid #fff4cc',
                  boxShadow: '0 6px 24px rgba(212, 175, 55, 0.45)',
                  fontWeight: '900',
                  letterSpacing: '0.04em'
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 text-black">
                    <RefreshCw size={15} className="animate-spin" /> Verifying Reservation...
                  </span>
                ) : (
                  <>
                    <span>Enter Guest Dashboard</span>
                    <ArrowRight size={17} className="text-black stroke-[3]" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Test Badges */}
            <div className="max-w-md mx-auto pt-2 border-t border-white/10 space-y-2">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold text-center">
                Demo Booking Codes Available For Testing
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('ASH-9421')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <strong className="text-[#f3e5ab] font-mono block">ASH-9421</strong>
                    <span className="text-[11px] text-gray-400">Chief Emeka (Diplomatic Suite)</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Active</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('ASH-1840')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <strong className="text-[#f3e5ab] font-mono block">ASH-1840</strong>
                    <span className="text-[11px] text-gray-400">Chief Emeka (Past Stay)</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-sky-500/20 text-sky-300 border border-sky-500/40">Bill Cleared</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('ASH-7812')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <strong className="text-[#f3e5ab] font-mono block">ASH-7812</strong>
                    <span className="text-[11px] text-gray-400">Alhaji Ibrahim Musa</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40">Confirmed</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('ASH-6204')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <strong className="text-[#f3e5ab] font-mono block">ASH-6204</strong>
                    <span className="text-[11px] text-gray-400">Senator Chuka Nwosu</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Active</span>
                </button>
              </div>
            </div>

            {/* Help Note */}
            <div className="text-center text-[11px] text-gray-400 pt-1">
              Need assistance? WhatsApp Front Desk Concierge: <strong className="text-[#d4af37] font-mono">+234 812 578 6875</strong>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* VIEW 2: AUTHENTICATED CUSTOMER DASHBOARD & HISTORY TRACKER      */
          /* ============================================================== */
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">

            {/* 1. Customer Loyalty & Identity Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2a0616] via-[#1a040d] to-[#120208] border border-[#d4af37]/40 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-cinzel text-lg font-bold text-white">
                      {customerProfile.guestName}
                    </h4>
                    {customerProfile.isReturningGuest && (
                      <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/30 to-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-bold flex items-center gap-1 font-mono">
                        <Sparkles size={11} className="text-[#d4af37]" />
                        RETURNING VIP GUEST
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-3 mt-1 flex-wrap font-mono">
                    <span className="flex items-center gap-1">
                      <Phone size={12} className="text-[#d4af37]" /> {customerProfile.phone}
                    </span>
                    {customerProfile.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-[#d4af37]" /> {customerProfile.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* VIP Tier Badge */}
                <div className="sm:text-right">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border inline-block ${customerProfile.vipBadgeClass}`}>
                    👑 {customerProfile.vipTier}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-1">
                    {customerProfile.totalStays} {customerProfile.totalStays === 1 ? 'Stay Recorded' : 'Lifetime Stays'}
                  </span>
                </div>
              </div>

              {/* 3 Loyalty Stats */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Total Stays</span>
                  <strong className="text-sm font-bold text-[#f3e5ab] font-mono">{customerProfile.totalStays}</strong>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Nights Enjoyed</span>
                  <strong className="text-sm font-bold text-white font-mono">{customerProfile.totalNights}</strong>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Total Folio Billed</span>
                  <strong className="text-sm font-bold text-emerald-400 font-mono">₦{customerProfile.totalSpent.toLocaleString()}</strong>
                </div>
              </div>

              {/* VIP Privilege Courtesy Note */}
              <div className="text-[11px] text-gray-300 bg-white/5 p-2 rounded-xl border border-white/10 flex items-center gap-2">
                <Award size={14} className="text-[#d4af37] shrink-0" />
                <span><strong>Perk:</strong> {customerProfile.vipPrivilege}</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 text-xs font-semibold gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('current')}
                className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'current'
                    ? 'bg-[#5c0725]/50 text-[#f3e5ab] border-b-2 border-[#d4af37]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Key size={14} />
                <span>Primary Stay & Folio</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-black/40 text-gray-300">
                  {customerProfile.primaryBooking.id}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-[#5c0725]/50 text-[#f3e5ab] border-b-2 border-[#d4af37]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <History size={14} />
                <span>Lifetime Stays & Invoices</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#d4af37]/20 text-[#f3e5ab]">
                  {customerProfile.totalStays}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('receipt')}
                className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'receipt'
                    ? 'bg-[#5c0725]/50 text-[#f3e5ab] border-b-2 border-[#d4af37]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText size={14} />
                <span>Digital Folio Receipt</span>
              </button>
            </div>

            {/* TAB 1: CURRENT / PRIMARY STAY & ROOM DETAILS */}
            {activeTab === 'current' && (
              <div className="space-y-3.5 animate-fadeIn">
                
                {/* Stay Status Alert */}
                {customerProfile.isPrimaryCleared ? (
                  <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/40 text-sky-200 text-xs flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">
                        Bill Cleared & Checked Out (Settled in Full)
                      </strong>
                      <span>
                        The stay for reservation <span className="font-mono text-white font-bold">{customerProfile.primaryBooking.id}</span> has been finalized and cleared by Front Desk. Your official digital receipt remains accessible below, and you are welcome to re-book anytime with VIP privileges.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">
                        {customerProfile.primaryBooking.status === 'Checked In' ? 'Active Stay In Progress' : 'Confirmed Reservation'}
                      </strong>
                      <span>
                        Room #{customerProfile.primaryBooking.roomNumber || 'Auto-Reserved'} is allocated to you. All direct booking amenities (Free Morning Buffet & Cabana Access) are active.
                      </span>
                    </div>
                  </div>
                )}

                {/* Suite Folio Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1b0812] to-[#120208] border border-[#d4af37]/30 space-y-3">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Allocated Suite</span>
                      <div className="text-xl font-cinzel font-bold text-white mt-0.5 flex items-center gap-2">
                        <span>Room #{customerProfile.primaryBooking.roomNumber || 'Auto-Reserved'}</span>
                        <span className="text-xs font-sans text-[#f3e5ab] font-normal">({customerProfile.primaryBooking.roomName})</span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Building2 size={13} className="text-[#d4af37]" />
                        <span>{customerProfile.primaryBooking.roomType === 'suites' ? 'Extension Building (100 Wing)' : 'Main Building (600 Wing)'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Booking Code</span>
                      <div className="font-mono text-lg font-bold text-[#f3e5ab] flex items-center gap-1.5 justify-end">
                        <span>{customerProfile.primaryBooking.id}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(customerProfile.primaryBooking.id, 'code')}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-300"
                          title="Copy booking code"
                        >
                          {copiedCode === 'code' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Grid */}
                  <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px] block uppercase">Check-In</span>
                      <strong className="text-white font-mono">{customerProfile.primaryBooking.checkIn}</strong>
                      <span className="text-[10px] text-[#d4af37] block">2:00 PM</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block uppercase">Check-Out</span>
                      <strong className="text-white font-mono">{customerProfile.primaryBooking.checkOut || 'Open'}</strong>
                      <span className="text-[10px] text-[#d4af37] block">12:00 PM</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block uppercase">Stay Length</span>
                      <strong className="text-white">{customerProfile.primaryBooking.nights} {customerProfile.primaryBooking.nights === 1 ? 'Night' : 'Nights'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block uppercase">Billed Total</span>
                      <strong className="text-emerald-400 font-mono">₦{customerProfile.primaryBooking.amount?.toLocaleString()}</strong>
                      <span className="text-[10px] text-gray-400 block">{customerProfile.primaryBooking.paymentMethod}</span>
                    </div>
                  </div>

                  {/* High-Speed Wi-Fi Card (if active) */}
                  {!customerProfile.isPrimaryCleared && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                          <Wifi size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">High-Speed VIP Wi-Fi</span>
                          <strong className="text-white font-mono">Arab_Signature_HighSpeed_Guest</strong>
                          <span className="text-gray-400 text-[11px] block font-mono">Password: <code className="text-[#f3e5ab]">ArabSignatureVIP</code></span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyWifi}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        {copiedWifi ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedWifi ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Action Tools */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleWhatsAppConcierge(customerProfile.primaryBooking)}
                    className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Phone size={15} /> WhatsApp Front Desk Concierge
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate('dining');
                    }}
                    className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
                  >
                    <Utensils size={15} className="text-[#d4af37]" /> Order Room Dining & Bar
                  </button>
                </div>

                {/* VIP Re-book Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-[#d4af37]/15 to-transparent border border-[#d4af37]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <strong className="text-white block font-cinzel text-sm">Planning Your Next Stay in Onitsha?</strong>
                    <span className="text-xs text-gray-300">Enjoy seamless 1-click VIP booking with your saved preferences.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRebookNow}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105 shadow-lg shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #ffe58f 0%, #d4af37 50%, #b8860b 100%)',
                      color: '#000000',
                      border: '1px solid #fff4cc',
                      fontWeight: '900'
                    }}
                  >
                    <span>Book Next Stay</span>
                    <ArrowRight size={14} className="stroke-[3]" />
                  </button>
                </div>

              </div>
            )}

            {/* TAB 2: LIFETIME STAYS & BILL SETTLEMENT HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Showing all <strong className="text-[#f3e5ab]">{customerProfile.totalStays}</strong> reservations associated with <strong className="text-white">{customerProfile.phone}</strong>:
                  </span>
                  <span className="text-[11px] text-[#d4af37] font-semibold">
                    Total Lifetime Spend: ₦{customerProfile.totalSpent.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {customerProfile.allStays.map((stay, idx) => {
                    const isCleared = ['Completed', 'Checked Out', 'Bill Cleared', 'Settled'].includes(stay.status);
                    const isActive = ['Checked In', 'Confirmed'].includes(stay.status);

                    return (
                      <div
                        key={stay.id || idx}
                        className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-[#f3e5ab]">
                              {stay.id}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isCleared 
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' 
                                : isActive 
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                : 'bg-gray-500/20 text-gray-300 border-gray-500/40'
                            }`}>
                              {isCleared ? 'Bill Cleared & Checked Out' : stay.status}
                            </span>
                          </div>

                          <div className="text-xs text-white font-medium">
                            {stay.roomName} {stay.roomNumber && `• Room #${stay.roomNumber}`}
                          </div>

                          <div className="text-[11px] text-gray-400 flex items-center gap-3 font-mono">
                            <span>Check-In: {stay.checkIn}</span>
                            <span>•</span>
                            <span>Check-Out: {stay.checkOut || 'N/A'}</span>
                            <span>•</span>
                            <span>{stay.nights} {stay.nights === 1 ? 'Night' : 'Nights'}</span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
                          <div>
                            <span className="text-[10px] text-gray-400 block uppercase sm:text-right">Total Paid</span>
                            <div className="text-sm font-bold font-mono text-emerald-400 sm:text-right">
                              ₦{stay.amount?.toLocaleString()}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setReceiptStay(stay);
                              setActiveTab('receipt');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold flex items-center gap-1 border border-[#d4af37]/30 transition-colors"
                          >
                            <FileText size={12} /> View Folio
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: DIGITAL FOLIO RECEIPT */}
            {activeTab === 'receipt' && receiptStay && (
              <div className="space-y-3.5 animate-fadeIn">
                
                {/* Folio Document */}
                <div id="guest-printable-folio" className="p-5 rounded-2xl bg-gradient-to-b from-[#1b0812] to-black border-2 border-[#d4af37]/40 shadow-2xl space-y-4 text-xs">
                  
                  {/* Folio Letterhead */}
                  <div className="flex justify-between items-start border-b border-white/15 pb-4">
                    <div>
                      <div className="font-cinzel text-base sm:text-lg font-bold text-[#f3e5ab] tracking-wider">
                        ARAB SIGNATURE HOTEL & SUITES
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        Official Guest Folio & Settlement Statement
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        Nsugbe / Onitsha, Anambra State, Nigeria • Tel: {HOTEL_INFO.phone}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Folio Number</span>
                      <strong className="text-sm font-mono text-[#f3e5ab]">{receiptStay.id}</strong>
                      <span className="text-[10px] text-gray-400 block font-mono">Issued: {receiptStay.createdAt || receiptStay.checkIn}</span>
                    </div>
                  </div>

                  {/* Guest & Stay Meta */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-white/10 pb-3 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Guest Name</span>
                      <strong className="text-white block truncate">{customerProfile.guestName}</strong>
                      <span className="text-[10px] text-gray-400 font-mono">{customerProfile.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Accommodations</span>
                      <strong className="text-[#f3e5ab] block truncate">{receiptStay.roomName}</strong>
                      <span className="text-[10px] text-gray-400 font-mono">Room #{receiptStay.roomNumber || 'Auto-Reserved'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Stay Period</span>
                      <strong className="text-white block font-mono">{receiptStay.checkIn} to {receiptStay.checkOut || 'N/A'}</strong>
                      <span className="text-[10px] text-[#d4af37]">{receiptStay.nights} {receiptStay.nights === 1 ? 'Night' : 'Nights'} Duration</span>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] text-gray-400 uppercase tracking-wider font-semibold border-b border-white/10 pb-1">
                      <span>Description</span>
                      <span className="text-right">Amount (NGN)</span>
                    </div>

                    <div className="flex justify-between py-1 text-white">
                      <span>{receiptStay.roomName} ({receiptStay.nights} Nights Stay)</span>
                      <span className="font-mono">₦{receiptStay.amount?.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between py-1 text-gray-400 text-[11px]">
                      <span>Complimentary Morning Buffet & VIP Poolside Cabana</span>
                      <span className="font-mono text-emerald-400">₦0.00 (Free)</span>
                    </div>

                    <div className="flex justify-between py-1 text-gray-400 text-[11px]">
                      <span>High-Speed Wi-Fi & 24/7 Security</span>
                      <span className="font-mono text-emerald-400">₦0.00 (Free)</span>
                    </div>
                  </div>

                  {/* Settlement Total */}
                  <div className="pt-3 border-t-2 border-[#d4af37]/40 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>Payment Method:</span>
                      <span className="text-white font-medium">{receiptStay.paymentMethod}</span>
                    </div>
                    {receiptStay.paystackReference && (
                      <div className="flex justify-between text-[11px] text-gray-400">
                        <span>Paystack Reference:</span>
                        <span className="font-mono text-emerald-400">{receiptStay.paystackReference}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold pt-1 border-t border-white/10">
                      <span className="text-white">Total Amount Paid:</span>
                      <span className="text-emerald-400 font-mono">₦{receiptStay.amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-[#f3e5ab]">
                      <span>Outstanding Balance Due:</span>
                      <span className="font-mono text-emerald-300">₦0.00 (SETTLED)</span>
                    </div>
                  </div>

                  {/* Footer Stamp */}
                  <div className="pt-2 text-center text-[10px] text-gray-400 border-t border-white/10 flex items-center justify-between">
                    <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                      <ShieldCheck size={14} /> Official Verified Hotel Folio
                    </span>
                    <span>Thank you for choosing Arab Signature Hotel.</span>
                  </div>
                </div>

                {/* Print Button */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white text-xs font-semibold"
                  >
                    ← Back to History
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all cursor-pointer"
                  >
                    <Printer size={15} /> Print / Save PDF Folio Receipt
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
