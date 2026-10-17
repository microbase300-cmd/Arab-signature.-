import React, { useState } from 'react';
import { SAMPLE_NAMES } from '../data/hotelData';
import { ArrowLeft, ChevronLeft, ChevronRight, Smartphone, Monitor, Sparkles, Home } from 'lucide-react';

export default function StandaloneLandingView({
  sampleId,
  onBackToGallery,
  onNavigateSample,
  renderSampleComponent,
  onOpenBooking
}) {
  const [viewMode, setViewMode] = useState('desktop'); // default to desktop full page, with 1-click mobile toggle

  const sample = SAMPLE_NAMES.find(s => s.id === sampleId) || SAMPLE_NAMES[0];
  const currentIndex = SAMPLE_NAMES.findIndex(s => s.id === sampleId);
  const prevSampleId = SAMPLE_NAMES[(currentIndex - 1 + SAMPLE_NAMES.length) % SAMPLE_NAMES.length].id;
  const nextSampleId = SAMPLE_NAMES[(currentIndex + 1) % SAMPLE_NAMES.length].id;

  return (
    <div className="min-h-screen bg-[#0a090e] text-gray-100 flex flex-col relative font-sans">
      
      {/* Floating Top Control Pill Bar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl bg-[#14121b]/95 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-2.5 transition-all">
        
        {/* Back Button */}
        <button
          onClick={onBackToGallery}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-all hover:scale-102"
        >
          <ArrowLeft size={15} />
          <span>All 10 Designs</span>
        </button>

        {/* Current Concept Badge & Stepper */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateSample(prevSampleId)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
            title="Previous Design"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="text-center px-2">
            <span className="text-[10px] font-mono uppercase text-[#d4af37] block font-bold">
              {sample.badge} of 10
            </span>
            <span className="text-xs sm:text-sm font-cinzel font-bold text-white truncate max-w-[180px] sm:max-w-xs block">
              {sample.name}
            </span>
          </div>

          <button
            onClick={() => onNavigateSample(nextSampleId)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
            title="Next Design"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* View Mode Toggle & Test Booking */}
        <div className="flex items-center gap-2">
          
          {/* Desktop vs Mobile Toggle */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                viewMode === 'desktop'
                  ? 'bg-[#d4af37] text-black font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Full Width Web View"
            >
              <Monitor size={14} />
              <span className="hidden md:inline">Full Desktop</span>
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                viewMode === 'mobile'
                  ? 'bg-[#d4af37] text-black font-bold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="iPhone 16 Pro Chassis View"
            >
              <Smartphone size={14} />
              <span className="hidden md:inline">Mobile Frame</span>
            </button>
          </div>

          {/* Test Booking */}
          <button
            onClick={() => onOpenBooking('deluxe')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-bold text-xs flex items-center gap-1.5 hover:opacity-95 shadow-lg shadow-[#d4af37]/20 transition-all"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Test Booking</span>
          </button>

        </div>

      </nav>

      {/* Main Full-Page Canvas */}
      <main className="flex-1 w-full pt-20 pb-12 flex flex-col items-center justify-center">
        
        {viewMode === 'desktop' ? (
          /* Full Page Web View */
          <div className="w-full flex-1 flex flex-col">
            {renderSampleComponent()}
          </div>
        ) : (
          /* Mobile iPhone Frame View */
          <div className="py-6 px-4 flex justify-center items-center w-full">
            <div className="iphone-frame shadow-2xl transition-all duration-300">
              <div className="dynamic-island" />
              
              {/* Status Bar */}
              <div className="absolute top-3 left-8 text-[11px] font-semibold text-white/90 z-40 select-none">
                9:41
              </div>
              <div className="absolute top-3 right-8 flex items-center gap-1.5 text-white/90 z-40 text-[11px]">
                <span className="text-[10px] font-mono">5G</span>
                <div className="w-5 h-2.5 rounded-sm border border-white/80 p-0.5 flex items-center">
                  <div className="w-full h-full bg-white rounded-2xs" />
                </div>
              </div>

              {/* Scrollable Screen Content */}
              <div className="iphone-screen-content">
                {renderSampleComponent()}
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
