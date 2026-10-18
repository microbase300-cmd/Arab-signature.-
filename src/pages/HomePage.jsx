import React, { useState, useEffect } from 'react';
import { HOTEL_INFO } from '../data/hotelData';
import { portalStore } from '../data/portalStore';
import { 
  Calendar, Users, ArrowRight, Star, ShieldCheck, Zap, Crown, 
  Car, Sparkles, Utensils, Waves, Phone, MapPin, Check, 
  ChevronRight, Play, Clock, Share2, Award
} from 'lucide-react';

export default function HomePage({ onNavigate, onOpenBooking }) {
  const [checkIn, setCheckIn] = useState('2026-10-20');
  const [checkOut, setCheckOut] = useState('2026-10-22');
  const [roomType, setRoomType] = useState('deluxe');
  const [rooms, setRooms] = useState(() => portalStore.getRoomRates());

  // Listen for real-time room rate adjustments made by Admin
  useEffect(() => {
    return portalStore.subscribeRates(setRooms);
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
            Where Doha Elegance Meets <br className="hidden sm:inline" />
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
              <span>Explore Doha Suites</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onOpenBooking('royal')}
              className="px-7 py-4 rounded-2xl bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-md font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Crown size={15} className="text-[#d4af37]" />
              <span>Royal Penthouse</span>
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
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border-2 border-[#d4af37]/40 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
                alt="Arab Signature Presidential Suite"
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute top-4 right-4 bg-[#5c0725] text-[#f3e5ab] text-xs font-bold px-4 py-2 rounded-xl shadow-lg border border-[#d4af37]/40">
              Nsugbe, Onitsha
            </div>
          </div>

        </div>
      </section>

      {/* 3. FEATURED SUITES PREVIEW */}
      <section className="py-20 px-6 bg-[#17030c] border-y border-[#5c0725]/40">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] block font-semibold">
                HANDCRAFTED ACCOMMODATIONS
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wide mt-1">
                Signature Doha Suites & Penthouses
              </h2>
            </div>
            <button
              onClick={() => onNavigate('suites')}
              className="px-5 py-2.5 rounded-xl bg-[#5c0725] hover:bg-[#720a2f] text-white text-xs font-bold uppercase tracking-wider border border-[#d4af37]/40 flex items-center gap-2"
            >
              <span>View All 4 Suites</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="rounded-3xl overflow-hidden border border-[#d4af37]/30 bg-[#1f050f]/80 shadow-xl flex flex-col justify-between group hover:-translate-y-1 transition-all"
              >
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
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-cinzel text-lg font-bold truncate group-hover:text-[#d4af37] transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">{room.description}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <div>
                      <span className="text-[10px] uppercase text-gray-400 block">Nightly Rate</span>
                      <div className="text-lg font-extrabold text-[#d4af37]">{room.priceFormatted}</div>
                    </div>
                    <button
                      onClick={() => onOpenBooking(room.id)}
                      className={`px-4 py-2.5 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95`}
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POOLSIDE CABANAS & DINING HIGHLIGHTS */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold">
            RECREATION & GASTRONOMY
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wide">
            Poolside Cabanas & Gourmet Dining
          </h2>
          <p className="text-sm text-gray-400">
            Enjoy exclusive recreational facilities and authentic Middle Eastern cuisine in Nsugbe, Onitsha.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Poolside & Cabanas */}
          <div className="rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#1f050f]/80 shadow-2xl group flex flex-col justify-between">
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80"
                alt="Poolside Cabanas"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-[#5c0725] text-[#f3e5ab] text-xs font-bold px-3 py-1 rounded-xl">
                Poolside Oasis
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-cinzel text-xl font-bold text-white">Private Poolside VIP Cabanas</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Relax beside our crystal-clear pool with private shaded cabanas, luxury sun loungers, and dedicated beverage service. Strictly tranquil and private.
              </p>
              <button
                onClick={() => onNavigate('amenities')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/15"
              >
                <span>Explore Poolside Cabanas</span>
                <ChevronRight size={14} className="text-[#d4af37]" />
              </button>
            </div>
          </div>

          {/* Card 2: Al-Sultan Gourmet Dining */}
          <div className="rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#1f050f]/80 shadow-2xl group flex flex-col justify-between">
            <div className="relative h-64 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                alt="Al Sultan Dining"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-[#5c0725] text-[#f3e5ab] text-xs font-bold px-3 py-1 rounded-xl">
                Al-Sultan Cuisine
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-cinzel text-xl font-bold text-white">Al-Sultan Fine Dining & Lounge</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Authentic Middle Eastern grills, lamb mandi, hummus, and premium shawarma paired with five-star continental and Nigerian specialties.
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

      {/* 5. LOCATION & LUXURY SANCTUARY BANNER */}
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
              Experience the pinnacle of hospitality in Nsugbe, Onitsha. Enjoy 100% uninterrupted triple-generator & solar power, 24/7 diplomatic security, private poolside VIP cabanas, and opulent Doha suites.
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

    </div>
  );
}
