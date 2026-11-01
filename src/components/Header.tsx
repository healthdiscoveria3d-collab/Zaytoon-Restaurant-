import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, MapPin, ChevronDown, Phone, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { totalItems, subtotal, openCart, fulfilment, setFulfilment, selectedLocation } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Menu', path: '/menu' },
    { label: 'Special Deals', path: '/deals' },
    { label: 'About Zaytoon', path: '/about' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact & Directions', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-250 ${
        isScrolled
          ? 'bg-[#0B241E] shadow-xl border-b border-[#12372D]'
          : 'bg-[#0B241E]/95 backdrop-blur-md border-b border-[#12372D]/60'
      }`}
    >
      {/* Top Fulfillment & Location Bar (KFC-style Commercial Ribbon) */}
      <div className="bg-[#12372D] text-xs text-[#EDE5D7] py-1.5 px-4 border-b border-[#1A4336] hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Delivery / Pickup Switcher */}
            <div className="inline-flex rounded-md p-0.5 bg-[#0B241E]/80 border border-[#1A4336]">
              <button
                type="button"
                onClick={() => setFulfilment('pickup')}
                className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                  fulfilment === 'pickup'
                    ? 'bg-[#B69A62] text-[#0B241E] shadow-xs'
                    : 'text-[#EDE5D7]/80 hover:text-white'
                }`}
              >
                Pickup
              </button>
              <button
                type="button"
                onClick={() => setFulfilment('delivery')}
                className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                  fulfilment === 'delivery'
                    ? 'bg-[#B69A62] text-[#0B241E] shadow-xs'
                    : 'text-[#EDE5D7]/80 hover:text-white'
                }`}
              >
                Delivery
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[#EDE5D7]/80 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#B69A62]" />
              <span className="font-medium text-white">{selectedLocation}</span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-[11px]">
            <span className="text-[#B69A62] font-semibold">24/7 Hot Food & Fresh Tandoor</span>
            <span className="text-white/20">|</span>
            <a href="tel:+923026777908" className="hover:text-white flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#B69A62]" />
              <span>+92 302 6777908</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          {/* Brand Wordmark (Distinct, Premium Olive & Brass Logo) */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => handleNav('/')}
              className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A62]"
            >
              <span className="text-2xl sm:text-3xl font-display font-bold tracking-wider text-[#F7F3EA] group-hover:text-[#B69A62] transition-colors block leading-none">
                ZAYTOON
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#B69A62] font-medium block mt-1">
                Indus River Landmark · DG Khan
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#EDE5D7]/90">
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-white ${
                    isActive ? 'text-[#B69A62] font-semibold' : 'text-[#EDE5D7]/80'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B69A62]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone (Order Online, Table Reservation, Cart with total) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Table Reservation Button */}
            <button
              onClick={() => handleNav('/reservation')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#EDE5D7] hover:text-white bg-[#12372D] hover:bg-[#1A4336] rounded-lg transition-colors border border-[#1A4336]"
            >
              <span>Book a Table</span>
            </button>

            {/* Order Online Button */}
            <button
              onClick={() => handleNav('/menu')}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0B241E] bg-[#B69A62] hover:bg-[#c5a96f] rounded-lg transition-colors shadow-md"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Order Online</span>
            </button>

            {/* Quick Cart Trigger with Item Count & Total Amount */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2.5 px-3.5 py-2.5 bg-[#12372D] hover:bg-[#1A4336] text-[#F7F3EA] rounded-lg border border-[#B69A62]/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A62]"
              aria-label={`Open shopping cart with ${totalItems} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#B69A62]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-[#C0392B] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-bold font-display tabular-nums text-white">
                {subtotal > 0 ? `PKR ${subtotal.toLocaleString()}` : 'Cart'}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#EDE5D7] hover:bg-[#12372D] rounded-lg focus:outline-none"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B241E] border-t border-[#12372D] px-5 pt-4 pb-8 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
          {/* Mobile Fulfillment toggle */}
          <div className="grid grid-cols-2 gap-2 bg-[#12372D] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setFulfilment('pickup')}
              className={`py-2 text-xs font-semibold rounded text-center ${
                fulfilment === 'pickup'
                  ? 'bg-[#B69A62] text-[#0B241E]'
                  : 'text-[#EDE5D7]/80'
              }`}
            >
              Pickup Counter
            </button>
            <button
              type="button"
              onClick={() => setFulfilment('delivery')}
              className={`py-2 text-xs font-semibold rounded text-center ${
                fulfilment === 'delivery'
                  ? 'bg-[#B69A62] text-[#0B241E]'
                  : 'text-[#EDE5D7]/80'
              }`}
            >
              Highway Delivery
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`text-left py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
                  currentPath === link.path
                    ? 'bg-[#12372D] text-[#B69A62] font-semibold'
                    : 'text-[#EDE5D7] hover:bg-[#12372D]/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#12372D] flex flex-col gap-2">
            <button
              onClick={() => handleNav('/menu')}
              className="w-full text-center py-3 text-xs font-bold uppercase tracking-wider text-[#0B241E] bg-[#B69A62] rounded-lg"
            >
              Order Online Now
            </button>
            <button
              onClick={() => handleNav('/reservation')}
              className="w-full text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-[#EDE5D7] border border-[#EDE5D7]/30 rounded-lg"
            >
              Book Table at Terrace
            </button>
            <button
              onClick={() => handleNav('/track-order')}
              className="w-full text-center py-2 text-xs text-[#B69A62] hover:underline"
            >
              Track Existing Order →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
