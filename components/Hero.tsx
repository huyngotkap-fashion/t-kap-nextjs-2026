
import React, { useState, useEffect, useMemo } from 'react';
import { Language, SiteConfig, BannerConfig } from '../types';

interface HeroProps {
  language: Language;
  config: SiteConfig;
  activeCategory: string;
  onAction?: (target: string) => void;
}

const SingleBanner: React.FC<{ 
  b: BannerConfig; 
  language: Language; 
  isActive: boolean;
  onAction?: (target: string) => void; 
}> = ({ b, language, isActive, onAction }) => {
  return (
    <div
      onClick={() => {
        if (b.primaryBtnLink) {
          onAction?.(b.primaryBtnLink);
        }
      }}
      className={`absolute inset-0 w-full h-full cursor-pointer transition-boss duration-[1500ms] ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
    >
      {/* Media Background with Slow Zoom interaction */}
      <div className="absolute inset-0 bg-black overflow-hidden">
        <div className={`w-full h-full transition-transform duration-[8000ms] ease-out ${isActive ? 'scale-110' : 'scale-100'}`}>
          {b.type === 'video' ? (
            <video
              key={b.url} autoPlay loop muted playsInline
              className="w-full h-full object-cover opacity-60"
            >
              <source src={b.url} type="video/mp4" />
            </video>
          ) : (
            <img src={b.url} alt="" className="w-full h-full object-cover opacity-70" />
          )}
        </div>
      </div>

      {/* Content Overlay */}
      <div className={`relative h-full flex flex-col items-center justify-center px-6 text-center ${
        b.contentPosition === 'left' ? 'md:items-start md:text-left md:px-24' : 
        b.contentPosition === 'right' ? 'md:items-end md:text-right md:px-24' : 
        'items-center text-center'
      }`}>
        <div className={`max-w-5xl transition-all duration-[1500ms] ease-[cubic-bezier(0.16, 1, 0.3, 1)] transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className="text-white text-5xl md:text-[7rem] font-extrabold uppercase tracking-tight leading-[1.1] mb-8 vietnamese-fix">
            {b.title[language] || b.title['vi']}
          </h2>
          <p className="text-zinc-300 text-sm md:text-base uppercase tracking-[0.3em] font-medium mb-12 max-w-2xl mx-auto md:mx-0 delay-100 transition-all duration-1000">
            {b.description[language] || b.description['vi']}
          </p>

          <div className={`flex flex-wrap gap-6 ${
            b.contentPosition === 'left' ? 'justify-start' : 
            b.contentPosition === 'right' ? 'justify-end' : 
            'justify-center'
          }`}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAction?.(b.primaryBtnLink);
              }}
              className="bg-white text-black px-12 py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500 border border-white hover:scale-105 active:scale-95 shadow-xl"
            >
              {b.primaryBtnText[language] || b.primaryBtnText['vi']}
            </button>
            {(b.secondaryBtnText?.[language] || b.secondaryBtnText?.['vi']) && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAction?.(b.secondaryBtnLink);
                }}
                className="bg-transparent text-white border border-white px-12 py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 hover:scale-105 active:scale-95"
              >
                {b.secondaryBtnText[language] || b.secondaryBtnText?.['vi']}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BannerSlider: React.FC<{
  banners: BannerConfig[];
  language: Language;
  onAction?: (target: string) => void;
}> = ({ banners, language, onAction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => setCurrentIndex(prev => (prev + 1) % banners.length), 6500);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="relative h-[90vh] md:h-screen w-full bg-black overflow-hidden border-b border-zinc-900">
      {banners.map((b, idx) => (
        <SingleBanner key={b.id} b={b} language={language} isActive={idx === currentIndex} onAction={onAction} />
      ))}
      
      {/* Indicators with smooth scaling */}
      {banners.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-700 ease-boss ${idx === currentIndex ? 'w-16 bg-white' : 'w-4 bg-white/30 hover:bg-white/60'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({ language, config, activeCategory, onAction }) => {
  const bannerGroups = useMemo(() => {
    const filtered = config.banners.filter(b => b.targetMenu === activeCategory);
    const groups: Record<string, BannerConfig[]> = {};
    filtered.forEach(b => {
      const gid = b.sliderGroupId || 'default';
      if (!groups[gid]) groups[gid] = [];
      groups[gid].push(b);
    });
    return Object.entries(groups).map(([gid, groupBanners]) => {
      const sortedBanners = [...groupBanners].sort((a, b) => (a.order || 0) - (b.order || 0));
      return [gid, sortedBanners] as [string, BannerConfig[]];
    });
  }, [config.banners, activeCategory]);

  if (bannerGroups.length === 0) return null;

  return (
    <section className="w-full">
      {bannerGroups.map(([groupId, banners]) => (
        <BannerSlider 
          key={groupId} 
          banners={banners} 
          language={language} 
          onAction={onAction} 
        />
      ))}
    </section>
  );
};

export default Hero;
