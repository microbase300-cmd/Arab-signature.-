import React, { useState, useEffect } from 'react';
import { HOTEL_INFO, ROOMS } from '../data/hotelData';
import { portalStore } from '../data/portalStore';
import { payWithPaystack, getPaystackMode } from '../utils/paystack';
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
  CheckCheck,
  MapPin,
  Zap,
  Waves,
  Shield,
  Coffee,
  ChevronRight,
  Wine,
  Beer,
  Flame,
  Tag,
  CreditCard,
  Plus,
  ShoppingBag
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
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'dining' | 'history' | 'receipt'
  const [receiptStay, setReceiptStay] = useState(null);
  const [checkedOutData, setCheckedOutData] = useState(null);
  const [logoutNotice, setLogoutNotice] = useState(false);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);

  // Dining Menu Tab states
  const [diningItems, setDiningItems] = useState([]);
  const [diningSearch, setDiningSearch] = useState('');
  const [diningCategory, setDiningCategory] = useState('all');
  const [recentRoomOrderBanner, setRecentRoomOrderBanner] = useState(null);
  const [isSettlingBill, setIsSettlingBill] = useState(false);
  const [, setFolioTick] = useState(0);
  const paystackMode = getPaystackMode();

  // Sync profile on mount and subscribe to live changes
  useEffect(() => {
    const current = portalStore.getCustomerSession();
    setCustomerProfile(current);
    if (current?.primaryBooking) {
      setReceiptStay(current.primaryBooking);
    }

    // Load initial dining menu & subscribe to real-time updates
    setDiningItems(portalStore.getDiningMenu());
    const unsubMenu = portalStore.subscribeDiningMenu((updatedMenu) => {
      setDiningItems(updatedMenu);
    });

    const unsubDiningOrders = portalStore.subscribeDiningOrders(() => {
      const fresh = portalStore.getCustomerSession();
      if (fresh) setCustomerProfile({ ...fresh });
      setFolioTick((t) => t + 1);
    });

    return () => {
      unsubMenu();
      unsubDiningOrders();
    };
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
    setCheckedOutData(null);
    setLogoutNotice(false);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = portalStore.loginCustomer(code);
      setIsSubmitting(false);

      if (res.success) {
        setCustomerProfile(res.profile);
        setReceiptStay(res.profile.primaryBooking);
        setCheckedOutData(null);
        setBookingCodeInput('');
        
        // Launch the personalized VIP Welcome Intro
        setIntroGuestName(res.profile.guestName);
        setIntroTypedChars(0);
        setIntroStage('typing');
        setIntroExiting(false);
        setShowVipIntro(true);
      } else if (res.isCheckedOut) {
        // Explicit checked-out notice: "This user has checked out"
        setCheckedOutData({
          booking: res.booking,
          profile: res.profile,
          message: res.error
        });
        setCustomerProfile(null);
        setReceiptStay(null);
      } else {
        setCheckedOutData(null);
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
    setCheckedOutData(null);
    setBookingCodeInput('');
    setLogoutNotice(true);
    setTimeout(() => setLogoutNotice(false), 6000);
  };

  const handleConfirmCheckout = () => {
    if (!customerProfile?.primaryBooking?.id) return;
    const bookingId = customerProfile.primaryBooking.id;
    const res = portalStore.checkOutBooking(bookingId);
    setShowCheckoutConfirm(false);
    if (res.success) {
      setCustomerProfile(null);
      setReceiptStay(null);
      setCheckedOutData({
        booking: res.booking,
        profile: portalStore.getCustomerHistoryByBookingCode(bookingId),
        message: `This user has checked out. Booking code '${bookingId}' is now expired and room #${res.booking.roomNumber || ''} has been vacated.`
      });
    }
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
    const roomInfo = stay?.roomNumber && stay.roomNumber !== 'Unassigned' ? `Room #${stay.roomNumber}` : (stay?.roomName || 'Assigned Suite');
    const text = encodeURIComponent(
      `Hello Arab Signature Hotel Royal Butler & Concierge,\n\n` +
      `🏨 Guest: ${customerProfile?.guestName || 'Valued Guest'}\n` +
      `🔑 Suite: ${roomInfo} (${stay?.id || customerProfile?.primaryBooking?.id})\n` +
      `📞 Mobile: ${customerProfile?.phone || ''}\n\n` +
      `I am requesting personalized hospitality assistance with my stay.`
    );
    window.open(`https://wa.me/${HOTEL_INFO.whatsapp}?text=${text}`, '_blank');
  };

  const handleOrderDiningToRoom = (item) => {
    const roomNumber = customerProfile?.primaryBooking?.roomNumber || 'Assigned Suite';
    const guestName = customerProfile?.guestName || 'Valued Guest';
    const bookingId = customerProfile?.primaryBooking?.id || '';
    const text = encodeURIComponent(
      `Hello Al-Sultan Restaurant & In-Room Dining,\n\n` +
      `🏨 Guest: ${guestName}\n` +
      `🔑 Suite: Room #${roomNumber} (${bookingId})\n` +
      `🍽️ In-Room Order: 1x ${item.name} (₦${Number(item.price).toLocaleString()})\n\n` +
      `Please deliver warm to my suite. Thank you!`
    );
    window.open(`https://wa.me/${HOTEL_INFO.whatsapp}?text=${text}`, '_blank');
  };

  // Book Food (ARB-FDD-...) or Drink (ARB-DRK-...) directly onto active In-Lodge Suite Bill
  const handleChargeItemToRoomBill = (item) => {
    const primary = customerProfile?.primaryBooking;
    if (!primary || customerProfile?.isPrimaryCleared) return;

    const isDrink = item.type === 'drinks' || ['drinks', 'spirits', 'wines', 'beers', 'softdrinks', 'energy', 'juices'].includes(item.category);
    const created = portalStore.addDiningOrder({
      orderType: isDrink ? 'drinks' : 'food',
      guestName: customerProfile.guestName || primary.guestName,
      phone: customerProfile.phone || primary.phone || '',
      email: customerProfile.email || primary.email || '',
      isLodgeGuest: true,
      bookingId: primary.id,
      roomNumber: primary.roomNumber,
      building: primary.building || (String(primary.roomNumber || '').startsWith('1') ? 'Extension Building' : 'Main Building'),
      serviceLocation: `Suite #${primary.roomNumber} (In-Suite Guest Portal Order)`,
      chargeToRoom: true,
      items: [
        {
          id: item.id,
          name: item.name,
          qty: 1,
          unitPrice: Number(item.price) || 0,
          totalPrice: Number(item.price) || 0,
          type: isDrink ? 'drinks' : 'food'
        }
      ],
      amount: Number(item.price) || 0,
      source: 'Guest Portal In-Room Bill'
    });

    const refreshed = portalStore.getCustomerSession();
    if (refreshed) setCustomerProfile({ ...refreshed });
    setFolioTick((t) => t + 1);
    setRecentRoomOrderBanner(created);
  };

  // Settle Outstanding Suite Dining/Drink Bill via Paystack or Instant Demo
  const handleSettleRoomBill = async (useInstantDemo = false, autoCheckoutAfter = false) => {
    const primary = customerProfile?.primaryBooking;
    if (!primary) return;
    const summary = portalStore.getBookingFolioSummary(primary);
    if (summary.balanceDue <= 0) return;

    const finishSettlement = (methodLabel, ref) => {
      portalStore.settleBookingDiningBill(primary.id, methodLabel, ref);
      const refreshed = portalStore.getCustomerSession();
      if (refreshed) setCustomerProfile({ ...refreshed });
      setFolioTick((t) => t + 1);
      setIsSettlingBill(false);
      if (autoCheckoutAfter) {
        setTimeout(() => handleConfirmCheckout(), 150);
      }
    };

    if (useInstantDemo) {
      setIsSettlingBill(true);
      finishSettlement('Paystack Online (Guest Portal Verified)', `ASH-PORTAL-${Date.now().toString(36).toUpperCase()}`);
      return;
    }

    setIsSettlingBill(true);
    await payWithPaystack({
      email: primary.email || customerProfile.email || 'guest@arabsignature.com',
      amount: summary.balanceDue,
      guestName: customerProfile.guestName || primary.guestName,
      guestPhone: customerProfile.phone || primary.phone || '',
      roomName: `Suite #${primary.roomNumber} Room Bill Settlement (${primary.id})`,
      onSuccess: (res) => {
        finishSettlement('Paystack Online (Guest Portal Verified)', res.reference);
      },
      onClose: () => setIsSettlingBill(false),
      onError: () => setIsSettlingBill(false)
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleRebookNow = () => {
    if (onOpenBooking) {
      onOpenBooking(customerProfile?.primaryBooking?.roomType || 'deluxe');
    }
  };

  // Find suite metadata & photo for the active booking + Live Room & Dining Folio Summary
  const activeRoomMeta = ROOMS.find(r => r.id === customerProfile?.primaryBooking?.roomType) || ROOMS[0];
  const activeRoomImage = activeRoomMeta?.image || '/rooms/suite-royal-penthouse.jpg';
  const activeFolio = customerProfile?.primaryBooking
    ? portalStore.getBookingFolioSummary(customerProfile.primaryBooking)
    : null;
  const receiptFolio = receiptStay
    ? portalStore.getBookingFolioSummary(receiptStay)
    : null;

  // Dining Category Filtering
  const diningCategories = [
    { id: 'all', label: 'All Delicacies & Drinks' },
    { id: 'rice', label: 'Rice, Pasta & Sides' },
    { id: 'soups', label: 'Native Soups & Swallows' },
    { id: 'proteins', label: 'Fresh Proteins & Grills' },
    { id: 'drinks', label: 'Chilled Drinks & Bottle Service' },
  ];

  const filteredDiningItems = diningItems.filter((item) => {
    const q = diningSearch.trim().toLowerCase();
    const matchesSearch = !q || 
      item.name.toLowerCase().includes(q) ||
      (item.desc && item.desc.toLowerCase().includes(q));
    if (!matchesSearch) return false;

    if (diningCategory === 'all') return true;
    if (diningCategory === 'rice') return item.category === 'rice';
    if (diningCategory === 'soups') return item.category === 'soups';
    if (diningCategory === 'proteins') return item.category === 'proteins';
    if (diningCategory === 'drinks') {
      return item.type === 'drinks' || item.type === 'drink' || ['drinks', 'softdrinks', 'beers', 'wines', 'energy', 'spirits', 'juices'].includes(item.category);
    }
    return true;
  });

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
            <span className="text-[#f3e5ab] font-medium tracking-wide">Guest Stay Portal</span>
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
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600/30 to-red-600/30 hover:from-rose-600/50 hover:to-red-600/50 text-rose-200 hover:text-white flex items-center gap-1.5 border border-rose-500/40 text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                title="Log Out of Guest Portal"
              >
                <LogOut size={13} className="text-rose-300" />
                <span>Log Out</span>
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
          
          {/* ============================================================== */}
          {/* SUB-VIEW A: "THIS USER HAS CHECKED OUT" SCREEN                  */}
          {/* ============================================================== */}
          {checkedOutData ? (
            <div className="p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-[#260a12] via-[#1a050d] to-[#100207] border-2 border-amber-500/50 shadow-[0_10px_40px_rgba(245,158,11,0.25)] text-center space-y-6 animate-fadeIn">
              
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
                <LogOut size={32} />
              </div>

              <div className="space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold tracking-widest uppercase inline-block">
                  RESERVATION CLOSED • CHECKED OUT
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                  This User Has Checked Out
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
                  The reservation under booking code <strong className="font-mono text-[#f3e5ab] font-bold">{checkedOutData.booking.id}</strong> has concluded and the guest has completed check-out.
                </p>
              </div>

              {/* Archival Folio Summary */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 text-left space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-400">Registered Guest:</span>
                  <span className="text-white font-bold font-sans text-sm">{checkedOutData.booking.guestName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-400">Archived Suite:</span>
                  <span className="text-gray-200">{checkedOutData.booking.roomName} (Room #{checkedOutData.booking.roomNumber || '—'})</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-400">Stay Period:</span>
                  <span className="text-gray-200">{checkedOutData.booking.checkIn} → {checkedOutData.booking.checkOut} ({checkedOutData.booking.nights} Nights)</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                  <span className="text-gray-400">Billing Folio:</span>
                  <span className="text-emerald-400 font-bold">₦{Number(checkedOutData.booking.amount).toLocaleString()} • Settled & Cleared</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Booking Code Status:</span>
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    Expired / Invalid for Room Entry
                  </span>
                </div>
              </div>

              {/* Returning Customer Memory Recognition (If new active reservation exists) */}
              {checkedOutData.profile?.activeStay ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#d4af37]/15 border-2 border-[#d4af37]/60 text-left space-y-2.5 shadow-xl">
                  <div className="flex items-center gap-2 text-[#f3e5ab] font-bold text-xs uppercase tracking-wider">
                    <Sparkles size={15} className="text-[#d4af37]" />
                    <span>System Memory: Active Reservation Found for {checkedOutData.booking.guestName}!</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Our hotel registry recognizes you as a valued patron. You currently have a new confirmed reservation under booking code <strong className="font-mono text-white font-bold">{checkedOutData.profile.activeStay.id}</strong> ({checkedOutData.profile.activeStay.roomName}).
                  </p>
                  <button
                    type="button"
                    onClick={() => executeLogin(checkedOutData.profile.activeStay.id)}
                    className="w-full py-3.5 px-4 rounded-xl text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:brightness-105 cursor-pointer shadow-lg mt-1"
                    style={{
                      background: 'linear-gradient(135deg, #ffe58f 0%, #d4af37 50%, #b8860b 100%)',
                      color: '#000000',
                      fontWeight: '900'
                    }}
                  >
                    <span>Log In With Active Code ({checkedOutData.profile.activeStay.id})</span>
                    <ArrowRight size={16} className="text-black stroke-[3]" />
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 text-center">
                  💡 This previous booking code cannot be used to unlock suites or request active room services. When you book a new stay, a new booking code will be issued and our system will remember your entire guest profile and stay history.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCheckedOutData(null);
                    setBookingCodeInput('');
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Enter Another Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCheckedOutData(null);
                    if (onOpenBooking) onOpenBooking('deluxe');
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-105 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg"
                >
                  <Sparkles size={14} />
                  <span>Book A New Suite</span>
                </button>
              </div>

            </div>
          ) : (
            /* ============================================================== */
            /* SUB-VIEW B: STANDARD LUXURY LOGIN GATE                          */
            /* ============================================================== */
            <>
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
                
                {/* Logout notification banner */}
                {logoutNotice && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                    <span>You have successfully logged out of the Guest Stay Portal. Enter your booking code anytime to log back in.</span>
                  </div>
                )}

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
                      <span className="text-[11px] text-gray-400 font-normal">Format: ARS-BGD-XXXXLL or ARS-EXT-XXXXLL</span>
                    </label>
                    
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={bookingCodeInput}
                        onChange={(e) => setBookingCodeInput(e.target.value.toUpperCase())}
                        placeholder="e.g. ARS-EXT-9421XK or ARS-BGD-7812AB"
                        className="w-full bg-black/70 border border-white/20 rounded-xl px-4 py-3.5 text-white font-mono text-base uppercase tracking-wider focus:border-[#d4af37] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setBookingCodeInput('ARS-EXT-9421XK')}
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
                      onClick={() => handleQuickLogin('ARS-EXT-9421XK')}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-[#f3e5ab] font-mono block">ARS-EXT-9421XK</strong>
                        <span className="text-[11px] text-gray-400">Chief Emeka Obi (Diplomatic Suite)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">Active</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('ARS-BGD-1840EM')}
                      className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-left transition-colors flex items-center justify-between"
                      title="Test the 'This user has checked out' notice"
                    >
                      <div>
                        <strong className="text-amber-300 font-mono block">ARS-BGD-1840EM</strong>
                        <span className="text-[11px] text-gray-400">Chief Emeka Obi (Past Stay)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold">Checked Out</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('ARS-BGD-7812AB')}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-[#f3e5ab] font-mono block">ARS-BGD-7812AB</strong>
                        <span className="text-[11px] text-gray-400">Alhaji Ibrahim Musa (Executive)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">Confirmed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('ARS-BGD-6204NW')}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-[#f3e5ab] font-mono block">ARS-BGD-6204NW</strong>
                        <span className="text-[11px] text-gray-400">Senator Chuka Nwosu (Super Exec)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">Active</span>
                    </button>
                  </div>
                </div>

                {/* Assistance Note */}
                <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/10">
                  Need assistance? WhatsApp Front Desk Concierge: <strong className="text-[#d4af37] font-mono">+234 812 578 6875</strong>
                </div>
              </div>
            </>
          )}

        </div>
      ) : (
        /* ============================================================== */
        /* VIEW 2: 5-STAR LUXURY GUEST WELCOME DASHBOARD & PORTAL         */
        /* ============================================================== */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
          
          {/* ============================================================== */}
          {/* 1. GRAND ROYAL PALACE WELCOME BANNER (HOTEL VIBE & CULTURE)     */}
          {/* ============================================================== */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#d4af37]/50 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
            
            {/* Palace Exterior Background Photo */}
            <div 
              className="absolute inset-0 bg-cover bg-center scale-105 filter blur-[1px] transform transition-transform duration-1000"
              style={{ backgroundImage: `url('/hero-palace.jpg')` }}
            />

            {/* Luxurious Royal Burgundy & Velvet Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c020c]/95 via-[#2b0314]/90 to-[#120108]/95" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.18)_0%,_transparent_60%)]" />

            {/* Glowing Corner Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#5c0725]/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 p-6 sm:p-10 space-y-6">
              
              {/* Top Row: Arabic Cultural Greeting & Quick Header Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d4af37]/30 pb-5">
                
                {/* Arabic Greeting Inscription Badge */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#aa820a] to-[#420317] p-[2px] shadow-lg shrink-0">
                    <div className="w-full h-full rounded-2xl bg-[#14020a] flex items-center justify-center text-[#f3e5ab] font-cinzel font-bold text-lg">
                      AS
                    </div>
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-serif tracking-widest uppercase">
                      <Sparkles size={12} className="text-[#d4af37]" />
                      <span>أهلاً وسهلاً • AHLAN WA SAHLAN • ROYAL HOSPITALITY</span>
                    </div>
                    <span className="block text-[11px] text-gray-300 font-mono mt-0.5">
                      Arab Signature Hotel & Suites • Nsugbe, Anambra State
                    </span>
                  </div>
                </div>

                {/* Header Action Buttons: Logout & Butler Line */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dining')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#f3e5ab] border border-[#d4af37]/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md shadow-md"
                  >
                    <Utensils size={14} className="text-[#d4af37]" />
                    <span>In-Room Dining</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWhatsAppConcierge(customerProfile.primaryBooking)}
                    className="px-4 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-300 border border-[#25D366]/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md shadow-md"
                  >
                    <Phone size={14} className="text-emerald-400" />
                    <span>WhatsApp Butler</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 hover:text-white border border-rose-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                    title="Log Out of Guest Portal"
                  >
                    <LogOut size={14} className="text-rose-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>

              {/* Main Welcome Heading */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-md bg-[#5c0725]/80 text-[#ffe58f] border border-[#d4af37]/50 text-xs font-mono font-bold tracking-wider uppercase">
                    RESIDENCE PRIVILEGES ACTIVE
                  </span>
                  {customerProfile.isReturningGuest && (
                    <span className="px-3 py-1 rounded-md bg-[#d4af37]/25 text-[#f3e5ab] border border-[#d4af37]/60 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                      <Crown size={13} className="text-[#d4af37]" />
                      RETURNING VIP PATRON ({customerProfile.totalStays} STAYS)
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider uppercase ${customerProfile.vipBadgeClass}`}>
                    ★ {customerProfile.vipTier}
                  </span>
                </div>

                <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                  Welcome to Your Royal Residence, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe58f] via-[#d4af37] to-[#aa820a]">{customerProfile.guestName}</span>
                </h1>

                <p className="text-sm sm:text-base text-gray-200 font-serif italic max-w-3xl leading-relaxed">
                  Immerse yourself in authentic Arabian elegance, royal poolside comfort, and Anambra warmth. Your private suite records, 24/7 butler concierge, in-room dining, and high-speed Wi-Fi pass are fully at your command.
                </p>
              </div>

              {/* Live Hotel Status & Assurances Pill Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-black/45 border border-white/10 flex items-center gap-3">
                  <MapPin size={18} className="text-[#d4af37] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Palace Location</span>
                    <strong className="text-white">Nsugbe / Onitsha, Anambra</strong>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/45 border border-white/10 flex items-center gap-3">
                  <Zap size={18} className="text-amber-400 shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Clean Power Guarantee</span>
                    <strong className="text-emerald-400 font-bold">100% 24/7 Uninterrupted</strong>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/45 border border-white/10 flex items-center gap-3">
                  <Shield size={18} className="text-sky-400 shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Security Standard</span>
                    <strong className="text-white">Discrete 24/7 Executive Guard</strong>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/45 border border-white/10 flex items-center gap-3">
                  <Phone size={18} className="text-[#25D366] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Front Desk Hotline</span>
                    <strong className="text-[#f3e5ab]">+234 812 578 6875</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. STATS & PATRON SUMMARY                                      */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1a030d] to-[#100108] border border-[#d4af37]/30 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 uppercase tracking-widest block font-medium">Patron Standing</span>
                <div className="text-xl font-bold text-white font-cinzel mt-1">{customerProfile.vipTier}</div>
                <span className="text-xs text-[#d4af37] mt-0.5 block">{customerProfile.totalStays} Verified Lifetime Stays</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Crown size={24} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1a030d] to-[#100108] border border-[#d4af37]/30 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 uppercase tracking-widest block font-medium">Luxury Hospitality</span>
                <div className="text-xl font-extrabold text-white font-mono mt-1">{customerProfile.totalNights} Nights</div>
                <span className="text-xs text-emerald-400 mt-0.5 block">100% In-Residence Satisfaction</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bed size={24} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1a030d] to-[#100108] border border-[#d4af37]/30 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 uppercase tracking-widest block font-medium">Current Suite & Dining Folio</span>
                <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
                  ₦{Number(activeFolio ? activeFolio.grandTotalBill : customerProfile.totalSpent).toLocaleString()}
                </div>
                {activeFolio && activeFolio.balanceDue > 0 ? (
                  <span className="text-xs text-amber-300 mt-0.5 block font-mono font-bold">
                    Unsettled Room Bill: ₦{activeFolio.balanceDue.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 mt-0.5 block font-mono">Zero Outstanding Balance</span>
                )}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Receipt size={24} />
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. LUXURY TABS NAVIGATION                                      */}
          {/* ============================================================== */}
          <div className="flex border-b border-white/15 text-xs sm:text-sm font-semibold gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-3.5 rounded-t-2xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-t from-[#420317] to-[#20020c] text-[#f3e5ab] border-b-2 border-[#d4af37] shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Key size={16} className={activeTab === 'overview' ? 'text-[#d4af37]' : ''} />
              <span>Royal Residence & Keycard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dining')}
              className={`px-5 py-3.5 rounded-t-2xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'dining'
                  ? 'bg-gradient-to-t from-[#420317] to-[#20020c] text-[#f3e5ab] border-b-2 border-[#d4af37] shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Utensils size={16} className={activeTab === 'dining' ? 'text-[#d4af37]' : ''} />
              <span>Al-Sultan In-Room Dining</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-5 py-3.5 rounded-t-2xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-gradient-to-t from-[#420317] to-[#20020c] text-[#f3e5ab] border-b-2 border-[#d4af37] shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <History size={16} className={activeTab === 'history' ? 'text-[#d4af37]' : ''} />
              <span>Stay History ({customerProfile.totalStays})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('receipt')}
              className={`px-5 py-3.5 rounded-t-2xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'receipt'
                  ? 'bg-gradient-to-t from-[#420317] to-[#20020c] text-[#f3e5ab] border-b-2 border-[#d4af37] shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText size={16} className={activeTab === 'receipt' ? 'text-[#d4af37]' : ''} />
              <span>Official Tax Folio Receipt</span>
            </button>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: OVERVIEW — PHYSICAL VIP SUITE PASS & HOTEL CULTURE      */}
          {/* ============================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Status Alert Ribbon */}
              {customerProfile.isPrimaryCleared ? (
                <div className="p-4 rounded-2xl bg-sky-500/15 border border-sky-500/40 text-sky-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg">
                  <CheckCheck size={20} className="text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold text-sm">
                      Bill Cleared & Checked Out (Settled in Full)
                    </strong>
                    <span>
                      Reservation <span className="font-mono text-white font-bold">{customerProfile.primaryBooking.id}</span> has been concluded and cleared by the Front Desk. Outstanding folio balance is <strong>₦0.00</strong>. You can review and print your digital letterhead tax receipt anytime.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg">
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold text-sm">
                      {customerProfile.primaryBooking.status === 'Checked In' ? 'Active In Residence' : 'Confirmed VIP Reservation'}
                    </strong>
                    <span>
                      Allocated to <strong>Room #{customerProfile.primaryBooking.roomNumber || 'Auto-Reserved'}</strong> ({customerProfile.primaryBooking.roomName}). Complimentary Morning Executive Breakfast, In-Suite High Speed Wi-Fi, and Olympic Poolside Cabana access active.
                    </span>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* PHYSICAL-STYLE 5-STAR GOLDEN VIP RFID SUITE PASS / KEYCARD */}
              {/* ---------------------------------------------------------- */}
              <div className="relative rounded-3xl p-1 bg-gradient-to-r from-[#ffe58f] via-[#d4af37] to-[#aa820a] shadow-[0_15px_50px_rgba(212,175,55,0.35)]">
                <div className="rounded-[22px] bg-gradient-to-br from-[#1a020d] via-[#120108] to-[#0a0004] p-6 sm:p-9 overflow-hidden relative">
                  
                  {/* Subtle Background Watermark & Grid */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-5 pointer-events-none flex items-center justify-center font-cinzel text-9xl text-[#d4af37] select-none font-extrabold">
                    AS
                  </div>

                  <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
                    
                    {/* Suite Real Photo Visual Card */}
                    <div className="w-full lg:w-96 shrink-0 relative rounded-2xl overflow-hidden border-2 border-[#d4af37]/60 shadow-2xl group">
                      <div className="aspect-[4/3] w-full overflow-hidden bg-black">
                        <img 
                          src={activeRoomImage} 
                          alt={customerProfile.primaryBooking.roomName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>

                      {/* Photo Badge Overlays */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#d4af37]/60 text-[#f3e5ab] text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Crown size={12} className="text-[#d4af37]" />
                        <span>ASSIGNED RESIDENCE</span>
                      </div>

                      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#5c0725]/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono font-bold">
                        {customerProfile.primaryBooking.roomType === 'suites' ? '100 Wing (Extension)' : '600 Wing (Main)'}
                      </div>
                    </div>

                    {/* Suite Keycard Specifications */}
                    <div className="w-full space-y-6">
                      
                      {/* Room Number & Status Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div>
                          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono font-bold block">
                            VIP RFID KEYCARD SUITE PASS
                          </span>
                          <div className="text-3xl sm:text-4xl font-cinzel font-extrabold text-white mt-1 flex items-baseline gap-3 flex-wrap">
                            <span>Room #{customerProfile.primaryBooking.roomNumber || 'Auto-Reserved'}</span>
                            <span className="text-lg font-normal text-[#f3e5ab] font-sans">
                              ({customerProfile.primaryBooking.roomName})
                            </span>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <span className="text-xs uppercase tracking-widest text-gray-400 font-mono block">
                            Keycard Security Status
                          </span>
                          {!customerProfile.isPrimaryCleared ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold mt-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              IN RESIDENCE • KEYCARD ACTIVE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono font-bold mt-1">
                              CHECKED OUT • FOLIO CLEARED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stay Schedule & Booking Reference Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                          <span className="text-gray-400 uppercase tracking-wider block text-[10px]">Booking Code</span>
                          <div className="font-mono text-sm font-bold text-[#f3e5ab] mt-0.5 flex items-center justify-between">
                            <span className="truncate">{customerProfile.primaryBooking.id}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(customerProfile.primaryBooking.id, 'code')}
                              className="p-1 hover:text-white transition-colors"
                              title="Copy code"
                            >
                              {copiedCode === 'code' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                          <span className="text-gray-400 uppercase tracking-wider block text-[10px]">Check-In Time</span>
                          <strong className="text-white text-xs block mt-0.5">{customerProfile.primaryBooking.checkIn}</strong>
                          <span className="text-[#d4af37] text-[10px]">2:00 PM</span>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                          <span className="text-gray-400 uppercase tracking-wider block text-[10px]">Check-Out Time</span>
                          <strong className="text-white text-xs block mt-0.5">{customerProfile.primaryBooking.checkOut || 'Open'}</strong>
                          <span className="text-[#d4af37] text-[10px]">12:00 PM</span>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                          <span className="text-gray-400 uppercase tracking-wider block text-[10px]">Suite + Dining Bill</span>
                          <strong className={`font-mono text-sm block mt-0.5 ${activeFolio?.balanceDue > 0 ? 'text-amber-300' : 'text-emerald-400'}`}>
                            ₦{Number(activeFolio ? activeFolio.grandTotalBill : customerProfile.primaryBooking.amount).toLocaleString()}
                          </strong>
                          <span className={activeFolio?.balanceDue > 0 ? 'text-amber-300 text-[10px] font-bold' : 'text-gray-400 text-[10px]'}>
                            {activeFolio?.balanceDue > 0 ? `₦${activeFolio.balanceDue.toLocaleString()} Due` : 'Cleared & Paid'}
                          </span>
                        </div>
                      </div>

                      {/* In-Suite High-Speed Optical Wi-Fi Pass */}
                      {!customerProfile.isPrimaryCleared && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-black/50 to-black/50 border border-sky-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
                              <Wifi size={20} />
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">In-Suite High-Speed Optical Wi-Fi</span>
                              <strong className="text-white font-mono text-sm">Arab_Signature_HighSpeed_Guest</strong>
                              <span className="text-gray-300 text-xs block font-mono">Password: <code className="text-[#f3e5ab] font-bold">ArabSignatureVIP</code></span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyWifi}
                            className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-sky-500/40 cursor-pointer shadow-md"
                          >
                            {copiedWifi ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            <span>{copiedWifi ? 'Password Copied' : 'Copy Wi-Fi Password'}</span>
                          </button>
                        </div>
                      )}

                      {/* Instant Keycard Actions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('dining')}
                          className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-105 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                        >
                          <Utensils size={15} className="text-black" /> In-Room Dining
                        </button>

                        <button
                          type="button"
                          onClick={() => handleWhatsAppConcierge(customerProfile.primaryBooking)}
                          className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                        >
                          <Phone size={15} /> WhatsApp Butler
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setReceiptStay(customerProfile.primaryBooking);
                            setActiveTab('receipt');
                          }}
                          className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
                        >
                          <FileText size={15} className="text-[#d4af37]" /> Folio Receipt
                        </button>

                        {!customerProfile.isPrimaryCleared && (
                          <button
                            type="button"
                            onClick={() => setShowCheckoutConfirm(true)}
                            className="py-3 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-amber-500/35 transition-all cursor-pointer"
                            title="Check out and vacate this suite"
                          >
                            <LogOut size={15} className="text-amber-400" /> Front Desk Check Out
                          </button>
                        )}
                      </div>

                    </div>

                  </div>

                </div>
              </div>

              {/* ---------------------------------------------------------- */}
              {/* IN-LODGE FOOD (ARB-FDD) & DRINK (ARB-DRK) ROOM BILL LEDGER */}
              {/* ---------------------------------------------------------- */}
              {activeFolio && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1b030e] via-[#130209] to-black border border-[#d4af37]/40 shadow-2xl space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4af37] font-bold flex items-center gap-1.5">
                        <Receipt size={13} />
                        IN-LODGE FOOD & DRINK ROOM BILL FOLIO • {customerProfile.primaryBooking.id}
                      </span>
                      <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
                        Suite Kitchen (<span className="text-[#f3e5ab]">ARB-FDD</span>) & VIP Bar (<span className="text-[#f3e5ab]">ARB-DRK</span>) Charges
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {!customerProfile.isPrimaryCleared && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('dining')}
                          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#d4af37]/35 text-xs font-bold text-[#f3e5ab] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus size={14} className="text-[#d4af37]" />
                          <span>Order Food / Drinks to Bill</span>
                        </button>
                      )}

                      {activeFolio.balanceDue > 0 && (
                        <>
                          {paystackMode.isTest && (
                            <button
                              type="button"
                              disabled={isSettlingBill}
                              onClick={() => handleSettleRoomBill(true, false)}
                              className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-400/40 text-emerald-200 text-xs font-bold cursor-pointer"
                            >
                              Instant Clear Bill
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={isSettlingBill}
                            onClick={() => handleSettleRoomBill(false, false)}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer"
                          >
                            <CreditCard size={14} />
                            <span>Settle ₦{activeFolio.balanceDue.toLocaleString()} Now</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                      <span className="text-[10px] text-gray-400 block">SUITE ACCOMMODATION</span>
                      <span className="text-sm font-bold text-white">₦{activeFolio.roomAmount.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-[#d4af37]/25">
                      <span className="text-[10px] text-[#f3e5ab] block">FOOD ORDERS (ARB-FDD)</span>
                      <span className="text-sm font-bold text-[#f3e5ab]">₦{activeFolio.foodOrdersTotal.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-purple-400/25">
                      <span className="text-[10px] text-purple-200 block">DRINK ORDERS (ARB-DRK)</span>
                      <span className="text-sm font-bold text-purple-200">₦{activeFolio.drinkOrdersTotal.toLocaleString()}</span>
                    </div>
                    <div className={`p-3 rounded-xl border ${activeFolio.balanceDue > 0 ? 'bg-amber-950/35 border-amber-400/40' : 'bg-emerald-950/35 border-emerald-400/40'}`}>
                      <span className="text-[10px] text-gray-300 block">BALANCE DUE</span>
                      <span className={`text-sm font-extrabold ${activeFolio.balanceDue > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
                        ₦{activeFolio.balanceDue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Attached Orders List */}
                  {activeFolio.diningOrders.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span>No food or drink charges have been added to this suite bill yet.</span>
                      {onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate('dining')}
                          className="text-[#f3e5ab] hover:underline font-mono font-bold text-left"
                        >
                          Explore Full Website Food & Drink Catalog &rarr;
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {activeFolio.diningOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-3.5 rounded-2xl bg-black/55 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                                  ord.orderType === 'drinks'
                                    ? 'bg-purple-500/20 text-purple-200 border-purple-400/40'
                                    : 'bg-[#d4af37]/20 text-[#f3e5ab] border-[#d4af37]/40'
                                }`}
                              >
                                {ord.id}
                              </span>
                              <span className="text-[11px] font-mono text-emerald-300">{ord.orderStatus}</span>
                              <span className="text-[11px] text-gray-400 font-mono">• {ord.createdAt}</span>
                            </div>
                            <div className="text-gray-200">
                              {ord.items.map((it) => `${it.qty}x ${it.name}`).join(', ')}
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 font-mono">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                ord.paymentStatus === 'Paid'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                                  : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                            <span className="text-sm font-extrabold text-[#f3e5ab]">
                              ₦{Number(ord.amount).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* THE ARAB SIGNATURE EXPERIENCE & HOTEL CULTURE SHOWCASE     */}
              {/* ---------------------------------------------------------- */}
              <div className="space-y-4 pt-4">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono font-bold block">
                      ROYAL HOSPITALITY & RESIDENCE AMENITIES
                    </span>
                    <h3 className="font-cinzel text-2xl font-bold text-white mt-1">
                      The Arab Signature Experience & Culture
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400">
                    Complimentary executive privileges for in-house patrons
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Culture Card 1: Al-Sultan Gourmet Dining */}
                  <div className="rounded-2xl overflow-hidden bg-[#16030c] border border-[#d4af37]/35 shadow-xl flex flex-col justify-between group hover:border-[#d4af37] transition-all">
                    <div>
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src="/rooms/al-sultan-dining-hall.jpg" 
                          alt="Al-Sultan Dining Hall" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#16030c] via-transparent to-transparent" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[#f3e5ab] text-[10px] font-mono font-bold border border-[#d4af37]/40">
                          CULINARY EXCELLENCE
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-cinzel text-base font-bold text-[#f3e5ab] flex items-center gap-1.5">
                          <Utensils size={15} className="text-[#d4af37]" />
                          <span>Al-Sultan Gourmet Dining</span>
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          Savor authentic Anambra native soups (Oha, Afang, Bitterleaf), whole catfish peppersoup, smoky firewood jollof, and gourmet grills delivered hot to your suite.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button
                        type="button"
                        onClick={() => setActiveTab('dining')}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/35 text-[#f3e5ab] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#d4af37]/40 transition-colors cursor-pointer"
                      >
                        <span>Browse In-Room Menu &rarr;</span>
                      </button>
                    </div>
                  </div>

                  {/* Culture Card 2: Olympic Pool & VIP Cabanas */}
                  <div className="rounded-2xl overflow-hidden bg-[#16030c] border border-[#d4af37]/35 shadow-xl flex flex-col justify-between group hover:border-[#d4af37] transition-all">
                    <div>
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src="/gallery/IMG-20261018-WA0081.jpg" 
                          alt="Olympic Pool & Cabanas" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#16030c] via-transparent to-transparent" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-sky-300 text-[10px] font-mono font-bold border border-sky-400/40">
                          OUTDOOR OASIS
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-cinzel text-base font-bold text-[#f3e5ab] flex items-center gap-1.5">
                          <Waves size={15} className="text-sky-400" />
                          <span>Olympic Pool & Cabanas</span>
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          Submerge into crystal-clear waters or relax under private shaded VIP cabanas with cocktail service, fresh juices, and tranquil sunset ambiance. Open 7 AM – 10 PM.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppConcierge(customerProfile.primaryBooking)}
                        className="w-full py-2.5 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-sky-500/40 transition-colors cursor-pointer"
                      >
                        <span>Reserve Cabana via Butler</span>
                      </button>
                    </div>
                  </div>

                  {/* Culture Card 3: 24/7 Butler & Chauffeur Services */}
                  <div className="rounded-2xl overflow-hidden bg-[#16030c] border border-[#d4af37]/35 shadow-xl flex flex-col justify-between group hover:border-[#d4af37] transition-all">
                    <div>
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src="/rooms/arch-reception-entrance.jpg" 
                          alt="Reception Entrance" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#16030c] via-transparent to-transparent" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[#ffe58f] text-[10px] font-mono font-bold border border-[#d4af37]/40">
                          WHITE-GLOVE SERVICE
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-cinzel text-base font-bold text-[#f3e5ab] flex items-center gap-1.5">
                          <Crown size={15} className="text-[#d4af37]" />
                          <span>24/7 Butler & Chauffeur</span>
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          Enjoy seamless airport pickup from Asaba or Anambra International Airport, dry cleaning, extra Egyptian cotton pillows, and personalized in-suite service.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppConcierge(customerProfile.primaryBooking)}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/35 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#25D366]/40 transition-colors cursor-pointer"
                      >
                        <span>WhatsApp Personal Butler</span>
                      </button>
                    </div>
                  </div>

                  {/* Culture Card 4: Guaranteed 24/7 Clean Power & Security */}
                  <div className="rounded-2xl overflow-hidden bg-[#16030c] border border-[#d4af37]/35 shadow-xl flex flex-col justify-between group hover:border-[#d4af37] transition-all">
                    <div>
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src="/hero-palace.jpg" 
                          alt="Palace Security & Power" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#16030c] via-transparent to-transparent" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-emerald-300 text-[10px] font-mono font-bold border border-emerald-400/40">
                          100% UNINTERRUPTED
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-cinzel text-base font-bold text-[#f3e5ab] flex items-center gap-1.5">
                          <Zap size={15} className="text-amber-400" />
                          <span>Guaranteed Power & Guard</span>
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          Rest with absolute peace of mind. Arab Signature operates dual heavy-duty synchronized generators with solar backup and discrete armed perimeter security.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <div className="py-2.5 px-3 rounded-xl bg-white/5 text-gray-300 text-xs font-mono text-center border border-white/10">
                        Zero Blackout Standard in Nsugbe
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: AL-SULTAN IN-ROOM DINING MENU (ORDER TO SUITE)           */}
          {/* ============================================================== */}
          {activeTab === 'dining' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Dining Header & Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2c0412] via-[#1a020a] to-[#120108] border border-[#d4af37]/45 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-mono font-bold uppercase tracking-wider">
                    <Utensils size={13} className="text-[#d4af37]" />
                    <span>AL-SULTAN IN-ROOM DINING & BAR SERVICE</span>
                  </div>
                  <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white mt-2">
                    Order Delicacies Directly to Room #{customerProfile.primaryBooking.roomNumber || 'Assigned Suite'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
                    Freshly prepared African native soups, continental specialties, succulent grilled proteins, and chilled cellar drinks delivered warm to your door in 20-30 minutes.
                  </p>
                </div>

                <div className="shrink-0 p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono space-y-1 text-right">
                  <span className="text-gray-400 block text-[10px] uppercase">Room Bill Link</span>
                  <strong className="text-[#f3e5ab] block">{customerProfile.primaryBooking.id}</strong>
                  <span className="text-emerald-400 block text-[11px]">ARB-FDD / ARB-DRK Auto-Billing</span>
                </div>
              </div>

              {recentRoomOrderBanner && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    <div>
                      <strong className="text-white block">
                        Booked & Added to Suite #{recentRoomOrderBanner.roomNumber} Bill! Code:{' '}
                        <span className="font-mono text-[#f3e5ab]">{recentRoomOrderBanner.id}</span>
                      </strong>
                      <span className="text-gray-300 font-mono">
                        {recentRoomOrderBanner.items.map((i) => `${i.qty}x ${i.name}`).join(', ')} • ₦{Number(recentRoomOrderBanner.amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className="px-3 py-1.5 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] font-bold cursor-pointer"
                    >
                      View Room Bill
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecentRoomOrderBanner(null)}
                      className="text-gray-400 hover:text-white px-2"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Search & Category Filter Pills */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                
                {/* Search Bar */}
                <div className="relative sm:w-80">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={diningSearch}
                    onChange={(e) => setDiningSearch(e.target.value)}
                    placeholder="Search menu (e.g. Jollof, Catfish, Afang)..."
                    className="w-full bg-black/60 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-400 focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {diningCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setDiningCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        diningCategory === cat.id
                          ? 'bg-[#d4af37] text-black shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDiningItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl overflow-hidden bg-[#14030b] border border-white/10 hover:border-[#d4af37]/50 shadow-xl flex flex-col justify-between transition-all group"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="h-44 w-full overflow-hidden relative bg-black">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                              e.currentTarget.src = '/dining/jollof-rice.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#1f0511] text-[#d4af37]">
                            <Utensils size={36} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#14030b] via-transparent to-transparent" />
                        
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[#f3e5ab] text-[10px] font-mono font-bold border border-white/15">
                          {item.categoryLabel || item.category || 'Specialty'}
                        </span>

                        <span className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-black/85 backdrop-blur-md text-emerald-400 font-mono font-extrabold text-sm border border-emerald-500/40">
                          ₦{Number(item.price).toLocaleString()}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h4 className="font-cinzel text-lg font-bold text-white group-hover:text-[#f3e5ab] transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                          {item.desc || 'Prepared freshly with authentic spices by our master executive chefs.'}
                        </p>
                        {item.pairingNote && (
                          <div className="text-[11px] text-amber-300 font-mono bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                            ★ {item.pairingNote}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Buttons: Add Directly to Suite Bill (ARB-FDD / ARB-DRK) + WhatsApp */}
                    <div className="p-4 pt-0 space-y-2">
                      {!customerProfile.isPrimaryCleared && (
                        <button
                          type="button"
                          onClick={() => handleChargeItemToRoomBill(item)}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-105 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                          <Receipt size={13} />
                          <span>
                            Add to Suite Bill ({item.type === 'drinks' ? 'ARB-DRK' : 'ARB-FDD'})
                          </span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOrderDiningToRoom(item)}
                        className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-gray-200 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Phone size={12} className="text-emerald-400" />
                        <span>Order via WhatsApp Butler</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {filteredDiningItems.length === 0 && (
                <div className="p-12 text-center text-gray-400 space-y-2 rounded-2xl bg-white/5 border border-white/10">
                  <Utensils size={32} className="mx-auto text-gray-500" />
                  <p className="text-sm">No delicacies match your filter "{diningSearch}".</p>
                  <button
                    type="button"
                    onClick={() => {
                      setDiningSearch('');
                      setDiningCategory('all');
                    }}
                    className="text-xs text-[#d4af37] underline font-semibold"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: LIFETIME STAY HISTORY (RETURNING CUSTOMER TRACKER)       */}
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
          {/* TAB 4: OFFICIAL TAX FOLIO RECEIPT                             */}
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

                  {/* Itemized Food (ARB-FDD) & Drink (ARB-DRK) Charges Attached to Stay */}
                  {receiptFolio?.diningOrders?.map((ord) => (
                    <div key={ord.id} className="flex justify-between py-1.5 text-gray-200 text-xs border-t border-white/5">
                      <div>
                        <span className="font-mono font-bold text-[#f3e5ab] mr-2">{ord.id}</span>
                        <span>{ord.items.map((it) => `${it.qty}x ${it.name}`).join(', ')}</span>
                        <span className={`ml-2 text-[10px] font-mono ${ord.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-300'}`}>
                          ({ord.paymentStatus})
                        </span>
                      </div>
                      <span className="font-mono font-bold text-[#f3e5ab]">₦{Number(ord.amount).toLocaleString()}</span>
                    </div>
                  ))}

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
                  <div className="flex justify-between text-xs text-gray-300 pt-2 border-t border-white/10">
                    <span>Grand Total Folio (Suite + Food/Drinks):</span>
                    <span className="text-white font-mono font-bold">
                      ₦{Number(receiptFolio ? receiptFolio.grandTotalBill : receiptStay.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-white">Total Amount Paid:</span>
                    <span className="text-emerald-400 font-mono text-lg">
                      ₦{Number(receiptFolio ? receiptFolio.totalPaidSoFar : receiptStay.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#f3e5ab]">
                    <span>Outstanding Balance Due:</span>
                    {receiptFolio && receiptFolio.balanceDue > 0 ? (
                      <span className="font-mono text-amber-300">
                        ₦{receiptFolio.balanceDue.toLocaleString()} (UNSETTLED ROOM BILL)
                      </span>
                    ) : (
                      <span className="font-mono text-emerald-300">₦0.00 (SETTLED IN FULL)</span>
                    )}
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
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  &larr; Back to Stay History
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

      {/* Front Desk Check Out Confirmation Modal */}
      {showCheckoutConfirm && customerProfile?.primaryBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full bg-[#18030e] border border-amber-500/50 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40 shadow-lg">
              <LogOut size={30} />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-bold">
                Front Desk Keycard & Room Check Out
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                Check Out of Suite?
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Are you ready to complete your check-out from Room #{customerProfile.primaryBooking.roomNumber || '—'}?
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-left text-xs font-mono text-gray-300 space-y-1.5">
              <div>Booking Code: <strong className="text-[#f3e5ab]">{customerProfile.primaryBooking.id}</strong></div>
              <div>
                Folio Balance:{' '}
                {activeFolio?.balanceDue > 0 ? (
                  <strong className="text-amber-300">₦{activeFolio.balanceDue.toLocaleString()} (Unsettled Food/Drink Bill)</strong>
                ) : (
                  <strong className="text-emerald-400">₦0.00 (Settled)</strong>
                )}
              </div>
              {activeFolio?.balanceDue > 0 && (
                <div className="text-amber-200 text-[11px] pt-1 border-t border-white/10">
                  Please settle your ₦{activeFolio.balanceDue.toLocaleString()} room food/drink bill below or at the Front Desk before checking out.
                </div>
              )}
              <div className="text-rose-400 text-[11px] pt-1 border-t border-white/10">
                ⚠️ Once checked out, this booking code will expire and become invalid.
              </div>
            </div>

            {activeFolio?.balanceDue > 0 ? (
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={isSettlingBill}
                  onClick={() => handleSettleRoomBill(paystackMode.isTest, true)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                >
                  Settle ₦{activeFolio.balanceDue.toLocaleString()} Bill & Check Out
                </button>
                <button
                  type="button"
                  onClick={() => setShowCheckoutConfirm(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmCheckout}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                >
                  Confirm Check Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
