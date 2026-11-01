import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Clock, Sparkles } from 'lucide-react';
import { MenuItem } from '../types/index.ts';

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, instructions: string) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  if (!item) return null;

  const handleAdd = () => {
    onAddToCart(item, quantity, instructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] rounded-lg max-w-xl w-full overflow-hidden shadow-2xl border border-[#F4F4F4] relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#171717]/70 hover:bg-[#171717] text-white rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Item Image with aspect ratio 16:9 or 4:3 */}
        <div className="relative h-64 sm:h-72 w-full bg-[#F4F4F4] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs uppercase tracking-wider text-[#F4C542] font-semibold">
              {item.categoryName}
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold leading-tight">
              {item.name}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between text-sm text-[#171717]/80">
            <div className="flex items-center gap-3">
              {item.preparationTime && (
                <span className="flex items-center gap-1 text-xs">
                  <Clock className="w-3.5 h-3.5 text-[#F4C542]" />
                  <span>{item.preparationTime}</span>
                </span>
              )}
              {item.spiciness && (
                <span className="text-xs capitalize px-2 py-0.5 bg-[#F4F4F4] text-[#D71920] rounded">
                  {item.spiciness} spice
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-2xl font-bold font-display text-[#D71920] tabular-nums">
                PKR {item.price.toLocaleString()}
              </span>
              {item.priceNote && (
                <div className="text-[11px] text-[#6B7280] italic">
                  {item.priceNote}
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-[#171717]/85 leading-relaxed">
            {item.description}
          </p>

          {item.isDemoItem && (
            <div className="p-3 bg-[#F4F4F4]/50 border border-[#F4F4F4] rounded text-xs text-[#6B7280]">
              * Notice: Displayed price is a development demo rate subject to daily livestock/market indexing. Billing agent will verify final rate.
            </div>
          )}

          {/* Cooking Instructions */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D71920] mb-1.5">
              Special Kitchen Instructions (Optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less oil, extra green chillies on top, mild black pepper..."
              rows={2}
              className="w-full text-sm p-3 rounded border border-[#F4F4F4] bg-white focus:outline-none focus:ring-1 focus:ring-[#F4C542]"
            />
          </div>

          {/* Quantity and Add to Cart action */}
          <div className="pt-2 flex items-center gap-4">
            <div className="flex items-center border border-[#F4F4F4] rounded bg-white">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 text-[#D71920] hover:bg-[#F4F4F4]/50 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-semibold text-[#D71920] tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2.5 text-[#D71920] hover:bg-[#F4F4F4]/50 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#D71920] hover:bg-[#171717] text-white font-semibold text-sm rounded shadow-sm transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart · PKR {(item.price * quantity).toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
