import React from 'react';
import { HOTEL_INFO } from '../data/hotelData';
import { ShieldCheck, Zap, Crown, Waves, Sparkles, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage({ onNavigate, onOpenBooking }) {
  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  return (
    <div className="bg-[#120208] text-gray-100 min-h-screen">
      
      {/* 1. ABOUT HERO BANNER */}
      <section className="relative py-24 px-6 text-center border-b border-[#d4af37]/30 bg-gradient-to-b from-[#250210] to-[#120208] overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#5c0725]/50 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-mono tracking-widest">
            <Crown size={14} className="text-[#d4af37]" />
            <span>OUR HERITAGE & VISION</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-white tracking-wide">
            About Arab Signature <br />
            <span className="gold-text-gradient">Hotel & Suites</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            A premier luxury destination located in Nsugbe, Onitsha, delivering an exceptional blend of world-class comfort and sophisticated Arabian design.
          </p>
        </div>
      </section>

      {/* 2. OFFICIAL ABOUT US STATEMENT (EXACT CLIENT TEXT) */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#1c040e]/90 border-2 border-[#d4af37]/50 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-[#d4af37] uppercase tracking-wider">
            <Award size={16} /> Official Establishment Manifesto
          </div>

          <blockquote className="font-serif text-lg sm:text-xl md:text-2xl text-white font-normal leading-relaxed italic border-l-4 border-[#d4af37] pl-6 py-2">
            "{HOTEL_INFO.aboutText}"
          </blockquote>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-gray-400 gap-4">
            <div>
              <strong className="text-white block font-sans">Arab Signature Hotel & Suites</strong>
              <span>Nsugbe, Onitsha, Anambra State, Nigeria</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#d4af37] font-semibold">
              Independently Owned & Operated
            </span>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS OF OUR HOSPITALITY */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold">
            THE STANDARDS WE UPHOLD
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wide">
            The Four Pillars of Arab Signature
          </h2>
          <p className="text-sm text-gray-400">
            Engineered to ensure an elevated, secure, and stress-free stay for both business leaders and leisure guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-3xl border border-[#d4af37]/30 bg-[#1c040e]/80 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5c0725] text-[#f3e5ab] flex items-center justify-center">
              <ShieldCheck size={26} />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-white">Diplomatic Security</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              24/7 armed perimeter security, biometric and keycard gate access, monitored CCTV surveillance, and complete guest confidentiality.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-[#d4af37]/30 bg-[#1c040e]/80 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5c0725] text-[#f3e5ab] flex items-center justify-center">
              <Zap size={26} />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-white">Uninterrupted Power</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Dual soundproof industrial Caterpillar generators combined with a commercial solar inverter array ensure zero seconds of power outage.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-[#d4af37]/30 bg-[#1c040e]/80 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5c0725] text-[#f3e5ab] flex items-center justify-center">
              <Crown size={26} />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-white">Bespoke Butler Service</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Our hospitality team delivers personalized care, priority check-in, garment pressing, in-room private dining, and custom itinerary planning.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-[#d4af37]/30 bg-[#1c040e]/80 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5c0725] text-[#f3e5ab] flex items-center justify-center">
              <Waves size={26} />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-white">Private Poolside & VIP Cabanas</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Secluded poolside lounging with curtained VIP cabanas, luxury sun loungers, towel attendants, and bespoke mocktail & grill service.
            </p>
          </div>

        </div>
      </section>

      {/* 4. ARCHITECTURAL CRAFTSMANSHIP & PHOTO SHOWCASE */}
      <section className="py-20 px-6 bg-[#17030c] border-y border-[#5c0725]/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold">
              INSPIRED BY DOHA PALATIAL GRANDEUR
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wide leading-tight">
              Sophisticated Design in <br />
              <span className="gold-text-gradient">The Heart of Anambra</span>
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed">
              Every arch, gilded detail, and marble texture at Arab Signature Hotel was selected to evoke the serene splendor of modern Arabian architecture. Designed by master artisans, our suites feature custom imported lighting, soundproof acoustic walling, and indulgent marble bathrooms.
            </p>

            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#d4af37]" />
                <span>Custom Arabesque motifs, gilded brass accents, and Italian marble</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#d4af37]" />
                <span>High acoustic soundproofing ensuring total serenity away from city noise</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#d4af37]" />
                <span>Private majlis lounges tailored for executive and private discussions</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => onOpenBooking('deluxe')}
                className={`px-8 py-3.5 rounded-2xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2`}
              >
                <span>Reserve A Suite Today</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
              alt="Suite Bedroom"
              className="rounded-2xl border border-[#d4af37]/30 h-64 w-full object-cover shadow-xl"
            />
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
              alt="Suite Living"
              className="rounded-2xl border border-[#d4af37]/30 h-64 w-full object-cover shadow-xl mt-6"
            />
          </div>

        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center space-y-6">
        <h2 className="font-cinzel text-3xl font-extrabold text-white">
          Experience Unmatched Luxury in Nsugbe, Onitsha
        </h2>
        <p className="text-sm text-gray-300 max-w-xl mx-auto">
          Whether you are visiting for commercial business in Onitsha or seeking a private luxury weekend getaway, our team is ready to welcome you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigate('suites')}
            className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20"
          >
            View Suites & Rates
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`px-7 py-3.5 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-lg`}
          >
            Contact Front Desk
          </button>
        </div>
      </section>

    </div>
  );
}
