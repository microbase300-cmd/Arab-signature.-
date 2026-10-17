import React from 'react';
import Logo from '../Logo';
import { ROOMS } from '../../data/hotelData';
import { ShoppingBag, Sparkles, ArrowRight, ShieldCheck, Moon } from 'lucide-react';

export default function Sample6_CircularHalo({ onOpenBooking }) {
  return (
    <div className="min-h-full bg-gradient-to-b from-[#48041d] to-[#1f010c] text-white flex flex-col justify-between selection:bg-[#d4af37] selection:text-black relative overflow-hidden">
      
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-white/10 sticky top-0 bg-[#48041d]/80 backdrop-blur-md z-20">
        <Logo variant="gold" size="default" />
        <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          <ShoppingBag size={18} />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 space-y-6 flex-1 flex flex-col justify-center items-center text-center relative">
        
        {/* Large Glowing Circular Halo Ring */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer glowing halo ring */}
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#d4af37]/50 animate-[spin_40s_linear_infinite]" />
          
          {/* Inner solid gold glowing arc */}
          <div className="absolute inset-2 rounded-full border-2 border-[#f3e5ab] shadow-[0_0_40px_rgba(212,175,55,0.4)]" />
          
          {/* Circular Suite Preview Portal */}
          <div className="w-52 h-52 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl relative group">
            <img
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
              alt="Arab Signature Suite"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-center">
              <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold">Royal Selection</span>
              <div className="text-xs font-bold text-white">Deluxe Doha Suite</div>
              <div className="text-[11px] font-bold text-[#f3e5ab]">₦45,000 / night</div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-2 bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-lg">
            Best Value
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5 pt-2">
          <h1 className="font-cinzel text-xl font-bold text-[#f3e5ab]">
            The Golden Orbit of Arab Luxury
          </h1>
          <p className="text-xs text-gray-300 max-w-xs mx-auto">
            Experience uncompromised comfort with instant WhatsApp booking codes and VIP reception.
          </p>
        </div>

        {/* Quick Drawer Action Bar */}
        <div className="w-full p-4 rounded-3xl bg-black/40 border border-[#d4af37]/30 backdrop-blur-xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-300">Selected: <strong className="text-white">Deluxe King Suite</strong></span>
            <span className="text-[#d4af37] font-bold">₦45,000 / Night</span>
          </div>

          <button
            onClick={() => onOpenBooking('deluxe')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            Confirm & Reserve <ArrowRight size={15} />
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-5 py-3 text-center border-t border-white/10 text-[10px] text-gray-400">
        Arab Signature Hotel • Circular Halo Concept
      </footer>

    </div>
  );
}
