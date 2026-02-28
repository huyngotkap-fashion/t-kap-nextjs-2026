
import React, { useState, useRef } from 'react';
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

export const ProductSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="aspect-[3/4] bg-zinc-100 shimmer rounded-sm" />
    <div className="px-1 space-y-2">
      <div className="h-2 w-16 bg-zinc-100 shimmer" />
      <div className="h-3 w-3/4 bg-zinc-100 shimmer" />
      <div className="h-3 w-12 bg-zinc-100 shimmer" />
    </div>
  </div>
);

interface ProductCardProps {
  product: Product;
  isWished: boolean;
  onToggleWishlist: (id: string) => void;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isWished, onToggleWishlist, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [scrubIndex, setScrubIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const productPath = `/product/${createSlug(product.name)}-${product.id}`;
  const has360 = product.threeSixtyImages && product.threeSixtyImages.length > 0;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!has360 || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    const imagesCount = product.threeSixtyImages!.length;
    const nextIndex = Math.floor((x / width) * imagesCount);
    
    if (nextIndex >= 0 && nextIndex < imagesCount && nextIndex !== scrubIndex) {
      setScrubIndex(nextIndex);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setScrubIndex(0);
  };

  return (
    <div 
      className="group block cursor-pointer relative font-heading animate-reveal"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); onToggleWishlist(product.id); }}
        className={`absolute top-4 right-4 z-[40] w-9 h-9 flex items-center justify-center rounded-full transition-all duration-500 shadow-md translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${isWished ? 'bg-red-50 text-red-600 scale-110' : 'bg-white/90 text-black hover:bg-black hover:text-white'}`}
      >
        <svg className={`w-4.5 h-4.5 transition-colors ${isWished ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <a href={productPath}>
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative aspect-[3/4] overflow-hidden bg-[#f7f7f7] mb-4"
        >
          {has360 && isHovered ? (
            <img
              src={product.threeSixtyImages![scrubIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-150"
            />
          ) : (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-[2.5s] ease-[cubic-bezier(0.16, 1, 0.3, 1)] group-hover:scale-110"
            />
          )}
          
          {has360 && (
            <div className={`absolute top-4 left-4 z-20 transition-all duration-500 flex items-center gap-2 px-2 py-1 bg-white/90 backdrop-blur-sm border border-zinc-100 rounded-sm shadow-sm ${isHovered ? 'bg-black text-white border-black' : 'text-zinc-500'}`}>
               <svg className={`w-3 h-3 ${isHovered ? 'animate-spin-slow' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
               </svg>
               <span className="text-[8px] font-black tracking-widest uppercase">{isHovered ? 'ROTATING' : '360° VIEW'}</span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 z-10 transition-transform duration-500 group-hover:-translate-y-1">
            <span className="text-[10px] md:text-[12px] font-black tracking-widest text-red-600 uppercase">
              {product.brand === 'BOSS' || product.brand === 'HUGO' ? product.brand : 'T-KAP'}
            </span>
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700"></div>

          {product.pricingType === 'price' && product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-12 left-4 bg-black text-white px-2 py-0.5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500">
              <span className="text-[9px] font-bold tracking-widest uppercase">SALE</span>
            </div>
          )}
        </div>

        <div className="px-1 space-y-1">
          <h3 className="text-[11px] md:text-[12px] font-medium text-zinc-900 tracking-wide uppercase leading-tight transition-colors duration-300 group-hover:text-zinc-500">
            {product.name}
          </h3>
          <div className="flex flex-col gap-0.5">
            {product.pricingType === 'quotation' ? (
              <span className="text-[12px] font-bold text-zinc-900 uppercase tracking-tighter">Báo giá</span>
            ) : (
              <>
                <p className="text-[13px] font-black text-zinc-900 tracking-tighter transition-transform duration-300 group-hover:translate-x-1 origin-left">
                  {formatPrice(product.price)}
                </p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <p className="text-[11px] text-zinc-400 line-through tracking-tighter">
                    {formatPrice(product.originalPrice)}
                  </p>
                )}
              </>
            )}
          </div>
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {product.colors.slice(0, 4).map((color, idx) => (
                <div 
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-inner"
                  style={{ backgroundColor: color.startsWith('#') ? color : '#ccc' }}
                />
              ))}
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

interface ProductGridProps {
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, wishlist, onToggleWishlist, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
        {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-16">
      {products
        .filter(product => product.status === 'active')
        .map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            isWished={wishlist.includes(product.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
    </div>
  );
};

export default ProductGrid;
