
import React from 'react';
import { SiteConfig } from '../../types';

interface StoreContactManagerProps {
  config: SiteConfig;
  onUpdate: (newConfig: SiteConfig) => void;
}

const StoreContactManager: React.FC<StoreContactManagerProps> = ({ config, onUpdate }) => {
  const inputBase = "w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all";
  const labelBase = "text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block";

  const updateStore = (field: string, value: any) => {
    const newStore = { ...config.storesPage } as any;
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newStore[parent][child] = value;
    } else {
      newStore[field] = value;
    }
    onUpdate({ ...config, storesPage: newStore });
  };

  return (
    <div className="animate-reveal pb-20 space-y-16">
      <section className="bg-white border border-zinc-200 p-10 shadow-lg">
        <h3 className="text-2xl font-black uppercase tracking-tight mb-10 border-b border-zinc-100 pb-4">Trang Tìm kiếm Cửa hàng (Store Locator)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div><label className={labelBase}>Tiêu đề trang (VI)</label><input value={config.storesPage.title.vi} onChange={e => updateStore('title.vi', e.target.value)} className={inputBase} /></div>
            <div><label className={labelBase}>Tên Trụ sở chính</label><input value={config.storesPage.hqName} onChange={e => updateStore('hqName', e.target.value)} className={inputBase} /></div>
            <div><label className={labelBase}>Địa chỉ chi tiết</label><input value={config.storesPage.hqAddress} onChange={e => updateStore('hqAddress', e.target.value)} className={inputBase} /></div>
            <div><label className={labelBase}>Google Maps Embed URL (Iframe src)</label><textarea value={config.storesPage.mapEmbedUrl} onChange={e => updateStore('mapEmbedUrl', e.target.value)} className={inputBase + " h-32"} /></div>
          </div>
          <div className="space-y-6">
            <div><label className={labelBase}>Hotline</label><input value={config.storesPage.hqPhone} onChange={e => updateStore('hqPhone', e.target.value)} className={inputBase} /></div>
            <div><label className={labelBase}>Email liên hệ</label><input value={config.storesPage.hqEmail} onChange={e => updateStore('hqEmail', e.target.value)} className={inputBase} /></div>
            <div><label className={labelBase}>Giờ mở cửa (Ngày thường)</label><input value={config.storesPage.openingHoursWeekdays} onChange={e => updateStore('openingHoursWeekdays', e.target.value)} className={inputBase} /></div>
            <div><label className={labelBase}>Giờ mở cửa (Chủ nhật)</label><input value={config.storesPage.openingHoursSunday} onChange={e => updateStore('openingHoursSunday', e.target.value)} className={inputBase} /></div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-zinc-200 p-10 shadow-lg">
        <h3 className="text-2xl font-black uppercase tracking-tight mb-10 border-b border-zinc-100 pb-4">Thông tin liên hệ chung (Global Contact)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><label className={labelBase}>Hotline chung</label><input value={config.contactPhone} onChange={e => onUpdate({...config, contactPhone: e.target.value})} className={inputBase} /></div>
          <div><label className={labelBase}>Email chung</label><input value={config.contactEmail} onChange={e => onUpdate({...config, contactEmail: e.target.value})} className={inputBase} /></div>
          <div><label className={labelBase}>Địa chỉ trụ sở chính (Footer)</label><input value={config.contactHQ} onChange={e => onUpdate({...config, contactHQ: e.target.value})} className={inputBase} /></div>
        </div>
      </section>
    </div>
  );
};

export default StoreContactManager;
