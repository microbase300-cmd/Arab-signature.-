import React, { useState } from 'react';
import Logo from '../Logo';
import { ROOMS } from '../../data/hotelData';
import { Users, Calendar, Moon, ArrowRight, ShieldCheck, Plus, Minus } from 'lucide-react';

export default function Sample9_MidnightVelvet({ onOpenBooking }) {
  const [guests, setGuests] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);

  return (
    <div className="min-h-full bg-gradient-to-b from-[#250110] via-[#1a010b] to-[#0d0006] text-white flex flex-col justify-between selection:bg-[#d4af37] selection:text-black">
      
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-[#5c0725]/50 sticky top-0 bg-[#250110]/90 backdrop-blur-md z-20">
        <Logo variant="gold" size="default" />
        <div className="flex items-center gap-1.5 text-xs text-[#d4af37]">
          <Moon size={16} /> Night Mode
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 space-y-6 flex-1">
        
        {/* Title & Night Ambiance */}
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#d4af37]">
            MIDNIGHT VELVET SUITES
          </span>
          <h1 className="font-cinzel text-xl font-bold text-white">
            Late Night & Immediate Check-In
          </h1>
          <p className="text-xs text-gray-300 max-w-xs mx-auto">
            Arriving late from the airport? Instant room confirmation with verified Paystack payment.
          </p>
        </div>

        {/* Inline Guest Counter Matrix */}
        <div className="p-4 rounded-3xl bg-[#380419]/50 border border-[#d4af37]/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Users size={14} className="text-[#d4af37]" /> Number of Guests
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <Minus size={12} />
              </button>
              <span className="font-mono font-bold text-sm text-[#f3e5ab] w-6 text-center">{guests}</span>
              <button
                onClick={() => setGuests(guests + 1)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Calendar size={14} className="text-[#d4af37]" /> Suites Needed
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <Minus size={12} />
              </button>
              <span className="font-mono font-bold text-sm text-[#f3e5ab] w-6 text-center">{roomsCount}</span>
              <button
                onClick={() => setRoomsCount(roomsCount + 1)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          <button
            onClick={() => onOpenBooking('deluxe')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            Find Night Available Rooms <ArrowRight size={14} />
          </button>
        </div>

        {/* Night Concierge Guarantee */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5c0725] text-[#d4af37] flex items-center justify-center font-bold">
            24h
          </div>
          <div>
            <h4 className="font-semibold text-xs text-white">24/7 Front Desk Reception</h4>
            <p className="text-[10px] text-gray-400">Security gates open 24 hours with VIP valet parking.</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-5 py-3 text-center border-t border-white/10 text-[10px] text-gray-400">
        Arab Signature Hotel • Midnight Velvet Edition
      </footer>

    </div>
  );
}
