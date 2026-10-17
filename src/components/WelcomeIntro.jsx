import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Star } from 'lucide-react';

export default function WelcomeIntro({ onComplete }) {
  const fullText = "The Only Verified Signature in Nsugbe";
  const words = fullText.split(' ');

  // Stages: 'typing' -> 'shimmer' -> 'fading' -> 'done'
  const [stage, setStage] = useState('typing');
  const [typedChars, setTypedChars] = useState(0);
  const [shimmerActive, setShimmerActive] = useState(false);
  const [fadedWordIndices, setFadedWordIndices] = useState(new Set());
  const [isExiting, setIsExiting] = useState(false);

  // 1. TYPEWRITER ANIMATION (Smooth writing character by character)
  useEffect(() => {
    if (stage === 'typing') {
      if (typedChars < fullText.length) {
        const timeout = setTimeout(() => {
          setTypedChars((prev) => prev + 1);
        }, 42); // 42ms per character for an organic, elegant writing speed
        return () => clearTimeout(timeout);
      } else {
        // Typing finished -> Move to Shimmer & Hold stage
        const holdTimer = setTimeout(() => {
          setStage('shimmer');
          setShimmerActive(true);
        }, 400);
        return () => clearTimeout(holdTimer);
      }
    }
  }, [stage, typedChars, fullText.length]);

  // 2. SHIMMER & REVELATION STAGE (Luminous sweep across gold letters)
  useEffect(() => {
    if (stage === 'shimmer') {
      const timer = setTimeout(() => {
        setStage('fading');
      }, 1200); // Allow time for full shimmer glide and hold
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // 3. SEQUENTIAL DISSOLVE ANIMATION (Words fade off one after the other)
  useEffect(() => {
    if (stage === 'fading') {
      let currentWordIndex = 0;
      const interval = setInterval(() => {
        if (currentWordIndex < words.length) {
          const idxToFade = currentWordIndex;
          setFadedWordIndices((prev) => new Set([...prev, idxToFade]));
          currentWordIndex++;
        } else {
          clearInterval(interval);
          // Final fade-out of the intro overlay
          setIsExiting(true);
          setTimeout(() => {
            onComplete();
          }, 800);
        }
      }, 180); // 180ms delay between words for a clear, sequential fade-off
      return () => clearInterval(interval);
    }
  }, [stage, words.length, onComplete]);

  // Manual skip handler
  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const currentTypedString = fullText.slice(0, typedChars);

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#100107] text-white p-6 cursor-pointer select-none transition-opacity duration-800 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. Deep Royal Velvet & Ambient Vignette Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#420317_0%,_#20030d_45%,_#090105_100%)] opacity-95 pointer-events-none" />
      <div className="absolute inset-0 arabesque-pattern opacity-10 pointer-events-none" />

      {/* Floating Ambient Stardust Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-[#d4af37] opacity-60 animate-ping duration-[3000ms]" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-[#f3e5ab] opacity-70 animate-pulse duration-[2500ms]" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-[#d4af37] opacity-50 animate-bounce duration-[4000ms]" />
        <div className="absolute bottom-1/4 right-1/5 w-1 h-1 rounded-full bg-[#f3e5ab] opacity-60 animate-ping duration-[3500ms]" />
      </div>

      {/* 2. Main Animated Showcase Card */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
        
        {/* Crown with Radiant Golden Halo */}
        <div className={`transition-all duration-800 transform ${
          isExiting ? 'opacity-0 scale-90 -translate-y-4' : 'opacity-100 scale-100 translate-y-0'
        }`}>
          <div className="relative inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-b from-[#5c0725]/80 to-[#2a0210]/90 border border-[#d4af37]/60 shadow-[0_0_50px_rgba(212,175,55,0.35)] backdrop-blur-xl">
            {/* Spinning accent sparkles */}
            <Sparkles size={16} className="absolute -top-1 -right-1 text-[#f3e5ab] animate-spin duration-[7000ms]" />
            <Star size={12} className="absolute -bottom-1 -left-1 text-[#d4af37] animate-pulse duration-[2000ms]" />
            
            {/* Elegant Crown Icon */}
            <Crown size={38} className="text-[#d4af37] drop-shadow-[0_2px_10px_rgba(212,175,55,0.6)] animate-pulse duration-[2500ms]" />
          </div>
        </div>

        {/* Expanding Fine Gold Line (Flourish Top) */}
        <div className={`w-32 sm:w-48 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent transition-all duration-1000 ${
          stage !== 'typing' || typedChars > 10 ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
        }`} />

        {/* The Animated Text (Refined Semi-Bold & Regal Typography) */}
        <div className="min-h-[80px] sm:min-h-[90px] flex items-center justify-center px-4">
          
          {/* Phase 1: Dynamic Character-by-Character Writing */}
          {stage === 'typing' && (
            <h1 className="font-cinzel text-xl sm:text-3xl md:text-4xl font-semibold tracking-[0.14em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] drop-shadow-[0_2px_15px_rgba(212,175,55,0.35)] leading-relaxed">
              {currentTypedString}
              {/* Golden Writing Cursor with glowing aura */}
              <span className="inline-block w-0.5 h-6 sm:h-8 ml-1 bg-[#d4af37] animate-pulse shadow-[0_0_8px_#d4af37] align-middle" />
            </h1>
          )}

          {/* Phase 2 & 3: Shimmer Glow & Sequential Word-by-Word Dissolve */}
          {(stage === 'shimmer' || stage === 'fading') && (
            <h1 className="font-cinzel text-xl sm:text-3xl md:text-4xl font-semibold tracking-[0.14em] uppercase leading-relaxed flex flex-wrap justify-center gap-x-2.5 sm:gap-x-3 gap-y-2">
              {words.map((word, index) => {
                const isFaded = fadedWordIndices.has(index);
                return (
                  <span
                    key={index}
                    className={`inline-block transition-all duration-500 transform ${
                      isFaded
                        ? 'opacity-0 -translate-y-3 scale-105 blur-[3px]' // Dissolves like upward mist
                        : 'opacity-100 translate-y-0 scale-100 text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] drop-shadow-[0_2px_15px_rgba(212,175,55,0.4)]'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </h1>
          )}

        </div>

        {/* Expanding Fine Gold Line (Flourish Bottom) */}
        <div className={`w-32 sm:w-48 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent transition-all duration-1000 ${
          stage !== 'typing' || typedChars > 15 ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
        }`} />

        {/* Brand Subtitle Pill & Welcoming Invitation */}
        <div className={`transition-all duration-700 delay-200 transform flex flex-col items-center space-y-2.5 ${
          isExiting || stage === 'fading' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#d4af37]/30 text-[#f3e5ab] text-[11px] font-mono tracking-[0.25em] shadow-lg backdrop-blur-md">
            <span>ARAB SIGNATURE HOTEL & SUITES</span>
          </div>

          <p className="font-serif italic text-sm sm:text-base text-[#f3e5ab]/90 tracking-widest drop-shadow-sm flex items-center gap-2.5">
            <span className="w-6 sm:w-10 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]/60" />
            <span>Come and Experience True Luxury</span>
            <span className="w-6 sm:w-10 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]/60" />
          </p>
        </div>

      </div>

      {/* Discreet Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 z-20 px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-[#f3e5ab] text-[11px] font-mono tracking-widest transition-all"
      >
        Skip &rarr;
      </button>

    </div>
  );
}
