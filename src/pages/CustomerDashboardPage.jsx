import React, { useState, useEffect } from 'react';
import { HOTEL_INFO } from '../data/hotelData';
import { portalStore } from '../data/portalStore';
import {
  Key,
  User,
  Phone,
  Mail,
  Calendar,
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
  ArrowLeft,
  RefreshCw,
  FileText,
  AlertCircle,
  History,
  Home,
  Crown,
  Star,
  Receipt,
  Bed,
  Compass,
  CheckCheck
} from 'lucide-react';

export default function CustomerDashboardPage({ onNavigate, onOpenBooking }) {
  const [bookingCodeInput, setBookingCodeInput] = useState('');
  const [customerProfile, setCustomerProfile] = useState(() => portalStore.getCustomerSession());
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cinematic VIP Welcome Intro states
  const [showVipIntro, setShowVipIntro] = useState(false);
  const [introGuestName, setIntroGuestName] = useState('');
  const [introTypedChars, setIntroTypedChars] = useState(0);
  const [introStage, setIntroStage] = useState('typing'); // 'typing' | 'shimmer' | 'fading'
  const [introExiting, setIntroExiting] = useState(false);

  // Dashboard states
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'history' | 'receipt'
  const [receiptStay, setReceiptStay] = useState(null);

  // Sync profile on mount and subscribe to live changes
  useEffect(() => {
    const current = portalStore.getCustomerSession();
    setCustomerProfile(current);
    if (current?.primaryBooking) {
      setReceiptStay(current.primaryBooking);
    }
  }, []);

  useEffect(() => {
    const unsub = portalStore.subscribeCustomerSession((prof) => {
      setCustomerProfile(prof);
      if (prof?.primaryBooking) {
        setReceiptStay(prof.primaryBooking);
      }
    });
    return unsub;
  }, []);

  // -------------------------------------------------------------
  // CINEMATIC VIP WELCOME INTRO ANIMATION
  // -------------------------------------------------------------
  const fullIntroGreeting = introGuestName ? `Welcome, ${introGuestName}` : 'Welcome, Honored Guest';

  useEffect(() => {
    if (!showVipIntro) return;

    if (introStage === 'typing') {
      if (introTypedChars < fullIntroGreeting.length) {
        const timeout = setTimeout(() => {
          setIntroTypedChars((prev) => prev + 1);
        }, 45);
        return () => clearTimeout(timeout);
      } else {
        const hold = setTimeout(() => {
          setIntroStage('shimmer');
        }, 400);
        return () => clearTimeout(hold);
      }
    } else if (introStage === 'shimmer') {
      const timer = setTimeout(() => {
        setIntroStage('fading');
      }, 1100);
      return () => clearTimeout(timer);
    } else if (introStage === 'fading') {
      const exitTimer = setTimeout(() => {
        setIntroExiting(true);
        setTimeout(() => {
          setShowVipIntro(false);
          setIntroExiting(false);
          setIntroStage('typing');
          setIntroTypedChars(0);
        }, 600);
      }, 700);
      return () => clearTimeout(exitTimer);
    }
  }, [showVipIntro, introStage, introTypedChars, fullIntroGreeting]);

  const handleSkipIntro = () => {
    setIntroExiting(true);
    setTimeout(() => {
      setShowVipIntro(false);
      setIntroExiting(false);
      setIntroStage('typing');
      setIntroTypedChars(0);
    }, 250);
  };

  // -------------------------------------------------------------
  // LOGIN LOGIC WITH BOOKING NUMBER
  // -------------------------------------------------------------
  const executeLogin = (code) => {
    setLoginError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = portalStore.loginCustomer(code);
      setIsSubmitting(false);

      if (res.success) {
        setCustomerProfile(res.profile);
        setReceiptStay(res.profile.primaryBooking);
        setBookingCodeInput('');
        
        // Launch the personalized VIP Welcome Intro
        setIntroGuestName(res.profile.guestName);
        setIntroTypedChars(0);
        setIntroStage('typing');
        setIntroExiting(false);
        setShowVipIntro(true);
      } else {
        setLoginError(res.error);
      }
    }, 350);
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    executeLogin(bookingCodeInput);
  };

  const handleQuickLogin = (code) => {
    setBookingCodeInput(code);
    executeLogin(code);
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
      `Hello Arab Signature Hotel Concierge Desk, I am ${customerProfile.guestName} (${stay.id}).\n` +
      `Stay: ${roomInfo}\n` +
      `I would like to make an inquiry regarding my suite folio.`
    );
    window.open(`https://wa.me/${HOTEL_INFO.whatsapp}?text=${text}`, '_blank');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleRebookNow = () => {
    if (onOpenBooking) {
      onOpenBooking(customerProfile?.primaryBooking?.roomType || 'deluxe');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0206] text-gray-100 font-sans selection:bg-[#d4af37] selection:text-black pb-24">
      
      {/* ============================================================== */}
      {/* 0. CINEMATIC VIP WELCOME INTRO OVERLAY                         */}
      {/* ============================================================== */}
      {showVipIntro && (
        <div
          onClick={handleSkipIntro}
          className={`fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#090105] text-white p-6 cursor-pointer select-none transition-opacity duration-700 ${
            introExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Deep Royal Velvet Ambient Halo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4a031a_0%,_#20030d_50%,_#090105_100%)] opacity-95 pointer-events-none" />
          
          {/* Floating Stardust Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-[#d4af37] opacity-60 animate-ping duration-[3000ms]" />
            <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-[#f3e5ab] opacity-70 animate-pulse duration-[2500ms]" />
            <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-[#d4af37] opacity-50 animate-bounce duration-[4000ms]" />
            <div className="absolute bottom-1/4 right-1/5 w-1 h-1 rounded-full bg-[#f3e5ab] opacity-60 animate-ping duration-[3500ms]" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center space-y-6">
            
            {/* Crown with Radiant Golden Halo */}
            <div className="relative inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-b from-[#5c0725]/80 to-[#2a0210]/90 border border-[#d4af37]/60 shadow-[0_0_50px_rgba(212,175,55,0.4)] backdrop-blur-xl">
              <Sparkles size={16} className="absolute -top-1 -right-1 text-[#f3e5ab] animate-spin duration-[7000ms]" />
              <Star size={12} className="absolute -bottom-1 -left-1 text-[#d4af37] animate-pulse duration-[2000ms]" />
              <Crown size={40} className="text-[#d4af37] drop-shadow-[0_2px_12px_rgba(212,175,55,0.7)] animate-pulse" />
            </div>

            {/* Expanding Fine Gold Line (Top Flourish) */}
            <div className="w-36 sm:w-56 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/80 to-transparent transition-all duration-700" />

            {/* Typewriter Text: Welcome, {User Name} */}
            <div className="min-h-[70px] sm:min-h-[85px] flex items-center justify-center px-4">
              {introStage === 'typing' && (
                <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.08em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ffe58f] via-[#d4af37] to-[#aa820a] drop-shadow-[0_4px_20px_rgba(212,175,55,0.45)] leading-tight">
                  {fullIntroGreeting.slice(0, introTypedChars)}
                  <span className="inline-block w-1 h-7 sm:h-9 ml-1 bg-[#d4af37] animate-pulse shadow-[0_0_10px_#d4af37] align-middle" />
                </h1>
              )}

              {(introStage === 'shimmer' || introStage === 'fading') && (
                <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.08em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ffe58f] via-[#d4af37] to-[#aa820a] drop-shadow-[0_4px_25px_rgba(212,175,55,0.55)] leading-tight">
                  {fullIntroGreeting}
                </h1>
              )}
            </div>

            {/* Expanding Fine Gold Line (Bottom Flourish) */}
            <div className="w-36 sm:w-56 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/80 to-transparent transition-all duration-700" />

            {/* Subtitle Pill & Suite Details */}
            <div className="flex flex-col items-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-mono tracking-widest shadow-lg">
                <span>ARAB SIGNATURE VIP GUEST FOLIO</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 font-serif italic">
                Your personal luxury suite records and privileges are ready.
              </p>
            </div>
          </div>

          {/* Discreet Skip Button */}
          <button
            onClick={handleSkipIntro}
            className="absolute bottom-8 right-8 z-20 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-gray-300 hover:text-[#f3e5ab] text-xs font-mono tracking-wider transition-all"
          >
            Skip &rarr;
          </button>
        </div>
      )}

      {/* Top Breadcrumb Navigation */}
      <div className="bg-[#14020a] border-b border-[#d4af37]/20 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#f3e5ab] flex items-center gap-1 transition-colors"
            >
              <Home size={14} />
              <span>Arab Signature Hotel</span>
            </button>
            <span className="text-gray-600">/</span>
            <span className="text-[#f3e5ab] font-medium tracking-wide">Guest Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Website</span>
            </button>

            {customerProfile && (
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-300 flex items-center gap-1 border border-white/10 transition-colors"
                title="Switch to another booking code"
              >
                <LogOut size={12} />
                <span>Switch Code</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: LUXURY LOGIN GATE (WHEN NOT LOGGED IN)                */}
      {/* ============================================================== */}
      {!customerProfile ? (
        <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 space-y-8 animate-fadeIn">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37]/30 to-[#5c0725]/50 border border-[#d4af37]/50 flex items-center justify-center mx-auto text-[#f3e5ab] shadow-[0_0_35px_rgba(212,175,55,0.25)]">
              <Key size={30} className="text-[#d4af37]" />
            </div>
            <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#f3e5ab] tracking-wider">
              Guest Stay Portal
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              Enter your official reservation booking number to access your room details, Wi-Fi credentials, settled invoice folios, and returning customer stay history.
            </p>
          </div>

          {/* Login Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#16030c] border border-[#d4af37]/40 shadow-2xl space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-300 mb-2 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key size={14} className="text-[#d4af37]" /> Booking Number
                  </span>
                  <span className="text-[11px] text-gray-400 font-normal">Format: ARS-BGD-XXXXX or ARS-EXT-XXXXX</span>
                </label>
                
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={bookingCodeInput}
                    onChange={(e) => setBookingCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. ARS-EXT-9421 or ARS-BGD-7812"
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-4 py-3.5 text-white font-mono text-base uppercase tracking-wider focus:border-[#d4af37] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setBookingCodeInput('ARS-EXT-9421')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] px-2.5 py-1.5 rounded-lg bg-[#d4af37]/20 text-[#f3e5ab] hover:bg-[#d4af37]/30 border border-[#d4af37]/30 transition-all font-mono"
                  >
                    Sample Code
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !bookingCodeInput.trim()}
                className="w-full py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all cursor-pointer hover:brightness-105 active:scale-[0.99] disabled:opacity-50"
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
                    <RefreshCw size={16} className="animate-spin" /> Verifying Reservation...
                  </span>
                ) : (
                  <>
                    <span>Enter Guest Portal</span>
                    <ArrowRight size={18} className="text-black stroke-[3]" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Test Codes */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="text-[11px] text-gray-400 uppercase tracking-widest block font-bold">
                Demo Reservation Codes For Instant Testing:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('ARS-EXT-9421')}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <strong className="text-[#f3e5ab] font-mono block">ARS-EXT-9421</strong>
                    <span className="text-[11px] text-gray-400">Chief Emeka Obi (Diplomatic Suite)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Active</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('ARS-BGD-1840')}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <strong className="text-[#f3e5ab] font-mono block">ARS-BGD-1840</strong>
                    <span className="text-[11px] text-gray-400">Chief Emeka Obi (Past Stay)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/40">Bill Cleared</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('ARS-BGD-7812')}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <strong className="text-[#f3e5ab] font-mono block">ARS-BGD-7812</strong>
                    <span className="text-[11px] text-gray-400">Alhaji Ibrahim Musa</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">Confirmed</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('ARS-BGD-6204')}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <strong className="text-[#f3e5ab] font-mono block">ARS-BGD-6204</strong>
                    <span className="text-[11px] text-gray-400">Senator Chuka Nwosu</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Active</span>
                </button>
              </div>
            </div>

            {/* Assistance Note */}
            <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/10">
              Need assistance? WhatsApp Front Desk Concierge: <strong className="text-[#d4af37] font-mono">+234 812 578 6875</strong>
            </div>
          </div>

        </div>
      ) : (
        /* ============================================================== */
        /* VIEW 2: REDESIGNED 5-STAR LUXURY GUEST DASHBOARD               */
        /* ============================================================== */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
          
          {/* 1. VIP Executive Monogram Header & Folio Keycard */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2c0412] via-[#1a020a] to-[#120108] border border-[#d4af37]/45 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Left Identity & Monogram */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#aa820a] to-[#5c0725] p-[2px] shadow-xl shrink-0">
                  <div className="w-full h-full rounded-2xl bg-[#14020a] flex items-center justify-center text-[#f3e5ab] font-cinzel font-bold text-xl sm:text-2xl">
                    AS
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] font-bold">
                      Arab Signature VIP Folio
                    </span>
                    {customerProfile.isReturningGuest && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-bold font-mono flex items-center gap-1">
                        <Sparkles size={10} className="text-[#d4af37]" />
                        RETURNING VIP PATRON
                      </span>
                    )}
                  </div>

                  <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                    {customerProfile.guestName}
                  </h1>

                  <div className="text-xs text-gray-300 flex items-center gap-3 flex-wrap font-mono pt-0.5">
                    <span className="flex items-center gap-1">
                      <Phone size={12} className="text-[#d4af37]" /> {customerProfile.phone}
                    </span>
                    {customerProfile.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-[#d4af37]" /> {customerProfile.email}
                      </span>
                    )}
                    <span>•</span>
                    <span className="text-[#f3e5ab]">Code: <strong className="font-bold">{customerProfile.primaryBooking.id}</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Keycard Badge & Rebook Button */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-[#d4af37]/30 text-right">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-medium">Patron Status</span>
                  <span className={`text-xs sm:text-sm font-bold block ${customerProfile.vipBadgeClass}`}>
                    👑 {customerProfile.vipTier}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleRebookNow}
                  className="px-5 py-3 rounded-2xl text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:brightness-105 shadow-xl transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #ffe58f 0%, #d4af37 50%, #b8860b 100%)',
                    color: '#000000',
                    border: '1px solid #fff4cc',
                    fontWeight: '900'
                  }}
                >
                  <Sparkles size={14} className="text-black" />
                  <span>Book Next Stay</span>
                </button>
              </div>

            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-0.5">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Lifetime Stays</span>
                <div className="text-xl font-extrabold text-[#f3e5ab] font-mono">{customerProfile.totalStays} Completed Stays</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-0.5">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Nights Enjoyed</span>
                <div className="text-xl font-extrabold text-white font-mono">{customerProfile.totalNights} Luxury Nights</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-0.5">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Total Invoiced & Settled</span>
                <div className="text-xl font-extrabold text-emerald-400 font-mono">₦{customerProfile.totalSpent.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 2. Navigation Tabs */}
          <div className="flex border-b border-white/15 text-xs sm:text-sm font-semibold gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-3 rounded-t-2xl transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-[#420317] text-[#f3e5ab] border-b-2 border-[#d4af37]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Key size={15} />
              <span>Current Suite & Folio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-5 py-3 rounded-t-2xl transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-[#420317] text-[#f3e5ab] border-b-2 border-[#d4af37]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <History size={15} />
              <span>Lifetime Stay History ({customerProfile.totalStays})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('receipt')}
              className={`px-5 py-3 rounded-t-2xl transition-all flex items-center gap-2 ${
                activeTab === 'receipt'
                  ? 'bg-[#420317] text-[#f3e5ab] border-b-2 border-[#d4af37]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText size={15} />
              <span>Official Tax Folio Receipt</span>
            </button>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: CURRENT SUITE FOLIO & IN-ROOM PRIVILEGES                */}
          {/* ============================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Status Alert Ribbon */}
              {customerProfile.isPrimaryCleared ? (
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/40 text-sky-200 text-xs sm:text-sm flex items-start gap-3">
                  <CheckCheck size={20} className="text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold text-sm">
                      Bill Cleared & Checked Out (Settled in Full)
                    </strong>
                    <span>
                      Reservation <span className="font-mono text-white font-bold">{customerProfile.primaryBooking.id}</span> has been finalized and cleared by Front Desk. Outstanding balance is <strong>₦0.00</strong>. You can inspect your digital receipt anytime.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold text-sm">
                      {customerProfile.primaryBooking.status === 'Checked In' ? 'Active Stay in Progress' : 'Confirmed Reservation'}
                    </strong>
                    <span>
                      Allocated to Room #{customerProfile.primaryBooking.roomNumber || 'Auto-Reserved'}. Complimentary Morning Buffet & VIP Poolside Cabana access active.
                    </span>
                  </div>
                </div>
              )}

              {/* 2-Column Suite Presentation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1 & 2: Primary Suite Details Card */}
                <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#14030b] border border-[#d4af37]/35 shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                      <span className="text-[11px] text-gray-400 uppercase tracking-widest block font-medium">Assigned Suite</span>
                      <div className="text-3xl font-cinzel font-bold text-white mt-1">
                        Room #{customerProfile.primaryBooking.roomNumber || 'Auto-Reserved'}
                      </div>
                      <div className="text-base text-[#f3e5ab] font-medium mt-0.5">
                        {customerProfile.primaryBooking.roomName}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-1 font-mono">
                        <Building2 size={13} className="text-[#d4af37]" />
                        <span>{customerProfile.primaryBooking.roomType === 'suites' ? 'Extension Building (100 Wing)' : 'Main Building (600 Wing)'}</span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-[11px] text-gray-400 uppercase tracking-widest block font-medium">Reservation Code</span>
                      <div className="font-mono text-2xl font-extrabold text-[#f3e5ab] mt-1 flex items-center sm:justify-end gap-2">
                        <span>{customerProfile.primaryBooking.id}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(customerProfile.primaryBooking.id, 'code')}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
                          title="Copy booking code"
                        >
                          {copiedCode === 'code' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dates Schedule Grid */}
                  <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-gray-400 text-xs block uppercase">Check-In</span>
                      <strong className="text-white font-mono text-sm block mt-0.5">{customerProfile.primaryBooking.checkIn}</strong>
                      <span className="text-xs text-[#d4af37]">2:00 PM</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-gray-400 text-xs block uppercase">Check-Out</span>
                      <strong className="text-white font-mono text-sm block mt-0.5">{customerProfile.primaryBooking.checkOut || 'Open'}</strong>
                      <span className="text-xs text-[#d4af37]">12:00 PM</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-gray-400 text-xs block uppercase">Duration</span>
                      <strong className="text-white text-sm block mt-0.5">{customerProfile.primaryBooking.nights} {customerProfile.primaryBooking.nights === 1 ? 'Night' : 'Nights'}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-gray-400 text-xs block uppercase">Total Folio</span>
                      <strong className="text-emerald-400 font-mono text-sm block mt-0.5">₦{customerProfile.primaryBooking.amount?.toLocaleString()}</strong>
                      <span className="text-[10px] text-gray-400 block">Verified & Paid</span>
                    </div>
                  </div>

                  {/* High-Speed Wi-Fi Pass */}
                  {!customerProfile.isPrimaryCleared && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-black/40 to-black/40 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
                          <Wifi size={20} />
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 uppercase tracking-wider block">High-Speed VIP Wi-Fi Access</span>
                          <strong className="text-white font-mono text-sm">Arab_Signature_HighSpeed_Guest</strong>
                          <span className="text-gray-300 text-xs block font-mono">Password: <code className="text-[#f3e5ab] font-bold">ArabSignatureVIP</code></span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyWifi}
                        className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-sky-500/40"
                      >
                        {copiedWifi ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        <span>{copiedWifi ? 'Password Copied' : 'Copy Wi-Fi Password'}</span>
                      </button>
                    </div>
                  )}

                  {/* Quick Action Ribbon */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppConcierge(customerProfile.primaryBooking)}
                      className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <Phone size={15} /> WhatsApp Concierge
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigate('dining')}
                      className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
                    >
                      <Utensils size={15} className="text-[#d4af37]" /> In-Room Dining & Drinks
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setReceiptStay(customerProfile.primaryBooking);
                        setActiveTab('receipt');
                      }}
                      className="py-3 px-4 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#f3e5ab] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#d4af37]/40 transition-all cursor-pointer"
                    >
                      <FileText size={15} /> View Folio Receipt
                    </button>
                  </div>
                </div>

                {/* Column 3: Folio Settlement Card */}
                <div className="p-6 sm:p-7 rounded-3xl bg-[#14030b] border border-[#d4af37]/35 shadow-2xl space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-3">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Folio Settlement Statement</span>
                      <h4 className="font-cinzel text-lg font-bold text-white mt-1">Payment & Charges</h4>
                    </div>

                    <div className="space-y-2.5 text-xs sm:text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>Room Rate Subtotal:</span>
                        <span className="text-white font-mono font-medium">₦{customerProfile.primaryBooking.amount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Complimentary Breakfast:</span>
                        <span className="text-emerald-400 font-mono">₦0.00 (Included)</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>VIP Cabana Access:</span>
                        <span className="text-emerald-400 font-mono">₦0.00 (Included)</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>VAT & State Consumption:</span>
                        <span className="text-emerald-400 font-mono">₦0.00 (Included)</span>
                      </div>
                      <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm">
                        <span className="text-white">Total Amount Paid:</span>
                        <span className="text-emerald-400 font-mono text-base">₦{customerProfile.primaryBooking.amount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-xs pt-1 text-[#f3e5ab]">
                        <span>Balance Due:</span>
                        <span className="text-emerald-300 font-mono">₦0.00 (SETTLED)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase block font-medium">Payment Verification</span>
                    <div className="font-semibold text-white">{customerProfile.primaryBooking.paymentMethod}</div>
                    {customerProfile.primaryBooking.paystackReference && (
                      <div className="text-[10px] font-mono text-emerald-400 truncate">
                        Ref: {customerProfile.primaryBooking.paystackReference}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: LIFETIME STAY HISTORY (RETURNING CUSTOMER TRACKER)       */}
          {/* ============================================================== */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-300">
                    Showing all <strong className="text-[#f3e5ab] font-mono">{customerProfile.totalStays}</strong> verified stays associated with mobile: <strong className="text-white font-mono">{customerProfile.phone}</strong>
                  </span>
                </div>
                <div className="text-[#d4af37] font-semibold font-mono">
                  Lifetime Folio: ₦{customerProfile.totalSpent.toLocaleString()} (Paid in Full)
                </div>
              </div>

              <div className="space-y-3">
                {customerProfile.allStays.map((stay, idx) => {
                  const isCleared = ['Completed', 'Checked Out', 'Bill Cleared', 'Settled'].includes(stay.status);
                  const isActive = ['Checked In', 'Confirmed'].includes(stay.status);

                  return (
                    <div
                      key={stay.id || idx}
                      className="p-5 rounded-2xl bg-[#14030b] hover:bg-[#1f0611] border border-white/10 hover:border-[#d4af37]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-base font-extrabold text-[#f3e5ab]">
                            {stay.id}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isCleared 
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' 
                              : isActive 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                              : 'bg-gray-500/20 text-gray-300 border-gray-500/40'
                          }`}>
                            {isCleared ? 'Bill Cleared & Checked Out' : stay.status}
                          </span>
                          {stay.id === customerProfile.primaryBooking.id && (
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/30">
                              Active Login
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-white font-semibold">
                          {stay.roomName} {stay.roomNumber && `• Room #${stay.roomNumber}`}
                        </div>

                        <div className="text-xs text-gray-400 flex items-center gap-3 font-mono flex-wrap">
                          <span>Check-In: <strong className="text-gray-300">{stay.checkIn}</strong></span>
                          <span>•</span>
                          <span>Check-Out: <strong className="text-gray-300">{stay.checkOut || 'N/A'}</strong></span>
                          <span>•</span>
                          <span>{stay.nights} {stay.nights === 1 ? 'Night' : 'Nights'}</span>
                          <span>•</span>
                          <span className="text-gray-300">{stay.paymentMethod}</span>
                        </div>
                      </div>

                      <div className="flex sm:items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                        <div className="md:text-right">
                          <span className="text-[11px] text-gray-400 block uppercase">Folio Settled</span>
                          <div className="text-lg font-bold font-mono text-emerald-400">
                            ₦{stay.amount?.toLocaleString()}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setReceiptStay(stay);
                            setActiveTab('receipt');
                          }}
                          className="px-4 py-2.5 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#f3e5ab] text-xs font-bold flex items-center gap-1.5 border border-[#d4af37]/40 transition-colors cursor-pointer"
                        >
                          <FileText size={14} /> View Folio Receipt
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: OFFICIAL TAX FOLIO RECEIPT                             */}
          {/* ============================================================== */}
          {activeTab === 'receipt' && receiptStay && (
            <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
              
              {/* Folio Letterhead Document */}
              <div id="guest-printable-folio" className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#18030d] to-black border-2 border-[#d4af37]/45 shadow-2xl space-y-6 text-xs sm:text-sm">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start border-b border-white/15 pb-6 gap-4">
                  <div>
                    <div className="font-cinzel text-xl sm:text-2xl font-extrabold text-[#f3e5ab] tracking-wider">
                      ARAB SIGNATURE HOTEL & SUITES
                    </div>
                    <span className="text-xs text-gray-300 block mt-1">
                      Official Guest Folio & Settlement Statement
                    </span>
                    <span className="text-xs text-gray-400 block">
                      Nsugbe / Onitsha, Anambra State, Nigeria • Phone: {HOTEL_INFO.phone}
                    </span>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-xs text-gray-400 uppercase tracking-widest block font-medium">Folio Reference</span>
                    <strong className="text-lg font-mono text-[#f3e5ab] block">{receiptStay.id}</strong>
                    <span className="text-xs text-gray-400 font-mono block">Issued: {receiptStay.createdAt || receiptStay.checkIn}</span>
                  </div>
                </div>

                {/* Guest & Stay Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-white/10 pb-5 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-gray-400 text-xs block uppercase">Primary Guest</span>
                    <strong className="text-white text-base block truncate mt-0.5">{customerProfile.guestName}</strong>
                    <span className="text-xs text-gray-400 font-mono">{customerProfile.phone}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-gray-400 text-xs block uppercase">Suite Accommodations</span>
                    <strong className="text-[#f3e5ab] text-base block truncate mt-0.5">{receiptStay.roomName}</strong>
                    <span className="text-xs text-gray-400 font-mono">Room #{receiptStay.roomNumber || 'Auto-Reserved'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-gray-400 text-xs block uppercase">Stay Schedule</span>
                    <strong className="text-white text-sm block font-mono mt-0.5">{receiptStay.checkIn} to {receiptStay.checkOut || 'N/A'}</strong>
                    <span className="text-xs text-[#d4af37] font-semibold">{receiptStay.nights} {receiptStay.nights === 1 ? 'Night' : 'Nights'} Duration</span>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wider font-bold border-b border-white/10 pb-2">
                    <span>Description of Services</span>
                    <span className="text-right">Amount (NGN)</span>
                  </div>

                  <div className="flex justify-between py-1.5 text-white text-sm">
                    <span>{receiptStay.roomName} ({receiptStay.nights} Nights Stay)</span>
                    <span className="font-mono font-bold">₦{receiptStay.amount?.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between py-1.5 text-gray-400 text-xs">
                    <span>Complimentary Morning Buffet & VIP Poolside Cabana Access</span>
                    <span className="font-mono text-emerald-400">₦0.00 (Complimentary)</span>
                  </div>

                  <div className="flex justify-between py-1.5 text-gray-400 text-xs">
                    <span>High-Speed Optical VIP Wi-Fi & 24/7 Power Security</span>
                    <span className="font-mono text-emerald-400">₦0.00 (Complimentary)</span>
                  </div>
                </div>

                {/* Settlement Summary */}
                <div className="pt-4 border-t-2 border-[#d4af37]/40 space-y-2">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>Payment Channel:</span>
                    <span className="text-white font-medium">{receiptStay.paymentMethod}</span>
                  </div>
                  {receiptStay.paystackReference && (
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Paystack Transaction Ref:</span>
                      <span className="font-mono text-emerald-400">{receiptStay.paystackReference}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-white/10">
                    <span className="text-white">Total Amount Paid:</span>
                    <span className="text-emerald-400 font-mono text-lg">₦{receiptStay.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#f3e5ab]">
                    <span>Outstanding Balance Due:</span>
                    <span className="font-mono text-emerald-300">₦0.00 (SETTLED IN FULL)</span>
                  </div>
                </div>

                {/* Stamp */}
                <div className="pt-4 text-center text-xs text-gray-400 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                    <ShieldCheck size={16} /> Official Verified Hotel Folio
                  </span>
                  <span>Thank you for choosing Arab Signature Hotel & Suites.</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white text-xs font-semibold"
                >
                  ← Back to Stay History
                </button>

                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:brightness-105 transition-all cursor-pointer"
                >
                  <Printer size={16} /> Print / Save PDF Folio Receipt
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
