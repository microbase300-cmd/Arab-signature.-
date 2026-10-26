import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import GuestSessionPassModal from './components/GuestSessionPassModal';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import WelcomeIntro from './components/WelcomeIntro';
import PromoPopupModal from './components/PromoPopupModal';
import { portalStore } from './data/portalStore';

// Dedicated Multi-Page Views (Design 1 Luxury Arabesque Theme)
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SuitesPage from './pages/SuitesPage';
import AmenitiesPage from './pages/AmenitiesPage';
import DiningPage from './pages/DiningPage';
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
    // 1. Immediately clean up legacy query params (?design=..., ?theme=...)
    if (window.location.search || window.location.hash === '#home') {
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

      // Dedicated Admin Login Gate (#admin-login)
      if (rawHash === 'admin-login') {
        setCurrentPage('admin-login');
        return;
      }

      // Dedicated Admin Dashboard (#admin) - Protected
      if (rawHash === 'admin') {
        const user = portalStore.getCurrentUser();
        if (!user || user.role !== 'admin') {
          setCurrentPage('admin-login');
          window.location.hash = 'admin-login';
          return;
        }
        setCurrentPage('admin');
        return;
      }

      // Dedicated Receptionist Login Gate (#reception-login)
      if (rawHash === 'reception-login') {
        setCurrentPage('reception-login');
        return;
      }

      // Dedicated Receptionist Front Desk (#reception) - Protected
      if (rawHash === 'reception') {
        const user = portalStore.getCurrentUser();
        if (!user || !['reception', 'admin'].includes(user.role)) {
          setCurrentPage('reception-login');
          window.location.hash = 'reception-login';
          return;
        }
        setCurrentPage('reception');
        return;
      }

      // Dedicated Accountant Login Gate (#accountant-login)
      if (rawHash === 'accountant-login') {
        setCurrentPage('accountant-login');
        return;
      }

      // Dedicated Accountant Financial Audit Portal (#accountant) - Protected
      if (rawHash === 'accountant') {
        const user = portalStore.getCurrentUser();
        if (!user || !['accountant', 'admin'].includes(user.role)) {
          setCurrentPage('accountant-login');
          window.location.hash = 'accountant-login';
          return;
        }
        setCurrentPage('accountant');
        return;
      }

      // Redirect legacy shared portal login to reception-login
      if (rawHash === 'portal-login') {
        setCurrentPage('reception-login');
        window.location.hash = 'reception-login';
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
      const validPages = ['about', 'suites', 'amenities', 'dining', 'gallery', 'contact', 'guest-portal', 'track-order'];
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

  // Determine if viewing staff operations portal
  const isPortalPage = ['admin-login', 'reception-login', 'accountant-login', 'reception', 'admin', 'accountant'].includes(currentPage);

  // Render the appropriate dedicated page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'admin-login':
        return <AdminLogin onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPortal onNavigate={handleNavigate} />;
      case 'reception-login':
        return <ReceptionLogin onNavigate={handleNavigate} />;
      case 'reception':
        return <ReceptionPortal onNavigate={handleNavigate} />;
      case 'accountant-login':
        return <AccountantLogin onNavigate={handleNavigate} />;
      case 'accountant':
        return <AccountantPortal onNavigate={handleNavigate} />;
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
