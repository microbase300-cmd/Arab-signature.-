import React, { useState, useEffect } from 'react';
import { 
  X, 
  Utensils, 
  Crown, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Flame, 
  Percent, 
  Check, 
  Clock, 
  CheckCircle2, 
  VolumeX, 
  RefreshCw 
} from 'lucide-react';
import { HOTEL_INFO } from '../data/hotelData';

// --- CURATED POOLS FOR DYNAMIC PROMO GENERATION ---

// 1. Base Foods (Rice, Pasta & Traditional Soups)
const BASE_FOODS = [
  {
    name: "Smoky Party Jollof Rice",
    price: 3000,
    image: "/dining/jollof-rice.jpg",
    desc: "Slow-simmered in roasted red bell pepper, plum tomato, and thyme reduction.",
    category: "Rice Dish"
  },
  {
    name: "Savory Royal Fried Rice",
    price: 3000,
    image: "/dining/fried-rice.jpg",
    desc: "Stir-fried with sweet corn, green peas, carrots, and aromatic curry spices.",
    category: "Rice Dish"
  },
  {
    name: "Fragrant Royal Basmati",
    price: 5000,
    image: "/dining/basmati-rice.jpg",
    desc: "Steamed long-grain basmati with rich aromatic herbs and spiced peppered sauce.",
    category: "Rice Specialty"
  },
  {
    name: "Spiced Jollof Spaghetti",
    price: 4000,
    image: "/dining/spaghetti.jpg",
    desc: "Tossed in rich seasoned tomato sauce with bell peppers and fresh herbs.",
    category: "Pasta Dish"
  },
  {
    name: "Royal Egusi Soup",
    price: 2000,
    image: "/dining/egusi-soup.jpg",
    desc: "Rich ground melon seed soup with palm oil, leafy greens, and traditional seasonings.",
    category: "Traditional Soup"
  },
  {
    name: "Authentic Ofe Oha Soup",
    price: 2000,
    image: "/dining/oha-soup.jpg",
    desc: "Eastern Nigerian traditional Oha leaf soup thickened with cocoyam and uziza.",
    category: "Traditional Soup"
  },
  {
    name: "Onitsha Ofe Nsala (White Soup)",
    price: 4000,
    image: "/dining/nsala-soup.jpg",
    desc: "Aromatic white soup seasoned with utazi leaves, uda, ehuru, and yam thickener.",
    category: "Traditional Soup"
  },
  {
    name: "Calabar Afang Soup",
    price: 4000,
    image: "/dining/afang-soup.jpg",
    desc: "Shredded afang leaves and waterleaf simmered in rich palm oil broth.",
    category: "Traditional Soup"
  }
];

// 2. Proteins for Pairing
const PROTEINS = [
  {
    name: "Crisp Peppered Turkey",
    price: 6000,
    image: "/dining/prot-turkey.jpg",
    desc: "Succulent golden-fried and peppered turkey cut, seasoned to perfection."
  },
  {
    name: "Golden Fried Chicken",
    price: 6000,
    image: "/dining/prot-chicken.jpg",
    desc: "Well-marinated, golden fried and peppered chicken portion."
  },
  {
    name: "Slow-Braised Goat Meat",
    price: 6000,
    image: "/dining/prot-goatmeat.jpg",
    desc: "Tender slow-braised and spiced Nigerian goat meat cuts."
  },
  {
    name: "Seasoned Fried Beef",
    price: 5000,
    image: "/dining/prot-beef.jpg",
    desc: "Tender braised and fried Nigerian beef portion in rich aromatics."
  },
  {
    name: "Fresh Catfish Pepper Soup",
    price: 6500,
    image: "/dining/catfish-peppersoup.jpg",
    desc: "Fresh live catfish cut in aromatic indigenous herbs and yellow pepper broth."
  }
];

