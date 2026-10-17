import React from 'react';
import { Waves, Sparkles, Crown, Car, ShieldCheck, Zap, ArrowRight, Check } from 'lucide-react';

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

      {/* 2. POOLSIDE OASIS & VIP CABANAS (HERO FEATURE) */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden border-2 border-[#d4af37]/40 bg-[#1c040e]/90 shadow-2xl grid grid-cols-1 lg:grid-cols-2 items-center">
          
          <div className="p-8 sm:p-12 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5c0725] text-[#f3e5ab] text-xs font-bold uppercase tracking-wider">
              <Waves size={14} /> Signature Amenity
            </div>

            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white">
              Private Poolside & <br />
              <span className="gold-text-gradient">Curtained VIP Cabanas</span>
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed">
              Step into our private poolside oasis surrounded by lush tropical landscaping and Arabian architectural masonry. Enjoy curtained private VIP cabanas, plush sun loungers, towel service, and dedicated poolside cocktail attendants.
            </p>

            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <Check size={15} className="text-[#d4af37]" />
                <span>Curtained VIP poolside cabanas with plush daybeds and day shade</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={15} className="text-[#d4af37]" />
                <span>Poolside beverage and light grill menu served directly to your sun lounger</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={15} className="text-[#d4af37]" />
                <span>Strict privacy — restricted exclusively to in-house guests and registered cabana patrons</span>
              </li>
            </ul>

            <button
              onClick={() => onOpenBooking('deluxe')}
              className={`px-7 py-3.5 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2`}
            >
              <span>Book Stay With Pool Access</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="h-full min-h-[380px] relative bg-black">
            <img
              src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80"
              alt="Poolside Cabanas"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <span className="text-xs text-[#f3e5ab] font-mono bg-black/60 px-3 py-1 rounded-full border border-white/20">
                Nsugbe Private Pool Oasis
              </span>
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
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
                alt="Royal Moroccan Spa"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-[#5c0725] text-[#f3e5ab] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Wellness
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
                src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80"
                alt="Executive Boardroom"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-[#5c0725] text-[#f3e5ab] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Business
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-cinzel text-lg font-bold text-white">Diplomatic Majlis & Boardroom</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Soundproof executive boardroom equipped with an 85-inch 4K wireless presentation display, high-speed fiber internet, and executive catering.
              </p>
            </div>
          </div>

          {/* Airport Chauffeur */}
          <div className="rounded-3xl overflow-hidden border border-[#d4af37]/30 bg-[#1c040e]/80 shadow-xl flex flex-col justify-between group">
            <div className="h-52 overflow-hidden bg-black relative">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80"
                alt="Luxury Transit"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-[#5c0725] text-[#f3e5ab] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                Transit
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
