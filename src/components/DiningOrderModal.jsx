import React, { useState, useEffect } from 'react';
import {
  X, Utensils, Wine, Sparkles, CheckCircle2, AlertCircle, Building2,
  CreditCard, Plus, Minus, Trash2, Copy, Check, Printer, MessageSquare,
  ShieldCheck, KeyRound, UserCheck, Receipt, MapPin, Phone, User, Mail, ArrowRight
} from 'lucide-react';
import { portalStore } from '../data/portalStore';
import { payWithPaystack, getPaystackMode } from '../utils/paystack';
import { emailService } from '../utils/emailService';

export default function DiningOrderModal({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onNavigate
}) {
  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  // Diner Mode: 'lodge' (In-Lodge Hotel Guest -> Add to Suite Bill) | 'walkin' (Website / Lounge / Cabana / Takeout)
  const [dinerMode, setDinerMode] = useState('lodge');

  // Lodge Guest Verification State
  const [lodgeInput, setLodgeInput] = useState('');
  const [lodgePhoneVerify, setLodgePhoneVerify] = useState('');
  const [needsPhoneVerify, setNeedsPhoneVerify] = useState(false);
  const [verifiedLodge, setVerifiedLodge] = useState(null); // { booking, folio }
  const [lodgeError, setLodgeError] = useState('');
  const [lodgePaymentChoice, setLodgePaymentChoice] = useState('room_bill'); // 'room_bill' | 'pay_now'

  // Walk-In / Website Diner State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [serviceLocation, setServiceLocation] = useState('Pickup at Main Building Reception Desk');
  const [walkinPaymentChoice, setWalkinPaymentChoice] = useState('paystack'); // 'paystack' | 'counter_pos'
  const [orderNotes, setOrderNotes] = useState('');

  // Checkout & Confirmation State
  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedResult, setCompletedResult] = useState(null); // { createdOrders, totalAmount }
  const [copiedCode, setCopiedCode] = useState('');

  const paystackMode = getPaystackMode();

  // Auto-detect logged-in Guest Portal session when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setFormError('');
    setLodgeError('');

    // If active session found, auto-select lodge mode and verify
    const activeSession = portalStore.getCustomerSession();
    if (activeSession && activeSession.activeBooking && !activeSession.isCheckedOut) {
      const check = portalStore.verifyActiveLodgeGuest(activeSession.activeBooking.id);
      if (check.valid) {
        setDinerMode('lodge');
        setVerifiedLodge({ booking: check.booking, folio: check.folio });
        setLodgeInput(check.booking.id);
        setLodgePaymentChoice('room_bill');
        return;
      }
    }
    // Default to 'walkin' (Book Food & Drinks Only) so general visitors can order smoothly
    setDinerMode('walkin');
    setVerifiedLodge(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const foodItems = cartItems.filter((i) => i.type !== 'drinks');
  const drinkItems = cartItems.filter((i) => i.type === 'drinks');
  const foodSubtotal = foodItems.reduce((sum, i) => sum + Number(i.unitPrice) * Number(i.qty), 0);
  const drinkSubtotal = drinkItems.reduce((sum, i) => sum + Number(i.unitPrice) * Number(i.qty), 0);
  const grandTotal = foodSubtotal + drinkSubtotal;

  const handleVerifyLodgeGuest = (e) => {
    if (e) e.preventDefault();
    setLodgeError('');
    setFormError('');

    const result = portalStore.verifyActiveLodgeGuest(lodgeInput, lodgePhoneVerify);
    if (!result.valid) {
      if (result.needsPhoneForRoom) {
        setNeedsPhoneVerify(true);
      }
      setVerifiedLodge(null);
      setLodgeError(result.error);
      return;
    }

    setNeedsPhoneVerify(false);
    setVerifiedLodge({ booking: result.booking, folio: result.folio });
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2200);
  };

  const finalizeOrderCreation = ({
    paymentStatus,
    paymentMethod,
    paystackReference = null,
    chargeToRoom = false
  }) => {
    const isLodge = dinerMode === 'lodge' && Boolean(verifiedLodge?.booking);
    const activeBooking = verifiedLodge?.booking;

    const normalizedItems = cartItems.map((item) => ({
      id: item.id,
      name: item.displayName || item.name,
      qty: Number(item.qty) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      totalPrice: (Number(item.unitPrice) || 0) * (Number(item.qty) || 1),
      type: item.type === 'drinks' ? 'drinks' : 'food',
      pairingSummary: item.pairingSummary || ''
    }));

    const meta = isLodge
      ? {
          guestName: activeBooking.guestName,
          phone: activeBooking.phone || '',
          email: activeBooking.email || '',
          isLodgeGuest: true,
          bookingId: activeBooking.id,
          roomNumber: activeBooking.roomNumber,
          building:
            activeBooking.building ||
            (String(activeBooking.roomNumber || '').startsWith('1') ? 'Extension Building' : 'Main Building'),
          serviceLocation: `Suite #${activeBooking.roomNumber} (${
            String(activeBooking.roomNumber || '').startsWith('1') ? 'Extension Wing' : 'Main Building'
          })`,
          chargeToRoom,
          paymentStatus,
          paymentMethod,
          paystackReference,
          notes: orderNotes.trim(),
          source: 'Website Lodge Bill Order'
        }
      : {
          guestName: guestName.trim(),
          phone: guestPhone.trim(),
          email: guestEmail.trim(),
          isLodgeGuest: false,
          bookingId: null,
          roomNumber: null,
          building: 'Al-Sultan Restaurant & Lounge',
          serviceLocation,
          chargeToRoom: false,
          paymentStatus,
          paymentMethod,
          paystackReference,
          notes: orderNotes.trim(),
          source: 'Direct Website Dining'
        };

    const result = portalStore.placeCombinedCartOrder(normalizedItems, meta);
    if (result?.createdOrders?.[0]?.id) {
      portalStore.setTrackedDiningOrderCode(result.createdOrders[0].id);
    }

    // Send Dining & Bar Order Confirmation Email via Resend
    if (meta.email && result?.createdOrders?.length > 0) {
      emailService.sendDiningOrderEmail({
        ...meta,
        createdOrders: result.createdOrders,
        totalAmount: result.totalAmount
      }).catch(err => console.warn('[Dining Order Email Warning]:', err));
    }

    setCompletedResult(result);
    setIsProcessing(false);
    if (onClearCart) onClearCart();
  };

  const handleSubmitOrder = async (useInstantDemoPay = false) => {
    setFormError('');
    if (cartItems.length === 0) {
      setFormError('Your dining & drinks tray is empty. Please add at least one item.');
      return;
    }

    // 1. IN-LODGE GUEST FLOW
    if (dinerMode === 'lodge') {
      if (!verifiedLodge?.booking) {
        setFormError('Please verify your active Suite Booking Code (ARS-BGD-... or ARS-EXT-...) first.');
        return;
      }

      // Re-verify booking hasn't checked out right now
      const freshCheck = portalStore.verifyActiveLodgeGuest(verifiedLodge.booking.id);
      if (!freshCheck.valid) {
        setVerifiedLodge(null);
        setFormError(freshCheck.error);
        return;
      }

      if (lodgePaymentChoice === 'room_bill') {
        setIsProcessing(true);
        finalizeOrderCreation({
          chargeToRoom: true,
          paymentStatus: 'Added to Room Bill',
          paymentMethod: 'Room Bill (Unsettled)'
        });
        return;
      }

      // Lodge guest chose to pay immediately online
      if (useInstantDemoPay) {
        setIsProcessing(true);
        finalizeOrderCreation({
          chargeToRoom: false,
          paymentStatus: 'Paid',
          paymentMethod: 'Paystack Online (Instant Verified)',
          paystackReference: `ASH-DIN-DEMO-${Date.now().toString(36).toUpperCase()}`
        });
        return;
      }

      setIsProcessing(true);
      await payWithPaystack({
        email: verifiedLodge.booking.email || 'guest@arabsignature.com',
        amount: grandTotal,
        guestName: verifiedLodge.booking.guestName,
        guestPhone: verifiedLodge.booking.phone,
        roomName: `Dining & Drinks (${verifiedLodge.booking.id})`,
        onSuccess: (res) => {
          finalizeOrderCreation({
            chargeToRoom: false,
            paymentStatus: 'Paid',
            paymentMethod: 'Paystack (Online Verified)',
            paystackReference: res.reference
          });
        },
        onClose: () => setIsProcessing(false),
        onError: (err) => {
          setIsProcessing(false);
          setFormError(err.message || 'Unable to launch Paystack checkout.');
        }
      });
      return;
    }

    // 2. WEBSITE / LOUNGE / WALK-IN DINER FLOW
    if (!guestName.trim() || guestName.trim().length < 2) {
      setFormError('Please enter your full name for your Dining / Drink Booking Pass.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.replace(/[^0-9]/g, '').length < 7) {
      setFormError('Please enter a valid phone / WhatsApp number.');
      return;
    }

    // Food orders strictly require instant online payment (no counter POS)
    if (foodItems.length > 0 && walkinPaymentChoice === 'counter_pos') {
      setFormError('Kitchen Policy: Fresh food orders require confirmed online payment. Pay on counter POS is only allowed for bar drinks or when charged to a verified in-lodge suite bill.');
      return;
    }

    if (walkinPaymentChoice === 'counter_pos') {
      setIsProcessing(true);
      finalizeOrderCreation({
        chargeToRoom: false,
        paymentStatus: 'Pending Counter POS',
        paymentMethod: 'Restaurant / Bar POS on Arrival'
      });
      return;
    }

    if (useInstantDemoPay) {
      setIsProcessing(true);
      finalizeOrderCreation({
        chargeToRoom: false,
        paymentStatus: 'Paid',
        paymentMethod: 'Paystack Online (Instant Verified)',
        paystackReference: `ASH-DIN-DEMO-${Date.now().toString(36).toUpperCase()}`
      });
      return;
    }

    setIsProcessing(true);
    await payWithPaystack({
      email: guestEmail.trim() || 'diner@arabsignature.com',
      amount: grandTotal,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      roomName: `Al-Sultan Dining & VIP Bar (${serviceLocation})`,
      onSuccess: (res) => {
        finalizeOrderCreation({
          chargeToRoom: false,
          paymentStatus: 'Paid',
          paymentMethod: 'Paystack (Online Verified)',
          paystackReference: res.reference
        });
      },
      onClose: () => setIsProcessing(false),
      onError: (err) => {
        setIsProcessing(false);
        setFormError(err.message || 'Unable to launch Paystack checkout.');
      }
    });
  };

  const handleCloseAll = () => {
    setCompletedResult(null);
    setFormError('');
    onClose();
  };

  const buildWhatsAppDispatchUrl = () => {
    if (!completedResult?.createdOrders?.length) return 'https://wa.me/2348125786875';
    const codes = completedResult.createdOrders.map((o) => o.id).join(' & ');
    const first = completedResult.createdOrders[0];
    const allItemsText = completedResult.createdOrders
      .flatMap((o) => o.items.map((i) => `• ${i.qty}x ${i.name} (₦${Number(i.totalPrice).toLocaleString()}) [${o.id}]`))
      .join('\n');

    const msg = `Hello Arab Signature Kitchen & VIP Bar!\n\nBooking Code(s): *${codes}*\nGuest: *${first.guestName}*\nService Location: *${first.serviceLocation}*${
      first.bookingId ? `\nLinked Suite Code: *${first.bookingId}*` : ''
    }\nBilling Status: *${first.paymentStatus}*\n\nOrder Summary:\n${allItemsText}\n\nTotal: *₦${Number(completedResult.totalAmount).toLocaleString()}*`;

    return `https://wa.me/2348125786875?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#16020b] border border-[#d4af37]/45 shadow-2xl text-gray-100 my-auto max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2c0414] via-[#1b030d] to-[#140209] border-b border-[#d4af37]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              {drinkItems.length > 0 && foodItems.length === 0 ? <Wine size={20} /> : <Utensils size={20} />}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block">
                AL-SULTAN KITCHEN & VIP BOTTLE SERVICE
              </span>
              <h3 className="font-cinzel text-lg sm:text-xl font-extrabold text-white">
                {completedResult ? 'Official Food & Drink Booking Pass' : 'Book Food & Drinks'}
              </h3>
            </div>
          </div>

          <button
            onClick={handleCloseAll}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {completedResult ? (
            /* ============================================================
               CONFIRMATION PASS VIEW (SHOWS ARB-FDD-... & ARB-DRK-...)
               ============================================================ */
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-emerald-950/35 border border-emerald-400/40 text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h4 className="font-cinzel text-xl sm:text-2xl font-extrabold text-white">
                  {completedResult.createdOrders[0]?.chargeToRoom
                    ? 'Added Directly to Your Suite Bill!'
                    : 'Food & Drink Booking Confirmed!'}
                </h4>
                <p className="text-xs text-gray-300 max-w-lg mx-auto">
                  {completedResult.createdOrders[0]?.chargeToRoom
                    ? `Your order has been linked to Suite #${completedResult.createdOrders[0]?.roomNumber} (${completedResult.createdOrders[0]?.bookingId}) and reflected on your Guest Portal, Reception & Accountant folios.`
                    : 'Present your unique booking code(s) below at Al-Sultan Restaurant, VIP Bar Lounge, or Front Desk.'}
                </p>
              </div>

              {/* Generated Official Booking Codes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedResult.createdOrders.map((order) => {
                  const isDrink = order.orderType === 'drinks';
                  return (
                    <div
                      key={order.id}
                      className={`p-5 rounded-2xl border shadow-xl space-y-3 ${
                        completedResult.createdOrders.length === 1 ? 'sm:col-span-2' : ''
                      } ${
                        isDrink
                          ? 'bg-gradient-to-br from-[#2b0618] to-[#130209] border-purple-400/40'
                          : 'bg-gradient-to-br from-[#2b0812] to-[#130209] border-[#d4af37]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/50 border border-white/15 text-[#f3e5ab]">
                          {isDrink ? <Wine size={12} className="text-purple-300" /> : <Utensils size={12} className="text-[#d4af37]" />}
                          {isDrink ? 'Drink Booking Code (ARB-DRK)' : 'Food Booking Code (ARB-FDD)'}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                            order.paymentStatus === 'Paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                              : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 bg-black/60 px-4 py-3.5 rounded-xl border border-[#d4af37]/40">
                        <div>
                          <span className="text-[10px] font-mono text-gray-400 block">OFFICIAL BOOKING CODE</span>
                          <span className="font-mono text-xl sm:text-2xl font-extrabold tracking-wider text-[#f3e5ab]">
                            {order.id}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(order.id)}
                          className="px-3.5 py-2 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37] hover:text-black text-[#f3e5ab] border border-[#d4af37]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                        >
                          {copiedCode === order.id ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedCode === order.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Order Items Breakdown */}
                      <div className="space-y-1.5 pt-1 text-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-2 text-gray-300">
                            <span>
                              <strong className="text-white">{it.qty}x</strong> {it.name}
                            </span>
                            <span className="font-mono text-[#f3e5ab] font-semibold">
                              ₦{Number(it.totalPrice).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between font-bold">
                          <span className="text-gray-400 font-mono text-[11px]">SUBTOTAL</span>
                          <span className="font-mono text-sm text-[#d4af37]">
                            ₦{Number(order.amount).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Updated Suite Folio Summary if Charged to Room */}
              {completedResult.createdOrders[0]?.bookingId && (
                <div className="p-4 rounded-2xl bg-[#1f0410] border border-[#d4af37]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] font-bold block">
                      UPDATED SUITE FOLIO • {completedResult.createdOrders[0].bookingId}
                    </span>
                    <span className="text-gray-200">
                      Guest: <strong>{completedResult.createdOrders[0].guestName}</strong> • Suite #{completedResult.createdOrders[0].roomNumber}
                    </span>
                  </div>
                  <div className="text-left sm:text-right font-mono">
                    <span className="text-[10px] text-gray-400 block">Outstanding Suite + Dining Balance</span>
                    <span className="text-base font-extrabold text-amber-300">
                      ₦{Number(portalStore.getBookingFolioSummary(completedResult.createdOrders[0].bookingId).balanceDue).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white flex items-center gap-2"
                  >
                    <Printer size={14} className="text-[#d4af37]" />
                    <span>Print Pass</span>
                  </button>
                  <a
                    href={buildWhatsAppDispatchUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/35 border border-emerald-400/40 text-xs font-bold text-emerald-200 flex items-center gap-2"
                  >
                    <MessageSquare size={14} />
                    <span>Notify Kitchen / Bar on WhatsApp</span>
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {onNavigate && completedResult.createdOrders[0]?.id && (
                    <button
                      onClick={() => {
                        portalStore.setTrackedDiningOrderCode(completedResult.createdOrders[0].id);
                        handleCloseAll();
                        onNavigate('track-order');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
                    >
                      <Sparkles size={14} />
                      <span>Track Order Status Page</span>
                    </button>
                  )}
                  {completedResult.createdOrders[0]?.bookingId && onNavigate && (
                    <button
                      onClick={() => {
                        handleCloseAll();
                        onNavigate('guest-portal');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#5c0725] hover:bg-[#750930] border border-[#d4af37]/50 text-xs font-bold text-[#f3e5ab] flex items-center gap-1.5"
                    >
                      <Receipt size={14} />
                      <span>View My Suite Bill</span>
                    </button>
                  )}
                  <button
                    onClick={handleCloseAll}
                    className={`px-6 py-2.5 rounded-xl ${goldGradient} text-xs font-extrabold uppercase tracking-wider`}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================
               ACTIVE ORDER CONFIGURATION & GUEST MATCHING VIEW
               ============================================================ */
            <>
              {/* 1. TRAY ITEMS REVIEW (Separates Food ARB-FDD & Drinks ARB-DRK) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#f3e5ab] font-bold flex items-center gap-2">
                    <Sparkles size={13} className="text-[#d4af37]" />
                    1. Your Selected Food & Drinks ({cartItems.reduce((s, i) => s + i.qty, 0)} items)
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    {foodItems.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f3e5ab]">
                        {foodItems.reduce((s, i) => s + i.qty, 0)} Kitchen Dish{foodItems.length > 1 ? 'es' : ''}
                      </span>
                    )}
                    {drinkItems.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200">
                        {drinkItems.reduce((s, i) => s + i.qty, 0)} Chilled Drink{drinkItems.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center text-xs text-gray-400">
                    Your order tray is empty. Select delicious dishes or chilled drinks from the catalog first.
                  </div>
                ) : (
                  <div className="rounded-2xl bg-black/45 border border-white/10 divide-y divide-white/10 max-h-56 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.cartKey} className="p-3.5 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                                item.type === 'drinks'
                                  ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                                  : 'bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/30'
                              }`}
                            >
                              {item.type === 'drinks' ? 'ARB-DRK' : 'ARB-FDD'}
                            </span>
                            <h5 className="text-xs sm:text-sm font-bold text-white truncate">
                              {item.displayName || item.name}
                            </h5>
                          </div>
                          {item.pairingSummary && (
                            <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">
                              {item.pairingSummary}
                            </p>
                          )}
                          <span className="text-[11px] font-mono text-[#d4af37]">
                            ₦{Number(item.unitPrice).toLocaleString()} each
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-white/5 rounded-xl px-1.5 py-1 border border-white/15">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.cartKey, -1)}
                              className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-300"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-xs font-mono font-bold text-white">{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.cartKey, 1)}
                              className="w-6 h-6 rounded-lg bg-[#d4af37] text-black hover:bg-[#f3e5ab] flex items-center justify-center"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div className="w-20 text-right font-mono text-xs font-bold text-[#f3e5ab]">
                            ₦{(Number(item.unitPrice) * Number(item.qty)).toLocaleString()}
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartKey)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. PROMINENT ORDER SELECTION & BILLING GUIDE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#240312] via-[#16030c] to-[#0c0106] border border-[#d4af37]/45 shadow-xl space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#d4af37]" />
                    <h4 className="font-cinzel text-sm sm:text-base font-bold text-white tracking-wide">
                      2. Choose Your Booking & Billing Option
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#f3e5ab] bg-[#d4af37]/15 px-2.5 py-0.5 rounded-full border border-[#d4af37]/30 self-start sm:self-auto">
                    Important Order Guide
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  Anyone can order fresh food and chilled drinks directly from our website. <strong className="text-[#f3e5ab]">Charging to a room bill is strictly reserved for guests currently lodged in our hotel suites</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option A: Book Food & Drinks Only */}
                  <button
                    type="button"
                    onClick={() => {
                      setDinerMode('walkin');
                      setFormError('');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      dinerMode === 'walkin'
                        ? 'bg-gradient-to-br from-[#40071e] to-[#1c030d] border-[#d4af37] shadow-lg shadow-[#d4af37]/25 ring-1 ring-[#d4af37]'
                        : 'bg-black/40 border-white/10 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#f3e5ab]">
                        <Utensils size={15} className="text-[#d4af37]" />
                        Book Food & Drinks Only
                      </span>
                      {dinerMode === 'walkin' ? (
                        <CheckCircle2 size={16} className="text-[#d4af37]" />
                      ) : (
                        <span className="text-[10px] font-mono text-gray-400">Open to All</span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      <strong>For non-lodging visitors, restaurant dine-in, VIP lounge, pool cabana, or takeout.</strong> Order your food and pay securely online via Paystack. No room reservation required!
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <span>✓ Instant online checkout (Paystack Card / Transfer / USSD)</span>
                    </div>
                  </button>

                  {/* Option B: Add to Suite Bill (In-Lodge Only) */}
                  <button
                    type="button"
                    onClick={() => {
                      setDinerMode('lodge');
                      setFormError('');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      dinerMode === 'lodge'
                        ? 'bg-gradient-to-br from-[#40071e] to-[#1c030d] border-[#d4af37] shadow-lg shadow-[#d4af37]/25 ring-1 ring-[#d4af37]'
                        : 'bg-black/40 border-white/10 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#f3e5ab]">
                        <Building2 size={15} className="text-[#d4af37]" />
                        Add to Suite Bill (Lodged Only)
                      </span>
                      {dinerMode === 'lodge' ? (
                        <CheckCircle2 size={16} className="text-[#d4af37]" />
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f3e5ab] text-[9px] font-mono font-bold">
                          Lodged Guests
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      <strong>STRICTLY for residents currently staying in a suite (Rooms 601–620 or 101–114).</strong> Match your Suite Booking Code (<span className="text-[#f3e5ab] font-mono">ARS-BGD / EXT</span>) or room number to charge this order to your suite folio and settle at checkout.
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-amber-300 flex items-center gap-1">
                      <span>⚠ Requires verified active room reservation</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. MODE-SPECIFIC DETAILS */}
              {dinerMode === 'lodge' ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#1d040f] border border-[#d4af37]/35 space-y-4">
                  {verifiedLodge?.booking ? (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-950/35 border border-emerald-400/40">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
                            <UserCheck size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-extrabold text-white">
                                {verifiedLodge.booking.guestName}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                                Active Lodge Stay Matched
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-gray-300 mt-0.5">
                              Suite #{verifiedLodge.booking.roomNumber} ({verifiedLodge.booking.roomName}) • Code:{' '}
                              <strong className="text-[#f3e5ab]">{verifiedLodge.booking.id}</strong>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setVerifiedLodge(null);
                            setLodgeInput('');
                          }}
                          className="text-[11px] font-mono text-amber-300 hover:underline self-end sm:self-center"
                        >
                          Change Suite
                        </button>
                      </div>

                      {/* Live Room Bill Preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                          <span className="text-[10px] text-gray-400 block">CURRENT UNPAID BILL</span>
                          <span className="text-sm font-bold text-gray-200">
                            ₦{Number(verifiedLodge.folio.balanceDue).toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/50 border border-[#d4af37]/30">
                          <span className="text-[10px] text-[#d4af37] block">+ THIS FOOD/DRINK ORDER</span>
                          <span className="text-sm font-bold text-[#f3e5ab]">
                            +₦{grandTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#2a0614] border border-amber-400/40">
                          <span className="text-[10px] text-amber-300 block">NEW SUITE BILL BALANCE</span>
                          <span className="text-sm font-extrabold text-amber-200">
                            ₦{
                              (
                                Number(verifiedLodge.folio.balanceDue) +
                                (lodgePaymentChoice === 'room_bill' ? grandTotal : 0)
                              ).toLocaleString()
                            }
                          </span>
                        </div>
                      </div>

                      {/* Settlement Option for Lodge Guest */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setLodgePaymentChoice('room_bill')}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                            lodgePaymentChoice === 'room_bill'
                              ? 'bg-[#3b071b] border-[#d4af37] text-white font-bold'
                              : 'bg-black/40 border-white/10 text-gray-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Receipt size={15} className="text-[#d4af37]" />
                            Add to My Suite Bill
                          </span>
                          {lodgePaymentChoice === 'room_bill' && <CheckCircle2 size={15} className="text-[#d4af37]" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setLodgePaymentChoice('pay_now')}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                            lodgePaymentChoice === 'pay_now'
                              ? 'bg-[#3b071b] border-[#d4af37] text-white font-bold'
                              : 'bg-black/40 border-white/10 text-gray-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <CreditCard size={15} className="text-emerald-400" />
                            Pay Immediately Online
                          </span>
                          {lodgePaymentChoice === 'pay_now' && <CheckCircle2 size={15} className="text-emerald-400" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyLodgeGuest} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#f3e5ab] flex items-center gap-1.5">
                          <KeyRound size={14} className="text-[#d4af37]" />
                          Enter Your Suite Booking Code (or 3-Digit Room #)
                        </label>
                        <span className="text-[10px] font-mono text-gray-400">
                          e.g. ARS-EXT-9421XK or ARS-BGD-6204NW
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <input
                          type="text"
                          value={lodgeInput}
                          onChange={(e) => setLodgeInput(e.target.value.toUpperCase())}
                          placeholder="ARS-EXT-9421XK or Room 107"
                          className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-[#d4af37]/40 text-sm font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                        />
                        {needsPhoneVerify && (
                          <input
                            type="tel"
                            value={lodgePhoneVerify}
                            onChange={(e) => setLodgePhoneVerify(e.target.value)}
                            placeholder="Registered Guest Phone #"
                            className="sm:w-52 px-4 py-3 rounded-xl bg-black/60 border border-amber-400/50 text-xs font-mono text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                          />
                        )}
                        <button
                          type="submit"
                          className={`px-5 py-3 rounded-xl ${goldGradient} text-xs font-extrabold uppercase tracking-wider whitespace-nowrap shadow-lg`}
                        >
                          Verify Suite
                        </button>
                      </div>

                      {lodgeError && (
                        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2">
                          <AlertCircle size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
                          <span>{lodgeError}</span>
                        </div>
                      )}
                    </form>
                  )}

                  {/* Special Kitchen / Room Delivery Instructions */}
                  <div>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Optional delivery note (e.g. Extra ice buckets, less spicy, serve by 8:30 PM)..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/45 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>
              ) : (
                /* WALK-IN / WEBSITE DINER FORM */
                <div className="p-4 sm:p-5 rounded-2xl bg-[#1d040f] border border-[#d4af37]/35 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-gray-300 block mb-1">Full Name *</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Chief / Engr. / Mrs. Name"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-gray-300 block mb-1">Phone / WhatsApp *</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+234 803 000 0000"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-gray-300 block mb-1">Email (for Receipt)</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="guest@email.com"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-gray-300 block mb-1">Pickup or Dining Mode</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af37]" />
                        <select
                          value={serviceLocation}
                          onChange={(e) => setServiceLocation(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                        >
                          <option value="Pickup at Main Building Reception Desk">Pickup at Main Building Reception Desk</option>
                          <option value="Al-Sultan Dining Hall (Dine-In)">Al-Sultan Dining Hall (Dine-In)</option>
                          <option value="VIP Executive Bar Lounge">VIP Executive Bar Lounge</option>
                          <option value="Poolside VIP Cabana">Poolside VIP Cabana</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Walk-in Payment Method */}
                  {foodItems.length > 0 ? (
                    <div className="space-y-2">
                      <div className="p-3.5 rounded-xl bg-[#3b071b] border border-[#d4af37] text-white flex items-center justify-between text-xs font-bold shadow-md">
                        <span className="flex items-center gap-2">
                          <CreditCard size={16} className="text-emerald-400" />
                          Pay Online via Paystack (Instant Card / Bank Transfer / USSD)
                        </span>
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[11px] flex items-center gap-2">
                        <ShieldCheck size={14} className="text-amber-400 flex-shrink-0" />
                        <span>
                          <strong>Kitchen Policy:</strong> Fresh food preparation commences once online payment is confirmed. (Counter POS is disabled for outside food orders).
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setWalkinPaymentChoice('paystack')}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          walkinPaymentChoice === 'paystack'
                            ? 'bg-[#3b071b] border-[#d4af37] text-white font-bold'
                            : 'bg-black/40 border-white/10 text-gray-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <CreditCard size={15} className="text-emerald-400" />
                          Pay Now Online (Paystack)
                        </span>
                        {walkinPaymentChoice === 'paystack' && <CheckCircle2 size={15} className="text-emerald-400" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setWalkinPaymentChoice('counter_pos')}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          walkinPaymentChoice === 'counter_pos'
                            ? 'bg-[#3b071b] border-[#d4af37] text-white font-bold'
                            : 'bg-black/40 border-white/10 text-gray-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck size={15} className="text-[#d4af37]" />
                          Pay at Bar Counter POS
                        </span>
                        {walkinPaymentChoice === 'counter_pos' && <CheckCircle2 size={15} className="text-[#d4af37]" />}
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Optional chef / bartender note (e.g. Arrival time 7:00 PM, chilled glasses)..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/45 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              )}

              {formError && (
                <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2.5">
                  <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Checkout Bar */}
        {!completedResult && (
          <div className="px-6 py-4 bg-[#100107] border-t border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
                {foodSubtotal > 0 && <span>Food (ARB-FDD): ₦{foodSubtotal.toLocaleString()}</span>}
                {drinkSubtotal > 0 && <span>Drinks (ARB-DRK): ₦{drinkSubtotal.toLocaleString()}</span>}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-gray-400 font-mono">TOTAL:</span>
                <span className="font-mono text-2xl font-extrabold text-[#f3e5ab]">
                  ₦{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Instant Simulated Payment helper when online payment is selected in Test Mode */}
              {paystackMode.isTest &&
                ((dinerMode === 'lodge' && lodgePaymentChoice === 'pay_now' && verifiedLodge?.booking) ||
                  (dinerMode === 'walkin' && walkinPaymentChoice === 'paystack')) && (
                  <button
                    type="button"
                    disabled={isProcessing || cartItems.length === 0}
                    onClick={() => handleSubmitOrder(true)}
                    className="px-4 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-400/40 text-emerald-200 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    Instant Demo Pay
                  </button>
                )}

              <button
                type="button"
                disabled={isProcessing || cartItems.length === 0}
                onClick={() => handleSubmitOrder(false)}
                className={`px-6 py-3.5 rounded-xl ${goldGradient} font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 disabled:opacity-50`}
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : dinerMode === 'lodge' && lodgePaymentChoice === 'room_bill' ? (
                  <>
                    <Receipt size={15} />
                    <span>Add ₦{grandTotal.toLocaleString()} to Suite Bill</span>
                    <ArrowRight size={14} />
                  </>
                ) : (dinerMode === 'walkin' && walkinPaymentChoice === 'counter_pos') ? (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Generate Booking Code</span>
                    <ArrowRight size={14} />
                  </>
                ) : (
                  <>
                    <CreditCard size={15} />
                    <span>Pay ₦{grandTotal.toLocaleString()} & Get Code</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
