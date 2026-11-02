import React from 'react';
import { Tag, Truck, Clock3, UtensilsCrossed, Sparkles } from 'lucide-react';

const updates = [
  { Icon: Tag, text: 'Discover Pakistani, Chinese and BBQ favourites' },
  { Icon: Truck, text: 'Enjoy a relaxed garden dining experience' },
  { Icon: UtensilsCrossed, text: 'Plan a family meal at Zaytoon Garden' },
  { Icon: Clock3, text: 'Near Shah Shams Toll Plaza, Multan' },
];

export const AnnouncementBar: React.FC = () => (
  <div className="relative isolate overflow-hidden border-b border-white/10 bg-[#171717] py-2.5 text-white">
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#171717] to-transparent sm:w-16"/>
    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#171717] to-transparent sm:w-16"/>
    <style>{`@keyframes zaytoonTicker { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } } .zaytoon-ticker-track { display:flex; width:max-content; animation:zaytoonTicker 42s linear infinite; will-change:transform; } .zaytoon-ticker-track:hover { animation-play-state:paused; } @media(prefers-reduced-motion:reduce){.zaytoon-ticker-track{animation:none;transform:none;}} `}</style>
    <div className="zaytoon-ticker-track" aria-label="Zaytoon restaurant announcements">
      {[0,1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center">
          {updates.map(({Icon,text},index) => (
            <span key={index} className="mx-6 inline-flex items-center gap-2.5 whitespace-nowrap text-[9px] font-extrabold uppercase tracking-[.15em] text-white/85 sm:mx-9 sm:text-[10px]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#D71920] text-white"><Icon size={11}/></span>
              {text}
              <span className="ml-5 h-1 w-1 rounded-full bg-[#F4C542] sm:ml-8"/>
            </span>
          ))}
        </div>
      ))}
    </div>
    <span className="sr-only"><Sparkles/> Zaytoon restaurant updates</span>
  </div>
);
