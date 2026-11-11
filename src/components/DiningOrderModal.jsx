import React, { useState, useEffect, useRef } from 'react';
import PaymentConfirmationBox from './PaymentConfirmationBox';
import {
  X, Utensils, Wine, Sparkles, CheckCircle2, AlertCircle, Building2,
  CreditCard, Plus, Minus, Trash2, Copy, Check, Printer, MessageSquare,
  ShieldCheck, MapPin, Phone, User, Mail, ArrowRight, BellRing
} from 'lucide-react';
import { portalStore } from '../data/portalStore';
import { payWithPaystack, calculatePaystackPassThrough } from '../utils/paystack';
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

  // Diner & Delivery State (Strictly Immediate Online Payment via Paystack)
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [serviceLocation, setServiceLocation] = useState('Pickup at Main Building Reception Desk');
  const [deliveryRoomNumber, setDeliveryRoomNumber] = useState('');
  const [linkedBookingId, setLinkedBookingId] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');

  // Checkout & Confirmation State
  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedResult, setCompletedResult] = useState(null); // { createdOrders, totalAmount }
  const [copiedCode, setCopiedCode] = useState('');
  const [vatAgreed, setVatAgreed] = useState(false);
  const [vatError, setVatError] = useState(false);
  const vatBoxRef = useRef(null);

  // Auto-prefill guest details if logged into Guest Portal session (still requires 100% immediate Paystack payment)
  useEffect(() => {
    if (!isOpen) return;
    setFormError('');
    setVatAgreed(false);
    setVatError(false);

    const activeSession = portalStore.getCustomerSession();
    if (activeSession && activeSession.activeBooking && !activeSession.isCheckedOut) {
      const b = activeSession.activeBooking;
      setGuestName((prev) => prev || b.guestName || '');
      setGuestPhone((prev) => prev || b.phone || '');
      setGuestEmail((prev) => prev || b.email || '');
      if (b.roomNumber && b.roomNumber !== 'Unassigned') {
        setDeliveryRoomNumber(String(b.roomNumber));
        setServiceLocation('In-Room Suite Delivery');
      }
      setLinkedBookingId(b.id || null);
    } else {
      setLinkedBookingId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const foodItems = cartItems.filter((i) => i.type !== 'drinks');
  const drinkItems = cartItems.filter((i) => i.type === 'drinks');
  const foodSubtotal = foodItems.reduce((sum, i) => sum + Number(i.unitPrice) * Number(i.qty), 0);
  const drinkSubtotal = drinkItems.reduce((sum, i) => sum + Number(i.unitPrice) * Number(i.qty), 0);
  const grandTotal = foodSubtotal + drinkSubtotal;
  const paymentBreakdown = calculatePaystackPassThrough(grandTotal);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2200);
  };

  const finalizeOrderCreation = ({
    paymentStatus,
    paymentMethod,
    paystackReference = null
  }) => {
    const normalizedItems = cartItems.map((item) => ({
      id: item.id,
      name: item.displayName || item.name,
      qty: Number(item.qty) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      totalPrice: (Number(item.unitPrice) || 0) * (Number(item.qty) || 1),
      type: item.type === 'drinks' ? 'drinks' : 'food',
      pairingSummary: item.pairingSummary || ''
    }));

    const isSuiteDelivery = serviceLocation === 'In-Room Suite Delivery' && deliveryRoomNumber.trim();
    const cleanRoom = deliveryRoomNumber.trim();
    const resolvedLocation = isSuiteDelivery
      ? `Suite #${cleanRoom} Delivery (${cleanRoom.startsWith('1') ? 'Extension Wing' : 'Main Building'})`
      : serviceLocation;

    const meta = {
      guestName: guestName.trim(),
      phone: guestPhone.trim(),
      email: guestEmail.trim(),
      isLodgeGuest: Boolean(isSuiteDelivery),
      bookingId: linkedBookingId || null,
      roomNumber: isSuiteDelivery ? cleanRoom : null,
      building: isSuiteDelivery
        ? (cleanRoom.startsWith('1') ? 'Extension Building' : 'Main Building')
        : 'Al-Sultan Restaurant & Lounge',
      serviceLocation: resolvedLocation,
      chargeToRoom: false,
      paymentStatus,
      paymentMethod,
      paystackReference,
      taxAndVatFee: paymentBreakdown.taxAndVatFee,
      totalPaidWithTaxVat: paymentBreakdown.grossAmount,
      notes: orderNotes.trim(),
      source: 'Direct Website Paystack Order'
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

  const handleSubmitOrder = async () => {
    setFormError('');
    if (cartItems.length === 0) {
      setFormError('Your dining & drinks tray is empty. Please add at least one item.');
      return;
    }

    if (!guestName.trim() || guestName.trim().length < 2) {
      setFormError('Please enter your full name for your Official Order Code.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.replace(/[^0-9]/g, '').length < 7) {
      setFormError('Please enter a valid phone / WhatsApp number.');
      return;
    }
    if (serviceLocation === 'In-Room Suite Delivery' && !deliveryRoomNumber.trim()) {
      setFormError('Please enter your Suite / Room Number (e.g. 601 or 105) for room delivery.');
      return;
    }
    if (!vatAgreed) {
      setVatError(true);
      setFormError('Please tick the Tax & VAT agreement checkbox above before launching Paystack.');
      vatBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Immediate Online Payment via Paystack Only
    setIsProcessing(true);
    await payWithPaystack({
      email: guestEmail.trim() || `${guestPhone.replace(/[^0-9]/g, '')}@arabsignature.com`,
      amount: paymentBreakdown.grossAmount,
      listedAmount: grandTotal,
      taxAndVatFee: paymentBreakdown.taxAndVatFee,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      roomName: `Al-Sultan Dining & Drinks (${serviceLocation})`,
      onSuccess: (res) => {
        finalizeOrderCreation({
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

    const msg = `Hello Arab Signature Kitchen & VIP Bar!\n\nOrder Code(s): *${codes}*\nGuest: *${first.guestName}*\nService Location: *${first.serviceLocation}*\nPayment Status: *Paid Online via Paystack*\n\nOrder Summary:\n${allItemsText}\n\nTotal Paid: *₦${Number(completedResult.totalAmount).toLocaleString()}*`;

    return `https://wa.me/2348125786875?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#16020b] border border-[#d4af37]/45 shadow-2xl text-gray-100 my-auto max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#2c0414] via-[#1b030d] to-[#140209] border-b border-[#d4af37]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              {drinkItems.length > 0 && foodItems.length === 0 ? <Wine size={20} /> : <Utensils size={20} />}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block">
                AL-SULTAN KITCHEN & VIP BOTTLE SERVICE
              </span>
              <h3 className="font-cinzel text-lg sm:text-xl font-extrabold text-white">
                {completedResult ? 'Official Paid Order Pass' : 'Order Food & Drinks Online'}
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {completedResult ? (
            /* ============================================================
               CONFIRMATION PASS VIEW (SHOWS ARB-FDD-... & ARB-DRK-...)
               ============================================================ */
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#2c0515] via-[#1b030e] to-[#120208] border-2 border-[#d4af37] text-center space-y-3 shadow-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Paystack Payment Verified • Order Confirmed!</span>
                </div>
                <h4 className="font-cinzel text-xl sm:text-2xl font-extrabold text-white">
                  Food &amp; Drink Order Confirmed!
                </h4>
                
                {/* Prominent Front Desk Instruction Alert Box */}
                <div className="p-4 rounded-xl bg-black/80 border border-[#d4af37]/60 space-y-2 max-w-xl mx-auto shadow-inner">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-extrabold flex items-center justify-center gap-1.5">
                    <BellRing size={15} className="text-amber-400 animate-bounce" />
                    <span>PLEASE GIVE THIS ORDER CODE TO THE FRONT DESK</span>
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    Present your unique <strong className="text-white font-mono uppercase">Order Code</strong> below to the Front Desk receptionists upon arrival or order pickup.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/70 py-1.5 px-3 rounded-lg border border-emerald-500/35">
                    🔔 Front Desk Alert Active: The Front Desk is reminded every 2 minutes until your order is marked Ready!
                  </div>
                </div>
              </div>

              {/* Generated Official Order Codes */}
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
                          {isDrink ? 'Drink Order Code (ARB-DRK)' : 'Food Order Code (ARB-FDD)'}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-400/40">
                          Paid Online (Paystack)
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 bg-black/60 px-4 py-3.5 rounded-xl border border-[#d4af37]/40">
                        <div>
                          <span className="text-[10px] font-mono text-gray-400 block">OFFICIAL ORDER CODE • GIVE TO FRONT DESK</span>
                          <span className="font-mono text-xl sm:text-2xl font-extrabold tracking-wider text-[#f3e5ab]">
                            {order.id}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(order.id)}
                          className="px-3.5 py-2 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37] hover:text-black text-[#f3e5ab] border border-[#d4af37]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {copiedCode === order.id ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedCode === order.id ? 'Copied' : 'Copy Code'}</span>
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
                          <span className="text-gray-400 font-mono text-[11px]">PAID VIA PAYSTACK</span>
                          <span className="font-mono text-sm text-[#d4af37]">
                            ₦{Number(order.amount).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

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
                      <span>Track Order Status</span>
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
               ACTIVE ORDER CONFIGURATION & IMMEDIATE PAYSTACK CHECKOUT
               ============================================================ */
            <>
              {/* 1. TRAY ITEMS REVIEW */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#f3e5ab] font-bold flex items-center gap-2">
                    <Sparkles size={13} className="text-[#d4af37]" />
                    1. Selected Food &amp; Drinks ({cartItems.reduce((s, i) => s + i.qty, 0)} items)
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    {foodItems.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f3e5ab]">
                        {foodItems.reduce((s, i) => s + i.qty, 0)} Dish{foodItems.length > 1 ? 'es' : ''}
                      </span>
                    )}
                    {drinkItems.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200">
                        {drinkItems.reduce((s, i) => s + i.qty, 0)} Drink{drinkItems.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center text-xs text-gray-400">
                    Your order tray is empty. Select delicious dishes or chilled drinks from the menu first.
                  </div>
                ) : (
                  <div className="rounded-2xl bg-black/45 border border-white/10 divide-y divide-white/10 max-h-52 overflow-y-auto">
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

              {/* 2. PROMINENT PAYMENT CONFIRMATION BOX WITH TAX & VAT + CHECKBOX (IMMEDIATELY VISIBLE) */}
              {cartItems.length > 0 && (
                <PaymentConfirmationBox
                  title="2. Payment Confirmation"
                  subtotalLabel="Food & Drinks Subtotal"
                  breakdown={paymentBreakdown}
                  agreed={vatAgreed}
                  onToggleAgreed={(checked) => {
                    setVatAgreed(checked);
                    if (checked) {
                      setVatError(false);
                      setFormError('');
                    }
                  }}
                  showValidationError={vatError}
                  checkboxRef={vatBoxRef}
                />
              )}

              {/* 3. GUEST DETAILS & PAYSTACK ONLINE PAYMENT FORM */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#1d040f] border border-[#d4af37]/35 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#f3e5ab] font-bold flex items-center gap-2">
                    <CreditCard size={14} className="text-emerald-400" />
                    3. Guest Details &amp; Delivery Location
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    Online Payment Required
                  </span>
                </div>

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
                    <label className="text-[11px] font-mono text-gray-300 block mb-1">Email (for Paystack Receipt)</label>
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
                    <label className="text-[11px] font-mono text-gray-300 block mb-1">Pickup or Service Location</label>
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
                        <option value="In-Room Suite Delivery">In-Room Suite Delivery (Rooms 601–620 / 101–114)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {serviceLocation === 'In-Room Suite Delivery' && (
                  <div>
                    <label className="text-[11px] font-mono text-[#f3e5ab] block mb-1">
                      Suite / Room Number for Delivery *
                    </label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af37]" />
                      <input
                        type="text"
                        value={deliveryRoomNumber}
                        onChange={(e) => setDeliveryRoomNumber(e.target.value)}
                        placeholder="Enter Room Number (e.g. 601 or 105)"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/60 border border-[#d4af37]/40 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                )}

                {/* Paystack Verified Policy Box */}
                <div className="space-y-2">
                  <div className="p-3.5 rounded-xl bg-[#3b071b] border border-[#d4af37] text-white flex items-center justify-between text-xs font-bold shadow-md">
                    <span className="flex items-center gap-2">
                      <CreditCard size={16} className="text-emerald-400 flex-shrink-0" />
                      <span>Immediate Online Payment via Paystack (Card / Bank Transfer / USSD)</span>
                    </span>
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/35 border border-emerald-500/30 text-emerald-200 text-[11px] flex items-start gap-2">
                    <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      All food and drink orders are paid immediately online via Paystack. Once confirmed, you receive your official <strong>Order Code</strong> to give to the Front Desk, and reception is alerted every 2 minutes until ready.
                    </span>
                  </div>
                </div>

                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Optional chef / bartender note (e.g. Less spicy, chilled glasses, extra ice)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/45 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

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
          <div className="px-5 sm:px-6 py-4 bg-[#100107] border-t border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] font-mono text-gray-300">
                {foodSubtotal > 0 && <span>Food: ₦{foodSubtotal.toLocaleString()}</span>}
                {drinkSubtotal > 0 && <span>Drinks: ₦{drinkSubtotal.toLocaleString()}</span>}
                {paymentBreakdown.taxAndVatFee > 0 && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold">
                    Tax &amp; VAT: +₦{paymentBreakdown.taxAndVatFee.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-white">TOTAL PAYABLE:</span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-[#f3e5ab] drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
                  ₦{paymentBreakdown.grossAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                disabled={isProcessing || cartItems.length === 0}
                onClick={() => handleSubmitOrder()}
                className={`w-full sm:w-auto justify-center px-6 py-3.5 rounded-xl ${goldGradient} font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer`}
              >
                {isProcessing ? (
                  <span>Launching Paystack...</span>
                ) : (
                  <>
                    <CreditCard size={15} />
                    <span>Confirm &amp; Pay ₦{paymentBreakdown.grossAmount.toLocaleString()}</span>
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
