import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface CartDrawerProps {
  navigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
    fulfilment,
    setFulfilment,
    selectedLocation,
  } = useCart();

  if (!isCartOpen) return null;

  const deliveryFee = fulfilment === 'delivery' ? 200 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewFullCart = () => {
    closeCart();
    navigate('/order');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 w-full sm:w-auto flex justify-end">
        <div className="w-full sm:w-screen max-w-md min-w-0 bg-[#FFFFFF] shadow-2xl flex flex-col border-l border-[#F4F4F4] animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="p-5 bg-[#171717] text-white flex items-center justify-between border-b border-[#D71920]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#D71920] rounded-lg text-[#F4C542]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-[#FFFFFF] leading-none">
                  Your Order Cart
                </h2>
                <span className="text-xs text-[#F4F4F4]/75">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-[#F4F4F4]/80 hover:text-white rounded-lg hover:bg-[#D71920] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fulfillment Bar (KFC-style Delivery/Pickup Switcher) */}
          <div className="p-3 bg-[#F4F4F4] border-b border-[#F4F4F4]/80">
            <div className="grid grid-cols-2 gap-1 bg-[#FFFFFF] p-1 rounded-lg border border-[#F4F4F4]">
              <button
                type="button"
                onClick={() => setFulfilment('pickup')}
                className={`py-1.5 text-xs font-semibold rounded transition-all ${
                  fulfilment === 'pickup'
                    ? 'bg-[#D71920] text-white shadow-xs'
                    : 'text-[#171717] hover:bg-[#F4F4F4]/50'
                }`}
              >
                Pickup (At Counter)
              </button>
              <button
                type="button"
                onClick={() => setFulfilment('delivery')}
                className={`py-1.5 text-xs font-semibold rounded transition-all ${
                  fulfilment === 'delivery'
                    ? 'bg-[#D71920] text-white shadow-xs'
                    : 'text-[#171717] hover:bg-[#F4F4F4]/50'
                }`}
              >
                Highway / Local Delivery
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] mt-1.5 px-1 truncate">
              <MapPin className="w-3 h-3 text-[#F4C542] shrink-0" />
              <span className="truncate">{selectedLocation}</span>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-[#6B7280]">
                <div className="w-16 h-16 rounded-full bg-[#F4F4F4] flex items-center justify-center text-[#D71920]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#D71920]">Your Cart is Empty</h3>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Explore our authentic copper handi karahi, smoky charcoal BBQ, or family banquet deals!
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/menu');
                  }}
                  className="px-5 py-2.5 bg-[#D71920] text-white text-xs font-semibold rounded hover:bg-[#171717] transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-[#6B7280] pb-1">
                  <span>Selected Dishes</span>
                  <button
                    onClick={clearCart}
                    className="text-red-700 hover:text-red-900 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {cart.map(({ item, quantity, specialInstructions }) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-xl border border-[#F4F4F4] shadow-xs flex gap-3 items-center justify-between"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover bg-[#F4F4F4] shrink-0"
                    />

                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className="font-display font-bold text-xs text-[#D71920] truncate">
                        {item.name}
                      </h4>
                      <div className="text-[11px] text-[#6B7280] tabular-nums mt-0.5">
                        PKR {item.price.toLocaleString()}
                      </div>
                      {specialInstructions && (
                        <p className="text-[10px] text-[#F4C542] italic truncate mt-0.5">
                          {specialInstructions}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="font-bold text-xs text-[#D71920] tabular-nums">
                        PKR {(item.price * quantity).toLocaleString()}
                      </span>

                      <div className="flex items-center border border-[#F4F4F4] rounded bg-[#FFFFFF]">
                        <button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="p-1 text-[#D71920] hover:bg-[#F4F4F4] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#D71920] tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="p-1 text-[#D71920] hover:bg-[#F4F4F4] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="shrink-0 p-3 sm:p-5 bg-white border-t border-[#F4F4F4] space-y-2.5 sm:space-y-3.5 shadow-lg">
              <div className="space-y-1.5 text-xs text-[#171717]/85">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Subtotal</span>
                  <span className="font-semibold tabular-nums text-[#D71920]">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">
                    {fulfilment === 'delivery' ? 'Delivery Fee' : 'Pickup'}
                  </span>
                  <span className="font-semibold tabular-nums text-[#D71920]">
                    {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#D71920] pt-2 border-t border-[#F4F4F4]">
                  <span>Total Amount</span>
                  <span className="font-display text-base tabular-nums text-[#D71920]">
                    PKR {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-[#D71920] hover:bg-[#171717] text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleViewFullCart}
                  className="w-full text-center text-[11px] font-semibold text-[#6B7280] hover:text-[#D71920] transition-colors py-1"
                >
                  View Detailed Cart Page →
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280] justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Cash on Physical Handover · Verified Kitchen Prep</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
