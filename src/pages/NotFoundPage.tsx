import React from 'react';
import { Utensils, ArrowRight } from 'lucide-react';

interface NotFoundPageProps {
  navigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#F4F4F4] text-[#D71920] flex items-center justify-center mx-auto">
        <Utensils className="w-8 h-8" />
      </div>
      <span className="text-xs uppercase tracking-widest text-[#F4C542] font-semibold">
        404 · Page Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#D71920]">
        This Culinary Route Does Not Exist
      </h1>
      <p className="text-sm text-[#6B7280] max-w-md mx-auto">
        The page you are looking for may have moved or is currently unavailable. Return to our homepage to explore the menu or book a table.
      </p>
      <div className="pt-2">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#D71920] hover:bg-[#171717] text-white font-semibold text-xs rounded transition-colors inline-flex items-center gap-2"
        >
          <span>Return to Zaytoon Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
