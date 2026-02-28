
import React, { useState } from 'react';
import { Language, LookbookConfig, Product, ProductHotspot } from '../types';

interface LookbookProps {
  language: Language;
  config: LookbookConfig;
  products?: Product[];
  onAddToCart?: (product: Product) => void;
  onNavigate?: (path: string) => void;
}

const HotspotMarker: React.FC<{ 
  hotspot: ProductHotspot; 
  product: Product; 
  language: Language;
  onAddToCart?: (p: Product) => void;
  onNavigate?: (path: string) => void;
}> = ({ hotspot, product, language, onAddToCart, onNavigate }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isVi = language === 'vi';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNavigate) {
      const slug = product.name.toLowerCase().replace(/\s+/g, '-');
      onNavigate(`/product/${slug}-${product.id}`);
    }
  };

  return (
    <div 
      className="absolute z-30" 
      style={{ top: `${hotspot.y}%`, left: `${hotspot.x}%` }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Pulsing Dot */}
      <div className="relative cursor-pointer group">
        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center border border-white backdrop-blur-sm group-hover:scale-125 transition-transform duration-500">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <div className="absolute inset-0 w-5 h-5 bg-white rounded-full animate-ping opacity-30"></div>
      </div>

      {/* Tooltip Card */}
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-zinc-100 p-4 transition-all duration-500 origin-bottom ${showTooltip ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}`}>
        <div className="flex flex-col gap-3">
          <div className="aspect-[3/4] overflow-hidden bg-zinc-100">
            <img src={product.imageUrl} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="space-y-1">
            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{product.brand}</p>
            <h4 className="text-[10px] font-black uppercase tracking-tight text-zinc-900 leading-tight line-clamp-2">{product.name}</h4>
            <p className="text-[11px] font-black">${product.price}</p>
          </div>
          <div className="flex gap-2 pt-1">
            <button 
              onClick={handleClick}
              className="flex-1 bg-black text-white text-[8px] font-black uppercase tracking-widest py-2 hover:bg-zinc-800 transition-colors"
            >
              {isVi ? 'XEM CHI TIẾT' : 'DETAILS'}
            </button>
            {onAddToCart && !product.isContactOnly && (
              <button 
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                className="w-10 bg-zinc-50 border border-zinc-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </button>
            )}
          </div>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
      </div>
    </div>
  );
};

const Lookbook: React.FC<LookbookProps> = ({ language, config, products = [], onAddToCart, onNavigate }) => {
  if (!config.images || config.images.length === 0) return null;

  const title = config.title?.[language] || config.title?.['vi'];
  const subtitle = config.subtitle?.[language] || config.subtitle?.['vi'];
  const discoverText = config.discoverText?.[language] || config.discoverText?.['vi'];
  const discoverLink = config.discoverLink || "/";

  return (
    <section className="bg-zinc-50 py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] md:text-[12px] tracking-[0.6em] font-black text-zinc-400 uppercase mb-4 block animate-reveal">
              {subtitle}
            </span>
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none animate-reveal delay-100">
              {title}
            </h2>
          </div>
          <div className="md:text-right animate-reveal delay-200">
            <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-6 max-w-xs md:ml-auto">
              {discoverText}
            </p>
            <a 
              href={discoverLink}
              className="group inline-flex items-center gap-4 text-zinc-900 border-b-2 border-zinc-900 pb-2 text-[11px] font-black tracking-[0.4em] uppercase hover:text-zinc-500 hover:border-zinc-500 transition-all"
            >
              View Full Campaign
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </div>

        {/* Dynamic Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {config.images.map((img, idx) => (
            <div 
              key={idx} 
              className={`relative overflow-hidden group bg-zinc-200 shadow-sm animate-reveal h-[400px] md:h-[600px] ${
                img.size === 'lg' ? 'md:col-span-2' : 'md:col-span-1'
              }`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <img 
                src={img.url} 
                className="w-full h-full object-cover grayscale transition-all duration-[2s] ease-boss group-hover:scale-105 group-hover:grayscale-0" 
                alt={img.title || 'Collection Visual'} 
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-700"></div>
              
              {/* Hotspots Rendering */}
              {img.hotspots?.map((hs, hIdx) => {
                const product = products.find(p => p.id === hs.productId);
                if (!product) return null;
                return (
                  <HotspotMarker 
                    key={hIdx} 
                    hotspot={hs} 
                    product={product} 
                    language={language}
                    onAddToCart={onAddToCart}
                    onNavigate={onNavigate}
                  />
                );
              })}

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-700 ease-boss pointer-events-none">
                <span className="text-[9px] text-white font-black tracking-[0.4em] uppercase mb-2">Editorial Narrative</span>
                <h3 className="text-white text-xl md:text-2xl font-black uppercase tracking-tight">{img.title}</h3>
                <div className="w-12 h-0.5 bg-white mt-4 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-300"></div>
              </div>
            </div>
          ))}

          {/* Filler Block */}
          {config.images.length % 4 !== 0 && (
            <div className="md:col-span-1 bg-zinc-900 flex items-center justify-center p-12 text-center animate-reveal">
              <div className="space-y-6">
                <div className="w-12 h-1 bg-white/20 mx-auto"></div>
                <p className="text-white/40 text-[9px] font-black tracking-[0.5em] uppercase leading-relaxed">
                  The Signature Collection Heritage Edition 2025
                </p>
                <div className="w-12 h-1 bg-white/20 mx-auto"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Lookbook;
