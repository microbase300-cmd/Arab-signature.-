import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import WelcomeIntro from './components/WelcomeIntro';

// Dedicated Multi-Page Views (Design 1 Luxury Arabesque Theme)
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SuitesPage from './pages/SuitesPage';
import AmenitiesPage from './pages/AmenitiesPage';
import DiningPage from './pages/DiningPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedRoom, setPreselectedRoom] = useState('deluxe');
  const [showWelcome, setShowWelcome] = useState(true);

  // Synchronize multi-page navigation with browser URL hash & clean URL query parameters
  useEffect(() => {
    // 1. Immediately clean up legacy query params (?design=..., ?theme=...)
    if (window.location.search || window.location.hash === '#home') {
      const cleanPath = window.location.pathname;
      const initialHash = window.location.hash;
      const cleanHash = (initialHash === '#home' || !initialHash) ? '' : initialHash;
      window.history.replaceState({}, document.title, cleanPath + cleanHash);
    }

    // 2. Handle hash-based page transitions
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

      const validPages = ['about', 'suites', 'amenities', 'dining', 'contact'];
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
      // Clean URL: don't append #home to the address bar
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

  // Render the appropriate dedicated page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'suites':
        return <SuitesPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'amenities':
        return <AmenitiesPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'dining':
        return <DiningPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigate} onOpenBooking={handleOpenBooking} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#120208] text-gray-100 font-sans selection:bg-[#d4af37] selection:text-black antialiased flex flex-col justify-between">
      
      {/* 0. Cinematic Welcome Intro Overlay (Active on refresh / initial open) */}
      {showWelcome && (
        <WelcomeIntro onComplete={() => setShowWelcome(false)} />
      )}

      {/* 1. Official Single Luxury Hotel Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking}
      />

      {/* 2. Dynamic Dedicated Page Content */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* 3. Official Hotel Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBooking={handleOpenBooking}
      />

      {/* 4. Instant Paystack & WhatsApp Booking Modal */}
      <BookingModal
        key={`${preselectedRoom}-${isBookingOpen}`}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedRoomId={preselectedRoom}
      />

    </div>
  );
}
