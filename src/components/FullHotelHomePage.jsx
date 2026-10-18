import React, { useState } from 'react';
import Logo from './Logo';
import { ROOMS, HOTEL_INFO, AMENITIES, SAMPLE_NAMES } from '../data/hotelData';
import { 
  Calendar, Users, ArrowRight, Star, ShieldCheck, Zap, Crown, 
  Car, Sparkles, Utensils, Waves, Phone, MapPin, Check, 
  ChevronRight, Play, Heart, Clock, Menu, X, Share2, Award,
  KeyRound, Shield, Compass, ArrowUpRight, Plane, Bed, ShoppingBag,
  Bell, MessageSquare, Radio, Key, Moon, Plus, Minus, ChevronDown
} from 'lucide-react';

export default function FullHotelHomePage({ themeId = 1, onOpenBooking, onSelectTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [checkIn, setCheckIn] = useState('2026-10-20');
  const [checkOut, setCheckOut] = useState('2026-10-22');
  const [guestsCount, setGuestsCount] = useState(2);
  const [suitesCount, setSuitesCount] = useState(1);
  const [roomType, setRoomType] = useState('deluxe');

  // Interactive state for specific theme heroes
  const [airlineTab, setAirlineTab] = useState('stay');
  const [airlineSuiteIdx, setAirlineSuiteIdx] = useState(0);
  const [selectedAmenityHero, setSelectedAmenityHero] = useState('spa');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const currentTheme = SAMPLE_NAMES.find(t => t.id === themeId) || SAMPLE_NAMES[0];

  // Theme-specific styling variables
  const isDesign1 = themeId === 1;
  const isDesign2 = themeId === 2; // Futuristic Minimal Obsidian
  const isDesign3 = themeId === 3; // Airline Ivory
  const isDesign4 = themeId === 4; // Editorial White
  const isDesign5 = themeId === 5; // High-Tech Mashrabiya
  const isDesign6 = themeId === 6; // Circular Halo
  const isDesign7 = themeId === 7; // Golden Mirage
  const isDesign8 = themeId === 8; // Rose Gold
  const isDesign9 = themeId === 9; // Midnight Velvet
  const isDesign10 = themeId === 10; // Interactive Amenities

  const isLight = isDesign3 || isDesign4 || isDesign7 || isDesign10;

  // Background classes for overall page
  let bgClass = 'bg-[#120208] text-gray-100'; // Default Design 1
  if (isDesign2) bgClass = 'bg-[#07070a] text-gray-100';
  else if (isDesign3) bgClass = 'bg-[#faf7f2] text-[#241a1c]';
  else if (isDesign4) bgClass = 'bg-[#ffffff] text-[#1a1618]';
  else if (isDesign5) bgClass = 'bg-[#14010a] text-gray-100';
  else if (isDesign6) bgClass = 'bg-[#22020e] text-gray-100';
  else if (isDesign7) bgClass = 'bg-[#f6f2e9] text-[#2c2621]';
  else if (isDesign8) bgClass = 'bg-[#1f0d12] text-[#f7e9e5]';
  else if (isDesign9) bgClass = 'bg-[#140008] text-gray-100';
  else if (isDesign10) bgClass = 'bg-[#fcf9f2] text-[#261f1c]';

  // Card background classes
  let cardBgClass = 'bg-[#1f050f]/80 border-[#d4af37]/30 text-white shadow-xl';
  if (isDesign2) cardBgClass = 'bg-[#111116]/90 border-white/10 text-white shadow-2xl';
  else if (isDesign3) cardBgClass = 'bg-white border-[#e8dfcf] text-[#241a1c] shadow-sm';
  else if (isDesign4) cardBgClass = 'bg-[#fafafa] border-gray-200 text-[#1a1618] shadow-sm';
  else if (isDesign5) cardBgClass = 'bg-[#220412]/80 border-[#d4af37]/40 text-white shadow-xl';
  else if (isDesign6) cardBgClass = 'bg-[#2e0314]/80 border-[#d4af37]/35 text-white shadow-xl';
  else if (isDesign7) cardBgClass = 'bg-white border-[#e5decb] text-[#2c2621] shadow-md';
  else if (isDesign8) cardBgClass = 'bg-[#2d151c]/80 border-[#d99b82]/40 text-white shadow-xl';
  else if (isDesign9) cardBgClass = 'bg-[#250110]/80 border-[#d4af37]/25 text-white shadow-xl';
  else if (isDesign10) cardBgClass = 'bg-white border-[#eee7da] text-[#261f1c] shadow-sm';

  // Button gradients
  const goldGradient = isDesign8
    ? 'bg-gradient-to-r from-[#d99b82] via-[#f0cfc4] to-[#b87d69] text-black'
    : isDesign2
      ? 'bg-[#d4af37] hover:bg-[#e5bc4b] text-black font-mono tracking-widest'
      : isDesign4
        ? 'bg-[#5c0725] hover:bg-[#430419] text-white'
        : 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  const filteredRooms = selectedCategory === 'all' 
    ? ROOMS 
    : ROOMS.filter(r => r.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    onOpenBooking(roomType);
  };

  return (
    <div className={`min-h-screen ${bgClass} font-sans selection:bg-[#d4af37] selection:text-black transition-colors duration-500`}>
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className={`px-4 py-2 text-center text-xs border-b flex items-center justify-center gap-2 ${
        isDesign2 ? 'bg-[#0d0d12] text-[#f3e5ab] border-white/10' :
        isDesign3 ? 'bg-[#5c0725] text-[#f3e5ab] border-[#e8dfcf]' :
        isDesign4 ? 'bg-gray-100 text-gray-900 border-gray-200' :
        isDesign7 ? 'bg-[#d4af37] text-black border-black/10 font-bold' :
        isDesign8 ? 'bg-[#3b1922] text-[#f0cfc4] border-[#d99b82]/30' :
        isDesign9 ? 'bg-[#20010d] text-[#f3e5ab] border-white/5' :
        'bg-gradient-to-r from-[#3a0214] via-[#5c0725] to-[#3a0214] text-[#f3e5ab] border-[#d4af37]/20'
      }`}>
        <Award size={14} className="text-[#d4af37]" />
        <span className="font-medium tracking-wide">
          Direct Website Booking: Free Morning Buffet & Complimentary Chauffeur Airport Pickup
        </span>
        <span className="hidden md:inline font-mono text-[10px] opacity-80">• Hotline: {HOTEL_INFO.phone}</span>
      </div>

      {/* 2. MAIN LUXURY NAVIGATION */}
      <header className={`sticky top-0 z-40 px-6 py-4 transition-all duration-300 backdrop-blur-xl border-b ${
        isLight ? 'bg-white/90 border-[#e8dfcf]' : isDesign2 ? 'bg-[#07070a]/90 border-white/10' : 'bg-[#120208]/90 border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <Logo variant={isLight ? "burgundy" : "gold"} size="default" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold">
            <a href="#about" className="hover:text-[#d4af37] transition-colors">Our Heritage</a>
            <a href="#suites" className="hover:text-[#d4af37] transition-colors">Doha Suites</a>
            <a href="#amenities" className="hover:text-[#d4af37] transition-colors">Poolside & Cabanas</a>
            <a href="#dining" className="hover:text-[#d4af37] transition-colors">Al-Sultan Dining</a>
            <a href="#location" className="hover:text-[#d4af37] transition-colors">Location</a>
          </nav>

          {/* Right Action Tools */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${HOTEL_INFO.whatsapp}?text=Hello%20Arab%20Signature%20Hotel,%20I%20would%20like%20to%20inquire%20about%20suite%20reservations.`}
              target="_blank"
              rel="noreferrer"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isLight ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              <Phone size={14} className="text-[#d4af37]" />
              <span>WhatsApp Concierge</span>
            </a>

            <button
              onClick={() => onOpenBooking('deluxe')}
              className={`px-5 py-2.5 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:opacity-95 transition-all flex items-center gap-1.5`}
            >
              <Sparkles size={14} />
              <span>Book A Suite</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl ${isLight ? 'text-gray-900 bg-gray-100' : 'text-white bg-white/10'}`}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden mt-3 p-4 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#1a040d] border-[#d4af37]/30 text-white'
          }`}>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold border-b border-white/5">Our Heritage</a>
            <a href="#suites" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold border-b border-white/5">Doha Suites & Rates</a>
            <a href="#amenities" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold border-b border-white/5">Poolside & Cabanas</a>
            <a href="#dining" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold border-b border-white/5">Al-Sultan Dining</a>
            <a href="#location" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold border-b border-white/5">Location & Contact</a>
            
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking('deluxe');
              }}
              className={`w-full py-3 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider text-center block mt-2`}
            >
              Book A Suite Now
            </button>
          </div>
        )}
      </header>

      {/* 3. DYNAMIC HERO SECTIONS (EACH THEME HAS ITS OWN DISTINCT SIGNATURE HERO) */}

      {/* ========================================================
          THEME 1: CINEMATIC HERO (USER'S EXACT FAVORITE - UNTOUCHED!)
         ======================================================== */}
      {isDesign1 && (
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/hero-palace.jpg"
              alt="Arab Signature Hotel Grand Exterior & Suites"
              className="w-full h-full object-cover object-center scale-105 brightness-110 animate-pulse duration-[10000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-[#380314]/85 to-black/90" />
            <div className="absolute inset-0 arabesque-pattern opacity-15 pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5c0725]/50 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-mono tracking-widest shadow-xl backdrop-blur-md">
              <Crown size={14} className="text-[#d4af37]" />
              <span>5-STAR ARABIAN MAJESTY IN NIGERIA</span>
            </div>

            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide leading-tight text-white">
              Where Doha Elegance Meets <br className="hidden sm:inline" />
              <span className="gold-text-gradient">Legendary Hospitality</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-gray-300">
              Immerse yourself in opulent Arabian architecture, serene private poolside cabanas, authentic Middle Eastern dining, and 24/7 presidential security in the heart of GRA.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="#suites"
                className={`px-8 py-4 rounded-2xl ${goldGradient} font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-[#d4af37]/30 hover:scale-105 active:scale-98 transition-all flex items-center gap-2`}
              >
                <span>Explore Doha Suites</span>
                <ArrowRight size={16} />
              </a>

              <button
                onClick={() => onOpenBooking('royal')}
                className="px-7 py-4 rounded-2xl bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-md font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Crown size={15} className="text-[#d4af37]" />
                <span>Royal Penthouse</span>
              </button>
            </div>

            {/* Horizontal Booking Engine Bar */}
            <div className="pt-8 max-w-4xl mx-auto">
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
                      {ROOMS.map(r => (
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
      )}

      {/* ========================================================
          THEME 2: FUTURISTIC MINIMAL (3D OBSIDIAN & FLOATING CARDS)
         ======================================================== */}
      {isDesign2 && (
        <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 bg-[#07070a] overflow-hidden">
          {/* Neon Radial Glows */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d4af37]/10 blur-[130px] pointer-events-none" />
          
          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#d4af37]/40 text-[#d4af37] text-[11px] font-mono tracking-widest">
                <Sparkles size={12} /> V2.0 ARCHITECTURAL LUXURY
              </div>

              <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-none">
                FUTURISTIC <br />
                <span className="text-[#d4af37]">TYPOGRAPHY</span>
              </h1>

              <p className="text-sm text-gray-400 font-light max-w-md leading-relaxed">
                Floating 3D sleek elements, minimal dark luxury geometry, and autonomous QR room access in Nigeria.
              </p>

              {/* Glassmorphic Selector */}
              <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-black/60 border border-white/5">
                    <span className="text-[10px] font-mono text-[#d4af37] uppercase block">DATES</span>
                    <span className="text-white font-medium text-xs mt-1 block">Oct 20 — 22</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/60 border border-white/5">
                    <span className="text-[10px] font-mono text-[#d4af37] uppercase block">ACCESS</span>
                    <span className="text-white font-medium text-xs mt-1 block">Diplomatic Pass</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenBooking('executive')}
                  className="w-full py-3.5 rounded-2xl bg-[#d4af37] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#e5bc4b] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.3)]"
                >
                  Instant Reservation <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            {/* 3D Floating Glass Cards & Pedestal */}
            <div className="relative py-12 flex flex-col items-center justify-center">
              <div className="relative w-80 h-72 flex items-center justify-center">
                
                {/* Floating Card 1 */}
                <div className="absolute top-4 left-4 w-44 h-56 rounded-3xl bg-gradient-to-br from-[#d4af37]/25 to-black/80 border border-[#d4af37]/50 backdrop-blur-2xl p-4 shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between text-left">
                  <span className="text-[10px] font-mono uppercase text-[#f3e5ab]">SUITE 01</span>
                  <div>
                    <div className="text-sm font-bold text-white">Deluxe Doha</div>
                    <div className="text-xs text-[#d4af37] font-mono font-bold">₦45,000 / Night</div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute top-0 right-4 w-44 h-56 rounded-3xl bg-gradient-to-br from-[#f3e5ab]/30 to-black/80 border border-[#d4af37]/70 backdrop-blur-2xl p-4 shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between text-left z-10">
                  <span className="text-[10px] font-mono uppercase text-[#d4af37]">SUITE 02</span>
                  <div>
                    <div className="text-sm font-bold text-white">Executive Penthouse</div>
                    <div className="text-xs text-[#d4af37] font-mono font-bold">₦120,000 / Night</div>
                  </div>
                </div>

                {/* Glowing Pedestal Base */}
                <div className="absolute bottom-0 w-64 h-12 rounded-full border border-[#d4af37]/70 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent blur-[2px] shadow-[0_0_35px_rgba(212,175,55,0.5)]" />
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ========================================================
          THEME 3: LUXURY AIRLINE-INSPIRED (WARM IVORY & AIRLINE SWIPER)
         ======================================================== */}
      {isDesign3 && (
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-16 bg-[#faf7f2] text-[#241a1c]">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5c0725]/10 text-[#5c0725] text-xs font-bold uppercase tracking-wider">
                <Plane size={14} /> Five-Star Airline Inspired
              </div>

              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-[#1e1315]">
                Experience Qatar & <br />
                <span className="italic font-serif text-[#5c0725]">Arabian Hospitality</span>
              </h1>

              <p className="text-sm text-[#665b55] leading-relaxed max-w-md">
                Bespoke chauffeur transit from the airport terminal straight to your private suite, curated in warm ivory elegance.
              </p>

              {/* Boarding Pass Selector */}
              <div className="p-5 rounded-3xl bg-white border border-[#e8dfcf] shadow-lg space-y-4">
                <div className="flex rounded-2xl bg-[#f4eee4] p-1 text-xs">
                  <button
                    onClick={() => setAirlineTab('stay')}
                    className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      airlineTab === 'stay' ? 'bg-white text-[#5c0725] shadow-sm' : 'text-[#7d7168]'
                    }`}
                  >
                    <Bed size={14} /> Stay Only
                  </button>
                  <button
                    onClick={() => setAirlineTab('transit')}
                    className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                      airlineTab === 'transit' ? 'bg-white text-[#5c0725] shadow-sm' : 'text-[#7d7168]'
                    }`}
                  >
                    <Plane size={14} /> Airport Transit
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#faf7f2] border border-[#e8dfcf]">
                    <span className="text-[10px] uppercase font-bold text-[#7d7168]">Check-In</span>
                    <span className="font-bold text-sm block mt-0.5">20 Oct 2026</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#faf7f2] border border-[#e8dfcf]">
                    <span className="text-[10px] uppercase font-bold text-[#7d7168]">Check-Out</span>
                    <span className="font-bold text-sm block mt-0.5">22 Oct 2026</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenBooking('deluxe')}
                  className="w-full py-4 rounded-2xl bg-[#5c0725] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#430419] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  Book First-Class Stay <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Curated Suite Carousel */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#5c0725] uppercase tracking-wider">Featured Suites</span>
                <div className="flex gap-1.5">
                  {ROOMS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAirlineSuiteIdx(idx)}
                      className={`h-2 rounded-full transition-all ${airlineSuiteIdx === idx ? 'w-6 bg-[#5c0725]' : 'w-2 bg-[#d8cfc4]'}`}
                    />
                  ))}
                </div>
              </div>

              <div 
                onClick={() => onOpenBooking(ROOMS[airlineSuiteIdx].id)}
                className="rounded-3xl overflow-hidden shadow-xl border border-[#e8dfcf] bg-white group cursor-pointer"
              >
                <img
                  src={ROOMS[airlineSuiteIdx].image}
                  alt={ROOMS[airlineSuiteIdx].name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-5 flex justify-between items-center bg-white">
                  <div>
                    <h3 className="font-playfair font-bold text-lg text-gray-900">{ROOMS[airlineSuiteIdx].name}</h3>
                    <p className="text-xs text-[#7d7168] mt-0.5">{ROOMS[airlineSuiteIdx].bed} • Breakfast Included</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#7d7168] block">From</span>
                    <span className="text-base font-bold text-[#5c0725]">{ROOMS[airlineSuiteIdx].priceFormatted}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ========================================================
          THEME 4: BRIGHT & AIRY (SWISS EDITORIAL WHITE & LOTS OF SPACE)
         ======================================================== */}
      {isDesign4 && (
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 bg-white text-[#1a1618]">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[#5c0725] text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Minimal Editorial Elegance
            </div>

            <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl font-normal leading-tight text-[#160f11]">
              Bright & Airy.<br />
              <span className="italic font-serif text-[#5c0725]">Plan Your Stay.</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
              Lots of generous white space, curated architectural natural light, and bespoke concierge care.
            </p>

            <div className="pt-4 flex justify-center">
              <div 
                onClick={() => onOpenBooking('royal')}
                className="rounded-3xl overflow-hidden shadow-sm border border-gray-200 group cursor-pointer max-w-2xl w-full"
              >
                <img
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80"
                  alt="Penthouse"
                  className="w-full h-72 object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="p-5 flex justify-between items-center bg-[#fafafa]">
                  <div className="text-left">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PRESIDENTIAL SUITE</span>
                    <h3 className="font-playfair font-bold text-base text-gray-900">Royal Diplomatic Penthouse</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#5c0725]">₦120,000 / Night</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Pill Action Button */}
            <div className="pt-4">
              <button
                onClick={() => onOpenBooking('deluxe')}
                className="px-10 py-4 rounded-full bg-[#5c0725] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-[#430419] transition-all flex items-center justify-center gap-2 mx-auto"
              >
                Plan Your Stay <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </section>
      )}

      {/* ========================================================
          THEME 5: MODERN HIGH-TECH (GEOMETRIC MASHRABIYA & AI ASSISTANT)
         ======================================================== */}
      {isDesign5 && (
        <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 bg-[#16020c] overflow-hidden text-white">
          <div className="absolute inset-0 mashrabiya-grid opacity-35 pointer-events-none" />
          
          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7">
            
            {/* Glowing Diamond Monogram */}
            <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 m-auto w-32 h-32 border border-[#d4af37]/50 rotate-45 rounded-3xl bg-gradient-to-br from-[#5c0725]/60 to-black/80 backdrop-blur-md shadow-[0_0_35px_rgba(212,175,55,0.3)]" />
              <div className="relative z-10 text-center">
                <Sparkles size={28} className="text-[#f3e5ab] mx-auto animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-[#d4af37] block mt-1">DOHA AI</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] bg-[#5c0725]/40 px-3 py-1 rounded-full border border-[#d4af37]/30">
                <Radio size={14} className="animate-pulse text-emerald-400" /> LIVE AI ROOM FOLIO
              </div>

              <h1 className="font-cinzel text-4xl sm:text-5xl font-bold tracking-wide">
                Modern-Burgundy Interactions
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                Smart automated room booking with Paystack verification and instant AI assistance.
              </p>
            </div>

            {/* Floating AI Assistant Chat Pill */}
            <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-gradient-to-r from-[#380415] to-[#1c020b] border border-[#d4af37]/40 shadow-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Quick-booking Assistant</div>
                  <div className="text-[10px] text-gray-300">Need help selecting a suite tonight?</div>
                </div>
              </div>
              <button 
                onClick={() => onOpenBooking('deluxe')}
                className="px-4 py-2 rounded-xl bg-[#5c0725] text-white text-xs font-bold border border-[#d4af37]/40 hover:bg-[#720a2f]"
              >
                Chat
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenBooking('deluxe')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:opacity-95"
              >
                Enter Room Booking Portal
              </button>
            </div>

          </div>
        </section>
      )}

      {/* ========================================================
          THEME 6: CIRCULAR HALO HERO (GOLDEN ORBIT HALO)
         ======================================================== */}
      {isDesign6 && (
        <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 bg-gradient-to-b from-[#2d0312] to-[#120108] text-white overflow-hidden text-center">
          <div className="max-w-4xl mx-auto space-y-8 flex flex-col items-center">
            
            {/* Massive Glowing Golden Orbit Ring */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#d4af37]/40 animate-[spin_50s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border-2 border-[#f3e5ab] shadow-[0_0_40px_rgba(212,175,55,0.4)]" />
              
              <div className="w-60 h-60 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
                  alt="Suite"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">Royal Orbit</span>
                  <div className="text-sm font-bold text-white">Deluxe Doha Suite</div>
                  <div className="text-xs font-bold text-[#f3e5ab]">₦45,000 / Night</div>
                </div>
              </div>

              <div className="absolute -bottom-3 bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-extrabold text-[10px] uppercase px-4 py-1.5 rounded-full shadow-lg">
                Golden Orbit Selection
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#f3e5ab]">
                The Golden Halo of Arab Luxury
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                Step inside the golden orbit of authentic palatial suites and VIP poolside service.
              </p>
            </div>

            <button
              onClick={() => onOpenBooking('deluxe')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-black font-extrabold text-xs uppercase tracking-widest shadow-xl hover:opacity-95"
            >
              Reserve Inside The Orbit
            </button>

          </div>
        </section>
      )}

      {/* ========================================================
          THEME 7: GOLDEN MIRAGE (METALLIC CURVED HEADER)
         ======================================================== */}
      {isDesign7 && (
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-16 bg-[#f6f2e9] text-[#2c2621]">
          <div className="max-w-5xl mx-auto w-full space-y-8">
            
            {/* Prominent Golden Metallic Curved Card */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#e8c872] via-[#d4af37] to-[#b8860b] text-black shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#420317] block">
                    GOLDEN MIRAGE SUITES
                  </span>
                  <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold mt-1">
                    Quick Check-In & Availability
                  </h1>
                </div>
                <div className="text-sm font-bold text-[#420317] bg-white/40 px-4 py-2 rounded-xl backdrop-blur-sm">
                  Verified Paystack Booking
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/90 border border-black/10">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Suite Category</span>
                  <span className="font-bold text-sm text-gray-900 mt-1 block">Signature Doha Suite</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/90 border border-black/10">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Check-In</span>
                  <span className="font-bold text-sm text-gray-900 mt-1 block">20 Oct 2026</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/90 border border-black/10">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Check-Out</span>
                  <span className="font-bold text-sm text-gray-900 mt-1 block">22 Oct 2026</span>
                </div>
              </div>

              <button
                onClick={() => onOpenBooking('deluxe')}
                className="w-full py-4 rounded-2xl bg-[#420317] hover:bg-[#5c0725] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all"
              >
                Check Available Golden Suites
              </button>
            </div>

          </div>
        </section>
      )}

      {/* ========================================================
          THEME 8: ROSE GOLD ELEGANCE (ROMANTIC BLUSH & COPPER)
         ======================================================== */}
      {isDesign8 && (
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-16 bg-gradient-to-b from-[#2d141b] via-[#1f0d12] to-[#120508] text-[#f7e9e5]">
          <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d99b82]/20 border border-[#d99b82]/40 text-[#f0cfc4] text-xs font-mono">
                <Heart size={14} className="text-[#d99b82]" /> ROMANTIC SUITE COLLECTION
              </div>

              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white">
                Rose Gold Elegance & <br />
                <span className="text-[#d99b82]">Warm Penthouse Glow</span>
              </h1>

              <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                Candlelit ambiance, copper metallic trim, private jacuzzi suites, and VIP cabanas for unforgettable romantic stays.
              </p>

              <button
                onClick={() => onOpenBooking('executive')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d99b82] to-[#b87d69] text-black font-extrabold text-xs uppercase tracking-widest shadow-xl hover:opacity-95"
              >
                Reserve Romantic Penthouse
              </button>
            </div>

            <div className="rounded-3xl overflow-hidden border border-[#d99b82]/40 shadow-2xl bg-black">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
                alt="Rose Gold Suite"
                className="w-full h-80 object-cover"
              />
              <div className="p-5 bg-[#251016] flex justify-between items-center">
                <div>
                  <h3 className="font-playfair font-bold text-base text-white">Executive Arabian Suite</h3>
                  <span className="text-xs text-[#d99b82]">Jacuzzi & Private Lounge Included</span>
                </div>
                <span className="text-base font-bold text-[#f0cfc4]">₦65,000 / Night</span>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ========================================================
          THEME 9: MIDNIGHT VELVET (DEEP PLUM NIGHT MODE & GUEST MATRIX)
         ======================================================== */}
      {isDesign9 && (
        <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 bg-[#140008] text-white">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5c0725]/50 border border-white/10 text-[#d4af37] text-xs font-mono">
              <Moon size={14} /> 24/7 NIGHT MODE & IMMEDIATE ARRIVALS
            </div>

            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-bold">
              Midnight Velvet Luxury
            </h1>

            <p className="text-sm text-gray-300 max-w-md mx-auto">
              Arriving late from the airport? Instant verified booking with 24-hour reception check-in.
            </p>

            {/* Inline Interactive Guest Counter Matrix */}
            <div className="p-6 rounded-3xl bg-[#250110]/90 border border-[#d4af37]/30 max-w-md mx-auto space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <Users size={14} className="text-[#d4af37]" /> Number of Guests
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-mono font-bold text-base text-[#f3e5ab] w-6 text-center">{guestsCount}</span>
                  <button
                    onClick={() => setGuestsCount(guestsCount + 1)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <Crown size={14} className="text-[#d4af37]" /> Suites Needed
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSuitesCount(Math.max(1, suitesCount - 1))}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-mono font-bold text-base text-[#f3e5ab] w-6 text-center">{suitesCount}</span>
                  <button
                    onClick={() => setSuitesCount(suitesCount + 1)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => onOpenBooking('deluxe')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:opacity-95"
              >
                Find Night Available Rooms
              </button>
            </div>

          </div>
        </section>
      )}

      {/* ========================================================
          THEME 10: INTERACTIVE AMENITIES (RESORT OASIS & TABS)
         ======================================================== */}
      {isDesign10 && (
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-16 bg-[#fcf9f2] text-[#261f1c]">
          <div className="max-w-5xl mx-auto w-full space-y-8 text-center">
            
            <div className="space-y-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#5c0725] font-bold">
                RESORT OASIS & AMENITIES
              </span>
              <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-[#1f1618]">
                Interactive Hotel Amenities
              </h1>
              <p className="text-xs sm:text-sm text-[#73655d] max-w-md mx-auto">
                Select an amenity below to explore the luxury facilities awaiting your arrival.
              </p>
            </div>

            {/* Amenity Filter Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {AMENITIES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedAmenityHero(item.id)}
                  className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                    selectedAmenityHero === item.id
                      ? 'bg-[#5c0725] text-white shadow-lg scale-105'
                      : 'bg-white border border-[#eee7da] text-[#73655d] hover:border-[#5c0725]/40'
                  }`}
                >
                  <Sparkles size={18} />
                  <span className="text-xs font-bold">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Selected Amenity Preview Card */}
            {(() => {
              const activeItem = AMENITIES.find(a => a.id === selectedAmenityHero) || AMENITIES[0];
              return (
                <div className="p-6 rounded-3xl bg-[#f5efe3] border border-[#e8dfcf] max-w-2xl mx-auto space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[#5c0725] uppercase tracking-wider">{activeItem.name}</span>
                    <span className="text-xs bg-white px-3 py-1 rounded-full text-[#73655d] font-semibold border border-[#e8dfcf]">
                      Free for All Guests
                    </span>
                  </div>
                  <p className="text-xs text-[#4d4039] leading-relaxed">{activeItem.desc}</p>
                </div>
              );
            })()}

            <button
              onClick={() => onOpenBooking('deluxe')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-widest shadow-xl hover:opacity-95"
            >
              Book Stay With Free Amenities
            </button>

          </div>
        </section>
      )}

      {/* 4. ABOUT & ARABIAN HERITAGE SECTION */}
      <section id="about" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5c0725]/30 border border-[#d4af37]/40 text-[#d4af37] text-xs font-mono">
              ABOUT ARAB SIGNATURE HOTEL & SUITES
            </div>
            
            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wide leading-tight">
              An Architectural Oasis of <span className="gold-text-gradient">Royal Comfort</span>
            </h2>

            <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-gray-700' : 'text-gray-200'}`}>
              Welcome to Arab Signature Hotel and Suites, a premier luxury destination located in Nsugbe, Onitsha. We pride ourselves on delivering an exceptional blend of world-class comfort, sophisticated design, and unparalleled guest experiences. Whether visiting for business or leisure, our guests enjoy state-of-the-art amenities, elegantly appointed suites, and premium dining options designed to meet the highest standards of excellence. Independently owned and operated by a private investment group, our establishment is dedicated to providing a secure, relaxing, and memorable stay. Experience the ultimate standard of elegance and premium service with us.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
                <ShieldCheck size={24} className="text-[#d4af37] mb-2" />
                <h4 className="font-bold text-sm">Diplomatic Security</h4>
                <p className="text-xs text-gray-400 mt-1">24/7 armed perimeter patrols, encrypted access, and discreet VIP escort.</p>
              </div>

              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
                <Zap size={24} className="text-[#d4af37] mb-2" />
                <h4 className="font-bold text-sm">Zero Power Outages</h4>
                <p className="text-xs text-gray-400 mt-1">Dual soundproof industrial generators + commercial solar inverter bank.</p>
              </div>

              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
                <Crown size={24} className="text-[#d4af37] mb-2" />
                <h4 className="font-bold text-sm">Butler on Demand</h4>
                <p className="text-xs text-gray-400 mt-1">Personal suite floor butler for laundry pressing, room folio, and private requests.</p>
              </div>

              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
                <ShieldCheck size={24} className="text-[#d4af37] mb-2" />
                <h4 className="font-bold text-sm">Executive Valet Parking</h4>
                <p className="text-xs text-gray-400 mt-1">Secure on-site valet parking and 24/7 dedicated armed security escort.</p>
              </div>
            </div>
          </div>

          {/* Double Photo Collage */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border-2 border-[#d4af37]/40 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
                alt="Arab Signature Presidential Suite"
                className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-56 rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-2xl hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80"
                alt="Suite Interior"
                className="w-full h-44 object-cover"
              />
            </div>
            <div className="absolute top-4 right-4 bg-[#5c0725] text-[#f3e5ab] text-xs font-bold px-4 py-2 rounded-xl shadow-lg border border-[#d4af37]/40">
              Nsugbe, Onitsha
            </div>
          </div>


        </div>
      </section>

      {/* 5. SUITES & RESIDENCES SHOWCASE */}
      <section id="suites" className={`py-20 px-6 border-y ${
        isLight ? 'bg-[#f4eee4] border-gray-200' : 'bg-[#17030c] border-[#5c0725]/40'
      }`}>
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] block font-semibold">
                ACCOMMODATION & LUXURY LIVING
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wide mt-1">
                Handcrafted Doha Suites & Penthouses
              </h2>
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              {['all', 'signature', 'executive', 'penthouse', 'classic'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-semibold capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#d4af37] text-black shadow-md font-bold'
                      : isLight 
                        ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cat === 'all' ? 'All Residences' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className={`rounded-3xl overflow-hidden border flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group ${cardBgClass}`}
              >
                {/* Room Photo */}
                <div className="relative h-56 overflow-hidden bg-black">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3 bg-[#5c0725] text-[#f3e5ab] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {room.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[#d4af37] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-white/10">
                    <Star size={11} fill="#d4af37" /> {room.rating}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white text-xs drop-shadow">
                    <span className="font-medium">{room.bed}</span>
                    <span className="font-mono bg-black/60 px-2 py-0.5 rounded text-[10px]">{room.size}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-cinzel text-lg font-bold truncate group-hover:text-[#d4af37] transition-colors">
                      {room.name}
                    </h3>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                      {room.description}
                    </p>
                  </div>

                  {/* Key Amenities */}
                  <div className="space-y-1.5 py-2 border-y border-black/10 dark:border-white/10 text-[11px] text-gray-400">
                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check size={13} className="text-[#d4af37] flex-shrink-0" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & Book Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-gray-400 block font-medium">Nightly Rate</span>
                      <div className="text-lg font-extrabold text-[#d4af37]">
                        {room.priceFormatted}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onOpenBooking(room.id)}
                      className={`px-4 py-2.5 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-all`}
                    >
                      Reserve Suite
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. EXCLUSIVE HOTEL AMENITIES & LIFESTYLE */}
      <section id="amenities" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold">
            HOTEL AMENITIES & RECREATION
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wide">
            Designed for Serenity & Indulgence
          </h2>
          <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
            Every moment at Arab Signature Hotel is crafted to ensure tranquility, privacy, and exceptional comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Amenity 1: Poolside & VIP Cabanas */}
          <div className={`p-6 rounded-3xl border space-y-4 ${cardBgClass}`}>
            <div className="w-12 h-12 rounded-2xl bg-[#5c0725] text-[#f3e5ab] flex items-center justify-center">
              <Waves size={24} />
            </div>
            <h3 className="font-cinzel text-lg font-bold">Poolside & VIP Cabanas</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Lounge by our private swimming pool with curtained VIP cabanas, poolside cocktail service, and Arabian sunbeds.
            </p>
          </div>

          {/* Amenity 2: Al-Sultan Gourmet Dining */}
          <div id="dining" className={`p-6 rounded-3xl border space-y-4 ${cardBgClass}`}>
            <div className="w-12 h-12 rounded-2xl bg-[#5c0725] text-[#f3e5ab] flex items-center justify-center">
              <Utensils size={24} />
            </div>
            <h3 className="font-cinzel text-lg font-bold">Al-Sultan Gourmet Dining</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Authentic Middle Eastern delights (hummus, lamb mandi, mixed grills) paired with continental and Nigerian delicacies.
            </p>
          </div>

          {/* Amenity 3: Royal Moroccan Spa */}
          <div className={`p-6 rounded-3xl border space-y-4 ${cardBgClass}`}>
            <div className="w-12 h-12 rounded-2xl bg-[#5c0725] text-[#f3e5ab] flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <h3 className="font-cinzel text-lg font-bold">Royal Moroccan Spa</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Therapeutic deep-tissue massage, traditional steam baths, and organic Arabian aromatherapy treatments.
            </p>
          </div>

          {/* Amenity 4: Executive Boardroom */}
          <div className={`p-6 rounded-3xl border space-y-4 ${cardBgClass}`}>
            <div className="w-12 h-12 rounded-2xl bg-[#5c0725] text-[#f3e5ab] flex items-center justify-center">
              <Crown size={24} />
            </div>
            <h3 className="font-cinzel text-lg font-bold">Diplomatic Majlis & Boardroom</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Private soundproof executive meeting chambers with 85-inch 4K conference displays, high-speed fiber Wi-Fi, and secretary service.
            </p>
          </div>

        </div>
      </section>

      {/* 7. GUEST TESTIMONIALS */}
      <section className={`py-16 px-6 border-y ${
        isLight ? 'bg-white border-gray-200' : 'bg-[#18030d] border-white/10'
      }`}>
        <div className="max-w-6xl mx-auto space-y-8 text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold">
            TESTIMONIALS
          </span>
          <h2 className="font-cinzel text-3xl font-extrabold tracking-wide">
            Endorsed by Executives & Diplomats
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className={`p-6 rounded-3xl border ${cardBgClass} space-y-3`}>
              <div className="flex text-[#d4af37]">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#d4af37" />)}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                "The closest you will get to a 5-star Doha boutique resort in Nigeria. The privacy, uninterrupted power, and poolside cabanas are world class."
              </p>
              <div className="pt-2 border-t border-white/10">
                <div className="font-bold text-xs text-white">Amb. K. Mohammed</div>
                <span className="text-[10px] text-gray-400">Diplomatic Mission Guest</span>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border ${cardBgClass} space-y-3`}>
              <div className="flex text-[#d4af37]">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#d4af37" />)}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                "Booking took less than 2 minutes via Paystack and my booking code showed up on WhatsApp right away. Front desk checked me in under 30 seconds."
              </p>
              <div className="pt-2 border-t border-white/10">
                <div className="font-bold text-xs text-white">Dr. Ngozi Adeleke</div>
                <span className="text-[10px] text-gray-400">Executive Traveler</span>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border ${cardBgClass} space-y-3`}>
              <div className="flex text-[#d4af37]">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#d4af37" />)}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                "The Royal Penthouse is breathtaking. Butler on demand made our anniversary celebration seamless. We will definitely be back!"
              </p>
              <div className="pt-2 border-t border-white/10">
                <div className="font-bold text-xs text-white">Chief Emmanuel O.</div>
                <span className="text-[10px] text-gray-400">Royal Penthouse Guest</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LOCATION & DIRECT CONCIERGE HOTLINE */}
      <section id="location" className="py-20 px-6 max-w-7xl mx-auto space-y-10">
        <div className={`rounded-3xl p-8 sm:p-12 border ${
          isLight ? 'bg-[#5c0725] text-white' : 'bg-gradient-to-r from-[#3a0214] via-[#5c0725] to-[#25010c] text-white border-[#d4af37]/40'
        } shadow-2xl relative overflow-hidden`}>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-[#f3e5ab] uppercase">
                NSUGBE, ONITSHA DESTINATION
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white">
                Visit Arab Signature Hotel & Suites
              </h2>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                Conveniently situated in Nsugbe, Onitsha, Anambra State. Perfectly positioned to offer a peaceful, secure retreat with swift access to the commercial heartbeat of Onitsha and regional airports.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#d4af37]" />
                  <span>Nsugbe, Onitsha, Anambra State, Nigeria</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-[#d4af37]" />
                  <span>Front Desk Direct: {HOTEL_INFO.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href={`https://wa.me/${HOTEL_INFO.whatsapp}?text=Hello%20Arab%20Signature%20Hotel,%20I%20would%20like%20directions%20to%20your%20hotel%20in%20Nsugbe,%20Onitsha%20and%20to%20reserve%20a%20suite.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:opacity-95"
                >
                  <Share2 size={15} />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  onClick={() => onOpenBooking('deluxe')}
                  className={`px-6 py-3 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-lg`}
                >
                  Book Online with Paystack
                </button>
              </div>
            </div>

            {/* Simulated Map Card */}
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-black/60 p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-mono text-[#d4af37] tracking-widest uppercase">CONCIERGE & VALET</span>
                <h4 className="font-cinzel font-bold text-base text-white mt-1">Diplomatic Security & Monitored Valet</h4>
                <p className="text-xs text-gray-300 mt-2">
                  Located in a quiet, secured private enclave in Nsugbe, Onitsha. Our gated grounds feature 24/7 dedicated armed security, CCTV monitoring, and complimentary shaded valet parking.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-[#f3e5ab] font-bold">Nsugbe Secured Compound</span>
                <span className="text-emerald-400 font-bold">● Valet Available</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. LUXURY FOOTER */}
      <footer className="px-6 py-12 border-t border-white/10 bg-[#090105] text-gray-400 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          <div className="space-y-3">
            <Logo variant="gold" size="default" />
            <p className="text-xs text-gray-400 leading-relaxed">
              Arab Signature Hotel & Suites is an ultra-luxury hospitality destination in Nsugbe, Onitsha, combining traditional Arabian palatial architecture with 5-star executive amenities.
            </p>
          </div>

          <div>
            <h4 className="font-cinzel font-bold text-sm text-white mb-3 uppercase tracking-wider">Accommodations</h4>
            <ul className="space-y-2">
              {ROOMS.map(r => (
                <li key={r.id}>
                  <button 
                    onClick={() => onOpenBooking(r.id)}
                    className="hover:text-[#d4af37] transition-colors text-left"
                  >
                    {r.name} ({r.priceFormatted})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-cinzel font-bold text-sm text-white mb-3 uppercase tracking-wider">Guest Services</h4>
            <ul className="space-y-2">
              <li>Poolside & VIP Cabanas</li>
              <li>Al-Sultan Gourmet Dining</li>
              <li>Royal Moroccan Spa</li>
              <li>24/7 Executive Butler Service</li>
              <li>24/7 Security & Uninterrupted Power</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-cinzel font-bold text-sm text-white uppercase tracking-wider">Front Desk Reception</h4>
            <p className="text-xs text-white">Nsugbe, Onitsha, Anambra State, Nigeria</p>
            <p className="text-xs text-[#d4af37] font-semibold">Hotline: {HOTEL_INFO.phone}</p>
            <p className="text-[11px] text-gray-500">Check-in: 2:00 PM • Check-out: 12:00 PM</p>
          </div>


        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} Arab Signature Hotel and Suites. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>Verified Paystack Payment</span>
            <span>•</span>
            <span>Diplomatic Choice</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
