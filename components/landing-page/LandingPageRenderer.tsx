
import React from 'react';
import { LandingPage, LPBlock, Language } from '../../types';

interface LandingPageRendererProps {
  page: LandingPage;
  language: Language;
}

const BlockRenderer: React.FC<{ block: LPBlock; language: Language }> = ({ block, language }) => {
  const getAnimClass = (anim: string) => {
    switch (anim) {
      case 'fade-up': return 'animate-reveal';
      case 'fade-in': return 'opacity-0 animate-[fadeIn_1s_ease-out_forwards]';
      case 'zoom-in': return 'scale-110 animate-[zoomOut_1.5s_ease-out_forwards]';
      default: return 'animate-reveal';
    }
  };

  const title = block.title?.[language] || block.title?.['vi'] || '';
  const content = block.content?.[language] || block.content?.['vi'] || '';
  const btnText = block.buttonText?.[language] || block.buttonText?.['vi'] || '';

  if (block.type === 'Hero' || block.type === 'VideoBackground') {
    return (
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center bg-black">
        <div className="absolute inset-0 z-0">
          {block.type === 'VideoBackground' && block.videoUrl ? (
            <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
              <source src={block.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <img src={block.imageUrl} className="w-full h-full object-cover opacity-60" alt="" />
          )}
        </div>
        <div className={`relative z-10 px-6 max-w-5xl ${getAnimClass(block.animation)}`}>
          <h1 className="text-5xl md:text-8xl lg:text-[7rem] font-black text-white uppercase tracking-tighter leading-none mb-8 vietnamese-fix">{title}</h1>
          <p className="text-sm md:text-base text-zinc-300 font-bold tracking-[0.4em] uppercase mb-12 max-w-2xl mx-auto">{content}</p>
          {btnText && (
            <a href={block.buttonLink || '#'} className="inline-block bg-white text-black px-14 py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-boss border border-white">
              {btnText}
            </a>
          )}
        </div>
      </section>
    );
  }

  if (block.type === 'ImageText') {
    return (
      <section className={`py-24 md:py-40 px-6 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center ${block.layout === 'right' ? 'lg:flex-row-reverse' : ''}`}>
        <div className={block.layout === 'right' ? 'lg:order-2' : ''}>
           <div className={`overflow-hidden shadow-2xl ${getAnimClass(block.animation)}`}>
              <img src={block.imageUrl} className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-[2s] ease-boss" alt="" />
           </div>
        </div>
        <div className={`space-y-10 ${block.layout === 'right' ? 'lg:order-1' : ''}`}>
           <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-tight vietnamese-fix">{title}</h2>
           <p className="text-lg md:text-xl text-zinc-500 font-light leading-relaxed vietnamese-fix">{content}</p>
           {btnText && (
             <a href={block.buttonLink || '#'} className="group inline-flex items-center gap-4 text-black border-b-2 border-black pb-2 text-[11px] font-black uppercase tracking-widest hover:text-zinc-500 hover:border-zinc-500 transition-all">
               {btnText}
               <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
             </a>
           )}
        </div>
      </section>
    );
  }

  if (block.type === 'FullImage') {
    return (
      <section className="relative w-full overflow-hidden">
        <div className={`w-full aspect-video md:aspect-[21/9] ${getAnimClass(block.animation)}`}>
           <img src={block.imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2s]" alt="" />
        </div>
        {(title || content) && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 bg-black/40 text-white">
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tighter">{title}</h2>
              <p className="max-w-2xl text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase opacity-80">{content}</p>
           </div>
        )}
      </section>
    );
  }

  if (block.type === 'CallToAction') {
    return (
      <section className="py-32 md:py-52 bg-zinc-900 text-white text-center px-6">
        <div className={`max-w-4xl mx-auto space-y-12 ${getAnimClass(block.animation)}`}>
           <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none vietnamese-fix">{title}</h2>
           <p className="text-zinc-400 text-sm md:text-base font-bold uppercase tracking-[0.4em] max-w-2xl mx-auto">{content}</p>
           {btnText && (
             <a href={block.buttonLink || '#'} className="inline-block bg-white text-black px-16 py-6 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-black hover:text-white transition-boss border border-white">
                {btnText}
             </a>
           )}
        </div>
      </section>
    );
  }

  return null;
};

const LandingPageRenderer: React.FC<LandingPageRendererProps> = ({ page, language }) => {
  if (!page || !page.isActive) return null;

  return (
    <div className="bg-white min-h-screen">
       {page.blocks?.map((block) => (
         <BlockRenderer key={block.id} block={block} language={language} />
       ))}
    </div>
  );
};

export default LandingPageRenderer;
