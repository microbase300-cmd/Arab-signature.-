import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import GuestSessionPassModal from './components/GuestSessionPassModal';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import WelcomeIntro from './components/WelcomeIntro';
import PromoPopupModal from './components/PromoPopupModal';
import { portalStore, SECURE_PORTAL_ROUTES } from './data/portalStore';
import { Lock, ArrowLeft, ShieldAlert } from 'lucide-react';

// Dedicated Multi-Page Views (Design 1 Luxury Arabesque Theme)
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SuitesPage from './pages/SuitesPage';
import AmenitiesPage from './pages/AmenitiesPage';
import DiningPage from './pages/DiningPage';
import EventsPage from './pages/EventsPage';
import FoodDrinkOrderTrackerPage from './pages/FoodDrinkOrderTrackerPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';

// Separate Password-Restricted Operations Portals (Zero public links on main site)
import AdminLogin from './pages/AdminLogin';
import ReceptionLogin from './pages/ReceptionLogin';
import AccountantLogin from './pages/AccountantLogin';
import ReceptionPortal from './pages/ReceptionPortal';
import AdminPortal from './pages/AdminPortal';
import AccountantPortal from './pages/AccountantPortal';

// Lightweight Hotel AI Concierge
import HotelAiChat from './components/HotelAiChat';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedRoom, setPreselectedRoom] = useState('deluxe');
  const [showWelcome, setShowWelcome] = useState(true);
  const [isGuestPassOpen, setIsGuestPassOpen] = useState(false);

  // Synchronize multi-page navigation with browser URL hash & clean URL query parameters
  useEffect(() => {
    // 1. Pre-warm and sync cloud hotel registries in background (0-blocker)
    portalStore.syncRoomsFromCloud().catch(() => {});
    portalStore.syncBookingsFromCloud().catch(() => {});

    // 2. Clean up only legacy demo params (?design=..., ?theme=...) while preserving real booking codes
    if ((window.location.search && (window.location.search.includes('design=') || window.location.search.includes('theme='))) || window.location.hash === '#home') {
      const cleanPath = window.location.pathname;
      const initialHash = window.location.hash;
      const cleanHash = (initialHash === '#home' || !initialHash) ? '' : initialHash;
      window.history.replaceState({}, document.title, cleanPath + cleanHash);
    }

    // 2. Handle hash-based page transitions & route guards
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      
      // If on home or empty, keep URL completely clean without #home
      if (rawHash === 'home' || !rawHash) {
        setCurrentPage('home');
        if (window.location.hash) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        return;
      }

      // Security Protocol: Block all legacy predictable staff URLs
      const legacyPortalHashes = [
        'admin', 'admin-login', 'reception', 'reception-login', 
        'accountant', 'accountant-login', 'portal-login'
      ];
      if (legacyPortalHashes.includes(rawHash)) {
        setCurrentPage('decommissioned-portal-gate');
        return;
      }

      // 1. Obfuscated Staff Login Gates
      // 1.1 Main Reception Gate (#desk-600m-gate)
      if (rawHash === SECURE_PORTAL_ROUTES.MAIN_RECEPTION_LOGIN) {
        setCurrentPage(SECURE_PORTAL_ROUTES.MAIN_RECEPTION_LOGIN);
        return;
      }

      // 1.2 Extension Reception Gate (#desk-100e-gate)
      if (rawHash === SECURE_PORTAL_ROUTES.EXTENSION_RECEPTION_LOGIN) {
        setCurrentPage(SECURE_PORTAL_ROUTES.EXTENSION_RECEPTION_LOGIN);
        return;
      }

      // 1.3 Chief Accountant 2-Step Financial Vault (#vault-finance-77a)
      if (rawHash === SECURE_PORTAL_ROUTES.ACCOUNTANT_LOGIN) {
        setCurrentPage(SECURE_PORTAL_ROUTES.ACCOUNTANT_LOGIN);
        return;
      }

      // 1.4 General Manager Executive Admin Core Gate (#exec-core-99x)
      if (rawHash === SECURE_PORTAL_ROUTES.ADMIN_LOGIN) {
        setCurrentPage(SECURE_PORTAL_ROUTES.ADMIN_LOGIN);
        return;
      }

      // 2. Authenticated Staff Operations Portals (Strict Route Guards)
      // 2.1 Main Building Front Desk (#desk-600m)
      if (rawHash === SECURE_PORTAL_ROUTES.MAIN_RECEPTION_PORTAL) {
        const user = portalStore.getCurrentUser();
        if (!user || !['reception', 'admin'].includes(user.role)) {
          setCurrentPage(SECURE_PORTAL_ROUTES.MAIN_RECEPTION_LOGIN);
          window.location.hash = SECURE_PORTAL_ROUTES.MAIN_RECEPTION_LOGIN;
          return;
        }
        setCurrentPage(SECURE_PORTAL_ROUTES.MAIN_RECEPTION_PORTAL);
        return;
      }

      // 2.2 Extension Wing Front Desk (#desk-100e)
      if (rawHash === SECURE_PORTAL_ROUTES.EXTENSION_RECEPTION_PORTAL) {
        const user = portalStore.getCurrentUser();
        if (!user || !['reception', 'admin'].includes(user.role)) {
          setCurrentPage(SECURE_PORTAL_ROUTES.EXTENSION_RECEPTION_LOGIN);
          window.location.hash = SECURE_PORTAL_ROUTES.EXTENSION_RECEPTION_LOGIN;
          return;
        }
        setCurrentPage(SECURE_PORTAL_ROUTES.EXTENSION_RECEPTION_PORTAL);
        return;
      }

      // 2.3 Financial Accountant Vault & Audit Portal (#vault-finance)
      if (rawHash === SECURE_PORTAL_ROUTES.ACCOUNTANT_PORTAL) {
        const user = portalStore.getCurrentUser();
        if (!user || !['accountant', 'admin'].includes(user.role)) {
          setCurrentPage(SECURE_PORTAL_ROUTES.ACCOUNTANT_LOGIN);
          window.location.hash = SECURE_PORTAL_ROUTES.ACCOUNTANT_LOGIN;
          return;
        }
        setCurrentPage(SECURE_PORTAL_ROUTES.ACCOUNTANT_PORTAL);
        return;
      }

      // 2.4 General Manager Executive Admin Core (#exec-core)
      if (rawHash === SECURE_PORTAL_ROUTES.ADMIN_PORTAL) {
        const user = portalStore.getCurrentUser();
        if (!user || user.role !== 'admin') {
          setCurrentPage(SECURE_PORTAL_ROUTES.ADMIN_LOGIN);
          window.location.hash = SECURE_PORTAL_ROUTES.ADMIN_LOGIN;
          return;
        }
        setCurrentPage(SECURE_PORTAL_ROUTES.ADMIN_PORTAL);
        return;
      }

      // Customer Guest Portal & Stay History Access (#guest-portal, #dashboard, #my-booking)
      if (['guest-portal', 'dashboard', 'my-booking', 'customer-dashboard'].includes(rawHash)) {
        setCurrentPage('guest-portal');
        return;
      }

      // Dedicated Food & Drink Order Tracking Page (#track-order, #order-status)
      if (['track-order', 'order-status', 'food-order'].includes(rawHash)) {
        setCurrentPage('track-order');
        return;
      }

      // Public multi-page views
      const validPages = ['about', 'suites', 'amenities', 'dining', 'events', 'gallery', 'contact', 'guest-portal', 'track-order'];
      if (validPages.includes(rawHash)) {
        setCurrentPage(rawHash);
      } else {
        setCurrentPage('home');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    // Check initial hash on page load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    if (pageId === 'home') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = pageId;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (roomId = 'deluxe') => {
    setPreselectedRoom(roomId);
    setIsBookingOpen(true);
  };

  // Determine if viewing staff operations portal or security decommission screen
  const isPortalPage = [
    SECURE_PORTAL_ROUTES.MAIN_RECEPTION_LOGIN,
    SECURE_PORTAL_ROUTES.EXTENSION_RECEPTION_LOGIN,
    SECURE_PORTAL_ROUTES.ACCOUNTANT_LOGIN,
    SECURE_PORTAL_ROUTES.ADMIN_LOGIN,
    SECURE_PORTAL_ROUTES.MAIN_RECEPTION_PORTAL,
    SECURE_PORTAL_ROUTES.EXTENSION_RECEPTION_PORTAL,
    SECURE_PORTAL_ROUTES.ACCOUNTANT_PORTAL,
    SECURE_PORTAL_ROUTES.ADMIN_PORTAL,
    'decommissioned-portal-gate'
  ].includes(currentPage);

  // Render the appropriate dedicated page
  const renderCurrentPage = () => {
    switch (currentPage) {
      // Secret Login Gates
      case SECURE_PORTAL_ROUTES.MAIN_RECEPTION_LOGIN:
        return <ReceptionLogin onNavigate={handleNavigate} initialDesk="Main Building" />;
      case SECURE_PORTAL_ROUTES.EXTENSION_RECEPTION_LOGIN:
        return <ReceptionLogin onNavigate={handleNavigate} initialDesk="Extension Building" />;
      case SECURE_PORTAL_ROUTES.ACCOUNTANT_LOGIN:
        return <AccountantLogin onNavigate={handleNavigate} />;
      case SECURE_PORTAL_ROUTES.ADMIN_LOGIN:
        return <AdminLogin onNavigate={handleNavigate} />;

      // Protected Dashboards
      case SECURE_PORTAL_ROUTES.MAIN_RECEPTION_PORTAL:
      case SECURE_PORTAL_ROUTES.EXTENSION_RECEPTION_PORTAL:
        return <ReceptionPortal onNavigate={handleNavigate} />;
      case SECURE_PORTAL_ROUTES.ACCOUNTANT_PORTAL:
        return <AccountantPortal onNavigate={handleNavigate} />;
      case SECURE_PORTAL_ROUTES.ADMIN_PORTAL:
        return <AdminPortal onNavigate={handleNavigate} />;

      // Decommissioned Security Alert Screen
      case 'decommissioned-portal-gate':
        return (
          <div className="min-h-screen bg-[#090105] text-gray-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3a0214_0%,_#150209_55%,_#090105_100%)] opacity-95 pointer-events-none" />
            <div className="absolute inset-0 arabesque-pattern opacity-10 pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg bg-[#16030c]/90 border border-amber-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden border-2 border-[#d4af37]/60 shadow-lg shadow-[#d4af37]/20 bg-[#120208]">
                <img src="/logo.jpg" alt="Arab Signature Hotel Monogram" className="w-full h-full object-cover scale-110" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-mono uppercase tracking-wider">
                  <Lock size={12} className="text-red-400" />
                  <span>Restricted Access Protocol</span>
                </div>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
                  Gateway Decommissioned
                </h2>
                <p className="text-xs text-amber-300 font-mono">
                  Standard public staff URLs have been permanently deactivated.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-gray-300 leading-relaxed text-left space-y-2.5">
                <p>
                  For hotel data security and financial compliance, direct staff login URLs such as <code className="text-amber-300 bg-white/5 px-1.5 py-0.5 rounded">/#admin</code>, <code className="text-amber-300 bg-white/5 px-1.5 py-0.5 rounded">/#reception</code>, or <code className="text-amber-300 bg-white/5 px-1.5 py-0.5 rounded">/#accountant</code> are no longer active.
                </p>
                <p>
                  Authorized staff members must access their department terminal using the private encrypted gateway link issued directly by General Management.
                </p>
                <div className="text-[11px] text-gray-400 pt-2 border-t border-white/10">
                  If you are an authorized hotel staff member or accountant requiring your department entrance link, please contact the Executive General Manager.
                </div>
              </div>

              <button
                onClick={() => handleNavigate('home')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                <span>Return to Guest Website</span>
              </button>
            </div>

            <div className="relative z-10 text-center mt-6 text-[11px] text-gray-500">
              Arab Signature Hotel & Suites • Security & Operations Management
            </div>
          </div>
        );

      // Public Views
      case 'guest-portal':
        return <CustomerDashboardPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'suites':
        return <SuitesPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'amenities':
        return <AmenitiesPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'dining':
        return <DiningPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'events':
        return <EventsPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'track-order':
        return <FoodDrinkOrderTrackerPage onNavigate={handleNavigate} />;
      case 'gallery':
        return <GalleryPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#120208] text-gray-100 font-sans selection:bg-[#d4af37] selection:text-black antialiased flex flex-col justify-between">
      
      {/* Global Site-Wide Natural HDR & Clean Optical Sharpness Filter */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="arab-site-vivid-hdr" colorInterpolationFilters="sRGB">
            <feConvolveMatrix
              order="3 3"
              preserveAlpha="true"
              kernelMatrix="0 -0.05 0 -0.05 1.20 -0.05 0 -0.05 0"
            />
          </filter>
        </defs>
      </svg>

      {/* 0. Cinematic Welcome Intro Overlay (Active on refresh / initial open only on public guest site) */}
      {!isPortalPage && showWelcome && (
        <WelcomeIntro onComplete={() => setShowWelcome(false)} />
      )}

      {/* 1. Official Single Luxury Hotel Navigation Bar (Hidden in Staff Portals) */}
      {!isPortalPage && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenBooking={handleOpenBooking}
          onOpenGuestPass={() => setIsGuestPassOpen(true)}
          onOpenCustomerDashboard={() => handleNavigate('guest-portal')}
        />
      )}

      {/* 2. Dynamic Dedicated Page Content */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* 3. Official Hotel Footer (Hidden in Staff Portals; Zero Portal Links for Guests) */}
      {!isPortalPage && (
        <Footer
          onNavigate={handleNavigate}
          onOpenBooking={handleOpenBooking}
        />
      )}

      {/* 4. Instant Paystack & WhatsApp Booking Modal */}
      <BookingModal
        key={`${preselectedRoom}-${isBookingOpen}`}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedRoomId={preselectedRoom}
        onOpenGuestPass={() => setIsGuestPassOpen(true)}
      />

      {/* 4b. Active VIP Guest Stay Pass & Suite Folio Modal */}
      <GuestSessionPassModal
        isOpen={isGuestPassOpen}
        onClose={() => setIsGuestPassOpen(false)}
        onNavigate={handleNavigate}
      />



      {/* 5. Non-Intrusive Luxury Promo Popup (Kitchen Combo OR Suites & Event OR Drinks) */}
      {!isPortalPage && (
        <PromoPopupModal
          onNavigate={handleNavigate}
          onOpenBooking={handleOpenBooking}
          isBlocked={isBookingOpen}
          isIntroActive={showWelcome}
        />
      )}

      {/* 6. Arab Signature AI Concierge (Lightweight & Zero-Vercel Cost) */}
      {!isPortalPage && (
        <HotelAiChat
          onOpenBooking={handleOpenBooking}
          onNavigate={handleNavigate}
        />
      )}

    </div>
  );
}
