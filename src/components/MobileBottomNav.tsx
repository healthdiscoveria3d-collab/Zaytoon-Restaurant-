import React from 'react';
import { Home, UtensilsCrossed, Tag, UserRound } from 'lucide-react';

interface MobileBottomNavProps { currentPath: string; navigate: (path: string) => void; }

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPath, navigate }) => {
  const handleNav = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#171717] border-t border-[#D71920] px-3 py-1.5 shadow-2xl">
      <div className="grid grid-cols-4 items-center justify-around text-[10px] font-medium text-[#F4F4F4]/75">
        <button onClick={() => handleNav('/')} className={`flex flex-col items-center py-1 ${currentPath === '/' ? 'text-[#F4C542] font-semibold' : 'hover:text-white'}`}><Home className="w-4 h-4 mb-0.5" /><span>Home</span></button>
        <button onClick={() => handleNav('/menu')} className={`flex flex-col items-center py-1 ${currentPath.startsWith('/menu') ? 'text-[#F4C542] font-semibold' : 'hover:text-white'}`}><UtensilsCrossed className="w-4 h-4 mb-0.5" /><span>Menu</span></button>
        <button onClick={() => handleNav('/deals')} className={`flex flex-col items-center py-1 ${currentPath.startsWith('/deals') ? 'text-[#F4C542] font-semibold' : 'hover:text-white'}`}><Tag className="w-4 h-4 mb-0.5" /><span>Deals</span></button>
        <button onClick={() => handleNav('/account')} className={`flex flex-col items-center py-1 ${currentPath === '/account' || currentPath.startsWith('/track-order') ? 'text-[#F4C542] font-semibold' : 'hover:text-white'}`}><UserRound className="w-4 h-4 mb-0.5" /><span>Account</span></button>
      </div>
    </div>
  );
};