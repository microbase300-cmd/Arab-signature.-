import React, { useState, useEffect } from 'react';
import { 
  Utensils, Wine, Sparkles, Search, 
  GlassWater, Beer, MessageSquare, ChevronRight, AlertCircle, CheckCircle2, Soup, Drumstick, Coffee, ArrowRight, Plus, Minus, CircleDot
} from 'lucide-react';
import { portalStore } from '../data/portalStore';

export default function DiningPage({ onNavigate, onOpenBooking }) {
  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';
  
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Track multi-protein selections & quantities per dish ID: { [dishId]: { [protId]: count } }
  const [selectedPairings, setSelectedPairings] = useState({});
  // Track Swallow choice ('semo' | 'garri') and wrap count for soup items
  const [swallowTypes, setSwallowTypes] = useState({});
  const [swallowCounts, setSwallowCounts] = useState({});

  // Load live menu & subscribe to real-time Admin price updates
  useEffect(() => {
    const initial = portalStore.getDiningMenu();
    setMenuItems(initial);

    const unsubscribe = portalStore.subscribeDiningMenu((updatedMenu) => {
      setMenuItems(updatedMenu);
    });

    return () => unsubscribe();
  }, []);

  // Extract live protein add-ons and Semo / Garri swallows from the menu so Admin price changes reflect in pairings too
  const proteinAddons = menuItems.filter((i) => i.category === 'proteins' && i.isProteinAddon);
  const semoItem = menuItems.find((i) => i.id === 'food-semo') || { id: 'food-semo', name: 'Semo', price: 2000 };
  const garriItem = menuItems.find((i) => i.id === 'food-garri') || { id: 'food-garri', name: 'Garri', price: 2000 };

  // Get current map of { [protId]: quantity } for a dish (always at least 1 protein for required dishes)
  const getProteinSelectionMap = (dish) => {
    const customMap = selectedPairings[dish.id];
    if (customMap && Object.keys(customMap).length > 0) {
      const validEntries = Object.entries(customMap).filter(([id, qty]) => qty > 0 && proteinAddons.some((p) => p.id === id));
      if (validEntries.length > 0) {
        return Object.fromEntries(validEntries);
      }
    }
    // Default recommended protein: Goat Meat for Soups, Chicken for Rice/Pasta
    const defaultProtId = dish.pairingType === 'soup' ? 'prot-goatmeat' : 'prot-chicken';
    const fallbackId = proteinAddons.find((p) => p.id === defaultProtId)?.id || proteinAddons[0]?.id || 'prot-chicken';
    return { [fallbackId]: 1 };
  };

  // Toggle or increment/decrement a protein for a dish (allows selecting multiple proteins & quantities)
  const handleAdjustProtein = (dish, protId, delta) => {
    setSelectedPairings((prev) => {
      const currentMap = { ...getProteinSelectionMap(dish) };
      const currentQty = currentMap[protId] || 0;
      const nextQty = currentQty + delta;

      if (nextQty <= 0) {
        // Check total remaining proteins across other selections so at least 1 protein remains
        const otherTotal = Object.entries(currentMap)
          .filter(([id]) => id !== protId)
          .reduce((sum, [, q]) => sum + q, 0);

        if (otherTotal === 0) {
          // Keep at least 1 protein on dishes that cannot be served alone
          return prev;
        }
        delete currentMap[protId];
      } else {
        currentMap[protId] = nextQty;
      }

      return {
        ...prev,
        [dish.id]: currentMap,
      };
    });
  };

  const getSwallowType = (dishId) => {
    return swallowTypes[dishId] || 'semo';
  };

  const handleSelectSwallowType = (dishId, type) => {
    setSwallowTypes((prev) => ({
      ...prev,
      [dishId]: type,
    }));
    // Ensure at least 1 wrap is active when choosing a swallow type
    setSwallowCounts((prev) => ({
      ...prev,
      [dishId]: (prev[dishId] !== undefined && prev[dishId] > 0) ? prev[dishId] : 1,
    }));
  };

  const getSwallowCount = (dishId) => {
    return swallowCounts[dishId] !== undefined ? swallowCounts[dishId] : 1;
  };

  const handleAdjustSwallow = (dishId, delta) => {
    setSwallowCounts((prev) => {
      const current = getSwallowCount(dishId);
      const next = Math.max(1, current + delta);
      return {
        ...prev,
        [dishId]: next,
      };
    });
  };

  const categories = [
    { id: 'all', label: 'All Selections', icon: Utensils },
    { id: 'rice', label: 'Rice, Pasta & Sides', icon: Utensils },
    { id: 'soups', label: 'Traditional Soups', icon: Soup },
    { id: 'swallow', label: 'Swallow (Garri & Semo)', icon: CircleDot },
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
            Enjoy freshly prepared Nigerian delicacies, smoky Jollof & Fried Rice, rich traditional Soups, peppered Proteins, and Continental breakfasts alongside VIP bottle service in Nsugbe.
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
                    Kitchen Serving & Multi-Protein Pairing Guide
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono uppercase">
                    Important Notice
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
                  <strong className="text-white">Rice, Spaghetti & Traditional Soups are base prices only and are not served alone.</strong> Guests ordering any Rice, Spaghetti, or Soup dish must pair it with <strong className="text-[#f3e5ab]">1 or more Proteins</strong> (you can combine multiple proteins like <em className="text-gray-200">Turkey + Chicken</em> or <em className="text-gray-200">2x Goat Meat + Beef</em>), and for Soups choose either <strong className="text-[#f3e5ab]">Semo or Garri</strong> swallow.
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
                    const selectionMap = needsProtein ? getProteinSelectionMap(item) : {};
                    const swallowQty = needsSwallow ? getSwallowCount(item.id) : 0;
                    const chosenSwallowKey = needsSwallow ? getSwallowType(item.id) : 'semo';
                    const activeSwallowObj = chosenSwallowKey === 'garri' ? garriItem : semoItem;
                    const activeSwallowLabel = chosenSwallowKey === 'garri' ? 'Garri' : 'Semo';

                    // Calculate total protein cost and build summary breakdown
                    let proteinsCost = 0;
                    const chosenProteinLabels = [];
                    let totalProteinPieces = 0;

                    if (needsProtein) {
                      Object.entries(selectionMap).forEach(([protId, qty]) => {
                        const protObj = proteinAddons.find((p) => p.id === protId);
                        if (protObj && qty > 0) {
                          proteinsCost += Number(protObj.price) * qty;
                          totalProteinPieces += qty;
                          chosenProteinLabels.push(qty > 1 ? `${qty}x ${protObj.name}` : protObj.name);
                        }
                      });
                    }

                    const combinedTotal = needsProtein
                      ? Number(item.price) + proteinsCost + swallowQty * Number(activeSwallowObj.price)
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

                            {/* Interactive Multi-Protein Pairing Calculator for Rice & Soup Dishes */}
                            {needsProtein && proteinAddons.length > 0 && (
                              <div className="pt-2.5 space-y-2.5 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#f3e5ab] font-bold">
                                    1. Add Proteins (Can Select Multiple):
                                  </span>
                                  <span className="text-[10px] font-mono text-amber-300">
                                    {totalProteinPieces} selected
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {proteinAddons.map((prot) => {
                                    const qty = selectionMap[prot.id] || 0;
                                    const isSelected = qty > 0;
                                    const isLastRemainingProtein = isSelected && totalProteinPieces === 1;

                                    return (
                                      <div
                                        key={prot.id}
                                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono transition-all border flex items-center justify-between gap-1.5 ${
                                          isSelected
                                            ? 'bg-[#2a0716] text-white border-[#d4af37] shadow-md'
                                            : 'bg-black/45 text-gray-300 border-white/15 hover:border-[#d4af37]/50'
                                        }`}
                                      >
                                        <button
                                          type="button"
                                          onClick={() => handleAdjustProtein(item, prot.id, isSelected ? 1 : 1)}
                                          className="text-left flex-1 truncate"
                                          title={`Add ${prot.name} (₦${Number(prot.price).toLocaleString()})`}
                                        >
                                          <span className={isSelected ? 'font-bold text-[#f3e5ab]' : 'text-gray-300'}>
                                            {prot.name}
                                          </span>{' '}
                                          <span className="text-[10px] text-gray-400">
                                            ₦{(Number(prot.price) / 1000).toFixed(0)}k
                                          </span>
                                        </button>

                                        {isSelected ? (
                                          <div className="flex items-center gap-1 bg-black/60 rounded-lg px-1 py-0.5 border border-[#d4af37]/40">
                                            <button
                                              type="button"
                                              onClick={() => handleAdjustProtein(item, prot.id, -1)}
                                              disabled={isLastRemainingProtein}
                                              title={
                                                isLastRemainingProtein
                                                  ? 'At least 1 protein is required with this dish'
                                                  : 'Remove 1 portion'
                                              }
                                              className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                                                isLastRemainingProtein
                                                  ? 'text-gray-600 cursor-not-allowed'
                                                  : 'text-gray-200 hover:bg-white/15 hover:text-white'
                                              }`}
                                            >
                                              <Minus size={11} />
                                            </button>
                                            <span className="px-1 text-[11px] font-bold text-[#d4af37]">
                                              {qty}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => handleAdjustProtein(item, prot.id, 1)}
                                              title="Add another portion"
                                              className="w-5 h-5 rounded flex items-center justify-center text-black bg-[#d4af37] hover:bg-[#f3e5ab] transition-colors"
                                            >
                                              <Plus size={11} />
                                            </button>
                                          </div>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => handleAdjustProtein(item, prot.id, 1)}
                                            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-[#d4af37] hover:text-black text-gray-200 text-[10px] font-bold transition-all flex items-center gap-0.5"
                                          >
                                            <Plus size={10} /> Add
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Swallow choice (Semo or Garri) & quantity selector for Soups */}
                                {needsSwallow && (
                                  <div className="pt-1.5 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#f3e5ab] font-bold">
                                        2. Choose Swallow (Semo or Garri):
                                      </span>
                                      <span className="text-[10px] font-mono text-emerald-300">
                                        {swallowQty}x {activeSwallowLabel} (₦{(Number(activeSwallowObj.price) * swallowQty).toLocaleString()})
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                      {/* Semo vs Garri Toggle Buttons */}
                                      <div className="grid grid-cols-2 gap-1.5 flex-1">
                                        <button
                                          type="button"
                                          onClick={() => handleSelectSwallowType(item.id, 'semo')}
                                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all border flex items-center justify-between ${
                                            chosenSwallowKey === 'semo'
                                              ? 'bg-emerald-950/80 text-emerald-200 border-emerald-400 shadow-md'
                                              : 'bg-black/45 text-gray-300 border-white/15 hover:border-emerald-400/50'
                                          }`}
                                        >
                                          <span>Semo</span>
                                          <span className="text-[10px] text-emerald-300/90">
                                            ₦{(Number(semoItem.price) / 1000).toFixed(0)}k
                                          </span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleSelectSwallowType(item.id, 'garri')}
                                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all border flex items-center justify-between ${
                                            chosenSwallowKey === 'garri'
                                              ? 'bg-emerald-950/80 text-emerald-200 border-emerald-400 shadow-md'
                                              : 'bg-black/45 text-gray-300 border-white/15 hover:border-emerald-400/50'
                                          }`}
                                        >
                                          <span>Garri</span>
                                          <span className="text-[10px] text-emerald-300/90">
                                            ₦{(Number(garriItem.price) / 1000).toFixed(0)}k
                                          </span>
                                        </button>
                                      </div>

                                      {/* Wrap Quantity Stepper */}
                                      <div className="flex items-center gap-1 bg-black/50 rounded-xl px-2 py-1 border border-emerald-500/40">
                                        <button
                                          type="button"
                                          onClick={() => handleAdjustSwallow(item.id, -1)}
                                          disabled={swallowQty <= 1}
                                          className={`w-5 h-5 rounded flex items-center justify-center ${
                                            swallowQty <= 1
                                              ? 'text-gray-600 cursor-not-allowed'
                                              : 'text-gray-300 hover:bg-white/15'
                                          }`}
                                          title={`Decrease ${activeSwallowLabel} wraps`}
                                        >
                                          <Minus size={11} />
                                        </button>
                                        <span className="text-[11px] font-mono font-bold text-emerald-300 px-1">
                                          {swallowQty} {swallowQty === 1 ? 'wrap' : 'wraps'}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleAdjustSwallow(item.id, 1)}
                                          className="w-5 h-5 rounded flex items-center justify-center bg-emerald-500 text-black hover:bg-emerald-400"
                                          title={`Add extra ${activeSwallowLabel} wrap`}
                                        >
                                          <Plus size={11} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Combined Plate Total Box */}
                                <div className="p-3 rounded-xl bg-gradient-to-r from-[#2b0514] to-[#16020a] border border-[#d4af37]/45 flex items-center justify-between gap-2">
                                  <div className="text-[11px] text-gray-200 font-mono leading-snug">
                                    <span className="text-[#d4af37] font-bold block text-[9px] uppercase tracking-wider">
                                      Complete Paired Plate ({totalProteinPieces} {totalProteinPieces === 1 ? 'Protein' : 'Proteins'}):
                                    </span>
                                    <span>
                                      {item.name} + {chosenProteinLabels.join(' + ')}
                                      {swallowQty > 0 ? ` + ${swallowQty}x ${activeSwallowLabel}` : ''}
                                    </span>
                                  </div>
                                  <div className="text-right pl-2 flex-shrink-0">
                                    <span className="font-mono text-base sm:text-lg font-extrabold text-[#f3e5ab] block">
                                      ₦{combinedTotal.toLocaleString()}
                                    </span>
                                    <span className="text-[9px] text-gray-400 font-mono block">
                                      total plate
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
