
import React, { useState } from 'react';
import { getStylingAdvice } from '../services/geminiService';
import { StylingAdvice, Product, Language } from '../types';
import { translations } from '../translations';

interface AIStylistProps {
  product: Product;
  language: Language;
}

const AIStylist: React.FC<AIStylistProps> = ({ product, language }) => {
  const [advice, setAdvice] = useState<StylingAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [occasion, setOccasion] = useState('Business Meeting');
  const t = translations[language].product;

  const occasions = language === 'vi' 
    ? ['Họp Kinh Doanh', 'Tiệc Tối', 'Cuối Tuần', 'Khách Dự Đám Cưới', 'Buổi Hẹn Hò']
    : ['Business Meeting', 'Evening Gala', 'Casual Weekend', 'Wedding Guest', 'First Date'];

  const handleGetAdvice = async () => {
    setLoading(true);
    const result = await getStylingAdvice(product.name, product.category, occasion, language);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="mt-12 p-8 bg-zinc-50 border border-zinc-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 15.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-900">{t.stylistTitle}</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] tracking-[0.1em] uppercase text-zinc-500 mb-2">{t.selectOccasion}</label>
          <div className="flex flex-wrap gap-2">
            {occasions.map((occ) => (
              <button
                key={occ}
                onClick={() => setOccasion(occ)}
                className={`px-4 py-2 text-[10px] uppercase tracking-wider transition-all border ${occasion === occ ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'}`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGetAdvice}
          disabled={loading}
          className="w-full py-4 bg-zinc-900 text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {loading ? t.consulting : t.getAdvice}
        </button>

        {advice && (
          <div className="mt-8 animate-fade-in">
            <div className="mb-4">
              <span className="text-[10px] tracking-[0.1em] uppercase text-zinc-500">{t.stylistNote}</span>
              <p className="text-sm leading-relaxed text-zinc-700 mt-2 font-light">{advice.suggestion}</p>
            </div>
            <div>
              <span className="text-[10px] tracking-[0.1em] uppercase text-zinc-500">{t.pairings}</span>
              <ul className="mt-3 space-y-2">
                {advice.itemsToPair.map((item, idx) => (
                  <li key={idx} className="text-xs text-zinc-900 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStylist;
