import React from 'react';
import { MapPin, Phone, Mail, Clock, Download, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B241E] text-[#EDE5D7] pt-16 pb-12 border-t border-[#12372D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Col 1: Brand & Heritage */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold text-[#F7F3EA] tracking-wide">
              Zaytoon
            </h3>
            <p className="text-sm text-[#EDE5D7]/80 leading-relaxed">
              Dera Ghazi Khan&apos;s culinary landmark elegantly situated on the picturesque banks of the Sindh (Indus) River near Ghazi Ghat Toll Plaza. Celebrated for waterside dining, authentic karahi craftsmanship, and round-the-clock hospitality.
            </p>
            <div className="pt-2">
              <a
                href="/api/v1/download-project-zip"
                download="zaytoon-restaurant-website-complete.zip"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded bg-[#12372D] text-[#B69A62] hover:bg-[#12372D]/80 hover:text-white transition-colors border border-[#B69A62]/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Complete Codebase (.ZIP)</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation & Dining */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B69A62] mb-4">
              Explore Zaytoon
            </h4>
            <ul className="space-y-2.5 text-sm text-[#EDE5D7]/80">
              <li>
                <button onClick={() => handleNav('/')} className="hover:text-white transition-colors">
                  Home Experience
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-white transition-colors">
                  Our Indus River Heritage
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/menu')} className="hover:text-white transition-colors">
                  Full Dining Menu
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/deals')} className="hover:text-white transition-colors">
                  Special Highway Deals & Feasts
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/gallery')} className="hover:text-white transition-colors">
                  Restaurant & Food Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/reservation')} className="hover:text-white transition-colors">
                  Book a Table / Terrace
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/track-order')} className="hover:text-white transition-colors">
                  Track Existing Order
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Visit & Operating Hours */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B69A62] mb-4">
              Location & Hours
            </h4>
            <div className="space-y-3 text-sm text-[#EDE5D7]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B69A62] shrink-0 mt-0.5" />
                <span>Indus River Bank, Near Ghazi Ghat Toll Plaza, N-70 Highway, Dera Ghazi Khan, Punjab, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#B69A62] shrink-0" />
                <span className="font-medium text-[#F7F3EA]">Open 24 Hours / 7 Days a Week</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B69A62] shrink-0" />
                <a href="tel:+923026777908" className="hover:text-white transition-colors">
                  +92 302 6777908
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B69A62] shrink-0" />
                <span>info@zaytoonrestaurant.pk</span>
              </div>
            </div>
          </div>

          {/* Col 4: Pre-launch Owner Verification notice */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B69A62] mb-4">
              Pre-Launch Verification
            </h4>
            <div className="p-4 rounded bg-[#12372D]/50 border border-[#12372D] text-xs text-[#EDE5D7]/85 space-y-2">
              <div className="flex items-center gap-1.5 text-[#B69A62] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Owner Configuration Active</span>
              </div>
              <p className="leading-relaxed">
                Contact information, operating claims, and daily livestock pricing are managed via editable settings before launch.
              </p>
              <button
                onClick={() => handleNav('/contact')}
                className="text-[#B69A62] hover:underline inline-flex items-center gap-1 font-medium pt-1"
              >
                <span>View Contact Details</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Mandatory Footer Legal Line */}
        <div className="py-6 border-t border-[#12372D]/80">
          <p className="text-xs sm:text-sm text-[#EDE5D7]/80 leading-relaxed font-normal">
            <strong className="text-[#B69A62] font-semibold">Disclaimer: </strong>
            Menu item prices are indexed against local market rates for livestock and seasonal items, and are subject to operational modifications. Please confirm final rates directly with our billing agent when placing an order or reservation.
          </p>
        </div>

        {/* Bottom copyright & legal links */}
        <div className="pt-6 border-t border-[#12372D]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EDE5D7]/60">
          <p>© {new Date().getFullYear()} Zaytoon Restaurant. All rights reserved. Dera Ghazi Khan, Pakistan.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('/privacy-policy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('/terms')} className="hover:text-white transition-colors">
              Terms & Conditions
            </button>
            <a
              href="/api/v1/download-project-zip"
              className="text-[#B69A62] hover:underline"
            >
              Get ZIP File
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
