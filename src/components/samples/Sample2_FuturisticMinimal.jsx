import React from 'react';
import Logo from '../Logo';
import { ROOMS } from '../../data/hotelData';
import { Sparkles, ArrowUpRight, Compass, Shield, KeyRound } from 'lucide-react';

export default function Sample2_FuturisticMinimal({ onOpenBooking }) {
  return (
    <div className="min-h-full bg-[#09090d] text-white flex flex-col justify-between selection:bg-[#e5a93c] selection:text-black relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#d4af37]/10 blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-white/5 sticky top-0 bg-[#09090d]/80 backdrop-blur-md z-20">
        <Logo variant="gold" size="default" />
        <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-mono tracking-widest bg-white/5 text-[#d4af37] border border-[#d4af37]/30">
          V2.0 MINIMAL
        </span>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 space-y-7 flex-1">
        
        {/* Floating 3D Glowing Glass Cards & Pedestal */}
        <div className="relative py-6 flex flex-col items-center justify-center text-center">
          
          {/* Glowing Pedestal Ring */}
          <div className="relative w-64 h-48 flex items-center justify-center">
            
            {/* 3D Glass Cards Floating */}
            <div className="absolute top-2 left-6 w-32 h-40 rounded-2xl bg-gradient-to-br from-[#d4af37]/25 to-black/60 border border-[#d4af37]/50 backdrop-blur-xl p-3 shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between text-left">
              <span className="text-[9px] font-mono uppercase text-[#f3e5ab]">SUITE 01</span>
              <div>
                <div className="text-xs font-bold text-white">Deluxe Doha</div>
                <div className="text-[10px] text-[#d4af37]">₦45,000</div>
              </div>
            </div>

            <div className="absolute top-0 right-6 w-32 h-40 rounded-2xl bg-gradient-to-br from-[#f3e5ab]/30 to-black/70 border border-[#d4af37]/60 backdrop-blur-xl p-3 shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between text-left z-10">
              <span className="text-[9px] font-mono uppercase text-[#d4af37]">SUITE 02</span>
              <div>
                <div className="text-xs font-bold text-white">Executive Penthouse</div>
                <div className="text-[10px] text-[#d4af37]">₦120,000</div>
              </div>
            </div>

            {/* Glowing Base Platform */}
            <div className="absolute bottom-0 w-44 h-8 rounded-full border border-[#d4af37]/60 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent blur-[1px] shadow-[0_0_20px_rgba(212,175,55,0.4)]" />
          </div>

          {/* Typography */}
          <div className="mt-4 space-y-1">
            <h1 className="font-cinzel text-xl font-bold tracking-widest text-[#f3e5ab] uppercase">
              Futuristic Typography
            </h1>
            <p className="text-[11px] text-gray-400 font-light max-w-xs mx-auto">
              Floating 3D sleek glass elements & architectural luxury.
            </p>
          </div>

        </div>

        {/* Minimal Glass Selector Bar */}
        <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-3">
          <div className="flex justify-between items-center text-xs text-gray-400 pb-2 border-b border-white/5">
            <span className="flex items-center gap-1.5"><KeyRound size={13} className="text-[#d4af37]" /> Smart Access Pass</span>
            <span className="text-[10px] font-mono text-[#d4af37]">VERIFIED CODE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">DATES</span>
              <span className="text-white font-medium text-xs mt-1 block">Oct 20 — 22</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">GUESTS</span>
              <span className="text-white font-medium text-xs mt-1 block">2 Guests</span>
            </div>
          </div>

          <button
            onClick={() => onOpenBooking('executive')}
            className="w-full py-3.5 rounded-2xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#e5bc4b] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.3)]"
          >
            Instant Reservation <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <Shield size={16} className="mx-auto text-[#d4af37] mb-1" />
            <span className="text-[10px] text-gray-300 block">Diplomatic Security</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <Sparkles size={16} className="mx-auto text-[#d4af37] mb-1" />
            <span className="text-[10px] text-gray-300 block">Doha Finish</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <Compass size={16} className="mx-auto text-[#d4af37] mb-1" />
            <span className="text-[10px] text-gray-300 block">GRA Location</span>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-5 py-3 text-center border-t border-white/5 text-[10px] font-mono text-gray-500">
        ARAB SIGNATURE • FUTURISTIC MINIMAL ARCHITECTURE
      </footer>

    </div>
  );
}
