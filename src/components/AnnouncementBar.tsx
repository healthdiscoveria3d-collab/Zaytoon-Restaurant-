import React from 'react';
import { Phone, Clock, Download } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#0B241E] text-[#EDE5D7] text-xs py-2 px-4 border-b border-[#12372D]/60 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium tracking-wide">
            <Clock className="w-3.5 h-3.5 text-[#B69A62]" />
            <span>24/7 Dining on Sindh River Bank · Near Ghazi Ghat Toll Plaza (N-70)</span>
          </span>
        </div>

        <div className="flex items-center gap-5 text-[11px]">
          <a
            href="tel:+923026777908"
            className="flex items-center gap-1.5 hover:text-[#B69A62] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#B69A62]" />
            <span>+92 302 6777908</span>
          </a>

          <a
            href="/api/v1/download-project-zip"
            download="zaytoon-restaurant-website-complete.zip"
            className="flex items-center gap-1.5 text-[#B69A62] hover:text-white transition-colors bg-[#12372D] px-2.5 py-1 rounded font-medium"
            title="Download full project source code as a ZIP file"
          >
            <Download className="w-3 h-3" />
            <span>Download Project ZIP</span>
          </a>
        </div>
      </div>
    </div>
  );
};
