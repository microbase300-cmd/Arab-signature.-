import React, { useState, useEffect } from 'react';
import { 
  Utensils, Wine, Clock, Check, ArrowRight, Sparkles, Search, 
  Flame, GlassWater, Beer, MessageSquare, ShieldCheck, ChevronRight
} from 'lucide-react';
import { portalStore } from '../data/portalStore';

export default function DiningPage({ onNavigate, onOpenBooking }) {
  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';
  
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load live menu & subscribe to real-time Admin price updates
  useEffect(() => {
    setMenuItems(portalStore.getDiningMenu());

    const unsubscribe = portalStore.subscribeDiningMenu((updatedMenu) => {
      setMenuItems(updatedMenu);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    { id: 'all', label: 'All Selections', icon: Utensils },
    { id: 'arabian', label: 'Arabian Feasts', icon: Flame },
    { id: 'continental', label: 'Continental & Local', icon: Utensils },
    { id: 'spirits', label: 'Champagne & VIP Bottles', icon: Wine },
    { id: 'cocktails', label: 'Cocktails & Mocktails', icon: GlassWater },
    { id: 'beers', label: 'Beer, Wine & Refreshments', icon: Beer },
  ];

  // Filtered menu
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'food'
        ? item.type === 'food'
        : activeCategory === 'drinks'
        ? item.type === 'drinks'
        : item.category === activeCategory;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Group by categoryLabel for structured presentation
  const groupedCategories = {};
  filteredItems.forEach((item) => {
    const cat = item.categoryLabel || 'Specialties';
    if (!groupedCategories[cat]) groupedCategories[cat] = [];
    groupedCategories[cat].push(item);
  });

  return (
    <div className="bg-[#120208] text-gray-100 min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative py-24 px-6 text-center border-b border-[#d4af37]/30 bg-gradient-to-b from-[#250210] to-[#120208] overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5c0725]/50 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-mono tracking-widest shadow-lg">
            <Utensils size={14} className="text-[#d4af37]" />
            <span>AL-SULTAN GOURMET DINING & VIP BAR LOUNGE • NSUGBE, ONITSHA</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-wide">
            Al-Sultan Gastronomy & <br />
            <span className="gold-text-gradient">VIP Bottle Service</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From slow-roasted Arabian Lamb Mandi to Don Julio 1942 VIP bottle service, savor culinary excellence and premier nightlife spirits in the heart of Nsugbe.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#menu-section"
              className={`px-7 py-3 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-lg inline-flex items-center gap-2`}
            >
              <span>Explore Food & Drink Menu</span>
              <ChevronRight size={15} />
            </a>
            <button
              onClick={() => onOpenBooking('deluxe')}
              className="px-7 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
            >
              Reserve Table / Cabana
            </button>
          </div>
        </div>
      </section>

      {/* 2. RESTAURANT & LOUNGE ATMOSPHERE SHOWCASE */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#1c040e]/90 shadow-2xl grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="h-full min-h-[360px] bg-black relative group">
            <img
              src="/rooms/al-sultan-dining-hall.jpg"
              alt="Al-Sultan Gourmet Dining Hall"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono font-bold uppercase tracking-wider">
              Vivid HDR • Al-Sultan Hall
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <span className="text-xs text-[#f3e5ab] font-mono bg-black/60 px-3 py-1 rounded-full border border-white/20">
                Main Banquet Hall & Chilled Executive Bar
              </span>
            </div>
          </div>
          
          <div className="p-8 sm:p-12 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37]">
              <Sparkles size={14} /> FIVE-STAR CULINARY & DRINK STANDARDS
            </div>
            
            <h2 className="font-cinzel text-3xl font-extrabold text-white">
              Dining Designed for Connoisseurs
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              At Al-Sultan Restaurant & Bar, master chefs source fresh organic produce, prime cuts of meat, and authentic imported Middle Eastern spices alongside top-shelf international champagnes and tequilas. Whether in our ambient dining hall or your private poolside cabana, every dish and drink is prepared to perfection.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Utensils size={16} className="text-[#d4af37] mb-1.5" />
                <div className="font-bold text-white">Al-Sultan Dining Hall</div>
                <p className="text-[10px] text-gray-400">Atmospheric indoor & open-air terrace dining</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Wine size={16} className="text-[#d4af37] mb-1.5" />
                <div className="font-bold text-white">VIP Bottle Service</div>
                <p className="text-[10px] text-gray-400">LED sparklers & chilled ice bucket service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE FOOD & DRINKS MENU */}
      <section id="menu-section" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        
        {/* Menu Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
              <Sparkles size={13} />
              LIVE MENUS & CURRENT RATES
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wide text-white">
              Food & Drinks <span className="gold-text-gradient">Price Catalog</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Live pricing managed directly by hotel management. Available at Al-Sultan Restaurant & VIP Lounge.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search dish, tequila, champagne, cocktail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#1c040e] border border-[#d4af37]/40 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] shadow-xl"
            />
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = menuItems.filter((i) => {
              if (cat.id === 'all') return true;
              if (cat.id === 'food') return i.type === 'food';
              if (cat.id === 'drinks') return i.type === 'drinks';
              return i.category === cat.id;
            }).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black border-[#d4af37] shadow-lg shadow-[#d4af37]/20'
                    : 'bg-[#16030c] text-gray-300 hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                <Icon size={13} />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === cat.id ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Menu Cards Display */}
        {Object.keys(groupedCategories).length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-[#16030c] border border-white/10 space-y-3">
            <Utensils size={32} className="text-[#d4af37] mx-auto opacity-60" />
            <h4 className="font-cinzel text-lg font-bold text-white">No items found matching "{searchQuery}"</h4>
            <p className="text-xs text-gray-400">Try searching for "Lamb", "Tequila", "1942", "Cocktail", or choose another category.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-[#f3e5ab] font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedCategories).map(([catTitle, items]) => (
              <div key={catTitle} className="space-y-4">
                
                <div className="flex items-center justify-between border-b border-[#d4af37]/25 pb-2.5">
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f3e5ab] flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                    <span>{catTitle}</span>
                  </h3>
                  <span className="text-xs font-mono text-gray-400">{items.length} items</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#18030d]/85 hover:border-[#d4af37]/50 hover:bg-[#200411] transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-base text-white group-hover:text-[#f3e5ab] transition-colors">
                                {item.name}
                              </h4>
                              {item.isSignature && (
                                <span className="px-2 py-0.5 rounded-full bg-[#5c0725] border border-[#d4af37]/40 text-[#f3e5ab] text-[9px] font-mono uppercase tracking-wider font-bold">
                                  Signature
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                              {item.type === 'drinks' ? 'Beverage & Bar' : 'Kitchen Gourmet'}
                            </span>
                          </div>

                          {/* Live Dynamic Price in Naira */}
                          <div className="text-right flex-shrink-0">
                            <span className="font-mono text-base sm:text-lg font-extrabold text-[#d4af37] block">
                              ₦{Number(item.price).toLocaleString()}
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono">per serving / bottle</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed pt-1">
                          {item.desc}
                        </p>
                      </div>

                      {/* Item Availability Footer */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Available Daily
                        </span>

                        <span className="text-[10px] text-[#f3e5ab]/70 font-mono tracking-wider">
                          Al-Sultan Gourmet
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* 4. POOLSIDE & CABANA SERVICE BANNER */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#3a0214] via-[#22030e] to-[#120208] border border-[#d4af37]/40 shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5c0725] text-[#f3e5ab] text-xs font-mono uppercase tracking-wider">
            <Wine size={14} /> VIP Nightlife & Cabana Reservations
          </div>
          <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
            Private Poolside Cabana Dining & Bottle Service
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Planning a private celebration or evening with friends? Reserve a VIP cabana with custom platters, Don Julio 1942, Dom Pérignon, and dedicated private waiter service.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenBooking('deluxe')}
              className={`px-8 py-3.5 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2`}
            >
              <span>Reserve Suite & VIP Cabana</span>
              <ArrowRight size={14} />
            </button>
            <a
              href="https://wa.me/2348125786875?text=Hello%20Arab%20Signature%20Hotel,%20I%20would%20like%20to%20reserve%20a%20VIP%20Cabana%20and%20order%20Bottle%20Service"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-2"
            >
              <MessageSquare size={14} className="text-[#d4af37]" />
              <span>WhatsApp Inquiries</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
