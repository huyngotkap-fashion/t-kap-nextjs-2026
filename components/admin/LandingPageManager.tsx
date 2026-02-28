
import React, { useState, useEffect } from 'react';
import { LandingPage, LPBlock, User } from '../../types';
import { subscribeToCollection, upsertDocument, removeDocument, auth } from '../../services/firebaseService';
import BlockEditor from './BlockEditor';

interface LandingPageManagerProps {
  user?: User | null;
}

const LandingPageManager: React.FC<LandingPageManagerProps> = ({ user }) => {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPage, setEditingPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeToCollection('landingPages', (data) => {
      setPages(data as LandingPage[]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const createNewPage = () => {
    const newPage: LandingPage = {
      id: `lp-${Date.now()}`,
      title: 'Trang chiến dịch mới',
      isActive: false,
      showInMenu: false, // Mặc định là false
      blocks: []
    };
    setEditingPage(newPage);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editingPage || isSaving) return;
    
    if (!auth.currentUser) {
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    if (user?.role !== 'admin') {
      alert('Bạn không có quyền quản trị để thực hiện thao tác này.');
      return;
    }

    setIsSaving(true);
    try {
      let sanitizedId = editingPage.id
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (!sanitizedId || sanitizedId.length < 3) {
        throw new Error("Slug (Đường dẫn) quá ngắn hoặc không hợp lệ. Vui lòng nhập ít nhất 3 ký tự.");
      }

      const dataToSave = { 
        ...editingPage, 
        id: sanitizedId,
        showInMenu: !!editingPage.showInMenu, // Đảm bảo luôn có giá trị boolean
        blocks: (editingPage.blocks || []).map(b => ({
          ...b,
          imageUrl: b.imageUrl || "",
          videoUrl: b.videoUrl || "",
          buttonLink: b.buttonLink || "",
          layout: b.layout || "left"
        }))
      };

      await upsertDocument('landingPages', sanitizedId, dataToSave);
      setIsEditing(false);
      setEditingPage(null);
      alert('Đã lưu Landing Page thành công');
    } catch (error: any) {
      console.error("Lỗi khi lưu Landing Page:", error);
      let errorMsg = error.message || 'Vui lòng kiểm tra lại kết nối mạng';
      if (error.code === 'permission-denied') {
        errorMsg = "Lỗi phân quyền: Bạn cần quyền Admin.";
      }
      alert(`Lỗi khi lưu: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deletePage = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa Landing Page này?')) {
      try {
        await removeDocument('landingPages', id);
      } catch (error: any) {
        alert('Lỗi khi xóa: ' + (error.message || 'Thiếu quyền truy cập'));
      }
    }
  };

  const inputBase = "w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all";
  const labelBase = "text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block";

  if (isEditing && editingPage) {
    return (
      <div className="animate-reveal space-y-12 pb-20">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-6">
          <button 
            disabled={isSaving}
            onClick={() => setIsEditing(false)} 
            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black disabled:opacity-50"
          >
            ← Quay lại danh sách
          </button>
          <div className="flex gap-4">
             <button 
              disabled={isSaving}
              onClick={handleSave} 
              className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50"
             >
                {isSaving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
             </button>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 p-8 shadow-lg grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="md:col-span-2">
             <label className={labelBase}>Tiêu đề quản lý</label>
             <input value={editingPage.title} onChange={e => setEditingPage({...editingPage, title: e.target.value})} className={inputBase} />
           </div>
           <div>
             <label className={labelBase}>Kích hoạt trang</label>
             <button 
                onClick={() => setEditingPage({...editingPage, isActive: !editingPage.isActive})}
                className={`w-full py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${editingPage.isActive ? 'bg-black text-white border-black' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}
             >
                {editingPage.isActive ? 'ĐANG BẬT' : 'ĐANG TẮT'}
             </button>
           </div>
           <div>
             <label className={labelBase}>Menu Header</label>
             <button 
                onClick={() => setEditingPage({...editingPage, showInMenu: !editingPage.showInMenu})}
                className={`w-full py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${editingPage.showInMenu ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}
             >
                {editingPage.showInMenu ? 'ĐANG HIỆN TRÊN MENU' : 'ẨN KHỎI MENU'}
             </button>
           </div>
           <div className="md:col-span-4">
              <label className={labelBase}>Đường dẫn (Slug)</label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-400 font-bold">domain.com/</span>
                <input 
                  value={editingPage.id} 
                  onChange={e => setEditingPage({...editingPage, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
                  className={inputBase + " font-mono"} 
                  placeholder="campaign-summer-2025"
                />
              </div>
           </div>
        </div>

        <BlockEditor 
          blocks={editingPage.blocks || []} 
          onUpdate={(newBlocks) => setEditingPage({...editingPage, blocks: newBlocks})} 
        />
      </div>
    );
  }

  return (
    <div className="animate-reveal space-y-10">
      <div className="flex justify-between items-center mb-10 border-b border-zinc-100 pb-6">
        <h3 className="text-2xl font-black uppercase tracking-tight">Quản lý Landing Pages</h3>
        <button onClick={createNewPage} className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">+ TẠO TRANG MỚI</button>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-zinc-300 uppercase font-black tracking-widest">Đang tải dữ liệu...</div>
      ) : pages.length === 0 ? (
        <div className="py-20 text-center border-4 border-dashed border-zinc-100 text-zinc-300 font-black uppercase tracking-widest">Chưa có Landing Page nào</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pages.map(page => (
            <div key={page.id} className="bg-white border border-zinc-200 p-8 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2">
                  <span className={`text-[8px] font-black px-2 py-1 uppercase tracking-widest ${page.isActive ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                    {page.isActive ? 'Active' : 'Draft'}
                  </span>
                  {page.showInMenu && (
                    <span className="text-[8px] font-black px-2 py-1 uppercase tracking-widest bg-blue-600 text-white">
                      Visible on Menu
                    </span>
                  )}
                </div>
                <button onClick={() => deletePage(page.id)} className="text-red-500 hover:scale-110 transition-transform">✕</button>
              </div>
              <h4 className="text-xl font-black uppercase tracking-tight mb-2">{page.title}</h4>
              <p className="text-[10px] text-zinc-400 font-bold mb-8 uppercase tracking-widest">Slug: /{page.id}</p>
              <div className="flex gap-4 border-t border-zinc-50 pt-6">
                <button 
                  onClick={() => { setEditingPage(page); setIsEditing(true); }}
                  className="flex-1 bg-zinc-900 text-white py-3 text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
                >
                  CHỈNH SỬA
                </button>
                <a 
                  href={`/${page.id}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 border border-zinc-200 py-3 text-[9px] font-black uppercase tracking-widest text-center hover:bg-zinc-50 transition-all"
                >
                  XEM TRƯỚC
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandingPageManager;
