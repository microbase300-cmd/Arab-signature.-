import React, { useState, useEffect } from 'react';
import {
  X, ChevronLeft, ChevronRight, Bed, Users, Maximize2, ShieldCheck,
  CheckCircle2, Sparkles, Building2, MapPin, Phone, ArrowRight,
  Tv, Wifi, Wind, Coffee, Crown, ZoomIn, Info
} from 'lucide-react';
import { HOTEL_INFO } from '../data/hotelData';

export default function RoomDetailsModal({ room, onClose, onOpenBooking, initialBuilding = 'all' }) {
  if (!room) return null;

  const extPhotos = room.extensionBuildingPhotos || [];
  const mainPhotos = room.mainBuildingPhotos || [];
  const allPhotos = room.gallery && room.gallery.length > 0
    ? room.gallery
    : [room.image || '/rooms/suite-royal-penthouse.jpg'];

  // Determine initial building filter
  const [buildingFilter, setBuildingFilter] = useState(() => {
    if (initialBuilding === 'extension' && extPhotos.length > 0) return 'extension';
    if (initialBuilding === 'main' && mainPhotos.length > 0) return 'main';
    return 'all';
  });

  const displayedPhotos =
    buildingFilter === 'extension' && extPhotos.length > 0
      ? extPhotos
      : buildingFilter === 'main' && mainPhotos.length > 0
      ? mainPhotos
      : allPhotos;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset photo index when filter changes or room changes
  useEffect(() => {
    setCurrentIdx(0);
  }, [buildingFilter, room.id]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isZoomed) setIsZoomed(false);
        else onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, displayedPhotos.length, isZoomed]);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? displayedPhotos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev === displayedPhotos.length - 1 ? 0 : prev + 1));
  };

  const effectivePhoto = displayedPhotos[currentIdx] || room.image || '/rooms/suite-royal-penthouse.jpg';
  const effectivePrice = room.isPromoActive && room.promoPrice ? room.promoPrice : room.price;
  const is120kApartment = room.price === 120000 || room.id === 'suites' || room.hasParlour;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#140209] border-2 border-[#d4af37]/60 rounded-3xl overflow-hidden shadow-2xl my-auto text-gray-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#1c040d]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5c0725] border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono uppercase tracking-wider font-bold">
                {room.boardTitle || room.category}
              </span>
              {is120kApartment && (
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 to-[#d4af37]/35 border border-amber-400 text-amber-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Crown size={12} className="text-[#d4af37]" />
                  <span>Apartment with Private Parlour</span>
                </span>
              )}
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-extrabold text-white">
              {room.name}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Nightly Rate</span>
              <span className="text-lg font-bold font-mono text-[#d4af37]">
                ₦{Number(effectivePrice).toLocaleString()}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer"
              title="Close modal (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* 120k Special Apartment with Parlour Callout */}
          {is120kApartment && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2e0915] via-[#450d21] to-[#1f050f] border-2 border-[#d4af37] shadow-xl flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#f3e5ab] shrink-0 mt-0.5">
                <Crown size={22} className="text-[#d4af37]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-cinzel text-sm sm:text-base font-bold text-white">
                    Luxury Apartment with Spacious Private Parlour
                  </h4>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#d4af37] text-black font-extrabold uppercase">
                    Extension Building
                  </span>
                </div>
                <p className="text-xs text-[#f3e5ab]/90 leading-relaxed">
                  This ₦120,000 suite is designed as a full-service executive apartment featuring a large private parlour / living room with plush executive lounge seating, separate master king bedroom, dual smart entertainment displays, mini-bar, ensuite luxury marble rain bathroom, and dedicated butler service.
                </p>
              </div>
            </div>
          )}

          {/* Photo Gallery & Building Wing Switcher */}
          <div className="space-y-3">
            {/* Building Photo Filter Tabs (Main vs Extension) */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/15">
                <button
                  type="button"
                  onClick={() => setBuildingFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    buildingFilter === 'all'
                      ? 'bg-[#d4af37] text-black shadow-md'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  All Photos ({allPhotos.length})
                </button>

                {extPhotos.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setBuildingFilter('extension')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      buildingFilter === 'extension'
                        ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-md'
                        : 'text-cyan-300 hover:text-white'
                    }`}
                  >
                    <span>Extension Building ({extPhotos.length})</span>
                  </button>
                )}

                {mainPhotos.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setBuildingFilter('main')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      buildingFilter === 'main'
                        ? 'bg-gradient-to-r from-[#7a0d33] to-[#5c0725] text-[#f3e5ab] shadow-md border border-[#d4af37]/40'
                        : 'text-rose-300 hover:text-white'
                    }`}
                  >
                    <span>Main Building ({mainPhotos.length})</span>
                  </button>
                )}
              </div>

              <span className="text-[11px] font-mono text-[#f3e5ab] bg-black/60 px-3 py-1 rounded-lg border border-white/10">
                Photo {currentIdx + 1} of {displayedPhotos.length}
              </span>
            </div>

            {/* Main Stage Image with Navigation Overlay */}
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-black border border-[#d4af37]/40 group">
              <img
                src={effectivePhoto}
                alt={`${room.name} view ${currentIdx + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Prev / Next Arrows */}
              {displayedPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all cursor-pointer group-hover:scale-105"
                    title="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all cursor-pointer group-hover:scale-105"
                    title="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Badges on Image */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono font-bold uppercase tracking-wider">
                  VIVID HDR • 4K
                </span>
                {effectivePhoto.includes('ext-') ? (
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-900/80 backdrop-blur-md border border-cyan-400 text-cyan-200 text-[10px] font-mono font-bold uppercase tracking-wider">
                    Extension Building Angle
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-[#5c0725]/85 backdrop-blur-md border border-[#d4af37]/40 text-[#f3e5ab] text-[10px] font-mono font-bold uppercase tracking-wider">
                    Main Building Angle
                  </span>
                )}
              </div>

              {/* Zoom Trigger */}
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/75 hover:bg-black text-white border border-white/20 transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                title="View Fullscreen"
              >
                <ZoomIn size={14} className="text-[#d4af37]" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {displayedPhotos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
                {displayedPhotos.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      currentIdx === idx
                        ? 'border-[#d4af37] scale-105 ring-2 ring-[#d4af37]/50'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                <Bed size={12} className="text-[#d4af37]" />
                <span>Bed Configuration</span>
              </span>
              <strong className="text-white block text-[11px] truncate">{room.bed}</strong>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                <Users size={12} className="text-[#d4af37]" />
                <span>Capacity</span>
              </span>
              <strong className="text-white block text-[11px]">{room.guests || '2 Adults'}</strong>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                <Maximize2 size={12} className="text-[#d4af37]" />
                <span>Room Size</span>
              </span>
              <strong className="text-white block text-[11px]">{room.size || '45 sqm'}</strong>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase flex items-center gap-1">
                <Building2 size={12} className="text-[#d4af37]" />
                <span>Total Inventory</span>
              </span>
              <strong className="text-[#d4af37] block text-[11px]">{room.totalRooms || 2} Luxury Rooms</strong>
            </div>
          </div>

          {/* Room Numbers Distribution by Building Wing */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#d4af37] font-bold block">
              Room Numbers &amp; Wing Locations
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {room.extensionBuildingRooms && room.extensionBuildingRooms.length > 0 && (
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-cyan-300">
                    <span className="font-bold">Extension Building (100 Wing)</span>
                    <span>{room.extensionBuildingRooms.length} Room{room.extensionBuildingRooms.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {room.extensionBuildingRooms.map((num) => (
                      <span key={num} className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 font-bold">
                        Room #{num}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {room.mainBuildingRooms && room.mainBuildingRooms.length > 0 && (
                <div className="p-3 rounded-xl bg-[#5c0725]/20 border border-[#d4af37]/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[#f3e5ab]">
                    <span className="font-bold">Main Building (600 Wing)</span>
                    <span>{room.mainBuildingRooms.length} Room{room.mainBuildingRooms.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {room.mainBuildingRooms.map((num) => (
                      <span key={num} className="px-2 py-0.5 rounded bg-[#5c0725]/60 border border-[#d4af37]/40 text-[#f3e5ab] font-bold">
                        Room #{num}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="font-cinzel text-sm sm:text-base font-bold text-white">
              Suite Description &amp; Architecture
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Amenities & Comfort Features */}
          <div className="space-y-2.5">
            <h4 className="font-cinzel text-sm sm:text-base font-bold text-white">
              In-Room Amenities &amp; Services
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(room.amenities || [
                "Air Conditioning & Climate Control",
                "Uninterrupted 24/7 Power Backup",
                "Smart 4K Entertainment Display",
                "Complimentary High-Speed Wi-Fi",
                "Private Ensuite Bathroom with Hot Water",
                "Dedicated Room Service & Hospitality Concierge"
              ]).map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <CheckCircle2 size={14} className="text-[#d4af37] shrink-0" />
                  <span className="text-gray-200">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#1c040d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Confirmed Price</span>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-xl sm:text-2xl font-black text-[#d4af37]">
                  ₦{Number(effectivePrice).toLocaleString()}
                </span>
                <span className="text-xs text-gray-400">/ Night</span>
              </div>
            </div>
            {room.isPromoActive && room.promoPrice && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                Special Promo Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`https://wa.me/${HOTEL_INFO.whatsapp}?text=${encodeURIComponent(
                `Hello Arab Signature Hotel! I am inquiring about booking the *${room.name}* (₦${Number(effectivePrice).toLocaleString()}/night). Please let me know current availability.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Phone size={14} className="text-emerald-400" />
              <span>Inquire via WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenBooking) onOpenBooking(room.id);
              }}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book This Room</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsZoomed(false)}
        >
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/15 text-white hover:bg-white/30"
          >
            <X size={24} />
          </button>
          <img
            src={effectivePhoto}
            alt="Fullscreen Room View"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
