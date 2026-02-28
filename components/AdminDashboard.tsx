
import React, { useState, useEffect } from 'react';
import { 
  Product, Blog, Language, SiteConfig, QuotationRequest, QuotationStatus, User, LandingPage
} from '../types';
import { removeDocument, upsertDocument } from '../services/firebaseService';

// Import các Module chuyên biệt
import BlogManager from './admin/BlogManager';
import ProductManager from './admin/ProductManager';
import QuotationManager from './admin/QuotationManager';
import NavigationManager from './admin/NavigationManager';
import BannerManager from './admin/BannerManager';
import HomepageContentManager from './admin/HomepageContentManager';
import StoreContactManager from './admin/StoreContactManager';
import SystemSettingsManager from './admin/SystemSettingsManager';
import LandingPageManager from './admin/LandingPageManager';

interface AdminDashboardProps {
  products: Product[];
  blogs: Blog[];
  quotations: QuotationRequest[];
  landingPages: LandingPage[];
  siteConfig: SiteConfig;
  language: Language;
  onUpdateSiteConfig: (config: SiteConfig) => void;
  user?: User | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, blogs, quotations, landingPages, siteConfig, language, onUpdateSiteConfig, user
}) => {
  type TabType = 'products' | 'blogs' | 'quotations' | 'nav' | 'banners' | 'homepage' | 'stores' | 'settings' | 'landings';
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleUpdateQuotationStatus = async (q: QuotationRequest, status: QuotationStatus) => {
    await upsertDocument('quotations', q.id, { ...q, status });
  };

  const handleDeleteQuotation = async (id: string) => {
    if (confirm('Xóa yêu cầu này?')) await removeDocument('quotations', id);
  };

  const toggleTab = (id: TabType) => {
    setActiveTab(id);
    setIsSidebarOpen(false); // Tự động đóng menu trên mobile khi chọn tab
  };

  const navItemClass = (id: TabType) => `
    w-full text-left px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-r-4 flex items-center gap-4
    ${activeTab === id ? 'text-black bg-zinc-50 border-black' : 'text-zinc-400 border-transparent hover:text-black hover:bg-zinc-50'}
  `;

  const getTabTitle = (id: TabType) => {
    switch(id) {
      case 'products': return 'Kho Sản Phẩm';
      case 'blogs': return 'Tạp chí & Bài viết';
      case 'quotations': return 'Yêu cầu Báo giá';
      case 'nav': return 'Menu & Thương hiệu';
      case 'banners': return 'Banner Slider';
      case 'homepage': return 'Nội dung Trang chủ';
      case 'stores': return 'Cửa hàng & Liên hệ';
      case 'settings': return 'Cài đặt Hệ thống';
      case 'landings': return 'Trang chiến dịch (LPs)';
    }
  };

  return (
    <div className="flex bg-[#FBFBFB] min-h-screen font-heading relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Cố định trên cả Mobile và Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-[150] w-80 bg-white border-r border-zinc-200 shadow-2xl flex flex-col shrink-0 
        transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:top-[115px] md:top-[115px] top-[70px]
      `}>
        <div className="p-10 border-b border-zinc-50 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tighter uppercase text-black">T-KAP CMS</h2>
            <p className="text-[9px] font-bold text-zinc-400 mt-2 tracking-[0.4em] uppercase">Control Panel v2.0</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-zinc-400 hover:text-black">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 no-scrollbar">
          <div className="px-10 mb-4 text-[8px] font-bold text-zinc-300 uppercase tracking-[0.3em]">Nội dung & Kho hàng</div>
          <button onClick={() => toggleTab('products')} className={navItemClass('products')}>📦 Sản phẩm</button>
          <button onClick={() => toggleTab('blogs')} className={navItemClass('blogs')}>🖋️ Tạp chí</button>
          <button onClick={() => toggleTab('quotations')} className={navItemClass('quotations')}>📜 Báo giá</button>
          
          <div className="px-10 mt-8 mb-4 text-[8px] font-bold text-zinc-300 uppercase tracking-[0.3em]">Giao diện & Trải nghiệm</div>
          <button onClick={() => toggleTab('nav')} className={navItemClass('nav')}>🧭 Điều hướng</button>
          <button onClick={() => toggleTab('banners')} className={navItemClass('banners')}>🖼️ Banner Slider</button>
          <button onClick={() => toggleTab('homepage')} className={navItemClass('homepage')}>🏛️ Khối nội dung</button>
          <button onClick={() => toggleTab('landings')} className={navItemClass('landings')}>🚀 Landing Pages</button>
          
          <div className="px-10 mt-8 mb-4 text-[8px] font-bold text-zinc-300 uppercase tracking-[0.3em]">Cấu hình chung</div>
          <button onClick={() => toggleTab('stores')} className={navItemClass('stores')}>📍 Cửa hàng</button>
          <button onClick={() => toggleTab('settings')} className={navItemClass('settings')}>⚙️ Hệ thống</button>
        </nav>

        <div className="p-8 border-t border-zinc-50 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[8px] font-bold text-zinc-400 uppercase">Current User</span>
              <span className="text-[10px] font-black uppercase">{user?.name || 'Administrator'}</span>
           </div>
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
        </div>
      </aside>

      {/* Main Content Area - Thêm margin-left trên desktop để không bị Sidebar đè lên */}
      <main className="flex-1 lg:ml-80 bg-zinc-50 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <div className="lg:hidden bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-[100]">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
           <span className="text-[10px] font-black uppercase tracking-widest">{getTabTitle(activeTab)}</span>
           <div className="w-10"></div> {/* Spacer to center title */}
        </div>

        <div className="p-8 md:p-12 lg:p-20">
          <header className="mb-10 lg:mb-16">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">CMS / {activeTab}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-zinc-900">{getTabTitle(activeTab)}</h1>
          </header>

          <div className="max-w-[1500px]">
            {activeTab === 'products' && (
              <ProductManager 
                products={products}
                onAddProduct={p => upsertDocument('products', p.id, p)}
                onUpdateProduct={p => upsertDocument('products', p.id, p)}
                onDeleteProduct={id => { if(confirm('Xóa sản phẩm này?')) removeDocument('products', id) }}
              />
            )}
            {activeTab === 'blogs' && (
              <BlogManager 
                blogs={blogs} 
                onAddBlog={b => upsertDocument('blogs', b.id, b)}
                onUpdateBlog={b => upsertDocument('blogs', b.id, b)}
                onDeleteBlog={id => { if(confirm('Xóa bài này?')) removeDocument('blogs', id) }}
              />
            )}
            {activeTab === 'quotations' && (
              <QuotationManager 
                quotations={quotations}
                onUpdateStatus={handleUpdateQuotationStatus}
                onDelete={handleDeleteQuotation}
              />
            )}
            {activeTab === 'nav' && (
              <NavigationManager config={siteConfig} onUpdate={onUpdateSiteConfig} landingPages={landingPages} />
            )}
            {activeTab === 'banners' && (
              <BannerManager config={siteConfig} onUpdate={onUpdateSiteConfig} />
            )}
            {activeTab === 'homepage' && (
              <HomepageContentManager 
                config={siteConfig} 
                onUpdate={onUpdateSiteConfig} 
                products={products}
              />
            )}
            {activeTab === 'landings' && (
              <LandingPageManager user={user} />
            )}
            {activeTab === 'stores' && (
              <StoreContactManager config={siteConfig} onUpdate={onUpdateSiteConfig} />
            )}
            {activeTab === 'settings' && (
              <SystemSettingsManager config={siteConfig} onUpdate={onUpdateSiteConfig} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
