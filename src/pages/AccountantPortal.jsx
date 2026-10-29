import React, { useState, useEffect, useMemo } from 'react';
import { portalStore } from '../data/portalStore';
import {
  Calculator, Building2, Utensils, Wine, TrendingUp, Receipt,
  CheckCircle2, AlertCircle, Search, Printer, Download, Plus, Trash2,
  LogOut, ArrowLeft, RefreshCw, ShieldCheck, CreditCard, FileText, Sparkles, Image as ImageIcon,
  ShieldAlert, XCircle, Check, X
} from 'lucide-react';
import ProofOfPaymentModal from '../components/ProofOfPaymentModal';

const SHEET_CUSTOM_ROWS_KEY = 'ash_accountant_sheet_custom_rows_v1';
const SHEET_OVERRIDES_KEY = 'ash_accountant_sheet_overrides_v1';

// Safe math expression evaluator for the Accountant Formula Bar
function evaluateMathFormula(expr) {
  if (!expr || typeof expr !== 'string') return null;
  const cleaned = expr.replace(/^=/, '').replace(/,/g, '').trim();
  if (!cleaned) return null;
  // Replace percentage patterns like "10%" with "*0.10" or "/100"
  const normalized = cleaned.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
  // Allow only numbers, decimal points, parentheses, whitespace, and basic operators + - * /
  if (!/^[0-9+\-*/().\s]+$/.test(normalized)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${normalized});`)();
    if (typeof result === 'number' && Number.isFinite(result)) {
      return Math.round(result * 100) / 100;
    }
    return null;
  } catch {
    return null;
  }
}

export default function AccountantPortal({ onNavigate }) {
  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [diningOrders, setDiningOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('spreadsheet'); // 'spreadsheet' | 'overview' | 'folios' | 'suites' | 'dining' | 'report'
  const [searchQuery, setSearchQuery] = useState('');
  const [diningTypeFilter, setDiningTypeFilter] = useState('all'); // 'all' | 'food' | 'drinks' | 'unpaid'
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [selectedProofBooking, setSelectedProofBooking] = useState(null);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  // ==============================================================
  // ADVANCED SPREADSHEET STATE
  // ==============================================================
  const [customRows, setCustomRows] = useState(() => {
    try {
      const saved = localStorage.getItem(SHEET_CUSTOM_ROWS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [rowOverrides, setRowOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem(SHEET_OVERRIDES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [sheetSourceFilter, setSheetSourceFilter] = useState('all'); // 'all' | 'suites_main' | 'suites_ext' | 'food' | 'drinks' | 'custom'
  const [sheetChannelFilter, setSheetChannelFilter] = useState('all'); // 'all' | 'paystack' | 'pos' | 'transfer' | 'unpaid'
  const [sheetPaymentFilter, setSheetPaymentFilter] = useState('all'); // 'all' | 'paid' | 'pending'
  const [sheetDateFrom, setSheetDateFrom] = useState('');
  const [sheetDateTo, setSheetDateTo] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  // Formula Bar & Percentage Calculator State
  const [formulaInput, setFormulaInput] = useState('');
  const [formulaLabel, setFormulaLabel] = useState('');
  const [taxRatePercent, setTaxRatePercent] = useState(7.5);
  const [discountRatePercent, setDiscountRatePercent] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(SHEET_CUSTOM_ROWS_KEY, JSON.stringify(customRows));
    } catch {}
  }, [customRows]);

  useEffect(() => {
    try {
      localStorage.setItem(SHEET_OVERRIDES_KEY, JSON.stringify(rowOverrides));
    } catch {}
  }, [rowOverrides]);

  const [pendingCancellations, setPendingCancellations] = useState([]);

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const refreshAll = () => {
    setBookings(portalStore.getBookings());
    setDiningOrders(portalStore.getDiningOrders());
    setPendingCancellations(portalStore.getPendingCancellations());
  };

  const handleConfirmCancellation = (bookingId) => {
    const accountantName = currentUser?.name || 'Chief Accountant';
    const notes = window.prompt("Accountant Audit Notes for Cancellation Approval:", "Payment settlement & cancellation audited by Finance.");
    if (notes === null) return; // User cancelled prompt

    portalStore.confirmReservationCancellation(bookingId, accountantName, notes);
    refreshAll();
    showToast(`✓ Cancellation approved for ${bookingId}. The room is now officially available for booking.`);
  };

  const handleRejectCancellation = (bookingId) => {
    const accountantName = currentUser?.name || 'Chief Accountant';
    const reason = window.prompt("Reason for Rejecting Cancellation (sent to Front Desk & CEO):", "Payment already finalized or guest confirmed arrival.");
    if (reason === null) return;

    portalStore.rejectReservationCancellation(bookingId, accountantName, reason);
    refreshAll();
    showToast(`Reservation ${bookingId} cancellation rejected. Reservation remains active.`);
  };

  useEffect(() => {
    const user = portalStore.getCurrentUser();
    if (!user || !['accountant', 'admin'].includes(user.role)) {
      onNavigate('vault-finance-77a');
      return;
    }
    setCurrentUser(user);
    refreshAll();

    const clock = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    const handleSync = () => refreshAll();
    window.addEventListener('ash_bookings_updated', handleSync);
    window.addEventListener('ash_cancellation_requested', handleSync);
    window.addEventListener('ash_cancellation_confirmed', handleSync);
    const unsubDining = portalStore.subscribeDiningOrders(handleSync);

    return () => {
      clearInterval(clock);
      window.removeEventListener('ash_bookings_updated', handleSync);
      window.removeEventListener('ash_cancellation_requested', handleSync);
      window.removeEventListener('ash_cancellation_confirmed', handleSync);
      unsubDining();
    };
  }, []);

  const handleLogout = () => {
    portalStore.logout();
    onNavigate('vault-finance-77a');
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

  const auditedSuitesCount = validBookings.filter((b) => b.accountantAudited).length;
  const auditedDiningCount = validDining.filter((o) => o.accountantAudited).length;

  // Active Lodge Guest Folios
  const activeStaysWithFolios = validBookings
    .filter((b) => ['Checked In', 'Confirmed'].includes(b.status))
    .map((b) => ({
      booking: b,
      folio: portalStore.getBookingFolioSummary(b)
    }));

  // ==============================================================
  // UNIFIED SPREADSHEET DATA BUILDER & LIVE CALCULATIONS
  // ==============================================================
  const unifiedSheetRows = useMemo(() => {
    const rows = [];

    // 1. Suite Bookings
    validBookings.forEach((b) => {
      const isMain = String(b.id).startsWith('ARS-BGD') || String(b.roomNumber).startsWith('6');
      const nights = Math.max(1, Number(b.nights) || 1);
      const gross = Number(b.amount) || 0;
      const defaultUnit = Math.round(gross / nights);
      const ov = rowOverrides[b.id] || {};
      const qty = ov.qty !== undefined ? Number(ov.qty) : nights;
      const unitRate = ov.unitRate !== undefined ? Number(ov.unitRate) : defaultUnit;
      const computedGross = ov.qty !== undefined || ov.unitRate !== undefined ? qty * unitRate : gross;
      const adjustment = Number(ov.adjustment) || 0;
      const net = computedGross + adjustment;

      rows.push({
        rowId: b.id,
        isCustom: false,
        recordType: 'room',
        date: (b.checkIn || b.reservationDate || b.createdAt || '').split(' ')[0],
        code: b.id,
        party: b.guestName || 'Hotel Guest',
        description: `${b.roomName || 'Suite'} (Room #${b.roomNumber || 'N/A'})`,
        streamKey: isMain ? 'suites_main' : 'suites_ext',
        streamLabel: isMain ? 'Main Wing Suites (600)' : 'Extension Suites (100)',
        channel: b.paymentMethod || 'Front Desk',
        paymentStatus: b.paymentStatus || 'Pending',
        qty,
        unitRate,
        gross: computedGross,
        adjustment,
        net,
        audited: Boolean(b.accountantAudited),
        note: ov.note !== undefined ? ov.note : ''
      });
    });

    // 2. Food & Drink Orders
    validDining.forEach((o) => {
      const isDrinks = o.orderType === 'drinks';
      const totalQty = Array.isArray(o.items) ? o.items.reduce((s, i) => s + (Number(i.qty) || 1), 0) : 1;
      const gross = Number(o.amount) || 0;
      const defaultUnit = totalQty > 0 ? Math.round(gross / totalQty) : gross;
      const ov = rowOverrides[o.id] || {};
      const qty = ov.qty !== undefined ? Number(ov.qty) : totalQty;
      const unitRate = ov.unitRate !== undefined ? Number(ov.unitRate) : defaultUnit;
      const computedGross = ov.qty !== undefined || ov.unitRate !== undefined ? qty * unitRate : gross;
      const adjustment = Number(ov.adjustment) || 0;
      const net = computedGross + adjustment;

      rows.push({
        rowId: o.id,
        isCustom: false,
        recordType: 'dining',
        date: (o.createdAt || '').split(' ')[0],
        code: o.id,
        party: o.guestName || 'Walk-In Guest',
        description: Array.isArray(o.items) ? o.items.map((i) => `${i.qty}x ${i.name}`).join(', ') : 'Dining Order',
        streamKey: isDrinks ? 'drinks' : 'food',
        streamLabel: isDrinks ? 'VIP Bar (ARB-DRK)' : 'Kitchen Food (ARB-FDD)',
        channel: o.paymentMethod || 'Room Bill',
        paymentStatus: o.paymentStatus || 'Pending',
        qty,
        unitRate,
        gross: computedGross,
        adjustment,
        net,
        audited: Boolean(o.accountantAudited),
        note: ov.note !== undefined ? ov.note : ''
      });
    });

    // 3. Accountant Custom Calculation Rows
    customRows.forEach((cr) => {
      const qty = Number(cr.qty) || 1;
      const unitRate = Number(cr.unitRate) || 0;
      const gross = qty * unitRate;
      const adjustment = Number(cr.adjustment) || 0;
      const sign = cr.streamKey === 'custom_deduction' ? -1 : 1;
      const net = sign * gross + adjustment;

      rows.push({
        rowId: cr.rowId,
        isCustom: true,
        recordType: 'custom',
        date: cr.date || new Date().toISOString().split('T')[0],
        code: cr.code || 'CALC-ROW',
        party: cr.party || 'Accountant Entry',
        description: cr.description || 'Custom Calculation Line',
        streamKey: cr.streamKey || 'custom',
        streamLabel: cr.streamKey === 'custom_deduction' ? 'Custom Deduction (-)' : 'Custom Addition (+)',
        channel: cr.channel || 'Spreadsheet Calc',
        paymentStatus: cr.paymentStatus || 'Paid',
        qty,
        unitRate,
        gross: sign * gross,
        adjustment,
        net,
        audited: true,
        note: cr.note || ''
      });
    });

    return rows;
  }, [validBookings, validDining, rowOverrides, customRows]);

  // Filtered Spreadsheet Rows + Running Balance Calculation
  const filteredSheetRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = unifiedSheetRows.filter((r) => {
      if (q) {
        const match =
          String(r.code).toLowerCase().includes(q) ||
          String(r.party).toLowerCase().includes(q) ||
          String(r.description).toLowerCase().includes(q) ||
          String(r.note).toLowerCase().includes(q);
        if (!match) return false;
      }

      if (sheetSourceFilter !== 'all') {
        if (sheetSourceFilter === 'custom') {
          if (!r.isCustom) return false;
        } else if (r.streamKey !== sheetSourceFilter) {
          return false;
        }
      }

      if (sheetChannelFilter !== 'all') {
        const ch = String(r.channel).toLowerCase();
        if (sheetChannelFilter === 'paystack' && !ch.includes('paystack')) return false;
        if (sheetChannelFilter === 'pos' && !ch.includes('pos')) return false;
        if (sheetChannelFilter === 'transfer' && (!ch.includes('transfer') && !ch.includes('cash'))) return false;
        if (sheetChannelFilter === 'room_bill' && !ch.includes('room')) return false;
      }

      if (sheetPaymentFilter === 'paid' && r.paymentStatus !== 'Paid') return false;
      if (sheetPaymentFilter === 'pending' && r.paymentStatus === 'Paid') return false;

      if (sheetDateFrom && r.date && r.date < sheetDateFrom) return false;
      if (sheetDateTo && r.date && r.date > sheetDateTo) return false;

      return true;
    });

    let running = 0;
    return list.map((r, idx) => {
      running += r.net;
      return {
        ...r,
        indexNumber: idx + 1,
        runningBalance: running
      };
    });
  }, [unifiedSheetRows, searchQuery, sheetSourceFilter, sheetChannelFilter, sheetPaymentFilter, sheetDateFrom, sheetDateTo]);

  // Spreadsheet Summary Aggregations (All Visible vs Selected Rows)
  const sheetTotals = useMemo(() => {
    const targetRows = selectedRowIds.length > 0
      ? filteredSheetRows.filter((r) => selectedRowIds.includes(r.rowId))
      : filteredSheetRows;

    const count = targetRows.length;
    const totalQty = targetRows.reduce((s, r) => s + (Number(r.qty) || 0), 0);
    const grossSum = targetRows.reduce((s, r) => s + (Number(r.gross) || 0), 0);
    const adjSum = targetRows.reduce((s, r) => s + (Number(r.adjustment) || 0), 0);
    const netSum = targetRows.reduce((s, r) => s + (Number(r.net) || 0), 0);
    const paidSum = targetRows.filter((r) => r.paymentStatus === 'Paid').reduce((s, r) => s + (Number(r.net) || 0), 0);
    const pendingSum = targetRows.filter((r) => r.paymentStatus !== 'Paid').reduce((s, r) => s + (Number(r.net) || 0), 0);
    const avgNet = count > 0 ? Math.round(netSum / count) : 0;
    const maxNet = count > 0 ? Math.max(...targetRows.map((r) => r.net)) : 0;
    const minNet = count > 0 ? Math.min(...targetRows.map((r) => r.net)) : 0;

    const discountAmount = Math.round((netSum * (Number(discountRatePercent) || 0)) / 100);
    const afterDiscount = netSum - discountAmount;
    const taxAmount = Math.round((afterDiscount * (Number(taxRatePercent) || 0)) / 100);
    const grandTotalAfterTax = afterDiscount + taxAmount;

    return {
      isSelectionActive: selectedRowIds.length > 0,
      count,
      totalQty,
      grossSum,
      adjSum,
      netSum,
      paidSum,
      pendingSum,
      avgNet,
      maxNet,
      minNet,
      discountAmount,
      afterDiscount,
      taxAmount,
      grandTotalAfterTax
    };
  }, [filteredSheetRows, selectedRowIds, taxRatePercent, discountRatePercent]);

  const evaluatedFormulaValue = useMemo(() => evaluateMathFormula(formulaInput), [formulaInput]);

  // Handlers for Spreadsheet Edits
  const handleCellEdit = (row, field, rawValue) => {
    if (row.isCustom) {
      setCustomRows((prev) =>
        prev.map((cr) => {
          if (cr.rowId !== row.rowId) return cr;
          return {
            ...cr,
            [field]: ['qty', 'unitRate', 'adjustment'].includes(field) ? Number(rawValue) || 0 : rawValue
          };
        })
      );
    } else {
      setRowOverrides((prev) => ({
        ...prev,
        [row.rowId]: {
          ...(prev[row.rowId] || {}),
          [field]: ['qty', 'unitRate', 'adjustment'].includes(field) ? Number(rawValue) || 0 : rawValue
        }
      }));
    }
  };

  const handleAddCustomRow = (prefillAmount = 0, prefillDesc = '') => {
    const newRow = {
      rowId: `CALC-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString().split('T')[0],
      code: `CALC-${Math.floor(1000 + Math.random() * 9000)}`,
      party: 'Accountant Entry',
      description: prefillDesc || 'Custom Calculation Item',
      streamKey: prefillAmount < 0 ? 'custom_deduction' : 'custom',
      channel: 'Spreadsheet Calc',
      paymentStatus: 'Paid',
      qty: 1,
      unitRate: Math.abs(Number(prefillAmount) || 0),
      adjustment: 0,
      note: ''
    };
    setCustomRows((prev) => [...prev, newRow]);
    showToast('Added new calculation row to spreadsheet.');
  };

  const handleDeleteCustomRow = (rowId) => {
    setCustomRows((prev) => prev.filter((r) => r.rowId !== rowId));
    setSelectedRowIds((prev) => prev.filter((id) => id !== rowId));
  };

  const handleResetOverrides = () => {
    setRowOverrides({});
    setSelectedRowIds([]);
    showToast('Reset all cell overrides back to original system values.');
  };

  const handleToggleSelectRow = (rowId) => {
    setSelectedRowIds((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === filteredSheetRows.length && filteredSheetRows.length > 0) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredSheetRows.map((r) => r.rowId));
    }
  };

  const handleExportCSV = () => {
    const rows = [
      [
        'Row #',
        'Date',
        'Ref / Code',
        'Guest / Party',
        'Item / Suite Description',
        'Department Stream',
        'Payment Channel',
        'Settlement Status',
        'Qty / Nights',
        'Unit Rate (NGN)',
        'Gross Amount (NGN)',
        'Adjustment / Disc (NGN)',
        'Net Total (NGN)',
        'Running Balance (NGN)',
        'Audited',
        'Accountant Note'
      ]
    ];

    filteredSheetRows.forEach((r) => {
      rows.push([
        r.indexNumber,
        `"${r.date || ''}"`,
        `"${r.code || ''}"`,
        `"${String(r.party || '').replace(/"/g, '""')}"`,
        `"${String(r.description || '').replace(/"/g, '""')}"`,
        `"${r.streamLabel}"`,
        `"${String(r.channel || '').replace(/"/g, '""')}"`,
        r.paymentStatus,
        r.qty,
        r.unitRate,
        r.gross,
        r.adjustment,
        r.net,
        r.runningBalance,
        r.audited ? 'YES' : 'NO',
        `"${String(r.note || '').replace(/"/g, '""')}"`
      ]);
    });

    // Append Summary Footer Rows
    rows.push([]);
    rows.push(['SUMMARY TOTALS', '', '', '', `${sheetTotals.count} Rows`, '', '', '', sheetTotals.totalQty, '', sheetTotals.grossSum, sheetTotals.adjSum, sheetTotals.netSum, '', '', '']);
    if (Number(discountRatePercent) > 0) {
      rows.push([`LESS DISCOUNT (${discountRatePercent}%)`, '', '', '', '', '', '', '', '', '', '', '', -sheetTotals.discountAmount, '', '', '']);
    }
    if (Number(taxRatePercent) > 0) {
      rows.push([`ADD TAX / VAT (${taxRatePercent}%)`, '', '', '', '', '', '', '', '', '', '', '', sheetTotals.taxAmount, '', '', '']);
    }
    rows.push(['GRAND TOTAL', '', '', '', '', '', '', '', '', '', '', '', sheetTotals.grandTotalAfterTax, '', '', '']);

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Arab_Signature_Accountant_Spreadsheet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Accountant Calculation Spreadsheet (.CSV)!');
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
              Arab Signature Hotel & Suites • Suites (ARS) • Food (ARB-FDD) • Drinks (ARB-DRK) • Live Calculation Sheet
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
              <span className="hidden sm:inline">Export Excel CSV</span>
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onNavigate('exec-core')}
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
              {validBookings.length + validDining.length} Total Entries
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
              <span>Verified Collected</span>
              <TrendingUp size={13} className="text-emerald-400" />
            </span>
            <div className="font-mono text-lg sm:text-xl font-extrabold mt-1 text-emerald-300">
              ₦{totalCollectedCashflow.toLocaleString()}
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              {auditedSuitesCount + auditedDiningCount} Records Audited
            </span>
          </div>
        </div>

        {/* PENDING CANCELLATIONS AUDIT & CONFIRMATION DESK (CHIEF ACCOUNTANT EXCLUSIVE) */}
        {pendingCancellations.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#2e0915] via-[#3a0c1b] to-[#1a040b] border-2 border-rose-500 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-300">
                  <ShieldAlert size={22} className="stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black tracking-widest text-rose-300 uppercase bg-rose-500/25 px-2 py-0.5 rounded border border-rose-500/40">
                      ACTION REQUIRED &bull; {pendingCancellations.length} PENDING CANCELLATION{pendingCancellations.length > 1 ? 'S' : ''}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-cinzel font-bold text-white mt-0.5">
                    Reservation Cancellation Approvals
                  </h3>
                </div>
              </div>
              <p className="text-xs text-rose-200/90 max-w-md">
                Front Desk submitted reservation cancellation requests. As Chief Accountant, you must audit payment settlement &amp; confirm cancellation before the room is officially released as Available.
              </p>
            </div>

            {/* List of Pending Cancellations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingCancellations.map((pc) => (
                <div key={pc.id} className="p-4 rounded-xl bg-black/60 border border-rose-500/40 space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <span className="font-mono font-bold text-sm text-[#f3e5ab]">{pc.id}</span>
                    <span className="font-mono font-bold text-xs text-emerald-400">
                      ₦{Number(pc.amount || 0).toLocaleString()} ({pc.paymentStatus})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block">Guest Name</span>
                      <strong className="text-white text-sm">{pc.guestName}</strong>
                      <span className="text-[10px] text-gray-400 font-mono block">{pc.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block">Suite / Wing</span>
                      <strong className="text-[#d4af37]">Room #{pc.roomNumber || 'Unassigned'}</strong>
                      <span className="text-[10px] text-gray-400 block">{pc.roomName || 'Suite'}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs">
                    <span className="text-[10px] text-rose-300 font-bold uppercase block">
                      Front Desk Cancellation Request:
                    </span>
                    <p className="text-gray-200 text-[11px] mt-0.5 italic">
                      "{pc.cancellationRequest?.reason || 'Customer requested reservation cancellation'}"
                    </p>
                    <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between font-mono">
                      <span>By: {pc.cancellationRequest?.requestedBy || 'Front Desk'}</span>
                      <span>{pc.cancellationRequest?.requestedAt || ''}</span>
                    </div>
                  </div>

                  {/* Accountant Decision Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleConfirmCancellation(pc.id)}
                      className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Check size={14} className="stroke-[2.5]" />
                      <span>✓ Confirm &amp; Release Room</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRejectCancellation(pc.id)}
                      className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <X size={14} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NAVIGATION TABS & SEARCH */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4 print:hidden">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#16030c] p-1.5 rounded-2xl border border-white/10">
            {[
              { id: 'spreadsheet', label: 'Advanced Spreadsheet', icon: Calculator },
              { id: 'overview', label: 'Channels & Overview', icon: TrendingUp },
              { id: 'folios', label: `In-Lodge Folios (${activeStaysWithFolios.length})`, icon: Receipt },
              { id: 'suites', label: `Suites ARS (${validBookings.length})`, icon: Building2 },
              { id: 'dining', label: `Food & Drinks ARB (${validDining.length})`, icon: Utensils },
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
                placeholder="Search ARS / ARB code, guest, item..."
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
            TAB 1: ADVANCED FINANCIAL CALCULATION SPREADSHEET
            ============================================================ */}
        {activeTab === 'spreadsheet' && (
          <div className="space-y-5">
            {/* A. EXCEL FORMULA BAR & TAX / DISCOUNT CALCULATOR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 rounded-3xl bg-[#16030c] border border-[#d4af37]/40 shadow-xl">
              {/* Live Formula Scratchpad */}
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-cinzel font-bold text-[#f3e5ab] flex items-center gap-1.5">
                    <Calculator size={14} className="text-[#d4af37]" />
                    <span>Instant Formula & Expression Calculator</span>
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    Supports +, -, *, /, (), and % (e.g. <code className="text-[#f3e5ab]">=60000*4 + 25000 - 10%</code>)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-[#d4af37] text-sm">
                      fx
                    </span>
                    <input
                      type="text"
                      value={formulaInput}
                      onChange={(e) => setFormulaInput(e.target.value)}
                      placeholder="Type calculation e.g. 50000 * 3 + 140000"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/70 border border-[#d4af37]/40 font-mono text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <input
                    type="text"
                    value={formulaLabel}
                    onChange={(e) => setFormulaLabel(e.target.value)}
                    placeholder="Row label (optional)"
                    className="sm:w-44 px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />

                  <div className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 font-mono text-right min-w-[140px] flex flex-col justify-center">
                    <span className="text-[9px] text-emerald-300 uppercase">Formula Result</span>
                    <span className="text-sm font-extrabold text-white">
                      {evaluatedFormulaValue !== null ? `₦${evaluatedFormulaValue.toLocaleString()}` : '₦0'}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={evaluatedFormulaValue === null}
                    onClick={() => {
                      if (evaluatedFormulaValue !== null) {
                        handleAddCustomRow(evaluatedFormulaValue, formulaLabel.trim() || `Formula: ${formulaInput}`);
                        setFormulaInput('');
                        setFormulaLabel('');
                      }
                    }}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 whitespace-nowrap ${
                      evaluatedFormulaValue !== null
                        ? `${goldGradient} shadow-md cursor-pointer`
                        : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                    }`}
                  >
                    <Plus size={14} />
                    <span>Insert to Sheet</span>
                  </button>
                </div>
              </div>

              {/* Tax, VAT & Discount Rate Modeling */}
              <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 lg:pt-0 lg:border-l lg:border-white/10 lg:pl-4 items-center">
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
                  <label className="text-[10px] font-mono uppercase text-gray-400 block">Discount / Rebate %</label>
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={discountRatePercent}
                      onChange={(e) => setDiscountRatePercent(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-black border border-white/15 font-mono text-xs text-amber-300 font-bold focus:outline-none focus:border-[#d4af37]"
                    />
                    <span className="text-xs font-mono text-gray-400">%</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300/90 block mt-1">
                    -₦{sheetTotals.discountAmount.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
                  <label className="text-[10px] font-mono uppercase text-gray-400 block">VAT / Tax Rate %</label>
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={taxRatePercent}
                      onChange={(e) => setTaxRatePercent(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-black border border-white/15 font-mono text-xs text-sky-300 font-bold focus:outline-none focus:border-[#d4af37]"
                    />
                    <span className="text-xs font-mono text-gray-400">%</span>
                  </div>
                  <span className="text-[10px] font-mono text-sky-300/90 block mt-1">
                    +₦{sheetTotals.taxAmount.toLocaleString()}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-gradient-to-br from-[#240614] to-[#0a2315] border border-emerald-500/40">
                  <span className="text-[9px] font-mono uppercase text-emerald-300 block">
                    {sheetTotals.isSelectionActive ? `Selected (${sheetTotals.count}) Net+Tax` : 'Sheet Net + Tax'}
                  </span>
                  <span className="font-mono text-sm font-extrabold text-white block mt-1">
                    ₦{sheetTotals.grandTotalAfterTax.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-mono text-gray-400 block mt-0.5">
                     Pre-Tax: ₦{sheetTotals.netSum.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* B. SPREADSHEET FILTER & ACTION TOOLBAR */}
            <div className="p-4 rounded-2xl bg-[#16030c] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Stream Filter */}
                <select
                  value={sheetSourceFilter}
                  onChange={(e) => setSheetSourceFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="all">All Revenue Streams ({unifiedSheetRows.length})</option>
                  <option value="suites_main">Main Building Suites (600 Wing)</option>
                  <option value="suites_ext">Extension Wing Suites (100 Wing)</option>
                  <option value="food">Kitchen Food (ARB-FDD)</option>
                  <option value="drinks">VIP Bar Drinks (ARB-DRK)</option>
                  <option value="custom">Custom Calculation Rows ({customRows.length})</option>
                </select>

                {/* Channel Filter */}
                <select
                  value={sheetChannelFilter}
                  onChange={(e) => setSheetChannelFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="all">All Payment Channels</option>
                  <option value="paystack">Paystack Online</option>
                  <option value="pos">POS Terminal</option>
                  <option value="transfer">Bank Transfer & Cash</option>
                  <option value="room_bill">In-Lodge Room Bill</option>
                </select>

                {/* Settlement Filter */}
                <select
                  value={sheetPaymentFilter}
                  onChange={(e) => setSheetPaymentFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="all">Paid & Pending</option>
                  <option value="paid">Paid / Settled Only</option>
                  <option value="pending">Pending / Unsettled Only</option>
                </select>

                {/* Date Range */}
                <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-gray-400 font-mono">From:</span>
                  <input
                    type="date"
                    value={sheetDateFrom}
                    onChange={(e) => setSheetDateFrom(e.target.value)}
                    className="bg-transparent text-white font-mono text-[11px] focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 font-mono">To:</span>
                  <input
                    type="date"
                    value={sheetDateTo}
                    onChange={(e) => setSheetDateTo(e.target.value)}
                    className="bg-transparent text-white font-mono text-[11px] focus:outline-none"
                  />
                  {(sheetDateFrom || sheetDateTo) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSheetDateFrom('');
                        setSheetDateTo('');
                      }}
                      className="text-[10px] text-rose-400 hover:underline ml-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddCustomRow(0, 'Custom Calculation Entry')}
                  className={`px-3.5 py-2 rounded-xl ${goldGradient} font-bold flex items-center gap-1.5 shadow-md`}
                >
                  <Plus size={14} />
                  <span>Add Calculation Row</span>
                </button>

                {Object.keys(rowOverrides).length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetOverrides}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300"
                  >
                    Reset Edits
                  </button>
                )}

                {customRows.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomRows([]);
                      showToast('Cleared all custom calculation rows.');
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300"
                  >
                    Clear Custom Rows
                  </button>
                )}
              </div>
            </div>

            {/* C. LIVE SELECTION / AGGREGATION SUMMARY RIBBON */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 p-3.5 rounded-2xl bg-[#120208] border border-[#d4af37]/30 font-mono text-xs">
              <div className="px-3 py-2 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[9px] text-gray-400 block uppercase">
                  {sheetTotals.isSelectionActive ? 'Selected Rows' : 'Active Rows (COUNT)'}
                </span>
                <span className="text-sm font-extrabold text-white">
                  {sheetTotals.count} <span className="text-[10px] text-[#f3e5ab]">(Qty: {sheetTotals.totalQty})</span>
                </span>
              </div>

              <div className="px-3 py-2 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[9px] text-gray-400 block uppercase">Gross Sum (₦)</span>
                <span className="text-sm font-extrabold text-white">₦{sheetTotals.grossSum.toLocaleString()}</span>
              </div>

              <div className="px-3 py-2 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[9px] text-gray-400 block uppercase">Adjustments Sum (₦)</span>
                <span className={`text-sm font-extrabold ${sheetTotals.adjSum >= 0 ? 'text-sky-300' : 'text-rose-400'}`}>
                  {sheetTotals.adjSum >= 0 ? '+' : ''}₦{sheetTotals.adjSum.toLocaleString()}
                </span>
              </div>

              <div className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-[9px] text-emerald-300 block uppercase">Net Total (SUM)</span>
                <span className="text-sm font-extrabold text-emerald-300">₦{sheetTotals.netSum.toLocaleString()}</span>
              </div>

              <div className="px-3 py-2 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[9px] text-gray-400 block uppercase">Average / Row (AVG)</span>
                <span className="text-sm font-extrabold text-[#f3e5ab]">₦{sheetTotals.avgNet.toLocaleString()}</span>
              </div>

              <div className="px-3 py-2 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[9px] text-gray-400 block uppercase">Min / Max Range</span>
                <span className="text-[11px] font-bold text-gray-200 block mt-0.5">
                  ₦{sheetTotals.minNet.toLocaleString()} → ₦{sheetTotals.maxNet.toLocaleString()}
                </span>
              </div>
            </div>

            {/* D. INTERACTIVE EXCEL-LIKE SPREADSHEET GRID */}
            <div className="overflow-x-auto rounded-2xl border border-[#d4af37]/35 bg-[#16030c] shadow-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#120208] text-gray-300 uppercase tracking-wider border-b border-[#d4af37]/30 text-[10px] font-mono">
                  <tr>
                    <th className="py-3 px-2.5 text-center border-r border-white/10 w-10">
                      <input
                        type="checkbox"
                        checked={filteredSheetRows.length > 0 && selectedRowIds.length === filteredSheetRows.length}
                        onChange={handleToggleSelectAll}
                        className="accent-[#d4af37] cursor-pointer"
                        title="Select all visible rows for calculation"
                      />
                    </th>
                    <th className="py-3 px-2.5 text-center border-r border-white/10 w-10">#</th>
                    <th className="py-3 px-3 border-r border-white/10">Date</th>
                    <th className="py-3 px-3 border-r border-white/10">Code / Ref</th>
                    <th className="py-3 px-3 border-r border-white/10">Guest / Description (Editable)</th>
                    <th className="py-3 px-3 border-r border-white/10">Stream</th>
                    <th className="py-3 px-2.5 text-center border-r border-white/10 w-20">Qty / Nights</th>
                    <th className="py-3 px-3 text-right border-r border-white/10 w-28">Unit Rate (₦)</th>
                    <th className="py-3 px-3 text-right border-r border-white/10 w-28">Gross (₦)</th>
                    <th className="py-3 px-3 text-right border-r border-white/10 w-28">Adj / Disc (₦)</th>
                    <th className="py-3 px-3 text-right border-r border-white/10 w-32 bg-[#1c0410]">Net Total (₦)</th>
                    <th className="py-3 px-3 text-right border-r border-white/10 w-32">Running Bal (₦)</th>
                    <th className="py-3 px-3">Audit Note / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 font-mono text-[11px]">
                  {filteredSheetRows.map((row) => {
                    const isSelected = selectedRowIds.includes(row.rowId);
                    return (
                      <tr
                        key={row.rowId}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-[#5c0725]/40'
                            : row.isCustom
                              ? 'bg-emerald-950/15 hover:bg-emerald-950/25'
                              : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <td className="py-2 px-2.5 text-center border-r border-white/5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(row.rowId)}
                            className="accent-[#d4af37] cursor-pointer"
                          />
                        </td>
                        <td className="py-2 px-2.5 text-center text-gray-500 border-r border-white/5">
                          {row.indexNumber}
                        </td>
                        <td className="py-2 px-2.5 border-r border-white/5 whitespace-nowrap">
                          {row.isCustom ? (
                            <input
                              type="date"
                              value={row.date}
                              onChange={(e) => handleCellEdit(row, 'date', e.target.value)}
                              className="bg-black/50 border border-white/15 rounded px-1.5 py-0.5 text-[11px] text-white"
                            />
                          ) : (
                            <span className="text-gray-300">{row.date || '-'}</span>
                          )}
                        </td>
                        <td className="py-2 px-3 border-r border-white/5 whitespace-nowrap">
                          <span className="font-bold text-[#f3e5ab]">{row.code}</span>
                          <span
                            className={`block text-[9px] ${
                              row.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-300'
                            }`}
                          >
                            {row.paymentStatus} • {row.channel}
                          </span>
                        </td>
                        <td className="py-2 px-3 border-r border-white/5 font-sans min-w-[200px]">
                          {row.isCustom ? (
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={row.description}
                                onChange={(e) => handleCellEdit(row, 'description', e.target.value)}
                                className="w-full bg-black/60 border border-white/15 rounded px-2 py-1 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                                placeholder="Calculation description..."
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="font-semibold text-white text-xs">{row.party}</div>
                              <div className="text-[10px] text-gray-400 truncate max-w-[240px]" title={row.description}>
                                {row.description}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 border-r border-white/5 whitespace-nowrap font-sans">
                          {row.isCustom ? (
                            <select
                              value={row.streamKey}
                              onChange={(e) => handleCellEdit(row, 'streamKey', e.target.value)}
                              className="bg-black/70 border border-white/15 rounded px-2 py-1 text-[11px] text-[#f3e5ab]"
                            >
                              <option value="custom">Addition (+)</option>
                              <option value="custom_deduction">Deduction (-)</option>
                            </select>
                          ) : (
                            <span className="text-[10px] text-gray-300">{row.streamLabel}</span>
                          )}
                        </td>

                        {/* Editable Qty / Nights */}
                        <td className="py-2 px-2 text-center border-r border-white/5">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={row.qty}
                            onChange={(e) => handleCellEdit(row, 'qty', e.target.value)}
                            className="w-16 text-center bg-black/60 border border-white/15 rounded px-1.5 py-1 text-white font-bold focus:border-[#d4af37] focus:outline-none"
                          />
                        </td>

                        {/* Editable Unit Rate */}
                        <td className="py-2 px-2 text-right border-r border-white/5">
                          <input
                            type="number"
                            step="500"
                            value={row.unitRate}
                            onChange={(e) => handleCellEdit(row, 'unitRate', e.target.value)}
                            className="w-24 text-right bg-black/60 border border-white/15 rounded px-2 py-1 text-white focus:border-[#d4af37] focus:outline-none"
                          />
                        </td>

                        {/* Auto-Computed Gross */}
                        <td className="py-2 px-3 text-right border-r border-white/5 text-gray-200 font-semibold">
                          ₦{row.gross.toLocaleString()}
                        </td>

                        {/* Editable Adjustment / Discount Cell */}
                        <td className="py-2 px-2 text-right border-r border-white/5">
                          <input
                            type="number"
                            step="500"
                            value={row.adjustment}
                            onChange={(e) => handleCellEdit(row, 'adjustment', e.target.value)}
                            placeholder="0"
                            className={`w-24 text-right bg-black/60 border border-white/15 rounded px-2 py-1 font-bold focus:border-[#d4af37] focus:outline-none ${
                              row.adjustment < 0 ? 'text-rose-400' : row.adjustment > 0 ? 'text-sky-300' : 'text-gray-400'
                            }`}
                          />
                        </td>

                        {/* Auto-Computed Net Total */}
                        <td className="py-2 px-3 text-right border-r border-white/5 bg-[#1c0410]/60 font-extrabold text-[#f3e5ab]">
                          ₦{row.net.toLocaleString()}
                        </td>

                        {/* Running Balance */}
                        <td className="py-2 px-3 text-right border-r border-white/5 text-emerald-300 font-bold">
                          ₦{row.runningBalance.toLocaleString()}
                        </td>

                        {/* Audit Note & Row Actions */}
                        <td className="py-2 px-3 min-w-[170px]">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={row.note}
                              onChange={(e) => handleCellEdit(row, 'note', e.target.value)}
                              placeholder="Add calc note..."
                              className="w-full bg-black/45 border border-white/10 rounded px-2 py-1 text-[11px] font-sans text-gray-200 placeholder-gray-600 focus:border-[#d4af37] focus:outline-none"
                            />
                            {row.isCustom && (
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomRow(row.rowId)}
                                className="p-1 rounded text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                                title="Delete custom row"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* SPREADSHEET FOOTER TOTALS */}
                <tfoot className="bg-[#120208] border-t-2 border-[#d4af37]/50 font-mono text-xs">
                  <tr>
                    <td colSpan={6} className="py-3.5 px-4 font-cinzel font-bold text-[#f3e5ab] text-right uppercase">
                      {sheetTotals.isSelectionActive
                        ? `Selected Rows Subtotal (${sheetTotals.count} Rows):`
                        : `Active Sheet Subtotal (${sheetTotals.count} Rows):`}
                    </td>
                    <td className="py-3.5 px-2 text-center font-extrabold text-white">{sheetTotals.totalQty}</td>
                    <td className="py-3.5 px-3 text-right text-gray-400">-</td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-white">
                      ₦{sheetTotals.grossSum.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-sky-300">
                      {sheetTotals.adjSum >= 0 ? '+' : ''}₦{sheetTotals.adjSum.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-sm text-[#f3e5ab] bg-[#260515]">
                      ₦{sheetTotals.netSum.toLocaleString()}
                    </td>
                    <td colSpan={2} className="py-3.5 px-3 text-right text-emerald-300 font-bold">
                      After Tax/Disc: ₦{sheetTotals.grandTotalAfterTax.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: CHANNELS & FINANCIAL OVERVIEW
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
                Every room code generated at Reception (<code className="text-white">ARS-BGD</code> / <code className="text-white">ARS-EXT</code>) and every food (<code className="text-white">ARB-FDD</code>) or drink (<code className="text-white">ARB-DRK</code>) booking added to a guest's room bill updates this ledger and your calculation spreadsheet automatically.
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: IN-LODGE GUEST FOLIOS & ROOM BILL RECEIVABLES
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
            TAB 4: SUITES ACCOMMODATION LEDGER (ARS-BGD & ARS-EXT)
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
                        {b.status === 'Cancellation Pending' ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] font-mono font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40 animate-pulse">
                              Cancellation Requested
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleConfirmCancellation(b.id)}
                                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-md cursor-pointer flex items-center gap-1"
                                title="Confirm Cancellation & Release Room to Available"
                              >
                                <Check size={11} />
                                <span>Confirm Cancel</span>
                              </button>
                              <button
                                onClick={() => handleRejectCancellation(b.id)}
                                className="px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white text-[10px] cursor-pointer"
                                title="Reject Cancellation Request"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ) : (
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
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ============================================================
            TAB 5: FOOD (ARB-FDD) & DRINKS (ARB-DRK) LEDGER
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
                <span className="text-emerald-800 block font-semibold">Total Collected Revenue</span>
                <strong className="font-mono text-base text-emerald-900">₦{totalCollectedCashflow.toLocaleString()}</strong>
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
                <tr className="border-t-2 border-[#5c0725] text-sm font-bold text-[#5c0725]">
                  <td className="py-3 font-sans">TOTAL VERIFIED COLLECTED REVENUE</td>
                  <td className="py-3 text-center">AUDITED</td>
                  <td className="py-3 text-right">₦{totalCollectedCashflow.toLocaleString()}</td>
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
