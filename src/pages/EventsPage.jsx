import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Sparkles,
  Flame,
  Crown,
  Camera,
  ArrowRight,
  Phone,
  CheckCircle2,
  Clock,
  Star,
  X,
  PartyPopper
} from 'lucide-react';
import { portalStore } from '../data/portalStore';
import { HOTEL_INFO } from '../data/hotelData';

// ============================================================================
// 1. AUTO-DESIGNED LUXURY AD BANNER VERSION ("AD VERSION")
// Takes Admin's Banner + Write-Up and renders a Royal Billboard Advertisement
// ============================================================================
export function EventAdBannerCard({ event, onOpenBooking, onSelectEvent }) {
  if (!event) return null;
  const isRecap = event.type === 'recap';

  const handleWhatsAppRsvp = (e) => {
    e.stopPropagation();
    const msg = isRecap
      ? `Hello Arab Signature Hotel! I saw the recap for *${event.title}* and would like to inquire about hosting an event or booking a suite.`
      : `Hello Arab Signature Hotel! I would like to RSVP / reserve a VIP table or suite for the upcoming event: *${event.title}* (${event.dateLabel || 'Upcoming'}).`;
    window.open(`https://wa.me/${HOTEL_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      onClick={() => onSelectEvent && onSelectEvent(event)}
      className="relative rounded-3xl overflow-hidden border-2 border-[#d4af37]/60 bg-[#14020a] shadow-[0_15px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(212,175,55,0.2)] group cursor-pointer transition-all duration-500 hover:border-[#f3e5ab]"
    >
      {/* Top Luxury Gold Filigree Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8a640f] via-[#f5d77f] to-[#8a640f]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px] sm:min-h-[340px]">
        {/* Left / Top 6 Cols: High-Impact Event Banner Visual */}
        <div className="lg:col-span-6 relative min-h-[240px] sm:min-h-[300px] bg-black overflow-hidden">
          <img
            src={event.banner || '/rooms/suite-royal-penthouse.jpg'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => { e.target.src = '/rooms/suite-royal-penthouse.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14020a] via-black/25 to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-[#14020a]" />

          {/* Floating Sponsored / Ad Tag */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#aa820a] text-black text-[10px] font-extrabold uppercase tracking-widest shadow-lg flex items-center gap-1">
              <Sparkles size={11} className="text-black" />
              <span>{isRecap ? 'Official Recap Spotlight' : 'Featured Event Ad'}</span>
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase backdrop-blur-md border ${
              isRecap
                ? 'bg-amber-950/85 border-amber-400/50 text-amber-200'
                : 'bg-emerald-950/85 border-emerald-400/50 text-emerald-300 animate-pulse'
            }`}>
              {event.highlightBadge || (isRecap ? 'EVENT RECAP' : 'UPCOMING LIVE')}
            </span>
          </div>

          {/* Bottom Venue Pill on Image */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
            <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-[#d4af37]/40 text-[#f3e5ab] text-[11px] font-medium flex items-center gap-1.5">
              <MapPin size={12} className="text-[#d4af37]" />
              <span className="truncate">{event.venue || 'Arab Signature Hotel, Nsugbe'}</span>
            </span>
          </div>
        </div>

        {/* Right 6 Cols: Auto-Designed Ad Poster Copy & CTA */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#240310] via-[#16020a] to-[#0d0106] relative">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 px-3 py-1 rounded-lg">
              <Calendar size={13} className="text-[#d4af37]" />
              <span>{event.dateLabel || 'Special Hotel Event'}</span>
            </div>

            <h3 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight group-hover:text-[#f3e5ab] transition-colors">
              {event.title}
            </h3>

            {event.subtitle && (
              <p className="text-xs sm:text-sm font-semibold text-[#f3e5ab]/90">
                {event.subtitle}
              </p>
            )}

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-4">
              {event.writeUp}
            </p>

            {event.ticketInfo && (
              <div className="p-3 rounded-xl bg-black/45 border border-[#d4af37]/30 flex items-center gap-2.5">
                <Crown size={16} className="text-[#d4af37] shrink-0" />
                <span className="text-xs text-[#f3e5ab] font-medium">
                  {event.ticketInfo}
                </span>
              </div>
            )}
          </div>

          {/* Ad CTA Buttons */}
          <div className="pt-5 mt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleWhatsAppRsvp}
              className="flex-1 min-w-[180px] py-3 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/25 hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{event.ctaLabel || (isRecap ? 'Inquire on WhatsApp' : 'RSVP / VIP Table')}</span>
              <ArrowRight size={15} className="text-black" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenBooking) onOpenBooking(event.featuredSuiteId || 'suites');
              }}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-[#d4af37]/40 text-[#f3e5ab] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Book Event Suite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. AUTO-DESIGNED EVENT TEMPLATE CARD (UPCOMING & PREVIOUS RECAP)
// ============================================================================
export function EventTemplateCard({ event, onOpenBooking, onSelectEvent }) {
  if (!event) return null;
  const isRecap = event.type === 'recap';

  const handleWhatsAppRsvp = (e) => {
    e.stopPropagation();
    const msg = isRecap
      ? `Hello Arab Signature Hotel! I saw the recap of *${event.title}* and would like to inquire about hosting an event or reserving a suite.`
      : `Hello Arab Signature Hotel! I would like to RSVP / inquire about the upcoming event: *${event.title}* (${event.dateLabel || 'Upcoming'}).`;
    window.open(`https://wa.me/${HOTEL_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      onClick={() => onSelectEvent && onSelectEvent(event)}
      className={`rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-xl hover:-translate-y-1 ${
        isRecap
          ? 'bg-[#17030c]/95 border-amber-500/30 hover:border-[#d4af37]'
          : 'bg-[#1a040f]/95 border-[#d4af37]/40 hover:border-[#f3e5ab]'
      }`}
    >
      {/* Top Banner Image */}
      <div>
        <div className="relative h-56 sm:h-64 bg-black overflow-hidden">
          <img
            src={event.banner || '/rooms/suite-royal-penthouse.jpg'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => { e.target.src = '/rooms/suite-royal-penthouse.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17030c] via-black/20 to-black/30" />

          {/* Status Pill */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5">
            {isRecap ? (
              <span className="px-3 py-1 rounded-full bg-amber-950/90 border border-amber-400/50 text-amber-200 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <Camera size={12} className="text-amber-400" />
                <span>{event.highlightBadge || 'Previous Event Recap'}</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-400/50 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg animate-pulse">
                <Flame size={12} className="text-emerald-400" />
                <span>{event.highlightBadge || 'Upcoming Event'}</span>
              </span>
            )}
          </div>

          {/* Date Badge */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-[#d4af37]/40 text-[#f3e5ab] text-[11px] font-mono flex items-center gap-1.5">
              <Calendar size={12} className="text-[#d4af37]" />
              <span className="truncate">{event.dateLabel}</span>
            </span>
          </div>
        </div>

        {/* Event Write-Up Body */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <MapPin size={12} className="text-[#d4af37] shrink-0" />
            <span className="truncate">{event.venue || 'Arab Signature Hotel & Suites, Nsugbe'}</span>
          </div>

          <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white group-hover:text-[#f3e5ab] transition-colors leading-snug">
            {event.title}
          </h3>

          {event.subtitle && (
            <p className="text-xs font-semibold text-[#d4af37]">
              {event.subtitle}
            </p>
          )}

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line line-clamp-4">
            {event.writeUp}
          </p>

          {event.ticketInfo && (
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 text-xs text-[#f3e5ab]">
              <Sparkles size={14} className="text-[#d4af37] shrink-0" />
              <span>{event.ticketInfo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-white/10 flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleWhatsAppRsvp}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{isRecap ? 'Host Similar Event' : (event.ctaLabel || 'RSVP on WhatsApp')}</span>
          <ArrowRight size={13} className="text-black" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectEvent) onSelectEvent(event);
          }}
          className="py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-gray-200 text-xs font-semibold transition-all cursor-pointer"
        >
          Read Full Story
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 3. DEDICATED EVENTS & GALAS PAGE (UPCOMING + PREVIOUS RECAPS + AD FLYERS)
// ============================================================================
export default function EventsPage({ onNavigate, onOpenBooking }) {
  const [events, setEvents] = useState(() => portalStore.getHotelEvents());
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'upcoming' | 'recap'
  const [selectedEventModal, setSelectedEventModal] = useState(null);

  useEffect(() => {
    setEvents(portalStore.getHotelEvents());
    const unsub = portalStore.subscribeHotelEvents((updated) => {
      setEvents(updated);
    });
    return () => unsub();
  }, []);

  const upcomingEvents = events.filter((e) => e.type !== 'recap');
  const recapEvents = events.filter((e) => e.type === 'recap');
  const featuredAdEvent = upcomingEvents.find((e) => e.showAsAdBanner !== false) || upcomingEvents[0] || events[0];

  const displayedEvents =
    activeFilter === 'upcoming'
      ? upcomingEvents
      : activeFilter === 'recap'
      ? recapEvents
      : events;

  return (
    <div className="min-h-screen bg-[#120208] text-gray-100 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5c0725]/80 border border-[#d4af37]/40 text-[#f3e5ab] text-xs uppercase tracking-widest font-semibold">
            <PartyPopper size={14} className="text-[#d4af37]" />
            <span>Royal Galas, Poolside Nights &amp; Celebrations</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white tracking-wide leading-tight">
            Hotel Events &amp; <span className="text-gold-gradient">Royal Recaps</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Discover our upcoming poolside soirées, live saxophone nights, and executive banquets—or relive the highlights and stories from our recent unforgettable events at Arab Signature Hotel &amp; Suites.
          </p>
        </div>

        {/* Featured Auto-Designed Ad Banner */}
        {featuredAdEvent && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] flex items-center gap-1.5">
                <Flame size={14} className="text-emerald-400" />
                <span>Featured Event Advertisement</span>
              </span>
            </div>
            <EventAdBannerCard
              event={featuredAdEvent}
              onOpenBooking={onOpenBooking}
              onSelectEvent={setSelectedEventModal}
            />
          </div>
        )}

        {/* Filter Tabs: All | Upcoming Events | Previous Event Recaps */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All Events & Recaps (${events.length})` },
              { id: 'upcoming', label: `🔥 Upcoming Events (${upcomingEvents.length})` },
              { id: 'recap', label: `📸 Previous Events Recap (${recapEvents.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-lg shadow-[#d4af37]/20'
                    : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <a
            href={`https://wa.me/${HOTEL_INFO.whatsapp}?text=${encodeURIComponent('Hello Arab Signature Hotel! I would like to inquire about hosting a private event / reserving a VIP table.')}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-[#5c0725] hover:bg-[#750930] border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Phone size={13} className="text-[#d4af37]" />
            <span>Host Your Event With Us</span>
          </a>
        </div>

        {/* Events & Recaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {displayedEvents.map((evt) => (
            <EventTemplateCard
              key={evt.id}
              event={evt}
              onOpenBooking={onOpenBooking}
              onSelectEvent={setSelectedEventModal}
            />
          ))}
        </div>

        {/* Full Event Flyer / Story Popup Modal */}
        {selectedEventModal && (
          <div
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedEventModal(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-[#240310] via-[#16020a] to-[#0c0105] border-2 border-[#d4af37]/60 shadow-2xl my-8"
            >
              <button
                type="button"
                onClick={() => setSelectedEventModal(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 text-gray-300 hover:text-white border border-white/20 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="relative h-64 sm:h-80 bg-black">
                <img
                  src={selectedEventModal.banner || '/rooms/suite-royal-penthouse.jpg'}
                  alt={selectedEventModal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16020a] via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37] text-black text-[10px] font-extrabold uppercase tracking-widest mb-2">
                    {selectedEventModal.highlightBadge || (selectedEventModal.type === 'recap' ? 'OFFICIAL EVENT RECAP' : 'UPCOMING EVENT')}
                  </span>
                  <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
                    {selectedEventModal.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#f3e5ab]">
                  <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#d4af37]" />
                    <span>{selectedEventModal.dateLabel}</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#d4af37]" />
                    <span>{selectedEventModal.venue}</span>
                  </span>
                </div>

                {selectedEventModal.subtitle && (
                  <p className="text-sm font-semibold text-[#d4af37]">
                    {selectedEventModal.subtitle}
                  </p>
                )}

                <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                  {selectedEventModal.writeUp}
                </div>

                {selectedEventModal.ticketInfo && (
                  <div className="p-4 rounded-2xl bg-[#5c0725]/35 border border-[#d4af37]/40 flex items-center gap-3">
                    <Crown size={18} className="text-[#d4af37] shrink-0" />
                    <span className="text-xs sm:text-sm text-[#f3e5ab] font-semibold">
                      {selectedEventModal.ticketInfo}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/${HOTEL_INFO.whatsapp}?text=${encodeURIComponent(`Hello Arab Signature Hotel! I am inquiring about: *${selectedEventModal.title}* (${selectedEventModal.dateLabel}).`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#aa820a] text-black font-extrabold text-xs uppercase tracking-wider text-center shadow-lg"
                  >
                    {selectedEventModal.type === 'recap' ? 'Host Similar Event via WhatsApp' : 'RSVP / Reserve VIP Table on WhatsApp'}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const suiteId = selectedEventModal.featuredSuiteId || 'suites';
                      setSelectedEventModal(null);
                      if (onOpenBooking) onOpenBooking(suiteId);
                    }}
                    className="py-3.5 px-5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#d4af37]/40 text-[#f3e5ab] font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Book a Suite
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
