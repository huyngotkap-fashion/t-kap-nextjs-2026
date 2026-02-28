
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface BespokeStudioProps {
  language: Language;
}

const BespokeStudio: React.FC<BespokeStudioProps> = ({ language }) => {
  const t = translations[language].bespoke;
  const [config, setConfig] = useState({
    color: '#000000',
    fabric: 'Piqué Cotton',
    collar: 'Classic',
    initials: ''
  });

  const colors = [
    { name: 'Onyx', hex: '#000000' },
    { name: 'Pearl', hex: '#FFFFFF' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Crimson', hex: '#8B0000' },
    { name: 'Sage', hex: '#77815C' }
  ];

  // Helper to determine text color on polo preview
  const isLightColor = config.color === '#FFFFFF' || config.color === '#77815C';

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Visual Preview */}
        <div className="sticky top-40 bg-zinc-100 aspect-square flex flex-col items-center justify-center p-20 rounded-lg border border-zinc-200">
          <div className="relative w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
               {/* Simplified Polo Silhouette */}
               <path 
                d="M40 40 L160 40 L180 180 L20 180 Z" 
                fill={config.color} 
                stroke={isLightColor ? '#e4e4e7' : 'none'}
                strokeWidth="1"
                className="transition-colors duration-500"
               />
               <path d="M70 40 L100 70 L130 40" fill="none" stroke={isLightColor ? '#000' : '#fff'} strokeWidth="1" opacity="0.1" />
               <text 
                x="100" y="110" 
                fill={isLightColor ? '#000000' : '#FFFFFF'} 
                fontSize="20" fontWeight="bold" 
                textAnchor="middle" 
                className="transition-colors duration-500 opacity-60 font-serif"
               >
                {config.initials}
               </text>
            </svg>
          </div>
          <div className="mt-8 text-center bg-white px-6 py-4 rounded shadow-sm border border-zinc-200">
            <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900">{t.preview}</h3>
            <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-[0.2em] font-bold">{config.fabric} — {config.collar} Collar</p>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-12">
          <div>
            <span className="text-[10px] tracking-[0.5em] font-black text-zinc-400 uppercase mb-4 block">{t.subtitle}</span>
            <h2 className="text-6xl font-black tracking-tighter uppercase mb-8 text-zinc-900 border-b-2 border-black pb-4 inline-block">
              {t.title}
            </h2>
          </div>

          <div className="space-y-12">
            {/* Fabric Selection */}
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest mb-6 block text-zinc-900 border-l-4 border-black pl-4">{t.fabric}</label>
              <div className="grid grid-cols-2 gap-4">
                {['Piqué Cotton', 'Jersey Cotton', 'Mercerized Silk', 'Tech Performance'].map(f => (
                  <button
                    key={f}
                    onClick={() => setConfig({...config, fabric: f})}
                    className={`py-6 border text-[10px] uppercase font-black tracking-[0.2em] transition-all rounded ${config.fabric === f ? 'bg-black text-white border-black shadow-xl scale-[1.02]' : 'bg-white border-zinc-200 text-zinc-500 hover:border-black hover:text-black'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest mb-6 block text-zinc-900 border-l-4 border-black pl-4">{t.color}</label>
              <div className="flex gap-6 flex-wrap">
                {colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setConfig({...config, color: c.hex})}
                    className={`w-12 h-12 rounded-full border-4 transition-all shadow-sm flex items-center justify-center ${config.color === c.hex ? 'border-zinc-900 scale-125 shadow-xl' : 'border-zinc-200 hover:scale-110'}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {config.color === c.hex && (
                      <div className={`w-2 h-2 rounded-full ${isLightColor ? 'bg-black' : 'bg-white'}`}></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Monogram */}
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest mb-6 block text-zinc-900 border-l-4 border-black pl-4">{t.monogram}</label>
              <input
                type="text"
                maxLength={3}
                placeholder="A.B.C"
                value={config.initials}
                onChange={e => setConfig({...config, initials: e.target.value.toUpperCase()})}
                className="w-full border-b-2 border-zinc-300 py-6 text-4xl font-serif focus:outline-none focus:border-black placeholder:text-zinc-200 bg-transparent transition-all"
              />
            </div>

            <button className="w-full py-8 bg-black text-white text-[11px] font-black tracking-[0.4em] uppercase hover:bg-zinc-800 transition-all shadow-2xl rounded">
              {t.addToCart} — $245
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BespokeStudio;
