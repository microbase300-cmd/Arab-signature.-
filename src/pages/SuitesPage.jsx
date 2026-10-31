import React, { useState, useEffect } from 'react';
import { portalStore } from '../data/portalStore';
import { HOTEL_BUILDINGS } from '../data/hotelData';
import {
  Star, Check, ArrowRight, Crown, Sparkles, ShieldCheck,
  Users, Bed, Building2, Layers, DoorOpen, MapPin, Eye
} from 'lucide-react';
import RoomDetailsModal from '../components/RoomDetailsModal';

export default function SuitesPage({ onNavigate, onOpenBooking }) {
  const [selectedBuilding, setSelectedBuilding] = useState('all'); // 'all' | 'main' | 'extension'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | room.id
  const [rooms, setRooms] = useState(() => portalStore.getRoomRates());
  const [activePhotoMap, setActivePhotoMap] = useState({});
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);

  useEffect(() => {
    return portalStore.subscribeRates(setRooms);
  }, []);

  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  // Filter rooms available in the currently selected building wing
  const buildingRooms = rooms.filter((room) => {
    if (selectedBuilding === 'main') {
      return room.mainBuildingRooms && room.mainBuildingRooms.length > 0;
    }
    if (selectedBuilding === 'extension') {
      return room.extensionBuildingRooms && room.extensionBuildingRooms.length > 0;
    }
    return true;
  });

  // Reset category filter if the newly selected building doesn't have that category
  const handleBuildingChange = (bldgId) => {
    setSelectedBuilding(bldgId);
    if (selectedCategory !== 'all') {
      const targetRoom = rooms.find((r) => r.id === selectedCategory);
      if (targetRoom) {
        if (bldgId === 'main' && (!targetRoom.mainBuildingRooms || targetRoom.mainBuildingRooms.length === 0)) {
          setSelectedCategory('all');
        } else if (bldgId === 'extension' && (!targetRoom.extensionBuildingRooms || targetRoom.extensionBuildingRooms.length === 0)) {
          setSelectedCategory('all');
        }
      }
    }
  };

  // Final filtered rooms for display
  const filteredRooms = buildingRooms.filter((room) => {
    if (selectedCategory === 'all') return true;
    return room.id === selectedCategory;
  });

  // Helper to get room count for a category based on active building filter
  const getCategoryRoomCount = (room) => {
    if (selectedBuilding === 'main') return room.mainBuildingRooms?.length || 0;
    if (selectedBuilding === 'extension') return room.extensionBuildingRooms?.length || 0;
    return room.totalRooms || (room.roomNumbers ? room.roomNumbers.length : 0);
  };

  return (
    <div className="bg-[#120208] text-gray-100 min-h-screen">
      
      {/* ========================================================
          1. ARAB SUITES HERO & HIERARCHICAL FILTER CONTROLS
         ======================================================== */}
      <section className="relative pt-14 pb-10 sm:py-20 px-4 sm:px-6 text-center border-b border-[#d4af37]/30 bg-gradient-to-b from-[#250210] to-[#120208] overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-6xl mx-auto space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5c0725]/60 border border-[#d4af37]/40 text-[#f3e5ab] text-[10px] sm:text-xs font-mono tracking-widest">
            <Crown size={13} className="text-[#d4af37] flex-shrink-0" />
            <span>34 LUXURY ROOMS & ARAB SUITES • 2 BUILDINGS</span>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide leading-tight">
            Arab Suites & <span className="gold-text-gradient">Official Room Categories</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed px-1">
            Our 34 luxury rooms and diplomatic suites are organized across <strong className="text-white">two buildings of the same hotel</strong> — the <strong className="text-[#f3e5ab]">Main Building (20 Rooms)</strong> and the <strong className="text-[#f3e5ab]">Extension Building (14 Rooms)</strong>. Select a building or category below to explore rates and room numbers.
          </p>

          {/* LEVEL 1: BUILDING WING SELECTOR CARDS (3-COLUMN RESPONSIVE) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto pt-2 text-left">
            {[
              {
                id: 'all',
                title: 'All Arab Suites',
                subtitle: 'Main & Extension Buildings',
                badge: '34 Rooms Total',
                priceRange: '₦30,000 – ₦120,000',
                categoriesText: 'All 6 Official Categories'
              },
              {
                id: 'main',
                title: 'Main Building',
                subtitle: '600 Wing (Rooms 601 – 620)',
                badge: '20 Rooms',
                priceRange: '₦30,000 – ₦60,000',
                categoriesText: 'Super Exec, Exec, Superior, Deluxe, Standard'
              },
              {
                id: 'extension',
                title: 'Extension Building',
                subtitle: '100 Wing (Rooms 101 – 114)',
                badge: '14 Rooms',
                priceRange: '₦40,000 – ₦120,000',
                categoriesText: 'Suites, Super-Exec, Executive, Superior'
              }
            ].map((bldg) => {
              const isActive = selectedBuilding === bldg.id;
              return (
                <button
                  key={bldg.id}
                  type="button"
                  onClick={() => handleBuildingChange(bldg.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                    isActive
                      ? 'bg-gradient-to-br from-[#3d0519] via-[#250210] to-[#16030c] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 ring-1 ring-[#d4af37]/60'
                      : 'bg-[#1a040d]/80 border-white/10 hover:border-[#d4af37]/40 text-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className={isActive ? 'text-[#d4af37]' : 'text-gray-400'} />
                      <span className="font-cinzel font-bold text-xs sm:text-sm text-white uppercase tracking-wide">
                        {bldg.title}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex-shrink-0 ${
                      isActive
                        ? 'bg-[#d4af37] text-black'
                        : 'bg-white/10 text-[#f3e5ab]'
                    }`}>
                      {bldg.badge}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[11px] text-gray-300 font-medium">{bldg.subtitle}</div>
                    <div className="text-xs font-mono font-bold text-[#d4af37]">{bldg.priceRange}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* LEVEL 2: CATEGORY & PRICE FILTER PILLS */}
          <div className="pt-2 max-w-5xl mx-auto">
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <Layers size={13} />
                <span>
                  All Categories ({selectedBuilding === 'main' ? 20 : selectedBuilding === 'extension' ? 14 : 34})
                </span>
              </button>

              {buildingRooms.map((room) => {
                const count = getCategoryRoomCount(room);
                const isSelected = selectedCategory === room.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedCategory(room.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/20'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <span>{room.category}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-black/20 text-black font-bold' : 'bg-[#5c0725]/80 text-[#f3e5ab]'
                    }`}>
                      {room.priceFormatted} ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. RESPONSIVE SUITES & ROOMS CATALOG GRID (3-COL DESKTOP, 2-COL TABLET, 1-COL MOBILE)
         ======================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        
        {/* Active Filter Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white">
              {selectedBuilding === 'main'
                ? 'Main Building • 600 Wing Categories'
                : selectedBuilding === 'extension'
                ? 'Extension Building • 100 Wing Categories'
                : 'All 6 Official Hotel Room & Suite Categories'}
            </h2>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            Showing <strong className="text-[#f3e5ab]">{filteredRooms.length}</strong> {filteredRooms.length === 1 ? 'category' : 'categories'} • Instant Online Booking
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRooms.map((room) => {
            const roomGallery = room.gallery && room.gallery.length > 0 ? room.gallery : [room.image];
            const currentPhoto = activePhotoMap[room.id] || room.image;
            const hasMain = room.mainBuildingRooms && room.mainBuildingRooms.length > 0;
            const hasExt = room.extensionBuildingRooms && room.extensionBuildingRooms.length > 0;
            const activeCount = getCategoryRoomCount(room);

            return (
              <div
                key={room.id}
                className="rounded-3xl overflow-hidden border border-[#d4af37]/35 bg-[#1a040d]/95 shadow-2xl flex flex-col justify-between group hover:border-[#d4af37] transition-all duration-300"
              >
                {/* Top Photo Header */}
                <div className="relative h-56 sm:h-64 bg-black overflow-hidden flex-shrink-0">
                  <img
                    src={currentPhoto}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a040d] via-transparent to-black/30 opacity-80" />

                    {/* Category Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="bg-[#5c0725] text-[#f3e5ab] border border-[#d4af37]/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      {room.boardTitle || room.category}
                    </span>
                    {(room.hasParlour || room.price === 120000) && (
                      <span className="bg-gradient-to-r from-amber-500/30 to-[#d4af37]/40 text-amber-200 border border-amber-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                        <Crown size={11} className="text-[#d4af37]" />
                        <span>Apartment with Parlour</span>
                      </span>
                    )}
                    {room.isPromoActive && (
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white border border-emerald-300/60 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1 animate-pulse">
                        🔥 Special Promo
                      </span>
                    )}
                    <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/15">
                      {activeCount} {activeCount === 1 ? 'Room' : 'Rooms'}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-[#d4af37] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                    <Star size={11} fill="#d4af37" /> {room.rating}
                  </div>

                  {/* Multi-Angle Thumbnail Switcher */}
                  {roomGallery.length > 1 && (
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/15">
                        {roomGallery.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setActivePhotoMap((prev) => ({ ...prev, [room.id]: imgUrl }))
                            }
                            className={`w-10 h-7 rounded-lg overflow-hidden border transition-all ${
                              currentPhoto === imgUrl
                                ? 'border-[#d4af37] scale-105 ring-1 ring-[#d4af37]'
                                : 'border-white/20 opacity-65 hover:opacity-100'
                            }`}
                            title={`Angle ${idx + 1}`}
                          >
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      <span className="bg-black/75 backdrop-blur-md text-[#f3e5ab] font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border border-[#d4af37]/30">
                        {room.size}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Title & Price Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white group-hover:text-[#f3e5ab] transition-colors">
                          {room.name}
                        </h3>
                        <span className="text-[11px] text-gray-400 font-medium block">
                          {room.bed} • {room.guests}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {room.isPromoActive && room.promoPrice ? (
                          <div>
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="line-through text-gray-400 text-xs font-mono">
                                {room.priceFormatted}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-[9px] font-mono font-bold uppercase animate-pulse">
                                {room.discountPercent ? `-${room.discountPercent}%` : 'PROMO'}
                              </span>
                            </div>
                            <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono leading-tight">
                              {room.promoPriceFormatted || `₦${Number(room.promoPrice).toLocaleString()}`}
                            </div>
                          </div>
                        ) : (
                          <div className="text-lg sm:text-xl font-extrabold text-[#d4af37] font-mono leading-tight">
                            {room.priceFormatted}
                          </div>
                        )}
                        <span className="text-[10px] uppercase text-gray-400 block">per night</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                      {room.description}
                    </p>

                    {/* Structured Building & Room Number Pills Box */}
                    <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                        <DoorOpen size={12} />
                        <span>Assigned Building & Room Numbers:</span>
                      </div>

                      {/* Main Building Rooms Row */}
                      {hasMain && (selectedBuilding === 'all' || selectedBuilding === 'main') && (
                        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-white/5">
                          <span className="text-[11px] text-gray-300 font-medium">
                            Main Bldg ({room.mainBuildingRooms.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {room.mainBuildingRooms.map((rNum) => (
                              <span
                                key={rNum}
                                className="px-2 py-0.5 rounded-md bg-[#5c0725]/60 border border-[#d4af37]/40 text-[#f3e5ab] font-mono text-[10px] font-bold"
                              >
                                #{rNum}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Extension Building Rooms Row */}
                      {hasExt && (selectedBuilding === 'all' || selectedBuilding === 'extension') && (
                        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-white/5">
                          <span className="text-[11px] text-gray-300 font-medium">
                            Extension ({room.extensionBuildingRooms.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {room.extensionBuildingRooms.map((rNum) => (
                              <span
                                key={rNum}
                                className="px-2 py-0.5 rounded-md bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] font-mono text-[10px] font-bold"
                              >
                                #{rNum}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    {/* Compact Amenity Pills */}
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {room.amenities.slice(0, 4).map((item, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1"
                        >
                          <Check size={10} className="text-[#d4af37] flex-shrink-0" />
                          <span className="truncate max-w-[130px]">{item}</span>
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons: View Details & Photos + Reserve Room */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRoomDetails(room)}
                        className="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[#f3e5ab] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="View high-res photos and full room details"
                      >
                        <Eye size={14} className="text-[#d4af37]" />
                        <span>Photos &amp; Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenBooking(room.id)}
                        className={`flex-1 py-3 px-4 rounded-xl ${goldGradient} font-extrabold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer`}
                      >
                        <span>Reserve Room</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          3. OFFICIAL DUAL-BUILDING RATE BOARD DIRECTORY
         ======================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#d4af37] block">
            COMPLETE 34-ROOM DIRECTORY BY BUILDING
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
            Official Hotel Rate Boards
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Side-by-side breakdown of all 34 rooms across our Main Building and Extension Building.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {HOTEL_BUILDINGS.map((bldg) => (
            <div
              key={bldg.id}
              className="rounded-3xl bg-gradient-to-br from-[#1c040e] via-[#16030c] to-[#120208] border border-[#d4af37]/40 p-5 sm:p-7 shadow-2xl space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Board Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#d4af37]/25">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5c0725] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] flex-shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-cinzel font-bold text-base sm:text-lg text-white uppercase tracking-wide">
                        {bldg.name}
                      </h3>
                      <span className="text-xs text-[#f3e5ab] font-mono">
                        {bldg.wing} • {bldg.roomRange}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] text-xs font-mono font-bold">
                    {bldg.totalRooms} Rooms Total
                  </span>
                </div>

                {/* Category Rows */}
                <div className="space-y-3">
                  {bldg.categories.map((cat) => (
                    <div
                      key={cat.name}
                      onClick={() => onOpenBooking(cat.type)}
                      className="p-3.5 rounded-2xl bg-black/45 hover:bg-black/70 border border-white/10 hover:border-[#d4af37]/50 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel font-bold text-sm text-white uppercase">
                            {cat.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                            {cat.count} {cat.count === 1 ? 'Room' : 'Rooms'}
                          </span>
                        </div>
                        <span className="font-mono font-extrabold text-sm sm:text-base text-[#d4af37]">
                          {cat.priceFormatted}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono text-gray-400 mr-1">Rooms:</span>
                        {cat.rooms.map((rNum) => (
                          <span
                            key={rNum}
                            className="px-2 py-0.5 rounded bg-[#5c0725]/50 border border-[#d4af37]/30 text-[#f3e5ab] font-mono text-[10px] font-semibold"
                          >
                            #{rNum}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                <span>All rates are per night in Naira (₦)</span>
                <button
                  type="button"
                  onClick={() => {
                    handleBuildingChange(bldg.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#d4af37] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Filter {bldg.name}</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          4. INCLUDED VIP PERKS BANNER
         ======================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#20030e] to-[#120208] border border-[#d4af37]/35 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-1.5">
            <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#f3e5ab]">Complimentary Breakfast</h4>
            <p className="text-xs text-gray-300">Daily morning gourmet continental and traditional breakfast included with all rooms.</p>
          </div>
          <div className="space-y-1.5 border-y md:border-y-0 md:border-x border-white/10 py-4 md:py-0 md:px-4">
            <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#f3e5ab]">High-Speed Optical Wi-Fi</h4>
            <p className="text-xs text-gray-300">Dedicated high-speed fiber internet for uninterrupted remote work and business streaming.</p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#f3e5ab]">24/7 Floor Butler Care</h4>
            <p className="text-xs text-gray-300">Immediate room service, garment pressing, luggage assistance, and front desk coordination.</p>
          </div>
        </div>
      </section>

      {/* Interactive Room Details & Multi-Angle Photo Modal */}
      {selectedRoomDetails && (
        <RoomDetailsModal
          room={selectedRoomDetails}
          onClose={() => setSelectedRoomDetails(null)}
          onOpenBooking={onOpenBooking}
          initialBuilding={selectedBuilding}
        />
      )}

    </div>
  );
}
