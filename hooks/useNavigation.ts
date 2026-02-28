
import { useState, useEffect, useMemo } from 'react';
import { LandingPage, SiteConfig } from '../types';

export const useNavigation = (landingPages: LandingPage[], siteConfig: SiteConfig) => {
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const navigate = (path: string) => {
    if (typeof window === 'undefined') return;
    const clean = path.startsWith('/') ? path : `/${path}`;
    if (window.location.pathname !== clean) {
      window.history.pushState({}, '', clean);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentPath(clean);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const routeInfo = useMemo(() => {
    const path = currentPath.toLowerCase();
    if (path.startsWith('/product/')) {
      const parts = path.split('-');
      const id = parts[parts.length - 1];
      return { type: 'product', id };
    }
    if (path.startsWith('/blog/')) {
      const parts = path.split('-');
      const id = parts[parts.length - 1];
      return { type: 'blog', id };
    }
    const slug = path.replace('/', '') || 'all';
    return { type: 'page', slug };
  }, [currentPath]);

  const matchedLandingPage = useMemo(() => {
    return landingPages.find(lp => lp.id.toLowerCase() === routeInfo.slug && lp.isActive);
  }, [landingPages, routeInfo.slug]);

  const matchedHiddenLink = useMemo(() => {
    return (siteConfig.hiddenLinks || []).find(link => link.id.toLowerCase() === routeInfo.slug && link.isActive);
  }, [siteConfig.hiddenLinks, routeInfo.slug]);

  const activeCategory = useMemo(() => {
    if (matchedHiddenLink) return 'HiddenLink';
    if (matchedLandingPage) return 'Landing';
    if (routeInfo.type === 'product') return 'Product';
    if (routeInfo.type === 'blog') return 'Blog';
    const s = routeInfo.slug;
    if (s === 'men') return 'Men';
    if (s === 'women') return 'Women';
    if (s === 'journal' || s === 'blog') return 'Blog';
    if (s === 'stores') return 'Stores';
    if (s === 'quotation') return 'Quotation';
    if (s === 'checkout') return 'Checkout';
    if (s === 'history') return 'History';
    if (s === 'admin') return 'Admin';
    return 'All';
  }, [routeInfo, matchedLandingPage, matchedHiddenLink]);

  return {
    currentPath,
    navigate,
    routeInfo,
    matchedLandingPage,
    matchedHiddenLink,
    activeCategory
  };
};
