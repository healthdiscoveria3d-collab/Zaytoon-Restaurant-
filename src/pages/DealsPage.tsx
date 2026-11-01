import React from 'react';
import { initialDeals, initialMenuItems } from '../data/initialData.ts';
import { Deal } from '../types/index.ts';
import { Users, Tag, Check, Calendar, ArrowRight, ShoppingBag, ShieldCheck, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface DealsPageProps {
  selectedDealSlug?: string;
  navigate: (path: string) => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({ selectedDealSlug, navigate }) => {
  const { addToCart } = useCart();
  const currentSingleDeal = selectedDealSlug
    ? initialDeals.find((d) => d.slug === selectedDealSlug)
    : null;

  const handleAddDealToOrder = (deal: Deal) => {
    const representativeItem = initialMenuItems[0];
    const dealCartItem = {
      ...representativeItem,
      id: `deal-${deal.id}`,
      name: deal.title,
      description: deal.shortDescription,
      price: deal.offerPrice,
      priceNote: `Value Combo (${deal.promoCode || 'DEAL'})`,
      image: deal.image,
    };
    addToCart(dealCartItem, 1, `Deal: ${deal.title} (Promo: ${deal.promoCode || 'None'})`);
  };

  // If a specific deal slug was requested in the URL, render the dedicated Deal Details view
  if (currentSingleDeal) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <button
          onClick={() => navigate('/deals')}
          className="text-xs font-bold uppercase tracking-wider text-[#12372D] hover:underline"
        >
          ← Back to All Deals
        </button>

        <div className="bg-white rounded-2xl overflow-hidden border border-[#EDE5D7] shadow-xl">
          <div className="relative h-72 sm:h-96 bg-[#0B241E]">
            <img
              src={currentSingleDeal.image}
              alt={currentSingleDeal.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute top-6 left-6 bg-[#C0392B] text-white text-xs font-bold px-3 py-1 rounded-md shadow-md uppercase tracking-wider">
              SAVE {currentSingleDeal.discountPercentage}%
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#B69A62] font-semibold block">
                Zaytoon Exclusive Value Combo
              </span>
              <h1 className="text-2xl sm:text-4xl font-display font-bold">
                {currentSingleDeal.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#EDE5D7]/50 rounded-xl">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[11px] text-[#777B75] uppercase block">Serving Size</span>
                  <span className="text-sm font-bold text-[#12372D] flex items-center gap-1.5 mt-0.5">
                    <Users className="w-4 h-4 text-[#B69A62]" />
                    <span>{currentSingleDeal.serves}</span>
                  </span>
                </div>
                {currentSingleDeal.promoCode && (
                  <div>
                    <span className="text-[11px] text-[#777B75] uppercase block">Coupon Code</span>
                    <span className="text-sm font-bold text-[#12372D] font-mono mt-0.5 block">
                      {currentSingleDeal.promoCode}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="text-sm line-through text-[#777B75] mr-2 tabular-nums">
                  PKR {currentSingleDeal.originalPrice.toLocaleString()}
                </span>
                <span className="text-2xl font-bold font-display text-[#12372D] tabular-nums">
                  PKR {currentSingleDeal.offerPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg text-[#12372D]">
                Deal Description & Overview
              </h3>
              <p className="text-sm text-[#242824]/85 leading-relaxed">
                {currentSingleDeal.fullDescription}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg text-[#12372D]">
                What&apos;s Included in This Package
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentSingleDeal.includedItems.map((dish, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-sm text-[#242824]/90 p-2.5 bg-[#F7F3EA]/60 rounded-lg border border-[#EDE5D7]/60">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{dish}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#F7F3EA] rounded-xl border border-[#EDE5D7] space-y-1.5 text-xs text-[#777B75]">
              <strong className="text-[#12372D] block">Terms & Conditions:</strong>
              <ul className="list-disc pl-4 space-y-0.5">
                {currentSingleDeal.terms.map((term, idx) => (
                  <li key={idx}>{term}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => handleAddDealToOrder(currentSingleDeal)}
                className="w-full sm:w-auto flex-1 py-4 px-6 bg-[#12372D] hover:bg-[#0B241E] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Deal to Order · PKR {currentSingleDeal.offerPrice.toLocaleString()}</span>
              </button>
              <button
                onClick={() => navigate('/reservation')}
                className="w-full sm:w-auto py-4 px-6 border border-[#12372D] text-[#12372D] hover:bg-[#EDE5D7]/50 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
              >
                Book Table for This Deal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // All Deals Grid View
  return (
    <div className="space-y-12 pb-24">
      {/* Top Banner */}
      <section className="bg-[#12372D] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B241E] rounded-full text-xs font-semibold text-[#B69A62]">
            <Flame className="w-3.5 h-3.5" />
            <span>Curated Fast-Casual & Family Banquets</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-[#F7F3EA]">
            Promotional Deals & Offers
          </h1>
          <p className="text-xs sm:text-sm text-[#EDE5D7]/85 max-w-xl mx-auto">
            Maximum value feasts and transit meal platters crafted for families and N-70 highway travelers.
          </p>
        </div>
      </section>

      {/* Deals Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {initialDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#EDE5D7] hover:border-[#B69A62] hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-60 bg-[#EDE5D7] overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#C0392B] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
                    Save {deal.discountPercentage}%
                  </div>
                  {deal.promoCode && (
                    <div className="absolute top-3 right-3 bg-[#0B241E] text-[#EDE5D7] text-[10px] font-mono px-2 py-0.5 rounded shadow-sm">
                      {deal.promoCode}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#777B75]">
                    <Users className="w-3.5 h-3.5 text-[#B69A62]" />
                    <span className="font-medium">Serves {deal.serves}</span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-[#12372D] leading-snug">
                    {deal.title}
                  </h3>

                  <p className="text-xs text-[#242824]/80 leading-relaxed line-clamp-2">
                    {deal.shortDescription}
                  </p>

                  <div className="pt-2 border-t border-[#EDE5D7] space-y-1.5">
                    <span className="text-[11px] font-bold text-[#12372D] uppercase block">
                      Included in Package:
                    </span>
                    {deal.includedItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs text-[#777B75] flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                    {deal.includedItems.length > 3 && (
                      <span className="text-[11px] text-[#B69A62] font-semibold block">
                        + {deal.includedItems.length - 3} more items included
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#EDE5D7]/70 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs line-through text-[#777B75] mr-2 tabular-nums">
                    PKR {deal.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold font-display text-[#12372D] tabular-nums block">
                    PKR {deal.offerPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/deals/${deal.slug}`)}
                    className="px-3 py-2 text-xs font-semibold text-[#12372D] hover:bg-[#EDE5D7]/50 rounded-lg border border-[#EDE5D7]"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleAddDealToOrder(deal)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#12372D] hover:bg-[#0B241E] text-white rounded-lg transition-colors shadow-sm flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
