
import React from 'react';
import { LPBlock } from '../../types';

interface BlockEditorProps {
  blocks: LPBlock[];
  onUpdate: (blocks: LPBlock[]) => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onUpdate }) => {
  const inputBase = "w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all";
  const labelBase = "text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block";

  const addBlock = (type: LPBlock['type']) => {
    const newBlock: LPBlock = {
      id: `block-${Date.now()}`,
      type,
      title: { en: '', vi: 'Tiêu đề khối' },
      content: { en: '', vi: 'Nội dung mô tả khối' },
      buttonText: { en: '', vi: 'Xem thêm' },
      animation: 'fade-up'
    };
    onUpdate([...blocks, newBlock]);
  };

  const updateBlock = (index: number, field: string, value: any) => {
    const newBlocks = [...blocks];
    const block = { ...newBlocks[index] } as any;
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      block[parent] = { ...block[parent], [child]: value };
    } else {
      block[field] = value;
    }
    newBlocks[index] = block;
    onUpdate(newBlocks);
  };

  const removeBlock = (index: number) => {
    onUpdate(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onUpdate(newBlocks);
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900 bg-white border border-zinc-200 px-6 py-2">Cấu trúc trang ({blocks.length} khối)</h4>
        <div className="h-px flex-1 bg-zinc-200"></div>
      </div>

      <div className="space-y-8">
        {blocks.map((block, idx) => (
          <div key={block.id} className="bg-white border border-zinc-200 p-8 shadow-md relative group">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => moveBlock(idx, 'up')} className="bg-black text-white w-8 h-8 flex items-center justify-center">↑</button>
               <button onClick={() => moveBlock(idx, 'down')} className="bg-black text-white w-8 h-8 flex items-center justify-center">↓</button>
            </div>
            
            <div className="flex justify-between items-center mb-8 border-b border-zinc-50 pb-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">#Khối {idx + 1}: {block.type}</span>
               <button onClick={() => removeBlock(idx)} className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Xóa khối</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={labelBase}>Tiêu đề (VI)</label><input value={block.title.vi} onChange={e => updateBlock(idx, 'title.vi', e.target.value)} className={inputBase} /></div>
                <div><label className={labelBase}>Tiêu đề (EN)</label><input value={block.title.en} onChange={e => updateBlock(idx, 'title.en', e.target.value)} className={inputBase} /></div>
                <div className="md:col-span-2"><label className={labelBase}>Nội dung (VI)</label><textarea value={block.content.vi} onChange={e => updateBlock(idx, 'content.vi', e.target.value)} className={inputBase + " h-20"} /></div>
                <div className="md:col-span-2"><label className={labelBase}>Nội dung (EN)</label><textarea value={block.content.en} onChange={e => updateBlock(idx, 'content.en', e.target.value)} className={inputBase + " h-20"} /></div>
              </div>

              <div className="space-y-6">
                <div><label className={labelBase}>Link Ảnh/Poster</label><input value={block.imageUrl || ''} onChange={e => updateBlock(idx, 'imageUrl', e.target.value)} className={inputBase} /></div>
                {block.type === 'VideoBackground' && (
                  <div><label className={labelBase}>Link Video (.mp4)</label><input value={block.videoUrl || ''} onChange={e => updateBlock(idx, 'videoUrl', e.target.value)} className={inputBase} /></div>
                )}
                <div className="grid grid-cols-2 gap-4">
                   <div><label className={labelBase}>Nút (VI)</label><input value={block.buttonText.vi} onChange={e => updateBlock(idx, 'buttonText.vi', e.target.value)} className={inputBase} /></div>
                   <div><label className={labelBase}>Link nút</label><input value={block.buttonLink || ''} onChange={e => updateBlock(idx, 'buttonLink', e.target.value)} className={inputBase} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className={labelBase}>Animation</label>
                     <select value={block.animation} onChange={e => updateBlock(idx, 'animation', e.target.value)} className={inputBase}>
                        <option value="fade-up">Trượt lên</option>
                        <option value="fade-in">Hiện dần</option>
                        <option value="zoom-in">Phóng to</option>
                     </select>
                   </div>
                   {block.type === 'ImageText' && (
                     <div>
                       <label className={labelBase}>Bố cục ảnh</label>
                       <select value={block.layout || 'left'} onChange={e => updateBlock(idx, 'layout', e.target.value)} className={inputBase}>
                          <option value="left">Bên trái</option>
                          <option value="right">Bên phải</option>
                       </select>
                     </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 pt-10 border-t border-zinc-100">
         <button onClick={() => addBlock('Hero')} className="px-6 py-3 border border-zinc-200 text-[9px] font-black uppercase tracking-widest hover:border-black">+ Hero Image</button>
         <button onClick={() => addBlock('VideoBackground')} className="px-6 py-3 border border-zinc-200 text-[9px] font-black uppercase tracking-widest hover:border-black">+ Video Hero</button>
         <button onClick={() => addBlock('ImageText')} className="px-6 py-3 border border-zinc-200 text-[9px] font-black uppercase tracking-widest hover:border-black">+ Ảnh & Chữ</button>
         <button onClick={() => addBlock('FullImage')} className="px-6 py-3 border border-zinc-200 text-[9px] font-black uppercase tracking-widest hover:border-black">+ Ảnh rộng</button>
         <button onClick={() => addBlock('CallToAction')} className="px-6 py-3 border border-zinc-200 text-[9px] font-black uppercase tracking-widest hover:border-black">+ Call to Action</button>
      </div>
    </div>
  );
};

export default BlockEditor;
