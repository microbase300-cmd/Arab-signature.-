import React, { useState, useEffect } from 'react';
import { portalStore } from '../data/portalStore';
import {
  Calculator, Building2, Utensils, Wine, TrendingUp, TrendingDown, Receipt,
  CheckCircle2, AlertCircle, Search, Printer, Download, Plus, Trash2,
  LogOut, ArrowLeft, RefreshCw, ShieldCheck, CreditCard, Wallet, FileText, Sparkles, Image as ImageIcon
} from 'lucide-react';
import ProofOfPaymentModal from '../components/ProofOfPaymentModal';

export default function AccountantPortal({ onNavigate }) {
  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [diningOrders, setDiningOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'folios' | 'suites' | 'dining' | 'expenses' | 'report'
  const [searchQuery, setSearchQuery] = useState('');
  const [diningTypeFilter, setDiningTypeFilter] = useState('all'); // 'all' | 'food' | 'drinks' | 'unpaid'
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [selectedProofBooking, setSelectedProofBooking] = useState(null);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  // New Expense Form State
  const [expCategory, setExpCategory] = useState('Diesel & Power Generation');
  const [expVendor, setExpVendor] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expMethod, setExpMethod] = useState('Corporate Bank Transfer');

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const refreshAll = () => {
    setBookings(portalStore.getBookings());
    setDiningOrders(portalStore.getDiningOrders());
    setExpenses(portalStore.getExpenses());
  };

  useEffect(() => {
    const user = portalStore.getCurrentUser();
    if (!user || !['accountant', 'admin'].includes(user.role)) {
      onNavigate('accountant-login');
      return;
    }
    setCurrentUser(user);
    refreshAll();

    const clock = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    const handleSync = () => refreshAll();
    window.addEventListener('ash_bookings_updated', handleSync);
    const unsubDining = portalStore.subscribeDiningOrders(handleSync);
    const unsubExpenses = portalStore.subscribeExpenses(handleSync);

    return () => {
      clearInterval(clock);
      window.removeEventListener('ash_bookings_updated', handleSync);
      unsubDining();
      unsubExpenses();
    };
  }, []);

  const handleLogout = () => {
    portalStore.logout();
    onNavigate('accountant-login');
  };

  // ==============================================================
  // FINANCIAL METRICS & CHANNEL RECONCILIATION CALCULATIONS
  // ==============================================================
  const validBookings = bookings.filter((b) => b.status !== 'Cancelled');
  const validDining = diningOrders.filter((o) => o.orderStatus !== 'Cancelled');

  const paidSuitesRevenue = validBookings
    .filter((b) => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const pendingSuitesRevenue = validBookings
    .filter((b) => b.paymentStatus !== 'Paid')
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const mainWingSuiteRev = validBookings
    .filter((b) => b.paymentStatus === 'Paid' && (String(b.id).startsWith('ARS-BGD') || String(b.roomNumber).startsWith('6')))
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const extWingSuiteRev = validBookings
    .filter((b) => b.paymentStatus === 'Paid' && (String(b.id).startsWith('ARS-EXT') || String(b.roomNumber).startsWith('1')))
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const foodOrders = validDining.filter((o) => o.orderType === 'food');
  const drinkOrders = validDining.filter((o) => o.orderType === 'drinks');

  const totalFoodRevenue = foodOrders.reduce((s, o) => s + (Number(o.amount) || 0), 0);
  const totalDrinkRevenue = drinkOrders.reduce((s, o) => s + (Number(o.amount) || 0), 0);

  const settledDiningRevenue = validDining
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((s, o) => s + (Number(o.amount) || 0), 0);
  const unsettledRoomBills = validDining
    .filter((o) => o.paymentStatus !== 'Paid')
    .reduce((s, o) => s + (Number(o.amount) || 0), 0);

  const grossBookedRevenue = paidSuitesRevenue + pendingSuitesRevenue + totalFoodRevenue + totalDrinkRevenue;
  const totalCollectedCashflow = paidSuitesRevenue + settledDiningRevenue;
  const totalReceivables = pendingSuitesRevenue + unsettledRoomBills;
  const totalExpenses = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const netOperatingProfit = totalCollectedCashflow - totalExpenses;

  // Channel Breakdown (Collected)
  const allPaidTransactions = [
    ...validBookings.filter((b) => b.paymentStatus === 'Paid').map((b) => ({ amount: Number(b.amount) || 0, method: b.paymentMethod || '' })),
    ...validDining.filter((o) => o.paymentStatus === 'Paid').map((o) => ({ amount: Number(o.amount) || 0, method: o.paymentMethod || '' }))
  ];

  const paystackCollected = allPaidTransactions
    .filter((t) => t.method.toLowerCase().includes('paystack'))
    .reduce((s, t) => s + t.amount, 0);
  const posCollected = allPaidTransactions
    .filter((t) => t.method.toLowerCase().includes('pos'))
    .reduce((s, t) => s + t.amount, 0);
  const transferCashCollected = Math.max(0, totalCollectedCashflow - paystackCollected - posCollected);

  // Outside Room vs In-Suite Dining Segmentation
  const isOutsideRoomOrder = (ord) => Boolean(
    ord.isOutsideRoom ||
    !ord.isLodgeGuest ||
    !ord.roomNumber ||
    !ord.bookingId ||
    ['dining hall', 'restaurant', 'vip executive bar', 'poolside', 'cabana', 'takeout', 'pickup', 'front desk counter order'].some(spot =>
      String(ord.serviceLocation || '').toLowerCase().includes(spot)
    )
  );

  const outsideRoomOrders = validDining.filter(isOutsideRoomOrder);
  const inRoomDiningOrders = validDining.filter((o) => !isOutsideRoomOrder(o));
  const outsideRoomCollected = outsideRoomOrders.filter((o) => o.paymentStatus === 'Paid').reduce((s, o) => s + (Number(o.amount) || 0), 0);
  const inRoomCollected = inRoomDiningOrders.filter((o) => o.paymentStatus === 'Paid').reduce((s, o) => s + (Number(o.amount) || 0), 0);

  const auditedSuitesCount = validBookings.filter((b) => b.accountantAudited).length;
  const auditedDiningCount = validDining.filter((o) => o.accountantAudited).length;

  // Active Lodge Guest Folios
  const activeStaysWithFolios = validBookings
    .filter((b) => ['Checked In', 'Confirmed'].includes(b.status))
    .map((b) => ({
      booking: b,
      folio: portalStore.getBookingFolioSummary(b)
    }));

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    const numericAmt = Number(expAmount);
    if (!expDesc.trim() || !numericAmt || numericAmt <= 0) {
      alert('Please enter a valid expense description and amount.');
      return;
    }
    portalStore.addExpense({
      category: expCategory,
      vendor: expVendor.trim() || 'Verified Hotel Vendor',
      description: expDesc.trim(),
      amount: numericAmt,
      paymentMethod: expMethod,
      recordedBy: currentUser?.name || 'Chief Hotel Accountant'
    });
    setExpVendor('');
    setExpDesc('');
    setExpAmount('');
    refreshAll();
    showToast(`Recorded operational expense of ₦${numericAmt.toLocaleString()}`);
  };

  const handleExportCSV = () => {
    const rows = [
      ['Record Type', 'Booking / Order Code', 'Guest / Vendor', 'Linked Suite', 'Category / Details', 'Payment Status', 'Payment Method', 'Amount (NGN)', 'Audited', 'Date']
    ];

    validBookings.forEach((b) => {
      rows.push([
        'SUITE BOOKING',
        b.id,
        `"${(b.guestName || '').replace(/"/g, '""')}"`,
        `Room #${b.roomNumber || 'N/A'}`,
        `"${b.roomName || ''}"`,
        b.paymentStatus,
        `"${b.paymentMethod || ''}"`,
        b.amount,
        b.accountantAudited ? 'YES' : 'NO',
        `"${b.checkIn || ''}"`
      ]);
    });

    validDining.forEach((o) => {
      rows.push([
        o.orderType === 'drinks' ? 'DRINK ORDER (ARB-DRK)' : 'FOOD ORDER (ARB-FDD)',
        o.id,
        `"${(o.guestName || '').replace(/"/g, '""')}"`,
        o.bookingId ? `${o.bookingId} (Room #${o.roomNumber})` : 'Walk-In / Lounge',
        `"${o.items.map((i) => `${i.qty}x ${i.name}`).join('; ').replace(/"/g, '""')}"`,
        o.paymentStatus,
        `"${o.paymentMethod || ''}"`,
        o.amount,
        o.accountantAudited ? 'YES' : 'NO',
        `"${o.createdAt || ''}"`
      ]);
    });

    expenses.forEach((ex) => {
      rows.push([
        'EXPENSE OUTFLOW',
        ex.id,
        `"${(ex.vendor || '').replace(/"/g, '""')}"`,
        '-',
        `"${ex.category}: ${(ex.description || '').replace(/"/g, '""')}"`,
        'Paid Outflow',
        `"${ex.paymentMethod || ''}"`,
        -Math.abs(Number(ex.amount) || 0),
        'YES',
        `"${ex.createdAt || ''}"`
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Arab_Signature_Financial_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported complete Hotel Financial Ledger CSV!');
  };

  return (
    <div className="min-h-screen bg-[#0c0106] text-gray-100 flex flex-col font-sans">
      {/* 1. TOP FINANCIAL CONTROLLER COMMAND BAR */}
      <header className="sticky top-0 z-40 bg-[#16030c]/95 border-b border-[#d4af37]/35 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#d4af37]/50 bg-[#120208] shadow-md flex-shrink-0">
            <img src="/logo.jpg" alt="Arab Signature Logo" className="w-full h-full object-cover scale-110" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-cinzel font-bold text-base sm:text-lg text-white tracking-wide">
                Accountant & Financial Audit Portal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                <Calculator size={11} />
                <span>FINANCE CONTROLLER</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Arab Signature Hotel & Suites • Suites (ARS) • Food (ARB-FDD) • Drinks (ARB-DRK)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden md:flex flex-col text-right">
            <span className="font-mono text-sm font-bold text-[#f3e5ab]">{currentTime}</span>
            <span className="text-[10px] text-gray-400">
              Officer: <strong className="text-white">{currentUser?.name || 'Chief Hotel Accountant'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className={`px-3.5 py-2 rounded-xl ${goldGradient} font-bold text-xs flex items-center gap-1.5 shadow-lg`}
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-3 py-2 rounded-xl bg-[#5c0725] hover:bg-[#750930] border border-[#d4af37]/40 text-xs font-bold text-[#f3e5ab]"
              >
                GM Portal
              </button>
            )}

            <button
              onClick={() => onNavigate('home')}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium border border-white/10 flex items-center gap-1.5"
            >
              <ArrowLeft size={14} className="text-[#d4af37]" />
              <span className="hidden sm:inline">Guest Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {feedbackMsg && (
        <div className="bg-[#5c0725] border-b border-[#d4af37]/50 text-[#f3e5ab] px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 print:hidden">
          <Sparkles size={14} className="text-[#d4af37]" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* 6 FINANCIAL KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 print:hidden">
          <div className="p-4 rounded-2xl bg-[#16030c] border border-[#d4af37]/40">
            <span className="text-[10px] font-mono uppercase text-gray-400">Gross Booked Value</span>
            <div className="font-mono text-lg sm:text-xl font-extrabold text-[#f3e5ab] mt-1">
              ₦{grossBookedRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">
              ₦{totalCollectedCashflow.toLocaleString()} Collected
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#16030c] border border-white/10">
            <span className="text-[10px] font-mono uppercase text-gray-400 flex items-center justify-between">
              <span>Suites (ARS)</span>
              <Building2 size={13} className="text-[#d4af37]" />
            </span>
            <div className="font-mono text-lg sm:text-xl font-extrabold text-white mt-1">
              ₦{paidSuitesRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] text-gray-400 font-mono">{validBookings.length} Reservations</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#16030c] border border-[#d4af37]/25">
            <span className="text-[10px] font-mono uppercase text-[#f3e5ab] flex items-center justify-between">
              <span>Food (ARB-FDD)</span>
              <Utensils size={13} className="text-[#d4af37]" />
            </span>
            <div className="font-mono text-lg sm:text-xl font-extrabold text-[#f3e5ab] mt-1">
              ₦{totalFoodRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] text-gray-400 font-mono">{foodOrders.length} Kitchen Orders</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#16030c] border border-purple-400/30">
            <span className="text-[10px] font-mono uppercase text-purple-200 flex items-center justify-between">
              <span>Drinks (ARB-DRK)</span>
              <Wine size={13} className="text-purple-300" />
            </span>
            <div className="font-mono text-lg sm:text-xl font-extrabold text-purple-200 mt-1">
              ₦{totalDrinkRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] text-gray-400 font-mono">{drinkOrders.length} VIP Bar Orders</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#16030c] border border-amber-400/40">
            <span className="text-[10px] font-mono uppercase text-amber-300 flex items-center justify-between">
              <span>Room Bill Receivables</span>
              <Receipt size={13} className="text-amber-300" />
            </span>
            <div className="font-mono text-lg sm:text-xl font-extrabold text-amber-300 mt-1">
              ₦{totalReceivables.toLocaleString()}
            </div>
            <span className="text-[10px] text-amber-200/80 font-mono">Awaiting Settlement</span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#190510] to-[#081b10] border border-emerald-500/40">
            <span className="text-[10px] font-mono uppercase text-emerald-300 flex items-center justify-between">
              <span>Net Operating Profit</span>
              <TrendingUp size={13} className="text-emerald-400" />
            </span>
            <div className={`font-mono text-lg sm:text-xl font-extrabold mt-1 ${netOperatingProfit >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
              ₦{netOperatingProfit.toLocaleString()}
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              After ₦{totalExpenses.toLocaleString()} Expenses
            </span>
          </div>
        </div>

        {/* NAVIGATION TABS & SEARCH */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4 print:hidden">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#16030c] p-1.5 rounded-2xl border border-white/10">
            {[
              { id: 'overview', label: 'Channels & Overview', icon: TrendingUp },
              { id: 'folios', label: `In-Lodge Folios (${activeStaysWithFolios.length})`, icon: Receipt },
              { id: 'suites', label: `Suites ARS (${validBookings.length})`, icon: Building2 },
              { id: 'dining', label: `Food & Drinks ARB (${validDining.length})`, icon: Utensils },
              { id: 'expenses', label: `Expenses (${expenses.length})`, icon: Wallet },
              { id: 'report', label: 'Printable Audit Report', icon: FileText }
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === t.id ? `${goldGradient} font-bold shadow-md` : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={13} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ARS / ARB code, guest, room..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <button
              onClick={refreshAll}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300"
              title="Refresh Ledgers"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* ============================================================
            TAB 1: CHANNELS & FINANCIAL OVERVIEW
            ============================================================ */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Channel Reconciliation */}
            <div className="p-6 rounded-3xl bg-[#16030c] border border-[#d4af37]/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard size={18} className="text-[#d4af37]" />
                  <span>Settlement Channel Reconciliation</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  ₦{totalCollectedCashflow.toLocaleString()} Verified
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">Paystack Online Gateway</span>
                    <span className="text-[10px] text-gray-400">Website Suite & Dining Auto-Verified</span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-400">₦{paystackCollected.toLocaleString()}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">Front Desk & Restaurant POS Terminals</span>
                    <span className="text-[10px] text-gray-400">Counter Walk-Ins & Room Bill Settlements</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#f3e5ab]">₦{posCollected.toLocaleString()}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">Corporate Bank Transfer & Cash</span>
                    <span className="text-[10px] text-gray-400">Direct Front Desk Lodgments</span>
                  </div>
                  <span className="text-sm font-extrabold text-sky-300">₦{transferCashCollected.toLocaleString()}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-400/40 flex items-center justify-between">
                  <div>
                    <span className="text-amber-200 font-bold block">Open In-Lodge Room Bills & Pending</span>
                    <span className="text-[10px] text-amber-300/80">Attached to Active Guest Folios</span>
                  </div>
                  <span className="text-sm font-extrabold text-amber-300">₦{totalReceivables.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Revenue Centers & Audit Progress */}
            <div className="p-6 rounded-3xl bg-[#16030c] border border-[#d4af37]/30 space-y-5 shadow-xl">
              <div className="border-b border-white/10 pb-3">
                <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                  <Building2 size={18} className="text-[#d4af37]" />
                  <span>Revenue Centers & Audit Progress</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-black/45 border border-[#d4af37]/30">
                  <span className="text-[10px] text-gray-400 block">MAIN BUILDING (ARS-BGD • 600 WING)</span>
                  <span className="text-base font-extrabold text-[#f3e5ab] mt-1 block">
                    ₦{mainWingSuiteRev.toLocaleString()}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/45 border border-sky-400/30">
                  <span className="text-[10px] text-gray-400 block">EXTENSION WING (ARS-EXT • 100 WING)</span>
                  <span className="text-base font-extrabold text-sky-300 mt-1 block">
                    ₦{extWingSuiteRev.toLocaleString()}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/45 border border-emerald-400/30">
                  <span className="text-[10px] text-gray-400 block">SUITES AUDITED BY ACCOUNTANT</span>
                  <span className="text-base font-extrabold text-emerald-300 mt-1 block">
                    {auditedSuitesCount} / {validBookings.length} Stamped
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/45 border border-purple-400/30">
                  <span className="text-[10px] text-gray-400 block">FOOD/DRINK ORDERS AUDITED</span>
                  <span className="text-base font-extrabold text-purple-200 mt-1 block">
                    {auditedDiningCount} / {validDining.length} Stamped
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#220410] border border-[#d4af37]/30 text-xs text-gray-300 leading-relaxed">
                <strong className="text-[#f3e5ab] block mb-1">Real-Time Three-Portal Sync Active:</strong>
                Every room code generated at Reception (<code className="text-white">ARS-BGD</code> / <code className="text-white">ARS-EXT</code>) and every food (<code className="text-white">ARB-FDD</code>) or drink (<code className="text-white">ARB-DRK</code>) booking added to a guest's room bill updates this ledger automatically.
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: IN-LODGE GUEST FOLIOS & ROOM BILL RECEIVABLES
            ============================================================ */}
        {activeTab === 'folios' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#16030c] border border-[#d4af37]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <h3 className="font-cinzel text-base font-bold text-white">
                  Active In-Lodge Guest Folios & Attached Food/Drink Bills
                </h3>
                <p className="text-gray-400 mt-0.5">
                  Monitor combined Suite + Kitchen (<span className="font-mono text-[#f3e5ab]">ARB-FDD</span>) + VIP Bar (<span className="font-mono text-[#f3e5ab]">ARB-DRK</span>) bills per checked-in guest.
                </p>
              </div>
              <div className="font-mono text-amber-300 font-bold">
                Total Unsettled Room Bills: ₦{unsettledRoomBills.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeStaysWithFolios.map(({ booking: b, folio }) => (
                <div key={b.id} className="p-5 rounded-2xl bg-[#16030c] border border-white/10 space-y-3 shadow-xl">
                  <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm text-[#f3e5ab]">{b.id}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-white">
                          Suite #{b.roomNumber}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{b.guestName}</h4>
                      <span className="text-[11px] text-gray-400 font-mono">{b.phone} • {b.roomName}</span>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[10px] text-gray-400 block">BALANCE DUE</span>
                      <span className={`text-base font-extrabold ${folio.balanceDue > 0 ? 'text-amber-300' : 'text-emerald-400'}`}>
                        ₦{folio.balanceDue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                    <div className="p-2.5 rounded-xl bg-black/45 border border-white/5">
                      <span className="text-[9px] text-gray-400 block">SUITE</span>
                      <span className="text-white font-bold">₦{folio.roomAmount.toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/45 border border-white/5">
                      <span className="text-[9px] text-[#f3e5ab] block">FOOD ({folio.foodOrders.length})</span>
                      <span className="text-[#f3e5ab] font-bold">₦{folio.foodOrdersTotal.toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/45 border border-white/5">
                      <span className="text-[9px] text-purple-200 block">DRINKS ({folio.drinkOrders.length})</span>
                      <span className="text-purple-200 font-bold">₦{folio.drinkOrdersTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {folio.diningOrders.length > 0 && (
                    <div className="space-y-1.5 pt-1 text-[11px]">
                      {folio.diningOrders.map((ord) => (
                        <div key={ord.id} className="flex items-center justify-between text-gray-300 bg-black/35 px-3 py-1.5 rounded-lg">
                          <span>
                            <strong className="font-mono text-[#f3e5ab]">{ord.id}</strong>:{' '}
                            {ord.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                          </span>
                          <span className={`font-mono font-bold ${ord.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-300'}`}>
                            ₦{Number(ord.amount).toLocaleString()} ({ord.paymentStatus === 'Paid' ? 'Paid' : 'Due'})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {folio.balanceDue > 0 && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          portalStore.settleBookingDiningBill(b.id, 'Accountant Verified Settlement');
                          refreshAll();
                          showToast(`Reconciled & cleared ₦${folio.balanceDue.toLocaleString()} balance for ${b.id}`);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <CheckCircle2 size={13} />
                        <span>Reconcile & Mark Bill Settled</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: SUITES ACCOMMODATION LEDGER (ARS-BGD & ARS-EXT)
            ============================================================ */}
        {activeTab === 'suites' && (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#16030c] shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#120208] text-gray-400 uppercase tracking-wider border-b border-white/10 text-[10px]">
                <tr>
                  <th className="py-3 px-4">Suite Code</th>
                  <th className="py-3 px-4">Guest</th>
                  <th className="py-3 px-4">Wing & Room</th>
                  <th className="py-3 px-4">Stay Schedule</th>
                  <th className="py-3 px-4">Payment Channel</th>
                  <th className="py-3 px-4 text-center">Proof of Payment</th>
                  <th className="py-3 px-4">Suite Amount</th>
                  <th className="py-3 px-4 text-right">Accountant Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {validBookings
                  .filter((b) => {
                    const q = searchQuery.trim().toLowerCase();
                    return (
                      !q ||
                      b.id.toLowerCase().includes(q) ||
                      b.guestName.toLowerCase().includes(q) ||
                      String(b.roomNumber || '').includes(q)
                    );
                  })
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#f3e5ab]">{b.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{b.guestName}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{b.phone}</div>
                        {b.homeAddress && (
                          <div className="text-[10px] text-gray-400 truncate max-w-[160px]" title={b.homeAddress}>
                            {b.homeAddress}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-gray-200">{b.roomName}</div>
                        <div className="text-[11px] font-mono text-[#d4af37]">Room #{b.roomNumber}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-gray-300">
                        {b.bookingMode === 'Reservation Hold' ? (
                          <div>
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-sky-950 text-sky-300 border border-sky-400/40 inline-block mb-1">
                              Hold ({b.nights}n)
                            </span>
                            <div className="text-[10px] text-sky-200">Res: {b.reservationDate || b.checkIn}</div>
                            {b.expectedCheckIn && (
                              <div className="text-[10px] text-emerald-300">Exp: {b.expectedCheckIn}</div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div>{b.checkIn} → {b.checkOut}</div>
                            <div className="text-[10px] text-gray-500 font-sans">{b.nights} {b.nights === 1 ? 'Night' : 'Nights'}</div>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-gray-200">{b.paymentMethod}</div>
                        <span className={`text-[10px] font-mono font-bold ${b.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-300'}`}>
                          {b.paymentStatus}
                        </span>
                      </td>

                      {/* Proof of Payment Column (Image + Reference) */}
                      <td className="py-3.5 px-4 text-center">
                        {b.proofOfPaymentImage ? (
                          <div className="inline-flex flex-col items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedProofBooking(b)}
                              className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                              title="Inspect uploaded payment slip image"
                            >
                              <ImageIcon size={12} />
                              <span>View Slip</span>
                            </button>
                            {b.proofOfPayment && (
                              <span className="text-[9px] text-gray-400 font-mono truncate max-w-[100px]" title={b.proofOfPayment}>
                                {b.proofOfPayment}
                              </span>
                            )}
                          </div>
                        ) : b.proofOfPayment ? (
                          <span className="font-mono text-[10px] text-gray-300 truncate max-w-[110px] block" title={b.proofOfPayment}>
                            {b.proofOfPayment}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-600 font-mono">None</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ₦{Number(b.amount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            portalStore.auditRecordByAccountant('room', b.id, currentUser?.name);
                            refreshAll();
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold border transition-all ${
                            b.accountantAudited
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                              : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/15 cursor-pointer'
                          }`}
                        >
                          {b.accountantAudited ? '✓ Audited' : 'Stamp Audit'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ============================================================
            TAB 4: FOOD (ARB-FDD) & DRINKS (ARB-DRK) LEDGER
            ============================================================ */}
        {activeTab === 'dining' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: `All Orders (${validDining.length})` },
                { id: 'outside', label: `Outside Room Orders (${outsideRoomOrders.length})` },
                { id: 'in_room', label: `In-Suite Dining (${inRoomDiningOrders.length})` },
                { id: 'food', label: `Food ARB-FDD (${foodOrders.length})` },
                { id: 'drinks', label: `Drinks ARB-DRK (${drinkOrders.length})` },
                { id: 'unpaid', label: `Unsettled Room Bills (${validDining.filter(o => o.paymentStatus !== 'Paid').length})` }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDiningTypeFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
                    diningTypeFilter === f.id
                      ? 'bg-[#5c0725] text-[#f3e5ab] border-[#d4af37]'
                      : 'bg-white/5 text-gray-400 border-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#16030c] shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#120208] text-gray-400 uppercase tracking-wider border-b border-white/10 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order Code</th>
                    <th className="py-3 px-4">Guest & Destination</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Payment Status</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4 text-right">Audit & Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {validDining
                    .filter((o) => {
                      const q = searchQuery.trim().toLowerCase();
                      const matchQ =
                        !q ||
                        o.id.toLowerCase().includes(q) ||
                        o.guestName.toLowerCase().includes(q) ||
                        (o.bookingId && o.bookingId.toLowerCase().includes(q)) ||
                        (o.roomNumber && String(o.roomNumber).includes(q)) ||
                        (o.serviceLocation && o.serviceLocation.toLowerCase().includes(q));
                      if (!matchQ) return false;
                      if (diningTypeFilter === 'outside') return isOutsideRoomOrder(o);
                      if (diningTypeFilter === 'in_room') return !isOutsideRoomOrder(o);
                      if (diningTypeFilter === 'food') return o.orderType === 'food';
                      if (diningTypeFilter === 'drinks') return o.orderType === 'drinks';
                      if (diningTypeFilter === 'unpaid') return o.paymentStatus !== 'Paid';
                      return true;
                    })
                    .map((o) => (
                      <tr key={o.id} className="hover:bg-white/[0.02]">
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${
                              o.orderType === 'drinks'
                                ? 'bg-purple-500/20 text-purple-200 border-purple-400/40'
                                : 'bg-[#d4af37]/20 text-[#f3e5ab] border-[#d4af37]/40'
                            }`}
                          >
                            {o.id}
                          </span>
                          <span className="block text-[10px] text-gray-500 mt-0.5">{o.createdAt}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{o.guestName}</div>
                          {isOutsideRoomOrder(o) ? (
                            <div className="mt-1">
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold inline-flex items-center gap-1">
                                <Utensils size={10} />
                                <span>Outside Room • {o.serviceLocation || 'Restaurant / Lounge'}</span>
                              </span>
                              {o.phone && <span className="text-[10px] text-gray-400 font-mono block mt-0.5">{o.phone}</span>}
                            </div>
                          ) : (
                            <div className="mt-0.5">
                              <span className="text-[11px] font-mono text-[#f3e5ab]">
                                {o.bookingId} (Suite #{o.roomNumber})
                              </span>
                              {o.phone && <span className="text-[10px] text-gray-400 font-mono block">{o.phone}</span>}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs text-gray-200">
                          {o.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className={`font-bold ${o.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-300'}`}>
                            {o.paymentStatus}
                          </span>
                          <span className="block text-[10px] text-gray-400">{o.paymentMethod}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          ₦{Number(o.amount).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {o.paymentStatus !== 'Paid' && (
                              <button
                                onClick={() => {
                                  portalStore.settleSingleDiningOrder(o.id, 'Accountant Verified POS/Transfer');
                                  refreshAll();
                                  showToast(`Marked ${o.id} as Paid!`);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/40 text-amber-200 text-[10px] font-bold"
                              >
                                Mark Paid
                              </button>
                            )}
                            <button
                              onClick={() => {
                                portalStore.auditRecordByAccountant('dining', o.id, currentUser?.name);
                                refreshAll();
                              }}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold border ${
                                o.accountantAudited
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/15'
                              }`}
                            >
                              {o.accountantAudited ? '✓ Audited' : 'Stamp Audit'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 5: OPERATIONAL EXPENSES CASHBOOK
            ============================================================ */}
        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleAddExpenseSubmit}
              className="lg:col-span-4 p-6 rounded-3xl bg-[#16030c] border border-[#d4af37]/35 space-y-4 h-fit shadow-xl text-xs"
            >
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <Plus size={16} className="text-[#d4af37]" />
                <span>Log Operational Expense</span>
              </h3>

              <div>
                <label className="text-gray-300 block mb-1">Expense Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white"
                >
                  <option value="Diesel & Power Generation">Diesel & Power Generation</option>
                  <option value="Kitchen Stock & Provisions">Kitchen Stock & Provisions</option>
                  <option value="VIP Bar & Cellar Restock">VIP Bar & Cellar Restock</option>
                  <option value="Housekeeping & Laundry">Housekeeping & Laundry</option>
                  <option value="Facility Maintenance">Facility Maintenance</option>
                  <option value="Staff Payroll & Welfare">Staff Payroll & Welfare</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Supplier / Payee</label>
                <input
                  type="text"
                  value={expVendor}
                  onChange={(e) => setExpVendor(e.target.value)}
                  placeholder="e.g. Onitsha Energy Supply Ltd"
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="e.g. 400L Automotive Gas Oil for Generator #1"
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-gray-300 block mb-1">Amount (₦) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    placeholder="50000"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">Disbursed Via</label>
                  <select
                    value={expMethod}
                    onChange={(e) => setExpMethod(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white"
                  >
                    <option value="Corporate Bank Transfer">Bank Transfer</option>
                    <option value="Imprest Petty Cash">Petty Cash</option>
                    <option value="Corporate Debit Card">Debit Card</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl ${goldGradient} font-extrabold uppercase tracking-wider shadow-lg`}
              >
                Record Expense Voucher
              </button>
            </form>

            <div className="lg:col-span-8 overflow-x-auto rounded-3xl border border-white/10 bg-[#16030c] shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#120208] text-gray-400 uppercase tracking-wider border-b border-white/10 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Voucher ID</th>
                    <th className="py-3 px-4">Category & Description</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {expenses.map((ex) => (
                    <tr key={ex.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-300">
                        {ex.id}
                        <span className="block text-[10px] text-gray-500 font-normal">{ex.createdAt}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[#f3e5ab] font-semibold block">{ex.category}</span>
                        <span className="text-gray-300">{ex.description}</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">{ex.vendor}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-400">
                        -₦{Number(ex.amount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            portalStore.deleteExpense(ex.id);
                            refreshAll();
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 6: PRINTABLE OFFICIAL FINANCIAL AUDIT STATEMENT
            ============================================================ */}
        {activeTab === 'report' && (
          <div className="max-w-4xl mx-auto bg-white text-gray-900 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 print:shadow-none print:p-0">
            <div className="flex items-center justify-between border-b-2 border-[#5c0725] pb-5">
              <div>
                <h2 className="font-cinzel text-2xl font-black text-[#5c0725]">
                  ARAB SIGNATURE HOTEL & SUITES
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                  Official Financial Controller & Revenue Audit Statement
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Nsugbe / Onitsha, Anambra State • Generated: {new Date().toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-[#5c0725] text-white text-xs font-bold flex items-center gap-2 print:hidden"
              >
                <Printer size={14} />
                <span>Print / Save PDF Statement</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-500 block">Suites Collected (ARS)</span>
                <strong className="font-mono text-base text-gray-900">₦{paidSuitesRevenue.toLocaleString()}</strong>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-500 block">Food Booked (ARB-FDD)</span>
                <strong className="font-mono text-base text-gray-900">₦{totalFoodRevenue.toLocaleString()}</strong>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-500 block">Drinks Booked (ARB-DRK)</span>
                <strong className="font-mono text-base text-gray-900">₦{totalDrinkRevenue.toLocaleString()}</strong>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-800 block font-semibold">Net Operating Profit</span>
                <strong className="font-mono text-base text-emerald-900">₦{netOperatingProfit.toLocaleString()}</strong>
              </div>
            </div>

            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 text-left text-gray-600 uppercase text-[10px]">
                  <th className="py-2">Financial Line Item</th>
                  <th className="py-2 text-center">Records</th>
                  <th className="py-2 text-right">Amount (NGN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-mono">
                <tr>
                  <td className="py-2.5 font-sans font-semibold">Main Building Suites Collected (ARS-BGD)</td>
                  <td className="py-2.5 text-center">-</td>
                  <td className="py-2.5 text-right">₦{mainWingSuiteRev.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold">Extension Wing Suites Collected (ARS-EXT)</td>
                  <td className="py-2.5 text-center">-</td>
                  <td className="py-2.5 text-right">₦{extWingSuiteRev.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold">Settled Kitchen & VIP Bar Orders (ARB-FDD / ARB-DRK)</td>
                  <td className="py-2.5 text-center">{validDining.filter((o) => o.paymentStatus === 'Paid').length}</td>
                  <td className="py-2.5 text-right">₦{settledDiningRevenue.toLocaleString()}</td>
                </tr>
                <tr className="bg-amber-50">
                  <td className="py-2.5 font-sans font-semibold text-amber-900">Open In-Lodge Room Bill Receivables</td>
                  <td className="py-2.5 text-center text-amber-900">{validDining.filter((o) => o.paymentStatus !== 'Paid').length}</td>
                  <td className="py-2.5 text-right font-bold text-amber-900">₦{totalReceivables.toLocaleString()}</td>
                </tr>
                <tr className="bg-rose-50">
                  <td className="py-2.5 font-sans font-semibold text-rose-900">Less: Operational Expenses Cashbook</td>
                  <td className="py-2.5 text-center text-rose-900">{expenses.length}</td>
                  <td className="py-2.5 text-right font-bold text-rose-900">-₦{totalExpenses.toLocaleString()}</td>
                </tr>
                <tr className="border-t-2 border-[#5c0725] text-sm font-bold text-[#5c0725]">
                  <td className="py-3 font-sans">NET REALIZED CASHFLOW SURPLUS</td>
                  <td className="py-3 text-center">AUDITED</td>
                  <td className="py-3 text-right">₦{netOperatingProfit.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
              <span>Prepared & Certified By: <strong>{currentUser?.name || 'Chief Hotel Accountant'}</strong></span>
              <span>Arab Signature Hotel & Suites Finance Department</span>
            </div>
          </div>
        )}
      </div>

      {/* Proof of Payment Lightbox Modal */}
      {selectedProofBooking && (
        <ProofOfPaymentModal
          booking={selectedProofBooking}
          onClose={() => setSelectedProofBooking(null)}
          isAccountantView={true}
          onStampAudit={(id) => {
            portalStore.auditRecordByAccountant('room', id, currentUser?.name);
            refreshAll();
          }}
        />
      )}
    </div>
  );
}
