import React, { useState } from 'react';
import Logo from './Logo';
import { SAMPLE_NAMES } from '../data/hotelData';
import { ArrowRight, Sparkles, Image as ImageIcon, ExternalLink, ShieldCheck, Check } from 'lucide-react';

export default function GalleryView({ onSelectDesign, onOpenReferenceModal }) {
  const [filter, setFilter] = useState('all');

  const filterCategories = [
    { id: 'all', label: 'All 10 Designs' },
    { id: 'burgundy', label: 'Royal Burgundy' },
    { id: 'dark', label: 'Dark / Obsidian' },
    { id: 'light', label: 'Ivory & Editorial' },
  ];

  const filteredSamples = SAMPLE_NAMES.filter((sample) => {
    if (filter === 'all') return true;
    if (filter === 'burgundy') return [1, 5, 6, 9].includes(sample.id);
    if (filter === 'dark') return [2, 5, 9].includes(sample.id);
    if (filter === 'light') return [3, 4, 7, 8, 10].includes(sample.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0b0a0f] text-gray-100 flex flex-col font-sans selection:bg-[#d4af37] selection:text-black">
      
      {/* Top Luxury Navigation Header */}
      <header className="px-6 py-5 border-b border-white/10 bg-[#121018]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo variant="gold" size="default" />
          
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenReferenceModal}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-200 border border-white/15 flex items-center gap-2 transition-all shadow-sm"
            >
              <ImageIcon size={15} className="text-[#d4af37]" />
              <span className="hidden sm:inline">View Original Mockup Sheet</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="px-6 pt-12 pb-8 max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5c0725]/40 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-mono tracking-wider shadow-lg">
          <Sparkles size={14} className="text-[#d4af37]" />
          <span>10 DEDICATED LANDING PAGE CONCEPTS</span>
        </div>

        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-white">
          Choose Your Preferred <span className="gold-text-gradient">Landing Page</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Select any design below to open the complete, standalone full-page experience. Each concept is individually crafted with its own color palette, room showcase, and Paystack booking engine.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === cat.id
                  ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 font-bold'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 10-Design Cards Grid */}
      <section className="px-6 py-6 max-w-7xl mx-auto flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSamples.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectDesign(sample.id)}
              className="group relative rounded-3xl overflow-hidden bg-[#14121b] border border-white/10 hover:border-[#d4af37]/60 shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Card Image Container */}
              <div className="relative h-52 overflow-hidden bg-black">
                <img
                  src={sample.image}
                  alt={sample.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14121b] via-[#14121b]/30 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-[#d4af37]/40 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#f3e5ab]">
                  {sample.badge}
                </div>

                {/* Color Dot */}
                <div 
                  className="absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: sample.color }}
                  title={`Signature Color: ${sample.color}`}
                />
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-cinzel text-xl font-bold text-white group-hover:text-[#f3e5ab] transition-colors">
                    {sample.name}
                  </h3>
                  <p className="text-xs text-[#d4af37] font-medium font-sans">
                    {sample.subtitle}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {sample.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sample.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/5 text-gray-300 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Open Full Page Action Button */}
                <div className="pt-3 border-t border-white/10">
                  <button
                    type="button"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#5c0725] to-[#420317] group-hover:from-[#d4af37] group-hover:to-[#aa820a] group-hover:text-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>Open Full Page</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/10 bg-[#0d0c11] text-center text-xs text-gray-500">
        <p className="font-cinzel text-gray-300 mb-1">Arab Signature Hotel & Suites</p>
        Plot 12, Presidential Boulevard, Phase 2, GRA • Verified Paystack Integration
      </footer>

    </div>
  );
}
