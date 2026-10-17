import React from 'react';
import Logo from '../Logo';
import { ROOMS, HOTEL_INFO } from '../../data/hotelData';
import { Bell, ArrowRight, Shield, Sparkles, MapPin, Star } from 'lucide-react';

export default function Sample4_BrightAiry({ onOpenBooking }) {
  return (
    <div className="min-h-full bg-white text-[#1a1819] flex flex-col justify-between selection:bg-[#5c0725] selection:text-white relative">
      
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-20">
        <Logo variant="burgundy" size="default" />
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#5c0725] bg-[#5c0725]/5 px-2.5 py-1 rounded-full">
          Editorial
        </span>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 space-y-8 flex-1">
        
        {/* Expansive Editorial Hero */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-[#5c0725] text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={12} /> Pure Arabian Comfort
          </div>
          <h1 className="font-playfair text-3xl font-normal text-[#1d1517] leading-tight">
            Bright & Airy.<br />
            <span className="italic font-serif text-[#5c0725]">Plan Your Stay.</span>
          </h1>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            Lots of generous white space, curated architectural lighting, and bespoke concierge care.
          </p>
        </div>

        {/* Minimal Hero Imagery Frame */}
        <div 
          onClick={() => onOpenBooking('royal')}
          className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 group cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80"
            alt="Royal Penthouse Suite"
            className="w-full h-52 object-cover group-hover:scale-102 transition-transform duration-500"
          />
          <div className="p-4 flex justify-between items-center bg-white">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Featured Penthouse</span>
              <h3 className="font-playfair font-bold text-sm text-gray-900">Royal Diplomatic Suite</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#5c0725]">₦120,000</span>
              <span className="text-[10px] text-gray-400 block">/ night</span>
            </div>
          </div>
        </div>

        {/* Minimal Highlights Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-[#fafafa] border border-gray-100">
            <Star size={16} className="text-[#d4af37] mb-1.5" />
            <h4 className="font-semibold text-xs text-gray-900">5-Star Standards</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">Complimentary butler service & VIP check-in.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#fafafa] border border-gray-100">
            <Shield size={16} className="text-[#5c0725] mb-1.5" />
            <h4 className="font-semibold text-xs text-gray-900">Uninterrupted Power</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">Dual industrial generators and zero outages.</p>
          </div>
        </div>

      </main>

      {/* Floating Bottom Action Bar */}
      <div className="sticky bottom-4 px-5 z-20">
        <div className="p-2 rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-2xl flex items-center justify-between gap-3">
          <div className="p-3 rounded-2xl bg-gray-100 text-gray-700">
            <Bell size={18} />
          </div>
          <button
            onClick={() => onOpenBooking('deluxe')}
            className="flex-1 py-3 px-6 rounded-2xl bg-[#5c0725] hover:bg-[#430419] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
          >
            Plan Your Stay <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-5 py-3 text-center border-t border-gray-100 text-[10px] text-gray-400">
        Arab Signature Hotel & Suites • Editorial Simplicity
      </footer>

    </div>
  );
}
