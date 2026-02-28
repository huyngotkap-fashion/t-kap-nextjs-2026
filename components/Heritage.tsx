
import React, { useEffect, useState } from 'react';
import { Language, HeritageConfig } from '../types';

interface HeritageProps {
  language: Language;
  config: HeritageConfig;
}

const Heritage: React.FC<HeritageProps> = ({ language, config }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const subtitle = config.subtitle?.[language] || config.subtitle?.['vi'];
  const title = config.title?.[language] || config.title?.['vi'];
  const desc1 = config.description1?.[language] || config.description1?.['vi'];
  const desc2 = config.description2?.[language] || config.description2?.['vi'];
  const values = config.values?.[language] || config.values?.['vi'] || [];

  return (
    <section className="bg-white py-16 md:py-32 overflow-hidden border-b border-zinc-100">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
          
          {/* Left: Imagery Stack with Parallax Interaction */}
          <div className="relative h-[450px] md:h-[850px] group">
            <div 
              className="absolute top-0 left-0 w-4/5 h-4/5 z-10 animate-reveal shadow-2xl overflow-hidden border-8 border-white transition-transform duration-700 ease-out"
              style={{ transform: `translateY(${scrollY * 0.05}px)` }}
            >
              <img 
                src={config.imageMain} 
                alt="Brand Heritage" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2.5s] ease-boss group-hover:scale-105" 
              />
            </div>
            <div 
              className="absolute bottom-0 right-0 w-[65%] h-[60%] border-[15px] md:border-[30px] border-white z-20 shadow-2xl animate-reveal delay-300 overflow-hidden transition-transform duration-700 ease-out"
              style={{ transform: `translateY(-${scrollY * 0.03}px)` }}
            >
              <img 
                src={config.imageSecondary} 
                alt="Detail Craftsmanship" 
                className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110" 
              />
            </div>
            {/* Visual Deco */}
            <div className="absolute top-[20%] right-0 w-px h-1/2 bg-zinc-200 -z-10"></div>
          </div>

          {/* Right: Narrative Content */}
          <div className="space-y-8 md:space-y-16 lg:pl-12">
            <div>
              <span className="text-[10px] md:text-[12px] tracking-[0.6em] font-black text-zinc-400 uppercase mb-4 block animate-reveal">
                {subtitle}
              </span>
              <h2 className="text-4xl md:text-7xl lg:text-[6rem] font-black leading-[1.05] text-zinc-900 uppercase tracking-tighter vietnamese-fix animate-reveal delay-100" 
                dangerouslySetInnerHTML={{ __html: title }} 
              />
            </div>

            <div className="space-y-6 md:space-y-10 text-sm md:text-xl font-light text-zinc-600 leading-relaxed max-w-xl animate-reveal delay-200">
              <p className="text-zinc-500 font-normal vietnamese-fix" dangerouslySetInnerHTML={{ __html: desc1 }} />
              <div className="w-16 h-px bg-zinc-300 my-8"></div>
              <p className="font-black text-zinc-900 uppercase tracking-tight text-xl md:text-2xl vietnamese-fix" dangerouslySetInnerHTML={{ __html: desc2 }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pt-10 border-t border-zinc-100 animate-reveal delay-300">
              {values.map((v, i) => (
                <div key={i} className="flex items-center gap-6 group cursor-default">
                  <div className="w-3 h-3 bg-zinc-900 rounded-full transition-all duration-700 group-hover:scale-[1.8] group-hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]"></div>
                  <span className="text-[11px] md:text-[13px] font-black tracking-[0.3em] uppercase text-zinc-900 transition-colors group-hover:text-zinc-500">{v}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Heritage;
