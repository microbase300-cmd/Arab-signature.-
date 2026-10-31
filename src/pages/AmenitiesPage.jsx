import React from 'react';
import { Waves, Sparkles, Crown, Car, ShieldCheck, Zap, ArrowRight, Check, Compass } from 'lucide-react';
import Pool360Viewer from '../components/Pool360Viewer';

export default function AmenitiesPage({ onNavigate, onOpenBooking }) {
  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  return (
    <div className="bg-[#120208] text-gray-100 min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative py-24 px-6 text-center border-b border-[#d4af37]/30 bg-gradient-to-b from-[#250210] to-[#120208] overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#5c0725]/50 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-mono tracking-widest">
            <Waves size={14} className="text-[#d4af37]" />
            <span>EXCLUSIVITY & RECREATION</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-white tracking-wide">
            Poolside Cabanas & <br />
            <span className="gold-text-gradient">World-Class Amenities</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Every amenity at Arab Signature Hotel is created to ensure total privacy, absolute security, and rejuvenating relaxation in Nsugbe, Onitsha.
          </p>
        </div>
      </section>

      {/* 2. POOLSIDE OASIS & VIP CABANAS (HERO FEATURE WITH 360° VIRTUAL PANORAMA) */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5c0725] text-[#f3e5ab] text-xs font-bold uppercase tracking-wider">
            <Waves size={14} /> <span>360° Virtual Tour &bull; Poolside Cabanas</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white">
            Private Poolside &amp; <span className="gold-text-gradient">VIP Cabana Panorama</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Rotate through 5 high-resolution panoramic angles of our crystal-clear swimming pool, VIP cabana daybeds, and tropical palm courtyard.
          </p>
        </div>

        {/* Interactive 360 Poolside Viewer */}
        <Pool360Viewer onOpenBooking={onOpenBooking} />

        <div className="rounded-3xl overflow-hidden border-2 border-[#d4af37]/40 bg-[#1c040e]/90 p-8 sm:p-10 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-300">
          <div className="flex items-start gap-3">
            <Check size={18} className="text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm font-cinzel mb-0.5">VIP Curtained Cabanas</strong>
              <span>Curtained private poolside cabanas with plush daybeds, towels, and daytime sun shade.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={18} className="text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm font-cinzel mb-0.5">Poolside Grills &amp; Bar</strong>
              <span>Signature cocktails, vintage wines, and hot suya/fish pepper soup served straight to your sun lounger.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={18} className="text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm font-cinzel mb-0.5">Strict Privacy &amp; Security</strong>
              <span>Exclusive access reserved for checked-in suite guests and registered VIP cabana patrons.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ADDITIONAL 5-STAR AMENITIES */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold">
            SPA, MEETINGS & SECURITY
          </span>
          <h2 className="font-cinzel text-3xl font-extrabold tracking-wide">
            Comprehensive Executive Facilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Spa */}
          <div className="rounded-3xl overflow-hidden border border-[#d4af37]/30 bg-[#1c040e]/80 shadow-xl flex flex-col justify-between group">
            <div className="h-52 overflow-hidden bg-black relative">
              <img
                src="/rooms/suite-royal-penthouse.jpg"
                alt="Royal Moroccan Spa & Sanctuary"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-[#5c0725] text-[#f3e5ab] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Wellness
              </div>
              <div className="absolute top-3 right-3 bg-black/75 border border-[#d4af37]/40 text-[#f3e5ab] text-[9px] font-mono px-2 py-0.5 rounded-full">
                VIVID HDR
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-cinzel text-lg font-bold text-white">The Royal Moroccan Spa</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Indulge in authentic Moroccan steam treatments, revitalizing deep-tissue Swedish and therapeutic massage, and organic Arabian aromatherapy.
              </p>
            </div>
          </div>

          {/* Boardroom */}
          <div className="rounded-3xl overflow-hidden border border-[#d4af37]/30 bg-[#1c040e]/80 shadow-xl flex flex-col justify-between group">
            <div className="h-52 overflow-hidden bg-black relative">
              <img
                src="/rooms/al-sultan-dining-hall.jpg"
                alt="Executive Boardroom & Banquet Hall"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-[#5c0725] text-[#f3e5ab] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Business
              </div>
              <div className="absolute top-3 right-3 bg-black/75 border border-[#d4af37]/40 text-[#f3e5ab] text-[9px] font-mono px-2 py-0.5 rounded-full">
                VIVID HDR
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-cinzel text-lg font-bold text-white">Diplomatic Majlis & Boardroom</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Soundproof executive boardroom and banquet hall equipped with wireless presentation displays, high-speed fiber internet, and executive catering.
              </p>
            </div>
          </div>

          {/* Airport Chauffeur */}
          <div className="rounded-3xl overflow-hidden border border-[#d4af37]/30 bg-[#1c040e]/80 shadow-xl flex flex-col justify-between group">
            <div className="h-52 overflow-hidden bg-black relative">
              <img
                src="/rooms/arch-gate-exterior.jpg"
                alt="Luxury Transit & Fortified Gate"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-[#5c0725] text-[#f3e5ab] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Transit
              </div>
              <div className="absolute top-3 right-3 bg-black/75 border border-[#d4af37]/40 text-[#f3e5ab] text-[9px] font-mono px-2 py-0.5 rounded-full">
                VIVID HDR
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-cinzel text-lg font-bold text-white">Airport Chauffeur Coordination</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Direct chauffeur pickups to and from Asaba International Airport and Chinua Achebe Airport (Umueri) in private executive luxury SUVs.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SECURITY & UNINTERRUPTED POWER COMMITMENT */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#20030e] to-[#140209] border border-[#d4af37]/40 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-[#d4af37] tracking-widest uppercase">
              24/7 GUEST PEACE OF MIND
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              Zero Outages & Armed Presidential Security
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              We understand the critical importance of safety and uninterrupted operations. Our premises are fully fortified with armed security personnel, CCTV surveillance, and dual soundproof industrial Caterpillar generators.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <ShieldCheck size={28} className="text-[#d4af37] mx-auto mb-2" />
              <div className="font-bold text-sm text-white">24/7 Surveillance</div>
              <p className="text-[10px] text-gray-400 mt-1">Armed patrols & electronic gate</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Zap size={28} className="text-[#d4af37] mx-auto mb-2" />
              <div className="font-bold text-sm text-white">100% Electricity</div>
              <p className="text-[10px] text-gray-400 mt-1">Dual generators + solar bank</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
