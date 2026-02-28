
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCarousel from './components/ProductCarousel';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import Heritage from './components/Heritage';
import Lookbook from './components/Lookbook';
import Partners from './components/Partners';
import StoreLocator from './components/StoreLocator';
import BlogSection from './components/BlogSection';
import PromoPopup from './components/PromoPopup';
import AuthModal from './components/AuthModal';
import ProductDetailView from './components/ProductDetailView';
import QuotationForm from './components/QuotationForm';
import OrderHistory from './components/OrderHistory';
import LoadingScreen from './components/LoadingScreen';
import FloatingContact from './components/FloatingContact';
import LandingPageRenderer from './components/landing-page/LandingPageRenderer';
import { useSeo } from './components/useSeo';
import { Product, Language } from './types';
import { upsertDocument } from './services/firebaseService';
import { formatPrice } from './utils/format';

// Import custom hooks
import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';
import { useWishlist } from './hooks/useWishlist';
import { useSiteData } from './hooks/useSiteData';
import { useNavigation } from './hooks/useNavigation';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('vi');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Use custom hooks
  const { user, logoutUser } = useAuth();
  const { products, blogs, quotations, landingPages, siteConfig, isConfigLoaded } = useSiteData();
  const { cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal } = useCart();
  const { wishlist, toggleWishlist, wishlistProducts } = useWishlist(products);
  const { navigate, routeInfo, matchedLandingPage, matchedHiddenLink, activeCategory } = useNavigation(landingPages, siteConfig);

  useSeo({ 
    title: activeCategory === 'Product' ? products.find(p => p.id === routeInfo.id)?.name : (matchedLandingPage?.title || matchedHiddenLink?.title), 
    lang: language 
  });

  const handleWishlistToCartAction = (p: Product) => {
    addToCart(p);
    setIsWishlistOpen(false);
    if (p.pricingType === 'quotation') navigate('/quotation');
    else setIsCartOpen(true);
  };

  const renderContent = () => {
    if (!isConfigLoaded) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>;

    if (activeCategory === 'HiddenLink' && matchedHiddenLink) {
      return (
        <div className="w-full h-[calc(100vh-70px)] md:h-[calc(100vh-115px)] animate-reveal">
           <iframe 
             src={matchedHiddenLink.url} 
             className="w-full h-full border-none" 
             title={matchedHiddenLink.title}
             allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
           />
        </div>
      );
    }

    if (activeCategory === 'Landing' && matchedLandingPage) {
      return <LandingPageRenderer page={matchedLandingPage} language={language} />;
    }

    if (activeCategory === 'Admin') {
      return user?.role === 'admin' ? (
        <AdminDashboard
          products={products}
          blogs={blogs}
          quotations={quotations}
          landingPages={landingPages}
          siteConfig={siteConfig}
          language={language}
          onUpdateSiteConfig={c => upsertDocument('config', 'site', c)}
          user={user}
        />
      ) : <div className="h-[60vh] flex items-center justify-center font-bold uppercase tracking-widest">Access Denied</div>;
    }

    if (activeCategory === 'Product' && routeInfo.id) {
      const product = products.find(p => p.id === routeInfo.id);
      if (!product) return <div className="h-[60vh] flex items-center justify-center">Product not found</div>;
      return <ProductDetailView product={product} allProducts={products} language={language} onAddToCart={(prod, sz) => { addToCart(prod, sz); setIsCartOpen(true); }} wishlist={wishlist} onToggleWishlist={toggleWishlist} />;
    }

    if (activeCategory === 'Blog') {
      return (
        <>
          {!routeInfo.id && <Hero language={language} config={siteConfig} activeCategory="Blog" onAction={navigate} />}
          <BlogSection language={language} blogs={blogs} activeBlogId={routeInfo.type === 'blog' ? routeInfo.id || null : null} />
        </>
      );
    }

    if (activeCategory === 'Stores') {
      return <StoreLocator language={language} config={siteConfig.storesPage} />;
    }

    if (activeCategory === 'Quotation' || activeCategory === 'Checkout') {
      return <QuotationForm products={products} language={language} user={user} cart={cart} clearCart={clearCart} mode={activeCategory === 'Checkout' ? 'checkout' : 'quotation'} />;
    }

    if (activeCategory === 'History') {
      return user ? <OrderHistory user={user} language={language} products={products} /> : <div className="h-[60vh] flex items-center justify-center">Please log in to view history</div>;
    }

    if (activeCategory === 'Men' || activeCategory === 'Women') {
      const filtered = products.filter(p => p.category === activeCategory);
      return (
        <>
          <Hero language={language} config={siteConfig} activeCategory={activeCategory} onAction={navigate} />
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-20">
            <div className="mb-16">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">{activeCategory}</h1>
              <p className="text-zinc-400 mt-4 uppercase tracking-[0.3em] font-bold">Discover the Signature {activeCategory} Collection</p>
            </div>
            <ProductGrid products={filtered} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
          </div>
        </>
      );
    }

    return (
      <>
        <Hero language={language} config={siteConfig} activeCategory="All" onAction={navigate} />
        {siteConfig.showHeritage && siteConfig.heritage && <Heritage language={language} config={siteConfig.heritage} />}
        {siteConfig.showLookbook && siteConfig.lookbook && (
          <Lookbook 
            language={language} 
            config={siteConfig.lookbook} 
            products={products}
            onAddToCart={(p) => { addToCart(p); setIsCartOpen(true); }}
            onNavigate={navigate}
          />
        )}
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-24">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-[10px] font-black text-zinc-300 tracking-[0.5em] uppercase mb-4 block">Selected for you</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">New Arrivals</h2>
            </div>
            <button onClick={() => navigate('/men')} className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all">View All</button>
          </div>
          <ProductCarousel products={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
        </div>
        {siteConfig.showPartners && <Partners language={language} partners={siteConfig.partners} />}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <LoadingScreen />
      <Navbar
        onNavigate={navigate} 
        activeCategory={activeCategory} 
        cartCount={cartCount}
        wishlistCount={wishlist.length} 
        language={language} 
        onLanguageChange={setLanguage} 
        config={siteConfig}
        user={user} 
        onLogout={async () => { await logoutUser(); navigate('/'); }}
        onOpenAuth={() => setIsAuthModalOpen(true)} 
        products={products}
        landingPages={landingPages}
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />
      <main className="pt-[70px] md:pt-[115px]">{renderContent()}</main>
      <div className={`fixed inset-0 z-[3000] ${isCartOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-boss ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-tighter">Shopping Bag ({cart.length})</h3>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-zinc-100 transition-colors">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
            {cart.length > 0 ? cart.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-6 group">
                <div className="w-24 h-32 bg-zinc-50 shrink-0 overflow-hidden">
                  <img src={item.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-black uppercase leading-tight mb-1">{item.name}</h4>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Size: {item.selectedSize || 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black">{formatPrice(item.price)}</span>
                    <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-black underline">Remove</button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Your bag is empty</p>
                <button onClick={() => setIsCartOpen(false)} className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-1">Start Shopping</button>
              </div>
            )}
          </div>
          {cart.length > 0 && (
            <div className="p-8 border-t border-zinc-100 space-y-6">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                <span className="text-2xl font-black">{formatPrice(cartTotal)}</span>
              </div>
              <button onClick={() => { setIsCartOpen(false); navigate('/checkout'); }} className="w-full bg-black text-white py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all">Proceed to Checkout</button>
            </div>
          )}
        </div>
      </div>
      <div className={`fixed inset-0 z-[3000] ${isWishlistOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isWishlistOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsWishlistOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-boss ${isWishlistOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-tighter">Favorites ({wishlist.length})</h3>
            <button onClick={() => setIsWishlistOpen(false)} className="p-2 hover:bg-zinc-100 transition-colors">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
            {wishlistProducts.length > 0 ? wishlistProducts.map((p) => (
              <div key={p.id} className="flex gap-6 group">
                <div className="w-24 h-32 bg-zinc-50 shrink-0 overflow-hidden cursor-pointer" onClick={() => { setIsWishlistOpen(false); navigate(`/product/${p.name.toLowerCase().replace(/\s+/g, '-')}-${p.id}`); }}>
                  <img src={p.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-black uppercase leading-tight mb-1">{p.name}</h4>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{p.brand}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-sm font-black uppercase tracking-tighter">
                      {p.pricingType === 'quotation' 
                        ? (language === 'vi' ? 'Báo giá' : 'Quote')
                        : formatPrice(p.price)
                      }
                    </span>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleWishlistToCartAction(p)} 
                        className="text-[9px] font-black uppercase tracking-widest border-b border-black pb-1"
                      >
                        {p.pricingType === 'quotation' 
                          ? (language === 'vi' ? 'Thêm vào báo giá' : 'Add to Quote')
                          : (language === 'vi' ? 'Thêm vào túi' : 'Add to Bag')
                        }
                      </button>
                      <button 
                        onClick={() => toggleWishlist(p.id)} 
                        className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-black underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Your favorites list is empty</p>
                <button onClick={() => setIsWishlistOpen(false)} className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-1">Discover Collections</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer language={language} config={siteConfig} onNavigate={navigate} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} language={language} />
      {siteConfig.promoPopup?.isActive && <PromoPopup config={siteConfig.promoPopup} language={language} />}
      <FloatingContact config={siteConfig} language={language} />
    </div>
  );
};

export default App;
