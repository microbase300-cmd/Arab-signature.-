import React, { useState, useEffect } from 'react';
import { portalStore } from '../data/portalStore';
import { 
  Building2, BedDouble, Calendar, User, Phone, CheckCircle2, Clock, 
  Search, Filter, Plus, Printer, MessageSquare, LogOut, ArrowLeft, ArrowRight, 
  Sparkles, RefreshCw, Key, ShieldCheck, Check, AlertCircle, X, ChevronRight,
  TrendingUp, DoorOpen, Sparkle, Utensils, Lock, Wine, Bell, BellRing, Eye, Volume2, VolumeX,
  Copy, Receipt, CreditCard, MapPin, Heart, Image as ImageIcon, Upload, Trash2, Download,
  XCircle, Send
} from 'lucide-react';
import { compressImage, formatFileSize } from '../utils/imageCompressor';
import ProofOfPaymentModal from '../components/ProofOfPaymentModal';
import CounterCheckInModal from '../components/CounterCheckInModal';
import { emailService } from '../utils/emailService';
import { printFolioReceipt, openWhatsAppReceipt } from '../utils/printFolio';
import { 
  generateReceiptImageBlob, 
  downloadReceiptImageBlob, 
  shareReceiptImageToWhatsApp 
} from '../utils/receiptImageGenerator';
import { 
  playLoudReservationAlert, 
  playLoudDiningOrderAlert, 
  playIntercomPing, 
  testLoudAlert, 
  initAudioUnlocker 
} from '../utils/hotelSoundAlerts';

