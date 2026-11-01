import React from 'react';
import { CheckCircle2, Clock, Phone, MapPin, ArrowRight, Printer } from 'lucide-react';

interface OrderConfirmationPageProps {
  orderReference: string;
  navigate: (path: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderReference,
  navigate,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      {/* Success Banner */}
      <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#F4F4F4] shadow-md text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#F4C542] font-semibold">
            Order Successfully Received
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#D71920]">
            Thank You for Dining with Zaytoon
          </h1>
          <p className="text-sm text-[#171717]/80 max-w-lg mx-auto">
            Your dining request has been registered with our kitchen. Our supervisor will verify dish preparation and attend to your order immediately.
          </p>
        </div>

        {/* Human-Readable Reference Code */}
        <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#F4F4F4] inline-block text-center px-8">
          <span className="text-xs uppercase text-[#6B7280] tracking-wider block">
            Your Order Reference Code
          </span>
          <span className="text-2xl sm:text-3xl font-mono font-bold text-[#D71920] tracking-wide mt-1 block">
            {orderReference}
          </span>
          <span className="text-[11px] text-[#6B7280] mt-1 block">
            Save or screenshot this reference for live order tracking.
          </span>
        </div>

        {/* What Happens Next Steps */}
        <div className="text-left pt-6 border-t border-[#F4F4F4] space-y-4">
          <h3 className="font-display font-bold text-lg text-[#D71920]">
            What Happens Next?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-[#F4F4F4]/40 rounded-lg space-y-1">
              <span className="font-semibold text-[#D71920] block">1. Kitchen Review</span>
              <p className="text-[#6B7280]">
                Chef checks fresh meat cut availability and begins cooking your handi / BBQ.
              </p>
            </div>
            <div className="p-3.5 bg-[#F4F4F4]/40 rounded-lg space-y-1">
              <span className="font-semibold text-[#D71920] block">2. Status Updates</span>
              <p className="text-[#6B7280]">
                Use your reference code in our tracker to watch preparation and readiness live.
              </p>
            </div>
            <div className="p-3.5 bg-[#F4F4F4]/40 rounded-lg space-y-1">
              <span className="font-semibold text-[#D71920] block">3. Handover & Payment</span>
              <p className="text-[#6B7280]">
                Collect at our Ghazi Ghat counter or receive delivery. Settle with cash.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#F4F4F4] flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(`/track-order?ref=${orderReference}`)}
            className="w-full sm:w-auto px-6 py-3 bg-[#D71920] hover:bg-[#171717] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Track This Order Live</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="tel:+923026777908"
            className="w-full sm:w-auto px-6 py-3 border border-[#F4F4F4] text-[#D71920] hover:bg-[#F4F4F4]/50 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-[#F4C542]" />
            <span>Call Restaurant (+92 302 6777908)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
