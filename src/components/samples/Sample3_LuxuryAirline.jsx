import React, { useState } from 'react';
import Logo from '../Logo';
import { ROOMS } from '../../data/hotelData';
import { Plane, Bed, Calendar, Users, ShoppingBag, ChevronRight, Star } from 'lucide-react';

export default function Sample3_LuxuryAirline({ onOpenBooking }) {
  const [activeTab, setActiveTab] = useState('stay'); // 'stay' or 'transit'
  const [activeSuiteIdx, setActiveSuiteIdx] = useState(0);

  return (
    <div className="min-h-full bg-[#faf7f2] text-[#2b2725] flex flex-col justify-between selection:bg-[#5c0725] selection:text-white">
      
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-[#e8e2d8] bg-[#faf7f2]/95 backdrop-blur-md sticky top-0 z-20">
        <Logo variant="burgundy" size="default" />
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full bg-[#f0eae1] text-[#5c0725] hover:bg-[#e6ddcf] transition-colors relative">
            <ShoppingBag size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 py-5 space-y-6 flex-1">
        
        {/* Curated Suite Carousel Card */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#5c0725] uppercase tracking-wider text-[11px]">
              Suites & Residences
            </span>
            <div className="flex gap-1.5">
              {ROOMS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSuiteIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeSuiteIdx === idx ? 'w-5 bg-[#5c0725]' : 'bg-[#d8cfc4]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div 
            onClick={() => onOpenBooking(ROOMS[activeSuiteIdx].id)}
            className="relative rounded-3xl overflow-hidden shadow-lg border border-[#e8e2d8] bg-white group cursor-pointer"
          >
            <img
              src={ROOMS[activeSuiteIdx].image}
              alt={ROOMS[activeSuiteIdx].name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 bg-[#5c0725] text-[#f3e5ab] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              First Class Suite
            </div>
            <div className="p-4 bg-white flex justify-between items-center">
              <div>
                <h3 className="font-playfair font-bold text-base text-[#241a1c]">
                  {ROOMS[activeSuiteIdx].name}
                </h3>
                <p className="text-xs text-[#7d7168] mt-0.5">
                  {ROOMS[activeSuiteIdx].bed} • Complimentary Breakfast
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#7d7168] block">From</span>
                <span className="text-sm font-bold text-[#5c0725]">
                  {ROOMS[activeSuiteIdx].priceFormatted}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="rounded-3xl p-4 bg-[#f2ecdf] border border-[#e4dccf] space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80"
              alt="Arabian Hospitality"
              className="w-20 h-20 rounded-2xl object-cover shadow-sm"
            />
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c0725]">
                EXPERIENCE ARAB LUXURY
              </span>
              <h4 className="font-playfair font-bold text-sm text-[#2b2527]">
                Five-Star Airline Inspired Comfort
              </h4>
              <p className="text-[11px] text-[#6b625b] mt-1 leading-snug">
                Private airport chauffeur transit, 24/7 concierge, and Doha-style luxury.
              </p>
            </div>
          </div>
        </div>

        {/* Flight & Stay Booking Bar */}
        <div className="p-4 rounded-3xl bg-white border border-[#e5decb] shadow-md space-y-3">
          {/* Tabs */}
          <div className="flex rounded-2xl bg-[#f4eee4] p-1 text-xs">
            <button
              onClick={() => setActiveTab('stay')}
              className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'stay'
                  ? 'bg-white text-[#5c0725] shadow-sm'
                  : 'text-[#7d7168] hover:text-[#5c0725]'
              }`}
            >
              <Bed size={14} /> Stay Only
            </button>
            <button
              onClick={() => setActiveTab('transit')}
              className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'transit'
                  ? 'bg-white text-[#5c0725] shadow-sm'
                  : 'text-[#7d7168] hover:text-[#5c0725]'
              }`}
            >
              <Plane size={14} /> Airport Transit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#faf7f2] border border-[#ebe4d8]">
              <span className="text-[10px] font-semibold text-[#7d7168] uppercase block">Check-in</span>
              <span className="font-bold text-[#2b2527] mt-0.5 block">20 Oct 2026</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#faf7f2] border border-[#ebe4d8]">
              <span className="text-[10px] font-semibold text-[#7d7168] uppercase block">Check-out</span>
              <span className="font-bold text-[#2b2527] mt-0.5 block">22 Oct 2026</span>
            </div>
          </div>

          <button
            onClick={() => onOpenBooking(ROOMS[activeSuiteIdx].id)}
            className="w-full py-3.5 rounded-2xl bg-[#5c0725] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#48051d] shadow-md transition-all flex items-center justify-center gap-2"
          >
            Check Availability & Book <ChevronRight size={16} />
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-5 py-3 text-center border-t border-[#e8e2d8] text-[10px] text-[#7d7168]">
        Arab Signature Hotel & Suites • Five-Star Airline Experience
      </footer>

    </div>
  );
}
