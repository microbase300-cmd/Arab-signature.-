import React, { useState } from 'react';
import { SAMPLE_NAMES } from '../data/hotelData';
import { Smartphone, Monitor, Image as ImageIcon, Sparkles, X, ChevronDown, Check } from 'lucide-react';

export default function ShowcaseToolbar({ 
  currentSampleId, 
  onSelectSample, 
  viewMode, 
  onToggleViewMode,
  onOpenBooking 
}) {
  const [showRefModal, setShowRefModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const activeSample = SAMPLE_NAMES.find(s => s.id === currentSampleId) || SAMPLE_NAMES[0];

  return (
    <>
      {/* Top Fixed Control Bar */}
      <header className="sticky top-0 z-40 bg-[#121118]/95 backdrop-blur-xl border-b border-white/10 px-4 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Current Selection */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#5c0725] flex items-center justify-center font-cinzel font-bold text-white text-xs shadow-md">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-bold text-xs sm:text-sm text-[#f3e5ab]">
                  ARAB SIGNATURE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                  10 Designs
                </span>
              </div>
              <p className="text-[10px] text-gray-400 hidden sm:block">
                Select any of the 10 landing page concepts below to preview
              </p>
            </div>
          </div>

          {/* Quick Dropdown on Mobile / Compact */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-white flex items-center gap-2"
            >
              <span>{activeSample.badge}: {activeSample.name}</span>
              <ChevronDown size={14} />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#1a1824] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto space-y-1">
                {SAMPLE_NAMES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSample(s.id);
                      setShowDropdown(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                      currentSampleId === s.id ? 'bg-[#5c0725] text-white font-bold' : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{s.badge}: {s.name}</span>
                    {currentSampleId === s.id && <Check size={14} className="text-[#d4af37]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* View Mode Switcher: Mobile vs Desktop */}
            <div className="flex rounded-xl bg-white/10 p-1 border border-white/10">
              <button
                onClick={() => onToggleViewMode('mobile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-[#d4af37] text-black font-bold shadow'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="View inside iPhone 16 Pro Chassis"
              >
                <Smartphone size={14} /> <span className="hidden md:inline">Mobile Frame</span>
              </button>
              <button
                onClick={() => onToggleViewMode('desktop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-[#d4af37] text-black font-bold shadow'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="View Full Responsive Width"
              >
                <Monitor size={14} /> <span className="hidden md:inline">Fullscreen Web</span>
              </button>
            </div>

            {/* Reference Sheet Modal Trigger */}
            <button
              onClick={() => setShowRefModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-gray-200 border border-white/10 flex items-center gap-1.5"
              title="View the original 10-design reference mockup sheet"
            >
              <ImageIcon size={14} className="text-[#d4af37]" />
              <span className="hidden sm:inline">Reference Sheet</span>
            </button>

            {/* Direct Test Booking Flow */}
            <button
              onClick={() => onOpenBooking('deluxe')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-bold text-xs flex items-center gap-1.5 hover:opacity-95 shadow-md shadow-[#d4af37]/20"
            >
              <Sparkles size={14} />
              <span>Test Booking</span>
            </button>

          </div>

        </div>

        {/* Desktop Quick Horizontal Tabs (1 to 10) */}
        <div className="hidden sm:flex max-w-7xl mx-auto mt-2 pt-2 border-t border-white/5 overflow-x-auto gap-1.5 pb-1">
          {SAMPLE_NAMES.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSample(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentSampleId === s.id
                  ? 'bg-gradient-to-r from-[#5c0725] to-[#420317] border border-[#d4af37]/60 text-white font-bold shadow-md'
                  : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentSampleId === s.id ? 'bg-[#d4af37]' : 'bg-gray-600'}`} />
              <span className="font-semibold">{s.id}. {s.name}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Reference Mockup Modal */}
      {showRefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-[#14121a] border border-[#d4af37]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#250210]">
              <div className="flex items-center gap-2">
                <ImageIcon size={20} className="text-[#d4af37]" />
                <h3 className="font-cinzel text-base font-bold text-[#f3e5ab]">
                  Original 10 Landing Page Designs (Client Reference Sheet)
                </h3>
              </div>
              <button
                onClick={() => setShowRefModal(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-black/60">
              <img
                src="/sample_concepts_10.png"
                alt="10 Landing Page Samples"
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-white/10"
              />
              <p className="text-xs text-gray-400 mt-3 text-center">
                All 10 samples have been faithfully implemented in interactive React code. Click any sample in the top bar to inspect!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
