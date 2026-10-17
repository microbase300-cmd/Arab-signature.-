import React from 'react';
import Logo from './Logo';
import { HOTEL_INFO, ROOMS } from '../data/hotelData';
import { MapPin, Phone, ShieldCheck, Clock } from 'lucide-react';

export default function Footer({ onNavigate, onOpenBooking }) {
  const handleNav = (pageId) => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="px-6 py-14 border-t border-white/10 bg-[#090105] text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <Logo variant="gold" size="default" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Arab Signature Hotel & Suites is an ultra-luxury hospitality destination located in Nsugbe, Onitsha, combining traditional Arabian palatial architecture with 5-star executive amenities.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#d4af37]">
            <ShieldCheck size={14} />
            <span>Independently Owned & Operated</span>
          </div>
        </div>

        {/* Quick Multi-Page Navigation */}
        <div>
          <h4 className="font-cinzel font-bold text-sm text-white mb-4 uppercase tracking-wider">
            Explore Hotel
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => handleNav('home')} className="hover:text-[#d4af37] transition-colors">
                Home Page
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('about')} className="hover:text-[#d4af37] transition-colors">
                About Us & Heritage
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('suites')} className="hover:text-[#d4af37] transition-colors">
                Doha Suites & Rates
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('amenities')} className="hover:text-[#d4af37] transition-colors">
                Poolside & VIP Cabanas
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('dining')} className="hover:text-[#d4af37] transition-colors">
                Al-Sultan Gourmet Dining
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('contact')} className="hover:text-[#d4af37] transition-colors">
                Location & Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Accommodations */}
        <div>
          <h4 className="font-cinzel font-bold text-sm text-white mb-4 uppercase tracking-wider">
            Accommodations
          </h4>
          <ul className="space-y-2.5 text-xs">
            {ROOMS.map((r) => (
              <li key={r.id}>
                <button 
                  onClick={() => onOpenBooking(r.id)}
                  className="hover:text-[#d4af37] transition-colors text-left flex justify-between w-full pr-4"
                >
                  <span>{r.name}</span>
                  <span className="text-[#d4af37] font-semibold">{r.priceFormatted}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Reception & Contact */}
        <div className="space-y-3.5">
          <h4 className="font-cinzel font-bold text-sm text-white uppercase tracking-wider">
            Front Desk Reception
          </h4>
          <div className="flex items-start gap-2 text-xs text-white">
            <MapPin size={15} className="text-[#d4af37] flex-shrink-0 mt-0.5" />
            <span>Nsugbe, Onitsha, Anambra State, Nigeria</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#d4af37] font-semibold">
            <Phone size={14} className="flex-shrink-0" />
            <span>Hotline: {HOTEL_INFO.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
            <Clock size={13} className="text-gray-400" />
            <span>Check-in: 2:00 PM • Check-out: 12:00 PM</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div>
          © {new Date().getFullYear()} Arab Signature Hotel and Suites. All rights reserved. • Nsugbe, Onitsha
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <span>Verified Paystack Payment</span>
          <span>•</span>
          <span>Diplomatic Choice</span>
        </div>
      </div>
    </footer>
  );
}
