import React, { useState } from 'react';
import Logo from '../Logo';
import { ROOMS } from '../../data/hotelData';
import { Menu, Play, Calendar, Users, Star, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Sample1_CinematicHero({ onOpenBooking }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-full bg-gradient-to-b from-[#420317] via-[#5c0725] to-[#250210] text-white flex flex-col justify-between selection:bg-[#d4af37] selection:text-black">
      
      {/* Top Navigation */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-[#d4af37]/20 bg-[#420317]/80 backdrop-blur-md sticky top-0 z-20">
        <Logo variant="gold" size="default" />
        <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          <Menu size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="px-5 py-5 space-y-6 flex-1">
        
        {/* Cinematic Video / High-Res Showcase Card */}
        <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/40 shadow-2xl bg-black group">
          <img
            src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
            alt="Doha Style Luxury Suite"
            className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Centered Play Button */}
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-xl hover:scale-110 active:scale-95 transition-all"
          >
            <Play size={22} fill="#d4af37" className="ml-1" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-[10px] tracking-widest uppercase bg-[#d4af37] text-black font-extrabold px-2 py-0.5 rounded-full">
                Cinematic Hero
              </span>
              <p className="text-xs text-gray-200 mt-1 font-medium drop-shadow">
                Video / High-res 4K Doha-style suite preview
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#d4af37] bg-black/60 px-2 py-1 rounded-full border border-white/10">
              <Star size={12} fill="#d4af37" /> 4.9 (128)
            </div>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center space-y-2">
          <h1 className="font-cinzel text-2xl font-bold tracking-wide text-[#f3e5ab]">
            Cinematic Luxury & Arabian Elegance
          </h1>
          <p className="text-xs text-gray-300 max-w-xs mx-auto leading-relaxed">
            Doha-inspired 5-star suites tailored for royalty and executive travelers in Nigeria.
          </p>
        </div>

        {/* Quick Booking Bar */}
        <div className="p-4 rounded-3xl bg-[#2e0310]/90 border border-[#d4af37]/35 shadow-xl space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase text-[#d4af37] block font-semibold flex items-center gap-1">
                <Calendar size={11} /> Check-In
              </span>
              <span className="font-medium text-white text-xs mt-0.5 block">20 Oct 2026</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase text-[#d4af37] block font-semibold flex items-center gap-1">
                <Calendar size={11} /> Check-Out
              </span>
              <span className="font-medium text-white text-xs mt-0.5 block">22 Oct 2026</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase text-[#d4af37] font-semibold flex items-center gap-1">
              <Users size={12} /> Guest Counter
            </span>
            <span className="font-semibold text-white">2 Adults • 1 Suite</span>
          </div>

          {/* Golden Action Button */}
          <button
            onClick={() => onOpenBooking('deluxe')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-[#d4af37]/25 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 shimmer-btn"
          >
            Book Now <ArrowRight size={16} />
          </button>
        </div>

        {/* Featured Doha Suites List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <h2 className="font-cinzel font-bold text-sm text-[#f3e5ab]">Doha Signature Suites</h2>
            <span className="text-[#d4af37] hover:underline cursor-pointer">View All (4)</span>
          </div>

          <div className="space-y-2.5">
            {ROOMS.slice(0, 2).map((room) => (
              <div
                key={room.id}
                onClick={() => onOpenBooking(room.id)}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/50 transition-all cursor-pointer flex gap-3 items-center group"
              >
                <img
                  src={room.thumb}
                  alt={room.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xs text-white truncate">{room.name}</h3>
                  <p className="text-[10px] text-gray-300 mt-0.5">{room.bed} • {room.size}</p>
                  <div className="text-xs font-bold text-[#d4af37] mt-1">{room.priceFormatted} <span className="text-[9px] text-gray-400 font-normal">/ night</span></div>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-[#d4af37] transition-colors" />
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer info */}
      <footer className="px-5 py-3 text-center border-t border-white/10 text-[10px] text-gray-400">
        Plot 12, Presidential Blvd, Phase 2, GRA • Verified Paystack Booking
      </footer>

    </div>
  );
}
