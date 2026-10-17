import React, { useState } from 'react';
import Logo from '../Logo';
import { ROOMS, AMENITIES } from '../../data/hotelData';
import { Sparkles, Utensils, Waves, Car, Star, ArrowRight, Check } from 'lucide-react';

export default function Sample10_InteractiveAmenities({ onOpenBooking }) {
  const [selectedAmenity, setSelectedAmenity] = useState('spa');

  const amenityIcons = {
    spa: <Sparkles size={16} />,
    dining: <Utensils size={16} />,
    pool: <Waves size={16} />,
    transit: <Car size={16} />
  };

  return (
    <div className="min-h-full bg-[#fdfbf7] text-[#29221f] flex flex-col justify-between selection:bg-[#5c0725] selection:text-white">
      
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-[#eee7da] bg-[#fdfbf7]/95 backdrop-blur-md sticky top-0 z-20">
        <Logo variant="burgundy" size="default" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c0725] bg-[#5c0725]/10 px-2.5 py-1 rounded-full">
          Amenities
        </span>
      </header>

      {/* Main Content */}
      <main className="px-5 py-5 space-y-6 flex-1">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="font-playfair text-xl font-bold text-[#1f1618]">
            Interactive Hotel Amenities
          </h1>
          <p className="text-xs text-[#73655d] max-w-xs mx-auto">
            Everything you need for an unforgettable stay in one seamless portal.
          </p>
        </div>

        {/* Interactive Amenity Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {AMENITIES.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedAmenity(item.id)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all ${
                selectedAmenity === item.id
                  ? 'bg-[#5c0725] text-white shadow-md scale-102'
                  : 'bg-white border border-[#eee7da] text-[#73655d] hover:border-[#5c0725]/30'
              }`}
            >
              {amenityIcons[item.id]}
              <span className="text-[10px] font-bold tracking-tight">{item.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Selected Amenity Highlight Card */}
        {(() => {
          const activeItem = AMENITIES.find(a => a.id === selectedAmenity) || AMENITIES[0];
          return (
            <div className="p-4 rounded-3xl bg-[#f5efe3] border border-[#e8dfcf] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#5c0725] uppercase tracking-wider">{activeItem.name}</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#73655d] font-medium border border-[#e8dfcf]">Free for Guests</span>
              </div>
              <p className="text-xs text-[#4d4039] leading-relaxed">{activeItem.desc}</p>
            </div>
          );
        })()}

        {/* Suite Showcase Card */}
        <div 
          onClick={() => onOpenBooking('deluxe')}
          className="rounded-3xl overflow-hidden shadow-md bg-white border border-[#eee7da] group cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
            alt="Deluxe Room"
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-playfair font-bold text-sm text-[#241a1c]">Deluxe Doha Suite</h3>
              <p className="text-[11px] text-[#73655d] mt-0.5">Complimentary Spa & Pool Access Included</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#5c0725]">₦45,000</span>
              <span className="text-[10px] text-[#73655d] block">/ night</span>
            </div>
          </div>
        </div>

      </main>

      {/* Sticky Bottom Swipe Booking Action */}
      <div className="sticky bottom-4 px-5 z-20">
        <button
          onClick={() => onOpenBooking('deluxe')}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all"
        >
          Book Now with Free Amenities <ArrowRight size={14} />
        </button>
      </div>

      {/* Footer */}
      <footer className="px-5 py-3 text-center border-t border-[#eee7da] text-[10px] text-[#73655d]">
        Arab Signature Hotel • Interactive Amenities Showcase
      </footer>

    </div>
  );
}
