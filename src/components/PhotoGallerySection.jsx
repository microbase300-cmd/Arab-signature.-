import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GALLERY_PHOTOS, GALLERY_CATEGORIES } from '../data/galleryData';
import {
  Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Play, Pause,
  ZoomIn, ZoomOut, Download, Camera, Film, Eye, Grid, Rows, Crown, ArrowRight
} from 'lucide-react';

export default function PhotoGallerySection({
  isFullPage = false,
  onNavigate,
  onOpenBooking,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visualGrade, setVisualGrade] = useState('hdr'); // Default to Vivid HDR per client preference ('hdr' | 'uhd' | 'natural')
  const [mobileColumns, setMobileColumns] = useState(1); // 1 = Full Cinema Card on mobile, 2 = 2-Col Grid on mobile
  const [heroIndex, setHeroIndex] = useState(0);
  const [isReelPlaying, setIsReelPlaying] = useState(true);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxSlideshow, setIsLightboxSlideshow] = useState(false);
  const touchStartX = useRef(null);

  const featuredPhotos = GALLERY_PHOTOS.filter((p) => p.featured);

  const filteredPhotos =
    activeCategory === 'all'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === activeCategory);

  const displayedPhotos = isFullPage ? filteredPhotos : filteredPhotos.slice(0, 8);

  // Auto-advance top Cinematic Hero Reel
  useEffect(() => {
    if (!isReelPlaying) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % featuredPhotos.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isReelPlaying, featuredPhotos.length]);

  // Lightbox navigation handlers
  const handleNextLightbox = useCallback(() => {
    setIsZoomed(false);
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % filteredPhotos.length
    );
  }, [filteredPhotos.length]);

  const handlePrevLightbox = useCallback(() => {
    setIsZoomed(false);
    setLightboxIndex((prev) =>
      prev === null
        ? null
        : (prev - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  }, [filteredPhotos.length]);

  // Lightbox auto-slideshow
  useEffect(() => {
    if (lightboxIndex === null || !isLightboxSlideshow) return;
    const timer = setInterval(() => {
      handleNextLightbox();
    }, 4000);
    return () => clearInterval(timer);
  }, [lightboxIndex, isLightboxSlideshow, handleNextLightbox]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
        setIsZoomed(false);
        setIsLightboxSlideshow(false);
      } else if (e.key === 'ArrowRight') {
        handleNextLightbox();
      } else if (e.key === 'ArrowLeft') {
        handlePrevLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNextLightbox, handlePrevLightbox]);

  // Touch swipe handlers for Mobile Lightbox
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) handleNextLightbox();
      else handlePrevLightbox();
    }
    touchStartX.current = null;
  };

  // Visual Grade CSS Filter & Texture Classes (Balanced for Photorealistic Clarity)
  const getPhotoFilterStyle = () => {
    if (visualGrade === 'hdr') {
      return {
        filter: 'url(#arab-uhd-clarity) contrast(1.04) saturate(1.07) brightness(1.01)',
        imageRendering: 'auto',
      };
    }
    if (visualGrade === 'uhd') {
      return {
        filter: 'url(#arab-uhd-clarity) contrast(1.02) saturate(1.03) brightness(1.01)',
        imageRendering: 'auto',
      };
    }
    return {
      filter: 'contrast(1.0) saturate(1.0) brightness(1.0)',
      imageRendering: 'auto',
    };
  };

  const currentHeroPhoto = featuredPhotos[heroIndex] || GALLERY_PHOTOS[0];
  const activeLightboxPhoto =
    lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden bg-[#120208]">
      {/* Hidden SVG Hardware-Accelerated Natural Unsharp Mask & Clarity Filter */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="arab-uhd-clarity" colorInterpolationFilters="sRGB">
            {/* Clean, Halo-Free Micro-Contrast & Edge Sharpness Convolution Matrix */}
            <feConvolveMatrix
              order="3 3"
              preserveAlpha="true"
              kernelMatrix="0 -0.07 0 -0.07 1.28 -0.07 0 -0.07 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Subtle Ambient Gold & Burgundy Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5c0725]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14 relative z-10">
        
        {/* 1. GALLERY HEADER & ULTRA-HD TEXTURE ENGINE CONTROLS */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#380214] via-[#5c0725] to-[#380214] border border-[#d4af37]/50 text-[#f3e5ab] text-[11px] font-mono uppercase tracking-widest shadow-lg">
              <Camera size={13} className="text-[#d4af37]" />
              <span>Vivid HDR 4K Visual Archive • 34 Luxury Suites • Nsugbe</span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-white leading-tight">
              The Signature <span className="gold-text-gradient">Cinema Gallery</span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
              Explore our <strong className="text-white">34 luxury rooms & diplomatic suites</strong>, palatial architecture, VIP Don Julio 1942 bottle service, multi-channel Silent Disco sessions, and live DJ nights in hyper-realistic <strong className="text-[#f3e5ab]">Vivid HDR</strong> clarity.
            </p>
          </div>

          {/* Interactive HD Texture & Clarity Switcher */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="p-1.5 rounded-2xl bg-[#1c040e] border border-[#d4af37]/30 flex items-center gap-1 shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 px-2.5 hidden sm:inline flex items-center gap-1">
                <Film size={11} className="inline text-[#d4af37] mr-1" />
                Optical Grade:
              </span>
              {[
                { id: 'hdr', label: 'Vivid HDR' },
                { id: 'uhd', label: '4K Cinema UHD' },
                { id: 'natural', label: 'Studio Natural' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setVisualGrade(mode.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    visualGrade === mode.id
                      ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. FEATURED CINEMATIC WIDESCREEN REEL (AUTO-PLAYING 4K SHOWCASE) */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#d4af37]/40 bg-black shadow-[0_20px_70px_rgba(0,0,0,0.85)] group">
          <div className="relative h-[320px] sm:h-[440px] md:h-[540px] w-full overflow-hidden bg-[#0a0104]">
            <img
              key={currentHeroPhoto.id}
              src={currentHeroPhoto.src}
              alt={currentHeroPhoto.title}
              style={getPhotoFilterStyle()}
              className={`w-full h-full object-cover ${currentHeroPhoto.objectPosition || 'object-center'} transition-all duration-1000 scale-[1.02] group-hover:scale-105`}
            />

            {/* Fine Cinema Film Texture & Vignette */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.14] mix-blend-overlay"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(255,255,255,0.25) 1px, transparent 0)',
                backgroundSize: '3px 3px',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090105] via-black/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090105]/80 via-transparent to-[#090105]/40" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] sm:text-xs font-mono font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>FEATURED REEL • {currentHeroPhoto.qualityTag}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsReelPlaying(!isReelPlaying)}
                  className="p-2.5 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 backdrop-blur-md transition-all"
                  title={isReelPlaying ? 'Pause Reel' : 'Play Reel'}
                >
                  {isReelPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  onClick={() => {
                    const idx = filteredPhotos.findIndex(
                      (p) => p.id === currentHeroPhoto.id
                    );
                    setLightboxIndex(idx >= 0 ? idx : 0);
                  }}
                  className="px-3.5 py-2 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 backdrop-blur-md text-[11px] font-bold flex items-center gap-1.5 transition-all"
                >
                  <Maximize2 size={13} />
                  <span className="hidden sm:inline">Full 4K Screen</span>
                </button>
              </div>
            </div>

            {/* Bottom Caption & Filmstrip Scrubber */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
              <div className="space-y-1.5 max-w-xl">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#d4af37] font-bold block">
                  {currentHeroPhoto.categoryLabel}
                </span>
                <h3 className="font-cinzel text-xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
                  {currentHeroPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-200">
                  {currentHeroPhoto.subtitle}
                </p>
              </div>

              {/* Thumbnail Reel Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                {featuredPhotos.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setHeroIndex(idx)}
                    className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      heroIndex === idx
                        ? 'border-[#d4af37] scale-105 shadow-[0_0_15px_rgba(212,175,55,0.6)]'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. CATEGORY FILTER BAR & MOBILE LAYOUT SWITCHER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Scrollable Category Pills on Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setLightboxIndex(null);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black border-[#d4af37] shadow-lg shadow-[#d4af37]/20'
                      : 'bg-[#1c040e]/90 text-gray-300 border-white/10 hover:border-[#d4af37]/40 hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      isActive
                        ? 'bg-black/20 text-black font-extrabold'
                        : 'bg-white/10 text-[#d4af37]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile View Toggle (1-Col Cinema vs 2-Col Grid) + Photo Count */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs font-mono text-gray-400">
              Showing <strong className="text-[#d4af37]">{displayedPhotos.length}</strong> of{' '}
              {filteredPhotos.length} Ultra-HD Photos
            </span>

            {/* Mobile-only layout toggle */}
            <div className="flex sm:hidden items-center bg-[#1c040e] p-1 rounded-xl border border-white/15">
              <button
                onClick={() => setMobileColumns(1)}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                  mobileColumns === 1
                    ? 'bg-[#d4af37] text-black font-bold'
                    : 'text-gray-400'
                }`}
                title="Full Cinema View"
              >
                <Rows size={14} />
              </button>
              <button
                onClick={() => setMobileColumns(2)}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                  mobileColumns === 2
                    ? 'bg-[#d4af37] text-black font-bold'
                    : 'text-gray-400'
                }`}
                title="2-Column Grid"
              >
                <Grid size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 4. RESPONSIVE ULTRA-HD CINEMATIC PHOTO GRID */}
        <div
          className={`grid ${
            mobileColumns === 2 ? 'grid-cols-2' : 'grid-cols-1'
          } sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6`}
        >
          {displayedPhotos.map((photo, index) => {
            // Make the very first landscape card span 2 columns on desktop for a dynamic Bento feel
            const isWideCard =
              index === 0 && photo.orientation === 'landscape' && mobileColumns === 1;

            return (
              <div
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#d4af37]/30 hover:border-[#d4af37] bg-[#16030b] shadow-2xl cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(212,175,55,0.2)] flex flex-col justify-between ${
                  isWideCard ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Photo Container with Portrait/Landscape Smart Aspect Ratio */}
                <div
                  className={`relative w-full overflow-hidden bg-[#0a0104] ${
                    mobileColumns === 2
                      ? 'h-48 sm:h-72'
                      : photo.orientation === 'portrait'
                      ? 'h-[380px] sm:h-80'
                      : 'h-[260px] sm:h-80'
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    style={getPhotoFilterStyle()}
                    className={`w-full h-full object-cover ${
                      photo.objectPosition || 'object-top'
                    } group-hover:scale-110 transition-transform duration-700 ease-out`}
                  />

                  {/* Subtle Film Grain & Rich Cinema Vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay"
                    style={{
                      backgroundImage:
                        'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 0)',
                      backgroundSize: '3px 3px',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0105] via-black/15 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

                  {/* Top Quality Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-[#d4af37]/40 text-[#f3e5ab] text-[9px] sm:text-[10px] font-mono font-semibold tracking-wider">
                      {photo.qualityTag}
                    </span>

                    <span className="w-8 h-8 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-[#d4af37] flex items-center justify-center opacity-90 group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                      <Maximize2 size={13} />
                    </span>
                  </div>

                  {/* Bottom Caption Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-5 space-y-1">
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#d4af37] font-bold block">
                      {photo.categoryLabel}
                    </span>
                    <h3
                      className={`font-cinzel font-bold text-white group-hover:text-[#f3e5ab] transition-colors leading-snug ${
                        mobileColumns === 2
                          ? 'text-xs sm:text-base line-clamp-1'
                          : 'text-base sm:text-lg'
                      }`}
                    >
                      {photo.title}
                    </h3>
                    {mobileColumns === 1 && (
                      <p className="text-[11px] sm:text-xs text-gray-300 line-clamp-1">
                        {photo.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. CTA BAR: VIEW FULL GALLERY (ON HOMEPAGE) OR BOOK VIP EXPERIENCE */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#24020d] via-[#42051b] to-[#24020d] border border-[#d4af37]/40 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#d4af37]">
              <Sparkles size={13} />
              <span>Experience It Live in Nsugbe, Onitsha</span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-extrabold text-white">
              {isFullPage
                ? 'Ready to Experience Arab Signature Nightlife & Suites?'
                : 'Explore Ultra-HD Moments in Our Cinema Archive'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Reserve your luxury Arab Suite or VIP Lounge table with instant confirmation.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {!isFullPage && onNavigate && (
              <button
                onClick={() => onNavigate('gallery')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Eye size={15} />
                <span>Open Full Photo HD Gallery</span>
                <ArrowRight size={15} />
              </button>
            )}

            {onOpenBooking && (
              <button
                onClick={() => onOpenBooking('deluxe')}
                className={`px-6 py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                  isFullPage
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-xl hover:scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <Crown size={15} className={isFullPage ? 'text-black' : 'text-[#d4af37]'} />
                <span>Book A Luxury Suite</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 6. FULL-SCREEN 4K ULTRA-HD LIGHTBOX THEATER MODAL */}
      {activeLightboxPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6 select-none animate-fadeIn"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Lightbox Controls */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 z-20">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#5c0725] border border-[#d4af37]/50 text-[#f3e5ab] text-xs font-mono font-bold">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
              <span className="hidden md:inline-block text-xs font-mono text-[#d4af37]">
                {activeLightboxPhoto.qualityTag}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLightboxSlideshow(!isLightboxSlideshow)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isLightboxSlideshow
                    ? 'bg-[#d4af37] text-black border-[#d4af37]'
                    : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
                }`}
              >
                {isLightboxSlideshow ? <Pause size={14} /> : <Play size={14} />}
                <span className="hidden sm:inline">
                  {isLightboxSlideshow ? 'Pause Slideshow' : 'Auto Play'}
                </span>
              </button>

              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
                title={isZoomed ? 'Zoom Out' : 'Zoom In 4K'}
              >
                {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
              </button>

              <a
                href={activeLightboxPhoto.src}
                download={`Arab-Signature-${activeLightboxPhoto.id}.jpg`}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
                title="Download Original HD Photo"
              >
                <Download size={16} />
              </a>

              <button
                onClick={() => {
                  setLightboxIndex(null);
                  setIsZoomed(false);
                  setIsLightboxSlideshow(false);
                }}
                className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-all ml-1"
                aria-label="Close Lightbox"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Center Image Stage with Prev/Next Arrows */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-2">
            <button
              onClick={handlePrevLightbox}
              className="absolute left-2 sm:left-6 z-20 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 transition-all shadow-2xl"
              aria-label="Previous Photo"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="max-w-6xl max-h-[72vh] w-full h-full flex items-center justify-center overflow-hidden">
              <img
                src={activeLightboxPhoto.src}
                alt={activeLightboxPhoto.title}
                onClick={() => setIsZoomed(!isZoomed)}
                style={getPhotoFilterStyle()}
                className={`max-h-[70vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-[#d4af37]/30 transition-transform duration-500 cursor-zoom-in ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
                }`}
              />
            </div>

            <button
              onClick={handleNextLightbox}
              className="absolute right-2 sm:right-6 z-20 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black border border-white/20 transition-all shadow-2xl"
              aria-label="Next Photo"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Bottom Caption & Filmstrip Scrubber */}
          <div className="space-y-3 border-t border-white/10 pt-3 z-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] block">
                  {activeLightboxPhoto.categoryLabel}
                </span>
                <h4 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                  {activeLightboxPhoto.title}
                </h4>
                <p className="text-xs text-gray-400">{activeLightboxPhoto.subtitle}</p>
              </div>
              <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">
                Swipe left/right or use ← → arrow keys
              </span>
            </div>

            {/* Interactive Thumbnail Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 px-2">
              {filteredPhotos.map((thumb, idx) => (
                <button
                  key={thumb.id}
                  onClick={() => {
                    setIsZoomed(false);
                    setLightboxIndex(idx);
                  }}
                  className={`relative h-12 w-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    lightboxIndex === idx
                      ? 'border-[#d4af37] scale-105 opacity-100'
                      : 'border-transparent opacity-45 hover:opacity-90'
                  }`}
                >
                  <img
                    src={thumb.src}
                    alt={thumb.title}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
