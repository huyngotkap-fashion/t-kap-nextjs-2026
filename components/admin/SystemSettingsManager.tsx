
import React from 'react';
import { SiteConfig } from '../../types';

interface SystemSettingsManagerProps {
  config: SiteConfig;
  onUpdate: (newConfig: SiteConfig) => void;
}

const SystemSettingsManager: React.FC<SystemSettingsManagerProps> = ({ config, onUpdate }) => {
  const inputBase = "w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all";
  const labelBase = "text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block";

  return (
    <div className="animate-reveal pb-20 space-y-12">
      <section className="bg-white border border-zinc-200 p-10 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-xl font-black uppercase mb-8 border-b border-zinc-100 pb-4">Thương hiệu & Logo</h3>
          <div className="space-y-6">
            <div><label className={labelBase}>Link Logo Image (URL)</label><input value={config.logoImageUrl} onChange={e => onUpdate({...config, logoImageUrl: e.target.value})} className={inputBase} /></div>
            <div className="h-32 bg-zinc-900 flex items-center justify-center p-4 border border-zinc-800">
               <img src={config.logoImageUrl} className="h-full object-contain" alt="Logo Preview" />
            </div>
            <div><label className={labelBase}>Màu chủ đạo thương hiệu (Hex)</label><input type="color" value={config.brandPrimaryColor} onChange={e => onUpdate({...config, brandPrimaryColor: e.target.value})} className="w-full h-12 cursor-pointer border-zinc-200" /></div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black uppercase mb-8 border-b border-zinc-100 pb-4">Promo Popup (Khuyến mãi)</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-6 mb-6">
               <div className="flex items-center gap-3">
                 <span className="text-[10px] font-bold uppercase tracking-widest">Kích hoạt:</span>
                 <button onClick={() => onUpdate({...config, promoPopup: {...config.promoPopup, isActive: !config.promoPopup.isActive}})} className={`w-12 h-6 rounded-full relative transition-all ${config.promoPopup.isActive ? 'bg-black' : 'bg-zinc-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.promoPopup.isActive ? 'right-1' : 'left-1'}`} />
                 </button>
               </div>
               <div className="flex items-center gap-3">
                 <span className="text-[10px] font-bold uppercase tracking-widest">Newsletter:</span>
                 <button onClick={() => onUpdate({...config, promoPopup: {...config.promoPopup, showNewsletter: !config.promoPopup.showNewsletter}})} className={`w-12 h-6 rounded-full relative transition-all ${config.promoPopup.showNewsletter ? 'bg-black' : 'bg-zinc-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.promoPopup.showNewsletter ? 'right-1' : 'left-1'}`} />
                 </button>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelBase}>Tiêu đề Popup (VI)</label><input value={config.promoPopup.title.vi} onChange={e => onUpdate({...config, promoPopup: {...config.promoPopup, title: {en: config.promoPopup.title.en, vi: e.target.value}}})} className={inputBase} /></div>
              <div><label className={labelBase}>Tiêu đề Popup (EN)</label><input value={config.promoPopup.title.en} onChange={e => onUpdate({...config, promoPopup: {...config.promoPopup, title: {en: e.target.value, vi: config.promoPopup.title.vi}}})} className={inputBase} /></div>
            </div>

            <div><label className={labelBase}>Link Ảnh Banner Popup</label><input value={config.promoPopup.imageUrl} onChange={e => onUpdate({...config, promoPopup: {...config.promoPopup, imageUrl: e.target.value}})} className={inputBase} /></div>
            
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelBase}>Kết thúc đếm ngược (ISO Date)</label><input type="datetime-local" value={config.promoPopup.countdownEnd ? config.promoPopup.countdownEnd.slice(0, 16) : ''} onChange={e => onUpdate({...config, promoPopup: {...config.promoPopup, countdownEnd: new Date(e.target.value).toISOString()}})} className={inputBase} /></div>
              <div><label className={labelBase}>Tần suất hiện lại (Số ngày)</label><input type="number" value={config.promoPopup.frequencyDays || 0} onChange={e => onUpdate({...config, promoPopup: {...config.promoPopup, frequencyDays: parseInt(e.target.value)}})} className={inputBase} /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div><label className={labelBase}>Text Nút bấm (VI)</label><input value={config.promoPopup.buttonText?.vi || ''} onChange={e => onUpdate({...config, promoPopup: {...config.promoPopup, buttonText: {en: config.promoPopup.buttonText?.en || '', vi: e.target.value}}})} className={inputBase} /></div>
               <div><label className={labelBase}>Link dẫn hướng</label><input value={config.promoPopup.link} onChange={e => onUpdate({...config, promoPopup: {...config.promoPopup, link: e.target.value}})} className={inputBase} /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white p-10 shadow-2xl">
        <h3 className="text-xl font-black uppercase mb-8 border-b border-zinc-800 pb-4">Kết nối Mạng xã hội</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-blue-500 rounded-full" /> <span className="text-[10px] font-bold uppercase tracking-widest">Facebook</span></div>
             <input value={config.contactFacebook} onChange={e => onUpdate({...config, contactFacebook: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-xs text-white" placeholder="Link Fanpage" />
             <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={config.showFacebook} onChange={e => onUpdate({...config, showFacebook: e.target.checked})} /> <span className="text-[10px]">Hiển thị ngoài Footer</span></label>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-cyan-400 rounded-full" /> <span className="text-[10px] font-bold uppercase tracking-widest">Zalo Chat</span></div>
             <input value={config.contactZalo} onChange={e => onUpdate({...config, contactZalo: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-xs text-white" placeholder="Link Zalo Me" />
             <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={config.showZalo} onChange={e => onUpdate({...config, showZalo: e.target.checked})} /> <span className="text-[10px]">Hiển thị Floating Button</span></label>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-red-600 rounded-full" /> <span className="text-[10px] font-bold uppercase tracking-widest">Youtube</span></div>
             <input value={config.contactYoutube} onChange={e => onUpdate({...config, contactYoutube: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-xs text-white" placeholder="Link Channel" />
             <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={config.showYoutube} onChange={e => onUpdate({...config, showYoutube: e.target.checked})} /> <span className="text-[10px]">Hiển thị Footer</span></label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SystemSettingsManager;
