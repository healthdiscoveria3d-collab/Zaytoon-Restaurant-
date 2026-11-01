import React from 'react';
import { ArrowRight, Flame, MapPin, ShoppingBag, Truck, Utensils, Clock3, ChevronRight } from 'lucide-react';
import { initialCategories, initialMenuItems, initialDeals } from '../data/initialData.ts';
import { useCart } from '../context/CartContext.tsx';

interface HomePageProps { navigate: (path: string) => void; }

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { addToCart } = useCart();
  const featuredItems = initialMenuItems.filter((item) => item.isFeatured).slice(0, 4);
  const featuredDeal = initialDeals[0];

  return (
    <div className="bg-white text-[#171717]">
      <section className="relative isolate min-h-[590px] overflow-hidden bg-[#151515] lg:min-h-[660px]">
        <img src={initialCategories[0].image} alt="Zaytoon signature food" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="mx-auto flex min-h-[590px] max-w-7xl items-center px-5 py-16 sm:px-8 lg:min-h-[660px]">
          <div className="max-w-2xl text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-sm bg-[#D71920] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em]"><Flame size={15}/> Made for big appetites</div>
            <h1 className="text-5xl font-black uppercase leading-[0.94] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Good food.<br/><span className="text-[#F4C542]">Great company.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/85 sm:text-lg">Bring your people together over Pakistani favourites, BBQ and satisfying meals at Zaytoon.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('/menu')} className="inline-flex items-center gap-3 rounded-sm bg-[#D71920] px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-[#b5121b]">Order online <ArrowRight size={18}/></button>
              <button onClick={() => navigate('/deals')} className="rounded-sm border-2 border-white px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-black">View deals</button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[11px] font-extrabold uppercase tracking-wider text-white/80">
              <span className="flex items-center gap-2"><Utensils size={15} className="text-[#F4C542]"/> Pakistani menu</span>
              <span className="flex items-center gap-2"><ShoppingBag size={15} className="text-[#F4C542]"/> Online ordering</span>
              <span className="flex items-center gap-2"><MapPin size={15} className="text-[#F4C542]"/> Ghazi Ghat, DG Khan</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 hidden h-2 w-1/3 bg-[#D71920] lg:block"/>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl divide-y divide-gray-200 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          <div className="flex items-center gap-4 py-5 sm:px-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red-50 text-[#D71920]"><ShoppingBag size={21}/></span><div><p className="text-sm font-black uppercase">Easy ordering</p><p className="mt-1 text-xs text-gray-500">Choose from the menu online</p></div></div>
          <div className="flex items-center gap-4 py-5 sm:px-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red-50 text-[#D71920]"><Truck size={21}/></span><div><p className="text-sm font-black uppercase">Pickup or delivery</p><p className="mt-1 text-xs text-gray-500">Select your order preference</p></div></div>
          <div className="flex items-center gap-4 py-5 sm:px-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red-50 text-[#D71920]"><Clock3 size={21}/></span><div><p className="text-sm font-black uppercase">Meals to share</p><p className="mt-1 text-xs text-gray-500">Find something for everyone</p></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#D71920]">Explore the menu</p><h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">What are you craving?</h2></div><button onClick={() => navigate('/menu')} className="hidden items-center gap-2 text-xs font-black uppercase tracking-wide text-[#D71920] sm:flex">Full menu <ArrowRight size={16}/></button></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {initialCategories.map((category) => <button key={category.id} onClick={() => navigate('/menu/' + category.slug)} className="group overflow-hidden rounded-md bg-[#f5f5f5] text-left transition hover:-translate-y-1 hover:shadow-lg"><div className="h-28 overflow-hidden sm:h-36"><img src={category.image} alt={category.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110"/></div><div className="flex min-h-[66px] items-center justify-between gap-2 p-3"><span className="text-xs font-black uppercase leading-tight sm:text-sm">{category.name}</span><ChevronRight size={16} className="shrink-0 text-[#D71920]"/></div></button>)}
        </div>
        <button onClick={() => navigate('/menu')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm border-2 border-black py-3 text-xs font-black uppercase sm:hidden">View full menu <ArrowRight size={16}/></button>
      </section>

      <section className="bg-[#f5f5f5] py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#D71920]">Customer favourites</p><h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">Popular right now</h2></div><button onClick={() => navigate('/menu')} className="hidden items-center gap-2 text-xs font-black uppercase tracking-wide text-[#D71920] sm:flex">See full menu <ArrowRight size={16}/></button></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredItems.map((item) => <article key={item.id} className="flex flex-col overflow-hidden rounded-md bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="relative h-56 overflow-hidden bg-gray-100"><img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 hover:scale-105"/><span className="absolute left-3 top-3 rounded-sm bg-[#D71920] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">Popular</span></div><div className="flex flex-1 flex-col p-5"><p className="text-[10px] font-black uppercase tracking-widest text-[#D71920]">{item.categoryName}</p><h3 className="mt-2 min-h-12 text-lg font-extrabold leading-tight">{item.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">{item.description}</p><div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4"><span className="text-lg font-black">PKR {item.price.toLocaleString()}</span><button onClick={() => addToCart(item, 1)} className="rounded-sm bg-[#D71920] px-4 py-2.5 text-xs font-black uppercase text-white transition hover:bg-[#b5121b]">Add +</button></div></div></article>)}
          </div>
        </div>
      </section>

      {featuredDeal && <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20"><div className="grid overflow-hidden rounded-md bg-[#171717] text-white md:grid-cols-2"><div className="relative min-h-64 bg-gray-800"><img src={featuredDeal.image} alt={featuredDeal.title} className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-black/20"/></div><div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14"><p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#F4C542]">A deal worth sharing</p><h2 className="mt-3 text-3xl font-black uppercase leading-tight sm:text-4xl">{featuredDeal.title}</h2><p className="mt-4 text-sm leading-6 text-white/75">{featuredDeal.shortDescription}</p><div className="mt-6 flex items-center gap-4"><span className="text-3xl font-black text-[#F4C542]">PKR {featuredDeal.offerPrice.toLocaleString()}</span><span className="text-sm text-white/50 line-through">PKR {featuredDeal.originalPrice.toLocaleString()}</span></div><button onClick={() => navigate('/deals/' + featuredDeal.slug)} className="mt-7 inline-flex w-fit items-center gap-3 rounded-sm bg-[#D71920] px-6 py-4 text-xs font-black uppercase text-white hover:bg-[#b5121b]">Explore this deal <ArrowRight size={18}/></button></div></div></section>}

      <section className="bg-[#D71920] px-5 py-14 text-center text-white sm:px-8"><p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/75">Make it a Zaytoon meal</p><h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black uppercase leading-tight sm:text-5xl">Your table is waiting.</h2><button onClick={() => navigate('/menu')} className="mt-7 inline-flex items-center gap-3 rounded-sm bg-white px-8 py-4 text-xs font-black uppercase text-[#D71920] transition hover:bg-black hover:text-white">Order online <ArrowRight size={18}/></button></section>
    </div>
  );
};
