
import React, { useState, useEffect } from 'react';
import { Product, Language } from '../types';
import { translations } from '../translations';
import AIStylist from './AIStylist';

interface ProductModalProps {
  product: Product | null;
  language: Language;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onContactRequest: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, language, onClose, onAddToCart, onContactRequest }) => {
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  
  useEffect(() => {
    setActiveMediaIdx(0);
  }, [product?.id]);

  if (!product) return null;
  const t = translations[language].product;

  const currentMedia = (product.media && product.media.length > activeMediaIdx) 
    ? product.media[activeMediaIdx] 
    : { type: 'image', url: product.imageUrl };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-8">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-7xl h-full md:h-[90vh] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row animate-fade-in-up">
        
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 z-[110] p-3 bg-white/10 hover:bg-black hover:text-white rounded-full transition-all duration-300 border border-black/5 md:border-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full md:w-[55%] flex flex-col bg-zinc-100 h-[50vh] md:h-full border-r border-zinc-100">
          <div className="flex-1 relative overflow-hidden group bg-zinc-200">
            {currentMedia?.type === 'video' ? (
              <video 
                key={currentMedia.url}
                src={currentMedia.url} 
                autoPlay loop muted playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                key={currentMedia?.url}
                src={currentMedia?.url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
            )}
            
            {product.media && product.media.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMediaIdx((prev) => (prev - 1 + product.media.length) % product.media.length);
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white p-4 shadow-2xl hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMediaIdx((prev) => (prev + 1) % product.media.length);
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white p-4 shadow-2xl hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
          </div>
          
          {product.media && product.media.length > 1 && (
            <div className="h-24 bg-white p-3 flex gap-3 overflow-x-auto border-t border-zinc-100 no-scrollbar">
              {product.media.map((m, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveMediaIdx(idx)}
                  className={`relative h-full aspect-[3/4] border-2 transition-all duration-300 flex-shrink-0 overflow-hidden ${idx === activeMediaIdx ? 'border-black scale-95' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  {m.type === 'video' ? (
                    <div className="w-full h-full bg-black flex items-center justify-center text-[10px] font-black text-white">MOV</div>
                  ) : (
                    <img src={m.url} className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-[45%] p-8 md:p-16 overflow-y-auto bg-white custom-scrollbar h-full">
          <div className="max-w-md mx-auto">
            <header className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-black text-zinc-400 tracking-[0.3em] uppercase">{product.category}</span>
                <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-900">{product.brand}</span>
              </div>
              <h2 className="text-4xl font-serif text-zinc-900 mb-6 leading-[1.1] uppercase font-bold">{product.name}</h2>
              <div className="flex items-baseline gap-4">
                {product.isContactOnly ? (
                  <p className="text-xl font-black text-zinc-400 uppercase tracking-widest">{language === 'vi' ? 'Giá: Báo giá' : 'Price upon request'}</p>
                ) : (
                  <>
                    <p className="text-2xl font-black text-black">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-lg text-zinc-400 line-through font-light">${product.originalPrice}</p>
                    )}
                  </>
                )}
              </div>
            </header>
            
            <div 
              className="prose prose-zinc prose-sm text-zinc-600 mb-12 leading-relaxed font-light border-l-2 border-zinc-100 pl-6"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {!product.isContactOnly && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[11px] font-black tracking-[0.2em] uppercase text-black">{t.size}</label>
                  <button className="text-[10px] text-zinc-400 underline uppercase tracking-widest font-bold hover:text-black transition-colors">{t.guide}</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['EU 48', 'EU 50', 'EU 52', 'EU 54'].map(size => (
                    <button key={size} className="py-4 border border-zinc-200 text-[11px] font-black uppercase hover:border-black hover:bg-black hover:text-white transition-all">
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.isContactOnly ? (
              <button
                onClick={() => {
                  window.location.href = '/quotation';
                  onClose();
                }}
                className="w-full py-6 bg-black text-white text-[11px] font-black tracking-[0.4em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-[0.98]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {language === 'vi' ? 'YÊU CẦU BÁO GIÁ' : 'GET A QUOTATION'}
              </button>
            ) : (
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full py-6 bg-black text-white text-[11px] font-black tracking-[0.4em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-[0.98]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {t.addToBag}
              </button>
            )}

            <div className="mt-12 border-t border-zinc-100 pt-12 min-h-[300px]">
              <AIStylist product={product} language={language} />
            </div>
            
            <footer className="mt-12 text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] text-center">
              Free Express Shipping & Premium Packaging included.
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
