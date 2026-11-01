import React from 'react';
import { Home, UtensilsCrossed, Tag, ShoppingBag, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface MobileBottomNavProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPath, navigate }) => {
  const { totalItems, openCart } = useCart();

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0B241E] border-t border-[#12372D] px-2 py-1.5 shadow-2xl">
      <div className="grid grid-cols-5 items-center justify-around text-[10px] font-medium text-[#EDE5D7]/75">
        {/* Home */}
        <button
          onClick={() => handleNav('/')}
          className={`flex flex-col items-center py-1 transition-colors ${
            currentPath === '/' ? 'text-[#B69A62] font-semibold' : 'hover:text-white'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        {/* Menu */}
        <button
          onClick={() => handleNav('/menu')}
          className={`flex flex-col items-center py-1 transition-colors ${
            currentPath.startsWith('/menu') ? 'text-[#B69A62] font-semibold' : 'hover:text-white'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 mb-0.5" />
          <span>Menu</span>
        </button>

        {/* Deals */}
        <button
          onClick={() => handleNav('/deals')}
          className={`flex flex-col items-center py-1 transition-colors ${
            currentPath.startsWith('/deals') ? 'text-[#B69A62] font-semibold' : 'hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4 mb-0.5" />
          <span>Deals</span>
        </button>

        {/* Cart with Drawer Trigger */}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center py-1 text-[#EDE5D7] hover:text-white transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 mb-0.5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#B69A62] text-[#0B241E] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                {totalItems}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        {/* Track / Reserve */}
        <button
          onClick={() => handleNav('/track-order')}
          className={`flex flex-col items-center py-1 transition-colors ${
            currentPath.startsWith('/track-order') ? 'text-[#B69A62] font-semibold' : 'hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 mb-0.5" />
          <span>Track</span>
        </button>
      </div>
    </div>
  );
};
