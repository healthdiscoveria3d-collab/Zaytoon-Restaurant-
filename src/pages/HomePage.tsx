import React from 'react';
import { ArrowRight, Flame, MapPin, ShoppingBag, Star, Truck, Utensils, Clock3 } from 'lucide-react';
import { initialCategories, initialMenuItems, initialDeals } from '../data/initialData.ts';
import { useCart } from '../context/CartContext.tsx';

interface HomePageProps { navigate: (path: string) => void; }

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { addToCart } = useCart();
  const featuredItems = initialMenuItems.filter((item) => item.isFeatured).slice(0, 4);
  const featuredDeal = initialDeals[0];

  return (
    <div className="bg-white text-[#171717]">
      <section className="relative min-h-[560px] lg:min-h-[650px] overflow-hidden bg-[#171717]">
        <img src={initialCategories[0].image} alt="Zaytoon Pakistani food" className="absolute inset-0 h-full w-full object-cover opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-16 sm:px-8 lg:min-h-[650px]">
          <div className="max-w-2xl text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#D71920] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em]">
              <Flame size={15} /> Zaytoon favourites
            </div>
            <h1 className="max-w-2xl text-5xl font-black uppercase leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Big taste.<br /><span className="text-[#F4C542]">Big moments.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Bring everyone to the table with Pakistani favourites, freshly prepared for your next meal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('/menu')} className="inline-flex items-center gap-3 rounded-md bg-[#D71920] px-7 py-4 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#b5121b]">
                Order now <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/deals')} className="rounded-md border-2 border-white px-7 py-4 text-sm font-extrabold uppercase tracking-wider text-white transition hover:bg-white hover:text-black">
                Explore deals
              </button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-bold uppercase tracking-wider text-white/80">
              <span className="flex items-center gap-2"><Utensils size={15} className="text-[#F4C542]" /> Pakistani favourites</span>
              <span className="flex items-center gap-2"><ShoppingBag size={15} className="text-[#F4C542]" /> Easy online ordering</span>
              <span className="flex items-center gap-2"><MapPin size={15} className="text-[#F4C542]" /> Dera Ghazi Khan</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 hidden h-3 w-1/3 bg-[#D71920] lg:block" />
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-gray-200 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          <div className="flex items-center gap-4 py-5 sm:px-6"><span className="grid h-12 w-12 place-items-center rounded-full bg-red-50 text-[#D71920]"><ShoppingBag /></span><div><p className="font-extrabold uppercase">Order online</p><p className="text-sm text-gray-500">Browse the menu and add to cart</p></div></div>
          <div className="flex items-center gap-4 py-5 sm:px-6"><span className="grid h-12 w-12 place-items-center rounded-full bg-red-50 text-[#D71920]"><Truck /></span><div><p className="font-extrabold uppercase">Pickup or delivery</p><p className="text-sm text-gray-500">Choose your preferred option</p></div></div>
          <div className="flex items-center gap-4 py-5 sm:px-6"><span className="grid h-12 w-12 place-items-center rounded-full bg-red-50 text-[#D71920]"><Clock3 /></span><div><p className="font-extrabold uppercase">Made for sharing</p><p className="text-sm text-gray-500">Meals for family and friends</p></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#D71920]">Find your flavour</p><h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">Explore menu</h2></div>
          <button onClick={() => navigate('/menu')} className="hidden items-center gap-2 text-sm font-extrabold uppercase text-[#D71920] sm:flex">View all <ArrowRight size={17} /></button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {initialCategories.map((category) => (
            <button key={category.id} onClick={() => navigate('/menu/' + category.slug)} className="group overflow-hidden rounded-xl bg-[#f5f5f5] text-left transition hover:-translate-y-1 hover:shadow-xl">
              <div className="h-32 overflow-hidden sm:h-36"><img src={category.image} alt={category.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" /></div>
              <div className="flex min-h-[76px] items-center justify-between gap-2 p-3"><span className="text-sm font-extrabold uppercase leading-tight">{category.name}</span><ArrowRight size={16} className="shrink-0 text-[#D71920]" /></div>
            </button>
          ))}
        </div>
        <button onClick={() => navigate('/menu')} className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border-2 border-black py-4 text-sm font-extrabold uppercase sm:hidden">View full menu <ArrowRight size={17} /></button>
      </section>

      <section className="bg-[#f5f5f5] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#D71920]">Worth coming back for</p><h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">Fan favourites</h2></div><button onClick={() => navigate('/menu')} className="hidden items-center gap-2 text-sm font-extrabold uppercase text-[#D71920] sm:flex">Full menu <ArrowRight size={17} /></button></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-56 overflow-hidden"><img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />{item.isFeatured && <span className="absolute left-3 top-3 rounded bg-[#D71920] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">Popular</span>}</div>
                <div className="p-5"><p className="text-[10px] font-black uppercase tracking-widest text-[#D71920]">{item.categoryName}</p><h3 className="mt-2 min-h-12 text-lg font-extrabold leading-tight">{item.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">{item.description}</p><div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4"><span className="text-lg font-black">PKR {item.price.toLocaleString()}</span><button onClick={() => addToCart(item, 1)} className="rounded-md bg-[#D71920] px-4 py-2.5 text-xs font-extrabold uppercase text-white transition hover:bg-[#b5121b]">Add +</button></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {featuredDeal && <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20"><div className="grid overflow-hidden rounded-2xl bg-[#171717] text-white md:grid-cols-2"><div className="relative min-h-64"><img src={featuredDeal.image} alt={featuredDeal.title} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" /></div><div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#F4C542]">Limited time deal</p><h2 className="mt-3 text-3xl font-black uppercase leading-tight sm:text-4xl">{featuredDeal.title}</h2><p className="mt-4 text-sm leading-6 text-white/75">{featuredDeal.shortDescription}</p><div className="mt-6 flex items-center gap-4"><span className="text-3xl font-black text-[#F4C542]">PKR {featuredDeal.offerPrice.toLocaleString()}</span><span className="text-sm text-white/50 line-through">PKR {featuredDeal.originalPrice.toLocaleString()}</span></div><button onClick={() => navigate('/deals/' + featuredDeal.slug)} className="mt-7 inline-flex w-fit items-center gap-3 rounded-md bg-[#D71920] px-6 py-4 text-sm font-extrabold uppercase text-white hover:bg-[#b5121b]">See this deal <ArrowRight size={18} /></button></div></div></section>}

      <section className="bg-[#D71920] px-5 py-14 text-center text-white sm:px-8"><p className="text-xs font-black uppercase tracking-[0.2em] text-white/75">Your next meal starts here</p><h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black uppercase leading-tight sm:text-5xl">Ready to make it a Zaytoon meal?</h2><button onClick={() => navigate('/menu')} className="mt-7 inline-flex items-center gap-3 rounded-md bg-white px-8 py-4 text-sm font-black uppercase text-[#D71920] transition hover:bg-black hover:text-white">Order online <ArrowRight size={18} /></button></section>
    </div>
  );
};
