import React, { useState, useEffect } from 'react';
import { 
  X, 
  Utensils, 
  Crown, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Flame, 
  Wine, 
  CheckCircle2, 
  RefreshCw, 
  GlassWater 
} from 'lucide-react';
import { HOTEL_INFO } from '../data/hotelData';
import { portalStore } from '../data/portalStore';

// ============================================================================
// 1. KITCHEN POOL (Base Foods + Proteins for Culinary Pairings)
// ============================================================================
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

// ============================================================================
// 2. DRINKS POOL (Al-Sultan Bar, Cellar & Lounge Spotlights)
// ============================================================================
const DRINKS_PROMOS = [
  {
    id: "wine-angelus",
    name: "D' Angelus Fine Table Wine",
    category: "Fine Table Wine",
    price: 15000,
    promoPrice: 13500,
    savings: 1500,
    discountPercent: 10,
    image: "/dining/drinks/drink-angelus-wine.jpg",
    desc: "Rich full-bodied red table wine with ripe dark berries, subtle spice, and smooth oak finish. Served chilled with crystal stemware.",
    tag: "Lounge Wine of the Week",
    serving: "Chilled Bottle + Ice Bucket & Stemware"
  },
  {
    id: "wine-reseau",
    name: "Roseau Fine Dinner Wine",
    category: "Fine Dinner Wine",
    price: 15000,
    promoPrice: 13500,
    savings: 1500,
    discountPercent: 10,
    image: "/dining/drinks/drink-reseau.jpg",
    desc: "Meticulously selected vintage red wine. The perfect pairing for grilled turkey, peppered beef, and traditional soups.",
    tag: "Sommelier's Dinner Selection",
    serving: "Served at Ideal Cellar Temperature (16°C)"
  },
  {
    id: "champagne-belaire",
    name: "Belaire Rare Rosé / Luxe French Sparkling",
    category: "Luxury French Sparkling",
    price: 65000,
    promoPrice: 58000,
    savings: 7000,
    discountPercent: 11,
    image: "/dining/drinks/drink-belaire.jpg",
    desc: "Iconic French sparkling wine crafted with fresh strawberry and blackcurrant notes. Luminescent bottle for VIP celebration.",
    tag: "VIP Celebration Bottle",
    serving: "Ice Bucket Setup with Flute Glasses"
  },
  {
    id: "cognac-hennessy",
    name: "Hennessy VS Cognac",
    category: "Prestige French Cognac",
    price: 70000,
    promoPrice: 63000,
    savings: 7000,
    discountPercent: 10,
    image: "/dining/drinks/drink-hennessy-vs.jpg",
    desc: "World-renowned cognac boasting bold aromas of toasted oak, almond, and vanilla. Served with choice of chilled mixer.",
    tag: "Executive Bar Special",
    serving: "Served with Rock Ice & Premium Mixer"
  },
  {
    id: "whiskey-honey",
    name: "American Honey Bourbon Liqueur",
    category: "Smooth Bourbon Liqueur",
    price: 30000,
    promoPrice: 26500,
    savings: 3500,
    discountPercent: 12,
    image: "/dining/drinks/drink-american-honey.jpg",
    desc: "Deep, smooth blend of pure honey and Kentucky bourbon whiskey. Incredibly refreshing served over crystal rocks.",
    tag: "Poolside Lounge Favorite",
    serving: "Served On The Rocks with Citrus Slice"
  },
  {
    id: "beer-budweiser-royal",
    name: "Budweiser Royal Reserve / Smooth (Black Bottle)",
    category: "Royal Cold-Filtered Beer",
    price: 2000,
    promoPrice: 1800,
    savings: 200,
    discountPercent: 10,
    image: "/dining/drinks/beer-budweiser-royal.jpg",
    desc: "Signature black bottle cold-filtered smooth beer. Crisp, bold, and served straight from the sub-zero cooler.",
    tag: "Al-Sultan Ice-Cold Bucket Special",
    serving: "Sub-Zero Chilled Bottle (or 5 for ₦9,000)"
  },
  {
    id: "sparkling-chamdor",
    name: "Chamdor Sparkling Non-Alcoholic Wine",
    category: "Sparkling Celebration (Non-Alcoholic)",
    price: 10000,
    promoPrice: 9000,
    savings: 1000,
    discountPercent: 10,
    image: "/dining/drinks/drink-chamdor.jpg",
    desc: "100% pure sparkling natural grape juice with a delicate effervescence. Perfect for halal dining and family celebrations.",
    tag: "Signature Non-Alcoholic Toast",
    serving: "Chilled Flute Glass Presentation"
  },
  {
    id: "energy-bullet",
    name: "Black Bullet Energy & Premium Boosters",
    category: "Energy & Mixers",
    price: 3000,
    promoPrice: 2500,
    savings: 500,
    discountPercent: 17,
    image: "/dining/drinks/energy-bullet.jpg",
    desc: "Revitalizing taurine and guarana energy drink chilled to 4°C. Perfect refreshment for poolside relaxation.",
    tag: "Vitality Boost",
    serving: "Ice-Cold Can with Lime Garnish"
  }
];

