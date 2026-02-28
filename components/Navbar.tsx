
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Language, SiteConfig, User, Product, LandingPage, MenuItem } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  onNavigate: (path: string) => void;
  activeCategory: string;
  cartCount: number;
  wishlistCount?: number; 
  language: Language;
  onLanguageChange: (lang: Language) => void;
  config: SiteConfig;
  user: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  products: Product[];
  landingPages?: LandingPage[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

const createSlug = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, activeCategory, cartCount, wishlistCount = 0,
  language, onLanguageChange, config, 
  user, onLogout, onOpenAuth, products = [],
  landingPages = [],
  onOpenCart, onOpenWishlist
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const baseCategory = useMemo(() => {
    if (activeCategory.includes(':')) return activeCategory.split(':')[0];
    return activeCategory;
  }, [activeCategory]);

  const filteredNavItems = useMemo(() => {
    let items = config.navItems ? [...config.navItems] : [];

    // 1. Tích hợp Landing Pages vào menu
    if (landingPages && landingPages.length > 0) {
      landingPages.forEach(lp => {
        if (lp.isActive && lp.showInMenu) {
          const lpPath = `/${lp.id.toLowerCase()}`;
          if (!items.some(item => item.targetCategory.toLowerCase().includes(lp.id.toLowerCase()))) {
            items.push({
              id: `dynamic-lp-${lp.id}`,
              label: { en: lp.title.toUpperCase(), vi: lp.title.toUpperCase() },
              targetCategory: lpPath
            });
          }
        }
      });
    }

    // 2. Đảm bảo mục BÁO GIÁ luôn xuất hiện
    const hasQuotation = items.some(i => {
      const target = i.targetCategory.toLowerCase().replace(/^\//, '');
      return target === 'quotation';
    });

    if (!hasQuotation) {
      items.push({ 
        id: 'fixed-quotation', 
        label: { en: 'QUOTATION', vi: 'BÁO GIÁ' }, 
        targetCategory: 'Quotation' 
      });
    }
    
    // 3. Quản lý mục ADMIN
    if (user?.role === 'admin') {
      const hasAdmin = items.some(i => i.targetCategory.toLowerCase().replace(/^\//, '') === 'admin');
      if (!hasAdmin) {
        items.push({ 
          id: 'fixed-admin', 
          label: { en: 'ADMIN', vi: 'QUẢN TRỊ' }, 
          targetCategory: 'Admin' 
        });
      }
    } else {
      items = items.filter(i => i.targetCategory.toLowerCase().replace(/^\//, '') !== 'admin');
    }

    return items;
  }, [config.navItems, user, landingPages]);

  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const normalizedQuery = removeAccents(searchQuery);
    return products.filter(p => {
      const nameMatch = removeAccents(p.name).includes(normalizedQuery);
      const brandMatch = removeAccents(p.brand).includes(normalizedQuery);
      return nameMatch || brandMatch;
    }).slice(0, 8);
  }, [searchQuery, products]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(path);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  const getUrlPath = (category: string) => {
    const cat = category.toLowerCase().replace(/^\//, '');
    if (cat === 'all' || cat === '' || category === '/') return '/';
    if (cat === 'blog' || cat === 'journal') return '/journal';
    if (cat === 'stores') return '/stores';
    if (cat === 'admin') return '/admin';
    if (cat === 'quotation') return '/quotation';
    if (cat === 'history') return '/history';
    if (category.startsWith('/')) return category;
    return `/${createSlug(category)}`;
  };

  const isLinkActive = (item: MenuItem) => {
    const itemPath = getUrlPath(item.targetCategory).toLowerCase();
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath === itemPath) return true;
    const normalizedTarget = item.targetCategory.toLowerCase().replace(/^\//, '');
    return baseCategory.toLowerCase() === normalizedTarget;
  };

  const isBrandActive = (targetCategory: string) => {
    const normalizedTarget = targetCategory.replace(/^\//, '').toLowerCase();
    const normalizedActive = baseCategory.toLowerCase();
    if (normalizedTarget === 'all' && (normalizedActive === 'all' || normalizedActive === '')) return true;
    return normalizedTarget === normalizedActive;
  };

  return (
    <header className="fixed top-0 w-full z-[100] font-heading">
      {/* Top Banner */}
      <div className="hidden md:block bg-white text-black py-2.5 border-b border-zinc-100 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em]">
  {language === 'vi'
    ? 'T-KAP – CHUYÊN SẢN XUẤT ÁO POLO & ĐỒNG PHỤC DOANH NGHIỆP'
    : 'T-KAP – PREMIUM POLO & CORPORATE UNIFORM MANUFACTURER'}
</p>
      </div>

      {/* Main Nav */}
      <nav className="bg-black text-white h-[70px] md:h-[90px] flex items-center justify-between px-4 lg:px-12 relative border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-4 md:gap-10 flex-1 min-w-0">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="xl:hidden p-2 text-white z-[110]" aria-label="Menu">
            {isMobileMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 8h16M4 16h16" /></svg>
            )}
          </button>
          
          <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="hidden xl:block transition-opacity hover:opacity-70 shrink-0">
            <img src={config.logoImageUrl} alt="TKAP" className="h-14 w-auto object-contain" />
          </a>

          {/* Brands Tab (Desktop) - Restore this feature */}
          <div className="hidden lg:flex items-center h-full ml-4 shrink-0">
            <div className="flex bg-[#0a0a0a] border border-zinc-800 rounded-sm overflow-hidden">
              {config.brandNavItems.map((brand) => {
                const isActive = isBrandActive(brand.targetCategory);
                return (
                  <a
                    key={brand.id}
                    href={getUrlPath(brand.targetCategory)}
                    onClick={(e) => handleLinkClick(e, getUrlPath(brand.targetCategory))}
                    className={`px-6 py-3 text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                      isActive 
                        ? 'bg-white text-black' 
                        : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    {brand.label?.[language] || brand.label?.vi}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Logo (Mobile & Middle) */}
        <div className="xl:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <a href="/" onClick={(e) => handleLinkClick(e, '/')}><img src={config.logoImageUrl} alt="T-KAP" className="h-10 md:h-12 w-auto object-contain" /></a>
        </div>

        {/* Main Links (Desktop) */}
        <div className="hidden xl:flex items-center justify-center gap-6 lg:gap-10 shrink-0">
          {filteredNavItems.map((link) => {
            const active = isLinkActive(link);
            const path = getUrlPath(link.targetCategory);
            return (
              <a
                key={link.id}
                href={path}
                onClick={(e) => handleLinkClick(e, path)}
                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative py-2 group whitespace-nowrap ${
                  active ? 'text-white' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {link.label[language] || link.label['vi']}
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-white transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </a>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 md:gap-5 flex-1">
          <button onClick={() => setIsSearchOpen(true)} className="p-2 text-zinc-500 hover:text-white transition-colors" aria-label="Search">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => handleLinkClick(e, '/history')}
                  className={`p-2 transition-colors ${activeCategory === 'History' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
                  title={language === 'vi' ? 'Lịch sử' : 'History'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <button onClick={onLogout} className="text-zinc-500 hover:text-white text-[9px] font-bold uppercase tracking-widest">
  {language === 'vi' ? 'ĐĂNG XUẤT' : 'LOGOUT'}
</button>
              </div>
            ) : (
              <button onClick={onOpenAuth} className="p-2 text-zinc-500 hover:text-white transition-colors" aria-label="Login">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 21a7 7 0 01-7-7h14a7 7 0 01-7 7z" /></svg>
              </button>
            )}
            <div className="flex items-center gap-3 border-l border-zinc-800 pl-4">
              <button onClick={() => onLanguageChange('en')} className={`text-[10px] font-bold transition-colors ${language === 'en' ? 'text-white' : 'text-zinc-600'}`}>EN</button>
              <button onClick={() => onLanguageChange('vi')} className={`text-[10px] font-bold transition-colors ${language === 'vi' ? 'text-white' : 'text-zinc-600'}`}>VI</button>
            </div>
          </div>

          <button 
            onClick={onOpenWishlist}
            className="relative p-2 text-white hover:text-red-500 transition-colors"
            aria-label="Wishlist"
          >
            <svg className={`w-6 h-6 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlistCount}</span>}
          </button>

          <button onClick={onOpenCart} className="relative p-2 text-white hover:text-zinc-400" aria-label="Cart">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      <div className={`fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl transition-all duration-500 ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="max-w-6xl mx-auto pt-32 px-6">
          <div className="flex justify-between items-center border-b-2 border-zinc-800 pb-6 mb-12">
            <div className="flex-1 flex items-center gap-6">
              <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder={language === 'vi' ? 'Tìm kiếm sản phẩm...' : 'Search for products...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-3xl md:text-5xl font-black uppercase tracking-tighter w-full placeholder:text-zinc-800"
              />
            </div>
            <button onClick={() => setIsSearchOpen(false)} className="text-zinc-500 hover:text-white transition-all ml-4">
              <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-h-[60vh] overflow-y-auto no-scrollbar pb-10">
            {searchResults.map(p => (
              <a key={p.id} href={`/product/${createSlug(p.name)}-${p.id}`} onClick={(e) => handleLinkClick(e, `/product/${createSlug(p.name)}-${p.id}`)} className="group flex gap-6 p-4 hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-800">
                <div className="w-24 h-32 bg-zinc-800 overflow-hidden shrink-0"><img src={p.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt="" /></div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{p.brand}</span>
                  <h4 className="text-white text-sm font-black uppercase mb-2 leading-snug">{p.name}</h4>
                  <span className="text-white font-bold text-xs">
  {p.pricingType === 'quotation'
    ? (language === 'vi' ? 'BÁO GIÁ' : 'QUOTE')
    : `$${p.price}`}
</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-[90] bg-black transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] xl:hidden ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="flex flex-col h-full bg-black px-8 py-24 space-y-8 overflow-y-auto no-scrollbar">
          {/* Brand Selection Mobile */}
          <div className="grid grid-cols-2 gap-4 pb-8 border-b border-zinc-900">
            {config.brandNavItems.map((brand) => (
              <a
                key={brand.id}
                href={getUrlPath(brand.targetCategory)}
                onClick={(e) => handleLinkClick(e, getUrlPath(brand.targetCategory))}
                className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center border transition-all ${
                  isBrandActive(brand.targetCategory) ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500'
                }`}
              >
                {brand.label?.[language] || brand.label?.vi}
              </a>
            ))}
          </div>

          <div className="flex flex-col space-y-6">
            {filteredNavItems.map((link) => (
              <a
                key={link.id}
                href={getUrlPath(link.targetCategory)}
                onClick={(e) => handleLinkClick(e, getUrlPath(link.targetCategory))}
                className={`text-3xl font-black uppercase tracking-tight transition-all ${
                  isLinkActive(link) ? 'text-white' : 'text-zinc-700'
                }`}
              >
                {link.label[language] || link.label['vi']}
              </a>
            ))}
          </div>

          <div className="mt-auto space-y-8 pb-10">
            {user && (
              <button 
                onClick={(e) => handleLinkClick(e, '/history')}
                className={`text-sm font-black uppercase tracking-[0.2em] block ${activeCategory === 'History' ? 'text-white' : 'text-zinc-600'}`}
              >
                {language === 'vi' ? 'LỊCH SỬ CỦA TÔI' : 'MY HISTORY'}
              </button>
            )}
            <div className="flex gap-6 border-t border-zinc-900 pt-8">
                <button onClick={() => onLanguageChange('en')} className={`text-sm font-black ${language === 'en' ? 'text-white' : 'text-zinc-700'}`}>ENGLISH</button>
                <button onClick={() => onLanguageChange('vi')} className={`text-sm font-black ${language === 'vi' ? 'text-white' : 'text-zinc-700'}`}>TIẾNG VIỆT</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
