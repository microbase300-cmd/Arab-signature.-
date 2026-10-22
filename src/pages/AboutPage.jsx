import React from 'react';
import { HOTEL_INFO } from '../data/hotelData';
import { 
  ShieldCheck, Zap, Crown, Waves, Sparkles, 
  Award, ArrowRight, CheckCircle2, MapPin, Building2, PhoneCall
} from 'lucide-react';

export default function AboutPage({ onNavigate, onOpenBooking }) {
  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  const fourPillars = [
    {
      icon: ShieldCheck,
      title: 'Diplomatic Security',
      desc: '24/7 armed perimeter security, biometric and keycard gate access, monitored CCTV surveillance, and complete guest confidentiality in Nsugbe.'
    },
    {
      icon: Zap,
      title: 'Uninterrupted Power',
      desc: 'Dual soundproof industrial Caterpillar generators paired with a commercial solar inverter array ensure zero seconds of power interruption.'
    },
    {
      icon: Crown,
      title: 'Bespoke Butler Service',
      desc: 'Dedicated hospitality team offering personalized floor care, priority check-in, garment pressing, in-room private dining, and custom itinerary assistance.'
    },
    {
      icon: Waves,
      title: 'Poolside & VIP Cabanas',
      desc: 'Secluded poolside lounging with curtained VIP cabanas, luxury sun loungers, towel attendants, and bespoke mocktail & grill service.'
    }
  ];

  const quickStats = [
    { label: 'Inventory', value: '34 Luxury Suites' },
    { label: 'Location', value: 'Nsugbe, Onitsha' },
    { label: 'Power Supply', value: '100% Uninterrupted' },
    { label: 'Protection', value: '24/7 Armed Security' }
  ];

  return (
    <div className="bg-[#120208] text-gray-100 min-h-screen">
      
      {/* 1. HERO BANNER - OPTIMIZED FOR MOBILE */}
      <section className="relative py-12 sm:py-20 md:py-24 px-4 sm:px-6 text-center border-b border-[#d4af37]/30 bg-gradient-to-b from-[#250210] to-[#120208] overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5c0725]/60 border border-[#d4af37]/40 text-[#f3e5ab] text-[11px] sm:text-xs font-mono tracking-widest shadow-md">
            <Crown size={13} className="text-[#d4af37]" />
            <span>OUR HERITAGE & VISION</span>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide leading-tight">
            About Arab Signature <br />
            <span className="gold-text-gradient">Hotel & Suites</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed px-2">
            A premier luxury destination located in Nsugbe, Onitsha, delivering an exceptional blend of world-class comfort, uncompromising security, and sophisticated Arabian design.
          </p>
        </div>
      </section>

      {/* 2. OFFICIAL ABOUT US STATEMENT - RESTRUCTURED FOR MOBILE READABILITY */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-[#1c040e]/95 border-2 border-[#d4af37]/45 shadow-2xl space-y-5 sm:space-y-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header pill & location */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#d4af37] uppercase tracking-wider">
              <Award size={15} /> 
              <span>Official Establishment Manifesto</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
              <MapPin size={12} className="text-[#d4af37]" />
              <span>Nsugbe, Onitsha</span>
            </div>
          </div>

          {/* Lead Quote Hook */}
          <div className="border-l-2 sm:border-l-4 border-[#d4af37] pl-3.5 sm:pl-6 py-1">
            <p className="font-serif text-base sm:text-xl md:text-2xl text-white font-medium leading-snug sm:leading-relaxed italic">
              "A premier luxury sanctuary where world-class hospitality meets the timeless majesty of Arabian architecture."
            </p>
          </div>

          {/* Structured, Bite-Sized Story Paragraphs */}
          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed">
            <p>
              Welcome to <strong className="text-white font-semibold">Arab Signature Hotel & Suites</strong>. Featuring 34 exquisitely finished luxury rooms and diplomatic suites, our sanctuary was conceived to provide distinguished travelers with an elevated standard of privacy, refinement, and serenity away from the commercial bustle of Onitsha.
            </p>
            <p>
              Whether visiting Anambra State for corporate business, commercial commerce, or a private leisure retreat, our guests enjoy state-of-the-art amenities, uninterrupted industrial power, round-the-clock armed security, and dedicated butler care tailored to the highest standards of excellence.
            </p>
            <p className="text-gray-300 text-[11px] sm:text-xs">
              Independently owned and operated by a private investment group, our establishment is unreservedly committed to delivering a secure, prestigious, and deeply memorable stay for every guest who walks through our doors.
            </p>
          </div>

          {/* Quick Stats Grid for at-a-glance mobile reading */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
            {quickStats.map((stat, idx) => (
              <div 
                key={idx} 
                className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10 text-center space-y-0.5"
              >
                <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
                  {stat.label}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#f3e5ab] block truncate">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Badge */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-400 gap-3">
            <div>
              <strong className="text-white block font-sans">Arab Signature Hotel & Suites</strong>
              <span className="text-[11px] text-gray-400">Nsugbe, Onitsha, Anambra State, Nigeria</span>
            </div>
            <span className="self-stretch sm:self-auto text-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#d4af37] text-[11px] font-semibold">
              Independently Owned & Operated
            </span>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS - RESPONSIVE MOBILE CARDS */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold">
            THE STANDARDS WE UPHOLD
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide">
            The Four Pillars of Arab Signature
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Engineered to ensure an elevated, secure, and stress-free stay for both business leaders and leisure guests.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {fourPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx} 
                className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#d4af37]/25 bg-[#1c040e]/85 hover:border-[#d4af37]/60 transition-all shadow-xl space-y-3"
              >
                <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#5c0725] text-[#f3e5ab] flex items-center justify-center flex-shrink-0 shadow-md">
                    <Icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-cinzel text-sm sm:text-base md:text-lg font-bold text-white">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. ARCHITECTURAL CRAFTSMANSHIP & PHOTO SHOWCASE */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#17030c] border-y border-[#5c0725]/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          
          <div className="space-y-4 sm:space-y-6">
            <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold">
              INSPIRED BY DOHA PALATIAL GRANDEUR
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide leading-tight">
              Sophisticated Design in <br className="hidden sm:block" />
              <span className="gold-text-gradient">The Heart of Anambra</span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Every arch, gilded detail, and marble texture at Arab Signature Hotel was selected to evoke the serene splendor of modern Arabian architecture. Designed by master artisans, our suites feature custom imported lighting, soundproof acoustic walling, and indulgent marble bathrooms.
            </p>

            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#d4af37] flex-shrink-0 mt-0.5" />
                <span>Custom Arabesque motifs, gilded brass accents, and Italian marble</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#d4af37] flex-shrink-0 mt-0.5" />
                <span>High acoustic soundproofing ensuring total serenity away from city noise</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#d4af37] flex-shrink-0 mt-0.5" />
                <span>Private majlis lounges tailored for executive and private discussions</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => onOpenBooking('deluxe')}
                className={`w-full sm:w-auto px-7 py-3.5 rounded-xl sm:rounded-2xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-transform`}
              >
                <span>Reserve A Suite Today</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* 4-Image Grid Responsive for Mobile */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="space-y-2.5 sm:space-y-4">
              <img
                src="/rooms/arch-facade-main.jpg"
                alt="Arab Signature Hotel Exterior Architecture"
                className="rounded-xl sm:rounded-2xl border border-[#d4af37]/30 h-36 sm:h-48 md:h-56 w-full object-cover shadow-xl"
                loading="lazy"
              />
              <img
                src="/rooms/suite-royal-penthouse.jpg"
                alt="Royal Diplomatic Penthouse"
                className="rounded-xl sm:rounded-2xl border border-[#d4af37]/30 h-36 sm:h-48 md:h-56 w-full object-cover shadow-xl"
                loading="lazy"
              />
            </div>
            <div className="space-y-2.5 sm:space-y-4 pt-3 sm:pt-6">
              <img
                src="/rooms/arch-reception-entrance.jpg"
                alt="Grand Reception Canopy"
                className="rounded-xl sm:rounded-2xl border border-[#d4af37]/30 h-36 sm:h-48 md:h-56 w-full object-cover shadow-xl"
                loading="lazy"
              />
              <img
                src="/rooms/suite-deluxe-doha.jpg"
                alt="Deluxe Doha Suite"
                className="rounded-xl sm:rounded-2xl border border-[#d4af37]/30 h-36 sm:h-48 md:h-56 w-full object-cover shadow-xl"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER - MOBILE STACKED BUTTONS */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-4 sm:space-y-6">
        <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
          Experience Unmatched Luxury in Nsugbe, Onitsha
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
          Whether you are visiting for commercial business in Onitsha or seeking a private luxury weekend getaway, our team is ready to welcome you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto pt-2">
          <button
            onClick={() => onNavigate('suites')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 active:scale-98 transition-all"
          >
            View Suites & Rates
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all`}
          >
            Contact Front Desk
          </button>
        </div>
      </section>

    </div>
  );
}
