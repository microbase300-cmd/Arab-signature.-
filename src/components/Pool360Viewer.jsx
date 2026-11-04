import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw, Compass, ChevronLeft, ChevronRight, Play, Pause,
  Maximize2, X, Waves
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

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        setCurrentIdx((prev) => (prev === 0 ? POOL_ANGLES.length - 1 : prev - 1));
      } else {
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
    <div className={`relative rounded-3xl overflow-hidden border border-[#d4af37]/50 bg-[#14020a] shadow-2xl ${className}`}>
      {/* 1. UNOBSTRUCTED 360° POOL IMAGE VIEWPORT (No text blocking the pool on mobile) */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className="relative h-72 sm:h-[440px] w-full select-none cursor-grab active:cursor-grabbing overflow-hidden group bg-black"
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

        {/* Subtle bottom edge vignette only on desktop */}
        <div className="hidden sm:block absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        {/* Minimal Corner Controls (Does not block the pool view) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
            <Compass size={12} className="text-[#d4af37] animate-spin" style={{ animationDuration: '10s' }} />
            <span>360° View &bull; {currentIdx + 1}/{POOL_ANGLES.length}</span>
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2.5 py-1 rounded-full bg-black/65 hover:bg-black text-[#f3e5ab] border border-white/20 text-[10px] sm:text-xs font-mono flex items-center gap-1 transition-all shadow-md cursor-pointer"
            >
              {isPlaying ? <Pause size={11} className="text-amber-400" /> : <Play size={11} className="text-emerald-400" />}
              <span>{isPlaying ? 'Pause' : 'Auto Spin'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 sm:p-2 rounded-full bg-black/65 hover:bg-black text-white border border-white/20 transition-all cursor-pointer"
              title="Fullscreen view"
            >
              <Maximize2 size={13} className="text-[#d4af37]" />
            </button>
          </div>
        </div>

        {/* Left & Right Step Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 shadow-xl transition-all cursor-pointer opacity-85 hover:opacity-100"
          title="Previous angle"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 shadow-xl transition-all cursor-pointer opacity-85 hover:opacity-100"
          title="Next angle"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 2. DEDICATED CAPTION, PRICING & ANGLE BAR BELOW THE IMAGE (Never blocks the pool photo) */}
      <div className="p-4 sm:p-5 bg-[#14020a] border-t border-[#d4af37]/30 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold">
                {currentView.angle}
              </span>
              <span className="text-gray-600">&bull;</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold inline-flex items-center gap-1">
                <Waves size={11} className="text-emerald-400" />
                <span>Lodge Guests: FREE &bull; Visitors: ₦3,000/hr</span>
              </span>
            </div>
            <h4 className="font-cinzel text-base sm:text-xl font-bold text-white">
              {currentView.title}
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              {currentView.desc}
            </p>
          </div>

          {onOpenBooking && (
            <button
              type="button"
              onClick={() => onOpenBooking('suites')}
              className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black text-xs font-extrabold uppercase tracking-wider shrink-0 shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              Book Poolside Suite
            </button>
          )}
        </div>

        {/* 360 Angle Selector Pills */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {POOL_ANGLES.map((vantage, idx) => (
              <button
                key={vantage.id}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentIdx(idx);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  currentIdx === idx
                    ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                <span>{vantage.angle}</span>
              </button>
            ))}
          </div>

          <span className="hidden md:flex items-center gap-1 text-[11px] font-mono text-[#f3e5ab] shrink-0">
            <RotateCcw size={12} className="text-[#d4af37]" />
            <span>Swipe or Drag Photo to Spin</span>
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
            <div className="mt-3 bg-black/85 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white flex items-center justify-between gap-3">
              <div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold">{currentView.title}</h3>
                <p className="text-xs text-gray-300">{currentView.desc}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
