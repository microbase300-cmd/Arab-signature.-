import React, { useState } from 'react';
import Logo from './Logo';
import { HOTEL_INFO } from '../data/hotelData';
import { Award, Phone, Sparkles, Menu, X } from 'lucide-react';

export default function Navbar({ currentPage, onNavigate, onOpenBooking }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'suites', label: 'Doha Suites' },
    { id: 'amenities', label: 'Poolside & Cabanas' },
    { id: 'dining', label: 'Al-Sultan Dining' },
    { id: 'gallery', label: 'Photo Gallery' },
    { id: 'contact', label: 'Location & Contact' },
  ];

  const handleLinkClick = (pageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-2xl">
      {/* 1. Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-[#2a010e] via-[#5c0725] to-[#2a010e] text-[#f3e5ab] px-4 py-2 text-center text-xs border-b border-[#d4af37]/25 flex items-center justify-center gap-2">
        <Award size={14} className="text-[#d4af37] flex-shrink-0" />
        <span className="font-medium tracking-wide">
          Direct Website Booking: Free Morning Buffet & Complimentary VIP Poolside Cabana Access
        </span>
        <span className="hidden md:inline font-mono text-[10px] text-white/70">
          • Nsugbe, Onitsha • Hotline: {HOTEL_INFO.phone}
        </span>
      </div>

      {/* 2. Main Luxury Hotel Navbar */}
      <nav className="bg-[#120208]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleLinkClick('home')} 
            className="cursor-pointer hover:opacity-95 transition-opacity"
          >
            <Logo variant="gold" size="default" />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-widest font-semibold text-gray-300">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`transition-all py-1 relative ${
                  currentPage === link.id
                    ? 'text-[#f3e5ab] font-bold'
                    : 'hover:text-[#d4af37]'
                }`}
              >
                <span>{link.label}</span>
                {currentPage === link.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#d4af37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                )}
              </button>
            ))}
          </div>

          {/* Right Action Tools */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${HOTEL_INFO.whatsapp}?text=Hello%20Arab%20Signature%20Hotel,%20I%20would%20like%20to%20inquire%20about%20suite%20reservations.`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all bg-white/10 text-white hover:bg-white/20 border border-white/10 shadow-sm"
            >
              <Phone size={14} className="text-[#d4af37]" />
              <span>WhatsApp Concierge</span>
            </a>

            <button
              onClick={() => onOpenBooking('deluxe')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              <span>Book A Suite</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-white bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 rounded-2xl border border-[#d4af37]/30 bg-[#1a040d] text-white space-y-2.5 animate-fadeIn">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full py-2.5 px-3 text-left text-sm font-semibold rounded-xl transition-colors flex items-center justify-between ${
                  currentPage === link.id
                    ? 'bg-[#5c0725] text-[#f3e5ab] font-bold'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {currentPage === link.id && <span className="text-[#d4af37]">●</span>}
              </button>
            ))}

            <div className="pt-2 border-t border-white/10 space-y-2">
              <a
                href={`https://wa.me/${HOTEL_INFO.whatsapp}?text=Hello%20Arab%20Signature%20Hotel,%20I%20would%20like%20to%20inquire%20about%20suite%20reservations.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider text-center block"
              >
                Chat on WhatsApp
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking('deluxe');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider text-center block shadow-lg"
              >
                Book A Suite Now
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
