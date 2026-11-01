import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext.tsx';
import { AnnouncementBar } from './components/AnnouncementBar.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { AccountPage } from './pages/AccountPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { MenuPage } from './pages/MenuPage.tsx';
import { DealsPage } from './pages/DealsPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.tsx';
import { TrackOrderPage } from './pages/TrackOrderPage.tsx';
import { ReservationPage } from './pages/ReservationPage.tsx';
import { ReservationConfirmationPage } from './pages/ReservationConfirmationPage.tsx';
import { GalleryPage } from './pages/GalleryPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { LegalPage } from './pages/LegalPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

export default function App() {
  // Preserve the active route on refresh so customer pages remain directly accessible.
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route Resolver
  const renderRoute = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} />;
    }

    // Customer account hub
    if (currentPath === '/account' || currentPath.startsWith('/account?')) {
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref') || undefined;
      return <AccountPage initialRef={refParam} navigate={navigate} />;
    }

    // 2. About
    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    // 3. Menu & Menu Category
    if (currentPath === '/menu') {
      return <MenuPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/menu/')) {
      const categorySlug = currentPath.replace('/menu/', '');
      return <MenuPage initialCategorySlug={categorySlug} navigate={navigate} />;
    }

    // 4. Deals & Deal Slug
    if (currentPath === '/deals') {
      return <DealsPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/deals/')) {
      const dealSlug = currentPath.replace('/deals/', '');
      return <DealsPage selectedDealSlug={dealSlug} navigate={navigate} />;
    }

    // 5. Order / Cart
    if (currentPath === '/order') {
      return <CartPage navigate={navigate} />;
    }

    // 6. Checkout
    if (currentPath === '/checkout') {
      return <CheckoutPage navigate={navigate} />;
    }

    // 7. Order Confirmation
    if (currentPath.startsWith('/order/confirmation/')) {
      const orderRef = currentPath.replace('/order/confirmation/', '');
      return <OrderConfirmationPage orderReference={orderRef} navigate={navigate} />;
    }

    // Legacy tracking URLs now open the combined My Account page.
    if (currentPath === '/track-order' || currentPath.startsWith('/track-order')) {
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref') || undefined;
      return <AccountPage initialRef={refParam} navigate={navigate} />;
    }

    // 9. Reservation
    if (currentPath === '/reservation' || currentPath.startsWith('/reservation?')) {
      return <ReservationPage navigate={navigate} />;
    }

    // 10. Reservation Confirmation
    if (currentPath.startsWith('/reservation/confirmation/')) {
      const ref = currentPath.replace('/reservation/confirmation/', '');
      return <ReservationConfirmationPage reference={ref} navigate={navigate} />;
    }

    // 11. Gallery
    if (currentPath === '/gallery') {
      return <GalleryPage navigate={navigate} />;
    }

    // 12. Contact
    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    // 13. Privacy Policy
    if (currentPath === '/privacy-policy') {
      return <LegalPage type="privacy" />;
    }

    // 14. Terms and Conditions
    if (currentPath === '/terms') {
      return <LegalPage type="terms" />;
    }

    // Fallback: 404
    return <NotFoundPage navigate={navigate} />;
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#171717] antialiased">
        <AnnouncementBar />
        <Header currentPath={currentPath} navigate={navigate} />
        <main className="flex-1 pb-14 md:pb-0">{renderRoute()}</main>
        <Footer navigate={navigate} />
        <CartDrawer navigate={navigate} />
        <MobileBottomNav currentPath={currentPath} navigate={navigate} />
      </div>
    </CartProvider>
  );
}
