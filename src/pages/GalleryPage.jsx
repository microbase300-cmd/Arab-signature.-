import React from 'react';
import PhotoGallerySection from '../components/PhotoGallerySection';
import { Camera, Sparkles, ShieldCheck, Crown, Film } from 'lucide-react';

export default function GalleryPage({ onNavigate, onOpenBooking }) {
  return (
    <div className="bg-[#120208] text-gray-100 min-h-screen">
      {/* Top Cinema Banner */}
      <section className="relative py-16 sm:py-20 px-6 overflow-hidden border-b border-[#d4af37]/25">
        <div className="absolute inset-0 z-0">
          <img
            src="/gallery/IMG-20261018-WA0081.jpg"
            alt="Arab Signature Hotel & Suites VIP Nightlife Gallery"
            className="w-full h-full object-cover object-center scale-105 brightness-75 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#120208]/90 via-[#2a0210]/85 to-[#120208]" />
          <div className="absolute inset-0 arabesque-pattern opacity-15 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#380214]/90 border border-[#d4af37]/60 text-[#f3e5ab] text-xs font-mono uppercase tracking-widest shadow-xl">
            <Film size={14} className="text-[#d4af37]" />
            <span>Official Visual Showcase • 4K Ultra-HD Cinema</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wide text-white leading-tight">
            Moments of <span className="gold-text-gradient">Royal Euphoria</span>
          </h1>

          <p className="text-xs sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore our official high-definition photography capturing the vibrant Silent Disco nights, executive Don Julio 1942 bottle service, live DJ sets, outdoor starlight lounge, and grand palatial architecture in Nsugbe, Onitsha.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] font-mono text-[#f3e5ab]">
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Camera size={13} className="text-[#d4af37]" /> 26 Curated DSLR Captures
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#d4af37]" /> Optical 4K Clarity Engine
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" /> Verified Arab Signature Experience
            </span>
          </div>
        </div>
      </section>

      {/* Full Interactive 26-Photo Ultra-HD Gallery */}
      <PhotoGallerySection
        isFullPage={true}
        onNavigate={onNavigate}
        onOpenBooking={onOpenBooking}
      />
    </div>
  );
}
