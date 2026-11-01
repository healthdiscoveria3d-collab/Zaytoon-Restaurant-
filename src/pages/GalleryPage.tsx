import React, { useState } from 'react';
import { initialGallery } from '../data/initialData.ts';
import { GalleryItem } from '../types/index.ts';
import { X, ZoomIn, Eye } from 'lucide-react';

interface GalleryPageProps {
  navigate: (path: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);

  const categories = [
    { label: 'All Photographs', value: 'all' },
    { label: 'Restaurant', value: 'ambiance' },
    { label: 'Culinary Handis & BBQ', value: 'culinary' },
    { label: 'Dining Hall Ambiance', value: 'ambiance' },
    { label: 'Family Banquets', value: 'family' },
  ];

  const filteredGallery = activeCategory === 'all'
    ? initialGallery
    : initialGallery.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <section className="bg-[#D71920] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#F4C542]">
            Visual Moments
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#FFFFFF]">
            A Taste of Zaytoon
          </h1>
          <p className="text-sm sm:text-base text-[#F4F4F4]/85 max-w-2xl mx-auto">
            Explore food and restaurant photographs from Zaytoon.
          </p>
        </div>
      </section>

      {/* Main Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.value
                  ? 'bg-[#D71920] text-white shadow-sm'
                  : 'bg-white border border-[#F4F4F4] text-[#171717] hover:bg-[#F4F4F4]/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightbox(item)}
              className="group bg-white rounded-xl overflow-hidden border border-[#F4F4F4] shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-72 sm:h-80 bg-[#F4F4F4] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/90 text-[#D71920] rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg">
                    <ZoomIn className="w-4 h-4 text-[#F4C542]" />
                    <span>View Photo</span>
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#F4C542] font-semibold">
                  {item.category}
                </span>
                <h3 className="font-display font-bold text-lg text-[#D71920]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#171717]/80 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <button
            onClick={() => setActiveLightbox(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <div className="relative max-h-[75vh] w-auto rounded-lg overflow-hidden shadow-2xl">
              <img
                src={activeLightbox.image}
                alt={activeLightbox.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="text-center text-white mt-4 space-y-1">
              <h3 className="font-display font-bold text-xl">{activeLightbox.title}</h3>
              <p className="text-xs text-[#F4F4F4]/80 max-w-lg">{activeLightbox.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