// ============================================================================
// 3. HOTEL SUITES POOL (Luxury Staycations & Suite Highlights)
// ============================================================================
const SUITE_EVENT_PROMOS = [
  {
    id: "diplomatic-apartment-luxury",
    eventTitle: "Diplomatic Apartment with Parlour",
    eventBadge: "5-STAR PRESIDENTIAL SUITE",
    eventDate: "Available 7 Days a Week",
    eventDesc: "Experience uncompromised luxury with a private parlour living room, plush king bedroom, 24/7 uninterrupted power, and bespoke concierge service.",
    suiteName: "Diplomatic Apartment with Parlour",
    suiteCategory: "Extension Building • Rooms 107 & 114",
    suitePrice: 120000,
    suitePriceFormatted: "₦120,000",
    suiteId: "suites",
    image: "/rooms/ext-120k-apartment-parlour-1.webp",
    perk: "Includes 2 Complimentary Signature Cocktails & VIP Cabana Table reservation",
    tagline: "The Crown Jewel of Arab Luxury in Nsugbe"
  },
  {
    id: "diplomatic-retreat",
    eventTitle: "Super Executive Weekend Experience",
    eventBadge: "WEEKEND EXCLUSIVE PACKAGE",
    eventDate: "Friday – Sunday Stays",
    eventDesc: "Escape into quiet luxury with 24/7 uninterrupted solar silent power, private majlis velvet lounge, high-speed fiber internet, and 5-star comfort.",
    suiteName: "Super Executive Room",
    suiteCategory: "Main (3) & Extension (2) • 5 Luxury Rooms",
    suitePrice: 60000,
    suitePriceFormatted: "₦60,000",
    suiteId: "super-executive",
    image: "/rooms/ext-60k-super-executive-1.webp",
    perk: "Complimentary Chef's Gourmet Breakfast in Bed + Guaranteed 2:00 PM Late Check-out",
    tagline: "Unmatched Prestige for Business & Leisure"
  },
  {
    id: "executive-special",
    eventTitle: "Executive Suite Business Stay",
    eventBadge: "BUSINESS & LEISURE CHOICE",
    eventDate: "Daily Executive Check-ins",
    eventDesc: "Savor fresh whole catfish pepper soup, chilled vintage dinner wines, and smooth ambient music in a private tranquil setting.",
    suiteName: "Executive Room",
    suiteCategory: "Main Building (3) & Extension (4) • 7 Rooms",
    suitePrice: 50000,
    suitePriceFormatted: "₦50,000",
    suiteId: "executive",
    image: "/rooms/ext-50k-executive-1.webp",
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

// Module-level execution state (resets fresh on every page reload)
let hasProcessedThisPageReload = false;
let hasShownOnThisReload = false;

// ============================================================================
// MAIN COMPONENT: PromoPopupModal
// ============================================================================
export default function PromoPopupModal({
  onNavigate,
  onOpenBooking,
  isBlocked = false, // Blocked if booking modal is open or staff portal active
  isIntroActive = false // Whether cinematic welcome intro is currently displaying
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [promoType, setPromoType] = useState('kitchen'); // 'kitchen', 'drinks', or 'suite'
  const [foodPromo, setFoodPromo] = useState(null);
  const [drinksPromo, setDrinksPromo] = useState(null);
  const [suitePromo, setSuitePromo] = useState(null);
  const [dontShowToday, setDontShowToday] = useState(false);

  // Helper: Generate random kitchen combo (Food + Protein)
  const generateRandomFoodCombo = () => {
    const randomFood = BASE_FOODS[Math.floor(Math.random() * BASE_FOODS.length)];
    const randomProtein = PROTEINS[Math.floor(Math.random() * PROTEINS.length)];
    const originalTotal = randomFood.price + randomProtein.price;
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

  // Helper: Pick random drinks spotlight
  const generateRandomDrinksPromo = () => {
    return DRINKS_PROMOS[Math.floor(Math.random() * DRINKS_PROMOS.length)];
  };

  // Helper: Pick random suite & Admin-created event promo
  const generateRandomSuitePromo = () => {
    try {
      const allEvents = portalStore.getHotelEvents() || [];
      const popupEvents = allEvents.filter((e) => Boolean(e) && e.isActive === true && e.enabled !== false && e.status !== 'inactive' && e.showInPopup === true);
      const rates = portalStore.getRoomRates() || [];

      if (popupEvents.length > 0) {
        const chosenEvt = popupEvents[Math.floor(Math.random() * popupEvents.length)];
        const matchedSuite = rates.find((r) => r.id === (chosenEvt.featuredSuiteId || 'suites')) || rates[0];
        const effectivePrice = (matchedSuite?.isPromoActive && matchedSuite?.promoPrice)
          ? matchedSuite.promoPrice
          : (matchedSuite?.price || 120000);

        return {
          id: chosenEvt.id,
          eventTitle: chosenEvt.title,
          eventBadge: chosenEvt.highlightBadge || (chosenEvt.type === 'recap' ? 'OFFICIAL EVENT RECAP' : 'UPCOMING SPECIAL EVENT'),
          eventDate: `${chosenEvt.dateLabel || 'Upcoming'} • ${chosenEvt.venue || 'Arab Signature Hotel'}`,
          eventDesc: chosenEvt.writeUp,
          suiteName: matchedSuite?.name || 'Diplomatic Suite',
          suiteCategory: matchedSuite?.buildingLabel || 'Main & Extension Luxury Wings',
          suitePrice: effectivePrice,
          suitePriceFormatted: `₦${Number(effectivePrice).toLocaleString()}`,
          suiteId: matchedSuite?.id || 'suites',
          image: chosenEvt.banner || '/rooms/suite-royal-penthouse.jpg',
          perk: chosenEvt.ticketInfo || 'Free VIP Entry for Checked-In Suite Guests • Table Reservations Available',
          tagline: chosenEvt.subtitle || 'Experience Legendary Arabian Hospitality in Nsugbe'
        };
      }
    } catch (e) {}
    return SUITE_EVENT_PROMOS[Math.floor(Math.random() * SUITE_EVENT_PROMOS.length)];
  };

  // Helper: Get next randomized promo type ensuring events/suites, kitchen, and drinks appear
  const getNextRandomPromoType = () => {
    let batch = [];
    try {
      const stored = localStorage.getItem('ash_promo_shuffled_batch');
      if (stored) {
        batch = JSON.parse(stored);
      }
    } catch (e) {
      batch = [];
    }

    if (!Array.isArray(batch) || batch.length === 0) {
      batch = ['suite', 'suite', 'kitchen', 'drinks', 'kitchen'];
      // Fisher-Yates random shuffle so ANY category can appear first
      for (let i = batch.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [batch[i], batch[j]] = [batch[j], batch[i]];
      }
    }

    const selectedType = batch.shift();
    try {
      localStorage.setItem('ash_promo_shuffled_batch', JSON.stringify(batch));
    } catch (e) {}

    return selectedType;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 0. Clean up any stale lock keys from previous versions
    try {
      localStorage.removeItem('ash_promo_cooldown_until');
      localStorage.removeItem('ash_promo_cooldown');
      localStorage.removeItem('ash_promo_seen_session');
      localStorage.removeItem('ash_promo_shown_session');
      sessionStorage.removeItem('ash_promo_shown_this_load');
      sessionStorage.removeItem('ash_reload_counted_this_load');
    } catch (e) {}

    // 1. User mute check ("Don't show again today")
    const dismissedUntil = localStorage.getItem('ash_promo_dismissed_until');
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
      return;
    }

    // 2. Increment refresh counter once per actual page reload (in-memory guard)
    let currentRefreshCount = Number(localStorage.getItem('ash_refresh_count') || 0);
    if (!hasProcessedThisPageReload) {
      hasProcessedThisPageReload = true;
      currentRefreshCount += 1;
      localStorage.setItem('ash_refresh_count', String(currentRefreshCount));
    }

    // 3. Frequency Rule: In every 5 refreshes, show 3 times
    // (currentRefreshCount - 1) % 5 gives 0, 1, 2, 3, 4
    // Shows on:
    //   Refresh 1 (cycle 0) -> SHOW
    //   Refresh 2 (cycle 1) -> SKIP
    //   Refresh 3 (cycle 2) -> SHOW
    //   Refresh 4 (cycle 3) -> SKIP
    //   Refresh 5 (cycle 4) -> SHOW
    const cycleIndex = (currentRefreshCount - 1) % 5;
    const shouldShowThisRefresh = (cycleIndex === 0 || cycleIndex === 2 || cycleIndex === 4);

    if (!shouldShowThisRefresh) {
      console.log(`[Arab Signature Promo] Refresh #${currentRefreshCount} (cycle step ${cycleIndex + 1}/5) -> SKIP`);
      return;
    }

    // If popup already showed or is showing on this reload, do not repeat
    if (hasShownOnThisReload) {
      return;
    }

    // Don't trigger if externally blocked (booking modal open or staff portal)
    if (isBlocked) return;

    // 4. Content Rotation Rule:
    // In every 5 times it shows: exactly 1 for hotel suites, 2 for kitchen, 2 for drinks
    // Each 5-item batch is randomly shuffled so the first show (and any show) is unpredictable!
    const chosenType = getNextRandomPromoType();
    const currentShownCount = Number(localStorage.getItem('ash_promo_shown_count') || 0);

    console.log(`[Arab Signature Promo] Refresh #${currentRefreshCount} (cycle step ${cycleIndex + 1}/5) -> SHOW (Randomly Selected: ${chosenType}) in 5s`);

    // 5. Timing Rule: 5.0 seconds after page reload
    const SHOW_DELAY_MS = 5000;

    const timer = setTimeout(() => {
      // If intro is still animating, wait a brief tick
      const triggerModal = () => {
        if (isBlocked) return;
        setPromoType(chosenType);

        if (chosenType === 'kitchen') {
          setFoodPromo(generateRandomFoodCombo());
        } else if (chosenType === 'drinks') {
          setDrinksPromo(generateRandomDrinksPromo());
        } else {
          setSuitePromo(generateRandomSuitePromo());
        }

        hasShownOnThisReload = true;
        setIsOpen(true);
        localStorage.setItem('ash_promo_shown_count', String(currentShownCount + 1));
      };

      if (isIntroActive) {
        // Wait until intro finishes then show immediately
        const pollIntro = setInterval(() => {
          if (!isIntroActive) {
            clearInterval(pollIntro);
            triggerModal();
          }
        }, 300);
        setTimeout(() => clearInterval(pollIntro), 5000);
      } else {
        triggerModal();
      }
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isBlocked, isIntroActive]);

  // Handle Close / Dismiss
  const handleClose = (userRequestedMute = false) => {
    setIsOpen(false);
    hasShownOnThisReload = true;

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

  // WhatsApp Order Action for Kitchen Food Combo
  const handleOrderFoodCombo = () => {
    if (!foodPromo) return;
    const msg = `Hello Arab Signature Hotel! I would like to order the Chef's Kitchen Promo Combo: *${foodPromo.food.name}* + *${foodPromo.protein.name}* at the promo price of ₦${foodPromo.promoPrice.toLocaleString()} (Saved ₦${foodPromo.savings.toLocaleString()}). Please confirm delivery to my room/table.`;
    const url = `https://wa.me/${HOTEL_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    handleClose();
  };

  // WhatsApp Order Action for Bar Drinks
  const handleOrderDrink = () => {
    if (!drinksPromo) return;
    const msg = `Hello Al-Sultan Bar & Lounge! I would like to order the Bar Spotlight Promo: *${drinksPromo.name}* at the special promo price of ₦${drinksPromo.promoPrice.toLocaleString()} (Saved ₦${drinksPromo.savings.toLocaleString()}). Please confirm delivery to my suite/cabana.`;
    const url = `https://wa.me/${HOTEL_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    handleClose();
  };

  // Navigate to Dining / Drinks Menu
  const handleViewDiningMenu = () => {
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

  // Shuffle buttons
  const handleShuffleFood = (e) => {
    e.stopPropagation();
    setFoodPromo(generateRandomFoodCombo());
  };

  const handleShuffleDrink = (e) => {
    e.stopPropagation();
    setDrinksPromo(generateRandomDrinksPromo());
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={() => handleClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Arab Signature Hotel Exclusive Announcement"
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

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 space-y-4 sm:space-y-5">

          {/* ============================================================== */}
          {/* 1. KITCHEN PROMO: FOOD + PROTEIN CULINARY PAIRING              */}
          {/* ============================================================== */}
          {promoType === 'kitchen' && foodPromo && (
            <>
              {/* Header Badge & Title */}
              <div className="text-center space-y-1.5 pr-6 sm:pr-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5d77f] text-xs font-semibold tracking-wider uppercase">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Al-Sultan Kitchen • {foodPromo.discountPercent}% OFF</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                  Chef's Daily Pairing Special
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  Pair your favorite base meal with succulent protein at a special guest discount.
                </p>
              </div>

              {/* Combo Visual Pairing Display */}
              <div className="relative bg-black/40 border border-[#d4af37]/25 rounded-2xl p-3 sm:p-4 shadow-inner">
                {/* Shuffle Button */}
                <button
                  onClick={handleShuffleFood}
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
                      Kitchen Promo Price
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
                  onClick={handleViewDiningMenu}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore Full Al-Sultan Food Menu</span>
                </button>
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* 2. DRINKS PROMO: BAR & CELLAR SPOTLIGHT                       */}
          {/* ============================================================== */}
          {promoType === 'drinks' && drinksPromo && (
            <>
              {/* Header Badge & Title */}
              <div className="text-center space-y-1.5 pr-6 sm:pr-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5d77f] text-xs font-semibold tracking-wider uppercase">
                  <Wine className="w-3.5 h-3.5 text-amber-400" />
                  <span>Al-Sultan Bar Spotlight • {drinksPromo.discountPercent}% OFF</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                  {drinksPromo.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  Chilled to perfection and delivered directly to your suite, cabana, or lounge table.
                </p>
              </div>

              {/* Drinks Display Card */}
              <div className="relative bg-black/40 border border-[#d4af37]/30 rounded-2xl overflow-hidden p-3.5 sm:p-4 shadow-inner">
                {/* Shuffle Button */}
                <button
                  onClick={handleShuffleDrink}
                  className="absolute top-3 right-3 flex items-center gap-1 text-[11px] text-[#d4af37] hover:text-white bg-black/60 px-2 py-0.5 rounded-md border border-[#d4af37]/30 hover:border-[#d4af37] transition-all z-10"
                  title="Try another featured drink"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Shuffle</span>
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Bottle Photo Card */}
                  <div className="relative w-28 h-36 sm:w-32 sm:h-40 shrink-0 rounded-xl overflow-hidden border-2 border-[#d4af37]/40 bg-[#0d0106] shadow-lg flex items-center justify-center p-2 group">
                    <img
                      src={drinksPromo.image}
                      alt={drinksPromo.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = '/dining/drinks/drink-angelus-wine.jpg'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-1 text-[9px] font-bold text-[#f5d77f] px-1 bg-black/70 rounded">
                      {drinksPromo.category}
                    </span>
                  </div>

                  {/* Drink Details */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <span className="inline-block text-[10px] uppercase font-bold text-amber-300/90 tracking-wider bg-[#5b0624]/60 border border-[#d4af37]/30 px-2 py-0.5 rounded">
                      {drinksPromo.tag}
                    </span>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      {drinksPromo.desc}
                    </p>

                    {/* Serving Note */}
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-[#f5d77f]">
                      <GlassWater className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{drinksPromo.serving}</span>
                    </div>

                    {/* Price banner */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-gray-400 block">Regular</span>
                        <span className="text-xs text-gray-400 line-through">
                          ₦{drinksPromo.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase text-amber-300 font-semibold block">Lounge Promo</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg sm:text-xl font-bold font-serif text-[#d4af37]">
                            ₦{drinksPromo.promoPrice.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 py-0.2 rounded">
                            Save ₦{drinksPromo.savings.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleOrderDrink}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#b38f2a] text-black font-bold text-xs sm:text-sm tracking-wide uppercase shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Wine className="w-4 h-4 text-black" />
                  <span>Order via WhatsApp Bar</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>

                <button
                  onClick={handleViewDiningMenu}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore Full Bar, Wines & Drinks Menu</span>
                </button>
              </div>
            </>
          )}

          {/* ============================================================== */}
          {/* 3. HOTEL SUITES PROMO: ARAB SUITES & UPCOMING EVENTS           */}
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

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      handleClose();
                      if (onNavigate) onNavigate('events');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[#d4af37]/30 text-[#f5d77f] hover:text-white text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-1"
                  >
                    <span>All Events &amp; Recaps</span>
                  </button>

                  <button
                    onClick={handleExploreSuites}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-1"
                  >
                    <span>Explore 34 Suites</span>
                  </button>
                </div>
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
