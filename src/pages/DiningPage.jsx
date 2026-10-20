import React, { useState, useEffect } from 'react';
import { 
  Utensils, Wine, Sparkles, Search, 
  Flame, GlassWater, Beer, MessageSquare, ChevronRight, AlertCircle, CheckCircle2, Soup, Drumstick, Coffee, ArrowRight
} from 'lucide-react';
import { portalStore } from '../data/portalStore';

export default function DiningPage({ onNavigate, onOpenBooking }) {
  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';
  
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Track selected protein pairing per dish ID for live plate calculator
  const [selectedPairings, setSelectedPairings] = useState({});
  // Track whether Semo swallow is included for soup items (default true for soups)
  const [includeSwallow, setIncludeSwallow] = useState({});

  // Load live menu & subscribe to real-time Admin price updates
  useEffect(() => {
    const initial = portalStore.getDiningMenu();
    setMenuItems(initial);

    const unsubscribe = portalStore.subscribeDiningMenu((updatedMenu) => {
      setMenuItems(updatedMenu);
    });

    return () => unsubscribe();
  }, []);

  // Extract live protein add-ons and Semo swallow from the menu so Admin price changes reflect in pairings too
  const proteinAddons = menuItems.filter((i) => i.category === 'proteins' && i.isProteinAddon);
  const semoItem = menuItems.find((i) => i.id === 'food-semo') || { name: 'Semo', price: 2000 };
  const coleslawItem = menuItems.find((i) => i.id === 'food-coleslaw') || { name: 'Coleslaw Salad', price: 2000 };

  const getSelectedProteinForDish = (dish) => {
    const chosenId = selectedPairings[dish.id];
    if (chosenId) {
      const found = proteinAddons.find((p) => p.id === chosenId);
      if (found) return found;
    }
    // Default recommended protein pairing: Chicken for Rice/Pasta, Goat Meat for Soups
    if (dish.pairingType === 'soup') {
      return proteinAddons.find((p) => p.id === 'prot-goatmeat') || proteinAddons[0] || { id: 'prot-chicken', name: 'Chicken', price: 6000 };
    }
    return proteinAddons.find((p) => p.id === 'prot-chicken') || proteinAddons[0] || { id: 'prot-chicken', name: 'Chicken', price: 6000 };
  };

  const isSwallowIncluded = (dishId) => {
    return includeSwallow[dishId] !== undefined ? includeSwallow[dishId] : true;
  };

  const categories = [
    { id: 'all', label: 'All Selections', icon: Utensils },
    { id: 'rice', label: 'Rice, Pasta & Sides', icon: Utensils },
    { id: 'soups', label: 'Soups & Swallow', icon: Soup },
    { id: 'proteins', label: 'Proteins & Pepper Soup', icon: Drumstick },
    { id: 'continental', label: 'Continental & Breakfast', icon: Coffee },
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
          (item.categoryLabel && item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()));

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
            Al-Sultan Kitchen & <br />
            <span className="gold-text-gradient">VIP Bottle Service</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Enjoy freshly prepared Nigerian delicacies, smoky Jollof & Fried Rice, rich traditional Soups, peppeered Proteins, and Continental breakfasts alongside VIP bottle service in Nsugbe.
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
              Reserve Suite / Table
            </button>
          </div>
        </div>
      </section>

      {/* 2. RESTAURANT & LOUNGE ATMOSPHERE SHOWCASE */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#1c040e]/90 shadow-2xl grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="h-full min-h-[340px] bg-black relative group">
            <img
              src="/rooms/al-sultan-dining-hall.jpg"
              alt="Al-Sultan Gourmet Dining Hall"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono font-bold uppercase tracking-wider">
              Al-Sultan Dining Hall
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <span className="text-xs text-[#f3e5ab] font-mono bg-black/60 px-3 py-1 rounded-full border border-white/20">
                Main Banquet Hall & Chilled Executive Bar
              </span>
            </div>
          </div>
          
          <div className="p-8 sm:p-12 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37]">
              <Sparkles size={14} /> AUTHENTIC NIGERIAN & CONTINENTAL CUISINE
            </div>
            
            <h2 className="font-cinzel text-3xl font-extrabold text-white">
              Freshly Prepared to Order
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              At Al-Sultan Restaurant & Bar, our chefs prepare every dish fresh using rich local ingredients—from Ofe Nsala, Oha, and Afang soups to smoky Jollof Rice, Basmati Rice, Peppered Turkey, Goat Meat, and whole fresh Catfish Pepper Soup.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Utensils size={16} className="text-[#d4af37] mb-1.5" />
                <div className="font-bold text-white">25 Kitchen Selections</div>
                <p className="text-[10px] text-gray-400">Rice, Soups, Proteins & Continental</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Wine size={16} className="text-[#d4af37] mb-1.5" />
                <div className="font-bold text-white">VIP Bottle Service</div>
                <p className="text-[10px] text-gray-400">Chilled spirits, wines & cocktails</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE FOOD & DRINKS MENU */}
      <section id="menu-section" className="py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
        
        {/* Menu Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
              <Sparkles size={13} />
              OFFICIAL AL-SULTAN KITCHEN & BAR MENU
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wide text-white">
              Food & Drinks <span className="gold-text-gradient">Price Catalog</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Live pricing managed directly by hotel management. Dine-in at Al-Sultan Restaurant & VIP Poolside Lounge.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search Jollof, Egusi, Turkey, Catfish..."
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

        {/* IMPORTANT PAIRING POLICY GUIDE BANNER */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#2c0515] via-[#1c040e] to-[#250311] border border-[#d4af37]/45 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center flex-shrink-0 text-[#f3e5ab] mt-0.5">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#f3e5ab]">
                    Kitchen Serving & Protein Pairing Guide
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono uppercase">
                    Important Notice
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
                  <strong className="text-white">Rice, Spaghetti & Traditional Soups are base prices only and are not served alone.</strong> Guests ordering any Rice, Spaghetti, or Soup dish must pair it with at least one <strong className="text-[#f3e5ab]">Protein</strong> (Turkey, Chicken, Goat Meat, Beef, or Egg). Soups also pair with <strong className="text-[#f3e5ab]">Semo Swallow (₦{semoItem.price.toLocaleString()})</strong>. Use the interactive protein selector on any Rice or Soup card below to see your complete plate price!
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
              {proteinAddons.map((prot) => (
                <div
                  key={prot.id}
                  className="px-3 py-1.5 rounded-xl bg-black/50 border border-[#d4af37]/30 text-[11px] font-mono flex items-center gap-1.5"
                >
                  <Drumstick size={11} className="text-[#d4af37]" />
                  <span className="text-gray-200">{prot.name}:</span>
                  <span className="text-[#f3e5ab] font-bold">₦{Number(prot.price).toLocaleString()}</span>
                </div>
              ))}
            </div>
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
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
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
            <p className="text-xs text-gray-400">Try searching for "Jollof", "Egusi", "Nsala", "Turkey", "Catfish", or choose another category.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-[#f3e5ab] font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            {Object.entries(groupedCategories).map(([catTitle, items]) => (
              <div key={catTitle} className="space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d4af37]/25 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
                    <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f3e5ab]">
                      {catTitle}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{items.length} selections</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {items.map((item) => {
                    const needsProtein = Boolean(item.requiresProtein);
                    const needsSwallow = Boolean(item.requiresSwallow);
                    const selectedProt = needsProtein ? getSelectedProteinForDish(item) : null;
                    const withSwallow = needsSwallow ? isSwallowIncluded(item.id) : false;

                    const combinedTotal = needsProtein
                      ? Number(item.price) +
                        (selectedProt ? Number(selectedProt.price) : 0) +
                        (withSwallow ? Number(semoItem.price) : 0)
                      : Number(item.price);

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between group ${
                          needsProtein
                            ? 'border-amber-500/35 bg-[#19030d]/95 hover:border-[#d4af37]'
                            : 'border-white/10 bg-[#18030d]/90 hover:border-[#d4af37]/60'
                        }`}
                      >
                        <div>
                          {/* Authentic Real Dish Photo Header (if item has image) */}
                          {item.image && (
                            <div className="relative h-52 w-full overflow-hidden bg-black">
                              <img
                                src={item.image}
                                alt={item.name}
                                loading="lazy"
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#19030d] via-black/20 to-transparent" />

                              {/* Top-left Pairing Status Badge */}
                              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                {needsProtein ? (
                                  <span className="px-2.5 py-1 rounded-full bg-amber-950/90 border border-amber-400/60 text-amber-200 text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                                    <AlertCircle size={11} className="text-amber-400" />
                                    Requires Protein Pairing
                                  </span>
                                ) : item.isProteinAddon ? (
                                  <span className="px-2.5 py-1 rounded-full bg-[#5c0725]/90 border border-[#d4af37]/60 text-[#f3e5ab] text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                                    <Drumstick size={11} className="text-[#d4af37]" />
                                    Protein Pairing Option
                                  </span>
                                ) : item.isSwallow || item.isSide ? (
                                  <span className="px-2.5 py-1 rounded-full bg-black/80 border border-white/30 text-gray-200 text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg">
                                    {item.isSwallow ? 'Swallow Accompaniment' : 'Side Dish'}
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-400/50 text-emerald-200 text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                                    <CheckCircle2 size={11} className="text-emerald-400" />
                                    Complete Meal
                                  </span>
                                )}
                              </div>

                              {/* Top-right Base Price Badge */}
                              <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-black/85 border border-[#d4af37]/60 text-right shadow-lg">
                                <span className="font-mono text-sm sm:text-base font-extrabold text-[#d4af37] block leading-tight">
                                  ₦{Number(item.price).toLocaleString()}
                                </span>
                                <span className="text-[9px] text-gray-300 font-mono block">
                                  {needsProtein ? 'base portion' : 'per portion'}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Card Body */}
                          <div className="p-5 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-base sm:text-lg text-white group-hover:text-[#f3e5ab] transition-colors">
                                    {item.name}
                                  </h4>
                                  {item.isSignature && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#5c0725] border border-[#d4af37]/40 text-[#f3e5ab] text-[9px] font-mono uppercase tracking-wider font-bold">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mt-0.5">
                                  {item.categoryLabel}
                                </span>
                              </div>

                              {/* Fallback price if no image (e.g. drinks) */}
                              {!item.image && (
                                <div className="text-right flex-shrink-0">
                                  <span className="font-mono text-base sm:text-lg font-extrabold text-[#d4af37] block">
                                    ₦{Number(item.price).toLocaleString()}
                                  </span>
                                  <span className="text-[9px] text-gray-400 font-mono">per bottle / serving</span>
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-gray-300 leading-relaxed">
                              {item.desc}
                            </p>

                            {/* Pairing Note Pill */}
                            {item.pairingNote && (
                              <div
                                className={`px-3 py-2 rounded-xl text-[11px] font-mono flex items-center gap-2 border ${
                                  needsProtein
                                    ? 'bg-amber-950/40 border-amber-500/35 text-amber-200'
                                    : 'bg-white/5 border-white/10 text-gray-300'
                                }`}
                              >
                                {needsProtein ? (
                                  <AlertCircle size={13} className="text-amber-400 flex-shrink-0" />
                                ) : (
                                  <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                                )}
                                <span>{item.pairingNote}</span>
                              </div>
                            )}

                            {/* Interactive Protein Pairing Calculator for Rice & Soup Dishes */}
                            {needsProtein && proteinAddons.length > 0 && (
                              <div className="pt-2 space-y-2.5 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#f3e5ab] font-bold">
                                    1. Choose Required Protein:
                                  </span>
                                  <span className="text-[10px] font-mono text-gray-400">
                                    Tap to pair
                                  </span>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                  {proteinAddons.map((prot) => {
                                    const isSelected = selectedProt?.id === prot.id;
                                    return (
                                      <button
                                        key={prot.id}
                                        type="button"
                                        onClick={() =>
                                          setSelectedPairings((prev) => ({
                                            ...prev,
                                            [item.id]: prot.id,
                                          }))
                                        }
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all border ${
                                          isSelected
                                            ? 'bg-[#d4af37] text-black font-bold border-[#f3e5ab] shadow-md'
                                            : 'bg-black/50 text-gray-300 border-white/15 hover:border-[#d4af37]/50'
                                        }`}
                                      >
                                        + {prot.name} (₦{(Number(prot.price) / 1000).toFixed(0)}k)
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Swallow toggle for Soups */}
                                {needsSwallow && (
                                  <div className="flex items-center justify-between pt-1">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#f3e5ab] font-bold">
                                      2. Swallow Accompaniment:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setIncludeSwallow((prev) => ({
                                          ...prev,
                                          [item.id]: !withSwallow,
                                        }))
                                      }
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                                        withSwallow
                                          ? 'bg-emerald-900/60 border-emerald-400/50 text-emerald-200 font-bold'
                                          : 'bg-black/40 border-white/15 text-gray-400'
                                      }`}
                                    >
                                      {withSwallow
                                        ? `✓ + Semo (₦${Number(semoItem.price).toLocaleString()})`
                                        : `+ Add Semo (₦${Number(semoItem.price).toLocaleString()})`}
                                    </button>
                                  </div>
                                )}

                                {/* Combined Plate Total Box */}
                                <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#2b0514] to-[#16020a] border border-[#d4af37]/40 flex items-center justify-between">
                                  <div className="text-[11px] text-gray-200 font-mono leading-tight">
                                    <span className="text-gray-400 block text-[9px] uppercase">
                                      Complete Paired Plate:
                                    </span>
                                    {item.name} + {selectedProt?.name}
                                    {withSwallow ? ` + Semo` : ''}
                                  </div>
                                  <div className="text-right pl-2">
                                    <span className="font-mono text-sm sm:text-base font-extrabold text-[#f3e5ab]">
                                      ₦{combinedTotal.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Item Availability Footer */}
                        <div className="px-5 py-3 border-t border-white/5 bg-black/20 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Available Daily
                          </span>

                          <span className="text-[10px] text-[#f3e5ab]/70 font-mono tracking-wider">
                            {item.type === 'drinks' ? 'VIP Bar & Lounge' : 'Al-Sultan Kitchen'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
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
            Planning a private celebration or evening with friends? Reserve a VIP cabana with custom platters, Catfish Pepper Soup, Don Julio 1942, Dom Pérignon, and dedicated waiter service.
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
              href="https://wa.me/2348125786875?text=Hello%20Arab%20Signature%20Hotel,%20I%20would%20like%20to%20inquire%20about%20Al-Sultan%20Dining%20and%20VIP%20Cabana%20reservations"
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
