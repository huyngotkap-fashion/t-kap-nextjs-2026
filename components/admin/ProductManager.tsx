
import React, { useState, useRef, useEffect } from 'react';
import { Product, ProductMedia, DetailHotspot } from '../../types';
import RichTextEditor from './RichTextEditor';

interface ProductManagerProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [batch360Text, setBatch360Text] = useState(""); 
  const [hotspotEditorMediaIdx, setHotspotEditorMediaIdx] = useState<number | null>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingProduct) {
      setBatch360Text(editingProduct.threeSixtyImages?.join('\n') || "");
    } else {
      setBatch360Text("");
    }
  }, [editingProduct]);

  const inputBase = 'w-full bg-white border border-zinc-200 px-5 py-3 text-sm outline-none focus:border-black transition-all';
  const labelBase = 'text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2 block';

  const handleSave = () => {
    const html = descRef.current?.innerHTML || '';
    
    const final360Images = batch360Text
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.startsWith('http'));

    const pricingType = form.pricingType || 'price';

    const finalData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: form.name || 'Untitled',
      brand: form.brand || 'T-KAP',
      category: form.category || 'Men',
      subCategory: form.subCategory || 'Classic',
      price: Number(form.price) || 0,
      originalPrice: Number(form.originalPrice) || 0,
      pricingType: pricingType as any,
      isContactOnly: pricingType === 'quotation',
      imageUrl: form.imageUrl || '',
      media: form.media || [],
      threeSixtyImages: final360Images,
      description: html,
      status: (form.status as any) || 'active',
      colors: form.colors || [],
      sizes: form.sizes || []
    };

    if (editingProduct) onUpdateProduct(finalData);
    else onAddProduct(finalData);

    setIsEditing(false);
    setEditingProduct(null);
    setForm({});
    setBatch360Text("");
    setHotspotEditorMediaIdx(null);
  };

  const handleCopyProduct = (p: Product) => {
    const copiedProduct: Product = {
      ...p,
      id: `copy-${Date.now()}`,
      name: `${p.name} (Bản sao)`
    };
    setEditingProduct(null);
    setForm(copiedProduct);
    setIsEditing(true);
  };

  const addMediaItem = () => {
    const currentMedia = form.media || [];
    setForm({ ...form, media: [...currentMedia, { type: 'image', url: '', hotspots: [] }] });
  };

  const updateMediaItem = (index: number, field: keyof ProductMedia, value: any) => {
    const currentMedia = [...(form.media || [])];
    currentMedia[index] = { ...currentMedia[index], [field]: value };
    setForm({ ...form, media: currentMedia });
  };

  const removeMediaItem = (index: number) => {
    const currentMedia = (form.media || []).filter((_, i) => i !== index);
    setForm({ ...form, media: currentMedia });
  };

  const addDetailHotspot = (mediaIdx: number, x: number, y: number) => {
    const currentMedia = [...(form.media || [])];
    const hotspots = currentMedia[mediaIdx].hotspots || [];
    const newHotspot: DetailHotspot = {
      id: `hs-${Date.now()}`,
      x,
      y,
      title: { en: 'Detail Label', vi: 'Tên chi tiết' },
      description: { en: 'Briefly describe this part of the product.', vi: 'Mô tả ngắn gọn đặc điểm này của sản phẩm.' },
      imageUrl: ''
    };
    currentMedia[mediaIdx].hotspots = [...hotspots, newHotspot];
    setForm({ ...form, media: currentMedia });
  };

  const updateHotspot = (mediaIdx: number, hsIdx: number, field: string, value: any) => {
    const currentMedia = [...(form.media || [])];
    const hotspots = [...(currentMedia[mediaIdx].hotspots || [])];
    if (field.includes('.')) {
      const [p, c] = field.split('.');
      (hotspots[hsIdx] as any)[p][c] = value;
    } else {
      (hotspots[hsIdx] as any)[field] = value;
    }
    currentMedia[mediaIdx].hotspots = hotspots;
    setForm({ ...form, media: currentMedia });
  };

  const removeHotspot = (mediaIdx: number, hsIdx: number) => {
    const currentMedia = [...(form.media || [])];
    currentMedia[mediaIdx].hotspots = currentMedia[mediaIdx].hotspots?.filter((_, i) => i !== hsIdx);
    setForm({ ...form, media: currentMedia });
  };

  const addColor = () => {
    if (colorPickerRef.current) {
      const newColor = colorPickerRef.current.value;
      if (!form.colors?.includes(newColor)) {
        setForm({ ...form, colors: [...(form.colors || []), newColor] });
      }
    }
  };

  const removeColor = (color: string) => {
    setForm({ ...form, colors: form.colors?.filter(c => c !== color) });
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 z-[2000] bg-white flex flex-col lg:flex-row overflow-y-auto">
        <div className="w-full lg:w-[450px] border-r border-zinc-100 p-8 lg:p-10 bg-zinc-50 lg:sticky lg:top-0 lg:h-screen shrink-0 overflow-y-auto custom-scrollbar">
          <button onClick={() => setIsEditing(false)} className="text-[10px] font-black text-zinc-400 mb-8 block uppercase tracking-widest hover:text-black transition-colors">
            ← QUAY LẠI DANH SÁCH
          </button>

          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">{editingProduct ? 'SỬA SẢN PHẨM' : 'THÊM/SAO CHÉP SẢN PHẨM'}</h2>

            <div className="space-y-4">
              <div>
                <label className={labelBase}>Tên sản phẩm</label>
                <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputBase} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelBase}>Giá Bán (VNĐ)</label><input type="number" value={form.price || 0} onChange={e => setForm({ ...form, price: +e.target.value })} className={inputBase} /></div>
                <div><label className={labelBase}>Giá Gốc (VNĐ)</label><input type="number" value={form.originalPrice || 0} onChange={e => setForm({ ...form, originalPrice: +e.target.value })} className={inputBase} /></div>
                <div className="col-span-2">
                  <label className={labelBase}>Loại giá</label>
                  <select value={form.pricingType || 'price'} onChange={e => setForm({ ...form, pricingType: e.target.value as any })} className={inputBase}>
                    <option value="price">Giá hiển thị công khai</option>
                    <option value="quotation">Báo giá liên hệ riêng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelBase}>Trạng thái hiển thị</label>
                <select value={form.status || 'active'} onChange={e => setForm({ ...form, status: e.target.value as any })} className={inputBase}>
                  <option value="active">Đang hiển thị (Công khai)</option>
                  <option value="hidden">Đang ẩn (Bản nháp)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-200">
               <label className={labelBase}>Phân loại màu sắc</label>
               <div className="flex flex-wrap gap-3 mb-4">
                  {(form.colors || []).map((c, i) => (
                    <div key={i} className="group relative">
                      <div className="w-8 h-8 rounded-full border border-zinc-200 shadow-sm" style={{ backgroundColor: c }} />
                      <button 
                        onClick={() => removeColor(c)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >✕</button>
                    </div>
                  ))}
               </div>
               <div className="flex gap-2">
                 <div className="relative w-12 h-12 overflow-hidden border border-zinc-200 rounded-sm">
                    <input 
                      type="color" 
                      ref={colorPickerRef}
                      className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" 
                      defaultValue="#000000"
                    />
                 </div>
                 <button 
                  onClick={addColor}
                  className="flex-1 bg-white border border-zinc-200 text-[9px] font-black uppercase tracking-widest hover:border-black transition-all"
                 >
                   + Thêm màu hiện tại
                 </button>
               </div>
               <p className="text-[8px] text-zinc-400 font-bold uppercase italic">Mẹo: Click vào ô màu để dùng bút lấy màu của trình duyệt</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-200">
               <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900 block">360° Interactive Experience</span>
               <textarea value={batch360Text} onChange={e => setBatch360Text(e.target.value)} placeholder="https://example.com/xoay-1.jpg..." className={inputBase + " h-32 font-mono text-[10px]"} />
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-200">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900">Media Library & Hotspots</span>
                <button onClick={addMediaItem} className="text-[9px] font-black uppercase tracking-widest bg-black text-white px-3 py-1">+ Thêm</button>
              </div>
              <div><label className={labelBase}>Ảnh đại diện chính (URL)</label><input value={form.imageUrl || ''} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className={inputBase} /></div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {(form.media || []).map((m, idx) => (
                  <div key={idx} className="p-4 bg-white border border-zinc-200 rounded-sm relative group space-y-3">
                    <button onClick={() => removeMediaItem(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] z-10">✕</button>
                    <div className="flex gap-2">
                      <select value={m.type} onChange={(e) => updateMediaItem(idx, 'type', e.target.value as any)} className="w-1/3 text-[10px] border border-zinc-100">
                        <option value="image">ẢNH</option>
                        <option value="video">VIDEO</option>
                      </select>
                      <input value={m.url} onChange={(e) => updateMediaItem(idx, 'url', e.target.value)} className="flex-1 text-[10px] border border-zinc-100 p-1" placeholder="Media URL" />
                    </div>
                    {m.type === 'image' && (
                      <button 
                        onClick={() => setHotspotEditorMediaIdx(hotspotEditorMediaIdx === idx ? null : idx)}
                        className={`w-full py-2 text-[8px] font-black uppercase tracking-widest border transition-all ${hotspotEditorMediaIdx === idx ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-400'}`}
                      >
                        {hotspotEditorMediaIdx === idx ? 'ĐANG CÀI HOTSPOTS' : 'QUẢN LÝ HOTSPOTS'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10 sticky bottom-0 bg-zinc-50 pb-4">
              <button onClick={handleSave} className="w-full bg-black text-white py-5 text-[11px] font-black tracking-[0.3em] uppercase hover:bg-zinc-800">
                LƯU SẢN PHẨM
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-zinc-100 p-8 lg:p-16 flex justify-center overflow-y-auto relative">
          {hotspotEditorMediaIdx !== null ? (
            <div className="w-full max-w-4xl space-y-8">
               <div className="flex justify-between items-center bg-white p-6 border border-zinc-200">
                  <h4 className="text-xl font-black uppercase tracking-tighter">Hotspot Editor: {form.media?.[hotspotEditorMediaIdx].url.split('/').pop()}</h4>
                  <button onClick={() => setHotspotEditorMediaIdx(null)} className="text-[10px] font-black uppercase text-zinc-400">Đóng trình soạn thảo</button>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div 
                    className="relative aspect-[3/4] bg-zinc-200 cursor-crosshair overflow-hidden border border-zinc-200 shadow-xl"
                    onClick={(e) => {
                       const rect = e.currentTarget.getBoundingClientRect();
                       const x = ((e.clientX - rect.left) / rect.width) * 100;
                       const y = ((e.clientY - rect.top) / rect.height) * 100;
                       addDetailHotspot(hotspotEditorMediaIdx!, x, y);
                    }}
                  >
                     <img src={form.media![hotspotEditorMediaIdx!].url} className="w-full h-full object-cover" />
                     {form.media![hotspotEditorMediaIdx!].hotspots?.map((hs, hIdx) => (
                       <div 
                         key={hs.id} 
                         className="absolute w-6 h-6 -ml-3 -mt-3 bg-black text-white border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black shadow-2xl"
                         style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                       >
                         {hIdx + 1}
                       </div>
                     ))}
                  </div>

                  <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar pr-2">
                     {form.media![hotspotEditorMediaIdx!].hotspots?.map((hs, hIdx) => (
                        <div key={hs.id} className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4 relative">
                           <button onClick={() => removeHotspot(hotspotEditorMediaIdx!, hIdx)} className="absolute top-2 right-2 text-red-500 text-[10px]">✕</button>
                           <div className="flex items-center gap-4 mb-2">
                             <span className="w-6 h-6 bg-black text-white flex items-center justify-center text-[10px] font-black rounded-full">{hIdx + 1}</span>
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Hotspot Info</span>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                             <div><label className={labelBase}>Tiêu đề (VI)</label><input value={hs.title.vi} onChange={e => updateHotspot(hotspotEditorMediaIdx!, hIdx, 'title.vi', e.target.value)} className={inputBase + " py-2 text-xs"} /></div>
                             <div><label className={labelBase}>Mô tả (VI)</label><textarea value={hs.description.vi} onChange={e => updateHotspot(hotspotEditorMediaIdx!, hIdx, 'description.vi', e.target.value)} className={inputBase + " py-2 text-xs h-20"} /></div>
                             <div className="col-span-2"><label className={labelBase}>Link ảnh cận cảnh</label><input value={hs.imageUrl || ''} onChange={e => updateHotspot(hotspotEditorMediaIdx!, hIdx, 'imageUrl', e.target.value)} className={inputBase + " py-2 text-xs"} /></div>
                           </div>
                        </div>
                     ))}
                     {(!form.media![hotspotEditorMediaIdx!].hotspots || form.media![hotspotEditorMediaIdx!].hotspots!.length === 0) && (
                       <div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-200 text-zinc-300 font-black uppercase text-center p-10">
                         Click lên ảnh để đặt Hotspot đầu tiên
                       </div>
                     )}
                  </div>
               </div>
            </div>
          ) : (
            <div className="max-w-4xl w-full">
              <RichTextEditor contentRef={descRef} initialContent={editingProduct?.description || (form.description || '')} label="Mô tả sản phẩm" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-reveal">
      <div className="flex justify-between items-center mb-12">
        <h3 className="text-3xl font-black uppercase tracking-tight">Quản lý Kho hàng</h3>
        <button onClick={() => { setEditingProduct(null); setForm({ status: 'active', category: 'Men', pricingType: 'price', media: [] }); setIsEditing(true); }} className="bg-black text-white px-10 py-5 text-[10px] font-black uppercase">+ THÊM MỚI</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map(p => (
          <div key={p.id} className={`bg-white border border-zinc-100 p-4 shadow-sm hover:shadow-xl transition-all group ${p.status === 'hidden' ? 'opacity-70' : ''}`}>
            <div className="aspect-[3/4] bg-zinc-100 mb-4 overflow-hidden relative">
              <img src={p.imageUrl} className={`w-full h-full object-cover transition-transform group-hover:scale-110 ${p.status === 'hidden' ? 'grayscale opacity-50' : ''}`} alt="" />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {p.status === 'hidden' && <span className="bg-zinc-500 text-white text-[7px] font-black px-2 py-0.5 uppercase w-fit">ĐANG ẨN</span>}
                {p.pricingType === 'quotation' && <span className="bg-black text-white text-[7px] font-black px-2 py-0.5 uppercase w-fit">BÁO GIÁ</span>}
                {p.threeSixtyImages && p.threeSixtyImages.length > 0 && <span className="bg-blue-600 text-white text-[7px] font-black px-2 py-0.5 uppercase w-fit">360° VIEW</span>}
              </div>
              {(p.media?.some(m => m.hotspots && m.hotspots.length > 0)) && <span className="absolute top-2 right-2 bg-red-600 text-white text-[7px] font-black px-2 py-0.5 uppercase">HOTSPOTS</span>}
            </div>
            <h4 className={`font-bold uppercase text-[10px] truncate mb-1 ${p.status === 'hidden' ? 'text-zinc-400' : ''}`}>{p.name}</h4>
            <div className="flex flex-wrap gap-x-3 gap-y-2 pt-4 mt-4 border-t border-zinc-50">
              <button onClick={() => { setEditingProduct(p); setForm(p); setIsEditing(true); }} className="text-[9px] font-black uppercase tracking-widest text-zinc-900 hover:underline">Sửa</button>
              <button 
                onClick={() => onUpdateProduct({ ...p, status: p.status === 'hidden' ? 'active' : 'hidden' })} 
                className={`text-[9px] font-black uppercase tracking-widest hover:underline ${p.status === 'hidden' ? 'text-green-600' : 'text-orange-600'}`}
              >
                {p.status === 'hidden' ? 'Hiện' : 'Ẩn'}
              </button>
              <button onClick={() => handleCopyProduct(p)} className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline">Copy</button>
              <button onClick={() => onDeleteProduct(p.id)} className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:underline">Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManager;
