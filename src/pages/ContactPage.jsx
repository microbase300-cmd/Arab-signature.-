import React, { useState } from 'react';
import { HOTEL_INFO, ROOMS } from '../data/hotelData';
import { 
  MapPin, Phone, Mail, Clock, ShieldCheck, Car, 
  Plane, Sparkles, Send, CheckCircle2, MessageSquare, ArrowRight 
} from 'lucide-react';

export default function ContactPage({ onNavigate, onOpenBooking }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    suiteType: 'deluxe',
    checkIn: '',
    checkOut: '',
    message: ''
  });

  const goldGradient = 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black';

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate inquiry submission
    setFormSubmitted(true);
  };

  const handleWhatsAppInquiry = () => {
    const text = `Hello Arab Signature Hotel Concierge, my name is ${formData.name || 'a prospective guest'}. I would like to inquire about booking a stay (${formData.suiteType || 'Suite'}) at your Nsugbe, Onitsha location. Notes: ${formData.message || 'Please provide availability and check-in assistance.'}`;
    window.open(`https://wa.me/${HOTEL_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-[#120208] text-gray-100 min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative py-24 px-6 text-center border-b border-[#d4af37]/30 bg-gradient-to-b from-[#250210] to-[#120208] overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#5c0725]/50 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-mono tracking-widest">
            <MapPin size={14} className="text-[#d4af37]" />
            <span>24/7 GUEST CONCIERGE & RECEPTION</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-white tracking-wide">
            Location & <br />
            <span className="gold-text-gradient">Guest Services</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Conveniently positioned in peaceful, prestigious Nsugbe, Onitsha — <strong className="text-white font-semibold">the only verified Signature in Nsugbe</strong>, offering supreme privacy, 24/7 security, and palatial hospitality.
          </p>
        </div>
      </section>

      {/* 2. THREE KEY CONTACT PILLARS */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Address & Physical Location */}
          <div className="p-8 rounded-3xl bg-[#1c040e]/90 border border-white/10 hover:border-[#d4af37]/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5c0725] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <MapPin size={24} />
            </div>
            <h3 className="font-cinzel font-bold text-lg text-white">Palatial Address</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Nsugbe, Onitsha, Anambra State, Nigeria.
            </p>
            <div className="pt-2 text-xs text-gray-400 space-y-1">
              <p>• Secured private estate perimeter</p>
              <p>• Monitored valet parking & executive compound</p>
            </div>
          </div>

          {/* Card 2: 24/7 Phone & WhatsApp */}
          <div className="p-8 rounded-3xl bg-[#1c040e]/90 border border-[#d4af37]/40 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-[#d4af37] text-black text-[10px] font-extrabold uppercase tracking-wider rounded-bl-xl">
              Instant Response
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#5c0725] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Phone size={24} />
            </div>
            <h3 className="font-cinzel font-bold text-lg text-white">Direct Hotlines</h3>
            <div className="space-y-1">
              <p className="text-base font-mono font-bold text-[#f3e5ab]">{HOTEL_INFO.phone}</p>
              <p className="text-xs text-gray-400">Reception & Front Desk Hotline</p>
            </div>
            <a
              href={`https://wa.me/${HOTEL_INFO.whatsapp}?text=Hello%20Arab%20Signature%20Hotel,%20I%20would%20like%20to%20inquire%20about%20suite%20reservations.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] hover:underline pt-2"
            >
              <MessageSquare size={14} />
              <span>Chat via WhatsApp Concierge &rarr;</span>
            </a>
          </div>

          {/* Card 3: Timings & Operating Guarantees */}
          <div className="p-8 rounded-3xl bg-[#1c040e]/90 border border-white/10 hover:border-[#d4af37]/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5c0725] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Clock size={24} />
            </div>
            <h3 className="font-cinzel font-bold text-lg text-white">Stay Schedule</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-gray-400">Check-In:</span>
                <span className="font-semibold text-white">From 2:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-gray-400">Check-Out:</span>
                <span className="font-semibold text-white">Until 12:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Front Desk:</span>
                <span className="font-semibold text-emerald-400">24 Hours / 7 Days</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECURE COMPOUND & VALET SERVICES */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#200510] via-[#3a0618] to-[#200510] border border-[#d4af37]/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#d4af37] uppercase tracking-wider">
                <ShieldCheck size={15} /> Private Perimeter & Valet Services
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                Diplomatic Security & Monitored Valet Parking
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Designed for discerning guests requiring absolute discretion and peace of mind, Arab Signature Hotel features secured perimeter gates, 24/7 dedicated armed security personnel, and monitored private parking in Nsugbe, Onitsha.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-[#d4af37] uppercase">Sanctuary</span>
                  <h4 className="font-semibold text-white text-sm">Nsugbe Prime Enclave</h4>
                  <p className="text-xs text-gray-400">Quiet, peaceful surroundings shielded from commercial noise.</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-[#d4af37] uppercase">Protection</span>
                  <h4 className="font-semibold text-white text-sm">24/7 Armed Security & CCTV</h4>
                  <p className="text-xs text-gray-400">Continuous perimeter monitoring and valet escort.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/60 border border-[#d4af37]/30 text-center space-y-4">
              <ShieldCheck size={36} className="mx-auto text-[#d4af37]" />
              <div className="space-y-1">
                <h4 className="font-cinzel font-bold text-white text-base">Executive Valet Access</h4>
                <p className="text-xs text-gray-400">
                  Complimentary secure valet parking provided for all registered guests and suites.
                </p>
              </div>
              <button
                onClick={() => onOpenBooking('royal')}
                className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg ${goldGradient}`}
              >
                Reserve Your Suite
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CONTACT & DIRECT INQUIRY FORM */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#18030c] border border-white/10 shadow-2xl space-y-8">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37] font-semibold">
              DIRECT INQUIRIES
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              Send a Message to the Reception Desk
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              For group bookings, private corporate meetings, photo shoots, or custom suites requests, our duty manager is at your service.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-2xl bg-[#5c0725]/30 border border-[#d4af37] text-center space-y-4 animate-in fade-in">
              <CheckCircle2 size={48} className="mx-auto text-[#d4af37]" />
              <h3 className="font-cinzel text-xl font-bold text-white">Message Dispatched Successfully</h3>
              <p className="text-sm text-gray-300 max-w-lg mx-auto">
                Thank you for contacting Arab Signature Hotel & Suites. Our front desk concierge has received your inquiry and will reach out to you within minutes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <MessageSquare size={14} />
                  <span>Chat on WhatsApp Now</span>
                </button>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 block">Full Guest Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Emeka Obi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 block">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0812 578 6875"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 block">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 block">Suite Category of Interest</label>
                  <select
                    value={formData.suiteType}
                    onChange={(e) => setFormData({ ...formData, suiteType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#1c040e] border border-white/15 text-white focus:outline-none focus:border-[#d4af37] text-sm"
                  >
                    {ROOMS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — {r.priceFormatted}/night
                      </option>
                    ))}
                    <option value="group">Group / Event Reservation</option>
                  </select>
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 block">Message or Special Requests</label>
                <textarea
                  rows={4}
                  placeholder="Inquire about custom dates, private events, or poolside VIP cabana reservations..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] text-sm resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl ${goldGradient}`}
                >
                  <Send size={15} />
                  <span>Submit Inquiry</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 border border-white/10 transition-colors"
                >
                  <MessageSquare size={15} className="text-emerald-400" />
                  <span>Instant WhatsApp Direct &rarr;</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </section>

      {/* 5. QUICK MAP & LOCATION GUIDE */}
      <section className="py-12 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="rounded-3xl bg-[#1c040e] border border-[#d4af37]/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-cinzel text-xl font-bold text-white">Need Turn-by-Turn Driving Directions?</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Our front desk concierge will guide your driver directly to our private gates in Nsugbe, Onitsha.
            </p>
          </div>
          <a
            href={`https://wa.me/${HOTEL_INFO.whatsapp}?text=Hello%20Arab%20Signature%20Hotel,%20please%20send%20me%20your%20exact%20GPS%20location%20and%20driving%20directions%20in%20Nsugbe.`}
            target="_blank"
            rel="noreferrer"
            className={`px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider ${goldGradient} shadow-md flex items-center gap-2 flex-shrink-0`}
          >
            <MapPin size={15} />
            <span>Get Live GPS Directions</span>
          </a>
        </div>
      </section>

    </div>
  );
}
