import React, { useState, useEffect } from 'react';
import { HOTEL_INFO } from '../data/hotelData';
import { portalStore } from '../data/portalStore';
import { 
  Calendar, Users, ArrowRight, Star, ShieldCheck, Zap, Crown, 
  Car, Sparkles, Utensils, Waves, Phone, MapPin, Check, 
  ChevronRight, Play, Clock, Share2, Award, Camera, Building2, DoorOpen,
  Flame, X, PartyPopper, Eye
} from 'lucide-react';
import PhotoGallerySection from '../components/PhotoGallerySection';
import { EventAdBannerCard, EventTemplateCard } from './EventsPage';
import RoomDetailsModal from '../components/RoomDetailsModal';
import Pool360Viewer from '../components/Pool360Viewer';

export default function HomePage({ onNavigate, onOpenBooking }) {
  const [checkIn, setCheckIn] = useState('2026-10-20');
  const [checkOut, setCheckOut] = useState('2026-10-22');
  const [roomType, setRoomType] = useState('deluxe');
  const [rooms, setRooms] = useState(() => portalStore.getRoomRates());
  const [activeRoomPhotos, setActiveRoomPhotos] = useState({});
  const [selectedBuilding, setSelectedBuilding] = useState('all'); // 'all' | 'main' | 'extension'
  const [hotelEvents, setHotelEvents] = useState(() => portalStore.getHotelEvents());
  const [homeEventTab, setHomeEventTab] = useState('upcoming'); // 'upcoming' | 'recap'
  const [selectedHomeEvent, setSelectedHomeEvent] = useState(null);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);

  // Listen for real-time room rate & event adjustments made by Admin
  useEffect(() => {
    const unsubRates = portalStore.subscribeRates(setRooms);
    const unsubEvents = portalStore.subscribeHotelEvents(setHotelEvents);
    return () => {
      unsubRates();
      unsubEvents();
    };
  }, []);

  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    onOpenBooking(roomType);
  };

  return (
    <div className="bg-[#120208] text-gray-100 min-h-screen">
      
      {/* 1. GRAND CINEMATIC HERO (DESIGN 1) */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Background Palace Imagery with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-palace.jpg"
            alt="Arab Signature Hotel Grand Exterior"
            className="w-full h-full object-cover object-center scale-105 brightness-110 animate-pulse duration-[12000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-[#380314]/85 to-black/90" />
          <div className="absolute inset-0 arabesque-pattern opacity-15 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7 pt-2">
          
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#380214] via-[#5c0725] to-[#380214] border border-[#d4af37]/70 text-[#f3e5ab] text-xs font-semibold tracking-wider shadow-2xl backdrop-blur-md">
            <Crown size={15} className="text-[#d4af37]" />
            <span className="font-cinzel font-bold text-white tracking-wide">
              The Only Verified Signature in Nsugbe
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] hidden sm:inline" />
            <span className="text-[11px] font-mono text-[#d4af37] hidden sm:inline uppercase">
              5-Star Luxury Suites
            </span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide leading-tight text-white">
            Where Arab Elegance Meets <br className="hidden sm:inline" />
            <span className="gold-text-gradient">Legendary Hospitality</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-gray-300">
            Immerse yourself in opulent Arabian architecture, serene private poolside cabanas, authentic Middle Eastern dining, and 24/7 presidential security at <strong className="text-white font-semibold">the only verified Signature in Nsugbe</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('suites')}
              className={`px-8 py-4 rounded-2xl ${goldGradient} font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-[#d4af37]/30 hover:scale-105 active:scale-98 transition-all flex items-center gap-2`}
            >
              <span>Explore Arab Suites</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onOpenBooking('suites')}
              className="px-7 py-4 rounded-2xl bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-md font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Crown size={15} className="text-[#d4af37]" />
              <span>Diplomatic Suites</span>
            </button>

            <button
              onClick={() => onNavigate('gallery')}
              className="px-7 py-4 rounded-2xl bg-[#380214]/80 text-[#f3e5ab] border border-[#d4af37]/50 hover:bg-[#5c0725] backdrop-blur-md font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg"
            >
              <Camera size={15} className="text-[#d4af37]" />
              <span>4K Photo Gallery</span>
            </button>
          </div>

          {/* Horizontal Booking Engine Bar (Hidden on Mobile to keep hotel image fully visible) */}
          <div className="pt-8 max-w-4xl mx-auto hidden md:block">
            <form 
              onSubmit={handleBookingSubmit}
              className="p-4 sm:p-5 rounded-3xl border shadow-2xl backdrop-blur-xl bg-[#1c040e]/95 border-[#d4af37]/40 text-white"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[#d4af37] flex items-center gap-1 mb-1">
                    <Calendar size={12} /> Check-In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[#d4af37] flex items-center gap-1 mb-1">
                    <Calendar size={12} /> Check-Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[#d4af37] flex items-center gap-1 mb-1">
                    <Crown size={12} /> Suite Type
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id} className="text-black">
                        {r.name} ({r.priceFormatted})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className={`w-full py-3.5 rounded-2xl ${goldGradient} font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-transform active:scale-98`}
                  >
                    <span>Check Rates</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-gray-400 px-1">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> Instant Verified Paystack Booking</span>
                <span className="flex items-center gap-1.5"><Zap size={14} className="text-[#d4af37]" /> 100% Uninterrupted Power Guarantee</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-400" /> Check-in: 2:00 PM • Free Cancellation</span>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* 2. ABOUT US PREVIEW SECTION (FEATURING CLIENT'S EXACT TEXT) */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5c0725]/40 border border-[#d4af37]/40 text-[#d4af37] text-xs font-mono">
              ABOUT ARAB SIGNATURE HOTEL & SUITES
            </div>
            
            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wide leading-tight">
              An Architectural Oasis of <span className="gold-text-gradient">Royal Comfort</span>
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-gray-200">
              {HOTEL_INFO.aboutText}
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-2"
              >
                <span>Read Full About Us & Story</span>
                <ChevronRight size={15} className="text-[#d4af37]" />
              </button>
            </div>
          </div>

          {/* Architectural Photos */}
          <div className="relative space-y-3">
            <div className="rounded-3xl overflow-hidden border-2 border-[#d4af37]/40 shadow-2xl">
              <img
                src="/rooms/arch-reception-entrance.jpg"
                alt="Arab Signature Grand Reception Entrance"
                className="w-full h-[310px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-xl">
                <img
                  src="/rooms/arch-facade-main.jpg"
                  alt="Arab Signature Hotel Exterior Architecture"
                  className="w-full h-36 object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-xl">
                <img
                  src="/rooms/arch-gate-exterior.jpg"
                  alt="Arab Signature Hotel Gated Perimeter"
                  className="w-full h-36 object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-[#5c0725] text-[#f3e5ab] text-xs font-bold px-4 py-2 rounded-xl shadow-lg border border-[#d4af37]/40">
              34 Luxury Rooms • Nsugbe, Onitsha
            </div>
          </div>

        </div>
      </section>

      {/* 3. FEATURED SUITES PREVIEW */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#17030c] border-y border-[#5c0725]/40">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-1.5">
              <span className="text-[11px] sm:text-xs uppercase font-mono tracking-widest text-[#d4af37] block font-semibold">
                34 LUXURY ROOMS & ARAB SUITES • 2 BUILDINGS (MAIN & EXTENSION)
              </span>
              <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold tracking-wide text-white">
                Signature Arab Suites & Room Rates
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All 34 Rooms' },
                { id: 'main', label: 'Main Building (20)' },
                { id: 'extension', label: 'Extension Building (14)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedBuilding(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedBuilding === tab.id
                      ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <button
                onClick={() => onNavigate('suites')}
                className="px-4 py-2 rounded-xl bg-[#5c0725] hover:bg-[#720a2f] text-[#f3e5ab] text-xs font-bold uppercase tracking-wider border border-[#d4af37]/40 flex items-center gap-1.5"
              >
                <span>Full Rate Board</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms
              .filter((room) => {
                if (selectedBuilding === 'main') return room.mainBuildingRooms && room.mainBuildingRooms.length > 0;
                if (selectedBuilding === 'extension') return room.extensionBuildingRooms && room.extensionBuildingRooms.length > 0;
                return true;
              })
              .map((room) => {
                const roomGallery = room.gallery && room.gallery.length > 0 ? room.gallery : [room.image];
                const currentPhoto = activeRoomPhotos[room.id] || room.image;
                const hasMain = room.mainBuildingRooms && room.mainBuildingRooms.length > 0;
                const hasExt = room.extensionBuildingRooms && room.extensionBuildingRooms.length > 0;
                const countInSelection =
                  selectedBuilding === 'main'
                    ? room.mainBuildingRooms?.length || 0
                    : selectedBuilding === 'extension'
                    ? room.extensionBuildingRooms?.length || 0
                    : room.totalRooms || (room.roomNumbers ? room.roomNumbers.length : 0);

                return (
                  <div
                    key={room.id}
                    className="rounded-3xl overflow-hidden border border-[#d4af37]/30 bg-[#1f050f]/90 shadow-xl flex flex-col justify-between group hover:-translate-y-1 hover:border-[#d4af37] transition-all duration-300"
                  >
                    <div className="relative h-56 sm:h-60 overflow-hidden bg-black">
                      <img
                        src={currentPhoto}
                        alt={room.name}
                        onClick={() => setSelectedRoomDetails(room)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        <span className="bg-[#5c0725] text-[#f3e5ab] border border-[#d4af37]/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                          {room.boardTitle || room.category}
                        </span>
                        {(room.hasParlour || room.price === 120000) && (
                          <span className="bg-gradient-to-r from-amber-500/30 to-[#d4af37]/40 text-amber-200 border border-amber-400 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                            <Crown size={10} className="text-[#d4af37]" />
                            <span>Apartment with Parlour</span>
                          </span>
                        )}
                        {room.isPromoActive && (
                          <span className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white border border-emerald-300/60 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1 animate-pulse">
                            🔥 Promo Offer
                          </span>
                        )}
                        <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/15">
                          {countInSelection} {countInSelection === 1 ? 'Room' : 'Rooms'}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-[#d4af37] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-white/10">
                        <Star size={11} fill="#d4af37" /> {room.rating}
                      </div>

                      {/* Multi-Angle Vivid HDR Thumbnail Switcher */}
                      {roomGallery.length > 1 && (
                        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/15">
                          {roomGallery.map((imgUrl, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveRoomPhotos((prev) => ({ ...prev, [room.id]: imgUrl }));
                              }}
                              className={`w-7 h-5 rounded-md overflow-hidden border transition-all ${
                                currentPhoto === imgUrl
                                  ? 'border-[#d4af37] scale-105 ring-1 ring-[#d4af37]'
                                  : 'border-white/20 opacity-70 hover:opacity-100'
                              }`}
                              title={`View Angle ${idx + 1}`}
                            >
                              <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors">
                              {room.name}
                            </h3>
                            <span className="text-[11px] text-gray-400 block">{room.bed} • {room.size}</span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            {room.isPromoActive && room.promoPrice ? (
                              <div>
                                <div className="flex items-center justify-end gap-1.5">
                                  <span className="line-through text-gray-400 text-xs font-mono">
                                    {room.priceFormatted}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-[9px] font-mono font-bold uppercase animate-pulse">
                                    {room.discountPercent ? `-${room.discountPercent}%` : 'PROMO'}
                                  </span>
                                </div>
                                <div className="text-lg font-extrabold text-emerald-400 font-mono">
                                  {room.promoPriceFormatted || `₦${Number(room.promoPrice).toLocaleString()}`}
                                </div>
                              </div>
                            ) : (
                              <div className="text-lg font-extrabold text-[#d4af37] font-mono">{room.priceFormatted}</div>
                            )}
                            <span className="text-[10px] uppercase text-gray-400 block">per night</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{room.description}</p>

                        {/* Building & Room Number Pills */}
                        <div className="p-2.5 rounded-xl bg-black/45 border border-white/10 space-y-1.5 text-[10px] font-mono">
                          {hasMain && (selectedBuilding === 'all' || selectedBuilding === 'main') && (
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <span className="text-gray-300">Main Bldg ({room.mainBuildingRooms.length}):</span>
                              <div className="flex flex-wrap gap-1">
                                {room.mainBuildingRooms.map((n) => (
                                  <span key={n} className="px-1.5 py-0.5 rounded bg-[#5c0725]/60 text-[#f3e5ab] border border-[#d4af37]/30">
                                    #{n}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {hasExt && (selectedBuilding === 'all' || selectedBuilding === 'extension') && (
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <span className="text-gray-300">Extension ({room.extensionBuildingRooms.length}):</span>
                              <div className="flex flex-wrap gap-1">
                                {room.extensionBuildingRooms.map((n) => (
                                  <span key={n} className="px-1.5 py-0.5 rounded bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                                    #{n}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-white/10 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRoomDetails(room)}
                          className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#f3e5ab] text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                          title="View high-res photos & full room details"
                        >
                          <Eye size={13} className="text-[#d4af37]" />
                          <span>Photos &amp; Details</span>
                        </button>
                        <button
                          onClick={() => onOpenBooking(room.id)}
                          className={`flex-1 py-2.5 px-4 rounded-xl ${goldGradient} font-extrabold text-xs uppercase tracking-wider shadow-md hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer`}
                        >
                          <span>Reserve {room.category}</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* 4. POOLSIDE CABANAS & DINING HIGHLIGHTS (WITH 360° INTERACTIVE POOLSIDE TOUR) */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold">
            360° VIRTUAL TOUR &bull; LEISURE &bull; VIP CABANAS &bull; FINE DINING
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wide">
            Poolside Cabanas &amp; Gourmet Dining
          </h2>
          <p className="text-sm text-gray-400">
            Enjoy exclusive poolside relaxation with our interactive 360° virtual tour, vibrant VIP lounge experiences, and authentic Middle Eastern &amp; continental cuisine in Nsugbe, Onitsha.
          </p>
        </div>

        {/* Interactive 360° Poolside Panorama */}
        <Pool360Viewer onOpenBooking={onOpenBooking} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Olympic Pool & VIP Cabanas */}
          <div className="rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#1f050f]/80 shadow-2xl group flex flex-col justify-between">
            <div className="relative h-64 overflow-hidden">
              <img
                src="/pool/pool-view-1.webp"
                alt="Arab Signature Olympic Swimming Pool & Cabanas"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/pool/pool-view-1.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-emerald-950/90 text-emerald-200 border border-emerald-400/50 text-xs font-bold px-3 py-1 rounded-xl shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Lodge Guests: Free &bull; Visitors: ₦3,000/hr</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-[#f3e5ab] text-[11px] font-mono px-2.5 py-1 rounded-lg border border-[#d4af37]/40">
                5 Panoramic Angles Available
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-cinzel text-xl font-bold text-white">Olympic Swimming Pool & VIP Cabanas</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Crystal-clear outdoor swimming pool with luxury sun loungers, poolside cocktail bar, and shaded VIP cabanas. 100% complimentary unlimited swimming for all resident lodge guests &amp; confirmed reservations. Non-suite visitors welcome at ₦3,000 per hour.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => onNavigate('amenities')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/15 cursor-pointer transition-all"
                >
                  <span>Explore Pool &amp; 360 View</span>
                  <ChevronRight size={14} className="text-[#d4af37]" />
                </button>
                <button
                  onClick={() => onOpenBooking('deluxe')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer hover:brightness-110 transition-all shadow-md"
                >
                  Book Stay (Free Swim)
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Al-Sultan Gourmet Dining */}
          <div className="rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#1f050f]/80 shadow-2xl group flex flex-col justify-between">
            <div className="relative h-64 overflow-hidden">
              <img
                src="/rooms/al-sultan-dining-hall.jpg"
                alt="Al Sultan Dining Hall"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-[#5c0725] text-[#f3e5ab] text-xs font-bold px-3 py-1 rounded-xl">
                Al-Sultan Cuisine
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-cinzel text-xl font-bold text-white">Al-Sultan Fine Dining & Lounge</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Authentic Middle Eastern grills, lamb mandi, hummus, and premium shawarma paired with five-star continental and Nigerian specialties in our executive dining hall.
              </p>
              <button
                onClick={() => onNavigate('dining')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/15"
              >
                <span>View Dining Menu</span>
                <ChevronRight size={14} className="text-[#d4af37]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5. HOMEPAGE EVENTS TAB: UPCOMING EVENTS, PREVIOUS RECAPS & AUTO-DESIGNED AD BANNER */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#5c0725]/40 space-y-10">
        {(() => {
          // Strict filter: Event must be active & not turned off by CEO/Admin
          const isEventActive = (e) => Boolean(e) && e.isActive === true && e.enabled !== false && e.status !== 'inactive';
          const activeHotelEvents = hotelEvents.filter(isEventActive);

          // Filter by event type and homepage visibility toggle
          const upcomingList = activeHotelEvents.filter((e) => e.type !== 'recap' && e.showOnHomepage === true);
          const recapList = activeHotelEvents.filter((e) => e.type === 'recap' && e.showOnHomepage === true);

          // Ad Banner: ONLY show if an active upcoming event explicitly has showAsAdBanner === true
          // DO NOT fallback to upcomingList[0] if the CEO turned off the Ad Banner!
          const adBannerEvent = upcomingList.find((e) => e.showAsAdBanner === true) || null;
          const activeList = homeEventTab === 'upcoming' ? upcomingList : recapList;

          // If no events are active on the website at all, hide the section gracefully
          if (upcomingList.length === 0 && recapList.length === 0) {
            return null;
          }

          return (
            <>
              {/* Section Header & Interactive Tab Switcher */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5c0725]/80 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-semibold uppercase tracking-widest">
                    <PartyPopper size={13} className="text-[#d4af37]" />
                    <span>Events, Poolside Nights &amp; Royal Galas</span>
                  </div>
                  <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white">
                    Upcoming Events &amp; <span className="gold-text-gradient">Past Event Recaps</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Experience live poolside saxophone nights, diplomatic banquets, and cultural soirées—or browse recaps from recent VIP events hosted at Arab Signature Hotel &amp; Suites.
                  </p>
                </div>

                {/* Upcoming vs Previous Recap Tabs */}
                <div className="flex flex-wrap items-center gap-2 bg-[#1c040d] p-1.5 rounded-2xl border border-[#d4af37]/30 self-start">
                  <button
                    type="button"
                    onClick={() => setHomeEventTab('upcoming')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      homeEventTab === 'upcoming'
                        ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Flame size={13} className={homeEventTab === 'upcoming' ? 'text-black' : 'text-emerald-400'} />
                    <span>Upcoming Events ({upcomingList.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHomeEventTab('recap')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      homeEventTab === 'recap'
                        ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Camera size={13} className={homeEventTab === 'recap' ? 'text-black' : 'text-amber-400'} />
                    <span>Previous Event Recaps ({recapList.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('events')}
                    className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#f3e5ab] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>All Events</span>
                    <ChevronRight size={13} className="text-[#d4af37]" />
                  </button>
                </div>
              </div>

              {/* Auto-Designed Luxury Event Advertisement Banner (Only if explicitly enabled by CEO) */}
              {adBannerEvent && (
                <EventAdBannerCard
                  event={adBannerEvent}
                  onOpenBooking={onOpenBooking}
                  onSelectEvent={setSelectedHomeEvent}
                />
              )}

              {/* Events Grid (Upcoming or Recap) */}
              {activeList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeList.map((evt) => (
                    <EventTemplateCard
                      key={evt.id}
                      event={evt}
                      onOpenBooking={onOpenBooking}
                      onSelectEvent={setSelectedHomeEvent}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 sm:p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10 text-gray-400 text-xs font-mono space-y-1">
                  <p className="text-white text-sm font-semibold">
                    No {homeEventTab === 'upcoming' ? 'upcoming events' : 'previous event recaps'} currently active.
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Stay tuned for announcements or check our luxury suites and dining options.
                  </p>
                </div>
              )}
            </>
          );
        })()}

        {/* Full Event Story Modal on Homepage */}
        {selectedHomeEvent && (
          <div
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedHomeEvent(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-[#240310] via-[#16020a] to-[#0c0105] border-2 border-[#d4af37]/60 shadow-2xl my-8"
            >
              <button
                type="button"
                onClick={() => setSelectedHomeEvent(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 text-gray-300 hover:text-white border border-white/20 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="relative h-64 sm:h-72 bg-black">
                <img
                  src={selectedHomeEvent.banner || '/rooms/suite-royal-penthouse.jpg'}
                  alt={selectedHomeEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16020a] via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37] text-black text-[10px] font-extrabold uppercase tracking-widest mb-2">
                    {selectedHomeEvent.highlightBadge || (selectedHomeEvent.type === 'recap' ? 'OFFICIAL EVENT RECAP' : 'UPCOMING EVENT')}
                  </span>
                  <h3 className="font-cinzel text-2xl font-extrabold text-white">
                    {selectedHomeEvent.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#f3e5ab]">
                  <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#d4af37]" />
                    <span>{selectedHomeEvent.dateLabel}</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#d4af37]" />
                    <span>{selectedHomeEvent.venue}</span>
                  </span>
                </div>

                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                  {selectedHomeEvent.writeUp}
                </p>

                {selectedHomeEvent.ticketInfo && (
                  <div className="p-3.5 rounded-2xl bg-[#5c0725]/35 border border-[#d4af37]/40 flex items-center gap-2.5 text-xs sm:text-sm text-[#f3e5ab] font-semibold">
                    <Crown size={16} className="text-[#d4af37] shrink-0" />
                    <span>{selectedHomeEvent.ticketInfo}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/${HOTEL_INFO.whatsapp}?text=${encodeURIComponent(`Hello Arab Signature Hotel! I am inquiring about: *${selectedHomeEvent.title}* (${selectedHomeEvent.dateLabel}).`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider text-center shadow-lg"
                  >
                    {selectedHomeEvent.type === 'recap' ? 'Host Similar Event via WhatsApp' : 'RSVP / Reserve VIP Table on WhatsApp'}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const suiteId = selectedHomeEvent.featuredSuiteId || 'suites';
                      setSelectedHomeEvent(null);
                      onOpenBooking(suiteId);
                    }}
                    className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#d4af37]/40 text-[#f3e5ab] font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Book Suite
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. ULTRA-HD CINEMATIC PHOTO GALLERY SHOWCASE */}
      <div className="border-t border-[#5c0725]/40">
        <PhotoGallerySection
          isFullPage={false}
          onNavigate={onNavigate}
          onOpenBooking={onOpenBooking}
        />
      </div>

      {/* 6. LOCATION & LUXURY SANCTUARY BANNER */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#3a0214] via-[#5c0725] to-[#25010c] text-white border border-[#d4af37]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-[#f3e5ab] uppercase">
              NSUGBE, ONITSHA
            </span>
            <h2 className="font-cinzel text-3xl font-extrabold text-white">
              The Only Verified Signature in Nsugbe
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
              Experience the pinnacle of hospitality in Nsugbe, Onitsha. Enjoy 100% uninterrupted triple-generator & solar power, 24/7 diplomatic security, private poolside VIP cabanas, and opulent Arab suites.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20"
            >
              Location & Directions
            </button>
            <button
              onClick={() => onOpenBooking('deluxe')}
              className={`px-7 py-3.5 rounded-xl ${goldGradient} font-extrabold text-xs uppercase tracking-wider shadow-lg`}
            >
              Book Your Suite
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Room Details & Multi-Angle Photo Modal */}
      {selectedRoomDetails && (
        <RoomDetailsModal
          room={selectedRoomDetails}
          onClose={() => setSelectedRoomDetails(null)}
          onOpenBooking={onOpenBooking}
          initialBuilding={selectedBuilding}
        />
      )}

    </div>
  );
}
