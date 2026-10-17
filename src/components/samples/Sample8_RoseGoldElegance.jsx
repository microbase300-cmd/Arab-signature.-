import React from 'react';
import Logo from '../Logo';
import { ROOMS } from '../../data/hotelData';
import { Heart, Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export default function Sample8_RoseGoldElegance({ onOpenBooking }) {
  return (
    <div className="min-h-full bg-gradient-to-b from-[#e3b8a8] via-[#cf9c89] to-[#b87d69] text-[#2c1c18] flex flex-col justify-between selection:bg-[#5c0725] selection:text-white">
      
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-black/10 bg-white/30 backdrop-blur-md sticky top-0 z-20">
        <Logo variant="burgundy" size="default" />
        <button className="p-2 rounded-full bg-white/40 text-[#420317] hover:bg-white/60">
          <Heart size={18} />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 space-y-6 flex-1">
        
        {/* Romantic Warm Luxury Card */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/40 backdrop-blur-md group">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
            alt="Rose Gold Luxury Suite"
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="p-5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-[#5c0725] font-bold uppercase tracking-wider">
              <Sparkles size={14} /> Rose Gold Suite Collection
            </div>
            <h2 className="font-playfair text-xl font-bold text-[#1f110d]">
              Executive Arabian Penthouse
            </h2>
            <p className="text-xs text-[#4a342e] leading-relaxed">
              Warm copper ambient lighting, private jacuzzi, and romantic VIP cabana reservation.
            </p>
            <div className="pt-2 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#634840] uppercase">Special Rate</span>
                <div className="text-base font-bold text-[#420317]">₦65,000 <span className="text-xs font-normal">/ night</span></div>
              </div>
              <button
                onClick={() => onOpenBooking('executive')}
                className="px-5 py-2.5 rounded-xl bg-[#420317] hover:bg-[#5c0725] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                Reserve Now
              </button>
            </div>
          </div>
        </div>

        {/* Guest Comfort Features */}
        <div className="p-4 rounded-3xl bg-white/40 border border-white/50 backdrop-blur-md space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#3d2721]">
            <span>Romantic VIP Package Included</span>
            <Star size={14} className="text-[#d4af37] fill-[#d4af37]" />
          </div>
          <p className="text-[11px] text-[#543b34]">
            Includes complimentary chilled champagne/wine, fresh fruit basket, and guaranteed late check-out at 3:00 PM.
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-5 py-3 text-center border-t border-black/10 text-[10px] text-[#543b34]">
        Arab Signature Hotel • Rose Gold Elegance Theme
      </footer>

    </div>
  );
}