export default function ReceptionPortal({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rates, setRates] = useState([]);
  const [diningMenu, setDiningMenu] = useState([]);
  const [diningOrders, setDiningOrders] = useState([]);
  const [diningOrderFilter, setDiningOrderFilter] = useState('all'); // 'all' | 'room_unpaid' | 'food' | 'drinks'
  const [counterChargeRoom, setCounterChargeRoom] = useState('');
  const [isDiningMenuOpen, setIsDiningMenuOpen] = useState(false);
  const [diningSearchQuery, setDiningSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'ledger' | 'dining_orders' | 'chat'
  const [copiedGeneratedCode, setCopiedGeneratedCode] = useState(false);
  const [returningPatronHint, setReturningPatronHint] = useState(null);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const activeTabRef = React.useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
    if (activeTab === 'chat') {
      setUnreadChatCount(0);
    }
  }, [activeTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState(null);
  const [selectedProofBooking, setSelectedProofBooking] = useState(null);
  const [isCompressingProof, setIsCompressingProof] = useState(false);
  const [incomingDiningAlert, setIncomingDiningAlert] = useState(null);
  const [inspectedDiningOrder, setInspectedDiningOrder] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Flash feedback toast (hoisted for early lifecycle & subscription access)
  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // Front Desk Order Code Lookup & Instant Handover Confirmation
  const [orderCodeInput, setOrderCodeInput] = useState('');
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [orderLookupError, setOrderLookupError] = useState('');
  const [isOrderLookupModalOpen, setIsOrderLookupModalOpen] = useState(false);

  // Front Desk Counter Check-In & Booking Code Verification Modal
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [checkInInitialCode, setCheckInInitialCode] = useState('');

  // Formal Reservation Cancellation Request Modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReasonInput, setCancelReasonInput] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  // Reservation Code Check-In Verification State
  const [isCheckInCodeModalOpen, setIsCheckInCodeModalOpen] = useState(false);
  const [checkInTargetRoom, setCheckInTargetRoom] = useState(null);
  const [checkInReservationCodeInput, setCheckInReservationCodeInput] = useState('');
  const [checkInVerifiedBooking, setCheckInVerifiedBooking] = useState(null);
  const [checkInCodeError, setCheckInCodeError] = useState('');
  const [isNameCrossChecked, setIsNameCrossChecked] = useState(false);

  // Early Stay Termination (CEO & Chief Accountant Authorization) State
  const [isEarlyTerminationModalOpen, setIsEarlyTerminationModalOpen] = useState(false);
  const [earlyTerminationTarget, setEarlyTerminationTarget] = useState(null);
  const [earlyTerminationReasonInput, setEarlyTerminationReasonInput] = useState('');
  const [isSubmittingEarlyTermination, setIsSubmittingEarlyTermination] = useState(false);

  // Front Desk Intercom Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatCategory, setChatCategory] = useState('general'); // 'general' | 'handover' | 'inquiry' | 'urgent'
  const chatMessagesEndRef = React.useRef(null);

  // Incoming Real-Time Reservation Alert & Sound State
  const [incomingAlert, setIncomingAlert] = useState(null);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const isMutedRef = React.useRef(isSoundMuted);
  useEffect(() => {
    isMutedRef.current = isSoundMuted;
  }, [isSoundMuted]);

  // Front Desk High-Impact Concierge Bell & Reservation Alert (Cuts through lobby ambient noise)
  const playReceptionDeskBeep = () => {
    if (isMutedRef.current) return;
    playLoudReservationAlert();
  };

  // Front Desk Two-Way Radio Intercom Chime (Pleasant 2-Tone Hotel Walkie / Concierge Ping)
  const playIntercomChime = () => {
    if (isMutedRef.current) return;
    playIntercomPing();
  };

  // Walk-in / Counter Booking form state (includes live Booking Code Generator)
  const [walkInForm, setWalkInForm] = useState({
    generatedCode: '',
    bookingMode: 'Checked In', // 'Checked In' (Immediate Room Key) | 'Confirmed' (Counter Reservation Hold)
    guestName: '',
    phone: '',
    email: '',
    roomType: 'deluxe',
    roomNumber: '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    nights: 1,
    paymentMethod: 'POS Terminal (Front Desk)',
    amount: 35000
  });

  // Building Filter: 'all' | 'Main Building' | 'Extension Building'
  const [selectedBuilding, setSelectedBuilding] = useState('all');

  // Ledger Building Filter: 'all' | 'Main Building' | 'Extension Building'
  const [ledgerBuildingFilter, setLedgerBuildingFilter] = useState('all');

  // Current live time
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Refresh data from portalStore
  const refreshData = () => {
    setRooms(portalStore.getRooms());
    setBookings(portalStore.getBookings());
    setRates(portalStore.getRoomRates());
    setDiningMenu(portalStore.getDiningMenu());
    setDiningOrders(portalStore.getDiningOrders());
    setChatMessages(portalStore.getChatMessages('reception'));
  };

  // Resolve receptionist's designated building with strict fallback:
  // For receptionist roles, default is ALWAYS 'Main Building' unless explicitly Extension
  const getDeskBuilding = () => {
    const user = currentUser || portalStore.getCurrentUser();
    if (user?.role === 'admin') return 'all';
    const access = user?.buildingAccess;
    if (access === 'Extension Building') return 'Extension Building';
    if (access === 'Main Building') return 'Main Building';
    const uName = (user?.username || '').toLowerCase();
    if (uName.includes('ext') || uName.includes('100')) return 'Extension Building';
    return 'Main Building';
  };

  // Helper to determine if current logged-in receptionist is assigned to this building
  const isMyBuilding = (bldgName) => {
    const desk = getDeskBuilding();
    if (desk === 'all') return true;
    return desk === bldgName;
  };

  const isDeskRoom = (room) => {
    if (!room) return false;
    const desk = getDeskBuilding();
    if (desk === 'all') return true;
    const roomBldg = room.building || room.floor || (String(room.roomNumber).startsWith('6') ? 'Main Building' : 'Extension Building');
    return roomBldg === desk;
  };

  // Helper to determine which building a booking belongs to
  const getBookingBuilding = (b) => {
    if (!b) return 'Main Building';
    if (b.roomNumber) {
      const r = (rooms || []).find(room => room && String(room.roomNumber) === String(b.roomNumber));
      if (r?.building) return r.building;
      if (String(b.roomNumber).startsWith('6')) return 'Main Building';
      if (String(b.roomNumber).startsWith('1')) return 'Extension Building';
    }
    if (b.roomName) {
      const rn = String(b.roomName).toLowerCase();
      if (rn.includes('extension') || rn.includes('diplomatic')) return 'Extension Building';
      if (rn.includes('main')) return 'Main Building';
    }
    return 'Main Building';
  };

  const isDeskBooking = (b) => {
    if (!b) return false;
    const desk = getDeskBuilding();
    if (desk === 'all') return true;
    return getBookingBuilding(b) === desk;
  };

  // Helper to determine if an order was placed outside of guest rooms (Restaurant, VIP Lounge, Cabana, Takeout)
  const isOutsideRoomOrder = (ord) => {
    if (!ord) return false;
    return Boolean(
      ord.isOutsideRoom ||
      !ord.isLodgeGuest ||
      !ord.roomNumber ||
      !ord.bookingId ||
      ['dining hall', 'restaurant', 'vip executive bar', 'poolside', 'cabana', 'takeout', 'pickup', 'front desk counter order'].some(spot =>
        String(ord.serviceLocation || '').toLowerCase().includes(spot)
      )
    );
  };

  // Receptionist Desk Assignment for Dining Orders:
  // Every food and drinks order outside room MUST be seen by the receptionist of the Main Building!
  const isDeskDiningOrder = (ord) => {
    if (!ord) return false;
    const desk = getDeskBuilding();
    if (desk === 'all') return true;

    // All outside-room orders belong to the Main Building front desk terminal
    if (isOutsideRoomOrder(ord)) {
      return desk === 'Main Building';
    }

    // In-room orders follow room wing assignment
    const rNum = String(ord.roomNumber || '');
    if (rNum.startsWith('6')) return desk === 'Main Building';
    if (rNum.startsWith('1')) return desk === 'Extension Building';
    if (ord.building === 'Extension Building') return desk === 'Extension Building';
    return desk === 'Main Building';
  };

  const generateCounterBookingCode = (roomNumber, roomType) => {
    const desk = getDeskBuilding();
    const inferredBuilding = roomNumber
      ? (String(roomNumber).startsWith('1') ? 'Extension Building' : 'Main Building')
      : (desk === 'Extension Building' ? 'Extension Building' : 'Main Building');
    return portalStore.generateUniqueBookingCode({
      building: inferredBuilding,
      roomNumber,
      roomType
    });
  };

  const handleOpenNewWalkIn = (preselectedRoom = null) => {
    const desk = getDeskBuilding();
    const deskRooms = rooms.filter(r => isDeskRoom(r));
    const targetRoom = preselectedRoom || deskRooms.find(r => r.status === 'available') || deskRooms[0];
    const initialType = targetRoom?.type || (desk === 'Extension Building' ? 'superior' : 'deluxe');
    const rateObj = rates.find(r => r.id === initialType);
    const price = targetRoom?.price || (rateObj ? rateObj.price : 45000);
    const roomNum = targetRoom?.roomNumber || '';
    const freshCode = generateCounterBookingCode(roomNum, initialType);

    setReturningPatronHint(null);
    setWalkInForm({
      generatedCode: freshCode,
      bookingMode: 'Checked In', // 'Checked In' ("Assign & Check In Now") | 'Reservation Hold' ("Counter Reservation Hold")
      guestName: '',
      phone: '',
      email: '',
      homeAddress: '',
      nextOfKinName: '',
      nextOfKinPhone: '',
      nextOfKinRelationship: 'Spouse',
      roomType: initialType,
      roomNumber: roomNum,
      checkIn: new Date().toISOString().split('T')[0],
      reservationDate: new Date().toISOString().split('T')[0],
      expectedCheckIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      nights: 1,
      paymentMethod: 'POS Terminal (Front Desk)',
      proofOfPayment: '',
      proofOfPaymentImage: '',
      proofImageMeta: null,
      amount: price
    });
    setIsWalkInOpen(true);
  };

  useEffect(() => {
    // 1. Check Auth (Requires Reception or Admin session - auto-binds if accessing direct URL)
    let user = portalStore.getCurrentUser();
    if (!user) {
      try {
        user = portalStore.loginReception('main@arabsignature.com', 'reception2026', 'Main Building');
      } catch (e) {
        user = portalStore.getReceptionistUser('Main Building');
      }
    }
    setCurrentUser(user);
    const desk = user?.role === 'admin' ? 'all' : (user?.buildingAccess === 'Extension Building' || (user?.username || '').toLowerCase().includes('ext') ? 'Extension Building' : 'Main Building');
    setSelectedBuilding(desk);
    refreshData();

    // 1.1 Sync latest room inventory from Cloud
    portalStore.syncRoomsFromCloud().then(() => {
      refreshData();
    });

    // 1.1b Sync latest bookings ledger from Cloud
    portalStore.syncBookingsFromCloud().then(() => {
      refreshData();
    });

    // 1.1c Background sync for multi-device reservations (every 8s)
    const cloudSyncInterval = setInterval(() => {
      portalStore.syncBookingsFromCloud().then(() => {
        refreshData();
      });
    }, 8000);

    // 1.1d Real-Time Server-Sent Events (SSE) stream via ntfy.sh (<100ms instant sync)
    let sseSource = null;
    try {
      if (typeof window !== 'undefined' && window.EventSource) {
        sseSource = new EventSource('https://ntfy.sh/arab-signature-hotel-bookings-sync-v1/sse');
        sseSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && data.event === 'message' && data.message) {
              const newBooking = JSON.parse(data.message);
              if (newBooking && newBooking.id) {
                portalStore.mergeSingleBookingLocally(newBooking);
                refreshData();
                if (!isMutedRef.current) {
                  playLoudReservationAlert();
                }
                setIncomingAlert(newBooking);
              }
            }
          } catch (e) {}
        };
      }
    } catch (e) {}

    // 1.2 Initialize Web Audio Unlocker
    initAudioUnlocker();

    // 2. Digital clock timer
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    // 3. Listen for live incoming bookings across all tabs & devices in real time
    const unsubscribeBookings = portalStore.subscribeBookings((detail) => {
      refreshData();
      if (detail && detail.isNewReservation && detail.newBooking) {
        // Play VERY LOUD multi-harmonic front desk fanfare & brass bell alert!
        if (!isMutedRef.current) {
          playLoudReservationAlert();
        }
        // Display prominent alert banner at top of reception screen
        setIncomingAlert(detail.newBooking);
      }
    });

    const handleLiveSync = () => refreshData();
    window.addEventListener('ash_rates_updated', handleLiveSync);
    window.addEventListener('ash_rooms_updated', handleLiveSync);
    window.addEventListener('ash_menu_updated', handleLiveSync);
    const unsubscribeRooms = portalStore.subscribeRooms(() => refreshData());
    const unsubscribeDining = portalStore.subscribeDiningMenu(() => refreshData());
    const unsubscribeDiningOrders = portalStore.subscribeDiningOrders((detail) => {
      refreshData();
      if (detail?.isNewOrder && detail?.newOrder) {
        const o = detail.newOrder;
        const currentDesk = getDeskBuilding();

        // Main Reception receives the VERY LOUD sound alert for ALL food and drink orders!
        if (currentDesk === 'Main Building' || currentDesk === 'all') {
          if (!isMutedRef.current) {
            playLoudDiningOrderAlert();
          }
          setIncomingDiningAlert(o);
        } else {
          // Extension Building Reception receives loud sound if order is for Extension wing
          if (isDeskDiningOrder(o)) {
            if (!isMutedRef.current) {
              playLoudDiningOrderAlert();
            }
            setIncomingDiningAlert(o);
          } else {
            if (!isMutedRef.current) {
              playIntercomPing();
            }
          }
        }

        showToast(
          o.chargeToRoom
            ? `🍽️ Room Bill Order ${o.id} (₦${Number(o.amount).toLocaleString()}) added to Suite #${o.roomNumber}!`
            : `🔔 New Food/Drink Order ${o.id} (${o.guestName} • ${o.serviceLocation}) received at Front Desk!`
        );
      }
    });
    // 4. Live Chat Intercom Subscription & Real-Time Cloud Heartbeat
    let lastSeenCount = portalStore.getChatMessages('reception').length;
    let lastSeenId = (portalStore.getChatMessages('reception').slice(-1)[0]?.id) || '';

    const handleChatSync = (detail) => {
      const currentMsgs = portalStore.getChatMessages('reception');
      setChatMessages(currentMsgs);
      const latestMsg = detail?.newMessage || currentMsgs.slice(-1)[0];

      if (latestMsg && latestMsg.id !== lastSeenId) {
        lastSeenId = latestMsg.id;
        lastSeenCount = currentMsgs.length;

        const currentDesk = getDeskBuilding();
        const isFromOtherDesk = (latestMsg.senderBuilding !== currentDesk || latestMsg.senderRole !== 'reception');
        if (isFromOtherDesk) {
          playIntercomChime();
          showToast(`Intercom [${latestMsg.senderBadge}]: "${latestMsg.text.substring(0, 35)}..."`);
          if (activeTabRef.current !== 'chat') {
            setUnreadChatCount(prev => prev + 1);
          }
        }
      }
    };

    const unsubscribeChat = portalStore.subscribeChat(handleChatSync);

    // Initial cloud sync on mount
    portalStore.syncChatFromCloud().then(() => {
      handleChatSync();
    });

    // Real-Time Heartbeat: checks every 1500ms for incoming cross-device / cross-browser messages
    const chatHeartbeat = setInterval(async () => {
      await portalStore.syncChatFromCloud().catch(() => {});
      const currentMsgs = portalStore.getChatMessages('reception');
      const latestMsg = currentMsgs.slice(-1)[0];
      const latestId = latestMsg?.id || '';

      if (currentMsgs.length !== lastSeenCount || latestId !== lastSeenId) {
        handleChatSync({ newMessage: latestMsg, allMessages: currentMsgs });
      }
    }, 1500);

    return () => {
      clearInterval(timer);
      clearInterval(cloudSyncInterval);
      if (sseSource) {
        try { sseSource.close(); } catch (e) {}
      }
      unsubscribeBookings();
      window.removeEventListener('ash_rates_updated', handleLiveSync);
      window.removeEventListener('ash_rooms_updated', handleLiveSync);
      window.removeEventListener('ash_menu_updated', handleLiveSync);
      unsubscribeRooms();
      unsubscribeDining();
      unsubscribeDiningOrders();
      clearInterval(chatHeartbeat);
      unsubscribeChat();
    };
  }, []);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (activeTab === 'chat' && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  // Transmit Intercom Message to the other desk
  const handleSendChatMessage = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const desk = getDeskBuilding();
    const deskLabel = desk === 'Main Building' ? 'Main Building Desk (600 Wing)' : 'Extension Wing Desk (100 Wing)';

    portalStore.sendChatMessage({
      text: chatInput,
      category: chatCategory,
      senderBuilding: desk,
      senderName: currentUser?.name || (desk === 'Main Building' ? 'Main Desk Concierge' : 'Extension Desk Concierge'),
      senderRole: 'reception',
      senderBadge: deskLabel
    });

    setChatInput('');
    setChatMessages(portalStore.getChatMessages('reception'));
    showToast('Intercom message transmitted to other front desk.');
  };

  // Dedicated Front Desk Order Code Lookup & Verification
  const handleLookupOrderCode = (e, explicitCode = null) => {
    if (e) e.preventDefault();
    const query = String(explicitCode !== null ? explicitCode : orderCodeInput).trim().toUpperCase();
    if (!query) {
      setOrderLookupError('Please enter a valid order code (e.g. ARB-FDD-XXXXX or ARB-DRK-XXXXX).');
      setVerifiedOrder(null);
      return;
    }

    // Smart Auto-Redirect: If query is a Room Reservation Code, seamlessly route to Counter Check-In!
    const isRoomCode = query.startsWith('ARS-') || query.includes('BGD') || query.includes('EXT') || portalStore.findBookingByCode(query);
    if (isRoomCode) {
      setIsOrderLookupModalOpen(false);
      setCheckInInitialCode(query);
      setIsCheckInModalOpen(true);
      showToast(`Detected Room Reservation Code! Opening Room Check-In Terminal...`);
      return;
    }

    const clean = query.replace(/[^A-Z0-9]/g, '');
    const found = diningOrders.find((o) => {
      const oId = String(o.id || '').toUpperCase();
      return oId === query || oId.replace(/[^A-Z0-9]/g, '') === clean;
    });

    if (found) {
      setVerifiedOrder(found);
      setOrderLookupError('');
      showToast(`Order ${found.id} verified for ${found.guestName}!`);
    } else {
      setVerifiedOrder(null);
      setOrderLookupError(`No order found matching code "${query}". Please check the customer's phone or order receipt.`);
    }
  };

  const handleQuickConfirmOrder = (orderId, newStatus) => {
    portalStore.updateDiningOrderStatus(orderId, newStatus, currentUser?.name || 'Main Receptionist');
    refreshData();
    const freshOrder = portalStore.getDiningOrderByCode(orderId);
    if (freshOrder) {
      setVerifiedOrder(freshOrder);
    }
    showToast(`Order ${orderId} marked ${newStatus.toUpperCase()}!`);
  };

  // Logout handler
  const handleLogout = () => {
    const isExt = currentUser?.buildingAccess === 'Extension Building';
    portalStore.logout();
    onNavigate(isExt ? 'desk-100e-gate' : 'desk-600m-gate');
  };

  // Quick Room Status Toggle (Enforces Building Operational Permissions)
  const handleUpdateRoomStatus = (roomNumber, newStatus, guestName = null) => {
    const targetRoom = rooms.find(r => String(r.roomNumber) === String(roomNumber));
    if (targetRoom && !isDeskRoom(targetRoom)) {
      showToast(`Access Restricted: Room #${roomNumber} is in ${targetRoom.building || 'another wing'}. Only that wing's desk can modify this room.`);
      return;
    }
    portalStore.updateRoomStatus(roomNumber, newStatus, guestName);
    refreshData();
    showToast(`Room ${roomNumber} updated to ${newStatus.toUpperCase()}`);
  };

  // Reservation Cancellation Request Handlers (Dispatches alert to CEO & Accountant for confirmation)
  const handlePromptCancelReservation = (room) => {
    const activeBooking = bookings.find(b => 
      String(b.roomNumber) === String(room.roomNumber) && 
      ['Confirmed', 'Reservation Hold', 'Cancellation Pending'].includes(b.status)
    );
    setCancelTarget({
      bookingId: activeBooking?.id || `ROOM-${room.roomNumber}`,
      roomNumber: room.roomNumber,
      guestName: activeBooking?.guestName || room.currentGuest || 'Reserved Guest',
      amount: activeBooking?.amount || room.price || 0,
      building: room.building || getDeskBuilding(),
      booking: activeBooking
    });
    setCancelReasonInput('');
    setIsCancelModalOpen(true);
  };

  const handlePromptCancelBooking = (booking) => {
    setCancelTarget({
      bookingId: booking.id,
      roomNumber: booking.roomNumber,
      guestName: booking.guestName,
      amount: booking.amount,
      building: getBookingBuilding(booking),
      booking: booking
    });
    setCancelReasonInput('');
    setIsCancelModalOpen(true);
  };

  const handleSubmitCancellationRequest = () => {
    if (!cancelTarget) return;
    setIsSubmittingCancel(true);

    try {
      portalStore.requestReservationCancellation({
        bookingId: cancelTarget.bookingId,
        roomNumber: cancelTarget.roomNumber,
        reason: cancelReasonInput.trim() || 'Customer requested reservation cancellation',
        requestedBy: `${currentUser?.name || 'Front Desk'} (${getDeskBuilding()})`
      });

      setIsSubmittingCancel(false);
      setIsCancelModalOpen(false);
      refreshData();
      showToast(
        `Cancellation request dispatched to CEO & Chief Accountant! Reservation will be cancelled once Accountant confirms.`
      );
    } catch (err) {
      setIsSubmittingCancel(false);
      alert(err.message || 'Could not submit cancellation request.');
    }
  };

  // --- RESERVATION CODE VERIFICATION HANDLERS (CHECK IN ON RESERVED ROOMS) ---
  const handlePromptCheckInReservedRoom = (room) => {
    if (!isDeskRoom(room)) {
      showToast(`Access Restricted: Room #${room.roomNumber} is managed by ${room.building || 'another wing'}.`);
      return;
    }
    setCheckInTargetRoom(room);
    setCheckInReservationCodeInput('');
    setCheckInVerifiedBooking(null);
    setCheckInCodeError('');
    setIsNameCrossChecked(false);
    setIsCheckInCodeModalOpen(true);
  };

  const handlePromptCheckInBooking = (booking) => {
    if (!isDeskBooking(booking)) {
      showToast(`Access Restricted: Booking #${booking.id} belongs to ${getBookingBuilding(booking)}.`);
      return;
    }
    const targetRoom = rooms.find(r => String(r.roomNumber) === String(booking.roomNumber)) || {
      roomNumber: booking.roomNumber,
      type: booking.roomType,
      building: getBookingBuilding(booking)
    };
    setCheckInTargetRoom(targetRoom);
    setCheckInReservationCodeInput(booking.id || '');
    setCheckInVerifiedBooking(booking);
    setCheckInCodeError('');
    setIsNameCrossChecked(false);
    setIsCheckInCodeModalOpen(true);
  };

  const handleVerifyCheckInCode = async () => {
    const code = checkInReservationCodeInput.trim().toUpperCase();
    if (!code) {
      setCheckInCodeError('Please enter the customer reservation code.');
      return;
    }
    setCheckInCodeError('');

    let booking = portalStore.findBookingByCode(code);
    if (!booking) {
      booking = await portalStore.fetchBookingFromCloud(code);
    }

    if (!booking) {
      setCheckInCodeError(`No reservation found matching code "${code}". Please verify code on guest's device.`);
      setCheckInVerifiedBooking(null);
      return;
    }

    // Verify room match if target room is reserved for a specific room
    if (checkInTargetRoom && booking.roomNumber && String(booking.roomNumber) !== String(checkInTargetRoom.roomNumber)) {
      setCheckInCodeError(`Reservation code "${code}" is assigned to Room #${booking.roomNumber}, not Room #${checkInTargetRoom.roomNumber}.`);
      setCheckInVerifiedBooking(null);
      return;
    }

    setCheckInVerifiedBooking(booking);
  };

  const handleExecuteVerifiedCheckIn = () => {
    if (!checkInVerifiedBooking || !checkInTargetRoom) return;

    let rNum = checkInTargetRoom.roomNumber;
    if (!rNum || rNum === 'Unassigned') {
      rNum = checkInVerifiedBooking.roomNumber;
    }
    const guest = checkInVerifiedBooking.guestName || checkInTargetRoom.currentGuest || 'Checked In Guest';

    portalStore.updateRoomStatus(rNum, 'occupied', guest);
    portalStore.updateBookingStatus(checkInVerifiedBooking.id, 'Checked In', rNum);

    refreshData();
    setIsCheckInCodeModalOpen(false);
    setCheckInTargetRoom(null);
    setCheckInVerifiedBooking(null);
    setCheckInReservationCodeInput('');
    setIsNameCrossChecked(false);

    showToast(`Reservation Code Verified! Guest ${guest} Checked In to Room #${rNum}.`);
  };

  // --- EARLY STAY TERMINATION HANDLERS (CEO & ACCOUNTANT CONFIRMATION) ---
  const handlePromptMakeAvailable = (room) => {
    if (!isDeskRoom(room)) {
      showToast(`Access Restricted: Room #${room.roomNumber} is in ${room.building || 'another wing'}. Only that wing's desk can modify this room.`);
      return;
    }

    const stayCheck = portalStore.checkIsStayDurationCompleted(room.roomNumber);

    // If stay duration is NOT completed (e.g. booked for 2 days, and duration is not yet over):
    if (!stayCheck.isCompleted) {
      setEarlyTerminationTarget({
        room,
        stayCheck,
        roomNumber: room.roomNumber,
        guestName: stayCheck.guestName,
        bookingId: stayCheck.bookingId,
        bookedNights: stayCheck.bookedNights,
        elapsedText: stayCheck.elapsedText,
        remainingText: stayCheck.remainingText
      });
      setEarlyTerminationReasonInput('');
      setIsEarlyTerminationModalOpen(true);
      return;
    }

    // Otherwise normal checkout: check dining bills, clear room, mark available
    const activeBooking = stayCheck.booking || bookings.find(b => 
      String(b.roomNumber) === String(room.roomNumber) && 
      ['Checked In', 'Occupied'].includes(b.status)
    );

    if (activeBooking) {
      const folio = portalStore.getBookingFolioSummary(activeBooking);
      if (folio.balanceDue > 0) {
        const confirmSettle = window.confirm(
          `Guest ${activeBooking.guestName} (Suite #${room.roomNumber}) has an unsettled Food/Drink Room Bill of ₦${folio.balanceDue.toLocaleString()}.\n\nClick OK to settle this ₦${folio.balanceDue.toLocaleString()} bill via Counter POS and mark room available.`
        );
        if (!confirmSettle) return;
        portalStore.settleBookingDiningBill(activeBooking.id, 'POS Terminal (Front Desk Check-Out)');
      }
      portalStore.updateBookingStatus(activeBooking.id, 'Completed', room.roomNumber);
    }

    handleUpdateRoomStatus(room.roomNumber, 'available');
  };

  const handleSubmitEarlyTerminationRequest = () => {
    if (!earlyTerminationTarget) return;
    setIsSubmittingEarlyTermination(true);
    const reason = earlyTerminationReasonInput.trim() || 'Client requested early departure before booked duration expired';

    portalStore.requestEarlyCheckoutTermination({
      bookingId: earlyTerminationTarget.bookingId,
      roomNumber: earlyTerminationTarget.roomNumber,
      reason,
      requestedBy: `${currentUser?.name || 'Front Desk'} (${getDeskBuilding()})`
    });

    setIsSubmittingEarlyTermination(false);
    setIsEarlyTerminationModalOpen(false);
    setEarlyTerminationTarget(null);
    setEarlyTerminationReasonInput('');
    refreshData();
    showToast(`Early termination request for Room #${earlyTerminationTarget.roomNumber} dispatched to CEO & Chief Accountant for audit confirmation.`);
  };

  // Check In / Check Out from ledger (Enforces Building Operational Permissions)
  const handleToggleBookingStatus = (booking) => {
    if (!isDeskBooking(booking)) {
      showToast(`Access Restricted: Booking #${booking.id} belongs to ${getBookingBuilding(booking)}. Handled by ${getBookingBuilding(booking)} Desk.`);
      return;
    }

    if (booking.status === 'Confirmed') {
      handlePromptCheckInBooking(booking);
      return;
    } else if (booking.status === 'Checked In') {
      const stayCheck = portalStore.checkIsStayDurationCompleted(booking.roomNumber);
      if (!stayCheck.isCompleted) {
        const targetRoom = rooms.find(r => String(r.roomNumber) === String(booking.roomNumber)) || { roomNumber: booking.roomNumber, building: getBookingBuilding(booking) };
        setEarlyTerminationTarget({
          room: targetRoom,
          stayCheck,
          roomNumber: booking.roomNumber,
          guestName: booking.guestName,
          bookingId: booking.id,
          bookedNights: stayCheck.bookedNights,
          elapsedText: stayCheck.elapsedText,
          remainingText: stayCheck.remainingText
        });
        setEarlyTerminationReasonInput('');
        setIsEarlyTerminationModalOpen(true);
        return;
      }
      const folio = portalStore.getBookingFolioSummary(booking);
      if (folio.balanceDue > 0) {
        const confirmSettle = window.confirm(
          `Guest ${booking.guestName} (Suite #${booking.roomNumber}) has an unsettled Food/Drink Room Bill of ₦${folio.balanceDue.toLocaleString()}.\n\nClick OK to settle this ₦${folio.balanceDue.toLocaleString()} bill via Counter POS and complete Check-Out.`
        );
        if (!confirmSettle) return;
        portalStore.settleBookingDiningBill(booking.id, 'POS Terminal (Front Desk Check-Out)');
      }
      portalStore.updateBookingStatus(booking.id, 'Completed', booking.roomNumber);
      refreshData();
      showToast(`Guest ${booking.guestName} Checked Out & Bill Cleared. Room ${booking.roomNumber} is now AVAILABLE.`);
    }
  };

  const handleSettleBookingRoomBill = (booking) => {
    if (!isDeskBooking(booking)) {
      showToast(`Access Restricted: Managed by ${getBookingBuilding(booking)} Desk.`);
      return;
    }
    const folio = portalStore.getBookingFolioSummary(booking);
    if (folio.balanceDue <= 0) return;
    portalStore.settleBookingDiningBill(booking.id, 'POS Terminal (Front Desk)');
    refreshData();
    showToast(`Settled ₦${folio.balanceDue.toLocaleString()} Food/Drink Room Bill for ${booking.guestName} (${booking.id})!`);
  };

  const handleCounterAddDiningToRoom = (item) => {
    if (!counterChargeRoom) {
      alert('Please select an active occupied/confirmed Guest Suite above to add this item to their bill, or leave as Counter POS Walk-In.');
    }
    const isDrink = item.type === 'drinks';
    const matchedBooking = counterChargeRoom
      ? bookings.find((b) => String(b.id) === String(counterChargeRoom) && ['Checked In', 'Confirmed'].includes(b.status))
      : null;

    const created = portalStore.addDiningOrder({
      orderType: isDrink ? 'drinks' : 'food',
      guestName: matchedBooking ? matchedBooking.guestName : 'Front Desk Counter Diner',
      phone: matchedBooking ? matchedBooking.phone : '',
      email: matchedBooking ? matchedBooking.email : '',
      isLodgeGuest: Boolean(matchedBooking),
      bookingId: matchedBooking ? matchedBooking.id : null,
      roomNumber: matchedBooking ? matchedBooking.roomNumber : null,
      building: matchedBooking ? getBookingBuilding(matchedBooking) : getDeskBuilding(),
      serviceLocation: matchedBooking ? `Suite #${matchedBooking.roomNumber} (Front Desk Counter Order)` : 'Front Desk Counter Order',
      chargeToRoom: Boolean(matchedBooking),
      paymentStatus: matchedBooking ? 'Added to Room Bill' : 'Paid',
      paymentMethod: matchedBooking ? 'Room Bill (Unsettled)' : 'POS Terminal (Front Desk)',
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
      source: 'Reception Counter Desk'
    });

    refreshData();
    showToast(
      matchedBooking
        ? `Generated ${created.id} & added ₦${Number(item.price).toLocaleString()} (${item.name}) to ${matchedBooking.guestName}'s Suite #${matchedBooking.roomNumber} bill!`
        : `Generated ${created.id} (${item.name} • ₦${Number(item.price).toLocaleString()}) — Paid at Counter POS!`
    );
  };

  // Walk-in room change handler (Restricted to receptionist's building & updates Booking Code prefix)
  const handleRoomTypeChange = (type) => {
    const rateObj = rates.find(r => r.id === type);
    const price = rateObj ? rateObj.price : 45000;
    const availableRoomsOfType = rooms.filter(r => 
      r.type === type && 
      r.status === 'available' &&
      isDeskRoom(r)
    );
    const nextRoomNum = availableRoomsOfType.length > 0 ? availableRoomsOfType[0].roomNumber : '';
    const nextCode = generateCounterBookingCode(nextRoomNum, type);
    
    setWalkInForm(prev => ({
      ...prev,
      generatedCode: nextCode,
      roomType: type,
      amount: price * (prev.nights || 1),
      roomNumber: nextRoomNum
    }));
  };

  // Walk-in expected check-in change handler (for Counter Reservation Hold)
  const handleExpectedCheckInChange = (newExpectedDate) => {
    const numNights = Math.max(1, parseInt(walkInForm.nights) || 1);
    let checkOutStr = walkInForm.checkOut;
    try {
      const expDate = new Date(newExpectedDate);
      if (!isNaN(expDate.getTime())) {
        const outDate = new Date(expDate.getTime() + numNights * 86400000);
        checkOutStr = outDate.toISOString().split('T')[0];
      }
    } catch (e) {}

    setWalkInForm(prev => ({
      ...prev,
      expectedCheckIn: newExpectedDate,
      checkIn: newExpectedDate,
      checkOut: checkOutStr
    }));
  };

  // Walk-in check-in date change handler (for Assign & Check In Now)
  const handleCheckInDateChange = (newDate) => {
    const numNights = Math.max(1, parseInt(walkInForm.nights) || 1);
    let checkOutStr = walkInForm.checkOut;
    try {
      const inDate = new Date(newDate);
      if (!isNaN(inDate.getTime())) {
        const outDate = new Date(inDate.getTime() + numNights * 86400000);
        checkOutStr = outDate.toISOString().split('T')[0];
      }
    } catch (e) {}

    setWalkInForm(prev => ({
      ...prev,
      checkIn: newDate,
      checkOut: checkOutStr
    }));
  };

  // Walk-in nights change handler
  const handleNightsChange = (nights) => {
    const numNights = Math.max(1, parseInt(nights) || 1);
    const rateObj = rates.find(r => r.id === walkInForm.roomType);
    const pricePerNight = rateObj ? rateObj.price : 45000;
    
    // Calculate new checkout date based on active mode
    const baseDateStr = walkInForm.bookingMode === 'Reservation Hold'
      ? (walkInForm.expectedCheckIn || walkInForm.reservationDate || walkInForm.checkIn)
      : walkInForm.checkIn;

    let checkOutStr = walkInForm.checkOut;
    try {
      const baseDate = new Date(baseDateStr);
      if (!isNaN(baseDate.getTime())) {
        const checkOutDate = new Date(baseDate.getTime() + numNights * 86400000);
        checkOutStr = checkOutDate.toISOString().split('T')[0];
      }
    } catch (e) {}

    setWalkInForm(prev => ({
      ...prev,
      nights: numNights,
      checkOut: checkOutStr,
      amount: pricePerNight * numNights
    }));
  };

  // Handle client-side proof of payment image compression
  const handleProofImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, or WEBP).');
      return;
    }

    setIsCompressingProof(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.72 });
      setWalkInForm(prev => ({
        ...prev,
        proofOfPaymentImage: compressed.dataUrl,
        proofImageMeta: {
          originalSize: compressed.originalSize,
          compressedSize: compressed.compressedSize,
          reductionPercent: compressed.reductionPercent,
          name: file.name
        }
      }));
      showToast(`Proof slip compressed: ${formatFileSize(compressed.originalSize)} → ${formatFileSize(compressed.compressedSize)} (-${compressed.reductionPercent}%)`);
    } catch (err) {
      console.error('Image compression error:', err);
      alert('Could not compress the selected image. Please try another photo.');
    } finally {
      setIsCompressingProof(false);
    }
  };

  const handleRemoveProofImage = () => {
    setWalkInForm(prev => ({
      ...prev,
      proofOfPaymentImage: '',
      proofImageMeta: null
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
    const roomName = rateObj ? rateObj.name : "Arab Deluxe Suite";

    // Auto-select room if not chosen
    let selectedRoomNum = walkInForm.roomNumber;
    if (!selectedRoomNum) {
      const avail = rooms.find(r => r.type === walkInForm.roomType && r.status === 'available' && isDeskRoom(r));
      if (avail) {
        selectedRoomNum = avail.roomNumber;
      } else {
        alert("No vacant room available in this category for your desk. Please select another category.");
        return;
      }
    }

    // Verify room belongs to this receptionist's desk
    const targetRoom = rooms.find(r => String(r.roomNumber) === String(selectedRoomNum));
    if (!targetRoom || !isDeskRoom(targetRoom)) {
      const desk = getDeskBuilding();
      alert(`Access Denied: Room #${selectedRoomNum} belongs to ${targetRoom?.building || 'the other building'}. Your terminal only manages ${desk === 'Main Building' ? 'Main Building (Rooms 601–620)' : 'Extension Wing (Rooms 101–114)'}.`);
      return;
    }

    const finalBookingCode =
      walkInForm.generatedCode || generateCounterBookingCode(selectedRoomNum, walkInForm.roomType);
    const isReservationHold = walkInForm.bookingMode === 'Reservation Hold' || walkInForm.bookingMode === 'Confirmed';
    const chosenStatus = isReservationHold ? 'Reservation Hold' : 'Checked In';

    const effectiveCheckIn = isReservationHold
      ? (walkInForm.expectedCheckIn || walkInForm.reservationDate || walkInForm.checkIn)
      : walkInForm.checkIn;

    const newBooking = portalStore.addBooking({
      id: finalBookingCode,
      building: targetRoom.building || (String(selectedRoomNum).startsWith('1') ? 'Extension Building' : 'Main Building'),
      guestName: walkInForm.guestName,
      phone: walkInForm.phone,
      email: walkInForm.email,
      homeAddress: walkInForm.homeAddress || '',
      nextOfKinName: walkInForm.nextOfKinName || '',
      nextOfKinPhone: walkInForm.nextOfKinPhone || '',
      nextOfKinRelationship: walkInForm.nextOfKinRelationship || 'Spouse',
      bookingMode: isReservationHold ? 'Reservation Hold' : 'Checked In',
      reservationDate: isReservationHold ? (walkInForm.reservationDate || new Date().toISOString().split('T')[0]) : null,
      expectedCheckIn: isReservationHold ? (walkInForm.expectedCheckIn || effectiveCheckIn) : null,
      proofOfPayment: walkInForm.proofOfPayment || '',
      proofOfPaymentImage: walkInForm.proofOfPaymentImage || '',
      roomType: walkInForm.roomType,
      roomName: roomName,
      roomNumber: selectedRoomNum,
      checkIn: effectiveCheckIn,
      checkOut: walkInForm.checkOut,
      nights: walkInForm.nights,
      amount: walkInForm.amount,
      status: chosenStatus,
      paymentMethod: walkInForm.paymentMethod,
      paymentStatus: "Paid",
      source: isReservationHold ? "Counter Reservation Hold" : "Front Desk Counter (Checked In)"
    });

    // Update room status immediately ('occupied' if Checked In, 'reserved' if Counter Reservation Hold)
    portalStore.updateRoomStatus(
      selectedRoomNum,
      isReservationHold ? 'reserved' : 'occupied',
      walkInForm.guestName
    );

    refreshData();
    setIsWalkInOpen(false);
    showToast(
      isReservationHold
        ? `Reservation Hold Created! Code ${newBooking.id} reserved Room #${selectedRoomNum} for ${walkInForm.guestName}`
        : `Booking Code ${newBooking.id} generated! Room #${selectedRoomNum} checked in for ${walkInForm.guestName}`
    );
    
    // Automatically open folio receipt with Customer Portal Booking Code for printing / sharing
    setSelectedReceiptBooking(newBooking);

    // Send official email confirmation if guest email was captured
    if (newBooking && newBooking.email && newBooking.email.includes('@')) {
      emailService.sendReservationEmail(newBooking).catch(err => {
        console.warn('[Reception Walkin Email Notice]:', err);
      });
    }
  };

  // Send WhatsApp message to guest with official hotel receipt image slip
  const handleSendWhatsApp = async (booking) => {
    if (!booking) return;
    showToast(`Generating official receipt slip image for ${booking.guestName}...`);
    try {
      const res = await shareReceiptImageToWhatsApp(booking.phone, booking);
      if (res?.method === 'native_share') {
        showToast(`Receipt image shared to WhatsApp!`);
      } else if (res?.copiedToClipboard) {
        showToast(`Receipt image copied to clipboard & downloaded! Press Ctrl+V in WhatsApp to send.`);
      } else {
        showToast(`Receipt image downloaded! You can attach it in WhatsApp.`);
      }
    } catch (err) {
      console.warn('WhatsApp image dispatch fallback:', err);
      showToast(`Opening WhatsApp text receipt for ${booking.guestName}...`);
      openWhatsAppReceipt(booking.phone, booking);
    }
  };

  // Download high-resolution PNG receipt slip
  const handleDownloadReceiptImageSlip = async (booking) => {
    if (!booking) return;
    showToast(`Generating receipt image for ${booking.id}...`);
    try {
      const { blob, fileName } = await generateReceiptImageBlob(booking);
      downloadReceiptImageBlob(blob, fileName);
      showToast(`Downloaded ${fileName}`);
    } catch (err) {
      showToast(`Failed to download image slip`);
    }
  };

  // Filtered bookings
  const filteredBookings = (bookings || []).filter(b => {
    if (!b) return false;
    const gName = String(b.guestName || '').toLowerCase();
    const bPhone = String(b.phone || '');
    const bId = String(b.id || '').toLowerCase();
    const rNum = String(b.roomNumber || '');
    const q = String(searchQuery || '').trim().toLowerCase();

    const matchesSearch = !q ||
      gName.includes(q) ||
      bPhone.includes(q) ||
      bId.includes(q) ||
      rNum.includes(q);

    const bStatus = String(b.status || '').toLowerCase();
    const matchesStatus = 
      statusFilter === 'all' || 
      bStatus === String(statusFilter).toLowerCase();

    const matchesBuilding = 
      ledgerBuildingFilter === 'all' || 
      getBookingBuilding(b) === ledgerBuildingFilter;

    return matchesSearch && matchesStatus && matchesBuilding;
  });

  // Calculate quick stats
  const totalRooms = (rooms || []).length;
  const occupiedCount = (rooms || []).filter(r => r && r.status === 'occupied').length;
  const availableCount = (rooms || []).filter(r => r && r.status === 'available').length;
  const cleaningCount = (rooms || []).filter(r => r && r.status === 'cleaning').length;
  const reservedCount = (rooms || []).filter(r => r && r.status === 'reserved').length;
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
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-cinzel font-bold text-base sm:text-lg text-white tracking-wide">
                Front Desk Operations
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 border ${
                getDeskBuilding() === 'Extension Building'
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  getDeskBuilding() === 'Extension Building' ? 'bg-sky-400' : 'bg-emerald-400'
                }`} />
                <span>{getDeskBuilding() === 'Extension Building' ? 'Extension Building (100 Wing)' : 'Main Building (600 Wing)'}</span>
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
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Primary Online Guest Check-In & Booking Code Verification Trigger */}
            <button
              onClick={() => setIsCheckInModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 hover:scale-102 active:scale-98 transition-all cursor-pointer border border-emerald-400/50"
              title="Confirm online booking code & check in guest arriving at counter"
            >
              <Key size={14} className="stroke-[2.5] text-[#f3e5ab]" />
              <span className="hidden sm:inline">Confirm Booking Code &amp; Check In</span>
              <span className="sm:hidden">Check In Guest</span>
            </button>

            {/* New Walk-In / Counter Booking Code Generator Trigger */}
            <button
              onClick={() => handleOpenNewWalkIn()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-[#d4af37]/20 hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Counter Walk-In</span>
            </button>

            {/* Quick Order Code Verification Trigger */}
            <button
              onClick={() => {
                setIsOrderLookupModalOpen(true);
                setOrderLookupError('');
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 text-[#f3e5ab] font-bold text-xs border border-amber-400/50 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              title="Enter Customer Food / Drink Code (ARB-FDD / ARB-DRK) to Confirm Handover"
            >
              <Search size={14} className="text-[#d4af37]" />
              <span className="hidden sm:inline">Confirm Order Code</span>
              <span className="sm:hidden">Order Code</span>
              {diningOrders.filter(isOutsideRoomOrder).filter(o => o.orderStatus !== 'Picked Up' && o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[9px] font-mono font-extrabold animate-pulse">
                  {diningOrders.filter(isOutsideRoomOrder).filter(o => o.orderStatus !== 'Picked Up' && o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length}
                </span>
              )}
            </button>

            {/* View Dining Menu Prices (Read-Only Front Desk) */}
            <button
              onClick={() => setIsDiningMenuOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
              title="View Dining & Drinks Current Prices (Read-Only)"
            >
              <Utensils size={14} className="text-[#d4af37]" />
              <span className="hidden sm:inline">Menu Prices</span>
            </button>

            {/* Test Front Desk Bell Sound / Audio Mute */}
            <button
              onClick={() => {
                if (isSoundMuted) {
                  setIsSoundMuted(false);
                  showToast('Front Desk Audio Alerts Unmuted 🔔');
                  testLoudAlert('reservation');
                } else {
                  testLoudAlert('reservation');
                  showToast('Testing LOUD Front Desk Bell Sound... 🔔');
                }
              }}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isSoundMuted 
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-300' 
                  : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/40 shadow-sm'
              }`}
              title={isSoundMuted ? "Audio Muted - Click to Unmute" : "Test Loud Reservation Bell (Unlocks Audio)"}
            >
              {isSoundMuted ? <VolumeX size={15} className="text-rose-400" /> : <Volume2 size={15} className="text-emerald-400" />}
              <span className="hidden sm:inline">{isSoundMuted ? 'Muted' : '🔊 Test Loud Bell'}</span>
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

      {/* Real-Time Incoming Online Reservation Alert Banner with Sound */}
      {incomingAlert && (() => {
        const desk = currentUser?.buildingAccess || getDeskBuilding();
        const alertRoom = String(incomingAlert.roomNumber || '');
        const isAlertForMyDesk = !currentUser?.buildingAccess || currentUser.buildingAccess === 'all' || 
          (desk === 'Main Building' ? alertRoom.startsWith('6') : alertRoom.startsWith('1'));

        return (
          <div className={`text-black px-4 sm:px-8 py-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/30 ${
            isAlertForMyDesk
              ? 'bg-gradient-to-r from-amber-500 via-[#d4af37] to-amber-600 animate-pulse'
              : 'bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center flex-shrink-0">
                <Bell size={22} className={`text-black stroke-[2.5] ${isAlertForMyDesk ? 'animate-bounce' : ''}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-xs tracking-wider uppercase bg-black text-amber-300 px-2.5 py-0.5 rounded-full font-mono shadow-sm">
                    {isAlertForMyDesk ? '🔔 NEW RESERVATION PAID FOR YOUR DESK!' : 'ℹ️ CROSS-BUILDING RESERVATION NOTICE'}
                  </span>
                  <span className="text-xs font-mono font-bold text-black/90">({incomingAlert.id})</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-black mt-1">
                  Guest: <span className="underline font-bold text-black">{incomingAlert.guestName}</span> &bull; 
                  Auto-Assigned: <span className="bg-black/90 text-amber-300 px-2 py-0.5 rounded-md font-mono font-bold">Room #{incomingAlert.roomNumber}</span> ({incomingAlert.roomName || incomingAlert.roomType}) &bull; 
                  Paid: <span className="font-bold">₦{Number(incomingAlert.amount).toLocaleString()}</span> ({incomingAlert.nights} {incomingAlert.nights === 1 ? 'night' : 'nights'})
                  {!isAlertForMyDesk && (
                    <span className="ml-2 font-mono text-[11px] bg-black/20 px-2 py-0.5 rounded text-black font-bold">
                      Handled by {incomingAlert.roomNumber?.startsWith('6') ? 'Main Building' : 'Extension'} Desk
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setIsCheckInModalOpen(true);
                  setIncomingAlert(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-emerald-400/50"
              >
                <CheckCircle2 size={14} className="stroke-[2.5]" />
                <span>Confirm &amp; Check In Now</span>
              </button>
              <button
                onClick={() => playReceptionDeskBeep()}
                className="px-3 py-1.5 rounded-xl bg-black/15 hover:bg-black/25 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Replay loud concierge bell chime"
              >
                <Volume2 size={15} />
                <span>Re-chime</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('ledger');
                  setSearchQuery(incomingAlert.guestName);
                  setIncomingAlert(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-black/85 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Key size={14} className="text-[#f3e5ab]" />
                <span>View In Ledger</span>
              </button>
              <button
                onClick={() => setIncomingAlert(null)}
                className="px-3 py-1.5 rounded-xl bg-black/35 hover:bg-black/60 text-black hover:text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-black/30"
                title="Dismiss reservation alert banner to continue other front desk tasks"
              >
                <X size={14} className="stroke-[2.5]" />
                <span>Dismiss</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* Real-Time Incoming Food/Drink Pickup & Dining Alert Banner for Main Receptionist */}
      {incomingDiningAlert && getDeskBuilding() !== 'Extension Building' && (
        <div className="bg-gradient-to-r from-emerald-500 via-[#d4af37] to-amber-500 text-black px-4 sm:px-8 py-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/30 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center flex-shrink-0">
              <Utensils size={20} className="text-black stroke-[2.5] animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-xs tracking-wider uppercase bg-black text-[#f3e5ab] px-2.5 py-0.5 rounded-full font-mono shadow-sm">
                  🔔 NEW PICKUP / DINING ORDER FOR MAIN RECEPTION!
                </span>
                <span className="text-xs font-mono font-extrabold text-black">
                  ({incomingDiningAlert.id})
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-black mt-1">
                Customer: <span className="underline font-bold">{incomingDiningAlert.guestName}</span>
                {incomingDiningAlert.phone ? ` (${incomingDiningAlert.phone})` : ''} &bull; Mode:{' '}
                <span className="bg-black/90 text-amber-300 px-2 py-0.5 rounded-md font-mono font-bold">
                  {incomingDiningAlert.serviceLocation}
                </span>{' '}
                &bull; Amount: <span className="font-bold">₦{Number(incomingDiningAlert.amount).toLocaleString()}</span> ({incomingDiningAlert.paymentStatus})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('dining_orders');
                setDiningOrderFilter('outside');
                setInspectedDiningOrder(incomingDiningAlert);
                setIncomingDiningAlert(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-black text-[#f3e5ab] hover:bg-black/85 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Utensils size={13} className="text-[#d4af37]" />
              <span>Track & Inspect Order</span>
            </button>
            <button
              onClick={() => {
                portalStore.updateDiningOrderStatus(incomingDiningAlert.id, 'Picked Up', currentUser?.name || 'Main Building Receptionist');
                refreshData();
                showToast(`Order ${incomingDiningAlert.id} marked as PICKED UP at Main Reception!`);
                setIncomingDiningAlert(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-200 hover:bg-emerald-900 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <CheckCircle2 size={13} />
              <span>Picked Up</span>
            </button>
            <button
              onClick={() => {
                portalStore.updateDiningOrderStatus(incomingDiningAlert.id, 'Delivered', currentUser?.name || 'Main Building Receptionist');
                refreshData();
                showToast(`Order ${incomingDiningAlert.id} marked as DELIVERED!`);
                setIncomingDiningAlert(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-black/25 hover:bg-black/35 text-black font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <Check size={13} />
              <span>Delivered</span>
            </button>
            <button
              onClick={() => setIncomingDiningAlert(null)}
              className="px-3 py-1.5 rounded-xl bg-black/35 hover:bg-black/60 text-black hover:text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-black/30"
              title="Dismiss food/drink alert banner"
            >
              <X size={14} className="stroke-[2.5]" />
              <span>Dismiss</span>
            </button>
          </div>
        </div>
      )}

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
            <div className="text-xl sm:text-2xl font-bold font-cinzel text-white mt-1">{totalRooms || 34} Keys</div>
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
          <div className="flex flex-wrap items-center gap-2 bg-[#16030c] p-1 rounded-xl border border-white/10 w-fit">
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
            <button
              onClick={() => setActiveTab('dining_orders')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'dining_orders'
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Utensils size={14} />
              <span>Food & Drinks ({diningOrders.filter(isDeskDiningOrder).length})</span>
              {diningOrders.filter(isDeskDiningOrder).filter(o => o.paymentStatus !== 'Paid' && o.orderStatus !== 'Cancelled').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-mono font-extrabold">
                  {diningOrders.filter(isDeskDiningOrder).filter(o => o.paymentStatus !== 'Paid' && o.orderStatus !== 'Cancelled').length} DUE
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 relative ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare size={14} />
              <span>Wing Intercom Chat</span>
              {unreadChatCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold animate-pulse shadow-md">
                  {unreadChatCount} NEW
                </span>
              ) : chatMessages.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                  activeTab === 'chat' ? 'bg-black text-[#f3e5ab]' : 'bg-[#d4af37] text-black'
                }`}>
                  {chatMessages.length}
                </span>
              )}
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
              onClick={() => setIsCheckInModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm"
              title="Verify customer online booking code & check in"
            >
              <Key size={13} className="text-emerald-400" />
              <span>Check In Code</span>
            </button>

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

            {/* Building Filter Tabs & Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#16030c] border border-[#d4af37]/30 shadow-lg">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-[#d4af37]" />
                <span className="font-cinzel font-bold text-sm text-white">Complex Filter:</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => setSelectedBuilding('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                    selectedBuilding === 'all'
                      ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold shadow-md'
                      : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                  }`}
                >
                  All Buildings ({rooms.length})
                </button>
                <button
                  onClick={() => setSelectedBuilding('Main Building')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                    selectedBuilding === 'Main Building'
                      ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold shadow-md'
                      : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                  }`}
                >
                  Main Building (20 Rooms • 600 Wing)
                </button>
                <button
                  onClick={() => setSelectedBuilding('Extension Building')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                    selectedBuilding === 'Extension Building'
                      ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold shadow-md'
                      : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                  }`}
                >
                  Extension Building (14 Rooms • 100 Wing)
                </button>
              </div>
            </div>

            {/* Grouped by Building (Main Building & Extension Building) */}
            {[
              {
                name: 'Main Building',
                wing: '600 Wing (Rooms 601 – 620)',
                ratesNote: 'Super Exec ₦60k • Exec ₦50k • Superior ₦40k • Deluxe ₦35k • Standard ₦30k',
                totalCount: 20
              },
              {
                name: 'Extension Building',
                wing: '100 Wing (Rooms 101 – 114)',
                ratesNote: 'Suites ₦120k • Super-Exec ₦60k • Exec ₦50k • Superior ₦40k',
                totalCount: 14
              }
            ]
              .filter(bldg => selectedBuilding === 'all' || selectedBuilding === bldg.name)
              .map((bldg) => {
                const bldgRooms = (rooms || []).filter(r => r && (r.building === bldg.name || r.floor === bldg.name));
                if (bldgRooms.length === 0) return null;
                const vacantCount = bldgRooms.filter(r => r.status === 'available').length;
                const occupiedCount = bldgRooms.filter(r => r.status === 'occupied').length;
                const isDeskBuilding = isMyBuilding(bldg.name);

                return (
                  <div key={bldg.name} className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-gradient-to-r from-[#1c040e] via-[#240614] to-[#16030c] border border-[#d4af37]/40 shadow-lg">
                      <div className="flex items-center gap-2.5">
                        <Building2 size={18} className="text-[#d4af37]" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-cinzel font-bold text-sm sm:text-base text-white uppercase">
                              {bldg.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono">
                              {bldg.wing}
                            </span>
                            {isDeskBuilding ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                                <CheckCircle2 size={11} className="text-emerald-400" />
                                <span>Your Assigned Wing (Full Control)</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
                                <Lock size={11} className="text-amber-400" />
                                <span>Cross-Building View (Managed by {bldg.name} Desk)</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#f3e5ab]/80 font-mono mt-0.5">
                            Rates: {bldg.ratesNote}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono">
                          {vacantCount} Vacant
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-400 font-mono">
                          {occupiedCount} Occupied
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-mono">
                          {bldgRooms.length} Rooms
                        </span>
                      </div>
                    </div>

                    {!isDeskBuilding && (
                      <div className="p-3 rounded-2xl bg-[#241304]/80 border border-amber-500/30 text-xs text-amber-200/90 flex items-center gap-2.5">
                        <Lock size={16} className="text-[#d4af37] flex-shrink-0" />
                        <span className="leading-relaxed">
                          <strong>Cross-Building Availability:</strong> You can view all real-time room statuses below to assist guests inquiring about <strong>{bldg.name}</strong>. Full guest check-in, key handover, and room modifications for this wing are restricted to the <strong>{bldg.name} Front Desk</strong>.
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {bldgRooms.map((room) => {
                      const isOccupied = room.status === 'occupied';
                      const isAvailable = room.status === 'available';
                      const isCleaning = room.status === 'cleaning';
                      const isReserved = room.status === 'reserved';
                      const isCancellationPending = room.status === 'cancellation_pending';
                      const isEarlyTerminationPending = room.status === 'early_termination_pending';

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
                      } else if (isCancellationPending) {
                        borderClass = 'border-amber-400/80 shadow-amber-500/20';
                        bgCard = 'bg-gradient-to-br from-[#16030c] to-[#361705]';
                        badgeColor = 'bg-amber-500/30 text-amber-300 border-amber-400/60 animate-pulse';
                      } else if (isEarlyTerminationPending) {
                        borderClass = 'border-amber-400/80 shadow-amber-500/20';
                        bgCard = 'bg-gradient-to-br from-[#16030c] to-[#361705]';
                        badgeColor = 'bg-amber-500/30 text-amber-300 border-amber-400/60 animate-pulse';
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
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{room.building || room.floor}</span>
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

                          {/* Quick Actions (Active for Assigned Desk, View-Only for other wing) */}
                          {isDeskBuilding ? (
                            <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
                              {isOccupied && (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handlePromptMakeAvailable(room)}
                                    className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    title="Check out guest & mark suite available (Verifies stay duration completion)"
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
                                    onClick={() => handleOpenNewWalkIn(room)}
                                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#5c0725]/80 hover:bg-[#5c0725] border border-[#d4af37]/50 text-[#f3e5ab] text-xs font-semibold transition-all flex items-center justify-center gap-1"
                                    title="Assign room & generate Customer Portal Booking Code"
                                  >
                                    <Key size={12} className="text-[#d4af37]" />
                                    <span>Assign & Gen Code</span>
                                  </button>
                                  <button
                                    onClick={() => handleOpenNewWalkIn(room)}
                                    className="py-1.5 px-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/70 border border-rose-500/30 text-rose-200 text-[10px] font-medium transition-all"
                                    title="Counter Walk-In Assignment"
                                  >
                                    Occupy
                                  </button>
                                </div>
                              )}

                              {isCancellationPending && (
                                <div className="w-full py-2 px-2.5 rounded-lg bg-amber-950/70 border border-amber-500/50 text-amber-200 text-[10px] font-mono font-bold text-center flex items-center justify-center gap-1.5 shadow-sm">
                                  <Clock size={12} className="text-amber-400 animate-spin" />
                                  <span>Cancellation Pending Accountant Approval</span>
                                </div>
                              )}

                              {isEarlyTerminationPending && (
                                <div className="w-full py-2 px-2.5 rounded-lg bg-amber-950/70 border border-amber-500/50 text-amber-200 text-[10px] font-mono font-bold text-center flex items-center justify-center gap-1.5 shadow-sm">
                                  <Clock size={12} className="text-amber-400 animate-spin" />
                                  <span>Early Checkout Pending CEO/Accountant Approval</span>
                                </div>
                              )}

                              {isReserved && (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handlePromptCheckInReservedRoom(room)}
                                    className="flex-1 py-1.5 px-2 rounded-lg bg-sky-950/60 hover:bg-sky-900 border border-sky-500/40 text-sky-200 text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    title="Verify customer reservation code to check in"
                                  >
                                    <Key size={12} className="text-sky-300" />
                                    <span>Check In</span>
                                  </button>
                                  <button
                                    onClick={() => handlePromptCancelReservation(room)}
                                    className="flex-1 py-1.5 px-2 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-200 text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    title="Cancel reservation (Dispatches cancellation request to CEO & Accountant)"
                                  >
                                    <XCircle size={12} className="text-rose-400" />
                                    <span>Cancel Reservation</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Cross-Building View Only Info */
                            <div className="pt-2 border-t border-white/10">
                              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                                  <Lock size={12} className="text-[#d4af37]" />
                                  <span>{bldg.name} Desk</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  isAvailable 
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                    : isOccupied 
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    : isCleaning
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : isCancellationPending
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                }`}>
                                  {isAvailable ? 'VACANT & READY' : isCancellationPending ? 'CANCELLATION PENDING' : room.status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}

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
            
            {/* Status & Wing Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 mr-1 flex items-center gap-1">
                  <Filter size={13} />
                  <span>Status:</span>
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

              {/* Building / Wing Filter */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                <Building2 size={13} className="text-[#d4af37] ml-2 mr-1" />
                <button
                  onClick={() => setLedgerBuildingFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    ledgerBuildingFilter === 'all'
                      ? 'bg-[#5c0725] text-[#f3e5ab] border border-[#d4af37]/40 font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Both Wings
                </button>
                <button
                  onClick={() => setLedgerBuildingFilter('Main Building')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    ledgerBuildingFilter === 'Main Building'
                      ? 'bg-[#5c0725] text-[#f3e5ab] border border-[#d4af37]/40 font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Main (600 Wing)
                </button>
                <button
                  onClick={() => setLedgerBuildingFilter('Extension Building')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    ledgerBuildingFilter === 'Extension Building'
                      ? 'bg-[#5c0725] text-[#f3e5ab] border border-[#d4af37]/40 font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Extension (100 Wing)
                </button>
              </div>
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
                      <td colSpan="7" className="py-10 text-center text-gray-400">
                        <div className="max-w-md mx-auto space-y-3">
                          <p className="text-sm text-gray-300">
                            No reservations found locally matching your search or filters.
                          </p>
                          {searchQuery.trim() && (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={async () => {
                                  showToast(`Querying cloud registry for "${searchQuery}"...`);
                                  const cloudFound = await portalStore.fetchBookingFromCloud(searchQuery);
                                  if (cloudFound) {
                                    refreshData();
                                    showToast(`Found reservation for ${cloudFound.guestName}!`);
                                  } else {
                                    showToast(`Code "${searchQuery}" not found in cloud. Try Counter Check-In.`);
                                  }
                                }}
                                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-[#f3e5ab] border border-amber-500/40 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
                              >
                                <Search size={14} className="text-[#d4af37]" />
                                <span>Fetch "{searchQuery}" from Cloud</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCheckInInitialCode(searchQuery.trim());
                                  setIsCheckInModalOpen(true);
                                }}
                                className="px-3.5 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
                              >
                                <Key size={14} />
                                <span>Verify in Counter Check-In</span>
                              </button>
                            </div>
                          )}
                        </div>
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
                            {b.homeAddress && (
                              <div className="text-[10px] text-gray-400 truncate max-w-[180px] mt-0.5" title={b.homeAddress}>
                                Addr: {b.homeAddress}
                              </div>
                            )}
                            {b.nextOfKinName && (
                              <div className="text-[10px] text-amber-300/80 truncate max-w-[180px]" title={`${b.nextOfKinName} (${b.nextOfKinPhone})`}>
                                Kin: {b.nextOfKinName} ({b.nextOfKinPhone})
                              </div>
                            )}
                          </td>

                          {/* Suite */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-gray-200">{b.roomName}</div>
                            <div className="text-[11px] text-[#d4af37] font-mono flex items-center gap-2 mt-0.5">
                              <span>Room: {b.roomNumber ? `#${b.roomNumber}` : 'Unassigned'}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold border ${
                                getBookingBuilding(b) === 'Main Building'
                                  ? 'bg-[#5c0725]/50 text-[#f3e5ab] border-[#d4af37]/40'
                                  : 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'
                              }`}>
                                {getBookingBuilding(b) === 'Main Building' ? 'Main (600 Wing)' : 'Ext (100 Wing)'}
                              </span>
                            </div>
                          </td>

                          {/* Dates */}
                          <td className="py-3.5 px-4">
                            {b.bookingMode === 'Reservation Hold' ? (
                              <div>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-400/40 inline-block mb-1">
                                  Reservation Hold
                                </span>
                                <div className="text-sky-200 font-mono text-[11px]">
                                  Res Date: {b.reservationDate || b.checkIn}
                                </div>
                                {b.expectedCheckIn && (
                                  <div className="text-emerald-300 font-mono text-[10px]">
                                    Exp. Check-In: {b.expectedCheckIn}
                                  </div>
                                )}
                                <div className="text-[10px] text-gray-400">
                                  Stay: {b.nights} {b.nights === 1 ? 'Night' : 'Nights'}
                                </div>
                                {b.proofOfPayment && (
                                  <div className="text-[9px] text-[#f3e5ab] font-mono truncate max-w-[130px] mt-0.5" title={b.proofOfPayment}>
                                    Proof: {b.proofOfPayment}
                                  </div>
                                )}
                                {b.proofOfPaymentImage && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedProofBooking(b)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-[10px] font-mono mt-1 transition-all cursor-pointer shadow-sm"
                                    title="View uploaded proof of payment slip"
                                  >
                                    <ImageIcon size={11} />
                                    <span>View Slip</span>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div>
                                <div className="text-gray-300">
                                  {b.checkIn} → {b.checkOut}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  {b.nights} {b.nights === 1 ? 'Night' : 'Nights'}
                                </div>
                                {b.proofOfPayment && (
                                  <div className="text-[9px] text-gray-400 font-mono truncate max-w-[130px] mt-0.5" title={b.proofOfPayment}>
                                    Ref: {b.proofOfPayment}
                                  </div>
                                )}
                                {b.proofOfPaymentImage && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedProofBooking(b)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-[10px] font-mono mt-1 transition-all cursor-pointer shadow-sm"
                                    title="View uploaded proof of payment slip"
                                  >
                                    <ImageIcon size={11} />
                                    <span>View Slip</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Amount & Backend Confirmation Check + Attached Room Bill */}
                          <td className="py-3.5 px-4">
                            {(() => {
                              const folio = portalStore.getBookingFolioSummary(b);
                              return b.paymentStatus === 'Paid' ? (
                                <div className="space-y-0.5">
                                  <div className="font-bold text-[#f3e5ab] font-mono">
                                    ₦{Number(b.amount).toLocaleString()}
                                  </div>
                                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                                    <CheckCircle2 size={11} />
                                    <span>Suite Paid</span>
                                  </div>
                                  {folio.totalDiningAmount > 0 && (
                                    <div className={`text-[10px] font-mono font-bold ${folio.unpaidDiningAmount > 0 ? 'text-amber-300' : 'text-sky-300'}`}>
                                      {folio.unpaidDiningAmount > 0
                                        ? `+₦${folio.unpaidDiningAmount.toLocaleString()} Room Bill Due`
                                        : `+₦${folio.totalDiningAmount.toLocaleString()} Dining Settled`}
                                    </div>
                                  )}
                                </div>
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
                              );
                            })()}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                              b.status === 'Cancellation Pending'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 animate-pulse font-mono'
                                : b.status === 'Cancelled'
                                ? 'bg-gray-500/20 text-gray-400 border-gray-500/40 font-mono'
                                : isCheckedIn
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : b.paymentStatus === 'Paid'
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}>
                              {b.status === 'Cancellation Pending'
                                ? 'Cancellation Pending Audit'
                                : b.paymentStatus === 'Paid'
                                ? b.status
                                : 'Awaiting Payment Audit'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              
                              {/* Check In / Out Toggle Button - Only operational if booking belongs to current receptionist desk */}
                              {isDeskBooking(b) ? (
                                <>
                                  {portalStore.getBookingFolioSummary(b).balanceDue > 0 && (
                                    <button
                                      onClick={() => handleSettleBookingRoomBill(b)}
                                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/50 text-amber-200 text-[11px] font-bold transition-all flex items-center gap-1"
                                      title="Settle guest's attached Food/Drink Room Bill via POS"
                                    >
                                      <CreditCard size={12} />
                                      <span>Clear Bill</span>
                                    </button>
                                  )}

                                  {isConfirmed && b.paymentStatus === 'Paid' && (
                                    <>
                                      <button
                                        onClick={() => handleToggleBookingStatus(b)}
                                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-semibold transition-all flex items-center gap-1"
                                      >
                                        <Key size={12} />
                                        <span>Check In</span>
                                      </button>
                                      <button
                                        onClick={() => handlePromptCancelBooking(b)}
                                        className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                                        title="Cancel reservation (Dispatches cancellation request to CEO & Accountant)"
                                      >
                                        <XCircle size={11} className="text-rose-400" />
                                        <span>Cancel Res</span>
                                      </button>
                                    </>
                                  )}

                                  {b.status === 'Cancellation Pending' && (
                                    <span
                                      className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-400/50 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse"
                                      title="Cancellation request sent to CEO & Accountant. Awaiting Chief Accountant confirmation."
                                    >
                                      <Clock size={11} />
                                      <span>Pending Audit</span>
                                    </span>
                                  )}

                                  {b.status === 'Early Termination Pending' && (
                                    <span
                                      className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-400/50 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse"
                                      title="Early checkout requested. Awaiting CEO or Chief Accountant confirmation before room is made available."
                                    >
                                      <Clock size={11} className="text-amber-400" />
                                      <span>Early Checkout Pending</span>
                                    </span>
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
                                </>
                              ) : (
                                <span
                                  className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] flex items-center gap-1 font-mono"
                                  title={`View Only: Managed exclusively by ${getBookingBuilding(b)} Reception Desk.`}
                                >
                                  <Lock size={10} className="text-amber-400/80" />
                                  <span>{getBookingBuilding(b) === 'Main Building' ? 'Main Desk' : 'Extension Desk'}</span>
                                </span>
                              )}

                              {/* Generate Receipt Button */}
                              <button
                                onClick={() => setSelectedReceiptBooking(b)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#5c0725] hover:bg-[#7a0a32] border border-[#d4af37]/40 text-[#f3e5ab] text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                                title="Generate Official Guest Folio / Receipt"
                              >
                                <Receipt size={13} className="text-[#d4af37]" />
                                <span>Generate Receipt</span>
                              </button>

                              {/* WhatsApp Direct Guest Notify */}
                              <button
                                onClick={() => handleSendWhatsApp(b)}
                                className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 transition-all cursor-pointer"
                                title={`Send Receipt via WhatsApp to ${b.phone}`}
                              >
                                <MessageSquare size={13} />
                              </button>

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

        {/* ======================================================== */}
        {/* 5B. TAB CONTENT: FOOD (ARB-FDD) & DRINKS (ARB-DRK) LEDGER */}
        {/* ======================================================== */}
        {activeTab === 'dining_orders' && (
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#240411] via-[#18030c] to-[#120208] border border-[#d4af37]/35 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-cinzel font-bold text-base sm:text-lg text-white flex items-center gap-2">
                    <Utensils size={18} className="text-[#d4af37]" />
                    <span>Food (ARB-FDD) & Drink (ARB-DRK) Orders & Room Bills</span>
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    getDeskBuilding() === 'Extension Building'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  }`}>
                    {getDeskBuilding() === 'Extension Building'
                      ? 'Extension Desk Terminal (100 Wing)'
                      : 'Main Desk Terminal • Handles All Outside-Room Orders & 600 Wing'}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5">
                  {getDeskBuilding() === 'Extension Building'
                    ? 'Managing Extension Wing Suite 101–114 in-room dining orders and attached room bills.'
                    : 'Responsible for all outside-room orders (Al-Sultan Restaurant, VIP Lounge, Pool Cabana, Takeout) and Main Building Suite 601–620 bills.'}
                </p>
              </div>

              <button
                onClick={() => setIsDiningMenuOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-lg self-start md:self-auto"
              >
                <Plus size={14} />
                <span>Counter Food / Drink Order</span>
              </button>
            </div>

            {/* ======================================================== */}
            {/* DEDICATED ORDER CODE ENTRY & CONFIRMATION DESK */}
            {/* ======================================================== */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#2c0516] via-[#1b030e] to-[#120208] border-2 border-[#d4af37]/60 shadow-2xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#5c0725] border border-[#d4af37]/50 text-[#d4af37] shadow">
                    <Key size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono uppercase tracking-widest font-bold">
                        Front Desk Order Verification
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        Supports ARB-FDD-* (Food) & ARB-DRK-* (Drinks)
                      </span>
                    </div>
                    <h4 className="font-cinzel font-bold text-base sm:text-lg text-white mt-0.5">
                      Enter Customer Order Code to Confirm & Hand Over
                    </h4>
                  </div>
                </div>

                <div className="text-xs text-gray-300 max-w-sm">
                  Ask the customer for their booking code when they arrive at the counter, enter it below to pull up order details, then click <strong className="text-emerald-300">✓ Customer Picked Up</strong>.
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleLookupOrderCode} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af37]" />
                  <input
                    type="text"
                    value={orderCodeInput}
                    onChange={(e) => {
                      setOrderCodeInput(e.target.value);
                      setOrderLookupError('');
                    }}
                    placeholder="ENTER ORDER CODE, E.G. ARB-FDD-784920-AB OR ARB-DRK-102938-XY"
                    className="w-full pl-11 pr-10 py-3 rounded-xl bg-black/85 border-2 border-[#d4af37]/40 focus:border-[#d4af37] text-sm text-white placeholder-gray-500 font-mono tracking-wider uppercase transition-all outline-none shadow-inner"
                  />
                  {orderCodeInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setOrderCodeInput('');
                        setVerifiedOrder(null);
                        setOrderLookupError('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] hover:brightness-110 active:scale-98 text-black text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap"
                >
                  <CheckCircle2 size={16} className="text-black stroke-[2.5]" />
                  <span>Verify Order Code</span>
                </button>
              </form>

              {/* Quick Select Chips */}
              {diningOrders.filter(isOutsideRoomOrder).length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-0.5">
                  <span className="text-[11px] font-mono text-gray-400">Quick Select Pickup Order:</span>
                  {diningOrders.filter(isOutsideRoomOrder).slice(0, 6).map((ord) => (
                    <button
                      key={ord.id}
                      type="button"
                      onClick={() => {
                        setOrderCodeInput(ord.id);
                        handleLookupOrderCode(null, ord.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-[#f3e5ab] flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span className="font-bold">{ord.id}</span>
                      <span className="text-gray-400 font-sans">({ord.guestName.split(' ')[0]})</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${ord.orderStatus === 'Picked Up' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
                        {ord.orderStatus}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Error Message */}
              {orderLookupError && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
                  <span>{orderLookupError}</span>
                </div>
              )}

              {/* Instant Verified Order Handover Card */}
              {verifiedOrder && (
                <div className="p-4 sm:p-5 rounded-xl bg-black/80 border-2 border-emerald-500/50 shadow-2xl space-y-3.5 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded font-mono font-bold text-xs border ${
                        verifiedOrder.orderType === 'drinks' ? 'bg-purple-500/20 text-purple-200 border-purple-400/40' : 'bg-[#d4af37]/20 text-[#f3e5ab] border-[#d4af37]/40'
                      }`}>
                        {verifiedOrder.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        verifiedOrder.orderStatus === 'Picked Up'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                          : verifiedOrder.orderStatus === 'Delivered'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-400'
                          : verifiedOrder.orderStatus === 'Ready for Pickup'
                          ? 'bg-amber-500/20 text-amber-200 border-amber-400 animate-pulse'
                          : 'bg-white/10 text-gray-200 border-white/20'
                      }`}>
                        Status: {verifiedOrder.orderStatus}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        Booked: {verifiedOrder.createdAt}
                      </span>
                    </div>

                    <button
                      onClick={() => setInspectedDiningOrder(verifiedOrder)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-all cursor-pointer"
                    >
                      <Eye size={13} className="text-[#d4af37]" />
                      <span>Full Order Slip</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] font-mono uppercase text-gray-400 block">Customer Information</span>
                      <div className="font-bold text-white text-sm mt-0.5">{verifiedOrder.guestName}</div>
                      <div className="text-gray-300 text-xs font-mono mt-0.5">Phone: {verifiedOrder.phone || 'Counter walk-in'}</div>
                      {verifiedOrder.email && <div className="text-gray-400 text-[10px] truncate">{verifiedOrder.email}</div>}
                    </div>

                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] font-mono uppercase text-gray-400 block">Collection / Destination</span>
                      <div className="font-semibold text-amber-300 mt-0.5 flex items-center gap-1.5">
                        <Utensils size={13} />
                        <span>{verifiedOrder.serviceLocation || 'Pickup at Main Reception Desk'}</span>
                      </div>
                      <div className="text-gray-400 text-[11px] font-mono mt-1">
                        {verifiedOrder.isOutsideRoom ? 'Outside-Room Customer' : `Room Guest • Suite #${verifiedOrder.roomNumber}`}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] font-mono uppercase text-gray-400 block">Payment & Bill</span>
                      <div className="font-bold text-[#d4af37] font-mono text-base mt-0.5">
                        ₦{Number(verifiedOrder.amount).toLocaleString()}
                      </div>
                      <span className={`text-[10px] font-bold ${verifiedOrder.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-300'}`}>
                        ● {verifiedOrder.paymentStatus} ({verifiedOrder.paymentMethod})
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="p-3 rounded-lg bg-black/50 border border-white/10 text-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] font-bold block mb-1">
                      Ordered Items:
                    </span>
                    <div className="text-gray-200 font-medium">
                      {(verifiedOrder.items || []).map((it) => `${it.qty}x ${it.name}`).join(' • ')}
                    </div>
                    {verifiedOrder.notes && (
                      <div className="text-[11px] text-amber-300 italic mt-1">
                        Customer Note: {verifiedOrder.notes}
                      </div>
                    )}
                  </div>

                  {verifiedOrder.fulfilledAt && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 font-mono">
                      ✓ Handover Recorded: {verifiedOrder.orderStatus} at {verifiedOrder.fulfilledAt} ({verifiedOrder.fulfilledBy || 'Main Reception'})
                    </div>
                  )}

                  {/* Instant Confirmation Buttons */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#f3e5ab] font-bold block">
                      Main Receptionist Handover Actions:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleQuickConfirmOrder(verifiedOrder.id, 'Picked Up')}
                        className={`py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                          verifiedOrder.orderStatus === 'Picked Up'
                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <CheckCircle2 size={16} />
                        <span>✓ Customer Picked Up</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickConfirmOrder(verifiedOrder.id, 'Delivered')}
                        className={`py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                          verifiedOrder.orderStatus === 'Delivered'
                            ? 'bg-sky-600 text-white ring-2 ring-sky-400'
                            : 'bg-sky-600 hover:bg-sky-500 text-white'
                        }`}
                      >
                        <Check size={16} />
                        <span>✓ Mark Delivered</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickConfirmOrder(verifiedOrder.id, 'Ready for Pickup')}
                        className="py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <BellRing size={15} />
                        <span>Ready for Pickup</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MAIN RECEPTIONIST DEDICATED PICKUP & OUTSIDE-ROOM DINING DISPATCH SPACE */}
            {(getDeskBuilding() === 'Main Building' || getDeskBuilding() === 'all') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#21040f] via-[#17030b] to-[#110208] border border-amber-500/40 shadow-2xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <BellRing size={11} className="animate-bounce" />
                        <span>Main Receptionist Pickup & Dining Dispatch Hub</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                        {diningOrders.filter((o) => isOutsideRoomOrder(o) && o.orderStatus !== 'Picked Up' && o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length} Active Awaiting Pickup / Delivery
                      </span>
                    </div>
                    <h4 className="font-cinzel font-bold text-sm sm:text-base text-white mt-1.5">
                      Outside-Room Food (ARB-FDD) & Drink (ARB-DRK) Collection Desk
                    </h4>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Customers who book food or drinks without a lodge room collect their orders from the <span className="text-[#f3e5ab] font-semibold">Main Building Receptionist</span> or dine in the hall/lounge. Inspect full order details below and click <span className="text-emerald-300 font-semibold">Picked Up</span> or <span className="text-sky-300 font-semibold">Delivered</span> upon handover.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center">
                    <button
                      onClick={() => setDiningOrderFilter('outside')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-semibold transition-all"
                    >
                      Filter Outside Orders Only ({diningOrders.filter(isOutsideRoomOrder).length})
                    </button>
                  </div>
                </div>

                {diningOrders.filter(isOutsideRoomOrder).length === 0 ? (
                  <div className="p-6 rounded-xl bg-black/40 border border-white/10 text-center text-gray-400 text-xs">
                    No outside-room pickup or dining orders yet. New non-lodge orders placed on the website will immediately alert here.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {diningOrders
                      .filter(isOutsideRoomOrder)
                      .slice(0, 9)
                      .map((ord) => {
                        const isCompleted = ord.orderStatus === 'Picked Up' || ord.orderStatus === 'Delivered';
                        return (
                          <div
                            key={ord.id}
                            className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                              isCompleted
                                ? 'bg-black/45 border-emerald-500/30'
                                : ord.orderStatus === 'Ready for Pickup'
                                ? 'bg-gradient-to-br from-amber-950/40 via-[#1b040d] to-black/70 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                                : 'bg-black/60 border-[#d4af37]/35 hover:border-[#d4af37]/60'
                            }`}
                          >
                            <div className="space-y-2.5">
                              {/* Top Code & Status Badge */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span
                                    className={`px-2.5 py-0.5 rounded font-mono font-bold text-xs inline-block border ${
                                      ord.orderType === 'drinks'
                                        ? 'bg-purple-500/20 text-purple-200 border-purple-400/40'
                                        : 'bg-[#d4af37]/20 text-[#f3e5ab] border-[#d4af37]/40'
                                    }`}
                                  >
                                    {ord.id}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono block mt-1">
                                    Booked: {ord.createdAt}
                                  </span>
                                </div>

                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                                    ord.orderStatus === 'Picked Up'
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                                      : ord.orderStatus === 'Delivered'
                                      ? 'bg-sky-500/20 text-sky-300 border-sky-400/50'
                                      : ord.orderStatus === 'Ready for Pickup'
                                      ? 'bg-amber-500/25 text-amber-200 border-amber-400 animate-pulse'
                                      : 'bg-white/10 text-[#f3e5ab] border-[#d4af37]/40'
                                  }`}
                                >
                                  {ord.orderStatus}
                                </span>
                              </div>

                              {/* Customer & Service Mode */}
                              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-white text-xs">{ord.guestName}</span>
                                  <span className="font-mono font-bold text-xs text-[#d4af37]">
                                    ₦{Number(ord.amount).toLocaleString()} ({ord.paymentStatus})
                                  </span>
                                </div>
                                <div className="text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
                                  <Utensils size={11} />
                                  <span>{ord.serviceLocation || 'Pickup at Main Reception Desk'}</span>
                                </div>
                                {ord.phone && (
                                  <div className="text-[10px] text-gray-400 font-mono">
                                    Phone: {ord.phone} {ord.email ? `• ${ord.email}` : ''}
                                  </div>
                                )}
                              </div>

                              {/* Items Summary */}
                              <div className="text-xs text-gray-200 space-y-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">
                                  Order Items ({ord.items?.reduce((s, i) => s + (i.qty || 1), 0) || 0}):
                                </span>
                                <div className="line-clamp-2 text-[11px] text-gray-200 font-medium">
                                  {ord.items?.map((it) => `${it.qty}x ${it.name}`).join(', ')}
                                </div>
                                {ord.notes && (
                                  <div className="text-[10px] text-amber-300 italic bg-amber-950/30 px-2 py-1 rounded border border-amber-500/20">
                                    Note: {ord.notes}
                                  </div>
                                )}
                              </div>

                              {ord.fulfilledAt && (
                                <div className="text-[10px] font-mono text-emerald-300 bg-emerald-950/30 border border-emerald-500/30 rounded-lg px-2.5 py-1">
                                  ✓ {ord.orderStatus} at {ord.fulfilledAt} ({ord.fulfilledBy || 'Main Reception'})
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-1.5">
                              <button
                                onClick={() => setInspectedDiningOrder(ord)}
                                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[11px] font-semibold flex items-center gap-1 transition-all"
                              >
                                <Eye size={12} className="text-[#d4af37]" />
                                <span>Inspect Info</span>
                              </button>

                              <div className="flex items-center gap-1.5 flex-wrap">
                                {ord.orderStatus !== 'Ready for Pickup' && !isCompleted && (
                                  <button
                                    onClick={() => {
                                      portalStore.updateDiningOrderStatus(ord.id, 'Ready for Pickup', currentUser?.name || 'Main Receptionist');
                                      refreshData();
                                      showToast(`Order ${ord.id} marked READY FOR PICKUP at Main Reception!`);
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 text-[11px] font-bold transition-all"
                                  >
                                    Ready
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    portalStore.updateDiningOrderStatus(ord.id, 'Picked Up', currentUser?.name || 'Main Receptionist');
                                    refreshData();
                                    showToast(`Order ${ord.id} marked PICKED UP from Main Reception!`);
                                  }}
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                    ord.orderStatus === 'Picked Up'
                                      ? 'bg-emerald-600 text-white shadow-md'
                                      : 'bg-emerald-600/80 hover:bg-emerald-500 text-white'
                                  }`}
                                >
                                  ✓ Picked Up
                                </button>

                                <button
                                  onClick={() => {
                                    portalStore.updateDiningOrderStatus(ord.id, 'Delivered', currentUser?.name || 'Main Receptionist');
                                    refreshData();
                                    showToast(`Order ${ord.id} marked DELIVERED!`);
                                  }}
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                    ord.orderStatus === 'Delivered'
                                      ? 'bg-sky-600 text-white shadow-md'
                                      : 'bg-sky-600/80 hover:bg-sky-500 text-white'
                                  }`}
                                >
                                  ✓ Delivered
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: `My Desk Orders (${diningOrders.filter(isDeskDiningOrder).length})` },
                ...(getDeskBuilding() === 'Main Building' || getDeskBuilding() === 'all'
                  ? [
                      { id: 'outside', label: `Outside Room Orders (${diningOrders.filter(isOutsideRoomOrder).length})` },
                      { id: 'main_suites', label: 'Main Suites (600 Wing)' }
                    ]
                  : [
                      { id: 'ext_suites', label: 'Extension Suites (100 Wing)' }
                    ]),
                { id: 'room_unpaid', label: 'Unsettled Room Bills' },
                { id: 'food', label: 'Food Only (ARB-FDD)' },
                { id: 'drinks', label: 'Drinks Only (ARB-DRK)' },
                { id: 'view_all', label: `All Hotel Orders (${diningOrders.length})` }
              ].map((flt) => (
                <button
                  key={flt.id}
                  onClick={() => setDiningOrderFilter(flt.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    diningOrderFilter === flt.id
                      ? 'bg-[#5c0725] text-[#f3e5ab] border-[#d4af37]'
                      : 'bg-white/5 text-gray-400 hover:text-white border-white/10'
                  }`}
                >
                  {flt.label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#16030c] shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#120208] text-gray-400 uppercase tracking-wider border-b border-white/10 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order Code</th>
                    <th className="py-3 px-4">Guest & Destination</th>
                    <th className="py-3 px-4">Items Ordered</th>
                    <th className="py-3 px-4">Amount & Billing</th>
                    <th className="py-3 px-4">Kitchen / Bar Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(diningOrders || [])
                    .filter((o) => {
                      if (!o) return false;
                      const q = String(searchQuery || '').trim().toLowerCase();
                      const matchQ =
                        !q ||
                        String(o.id || '').toLowerCase().includes(q) ||
                        String(o.guestName || '').toLowerCase().includes(q) ||
                        (o.bookingId && String(o.bookingId).toLowerCase().includes(q)) ||
                        (o.roomNumber && String(o.roomNumber).includes(q)) ||
                        (o.serviceLocation && String(o.serviceLocation).toLowerCase().includes(q));
                      if (!matchQ) return false;

                      // Desk assignment filter unless user chose 'view_all'
                      if (diningOrderFilter !== 'view_all' && !isDeskDiningOrder(o)) return false;

                      if (diningOrderFilter === 'outside') return isOutsideRoomOrder(o);
                      if (diningOrderFilter === 'main_suites') return !isOutsideRoomOrder(o) && String(o.roomNumber || '').startsWith('6');
                      if (diningOrderFilter === 'ext_suites') return !isOutsideRoomOrder(o) && String(o.roomNumber || '').startsWith('1');
                      if (diningOrderFilter === 'room_unpaid') return o.paymentStatus !== 'Paid';
                      if (diningOrderFilter === 'food') return o.orderType === 'food';
                      if (diningOrderFilter === 'drinks') return o.orderType === 'drinks';
                      return true;
                    })
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-xs inline-block border ${
                              ord.orderType === 'drinks'
                                ? 'bg-purple-500/20 text-purple-200 border-purple-400/40'
                                : 'bg-[#d4af37]/20 text-[#f3e5ab] border-[#d4af37]/40'
                            }`}
                          >
                            {ord.id}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-0.5">{ord.createdAt}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{ord.guestName}</div>
                          {isOutsideRoomOrder(ord) ? (
                            <div className="mt-1">
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold inline-flex items-center gap-1">
                                <Utensils size={10} />
                                <span>Outside Room • {ord.serviceLocation || 'Restaurant / Lounge'}</span>
                              </span>
                              {ord.phone && <div className="text-[10px] text-gray-400 font-mono mt-0.5">Tel: {ord.phone}</div>}
                            </div>
                          ) : (
                            <div className="mt-0.5">
                              <span className="text-[11px] font-mono text-[#f3e5ab]">
                                Suite #{ord.roomNumber} • {ord.bookingId} ({ord.building || 'In-Room'})
                              </span>
                              {ord.phone && <div className="text-[10px] text-gray-400 font-mono">Tel: {ord.phone}</div>}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="text-gray-200">
                            {(ord.items || []).map((it) => `${it.qty}x ${it.name}`).join(', ')}
                          </div>
                          {ord.notes && <div className="text-[10px] text-amber-300 italic mt-0.5">Note: {ord.notes}</div>}
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-[#f3e5ab]">₦{Number(ord.amount).toLocaleString()}</div>
                          <span
                            className={`text-[10px] font-bold ${
                              ord.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-300'
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => {
                              portalStore.updateDiningOrderStatus(ord.id, e.target.value, currentUser?.name || 'Main Receptionist');
                              refreshData();
                              showToast(`Order ${ord.id} marked ${e.target.value}`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready for Pickup">Ready for Pickup</option>
                            <option value="Picked Up">Picked Up</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          {ord.fulfilledAt && (
                            <span className="text-[9px] text-emerald-400 font-mono block mt-1">
                              ✓ {ord.orderStatus} • {ord.fulfilledAt}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => setInspectedDiningOrder(ord)}
                              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[10px] font-semibold flex items-center gap-1 transition-all"
                              title="Inspect Order Details"
                            >
                              <Eye size={11} className="text-[#d4af37]" />
                              <span>Info</span>
                            </button>

                            <button
                              onClick={() => {
                                portalStore.updateDiningOrderStatus(ord.id, 'Picked Up', currentUser?.name || 'Main Receptionist');
                                refreshData();
                                showToast(`Order ${ord.id} marked PICKED UP!`);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                ord.orderStatus === 'Picked Up'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-emerald-600/25 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40'
                              }`}
                            >
                              Picked Up
                            </button>

                            <button
                              onClick={() => {
                                portalStore.updateDiningOrderStatus(ord.id, 'Delivered', currentUser?.name || 'Main Receptionist');
                                refreshData();
                                showToast(`Order ${ord.id} marked DELIVERED!`);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                ord.orderStatus === 'Delivered'
                                  ? 'bg-sky-600 text-white'
                                  : 'bg-sky-600/25 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/40'
                              }`}
                            >
                              Delivered
                            </button>

                            {ord.paymentStatus !== 'Paid' && ord.orderStatus !== 'Cancelled' ? (
                              <button
                                onClick={() => {
                                  portalStore.settleSingleDiningOrder(ord.id, 'POS Terminal (Front Desk)');
                                  refreshData();
                                  showToast(`Order ${ord.id} settled & marked PAID!`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white text-[10px] font-bold transition-all"
                              >
                                Mark Paid
                              </button>
                            ) : (
                              <span className="text-[10px] font-mono text-emerald-400 font-semibold px-1.5">Settled</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. TAB CONTENT: FRONT DESK WING INTERCOM CHAT */}
        {/* ======================================================== */}
        {activeTab === 'chat' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            
            {/* Intercom Channel Header */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1c040e] via-[#2a0616] to-[#16030c] border border-[#d4af37]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#5c0725] border border-[#d4af37]/50 text-[#d4af37] shadow-md flex-shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-cinzel font-bold text-base sm:text-lg text-white">
                      Front Desk Shift Intercom & Wing Coordination
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Frequency Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    Direct communication channel between <strong>Main Building Desk (600 Wing)</strong> and <strong>Extension Wing Desk (100 Wing)</strong>.
                  </p>
                </div>
              </div>

              {/* Status Desks Info */}
              <div className="flex items-center gap-2 self-start md:self-auto text-xs font-mono">
                <span className="px-2.5 py-1 rounded-xl bg-[#5c0725]/50 border border-[#d4af37]/30 text-[#f3e5ab]">
                  Main Desk (600 Wing)
                </span>
                <span className="text-gray-500">⇄</span>
                <span className="px-2.5 py-1 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300">
                  Extension Desk (100 Wing)
                </span>
              </div>
            </div>

            {/* Retention Policy Banner */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#d4af37] flex-shrink-0" />
                <span className="text-[11px]">
                  <strong>Retention Policy:</strong> Chat messages are retained for <strong>7 days</strong> on front desk terminals (Archived up to 30 days for GM Executive Audit).
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-500">
                {chatMessages.length} messages in current 7-day window
              </span>
            </div>

            {/* Chat Messages Feed */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#120208] border border-white/10 shadow-2xl min-h-[420px] max-h-[550px] overflow-y-auto space-y-4 flex flex-col">
              {chatMessages.length === 0 ? (
                <div className="m-auto text-center py-12 space-y-2">
                  <MessageSquare size={32} className="mx-auto text-gray-600 opacity-60" />
                  <p className="text-xs text-gray-400 font-medium">No messages within the 7-day retention window.</p>
                  <p className="text-[11px] text-gray-500">Send a message below to coordinate with the other reception desk.</p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const desk = getDeskBuilding();
                  const isMyMessage = msg.senderBuilding === desk && msg.senderRole === 'reception';
                  const isAdminBroadcast = msg.senderRole === 'admin' || msg.senderBuilding === 'all';

                  if (isAdminBroadcast) {
                    return (
                      <div key={msg.id} className="mx-auto max-w-xl w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#2e1903]/80 via-[#3d2003]/90 to-[#2e1903]/80 border border-[#d4af37]/60 text-center shadow-lg space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#f3e5ab] uppercase tracking-wider">
                          <Sparkles size={12} className="text-[#d4af37]" />
                          <span>Executive GM Broadcast</span>
                          <span className="text-gray-400 font-normal font-mono">• {msg.timestamp} ({msg.dateFormatted || 'Today'})</span>
                        </div>
                        <p className="text-xs text-white leading-relaxed font-medium">
                          {msg.text}
                        </p>
                      </div>
                    );
                  }

                  const categoryColors = {
                    general: 'bg-white/10 text-gray-300 border-white/10',
                    handover: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                    inquiry: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
                    urgent: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  };

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'} max-w-xl ${isMyMessage ? 'ml-auto' : 'mr-auto'}`}
                    >
                      {/* Sender Meta */}
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-1 px-1">
                        <span className="font-semibold text-gray-300">
                          {msg.senderName}
                        </span>
                        <span>•</span>
                        <span className={`px-1.5 py-0.2 rounded font-mono ${
                          msg.senderBuilding === 'Main Building'
                            ? 'text-[#f3e5ab]'
                            : 'text-sky-300'
                        }`}>
                          {msg.senderBuilding === 'Main Building' ? 'Main Desk (600)' : 'Ext Desk (100)'}
                        </span>
                        <span>•</span>
                        <span className="text-gray-500 font-mono">{msg.timestamp}</span>
                        {msg.category && msg.category !== 'general' && (
                          <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold border ml-1 ${categoryColors[msg.category] || categoryColors.general}`}>
                            {msg.category}
                          </span>
                        )}
                      </div>

                      {/* Bubble */}
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg border ${
                        isMyMessage
                          ? msg.senderBuilding === 'Extension Building'
                            ? 'bg-gradient-to-br from-[#1e1b4b] to-[#2d2a6e] text-white border-sky-500/40 rounded-tr-none'
                            : 'bg-gradient-to-br from-[#5c0725] to-[#7a0a32] text-white border-[#d4af37]/40 rounded-tr-none'
                          : 'bg-[#1b0812] text-gray-200 border-white/15 rounded-tl-none'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Quick Preset Action Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-gray-500 text-[10px] uppercase font-semibold mr-1">Quick Notes:</span>
              {[
                { label: "Guest arriving at Main with luggage", cat: "handover" },
                { label: "Is Diplomatic Suite #107 ready for check-in?", cat: "inquiry" },
                { label: "Keys received and guest escorted to room", cat: "handover" },
                { label: "Airport pickup arrival expected shortly", cat: "general" }
              ].map((snippet, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setChatInput(snippet.label);
                    setChatCategory(snippet.cat);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all text-[11px]"
                >
                  {snippet.label}
                </button>
              ))}
            </div>

            {/* Message Composer */}
            <form onSubmit={handleSendChatMessage} className="p-3.5 rounded-2xl bg-[#16030c] border border-white/10 space-y-3 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Category:</span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'general', label: 'General' },
                      { id: 'handover', label: 'Guest Handover' },
                      { id: 'inquiry', label: 'Room Inquiry' },
                      { id: 'urgent', label: 'Urgent' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setChatCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          chatCategory === cat.id
                            ? 'bg-[#5c0725] text-[#f3e5ab] border border-[#d4af37]/60 font-semibold shadow-sm'
                            : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-[10px] text-gray-500 font-mono">
                  Transmitting as: <strong className="text-gray-300">{getDeskBuilding() === 'Main Building' ? 'Main Desk (600 Wing)' : 'Extension Desk (100 Wing)'}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder={`Type a message to ${getDeskBuilding() === 'Main Building' ? 'Extension Wing Desk (100 Wing)' : 'Main Building Desk (600 Wing)'}...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                />

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Send</span>
                  <ArrowRight size={14} className="stroke-[2.5]" />
                </button>
              </div>
            </form>

          </div>
        )}

        {/* Front Desk Platform Footer Credit */}
        <footer className="mt-12 pt-6 pb-2 border-t border-white/10 text-center text-[11px] text-gray-500 space-y-1">
          <div>Arab Signature Hotel & Suites • Front Desk Reception Terminal</div>
          <div>Hospitality Software Infrastructure • Built by <a href="https://kinggold-one.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:text-[#f3e5ab] font-semibold underline underline-offset-2 transition-colors">Microbase</a></div>
        </footer>

      </div>

      {/* Floating Quick Intercom Access Button */}
      {activeTab !== 'chat' && (
        <button
          onClick={() => setActiveTab('chat')}
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#5c0725] to-[#7a0a32] border border-[#d4af37]/60 text-[#f3e5ab] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 font-semibold text-xs group cursor-pointer"
          title="Open Live Front Desk Intercom"
        >
          <div className="relative">
            <MessageSquare size={16} className="text-[#d4af37]" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
          </div>
          <span>Wing Intercom</span>
          {unreadChatCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold animate-bounce shadow-lg">
              {unreadChatCount} NEW
            </span>
          ) : chatMessages.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-black/60 border border-[#d4af37]/40 text-[#f3e5ab] text-[10px] font-mono">
              {chatMessages.length}
            </span>
          )}
        </button>
      )}

      {/* ======================================================== */}
      {/* 6. MODAL: COUNTER BOOKING & CUSTOMER CODE GENERATOR       */}
      {/* ======================================================== */}
      {isWalkInOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#16030c] border border-[#d4af37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#5c0725] border border-[#d4af37]/50 text-[#d4af37]">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-base sm:text-lg text-white">
                    Counter Room Assignment & Code Generator
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Generate official Guest Portal Booking Code ({getDeskBuilding() === 'Extension Building' ? 'ARS-EXT-...' : 'ARS-BGD-...'}) at the Counter
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

              {/* LIVE OFFICIAL BOOKING CODE GENERATOR BOX */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2e0515] via-[#1c030d] to-[#120208] border border-[#d4af37]/55 shadow-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold flex items-center gap-1.5">
                    <Sparkles size={12} />
                    CUSTOMER PORTAL BOOKING CODE ({String(walkInForm.roomNumber).startsWith('1') ? 'EXTENSION 100 WING' : 'MAIN 600 WING'})
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300">Unique Non-Repeating</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 bg-black/60 px-4 py-3 rounded-xl border border-[#d4af37]/40">
                  <span className="font-mono text-xl sm:text-2xl font-extrabold tracking-wider text-[#f3e5ab]">
                    {walkInForm.generatedCode || generateCounterBookingCode(walkInForm.roomNumber, walkInForm.roomType)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = generateCounterBookingCode(walkInForm.roomNumber, walkInForm.roomType);
                        setWalkInForm((prev) => ({ ...prev, generatedCode: next }));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-gray-200 font-mono text-[11px] font-semibold flex items-center gap-1 transition-all"
                      title="Generate a fresh random booking code"
                    >
                      <RefreshCw size={12} className="text-[#d4af37]" />
                      <span>Regenerate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const codeToCopy = walkInForm.generatedCode;
                        if (codeToCopy) {
                          navigator.clipboard?.writeText(codeToCopy);
                          setCopiedGeneratedCode(true);
                          setTimeout(() => setCopiedGeneratedCode(false), 2000);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37] hover:text-black border border-[#d4af37]/40 text-[#f3e5ab] font-mono text-[11px] font-bold flex items-center gap-1 transition-all"
                    >
                      {copiedGeneratedCode ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedGeneratedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Counter Mode Toggle: Immediate Check-In vs Counter Reservation Hold */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setWalkInForm((prev) => ({ ...prev, bookingMode: 'Checked In' }))}
                    className={`py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      walkInForm.bookingMode === 'Checked In'
                        ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    <span>Assign & Check In Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWalkInForm((prev) => ({ ...prev, bookingMode: 'Reservation Hold' }))}
                    className={`py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      walkInForm.bookingMode === 'Reservation Hold'
                        ? 'bg-sky-950/70 border-sky-400 text-sky-200 ring-1 ring-sky-400'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Calendar size={13} />
                    <span>Counter Reservation Hold</span>
                  </button>
                </div>
              </div>
              
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

              {/* Contact Info (Phone & Email) + Returning Guest Auto-Recognition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0803 000 0000"
                    value={walkInForm.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      const ret = portalStore.detectReturningCustomer({ phone: val });
                      setReturningPatronHint(ret);
                      setWalkInForm((prev) => ({
                        ...prev,
                        phone: val,
                        guestName: !prev.guestName && ret?.previousGuestName ? ret.previousGuestName : prev.guestName,
                        email: !prev.email && ret?.previousEmail ? ret.previousEmail : prev.email
                      }));
                    }}
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

              {/* Client Home Address */}
              <div className="space-y-1">
                <label className="text-gray-300 font-medium flex items-center gap-1">
                  <MapPin size={12} className="text-[#d4af37]" />
                  <span>Client Home / Residential Address *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plot 12 GRA, Onitsha / 15 Ozalla Street"
                  value={walkInForm.homeAddress}
                  onChange={(e) => setWalkInForm({ ...walkInForm, homeAddress: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Next of Kin Emergency Contact */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Heart size={13} className="text-[#d4af37]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold">
                    Next of Kin Information (Emergency Contact) *
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-gray-400 text-[11px]">Next of Kin Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Full Legal Name"
                      value={walkInForm.nextOfKinName}
                      onChange={(e) => setWalkInForm({ ...walkInForm, nextOfKinName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-gray-400 text-[11px]">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0802 000 0000"
                      value={walkInForm.nextOfKinPhone}
                      onChange={(e) => setWalkInForm({ ...walkInForm, nextOfKinPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-gray-400 text-[11px]">Relationship</label>
                    <select
                      value={walkInForm.nextOfKinRelationship}
                      onChange={(e) => setWalkInForm({ ...walkInForm, nextOfKinRelationship: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1b0812] border border-white/15 text-white text-xs focus:outline-none focus:border-[#d4af37] cursor-pointer"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Relative">Relative</option>
                      <option value="Business Associate">Business Associate</option>
                    </select>
                  </div>
                </div>
              </div>

              {returningPatronHint && (
                <div className="p-2.5 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[11px] text-[#f3e5ab] flex items-center gap-2 font-mono">
                  <Sparkles size={13} className="text-[#d4af37] flex-shrink-0" />
                  <span>
                    Returning VIP Patron Recognized: <strong>{returningPatronHint.previousGuestName}</strong> ({returningPatronHint.totalPreviousStays} past stays) — New non-repeating code assigned!
                  </span>
                </div>
              )}

              {/* Suite Selection & Available Room Key */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Suite Category</label>
                  <select
                    value={walkInForm.roomType}
                    onChange={(e) => handleRoomTypeChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {rates
                      .filter(r => rooms.some(room => room.type === r.id && isDeskRoom(room)))
                      .map((r) => (
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
                    onChange={(e) => {
                      const nextRoom = e.target.value;
                      const nextCode = generateCounterBookingCode(nextRoom, walkInForm.roomType);
                      setWalkInForm({ ...walkInForm, roomNumber: nextRoom, generatedCode: nextCode });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {rooms
                      .filter(r => r.type === walkInForm.roomType && r.status === 'available' && isDeskRoom(r))
                      .map(r => (
                        <option key={r.roomNumber} value={r.roomNumber}>
                          Room #{r.roomNumber} • {r.building || r.floor} (₦{r.price.toLocaleString()})
                        </option>
                      ))}
                    {rooms.filter(r => r.type === walkInForm.roomType && r.status === 'available' && isDeskRoom(r)).length === 0 && (
                      <option value="">No vacant room for your desk</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Dates & Duration or Reservation Date + Proof of Payment */}
              {walkInForm.bookingMode === 'Reservation Hold' ? (
                /* COUNTER RESERVATION HOLD MODE: Expected Check-In, Reservation Date, Duration of Stay & Proof of Payment */
                <div className="space-y-3 p-3.5 rounded-2xl bg-sky-950/20 border border-sky-500/40">
                  <div className="flex items-center justify-between text-sky-300 text-[11px] font-mono font-bold">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-sky-400" />
                      <span>Counter Reservation Hold (Reserve & Go Out)</span>
                    </div>
                    {walkInForm.checkOut && (
                      <span className="text-[10px] text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-white/10 font-normal">
                        Vacate: {walkInForm.checkOut}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-gray-300 font-medium text-xs flex items-center gap-1">
                        <Calendar size={12} className="text-sky-400" />
                        <span>Reservation Date *</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={walkInForm.reservationDate}
                        onChange={(e) => setWalkInForm({ ...walkInForm, reservationDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-sky-500/50 text-sky-200 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-300 font-medium text-xs flex items-center gap-1">
                        <Calendar size={12} className="text-emerald-400" />
                        <span>Expected Check-In *</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={walkInForm.expectedCheckIn || walkInForm.checkIn}
                        onChange={(e) => handleExpectedCheckInChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-emerald-500/50 text-emerald-200 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-300 font-medium text-xs flex items-center gap-1">
                        <Clock size={12} className="text-[#d4af37]" />
                        <span>Duration of Stay (Nights) *</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={walkInForm.nights}
                        onChange={(e) => handleNightsChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  {/* Dedicated Space for Proof of Payment Image & Ref (Optional) */}
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-[#d4af37]/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-200 font-medium text-xs flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-[#d4af37]" />
                        <span>Proof of Payment Slip (Image / Teller / POS)</span>
                      </label>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-mono">
                        Optional • Auto-Compressed
                      </span>
                    </div>

                    {walkInForm.proofOfPaymentImage ? (
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={walkInForm.proofOfPaymentImage}
                            alt="Proof Slip"
                            className="w-12 h-12 object-cover rounded-lg border border-[#d4af37]/40 shadow cursor-pointer hover:opacity-90"
                            onClick={() => setSelectedProofBooking({
                              id: walkInForm.generatedCode,
                              guestName: walkInForm.guestName || 'Hold Guest',
                              phone: walkInForm.phone,
                              proofOfPaymentImage: walkInForm.proofOfPaymentImage,
                              proofOfPayment: walkInForm.proofOfPayment,
                              amount: walkInForm.amount,
                              roomName: rates.find(r => r.id === walkInForm.roomType)?.name || 'Arab Suite',
                              roomNumber: walkInForm.roomNumber,
                              nights: walkInForm.nights,
                              paymentMethod: walkInForm.paymentMethod
                            })}
                          />
                          <div>
                            <span className="text-white text-xs font-semibold block">Slip Attached & Compressed</span>
                            {walkInForm.proofImageMeta && (
                              <span className="text-[10px] text-emerald-400 font-mono block">
                                {formatFileSize(walkInForm.proofImageMeta.compressedSize)} (-{walkInForm.proofImageMeta.reductionPercent}%) • Ready to save
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedProofBooking({
                                id: walkInForm.generatedCode,
                                guestName: walkInForm.guestName || 'Hold Guest',
                                phone: walkInForm.phone,
                                proofOfPaymentImage: walkInForm.proofOfPaymentImage,
                                proofOfPayment: walkInForm.proofOfPayment,
                                amount: walkInForm.amount,
                                roomName: rates.find(r => r.id === walkInForm.roomType)?.name || 'Arab Suite',
                                roomNumber: walkInForm.roomNumber,
                                nights: walkInForm.nights,
                                paymentMethod: walkInForm.paymentMethod
                              })}
                              className="text-[10px] text-[#d4af37] underline hover:text-white mt-0.5 inline-block cursor-pointer"
                            >
                              Inspect Full Image
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveProofImage}
                          className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Remove</span>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <label className={`w-full flex flex-col items-center justify-center p-3.5 rounded-xl border-2 border-dashed border-white/20 hover:border-[#d4af37]/60 bg-white/5 hover:bg-white/10 transition-all cursor-pointer text-center ${
                          isCompressingProof ? 'opacity-50 pointer-events-none' : ''
                        }`}>
                          <Upload size={18} className="text-[#d4af37] mb-1" />
                          <span className="text-xs text-white font-medium">
                            {isCompressingProof ? 'Compressing Slip Image...' : 'Click or tap to upload proof slip / receipt image'}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-0.5">
                            Auto-compressed & saved to Vercel server for Admin/Accountant (Optional)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProofImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-gray-400 text-[11px] flex items-center justify-between">
                        <span>Teller Slip # / Bank Reference / POS RRN (Optional)</span>
                        <span className="text-[10px] font-mono text-gray-500">Optional text note</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TRF/GTB/928401928, POS Terminal RRN #849201, Teller Slip #48201"
                        value={walkInForm.proofOfPayment}
                        onChange={(e) => setWalkInForm({ ...walkInForm, proofOfPayment: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-white placeholder-gray-500 font-mono text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* ASSIGN & CHECK IN NOW MODE: Standard Check-In Date */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-gray-300 font-medium flex items-center gap-1">
                        <Calendar size={12} className="text-emerald-400" />
                        <span>Check-In Date *</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={walkInForm.checkIn}
                        onChange={(e) => handleCheckInDateChange(e.target.value)}
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

                  {/* Optional Proof of Payment slip/image for immediate check-in */}
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300 font-medium text-xs flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-[#d4af37]" />
                        <span>Proof of Payment Slip (Optional Image / Slip)</span>
                      </label>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10 font-mono">
                        Optional
                      </span>
                    </div>

                    {walkInForm.proofOfPaymentImage ? (
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={walkInForm.proofOfPaymentImage}
                            alt="Proof Slip"
                            className="w-12 h-12 object-cover rounded-lg border border-[#d4af37]/40 shadow cursor-pointer hover:opacity-90"
                            onClick={() => setSelectedProofBooking({
                              id: walkInForm.generatedCode,
                              guestName: walkInForm.guestName || 'Checked-In Guest',
                              phone: walkInForm.phone,
                              proofOfPaymentImage: walkInForm.proofOfPaymentImage,
                              proofOfPayment: walkInForm.proofOfPayment,
                              amount: walkInForm.amount,
                              roomName: rates.find(r => r.id === walkInForm.roomType)?.name || 'Arab Suite',
                              roomNumber: walkInForm.roomNumber,
                              nights: walkInForm.nights,
                              paymentMethod: walkInForm.paymentMethod
                            })}
                          />
                          <div>
                            <span className="text-white text-xs font-semibold block">Slip Attached & Compressed</span>
                            {walkInForm.proofImageMeta && (
                              <span className="text-[10px] text-emerald-400 font-mono block">
                                {formatFileSize(walkInForm.proofImageMeta.compressedSize)} (-{walkInForm.proofImageMeta.reductionPercent}%)
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedProofBooking({
                                id: walkInForm.generatedCode,
                                guestName: walkInForm.guestName || 'Checked-In Guest',
                                phone: walkInForm.phone,
                                proofOfPaymentImage: walkInForm.proofOfPaymentImage,
                                proofOfPayment: walkInForm.proofOfPayment,
                                amount: walkInForm.amount,
                                roomName: rates.find(r => r.id === walkInForm.roomType)?.name || 'Arab Suite',
                                roomNumber: walkInForm.roomNumber,
                                nights: walkInForm.nights,
                                paymentMethod: walkInForm.paymentMethod
                              })}
                              className="text-[10px] text-[#d4af37] underline hover:text-white mt-0.5 inline-block cursor-pointer"
                            >
                              Inspect Full Image
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveProofImage}
                          className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Remove</span>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <label className={`w-full flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-white/20 hover:border-[#d4af37]/60 bg-white/5 hover:bg-white/10 transition-all cursor-pointer text-center ${
                          isCompressingProof ? 'opacity-50 pointer-events-none' : ''
                        }`}>
                          <Upload size={16} className="text-[#d4af37] mb-1" />
                          <span className="text-xs text-white font-medium">
                            {isCompressingProof ? 'Compressing Slip...' : 'Upload POS slip / transfer screenshot (Optional)'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProofImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder="POS Terminal RRN #849201, Transfer Ref, or Slip # (Optional)"
                        value={walkInForm.proofOfPayment}
                        onChange={(e) => setWalkInForm({ ...walkInForm, proofOfPayment: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 font-mono text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                </div>
              )}

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
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-101 active:scale-99 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>
                    {walkInForm.bookingMode === 'Reservation Hold'
                      ? `Issue Code ${walkInForm.generatedCode} & Confirm Reservation Hold`
                      : `Issue Code ${walkInForm.generatedCode} & Check In Now`}
                  </span>
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
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleSendWhatsApp(selectedReceiptBooking)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  title={`Send Official Receipt Image via WhatsApp to ${selectedReceiptBooking.phone}`}
                >
                  <MessageSquare size={14} />
                  <span>Send Image to WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadReceiptImageSlip(selectedReceiptBooking)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  title="Download Official Receipt Slip (.png)"
                >
                  <Download size={14} />
                  <span>Image Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => printFolioReceipt(selectedReceiptBooking)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#5c0725] text-white hover:bg-[#3d0418] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceiptBooking(null)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 cursor-pointer"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <div className="text-gray-400 font-medium text-[10px] uppercase tracking-wider">Guest Details & Address</div>
                  <div className="font-bold text-gray-900 text-sm mt-0.5">{selectedReceiptBooking.guestName}</div>
                  <div className="text-gray-600 text-[11px] font-mono">{selectedReceiptBooking.phone} {selectedReceiptBooking.email ? `• ${selectedReceiptBooking.email}` : ''}</div>
                  {selectedReceiptBooking.homeAddress && (
                    <div className="text-gray-700 text-[11px] mt-1">
                      <strong className="text-gray-900">Address:</strong> {selectedReceiptBooking.homeAddress}
                    </div>
                  )}
                  {selectedReceiptBooking.nextOfKinName && (
                    <div className="text-gray-700 text-[11px] mt-0.5">
                      <strong className="text-gray-900">Next of Kin:</strong> {selectedReceiptBooking.nextOfKinName} ({selectedReceiptBooking.nextOfKinPhone} • {selectedReceiptBooking.nextOfKinRelationship})
                    </div>
                  )}
                </div>
                <div className="sm:text-right">
                  <div className="text-gray-400 font-medium text-[10px] uppercase tracking-wider">Invoice & Reservation Meta</div>
                  <div className="font-mono font-bold text-[#5c0725] text-sm mt-0.5">{selectedReceiptBooking.id}</div>
                  <div className="text-gray-600 text-[11px]">Issued: {new Date().toLocaleDateString()}</div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase inline-block ${
                      selectedReceiptBooking.bookingMode === 'Reservation Hold'
                        ? 'bg-sky-100 text-sky-800 border border-sky-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {selectedReceiptBooking.bookingMode === 'Reservation Hold' ? 'Counter Reservation Hold' : 'Assigned & Checked In'}
                    </span>
                  </div>
                  {selectedReceiptBooking.reservationDate && selectedReceiptBooking.bookingMode === 'Reservation Hold' && (
                    <div className="text-gray-800 text-[11px] mt-1 font-mono">
                      Reservation Date: <strong>{selectedReceiptBooking.reservationDate}</strong>
                    </div>
                  )}
                  {selectedReceiptBooking.expectedCheckIn && selectedReceiptBooking.bookingMode === 'Reservation Hold' && (
                    <div className="text-gray-800 text-[11px] mt-0.5 font-mono">
                      Expected Check-In: <strong>{selectedReceiptBooking.expectedCheckIn}</strong>
                    </div>
                  )}
                  {selectedReceiptBooking.bookingMode === 'Reservation Hold' && (
                    <div className="text-gray-800 text-[11px] mt-0.5 font-mono">
                      Duration of Stay: <strong>{selectedReceiptBooking.nights} {selectedReceiptBooking.nights === 1 ? 'Night' : 'Nights'}</strong>
                    </div>
                  )}
                  {selectedReceiptBooking.proofOfPayment && (
                    <div className="text-gray-800 text-[11px] mt-0.5 font-mono">
                      Proof of Payment: <strong>{selectedReceiptBooking.proofOfPayment}</strong>
                    </div>
                  )}
                  {selectedReceiptBooking.proofOfPaymentImage && (
                    <div className="mt-1.5 flex items-center gap-1.5 sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedProofBooking(selectedReceiptBooking)}
                        className="px-2 py-1 rounded bg-[#5c0725]/10 hover:bg-[#5c0725]/20 border border-[#5c0725]/30 text-[#5c0725] text-[10px] font-bold inline-flex items-center gap-1 print:hidden cursor-pointer"
                      >
                        <ImageIcon size={11} />
                        <span>View Attached Proof Slip</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stay & Attached Food/Drink Room Bill Breakdown Table */}
              {(() => {
                const recFolio = portalStore.getBookingFolioSummary(selectedReceiptBooking);
                return (
                  <>
                    <div className="p-3 rounded-xl bg-[#5c0725]/10 border border-[#5c0725]/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                          Customer Portal Login Booking Code
                        </span>
                        <span className="font-mono text-base font-extrabold text-[#5c0725]">
                          {selectedReceiptBooking.id}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(selectedReceiptBooking.id);
                          showToast(`Copied booking code ${selectedReceiptBooking.id}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#5c0725] text-white text-[11px] font-bold print:hidden flex items-center gap-1"
                      >
                        <Copy size={12} />
                        <span>Copy Code</span>
                      </button>
                    </div>

                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-300 text-gray-500 uppercase tracking-wider text-[10px]">
                          <th className="py-2 text-left">Item / Accommodation</th>
                          <th className="py-2 text-center">Ref / Room</th>
                          <th className="py-2 text-center">Qty / Nights</th>
                          <th className="py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-3">
                            <div className="font-bold text-gray-900">{selectedReceiptBooking.roomName}</div>
                            <div className="text-[10px] text-gray-500">
                              {selectedReceiptBooking.bookingMode === 'Reservation Hold'
                                ? `Res: ${selectedReceiptBooking.reservationDate || selectedReceiptBooking.checkIn} | Exp. Check-In: ${selectedReceiptBooking.expectedCheckIn || selectedReceiptBooking.checkIn} (${selectedReceiptBooking.nights} Nights Stay)`
                                : `${selectedReceiptBooking.checkIn} to ${selectedReceiptBooking.checkOut}`}
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
                        {recFolio.diningOrders.map((ord) => (
                          <tr key={ord.id}>
                            <td className="py-2.5">
                              <div className="font-semibold text-gray-800">
                                {ord.items.map((it) => `${it.qty}x ${it.name}`).join(', ')}
                              </div>
                              <div className="text-[10px] text-gray-500">{ord.paymentStatus}</div>
                            </td>
                            <td className="py-2.5 text-center font-mono text-[11px] font-bold text-[#5c0725]">
                              {ord.id}
                            </td>
                            <td className="py-2.5 text-center">
                              {ord.orderType === 'drinks' ? 'VIP Bar' : 'Kitchen'}
                            </td>
                            <td className="py-2.5 text-right font-mono font-semibold text-gray-900">
                              ₦{Number(ord.amount).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Financial Totals */}
                    <div className="border-t-2 border-gray-200 pt-4 space-y-1.5 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>Suite Accommodation:</span>
                        <span className="font-mono">₦{Number(recFolio.roomAmount).toLocaleString()}</span>
                      </div>
                      {recFolio.totalDiningAmount > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Attached Food & Drink Orders ({recFolio.diningOrders.length}):</span>
                          <span className="font-mono">₦{Number(recFolio.totalDiningAmount).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold text-[#5c0725] pt-2 border-t border-gray-200">
                        <span>Grand Total Folio:</span>
                        <span className="font-mono text-base">₦{Number(recFolio.grandTotalBill).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold">
                        <span>Balance Due:</span>
                        <span className={recFolio.balanceDue > 0 ? 'font-mono text-amber-700' : 'font-mono text-emerald-700'}>
                          {recFolio.balanceDue > 0 ? `₦${recFolio.balanceDue.toLocaleString()} (UNSETTLED)` : '₦0.00 (SETTLED IN FULL)'}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-emerald-700 pt-1 font-semibold">
                        <span>Payment Channel:</span>
                        <span>{selectedReceiptBooking.paymentMethod} (VERIFIED)</span>
                      </div>
                    </div>
                  </>
                );
              })()}

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

              {/* Staff Dispatch Actions Bar: Send to WhatsApp & Print (Hidden in Print) */}
              <div className="p-4 rounded-2xl bg-[#5c0725]/5 border border-[#5c0725]/20 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                <div className="text-left">
                  <span className="font-bold text-gray-900 text-xs block">Official Guest Dispatch & Hardcopy</span>
                  <span className="text-[11px] text-gray-600">
                    Send full folio directly to customer's WhatsApp (<strong className="font-mono text-gray-900">{selectedReceiptBooking.phone}</strong>) or print for physical filing.
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleSendWhatsApp(selectedReceiptBooking)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    title="Send official receipt slip image directly to guest WhatsApp"
                  >
                    <MessageSquare size={15} />
                    <span>Send Image to WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadReceiptImageSlip(selectedReceiptBooking)}
                    className="px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    title="Download receipt slip as high-resolution PNG"
                  >
                    <Download size={14} />
                    <span>Image (.png)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => printFolioReceipt(selectedReceiptBooking)}
                    className="px-4 py-2.5 rounded-xl bg-[#5c0725] hover:bg-[#3d0418] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Printer size={15} />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Proof of Payment Lightbox Modal */}
      {selectedProofBooking && (
        <ProofOfPaymentModal
          booking={selectedProofBooking}
          onClose={() => setSelectedProofBooking(null)}
        />
      )}

      {/* Modal: Read-Only Dining & Bar Menu Lookup for Front Desk */}
      {isDiningMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[#16030c] border border-[#d4af37]/40 shadow-2xl p-6 sm:p-8 flex flex-col space-y-5 overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Utensils size={18} className="text-[#d4af37]" />
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                    Dining & Drinks Price Sheet
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Lock size={10} />
                    Read-Only (Admin Restricted)
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Menu prices are controlled exclusively by the Executive General Manager in the Admin Portal.
                </p>
              </div>

              <button
                onClick={() => setIsDiningMenuOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Counter Room Bill Selector + Search filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-shrink-0">
              <select
                value={counterChargeRoom}
                onChange={(e) => setCounterChargeRoom(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/80 border border-[#d4af37]/40 text-xs text-[#f3e5ab] focus:outline-none focus:border-[#d4af37]"
              >
                <option value="">Counter Walk-In Diner (Paid Immediately at POS)</option>
                {(bookings || [])
                  .filter((b) => b && ['Checked In', 'Confirmed'].includes(b.status) && isDeskBooking(b))
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      Add to Suite #{b.roomNumber} Bill — {b.guestName} ({b.id})
                    </option>
                  ))}
              </select>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search dish, champagne, Don Julio 1942, beer, cocktail..."
                  value={diningSearchQuery}
                  onChange={(e) => setDiningSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Items List (Scrollable & Read-Only) */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(diningMenu || [])
                  .filter((item) => {
                    if (!item) return false;
                    const q = String(diningSearchQuery || '').trim().toLowerCase();
                    if (!q) return true;
                    return (
                      String(item.name || '').toLowerCase().includes(q) ||
                      String(item.desc || '').toLowerCase().includes(q) ||
                      String(item.categoryLabel || '').toLowerCase().includes(q)
                    );
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-11 h-11 rounded-lg object-cover border border-[#d4af37]/40 flex-shrink-0 mt-0.5"
                          />
                        )}
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-white">
                              {item.name}
                            </span>
                            <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded-full uppercase ${item.type === 'drinks' ? 'bg-purple-950/70 text-purple-300' : 'bg-amber-950/70 text-amber-300'}`}>
                              {item.type}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono block">
                            {item.categoryLabel}
                          </span>
                          {item.pairingNote && (
                            <span className={`text-[10px] font-mono block ${item.requiresProtein ? 'text-amber-300' : 'text-emerald-300/80'}`}>
                              {item.pairingNote}
                            </span>
                          )}
                          <p className="text-[11px] text-gray-400 line-clamp-2">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 space-y-1.5">
                        <span className="font-mono text-sm font-bold text-[#d4af37] block">
                          ₦{Number(item.price).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCounterAddDiningToRoom(item)}
                          className="px-2.5 py-1 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37] hover:text-black border border-[#d4af37]/40 text-[#f3e5ab] text-[10px] font-mono font-bold transition-all"
                        >
                          {counterChargeRoom ? '+ Room Bill' : '+ Counter POS'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 flex-shrink-0">
              <span className="text-[11px] flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Authorized Front Desk Information Terminal</span>
              </span>
              <button
                onClick={() => setIsDiningMenuOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs"
              >
                Close Price Sheet
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 11. INSPECTED FOOD / DRINK ORDER HANDOVER MODAL */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* 12. QUICK FRONT DESK ORDER CODE LOOKUP & CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {isOrderLookupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setIsOrderLookupModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-gradient-to-b from-[#220410] via-[#15020a] to-[#0d0106] border-2 border-[#d4af37]/60 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#5c0725] border border-[#d4af37]/50 text-[#d4af37] shadow">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-lg text-white">
                    Front Desk Order Code Verification
                  </h3>
                  <p className="text-xs text-gray-400">
                    Enter customer's food (ARB-FDD-*) or drink (ARB-DRK-*) code to verify and confirm handover
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOrderLookupModalOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleLookupOrderCode} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af37]" />
                <input
                  type="text"
                  autoFocus
                  value={orderCodeInput}
                  onChange={(e) => {
                    setOrderCodeInput(e.target.value);
                    setOrderLookupError('');
                  }}
                  placeholder="ENTER ORDER CODE, E.G. ARB-FDD-784920-AB"
                  className="w-full pl-11 pr-10 py-3 rounded-xl bg-black/85 border-2 border-[#d4af37]/40 focus:border-[#d4af37] text-sm text-white placeholder-gray-500 font-mono tracking-wider uppercase transition-all outline-none"
                />
                {orderCodeInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setOrderCodeInput('');
                      setVerifiedOrder(null);
                      setOrderLookupError('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] hover:brightness-110 active:scale-98 text-black text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 size={16} className="text-black" />
                <span>Verify Code</span>
              </button>
            </form>

            {/* Quick Chips */}
            {diningOrders.filter(isOutsideRoomOrder).length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <span className="text-[11px] font-mono text-gray-400">Waiting for Pickup:</span>
                {diningOrders.filter(isOutsideRoomOrder).slice(0, 5).map((ord) => (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => {
                      setOrderCodeInput(ord.id);
                      handleLookupOrderCode(null, ord.id);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-[#f3e5ab] flex items-center gap-1.5 transition-all"
                  >
                    <span className="font-bold">{ord.id}</span>
                    <span className="text-gray-400 font-sans">({ord.guestName.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            )}

            {/* Error */}
            {orderLookupError && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
                <span>{orderLookupError}</span>
              </div>
            )}

            {/* Verified Order Details */}
            {verifiedOrder && (
              <div className="p-4 rounded-xl bg-black/70 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40">
                      {verifiedOrder.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      verifiedOrder.orderStatus === 'Picked Up' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {verifiedOrder.orderStatus}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#d4af37]">
                    ₦{Number(verifiedOrder.amount).toLocaleString()} ({verifiedOrder.paymentStatus})
                  </span>
                </div>

                {/* Front Desk Customer Identity Cross-Check Notice */}
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-amber-400 shrink-0" />
                    <span>
                      <strong>Handover Protocol:</strong> Cross-check customer name: <strong className="text-white underline decoration-[#d4af37]">{verifiedOrder.guestName}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">Confirm Name</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 block">Customer</span>
                    <span className="font-bold text-white text-sm">{verifiedOrder.guestName}</span>
                    {verifiedOrder.phone && <span className="text-gray-300 font-mono text-xs block">{verifiedOrder.phone}</span>}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gray-400 block">Service Location</span>
                    <span className="font-semibold text-amber-300">{verifiedOrder.serviceLocation || 'Pickup at Main Reception'}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block mb-0.5">Ordered Items:</span>
                  <div className="text-gray-200">
                    {(verifiedOrder.items || []).map((it) => `${it.qty}x ${it.name}`).join(' • ')}
                  </div>
                  {verifiedOrder.notes && (
                    <div className="text-amber-300 text-[11px] italic mt-1">Note: {verifiedOrder.notes}</div>
                  )}
                </div>

                {verifiedOrder.fulfilledAt && (
                  <div className="p-2 rounded-lg bg-emerald-950/40 text-emerald-300 text-xs font-mono">
                    ✓ Handover Confirmed: {verifiedOrder.orderStatus} at {verifiedOrder.fulfilledAt}
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickConfirmOrder(verifiedOrder.id, 'Picked Up')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                      verifiedOrder.orderStatus === 'Picked Up'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <CheckCircle2 size={15} />
                    <span>✓ Mark Picked Up</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickConfirmOrder(verifiedOrder.id, 'Delivered')}
                    className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Check size={15} />
                    <span>✓ Delivered</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInspectedDiningOrder(verifiedOrder);
                      setIsOrderLookupModalOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye size={13} className="text-[#d4af37]" />
                    <span>Full Details</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Front Desk Counter Check-In & Booking Code Verification Modal */}
      <CounterCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => {
          setIsCheckInModalOpen(false);
          setCheckInInitialCode('');
        }}
        deskBuilding={getDeskBuilding()}
        currentStaffName={currentUser?.name || 'Front Desk Receptionist'}
        rooms={rooms}
        initialCode={checkInInitialCode}
        onOpenReceipt={(b) => setSelectedReceiptBooking(b)}
      />

      {/* RESERVATION CANCELLATION REQUEST MODAL */}
      {isCancelModalOpen && cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#16030c] border-2 border-rose-500/70 rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-rose-950 via-[#3a0818] to-[#1a020a] border-b border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-300">
                  <XCircle size={22} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-white">
                    Cancel Reservation Request
                  </h3>
                  <p className="text-[11px] text-rose-200/80">
                    Dispatches formal notification to CEO &amp; Chief Accountant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              
              {/* Reservation summary */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-2 font-mono">
                <div className="flex items-center justify-between text-[#f3e5ab] font-bold text-sm">
                  <span>{cancelTarget.bookingId}</span>
                  <span className="text-emerald-400">₦{Number(cancelTarget.amount || 0).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-300 text-[11px] pt-1 border-t border-white/10 font-sans">
                  <div>
                    <span className="text-gray-400 text-[10px] block">Guest:</span>
                    <strong className="text-white">{cancelTarget.guestName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">Suite / Wing:</span>
                    <strong className="text-[#d4af37]">Room #{cancelTarget.roomNumber || 'Unassigned'} ({cancelTarget.building})</strong>
                  </div>
                </div>
              </div>

              {/* Financial Accountability Protocol Notice */}
              <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Financial Protocol:</strong> Once submitted, a formal alert is dispatched directly to the <strong>CEO</strong> and <strong>Chief Accountant</strong>. The <strong>Chief Accountant must audit and confirm the cancellation</strong> in the Finance Portal before the reservation is cancelled and the room marked available.
                </p>
              </div>

              {/* Reason Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-gray-300 font-bold">
                  Reason for Reservation Cancellation:
                </label>
                <textarea
                  value={cancelReasonInput}
                  onChange={(e) => setCancelReasonInput(e.target.value)}
                  placeholder="e.g. Customer requested cancellation due to travel schedule change..."
                  rows={3}
                  className="w-full bg-black/70 border border-white/20 rounded-xl p-3 text-white text-xs focus:border-rose-400 focus:outline-none placeholder:text-gray-500 resize-none font-sans"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Abort / Keep Active
                </button>

                <button
                  type="button"
                  onClick={handleSubmitCancellationRequest}
                  disabled={isSubmittingCancel}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send size={13} />
                  <span>{isSubmittingCancel ? 'Dispatching...' : 'Submit to CEO & Accountant'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: VERIFY RESERVATION CODE BEFORE CHECK-IN ON RESERVED ROOM */}
      {/* ============================================================== */}
      {isCheckInCodeModalOpen && checkInTargetRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#14020a] border border-[#d4af37]/40 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold block">
                  FRONT DESK COUNTER CHECK-IN • RESERVATION CODE VERIFICATION
                </span>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                  <Key size={18} className="text-[#d4af37]" />
                  <span>Check In Suite #{checkInTargetRoom.roomNumber}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCheckInCodeModalOpen(false);
                  setCheckInTargetRoom(null);
                  setCheckInVerifiedBooking(null);
                  setCheckInCodeError('');
                }}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Room Info Banner */}
            <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-sky-300 font-mono block">RESERVED SUITE:</span>
                <strong className="text-white text-sm">Room #{checkInTargetRoom.roomNumber}</strong>
                <span className="text-gray-400 ml-1.5">({checkInTargetRoom.type || 'Luxury Suite'} • {checkInTargetRoom.building || getDeskBuilding()})</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold border border-sky-500/40">
                RESERVED
              </span>
            </div>

            {/* Step 1: Input Reservation Code */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-[#f3e5ab] font-bold">
                Enter Customer Reservation Code: <span className="text-rose-400">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  value={checkInReservationCodeInput}
                  onChange={(e) => {
                    setCheckInReservationCodeInput(e.target.value.toUpperCase());
                    setCheckInCodeError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleVerifyCheckInCode();
                  }}
                  placeholder="e.g. ARS-BGD-7548BD or ARB-RES-..."
                  className="flex-1 bg-black/60 border border-[#d4af37]/40 rounded-xl px-4 py-3 text-white text-sm font-mono tracking-wider focus:border-[#d4af37] focus:outline-none uppercase"
                />
                <button
                  type="button"
                  onClick={handleVerifyCheckInCode}
                  className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-black shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  Verify
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Ask customer to show their reservation code on their phone screen, SMS, or confirmation receipt.
              </p>
            </div>

            {/* Verification Error */}
            {checkInCodeError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="text-rose-400 shrink-0" />
                <span>{checkInCodeError}</span>
              </div>
            )}

            {/* Step 2: Customer Name Cross-Check Box */}
            {checkInVerifiedBooking && (
              <div className="p-4 rounded-2xl bg-[#081f12] border-2 border-emerald-500/50 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-mono">
                    <CheckCircle2 size={16} /> RESERVATION CODE VERIFIED
                  </div>
                  <span className="text-[11px] font-mono text-emerald-300 font-bold">
                    Code: {checkInVerifiedBooking.id}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Customer Full Name:</span>
                    <strong className="text-white text-sm font-cinzel">{checkInVerifiedBooking.guestName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">WhatsApp / Phone:</span>
                    <span className="text-gray-200 font-mono">{checkInVerifiedBooking.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stay Duration:</span>
                    <span className="text-[#f3e5ab] font-bold">{checkInVerifiedBooking.nights || 1} Days ({checkInVerifiedBooking.checkIn} to {checkInVerifiedBooking.checkOut})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assigned Room:</span>
                    <span className="text-emerald-300 font-bold">Suite #{checkInTargetRoom.roomNumber}</span>
                  </div>
                </div>

                {/* Verbal Name Cross-Check Notice per User Rule */}
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Sparkles size={14} /> Receptionist Name Confirmation
                  </div>
                  <p className="leading-relaxed">
                    Please verbally confirm that the guest checking in matches the name <strong className="text-white underline">{checkInVerifiedBooking.guestName}</strong> before issuing room RFID keycard.
                  </p>
                  <label className="flex items-center gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNameCrossChecked}
                      onChange={(e) => setIsNameCrossChecked(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                    />
                    <span className="font-semibold text-white text-xs">
                      I have confirmed guest name matches {checkInVerifiedBooking.guestName}
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  disabled={!isNameCrossChecked}
                  onClick={handleExecuteVerifiedCheckIn}
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-xl hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Key size={15} />
                  <span>Confirm Check In & Issue Keycard</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EARLY STAY TERMINATION AUTHORIZATION (CEO / ACCOUNTANT) */}
      {/* ============================================================== */}
      {isEarlyTerminationModalOpen && earlyTerminationTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#1a040d] border border-amber-500/40 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  EARLY CHECKOUT TERMINATION DESK • CONFIRMATION REQUIRED
                </span>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                  <AlertCircle size={18} className="text-amber-400" />
                  <span>Early Stay Termination: Suite #{earlyTerminationTarget.roomNumber}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEarlyTerminationModalOpen(false);
                  setEarlyTerminationTarget(null);
                  setEarlyTerminationReasonInput('');
                }}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Warning Callout Box */}
            <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold font-mono">
                <Clock size={15} /> CLIENT STAY DURATION NOT COMPLETED
              </div>
              <p className="text-gray-200 leading-relaxed text-[11px]">
                This room was booked for <strong className="text-white font-mono">{earlyTerminationTarget.bookedNights} Days</strong> ({earlyTerminationTarget.stayCheck?.checkInDate} to {earlyTerminationTarget.stayCheck?.checkOutDate}).
                Only <strong className="text-amber-300">{earlyTerminationTarget.elapsedText}</strong> has elapsed (<strong className="text-rose-300">{earlyTerminationTarget.remainingText}</strong> uncompleted).
              </p>
              <p className="text-[11px] text-amber-200/90 leading-relaxed pt-1 border-t border-amber-500/30">
                🔒 Under hotel audit policy, early check-out termination before the client's stay duration is over strictly requires <strong>confirmation from the Chief Accountant or CEO</strong> before the room can be terminated and marked available.
              </p>
            </div>

            {/* Target Guest Details */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Guest Name:</span>
                <strong className="text-[#f3e5ab]">{earlyTerminationTarget.guestName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Booking Reference:</span>
                <span className="text-gray-200 font-mono">{earlyTerminationTarget.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Booked Duration:</span>
                <span className="text-white font-bold">{earlyTerminationTarget.bookedNights} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Uncompleted Balance:</span>
                <span className="text-rose-300 font-bold">{earlyTerminationTarget.remainingText} remaining</span>
              </div>
            </div>

            {/* Reason for Early Departure */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-gray-300 font-bold">
                Reason for Early Departure / Termination: <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={earlyTerminationReasonInput}
                onChange={(e) => setEarlyTerminationReasonInput(e.target.value)}
                placeholder="e.g. Guest had urgent flight rebooking / family emergency / early checkout requested..."
                className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 block">
                This reason will be audited by the Chief Accountant and CEO in real-time.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsEarlyTerminationModalOpen(false);
                  setEarlyTerminationTarget(null);
                  setEarlyTerminationReasonInput('');
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Keep Room In-House
              </button>
              <button
                type="button"
                onClick={handleSubmitEarlyTerminationRequest}
                disabled={isSubmittingEarlyTermination}
                className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Clock size={14} />
                <span>{isSubmittingEarlyTermination ? 'Dispatching...' : 'Request CEO & Accountant Confirmation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
