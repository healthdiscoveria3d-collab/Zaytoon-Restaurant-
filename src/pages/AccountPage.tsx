import React from 'react';
import { ArrowRight, ClipboardList, CalendarDays, ShoppingBag, Headset, UserRound, MapPin } from 'lucide-react';

interface AccountPageProps { navigate: (path: string) => void; }

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => {
  const actions = [
    { icon: ClipboardList, title: 'Track an order', description: 'Check the latest status of an order using its reference number.', action: 'Track order', path: '/track-order' },
    { icon: CalendarDays, title: 'Table reservations', description: 'Make a new reservation or review your reservation details.', action: 'Book a table', path: '/reservation' },
    { icon: ShoppingBag, title: 'Browse the menu', description: 'Explore Pakistani favourites, BBQ, drinks and family deals.', action: 'Explore menu', path: '/menu' },
    { icon: Headset, title: 'Need help?', description: 'Contact the Zaytoon team for order and restaurant enquiries.', action: 'Contact us', path: '/contact' },
  ];
  return <div className="min-h-[70vh] bg-[#f7f7f7] px-4 py-10 sm:px-8 sm:py-16">
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-[26px] bg-[#171717] px-6 py-9 text-white shadow-xl sm:px-10 sm:py-12">
        <div className="flex items-center gap-3 text-[#F4C542]"><span className="grid h-11 w-11 place-items-center rounded-full bg-white/10"><UserRound size={21}/></span><span className="text-[10px] font-black uppercase tracking-[.22em]">Customer centre</span></div>
        <h1 className="mt-5 text-3xl font-black uppercase tracking-tight sm:text-5xl">My Account</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">Your quick access point for Zaytoon orders, reservations and customer support.</p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold text-white/80"><MapPin size={13} className="text-[#F4C542]"/> Zaytoon Restaurant · DG Khan</div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {actions.map(({icon:Icon,title,description,action,path}) => <button key={path} onClick={() => navigate(path)} className="group flex min-h-44 flex-col rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-red-100 hover:shadow-lg"><span className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-[#D71920]"><Icon size={21}/></span><span className="mt-4 text-base font-black">{title}</span><span className="mt-2 flex-1 text-xs leading-5 text-gray-500">{description}</span><span className="mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-[#D71920]">{action}<ArrowRight size={14} className="transition group-hover:translate-x-1"/></span></button>)}
      </div>
      <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"><p className="text-xs font-black uppercase tracking-wide">Ordering as a guest?</p><p className="mt-2 text-xs leading-6 text-gray-500">You can place an order without creating an account. Keep your order reference number to check its progress.</p><button onClick={() => navigate('/menu')} className="mt-4 rounded-full bg-[#D71920] px-6 py-3 text-[10px] font-black uppercase text-white transition hover:bg-[#171717]">Start an order</button></div>
    </div>
  </div>;
};
