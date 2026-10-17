import React, { useState } from 'react';
import { ROOMS } from '../data/hotelData';
import { Star, Check, ArrowRight, Crown, Sparkles, ShieldCheck, Clock, Users, Bed } from 'lucide-react';

export default function SuitesPage({ onNavigate, onOpenBooking }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  const filteredRooms = selectedCategory === 'all'
    ? ROOMS
    : ROOMS.filter(r => r.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="bg-[#120208] text-gray-100 min-h-screen">
      
      {/* 1. SUITES HERO BANNER */}
      <section className="relative py-24 px-6 text-center border-b border-[#d4af37]/30 bg-gradient-to-b from-[#250210] to-[#120208] overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#5c0725]/50 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-mono tracking-widest">
            <Crown size={14} className="text-[#d4af37]" />
            <span>LUXURY ACCOMMODATIONS IN NSUGBE, ONITSHA</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-white tracking-wide">
            Doha Suites & <br />
            <span className="gold-text-gradient">Presidential Penthouses</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Every suite is elegantly appointed with handcrafted Arabian gilded accents, plush king bedding, marble rain showers, and complimentary morning gourmet breakfast.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {['all', 'signature', 'executive', 'penthouse', 'classic'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat === 'all' ? 'All Residences' : `${cat} Suites`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SUITES CATALOG GRID */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#1c040e]/90 shadow-2xl flex flex-col md:flex-row group hover:border-[#d4af37] transition-all"
            >
              {/* Photo */}
              <div className="md:w-5/12 relative h-64 md:h-auto bg-black overflow-hidden flex-shrink-0">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-3 left-3 bg-[#5c0725] text-[#f3e5ab] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  {room.category}
                </div>
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-[#d4af37] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                  <Star size={12} fill="#d4af37" /> {room.rating} ({room.reviews})
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-cinzel text-xl font-bold text-white group-hover:text-[#f3e5ab] transition-colors">
                      {room.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {room.description}
                  </p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 text-[11px] py-2 border-y border-white/10 text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <Bed size={14} className="text-[#d4af37]" />
                    <span className="truncate">{room.bed}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-[#d4af37]" />
                    <span>{room.guests}</span>
                  </div>
                  <div className="font-mono text-[#f3e5ab] text-right font-semibold">
                    {room.size}
                  </div>
                </div>

                {/* Amenity Pills */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {room.amenities.map((item, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1"
                    >
                      <Check size={11} className="text-[#d4af37]" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>

                {/* Pricing & Booking */}
                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <div>
                    <span className="text-[10px] uppercase text-gray-400 block font-medium">Nightly Rate</span>
                    <div className="text-xl font-extrabold text-[#d4af37]">
                      {room.priceFormatted}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenBooking(room.id)}
                    className={`px-5 py-3 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 flex items-center gap-1.5 transition-all active:scale-98`}
                  >
                    <span>Reserve Suite</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INCLUDED VIP PERKS BANNER */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#20030e] to-[#120208] border border-[#d4af37]/35 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-1.5">
            <h4 className="font-cinzel text-base font-bold text-[#f3e5ab]">Complimentary Breakfast</h4>
            <p className="text-xs text-gray-300">Daily morning gourmet continental and traditional breakfast buffet included with all suites.</p>
          </div>
          <div className="space-y-1.5 border-y md:border-y-0 md:border-x border-white/10 py-4 md:py-0 md:px-4">
            <h4 className="font-cinzel text-base font-bold text-[#f3e5ab]">High-Speed Optical Wi-Fi</h4>
            <p className="text-xs text-gray-300">Dedicated high-speed fiber internet for uninterrupted remote work and business streaming.</p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-cinzel text-base font-bold text-[#f3e5ab]">24/7 Floor Butler Care</h4>
            <p className="text-xs text-gray-300">Immediate room service, garment pressing, luggage assistance, and front desk coordination.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
