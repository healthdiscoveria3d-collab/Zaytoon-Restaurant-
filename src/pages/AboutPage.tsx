import React from 'react';
import { initialSiteSettings } from '../data/initialData.ts';
import { ArrowRight, Clock, Award, Shield, Users, MapPin } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="space-y-20 pb-24">
      {/* Editorial Header */}
      <section className="bg-[#12372D] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/src/assets/images/hero_zaytoon_riverside_dining_1793524768913.jpg"
            alt="Zaytoon Riverside"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B69A62]">
            Our Story & Waterside Landmark
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#F7F3EA] leading-tight text-balance">
            Rooted by the Sindh River, Serving Generations with Trust.
          </h1>
          <p className="text-base sm:text-lg text-[#EDE5D7]/85 max-w-2xl mx-auto">
            Near Ghazi Ghat Toll Plaza, Dera Ghazi Khan, Punjab, Pakistan.
          </p>
        </div>
      </section>

      {/* Client's Authentic Story Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl p-8 sm:p-12 border border-[#EDE5D7] shadow-sm space-y-8">
          <div className="border-l-4 border-[#B69A62] pl-6 py-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#12372D] mb-4">
              A Legacy of Hospitality in Dera Ghazi Khan
            </h2>
            <p className="text-base sm:text-lg text-[#242824] leading-relaxed italic">
              &ldquo;{initialSiteSettings.aboutHistory}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#EDE5D7]">
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xl text-[#12372D]">
                The Historic Ghazi Ghat Setting
              </h3>
              <p className="text-sm text-[#242824]/80 leading-relaxed">
                The banks of the Indus at Ghazi Ghat have for centuries been a welcoming stop for transiting travelers moving across Punjab and Balochistan. Zaytoon elevates this heritage with dedicated riverside terraces where evening breezes and water reflections set an unforgettable backdrop for dining.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-display font-bold text-xl text-[#12372D]">
                Round-the-Clock (24/7) Highway Service
              </h3>
              <p className="text-sm text-[#242824]/80 leading-relaxed">
                We understand that highway travel on the N-70 does not stop with the sunset. Our clay tandoors stay fired, our pots of aromatic Karak Chai stay steaming, and our kitchen prepares fresh food around the clock for late-night motorists, bus passengers, and night owls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-display font-bold text-[#12372D] mb-3">
            What Distinguishes Zaytoon
          </h2>
          <p className="text-sm text-[#777B75]">
            Our enduring principles that bring families and highway travelers back time after time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-[#EDE5D7] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#12372D] text-[#B69A62] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-display font-bold text-lg text-[#12372D]">
              Indus Waterside Dining
            </h3>
            <p className="text-xs text-[#242824]/80 leading-relaxed">
              Open-air terrace seating providing fresh river breeze and scenic waterside panoramas under the evening stars.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#EDE5D7] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#12372D] text-[#B69A62] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-display font-bold text-lg text-[#12372D]">
              Uncompromised Quality
            </h3>
            <p className="text-xs text-[#242824]/80 leading-relaxed">
              Fresh livestock sourced daily, authentic desi ghee cooking, and traditional Shinwari cooking methods with zero artificial preservatives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#EDE5D7] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#12372D] text-[#B69A62] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-display font-bold text-lg text-[#12372D]">
              Family Respect & Privacy
            </h3>
            <p className="text-xs text-[#242824]/80 leading-relaxed">
              Thoughtfully arranged family dining halls and secluded seating enclosures ensuring complete dignity and comfort.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#EDE5D7] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#12372D] text-[#B69A62] flex items-center justify-center font-bold">
              04
            </div>
            <h3 className="font-display font-bold text-lg text-[#12372D]">
              Staff Trustworthiness
            </h3>
            <p className="text-xs text-[#242824]/80 leading-relaxed">
              Trained, courteous hospitality personnel renowned across Dera Ghazi Khan for integrity, punctuality, and customer care.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Ambiance Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl overflow-hidden shadow-lg h-80 bg-[#EDE5D7]">
            <img
              src="/src/assets/images/restaurant_ambiance_interior_1793524770716.jpg"
              alt="Family Dining Hall"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg h-80 bg-[#EDE5D7]">
            <img
              src="/src/assets/images/hero_zaytoon_riverside_dining_1793524768913.jpg"
              alt="Riverside Dusk"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Next Actions */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="p-8 bg-[#EDE5D7] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h3 className="font-display font-bold text-xl text-[#12372D]">
              Experience Zaytoon In Person
            </h3>
            <p className="text-xs text-[#242824]/80">
              We welcome you any hour of the day or night on the banks of the Indus.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/menu')}
              className="px-5 py-2.5 bg-[#12372D] text-white text-xs font-semibold rounded hover:bg-[#0B241E] transition-colors"
            >
              Explore Menu
            </button>
            <button
              onClick={() => navigate('/reservation')}
              className="px-5 py-2.5 border border-[#12372D] text-[#12372D] text-xs font-semibold rounded hover:bg-white transition-colors"
            >
              Book a Table
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
