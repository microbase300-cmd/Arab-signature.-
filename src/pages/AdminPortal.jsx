import React, { useState, useEffect } from 'react';
import { portalStore } from '../data/portalStore';
import { 
  ShieldCheck, DollarSign, TrendingUp, BedDouble, Settings, 
  FileText, Activity, Save, ArrowLeft, LogOut, CheckCircle2, 
  AlertTriangle, Lock, Users, Phone, MapPin, Printer, RefreshCw, 
  Sparkles, KeyRound, Clock, Edit3, ChevronRight
} from 'lucide-react';

export default function AdminPortal({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('rates'); // 'rates' | 'ledger' | 'settings' | 'logs'
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rates, setRates] = useState([]);
  const [hotelConfig, setHotelConfig] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Editable Rates State
  const [rateEdits, setRateEdits] = useState({});

  // Editable Hotel Config State
  const [configEdits, setConfigEdits] = useState({
    name: 'Arab Signature Hotel & Suites',
    phone: '0812 578 6875',
    whatsapp: '2348125786875',
    address: 'Nsugbe, Onitsha, Anambra State, Nigeria',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    cancellationPolicy: 'Free cancellation up to 48 hours prior to arrival. 50% retention charge applies within 24 hours of scheduled arrival.'
  });

  // Refresh all state from portalStore
  const refreshData = () => {
    const currentRooms = portalStore.getRooms();
    const currentBookings = portalStore.getBookings();
    const currentRates = portalStore.getRoomRates();
    const currentConfig = portalStore.getHotelConfig();
    const currentLogs = portalStore.getActivityLogs();

    setRooms(currentRooms);
    setBookings(currentBookings);
    setRates(currentRates);
    setHotelConfig(currentConfig);
    setActivityLogs(currentLogs);

    // Initialize rate edit fields
    const initialRates = {};
    currentRates.forEach(r => {
      initialRates[r.id] = r.price;
    });
    setRateEdits(initialRates);

    // Initialize config fields
    if (currentConfig) {
      setConfigEdits(prev => ({
        ...prev,
        phone: currentConfig.phone || prev.phone,
        address: currentConfig.address || prev.address
      }));
    }
  };

  useEffect(() => {
    const user = portalStore.getCurrentUser();
    // Verify user is authenticated and has admin rights
    if (!user) {
      onNavigate('portal-login');
      return;
    }
    
    setCurrentUser(user);
    refreshData();
  }, []);

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleLogout = () => {
    portalStore.logout();
    onNavigate('portal-login');
  };

  // Save new room rate
  const handleSaveRate = (roomId) => {
    const newPrice = rateEdits[roomId];
    if (!newPrice || isNaN(newPrice) || newPrice < 5000) {
      alert("Please provide a valid price in Naira (minimum ₦5,000).");
      return;
    }
    portalStore.updateRoomRate(roomId, newPrice);
    refreshData();
    showToast(`Suite rate updated for ${roomId.toUpperCase()} to ₦${Number(newPrice).toLocaleString()}`);
  };

  // Save all room rates
  const handleSaveAllRates = () => {
    rates.forEach(r => {
      if (rateEdits[r.id]) {
        portalStore.updateRoomRate(r.id, rateEdits[r.id]);
      }
    });
    refreshData();
    showToast("All suite rates updated live across the hotel website & booking engine!");
  };

  // Save hotel configuration
  const handleSaveConfig = (e) => {
    e.preventDefault();
    portalStore.updateHotelConfig(configEdits);
    refreshData();
    showToast("Hotel operations contact info saved successfully.");
  };

  // Financial Calculations
  const totalGrossRevenue = bookings.reduce((sum, b) => {
    return sum + (b.paymentStatus === 'Paid' ? Number(b.amount || 0) : 0);
  }, 0);

  const totalOccupied = rooms.filter(r => r.status === 'occupied').length;
  const occupancyPercent = rooms.length > 0 ? Math.round((totalOccupied / rooms.length) * 100) : 0;
  const totalNightsBooked = bookings.reduce((sum, b) => sum + (Number(b.nights) || 1), 0);
  const averageDailyRate = totalNightsBooked > 0 ? Math.round(totalGrossRevenue / totalNightsBooked) : 45000;

  // Paystack vs Front Desk split
  const paystackRevenue = bookings
    .filter(b => b.paymentMethod && b.paymentMethod.toLowerCase().includes('paystack'))
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const frontDeskRevenue = totalGrossRevenue - paystackRevenue;

  // Access Denied screen for non-admin accounts
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0e0106] text-gray-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-[#16030c] border border-red-500/40 rounded-3xl p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
            <Lock size={28} />
          </div>
          <h2 className="font-cinzel text-xl font-bold text-white">
            Admin Access Restricted
          </h2>
          <p className="text-xs text-gray-400">
            You are currently signed in as <span className="text-white font-medium">{currentUser.name}</span> with front desk reception privileges.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => onNavigate('reception')}
              className="px-4 py-2 rounded-xl bg-[#5c0725] text-white text-xs font-semibold"
            >
              Go to Reception Desk
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-semibold"
            >
              Sign In as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0106] text-gray-100 flex flex-col font-sans">
      
      {/* 1. Admin Top Command Header */}
      <header className="sticky top-0 z-40 bg-[#16030c]/95 border-b border-[#d4af37]/40 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Admin Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#d4af37]/60 bg-[#120208] shadow-md shadow-[#d4af37]/20 flex-shrink-0">
            <img src="/logo.jpg" alt="Option 1 Monogram" className="w-full h-full object-cover scale-110" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel font-bold text-base sm:text-lg text-white tracking-wide">
                Executive Management Portal
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono uppercase tracking-wider">
                General Manager
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Arab Signature Hotel & Suites • Nsugbe, Onitsha
            </p>
          </div>
        </div>

        {/* Executive Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Switch to Reception Desk */}
          <button
            onClick={() => onNavigate('reception')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Open Front Desk Reception View"
          >
            <BedDouble size={14} className="text-[#d4af37]" />
            <span className="hidden sm:inline">Reception Desk</span>
          </button>

          {/* Guest Website */}
          <button
            onClick={() => onNavigate('home')}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Return to Public Website"
          >
            <ArrowLeft size={14} className="text-[#d4af37]" />
            <span className="hidden sm:inline">Guest Site</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-all"
            title="Sign Out"
          >
            <LogOut size={15} />
          </button>
        </div>

      </header>

      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="bg-[#5c0725] border-b border-[#d4af37]/50 text-[#f3e5ab] px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 shadow-lg animate-in fade-in">
          <Sparkles size={14} className="text-[#d4af37]" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* 2. Main Executive Dashboard Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Executive KPI Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Gross Revenue */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16030c] to-[#2e0513] border border-[#d4af37]/40 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="uppercase tracking-wider font-semibold">Total Gross Revenue</span>
              <DollarSign size={16} className="text-[#d4af37]" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#f3e5ab] mt-2">
              ₦{totalGrossRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>Paid Reservations to Date</span>
            </div>
          </div>

          {/* Occupancy Rate */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16030c] to-[#120208] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="uppercase tracking-wider font-semibold">Live Occupancy</span>
              <BedDouble size={16} className="text-[#d4af37]" />
            </div>
            <div className="text-2xl sm:text-3xl font-cinzel font-bold text-white mt-2">
              {occupancyPercent}%
            </div>
            <div className="text-[11px] text-gray-400 mt-2">
              {totalOccupied} of 12 luxury suites occupied
            </div>
          </div>

          {/* Average Daily Rate (ADR) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16030c] to-[#120208] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="uppercase tracking-wider font-semibold">Avg Daily Rate (ADR)</span>
              <Activity size={16} className="text-[#d4af37]" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-2">
              ₦{averageDailyRate.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-400 mt-2">
              Average yield per suite night
            </div>
          </div>

          {/* Revenue Split */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16030c] to-[#120208] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="uppercase tracking-wider font-semibold">Payment Channels</span>
              <ShieldCheck size={16} className="text-[#d4af37]" />
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Online Paystack:</span>
                <span className="font-mono font-semibold text-emerald-400">₦{paystackRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Front Desk / POS:</span>
                <span className="font-mono font-semibold text-[#f3e5ab]">₦{frontDeskRevenue.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-[10px] text-gray-500 mt-2">
              {bookings.length} verified transactions
            </div>
          </div>

        </div>

        {/* 3. Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'rates'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-[#16030c] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Edit3 size={14} />
            <span>Suite Rate Manager (Live Pricing)</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'ledger'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-[#16030c] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <FileText size={14} />
            <span>Master Financial Ledger ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-[#16030c] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Settings size={14} />
            <span>Hotel Operations Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-[#16030c] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Activity size={14} />
            <span>Security & Audit Trail</span>
          </button>
        </div>

        {/* 4. TAB CONTENT: Live Suite Rate Manager */}
        {activeTab === 'rates' && (
          <div className="space-y-6">
            
            {/* Header & Notice */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#16030c] border border-[#d4af37]/30">
              <div>
                <h3 className="font-cinzel font-bold text-base text-white">
                  Live Suite Pricing Engine
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Changes updated here apply immediately to the public website, booking engine, and front desk reception.
                </p>
              </div>

              <button
                onClick={handleSaveAllRates}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#d4af37]/20 hover:scale-102 transition-all self-start sm:self-auto"
              >
                <Save size={15} />
                <span>Save All Rates Live</span>
              </button>
            </div>

            {/* Room Rate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rates.map((room) => {
                const currentPrice = rateEdits[room.id] !== undefined ? rateEdits[room.id] : room.price;

                return (
                  <div
                    key={room.id}
                    className="p-5 rounded-2xl bg-[#16030c] border border-white/10 hover:border-[#d4af37]/50 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] block">
                          Suite ID: {room.id}
                        </span>
                        <h4 className="font-cinzel font-bold text-base text-white mt-0.5">
                          {room.name}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                          {room.description}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Current Live</span>
                        <div className="font-mono font-bold text-base text-[#f3e5ab]">
                          {room.priceFormatted}
                        </div>
                      </div>
                    </div>

                    {/* Pricing Input & Save */}
                    <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#d4af37]">
                          ₦
                        </span>
                        <input
                          type="number"
                          step="5000"
                          min="5000"
                          value={currentPrice}
                          onChange={(e) => setRateEdits({ ...rateEdits, [room.id]: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>

                      <button
                        onClick={() => handleSaveRate(room.id)}
                        className="px-4 py-2 rounded-xl bg-[#5c0725] hover:bg-[#770a31] text-[#f3e5ab] text-xs font-semibold border border-[#d4af37]/40 flex items-center gap-1.5 transition-all"
                      >
                        <Save size={13} />
                        <span>Update</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* 5. TAB CONTENT: Master Financial Ledger */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#16030c] border border-white/10">
              <div>
                <h3 className="font-cinzel font-bold text-base text-white">
                  Master Financial & Audit Ledger
                </h3>
                <p className="text-xs text-gray-400">
                  Comprehensive audit trail of all booking revenues, payment gateways, and guest settlements.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <Printer size={14} className="text-[#d4af37]" />
                <span>Print Ledger Report</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#16030c] shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#120208] text-gray-400 uppercase tracking-wider border-b border-white/10 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ref Code</th>
                    <th className="py-3 px-4">Guest</th>
                    <th className="py-3 px-4">Room & Floor</th>
                    <th className="py-3 px-4">Nights</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#f3e5ab]">
                        {b.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white">{b.guestName}</div>
                        <div className="text-[10px] text-gray-400">{b.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-gray-300">{b.roomName}</div>
                        <div className="text-[10px] text-[#d4af37] font-mono">
                          Room #{b.roomNumber || 'Assigned'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">
                        {b.nights} {b.nights === 1 ? 'Night' : 'Nights'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-emerald-400">{b.paymentMethod}</span>
                        <div className="text-[10px] text-gray-500">{b.createdAt}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#f3e5ab]">
                        ₦{Number(b.amount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {b.paymentStatus || 'Paid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 6. TAB CONTENT: Hotel Operations Settings */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveConfig} className="space-y-6">
            
            <div className="p-6 rounded-2xl bg-[#16030c] border border-white/10 space-y-5">
              <div>
                <h3 className="font-cinzel font-bold text-base text-white">
                  Hotel Operations Configuration
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update primary contact telephone, WhatsApp direct line, location, and check-in policies.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Hotel Front Desk Phone */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">Front Desk Phone Hotline *</label>
                  <input
                    type="text"
                    required
                    value={configEdits.phone}
                    onChange={(e) => setConfigEdits({ ...configEdits, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                  <p className="text-[10px] text-gray-500">Official hotel line: 0812 578 6875</p>
                </div>

                {/* WhatsApp Hotline */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">WhatsApp Booking Number (Intl format) *</label>
                  <input
                    type="text"
                    required
                    value={configEdits.whatsapp}
                    onChange={(e) => setConfigEdits({ ...configEdits, whatsapp: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                  <p className="text-[10px] text-gray-500">Format: 2348125786875</p>
                </div>

                {/* Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-gray-300 font-medium">Physical Hotel Address *</label>
                  <input
                    type="text"
                    required
                    value={configEdits.address}
                    onChange={(e) => setConfigEdits({ ...configEdits, address: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Check In / Check Out Times */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">Standard Check-In Time</label>
                  <input
                    type="text"
                    value={configEdits.checkInTime}
                    onChange={(e) => setConfigEdits({ ...configEdits, checkInTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">Standard Check-Out Time</label>
                  <input
                    type="text"
                    value={configEdits.checkOutTime}
                    onChange={(e) => setConfigEdits({ ...configEdits, checkOutTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Cancellation Policy */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-gray-300 font-medium">Guest Cancellation & Refund Policy</label>
                  <textarea
                    rows="3"
                    value={configEdits.cancellationPolicy}
                    onChange={(e) => setConfigEdits({ ...configEdits, cancellationPolicy: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-101 transition-all flex items-center gap-2"
                >
                  <Save size={15} />
                  <span>Save Operations Settings</span>
                </button>
              </div>

            </div>

          </form>
        )}

        {/* 7. TAB CONTENT: Security & Audit Trail */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#16030c] border border-white/10">
              <div>
                <h3 className="font-cinzel font-bold text-base text-white">
                  Security Audit Trail & Activity Logs
                </h3>
                <p className="text-xs text-gray-400">
                  Real-time tamper-evident system logs tracking all logins, pricing alterations, and room status updates.
                </p>
              </div>

              <button
                onClick={refreshData}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                title="Refresh Logs"
              >
                <RefreshCw size={15} />
              </button>
            </div>

            {/* Log Stream */}
            <div className="p-4 rounded-2xl bg-[#090105] border border-white/10 font-mono text-xs text-gray-300 space-y-2 max-h-96 overflow-y-auto">
              {activityLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 py-1 border-b border-white/5">
                  <span className="text-[#d4af37] flex-shrink-0">❯</span>
                  <span className="leading-relaxed">{log}</span>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
