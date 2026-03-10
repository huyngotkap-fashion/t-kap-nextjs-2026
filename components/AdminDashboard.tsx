import React, { useState } from 'react';
import { 
  Product, Blog, Language, SiteConfig, QuotationRequest, QuotationStatus, User, LandingPage
} from '../types';
import { removeDocument, upsertDocument } from '../services/firebaseService';

import BlogManager from './admin/BlogManager';
import ProductManager from './admin/ProductManager';
import QuotationManager from './admin/QuotationManager';
import NavigationManager from './admin/NavigationManager';
import BannerManager from './admin/BannerManager';
import HomepageContentManager from './admin/HomepageContentManager';
import StoreContactManager from './admin/StoreContactManager';
import SystemSettingsManager from './admin/SystemSettingsManager';
import LandingPageManager from './admin/LandingPageManager';
import CategoryManager from './admin/CategoryManager';

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

type TabType =
  | 'products'
  | 'blogs'
  | 'quotations'
  | 'categories'
  | 'nav'
  | 'banners'
  | 'homepage'
  | 'stores'
  | 'settings'
  | 'landings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  blogs,
  quotations,
  landingPages,
  siteConfig,
  language,
  onUpdateSiteConfig,
  user
}) => {

  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleUpdateQuotationStatus = async (
    q: QuotationRequest,
    status: QuotationStatus
  ) => {

    if (!q.id) return;

    await upsertDocument('quotations', q.id, { ...q, status });
  };

  const handleDeleteQuotation = async (id: string) => {

    const ok = window.confirm('Xóa yêu cầu này?');

    if (ok) {
      await removeDocument('quotations', id);
    }

  };

  const toggleTab = (id: TabType) => {
    setActiveTab(id);
    setIsSidebarOpen(false);
  };

  const navItemClass = (id: TabType) => `
    w-full text-left px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-r-4 flex items-center gap-4
    ${
      activeTab === id
        ? 'text-black bg-zinc-50 border-black'
        : 'text-zinc-400 border-transparent hover:text-black hover:bg-zinc-50'
    }
  `;

  const getTabTitle = (id: TabType) => {

    switch (id) {
      case 'categories': return 'Quản lý Danh mục';
      case 'products': return 'Kho Sản Phẩm';
      case 'blogs': return 'Tạp chí & Bài viết';
      case 'quotations': return 'Yêu cầu Báo giá';
      case 'nav': return 'Menu & Thương hiệu';
      case 'banners': return 'Banner Slider';
      case 'homepage': return 'Nội dung Trang chủ';
      case 'stores': return 'Cửa hàng & Liên hệ';
      case 'settings': return 'Cài đặt Hệ thống';
      case 'landings': return 'Trang chiến dịch (LPs)';
      default: return '';
    }

  };

  return (
    <div className="flex bg-[#FBFBFB] min-h-screen font-heading relative">

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-[150] w-80 bg-white border-r border-zinc-200 shadow-2xl flex flex-col shrink-0
        transition-transform duration-500
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:top-[115px] md:top-[115px] top-[70px]
      `}
      >

        <div className="p-10 border-b border-zinc-50 flex justify-between items-center">

          <div>
            <h2 className="text-3xl font-extrabold tracking-tighter uppercase text-black">
              T-KAP CMS
            </h2>

            <p className="text-[9px] font-bold text-zinc-400 mt-2 tracking-[0.4em] uppercase">
              Control Panel v2.0
            </p>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-zinc-400 hover:text-black"
          >
            ✕
          </button>

        </div>

        <nav className="flex-1 overflow-y-auto py-6">

          <div className="px-10 mb-4 text-[8px] font-bold text-zinc-300 uppercase tracking-[0.3em]">
            Nội dung
          </div>

          <button onClick={() => toggleTab('products')} className={navItemClass('products')}>
            📦 Sản phẩm
          </button>

          <button onClick={() => toggleTab('blogs')} className={navItemClass('blogs')}>
            🖋️ Tạp chí
          </button>

          <button onClick={() => toggleTab('quotations')} className={navItemClass('quotations')}>
            📜 Báo giá
          </button>

          <button onClick={() => toggleTab('categories')} className={navItemClass('categories')}>
            📂 Danh mục
          </button>

          <div className="px-10 mt-8 mb-4 text-[8px] font-bold text-zinc-300 uppercase tracking-[0.3em]">
            Giao diện
          </div>

          <button onClick={() => toggleTab('nav')} className={navItemClass('nav')}>
            🧭 Điều hướng
          </button>

          <button onClick={() => toggleTab('banners')} className={navItemClass('banners')}>
            🖼️ Banner
          </button>

          <button onClick={() => toggleTab('homepage')} className={navItemClass('homepage')}>
            🏛️ Trang chủ
          </button>

          <button onClick={() => toggleTab('landings')} className={navItemClass('landings')}>
            🚀 Landing Pages
          </button>

          <div className="px-10 mt-8 mb-4 text-[8px] font-bold text-zinc-300 uppercase tracking-[0.3em]">
            Cấu hình
          </div>

          <button onClick={() => toggleTab('stores')} className={navItemClass('stores')}>
            📍 Cửa hàng
          </button>

          <button onClick={() => toggleTab('settings')} className={navItemClass('settings')}>
            ⚙️ Hệ thống
          </button>

        </nav>

        <div className="p-8 border-t border-zinc-50">

          <span className="text-[8px] text-zinc-400 uppercase">
            User
          </span>

          <div className="text-[10px] font-black uppercase">
            {user?.name ?? 'Administrator'}
          </div>

        </div>

      </aside>

      <main className="flex-1 lg:ml-80 bg-zinc-50">

        <div className="p-8 md:p-12 lg:p-20">

          <header className="mb-10">

            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              CMS / {activeTab}
            </span>

            <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">
              {getTabTitle(activeTab)}
            </h1>

          </header>

          {activeTab === 'categories' && <CategoryManager />}

          {activeTab === 'products' && (
            <ProductManager
  products={products}
  language={language}
  onAddProduct={(p) => p.id && upsertDocument('products', p.id, p)}
  onUpdateProduct={(p) => p.id && upsertDocument('products', p.id, p)}
  onDeleteProduct={(id) => {
    if (window.confirm('Xóa sản phẩm này?')) removeDocument('products', id);
  }}
/>
          )}

          {activeTab === 'blogs' && (
  <BlogManager
    blogs={blogs}
    onAddBlog={(b) => b.id && upsertDocument('blogs', b.id, b)}
    onUpdateBlog={(b) => b.id && upsertDocument('blogs', b.id, b)}
    onDeleteBlog={(id) => {
      if (window.confirm('Xóa bài này?')) removeDocument('blogs', id);
    }}
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
            <NavigationManager
              config={siteConfig}
              onUpdate={onUpdateSiteConfig}
              landingPages={landingPages}
            />
          )}

          {activeTab === 'banners' && (
            <BannerManager
              config={siteConfig}
              onUpdate={onUpdateSiteConfig}
            />
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
            <StoreContactManager
              config={siteConfig}
              onUpdate={onUpdateSiteConfig}
            />
          )}

          {activeTab === 'settings' && (
            <SystemSettingsManager
              config={siteConfig}
              onUpdate={onUpdateSiteConfig}
            />
          )}

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;