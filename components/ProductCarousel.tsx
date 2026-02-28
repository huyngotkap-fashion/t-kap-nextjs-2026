
import React, { useState, useMemo } from 'react';
import { Product } from '../types';

const createSlug = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + ' VNĐ';
};

interface ProductCarouselProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  isLoading?: boolean;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, wishlist, onToggleWishlist, isLoading }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % products.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + products.length) % products.length);

  const visibleItems = useMemo(() => {
    if (products.length === 0) return [];
    const items = [];
    for (let i = -2; i <= 2; i++) {
      let index = (activeIndex + i) % products.length;
      if (index < 0) index = products.length + index;
      items.push({ product: products[index], offset: i, originalIndex: index });
    }
    return items;
  }, [products, activeIndex]);

  if (isLoading) {
    return (
      <div className="relative w-full py-16 bg-zinc-50 overflow-hidden">
        <div className="flex items-center justify-center min-h-[600px] relative">
          <div className="w-[340px] aspect-[3/4] bg-zinc-200 shimmer shadow-2xl rounded-sm" />
          <div className="absolute left-[10%] w-[280px] aspect-[3/4] bg-zinc-100 shimmer opacity-50 hidden md:block" />
          <div className="absolute right-[10%] w-[280px] aspect-[3/4] bg-zinc-100 shimmer opacity-50 hidden md:block" />
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="relative w-full py-16 bg-zinc-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-[600px] relative">
        {visibleItems.map(({ product, offset, originalIndex }) => {
          const isCenter = offset === 0;
          const isFar = Math.abs(offset) === 2;
          const isWished = wishlist.includes(product.id);
          const productPath = `/product/${createSlug(product.name)}-${product.id}`;

          return (
            <div
              key={`${product.id}-${offset}`}
              className={`absolute transition-all duration-[800ms] cubic-bezier(0.4, 0, 0.2, 1) cursor-pointer transform flex flex-col items-center group
                ${isCenter ? 'z-30 scale-125 opacity-100 translate-x-0' : ''}
                ${offset === -1 ? 'z-20 scale-90 opacity-70 -translate-x-[110%] md:-translate-x-[140%]' : ''}
                ${offset === 1 ? 'z-20 scale-90 opacity-70 translate-x-[110%] md:translate-x-[140%]' : ''}
                ${offset === -2 ? 'z-10 scale-75 opacity-30 -translate-x-[200%] md:-translate-x-[250%]' : ''}
                ${offset === 2 ? 'z-10 scale-75 opacity-30 translate-x-[200%] md:translate-x-[250%]' : ''}
              `}
              style={{ width: isCenter ? '340px' : '280px' }}
            >
              <div 
                className={`relative w-full aspect-[3/4] bg-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-700 ${isCenter ? 'ring-1 ring-black/5' : ''}`}
                onClick={() => { if (!isCenter) setActiveIndex(originalIndex); }}
              >
                <a href={productPath} onClick={(e) => !isCenter && e.preventDefault()}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 ${isCenter ? 'scale-105' : 'scale-100'}`}
                  />
                </a>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); onToggleWishlist(product.id); }}
                  className={`absolute top-4 right-4 z-40 p-2.5 rounded-full transition-all duration-300 ${isWished ? 'bg-black text-white' : 'bg-white/80 text-black hover:bg-black hover:text-white'}`}
                >
                  <svg className={`w-4 h-4 ${isWished ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>

                <div className={`absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-black/95 via-black/50 to-transparent text-white transition-all duration-500 ${isFar ? 'opacity-0' : 'opacity-100'} group-hover:from-black pointer-events-none`}>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-300">{product.brand}</span>
                  </div>
                  <h3 className={`font-black uppercase tracking-tight leading-tight mb-2 transition-transform duration-500 group-hover:-translate-y-1 ${isCenter ? 'text-sm' : 'text-xs line-clamp-1'}`}>
                    {product.name}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {product.isContactOnly ? (
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Contact for price</span>
                    ) : (
                      <>
                        <span className={`${isCenter ? 'text-sm' : 'text-xs'} font-black`}>{formatPrice(product.price)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[10px] text-zinc-400 line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className={`mt-8 text-center transition-all duration-700 transform ${isCenter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <a href={productPath} className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-900 border-b-2 border-black pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-colors">
                  Discover Now
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 md:px-16 pointer-events-none z-40">
        <button onClick={prev} className="p-5 bg-black/80 text-white rounded-full hover:bg-black transition-all shadow-2xl pointer-events-auto active:scale-90 backdrop-blur-sm group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={next} className="p-5 bg-black/80 text-white rounded-full hover:bg-black transition-all shadow-2xl pointer-events-auto active:scale-90 backdrop-blur-sm group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
