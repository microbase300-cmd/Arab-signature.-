import React, { useState, useEffect } from 'react';
import { portalStore } from '../data/portalStore';
import { HOTEL_BUILDINGS } from '../data/hotelData';
import { Star, Check, ArrowRight, Crown, Sparkles, ShieldCheck, Clock, Users, Bed, Building2 } from 'lucide-react';

export default function SuitesPage({ onNavigate, onOpenBooking }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [rooms, setRooms] = useState(() => portalStore.getRoomRates());
  const [activePhotoMap, setActivePhotoMap] = useState({});

  useEffect(() => {
    return portalStore.subscribeRates(setRooms);
  }, []);

  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  const filteredRooms = rooms.filter(room => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'main') return room.buildings && room.buildings.includes('Main Building');
    if (selectedFilter === 'extension') return room.buildings && room.buildings.includes('Extension Building');
    return room.id === selectedFilter || room.category.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <div className="bg-[#120208] text-gray-100 min-h-screen">
      
      {/* 1. SUITES HERO BANNER */}
      <section className="relative py-20 px-6 text-center border-b border-[#d4af37]/30 bg-gradient-to-b from-[#250210] to-[#120208] overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#5c0725]/50 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-mono tracking-widest">
            <Crown size={14} className="text-[#d4af37]" />
            <span>34 LUXURY ROOMS & SUITES • 2 BUILDINGS IN NSUGBE, ONITSHA</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white tracking-wide">
            Official Room Rates & <br />
            <span className="gold-text-gradient">Building Accommodations</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Welcome to Arab Signature Hotel & Suites. Our 34 private rooms and diplomatic suites are grouped across <strong className="text-white">two wings of the same luxury property</strong>: the <strong className="text-[#f3e5ab]">Main Building (20 Rooms)</strong> and the <strong className="text-[#f3e5ab]">Extension Building (14 Rooms)</strong>, each offering unmatched comfort, 24/7 power, and royal Arabian service.
          </p>

          {/* Dual Building Rate Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto pt-3 text-left">
            {/* Main Building Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c040e] to-[#120208] border border-[#d4af37]/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-[#d4af37]" />
                  <div>
                    <h3 className="font-cinzel font-bold text-sm text-white uppercase tracking-wide">Main Building</h3>
                    <span className="text-[10px] text-gray-400 font-mono">600 Wing • 20 Rooms Total</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] text-[11px] font-mono font-bold">
                  ₦30,000 – ₦60,000
                </span>
              </div>
              <div className="text-[11px] space-y-1 pt-1 border-t border-white/10 text-gray-300">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-white font-medium">Super Executive:</span>
                  <span className="text-[#d4af37] font-mono font-bold">₦60,000 <span className="text-gray-400 font-normal">(Rooms 605, 612, 615)</span></span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-white font-medium">Executive:</span>
                  <span className="text-[#d4af37] font-mono font-bold">₦50,000 <span className="text-gray-400 font-normal">(Rooms 601, 609, 619)</span></span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-white font-medium">Superior:</span>
                  <span className="text-[#d4af37] font-mono font-bold">₦40,000 <span className="text-gray-400 font-normal">(Rooms 603, 607, 611, 613, 617)</span></span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-white font-medium">Deluxe:</span>
                  <span className="text-[#d4af37] font-mono font-bold">₦35,000 <span className="text-gray-400 font-normal">(Rooms 602, 604, 606, 608, 610, 620)</span></span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-white font-medium">Standard:</span>
                  <span className="text-[#d4af37] font-mono font-bold">₦30,000 <span className="text-gray-400 font-normal">(Rooms 614, 616, 618)</span></span>
                </div>
              </div>
            </div>

            {/* Extension Building Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c040e] to-[#120208] border border-[#d4af37]/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-[#d4af37]" />
                  <div>
                    <h3 className="font-cinzel font-bold text-sm text-white uppercase tracking-wide">Extension Building</h3>
                    <span className="text-[10px] text-gray-400 font-mono">100 Wing • 14 Rooms Total</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] text-[11px] font-mono font-bold">
                  ₦40,000 – ₦120,000
                </span>
              </div>
              <div className="text-[11px] space-y-1 pt-1 border-t border-white/10 text-gray-300">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-white font-medium">Diplomatic Suites:</span>
                  <span className="text-[#d4af37] font-mono font-bold">₦120,000 <span className="text-gray-400 font-normal">(Rooms 107, 114)</span></span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-white font-medium">Super-Executive:</span>
                  <span className="text-[#d4af37] font-mono font-bold">₦60,000 <span className="text-gray-400 font-normal">(Rooms 102, 109)</span></span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-white font-medium">Executive:</span>
                  <span className="text-[#d4af37] font-mono font-bold">₦50,000 <span className="text-gray-400 font-normal">(Rooms 103, 104, 110, 111)</span></span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-white font-medium">Superior:</span>
                  <span className="text-[#d4af37] font-mono font-bold">₦40,000 <span className="text-gray-400 font-normal">(Rooms 101, 105, 106, 108, 112, 113)</span></span>
                </div>
                <div className="text-[10px] text-gray-400 italic pt-1 border-t border-white/5">
                  * All rooms enjoy 24/7 power, Wi-Fi & complimentary gourmet breakfast.
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All 34 Rooms & Suites' },
              { id: 'main', label: 'Main Building (20)' },
              { id: 'extension', label: 'Extension Building (14)' },
              { id: 'suites', label: 'Suites (₦120k)' },
              { id: 'super-executive', label: 'Super Exec (₦60k)' },
              { id: 'executive', label: 'Executive (₦50k)' },
              { id: 'superior', label: 'Superior (₦40k)' },
              { id: 'deluxe', label: 'Deluxe (₦35k)' },
              { id: 'standard', label: 'Standard (₦30k)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedFilter === tab.id
                    ? 'bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20 scale-102'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SUITES CATALOG GRID */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredRooms.map((room) => {
            const roomGallery = room.gallery && room.gallery.length > 0 ? room.gallery : [room.image];
            const currentPhoto = activePhotoMap[room.id] || room.image;
            return (
              <div
                key={room.id}
                className="rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#1c040e]/90 shadow-2xl flex flex-col md:flex-row group hover:border-[#d4af37] transition-all"
              >
                {/* Photo */}
                <div className="md:w-5/12 relative h-72 md:h-auto bg-black overflow-hidden flex-shrink-0">
                  <img
                    src={currentPhoto}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#5c0725] text-[#f3e5ab] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {room.boardTitle || room.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-[#d4af37] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                    <Star size={12} fill="#d4af37" /> {room.rating} ({room.reviews})
                  </div>

                  {/* Multi-Angle Vivid HDR Thumbnail Switcher */}
                  {roomGallery.length > 1 && (
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 bg-black/75 backdrop-blur-md p-1.5 rounded-xl border border-white/15">
                      {roomGallery.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setActivePhotoMap((prev) => ({ ...prev, [room.id]: imgUrl }))
                          }
                          className={`w-12 h-8 rounded-lg overflow-hidden border transition-all ${
                            currentPhoto === imgUrl
                              ? 'border-[#d4af37] scale-105 ring-1 ring-[#d4af37]'
                              : 'border-white/20 opacity-70 hover:opacity-100'
                          }`}
                          title={`View Suite Angle ${idx + 1}`}
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
                          {room.buildingLabel}
                        </span>
                      </div>
                      <h3 className="font-cinzel text-xl font-bold text-white group-hover:text-[#f3e5ab] transition-colors">
                        {room.name}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      {room.description}
                    </p>

                    {/* Room Numbers Tag */}
                    {room.roomNumbers && (
                      <div className="text-[11px] text-gray-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 font-mono">
                        <span className="text-[#f3e5ab]">Room Numbers:</span> {room.roomNumbers.join(', ')} ({room.totalRooms} rooms total)
                      </div>
                    )}
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
                      <span>Reserve Room</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INCLUDED VIP PERKS BANNER */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#20030e] to-[#120208] border border-[#d4af37]/35 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-1.5">
            <h4 className="font-cinzel text-base font-bold text-[#f3e5ab]">Complimentary Breakfast</h4>
            <p className="text-xs text-gray-300">Daily morning gourmet continental and traditional breakfast included with all rooms.</p>
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
