import React, { useState } from 'react';
import Logo from '../Logo';
import { ROOMS } from '../../data/hotelData';
import { Menu, ShoppingBag, Calendar, MapPin, ChevronDown, Check } from 'lucide-react';

export default function Sample7_GoldenMirage({ onOpenBooking }) {
  const [selectedCity, setSelectedCity] = useState('Doha Signature Suites');

  return (
    <div className="min-h-full bg-[#f6f2e9] text-[#2c2621] flex flex-col justify-between selection:bg-[#d4af37] selection:text-black">
      
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-[#e5decb] bg-[#f6f2e9]/95 backdrop-blur-md sticky top-0 z-20">
        <button className="p-2 rounded-full bg-[#ece4d0] text-[#420317] hover:bg-[#e2d8c0]">
          <Menu size={18} />
        </button>
        <Logo variant="burgundy" size="default" />
        <button className="p-2 rounded-full bg-[#ece4d0] text-[#420317] hover:bg-[#e2d8c0]">
          <ShoppingBag size={18} />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-5 py-5 space-y-6 flex-1">
        
        {/* Prominent Golden Metallic Curved Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#e8c872] via-[#d4af37] to-[#b8860b] text-black shadow-xl space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#420317] block">
              INSTANT RESERVATION
            </span>
            <h2 className="font-playfair text-xl font-bold mt-0.5">Quick Check-in / Out</h2>
          </div>

          <div className="space-y-2">
            {/* City / Room Category Dropdown */}
            <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm border border-black/10 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#5c0725]" />
                <span className="font-semibold text-xs text-gray-900">{selectedCity}</span>
              </div>
              <ChevronDown size={14} className="text-gray-600" />
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-white/90 border border-black/10">
                <span className="text-[9px] uppercase font-bold text-gray-500 block">Arrival</span>
                <span className="font-bold text-gray-900 mt-0.5 block">20 Oct 2026</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/90 border border-black/10">
                <span className="text-[9px] uppercase font-bold text-gray-500 block">Departure</span>
                <span className="font-bold text-gray-900 mt-0.5 block">22 Oct 2026</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenBooking('deluxe')}
            className="w-full py-3.5 rounded-2xl bg-[#420317] hover:bg-[#5c0725] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            Check Available Rooms
          </button>
        </div>

        {/* Featured Suite Cards */}
        <div className="space-y-3">
          <h3 className="font-playfair font-bold text-sm text-[#420317]">Handpicked Luxury Rooms</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {ROOMS.slice(0, 2).map((room) => (
              <div
                key={room.id}
                onClick={() => onOpenBooking(room.id)}
                className="rounded-2xl overflow-hidden bg-white border border-[#e5decb] shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <img
                  src={room.thumb}
                  alt={room.name}
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-2.5">
                  <h4 className="font-bold text-xs text-gray-900 truncate">{room.name}</h4>
                  <div className="text-xs font-bold text-[#5c0725] mt-1">{room.priceFormatted}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-5 py-3 text-center border-t border-[#e5decb] text-[10px] text-[#786b5e]">
        Arab Signature Hotel • Golden Mirage Theme
      </footer>

    </div>
  );
}
