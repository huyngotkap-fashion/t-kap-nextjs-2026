
import React, { useState, useEffect, useMemo } from 'react';
import { Product, Language, DetailHotspot, ProductMedia } from '../types';
import { translations } from '../translations';
import AIStylist from './AIStylist';
import ProductGrid from './ProductGrid';
import Product360Viewer from './Product360Viewer';

interface HotspotMarkerProps {
  hotspot: DetailHotspot;
  language: Language;
}

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + ' VNĐ';
};

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const isNearLeft = hotspot.x < 25;
  const isNearRight = hotspot.x > 75;
  const isNearTop = hotspot.y < 35;

  const getTooltipPositionClasses = () => {
    let classes = "absolute z-40 w-64 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-zinc-100 p-0 transition-all duration-500 ";
    
    if (isNearTop) {
      classes += "top-full mt-4 origin-top ";
    } else {
      classes += "bottom-full mb-4 origin-bottom ";
    }

    if (isNearLeft) {
      classes += "left-0 -translate-x-2 ";
    } else if (isNearRight) {
      classes += "right-0 translate-x-2 ";
    } else {
      classes += "left-1/2 -translate-x-1/2 ";
    }

    if (isOpen) {
      classes += "opacity-100 scale-100 translate-y-0";
    } else {
      classes += `opacity-0 scale-90 ${isNearTop ? '-translate-y-4' : 'translate-y-4'} pointer-events-none`;
    }

    return classes;
  };

  const getArrowClasses = () => {
    let classes = "absolute border-8 border-transparent ";
    
    if (isNearTop) {
      classes += "bottom-full border-b-white ";
    } else {
      classes += "top-full border-t-white ";
    }

    if (isNearLeft) {
      classes += "left-3 ";
    } else if (isNearRight) {
      classes += "right-3 ";
    } else {
      classes += "left-1/2 -translate-x-1/2 ";
    }

    return classes;
  };
  
  return (
    <div 
      className="absolute z-30" 
      style={{ top: `${hotspot.y}%`, left: `${hotspot.x}%` }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="relative cursor-pointer group">
        <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center border border-white backdrop-blur-sm group-hover:scale-125 transition-all duration-500 shadow-xl">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <div className="absolute inset-0 w-6 h-6 bg-white rounded-full animate-ping opacity-40"></div>
      </div>

      <div className={getTooltipPositionClasses()}>
        {hotspot.imageUrl && (
          <div className="aspect-video overflow-hidden bg-zinc-100">
            <img src={hotspot.imageUrl} className="w-full h-full object-cover" alt="" />
          </div>
        )}
        <div className="p-5 space-y-2">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900 border-b border-zinc-50 pb-2">
            {hotspot.title[language] || hotspot.title['vi']}
          </h4>
          <p className="text-[11px] text-zinc-500 font-medium leading-relaxed italic">
            {hotspot.description[language] || hotspot.description['vi']}
          </p>
        </div>
        <div className={getArrowClasses()}></div>
      </div>
    </div>
  );
};

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  language: Language;
  onAddToCart: (product: Product, size?: string) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ 
  product, allProducts, language, onAddToCart, wishlist, onToggleWishlist 
}) => {
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [show360, setShow360] = useState(false);
  
  useEffect(() => {
    setActiveMediaIdx(0);
    setSelectedColor(product.colors?.[0] || null);
    setSelectedSize(product.sizes?.[0] || null);
    setShow360(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id, product.colors, product.sizes]);

  const t = translations[language].product;

  const currentMedia: ProductMedia = (product.media && product.media.length > activeMediaIdx) 
    ? product.media[activeMediaIdx] 
    : { type: 'image', url: product.imageUrl, hotspots: [] };

  const relatedProducts = useMemo(() => {
    return allProducts
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 5);
  }, [allProducts, product]);

  const isQuotationOnly = product.pricingType === 'quotation' || product.isContactOnly === true;
  const has360 = product.threeSixtyImages && product.threeSixtyImages.length > 0;

  return (
    <div className="bg-white min-h-screen animate-fade-in">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-10 border-b border-zinc-100 flex items-center justify-between">
        <a href="/" className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-all group">
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {language === 'vi' ? 'QUAY LẠI' : 'BACK'}
        </a>
      </div>

      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-170px)]">
        <div className="w-full lg:w-[65%] bg-zinc-50 flex flex-col h-auto lg:h-full lg:sticky lg:top-[170px] border-r border-zinc-100 relative">
          
          {has360 && (
            <button 
              onClick={() => setShow360(!show360)}
              className={`absolute top-10 right-10 z-30 flex items-center gap-3 px-6 py-3 border-2 transition-all duration-500 font-black text-[10px] uppercase tracking-widest ${
                show360 ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-100 hover:border-black shadow-xl'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              {show360 ? (language === 'vi' ? 'XEM ẢNH TĨNH' : 'EXIT 360 VIEW') : (language === 'vi' ? 'XEM 360 ĐỘ' : 'EXPLORE 360°')}
            </button>
          )}

          <div className="flex-1 relative overflow-hidden group min-h-[500px] lg:min-h-0 bg-zinc-200">
            {show360 && product.threeSixtyImages ? (
              <Product360Viewer images={product.threeSixtyImages} className="w-full h-full" />
            ) : (
              <div className="relative w-full h-full">
                {currentMedia?.type === 'video' ? (
                  <video key={currentMedia.url} src={currentMedia.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <img key={currentMedia?.url} src={currentMedia?.url} alt={product.name} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-boss group-hover:scale-105" />
                )}

                {!show360 && currentMedia.type === 'image' && currentMedia.hotspots?.map((hs) => (
                  <HotspotMarker key={hs.id} hotspot={hs} language={language} />
                ))}
              </div>
            )}
            
            {!show360 && product.media && product.media.length > 1 && (
              <>
                <button onClick={() => setActiveMediaIdx((prev) => (prev - 1 + product.media.length) % product.media.length)} className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl p-6 shadow-2xl hover:bg-black hover:text-white transition-all z-20 opacity-0 group-hover:opacity-100">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() => setActiveMediaIdx((prev) => (prev + 1) % product.media.length)} className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl p-6 shadow-2xl hover:bg-black hover:text-white transition-all z-20 opacity-0 group-hover:opacity-100">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
          </div>
          
          {!show360 && product.media && product.media.length > 1 && (
            <div className="bg-white p-8 flex gap-6 overflow-x-auto border-t border-zinc-100 no-scrollbar justify-center">
              {product.media.map((m, idx) => (
                <button key={idx} onClick={() => setActiveMediaIdx(idx)} className={`relative h-24 lg:h-32 aspect-[3/4] border-2 transition-all duration-500 flex-shrink-0 overflow-hidden ${idx === activeMediaIdx ? 'border-black scale-105 shadow-xl' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                  {m.type === 'video' ? (
                    <div className="w-full h-full bg-black flex items-center justify-center text-[10px] font-black text-white">PLAY VIDEO</div>
                  ) : (
                    <img src={m.url} className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-[35%] p-10 md:p-20 lg:p-24 bg-white overflow-y-auto no-scrollbar">
          <div className="max-w-xl mx-auto space-y-12">
            <header>
              <div className="flex items-center gap-6 mb-8">
                <span className="text-[11px] font-black text-zinc-400 tracking-[0.4em] uppercase">{product.category}</span>
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span className="text-[11px] font-black tracking-[0.4em] uppercase text-zinc-900">{product.brand}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 mb-10 leading-[1.1] uppercase tracking-tighter vietnamese-fix">{product.name}</h1>
              <div className="flex flex-col gap-2">
                {isQuotationOnly ? (
                  <p className="text-2xl font-black text-black uppercase tracking-widest">{language === 'vi' ? 'Giá: Báo giá' : 'Price: Quote'}</p>
                ) : (
                  <>
                    <p className="text-4xl font-black text-black">{formatPrice(product.price)}</p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-2xl text-zinc-400 line-through font-light decoration-red-500/20">{formatPrice(product.originalPrice)}</p>
                    )}
                  </>
                )}
              </div>
            </header>

            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-black tracking-[0.2em] uppercase text-zinc-900">
                    {language === 'vi' ? 'Màu sắc' : 'Color'}
                  </label>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all duration-500 flex items-center justify-center ${
                        selectedColor === color ? 'border-black scale-110 shadow-lg' : 'border-transparent hover:border-zinc-200'
                      }`}
                    >
                      <div 
                        className="w-full h-full rounded-full border border-black/5 shadow-inner" 
                        style={{ backgroundColor: color }} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && !isQuotationOnly && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-black tracking-[0.2em] uppercase text-zinc-900">{t.size}</label>
                  <button className="text-[10px] text-zinc-400 underline uppercase tracking-widest font-bold hover:text-black transition-colors">{t.guide}</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)}
                      className={`py-4 border text-[11px] font-black uppercase transition-all duration-300 ${
                        selectedSize === size ? 'bg-black text-white border-black' : 'border-zinc-200 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="prose prose-zinc text-zinc-600 leading-[1.8] font-light border-l-4 border-black/5 pl-10 text-lg vietnamese-fix" dangerouslySetInnerHTML={{ __html: product.description }} />

            <div className="pt-12">
              {isQuotationOnly ? (
                <a href="/quotation" className="w-full py-10 bg-black text-white text-[12px] font-black tracking-[0.5em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-6 shadow-2xl active:scale-95">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  {language === 'vi' ? 'YÊU CẦU BÁO GIÁ SẢN PHẨM' : 'REQUEST PRODUCT QUOTATION'}
                </a>
              ) : (
                <button onClick={() => onAddToCart(product, selectedSize || undefined)} className="w-full py-10 bg-black text-white text-[12px] font-black tracking-[0.5em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-6 shadow-2xl active:scale-95">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  {t.addToBag}
                </button>
              )}
            </div>

            <div className="mt-20 pt-20 border-t border-zinc-100">
              <AIStylist product={product} language={language} />
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="bg-white py-32 border-t border-zinc-100">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="mb-20">
              <span className="text-[11px] tracking-[0.5em] font-black text-zinc-300 uppercase mb-6 block">RECOMMENDATIONS</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">{language === 'vi' ? 'CÓ THỂ BẠN CŨNG THÍCH' : 'YOU MAY ALSO LIKE'}</h2>
            </div>
            <ProductGrid products={relatedProducts} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailView;
