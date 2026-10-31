import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw, Compass, ChevronLeft, ChevronRight, Play, Pause,
  Maximize2, X, Sparkles, Waves, MapPin, Eye
} from 'lucide-react';

const POOL_ANGLES = [
  {
    id: 1,
    angle: '0° North Deck',
    title: 'VIP Pool Deck & Daybed Cabanas',
    desc: 'Clear illuminated waters, luxury sun loungers, and tropical palm landscaping.',
    src: '/pool/pool-view-1.webp',
    fallback: '/pool/pool-view-1.jpg'
  },
  {
    id: 2,
    angle: '72° East Cabanas',
    title: 'Poolside Waterline & VIP Daybeds',
    desc: 'Up-close waterline panorama showcasing pristine water clarity and shaded cabana seating.',
    src: '/pool/pool-view-2.webp',
    fallback: '/pool/pool-view-2.jpg'
  },
  {
    id: 3,
    angle: '144° South Horizon',
    title: 'Panoramic Pool Deck & Skyview',
    desc: 'Expansive open-air view across the full swimming basin with sun loungers under the sky.',
    src: '/pool/pool-view-3.webp',
    fallback: '/pool/pool-view-3.jpg'
  },
  {
    id: 4,
    angle: '216° West Palm Terrace',
    title: 'Palm Oasis & Outdoor Cocktail Bar',
    desc: 'Surrounded by lush palms with direct service from the Al-Sultan poolside beverage bar.',
    src: '/pool/pool-view-4.webp',
    fallback: '/pool/pool-view-4.jpg'
  },
  {
    id: 5,
    angle: '288° Courtyard Angle',
    title: 'Al-Sultan Courtyard & Pool Entrance',
    desc: 'Architectural Arabian masonry leading from the VIP suites to the poolside courtyard.',
    src: '/pool/pool-view-5.webp',
    fallback: '/pool/pool-view-5.jpg'
  }
];

export default function Pool360Viewer({ className = '', onOpenBooking }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const containerRef = useRef(null);

  // Auto-spin 360 timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % POOL_ANGLES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Touch & Mouse Drag to Rotate in 360°
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX || (e.touches && e.touches[0].clientX) || 0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diff = currentX - dragStartX;

    // Rotate step threshold (e.g. 45px per step)
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // Drag right -> rotate counter-clockwise
        setCurrentIdx((prev) => (prev === 0 ? POOL_ANGLES.length - 1 : prev - 1));
      } else {
        // Drag left -> rotate clockwise
        setCurrentIdx((prev) => (prev + 1) % POOL_ANGLES.length);
      }
      setDragStartX(currentX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setIsPlaying(false);
    setCurrentIdx((prev) => (prev === 0 ? POOL_ANGLES.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setIsPlaying(false);
    setCurrentIdx((prev) => (prev + 1) % POOL_ANGLES.length);
  };

  const currentView = POOL_ANGLES[currentIdx];

  return (
    <div className={`relative rounded-3xl overflow-hidden border-2 border-[#d4af37]/50 bg-black shadow-2xl ${className}`}>
      {/* 360 Stage Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className="relative h-80 sm:h-[450px] w-full select-none cursor-grab active:cursor-grabbing overflow-hidden group"
      >
        <img
          key={currentView.src}
          src={currentView.src}
          alt={`Arab Signature Pool - ${currentView.title}`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = currentView.fallback;
          }}
          className="w-full h-full object-cover transition-opacity duration-500 animate-fadeIn"
          draggable="false"
        />

        {/* Gradient Shadow Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

        {/* Top Badges & 360 Compass Indicator */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 flex-wrap pointer-events-none">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#d4af37]/60 text-[#f3e5ab] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
              <Compass size={14} className="text-[#d4af37] animate-spin" style={{ animationDuration: '10s' }} />
              <span>360° Virtual Tour &bull; Drag to Spin</span>
            </span>

            <span className="px-3 py-1.5 rounded-full bg-emerald-950/90 backdrop-blur-md border border-emerald-400/60 text-emerald-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
              <Waves size={13} className="text-emerald-400" />
              <span>Lodge Guests: Free &bull; Visitors: ₦3,000</span>
            </span>

            <span className="px-2.5 py-1 rounded-full bg-[#5c0725]/85 backdrop-blur-md border border-[#d4af37]/40 text-[#f3e5ab] text-[10px] font-mono font-bold uppercase">
              {currentView.angle}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-[#f3e5ab] border border-white/20 text-xs font-mono flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              {isPlaying ? <Pause size={13} className="text-amber-400" /> : <Play size={13} className="text-emerald-400" />}
              <span>{isPlaying ? 'Pause' : 'Auto 360° Spin'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 transition-all cursor-pointer"
              title="Fullscreen view"
            >
              <Maximize2 size={14} className="text-[#d4af37]" />
            </button>
          </div>
        </div>

        {/* Left & Right Step Buttons */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 shadow-xl transition-all cursor-pointer opacity-85 hover:opacity-100 hover:scale-105"
          title="Previous angle"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 shadow-xl transition-all cursor-pointer opacity-85 hover:opacity-100 hover:scale-105"
          title="Next angle"
        >
          <ChevronRight size={22} />
        </button>

        {/* Bottom Angle Overlay Banner */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2 pointer-events-none">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1 max-w-lg">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold block">
                Arab Signature VIP Poolside &bull; Vantage {currentIdx + 1} of {POOL_ANGLES.length}
              </span>
              <h4 className="font-cinzel text-lg sm:text-2xl font-extrabold text-white">
                {currentView.title}
              </h4>
              <p className="text-xs text-gray-200 line-clamp-1 sm:line-clamp-2">
                {currentView.desc}
              </p>
            </div>

            {onOpenBooking && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenBooking('suites');
                }}
                className="pointer-events-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black text-xs font-extrabold uppercase tracking-wider shrink-0 shadow-lg hover:scale-105 transition-all cursor-pointer hidden sm:block"
              >
                Book Poolside Suite
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 360 Angle Selector Bar */}
      <div className="p-3 sm:p-4 bg-[#14020a] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {POOL_ANGLES.map((vantage, idx) => (
            <button
              key={vantage.id}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setCurrentIdx(idx);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                currentIdx === idx
                  ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/30 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
              }`}
            >
              <span>{vantage.angle}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono text-gray-400">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1.5 shadow-sm">
            <Waves size={12} className="text-emerald-400" />
            <span>Lodge Guests: Free &bull; Visitors: ₦3,000</span>
          </span>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <span className="flex items-center gap-1 text-[#f3e5ab]">
            <RotateCcw size={13} className="text-[#d4af37]" />
            <span>Drag to Spin 360°</span>
          </span>
        </div>
      </div>

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[10000] bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <span className="text-xs font-mono text-white bg-black/60 px-3 py-1 rounded-full border border-white/20">
              {currentView.angle} &bull; {currentIdx + 1} of {POOL_ANGLES.length}
            </span>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
            >
              <X size={22} />
            </button>
          </div>

          <div
            className="relative max-w-6xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentView.src}
              alt={currentView.title}
              className="w-full h-full max-h-[85vh] object-contain rounded-2xl"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-lg font-bold">{currentView.title}</h3>
                <p className="text-xs text-gray-300">{currentView.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
