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

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F3EA] shadow-2xl flex flex-col border-l border-[#EDE5D7] animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="p-5 bg-[#0B241E] text-white flex items-center justify-between border-b border-[#12372D]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#12372D] rounded-lg text-[#B69A62]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-[#F7F3EA] leading-none">
                  Your Order Cart
                </h2>
                <span className="text-xs text-[#EDE5D7]/75">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-[#EDE5D7]/80 hover:text-white rounded-lg hover:bg-[#12372D] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fulfillment Bar (KFC-style Delivery/Pickup Switcher) */}
          <div className="p-3 bg-[#EDE5D7] border-b border-[#EDE5D7]/80">
            <div className="grid grid-cols-2 gap-1 bg-[#F7F3EA] p-1 rounded-lg border border-[#EDE5D7]">
              <button
                type="button"
                onClick={() => setFulfilment('pickup')}
                className={`py-1.5 text-xs font-semibold rounded transition-all ${
                  fulfilment === 'pickup'
                    ? 'bg-[#12372D] text-white shadow-xs'
                    : 'text-[#242824] hover:bg-[#EDE5D7]/50'
                }`}
              >
                Pickup (At Counter)
              </button>
              <button
                type="button"
                onClick={() => setFulfilment('delivery')}
                className={`py-1.5 text-xs font-semibold rounded transition-all ${
                  fulfilment === 'delivery'
                    ? 'bg-[#12372D] text-white shadow-xs'
                    : 'text-[#242824] hover:bg-[#EDE5D7]/50'
                }`}
              >
                Highway / Local Delivery
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#777B75] mt-1.5 px-1 truncate">
              <MapPin className="w-3 h-3 text-[#B69A62] shrink-0" />
              <span className="truncate">{selectedLocation}</span>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-[#777B75]">
                <div className="w-16 h-16 rounded-full bg-[#EDE5D7] flex items-center justify-center text-[#12372D]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#12372D]">Your Cart is Empty</h3>
                  <p className="text-xs text-[#777B75] mt-1">
                    Explore our authentic copper handi karahi, smoky charcoal BBQ, or family banquet deals!
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/menu');
                  }}
                  className="px-5 py-2.5 bg-[#12372D] text-white text-xs font-semibold rounded hover:bg-[#0B241E] transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-[#777B75] pb-1">
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
                    className="p-3.5 bg-white rounded-xl border border-[#EDE5D7] shadow-xs flex gap-3 items-center justify-between"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover bg-[#EDE5D7] shrink-0"
                    />

                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className="font-display font-bold text-xs text-[#12372D] truncate">
                        {item.name}
                      </h4>
                      <div className="text-[11px] text-[#777B75] tabular-nums mt-0.5">
                        PKR {item.price.toLocaleString()}
                      </div>
                      {specialInstructions && (
                        <p className="text-[10px] text-[#B69A62] italic truncate mt-0.5">
                          {specialInstructions}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="font-bold text-xs text-[#12372D] tabular-nums">
                        PKR {(item.price * quantity).toLocaleString()}
                      </span>

                      <div className="flex items-center border border-[#EDE5D7] rounded bg-[#F7F3EA]">
                        <button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="p-1 text-[#12372D] hover:bg-[#EDE5D7] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#12372D] tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="p-1 text-[#12372D] hover:bg-[#EDE5D7] transition-colors"
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
            <div className="p-5 bg-white border-t border-[#EDE5D7] space-y-3.5 shadow-lg">
              <div className="space-y-1.5 text-xs text-[#242824]/85">
                <div className="flex justify-between">
                  <span className="text-[#777B75]">Subtotal</span>
                  <span className="font-semibold tabular-nums text-[#12372D]">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777B75]">
                    {fulfilment === 'delivery' ? 'Delivery Fee' : 'Pickup'}
                  </span>
                  <span className="font-semibold tabular-nums text-[#12372D]">
                    {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#12372D] pt-2 border-t border-[#EDE5D7]">
                  <span>Total Amount</span>
                  <span className="font-display text-base tabular-nums text-[#12372D]">
                    PKR {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-[#12372D] hover:bg-[#0B241E] text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleViewFullCart}
                  className="w-full text-center text-[11px] font-semibold text-[#777B75] hover:text-[#12372D] transition-colors py-1"
                >
                  View Detailed Cart Page →
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-[#777B75] justify-center">
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
