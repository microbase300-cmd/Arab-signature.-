import React, { useState } from 'react';
import Logo from '../Logo';
import { ROOMS } from '../../data/hotelData';
import { MessageSquare, Zap, Radio, ChevronRight, Sparkles, Key } from 'lucide-react';

export default function Sample5_ModernHighTech({ onOpenBooking }) {
  const [showAiPill, setShowAiPill] = useState(true);

  return (
    <div className="min-h-full bg-[#17020b] text-white flex flex-col justify-between selection:bg-[#d4af37] selection:text-black relative overflow-hidden">
      
      {/* Mashrabiya Geometric Grid Background */}
      <div className="absolute inset-0 mashrabiya-grid opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-[#5c0725] bg-[#17020b]/90 backdrop-blur-md sticky top-0 z-20">
        <Logo variant="gold" size="default" />
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#d4af37] bg-[#5c0725]/40 px-2.5 py-1 rounded-full border border-[#d4af37]/30">
          <Radio size={12} className="animate-pulse text-emerald-400" /> LIVE
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 space-y-6 flex-1 relative z-10">
        
        {/* Geometric Diamond Focal Element */}
        <div className="relative py-4 flex flex-col items-center justify-center text-center">
          
          {/* Glowing Geometric Monogram Portal */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Outer Diamond */}
            <div className="absolute inset-0 m-auto w-36 h-36 border border-[#d4af37]/40 rotate-45 rounded-3xl bg-gradient-to-br from-[#5c0725]/60 to-black/80 backdrop-blur-md shadow-[0_0_35px_rgba(212,175,55,0.2)]" />
            
            {/* Inner Diamond */}
            <div className="absolute inset-0 m-auto w-24 h-24 border border-[#d4af37]/70 rotate-45 rounded-2xl flex items-center justify-center">
              <div className="-rotate-45 text-center">
                <Sparkles size={24} className="text-[#f3e5ab] mx-auto animate-bounce" />
                <span className="text-[9px] font-mono tracking-widest text-[#d4af37] block mt-1">DOHA</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <h1 className="font-cinzel text-xl font-bold tracking-wider text-white">
              Modern-Burgundy Interactions
            </h1>
            <p className="text-[11px] text-gray-300 max-w-xs mx-auto">
              Smart room booking with automated Paystack verification & instant QR folio.
            </p>
          </div>

        </div>

        {/* Floating AI Assistant Chat Badge */}
        {showAiPill && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#380415] to-[#1c020b] border border-[#d4af37]/40 shadow-lg flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Quick-booking Assistant</div>
                <div className="text-[10px] text-gray-300">Need help finding available rooms tonight?</div>
              </div>
            </div>
            <button 
              onClick={() => onOpenBooking('deluxe')}
              className="px-3 py-1.5 rounded-xl bg-[#5c0725] text-white text-[10px] font-bold border border-[#d4af37]/40 hover:bg-[#720a2f]"
            >
              Ask
            </button>
          </div>
        )}

        {/* High-Tech Room Selector Cards */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
            SELECT RESIDENCE
          </span>
          {ROOMS.slice(0, 2).map((room) => (
            <div
              key={room.id}
              onClick={() => onOpenBooking(room.id)}
              className="p-3.5 rounded-2xl bg-[#280413]/70 border border-[#d4af37]/30 hover:border-[#d4af37] transition-all cursor-pointer flex justify-between items-center group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-[#d4af37]">
                  <Key size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#f3e5ab] transition-colors">{room.name}</h4>
                  <span className="text-[10px] text-gray-400">{room.guests} • {room.bed}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#d4af37]">{room.priceFormatted}</span>
                <span className="text-[9px] text-gray-400 block">/night</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Interactive Glow Pedestal */}
        <div className="pt-2">
          <button
            onClick={() => onOpenBooking('deluxe')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-widest hover:opacity-95 shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <Zap size={14} /> Enter Room Booking Portal
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-5 py-3 text-center border-t border-[#5c0725] text-[10px] font-mono text-gray-400">
        SECURE PROTOCOL • ENCRYPTED PAYSTACK SETTLEMENT
      </footer>

    </div>
  );
}
