import React, { useEffect, useState } from 'react';
import { ArrowRight, Flame, MapPin, ShoppingBag, Utensils, Clock3, Star, Plus, Tag, ChefHat } from 'lucide-react';
import { initialCategories, initialMenuItems, initialDeals } from '../data/initialData.ts';
import { useCart } from '../context/CartContext.tsx';

interface HomePageProps { navigate: (path: string) => void; }

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState(initialCategories);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [deals, setDeals] = useState(initialDeals);
  useEffect(() => {
    Promise.all([fetch('/api/v1/menu/categories').then(r => r.json()), fetch('/api/v1/menu/items').then(r => r.json()), fetch('/api/v1/deals/active').then(r => r.json())])
      .then(([categoryResult, itemResult, dealResult]) => {
        if (categoryResult.success && Array.isArray(categoryResult.data)) setCategories(categoryResult.data);
        if (itemResult.success && Array.isArray(itemResult.data)) setMenuItems(itemResult.data);
        if (dealResult.success && Array.isArray(dealResult.data)) setDeals(dealResult.data);
      }).catch(() => {});
  }, []);
  const featuredItems = menuItems.filter((item) => item.isFeatured).slice(0, 4);
  const featuredDeal = deals[0];

  return (
    <div className="overflow-hidden bg-white text-[#171717]">
      <section className="relative isolate min-h-[560px] overflow-hidden bg-[#111] sm:min-h-[630px]">
        <img src="/images/deal_special_family_platter.jpg" alt="Zaytoon family food platter" className="absolute inset-0 -z-20 h-full w-full object-cover object-center"/>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/20"/>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
        <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-16 sm:min-h-[630px] sm:px-8 lg:px-12">
          <div className="max-w-2xl text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] backdrop-blur"><Flame size={14} className="text-[#F4C542]"/> Fresh from our kitchen</div>
            <h1 className="text-5xl font-black uppercase leading-[.92] tracking-[-.055em] sm:text-7xl lg:text-[82px]">Big flavours.<br/><span className="text-[#F4C542]">Better moments.</span></h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-white/80 sm:text-lg">From sizzling BBQ to Pakistani favourites, bring everyone together around a table full of flavour.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('/menu')} className="inline-flex items-center gap-3 rounded-full bg-[#D71920] px-7 py-4 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-1 hover:bg-[#b5121b]">Explore menu <ArrowRight size={17}/></button>
              <button onClick={() => navigate('/deals')} className="rounded-full border border-white/70 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-wider text-white backdrop-blur transition hover:bg-white hover:text-black">View latest deals</button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-wider text-white/75"><span className="flex items-center gap-2"><Utensils size={14} className="text-[#F4C542]"/> Pakistani favourites</span><span className="flex items-center gap-2"><ShoppingBag size={14} className="text-[#F4C542]"/> Easy online ordering</span><span className="flex items-center gap-2"><MapPin size={14} className="text-[#F4C542]"/> Ghazi Ghat, DG Khan</span></div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 hidden h-1.5 w-1/3 bg-[#D71920] sm:block"/>
      </section>

      <section className="relative z-10 mx-auto -mt-7 max-w-7xl px-5 sm:px-8">
        <div className="grid overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-black/[.06] sm:grid-cols-3">
          <button onClick={() => navigate('/menu')} className="group flex items-center gap-4 border-b border-gray-100 p-5 text-left transition hover:bg-red-50/60 sm:border-b-0 sm:border-r sm:p-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-[#D71920] transition group-hover:bg-[#D71920] group-hover:text-white"><ShoppingBag size={21}/></span><span className="min-w-0 flex-1"><span className="block text-xs font-black uppercase tracking-wide">Order online</span><span className="mt-1 block text-xs leading-5 text-gray-500">Choose your favourites</span></span><ArrowRight size={16} className="shrink-0 text-[#D71920] transition group-hover:translate-x-1"/></button>
          <button onClick={() => navigate('/deals')} className="group flex items-center gap-4 border-b border-gray-100 p-5 text-left transition hover:bg-red-50/60 sm:border-b-0 sm:border-r sm:p-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff7df] text-[#9b6c00] transition group-hover:bg-[#F4C542]"><Tag size={21}/></span><span className="min-w-0 flex-1"><span className="block text-xs font-black uppercase tracking-wide">Latest deals</span><span className="mt-1 block text-xs leading-5 text-gray-500">Find your next favourite offer</span></span><ArrowRight size={16} className="shrink-0 text-[#D71920] transition group-hover:translate-x-1"/></button>
          <button onClick={() => navigate('/reservation')} className="group flex items-center gap-4 p-5 text-left transition hover:bg-red-50/60 sm:p-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gray-100 text-[#171717] transition group-hover:bg-[#171717] group-hover:text-white"><Clock3 size={21}/></span><span className="min-w-0 flex-1"><span className="block text-xs font-black uppercase tracking-wide">Book a table</span><span className="mt-1 block text-xs leading-5 text-gray-500">Plan your next visit</span></span><ArrowRight size={16} className="shrink-0 text-[#D71920] transition group-hover:translate-x-1"/></button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-2 text-[10px] font-black uppercase tracking-[.22em] text-[#D71920]">Find your favourite</p><h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">What are you craving?</h2></div><button onClick={() => navigate('/menu')} className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-wide text-[#D71920] sm:flex">Full menu <ArrowRight size={16}/></button></div>
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {categories.map((category) => <button key={category.id} onClick={() => navigate('/menu/' + category.slug)} className="group flex flex-col items-center gap-3 rounded-2xl px-1 py-2 text-center transition hover:-translate-y-1"><div className="h-24 w-24 overflow-hidden rounded-full border-[5px] border-[#f5f5f5] shadow-md ring-1 ring-black/5 sm:h-32 sm:w-32"><img src={category.image} alt={category.name} className="h-full w-full rounded-full object-cover transition duration-500 group-hover:scale-110"/></div><span className="max-w-[110px] text-[10px] font-black uppercase leading-tight sm:max-w-none sm:text-xs">{category.name}</span></button>)}
        </div>
        <button onClick={() => navigate('/menu')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 py-3 text-[10px] font-black uppercase sm:hidden">View full menu <ArrowRight size={15}/></button>
      </section>

      <section className="bg-[#f7f7f7] py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-2 text-[10px] font-black uppercase tracking-[.22em] text-[#D71920]">Picked for you</p><h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">Fan favourites</h2><p className="mt-2 text-sm text-gray-500">The dishes everyone comes back for.</p></div><button onClick={() => navigate('/menu')} className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-wide text-[#D71920] sm:flex">See full menu <ArrowRight size={16}/></button></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredItems.map((item) => <article key={item.id} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="relative h-56 overflow-hidden bg-gray-100"><img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#D71920]"><Star size={11} fill="currentColor"/> Popular</span></div><div className="flex flex-1 flex-col p-5"><p className="text-[9px] font-black uppercase tracking-widest text-[#D71920]">{item.categoryName}</p><h3 className="mt-2 min-h-12 text-base font-extrabold leading-tight">{item.name}</h3><p className="mt-2 line-clamp-2 text-xs leading-6 text-gray-500">{item.description}</p><div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4"><span className="text-base font-black">PKR {item.price.toLocaleString()}</span><button onClick={() => addToCart(item, 1)} aria-label={'Add '+item.name+' to cart'} className="grid h-10 w-10 place-items-center rounded-full bg-[#D71920] text-white transition hover:rotate-90 hover:bg-[#171717]"><Plus size={19}/></button></div></div></article>)}
          </div>
        </div>
      </section>

      {featuredDeal && <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20"><div className="grid overflow-hidden rounded-[26px] bg-[#171717] text-white shadow-xl md:grid-cols-2"><div className="relative min-h-64 bg-gray-800"><img src={featuredDeal.image} alt={featuredDeal.title} className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-black/15"/><span className="absolute left-5 top-5 rounded-full bg-[#F4C542] px-4 py-2 text-[10px] font-black uppercase tracking-wider text-black"><Tag size={12} className="mr-1 inline"/> Limited deal</span></div><div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14"><p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-[#F4C542]"><ChefHat size={15}/> Made to bring people together</p><h2 className="mt-3 text-3xl font-black uppercase leading-tight sm:text-4xl">{featuredDeal.title}</h2><p className="mt-4 text-sm leading-6 text-white/70">{featuredDeal.shortDescription}</p><div className="mt-6 flex items-center gap-4"><span className="text-3xl font-black text-[#F4C542]">PKR {featuredDeal.offerPrice.toLocaleString()}</span><span className="text-sm text-white/40 line-through">PKR {featuredDeal.originalPrice.toLocaleString()}</span></div><button onClick={() => navigate('/deals/' + featuredDeal.slug)} className="mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-[#D71920] px-7 py-4 text-[10px] font-black uppercase text-white transition hover:bg-white hover:text-black">Explore this deal <ArrowRight size={17}/></button></div></div></section>}

      <section className="relative isolate overflow-hidden px-5 py-20 text-center text-white sm:px-8 sm:py-24"><img src="/images/restaurant_interior.jpg" alt="Zaytoon restaurant dining area" className="absolute inset-0 -z-20 h-full w-full object-cover object-center"/><div className="absolute inset-0 -z-10 bg-black/70"/><p className="text-[10px] font-black uppercase tracking-[.22em] text-[#F4C542]">Your next meal starts here</p><h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black uppercase leading-tight sm:text-5xl">Good times are served at Zaytoon.</h2><div className="mt-7 flex flex-wrap justify-center gap-3"><button onClick={() => navigate('/reservation')} className="inline-flex items-center gap-3 rounded-full bg-[#D71920] px-8 py-4 text-[10px] font-black uppercase text-white transition hover:bg-white hover:text-black">Book your table <ArrowRight size={16}/></button><button onClick={() => navigate('/menu')} className="rounded-full border border-white/70 px-8 py-4 text-[10px] font-black uppercase text-white transition hover:bg-white hover:text-black">Order online</button></div></section>
    </div>
  );
};
