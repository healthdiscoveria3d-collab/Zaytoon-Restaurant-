import React from 'react';
import { Shield, FileText } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  if (type === 'privacy') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="border-b border-[#EDE5D7] pb-4 space-y-2">
          <div className="flex items-center gap-2 text-[#B69A62]">
            <Shield className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-semibold">Legal & Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#12372D]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#777B75]">
            Effective Date: November 2026 · Zaytoon Restaurant, Dera Ghazi Khan, Pakistan
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-[#EDE5D7] shadow-sm space-y-6 text-sm text-[#242824]/85 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-display font-bold text-[#12372D]">1. Information We Collect</h2>
            <p>
              When you place an online order, reserve a dining table, or contact our team, we collect only the minimum required information: your full name, telephone number (for order verification and dispatch), and optional delivery location.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display font-bold text-[#12372D]">2. Payment Data Protection</h2>
            <p>
              Zaytoon Restaurant does NOT collect, process, or store credit/debit card numbers directly on our servers. All transactions are settled in cash or via approved handheld terminal upon physical dining or delivery handover.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display font-bold text-[#12372D]">3. Order Tracking Security</h2>
            <p>
              Customer order tracking is protected by phone number validation to ensure third parties cannot inspect your dining preferences, addresses, or billing totals without authorization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display font-bold text-[#12372D]">4. Contact & Inquiries</h2>
            <p>
              If you have questions regarding our data practices, please reach our manager at info@zaytoonrestaurant.pk or telephone +92 302 6777908.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="border-b border-[#EDE5D7] pb-4 space-y-2">
        <div className="flex items-center gap-2 text-[#B69A62]">
          <FileText className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest font-semibold">Legal & Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#12372D]">
          Terms and Conditions
        </h1>
        <p className="text-xs text-[#777B75]">
          Effective Date: November 2026 · Zaytoon Restaurant, Near Ghazi Ghat Toll Plaza, DG Khan
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-[#EDE5D7] shadow-sm space-y-6 text-sm text-[#242824]/85 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-display font-bold text-[#12372D]">1. Menu Pricing & Market Indexing Policy</h2>
          <div className="p-4 bg-[#EDE5D7]/50 rounded-lg text-xs border border-[#EDE5D7] text-[#12372D] font-medium">
            Disclaimer: Menu item prices are indexed against local market rates for livestock and seasonal items, and are subject to operational modifications. Please confirm final rates directly with our billing agent when placing an order or reservation.
          </div>
          <p className="pt-1">
            Fresh meat cuts (including mutton karahi and chicken shinwari) rely on daily livestock pricing. Sealed drinking water bottles and carbonated soft drinks are strictly sold at manufacturer Retail MRP.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-display font-bold text-[#12372D]">2. Online Orders as Requests</h2>
          <p>
            Submission of an order through this website constitutes a purchase request. Kitchen confirmation by our supervisor or billing agent represents acceptance of the order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-display font-bold text-[#12372D]">3. Table Reservation Holding Policy</h2>
          <p>
            Due to high demand during evening and weekend dining hours, reserved tables will be held for a maximum grace period of 20 minutes from the designated booking slot.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-display font-bold text-[#12372D]">4. Governing Jurisdiction</h2>
          <p>
            These terms are governed in accordance with the commercial regulations of Punjab and the Islamic Republic of Pakistan.
          </p>
        </section>
      </div>
    </div>
  );
};
