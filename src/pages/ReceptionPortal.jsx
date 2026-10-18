import React, { useState, useEffect } from 'react';
import { portalStore } from '../data/portalStore';
import { 
  Building2, BedDouble, Calendar, User, Phone, CheckCircle2, Clock, 
  Search, Filter, Plus, Printer, MessageSquare, LogOut, ArrowLeft, 
  Sparkles, RefreshCw, Key, ShieldCheck, Check, AlertCircle, X, ChevronRight,
  TrendingUp, DoorOpen, Sparkle
} from 'lucide-react';

export default function ReceptionPortal({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rates, setRates] = useState([]);
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'ledger'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Walk-in form state
  const [walkInForm, setWalkInForm] = useState({
    guestName: '',
    phone: '',
    email: '',
    roomType: 'deluxe',
    roomNumber: '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    nights: 1,
    paymentMethod: 'POS Terminal (Front Desk)',
    amount: 45000
  });

  // Current live time
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Refresh data from portalStore
  const refreshData = () => {
    setRooms(portalStore.getRooms());
    setBookings(portalStore.getBookings());
    setRates(portalStore.getRoomRates());
  };

  useEffect(() => {
    // 1. Check Auth (Requires Reception or Admin session)
    const user = portalStore.getCurrentUser();
    if (!user) {
      onNavigate('reception-login');
      return;
    }
    setCurrentUser(user);
    refreshData();

    // 1.1 Sync with Cloud API and seed live rooms to /api/rooms
    portalStore.syncRoomsFromCloud().then(() => {
      refreshData();
    });
    const currentInventory = portalStore.getRooms();
    fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rooms: currentInventory })
    }).catch(() => {});

    // 2. Digital clock timer
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    // 3. Listen for live incoming bookings & price adjustments in real time
    const handleLiveSync = () => refreshData();
    window.addEventListener('ash_bookings_updated', handleLiveSync);
    window.addEventListener('ash_rates_updated', handleLiveSync);
    window.addEventListener('ash_rooms_updated', handleLiveSync);
    const unsubscribeRooms = portalStore.subscribeRooms(() => refreshData());

    return () => {
      clearInterval(timer);
      window.removeEventListener('ash_bookings_updated', handleLiveSync);
      window.removeEventListener('ash_rates_updated', handleLiveSync);
      window.removeEventListener('ash_rooms_updated', handleLiveSync);
      unsubscribeRooms();
    };
  }, []);

  // Flash feedback toast
  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // Logout handler
  const handleLogout = () => {
    portalStore.logout();
    onNavigate('reception-login');
  };

  // Quick Room Status Toggle
  const handleUpdateRoomStatus = (roomNumber, newStatus, guestName = null) => {
    portalStore.updateRoomStatus(roomNumber, newStatus, guestName);
    refreshData();
    showToast(`Room ${roomNumber} updated to ${newStatus.toUpperCase()}`);
  };

  // Check In / Check Out from ledger
  const handleToggleBookingStatus = (booking) => {
    if (booking.status === 'Confirmed') {
      // Find an available room if unassigned
      let assignedRoom = booking.roomNumber;
      if (!assignedRoom || assignedRoom === 'Unassigned') {
        const availableRoom = rooms.find(r => r.type === booking.roomType && r.status === 'available');
        assignedRoom = availableRoom ? availableRoom.roomNumber : '102';
      }
      portalStore.updateBookingStatus(booking.id, 'Checked In', assignedRoom);
      refreshData();
      showToast(`Guest ${booking.guestName} Checked In to Room ${assignedRoom}`);
    } else if (booking.status === 'Checked In') {
      portalStore.updateBookingStatus(booking.id, 'Completed', booking.roomNumber);
      refreshData();
      showToast(`Guest ${booking.guestName} Checked Out. Room ${booking.roomNumber} is now AVAILABLE.`);
    }
  };

  // Walk-in room change handler
  const handleRoomTypeChange = (type) => {
    const rateObj = rates.find(r => r.id === type);
    const price = rateObj ? rateObj.price : 45000;
    const availableRoomsOfType = rooms.filter(r => r.type === type && r.status === 'available');
    
    setWalkInForm(prev => ({
      ...prev,
      roomType: type,
      amount: price * (prev.nights || 1),
      roomNumber: availableRoomsOfType.length > 0 ? availableRoomsOfType[0].roomNumber : ''
    }));
  };

  // Walk-in nights change handler
  const handleNightsChange = (nights) => {
    const numNights = Math.max(1, parseInt(nights) || 1);
    const rateObj = rates.find(r => r.id === walkInForm.roomType);
    const pricePerNight = rateObj ? rateObj.price : 45000;
    
    // Calculate new checkout date
    const checkInDate = new Date(walkInForm.checkIn);
    const checkOutDate = new Date(checkInDate.getTime() + numNights * 86400000);
    const checkOutStr = checkOutDate.toISOString().split('T')[0];

    setWalkInForm(prev => ({
      ...prev,
      nights: numNights,
      checkOut: checkOutStr,
      amount: pricePerNight * numNights
    }));
  };

  // Submit Walk-in Booking
  const handleCreateWalkIn = (e) => {
    e.preventDefault();
    if (!walkInForm.guestName || !walkInForm.phone) {
      alert("Please provide guest name and phone number.");
      return;
    }

    const rateObj = rates.find(r => r.id === walkInForm.roomType);
    const roomName = rateObj ? rateObj.name : "Deluxe Doha Suite";

    // Auto-select room if not chosen
    let selectedRoomNum = walkInForm.roomNumber;
    if (!selectedRoomNum) {
      const avail = rooms.find(r => r.type === walkInForm.roomType && r.status === 'available');
      if (avail) {
        selectedRoomNum = avail.roomNumber;
      } else {
        alert("No vacant room available in this category. Please select another category.");
        return;
      }
    }

    const newBooking = portalStore.addBooking({
      guestName: walkInForm.guestName,
      phone: walkInForm.phone,
      email: walkInForm.email,
      roomType: walkInForm.roomType,
      roomName: roomName,
      roomNumber: selectedRoomNum,
      checkIn: walkInForm.checkIn,
      checkOut: walkInForm.checkOut,
      nights: walkInForm.nights,
      amount: walkInForm.amount,
      status: "Checked In",
      paymentMethod: walkInForm.paymentMethod,
      paymentStatus: "Paid",
      source: "Front Desk Walk-In"
    });

    // Mark room as occupied immediately
    portalStore.updateRoomStatus(selectedRoomNum, 'occupied', walkInForm.guestName);

    refreshData();
    setIsWalkInOpen(false);
    showToast(`Walk-in booked! Room ${selectedRoomNum} assigned to ${walkInForm.guestName}`);
    
    // Automatically open folio receipt for printing
    setSelectedReceiptBooking(newBooking);
  };

  // Send WhatsApp message to guest
  const handleSendWhatsApp = (booking) => {
    let rawPhone = booking.phone.replace(/[^0-9]/g, '');
    if (rawPhone.startsWith('0')) {
      rawPhone = '234' + rawPhone.slice(1);
    }
    const message = encodeURIComponent(
      `Hello ${booking.guestName},\n\nWarm greetings from Arab Signature Hotel & Suites, Nsugbe, Onitsha!\n\n` +
      `Your reservation is confirmed:\n` +
      `• Booking Ref: ${booking.id}\n` +
      `• Suite: ${booking.roomName} (Room ${booking.roomNumber || 'Assigned on arrival'})\n` +
      `• Check-in: ${booking.checkIn} (from 2:00 PM)\n` +
      `• Check-out: ${booking.checkOut}\n` +
      `• Total Amount: ₦${Number(booking.amount).toLocaleString()} (${booking.paymentStatus})\n\n` +
      `We look forward to giving you an exceptional luxury experience. For any inquiries, reach us at 0812 578 6875.`
    );
    window.open(`https://wa.me/${rawPhone}?text=${message}`, '_blank');
  };

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.roomNumber && b.roomNumber.includes(searchQuery));

    const matchesStatus = 
      statusFilter === 'all' || 
      b.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate quick stats
  const totalRooms = rooms.length;
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const availableCount = rooms.filter(r => r.status === 'available').length;
  const cleaningCount = rooms.filter(r => r.status === 'cleaning').length;
  const reservedCount = rooms.filter(r => r.status === 'reserved').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0e0106] text-gray-100 flex flex-col font-sans">
      
      {/* 1. Receptionist Top Command Bar */}
      <header className="sticky top-0 z-40 bg-[#16030c]/95 border-b border-[#d4af37]/30 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Front Desk Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#d4af37]/50 bg-[#120208] shadow-md shadow-[#d4af37]/10 flex-shrink-0">
            <img src="/logo.jpg" alt="Option 1 Monogram" className="w-full h-full object-cover scale-110" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel font-bold text-base sm:text-lg text-white tracking-wide">
                Front Desk Operations
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Shift
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Arab Signature Hotel & Suites • Nsugbe, Onitsha
            </p>
          </div>
        </div>

        {/* Live Clock & Staff Badge */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex flex-col text-right">
            <span className="font-mono text-sm font-bold text-[#f3e5ab] tracking-wider">
              {currentTime}
            </span>
            <span className="text-[10px] text-gray-400">
              Concierge: <span className="text-white font-medium">{currentUser?.name || 'Lead Receptionist'}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* New Walk-In Booking Trigger */}
            <button
              onClick={() => {
                handleRoomTypeChange('deluxe');
                setIsWalkInOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-[#d4af37]/20 hover:scale-102 active:scale-98 transition-all"
            >
              <Plus size={15} className="stroke-[2.5]" />
              <span>New Walk-In</span>
            </button>

            {/* Back to Guest Website */}
            <button
              onClick={() => onNavigate('home')}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-all"
              title="Return to Public Website"
            >
              <ArrowLeft size={14} className="text-[#d4af37]" />
              <span className="hidden sm:inline">Guest Site</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-all"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

      </header>

      {/* Toast Notification Banner */}
      {feedbackMsg && (
        <div className="bg-[#5c0725] border-b border-[#d4af37]/50 text-[#f3e5ab] px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 shadow-lg animate-in fade-in">
          <Sparkles size={14} className="text-[#d4af37]" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* 2. Main Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* KPI Operations Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#16030c] border border-white/10">
            <div className="text-[11px] text-gray-400 font-medium">Total Suites</div>
            <div className="text-xl sm:text-2xl font-bold font-cinzel text-white mt-1">12 Keys</div>
            <div className="text-[10px] text-[#d4af37] mt-0.5">Nsugbe Location</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#16030c] border border-emerald-500/30">
            <div className="text-[11px] text-emerald-400 font-medium flex items-center justify-between">
              <span>Available</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-cinzel text-emerald-300 mt-1">{availableCount} Rooms</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Ready for check-in</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#16030c] border border-rose-500/30">
            <div className="text-[11px] text-rose-400 font-medium flex items-center justify-between">
              <span>Occupied</span>
              <span className="w-2 h-2 rounded-full bg-rose-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-cinzel text-rose-300 mt-1">{occupiedCount} Rooms</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Guests in-house</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#16030c] border border-amber-500/30">
            <div className="text-[11px] text-amber-400 font-medium flex items-center justify-between">
              <span>Housekeeping</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-cinzel text-amber-300 mt-1">{cleaningCount} Rooms</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Being cleaned</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#16030c] border border-sky-500/30">
            <div className="text-[11px] text-sky-400 font-medium flex items-center justify-between">
              <span>Reserved</span>
              <span className="w-2 h-2 rounded-full bg-sky-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-cinzel text-sky-300 mt-1">{reservedCount} Rooms</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Awaiting arrival</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#16030c] border border-[#d4af37]/30">
            <div className="text-[11px] text-[#f3e5ab] font-medium flex items-center justify-between">
              <span>Occupancy</span>
              <TrendingUp size={13} className="text-[#d4af37]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-cinzel text-[#d4af37] mt-1">{occupancyRate}%</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Current load</div>
          </div>

        </div>

        {/* 3. Tab Navigation & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-[#16030c] p-1 rounded-xl border border-white/10 w-fit">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'rooms'
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BedDouble size={14} />
              <span>Visual Room Matrix</span>
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'ledger'
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar size={14} />
              <span>Bookings & Ledger ({bookings.length})</span>
            </button>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search guest, phone, room, ASH ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <button
              onClick={refreshData}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all"
              title="Refresh Live Data"
            >
              <RefreshCw size={15} />
            </button>
          </div>

        </div>

        {/* 4. TAB CONTENT: Visual Room Grid */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            
            {/* Room Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 bg-[#16030c]/70 p-3 rounded-xl border border-white/5">
              <span className="font-semibold text-white">Status Guide:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500/30 border border-emerald-500 inline-block" />
                <span>Vacant & Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-rose-900/60 border border-rose-500 inline-block" />
                <span>Occupied (Guest in room)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-900/50 border border-amber-500 inline-block" />
                <span>Housekeeping (Cleaning)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-sky-900/50 border border-sky-400 inline-block" />
                <span>Reserved (Awaiting guest)</span>
              </div>
            </div>

            {/* Grouped by Floor */}
            {['Penthouse', 'Floor 2', 'Floor 1', 'Floor 4'].map((floorName) => {
              const floorRooms = rooms.filter(r => r.floor === floorName);
              if (floorRooms.length === 0) return null;

              return (
                <div key={floorName} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-[#d4af37]" />
                    <h3 className="font-cinzel font-bold text-sm tracking-wide text-white uppercase">
                      {floorName === 'Penthouse' ? 'Top Floor VIP Penthouses' : `${floorName} Luxury Suites`}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {floorRooms.map((room) => {
                      const isOccupied = room.status === 'occupied';
                      const isAvailable = room.status === 'available';
                      const isCleaning = room.status === 'cleaning';
                      const isReserved = room.status === 'reserved';

                      let borderClass = 'border-white/10';
                      let bgCard = 'bg-[#16030c]';
                      let badgeColor = 'bg-gray-500/20 text-gray-300 border-gray-500/30';

                      if (isAvailable) {
                        borderClass = 'border-emerald-500/40 hover:border-emerald-400';
                        bgCard = 'bg-gradient-to-br from-[#120208] to-[#041a0d]';
                        badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                      } else if (isOccupied) {
                        borderClass = 'border-rose-500/50 hover:border-rose-400';
                        bgCard = 'bg-gradient-to-br from-[#16030c] to-[#2b0411]';
                        badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
                      } else if (isCleaning) {
                        borderClass = 'border-amber-500/50 hover:border-amber-400';
                        bgCard = 'bg-gradient-to-br from-[#16030c] to-[#261603]';
                        badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
                      } else if (isReserved) {
                        borderClass = 'border-sky-500/50 hover:border-sky-400';
                        bgCard = 'bg-gradient-to-br from-[#16030c] to-[#04152b]';
                        badgeColor = 'bg-sky-500/20 text-sky-400 border-sky-500/40';
                      }

                      return (
                        <div
                          key={room.roomNumber}
                          className={`rounded-2xl p-4 border ${borderClass} ${bgCard} shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4`}
                        >
                          <div>
                            {/* Room Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-black text-white">
                                  #{room.roomNumber}
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                                  {room.floor}
                                </span>
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${badgeColor}`}>
                                {room.status}
                              </span>
                            </div>

                            {/* Room Details */}
                            <div className="mt-2">
                              <div className="text-xs font-semibold text-[#f3e5ab] line-clamp-1">
                                {room.name}
                              </div>
                              <div className="text-[11px] text-[#d4af37] font-mono mt-0.5">
                                ₦{room.price.toLocaleString()} <span className="text-[9px] text-gray-400">/ night</span>
                              </div>
                            </div>

                            {/* Current Guest if any */}
                            {room.currentGuest ? (
                              <div className="mt-3 p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                  <User size={11} className="text-[#d4af37]" />
                                  <span>Current Guest:</span>
                                </div>
                                <div className="text-xs font-semibold text-white truncate">
                                  {room.currentGuest}
                                </div>
                                {room.checkOut && (
                                  <div className="text-[10px] text-rose-300 flex items-center gap-1">
                                    <Clock size={10} />
                                    <span>Check-out: {room.checkOut}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="mt-3 py-2 text-[10px] text-gray-500 italic">
                                {isCleaning ? 'Housekeeping in progress' : isReserved ? 'Reserved for incoming guest' : 'Ready for assignment'}
                              </div>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
                            {isOccupied && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleUpdateRoomStatus(room.roomNumber, 'available')}
                                  className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-[11px] font-semibold transition-all flex items-center justify-center gap-1"
                                  title="Check out guest and immediately mark suite available"
                                >
                                  <Check size={12} />
                                  <span>Make Available</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateRoomStatus(room.roomNumber, 'cleaning')}
                                  className="py-1.5 px-2.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-200 text-[11px] font-medium transition-all"
                                  title="Send to Housekeeping / Cleaning"
                                >
                                  Clean
                                </button>
                              </div>
                            )}

                            {isCleaning && (
                              <button
                                onClick={() => handleUpdateRoomStatus(room.roomNumber, 'available')}
                                className="w-full py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-xs font-semibold transition-all flex items-center justify-center gap-1"
                              >
                                <Check size={12} />
                                <span>Mark Clean & Available</span>
                              </button>
                            )}

                            {isAvailable && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setWalkInForm(prev => ({
                                      ...prev,
                                      roomType: room.type,
                                      roomNumber: room.roomNumber,
                                      amount: room.price
                                    }));
                                    setIsWalkInOpen(true);
                                  }}
                                  className="flex-1 py-1.5 px-2 rounded-lg bg-[#5c0725]/60 hover:bg-[#5c0725] border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-medium transition-all flex items-center justify-center gap-1"
                                >
                                  <Key size={12} className="text-[#d4af37]" />
                                  <span>Assign Walk-In</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateRoomStatus(room.roomNumber, 'occupied', 'Walk-In Guest')}
                                  className="py-1.5 px-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/70 border border-rose-500/30 text-rose-200 text-[10px] font-medium transition-all"
                                  title="Quick mark as Occupied"
                                >
                                  Occupy
                                </button>
                              </div>
                            )}

                            {isReserved && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleUpdateRoomStatus(room.roomNumber, 'occupied', room.currentGuest)}
                                  className="flex-1 py-1.5 px-2 rounded-lg bg-sky-950/60 hover:bg-sky-900 border border-sky-500/40 text-sky-200 text-[11px] font-medium transition-all"
                                >
                                  Check In
                                </button>
                                <button
                                  onClick={() => handleUpdateRoomStatus(room.roomNumber, 'available')}
                                  className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-[11px] font-semibold transition-all flex items-center justify-center gap-1"
                                >
                                  <Check size={11} />
                                  <span>Make Available</span>
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          </div>
        )}

        {/* 5. TAB CONTENT: Bookings & Ledger */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            
            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs text-gray-400 mr-2 flex items-center gap-1">
                <Filter size={13} />
                <span>Filter:</span>
              </span>
              {['all', 'Confirmed', 'Checked In', 'Completed', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    statusFilter === st
                      ? 'bg-[#5c0725] text-[#f3e5ab] border border-[#d4af37]'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {st === 'all' ? 'All Bookings' : st}
                </button>
              ))}
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#16030c] shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#120208] text-gray-400 uppercase tracking-wider border-b border-white/10 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Guest Details</th>
                    <th className="py-3 px-4">Suite & Room</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Amount & Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-gray-500">
                        No reservations found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => {
                      const isConfirmed = b.status === 'Confirmed';
                      const isCheckedIn = b.status === 'Checked In';
                      const isCompleted = b.status === 'Completed';

                      return (
                        <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                          
                          {/* Ref & Source */}
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-[#f3e5ab] block">
                              {b.id}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {b.source}
                            </span>
                          </td>

                          {/* Guest */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{b.guestName}</div>
                            <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <Phone size={11} className="text-[#d4af37]" />
                              <span>{b.phone}</span>
                            </div>
                          </td>

                          {/* Suite */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-gray-200">{b.roomName}</div>
                            <div className="text-[11px] text-[#d4af37] font-mono">
                              Room: {b.roomNumber ? `#${b.roomNumber}` : 'Unassigned'}
                            </div>
                          </td>

                          {/* Dates */}
                          <td className="py-3.5 px-4">
                            <div className="text-gray-300">
                              {b.checkIn} → {b.checkOut}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {b.nights} {b.nights === 1 ? 'Night' : 'Nights'}
                            </div>
                          </td>

                          {/* Amount & Backend Confirmation Check */}
                          <td className="py-3.5 px-4">
                            {b.paymentStatus === 'Paid' ? (
                              <>
                                <div className="font-bold text-[#f3e5ab] font-mono">
                                  ₦{Number(b.amount).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                                  <CheckCircle2 size={11} />
                                  <span>Paid • Paystack Auto-Confirmed</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-amber-400 font-semibold text-xs flex items-center gap-1">
                                  <Clock size={12} className="text-amber-400" />
                                  <span>Pending Backend</span>
                                </div>
                                <div className="text-[10px] text-gray-500 italic">
                                  Awaiting GM / Backend Confirmation
                                </div>
                              </>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                              isCheckedIn
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : b.paymentStatus === 'Paid'
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}>
                              {b.paymentStatus === 'Paid' ? b.status : 'Awaiting Payment Audit'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* Check In / Out Toggle Button */}
                              {isConfirmed && b.paymentStatus === 'Paid' && (
                                <button
                                  onClick={() => handleToggleBookingStatus(b)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-semibold transition-all flex items-center gap-1"
                                >
                                  <Key size={12} />
                                  <span>Check In</span>
                                </button>
                              )}

                              {isConfirmed && b.paymentStatus !== 'Paid' && (
                                <span
                                  className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[10px] flex items-center gap-1 font-semibold cursor-help"
                                  title="Check-in locked: Payment must be confirmed by backend or GM before issuing keys"
                                >
                                  <Lock size={11} />
                                  <span>Payment Pending</span>
                                </span>
                              )}

                              {isCheckedIn && (
                                <button
                                  onClick={() => handleToggleBookingStatus(b)}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-[11px] font-semibold transition-all"
                                >
                                  <span>Check Out</span>
                                </button>
                              )}

                              {/* WhatsApp Direct Guest Notify */}
                              <button
                                onClick={() => handleSendWhatsApp(b)}
                                className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 transition-all"
                                title="Send Confirmation WhatsApp to Guest"
                              >
                                <MessageSquare size={13} />
                              </button>

                              {/* Print Luxury Guest Receipt (Only if Confirmed) */}
                              {b.paymentStatus === 'Paid' ? (
                                <button
                                  onClick={() => setSelectedReceiptBooking(b)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[#d4af37] transition-all"
                                  title="Print Luxury Receipt Folio"
                                >
                                  <Printer size={13} />
                                </button>
                              ) : (
                                <span
                                  className="p-1.5 rounded-lg bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
                                  title="Receipt locked until payment is confirmed by backend"
                                >
                                  <Printer size={13} />
                                </span>
                              )}

                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* 6. MODAL: WALK-IN BOOKING (On-the-spot Front Desk) */}
      {/* ======================================================== */}
      {isWalkInOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#16030c] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#5c0725] border border-[#d4af37]/50 text-[#d4af37]">
                  <DoorOpen size={18} />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-base text-white">
                    New Walk-In Reservation
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Front Desk Direct Check-In • Nsugbe, Onitsha
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWalkInOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateWalkIn} className="space-y-4 text-xs">
              
              {/* Guest Full Name */}
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Anthony Eze"
                  value={walkInForm.guestName}
                  onChange={(e) => setWalkInForm({ ...walkInForm, guestName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Contact Info (Phone & Email) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0803 000 0000"
                    value={walkInForm.phone}
                    onChange={(e) => setWalkInForm({ ...walkInForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={walkInForm.email}
                    onChange={(e) => setWalkInForm({ ...walkInForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Suite Selection & Available Room Key */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Suite Category</label>
                  <select
                    value={walkInForm.roomType}
                    onChange={(e) => handleRoomTypeChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {rates.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} (₦{r.price.toLocaleString()}/nt)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Assign Room #</label>
                  <select
                    value={walkInForm.roomNumber}
                    onChange={(e) => setWalkInForm({ ...walkInForm, roomNumber: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {rooms
                      .filter(r => r.type === walkInForm.roomType && r.status === 'available')
                      .map(r => (
                        <option key={r.roomNumber} value={r.roomNumber}>
                          Room #{r.roomNumber} ({r.floor})
                        </option>
                      ))}
                    {rooms.filter(r => r.type === walkInForm.roomType && r.status === 'available').length === 0 && (
                      <option value="">No vacant room in category</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Dates & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Check-In Date</label>
                  <input
                    type="date"
                    value={walkInForm.checkIn}
                    onChange={(e) => setWalkInForm({ ...walkInForm, checkIn: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Duration (Nights)</label>
                  <input
                    type="number"
                    min="1"
                    value={walkInForm.nights}
                    onChange={(e) => handleNightsChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Check-Out Date</label>
                  <input
                    type="date"
                    readOnly
                    value={walkInForm.checkOut}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Front Desk Payment</label>
                  <select
                    value={walkInForm.paymentMethod}
                    onChange={(e) => setWalkInForm({ ...walkInForm, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="POS Terminal (Front Desk)">POS Terminal (Front Desk)</option>
                    <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                    <option value="Cash at Reception">Cash at Reception</option>
                    <option value="Paystack (Online)">Paystack (Online)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Total Billed</label>
                  <div className="w-full px-3 py-2.5 rounded-xl bg-[#5c0725]/30 border border-[#d4af37]/40 text-[#f3e5ab] font-bold font-mono text-sm flex items-center justify-between">
                    <span>₦{Number(walkInForm.amount).toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-400 font-normal">Paid in Full</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-101 active:scale-99 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Confirm Check-In & Generate Receipt</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MODAL: LUXURY GUEST RECEIPT / FOLIO (Printable) */}
      {/* ======================================================== */}
      {selectedReceiptBooking && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white text-gray-900 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 print:p-0 print:border-none print:shadow-none">
            
            {/* Top Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 print:hidden">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Official Guest Folio
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#5c0725] text-white hover:bg-[#3d0418] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Printer size={14} />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedReceiptBooking(null)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* PRINTABLE RECEIPT CONTENT */}
            <div className="space-y-6">
              
              {/* Receipt Header with Monogram */}
              <div className="flex items-start justify-between border-b-2 border-[#5c0725] pb-6">
                <div>
                  <div className="font-cinzel text-xl sm:text-2xl font-black text-[#5c0725] tracking-wide">
                    ARAB SIGNATURE
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-gray-700">
                    Hotel & Suites • Nsugbe, Onitsha
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Anambra State, Nigeria • Tel: 0812 578 6875
                  </div>
                </div>

                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#5c0725] bg-[#120208] flex-shrink-0 shadow">
                  <img src="/logo.jpg" alt="Option 1 Logo" className="w-full h-full object-cover scale-110" />
                </div>
              </div>

              {/* Receipt Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <div className="text-gray-400 font-medium">Guest Name</div>
                  <div className="font-bold text-gray-900 text-sm mt-0.5">{selectedReceiptBooking.guestName}</div>
                  <div className="text-gray-600 text-[11px]">{selectedReceiptBooking.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 font-medium">Invoice Reference</div>
                  <div className="font-mono font-bold text-[#5c0725] text-sm mt-0.5">{selectedReceiptBooking.id}</div>
                  <div className="text-gray-600 text-[11px]">Issued: {new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* Stay Breakdown Table */}
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-300 text-gray-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2 text-left">Accommodation</th>
                    <th className="py-2 text-center">Room #</th>
                    <th className="py-2 text-center">Duration</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3">
                      <div className="font-bold text-gray-900">{selectedReceiptBooking.roomName}</div>
                      <div className="text-[10px] text-gray-500">
                        {selectedReceiptBooking.checkIn} to {selectedReceiptBooking.checkOut}
                      </div>
                    </td>
                    <td className="py-3 text-center font-mono font-semibold">
                      #{selectedReceiptBooking.roomNumber || '101'}
                    </td>
                    <td className="py-3 text-center">
                      {selectedReceiptBooking.nights} Night(s)
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-gray-900">
                      ₦{Number(selectedReceiptBooking.amount).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Financial Totals */}
              <div className="border-t-2 border-gray-200 pt-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">₦{Number(selectedReceiptBooking.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Charge & VAT (Inclusive):</span>
                  <span className="font-mono">₦0.00</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#5c0725] pt-2 border-t border-gray-200">
                  <span>Total Paid:</span>
                  <span className="font-mono text-base">₦{Number(selectedReceiptBooking.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-700 pt-1 font-semibold">
                  <span>Payment Channel:</span>
                  <span>{selectedReceiptBooking.paymentMethod} (VERIFIED)</span>
                </div>
              </div>

              {/* Footer Note & Watermark */}
              <div className="pt-6 border-t border-gray-200 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 uppercase tracking-widest">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span>Verified 5-Star Hospitality Experience</span>
                </div>
                <p className="text-[11px] text-gray-500 italic">
                  Thank you for staying at Arab Signature Hotel and Suites, Nsugbe, Onitsha. We look forward to welcoming you back.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
