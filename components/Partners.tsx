
import React from 'react';
import { Partner, Language } from '../types';

interface PartnersProps {
  language: Language;
  partners: Partner[];
}

const Partners: React.FC<PartnersProps> = ({ language, partners }) => {
  if (!partners || partners.length === 0) return null;

  return (
    <section className="py-8 md:py-16 bg-white border-y border-zinc-100 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 text-center">
        <span className="text-[10px] tracking-[0.5em] font-black text-zinc-300 uppercase mb-8 md:mb-12 block">
          {language === 'vi' ? 'ĐỐI TÁC CHIẾN LƯỢC' : 'STRATEGIC PARTNERS'}
        </span>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 md:gap-x-20 gap-y-8 md:gap-y-12 opacity-40 hover:opacity-100 transition-opacity duration-700">
           {partners.map((p) => (
             <div key={p.id} className="h-6 md:h-12 flex items-center grayscale hover:grayscale-0 transition-all duration-500">
                <img 
                  src={p.logoUrl} 
                  alt={p.name} 
                  className="h-full w-auto object-contain"
                  title={p.name}
                />
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
