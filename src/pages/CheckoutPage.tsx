import React, { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { ArrowLeft, CheckCircle, ShieldCheck, AlertCircle, ShoppingBag } from 'lucide-react';

interface CheckoutPageProps {
  navigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { cart, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [fulfilmentMethod, setFulfilmentMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('Ghazi Ghat Toll Plaza Area');
  const [pickupTime, setPickupTime] = useState('25-30 minutes');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_at_counter' | 'cash_on_delivery'>('cash_at_counter');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const deliveryFee = fulfilmentMethod === 'delivery' ? 200 : 0;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-display font-bold text-[#12372D]">Your cart is empty</h2>
        <p className="text-sm text-[#777B75]">Add items to cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/menu')}
          className="px-6 py-2.5 bg-[#12372D] text-white text-xs font-semibold rounded"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please enter your full name and contact phone number.');
      return;
    }

    if (fulfilmentMethod === 'delivery' && !deliveryAddress.trim()) {
      setErrorMsg('Please provide a complete delivery address for highway or home dispatch.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        fulfilmentMethod,
        deliveryAddress: fulfilmentMethod === 'delivery' ? deliveryAddress.trim() : undefined,
        deliveryArea: fulfilmentMethod === 'delivery' ? deliveryArea : undefined,
        pickupTime: fulfilmentMethod === 'pickup' ? pickupTime : undefined,
        instructions: instructions.trim() || undefined,
        paymentMethod: fulfilmentMethod === 'delivery' ? 'cash_on_delivery' : 'cash_at_counter',
        items: cart.map((ci) => ({
          itemId: ci.item.id,
          quantity: ci.quantity,
          specialInstructions: ci.specialInstructions,
        })),
      };

      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      const orderRef = data.data.reference;
      clearCart();
      navigate(`/order/confirmation/${orderRef}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => navigate('/order')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#12372D] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart</span>
      </button>

      <div className="border-b border-[#EDE5D7] pb-4">
        <h1 className="text-3xl font-display font-bold text-[#12372D]">
          Complete Your Order
        </h1>
        <p className="text-xs text-[#777B75] mt-1">
          Provide your contact details. Your order will be confirmed by our kitchen upon review.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#EDE5D7] shadow-sm space-y-4">
            <h2 className="font-display font-bold text-lg text-[#12372D]">
              Customer Information
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sharjeel Khan"
                  className="w-full text-sm p-3 rounded-lg border border-[#EDE5D7] bg-[#F7F3EA]/30 focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                  Mobile Phone Number (WhatsApp Enabled) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 0302 6777908 or +92 300 1234567"
                  className="w-full text-sm p-3 rounded-lg border border-[#EDE5D7] bg-[#F7F3EA]/30 focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
                />
                <p className="text-[11px] text-[#777B75] mt-1">
                  Used for order verification and real-time status tracking.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.pk"
                  className="w-full text-sm p-3 rounded-lg border border-[#EDE5D7] bg-[#F7F3EA]/30 focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
                />
              </div>
            </div>
          </div>

          {/* Fulfilment Details */}
          <div className="bg-white p-6 rounded-xl border border-[#EDE5D7] shadow-sm space-y-4">
            <h2 className="font-display font-bold text-lg text-[#12372D]">
              Fulfilment & Timing
            </h2>

            <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F3EA] rounded-lg border border-[#EDE5D7]">
              <button
                type="button"
                onClick={() => {
                  setFulfilmentMethod('pickup');
                  setPaymentMethod('cash_at_counter');
                }}
                className={`py-2 text-xs font-semibold rounded-md transition-all ${
                  fulfilmentMethod === 'pickup'
                    ? 'bg-[#12372D] text-white shadow-sm'
                    : 'text-[#242824] hover:bg-[#EDE5D7]/50'
                }`}
              >
                Restaurant Pickup (Free)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFulfilmentMethod('delivery');
                  setPaymentMethod('cash_on_delivery');
                }}
                className={`py-2 text-xs font-semibold rounded-md transition-all ${
                  fulfilmentMethod === 'delivery'
                    ? 'bg-[#12372D] text-white shadow-sm'
                    : 'text-[#242824] hover:bg-[#EDE5D7]/50'
                }`}
              >
                Local / Highway Delivery (+ PKR 200)
              </button>
            </div>

            {fulfilmentMethod === 'pickup' ? (
              <div>
                <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                  Estimated Pickup Timing
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full text-sm p-3 rounded-lg border border-[#EDE5D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
                >
                  <option value="20-25 minutes">Ready in 20-25 minutes (Fastest)</option>
                  <option value="35-45 minutes">Ready in 35-45 minutes</option>
                  <option value="1 hour">Ready in 1 hour</option>
                  <option value="Highway transit arriving shortly">Highway transit arriving shortly</option>
                </select>
                <p className="text-[11px] text-[#777B75] mt-1">
                  Pickup location: Zaytoon Restaurant Counter, Near Ghazi Ghat Toll Plaza.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                    Delivery Area
                  </label>
                  <select
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    className="w-full text-sm p-3 rounded-lg border border-[#EDE5D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
                  >
                    <option value="Ghazi Ghat Toll Plaza Area">Ghazi Ghat Toll Plaza & Rest Area</option>
                    <option value="Indus River Boating Points">Indus River Boating & Ghat Banks</option>
                    <option value="N-70 Highway DG Khan Direction">N-70 Highway DG Khan Direction</option>
                    <option value="N-70 Muzaffargarh Direction">N-70 Muzaffargarh Direction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                    Specific Delivery Address / Vehicle Details *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Near Ghazi Ghat police post / Car make & color if waiting on highway"
                    className="w-full text-sm p-3 rounded-lg border border-[#EDE5D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                Order Notes / Packaging Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Separate packaging for naans, extra spoons, or spicy"
                className="w-full text-sm p-3 rounded-lg border border-[#EDE5D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
              />
            </div>
          </div>
        </div>

        {/* Right Order Review & Submission */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#EDE5D7] shadow-sm space-y-5">
            <h2 className="font-display font-bold text-lg text-[#12372D] border-b border-[#EDE5D7] pb-3">
              Order Breakdown
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(({ item, quantity }) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="truncate max-w-[200px]">
                    <span className="font-semibold text-[#12372D]">{quantity}x </span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold tabular-nums text-[#12372D]">
                    PKR {(item.price * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#EDE5D7] space-y-2 text-xs">
              <div className="flex justify-between text-[#777B75]">
                <span>Items Subtotal</span>
                <span className="tabular-nums font-semibold text-[#12372D]">
                  PKR {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#777B75]">
                <span>Fulfilment ({fulfilmentMethod})</span>
                <span className="tabular-nums font-semibold text-[#12372D]">
                  {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#12372D] pt-2 border-t border-[#EDE5D7]">
                <span>Total Amount</span>
                <span className="font-display text-xl tabular-nums">
                  PKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="p-3.5 bg-[#EDE5D7]/50 border border-[#EDE5D7] rounded-lg space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#12372D]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>
                  {fulfilmentMethod === 'delivery'
                    ? 'Payment: Cash on Delivery (COD)'
                    : 'Payment: Cash / Card at Restaurant Counter'}
                </span>
              </div>
              <p className="text-[11px] text-[#777B75]">
                Payment is settled safely upon physical handover. No upfront online card charge is collected.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#12372D] hover:bg-[#0B241E] text-white font-semibold text-sm rounded shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Placing Order with Kitchen...</span>
              ) : (
                <span>Confirm Order · PKR {total.toLocaleString()}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
