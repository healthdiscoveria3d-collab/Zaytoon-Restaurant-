import React, { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Utensils, Info } from 'lucide-react';

interface CartPageProps {
  navigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const [fulfilment, setFulfilment] = useState<'pickup' | 'delivery'>('pickup');

  const deliveryFee = fulfilment === 'delivery' ? 200 : 0;
  const grandTotal = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F4F4F4] text-[#D71920] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-display font-bold text-[#D71920]">
          Your Dining Cart is Empty
        </h1>
        <p className="text-sm text-[#6B7280] max-w-md mx-auto">
          Explore our traditional handi karahis, smoky charcoal kebabs, and family banquet deals to begin your order.
        </p>
        <div>
          <button
            onClick={() => navigate('/menu')}
            className="px-6 py-3 bg-[#D71920] hover:bg-[#171717] text-white font-semibold text-sm rounded shadow-sm transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4F4F4] pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#D71920]">
            Your Dining Order
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart · Prepared fresh by Zaytoon culinary staff
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-medium text-red-700 hover:text-red-900 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ item, quantity, specialInstructions }) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-xl border border-[#F4F4F4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-lg object-cover bg-[#F4F4F4] shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base text-[#D71920]">
                    {item.name}
                  </h3>
                  <div className="text-xs text-[#6B7280]">
                    PKR {item.price.toLocaleString()} each
                    {item.priceNote && <span className="ml-1 italic">({item.priceNote})</span>}
                  </div>
                  {specialInstructions && (
                    <p className="text-xs text-[#F4C542] italic">
                      Note: &ldquo;{specialInstructions}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Line Total */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F4F4F4]">
                <div className="flex items-center border border-[#F4F4F4] rounded bg-[#FFFFFF]/50">
                  <button
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    className="p-1.5 text-[#D71920] hover:bg-[#F4F4F4] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#D71920] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    className="p-1.5 text-[#D71920] hover:bg-[#F4F4F4] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <span className="text-base font-bold font-display text-[#D71920] tabular-nums">
                    PKR {(item.price * quantity).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-[#6B7280] hover:text-red-700 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Livestock Pricing Notice */}
          <div className="p-4 bg-[#F4F4F4]/50 rounded-lg border border-[#F4F4F4] text-xs text-[#6B7280] space-y-1">
            <strong className="text-[#D71920] block">Market Rate Notice:</strong>
            <p>
              As noted in our restaurant policy, fresh livestock cuts are indexed daily against market rates. Your final total will be confirmed with our billing agent.
            </p>
          </div>
        </div>

        {/* Right: Order Summary & Fulfilment */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#F4F4F4] shadow-sm space-y-6">
          <h2 className="font-display font-bold text-xl text-[#D71920] border-b border-[#F4F4F4] pb-3">
            Order Summary
          </h2>

          {/* Fulfilment Choice */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#D71920] block">
              Fulfilment Method
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#FFFFFF] rounded-lg border border-[#F4F4F4]">
              <button
                type="button"
                onClick={() => setFulfilment('pickup')}
                className={`py-2 text-xs font-semibold rounded-md transition-all ${
                  fulfilment === 'pickup'
                    ? 'bg-[#D71920] text-white shadow-sm'
                    : 'text-[#171717] hover:bg-[#F4F4F4]/50'
                }`}
              >
                Restaurant Pickup (Free)
              </button>
              <button
                type="button"
                onClick={() => setFulfilment('delivery')}
                className={`py-2 text-xs font-semibold rounded-md transition-all ${
                  fulfilment === 'delivery'
                    ? 'bg-[#D71920] text-white shadow-sm'
                    : 'text-[#171717] hover:bg-[#F4F4F4]/50'
                }`}
              >
                Delivery (+ PKR 200)
              </button>
            </div>
            {fulfilment === 'delivery' && (
              <p className="text-[11px] text-[#6B7280] pt-1">
                * Available for verified Ghazi Ghat Toll Plaza & Dera Ghazi Khan areas.
              </p>
            )}
          </div>

          {/* Calculation */}
          <div className="space-y-3 pt-3 border-t border-[#F4F4F4] text-sm">
            <div className="flex justify-between text-[#171717]/80">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#D71920] tabular-nums">
                PKR {subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[#171717]/80">
              <span>Fulfilment Fee</span>
              <span className="font-semibold text-[#D71920] tabular-nums">
                {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#D71920] pt-3 border-t border-[#F4F4F4]">
              <span>Estimated Total</span>
              <span className="font-display text-xl tabular-nums">
                PKR {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-[#D71920] hover:bg-[#171717] text-white font-semibold text-sm rounded shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/menu')}
            className="w-full text-center text-xs text-[#6B7280] hover:text-[#D71920] transition-colors"
          >
            + Add more dishes to order
          </button>
        </div>
      </div>
    </div>
  );
};
