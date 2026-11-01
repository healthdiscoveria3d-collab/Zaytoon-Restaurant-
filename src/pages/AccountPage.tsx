import React from 'react';
import { ArrowRight, ClipboardList, CalendarDays, ShoppingBag, Headset, UserRound, MapPin, ChevronRight, Clock3, UtensilsCrossed } from 'lucide-react';

interface AccountPageProps { navigate: (path: string) => void; }

const actions = [
  { icon: ClipboardList, eyebrow: 'Orders', title: 'Track your order', description: 'Follow an order using the reference number from your confirmation.', action: 'Track order', path: '/track-order' },
  { icon: CalendarDays, eyebrow: 'Reservations', title: 'Manage your visit', description: 'Start a table reservation or check the details of your booking.', action: 'Book a table', path: '/reservation' },
  { icon: ShoppingBag, eyebrow: 'Food & offers', title: 'Explore the menu', description: 'Browse the dishes, discover available deals and start an order.', action: 'View menu', path: '/menu' },
  { icon: Headset, eyebrow: 'Support', title: 'Contact Zaytoon', description: 'Get in touch with the restaurant for help and enquiries.', action: 'Get support', path: '/contact' },
];

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => (
  <div className="min-h-[75vh] bg-[#f6f6f6] px-4 py-8 sm:px-8 sm:py-14">
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        <button onClick={() => navigate('/')} className="hover:text-[#D71920]">Home</button><ChevronRight size={13}/><span className="text-[#D71920]">My Account</span>
      </div>
      <section className="relative isolate overflow-hidden rounded-[26px] bg-[#171717] px-6 py-9 text-white shadow-xl sm:px-10 sm:py-12">
        <div className="absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full border-[38px] border-white/[.035]"/>
        <div className="absolute -bottom-32 right-24 -z-10 h-64 w-64 rounded-full bg-[#D71920]/20 blur-3xl"/>
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#D71920] text-white shadow-lg shadow-red-950/30"><UserRound size={22}/></span>
            <div><p className="text-[9px] font-black uppercase tracking-[.24em] text-[#F4C542]">Customer centre</p><p className="mt-1 text-xs font-semibold text-white/55">Zaytoon Restaurant · DG Khan</p></div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-white/70"><MapPin size={12} className="text-[#F4C542]"/> Customer services</span>
        </div>
        <h1 className="mt-7 text-3xl font-black uppercase tracking-[-.04em] sm:text-5xl">My Account<span className="text-[#F4C542]">.</span></h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">Everything you need for your Zaytoon visit—orders, table reservations, menu and customer support.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button onClick={() => navigate('/menu')} className="inline-flex items-center gap-2 rounded-full bg-[#D71920] px-6 py-3.5 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-[#171717]">Start an order <ArrowRight size={15}/></button>
          <button onClick={() => navigate('/track-order')} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-white/10"><Clock3 size={14}/> Track an order</button>
        </div>
      </section>

      <div className="mb-5 mt-10 flex items-end justify-between gap-4">
        <div><p className="text-[9px] font-black uppercase tracking-[.22em] text-[#D71920]">Quick access</p><h2 className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">How can we help?</h2></div>
        <span className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:flex"><UtensilsCrossed size={14}/> Your Zaytoon hub</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map(({icon:Icon,eyebrow,title,description,action,path},index) => (
          <button key={path} onClick={() => navigate(path)} className="group relative flex min-h-[190px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl">
            <span className="absolute right-5 top-5 text-4xl font-black text-gray-100 transition group-hover:text-red-50">0{index+1}</span>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-[#D71920] transition group-hover:bg-[#D71920] group-hover:text-white"><Icon size={21}/></span>
            <span className="mt-5 text-[9px] font-black uppercase tracking-[.18em] text-[#D71920]">{eyebrow}</span>
            <span className="mt-1 text-lg font-black tracking-tight">{title}</span>
            <span className="mt-2 max-w-sm flex-1 text-xs leading-5 text-gray-500">{description}</span>
            <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-[#171717]">{action}<ArrowRight size={14} className="text-[#D71920] transition group-hover:translate-x-1"/></span>
          </button>
        ))}
      </div>
      <div className="mt-7 flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
        <div><p className="text-xs font-black uppercase tracking-wide">Ordering as a guest?</p><p className="mt-2 max-w-2xl text-xs leading-6 text-gray-500">You can place an order without creating a customer login. Keep your order reference number to check its progress.</p></div>
        <button onClick={() => navigate('/menu')} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#171717] px-6 py-3.5 text-[10px] font-black uppercase text-white transition hover:bg-[#D71920]">Browse menu <ArrowRight size={14}/></button>
      </div>
    </div>
  </div>
);
