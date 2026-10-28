import React, { useState, useEffect } from 'react';
import { portalStore, SECURE_PORTAL_ROUTES } from '../data/portalStore';
import { 
  getPaystackPublicKey, 
  setPaystackPublicKey, 
  getPaystackMode 
} from '../utils/paystack';
import { 
  MessageSquare,
  ShieldCheck, DollarSign, TrendingUp, BedDouble, Settings, 
  FileText, Activity, Save, ArrowLeft, LogOut, CheckCircle2, 
  AlertTriangle, Lock, Users, Phone, MapPin, Printer, RefreshCw, 
  Sparkles, KeyRound, Clock, Edit3, ChevronRight, UserCheck, 
  AlertCircle, ShieldAlert, Key, Check, Eye, EyeOff, Utensils,
  Wine, Plus, Trash2, Search, X, Flame, GlassWater, Beer, CreditCard, ExternalLink, Calculator, Image as ImageIcon, Copy,
  Building2, Package, BellRing, Layers, BarChart3, Tag, Percent
} from 'lucide-react';
import ProofOfPaymentModal from '../components/ProofOfPaymentModal';

export default function AdminPortal({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rates' | 'dining' | 'ledger' | 'receptionist' | 'logins' | 'settings' | 'logs'
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [diningOrders, setDiningOrders] = useState([]);
  const [overviewOrderFilter, setOverviewOrderFilter] = useState('all'); // 'all' | 'pending' | 'drinks' | 'food'
  const [selectedProofBooking, setSelectedProofBooking] = useState(null);
  const [rates, setRates] = useState([]);
  const [hotelConfig, setHotelConfig] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [receptionUser, setReceptionUser] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Intercom Chat 30-Day Audit State
  const [chatMessages, setChatMessages] = useState([]);
  const [adminBroadcastText, setAdminBroadcastText] = useState('');
  const [chatFilter, setChatFilter] = useState('all');
  const [chatSearch, setChatSearch] = useState('');

  // Editable Rates & Promo Prices State
  const [rateEdits, setRateEdits] = useState({});
  const [promoPriceEdits, setPromoPriceEdits] = useState({});
  const [promoActiveEdits, setPromoActiveEdits] = useState({});

  // Editable Dining & Drinks Menu State (ADMIN EXCLUSIVE CONTROL)
  const [diningMenu, setDiningMenu] = useState([]);
  const [diningEdits, setDiningEdits] = useState({});
  const [diningPromoEdits, setDiningPromoEdits] = useState({});
  const [diningPromoActiveEdits, setDiningPromoActiveEdits] = useState({});
  const [diningCategoryFilter, setDiningCategoryFilter] = useState('all');
  const [diningSearchQuery, setDiningSearchQuery] = useState('');
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    name: '',
    category: 'rice',
    categoryLabel: 'Rice, Pasta & Sides',
    type: 'food',
    desc: '',
    price: '',
    isSignature: false
  });

  // Editable Staff & Executive Credentials Management
  const [selectedStaffDesk, setSelectedStaffDesk] = useState('Main Building'); // 'Main Building' | 'Extension Building' | 'Accountant Office' | 'Admin Core'
  const [receptionForm, setReceptionForm] = useState({
    username: '',
    password: '',
    name: '',
    securityPin: '',
    otpEmail: ''
  });
  const [showReceptionPass, setShowReceptionPass] = useState(false);
  const [showPinField, setShowPinField] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState('');

  const handleCopySecretLink = (slug) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://arabsignature.com';
    const fullUrl = `${origin}/#${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedSlug(slug);
      showToast(`Secret link copied to clipboard: ${fullUrl}`);
      setTimeout(() => setCopiedSlug(''), 3000);
    }
  };

  const handleSelectStaffDesk = (deskBuilding) => {
    setSelectedStaffDesk(deskBuilding);
    let staff = null;
    if (deskBuilding === 'Accountant Office') {
      staff = portalStore.getAccountantUser();
    } else if (deskBuilding === 'Admin Core') {
      staff = portalStore.getAdminUser();
    } else {
      staff = portalStore.getReceptionistUser(deskBuilding);
    }
    setReceptionUser(staff);
    if (staff) {
      setReceptionForm({
        username: staff.username,
        password: staff.password,
        name: staff.name,
        securityPin: staff.securityPin || '742918',
        otpEmail: staff.otpEmail || ''
      });
    }
  };

  // Paystack Gateway Configuration State
  const [adminPaystackKey, setAdminPaystackKey] = useState(getPaystackPublicKey());
  const [adminPaystackStatus, setAdminPaystackStatus] = useState(getPaystackMode());
  const [paystackSaveSuccess, setPaystackSaveSuccess] = useState(false);

  const handleAdminSavePaystackKey = () => {
    setPaystackPublicKey(adminPaystackKey.trim());
    setAdminPaystackStatus(getPaystackMode());
    setPaystackSaveSuccess(true);
    setFeedbackMsg('Paystack Gateway settings saved successfully.');
    setTimeout(() => {
      setPaystackSaveSuccess(false);
      setFeedbackMsg('');
    }, 3000);
  };

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
    let currentReception = null;
    if (selectedStaffDesk === 'Accountant Office') {
      currentReception = portalStore.getAccountantUser();
    } else if (selectedStaffDesk === 'Admin Core') {
      currentReception = portalStore.getAdminUser();
    } else {
      currentReception = portalStore.getReceptionistUser(selectedStaffDesk);
    }
    const currentDining = portalStore.getDiningMenu();
    const currentDiningOrders = portalStore.getDiningOrders();

    setRooms(currentRooms);
    setBookings(currentBookings);
    setDiningOrders(currentDiningOrders);
    setRates(currentRates);
    setHotelConfig(currentConfig);
    setActivityLogs(currentLogs);
    setLoginAttempts(currentLoginAttempts);
    setReceptionUser(currentReception);
    setDiningMenu(currentDining);
    setChatMessages(portalStore.getChatMessages('admin'));

    // Initialize rate edit fields & promotional rates
    const initialRates = {};
    const initialPromos = {};
    const initialPromoActive = {};
    currentRates.forEach(r => {
      initialRates[r.id] = r.price;
      initialPromos[r.id] = (r.promoPrice !== null && r.promoPrice !== undefined) ? r.promoPrice : '';
      initialPromoActive[r.id] = Boolean(r.isPromoActive);
    });
    setRateEdits(initialRates);
    setPromoPriceEdits(initialPromos);
    setPromoActiveEdits(initialPromoActive);

    // Initialize dining menu edit fields & promotional prices
    const initialDining = {};
    const initialDiningPromos = {};
    const initialDiningPromoActive = {};
    currentDining.forEach(item => {
      initialDining[item.id] = item.price;
      initialDiningPromos[item.id] = (item.promoPrice !== null && item.promoPrice !== undefined) ? item.promoPrice : '';
      initialDiningPromoActive[item.id] = Boolean(item.isPromoActive);
    });
    setDiningEdits(initialDining);
    setDiningPromoEdits(initialDiningPromos);
    setDiningPromoActiveEdits(initialDiningPromoActive);

    // Initialize reception credentials form
    if (currentReception) {
      setReceptionForm({
        username: currentReception.username,
        password: currentReception.password,
        name: currentReception.name,
        securityPin: currentReception.securityPin || '742918'
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
      onNavigate(SECURE_PORTAL_ROUTES.ADMIN_LOGIN);
      return;
    }
    
    setCurrentUser(user);
    refreshData();

    const handleLiveSync = () => refreshData();
    window.addEventListener('ash_bookings_updated', handleLiveSync);
    window.addEventListener('ash_rates_updated', handleLiveSync);
    window.addEventListener('ash_rooms_updated', handleLiveSync);
    window.addEventListener('ash_menu_updated', handleLiveSync);
    window.addEventListener('ash_dining_orders_updated', handleLiveSync);
    const unsubscribeRooms = portalStore.subscribeRooms(() => refreshData());
    const unsubscribeDining = portalStore.subscribeDiningMenu(() => refreshData());
    const unsubscribeDiningOrders = portalStore.subscribeDiningOrders(() => refreshData());
    const unsubscribeChat = portalStore.subscribeChat(() => {
      setChatMessages(portalStore.getChatMessages('admin'));
    });

    portalStore.syncChatFromCloud().then(() => {
      setChatMessages(portalStore.getChatMessages('admin'));
    });

    const chatHeartbeat = setInterval(async () => {
      await portalStore.syncChatFromCloud().catch(() => {});
      setChatMessages(portalStore.getChatMessages('admin'));
    }, 1500);

    return () => {
      window.removeEventListener('ash_bookings_updated', handleLiveSync);
      window.removeEventListener('ash_rates_updated', handleLiveSync);
      window.removeEventListener('ash_rooms_updated', handleLiveSync);
      window.removeEventListener('ash_menu_updated', handleLiveSync);
      window.removeEventListener('ash_dining_orders_updated', handleLiveSync);
      unsubscribeRooms();
      unsubscribeDining();
      unsubscribeDiningOrders();
      clearInterval(chatHeartbeat);
      unsubscribeChat();
    };
  }, []);

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4500);
  };

  const handleLogout = () => {
    portalStore.logout();
    onNavigate(SECURE_PORTAL_ROUTES.ADMIN_LOGIN);
  };

  // 1. Save new room rate and promotional price
  const handleSaveRate = (roomId) => {
    const newPrice = rateEdits[roomId];
    if (!newPrice || isNaN(newPrice) || Number(newPrice) < 5000) {
      alert("Please provide a valid standard base rate in Naira (minimum ₦5,000).");
      return;
    }
    const numPrice = Number(newPrice);
    const promoRaw = promoPriceEdits[roomId];
    const hasPromoVal = promoRaw !== '' && promoRaw !== null && promoRaw !== undefined && !isNaN(promoRaw) && Number(promoRaw) > 0;
    const numPromo = hasPromoVal ? Number(promoRaw) : null;
    const isPromoActive = Boolean(promoActiveEdits[roomId] && numPromo && numPromo < numPrice);

    if (numPromo && numPromo >= numPrice) {
      alert("Promo price must be strictly lower than the standard base price.");
      return;
    }

    portalStore.updateRoomRate(roomId, numPrice, numPromo, isPromoActive);
    refreshData();
    showToast(`Suite rate saved for ${roomId.toUpperCase()}! Base: ₦${numPrice.toLocaleString()}${isPromoActive ? ` • Active Promo: ₦${numPromo.toLocaleString()} (-${Math.round(((numPrice - numPromo) / numPrice) * 100)}%)` : ''}`);
  };

  const handleClearPromoRate = (roomId) => {
    const currentPrice = rateEdits[roomId] || rates.find(r => r.id === roomId)?.price || 30000;
    portalStore.updateRoomRate(roomId, currentPrice, null, false);
    setPromoPriceEdits(prev => ({ ...prev, [roomId]: '' }));
    setPromoActiveEdits(prev => ({ ...prev, [roomId]: false }));
    refreshData();
    showToast(`Promo cleared for ${roomId.toUpperCase()}. Reverted to standard rate.`);
  };

  const handleSaveAllRates = () => {
    rates.forEach(r => {
      const p = rateEdits[r.id] !== undefined ? rateEdits[r.id] : r.price;
      const numPrice = Number(p) || r.price;
      const promoRaw = promoPriceEdits[r.id] !== undefined ? promoPriceEdits[r.id] : r.promoPrice;
      const hasPromoVal = promoRaw !== '' && promoRaw !== null && promoRaw !== undefined && !isNaN(promoRaw) && Number(promoRaw) > 0;
      const numPromo = hasPromoVal ? Number(promoRaw) : null;
      const isPromoActive = Boolean(promoActiveEdits[r.id] !== undefined ? promoActiveEdits[r.id] : r.isPromoActive) && numPromo && numPromo < numPrice;

      portalStore.updateRoomRate(r.id, numPrice, numPromo, isPromoActive);
    });
    refreshData();
    showToast("All suite rates & promotional prices saved live across the hotel website & booking engine!");
  };

  // 1.1 Food & Drinks Menu Price & Promo Adjustment (ADMIN EXCLUSIVE CONTROL)
  const handleSaveMenuItemPrice = (itemId) => {
    const newPrice = diningEdits[itemId];
    if (newPrice === undefined || isNaN(newPrice) || Number(newPrice) < 0) {
      alert("Please provide a valid price in Naira.");
      return;
    }
    const numPrice = Number(newPrice);
    const promoRaw = diningPromoEdits[itemId];
    const hasPromoVal = promoRaw !== '' && promoRaw !== null && promoRaw !== undefined && !isNaN(promoRaw) && Number(promoRaw) > 0;
    const numPromo = hasPromoVal ? Number(promoRaw) : null;
    const isPromoActive = Boolean(diningPromoActiveEdits[itemId] && numPromo && numPromo < numPrice);

    portalStore.updateMenuItemPrice(itemId, numPrice, numPromo, isPromoActive);
    refreshData();
    const item = diningMenu.find(i => i.id === itemId);
    showToast(`Price updated for ${item?.name || itemId}: ₦${numPrice.toLocaleString()}${isPromoActive ? ` • Promo: ₦${numPromo.toLocaleString()}` : ''}`);
  };

  const handleClearDiningPromo = (itemId) => {
    const currentPrice = diningEdits[itemId] !== undefined ? diningEdits[itemId] : 0;
    portalStore.updateMenuItemPrice(itemId, currentPrice, null, false);
    setDiningPromoEdits(prev => ({ ...prev, [itemId]: '' }));
    setDiningPromoActiveEdits(prev => ({ ...prev, [itemId]: false }));
    refreshData();
    showToast(`Promo cleared for menu item. Reverted to standard price.`);
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
      rice: "Rice, Pasta & Sides",
      soups: "Traditional Soups",
      swallow: "Swallow (Garri & Semo)",
      proteins: "Proteins & Pepper Soup",
      continental: "Continental & Breakfast",
      spirits: "Champagne, Cognac & Whiskey",
      wines: "Fine Wines & Sparkling",
      beers: "Beers & Refreshments"
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
      category: 'rice',
      categoryLabel: 'Rice, Pasta & Sides',
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

  // 2. Save Updated Receptionist Credentials (ADMIN CONTROL FOR DUAL DESKS)
  // Send GM Executive Broadcast to Both Reception Desks
  const handleSendAdminBroadcast = (e) => {
    e.preventDefault();
    if (!adminBroadcastText.trim()) return;

    portalStore.sendChatMessage({
      text: adminBroadcastText,
      category: 'general',
      senderBuilding: 'all',
      senderName: currentUser?.name || 'General Manager',
      senderRole: 'admin',
      senderBadge: 'Executive General Manager'
    });

    setAdminBroadcastText('');
    refreshData();
    showToast('Executive announcement broadcasted to all front desk terminals.');
  };

  const handleSaveReceptionCredentials = (e) => {
    e.preventDefault();
    if (!receptionForm.username || !receptionForm.password) {
      alert("Staff username and password cannot be empty.");
      return;
    }

    if (selectedStaffDesk === 'Accountant Office') {
      if (!receptionForm.securityPin || String(receptionForm.securityPin).trim().length !== 6) {
        alert("The Chief Accountant requires a 6-digit Financial Security PIN.");
        return;
      }
      portalStore.updateAccountantCredentials(
        receptionForm.username,
        receptionForm.password,
        receptionForm.name,
        receptionForm.securityPin,
        receptionForm.otpEmail
      );
      refreshData();
      showToast(`Chief Accountant credentials, Phone OTP Email & 6-Digit PIN saved successfully.`);
      return;
    }

    if (selectedStaffDesk === 'Admin Core') {
      portalStore.updateAdminCredentials(
        receptionForm.username,
        receptionForm.password,
        receptionForm.name,
        receptionForm.otpEmail || receptionForm.username
      );
      refreshData();
      showToast(`General Manager Executive Core personal email & credentials updated successfully.`);
      return;
    }

    portalStore.updateReceptionistCredentials(
      selectedStaffDesk,
      receptionForm.username,
      receptionForm.password,
      receptionForm.name
    );
    refreshData();
    showToast(`${selectedStaffDesk} Receptionist login updated to '${receptionForm.username}' with new password.`);
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

  // 5. CEO Quick Order Status & Settlement Controls
  const handleAdminUpdateOrderStatus = (orderId, newStatus) => {
    portalStore.updateDiningOrderStatus(orderId, newStatus, currentUser?.name || 'General Manager (CEO)');
    refreshData();
    showToast(`Order ${orderId} updated to '${newStatus}'.`);
  };

  const handleAdminSettleOrder = (orderId) => {
    portalStore.settleSingleDiningOrder(orderId, 'CEO Executive Verification', `CEO-VER-${Date.now().toString(36).toUpperCase()}`);
    refreshData();
    showToast(`Order ${orderId} marked as Paid.`);
  };

  // --- COMPREHENSIVE HOTEL OPERATIONS & PRODUCT METRICS ---
  // A. Suite Bookings & Room Inventory Metrics
  const roomPaidRevenue = bookings.reduce((sum, b) => {
    return sum + (b.paymentStatus === 'Paid' ? Number(b.amount || 0) : 0);
  }, 0);

  const roomPendingRevenue = bookings.reduce((sum, b) => {
    return sum + (b.paymentStatus !== 'Paid' ? Number(b.amount || 0) : 0);
  }, 0);

  const isRoomOccupied = (r) => String(r.status || '').toLowerCase() === 'occupied';
  const isRoomReserved = (r) => String(r.status || '').toLowerCase() === 'reserved';
  const isRoomCleaning = (r) => {
    const s = String(r.status || '').toLowerCase();
    return s === 'cleaning' || s === 'maintenance';
  };
  const isRoomAvailable = (r) => !isRoomOccupied(r) && !isRoomReserved(r) && !isRoomCleaning(r);

  const totalOccupied = rooms.filter(isRoomOccupied).length;
  const totalReserved = rooms.filter(isRoomReserved).length;
  const totalCleaning = rooms.filter(isRoomCleaning).length;
  const totalAvailable = rooms.filter(isRoomAvailable).length;
  const totalRoomsBooked = totalOccupied + totalReserved;
  const occupancyPercent = rooms.length > 0 ? Math.round((totalRoomsBooked / rooms.length) * 100) : 0;
  const totalNightsBooked = bookings.reduce((sum, b) => sum + (Number(b.nights) || 1), 0);

  const mainWingRooms = rooms.filter(r => r.building === 'Main Building' || String(r.roomNumber || '').startsWith('6'));
  const extWingRooms = rooms.filter(r => r.building === 'Extension Building' || String(r.roomNumber || '').startsWith('1'));
  const mainWingOccupied = mainWingRooms.filter(isRoomOccupied).length;
  const mainWingReserved = mainWingRooms.filter(isRoomReserved).length;
  const mainWingAvailable = mainWingRooms.filter(isRoomAvailable).length;
  const mainWingBooked = mainWingOccupied + mainWingReserved;

  const extWingOccupied = extWingRooms.filter(isRoomOccupied).length;
  const extWingReserved = extWingRooms.filter(isRoomReserved).length;
  const extWingAvailable = extWingRooms.filter(isRoomAvailable).length;
  const extWingBooked = extWingOccupied + extWingReserved;

  const mainWingRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid' && (b.building === 'Main Building' || String(b.id || '').includes('BGD') || String(b.roomNumber || '').startsWith('6')))
    .reduce((s, b) => s + Number(b.amount || 0), 0);
  const extWingRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid' && (b.building === 'Extension Building' || String(b.id || '').includes('EXT') || String(b.roomNumber || '').startsWith('1')))
    .reduce((s, b) => s + Number(b.amount || 0), 0);
  const mainWingRoomRev = mainWingRevenue;
  const extWingRoomRev = extWingRevenue;

  // B. Food (ARB-FDD) & Drinks (ARB-DRK) Operations Metrics
  const activeDiningOrders = diningOrders.filter(o => o.orderStatus !== 'Cancelled');
  const drinkOrders = activeDiningOrders.filter(o => o.orderType === 'drinks' || String(o.id || '').startsWith('ARB-DRK'));
  const foodOrders = activeDiningOrders.filter(o => o.orderType !== 'drinks' && !String(o.id || '').startsWith('ARB-DRK'));

  const totalDrinkUnitsSold = drinkOrders.reduce((sum, o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    const itemCount = items.reduce((s, i) => s + (Number(i.qty) || 1), 0);
    return sum + (itemCount || 1);
  }, 0);

  const totalFoodUnitsSold = foodOrders.reduce((sum, o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    const itemCount = items.reduce((s, i) => s + (Number(i.qty) || 1), 0);
    return sum + (itemCount || 1);
  }, 0);

  const totalDrinkRevenue = drinkOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const totalFoodRevenue = foodOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const paidDiningRevenue = activeDiningOrders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const pendingDiningRevenue = activeDiningOrders
    .filter(o => o.paymentStatus !== 'Paid')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0);

  // Pending / Active Order Queue
  const isOrderCompleted = (status) => {
    const s = String(status || '').toLowerCase();
    return s.includes('delivered') || s.includes('picked up') || s.includes('completed') || s.includes('served') || s.includes('cancelled');
  };
  const pendingDiningOrders = activeDiningOrders.filter(o => !isOrderCompleted(o.orderStatus));
  const pendingDrinkOrdersCount = drinkOrders.filter(o => !isOrderCompleted(o.orderStatus)).length;
  const pendingFoodOrdersCount = foodOrders.filter(o => !isOrderCompleted(o.orderStatus)).length;
  const readyForPickupCount = activeDiningOrders.filter(o => String(o.orderStatus || '').toLowerCase().includes('ready')).length;

  // Combined Hotel Gross Revenue (Rooms + Food + Drinks)
  const totalGrossRevenue = roomPaidRevenue + paidDiningRevenue;
  const pendingRevenue = roomPendingRevenue + pendingDiningRevenue;

  // Paystack vs Front Desk split (across Rooms + Dining)
  const paystackRoomRev = bookings
    .filter(b => b.paymentStatus === 'Paid' && b.paymentMethod && b.paymentMethod.toLowerCase().includes('paystack'))
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const paystackDiningRev = activeDiningOrders
    .filter(o => o.paymentStatus === 'Paid' && o.paymentMethod && o.paymentMethod.toLowerCase().includes('paystack'))
    .reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const paystackRevenue = paystackRoomRev + paystackDiningRev;
  const frontDeskRevenue = Math.max(0, totalGrossRevenue - paystackRevenue);

  // Product Catalog Breakdown
  const foodCatalogItems = diningMenu.filter(i => i.type === 'food');
  const drinkCatalogItems = diningMenu.filter(i => i.type === 'drinks');

  // Item-level sales aggregation for Top Products
  const itemSalesMap = {};
  activeDiningOrders.forEach(order => {
    (order.items || []).forEach(item => {
      const key = item.name || item.id || 'Item';
      if (!itemSalesMap[key]) {
        itemSalesMap[key] = {
          name: key,
          type: item.type || order.orderType || 'food',
          qtySold: 0,
          revenue: 0
        };
      }
      const q = Number(item.qty) || 1;
      const rev = Number(item.totalPrice) || (Number(item.unitPrice || item.price || 0) * q);
      itemSalesMap[key].qtySold += q;
      itemSalesMap[key].revenue += rev;
    });
  });
  const topDrinksSoldList = Object.values(itemSalesMap)
    .filter(i => i.type === 'drinks')
    .sort((a, b) => b.qtySold - a.qtySold);
  const topFoodSoldList = Object.values(itemSalesMap)
    .filter(i => i.type !== 'drinks')
    .sort((a, b) => b.qtySold - a.qtySold);

  // Filtered Orders for CEO Overview Queue
  const filteredOverviewOrders = activeDiningOrders.filter(o => {
    if (overviewOrderFilter === 'pending') return !isOrderCompleted(o.orderStatus);
    if (overviewOrderFilter === 'drinks') return o.orderType === 'drinks' || String(o.id || '').startsWith('ARB-DRK');
    if (overviewOrderFilter === 'food') return o.orderType !== 'drinks' && !String(o.id || '').startsWith('ARB-DRK');
    return true;
  });

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
                CEO &amp; General Manager Command Portal
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono uppercase tracking-wider">
                Full Executive Authority
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Arab Signature Hotel &amp; Suites &bull; Live Operations, Products &amp; Financial Command
            </p>
          </div>
        </div>

        {/* Executive Actions */}
        <div className="flex items-center gap-2.5">
          {/* Accountant Portal Shortcut */}
          <button
            onClick={() => onNavigate(SECURE_PORTAL_ROUTES.ACCOUNTANT_PORTAL)}
            className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Open Accountant & Financial Audit Portal"
          >
            <Calculator size={14} className="text-emerald-400" />
            <span className="hidden sm:inline">Accountant Vault</span>
          </button>

          {/* Reception Portal Shortcut */}
          <button
            onClick={() => onNavigate(SECURE_PORTAL_ROUTES.MAIN_RECEPTION_PORTAL)}
            className="px-3 py-2 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/35 text-[#f3e5ab] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Open Front Desk Reception Portal"
          >
            <KeyRound size={14} className="text-[#d4af37]" />
            <span className="hidden sm:inline">Front Desk</span>
          </button>
          
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
        
        {/* Executive KPI Overview Cards (Rooms Booked, Drinks/Food Sold, Pending Orders, Total Revenue) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Rooms Booked & Live Suite Status */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16030c] to-[#2e0513] border border-[#d4af37]/45 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span className="uppercase tracking-wider font-semibold">Rooms Booked &amp; Active</span>
              <BedDouble size={16} className="text-[#d4af37]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-cinzel font-bold text-white">
                {totalRoomsBooked} <span className="text-sm font-sans font-normal text-gray-400">/ {rooms.length || 34} Rooms</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#f3e5ab] px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30">
                {occupancyPercent}%
              </span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
              <span><strong className="text-emerald-400">{totalOccupied}</strong> Checked-In</span>
              <span><strong className="text-amber-400">{totalReserved}</strong> Reserved</span>
              <span><strong className="text-gray-400">{totalAvailable}</strong> Free</span>
            </div>
          </div>

          {/* 2. Drinks & Food Sold (VIP Bar & Al-Sultan Kitchen) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16030c] to-[#120208] border border-white/15 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span className="uppercase tracking-wider font-semibold">Drinks &amp; Food Sold</span>
              <Wine size={16} className="text-[#d4af37]" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-black/40 border border-purple-500/25">
                <div className="text-[10px] text-purple-300 uppercase font-semibold">Drinks Sold</div>
                <div className="text-lg font-mono font-bold text-white">{totalDrinkUnitsSold} <span className="text-[10px] font-sans text-gray-400">units</span></div>
                <div className="text-[10px] font-mono text-[#f3e5ab]">₦{totalDrinkRevenue.toLocaleString()}</div>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-amber-500/25">
                <div className="text-[10px] text-amber-300 uppercase font-semibold">Food Sold</div>
                <div className="text-lg font-mono font-bold text-white">{totalFoodUnitsSold} <span className="text-[10px] font-sans text-gray-400">plates</span></div>
                <div className="text-[10px] font-mono text-emerald-400">₦{totalFoodRevenue.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 3. Pending Orders & Action Queue */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16030c] to-[#120208] border border-white/15 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span className="uppercase tracking-wider font-semibold">Pending Orders Queue</span>
              <BellRing size={16} className={pendingDiningOrders.length > 0 ? "text-amber-400 animate-bounce" : "text-[#d4af37]"} />
            </div>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-400">
                {pendingDiningOrders.length}
              </span>
              <span className="text-xs text-gray-400">active orders in preparation</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
              <span><strong className="text-purple-300">{pendingDrinkOrdersCount}</strong> Bar Drinks</span>
              <span><strong className="text-amber-300">{pendingFoodOrdersCount}</strong> Kitchen Food</span>
              <span><strong className="text-emerald-400">{readyForPickupCount}</strong> Ready</span>
            </div>
          </div>

          {/* 4. Total Hotel Revenue (Rooms + Food + Drinks) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16030c] to-[#120208] border border-[#d4af37]/35 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span className="uppercase tracking-wider font-semibold">Total Hotel Revenue</span>
              <DollarSign size={16} className="text-[#d4af37]" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#f3e5ab] mt-2">
              ₦{totalGrossRevenue.toLocaleString()}
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
              <span className="text-gray-300">Suites: <strong className="text-white">₦{roomPaidRevenue.toLocaleString()}</strong></span>
              <span className="text-gray-300">F&amp;B: <strong className="text-emerald-400">₦{paidDiningRevenue.toLocaleString()}</strong></span>
              {pendingRevenue > 0 && (
                <span className="text-amber-400">+₦{pendingRevenue.toLocaleString()} Unsettled</span>
              )}
            </div>
          </div>

        </div>

        {/* 3. Executive Tab Navigation (Default: Hotel Operations & Products Overview) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-[#16030c] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <BarChart3 size={14} />
            <span>Hotel Operations &amp; Products Summary</span>
            {pendingDiningOrders.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'overview' ? 'bg-black text-[#f3e5ab]' : 'bg-amber-500 text-black'
              }`}>
                {pendingDiningOrders.length} Pending
              </span>
            )}
          </button>

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
            <span>Dining & Drinks Menu ({diningMenu.length})</span>
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
            <span>Staff & Accountant Logins</span>
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
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-lg shadow-[#d4af37]/20'
                : 'bg-[#16030c] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <MessageSquare size={14} />
            <span>Inter-Desk Chat Audit (30-Day) ({chatMessages.length})</span>
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
        {/* 3.5 TAB CONTENT: HOTEL OPERATIONS & PRODUCTS SUMMARY (DEFAULT CEO VIEW) */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Executive Welcome & Live Operations Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#1d0511] via-[#16030c] to-[#120208] border border-[#d4af37]/40 shadow-lg">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Hotel Pulse
                  </span>
                  <h2 className="font-cinzel font-bold text-lg sm:text-xl text-white">
                    Full Hotel Operations, Products &amp; Sales Command
                  </h2>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  Real-time executive view of all <strong className="text-white">34 Luxury Suites</strong> (Main 600 Wing &amp; Extension 100 Wing), <strong className="text-[#f3e5ab]">VIP Bar &amp; Drinks Sales</strong>, <strong className="text-orange-300">Al-Sultan Kitchen Orders</strong>, and live pending requests.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('rates')}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <DollarSign size={14} className="text-[#d4af37]" />
                  <span>Suite Rates</span>
                </button>
                <button
                  onClick={() => setActiveTab('drinks-menu')}
                  className="px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Wine size={14} className="text-purple-400" />
                  <span>Drinks Catalog ({drinkCatalogItems.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('food-menu')}
                  className="px-3.5 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Utensils size={14} className="text-orange-400" />
                  <span>Food Menu ({foodCatalogItems.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Settings size={14} className="text-emerald-400" />
                  <span>Operations Controls</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: 4 PILLARS OF HOTEL OPERATIONS (HOW THINGS ARE GOING) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

              {/* Pillar 1: Main Building (600 Wing — 20 Suites) */}
              <div className="p-5 rounded-2xl bg-[#16030c] border border-[#d4af37]/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f3e5ab] text-[10px] font-mono uppercase font-bold">
                      Main Building &bull; 600 Wing
                    </span>
                    <Building2 size={18} className="text-[#d4af37]" />
                  </div>
                  <h3 className="font-cinzel font-bold text-base text-white">
                    Suites 601 &ndash; 620 (20 Rooms)
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Standard, Deluxe, Executive &amp; Royal Diplomatic Suites
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center">
                      <p className="text-lg font-bold text-emerald-400 font-mono">{mainWingOccupied}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Checked In</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center">
                      <p className="text-lg font-bold text-amber-300 font-mono">{mainWingReserved}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Reserved</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-center">
                      <p className="text-lg font-bold text-blue-300 font-mono">{mainWingAvailable}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Available</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Main Wing Revenue:</span>
                  <span className="font-mono font-bold text-[#f3e5ab]">₦{mainWingRoomRev.toLocaleString()}</span>
                </div>
              </div>

              {/* Pillar 2: Extension Building (100 Wing — 14 Suites) */}
              <div className="p-5 rounded-2xl bg-[#16030c] border border-cyan-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase font-bold">
                      Extension Wing &bull; 100 Wing
                    </span>
                    <BedDouble size={18} className="text-cyan-400" />
                  </div>
                  <h3 className="font-cinzel font-bold text-base text-white">
                    Suites 101 &ndash; 114 (14 Rooms)
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    2-Bedroom Apartments &amp; Diplomatic Double Suites
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center">
                      <p className="text-lg font-bold text-emerald-400 font-mono">{extWingOccupied}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Checked In</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center">
                      <p className="text-lg font-bold text-amber-300 font-mono">{extWingReserved}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Reserved</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-center">
                      <p className="text-lg font-bold text-blue-300 font-mono">{extWingAvailable}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Available</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Extension Revenue:</span>
                  <span className="font-mono font-bold text-cyan-300">₦{extWingRoomRev.toLocaleString()}</span>
                </div>
              </div>

              {/* Pillar 3: VIP Bar & Wine Cellar (ARB-DRK) */}
              <div className="p-5 rounded-2xl bg-[#16030c] border border-purple-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase font-bold">
                      VIP Bar &bull; ARB-DRK
                    </span>
                    <Wine size={18} className="text-purple-400" />
                  </div>
                  <h3 className="font-cinzel font-bold text-base text-white">
                    Drinks &amp; Wine Cellar Sales
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {drinkCatalogItems.filter(i => i.available !== false).length} Active Drinks in Bar Catalog
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-center">
                      <p className="text-lg font-bold text-purple-300 font-mono">{totalDrinkUnitsSold}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Sold Units</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                      <p className="text-lg font-bold text-white font-mono">{drinkOrders.length}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Orders</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center">
                      <p className="text-lg font-bold text-amber-300 font-mono">{pendingDrinkOrdersCount}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Pending</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Bar Sales Value:</span>
                  <span className="font-mono font-bold text-purple-300">₦{totalDrinkRevenue.toLocaleString()}</span>
                </div>
              </div>

              {/* Pillar 4: Al-Sultan Culinary Kitchen (ARB-FDD) */}
              <div className="p-5 rounded-2xl bg-[#16030c] border border-orange-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 text-[10px] font-mono uppercase font-bold">
                      Restaurant &bull; ARB-FDD
                    </span>
                    <Utensils size={18} className="text-orange-400" />
                  </div>
                  <h3 className="font-cinzel font-bold text-base text-white">
                    Kitchen &amp; Room Dining Sales
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {foodCatalogItems.filter(i => i.available !== false).length} Active Dishes in Kitchen Menu
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/25 text-center">
                      <p className="text-lg font-bold text-orange-300 font-mono">{totalFoodUnitsSold}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Plates Sold</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                      <p className="text-lg font-bold text-white font-mono">{foodOrders.length}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Orders</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center">
                      <p className="text-lg font-bold text-amber-300 font-mono">{pendingFoodOrdersCount}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Pending</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Kitchen Sales Value:</span>
                  <span className="font-mono font-bold text-orange-300">₦{totalFoodRevenue.toLocaleString()}</span>
                </div>
              </div>

            </div>

            {/* SECTION 2: LIVE PENDING ORDERS QUEUE & ACTIVE ROOM BOOKINGS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left 7 Cols: Live Food & Drinks Order Queue (Pending & Completed) */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-[#16030c] border border-[#d4af37]/30 flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <BellRing size={16} className={pendingDiningOrders.length > 0 ? 'text-amber-400 animate-bounce' : 'text-[#d4af37]'} />
                      <h3 className="font-cinzel font-bold text-base text-white">
                        Live Bar &amp; Kitchen Order Queue
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                        {pendingDiningOrders.length} Pending
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Monitor or fulfill guest drink orders (<code className="text-purple-300">ARB-DRK</code>) and food orders (<code className="text-orange-300">ARB-FDD</code>) in real time.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 bg-[#0e0107] p-1 rounded-xl border border-white/10 self-start">
                    {[
                      { id: 'all', label: `All (${activeDiningOrders.length})` },
                      { id: 'pending', label: `Pending (${pendingDiningOrders.length})` },
                      { id: 'drinks', label: `Drinks (${drinkOrders.length})` },
                      { id: 'food', label: `Food (${foodOrders.length})` },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setOverviewOrderFilter(tab.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          overviewOrderFilter === tab.id
                            ? 'bg-[#d4af37] text-black'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders List */}
                <div className="mt-4 space-y-3 max-h-[430px] overflow-y-auto pr-1">
                  {filteredOverviewOrders.length === 0 ? (
                    <div className="p-8 rounded-xl bg-[#0e0107] border border-white/5 text-center">
                      <CheckCircle2 size={28} className="text-emerald-400 mx-auto mb-2 opacity-80" />
                      <p className="text-sm font-semibold text-white">No Orders Matching Filter</p>
                      <p className="text-xs text-gray-400 mt-1">
                        All guest food and drink orders in this category have been cleared.
                      </p>
                    </div>
                  ) : (
                    filteredOverviewOrders.slice(0, 20).map((order) => {
                      const isDrink = order.orderType === 'drinks' || String(order.id || '').startsWith('ARB-DRK');
                      const completed = isOrderCompleted(order.orderStatus);
                      const isPaid = order.paymentStatus === 'Paid';

                      return (
                        <div
                          key={order.id}
                          className={`p-4 rounded-xl border transition-all ${
                            !completed
                              ? 'bg-[#1c0410] border-amber-500/40 shadow-md'
                              : 'bg-[#0e0107]/90 border-white/10'
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                isDrink
                                  ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                                  : 'bg-orange-500/20 border border-orange-500/40 text-orange-300'
                              }`}>
                                {order.id}
                              </span>
                              <span className="text-xs font-bold text-white">
                                {order.guestName || 'Walk-In VIP Guest'}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                &bull; {order.roomNumber && order.roomNumber !== 'Walk-In / Lounge' ? `Suite ${order.roomNumber}` : (order.fulfillmentLabel || 'Bar / Restaurant Pickup')}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                completed
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}>
                                {order.orderStatus || 'Order Received'}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                isPaid
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}>
                                {isPaid ? 'PAID' : 'UNPAID'}
                              </span>
                              <span className="font-mono font-bold text-sm text-[#f3e5ab]">
                                ₦{Number(order.amount || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Ordered Items Breakdown */}
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {(order.items || []).map((item, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-200"
                              >
                                <strong className="text-[#f3e5ab]">{item.qty || 1}x</strong> {item.name}
                              </span>
                            ))}
                            {(!order.items || order.items.length === 0) && order.summary && (
                              <span className="text-xs text-gray-300">{order.summary}</span>
                            )}
                          </div>

                          {/* Footer: Timestamp & Quick CEO Fulfillment Actions */}
                          <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                            <span className="text-gray-400">
                              Ordered: <strong className="text-gray-300">{order.createdAt || 'Just now'}</strong> &bull; Method: <strong className="text-gray-300">{order.paymentMethod || 'Pay at Front Desk'}</strong>
                            </span>

                            <div className="flex items-center gap-1.5">
                              {!completed && (
                                <>
                                  <button
                                    onClick={() => handleAdminUpdateOrderStatus(order.id, 'Ready for Pickup')}
                                    className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-200 text-[10px] font-semibold transition-all"
                                  >
                                    Mark Ready
                                  </button>
                                  <button
                                    onClick={() => handleAdminUpdateOrderStatus(order.id, order.fulfillmentType === 'pickup' ? 'Picked Up' : 'Delivered to Room')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-[10px] font-semibold transition-all"
                                  >
                                    Mark Delivered
                                  </button>
                                </>
                              )}
                              {!isPaid && (
                                <button
                                  onClick={() => handleAdminSettleOrder(order.id)}
                                  className="px-2.5 py-1 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-semibold transition-all"
                                >
                                  Confirm Paid
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right 5 Cols: Active Room Bookings & Live 34-Room Status Map */}
              <div className="lg:col-span-5 space-y-6">

                {/* Live 34-Suite Status Grid */}
                <div className="p-5 rounded-2xl bg-[#16030c] border border-[#d4af37]/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-cinzel font-bold text-sm sm:text-base text-white">
                        Live 34-Suite Status Map
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Instant room-by-room occupancy across both buildings
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-mono font-bold">
                      {totalRoomsBooked} / {rooms.length || 34} Booked
                    </span>
                  </div>

                  {/* Main Building 600 Wing Grid */}
                  <div className="mb-3">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] mb-1.5">
                      Main Building &bull; 600 Wing (Suites 601–620)
                    </p>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                      {mainWingRooms.map(r => {
                        const statusLower = String(r.status || '').toLowerCase();
                        const color =
                          statusLower === 'occupied'
                            ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                            : statusLower === 'reserved'
                            ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                            : statusLower === 'cleaning' || statusLower === 'maintenance'
                            ? 'bg-purple-500/25 border-purple-400 text-purple-200'
                            : 'bg-white/5 border-white/10 text-gray-400';
                        return (
                          <div
                            key={r.roomNumber}
                            title={`Suite ${r.roomNumber} (${r.type || r.name}): ${r.status}${r.currentGuest || r.guest ? ` — ${r.currentGuest || r.guest}` : ''}`}
                            className={`py-1.5 rounded-lg border text-center font-mono text-[11px] font-bold ${color}`}
                          >
                            {r.roomNumber}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Extension Building 100 Wing Grid */}
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 mb-1.5">
                      Extension Building &bull; 100 Wing (Suites 101–114)
                    </p>
                    <div className="grid grid-cols-7 gap-1.5">
                      {extWingRooms.map(r => {
                        const statusLower = String(r.status || '').toLowerCase();
                        const color =
                          statusLower === 'occupied'
                            ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                            : statusLower === 'reserved'
                            ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                            : statusLower === 'cleaning' || statusLower === 'maintenance'
                            ? 'bg-purple-500/25 border-purple-400 text-purple-200'
                            : 'bg-white/5 border-white/10 text-gray-400';
                        return (
                          <div
                            key={r.roomNumber}
                            title={`Suite ${r.roomNumber} (${r.type || r.name}): ${r.status}${r.currentGuest || r.guest ? ` — ${r.currentGuest || r.guest}` : ''}`}
                            className={`py-1.5 rounded-lg border text-center font-mono text-[11px] font-bold ${color}`}
                          >
                            {r.roomNumber}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"></span> Occupied ({totalOccupied})</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block"></span> Reserved Hold ({totalReserved})</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-gray-500 inline-block"></span> Available ({totalAvailable})</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-purple-400 inline-block"></span> Cleaning ({totalCleaning})</span>
                  </div>
                </div>

                {/* Recent & Active Suite Bookings */}
                <div className="p-5 rounded-2xl bg-[#16030c] border border-[#d4af37]/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-cinzel font-bold text-sm sm:text-base text-white">
                        Recent Suite Reservations
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Latest guest bookings &amp; front desk check-ins
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-mono">
                      {bookings.length} Total
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[210px] overflow-y-auto pr-1">
                    {bookings.slice(0, 8).map((b) => (
                      <div
                        key={b.id}
                        className="p-3 rounded-xl bg-[#0e0107] border border-white/10 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-[#d4af37]">{b.id}</span>
                            <span className="text-xs font-bold text-white">{b.guestName}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Suite <strong className="text-gray-200">{b.roomNumber}</strong> ({b.roomType}) &bull; {b.nights || 1} Night(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-xs text-[#f3e5ab]">
                            ₦{Number(b.amount || 0).toLocaleString()}
                          </p>
                          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                            b.bookingStatus === 'Checked In'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : b.bookingStatus === 'Reserved'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* SECTION 3: FULL HOTEL PRODUCTS & CATALOG PERFORMANCE ("HOW EVERYTHING IS GOING") */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Product Line 1: All 6 Suite Categories Performance */}
              <div className="p-5 rounded-2xl bg-[#16030c] border border-[#d4af37]/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37]">
                        Hospitality Product Line 1
                      </span>
                      <h3 className="font-cinzel font-bold text-base text-white">
                        6 Luxury Suite Categories
                      </h3>
                    </div>
                    <BedDouble size={18} className="text-[#d4af37]" />
                  </div>

                  <div className="space-y-2.5 mt-3">
                    {(Array.isArray(rates) ? rates : Object.values(rates || {})).map((suite, idx) => {
                      const suiteId = suite.id || `suite-${idx}`;
                      const suiteName = suite.name || 'Luxury Suite';
                      const suitePrice = Number(suite.price || suite.baseRate || 0);

                      const suiteRooms = rooms.filter(r => {
                        const rType = String(r.type || '').toLowerCase();
                        const rName = String(r.name || '').toLowerCase();
                        const sId = String(suiteId).toLowerCase();
                        const sName = String(suiteName).toLowerCase();
                        return rType === sId || rName.includes(sId) || sName.includes(rType);
                      });

                      const bookedCount = suiteRooms.filter(r => {
                        const s = String(r.status || '').toLowerCase();
                        return s === 'occupied' || s === 'reserved';
                      }).length;

                      const suiteRev = bookings
                        .filter(b => {
                          const bType = String(b.roomType || b.suiteKey || '').toLowerCase();
                          const sId = String(suiteId).toLowerCase();
                          const sName = String(suiteName).toLowerCase();
                          return bType === sId || bType.includes(sId) || sName.includes(bType);
                        })
                        .reduce((s, b) => s + (b.paymentStatus === 'Paid' ? Number(b.amount || 0) : 0), 0);

                      return (
                        <div key={suiteId} className="p-3 rounded-xl bg-[#0e0107] border border-white/10 flex items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-xs font-bold text-white">{suiteName}</p>
                              {suite.isPromoActive && suite.promoPrice && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
                                  PROMO
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Rate:{' '}
                              {suite.isPromoActive && suite.promoPrice ? (
                                <>
                                  <span className="line-through text-gray-500 mr-1">₦{suitePrice.toLocaleString()}</span>
                                  <strong className="text-emerald-400">₦{Number(suite.promoPrice).toLocaleString()}/night</strong>
                                </>
                              ) : (
                                <strong className="text-[#f3e5ab]">₦{suitePrice.toLocaleString()}/night</strong>
                              )}{' '}
                              &bull; {bookedCount}/{suiteRooms.length || '-'} Booked
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-bold text-xs text-emerald-400">
                              ₦{suiteRev.toLocaleString()}
                            </p>
                            <p className="text-[9px] text-gray-500 uppercase">Earned</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('rates')}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-semibold transition-all"
                >
                  Open Suite Rate Manager &rarr;
                </button>
              </div>

              {/* Product Line 2: VIP Bar & Wine Cellar Products Performance */}
              <div className="p-5 rounded-2xl bg-[#16030c] border border-purple-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300">
                        Hospitality Product Line 2
                      </span>
                      <h3 className="font-cinzel font-bold text-base text-white">
                        VIP Bar &amp; Beverage Products
                      </h3>
                    </div>
                    <Wine size={18} className="text-purple-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2.5 rounded-xl bg-[#0e0107] border border-white/10">
                      <p className="text-[10px] text-gray-400 uppercase">Catalog Drinks</p>
                      <p className="text-base font-bold text-white font-mono">
                        {drinkCatalogItems.filter(i => i.available !== false).length} <span className="text-[11px] text-gray-400 font-normal">/ {drinkCatalogItems.length}</span>
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0e0107] border border-white/10">
                      <p className="text-[10px] text-gray-400 uppercase">Drinks Sold</p>
                      <p className="text-base font-bold text-purple-300 font-mono">
                        {totalDrinkUnitsSold} <span className="text-[11px] text-gray-400 font-normal">units</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                    Top Selling Drinks &amp; Bottles
                  </p>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {topDrinksSoldList.length === 0 ? (
                      drinkCatalogItems.slice(0, 6).map(item => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-[#0e0107] border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-gray-200">{item.name}</p>
                            <p className="text-[10px] text-gray-500">{item.category}</p>
                          </div>
                          <span className="font-mono text-purple-300 font-bold">₦{Number(item.price || 0).toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      topDrinksSoldList.slice(0, 6).map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-[#0e0107] border border-purple-500/20 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-white">{item.name}</p>
                            <p className="text-[10px] text-purple-300 font-mono">{item.qtySold} unit(s) sold</p>
                          </div>
                          <span className="font-mono text-[#f3e5ab] font-bold">₦{Number(item.revenue || 0).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('drinks-menu')}
                  className="mt-4 w-full py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all"
                >
                  Manage Drinks &amp; Wine Prices &rarr;
                </button>
              </div>

              {/* Product Line 3: Al-Sultan Culinary Kitchen Products Performance */}
              <div className="p-5 rounded-2xl bg-[#16030c] border border-orange-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-orange-300">
                        Hospitality Product Line 3
                      </span>
                      <h3 className="font-cinzel font-bold text-base text-white">
                        Al-Sultan Kitchen Products
                      </h3>
                    </div>
                    <Utensils size={18} className="text-orange-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2.5 rounded-xl bg-[#0e0107] border border-white/10">
                      <p className="text-[10px] text-gray-400 uppercase">Active Dishes</p>
                      <p className="text-base font-bold text-white font-mono">
                        {foodCatalogItems.filter(i => i.available !== false).length} <span className="text-[11px] text-gray-400 font-normal">/ {foodCatalogItems.length}</span>
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0e0107] border border-white/10">
                      <p className="text-[10px] text-gray-400 uppercase">Plates Sold</p>
                      <p className="text-base font-bold text-orange-300 font-mono">
                        {totalFoodUnitsSold} <span className="text-[11px] text-gray-400 font-normal">plates</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                    Top Selling Kitchen Dishes
                  </p>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {topFoodSoldList.length === 0 ? (
                      foodCatalogItems.slice(0, 6).map(item => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-[#0e0107] border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-gray-200">{item.name}</p>
                            <p className="text-[10px] text-gray-500">{item.category}</p>
                          </div>
                          <span className="font-mono text-orange-300 font-bold">₦{Number(item.price || 0).toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      topFoodSoldList.slice(0, 6).map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-[#0e0107] border border-orange-500/20 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-white">{item.name}</p>
                            <p className="text-[10px] text-orange-300 font-mono">{item.qtySold} plate(s) sold</p>
                          </div>
                          <span className="font-mono text-[#f3e5ab] font-bold">₦{Number(item.revenue || 0).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('food-menu')}
                  className="mt-4 w-full py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-200 text-xs font-semibold transition-all"
                >
                  Manage Food Menu &amp; Prices &rarr;
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 4. TAB CONTENT: LIVE SUITE RATE & PROMO PRICE MANAGER */}
        {/* ======================================================== */}
        {activeTab === 'rates' && (
          <div className="space-y-6">
            
            {/* Top Toolbar & Promo Stats Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#1d0511] via-[#16030c] to-[#120208] border border-[#d4af37]/40 shadow-xl">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    <Flame size={12} className="text-emerald-400" />
                    Live Suite Pricing &amp; Promo Engine
                  </span>
                  <h3 className="font-cinzel font-bold text-base sm:text-lg text-white">
                    Suite Rate &amp; Promotional Pricing Manager
                  </h3>
                </div>
                <p className="text-xs text-gray-300 mt-1 max-w-3xl">
                  Adjust standard nightly rates and activate promo prices in Naira. Active promos immediately show on the public website, suite cards, and booking engine with strikethrough original prices and instant guest discounts.
                </p>

                {/* Quick Stats Pills */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-mono">
                  <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300">
                    Total Categories: <strong className="text-white">{rates.length}</strong>
                  </span>
                  <span className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 font-bold ${
                    rates.some(r => r.isPromoActive)
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}>
                    <Flame size={13} className={rates.some(r => r.isPromoActive) ? 'text-emerald-400 animate-pulse' : 'text-gray-400'} />
                    <span>Active Promos: <strong>{rates.filter(r => r.isPromoActive).length}</strong></span>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
                <button
                  onClick={handleSaveAllRates}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#d4af37]/25 hover:scale-102 transition-all cursor-pointer"
                >
                  <Save size={15} />
                  <span>Save All Rates &amp; Promos Live</span>
                </button>
              </div>
            </div>

            {/* Suite Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {rates.map((room) => {
                const currentPrice = rateEdits[room.id] !== undefined ? rateEdits[room.id] : room.price;
                const currentPromo = promoPriceEdits[room.id] !== undefined ? promoPriceEdits[room.id] : (room.promoPrice || '');
                const isPromoToggled = promoActiveEdits[room.id] !== undefined ? promoActiveEdits[room.id] : Boolean(room.isPromoActive);

                const numBase = Number(currentPrice) || 0;
                const numPromo = (currentPromo !== '' && currentPromo !== null && currentPromo !== undefined && !isNaN(currentPromo) && Number(currentPromo) > 0) ? Number(currentPromo) : null;
                const isValidDiscount = Boolean(numPromo && numBase > 0 && numPromo < numBase);
                const discountPct = isValidDiscount ? Math.round(((numBase - numPromo) / numBase) * 100) : 0;
                const savingsNaira = isValidDiscount ? (numBase - numPromo) : 0;
                const isPromoActiveCurrently = Boolean(room.isPromoActive && room.promoPrice);

                return (
                  <div
                    key={room.id}
                    className={`p-5 rounded-2xl transition-all space-y-4 border ${
                      isPromoActiveCurrently
                        ? 'bg-gradient-to-br from-[#1a0512] via-[#16030c] to-[#0c1813] border-emerald-500/50 shadow-lg shadow-emerald-950/30'
                        : 'bg-[#16030c] border-white/10 hover:border-[#d4af37]/50'
                    }`}
                  >
                    {/* Header: Suite Identity & Live Price Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] block">
                            Suite ID: {room.id}
                          </span>
                          {isPromoActiveCurrently ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                              <Flame size={10} className="text-emerald-400" />
                              <span>PROMO ACTIVE (-{room.discountPercent || discountPct}%)</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-mono">
                              Standard Rate
                            </span>
                          )}
                        </div>
                        <h4 className="font-cinzel font-bold text-base text-white mt-0.5">
                          {room.name}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                          {room.description}
                        </p>
                      </div>

                      {/* Current Live Display */}
                      <div className="text-right flex-shrink-0">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Live Guest Price</span>
                        {isPromoActiveCurrently ? (
                          <div>
                            <span className="line-through text-gray-500 text-xs font-mono block">
                              {room.priceFormatted}
                            </span>
                            <div className="font-mono font-extrabold text-lg text-emerald-400 leading-tight">
                              {room.promoPriceFormatted || `₦${Number(room.promoPrice).toLocaleString()}`}
                            </div>
                            <span className="text-[10px] text-gray-400 block">/ night</span>
                          </div>
                        ) : (
                          <div>
                            <div className="font-mono font-bold text-base text-[#f3e5ab]">
                              {room.priceFormatted}
                            </div>
                            <span className="text-[10px] text-gray-400 block">/ night</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dual Inputs: Base Rate & Promo Price */}
                    <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      
                      {/* 1. Base Rate Input */}
                      <div>
                        <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                          Standard Base Rate (₦)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#d4af37]">
                            ₦
                          </span>
                          <input
                            type="number"
                            step="1000"
                            min="5000"
                            value={currentPrice}
                            onChange={(e) => setRateEdits({ ...rateEdits, [room.id]: e.target.value })}
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#d4af37]"
                            placeholder="e.g. 50000"
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 block">Default public rate per night</span>
                      </div>

                      {/* 2. Promo Price Input */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                            <Flame size={12} className="text-emerald-400" />
                            <span>Promo Price (₦)</span>
                          </label>
                          <span className="text-[10px] text-gray-400 font-mono">Optional</span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400">
                            ₦
                          </span>
                          <input
                            type="number"
                            step="1000"
                            min="0"
                            value={currentPromo}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPromoPriceEdits({ ...promoPriceEdits, [room.id]: val });
                              if (val && Number(val) > 0 && Number(val) < Number(currentPrice)) {
                                setPromoActiveEdits({ ...promoActiveEdits, [room.id]: true });
                              } else if (!val) {
                                setPromoActiveEdits({ ...promoActiveEdits, [room.id]: false });
                              }
                            }}
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-black/60 border border-emerald-500/40 text-emerald-200 font-mono text-sm focus:outline-none focus:border-emerald-400 placeholder-gray-600"
                            placeholder="e.g. 42000 (Discounted)"
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 block">Lower rate for promotions &amp; deals</span>
                      </div>

                    </div>

                    {/* Promo Status Pill & Toggle Checkbox */}
                    {isValidDiscount ? (
                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          <div>
                            <p className="text-xs font-bold text-emerald-300 font-mono">
                              Save ₦{savingsNaira.toLocaleString()} per night ({discountPct}% OFF)
                            </p>
                            <p className="text-[10px] text-gray-400">
                              Guest pays <strong>₦{numPromo.toLocaleString()}</strong> instead of <s>₦{numBase.toLocaleString()}</s>
                            </p>
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto bg-black/50 px-2.5 py-1.5 rounded-lg border border-emerald-500/30">
                          <input
                            type="checkbox"
                            checked={Boolean(isPromoToggled)}
                            onChange={(e) => setPromoActiveEdits({ ...promoActiveEdits, [room.id]: e.target.checked })}
                            className="rounded accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="text-[11px] font-bold text-emerald-300">
                            {isPromoToggled ? 'Promo Enabled' : 'Disabled (Paused)'}
                          </span>
                        </label>
                      </div>
                    ) : numPromo && numPromo >= numBase ? (
                      <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
                        <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
                        <span>Promo price (₦{numPromo.toLocaleString()}) must be lower than standard rate (₦{numBase.toLocaleString()}).</span>
                      </div>
                    ) : null}

                    {/* Action Buttons: Save & Clear */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[11px] text-gray-400">
                        {isPromoActiveCurrently ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            <span>Promo is currently live on website</span>
                          </span>
                        ) : (
                          <span className="text-gray-500">Standard rate active</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {(currentPromo || isPromoActiveCurrently) && (
                          <button
                            type="button"
                            onClick={() => handleClearPromoRate(room.id)}
                            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-red-300 text-xs font-semibold border border-white/10 transition-all cursor-pointer"
                            title="Remove promo price and revert to standard rate"
                          >
                            Clear Promo
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSaveRate(room.id)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] hover:brightness-105 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#d4af37]/20 transition-all cursor-pointer"
                        >
                          <Save size={13} className="text-black stroke-[2.5]" />
                          <span>Update Suite &amp; Promo</span>
                        </button>
                      </div>
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
                    Dining & Drinks Menu Manager
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
                  { id: 'rice', label: 'Rice & Pasta' },
                  { id: 'soups', label: 'Traditional Soups' },
                  { id: 'swallow', label: 'Swallow (Garri & Semo)' },
                  { id: 'proteins', label: 'Proteins' },
                  { id: 'continental', label: 'Continental' },
                  { id: 'spirits', label: 'Cognac & Whiskey' },
                  { id: 'wines', label: 'Fine Wines & Champagne' },
                  { id: 'beers', label: 'Beers (₦2,000)' },
                  { id: 'softdrinks', label: 'Soft Drinks & Malts' },
                  { id: 'energy', label: 'Energy Drinks' },
                  { id: 'juices', label: 'Juices & Dairy' },
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
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-center gap-3 min-w-0">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover border border-[#d4af37]/40 flex-shrink-0"
                              />
                            )}
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] block truncate">
                                {item.categoryLabel}
                              </span>
                              <h4 className="font-bold text-sm text-white truncate">
                                {item.name}
                              </h4>
                              {item.requiresProtein && (
                                <span className="text-[9px] font-mono text-amber-300 block">
                                  ⚠️ Pairs with Protein
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
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

                      {/* Price & Promo Edit Controls */}
                      <div className="pt-2.5 border-t border-white/10 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-gray-400 block mb-0.5">Price (₦)</label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#d4af37]">
                                ₦
                              </span>
                              <input
                                type="number"
                                step="500"
                                min="0"
                                value={currentPrice}
                                onChange={(e) => setDiningEdits({ ...diningEdits, [item.id]: e.target.value })}
                                className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#d4af37]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-emerald-400 block mb-0.5">Promo (₦)</label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400">
                                ₦
                              </span>
                              <input
                                type="number"
                                step="500"
                                min="0"
                                placeholder="Optional"
                                value={diningPromoEdits[item.id] !== undefined ? diningPromoEdits[item.id] : (item.promoPrice || '')}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setDiningPromoEdits({ ...diningPromoEdits, [item.id]: val });
                                  if (val && Number(val) > 0 && Number(val) < Number(currentPrice)) {
                                    setDiningPromoActiveEdits({ ...diningPromoActiveEdits, [item.id]: true });
                                  } else if (!val) {
                                    setDiningPromoActiveEdits({ ...diningPromoActiveEdits, [item.id]: false });
                                  }
                                }}
                                className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-black/60 border border-emerald-500/30 text-emerald-200 font-mono text-xs focus:outline-none focus:border-emerald-400 placeholder-gray-600"
                              />
                            </div>
                          </div>
                        </div>

                        {item.isPromoActive && item.promoPrice && (
                          <div className="px-2 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-[10px] text-emerald-300 font-mono">
                            <span>🔥 Promo: ₦{Number(item.promoPrice).toLocaleString()}</span>
                            <span>(-{item.discountPercent}%)</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-1 pt-1">
                          {(item.promoPrice || item.isPromoActive) && (
                            <button
                              type="button"
                              onClick={() => handleClearDiningPromo(item.id)}
                              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] border border-white/10"
                            >
                              Clear
                            </button>
                          )}
                          <button
                            onClick={() => handleSaveMenuItemPrice(item.id)}
                            className="flex-1 py-1.5 rounded-xl bg-[#5c0725] hover:bg-[#770a31] text-[#f3e5ab] text-[11px] font-semibold border border-[#d4af37]/40 flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Save size={12} />
                            <span>Save Price &amp; Promo</span>
                          </button>
                        </div>
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

            {/* Paystack Gateway Configuration & Staging / Production Switcher */}
            <div className="p-5 rounded-2xl bg-[#0f1712] border border-emerald-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-cinzel font-bold text-sm text-white">Paystack Payment Gateway</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${adminPaystackStatus.badgeClass}`}>
                        {adminPaystackStatus.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Configure your Paystack Public Key for online room reservations and guest deposits.
                    </p>
                  </div>
                </div>

                <a
                  href="https://dashboard.paystack.com/#/settings/developer"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
                >
                  <span>Paystack Dashboard</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Key Input & Environment Switch */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end pt-2 border-t border-emerald-500/20">
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-gray-300">
                    Active Paystack Public Key (Client Checkout)
                  </label>
                  <input
                    type="text"
                    value={adminPaystackKey}
                    onChange={(e) => setAdminPaystackKey(e.target.value)}
                    placeholder="pk_test_... (Staging) or pk_live_... (Production)"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAdminSavePaystackKey}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
                  >
                    <Check size={14} />
                    <span>{paystackSaveSuccess ? 'Saved!' : 'Save Gateway Key'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminPaystackKey('');
                      setPaystackPublicKey('');
                      setAdminPaystackStatus(getPaystackMode());
                      setFeedbackMsg('Paystack key cleared. Reverted to .env default.');
                      setTimeout(() => setFeedbackMsg(''), 3000);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-xs font-medium"
                    title="Clear key and reset to .env default"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Deployment Guide Banner */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-300 space-y-1">
                <div className="font-bold text-[#f3e5ab] flex items-center gap-1.5">
                  <Sparkles size={12} className="text-[#d4af37]" />
                  <span>Staging to Production Guide:</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  • <strong>Current Testing Phase:</strong> Use your personal Paystack Test Key (<code className="text-sky-300">pk_test_...</code>) to test payments with Paystack test cards (<code className="text-white">4084 0840 8408 4084</code>, CVV <code className="text-white">408</code>, PIN <code className="text-white">3310</code>).
                </p>
                <p className="text-gray-400 leading-relaxed">
                  • <strong>Moving to Production Domain:</strong> Replace with the client's Live Key (<code className="text-emerald-300">pk_live_...</code>). In Vercel, simply add <code className="text-[#d4af37]">VITE_PAYSTACK_PUBLIC_KEY</code> in Project Settings &gt; Environment Variables.
                </p>
              </div>
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
                    <th className="py-3 px-4 text-center">Proof Slip</th>
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
                        {/* Proof Slip */}
                        <td className="py-3.5 px-4 text-center">
                          {b.proofOfPaymentImage ? (
                            <button
                              type="button"
                              onClick={() => setSelectedProofBooking(b)}
                              className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                              title="Inspect uploaded payment slip"
                            >
                              <ImageIcon size={12} />
                              <span>View Slip</span>
                            </button>
                          ) : b.proofOfPayment ? (
                            <span className="text-[10px] text-gray-300 font-mono truncate max-w-[110px] block" title={b.proofOfPayment}>
                              {b.proofOfPayment}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-600 font-mono">None</span>
                          )}
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
        {/* 6. TAB CONTENT: FRONT DESK & ACCOUNTANT STAFF CREDENTIALS */}
        {/* ======================================================== */}
        {activeTab === 'receptionist' && (() => {
          const currentSecretSlug = 
            selectedStaffDesk === 'Main Building' ? SECURE_PORTAL_ROUTES.MAIN_RECEPTION_LOGIN :
            selectedStaffDesk === 'Extension Building' ? SECURE_PORTAL_ROUTES.EXTENSION_RECEPTION_LOGIN :
            selectedStaffDesk === 'Accountant Office' ? SECURE_PORTAL_ROUTES.ACCOUNTANT_LOGIN :
            SECURE_PORTAL_ROUTES.ADMIN_LOGIN;

          return (
            <div className="max-w-3xl space-y-6">
              
              <div className="p-6 rounded-2xl bg-[#16030c] border border-[#d4af37]/40 shadow-xl space-y-5">
                
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <UserCheck size={18} className="text-[#d4af37]" />
                      <h3 className="font-cinzel font-bold text-lg text-white">
                        Staff Credentials & Secret Entrance Gates
                      </h3>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Centralized hotel authentication authority. Manage secret entrance links, passwords, and 2-step financial security PINs.
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                    4 Isolated Terminals
                  </span>
                </div>

                {/* Exclusive Authority Banner */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                  <ShieldAlert size={16} className="text-amber-400 flex-shrink-0" />
                  <span>
                    <strong>Exclusive Administrative Authority:</strong> Front desk staff and accountants cannot change their credentials. Only Super Admin in this command center can issue, reset, or alter passwords and financial PINs.
                  </span>
                </div>

                {/* 4 Terminals Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-black/60 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleSelectStaffDesk('Main Building')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-0.5 text-center ${
                      selectedStaffDesk === 'Main Building'
                        ? 'bg-gradient-to-r from-[#5c0725] to-[#7a0a32] text-[#f3e5ab] border border-[#d4af37]/60 shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold">Main Desk</span>
                    <span className="text-[10px] opacity-80 font-mono">600 Wing (20 Rms)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectStaffDesk('Extension Building')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-0.5 text-center ${
                      selectedStaffDesk === 'Extension Building'
                        ? 'bg-gradient-to-r from-[#1e1b4b] to-[#312e81] text-sky-200 border border-sky-400/50 shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold">Extension Desk</span>
                    <span className="text-[10px] opacity-80 font-mono">100 Wing (14 Rms)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectStaffDesk('Accountant Office')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-0.5 text-center ${
                      selectedStaffDesk === 'Accountant Office'
                        ? 'bg-gradient-to-r from-emerald-950 to-emerald-900 text-emerald-200 border border-emerald-400/50 shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold">Accountant Vault</span>
                    <span className="text-[10px] opacity-80 font-mono">2-Step PIN Protected</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectStaffDesk('Admin Core')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-0.5 text-center ${
                      selectedStaffDesk === 'Admin Core'
                        ? 'bg-gradient-to-r from-[#854d0e] to-[#a16207] text-amber-100 border border-amber-300/60 shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold">Admin Core</span>
                    <span className="text-[10px] opacity-80 font-mono">Executive GM Master</span>
                  </button>
                </div>

                {/* Current Active Credentials & Secret Link Info Box */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#f3e5ab] uppercase tracking-wider block">
                      Active Credentials for {
                        selectedStaffDesk === 'Accountant Office'
                          ? 'Chief Accountant Vault'
                          : selectedStaffDesk === 'Admin Core'
                            ? 'Executive GM Core'
                            : selectedStaffDesk === 'Main Building'
                              ? 'Main Desk (600 Wing)'
                              : 'Extension Desk (100 Wing)'
                      }:
                    </span>
                    <span className="text-[10px] text-[#d4af37] font-semibold uppercase tracking-wider">
                      {selectedStaffDesk === 'Accountant Office'
                        ? 'Financial Audit & 2-Step Gate'
                        : selectedStaffDesk === 'Admin Core'
                          ? 'Full Hotel Administration'
                          : `${selectedStaffDesk} Desk`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-gray-300">
                    <div>
                      <span className="text-gray-500">Staff Label: </span>
                      <span className="text-white font-medium">{receptionUser?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Username / Email: </span>
                      <span className="font-mono text-white font-semibold">{receptionUser?.username}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Master Password: </span>
                      <span className="font-mono text-[#f3e5ab] font-semibold">{receptionUser?.password}</span>
                    </div>
                    {selectedStaffDesk === 'Accountant Office' && (
                      <>
                        <div>
                          <span className="text-gray-500">Phone OTP Email: </span>
                          <span className="font-mono text-amber-300 font-semibold">{receptionUser?.otpEmail || receptionUser?.username}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Emergency Backup PIN: </span>
                          <span className="font-mono text-emerald-400 font-bold tracking-widest">{receptionUser?.securityPin || '742918'}</span>
                        </div>
                      </>
                    )}
                    {selectedStaffDesk === 'Admin Core' && (
                      <div>
                        <span className="text-gray-500">CEO OTP Delivery: </span>
                        <span className="font-mono text-emerald-400 font-semibold">{receptionUser?.otpEmail || receptionUser?.username}</span>
                      </div>
                    )}
                  </div>

                  {/* Secret Entrance Link Box with 1-Click Copy */}
                  <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                        Confidential Entrance Link (Secret Slug):
                      </div>
                      <div className="font-mono text-xs text-[#f3e5ab] break-all">
                        /{currentSecretSlug}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopySecretLink(currentSecretSlug)}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#d4af37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex-shrink-0"
                    >
                      {copiedSlug === currentSecretSlug ? (
                        <>
                          <Check size={14} className="text-emerald-950 font-bold" />
                          <span>Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Secret Entrance Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Edit Credentials Form */}
                <form onSubmit={handleSaveReceptionCredentials} className="space-y-4 text-xs">
                  
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-medium">
                      Staff Title / Display Label
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief Hotel Accountant"
                      value={receptionForm.name}
                      onChange={(e) => setReceptionForm({ ...receptionForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-medium">
                      {selectedStaffDesk === 'Admin Core'
                        ? 'CEO / Admin Personal Email (Login & OTP Destination) *'
                        : 'Login Username / Staff Email *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={selectedStaffDesk === 'Admin Core' ? 'e.g. yourname@gmail.com' : 'e.g. accountant@arabsignature.com'}
                      value={receptionForm.username}
                      onChange={(e) => setReceptionForm({ ...receptionForm, username: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  {/* Phone Email Inbox for Accountant OTP */}
                  {selectedStaffDesk === 'Accountant Office' && (
                    <div className="space-y-1.5 p-3 rounded-xl bg-amber-950/25 border border-[#d4af37]/30">
                      <label className="text-[#f3e5ab] font-medium block">
                        Accountant Phone Email Inbox (Receives 6-Digit OTP via Resend)
                      </label>
                      <input
                        type="email"
                        placeholder="Enter Accountant's Gmail / Yahoo on his phone"
                        value={receptionForm.otpEmail || ''}
                        onChange={(e) => setReceptionForm({ ...receptionForm, otpEmail: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-[#d4af37]/40 text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#d4af37]"
                      />
                      <p className="text-[10px] text-gray-400">
                        Because Resend sends emails from <strong className="text-gray-200">security@arabsignature.com</strong>, enter the email address logged into the Accountant's phone (e.g. his Gmail) so he receives his 6-digit login OTP immediately.
                      </p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-medium">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showReceptionPass ? 'text' : 'password'}
                        required
                        placeholder="Enter new master password"
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
                  </div>

                  {/* 6-Digit Financial Security PIN (Accountant Only) */}
                  {selectedStaffDesk === 'Accountant Office' && (
                    <div className="space-y-1.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                      <div className="flex items-center justify-between">
                        <label className="text-emerald-300 font-medium flex items-center gap-1.5">
                          <KeyRound size={14} className="text-emerald-400" />
                          <span>6-Digit Financial Security PIN *</span>
                        </label>
                        <span className="text-[10px] text-gray-400 font-mono">Mandatory 2FA</span>
                      </div>
                      <div className="relative">
                        <input
                          type={showPinField ? 'text' : 'password'}
                          required
                          maxLength={6}
                          pattern="[0-9]{6}"
                          inputMode="numeric"
                          placeholder="• • • • • •"
                          value={receptionForm.securityPin}
                          onChange={(e) => setReceptionForm({ ...receptionForm, securityPin: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) })}
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-black/60 border border-emerald-500/40 text-emerald-200 placeholder-gray-500 font-mono text-center tracking-widest font-bold focus:outline-none focus:border-emerald-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPinField(!showPinField)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPinField ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        The accountant must enter this 6-digit PIN on every login attempt after password validation.
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={15} />
                      <span>
                        Save {selectedStaffDesk === 'Accountant Office' ? 'Accountant Vault' : selectedStaffDesk === 'Admin Core' ? 'Executive Admin' : selectedStaffDesk === 'Main Building' ? 'Main Desk' : 'Extension Desk'} Credentials
                      </span>
                    </button>
                  </div>

                </form>

              </div>

            </div>
          );
        })()}

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
                              : attempt.targetRole === 'accountant'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                : 'bg-white/10 text-gray-300'
                          }`}>
                            {attempt.targetRole === 'admin'
                              ? 'Admin Portal'
                              : attempt.targetRole === 'accountant'
                                ? 'Accountant Portal'
                                : 'Reception Portal'}
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

        {/* ======================================================== */}
        {/* 10. TAB CONTENT: FRONT DESK INTERCOM AUDIT (30-DAY ARCHIVE) */}
        {/* ======================================================== */}
        {activeTab === 'chat' && (() => {
          const filteredMessages = chatMessages.filter(msg => {
            const matchesFilter = 
              chatFilter === 'all' || 
              (chatFilter === 'Main Building' && msg.senderBuilding === 'Main Building' && msg.senderRole === 'reception') ||
              (chatFilter === 'Extension Building' && msg.senderBuilding === 'Extension Building' && msg.senderRole === 'reception') ||
              (chatFilter === 'admin' && (msg.senderRole === 'admin' || msg.senderBuilding === 'all'));

            const matchesSearch = 
              !chatSearch || 
              msg.text.toLowerCase().includes(chatSearch.toLowerCase()) ||
              msg.senderName.toLowerCase().includes(chatSearch.toLowerCase());

            return matchesFilter && matchesSearch;
          });

          return (
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#16030c] border border-white/10 shadow-xl">
                <div>
                  <div className="flex items-center gap-2.5">
                    <MessageSquare size={20} className="text-[#d4af37]" />
                    <h3 className="font-cinzel font-bold text-lg text-white">
                      Executive Front Desk Intercom Audit (30-Day Archive)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Tamper-evident 30-day operational communications audit between <strong>Main Building Desk (600 Wing)</strong> and <strong>Extension Wing Desk (100 Wing)</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold">
                    30-Day Retention Active
                  </span>
                  <button
                    onClick={refreshData}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                    title="Refresh Chat Logs"
                  >
                    <RefreshCw size={15} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to clear all intercom chat logs? This will erase historical messages across all desks.")) {
                        portalStore.clearChatHistory();
                        refreshData();
                        showToast("Intercom chat history cleared.");
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-medium"
                  >
                    Clear History
                  </button>
                </div>
              </div>

              {/* GM Broadcast Composer */}
              <form onSubmit={handleSendAdminBroadcast} className="p-5 rounded-2xl bg-gradient-to-r from-[#2a0e1b] via-[#3a1324] to-[#1a0710] border border-[#d4af37]/40 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#f3e5ab] uppercase tracking-wider">
                  <Sparkles size={14} className="text-[#d4af37]" />
                  <span>Transmit Official Executive GM Broadcast to Both Reception Desks</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Type official GM instruction or alert (e.g. VIP delegation arriving at 4 PM, prepare suites 601 and 107)..."
                    value={adminBroadcastText}
                    onChange={(e) => setAdminBroadcastText(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-400 text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    <Sparkles size={14} />
                    <span>Broadcast Notice</span>
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">
                  Broadcasts appear prominently in golden banners on both Main Building and Extension Wing terminals in real time.
                </p>
              </form>

              {/* Filter and Search Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#16030c] border border-white/10">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-gray-400 mr-1 text-[11px]">Filter Channel:</span>
                  {[
                    { id: 'all', label: `All (${chatMessages.length})` },
                    { id: 'Main Building', label: 'Main Desk (600 Wing)' },
                    { id: 'Extension Building', label: 'Extension Desk (100 Wing)' },
                    { id: 'admin', label: 'GM Broadcasts' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setChatFilter(f.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        chatFilter === f.id
                          ? 'bg-[#5c0725] text-[#f3e5ab] border border-[#d4af37]/60 font-semibold shadow-sm'
                          : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="relative sm:w-64">
                  <input
                    type="text"
                    placeholder="Search chat text or sender..."
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Messages Audit Feed Table */}
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#16030c] shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#120208] text-gray-400 uppercase tracking-wider border-b border-white/10 text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Origin / Wing</th>
                      <th className="py-3 px-4">Staff Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Message Content</th>
                      <th className="py-3 px-4 text-right">Age</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredMessages.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">
                          No intercom messages found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredMessages.map((msg) => {
                        const isMain = msg.senderBuilding === 'Main Building';
                        const isExt = msg.senderBuilding === 'Extension Building';
                        const isAdmin = msg.senderRole === 'admin' || msg.senderBuilding === 'all';
                        const ageHours = Math.round((Date.now() - (msg.createdAt || Date.now())) / 3600000);

                        return (
                          <tr key={msg.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4 font-mono text-gray-300">
                              <div>{msg.timestamp}</div>
                              <div className="text-[10px] text-gray-500">{msg.dateFormatted || 'Recent'}</div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                isAdmin
                                  ? 'bg-[#d4af37]/20 border-[#d4af37]/50 text-[#f3e5ab]'
                                  : isMain
                                  ? 'bg-[#5c0725]/50 border-[#d4af37]/30 text-[#f3e5ab]'
                                  : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
                              }`}>
                                {isAdmin ? 'GM Executive' : isMain ? 'Main Desk (600)' : 'Ext Desk (100)'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-white font-medium">
                              {msg.senderName}
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="capitalize text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                                {msg.category || 'General'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-gray-200 max-w-md">
                              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </td>

                            <td className="py-3.5 px-4 text-right font-mono text-gray-400 text-[10px]">
                              {ageHours <= 0 ? 'Just now' : `${ageHours}h ago`}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          );
        })()}

        {/* Admin Operational Platform Footer Credit */}
        <footer className="mt-12 pt-6 pb-2 border-t border-white/10 text-center text-[11px] text-gray-500 space-y-1">
          <div>Arab Signature Hotel & Suites • Executive Operations Management System</div>
          <div>Hospitality Software Infrastructure • Built by <a href="https://kinggold-one.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:text-[#f3e5ab] font-semibold underline underline-offset-2 transition-colors">Microbase</a></div>
        </footer>

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
                    <option value="rice">Rice, Pasta & Sides</option>
                    <option value="soups">Traditional Soups</option>
                    <option value="swallow">Swallow (Garri & Semo)</option>
                    <option value="proteins">Proteins & Pepper Soup</option>
                    <option value="continental">Continental & Breakfast</option>
                    <option value="spirits">Champagne, Cognac & Whiskey</option>
                    <option value="wines">Fine Wines & Sparkling</option>
                    <option value="beers">Beers & Refreshments (₦2,000)</option>
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

      {/* Proof of Payment Lightbox Modal */}
      {selectedProofBooking && (
        <ProofOfPaymentModal
          booking={selectedProofBooking}
          onClose={() => setSelectedProofBooking(null)}
          isAdminView={true}
          onConfirmPayment={(id) => handleConfirmPaymentBackend(id)}
        />
      )}

    </div>
  );
}
