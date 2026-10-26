import React, { useState, useEffect } from 'react';
import {
  Utensils, Wine, Sparkles, CheckCircle2, Clock, AlertCircle, ArrowLeft,
  Search, KeyRound, Copy, Check, Printer, MessageSquare, MapPin, Phone,
  User, Mail, Receipt, Building2, ShieldCheck, PackageCheck, Truck, Flame, RefreshCw
} from 'lucide-react';
import { portalStore } from '../data/portalStore';

export default function FoodDrinkOrderTrackerPage({ onNavigate }) {
  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  const [inputCode, setInputCode] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  // Resolve and refresh the currently tracked order from portalStore
  const syncOrderFromStore = (codeOverride) => {
    const codeToFind = (codeOverride !== undefined ? codeOverride : (inputCode || portalStore.getTrackedDiningOrderCode())).trim();
    if (!codeToFind) return;

    const found = portalStore.findDiningOrderByCode(codeToFind);
    setLastSyncedAt(
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );

    if (found) {
      setTrackedOrder(found);
      setInputCode(found.id);
      setLookupError('');
    } else if (codeOverride) {
      setTrackedOrder(null);
      setLookupError(
        `No Food or Drink booking found matching "${codeToFind.toUpperCase()}". Please check your official ARB-FDD-... (Food) or ARB-DRK-... (Drink) code.`
      );
    }
  };

  useEffect(() => {
    const savedCode = portalStore.getTrackedDiningOrderCode();
    if (savedCode) {
      setInputCode(savedCode);
      syncOrderFromStore(savedCode);
    }

    const unsubOrders = portalStore.subscribeDiningOrders(() => {
      const activeCode = portalStore.getTrackedDiningOrderCode();
      if (activeCode) {
        syncOrderFromStore(activeCode);
      }
    });

    const handleCodeChanged = (e) => {
      const nextCode = e?.detail?.code || portalStore.getTrackedDiningOrderCode();
      if (nextCode) {
        setInputCode(nextCode);
        syncOrderFromStore(nextCode);
      }
    };

    window.addEventListener('ash_tracked_dining_code_changed', handleCodeChanged);

    // Real-time 1.5s heartbeat so status changes made by Main Receptionist reflect immediately
    const timer = setInterval(() => {
      const activeCode = portalStore.getTrackedDiningOrderCode();
      if (activeCode) {
        syncOrderFromStore(activeCode);
      }
    }, 1500);

    return () => {
      unsubOrders();
      window.removeEventListener('ash_tracked_dining_code_changed', handleCodeChanged);
      clearInterval(timer);
    };
  }, []);

  const handleTrackSubmit = (e) => {
    if (e) e.preventDefault();
    const cleaned = inputCode.trim().toUpperCase();
    if (!cleaned) {
      setLookupError('Please enter your Food (ARB-FDD-...) or Drink (ARB-DRK-...) booking code.');
      return;
    }

    const found = portalStore.findDiningOrderByCode(cleaned);
    if (!found) {
      setTrackedOrder(null);
      setLookupError(
        `Could not find any Food or Drink order with code "${cleaned}". Expected format: ARB-FDD-4821KM or ARB-DRK-9034VN.`
      );
      return;
    }

    portalStore.setTrackedDiningOrderCode(found.id);
    setTrackedOrder(found);
    setInputCode(found.id);
    setLookupError('');
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  // Compute progress step (1 to 4) based on orderStatus
  const getProgressStage = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('cancel')) return -1;
    if (s.includes('picked up') || s.includes('pickup') || s.includes('delivered')) return 4;
    if (s.includes('ready')) return 3;
    if (s.includes('prepar') || s.includes('cook') || s.includes('bar')) return 2;
    return 1; // Confirmed / Received
  };

  const isOutsideOrder = trackedOrder
    ? Boolean(trackedOrder.isOutsideRoom || !trackedOrder.isLodgeGuest || !trackedOrder.roomNumber || !trackedOrder.bookingId)
    : true;

  const isDrinkOrder = trackedOrder?.orderType === 'drinks';
  const currentStage = trackedOrder ? getProgressStage(trackedOrder.orderStatus) : 0;
  const isFulfilled = currentStage === 4;
  const isPickedUp = String(trackedOrder?.orderStatus || '').toLowerCase().includes('pick');

  const buildWhatsAppInquiryUrl = () => {
    if (!trackedOrder) return 'https://wa.me/2348125786875';
    const itemsText = (trackedOrder.items || []).map((i) => `${i.qty}x ${i.name}`).join(', ');
    const msg =
      `Hello Main Reception — Arab Signature Hotel & Suites!\n` +
      `I am tracking my ${isDrinkOrder ? 'Drink' : 'Food'} Order:\n` +
      `• Booking Code: *${trackedOrder.id}*\n` +
      `• Name: ${trackedOrder.guestName}\n` +
      `• Items: ${itemsText}\n` +
      `• Service Mode: ${trackedOrder.serviceLocation}\n` +
      `• Current Status: ${trackedOrder.orderStatus}`;
    return `https://wa.me/2348125786875?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-[#120208] text-gray-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Ambient Arabesque Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#3a0417_0%,_#120208_65%)] opacity-90 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* 1. Top Navigation & Live Sync Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={() => onNavigate('dining')}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-[#f3e5ab] flex items-center gap-2 transition-all"
          >
            <ArrowLeft size={15} className="text-[#d4af37]" />
            <span>Back to Dining & Drinks Menu</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 bg-black/50 px-3.5 py-2 rounded-xl border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Reception Sync • {lastSyncedAt}</span>
            {trackedOrder && (
              <button
                type="button"
                onClick={() => syncOrderFromStore(trackedOrder.id)}
                className="ml-1 text-[#d4af37] hover:text-white"
                title="Refresh Order Status"
              >
                <RefreshCw size={13} />
              </button>
            )}
          </div>
        </div>

        {/* 2. Dedicated Order Code Injection & Search Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#230411] via-[#16030c] to-[#0d0107] border border-[#d4af37]/45 shadow-2xl space-y-4 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold">
                <Sparkles size={12} />
                OFFICIAL FOOD (ARB-FDD) & DRINK (ARB-DRK) TRACKER
              </span>
              <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white tracking-wide mt-0.5">
                Live Order Status & Pickup Pass
              </h1>
            </div>
            <span className="text-[11px] font-mono text-gray-400">
              Main Building Reception & Kitchen Dispatch
            </span>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Enter Order Code (e.g. ARB-FDD-3102GH or ARB-DRK-5318PL)"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/70 border border-[#d4af37]/45 text-sm font-mono font-bold text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <button
              type="submit"
              className={`px-7 py-3.5 rounded-2xl ${goldGradient} text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer`}
            >
              <Search size={16} />
              <span>Track Order</span>
            </button>
          </form>

          {lookupError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2.5">
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
              <span>{lookupError}</span>
            </div>
          )}
        </div>

        {/* 3. Dedicated Order Status & Full Details View */}
        {trackedOrder ? (
          <div className="space-y-6">
            {/* A. Hero Order Status & Official Booking Code Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#16030c] border-2 border-[#d4af37]/50 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border inline-flex items-center gap-1.5 ${
                        isDrinkOrder
                          ? 'bg-purple-500/20 text-purple-200 border-purple-400/40'
                          : 'bg-[#d4af37]/20 text-[#f3e5ab] border-[#d4af37]/40'
                      }`}
                    >
                      {isDrinkOrder ? <Wine size={13} /> : <Utensils size={13} />}
                      <span>{isDrinkOrder ? 'VIP Bar & Drinks (ARB-DRK)' : 'Al-Sultan Kitchen Food (ARB-FDD)'}</span>
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${
                        trackedOrder.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                      }`}
                    >
                      {trackedOrder.paymentStatus}
                    </span>

                    {isOutsideOrder ? (
                      <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/40 text-[11px] font-mono font-bold">
                        Pickup / Dining via Main Reception
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/40 text-[11px] font-mono font-bold">
                        In-Lodge Suite #{trackedOrder.roomNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap pt-1">
                    <h2 className="font-mono text-2xl sm:text-4xl font-extrabold text-[#f3e5ab] tracking-wider">
                      {trackedOrder.id}
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(trackedOrder.id)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#d4af37] hover:text-black text-xs font-mono font-bold text-[#f3e5ab] border border-[#d4af37]/40 flex items-center gap-1.5 transition-all print:hidden"
                    >
                      {copiedCode === trackedOrder.id ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedCode === trackedOrder.id ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">
                    Booked on {trackedOrder.createdAt} • Customer: <strong className="text-white">{trackedOrder.guestName}</strong>
                  </p>
                </div>

                {/* Live Status Pill */}
                <div className="p-4 rounded-2xl bg-black/60 border border-[#d4af37]/40 text-left md:text-right min-w-[220px]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                    CURRENT ORDER STATUS
                  </span>
                  <div className="mt-1 flex md:justify-end items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        currentStage === -1
                          ? 'bg-rose-500'
                          : isFulfilled
                            ? 'bg-emerald-400'
                            : 'bg-amber-400 animate-ping'
                      }`}
                    />
                    <span
                      className={`font-cinzel text-base sm:text-lg font-extrabold ${
                        currentStage === -1
                          ? 'text-rose-400'
                          : isFulfilled
                            ? 'text-emerald-300'
                            : 'text-[#f3e5ab]'
                      }`}
                    >
                      {trackedOrder.orderStatus || 'Confirmed'}
                    </span>
                  </div>
                  {trackedOrder.fulfilledAt && (
                    <span className="text-[10px] font-mono text-emerald-400 block mt-1">
                      Verified: {trackedOrder.fulfilledAt}
                    </span>
                  )}
                </div>
              </div>

              {/* B. 4-Step Visual Progress Tracker */}
              {currentStage === -1 ? (
                <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
                  <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
                  <span>This order was cancelled. Please contact the Main Building Reception Desk if you need assistance.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span>LIVE PREPARATION & PICKUP TIMELINE</span>
                    <span className="text-[#f3e5ab]">Step {currentStage} of 4</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                      {
                        step: 1,
                        title: '1. Order Confirmed',
                        desc: 'Received by Main Reception & Kitchen/Bar',
                        icon: CheckCircle2
                      },
                      {
                        step: 2,
                        title: '2. Preparing Fresh',
                        desc: isDrinkOrder ? 'Chilling & Preparing at VIP Bar' : 'Chef Cooking in Al-Sultan Kitchen',
                        icon: Flame
                      },
                      {
                        step: 3,
                        title: '3. Ready for Pickup / Serve',
                        desc: isOutsideOrder ? 'Ready at Main Building Reception' : `Dispatching to Suite #${trackedOrder.roomNumber}`,
                        icon: PackageCheck
                      },
                      {
                        step: 4,
                        title: isPickedUp ? '4. Picked Up' : '4. Delivered / Picked Up',
                        desc: isFulfilled
                          ? `${trackedOrder.orderStatus} (${trackedOrder.fulfilledAt || 'Verified'})`
                          : 'Customer Pickup at Main Reception or Table Delivery',
                        icon: Truck
                      }
                    ].map((st) => {
                      const Icon = st.icon;
                      const isDone = currentStage >= st.step;
                      const isCurrent = currentStage === st.step;
                      return (
                        <div
                          key={st.step}
                          className={`p-4 rounded-2xl border transition-all ${
                            isCurrent
                              ? 'bg-gradient-to-br from-[#3d071c] to-[#1a030c] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
                              : isDone
                                ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-200'
                                : 'bg-black/40 border-white/10 text-gray-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                isDone
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                                  : 'bg-white/5 text-gray-500 border border-white/10'
                              }`}
                            >
                              <Icon size={16} />
                            </div>
                            {isDone && (
                              <span className="text-[10px] font-mono font-bold text-emerald-400">
                                {isCurrent && st.step < 4 ? 'ACTIVE' : '✓ DONE'}
                              </span>
                            )}
                          </div>
                          <h4 className={`text-xs font-bold ${isDone ? 'text-white' : 'text-gray-400'}`}>
                            {st.title}
                          </h4>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{st.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* C. Pickup & Collection Instructions / Completion Banner */}
              {isFulfilled ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={22} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Order {trackedOrder.orderStatus} — Verified by {trackedOrder.fulfilledBy || 'Main Building Reception'}
                      </h4>
                      <p className="text-xs text-emerald-200/90 mt-0.5">
                        This order ({trackedOrder.id}) has been handed over / delivered to {trackedOrder.guestName}
                        {trackedOrder.fulfilledAt ? ` on ${trackedOrder.fulfilledAt}` : ''}. Thank you for dining with Arab Signature Hotel & Suites!
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-mono text-xs font-extrabold uppercase self-start sm:self-center">
                    ✓ {trackedOrder.orderStatus}
                  </span>
                </div>
              ) : isOutsideOrder ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#2b0614] to-[#1a030c] border border-[#d4af37]/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Building2 size={20} className="text-[#d4af37] flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#f3e5ab]">
                        Pickup & Dining Collection at Main Building Reception Desk
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Your booking has been notified to the <strong>Main Building Receptionist (600 Wing Lobby)</strong>. Please present your order code <strong className="font-mono text-white">{trackedOrder.id}</strong> at the Main Reception Desk to pick up your delivery or be seated for dining ({trackedOrder.serviceLocation}).
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#1f0410] border border-[#d4af37]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] font-bold block">
                      IN-LODGE SUITE DELIVERY • {trackedOrder.bookingId}
                    </span>
                    <span className="text-gray-200">
                      Delivering directly to <strong>Suite #{trackedOrder.roomNumber}</strong> ({trackedOrder.building})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('guest-portal')}
                    className="px-4 py-2 rounded-xl bg-[#5c0725] hover:bg-[#750930] border border-[#d4af37]/40 text-xs font-bold text-[#f3e5ab] self-start sm:self-center print:hidden"
                  >
                    Open My Suite Folio
                  </button>
                </div>
              )}

              {/* D. Customer & Service Details + Itemized Order Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
                {/* Left Column: Customer & Booking Info */}
                <div className="md:col-span-5 p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3 text-xs">
                  <h4 className="font-cinzel font-bold text-sm text-[#f3e5ab] border-b border-white/10 pb-2 flex items-center gap-2">
                    <User size={14} className="text-[#d4af37]" />
                    <span>Customer & Service Info</span>
                  </h4>

                  <div className="space-y-2.5 font-mono">
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-400">Customer Name:</span>
                      <span className="text-white font-bold text-right">{trackedOrder.guestName}</span>
                    </div>
                    {trackedOrder.phone && (
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-400">Phone / WhatsApp:</span>
                        <span className="text-gray-200 text-right">{trackedOrder.phone}</span>
                      </div>
                    )}
                    {trackedOrder.email && (
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-gray-200 text-right truncate max-w-[180px]">{trackedOrder.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-400">Service Mode:</span>
                      <span className="text-[#f3e5ab] font-bold text-right">{trackedOrder.serviceLocation}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-400">Handled By:</span>
                      <span className="text-emerald-300 font-bold text-right">
                        {isOutsideOrder ? 'Main Building Reception' : `${trackedOrder.building} Desk`}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-400">Payment Status:</span>
                      <span className={trackedOrder.paymentStatus === 'Paid' ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>
                        {trackedOrder.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-400">Payment Method:</span>
                      <span className="text-gray-300 text-right">{trackedOrder.paymentMethod}</span>
                    </div>
                    {trackedOrder.paystackReference && (
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-400">Payment Ref:</span>
                        <span className="text-gray-400 text-right">{trackedOrder.paystackReference}</span>
                      </div>
                    )}
                  </div>

                  {trackedOrder.notes && (
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200">
                      <strong className="block text-amber-300 mb-0.5">Special Order Note:</strong>
                      {trackedOrder.notes}
                    </div>
                  )}
                </div>

                {/* Right Column: Itemized Dishes / Drinks */}
                <div className="md:col-span-7 p-5 rounded-2xl bg-black/50 border border-white/10 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-cinzel font-bold text-sm text-[#f3e5ab] border-b border-white/10 pb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Receipt size={14} className="text-[#d4af37]" />
                        <span>Itemized Order Breakdown</span>
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        {(trackedOrder.items || []).reduce((s, i) => s + Number(i.qty || 1), 0)} Item(s)
                      </span>
                    </h4>

                    <div className="divide-y divide-white/10">
                      {(trackedOrder.items || []).map((item, idx) => (
                        <div key={idx} className="py-3 flex items-start justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <div className="font-bold text-white">
                              <span className="font-mono text-[#d4af37] mr-1.5">{item.qty}x</span>
                              {item.name}
                            </div>
                            {item.pairingSummary && (
                              <div className="text-[11px] text-gray-400 font-mono">{item.pairingSummary}</div>
                            )}
                            <div className="text-[10px] text-gray-500 font-mono">
                              Unit Price: ₦{Number(item.unitPrice || item.price || 0).toLocaleString()}
                            </div>
                          </div>
                          <div className="font-mono font-bold text-[#f3e5ab] text-sm">
                            ₦{Number(item.totalPrice || Number(item.unitPrice || 0) * Number(item.qty || 1)).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#d4af37]/30 flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-300 font-bold">
                      TOTAL ORDER AMOUNT
                    </span>
                    <span className="font-mono text-2xl font-extrabold text-[#f3e5ab]">
                      ₦{Number(trackedOrder.amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* E. Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 print:hidden">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white flex items-center gap-2"
                  >
                    <Printer size={14} className="text-[#d4af37]" />
                    <span>Print Order Pass</span>
                  </button>

                  <a
                    href={buildWhatsAppInquiryUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/35 border border-emerald-400/40 text-xs font-bold text-emerald-200 flex items-center gap-2"
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp Main Reception</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('dining')}
                  className={`px-5 py-2.5 rounded-xl ${goldGradient} text-xs font-extrabold uppercase tracking-wider flex items-center gap-2`}
                >
                  <Utensils size={14} />
                  <span>Book More Food & Drinks</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State when no order code is injected yet */
          <div className="p-8 sm:p-10 rounded-3xl bg-[#16030c]/90 border border-white/10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto">
              <Utensils size={24} />
            </div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
              Enter Your Food (<span className="text-[#f3e5ab] font-mono">ARB-FDD</span>) or Drink (<span className="text-[#f3e5ab] font-mono">ARB-DRK</span>) Code Above
            </h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Inject the booking code given to you after ordering to view your real-time kitchen/bar preparation status, itemized receipt, and Main Reception pickup readiness.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