// 3. Arab Suites & Upcoming Events
const SUITE_EVENT_PROMOS = [
  {
    id: "poolside-night",
    eventTitle: "VIP Arabian Poolside Night & Live Sax",
    eventBadge: "THIS WEEKEND • FRIDAY & SATURDAY",
    eventDate: "From 7:00 PM Till Late",
    eventDesc: "Experience exotic shisha cabanas, live acoustic saxophone melodies, charcoal BBQ grills, and illuminated pool views under the stars.",
    suiteName: "Diplomatic Suite",
    suiteCategory: "Extension Building • Rooms 107 & 114",
    suitePrice: 120000,
    suitePriceFormatted: "₦120,000",
    suiteId: "suites",
    image: "/rooms/suite-royal-penthouse.jpg",
    perk: "Includes 2 Complimentary Signature Cocktails & VIP Cabana Table reservation",
    tagline: "The Crown Jewel of Arab Luxury in Nsugbe"
  },
  {
    id: "diplomatic-retreat",
    eventTitle: "Diplomatic Weekend Getaway & Executive Brunch",
    eventBadge: "WEEKEND EXCLUSIVE PACKAGE",
    eventDate: "Saturday & Sunday Check-ins",
    eventDesc: "Escape into quiet luxury with 24/7 uninterrupted solar silent power, private majlis velvet lounge, high-speed fiber internet, and 5-star comfort.",
    suiteName: "Super Executive Room",
    suiteCategory: "Main (3) & Extension (2) • 5 Luxury Rooms",
    suitePrice: 60000,
    suitePriceFormatted: "₦60,000",
    suiteId: "super-executive",
    image: "/rooms/suite-executive-arabian.jpg",
    perk: "Complimentary Chef's Gourmet Breakfast in Bed + Guaranteed 2:00 PM Late Check-out",
    tagline: "Unmatched Prestige for Business & Leisure"
  },
  {
    id: "sunday-soiree",
    eventTitle: "Royal Sunday Seafood & Wine Soirée",
    eventBadge: "EVERY SUNDAY SPECIAL",
    eventDate: "2:00 PM – 9:00 PM Poolside",
    eventDesc: "Savor fresh whole catfish pepper soup, chilled vintage dinner wines, and smooth ambient music in a private tranquil setting.",
    suiteName: "Executive Room",
    suiteCategory: "Main Building (3) & Extension (4) • 7 Rooms",
    suitePrice: 50000,
    suitePriceFormatted: "₦50,000",
    suiteId: "executive",
    image: "/rooms/suite-executive-king.jpg",
    perk: "Complimentary Welcome Wine Glass & Express In-Room Check-In",
    tagline: "Elegantly Appointed Comfort & Privacy"
  },
  {
    id: "romantic-oasis",
    eventTitle: "Couples' Romantic Oasis Staycation",
    eventBadge: "LIMITED WEEKLY RESERVATIONS",
    eventDate: "Flexible Dates Available",
    eventDesc: "Bespoke ambient tray ceiling lighting, plush king bed, quiet soundproof privacy, and luxury Moroccan bath amenities for two.",
    suiteName: "Superior Room",
    suiteCategory: "Main Building (5) & Extension (6) • 11 Rooms",
    suitePrice: 40000,
    suitePriceFormatted: "₦40,000",
    suiteId: "superior",
    image: "/rooms/suite-deluxe-doha.jpg",
    perk: "Complimentary Chilled Sparkling Cider & Rose Turndown Service",
    tagline: "Signature Arab Elegance & Serenity"
  }
];

