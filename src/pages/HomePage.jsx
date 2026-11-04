import React, { useState, useEffect } from 'react';
import { 
  Star, MapPin, Phone, Shield, Wifi, Coffee, Award, 
  Calendar, Users, ChevronRight, Sparkles, Clock, Compass, Eye, Building2, Utensils, Waves, Zap, CreditCard
} from 'lucide-react';
import { HOTEL_INFO, ROOMS } from '../data/hotelData';
import { portalStore } from '../data/portalStore';
import RoomDetailsModal from '../components/RoomDetailsModal';
import Pool360Viewer from '../components/Pool360Viewer';

export default function HomePage({ onNavigate, onOpenBooking }) {
  const [selectedRoomType, setSelectedRoomType] = useState('deluxe');
  const [selectedPreviewRoom, setSelectedPreviewRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState('2026-11-05');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-07');
  const [guests, setGuests] = useState('2 Adults');

  // Live Rooms & Events from Central Store (Only show active events enabled by CEO/Admin)
  const [rooms, setRooms] = useState(() => {
    try {
      const rates = portalStore.getRoomRates?.();
      return Array.isArray(rates) && rates.length > 0 ? rates : ROOMS;
    } catch {
      return ROOMS;
    }
  });

  const filterActiveEvents = (list) =>
    (Array.isArray(list) ? list : []).filter(
      (ev) => ev && ev.isActive !== false && ev.active !== false && ev.status !== 'inactive'
    );

  const [liveEvents, setLiveEvents] = useState(() => {
    try {
      return filterActiveEvents(portalStore.getHotelEvents?.());
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const syncStoreData = () => {
      try {
        const rates = portalStore.getRoomRates?.();
        if (Array.isArray(rates) && rates.length > 0) setRooms(rates);
        setLiveEvents(filterActiveEvents(portalStore.getHotelEvents?.()));
      } catch {
        // fallback silently
      }
    };

    syncStoreData();
    const unsubRates = portalStore.subscribeRates
      ? portalStore.subscribeRates((updatedRates) => {
          if (Array.isArray(updatedRates) && updatedRates.length > 0) setRooms(updatedRates);
        })
      : () => {};
    const unsubEvents = portalStore.subscribeHotelEvents
      ? portalStore.subscribeHotelEvents((updatedEvents) => {
          setLiveEvents(filterActiveEvents(updatedEvents));
        })
      : () => {};

    window.addEventListener('storage', syncStoreData);
    window.addEventListener('focus', syncStoreData);
    return () => {
      if (typeof unsubRates === 'function') unsubRates();
      if (typeof unsubEvents === 'function') unsubEvents();
      window.removeEventListener('storage', syncStoreData);
      window.removeEventListener('focus', syncStoreData);
    };
  }, []);

  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  const galleryPreviewPhotos = [
    {
      src: '/hero-palace.jpg',
      title: 'Grand Palace Facade',
      tag: 'Architecture'
    },
    {
      src: '/rooms/ext-120k-apartment-parlour-1.webp',
      title: '120K Apartment & Parlour',
      tag: 'Extension Wing'
    },
    {
      src: '/lounge/vip-bar-lounge-1.webp',
      title: 'Al-Sultan VIP Bar Lounge',
      tag: 'Nightlife & Bar'
    },
    {
      src: '/pool/pool-view-1.webp',
      title: 'Olympic Poolside Oasis',
      tag: 'Pool & Cabanas'
    }
  ];

  return (
    <div className="bg-[#120208] text-gray-100 overflow-x-hidden">
      
      {/* =====================================================================
          1. PRESTIGE 5-STAR HERO SECTION & FLOATING RESERVATION CONSOLE
          ===================================================================== */}
      <section className="relative min-h-[78vh] sm:min-h-[86vh] flex items-center justify-center overflow-hidden pt-12 pb-20 sm:pb-28">
        {/* Background Palace Imagery with Cinematic Glowing / Dimming Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-palace.jpg"
            alt="Arab Signature Hotel Grand Exterior"
            className="w-full h-full object-cover object-center scale-105 brightness-110 animate-pulse duration-[12000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-[#380314]/85 to-black/90" />
          <div className="absolute inset-0 arabesque-pattern opacity-15 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5 sm:space-y-6">
          {/* 5-Star Rating & Verified Crest Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-black/65 border border-[#d4af37]/55 text-[#f3e5ab] text-[10px] sm:text-xs font-mono tracking-widest uppercase backdrop-blur-md shadow-2xl">
            <span className="flex items-center gap-0.5 text-[#d4af37]">
              <Star size={11} fill="#d4af37" />
              <Star size={11} fill="#d4af37" />
              <Star size={11} fill="#d4af37" />
              <Star size={11} fill="#d4af37" />
              <Star size={11} fill="#d4af37" />
            </span>
            <span className="text-white/30">|</span>
            <span>THE ONLY VERIFIED SIGNATURE IN NSUGBE</span>
          </div>

          {/* Editorial Overline & Grand Display Title */}
          <div className="space-y-2.5">
            <span className="block text-[10px] sm:text-xs font-mono uppercase tracking-[0.28em] text-[#d4af37] font-semibold">
              ARAB SIGNATURE HOTEL &amp; SUITES • ANAMBRA
            </span>
            <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wide text-white leading-[1.14] drop-shadow-[0_6px_28px_rgba(0,0,0,0.95)]">
              Where Palace Elegance Meets <br className="hidden xs:inline" />
              <span className="gold-text-gradient">Legendary Hospitality</span>
            </h1>
          </div>

          {/* Decorative Gold Filigree Divider */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#d4af37]/80" />
            <Sparkles size={13} className="text-[#d4af37]" />
            <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#d4af37]/80" />
          </div>

          {/* Refined Executive Subtitle */}
          <p className="max-w-2xl mx-auto text-xs sm:text-base text-gray-200/95 font-light leading-relaxed px-2">
            Retreat to 34 private royal suites and parlour apartments across our Main Palace and Extension Wings—complete with 24/7 uninterrupted power, an Olympic poolside oasis, and Al-Sultan gourmet dining.
          </p>

          {/* Primary Luxury CTAs */}
          <div className="flex flex-col xs:flex-row items-center justify-center gap-3 pt-2 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => onOpenBooking(selectedRoomType)}
              className={`w-full xs:w-auto px-8 py-3.5 sm:py-4 rounded-xl ${goldGradient} font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_10px_30px_rgba(212,175,55,0.35)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer`}
            >
              <span>Reserve Your Suite</span>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => onNavigate('dining')}
              className="w-full xs:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-black/70 hover:bg-[#5c0725]/85 text-[#f3e5ab] font-bold text-xs sm:text-sm uppercase tracking-wider border border-[#d4af37]/55 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
            >
              <Utensils size={15} className="text-[#d4af37]" />
              <span>Order Food &amp; Drinks</span>
            </button>
          </div>

          {/* Subtle Trust Micro-Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] font-mono text-gray-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Instant Online Paystack Booking
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              Free Pool for Lodge Guests
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              24/7 Armed Diplomatic Guard
            </span>
          </div>
        </div>
      </section>

      {/* Floating Quick-Reservation Console (Cleanly overlaps hero bottom without crowding content) */}
      <div className="relative z-20 -mt-10 sm:-mt-14 max-w-5xl mx-auto px-4 sm:px-6 pb-4">
        <div className="rounded-2xl p-3.5 sm:p-5 border border-[#d4af37]/50 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-gradient-to-r from-[#1b030d]/95 via-[#14020a]/95 to-[#1b030d]/95 backdrop-blur-xl">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 items-center">
            
            {/* Suite Select */}
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 bg-black/50 p-2.5 sm:p-3 rounded-xl border border-white/10">
              <Award className="text-[#d4af37] flex-shrink-0" size={16} />
              <div className="text-left w-full min-w-0">
                <label className="block text-[9px] uppercase tracking-wider text-[#d4af37] font-mono">Select Suite</label>
                <select 
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className="bg-transparent text-white font-semibold text-xs w-full focus:outline-none cursor-pointer truncate"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[#18020c] text-white">
                      {r.name} ({r.priceFormatted || `₦${Number(r.price).toLocaleString()}`})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Check-in */}
            <div className="flex items-center gap-2 bg-black/50 p-2.5 sm:p-3 rounded-xl border border-white/10">
              <Calendar className="text-[#d4af37] flex-shrink-0" size={15} />
              <div className="text-left w-full min-w-0">
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-mono">Check-In</label>
                <input 
                  type="date" 
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="bg-transparent text-white font-semibold text-[11px] sm:text-xs w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="flex items-center gap-2 bg-black/50 p-2.5 sm:p-3 rounded-xl border border-white/10">
              <Calendar className="text-[#d4af37] flex-shrink-0" size={15} />
              <div className="text-left w-full min-w-0">
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-mono">Check-Out</label>
                <input 
                  type="date" 
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="bg-transparent text-white font-semibold text-[11px] sm:text-xs w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="hidden sm:flex items-center gap-2 bg-black/50 p-3 rounded-xl border border-white/10">
              <Users className="text-[#d4af37] flex-shrink-0" size={15} />
              <div className="text-left w-full">
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-mono">Guests</label>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-transparent text-white font-semibold text-xs w-full focus:outline-none cursor-pointer"
                >
                  <option value="1 Adult" className="bg-[#18020c]">1 Adult</option>
                  <option value="2 Adults" className="bg-[#18020c]">2 Adults</option>
                  <option value="2 Adults, 1 Child" className="bg-[#18020c]">2 Adults, 1 Child</option>
                  <option value="VIP Family (4)" className="bg-[#18020c]">VIP Family (4)</option>
                </select>
              </div>
            </div>

            {/* Reserve CTA */}
            <button
              onClick={() => onOpenBooking(selectedRoomType)}
              className={`col-span-2 sm:col-span-1 h-full py-3 sm:py-3.5 px-4 rounded-xl ${goldGradient} font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
            >
              <span>Check Availability</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. SIGNATURE LUXURY PILLARS (SCANNABLE 4-STAT STRIP)
          ===================================================================== */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 border-b border-white/10 bg-[#15020a]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#d4af37]/25 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] flex-shrink-0">
              <Building2 size={18} />
            </div>
            <div>
              <div className="font-cinzel text-sm sm:text-base font-bold text-white">34 Luxury Suites</div>
              <p className="text-[11px] text-gray-400">Main Palace &amp; Extension Wings</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#d4af37]/25 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
              <Waves size={18} />
            </div>
            <div>
              <div className="font-cinzel text-sm sm:text-base font-bold text-white">Free Guest Pool</div>
              <p className="text-[11px] text-gray-400">Free for Lodge • ₦3k/hr Visitors</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#d4af37]/25 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] flex-shrink-0">
              <Utensils size={18} />
            </div>
            <div>
              <div className="font-cinzel text-sm sm:text-base font-bold text-white">Online Food Order</div>
              <p className="text-[11px] text-gray-400">Instant Paystack &amp; Order Code</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#d4af37]/25 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] flex-shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <div className="font-cinzel text-sm sm:text-base font-bold text-white">24/7 Power &amp; Guard</div>
              <p className="text-[11px] text-gray-400">Uninterrupted Dual Generators</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. CURATED SUITES & APARTMENTS (SWIPEABLE ON MOBILE, GRID ON DESKTOP)
          ===================================================================== */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-[#15020a] to-[#120208]">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase font-mono tracking-widest text-[#d4af37] block">
                ACCOMMODATIONS • MAIN &amp; EXTENSION WINGS
              </span>
              <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white">
                Suites &amp; <span className="gold-text-gradient">Executive Apartments</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                Swipe to explore our 6 signature tiers from ₦40,000/night to our ₦120,000 Extension Apartment with Private Parlour and ₦150,000 Royal Penthouse.
              </p>
            </div>
            <button
              onClick={() => onNavigate('suites')}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#d4af37]/35 text-[#f3e5ab] text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <span>Compare All 34 Suites</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Mobile Horizontal Snap Carousel / Desktop 3-Column Grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 scrollbar-none">
            {rooms.map((room) => (
              <div 
                key={room.id}
                className="snap-center shrink-0 w-[85vw] max-w-[340px] sm:w-auto sm:max-w-none rounded-2xl overflow-hidden bg-[#1a030d] border border-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Clean Suite Photo Header */}
                  <div 
                    onClick={() => setSelectedPreviewRoom(room)}
                    className="relative h-52 sm:h-56 overflow-hidden bg-black cursor-pointer"
                  >
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a030d] via-black/15 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#f3e5ab] text-[10px] font-mono border border-[#d4af37]/40">
                        {room.buildingLabel || (Array.isArray(room.buildings) ? room.buildings.join(' & ') : 'Main & Extension')}
                      </span>
                      {(room.hasParlour || room.id === 'suites') && (
                        <span className="px-2.5 py-1 rounded-full bg-[#d4af37] text-black text-[10px] font-mono font-extrabold shadow-md">
                          + Private Parlour
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-gray-300 block">{room.size || '45 sqm'} • {room.guests || '2 Adults'}</span>
                        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white leading-snug">
                          {room.name}
                        </h3>
                      </div>
                      <div className="text-right flex-shrink-0 bg-black/75 px-2.5 py-1 rounded-xl border border-[#d4af37]/40">
                        <span className="text-sm sm:text-base font-extrabold text-[#d4af37] font-mono block leading-tight">
                          {room.priceFormatted || `₦${Number(room.price).toLocaleString()}`}
                        </span>
                        <span className="text-[9px] text-gray-300 font-mono">per night</span>
                      </div>
                    </div>
                  </div>

                  {/* Concise Card Body */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      {room.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(room.amenities || []).slice(0, 3).map((item, idx) => (
                        <span 
                          key={idx}
                          className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10"
                        >
                          {item}
                        </span>
                      ))}
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 font-mono">
                        Free Pool Access
                      </span>
                    </div>
                  </div>
                </div>

                {/* Clean 2-Button Action Footer */}
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewRoom(room)}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/15 text-[#f3e5ab] font-bold text-xs uppercase tracking-wider border border-[#d4af37]/35 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={13} className="text-[#d4af37]" />
                    <span>Photos ({room.gallery?.length || 1})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenBooking(room.id)}
                    className={`py-2.5 px-3 rounded-xl ${goldGradient} font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1 cursor-pointer`}
                  >
                    <span>Book Now</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. 360° POOLSIDE OASIS & AL-SULTAN ONLINE DINING
          ===================================================================== */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#17030c] border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] uppercase font-mono tracking-widest text-[#d4af37] font-semibold">
              RESORT LIFESTYLE &amp; GASTRONOMY
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white">
              360° Poolside &amp; <span className="gold-text-gradient">Al-Sultan Dining</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Explore our illuminated Olympic swimming pool in interactive 360° or order freshly prepared dishes and chilled drinks online with instant Paystack checkout.
            </p>
          </div>

          {/* Interactive 360 Pool Panorama */}
          <Pool360Viewer onOpenBooking={() => onOpenBooking('deluxe')} />

          {/* Two Clean Side-by-Side Experience Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Card 1: Al-Sultan Fine Dining & Online Paystack Ordering */}
            <div className="rounded-2xl overflow-hidden border border-[#d4af37]/35 bg-[#120208] flex flex-col justify-between shadow-xl">
              <div className="relative h-52 overflow-hidden">
                <img
                  src="/rooms/al-sultan-dining-hall.jpg"
                  alt="Al-Sultan Fine Dining Restaurant"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120208] via-black/30 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono font-bold uppercase">
                  Instant Online Paystack Ordering
                </span>
              </div>
              <div className="p-5 sm:p-6 space-y-3">
                <h3 className="font-cinzel text-xl font-bold text-white">
                  Al-Sultan Kitchen &amp; VIP Bottle Service
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Order smoky Jollof Rice, Ofe Nsala, Egusi, Peppered Turkey, Catfish Pepper Soup, and chilled VIP bottle service directly online via Paystack and receive your official Front Desk Order Code.
                </p>
                <div className="pt-1 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => onNavigate('dining')}
                    className={`px-5 py-2.5 rounded-xl ${goldGradient} font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg`}
                  >
                    <CreditCard size={14} />
                    <span>Order Food &amp; Pay Online</span>
                  </button>
                  <button
                    onClick={() => onNavigate('track-order')}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-[#f3e5ab]"
                  >
                    Track Order Code
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Olympic Swimming Pool & VIP Lounge */}
            <div className="rounded-2xl overflow-hidden border border-[#d4af37]/35 bg-[#120208] flex flex-col justify-between shadow-xl">
              <div className="relative h-52 overflow-hidden">
                <img
                  src="/lounge/vip-bar-lounge-1.webp"
                  alt="VIP Bar & Poolside Lounge"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120208] via-black/30 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-400/50 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                  Free Swimming for Lodge Guests
                </span>
              </div>
              <div className="p-5 sm:p-6 space-y-3">
                <h3 className="font-cinzel text-xl font-bold text-white">
                  VIP Executive Lounge &amp; Pool Oasis
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Checked-in suite guests and active reservation holders swim 100% FREE. Non-lodging walk-in visitors enjoy pool access at ₦3,000 per hour alongside our royal velvet VIP lounge.
                </p>
                <div className="pt-1 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => onNavigate('amenities')}
                    className="px-5 py-2.5 rounded-xl bg-[#5c0725] hover:bg-[#750930] border border-[#d4af37]/40 text-[#f3e5ab] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span>Explore Pool &amp; Amenities</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          5. CONCISE EDITORIAL STORY & 4-PHOTO GALLERY PREVIEW STRIP
          ===================================================================== */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#120208] border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[11px] uppercase font-mono tracking-widest text-[#d4af37] block">
                ARCHITECTURAL HERITAGE • NSUGBE, ANAMBRA
              </span>
              <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white">
                Inside the <span className="gold-text-gradient">Royal Palace</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Positioned off Nwafor Orizu College Road in Nsugbe, Arab Signature Hotel &amp; Suites blends signature Arabian architectural elegance with tranquil privacy and armed 24/7 diplomatic security.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => onNavigate('gallery')}
                className={`px-5 py-2.5 rounded-xl ${goldGradient} font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg`}
              >
                <Eye size={14} />
                <span>View Full 4K Gallery</span>
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white"
              >
                Our Story
              </button>
            </div>
          </div>

          {/* Sleek 2x2 Mobile / 4-Column Desktop Visual Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {galleryPreviewPhotos.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('gallery')}
                className="group relative h-40 sm:h-56 rounded-2xl overflow-hidden border border-[#d4af37]/30 cursor-pointer bg-black shadow-lg"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 border border-[#d4af37]/40 text-[#f3e5ab] text-[9px] font-mono">
                  {photo.tag}
                </span>
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <div className="font-cinzel text-xs sm:text-sm font-bold text-white truncate">
                    {photo.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. UPCOMING LIVE EVENTS (ONLY SHOWN WHEN ACTIVE IN CEO PORTAL)
          ===================================================================== */}
      {liveEvents.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#17030c] border-t border-[#d4af37]/25">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase font-mono tracking-widest text-[#d4af37] block">
                  ENTERTAINMENT &amp; GALA NIGHTS
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                  Upcoming <span className="gold-text-gradient">Hotel Events</span>
                </h2>
              </div>
              <button
                onClick={() => onNavigate('events')}
                className="self-start sm:self-auto text-xs font-bold text-[#f3e5ab] hover:underline flex items-center gap-1"
              >
                <span>View All Events</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {liveEvents.slice(0, 3).map((ev) => (
                <div 
                  key={ev.id} 
                  className="rounded-2xl overflow-hidden border border-[#d4af37]/35 bg-[#120208] flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-black">
                      <img 
                        src={ev.banner || ev.flyerUrl || '/rooms/suite-royal-penthouse.jpg'} 
                        alt={ev.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#120208] via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#5c0725]/90 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono font-bold uppercase">
                        {ev.highlightBadge || ev.category || 'Hotel Event'}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="text-[11px] font-mono text-[#d4af37] flex items-center gap-2">
                        <Calendar size={12} />
                        <span>{ev.dateLabel || ev.date || 'Upcoming'}</span>
                      </div>
                      <h3 className="font-cinzel text-base font-bold text-white">{ev.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2">{ev.writeUp || ev.description}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-1">
                    <button
                      onClick={() => onNavigate('events')}
                      className={`w-full py-2.5 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider`}
                    >
                      Event Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          7. CONCISE LOCATION & DIRECT RESERVATION FOOTER BANNER
          ===================================================================== */}
      <section className="py-12 px-4 sm:px-6 bg-gradient-to-b from-[#120208] to-[#1a010a] border-t border-white/10">
        <div className="max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#2c0515] via-[#1b030e] to-[#120208] border border-[#d4af37]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block">
              DIRECT RESERVATIONS &amp; CONCIERGE DESK
            </span>
            <h3 className="font-cinzel text-xl sm:text-3xl font-extrabold text-white">
              Ready for Your Royal Stay in Nsugbe?
            </h3>
            <p className="text-xs text-gray-300 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <MapPin size={14} className="text-[#d4af37] shrink-0" />
              <span>{HOTEL_INFO.address}</span>
              <span className="text-[#d4af37]">•</span>
              <Phone size={13} className="text-[#d4af37] shrink-0" />
              <span className="font-mono text-[#f3e5ab]">{HOTEL_INFO.phone}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => onOpenBooking('deluxe')}
              className={`px-6 py-3.5 rounded-xl ${goldGradient} font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center gap-1.5`}
            >
              <span>Book Suite Online</span>
              <ChevronRight size={15} />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white"
            >
              Directions &amp; Map
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Room Pictures & Full Details Modal */}
      {selectedPreviewRoom && (
        <RoomDetailsModal
          room={selectedPreviewRoom}
          onClose={() => setSelectedPreviewRoom(null)}
          onOpenBooking={(roomId) => {
            setSelectedPreviewRoom(null);
            onOpenBooking(roomId);
          }}
        />
      )}

    </div>
  );
}
