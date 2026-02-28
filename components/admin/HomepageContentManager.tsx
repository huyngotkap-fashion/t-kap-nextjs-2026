
import React, { useState } from 'react';
import { SiteConfig, LookbookImage, ProductHotspot, Product } from '../../types';

interface HomepageContentManagerProps {
  config: SiteConfig;
  onUpdate: (newConfig: SiteConfig) => void;
  products?: Product[];
}

const HomepageContentManager: React.FC<HomepageContentManagerProps> = ({ config, onUpdate, products = [] }) => {
  const [editingHotspotsIdx, setEditingHotspotsIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<Record<string, string>>({}); // Store search query per hotspot
  
  const inputBase = "w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all";
  const labelBase = "text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block";

  // Khởi tạo an toàn cho dữ liệu Heritage
  const heritage = config?.heritage || {
    subtitle: { en: '', vi: '' },
    title: { en: '', vi: '' },
    description1: { en: '', vi: '' },
    description2: { en: '', vi: '' },
    imageMain: '',
    imageSecondary: '',
    values: { en: [], vi: [] }
  };

  // Khởi tạo an toàn cho dữ liệu Lookbook
  const lookbook = config?.lookbook || {
    title: { en: '', vi: '' },
    subtitle: { en: '', vi: '' },
    discoverText: { en: '', vi: '' },
    discoverLink: '/',
    images: []
  };

  // --- Heritage Handlers ---
  const updateHeritage = (field: string, value: any) => {
    const newHeritage = JSON.parse(JSON.stringify(heritage));
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (!newHeritage[parent]) newHeritage[parent] = {};
      newHeritage[parent][child] = value;
    } else {
      newHeritage[field] = value;
    }
    onUpdate({ ...config, heritage: newHeritage });
  };

  const addHeritageValue = (lang: 'en' | 'vi') => {
    const newValues = { ...heritage.values };
    if (!newValues[lang]) newValues[lang] = [];
    newValues[lang] = [...newValues[lang], 'New Value'];
    updateHeritage('values', newValues);
  };

  const updateHeritageValue = (lang: 'en' | 'vi', index: number, val: string) => {
    const newValues = { ...heritage.values };
    newValues[lang][index] = val;
    updateHeritage('values', newValues);
  };

  const removeHeritageValue = (lang: 'en' | 'vi', index: number) => {
    const newValues = { ...heritage.values };
    newValues[lang] = newValues[lang].filter((_, i) => i !== index);
    updateHeritage('values', newValues);
  };

  // --- Lookbook Handlers ---
  const updateLookbook = (field: string, value: any) => {
    const newLookbook = JSON.parse(JSON.stringify(lookbook));
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (!newLookbook[parent]) newLookbook[parent] = {};
      newLookbook[parent][child] = value;
    } else {
      newLookbook[field] = value;
    }
    onUpdate({ ...config, lookbook: newLookbook });
  };

  const addLookbookImage = () => {
    const images = lookbook.images || [];
    const newImg: LookbookImage = { url: '', title: 'New Story', size: 'sm', hotspots: [] };
    updateLookbook('images', [...images, newImg]);
  };

  const updateLookbookImage = (index: number, field: keyof LookbookImage, value: any) => {
    const newImages = [...(lookbook.images || [])];
    newImages[index] = { ...newImages[index], [field]: value };
    updateLookbook('images', newImages);
  };

  const removeLookbookImage = (index: number) => {
    const images = lookbook.images || [];
    updateLookbook('images', images.filter((_, i) => i !== index));
  };

  const addHotspot = (imgIdx: number, x: number, y: number) => {
    const images = [...(lookbook.images || [])];
    const currentHotspots = images[imgIdx].hotspots || [];
    images[imgIdx].hotspots = [...currentHotspots, { productId: '', x, y }];
    updateLookbook('images', images);
  };

  const removeHotspot = (imgIdx: number, hsIdx: number) => {
    const images = [...(lookbook.images || [])];
    if (images[imgIdx].hotspots) {
      images[imgIdx].hotspots = images[imgIdx].hotspots.filter((_, i) => i !== hsIdx);
      updateLookbook('images', images);
    }
  };

  const updateHotspotProductId = (imgIdx: number, hsIdx: number, pId: string) => {
    const images = [...(lookbook.images || [])];
    if (images[imgIdx].hotspots) {
      images[imgIdx].hotspots[hsIdx].productId = pId;
      updateLookbook('images', images);
      // Clear search query for this hotspot after selection
      setSearchQuery(prev => ({ ...prev, [`${imgIdx}-${hsIdx}`]: "" }));
    }
  };

  const getFilteredProducts = (queryText: string) => {
    if (!queryText) return [];
    const q = queryText.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    ).slice(0, 5);
  };

  return (
    <div className="animate-reveal pb-20 space-y-20">
      {/* HERITAGE SECTION */}
      <section className="bg-white border border-zinc-200 p-10 shadow-lg space-y-12">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-6">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Cấu hình Heritage (Di sản)</h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Câu chuyện thương hiệu và di sản may đo</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold uppercase tracking-widest">Hiển thị:</span>
             <button onClick={() => onUpdate({...config, showHeritage: !config.showHeritage})} className={`w-12 h-6 rounded-full relative transition-all ${config.showHeritage ? 'bg-black' : 'bg-zinc-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.showHeritage ? 'right-1' : 'left-1'}`} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Văn bản VI */}
          <div className="space-y-6 bg-zinc-50 p-6">
            <h4 className="text-xs font-black uppercase border-b border-zinc-200 pb-2">Nội dung Tiếng Việt</h4>
            <div><label className={labelBase}>Sub-title</label><input value={heritage.subtitle?.vi || ''} onChange={e => updateHeritage('subtitle.vi', e.target.value)} className={inputBase} /></div>
            <div><label className={labelBase}>Tiêu đề chính (HTML)</label><input value={heritage.title?.vi || ''} onChange={e => updateHeritage('title.vi', e.target.value)} className={inputBase} /></div>
            <div><label className={labelBase}>Mô tả 1</label><textarea value={heritage.description1?.vi || ''} onChange={e => updateHeritage('description1.vi', e.target.value)} className={inputBase + " h-24"} /></div>
            <div><label className={labelBase}>Mô tả 2 (In đậm)</label><textarea value={heritage.description2?.vi || ''} onChange={e => updateHeritage('description2.vi', e.target.value)} className={inputBase + " h-24"} /></div>
            
            <div>
              <label className={labelBase}>Giá trị cốt lõi (VI)</label>
              <div className="space-y-2">
                {(heritage.values?.vi || []).map((v, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={v} onChange={e => updateHeritageValue('vi', i, e.target.value)} className={inputBase} />
                    <button onClick={() => removeHeritageValue('vi', i)} className="text-red-500 px-2 hover:bg-red-50">✕</button>
                  </div>
                ))}
                <button onClick={() => addHeritageValue('vi')} className="text-[9px] font-bold uppercase border border-dashed border-zinc-300 w-full py-2 hover:border-black">+ Thêm giá trị</button>
              </div>
            </div>
          </div>

          {/* Văn bản EN */}
          <div className="space-y-6 bg-zinc-50 p-6">
            <h4 className="text-xs font-black uppercase border-b border-zinc-200 pb-2">English Content</h4>
            <div><label className={labelBase}>Sub-title</label><input value={heritage.subtitle?.en || ''} onChange={e => updateHeritage('subtitle.en', e.target.value)} className={inputBase} /></div>
            <div><label className={labelBase}>Main Title (HTML)</label><input value={heritage.title?.en || ''} onChange={e => updateHeritage('title.en', e.target.value)} className={inputBase} /></div>
            <div><label className={labelBase}>Description 1</label><textarea value={heritage.description1?.en || ''} onChange={e => updateHeritage('description1.en', e.target.value)} className={inputBase + " h-24"} /></div>
            <div><label className={labelBase}>Description 2 (Bold)</label><textarea value={heritage.description2?.en || ''} onChange={e => updateHeritage('description2.en', e.target.value)} className={inputBase + " h-24"} /></div>
            
            <div>
              <label className={labelBase}>Core Values (EN)</label>
              <div className="space-y-2">
                {(heritage.values?.en || []).map((v, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={v} onChange={e => updateHeritageValue('en', i, e.target.value)} className={inputBase} />
                    <button onClick={() => removeHeritageValue('en', i)} className="text-red-500 px-2 hover:bg-red-50">✕</button>
                  </div>
                ))}
                <button onClick={() => addHeritageValue('en')} className="text-[9px] font-bold uppercase border border-dashed border-zinc-300 w-full py-2 hover:border-black">+ Add Value</button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-zinc-100">
           <div>
             <label className={labelBase}>Ảnh Chính (Bên trái)</label>
             <input value={heritage.imageMain || ''} onChange={e => updateHeritage('imageMain', e.target.value)} className={inputBase} placeholder="URL ảnh" />
             <div className="mt-4 aspect-square bg-zinc-100 border border-zinc-200 overflow-hidden">
                <img src={heritage.imageMain} className="w-full h-full object-cover grayscale" alt="Preview" />
             </div>
           </div>
           <div>
             <label className={labelBase}>Ảnh Phụ (Bên phải)</label>
             <input value={heritage.imageSecondary || ''} onChange={e => updateHeritage('imageSecondary', e.target.value)} className={inputBase} placeholder="URL ảnh" />
             <div className="mt-4 aspect-square bg-zinc-100 border border-zinc-200 overflow-hidden">
                <img src={heritage.imageSecondary} className="w-full h-full object-cover grayscale" alt="Preview" />
             </div>
           </div>
        </div>
      </section>

      {/* LOOKBOOK SECTION */}
      <section className="bg-white border border-zinc-200 p-10 shadow-lg space-y-12">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-6">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Cấu hình Lookbook</h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Giao diện bộ sưu tập hình ảnh nghệ thuật</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold uppercase tracking-widest">Hiển thị:</span>
             <button onClick={() => onUpdate({...config, showLookbook: !config.showLookbook})} className={`w-12 h-6 rounded-full relative transition-all ${config.showLookbook ? 'bg-black' : 'bg-zinc-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.showLookbook ? 'right-1' : 'left-1'}`} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
               <div><label className={labelBase}>Tiêu đề (VI)</label><input value={lookbook.title?.vi || ''} onChange={e => updateLookbook('title.vi', e.target.value)} className={inputBase} /></div>
               <div><label className={labelBase}>Tiêu đề (EN)</label><input value={lookbook.title?.en || ''} onChange={e => updateLookbook('title.en', e.target.value)} className={inputBase} /></div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div><label className={labelBase}>Phụ đề (VI)</label><input value={lookbook.subtitle?.vi || ''} onChange={e => updateLookbook('subtitle.vi', e.target.value)} className={inputBase} /></div>
               <div><label className={labelBase}>Phụ đề (EN)</label><input value={lookbook.subtitle?.en || ''} onChange={e => updateLookbook('subtitle.en', e.target.value)} className={inputBase} /></div>
             </div>
          </div>
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
               <div><label className={labelBase}>Nút khám phá (VI)</label><input value={lookbook.discoverText?.vi || ''} onChange={e => updateLookbook('discoverText.vi', e.target.value)} className={inputBase} /></div>
               <div><label className={labelBase}>Nút khám phá (EN)</label><input value={lookbook.discoverText?.en || ''} onChange={e => updateLookbook('discoverText.en', e.target.value)} className={inputBase} /></div>
             </div>
             <div><label className={labelBase}>Link nút khám phá</label><input value={lookbook.discoverLink || ''} onChange={e => updateLookbook('discoverLink', e.target.value)} className={inputBase} /></div>
          </div>
        </div>

        <div className="pt-10 border-t border-zinc-100">
           <div className="flex justify-between items-center mb-6">
             <h4 className="text-[10px] font-black uppercase tracking-widest">Danh sách hình ảnh</h4>
             <button onClick={addLookbookImage} className="text-[9px] font-bold uppercase bg-black text-white px-4 py-2 hover:bg-zinc-800">+ Thêm ảnh</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {(lookbook.images || []).map((img, idx) => (
               <div key={idx} className="bg-zinc-50 border border-zinc-200 p-6 space-y-4 relative group">
                  <button onClick={() => removeLookbookImage(idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                  <div className="aspect-[3/4] bg-zinc-200 mb-4 overflow-hidden border border-zinc-100">
                     <img src={img.url} className="w-full h-full object-cover grayscale" alt="Preview" />
                  </div>
                  <div><label className={labelBase}>URL Ảnh</label><input value={img.url || ''} onChange={e => updateLookbookImage(idx, 'url', e.target.value)} className={inputBase} /></div>
                  <div><label className={labelBase}>Tiêu đề (Hiển thị hover)</label><input value={img.title || ''} onChange={e => updateLookbookImage(idx, 'title', e.target.value)} className={inputBase} /></div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className={labelBase}>Kích thước</label>
                      <select value={img.size || 'sm'} onChange={e => updateLookbookImage(idx, 'size', e.target.value as any)} className={inputBase}>
                         <option value="sm">Nhỏ</option>
                         <option value="lg">Lớn</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => setEditingHotspotsIdx(editingHotspotsIdx === idx ? null : idx)}
                      className={`flex-1 text-[8px] font-black uppercase tracking-widest border mt-5 transition-all ${editingHotspotsIdx === idx ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-200'}`}
                    >
                      {editingHotspotsIdx === idx ? 'ĐANG CÀI HOTSPOT' : 'SHOP THE LOOK'}
                    </button>
                  </div>

                  {editingHotspotsIdx === idx && (
                    <div className="mt-6 p-4 bg-white border border-zinc-200 space-y-6 animate-reveal">
                      <p className="text-[8px] font-bold text-zinc-400 uppercase">Nhấn vào ảnh để ghim điểm sản phẩm</p>
                      <div 
                        className="relative aspect-[3/4] bg-zinc-100 cursor-crosshair overflow-hidden"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = ((e.clientX - rect.left) / rect.width) * 100;
                          const y = ((e.clientY - rect.top) / rect.height) * 100;
                          addHotspot(idx, x, y);
                        }}
                      >
                        <img src={img.url} className="w-full h-full object-cover opacity-50" alt="" />
                        {img.hotspots?.map((hs, hsIdx) => (
                          <div 
                            key={hsIdx}
                            className="absolute w-4 h-4 -ml-2 -mt-2 bg-black rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[6px] text-white font-bold"
                            style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                          >
                            {hsIdx + 1}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-6">
                        {img.hotspots?.map((hs, hsIdx) => {
                          const selectedProduct = products.find(p => p.id === hs.productId);
                          const searchKey = `${idx}-${hsIdx}`;
                          const currentQuery = searchQuery[searchKey] || "";
                          const filteredSuggestions = getFilteredProducts(currentQuery);

                          return (
                            <div key={hsIdx} className="p-3 bg-zinc-50 border border-zinc-100 relative">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[8px] font-black uppercase text-zinc-400">Điểm Ghim {hsIdx + 1}</span>
                                <button onClick={() => removeHotspot(idx, hsIdx)} className="text-red-500 text-[10px]">Xóa điểm</button>
                              </div>

                              {selectedProduct ? (
                                <div className="flex items-center gap-3 p-2 bg-white border border-zinc-200">
                                  <div className="w-8 h-10 bg-zinc-100 shrink-0 overflow-hidden">
                                    <img src={selectedProduct.imageUrl} className="w-full h-full object-cover grayscale" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-black uppercase truncate">{selectedProduct.name}</p>
                                    <p className="text-[7px] text-zinc-400 font-bold uppercase">{selectedProduct.brand} | ID: {selectedProduct.id}</p>
                                  </div>
                                  <button 
                                    onClick={() => updateHotspotProductId(idx, hsIdx, "")}
                                    className="text-[8px] font-black text-blue-500 uppercase"
                                  >
                                    Thay đổi
                                  </button>
                                </div>
                              ) : (
                                <div className="relative">
                                  <input 
                                    value={currentQuery}
                                    onChange={e => setSearchQuery(prev => ({ ...prev, [searchKey]: e.target.value }))}
                                    className="w-full border-b text-[10px] py-2 outline-none focus:border-black bg-white px-2"
                                    placeholder="Tìm theo tên sản phẩm hoặc thương hiệu..."
                                  />
                                  {filteredSuggestions.length > 0 && (
                                    <div className="absolute left-0 right-0 top-full bg-white border border-zinc-200 shadow-xl z-50 max-h-40 overflow-y-auto">
                                      {filteredSuggestions.map(p => (
                                        <div 
                                          key={p.id}
                                          onClick={() => updateHotspotProductId(idx, hsIdx, p.id)}
                                          className="p-2 flex items-center gap-3 hover:bg-zinc-50 cursor-pointer border-b border-zinc-50 last:border-none"
                                        >
                                          <div className="w-6 h-8 bg-zinc-100 overflow-hidden"><img src={p.imageUrl} className="w-full h-full object-cover grayscale" /></div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-[8px] font-bold uppercase truncate">{p.name}</p>
                                            <p className="text-[7px] text-zinc-400 uppercase">{p.brand}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {currentQuery && filteredSuggestions.length === 0 && (
                                    <div className="absolute left-0 right-0 top-full bg-white p-2 text-[8px] text-zinc-400 italic border border-zinc-200 z-50">
                                      Không tìm thấy sản phẩm nào...
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
               </div>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default HomepageContentManager;
