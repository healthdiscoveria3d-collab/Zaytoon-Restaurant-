import React from 'react';
import { CheckCircle2, Calendar, Phone, ArrowRight, MapPin } from 'lucide-react';

interface ReservationConfirmationPageProps {
  reference: string;
  navigate: (path: string) => void;
}

export const ReservationConfirmationPage: React.FC<ReservationConfirmationPageProps> = ({
  reference,
  navigate,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#F4F4F4] shadow-md text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#F4C542] font-semibold">
            Reservation Request Registered
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#D71920]">
            We Look Forward to Welcoming You
          </h1>
          <p className="text-sm text-[#171717]/80 max-w-lg mx-auto">
            Your table reservation request has been transmitted to the host desk at Zaytoon Restaurant, Ghazi Ghat.
          </p>
        </div>

        <div className="p-4 bg-[#FFFFFF] rounded-xl border border-[#F4F4F4] inline-block text-center px-8">
          <span className="text-xs uppercase text-[#6B7280] tracking-wider block">
            Booking Reference Number
          </span>
          <span className="text-2xl sm:text-3xl font-mono font-bold text-[#D71920] tracking-wide mt-1 block">
            {reference}
          </span>
          <span className="text-[11px] text-[#6B7280] mt-1 block">
            Quote this code when arriving or calling our reception.
          </span>
        </div>

        <div className="p-4 bg-[#F4F4F4]/40 rounded-xl text-left text-xs space-y-2 text-[#171717]/85">
          <h3 className="font-semibold text-sm text-[#D71920]">
            Important Next Step:
          </h3>
          <p>
            Our host will contact your mobile phone shortly to verify arrival time and guest count. If you are arriving with a large convoy or require early karahi preparation, please contact our counter directly.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/menu')}
            className="w-full sm:w-auto px-6 py-3 bg-[#D71920] hover:bg-[#171717] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            Pre-Browse Full Menu
          </button>
          <a
            href="tel:+923026777908"
            className="w-full sm:w-auto px-6 py-3 border border-[#F4F4F4] text-[#D71920] hover:bg-[#F4F4F4]/50 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-[#F4C542]" />
            <span>Call Host (+92 302 6777908)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
