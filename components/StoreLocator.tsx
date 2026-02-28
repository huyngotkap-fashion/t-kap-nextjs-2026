
import React from 'react';
import { Language, StoresPageConfig } from '../types';
import { translations } from '../translations';

interface StoreLocatorProps {
  language: Language;
  config: StoresPageConfig;
}

const StoreLocator: React.FC<StoreLocatorProps> = ({ language, config }) => {
  const footerT = translations[language].footer;

  return (
    <div className="bg-white min-h-[calc(100vh-125px)] animate-reveal">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          
          {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <span className="text-[10px] tracking-[0.5em] font-black text-zinc-400 uppercase mb-4 block">Store Experience</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 border-b-2 border-black pb-4 inline-block vietnamese-fix">
                {config.title[language] || config.title['vi']}
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed font-light uppercase tracking-widest vietnamese-fix">
                {config.description[language] || config.description['vi']}
              </p>
            </div>

            <div className="space-y-10">
              {/* Trụ sở chính */}
              <div className="group border-l-4 border-black pl-8 py-2">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4">{footerT.contact.hq}</h3>
                <p className="text-xl font-black uppercase leading-tight mb-4 text-zinc-900 vietnamese-fix">
                  {config.hqName}
                </p>
                <p className="text-sm text-zinc-600 font-medium mb-6 vietnamese-fix">
                  {config.hqAddress}
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-bold uppercase text-[10px] tracking-widest mr-2">{footerT.contact.phone}:</span>
                    <a href={`tel:${config.hqPhone}`} className="hover:underline">{config.hqPhone}</a>
                  </p>
                  <p className="text-sm">
                    <span className="font-bold uppercase text-[10px] tracking-widest mr-2">Email:</span>
                    <a href={`mailto:${config.hqEmail}`} className="hover:underline">{config.hqEmail}</a>
                  </p>
                </div>
              </div>

              {/* Giờ mở cửa */}
              <div className="bg-zinc-50 p-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-zinc-400">Opening Hours</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-zinc-200 pb-2">
                    <span className="font-bold uppercase text-[10px] tracking-widest">Mon - Sat</span>
                    <span>{config.openingHoursWeekdays}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="font-bold uppercase text-[10px] tracking-widest text-zinc-400">Sunday</span>
                    <span className="text-zinc-400 italic">{config.openingHoursSunday}</span>
                  </div>
                </div>
              </div>

              <a 
                href={config.mapDirectionUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-black text-white py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {language === 'vi' ? 'CHỈ ĐƯỜNG TRÊN GOOGLE MAPS' : 'GET DIRECTIONS ON MAPS'}
              </a>
            </div>
          </div>

          {/* CỘT PHẢI: BẢN ĐỒ LỚN */}
          <div className="lg:col-span-8 h-[500px] md:h-[700px] lg:h-full min-h-[500px] relative">
            <div className="absolute inset-0 bg-zinc-100 animate-pulse -z-10"></div>
            <iframe 
              src={config.mapEmbedUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl border border-zinc-100"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
