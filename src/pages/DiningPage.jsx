import React from 'react';
import { Utensils, Coffee, Wine, Clock, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function DiningPage({ onNavigate, onOpenBooking }) {
  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  const menuHighlights = [
    {
      category: "Arabian Specialties",
      items: [
        { name: "Royal Lamb Mandi", desc: "Slow-roasted tender lamb infused with Yemeni spices, served over fragrant basmati rice", price: "₦14,500" },
        { name: "Al-Sultan Mixed Grill", desc: "Shish tawook, lamb kofta, beef kebabs, grilled tomatoes, and warm pita bread", price: "₦18,000" },
        { name: "Beirut Mezze Platter", desc: "Fresh creamy hummus, mutabbal, tabbouleh salad, falafel, and crispy flatbread", price: "₦9,500" },
        { name: "Gourmet Arabian Shawarma", desc: "Marinated sliced chicken or beef with garlic toum sauce in toasted Lebanese flatbread", price: "₦4,500" }
      ]
    },
    {
      category: "Continental & Local Delicacies",
      items: [
        { name: "Grilled Jumbo Prawns", desc: "Jumbo Atlantic prawns charbroiled with herb garlic butter and spiced saffron rice", price: "₦19,500" },
        { name: "Prime Aged Ribeye Steak", desc: "Grass-fed beef steak grilled to perfection with peppercorn sauce and roasted potatoes", price: "₦22,000" },
        { name: "Catfish Point & Kill Pepper Soup", desc: "Fresh live catfish slow-simmered in aromatic local herbs and indigenous peppers", price: "₦12,000" },
        { name: "Executive Oha & Goat Meat Soup", desc: "Rich native Anambra soup prepared with fresh oha leaves and tender goat meat cuts", price: "₦11,000" }
      ]
    }
  ];

  return (
    <div className="bg-[#120208] text-gray-100 min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative py-24 px-6 text-center border-b border-[#d4af37]/30 bg-gradient-to-b from-[#250210] to-[#120208] overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#5c0725]/50 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-mono tracking-widest">
            <Utensils size={14} className="text-[#d4af37]" />
            <span>FINE GASTRONOMY IN NSUGBE, ONITSHA</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-white tracking-wide">
            Al-Sultan Gourmet Dining & <br />
            <span className="gold-text-gradient">Executive Bar Lounge</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Experience an extraordinary culinary journey blending authentic Middle Eastern feasts with premium continental and Nigerian specialties.
          </p>
        </div>
      </section>

      {/* 2. RESTAURANT & LOUNGE ATMOSPHERE */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#1c040e]/90 shadow-2xl grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="h-full min-h-[360px] bg-black">
            <img
              src="/rooms/al-sultan-dining-hall.jpg"
              alt="Al-Sultan Gourmet Dining Hall"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8 sm:p-12 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37]">
              <Sparkles size={14} /> FIVE-STAR CULINARY STANDARDS
            </div>
            
            <h2 className="font-cinzel text-3xl font-extrabold text-white">
              Dining Designed for Connoisseurs
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              At Al-Sultan Restaurant, our master chefs source only the freshest organic ingredients, prime cuts of meat, and authentic imported Middle Eastern spices. Whether you dine in our ambient main hall, private curtained poolside cabana, or in the comfort of your suite, every meal is prepared fresh to order.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Clock size={16} className="text-[#d4af37] mb-1.5" />
                <div className="font-bold text-white">24/7 Room Dining</div>
                <p className="text-[10px] text-gray-400">Available all day and night</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Coffee size={16} className="text-[#d4af37] mb-1.5" />
                <div className="font-bold text-white">Arabian Teas & Coffee</div>
                <p className="text-[10px] text-gray-400">Traditional mint tea & Turkish brew</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED MENU HIGHLIGHTS */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold">
            CHEF'S SPECIAL SELECTIONS
          </span>
          <h2 className="font-cinzel text-3xl font-extrabold tracking-wide">
            Signature Menu Highlights
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {menuHighlights.map((section, idx) => (
            <div key={idx} className="p-8 rounded-3xl border border-[#d4af37]/35 bg-[#1c040e]/90 shadow-2xl space-y-6">
              <h3 className="font-cinzel text-xl font-bold text-[#f3e5ab] pb-3 border-b border-white/10">
                {section.category}
              </h3>

              <div className="space-y-5">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-sm text-white">{item.name}</h4>
                      <span className="font-mono text-sm font-bold text-[#d4af37]">{item.price}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. POOLSIDE & CABANA SERVICE BANNER */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#3a0214] to-[#120208] border border-[#d4af37]/40 shadow-2xl space-y-4">
          <h3 className="font-cinzel text-2xl font-bold text-white">
            Private Cabana Dining & Cocktail Service
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Reserve a poolside VIP cabana for your evening gathering. Enjoy specialized grill platters, chilled cocktails, and attentive private waiter service.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenBooking('deluxe')}
              className={`px-8 py-3.5 rounded-xl ${goldGradient} font-bold text-xs uppercase tracking-wider shadow-lg`}
            >
              Reserve A Suite & Cabana
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
