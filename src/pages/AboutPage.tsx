import React, { useEffect, useState } from 'react';
import { initialSiteSettings } from '../data/initialData.ts';
import heroImage from '../assets/images/hero_zaytoon_riverside_dining_1793524768913.jpg';
import ambianceImage from '../assets/images/restaurant_ambiance_interior_1793524770716.jpg';
import { ArrowRight, Clock, Award, Shield, Users, MapPin } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const [settings, setSettings] = useState(initialSiteSettings);
  useEffect(() => { fetch('/api/v1/site-settings/public').then(r => r.json()).then(result => { if (result.success && result.data) setSettings({ ...initialSiteSettings, ...result.data }); }).catch(() => {}); }, []);
  return (
    <div className="space-y-24 pb-28">
      {/* Editorial Header */}
      <section className="bg-[#D71920] text-white py-24 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Zaytoon Garden Restaurant"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#171717]/75 via-[#171717]/45 to-[#171717]/25" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F4C542]">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-[#FFFFFF] leading-tight text-balance">
            A place to enjoy good food together.
          </h1>
          <p className="text-lg sm:text-xl text-[#F4F4F4]/90 leading-relaxed max-w-2xl mx-auto">
            {settings.address}
          </p>
        </div>
      </section>

      {/* Client's Authentic Story Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-7 sm:p-12 lg:p-14 border border-[#F4F4F4] shadow-sm space-y-10">
          <div className="border-l-4 border-[#F4C542] pl-6 sm:pl-8 py-3">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#D71920] mb-4">
              Welcome to Zaytoon Garden Restaurant
            </h2>
            <p className="text-lg sm:text-xl text-[#171717] leading-loose italic">
              &ldquo;{settings.aboutHistory}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-[#F4F4F4]">
            <div className="space-y-4">
              <h3 className="font-display font-bold text-2xl text-[#D71920]">
                A Garden Dining Experience
              </h3>
              <p className="text-base sm:text-lg text-[#171717]/85 leading-relaxed">
                Zaytoon Garden Restaurant is located near Shah Shams Toll Plaza in Bili Wala, Multan. Its garden-style setting makes it a destination for families, friends and groups. Replace this demo copy with the restaurant’s approved brand story before launch.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display font-bold text-2xl text-[#D71920]">
                Pakistani, Chinese & BBQ Favourites
              </h3>
              <p className="text-base sm:text-lg text-[#171717]/85 leading-relaxed">
                Public restaurant listings mention Pakistani and Chinese cuisine, BBQ and popular dishes such as karahi, reshmi kebab, fried rice, chow mein and Russian salad. Menu availability should be confirmed directly with the restaurant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#D71920] mb-4">
            What Distinguishes Zaytoon
          </h2>
          <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
            Our enduring principles that bring families and highway travelers back time after time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          <div className="bg-white p-7 sm:p-8 rounded-xl border border-[#F4F4F4] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#D71920] text-[#F4C542] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#D71920]">
              Outdoor Garden Dining
            </h3>
            <p className="text-sm sm:text-base text-[#171717]/80 leading-relaxed">
              Open-air terrace seating providing fresh river breeze and scenic waterside panoramas under the evening stars.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-xl border border-[#F4F4F4] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#D71920] text-[#F4C542] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#D71920]">
              Uncompromised Quality
            </h3>
            <p className="text-sm sm:text-base text-[#171717]/80 leading-relaxed">
              Fresh livestock sourced daily, authentic desi ghee cooking, and traditional Shinwari cooking methods with zero artificial preservatives.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-xl border border-[#F4F4F4] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#D71920] text-[#F4C542] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#D71920]">
              Family Respect & Privacy
            </h3>
            <p className="text-sm sm:text-base text-[#171717]/80 leading-relaxed">
              Thoughtfully arranged family dining halls and secluded seating enclosures ensuring complete dignity and comfort.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-8 rounded-xl border border-[#F4F4F4] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#D71920] text-[#F4C542] flex items-center justify-center font-bold">
              04
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#D71920]">
              Staff Trustworthiness
            </h3>
            <p className="text-sm sm:text-base text-[#171717]/80 leading-relaxed">
              A relaxed setting listed for family dining, outdoor seating and group visits. Confirm exact facilities with restaurant management.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Ambiance Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          <div className="rounded-2xl overflow-hidden shadow-lg h-80 sm:h-96 bg-[#F4F4F4]">
            <img
              src={ambianceImage}
              alt="Family Dining Hall"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg h-80 sm:h-96 bg-[#F4F4F4]">
            <img
              src={heroImage}
              alt="Garden Dining"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Next Actions */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
        <div className="p-9 sm:p-12 bg-[#F4F4F4] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h3 className="font-display font-bold text-2xl text-[#D71920]">
              Experience Zaytoon In Person
            </h3>
            <p className="text-base sm:text-lg text-[#171717]/80 leading-relaxed">
              Visit us near Shah Shams Toll Plaza, Bili Wala, Multan. Call ahead to confirm opening hours and availability.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};
