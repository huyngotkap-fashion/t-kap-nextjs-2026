
import React, { useState } from 'react';
import { SiteConfig, MenuItem, BrandNavItem, LandingPage, HiddenLink } from '../../types';

interface NavigationManagerProps {
  config: SiteConfig;
  onUpdate: (newConfig: SiteConfig) => void;
  landingPages?: LandingPage[];
}

const NavigationManager: React.FC<NavigationManagerProps> = ({ config, onUpdate, landingPages = [] }) => {
  const inputBase = "w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all";
  const labelBase = "text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block";

  const hiddenLinks = config.hiddenLinks || [];

  const updateItems = (key: 'navItems' | 'brandNavItems', index: number, field: string, value: any) => {
    const newItems = [...config[key]] as any[];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newItems[index][parent][child] = value;
    } else {
      newItems[index][field] = value;
    }
    onUpdate({ ...config, [key]: newItems });
  };

  const addItem = (key: 'navItems' | 'brandNavItems') => {
    if (key === 'navItems') {
      const newItem: MenuItem = { id: Date.now().toString(), label: { en: 'New', vi: 'Mới' }, targetCategory: '/' };
      onUpdate({ ...config, navItems: [...config.navItems, newItem] });
    } else {
      const newItem: BrandNavItem = { id: Date.now().toString(), label: 'BRAND', targetCategory: '/' };
      onUpdate({ ...config, brandNavItems: [...config.brandNavItems, newItem] });
    }
  };

  const removeItem = (key: 'navItems' | 'brandNavItems', id: string) => {
    onUpdate({ ...config, [key]: (config[key] as any[]).filter(i => i.id !== id) });
  };

  // --- Hidden Links Logic ---
  const addHiddenLink = () => {
    const newLink: HiddenLink = { 
      id: `link-${Date.now()}`, 
      title: 'Trang nhúng mới', 
      url: 'https://', 
      isActive: true 
    };
    onUpdate({ ...config, hiddenLinks: [...hiddenLinks, newLink] });
  };

  const updateHiddenLink = (index: number, field: keyof HiddenLink, value: any) => {
    const newLinks = [...hiddenLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onUpdate({ ...config, hiddenLinks: newLinks });
  };

  const removeHiddenLink = (index: number) => {
    onUpdate({ ...config, hiddenLinks: hiddenLinks.filter((_, i) => i !== index) });
  };

  const activeLPs = landingPages.filter(lp => lp.isActive);
  const activeHiddenLinks = hiddenLinks.filter(l => l.isActive);

  return (
    <div className="animate-reveal space-y-20 pb-40">
      {/* 1. Header Menu Management */}
      <section>
        <div className="flex justify-between items-center mb-10 border-b border-zinc-100 pb-4">
          <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900">Thanh điều hướng chính (Header Menu)</h3>
          <button onClick={() => addItem('navItems')} className="bg-black text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all">+ THÊM MENU</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.navItems.map((item, idx) => (
            <div key={item.id} className="bg-white border border-zinc-100 p-6 shadow-sm group">
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Tên hiển thị (VI)</label>
                  <input value={item.label.vi} onChange={e => updateItems('navItems', idx, 'label.vi', e.target.value)} className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Đường dẫn / Loại trang</label>
                  <div className="flex flex-col gap-2">
                    <input value={item.targetCategory} onChange={e => updateItems('navItems', idx, 'targetCategory', e.target.value)} className={inputBase} placeholder="e.g. /khuyen-mai" />
                    
                    <div className="mt-2 space-y-2">
                      <div>
                        <label className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest block mb-1">Hệ thống & Chiến dịch:</label>
                        <select 
                          className="w-full bg-zinc-50 border border-zinc-100 px-3 py-2 text-[9px] uppercase font-bold outline-none"
                          onChange={(e) => e.target.value && updateItems('navItems', idx, 'targetCategory', e.target.value)}
                          value={item.targetCategory}
                        >
                          <option value="">-- Chọn trang nhanh --</option>
                          <optgroup label="Hệ thống">
                            <option value="Quotation">Báo giá</option>
                            <option value="Stores">Cửa hàng</option>
                            <option value="Admin">Quản trị</option>
                            <option value="History">Lịch sử đơn hàng</option>
                            <option value="Men">Thời trang Nam</option>
                            <option value="Women">Thời trang Nữ</option>
                            <option value="Journal">Tạp chí / Blog</option>
                          </optgroup>
                          {activeLPs.length > 0 && (
                            <optgroup label="Landing Pages">
                              {activeLPs.map(lp => <option key={lp.id} value={`/${lp.id}`}>{lp.title}</option>)}
                            </optgroup>
                          )}
                          {activeHiddenLinks.length > 0 && (
                            <optgroup label="Trang nhúng (Link ẩn)">
                              {activeHiddenLinks.map(link => <option key={link.id} value={`/${link.id}`}>{link.title}</option>)}
                            </optgroup>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeItem('navItems', item.id)} className="text-[9px] font-bold uppercase text-red-500 hover:underline">Xóa Menu này</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Hidden Links Management */}
      <section className="bg-zinc-50 p-10 border border-zinc-200">
        <div className="flex justify-between items-center mb-10 border-b border-zinc-200 pb-4">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900">Quản lý Link Ẩn (Nhúng Trang Ngoài)</h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Sử dụng Iframe để nhúng bất kỳ website nào vào phần thân trang của bạn.</p>
          </div>
          <button onClick={addHiddenLink} className="bg-blue-600 text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">+ TẠO LINK ẨN</button>
        </div>
        
        <div className="space-y-4">
          {hiddenLinks.length === 0 ? (
            <div className="py-10 text-center text-zinc-300 font-bold uppercase tracking-widest border-2 border-dashed border-zinc-200">Chưa có link nhúng nào</div>
          ) : (
            hiddenLinks.map((link, idx) => (
              <div key={idx} className="bg-white border border-zinc-200 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelBase}>Tiêu đề (Để quản lý)</label>
                      <input value={link.title} onChange={e => updateHiddenLink(idx, 'title', e.target.value)} className={inputBase} />
                    </div>
                    <div>
                      <label className={labelBase}>Đường dẫn ảo (Slug)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 text-xs">/</span>
                        <input value={link.id} onChange={e => updateHiddenLink(idx, 'id', e.target.value.toLowerCase().replace(/\s+/g, '-'))} className={inputBase} />
                      </div>
                    </div>
                    <div>
                      <label className={labelBase}>URL Đích (Trang web muốn nhúng)</label>
                      <input value={link.url} onChange={e => updateHiddenLink(idx, 'url', e.target.value)} className={inputBase} placeholder="https://example.com" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => updateHiddenLink(idx, 'isActive', !link.isActive)}
                     className={`px-4 py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${link.isActive ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'}`}
                   >
                     {link.isActive ? 'Bật' : 'Tắt'}
                   </button>
                   <button onClick={() => removeHiddenLink(idx)} className="px-4 py-3 text-[9px] font-black uppercase text-red-500 border border-red-100 hover:bg-red-50">Xóa</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 3. Brand Tabs Management */}
      <section>
        <div className="flex justify-between items-center mb-10 border-b border-zinc-100 pb-4">
          <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900">Danh mục Thương hiệu (Brand Tabs)</h3>
          <button onClick={() => addItem('brandNavItems')} className="bg-black text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800">+ THÊM THƯƠNG HIỆU</button>
        </div>
        <div className="flex flex-wrap gap-4">
          {config.brandNavItems.map((item, idx) => (
            <div key={item.id} className="bg-zinc-50 border border-zinc-200 p-6 w-64 shadow-sm relative">
              <button onClick={() => removeItem('brandNavItems', item.id)} className="absolute top-2 right-2 text-zinc-400 hover:text-black transition-colors">✕</button>
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Tên Thương hiệu</label>
                  <input value={item.label} onChange={e => updateItems('brandNavItems', idx, 'label', e.target.value)} className={inputBase} placeholder="BOSS, HUGO..." />
                </div>
                <div>
                  <label className={labelBase}>Đường dẫn (Slug)</label>
                  <input value={item.targetCategory} onChange={e => updateItems('brandNavItems', idx, 'targetCategory', e.target.value)} className={inputBase} placeholder="Path" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NavigationManager;