export default function PromoPopupModal({
  onNavigate,
  onOpenBooking,
  isBlocked = false // Set to true if booking modal is open or staff portal active
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [promoType, setPromoType] = useState('food'); // 'food' or 'suite'
  const [foodPromo, setFoodPromo] = useState(null);
  const [suitePromo, setSuitePromo] = useState(null);
  const [dontShowToday, setDontShowToday] = useState(false);

  // Helper to generate a random food combo
  const generateRandomFoodCombo = () => {
    const randomFood = BASE_FOODS[Math.floor(Math.random() * BASE_FOODS.length)];
    const randomProtein = PROTEINS[Math.floor(Math.random() * PROTEINS.length)];
    const originalTotal = randomFood.price + randomProtein.price;
    // 15% discount rounded to nearest 500
    const promoPrice = Math.max(3500, Math.round((originalTotal * 0.85) / 500) * 500);
    const savings = originalTotal - promoPrice;
    const discountPercent = Math.round(((originalTotal - promoPrice) / originalTotal) * 100);

    return {
      food: randomFood,
      protein: randomProtein,
      originalTotal,
      promoPrice,
      savings,
      discountPercent: discountPercent > 0 ? discountPercent : 15
    };
  };

  // Helper to pick a random suite event promo
  const generateRandomSuitePromo = () => {
    return SUITE_EVENT_PROMOS[Math.floor(Math.random() * SUITE_EVENT_PROMOS.length)];
  };

  useEffect(() => {
    // 1. Anti-frustration checks: check localStorage and sessionStorage
    if (typeof window === 'undefined') return;

    // Check if user chose "Don't show again today"
    const dismissedUntil = localStorage.getItem('ash_promo_dismissed_until');
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
      return; // Suppressed for 24h
    }

    // Check cooldown (15 minutes between popups across visits)
    const cooldownUntil = localStorage.getItem('ash_promo_cooldown_until');
    if (cooldownUntil && Date.now() < Number(cooldownUntil)) {
      return; // In active cooldown
    }

    // Check session: only show ONCE per tab session unless cooldown expires
    const shownThisSession = sessionStorage.getItem('ash_promo_shown_session');
    if (shownThisSession) {
      return;
    }

    // If externally blocked (e.g., booking modal open or portal page), don't trigger
    if (isBlocked) return;

    // 2. Random delay between 5.5 and 7.5 seconds after page load
    const randomDelay = Math.floor(Math.random() * 2000) + 5500; // 5500ms to 7500ms

    const timer = setTimeout(() => {
      // Re-verify condition before showing
      if (isBlocked) return;

      // Randomly pick between food promo (50%) and suite event promo (50%)
      const chosenType = Math.random() < 0.5 ? 'food' : 'suite';
      setPromoType(chosenType);

      if (chosenType === 'food') {
        setFoodPromo(generateRandomFoodCombo());
      } else {
        setSuitePromo(generateRandomSuitePromo());
      }

      setIsOpen(true);
      // Mark as shown in this session
      sessionStorage.setItem('ash_promo_shown_session', 'true');
    }, randomDelay);

    return () => clearTimeout(timer);
  }, [isBlocked]);

  // Handle Close / Dismiss
  const handleClose = (userRequestedMute = false) => {
    setIsOpen(false);
    
    // Set 15-minute cooldown
    localStorage.setItem('ash_promo_cooldown_until', String(Date.now() + 15 * 60 * 1000));
    sessionStorage.setItem('ash_promo_shown_session', 'true');

    // If user clicked "Don't show again today"
    if (userRequestedMute || dontShowToday) {
      localStorage.setItem('ash_promo_dismissed_until', String(Date.now() + 24 * 60 * 60 * 1000));
    }
  };

  // Keyboard accessibility: ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dontShowToday]);

  // WhatsApp Order Action for Food Promo
  const handleOrderFoodCombo = () => {
    if (!foodPromo) return;
    const msg = `Hello Arab Signature Hotel! I would like to order the Chef's Special Dining Combo: *${foodPromo.food.name}* + *${foodPromo.protein.name}* at the promo price of ₦${foodPromo.promoPrice.toLocaleString()} (Saved ₦${foodPromo.savings.toLocaleString()}). Please confirm delivery to my suite/table.`;
    const url = `https://wa.me/${HOTEL_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    handleClose();
  };

  // Navigate to Dining Menu
  const handleViewMenu = () => {
    handleClose();
    if (onNavigate) onNavigate('dining');
  };

  // Reserve Suite Action
  const handleReserveSuite = () => {
    if (!suitePromo) return;
    handleClose();
    if (onOpenBooking) {
      onOpenBooking(suitePromo.suiteId);
    }
  };

  // Navigate to Suites Page
  const handleExploreSuites = () => {
    handleClose();
    if (onNavigate) onNavigate('suites');
  };

  // Shuffle food combo manually if user wants to see another pair
  const handleShuffleFoodCombo = (e) => {
    e.stopPropagation();
    setFoodPromo(generateRandomFoodCombo());
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={() => handleClose()}
      role="dialog"
      aria-modal="true"
      aria-label={promoType === 'food' ? "Chef's Dining Combo Promo" : "Arab Suites & Luxury Event Promo"}
    >
      <div 
        className="relative w-full max-w-lg md:max-w-xl bg-gradient-to-b from-[#1c030d] via-[#120208] to-[#0a0104] border border-[#d4af37]/40 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.22)] overflow-hidden text-gray-100 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative gold top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

        {/* Close Button (X) */}
        <button
          onClick={() => handleClose()}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/60 border border-white/15 hover:border-[#d4af37] text-gray-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          title="Close announcement"
          aria-label="Close"
        >
          <X className="w-4 h-4 md:w-5 md:h-5 text-gray-200" />
        </button>

        {/* Scrollable Container for Compact Mobile Viewports */}
        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 space-y-4 sm:space-y-5">

          {/* ============================================================== */}
          {/* TYPE A: FOOD & PROTEIN COMBO PROMO                             */}
          {/* ============================================================== */}
          {promoType === 'food' && foodPromo && (
            <>
              {/* Header Badge & Title */}
              <div className="text-center space-y-1.5 pr-6 sm:pr-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5d77f] text-xs font-semibold tracking-wider uppercase">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Chef's Royal Combo • {foodPromo.discountPercent}% OFF</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                  Taste of Al-Sultan Restaurant
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  Pair your favorite base meal with succulent protein at a special guest discount.
                </p>
              </div>

              {/* Combo Visual Pairing Display */}
              <div className="relative bg-black/40 border border-[#d4af37]/25 rounded-2xl p-3 sm:p-4 shadow-inner">
                {/* Shuffle / Randomize another combo button */}
                <button
                  onClick={handleShuffleFoodCombo}
                  className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[11px] text-[#d4af37] hover:text-white bg-black/50 px-2 py-0.5 rounded-md border border-[#d4af37]/30 hover:border-[#d4af37] transition-all"
                  title="Try another random combo"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Shuffle</span>
                </button>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 items-center pt-2">
                  {/* Dish 1: Base Food */}
                  <div className="flex flex-col items-center text-center space-y-1.5">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#d4af37]/40 shadow-md group">
                      <img
                        src={foodPromo.food.image}
                        alt={foodPromo.food.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/dining/fried-rice.jpg'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-1.5 left-1 right-1 text-[10px] font-semibold text-[#f5d77f] px-1 truncate">
                        {foodPromo.food.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                        {foodPromo.food.name}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Reg: ₦{foodPromo.food.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Golden Center Plus Indicator */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#18040d] border border-[#d4af37] text-[#d4af37] font-bold text-lg flex items-center justify-center shadow-lg">
                    +
                  </div>

                  {/* Dish 2: Protein */}
                  <div className="flex flex-col items-center text-center space-y-1.5">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#d4af37]/40 shadow-md group">
                      <img
                        src={foodPromo.protein.image}
                        alt={foodPromo.protein.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/dining/prot-turkey.jpg'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-1.5 left-1 right-1 text-[10px] font-semibold text-[#f5d77f] px-1 truncate">
                        Select Protein
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                        {foodPromo.protein.name}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Reg: ₦{foodPromo.protein.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown Banner */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between px-2">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 block">Regular Price</span>
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      ₦{foodPromo.originalTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-amber-300 font-medium block">
                      Royal Promo Price
                    </span>
                    <div className="flex items-baseline justify-end gap-1.5">
                      <span className="text-xl sm:text-2xl font-bold font-serif text-[#d4af37]">
                        ₦{foodPromo.promoPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        Save ₦{foodPromo.savings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleOrderFoodCombo}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#b38f2a] text-black font-bold text-xs sm:text-sm tracking-wide uppercase shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Utensils className="w-4 h-4 text-black" />
                  <span>Order This Combo via WhatsApp</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>

                <button
                  onClick={handleViewMenu}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore Full Al-Sultan Dining & Bar Menu</span>
                </button>
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* TYPE B: ARAB SUITES & UPCOMING EVENT PROMO                     */}
          {/* ============================================================== */}
          {promoType === 'suite' && suitePromo && (
            <>
              {/* Header Badge & Title */}
              <div className="text-center space-y-1.5 pr-6 sm:pr-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5d77f] text-xs font-semibold tracking-wider uppercase">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>{suitePromo.eventBadge}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                  {suitePromo.eventTitle}
                </h3>
                <div className="inline-flex items-center gap-1 text-xs text-amber-300/90 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{suitePromo.eventDate}</span>
                </div>
              </div>

              {/* Suite & Event Feature Card */}
              <div className="relative bg-black/40 border border-[#d4af37]/30 rounded-2xl overflow-hidden shadow-inner">
                {/* Image Banner with Overlay */}
                <div className="relative h-40 sm:h-44 w-full overflow-hidden">
                  <img
                    src={suitePromo.image}
                    alt={suitePromo.suiteName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.target.src = '/rooms/suite-royal-penthouse.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120208] via-black/40 to-transparent" />
                  
                  {/* Floating Price Pill */}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md border border-[#d4af37]/50 px-3 py-1 rounded-lg">
                    <span className="text-xs text-gray-400 block -mb-1">From</span>
                    <span className="text-sm sm:text-base font-bold font-serif text-[#d4af37]">
                      {suitePromo.suitePriceFormatted} <span className="text-xs text-gray-300 font-normal">/ night</span>
                    </span>
                  </div>

                  {/* Suite Category Pill */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="inline-block text-[11px] font-semibold text-white bg-[#5b0624]/90 border border-[#d4af37]/40 px-2.5 py-0.5 rounded-md">
                      {suitePromo.suiteName}
                    </span>
                  </div>
                </div>

                {/* Content description & perk */}
                <div className="p-3 sm:p-4 space-y-2.5">
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {suitePromo.eventDesc}
                  </p>

                  {/* Event Guest Perk */}
                  <div className="p-2.5 rounded-xl bg-[#5b0624]/30 border border-[#d4af37]/30 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide block">
                        Exclusive Event Guest Perk:
                      </span>
                      <p className="text-xs text-gray-200">
                        {suitePromo.perk}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>24/7 Silent Power • High-Speed Fiber Wi-Fi • Armed Security</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleReserveSuite}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#b38f2a] text-black font-bold text-xs sm:text-sm tracking-wide uppercase shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 text-black" />
                  <span>Reserve {suitePromo.suiteName} Now</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>

                <button
                  onClick={handleExploreSuites}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore All 34 Arab Suites & Rooms</span>
                </button>
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* USER ANTI-FRUSTRATION DISMISS CONTROLS                         */}
          {/* ============================================================== */}
          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-200 select-none">
              <input
                type="checkbox"
                checked={dontShowToday}
                onChange={(e) => setDontShowToday(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[#d4af37]/40 bg-black/50 text-[#d4af37] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#d4af37]"
              />
              <span>Don't show announcements again today</span>
            </label>

            <button
              onClick={() => handleClose(dontShowToday)}
              className="text-gray-400 hover:text-[#f5d77f] underline underline-offset-2 transition-colors"
            >
              No thanks, continue browsing
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
