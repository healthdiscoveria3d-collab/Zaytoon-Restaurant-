import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Clock,
  MapPin,
  Utensils,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Check,
  ShieldCheck,
  Phone,
  Flame,
  Award,
} from 'lucide-react';
import { initialCategories, initialMenuItems, initialDeals, initialSiteSettings } from '../data/initialData.ts';
import { MenuItem, Deal } from '../types/index.ts';
import { ItemModal } from '../components/ItemModal.tsx';
import { useCart } from '../context/CartContext.tsx';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { addToCart } = useCart();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Hero carousel slides (KFC-style dynamic promotional banner carousel)
  const heroSlides = [
    {
      id: 1,
      tag: 'WATERSIDE DINING · INDUS RIVER',
      headline: 'Authentic Handi Karahi & Charcoal BBQ on the Sindh River.',
      subtext: 'Dera Ghazi Khan’s oldest culinary landmark near Ghazi Ghat Toll Plaza on the N-70 Highway. Operating 24/7 with pure desi ghee cooking.',
      image: '/src/assets/images/hero_zaytoon_riverside_dining_1793524768913.jpg',
      ctaText: 'Explore Digital Menu',
      ctaAction: () => navigate('/menu'),
      secondaryText: 'Book a Table',
      secondaryAction: () => navigate('/reservation'),
    },
    {
      id: 2,
      tag: 'FAMILY BANQUET COMBO · SAVE 17%',
      headline: 'The Indus Grand Family Feast — Made for Gatherings.',
      subtext: 'Complete feast for 5-6 guests with half-kg Mutton Handi Karahi, Beef Seekh Kebabs, Dum Biryani, hot Roghni Naans & drinks.',
      image: '/src/assets/images/deal_special_family_platter_1793524770272.jpg',
      ctaText: 'Order Family Feast (PKR 5,150)',
      ctaAction: () => navigate('/deals/indus-grand-family-feast'),
      secondaryText: 'View All Deals',
      secondaryAction: () => navigate('/deals'),
    },
    {
      id: 3,
      tag: 'N-70 NATIONAL HIGHWAY · 24/7 TRANSIT STOP',
      headline: 'Round-The-Clock Food for Highway Travelers & Convoy Stops.',
      subtext: 'Sizzling chicken boti, piping hot clay tandoori kulcha, fresh mineral water, and steaming Karak Chai at any hour of the night.',
      image: '/src/assets/images/food_pakistani_karahi_bbq_1793524769923.jpg',
      ctaText: 'Highway Express Platter',
      ctaAction: () => navigate('/deals/highway-express-platter'),
      secondaryText: 'Directions & GPS',
      secondaryAction: () => navigate('/contact'),
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const featuredItems = initialMenuItems.filter((i) => i.isFeatured);
  const activeDeals = initialDeals;

  // Inline Quick Reservation State
  const [quickDate, setQuickDate] = useState(new Date().toISOString().split('T')[0]);
  const [quickTime, setQuickTime] = useState('20:30');
  const [quickGuests, setQuickGuests] = useState('4');

  const handleQuickReserve = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/reservation?date=${quickDate}&time=${quickTime}&guests=${quickGuests}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* 1. BOLD PROMOTIONAL HERO BANNER CAROUSEL (KFC Pakistan Commercial Appeal) */}
      <section className="relative bg-[#0B241E] text-white overflow-hidden min-h-[540px] sm:min-h-[620px] flex items-center">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Contrast Scrim */}
            <img
              src={slide.image}
              alt={slide.headline}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center brightness-[0.55] scale-102 transition-transform duration-10000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B241E] via-[#0B241E]/85 to-transparent sm:to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B241E] via-transparent to-transparent" />

            {/* Slide Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-20">
              <div className="max-w-2xl space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12372D]/90 border border-[#B69A62]/50 rounded text-xs font-bold text-[#B69A62] tracking-wider uppercase">
                  <Flame className="w-3.5 h-3.5 text-[#B69A62]" />
                  <span>{slide.tag}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-[#F7F3EA] leading-[1.12] text-balance">
                  {slide.headline}
                </h1>

                <p className="text-sm sm:text-base text-[#EDE5D7]/90 leading-relaxed max-w-xl">
                  {slide.subtext}
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-3.5">
                  <button
                    onClick={slide.ctaAction}
                    className="px-7 py-3.5 bg-[#B69A62] hover:bg-[#c5a96f] text-[#0B241E] font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={slide.secondaryAction}
                    className="px-6 py-3.5 bg-[#12372D]/90 hover:bg-[#1A4336] text-[#F7F3EA] font-semibold text-xs uppercase tracking-wider rounded-lg border border-[#EDE5D7]/30 transition-all flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#B69A62]" />
                    <span>{slide.secondaryText}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="p-2.5 rounded-full bg-black/40 hover:bg-[#12372D] text-white border border-white/20 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'w-7 bg-[#B69A62]' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="p-2.5 rounded-full bg-black/40 hover:bg-[#12372D] text-white border border-white/20 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 2. EXPLORE OUR MENU — VISUAL CATEGORY RAIL (KFC-Style Category Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#B69A62] font-semibold mb-1">
              Popular Categories
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#12372D]">
              Explore Our Digital Menu
            </h2>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#12372D] hover:text-[#B69A62] transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Image-Based Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {initialCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/menu/${cat.slug}`)}
              className="group bg-white rounded-xl overflow-hidden border border-[#EDE5D7] hover:border-[#B69A62] hover:shadow-lg transition-all text-left flex flex-col justify-between"
            >
              <div className="relative h-28 sm:h-32 w-full bg-[#EDE5D7] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {cat.badge && (
                  <span className="absolute top-2 right-2 bg-[#12372D] text-[#EDE5D7] text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {cat.badge}
                  </span>
                )}
              </div>

              <div className="p-3.5">
                <h3 className="font-display font-bold text-sm text-[#12372D] group-hover:text-[#B69A62] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-[#777B75] flex items-center gap-1 mt-0.5">
                  <span>Explore items</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS / CHEF'S FEATURED RAIL (KFC-Style Product Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B69A62] font-semibold mb-1">
              <Award className="w-4 h-4 text-[#B69A62]" />
              <span>Chef&apos;s Signature Selection</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#12372D]">
              Best Sellers & Specialties
            </h2>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#12372D] hover:text-[#B69A62] transition-colors"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl overflow-hidden border border-[#EDE5D7] hover:border-[#B69A62] hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 bg-[#EDE5D7] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  />
                  {item.priceNote === 'Retail MRP' ? (
                    <span className="absolute top-3 left-3 bg-[#0B241E] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Retail MRP
                    </span>
                  ) : (
                    <span className="absolute top-3 left-3 bg-[#B69A62] text-[#0B241E] text-[10px] font-bold px-2 py-0.5 rounded">
                      Featured Specialty
                    </span>
                  )}
                  {item.preparationTime && (
                    <span className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#B69A62]" />
                      <span>{item.preparationTime}</span>
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="text-[11px] uppercase tracking-wider text-[#777B75]">
                    {item.categoryName}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#12372D] leading-snug group-hover:text-[#B69A62] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#242824]/80 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-[#EDE5D7]/70 flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold font-display text-[#12372D] tabular-nums block">
                    PKR {item.price.toLocaleString()}
                  </span>
                  {item.priceNote && (
                    <span className="text-[10px] text-[#777B75] italic truncate block max-w-[140px]">
                      {item.priceNote}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="px-2.5 py-2 text-xs font-semibold text-[#12372D] hover:bg-[#EDE5D7]/50 rounded border border-[#EDE5D7]"
                  >
                    Customise
                  </button>
                  <button
                    onClick={() => addToCart(item, 1)}
                    className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-[#12372D] hover:bg-[#0B241E] text-white rounded transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL DEALS & CAMPAIGNS (Wide High-Impact Offer Banners) */}
      <section className="bg-[#12372D] text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#B69A62] font-semibold mb-1">
                Value Combos & Gatherings
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#F7F3EA]">
                Special Deals & Family Feasts
              </h2>
            </div>
            <button
              onClick={() => navigate('/deals')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B69A62] hover:text-white transition-colors"
            >
              <span>Explore All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activeDeals.slice(0, 2).map((deal) => (
              <div
                key={deal.id}
                className="bg-[#0B241E] border border-[#1A4336] rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              >
                <div className="md:w-5/12 relative h-56 md:h-auto bg-[#12372D]">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#C0392B] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md">
                    SAVE {deal.discountPercentage}%
                  </div>
                </div>

                <div className="md:w-7/12 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#B69A62]">
                      <span className="font-semibold">Serves {deal.serves}</span>
                      {deal.promoCode && <span className="font-mono">CODE: {deal.promoCode}</span>}
                    </div>
                    <h3 className="text-xl font-display font-bold text-[#F7F3EA] leading-tight">
                      {deal.title}
                    </h3>
                    <p className="text-xs text-[#EDE5D7]/80 line-clamp-2 leading-relaxed">
                      {deal.shortDescription}
                    </p>

                    <div className="space-y-1 pt-1">
                      {deal.includedItems.slice(0, 3).map((dish, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-[#EDE5D7]/70">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{dish}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#12372D] flex items-center justify-between">
                    <div>
                      <span className="text-xs line-through text-[#EDE5D7]/50 mr-2 tabular-nums">
                        PKR {deal.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xl font-bold font-display text-[#B69A62] tabular-nums">
                        PKR {deal.offerPrice.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/deals/${deal.slug}`)}
                      className="px-4 py-2 bg-[#B69A62] hover:bg-[#c5a96f] text-[#0B241E] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Order Deal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE ZAYTOON — HERITAGE & EXPERIENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs uppercase tracking-widest text-[#B69A62] font-semibold">
              Authentic Pakistani Hospitality
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#12372D] leading-tight text-balance">
              Dera Ghazi Khan&apos;s Historic Riverside Dining Landmark.
            </h2>
            <p className="text-sm sm:text-base text-[#242824]/85 leading-relaxed">
              {initialSiteSettings.aboutHistory}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-lg bg-white border border-[#EDE5D7] text-center">
                <span className="block text-2xl font-bold font-display text-[#12372D]">24/7</span>
                <span className="text-[11px] text-[#777B75] uppercase">Service Non-stop</span>
              </div>
              <div className="p-3.5 rounded-lg bg-white border border-[#EDE5D7] text-center">
                <span className="block text-2xl font-bold font-display text-[#12372D]">N-70</span>
                <span className="text-[11px] text-[#777B75] uppercase">Ghazi Ghat Toll</span>
              </div>
              <div className="p-3.5 rounded-lg bg-white border border-[#EDE5D7] text-center">
                <span className="block text-2xl font-bold font-display text-[#12372D]">100%</span>
                <span className="text-[11px] text-[#777B75] uppercase">Desi Butter / Ghee</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#12372D] hover:text-[#B69A62]"
              >
                <span>Read Full Zaytoon Heritage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="h-64 sm:h-80 rounded-xl overflow-hidden shadow-lg bg-[#EDE5D7]">
              <img
                src="/src/assets/images/restaurant_ambiance_interior_1793524770716.jpg"
                alt="Zaytoon Family Dining Pavilion"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-64 sm:h-80 rounded-xl overflow-hidden shadow-lg bg-[#EDE5D7] mt-8">
              <img
                src="/src/assets/images/hero_zaytoon_riverside_dining_1793524768913.jpg"
                alt="Indus River Sunset Dining"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. QUICK TABLE RESERVATION SECTION (Inline on Homepage) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EDE5D7] rounded-2xl p-8 sm:p-12 border border-[#B69A62]/40 shadow-sm">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
            <span className="text-xs uppercase tracking-widest text-[#B69A62] font-semibold">
              Plan Your Visit
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#12372D]">
              Reserve Your Riverside or Family Hall Table
            </h2>
            <p className="text-xs sm:text-sm text-[#242824]/80">
              Ensure guaranteed seating upon arrival at Ghazi Ghat Toll Plaza. Ideal for family gatherings, evening dinners, or highway convoy tour stops.
            </p>
          </div>

          <form onSubmit={handleQuickReserve} className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-4xl mx-auto items-end">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                Dining Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-[#EDE5D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                Time Slot
              </label>
              <select
                value={quickTime}
                onChange={(e) => setQuickTime(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-[#EDE5D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
              >
                <option value="13:00">1:00 PM (Lunch)</option>
                <option value="15:00">3:00 PM (Afternoon)</option>
                <option value="18:30">6:30 PM (Sunset Terrace)</option>
                <option value="20:30">8:30 PM (Dinner Prime)</option>
                <option value="22:30">10:30 PM (Late Dinner)</option>
                <option value="01:00">1:00 AM (24/7 Transit)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                Guest Count
              </label>
              <select
                value={quickGuests}
                onChange={(e) => setQuickGuests(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-[#EDE5D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
              >
                {[2, 4, 6, 8, 10, 15, 20, 30].map((num) => (
                  <option key={num} value={num}>
                    {num} Guests
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 bg-[#12372D] hover:bg-[#0B241E] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-colors"
              >
                Check & Book
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 7. LOCATION & DIRECTIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#EDE5D7] shadow-sm p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B69A62] uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>N-70 National Highway Dining Milestone</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#12372D]">
              Located Directly Beside Ghazi Ghat Toll Plaza
            </h2>
            <p className="text-xs sm:text-sm text-[#242824]/80 leading-relaxed">
              Convenient highway access, expansive secure parking, and riverside air for motorists traveling between Dera Ghazi Khan, Multan, and Muzaffargarh.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <a
              href="https://maps.google.com/?q=Ghazi+Ghat+Toll+Plaza+Dera+Ghazi+Khan"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#12372D] hover:bg-[#0B241E] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors text-center"
            >
              Open in Google Maps
            </a>
            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-6 py-3.5 border border-[#EDE5D7] text-[#12372D] hover:bg-[#EDE5D7]/50 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors text-center"
            >
              View Contact Info
            </button>
          </div>
        </div>
      </section>

      {/* Customizer Modal */}
      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={(item, qty, instructions) => addToCart(item, qty, instructions)}
      />
    </div>
  );
};
