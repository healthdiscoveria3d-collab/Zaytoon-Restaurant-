import React from 'react';
import { Tag, Truck, Clock3 } from 'lucide-react';

const updates = [
  { Icon: Tag, text: 'Discover delicious deals at Zaytoon' },
  { Icon: Truck, text: 'Pickup and delivery options available' },
  { Icon: Clock3, text: 'Fresh favourites, made for sharing' },
];

export const AnnouncementBar: React.FC = () => <div className="relative overflow-hidden bg-[#171717] py-2.5 text-white">
  <style>{`@keyframes zaytoonTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } } .zaytoon-ticker-track { display:flex; width:max-content; animation:zaytoonTicker 34s linear infinite; } .zaytoon-ticker-track:hover { animation-play-state:paused; } @media(prefers-reduced-motion:reduce){.zaytoon-ticker-track{animation:none;transform:none;}}`}</style>
  <div className="zaytoon-ticker-track" aria-label="Zaytoon restaurant updates">{[0,1].map((copy) => <div key={copy} className="flex shrink-0 items-center">{updates.map(({Icon,text},index) => <span key={index} className="mx-7 inline-flex items-center gap-2 whitespace-nowrap text-[9px] font-extrabold uppercase tracking-[.16em] text-white/90 sm:text-[10px]"><Icon size={13} className="text-[#F4C542]"/>{text}<span className="ml-7 h-1 w-1 rounded-full bg-[#D71920]"/></span>)}</div>)}</div>
</div>;
