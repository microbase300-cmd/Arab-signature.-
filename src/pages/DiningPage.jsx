import React, { useState, useEffect } from 'react';
import { 
  Utensils, Wine, Sparkles, Search, 
  GlassWater, Beer, MessageSquare, ChevronRight, AlertCircle, CheckCircle2, Soup, Drumstick, Coffee, ArrowRight, Plus, Minus, CircleDot, Zap,
  ShoppingBag, Receipt, Building2, KeyRound, X
} from 'lucide-react';
import { portalStore } from '../data/portalStore';
import DiningOrderModal from '../components/DiningOrderModal';

export default function DiningPage({ onNavigate, onOpenBooking }) {
  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';
  
  const [menuItems, setMenuItems] = useState([]);
  const [activeMainCategory, setActiveMainCategory] = useState('food'); // 'food' | 'drinks'
  const [activeFoodSubcategory, setActiveFoodSubcategory] = useState('all');
  const [activeDrinksSubcategory, setActiveDrinksSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Track multi-protein selections & quantities per dish ID: { [dishId]: { [protId]: count } }
  const [selectedPairings, setSelectedPairings] = useState({});
  // Track Swallow choice ('semo' | 'garri') and wrap count for soup items
  const [swallowTypes, setSwallowTypes] = useState({});
  const [swallowCounts, setSwallowCounts] = useState({});

  // Food (ARB-FDD) & Drink (ARB-DRK) Order Tray + Modal State
  const [orderCart, setOrderCart] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeLodgeSession, setActiveLodgeSession] = useState(null);

  // Order Code Lookup (ARB-FDD-... / ARB-DRK-...)
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');

  // Load live menu & subscribe to real-time Admin price updates + Guest Lodge Session
  useEffect(() => {
    const initial = portalStore.getDiningMenu();
    setMenuItems(initial);

    const syncSession = () => {
      const sess = portalStore.getCustomerSession();
      if (sess && sess.activeBooking && !sess.isCheckedOut) {
        setActiveLodgeSession(sess);
      } else {
        setActiveLodgeSession(null);
      }
    };
    syncSession();

    const unsubscribe = portalStore.subscribeDiningMenu((updatedMenu) => {
      setMenuItems(updatedMenu);
    });

    window.addEventListener('ash_customer_session_updated', syncSession);

    return () => {
      unsubscribe();
      window.removeEventListener('ash_customer_session_updated', syncSession);
    };
  }, []);

  const handleAddConfiguredItemToCart = (configuredItem, openModalImmediately = false) => {
    setOrderCart((prev) => {
      const existingIdx = prev.findIndex((c) => c.cartKey === configuredItem.cartKey);
      if (existingIdx >= 0) {
        if (openModalImmediately) return prev;
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], qty: copy[existingIdx].qty + 1 };
        return copy;
      }
      return [...prev, { ...configuredItem, qty: 1 }];
    });
    if (openModalImmediately) {
      setIsOrderModalOpen(true);
    }
  };

  const handleUpdateCartQty = (cartKey, delta) => {
    setOrderCart((prev) =>
      prev
        .map((c) => (c.cartKey === cartKey ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const handleRemoveCartItem = (cartKey) => {
    setOrderCart((prev) => prev.filter((c) => c.cartKey !== cartKey));
  };

  const handleLookupOrderCode = (e) => {
    if (e) e.preventDefault();
    setLookupError('');
    setLookupResult(null);
    if (!lookupCode.trim()) {
      // Allow opening the dedicated tracker page directly if clicked without code
      if (onNavigate) onNavigate('track-order');
      return;
    }
    const found = portalStore.findDiningOrderByCode(lookupCode.trim());
    if (!found) {
      setLookupError(`No Food or Drink booking found for code "${lookupCode.trim().toUpperCase()}". Expected ARB-FDD-... or ARB-DRK-...`);
      return;
    }
    portalStore.setTrackedDiningOrderCode(found.id);
    setLookupResult(found);
    if (onNavigate) {
      onNavigate('track-order');
    }
  };

  const totalTrayItems = orderCart.reduce((sum, i) => sum + i.qty, 0);
  const totalTrayAmount = orderCart.reduce((sum, i) => sum + Number(i.unitPrice) * i.qty, 0);

  // Extract live protein add-ons and Semo / Garri swallows from the menu so Admin price changes reflect in pairings too
  const proteinAddons = menuItems.filter((i) => i.category === 'proteins' && i.isProteinAddon);
  const semoItem = menuItems.find((i) => i.id === 'food-semo') || { id: 'food-semo', name: 'Semo', price: 2000 };
  const garriItem = menuItems.find((i) => i.id === 'food-garri') || { id: 'food-garri', name: 'Garri', price: 2000 };

  // Get available protein add-ons for a dish (Eggs excluded for traditional soups)
  const getAvailableProteinsForDish = (dish) => {
    return proteinAddons.filter((prot) => {
      if (dish.category === 'soups' || dish.pairingType === 'soup') {
        return prot.id !== 'prot-egg';
      }
      return true;
    });
  };

  // Get current map of { [protId]: quantity } for a dish (always at least 1 protein for required dishes)
  const getProteinSelectionMap = (dish) => {
    const dishProteins = getAvailableProteinsForDish(dish);
    const customMap = selectedPairings[dish.id];
    if (customMap && Object.keys(customMap).length > 0) {
      const validEntries = Object.entries(customMap).filter(([id, qty]) => qty > 0 && dishProteins.some((p) => p.id === id));
      if (validEntries.length > 0) {
        return Object.fromEntries(validEntries);
      }
    }
    // Default recommended protein: Goat Meat for Soups, Chicken for Rice/Pasta
    const defaultProtId = dish.pairingType === 'soup' ? 'prot-goatmeat' : 'prot-chicken';
    const fallbackId = dishProteins.find((p) => p.id === defaultProtId)?.id || dishProteins[0]?.id || 'prot-chicken';
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

  const foodSubcategories = [
    { id: 'all', label: 'All Food', icon: Utensils },
    { id: 'rice', label: 'Rice, Pasta & Sides', icon: Utensils },
    { id: 'soups', label: 'Traditional Soups', icon: Soup },
    { id: 'swallow', label: 'Swallow (Garri & Semo)', icon: CircleDot },
    { id: 'proteins', label: 'Proteins & Pepper Soup', icon: Drumstick },
    { id: 'continental', label: 'Continental & Breakfast', icon: Coffee },
  ];

  const drinksSubcategories = [
    { id: 'all', label: 'All Drinks', icon: Wine },
    { id: 'spirits', label: 'Champagne, Cognac, Whiskey & Gin', icon: Wine },
    { id: 'wines', label: 'Fine Wines & Sparkling', icon: Sparkles },
    { id: 'beers', label: 'Beers & Refreshments (₦2,000)', icon: Beer },
    { id: 'softdrinks', label: 'Soft Drinks & Malts (₦1,000 - ₦1,500)', icon: Coffee },
    { id: 'energy', label: 'Energy Drinks (₦1,000 - ₦3,000)', icon: Zap },
    { id: 'juices', label: 'Juices & Dairy (₦3,000 - ₦4,000)', icon: GlassWater },
  ];

  const foodCount = menuItems.filter((i) => i.type === 'food').length;
  const drinksCount = menuItems.filter((i) => i.type === 'drinks').length;

  const getSubcategoryCount = (catId, mainType) => {
    if (catId === 'all') {
      return menuItems.filter((i) => i.type === mainType).length;
    }
    return menuItems.filter((i) => i.type === mainType && i.category === catId).length;
  };

  const currentSubcategory =
    activeMainCategory === 'food' ? activeFoodSubcategory : activeDrinksSubcategory;

  // Filtered menu
  const filteredItems = menuItems.filter((item) => {
    // 1. Must match active main category ('food' vs 'drinks')
    if (item.type !== activeMainCategory) {
      return false;
    }

    // 2. Must match active subcategory
    const matchesSubcategory =
      currentSubcategory === 'all' ? true : item.category === currentSubcategory;

    // 3. Search query
    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.categoryLabel && item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSubcategory && matchesSearch;
  });

  // Calculate if search query matches items in the other main category
  const otherMainCategory = activeMainCategory === 'food' ? 'drinks' : 'food';
  const otherCategoryName = activeMainCategory === 'food' ? 'Drinks & Wine' : 'Food Menu';

  const matchesInOtherCategory = searchQuery.trim()
    ? menuItems.filter(
        (item) =>
          item.type === otherMainCategory &&
          (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.categoryLabel && item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())))
      ).length
    : 0;

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
        <div className="absolute inset-0 z-0">
          <img
            src="/lounge/vip-bar-lounge-4.webp"
            alt="Al-Sultan VIP Bar & Lounge Atmosphere"
            className="w-full h-full object-cover object-center scale-105 opacity-25 brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#250210]/85 via-[#1c020d]/90 to-[#120208]" />
        </div>
        <div className="absolute inset-0 arabesque-pattern opacity-15 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5c0725]/50 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-mono tracking-widest shadow-lg">
            <Utensils size={14} className="text-[#d4af37]" />
            <span>HOTEL DINING & VIP BAR LOUNGE • NSUGBE, ONITSHA</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-wide">
            Dining Kitchen & <br />
            <span className="gold-text-gradient">VIP Bottle Service</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Enjoy freshly prepared Nigerian delicacies, smoky Jollof & Fried Rice, rich traditional Soups, peppered Proteins, and Continental breakfasts alongside VIP bottle service in Nsugbe.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setActiveMainCategory('food');
                setActiveFoodSubcategory('all');
                document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-7 py-3 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-lg inline-flex items-center gap-2`}
            >
              <Utensils size={14} />
              <span>Explore Food Menu</span>
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => {
                setActiveMainCategory('drinks');
                setActiveDrinksSubcategory('all');
                document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-7 py-3 rounded-xl bg-[#5c0725]/60 hover:bg-[#5c0725] text-[#f3e5ab] font-bold text-xs uppercase tracking-wider border border-[#d4af37]/40 shadow-lg inline-flex items-center gap-2 transition-all"
            >
              <Wine size={14} />
              <span>Explore Drinks & Wine</span>
              <ChevronRight size={14} />
            </button>
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
          <div className="h-full min-h-[360px] bg-black relative group overflow-hidden">
            <img
              src="/lounge/vip-bar-lounge-1.webp"
              alt="Al-Sultan VIP Velvet Lounge & Bar"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg">
              VIP Lounge & Executive Bar
            </div>
            {/* Secondary bar counter inset thumbnail */}
            <div className="absolute bottom-4 right-4 w-36 sm:w-44 h-24 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#d4af37]/80 shadow-2xl hidden xs:block">
              <img
                src="/lounge/vip-bar-lounge-4.webp"
                alt="Al-Sultan Executive Bar Counter"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/15" />
              <div className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-[#f3e5ab]">
                Spirits Bar
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-6 pointer-events-none">
              <span className="text-xs text-[#f3e5ab] font-mono bg-black/75 px-3 py-1 rounded-full border border-white/20 shadow-md">
                Royal Blue Velvet Booths & Illuminated Bar
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
              At our Restaurant & Bar, our chefs prepare every dish fresh using rich local ingredients—from Ofe Nsala, Oha, and Afang soups to smoky Jollof Rice, Basmati Rice, Peppered Turkey, Goat Meat, and whole fresh Catfish Pepper Soup.
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
        
        {/* Active Lodge Guest Auto-Link Banner + Order Code Lookup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#2c0515] via-[#1c040e] to-[#15020a] border border-[#d4af37]/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#f3e5ab] flex-shrink-0">
                <Building2 size={18} />
              </div>
              {activeLodgeSession?.activeBooking ? (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-white">
                      In-Lodge Suite Linked: {activeLodgeSession.activeBooking.guestName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      Suite #{activeLodgeSession.activeBooking.roomNumber} ({activeLodgeSession.activeBooking.id})
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    Book any food (<span className="font-mono text-[#f3e5ab]">ARB-FDD</span>) or drink (<span className="font-mono text-[#f3e5ab]">ARB-DRK</span>) below and add it directly to your Suite Bill!
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <span className="text-xs font-extrabold text-[#f3e5ab] block">
                    Staying in Our Hotel Lodge? Add Food & Drinks to Your Room Bill!
                  </span>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Select any dishes or chilled bottles below — get your official <strong className="font-mono text-white">ARB-FDD-...</strong> or <strong className="font-mono text-white">ARB-DRK-...</strong> code and charge straight to your Suite (<span className="font-mono text-[#f3e5ab]">ARS-BGD</span> / <span className="font-mono text-[#f3e5ab]">ARS-EXT</span>) or pay online.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsOrderModalOpen(true)}
              className={`px-4 py-2.5 rounded-xl ${goldGradient} text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap shadow-lg`}
            >
              <ShoppingBag size={14} />
              <span>Tray ({totalTrayItems})</span>
            </button>
          </div>

          {/* Track Existing Food / Drink Booking Code (ARB-FDD / ARB-DRK) */}
          <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#18030c] border border-white/15 shadow-xl space-y-2.5">
            <form onSubmit={handleLookupOrderCode} className="flex items-center gap-2">
              <div className="relative flex-1">
                <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]" />
                <input
                  type="text"
                  value={lookupCode}
                  onChange={(e) => setLookupCode(e.target.value.toUpperCase())}
                  placeholder="Check Order Code (ARB-FDD-... / ARB-DRK-...)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-[#d4af37]/35 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#5c0725] hover:bg-[#750930] border border-[#d4af37]/40 text-xs font-bold text-[#f3e5ab] whitespace-nowrap transition-all"
              >
                Track Orders
              </button>
            </form>

            {lookupError && (
              <p className="text-[11px] text-rose-300 font-mono flex items-center gap-1.5">
                <AlertCircle size={12} className="text-rose-400 flex-shrink-0" />
                <span>{lookupError}</span>
              </p>
            )}

            {lookupResult && (
              <div className="p-3 rounded-xl bg-black/65 border border-[#d4af37]/40 text-[11px] font-mono space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[#f3e5ab]">{lookupResult.id} • {lookupResult.guestName}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      {lookupResult.orderStatus}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLookupResult(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
                <div className="text-gray-300">
                  {lookupResult.serviceLocation} • <strong className="text-amber-200">{lookupResult.paymentStatus}</strong> • ₦{Number(lookupResult.amount).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Menu Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
              <Sparkles size={13} />
              OFFICIAL KITCHEN & BAR MENU
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold tracking-wide text-white">
              Food & Drinks <span className="gold-text-gradient">Price Catalog</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Live pricing managed directly by hotel management. Dine-in at our Restaurant & VIP Poolside Lounge.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder={activeMainCategory === 'food' ? "Search Jollof, Egusi, Turkey, Catfish..." : "Search Hennessy, Moët, Heineken, Star..."}
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

        {/* 1. MASTER TWO-CATEGORY SELECTOR: FOOD vs DRINKS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#18030d] p-2 sm:p-2.5 rounded-2xl border border-[#d4af37]/35 shadow-2xl">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveMainCategory('food');
                setActiveFoodSubcategory('all');
              }}
              className={`flex-1 sm:flex-initial px-6 sm:px-8 py-3.5 rounded-xl font-cinzel text-sm sm:text-base font-bold tracking-wide transition-all flex items-center justify-center gap-2.5 border ${
                activeMainCategory === 'food'
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black border-[#d4af37] shadow-lg shadow-[#d4af37]/25 font-extrabold'
                  : 'bg-black/40 text-gray-300 hover:text-white hover:bg-white/5 border-white/10'
              }`}
            >
              <Utensils size={18} />
              <span>Food</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                activeMainCategory === 'food' ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'
              }`}>
                {foodCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveMainCategory('drinks');
                setActiveDrinksSubcategory('all');
              }}
              className={`flex-1 sm:flex-initial px-6 sm:px-8 py-3.5 rounded-xl font-cinzel text-sm sm:text-base font-bold tracking-wide transition-all flex items-center justify-center gap-2.5 border ${
                activeMainCategory === 'drinks'
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black border-[#d4af37] shadow-lg shadow-[#d4af37]/25 font-extrabold'
                  : 'bg-black/40 text-gray-300 hover:text-white hover:bg-white/5 border-white/10'
              }`}
            >
              <Wine size={18} />
              <span>Drinks</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                activeMainCategory === 'drinks' ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'
              }`}>
                {drinksCount}
              </span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-gray-400 px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 hidden md:block">
            Active Section: <span className="text-[#f3e5ab] font-bold">{activeMainCategory === 'food' ? 'Kitchen Delicacies & Soups' : 'Chilled Bottle Service & Cellar'}</span>
          </div>
        </div>

        {/* 2. SUB-CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(activeMainCategory === 'food' ? foodSubcategories : drinksSubcategories).map((cat) => {
            const Icon = cat.icon;
            const isSelected = (activeMainCategory === 'food' ? activeFoodSubcategory : activeDrinksSubcategory) === cat.id;
            const count = getSubcategoryCount(cat.id, activeMainCategory);

            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (activeMainCategory === 'food') {
                    setActiveFoodSubcategory(cat.id);
                  } else {
                    setActiveDrinksSubcategory(cat.id);
                  }
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#5c0725] text-[#f3e5ab] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 font-bold'
                    : 'bg-[#16030c] text-gray-300 hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                <Icon size={13} className={isSelected ? 'text-[#d4af37]' : 'text-gray-400'} />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-black/40 text-[#f3e5ab]' : 'bg-white/10 text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. CONTEXTUAL POLICY / INFO BANNER */}
        {activeMainCategory === 'food' ? (
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
        ) : (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#2c0515] via-[#1c040e] to-[#250311] border border-[#d4af37]/45 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center flex-shrink-0 text-[#f3e5ab] mt-0.5">
                  <Wine size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#f3e5ab]">
                      VIP Bottle Service & Executive Cellar
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] text-[10px] font-mono uppercase">
                      64 Curated Labels
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
                    Enjoy chilled VIP bottle service served tableside, at our Executive Bar Lounge, poolside, or delivered directly to your luxury suite. All beers, stouts, and energy refreshments are flat <strong className="text-[#f3e5ab]">₦2,000</strong>.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:flex-shrink-0">
                <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-[#d4af37]/30 text-[11px] font-mono flex items-center gap-1.5">
                  <Wine size={12} className="text-[#d4af37]" />
                  <span className="text-gray-200">Spirits, Cognac & Gin:</span>
                  <span className="text-[#f3e5ab] font-bold">20 Labels</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-[#d4af37]/30 text-[11px] font-mono flex items-center gap-1.5">
                  <Sparkles size={12} className="text-[#d4af37]" />
                  <span className="text-gray-200">Fine Wines:</span>
                  <span className="text-[#f3e5ab] font-bold">22 Labels</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-emerald-400/40 text-[11px] font-mono flex items-center gap-1.5">
                  <Beer size={12} className="text-emerald-400" />
                  <span className="text-gray-200">All Beers & Refreshments:</span>
                  <span className="text-emerald-300 font-bold">₦2,000 Flat</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Cards Display */}
        {Object.keys(groupedCategories).length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-[#16030c] border border-white/10 space-y-4">
            <Utensils size={32} className="text-[#d4af37] mx-auto opacity-60" />
            <h4 className="font-cinzel text-lg font-bold text-white">No items found matching "{searchQuery}"</h4>
            {matchesInOtherCategory > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-amber-200">
                  Looking for {otherCategoryName.toLowerCase()}? We found <strong>{matchesInOtherCategory}</strong> matching item(s) in <strong>{otherCategoryName}</strong>.
                </p>
                <button
                  onClick={() => {
                    setActiveMainCategory(otherMainCategory);
                    if (otherMainCategory === 'food') setActiveFoodSubcategory('all');
                    else setActiveDrinksSubcategory('all');
                  }}
                  className={`px-5 py-2.5 rounded-xl ${goldGradient} text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg`}
                >
                  <span>Switch to {otherCategoryName}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                Try searching for {activeMainCategory === 'food' ? '"Jollof", "Egusi", "Nsala", "Turkey", or "Catfish"' : '"Hennessy", "Moët", "Heineken", or "Star"'}, or choose another subcategory.
              </p>
            )}
            <div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  if (activeMainCategory === 'food') setActiveFoodSubcategory('all');
                  else setActiveDrinksSubcategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-[#f3e5ab] font-bold"
              >
                Reset Filters
              </button>
            </div>
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
                                {item.type === 'drinks' ? (
                                  <span className="px-2.5 py-1 rounded-full bg-[#3a0618]/90 border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                                    <Wine size={11} className="text-[#d4af37]" />
                                    Chilled Bottle
                                  </span>
                                ) : needsProtein ? (
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
                                  {needsProtein ? 'base portion' : item.type === 'drinks' ? 'per bottle / can' : 'per portion'}
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
                            {needsProtein && getAvailableProteinsForDish(item).length > 0 && (
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
                                  {getAvailableProteinsForDish(item).map((prot) => {
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

                        {/* Item Booking & Tray Footer */}
                        {(() => {
                          const pairingText = needsProtein
                            ? `${chosenProteinLabels.join(' + ')}${swallowQty > 0 ? ` + ${swallowQty}x ${activeSwallowLabel}` : ''}`
                            : '';
                          const cartKey = needsProtein ? `${item.id}::${pairingText}` : item.id;
                          const displayName = needsProtein ? `${item.name} (${pairingText})` : item.name;
                          const configuredPayload = {
                            cartKey,
                            id: item.id,
                            name: item.name,
                            displayName,
                            pairingSummary: needsProtein ? `Paired with ${pairingText}` : '',
                            unitPrice: combinedTotal,
                            type: item.type === 'drinks' ? 'drinks' : 'food'
                          };
                          const inTrayObj = orderCart.find((c) => c.cartKey === cartKey);

                          return (
                            <div className="px-4 py-3.5 border-t border-white/10 bg-black/35 space-y-2.5">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="text-emerald-400 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  {item.type === 'drinks' ? 'Chilled & Available' : 'Kitchen Prepared Fresh'}
                                </span>
                                {inTrayObj ? (
                                  <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] font-bold">
                                    {inTrayObj.qty} in Tray
                                  </span>
                                ) : (
                                  <span className="text-[#f3e5ab]/75">
                                    ₦{combinedTotal.toLocaleString()}
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleAddConfiguredItemToCart(configuredPayload, false)}
                                  className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all"
                                >
                                  <Plus size={13} className="text-[#d4af37]" />
                                  <span>Add to Tray</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleAddConfiguredItemToCart(configuredPayload, true)}
                                  className={`px-3 py-2.5 rounded-xl ${goldGradient} text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all`}
                                >
                                  {item.type === 'drinks' ? <Wine size={13} /> : <Utensils size={13} />}
                                  <span>{item.type === 'drinks' ? 'Book Drink' : 'Book Food'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()}
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

      {/* Floating Bottom Food & Drink Tray Checkout Bar */}
      {totalTrayItems > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-3xl rounded-2xl bg-gradient-to-r from-[#2c0414] via-[#19020b] to-[#120108] border border-[#d4af37]/60 shadow-2xl px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#f3e5ab]">
              <ShoppingBag size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <span>{totalTrayItems} Selected Item{totalTrayItems > 1 ? 's' : ''}</span>
                <span className="text-[#d4af37]">•</span>
                <span className="font-mono text-[#f3e5ab]">₦{totalTrayAmount.toLocaleString()}</span>
              </div>
              <p className="text-[10px] font-mono text-gray-300">
                {activeLodgeSession?.activeBooking
                  ? `Ready to add to Suite #${activeLodgeSession.activeBooking.roomNumber} (${activeLodgeSession.activeBooking.id}) bill`
                  : 'Generates official ARB-FDD / ARB-DRK code • Add to Suite Bill or Pay Online'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOrderCart([])}
              className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-mono text-gray-300"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsOrderModalOpen(true)}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl ${goldGradient} text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg`}
            >
              <Receipt size={14} />
              <span>{activeLodgeSession?.activeBooking ? 'Add to Suite Bill / Checkout' : 'Checkout & Get Code'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Food & Drink Booking Modal */}
      <DiningOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        cartItems={orderCart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setOrderCart([])}
        onNavigate={onNavigate}
      />

    </div>
  );
}
