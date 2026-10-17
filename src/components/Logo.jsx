import React from 'react';

export default function Logo({ variant = 'gold', size = 'default', showSub = true }) {
  const isLight = variant === 'burgundy' || variant === 'dark';
  const textColor = isLight ? 'text-[#420317]' : 'text-white';
  const subColor = isLight ? 'text-[#8b2649]' : 'text-[#d4af37]';

  const badgeSize = size === 'small' ? 'w-8 h-8' : size === 'large' ? 'w-12 h-12' : 'w-10 h-10';

  return (
    <div className="flex items-center gap-3 tracking-wider select-none group">
      {/* Official Option 1: Modern Architectural AS Monogram */}
      <div className={`relative flex-shrink-0 ${badgeSize} rounded-xl overflow-hidden border border-[#d4af37]/60 shadow-lg shadow-[#d4af37]/10 group-hover:border-[#d4af37] transition-all bg-[#120208]`}>
        <img
          src="/logo.jpg"
          alt="Arab Signature Hotel Monogram"
          className="w-full h-full object-cover scale-110 group-hover:scale-115 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col leading-none text-left">
        <span className={`font-cinzel font-bold text-sm sm:text-base tracking-[0.2em] ${textColor} group-hover:text-[#f3e5ab] transition-colors`}>
          ARAB SIGNATURE
        </span>
        {showSub && (
          <span className={`text-[9px] tracking-[0.3em] font-medium uppercase mt-0.5 ${subColor}`}>
            HOTEL AND SUITES
          </span>
        )}
      </div>
    </div>
  );
}
