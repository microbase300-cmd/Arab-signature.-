import React, { useState, useEffect } from 'react';
import { portalStore } from '../data/portalStore';
import { 
  ShieldCheck, DollarSign, TrendingUp, BedDouble, Settings, 
  FileText, Activity, Save, ArrowLeft, LogOut, CheckCircle2, 
  AlertTriangle, Lock, Users, Phone, MapPin, Printer, RefreshCw, 
  Sparkles, KeyRound, Clock, Edit3, ChevronRight, UserCheck, 
  AlertCircle, ShieldAlert, Key, Check, Eye, EyeOff, Utensils,
  Wine, Plus, Trash2, Search, X, Flame, GlassWater, Beer
} from 'lucide-react';

export default function AdminPortal({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('rates'); // 'rates' | 'dining' | 'ledger' | 'receptionist' | 'logins' | 'settings' | 'logs'
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rates, setRates] = useState([]);
  const [hotelConfig, setHotelConfig] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [receptionUser, setReceptionUser] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Editable Rates State
  const [rateEdits, setRateEdits] = useState({});

  // Editable Dining & Drinks Menu State (ADMIN EXCLUSIVE CONTROL)
  const [diningMenu, setDiningMenu] = useState([]);
  const [diningEdits, setDiningEdits] = useState({});
  const [diningCategoryFilter, setDiningCategoryFilter] = useState('all');
  const [diningSearchQuery, setDiningSearchQuery] = useState('');
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    name: '',
    category: 'arabian',
    categoryLabel: 'Arabian Specialties',
    type: 'food',
    desc: '',
    price: '',
    isSignature: false
  });

  // Editable Receptionist Credentials
  const [receptionForm, setReceptionForm] = useState({
    username: '',
    password: '',
    name: ''
  });
  const [showReceptionPass, setShowReceptionPass] = useState(false);

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
    const currentLoginAttempts = portalStore.getLoginAttempts();
    const currentReception = portalStore.getReceptionistUser();
    const currentDining = portalStore.getDiningMenu();

    setRooms(currentRooms);
    setBookings(currentBookings);
    setRates(currentRates);
    setHotelConfig(currentConfig);
    setActivityLogs(currentLogs);
    setLoginAttempts(currentLoginAttempts);
    setReceptionUser(currentReception);
    setDiningMenu(currentDining);

    // Initialize rate edit fields
    const initialRates = {};
    currentRates.forEach(r => {
      initialRates[r.id] = r.price;
    });
    setRateEdits(initialRates);

    // Initialize dining menu edit fields
    const initialDining = {};
    currentDining.forEach(item => {
      initialDining[item.id] = item.price;
    });
    setDiningEdits(initialDining);

    // Initialize reception credentials form
    if (currentReception) {
      setReceptionForm({
        username: currentReception.username,
        password: currentReception.password,
        name: currentReception.name
      });
    }

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
    if (!user || user.role !== 'admin') {
      onNavigate('admin-login');
      return;
    }
    
    setCurrentUser(user);
    refreshData();

    const handleLiveSync = () => refreshData();
    window.addEventListener('ash_bookings_updated', handleLiveSync);
    window.addEventListener('ash_rates_updated', handleLiveSync);
    window.addEventListener('ash_rooms_updated', handleLiveSync);
    window.addEventListener('ash_menu_updated', handleLiveSync);
    const unsubscribeRooms = portalStore.subscribeRooms(() => refreshData());
    const unsubscribeDining = portalStore.subscribeDiningMenu(() => refreshData());

    return () => {
      window.removeEventListener('ash_bookings_updated', handleLiveSync);
      window.removeEventListener('ash_rates_updated', handleLiveSync);
      window.removeEventListener('ash_rooms_updated', handleLiveSync);
      window.removeEventListener('ash_menu_updated', handleLiveSync);
      unsubscribeRooms();
      unsubscribeDining();
    };
  }, []);

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4500);
  };

  const handleLogout = () => {
    portalStore.logout();
    onNavigate('admin-login');
  };

  // 1. Save new room rate
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

  const handleSaveAllRates = () => {
    rates.forEach(r => {
      if (rateEdits[r.id]) {
        portalStore.updateRoomRate(r.id, rateEdits[r.id]);
      }
    });
    refreshData();
    showToast("All suite rates updated live across the hotel website & booking engine!");
  };

  // 1.1 Food & Drinks Menu Price Adjustment (ADMIN EXCLUSIVE CONTROL)
  const handleSaveMenuItemPrice = (itemId) => {
    const newPrice = diningEdits[itemId];
    if (newPrice === undefined || isNaN(newPrice) || Number(newPrice) < 0) {
      alert("Please provide a valid price in Naira.");
      return;
    }
    portalStore.updateMenuItemPrice(itemId, newPrice);
    refreshData();
    const item = diningMenu.find(i => i.id === itemId);
    showToast(`Price updated for ${item?.name || itemId} to ₦${Number(newPrice).toLocaleString()}`);
  };

  const handleSaveAllDiningPrices = () => {
    portalStore.updateAllMenuPrices(diningEdits);
    refreshData();
    showToast("All Al-Sultan food & drinks prices updated live across the hotel website!");
  };

  const handleCreateMenuItem = (e) => {
    e.preventDefault();
    if (!newItemForm.name || !newItemForm.price) {
      alert("Please provide item name and price.");
      return;
    }

    const categoryMap = {
      arabian: "Arabian Specialties",
      continental: "Continental & Local Delicacies",
      spirits: "Champagne & VIP Spirits",
      cocktails: "Signature Cocktails & Mocktails",
      beers: "Beer, Wine & Refreshments"
    };

    portalStore.addMenuItem({
      name: newItemForm.name,
      category: newItemForm.category,
      categoryLabel: categoryMap[newItemForm.category] || "Specialties",
      type: newItemForm.type,
      desc: newItemForm.desc,
      price: Number(newItemForm.price),
      isSignature: newItemForm.isSignature
    });

    const addedName = newItemForm.name;
    refreshData();
    setIsAddMenuItemOpen(false);
    setNewItemForm({
      name: '',
      category: 'arabian',
      categoryLabel: 'Arabian Specialties',
      type: 'food',
      desc: '',
      price: '',
      isSignature: false
    });
    showToast(`New item '${addedName}' added to Al-Sultan Menu.`);
  };

  const handleDeleteMenuItem = (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to remove '${itemName}' from the Al-Sultan menu?`)) {
      portalStore.deleteMenuItem(itemId);
      refreshData();
      showToast(`Item '${itemName}' removed from menu.`);
    }
  };

  // 2. Save Updated Receptionist Credentials (ADMIN CONTROL)
  const handleSaveReceptionCredentials = (e) => {
    e.preventDefault();
    if (!receptionForm.username || !receptionForm.password) {
      alert("Receptionist username and password cannot be empty.");
      return;
    }

    portalStore.updateReceptionistCredentials(
      receptionForm.username,
      receptionForm.password,
      receptionForm.name
    );
    refreshData();
    showToast(`Receptionist login updated to '${receptionForm.username}' with new password.`);
  };

  // 3. Confirm Payment by Backend / Admin Audit (ADMIN CONTROL)
  const handleConfirmPaymentBackend = (bookingId) => {
    portalStore.confirmPaymentBackend(bookingId);
    refreshData();
    showToast(`Payment for reservation ${bookingId} verified and confirmed. Receptionist can now issue room keys & receipt.`);
  };

  // 4. Save hotel configuration
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

  const pendingRevenue = bookings.reduce((sum, b) => {
    return sum + (b.paymentStatus !== 'Paid' ? Number(b.amount || 0) : 0);
  }, 0);

  const totalOccupied = rooms.filter(r => r.status === 'occupied').length;
  const occupancyPercent = rooms.length > 0 ? Math.round((totalOccupied / rooms.length) * 100) : 0;
  const totalNightsBooked = bookings.reduce((sum, b) => sum + (Number(b.nights) || 1), 0);
  const averageDailyRate = totalNightsBooked > 0 ? Math.round(totalGrossRevenue / totalNightsBooked) : 45000;

  // Paystack vs Front Desk split
  const paystackRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid' && b.paymentMethod && b.paymentMethod.toLowerCase().includes('paystack'))
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const frontDeskRevenue = totalGrossRevenue - paystackRevenue;

  // Login Monitor Stats
  const successfulLogins = loginAttempts.filter(l => l.status === 'SUCCESS').length;
  const failedLogins = loginAttempts.filter(l => l.status === 'FAILED').length;

  return (
    <div className="min-h-screen bg-[#090105] text-gray-100 flex flex-col font-sans">
      
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
                Executive General Manager Portal
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono uppercase tracking-wider">
                Full Security Privilege
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Arab Signature Hotel & Suites • Nsugbe, Onitsha
            </p>
          </div>
        </div>

        {/* Executive Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Guest Website Shortcut */}
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
            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-all flex items-center gap-1.5 text-xs font-medium"
            title="Sign Out of Admin Portal"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Log Out</span>
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
          
          {/* Gross Confirmed Revenue */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16030c] to-[#2e0513] border border-[#d4af37]/40 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="uppercase tracking-wider font-semibold">Confirmed Gross Revenue</span>
              <DollarSign size={16} className="text-[#d4af37]" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#f3e5ab] mt-2">
              ₦{totalGrossRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center justify-between">
              <span>Verified Settlements</span>
              {pendingRevenue > 0 && (
                <span className="text-amber-400 font-mono text-[10px]">
                  +₦{pendingRevenue.toLocaleString()} Pending
                </span>
              )}
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
              {totalOccupied} of {rooms.length || 34} luxury suites occupied
            </div>
          </div>

          {/* Security & Login Health */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16030c] to-[#120208] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="uppercase tracking-wider font-semibold">Login Security Monitor</span>
              <ShieldCheck size={16} className="text-[#d4af37]" />
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {successfulLogins}
              </span>
              <span className="text-xs text-gray-400">authorized</span>
              {failedLogins > 0 ? (
                <span className="text-xs font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/40">
                  {failedLogins} Failed Attempts
                </span>
              ) : (
                <span className="text-xs text-emerald-400">0 Breaches</span>
              )}
            </div>
            <div className="text-[10px] text-gray-500 mt-2">
              Active Monitoring on Nsugbe Terminals
            </div>
          </div>

          {/* Payment Channels Split */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16030c] to-[#120208] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="uppercase tracking-wider font-semibold">Payment Channels</span>
              <Activity size={16} className="text-[#d4af37]" />
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
              {bookings.length} total transactions audited
            </div>
          </div>

        </div>

        {/* 3. Executive Tab Navigation */}
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
            onClick={() => setActiveTab('dining')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'dining'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-[#16030c] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Utensils size={14} />
            <span>Al-Sultan Food & Drinks Menu ({diningMenu.length})</span>
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
            <span>Master Payments & Backend Verifier ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('receptionist')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'receptionist'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-[#16030c] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <UserCheck size={14} />
            <span>Receptionist Login Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('logins')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'logins'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-[#16030c] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <ShieldAlert size={14} />
            <span>Login Attempts & Security Monitor ({loginAttempts.length})</span>
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
            <span>Hotel Operations</span>
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
            <span>System Audit Trail</span>
          </button>

        </div>

        {/* ======================================================== */}
        {/* 4. TAB CONTENT: LIVE SUITE RATE MANAGER */}
        {/* ======================================================== */}
        {activeTab === 'rates' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#16030c] border border-[#d4af37]/30">
              <div>
                <h3 className="font-cinzel font-bold text-base text-white">
                  Live Suite Pricing Engine
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Adjust base rates in Naira. Changes apply immediately to the public booking engine, guest pages, and front desk reception.
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

        {/* ======================================================== */}
        {/* TAB CONTENT: AL-SULTAN FOOD & DRINKS MENU MANAGER (ADMIN EXCLUSIVE) */}
        {/* ======================================================== */}
        {activeTab === 'dining' && (
          <div className="space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#16030c] border border-[#d4af37]/35 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel font-bold text-base sm:text-lg text-white">
                    Al-Sultan Food & Drinks Menu Manager
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#5c0725] border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono uppercase tracking-wider font-bold">
                    Admin Exclusive Control
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
                  Adjust live pricing in Naira for all gourmet dishes, VIP champagnes, Don Julio 1942, spirits, cocktails, and wines. Receptionists have view-only access and cannot alter menu prices.
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
                <button
                  onClick={() => setIsAddMenuItemOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/15 transition-all shadow-md"
                >
                  <Plus size={14} />
                  <span>Add New Item</span>
                </button>

                <button
                  onClick={handleSaveAllDiningPrices}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#d4af37]/20 hover:scale-102 transition-all"
                >
                  <Save size={15} />
                  <span>Save All Prices Live</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#120208] p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'food', label: 'Food Only' },
                  { id: 'drinks', label: 'Drinks Only' },
                  { id: 'arabian', label: 'Arabian' },
                  { id: 'continental', label: 'Continental/Local' },
                  { id: 'spirits', label: 'Champagne & Spirits' },
                  { id: 'cocktails', label: 'Cocktails' },
                  { id: 'beers', label: 'Beer & Wine' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setDiningCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      diningCategoryFilter === cat.id
                        ? 'bg-[#d4af37] text-black font-bold shadow-md'
                        : 'bg-[#16030c] text-gray-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative sm:w-64">
                <input
                  type="text"
                  placeholder="Filter menu items..."
                  value={diningSearchQuery}
                  onChange={(e) => setDiningSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                />
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {diningMenu
                .filter((item) => {
                  const matchCat =
                    diningCategoryFilter === 'all'
                      ? true
                      : diningCategoryFilter === 'food'
                      ? item.type === 'food'
                      : diningCategoryFilter === 'drinks'
                      ? item.type === 'drinks'
                      : item.category === diningCategoryFilter;

                  const matchSearch =
                    !diningSearchQuery.trim() ||
                    item.name.toLowerCase().includes(diningSearchQuery.toLowerCase()) ||
                    item.desc.toLowerCase().includes(diningSearchQuery.toLowerCase()) ||
                    item.categoryLabel.toLowerCase().includes(diningSearchQuery.toLowerCase());

                  return matchCat && matchSearch;
                })
                .map((item) => {
                  const currentPrice = diningEdits[item.id] !== undefined ? diningEdits[item.id] : item.price;

                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#16030c] border border-white/10 hover:border-[#d4af37]/40 transition-all flex flex-col justify-between space-y-3.5 shadow-lg"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37]">
                              {item.categoryLabel}
                            </span>
                            <h4 className="font-bold text-sm text-white line-clamp-1">
                              {item.name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${item.type === 'drinks' ? 'bg-purple-950/70 text-purple-300 border border-purple-500/30' : 'bg-amber-950/70 text-amber-300 border border-amber-500/30'}`}>
                              {item.type}
                            </span>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id, item.name)}
                              className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/40 transition-all"
                              title="Delete Item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      {/* Price Edit Control */}
                      <div className="pt-2.5 border-t border-white/10 flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#d4af37]">
                            ₦
                          </span>
                          <input
                            type="number"
                            step="500"
                            min="0"
                            value={currentPrice}
                            onChange={(e) => setDiningEdits({ ...diningEdits, [item.id]: e.target.value })}
                            className="w-full pl-7 pr-2 py-1.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#d4af37]"
                          />
                        </div>

                        <button
                          onClick={() => handleSaveMenuItemPrice(item.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#5c0725] hover:bg-[#770a31] text-[#f3e5ab] text-[11px] font-semibold border border-[#d4af37]/40 flex items-center gap-1 transition-all"
                        >
                          <Save size={12} />
                          <span>Update</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 5. TAB CONTENT: MASTER PAYMENTS & BACKEND VERIFIER */}
        {/* ======================================================== */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#16030c] border border-white/10">
              <div>
                <h3 className="font-cinzel font-bold text-base text-white">
                  Executive Payment Audit & Backend Verification
                </h3>
                <p className="text-xs text-gray-400">
                  Admins see all transactions. Receptionists can only issue keys and print receipts when payments are confirmed by the backend or approved here.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <Printer size={14} className="text-[#d4af37]" />
                <span>Print Ledger</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#16030c] shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#120208] text-gray-400 uppercase tracking-wider border-b border-white/10 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ref Code</th>
                    <th className="py-3 px-4">Guest Details</th>
                    <th className="py-3 px-4">Suite</th>
                    <th className="py-3 px-4">Channel & Time</th>
                    <th className="py-3 px-4">Billed Amount</th>
                    <th className="py-3 px-4">Payment Status</th>
                    <th className="py-3 px-4 text-right">Admin Backend Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map((b) => {
                    const isConfirmed = b.paymentStatus === 'Paid';

                    return (
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
                            Room #{b.roomNumber || 'Pending'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-gray-300">{b.paymentMethod}</div>
                          <div className="text-[10px] text-gray-500">{b.createdAt}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#f3e5ab]">
                          ₦{Number(b.amount).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          {isConfirmed ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
                              <CheckCircle2 size={11} />
                              <span>Paid (Confirmed)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
                              <Clock size={11} />
                              <span>Pending Backend</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isConfirmed ? (
                            <span className="text-[11px] text-gray-500 italic">
                              Verified {b.verifiedAt || 'OK'}
                            </span>
                          ) : (
                            <button
                              onClick={() => handleConfirmPaymentBackend(b.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-all shadow-md shadow-emerald-900/40 flex items-center gap-1 ml-auto"
                            >
                              <Check size={12} />
                              <span>Confirm Payment</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 6. TAB CONTENT: RECEPTIONIST LOGIN CREDENTIALS MANAGER */}
        {/* ======================================================== */}
        {activeTab === 'receptionist' && (
          <div className="max-w-2xl space-y-6">
            
            <div className="p-6 rounded-2xl bg-[#16030c] border border-[#d4af37]/40 shadow-xl space-y-5">
              
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <UserCheck size={18} className="text-[#d4af37]" />
                    <h3 className="font-cinzel font-bold text-lg text-white">
                      Receptionist Login Credentials
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    As Executive General Manager, you have full control to change the front desk login username and password anytime.
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                  Account Active
                </span>
              </div>

              {/* Current Active Credentials Info Box */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                <span className="text-[11px] font-semibold text-[#f3e5ab] uppercase tracking-wider block">
                  Current Front Desk Login Information:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
                  <div>
                    <span className="text-gray-500">Username: </span>
                    <span className="font-mono text-white font-semibold">{receptionUser?.username}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Current Password: </span>
                    <span className="font-mono text-[#f3e5ab] font-semibold">{receptionUser?.password}</span>
                  </div>
                </div>
                <div className="text-[10px] text-gray-500 pt-1">
                  Private Reception Gate: <span className="text-gray-300 font-mono">http://localhost:5173/#reception-login</span>
                </div>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleSaveReceptionCredentials} className="space-y-4 text-xs">
                
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">Front Desk Staff / Concierge Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Front Desk Concierge Desk 1"
                    value={receptionForm.name}
                    onChange={(e) => setReceptionForm({ ...receptionForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">Receptionist Login Username / Email *</label>
                  <input
                    type="text"
                    required
                    placeholder="reception@arabsignature.com"
                    value={receptionForm.username}
                    onChange={(e) => setReceptionForm({ ...receptionForm, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium">New Reception Password *</label>
                  <div className="relative">
                    <input
                      type={showReceptionPass ? 'text' : 'password'}
                      required
                      placeholder="Enter new password for front desk"
                      value={receptionForm.password}
                      onChange={(e) => setReceptionForm({ ...receptionForm, password: e.target.value })}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#d4af37]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowReceptionPass(!showReceptionPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showReceptionPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Front desk staff will immediately need to use this new password to sign into `#reception-login`.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={15} />
                    <span>Save & Update Receptionist Login</span>
                  </button>
                </div>

              </form>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 7. TAB CONTENT: LOGIN ATTEMPTS & SECURITY MONITOR */}
        {/* ======================================================== */}
        {activeTab === 'logins' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#16030c] border border-white/10">
              <div>
                <h3 className="font-cinzel font-bold text-base text-white">
                  Live Login Attempts & Security Monitor
                </h3>
                <p className="text-xs text-gray-400">
                  Comprehensive audit of every successful sign-in and failed breach attempt across Admin and Receptionist portals.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshData}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                  title="Refresh Audit"
                >
                  <RefreshCw size={15} />
                </button>
                <button
                  onClick={() => {
                    portalStore.clearLoginAttempts();
                    refreshData();
                    showToast("Login attempt history cleared.");
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white border border-white/10"
                >
                  Clear History
                </button>
              </div>
            </div>

            {/* Attempts Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#16030c] shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#120208] text-gray-400 uppercase tracking-wider border-b border-white/10 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Portal Targeted</th>
                    <th className="py-3 px-4">Username Attempted</th>
                    <th className="py-3 px-4">Result / Status</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                    <th className="py-3 px-4">IP & Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loginAttempts.map((attempt) => {
                    const isSuccess = attempt.status === 'SUCCESS';

                    return (
                      <tr key={attempt.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-mono text-gray-300">
                          {attempt.timestamp}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            attempt.targetRole === 'admin'
                              ? 'bg-[#5c0725] text-[#f3e5ab] border border-[#d4af37]/40'
                              : 'bg-white/10 text-gray-300'
                          }`}>
                            {attempt.targetRole === 'admin' ? 'Admin Portal' : 'Reception Portal'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-white">
                          {attempt.usernameAttempted}
                        </td>
                        <td className="py-3.5 px-4">
                          {isSuccess ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                              <CheckCircle2 size={11} />
                              <span>SUCCESS</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-flex items-center gap-1 animate-pulse">
                              <ShieldAlert size={11} />
                              <span>BLOCKED / FAILED</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-gray-300">
                          {attempt.reason}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">
                          {attempt.ip}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 8. TAB CONTENT: HOTEL OPERATIONS SETTINGS */}
        {/* ======================================================== */}
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

        {/* ======================================================== */}
        {/* 9. TAB CONTENT: SYSTEM AUDIT TRAIL */}
        {/* ======================================================== */}
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

      {/* Modal: Add New Menu Item */}
      {isAddMenuItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#16030c] border border-[#d4af37]/40 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Utensils size={18} className="text-[#d4af37]" />
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Add Item to Al-Sultan Menu
                </h3>
              </div>
              <button
                onClick={() => setIsAddMenuItemOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateMenuItem} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clase Azul Ultra, Arabian Spiced Fish"
                  value={newItemForm.name}
                  onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Type *</label>
                  <select
                    value={newItemForm.type}
                    onChange={(e) => setNewItemForm({ ...newItemForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="food">Kitchen Food</option>
                    <option value="drinks">Bar Beverage / Drink</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Category *</label>
                  <select
                    value={newItemForm.category}
                    onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="arabian">Arabian Specialties</option>
                    <option value="continental">Continental & Local Delicacies</option>
                    <option value="spirits">Champagne & VIP Spirits</option>
                    <option value="cocktails">Signature Cocktails & Mocktails</option>
                    <option value="beers">Beer, Wine & Refreshments</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Price in Naira (₦) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="500"
                  placeholder="e.g. 25000"
                  value={newItemForm.price}
                  onChange={(e) => setNewItemForm({ ...newItemForm, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Description / Ingredients</label>
                <textarea
                  rows="3"
                  placeholder="Ingredients, preparation style, vintage year..."
                  value={newItemForm.desc}
                  onChange={(e) => setNewItemForm({ ...newItemForm, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isSignature"
                  checked={newItemForm.isSignature}
                  onChange={(e) => setNewItemForm({ ...newItemForm, isSignature: e.target.checked })}
                  className="w-4 h-4 rounded bg-black/60 border-white/20 text-[#d4af37] focus:ring-0"
                />
                <label htmlFor="isSignature" className="text-xs text-gray-300">
                  Mark as Chef's Signature / VIP Highlight
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddMenuItemOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold shadow-md hover:scale-102 transition-all"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
