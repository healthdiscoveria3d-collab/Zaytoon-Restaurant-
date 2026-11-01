import React from 'react';
import { Tag, Truck, Clock3 } from 'lucide-react';

const updates = [
  { icon: <Tag size={13}/>, text: 'Discover delicious deals at Zaytoon' },
  { icon: <Truck size={13}/>, text: 'Pickup and delivery options available' },
  { icon: <Clock3 size={13}/>, text: 'Fresh favourites, made for sharing' },
];

export const AnnouncementBar: React.FC = () => <div className="relative overflow-hidden bg-[#171717] py-2.5 text-white">
  <style>{`@keyframes zaytoonTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } } .zaytoon-ticker-track { display:flex; width:max-content; animation:zaytoonTicker 34s linear infinite; } .zaytoon-ticker-track:hover { animation-play-state:paused; } @media(prefers-reduced-motion:reduce){.zaytoon-ticker-track{animation:none;transform:none;}}`}</style>
  <div className="zaytoon-ticker-track" aria-label="Zaytoon restaurant updates">{[0,1].map((copy) => <div key={copy} className="flex shrink-0 items-center">{updates.map((item,index) => <span key={index} className="mx-7 inline-flex items-center gap-2 whitespace-nowrap text-[9px] font-extrabold uppercase tracking-[.16em] text-white/90 sm:text-[10px]">{React.cloneElement(item.icon,{className:"text-[#F4C542]"})}{item.text}<span className="ml-7 h-1 w-1 rounded-full bg-[#D71920]"/></span>)}</div>)}</div>
</div>;
