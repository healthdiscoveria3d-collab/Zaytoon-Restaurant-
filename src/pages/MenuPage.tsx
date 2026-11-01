import React, { useState, useMemo } from 'react';
import { Search, Clock, Plus, Info, Sparkles, Filter, ShoppingBag, Check } from 'lucide-react';
import { initialCategories, initialMenuItems } from '../data/initialData.ts';
import { MenuItem } from '../types/index.ts';
import { ItemModal } from '../components/ItemModal.tsx';
import { useCart } from '../context/CartContext.tsx';

interface MenuPageProps {
  initialCategorySlug?: string;
  navigate: (path: string) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ initialCategorySlug, navigate }) => {
  const { addToCart } = useCart();
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(
    initialCategorySlug || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = useMemo(() => {
    let items = [...initialMenuItems];

    if (activeCategorySlug !== 'all') {
      const cat = initialCategories.find((c) => c.slug === activeCategorySlug);
      if (cat) {
        items = items.filter((i) => i.categoryId === cat.id);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.categoryName.toLowerCase().includes(q)
      );
    }

    return items;
  }, [activeCategorySlug, searchQuery]);

  const handleCategorySelect = (slug: string) => {
    setActiveCategorySlug(slug);
    if (slug === 'all') {
      navigate('/menu');
    } else {
      navigate(`/menu/${slug}`);
    }
  };

  return (
    <div className="space-y-10 pb-24">
      {/* Sticky Top Category Navigation & Search Bar (KFC-Style Menu Rail) */}
      <div className="sticky top-20 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#F4F4F4] shadow-xs py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Horizontal Category Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategorySlug === 'all'
                  ? 'bg-[#D71920] text-white shadow-sm'
                  : 'bg-white border border-[#F4F4F4] text-[#171717] hover:bg-[#F4F4F4]/50'
              }`}
            >
              All Items
            </button>
            {initialCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCategorySlug === cat.slug
                    ? 'bg-[#D71920] text-white shadow-sm'
                    : 'bg-white border border-[#F4F4F4] text-[#171717] hover:bg-[#F4F4F4]/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search handi, BBQ, naan..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#F4F4F4] bg-white focus:outline-none focus:ring-1 focus:ring-[#F4C542]"
            />
          </div>
        </div>
      </div>

      {/* Main Menu Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Livestock Indexing Notice */}
        <div className="p-3.5 bg-[#F4F4F4]/50 rounded-xl border border-[#F4F4F4] text-xs text-[#6B7280] flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#F4C542] shrink-0" />
          <span>
            <strong>Market Rate Notice: </strong> Fresh livestock cuts (mutton/chicken) are indexed daily against market rates and confirmed with billing agent. Sealed drinking water bottles and soft drinks follow official <strong>Retail MRP</strong>.
          </span>
        </div>

        {/* Current Category Title */}
        <div className="flex items-center justify-between border-b border-[#F4F4F4] pb-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#D71920]">
              {activeCategorySlug === 'all'
                ? 'All Menu Offerings'
                : initialCategories.find((c) => c.slug === activeCategorySlug)?.name}
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {activeCategorySlug === 'all'
                ? 'Cooked live per order with pure butter or desi ghee · 24/7 service'
                : initialCategories.find((c) => c.slug === activeCategorySlug)?.description}
            </p>
          </div>
          <span className="text-xs font-semibold text-[#6B7280] tabular-nums">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Product Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-[#F4F4F4] space-y-3">
            <p className="text-base font-semibold text-[#D71920]">
              No dishes found matching your search.
            </p>
            <p className="text-xs text-[#6B7280]">
              Try searching for &quot;karahi&quot;, &quot;water&quot;, &quot;kebab&quot;, or reset categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategorySlug('all');
              }}
              className="mt-2 px-4 py-2 text-xs font-semibold bg-[#D71920] text-white rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden border border-[#F4F4F4] hover:border-[#F4C542] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 sm:h-52 bg-[#F4F4F4] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-106 transition-transform duration-500"
                    />
                    {item.priceNote === 'Retail MRP' ? (
                      <span className="absolute top-3 right-3 bg-[#171717] text-[#F4F4F4] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        Retail MRP
                      </span>
                    ) : item.isFeatured ? (
                      <span className="absolute top-3 right-3 bg-[#F4C542] text-[#171717] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        Chef Signature
                      </span>
                    ) : null}

                    {item.preparationTime && (
                      <span className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#F4C542]" />
                        <span>{item.preparationTime}</span>
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="text-[11px] uppercase tracking-wider text-[#6B7280]">
                      {item.categoryName}
                    </div>

                    <h3 className="font-display font-bold text-lg text-[#D71920] leading-snug">
                      {item.name}
                    </h3>

                    <p className="text-xs text-[#171717]/80 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-[#F4F4F4]/70 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold font-display text-[#D71920] tabular-nums block">
                      PKR {item.price.toLocaleString()}
                    </span>
                    {item.priceNote && (
                      <span className="text-[10px] text-[#6B7280] italic truncate block max-w-[140px]">
                        {item.priceNote}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-2.5 py-2 text-xs font-semibold text-[#D71920] hover:bg-[#F4F4F4]/50 rounded-lg border border-[#F4F4F4] transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#D71920] hover:bg-[#171717] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                      title="Add to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Customizer Modal */}
      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={(item, qty, instructions) => addToCart(item, qty, instructions)}
      />
    </div>
  );
};
