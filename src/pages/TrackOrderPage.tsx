import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, Truck, ChefHat, AlertCircle, ShoppingBag, Phone } from 'lucide-react';
import { Order, OrderStatus } from '../types/index.ts';

interface TrackOrderPageProps {
  initialRef?: string;
  navigate: (path: string) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ initialRef, navigate }) => {
  const [reference, setReference] = useState(initialRef || '');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrder = async (searchRef: string, searchPhone: string) => {
    if (!searchRef.trim()) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const queryParams = new URLSearchParams({
        reference: searchRef.trim(),
        ...(searchPhone.trim() ? { phone: searchPhone.trim() } : {}),
      });

      const res = await fetch(`/api/v1/orders/track?${queryParams.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to locate order with provided reference');
      }

      setOrder(data.data);
    } catch (err: any) {
      setOrder(null);
      setErrorMsg(err.message || 'Order tracking error.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchOrder(initialRef, '');
    }
  }, [initialRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(reference, phone);
  };

  const handleLoadDemo = () => {
    setReference('ZT-78912');
    setPhone('+923001234567');
    fetchOrder('ZT-78912', '+923001234567');
  };

  // Status mapping
  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'pending', label: 'Order Received', desc: 'Registered with host' },
    { key: 'confirmed', label: 'Kitchen Confirmed', desc: 'Livestock cut assigned' },
    { key: 'preparing', label: 'Live Cooking', desc: 'Fresh on tandoor/karahi' },
    { key: 'ready', label: 'Ready', desc: 'Packed & ready at counter' },
    { key: 'completed', label: 'Fulfilled', desc: 'Handed over to customer' },
  ];

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const orderIndex = steps.findIndex((s) => s.key === currentStatus);
    const stepIndex = steps.findIndex((s) => s.key === stepKey);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#F4C542] font-semibold">
          Customer Service
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#D71920]">
          Track Your Dining Order
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] max-w-lg mx-auto">
          Enter your reference code and phone number to verify real-time status in our kitchen.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#F4F4F4] shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold uppercase text-[#D71920] mb-1">
              Order Reference (e.g. ZT-78912)
            </label>
            <input
              type="text"
              required
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              placeholder="ZT-XXXXX"
              className="w-full text-sm p-3 rounded-lg border border-[#F4F4F4] bg-[#FFFFFF]/30 font-mono focus:outline-none focus:ring-1 focus:ring-[#F4C542]"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold uppercase text-[#D71920] mb-1">
              Customer Mobile Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 03001234567"
              className="w-full text-sm p-3 rounded-lg border border-[#F4F4F4] bg-[#FFFFFF]/30 focus:outline-none focus:ring-1 focus:ring-[#F4C542]"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#D71920] hover:bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'Searching...' : 'Track Status'}</span>
            </button>
          </div>
        </form>

        <div className="pt-2 flex items-center justify-between text-xs text-[#6B7280] border-t border-[#F4F4F4]">
          <span>Security Notice: Tracking is protected by phone matching to prevent data leaks.</span>
          <button
            type="button"
            onClick={handleLoadDemo}
            className="text-[#D71920] font-semibold hover:underline"
          >
            Quick-load Demo Order (ZT-78912)
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-white rounded-xl border border-[#F4F4F4] overflow-hidden shadow-md space-y-8 p-6 sm:p-8 animate-in fade-in duration-200">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4F4F4] pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-mono font-bold text-[#D71920]">
                  {order.reference}
                </span>
                <span className="capitalize px-3 py-1 rounded-full text-xs font-bold bg-[#F4F4F4] text-[#D71920]">
                  Status: {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-1">
                Guest: {order.customerName} · Phone: {order.customerPhone}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#6B7280] block">Grand Total</span>
              <span className="text-2xl font-display font-bold text-[#D71920] tabular-nums">
                PKR {order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-[#D71920]">
              Preparation Progress
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {steps.map((st, i) => {
                const stepState = getStepStatus(st.key, order.status);
                return (
                  <div
                    key={st.key}
                    className={`p-3.5 rounded-lg border text-xs space-y-1 transition-all ${
                      stepState === 'completed'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : stepState === 'current'
                        ? 'bg-[#D71920] border-[#D71920] text-white shadow-md'
                        : 'bg-[#FFFFFF]/40 border-[#F4F4F4] text-[#6B7280]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] opacity-75">Step 0{i + 1}</span>
                      {stepState === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-700" />
                      ) : stepState === 'current' ? (
                        <ChefHat className="w-4 h-4 text-[#F4C542]" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </div>
                    <div className="font-bold">{st.label}</div>
                    <div className="text-[10px] opacity-80">{st.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items & Delivery Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#F4F4F4]">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase text-[#D71920]">
                Dishes in This Order
              </h4>
              <div className="space-y-2">
                {order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs p-2.5 bg-[#FFFFFF]/60 rounded border border-[#F4F4F4]/60"
                  >
                    <div>
                      <span className="font-bold text-[#D71920]">{item.quantity}x </span>
                      <span>{item.itemName}</span>
                      {item.specialInstructions && (
                        <p className="text-[10px] text-[#F4C542] italic">
                          &ldquo;{item.specialInstructions}&rdquo;
                        </p>
                      )}
                    </div>
                    <span className="font-semibold tabular-nums text-[#D71920]">
                      PKR {item.subtotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase text-[#D71920]">
                Fulfilment & Collection
              </h4>
              <div className="p-4 bg-[#F4F4F4]/40 rounded-lg text-xs space-y-2 text-[#171717]/85">
                <div>
                  <strong className="text-[#D71920]">Method: </strong>
                  <span className="capitalize">{order.fulfilmentMethod}</span>
                </div>
                {order.pickupTime && (
                  <div>
                    <strong className="text-[#D71920]">Estimated Ready In: </strong>
                    <span>{order.pickupTime}</span>
                  </div>
                )}
                {order.deliveryArea && (
                  <div>
                    <strong className="text-[#D71920]">Area: </strong>
                    <span>{order.deliveryArea}</span>
                  </div>
                )}
                <div>
                  <strong className="text-[#D71920]">Settlement: </strong>
                  <span>Cash on Physical Handover</span>
                </div>
                <div className="pt-2">
                  <a
                    href="tel:+923026777908"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D71920] hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F4C542]" />
                    <span>Inquire with billing agent: +92 302 6777908</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
