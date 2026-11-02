import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, MapPin, Phone, UserRound } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface HeaderProps { currentPath: string; navigate: (path: string) => void; }

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { totalItems, subtotal, openCart, fulfilment, setFulfilment, selectedLocation } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  useEffect(() => { fetch('/api/v1/site-settings/public').then(r => r.json()).then(result => { setLogoUrl(String(result.data?.logoUrl || '')); }).catch(() => setLogoUrl('')); }, []);
  useEffect(() => { const onScroll = () => setIsScrolled(window.scrollY > 8); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  const links = [{label:'Home',path:'/'},{label:'Menu',path:'/menu'},{label:'Deals',path:'/deals'},{label:'About',path:'/about'},{label:'Gallery',path:'/gallery'},{label:'Contact',path:'/contact'}];
  const go = (path:string) => { navigate(path); setMobileMenuOpen(false); window.scrollTo({top:0,behavior:'smooth'}); };
  return <header className={'sticky top-0 z-40 bg-white text-[#171717] transition-shadow ' + (isScrolled ? 'shadow-lg' : 'shadow-sm')}>
    <div className="hidden bg-[#171717] px-5 py-2 text-[10px] font-bold text-white sm:block"><div className="mx-auto flex max-w-7xl items-center justify-between"><div className="flex items-center gap-2 text-white/80"><MapPin size={13} className="text-[#F4C542]"/>{selectedLocation}</div><a href="tel:+923026777908" className="flex items-center gap-2 hover:text-[#F4C542]"><Phone size={13}/> +92 302 6777908</a></div></div>
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="shrink-0 rounded-full p-2 text-[#D71920] hover:bg-red-50 xl:hidden" aria-label="Toggle menu">{mobileMenuOpen?<X size={19}/>:<MenuIcon size={19}/>}</button>
        <button onClick={() => go('/')} className="flex min-w-0 shrink-0 items-center gap-2 text-left">{logoUrl ? <img src={logoUrl} alt="Zaytoon logo" className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"/> : <span aria-hidden="true" className="h-10 w-10 shrink-0 sm:h-11 sm:w-11"/>}<span><span className="block text-base font-black uppercase leading-none tracking-tight sm:text-2xl">ZAYTOON RESTAURANT</span><span className="mt-1 block whitespace-nowrap text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#D71920] sm:text-[11px] sm:tracking-[0.2em]">DG Khan</span></span></button>
      </div>
      <nav className="hidden items-center gap-5 xl:flex">{links.map(link => <button key={link.path} onClick={() => go(link.path)} className={'relative py-2 text-[10px] font-black uppercase tracking-wide text-[#D71920] transition hover:text-[#a90f18] ' + (currentPath===link.path || (link.path!=='/' && currentPath.startsWith(link.path)) ? 'text-[#a90f18]' : 'text-[#D71920]')}>{link.label}{(currentPath===link.path || (link.path!=='/' && currentPath.startsWith(link.path))) && <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-[#D71920]"/>}</button>)}</nav>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden items-center rounded-full border border-gray-200 p-1 lg:flex"><button onClick={() => setFulfilment('pickup')} className={'rounded-full px-2.5 py-2 text-[9px] font-black uppercase '+(fulfilment==='pickup'?'bg-[#171717] text-white':'text-gray-600 hover:bg-gray-100')}>Pickup</button><button onClick={() => setFulfilment('delivery')} className={'rounded-full px-2.5 py-2 text-[9px] font-black uppercase '+(fulfilment==='delivery'?'bg-[#171717] text-white':'text-gray-600 hover:bg-gray-100')}>Delivery</button></div>
        <button onClick={() => go('/account')} aria-label="My Account" className={'hidden h-10 items-center gap-2 rounded-full border px-3 text-[10px] font-black uppercase transition md:flex '+(currentPath==='/account'?'border-[#D71920] text-[#D71920]':'border-gray-200 hover:border-[#D71920] hover:text-[#D71920]')}><UserRound size={16}/><span>My Account</span></button>
        <button onClick={() => go('/menu')} className="hidden rounded-full bg-[#D71920] px-4 py-3 text-[9px] font-black uppercase tracking-wide text-white transition hover:bg-[#b5121b] md:block">Order now</button>
        <button onClick={openCart} aria-label="Open shopping cart" className="relative flex h-10 items-center gap-2 rounded-full border border-gray-200 px-3 font-extrabold transition hover:border-[#D71920]"><ShoppingBag size={17}/><span className="hidden text-[10px] sm:inline">PKR {subtotal.toLocaleString()}</span>{totalItems>0 && <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#D71920] px-1 text-[10px] font-black text-white">{totalItems}</span>}</button>
      </div>
    </div>
    {mobileMenuOpen && <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-xl xl:hidden"><div className="grid grid-cols-1 gap-2">{links.map(link=><button key={link.path} onClick={()=>go(link.path)} className={'rounded-xl px-3 py-3 text-left text-[11px] font-extrabold uppercase '+(currentPath===link.path?'bg-red-50 text-[#a90f18]':'bg-gray-50 text-[#D71920]')}>{link.label}</button>)}</div><button onClick={()=>go('/reservation')} className="mt-3 w-full rounded-full bg-[#D71920] py-3 text-[11px] font-black uppercase text-white shadow-sm hover:bg-[#b5121b]">Book a table</button></div>}
  </header>;
};
