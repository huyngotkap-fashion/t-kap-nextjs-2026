import { useState, useEffect, useMemo } from 'react';
import { LandingPage, SiteConfig } from '../types';

type RouteInfo =
  | { type: 'product'; id: string }
  | { type: 'blog'; id: string }
  | { type: 'page'; slug: string };

export const useNavigation = (
  landingPages: LandingPage[],
  siteConfig: SiteConfig,
  initialCategory?: string
) => {
  const [currentPath, setCurrentPath] = useState<string>('/');

  useEffect(() => {
    if (typeof window === 'undefined') return;
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

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const routeInfo = useMemo<RouteInfo>(() => {
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

    const parts = path.split('/').filter(Boolean);

if (parts.length === 0) {
  return { type: 'page', slug: 'all' };
}

if (parts.length === 1) {
  return { type: 'page', slug: parts[0] };
}

if (parts.length >= 2) {
  return { type: 'page', slug: `${parts[0]}/${parts[1]}` };
}

return { type: 'page', slug: 'all' };
  }, [currentPath]);

  const matchedLandingPage = useMemo(() => {
    if (routeInfo.type !== 'page') return undefined;

    return landingPages.find(
      (lp: LandingPage) =>
        lp.id.toLowerCase() === routeInfo.slug && lp.isActive
    );
  }, [landingPages, routeInfo]);

  const matchedHiddenLink = useMemo(() => {
    if (routeInfo.type !== 'page') return undefined;

    return (siteConfig.hiddenLinks || []).find(
      (link) =>
        link.slug?.toLowerCase() === routeInfo.slug && link.isActive
    );
  }, [siteConfig.hiddenLinks, routeInfo]);

  const activeCategory = useMemo(() => {
    if (matchedHiddenLink) return 'HiddenLink';

    if (matchedLandingPage) return 'Landing';

    if (routeInfo.type === 'product') return 'Product';

    if (routeInfo.type === 'blog') return 'Blog';

    if (routeInfo.type === 'page') {
  const parts = routeInfo.slug.split('/');

  const category = parts[0];
  const subcategory = parts[1];

  if (category === 'admin') return 'Admin';

  if (subcategory) return subcategory;

  if (category === 'men') return 'men';
  if (category === 'polo-sport') return 'polo-sport';
  if (category === 'journal' || category === 'blog') return 'Blog';
  if (category === 'stores') return 'Stores';
  if (category === 'quotation') return 'Quotation';
  if (category === 'checkout') return 'Checkout';
  if (category === 'history') return 'History';
}

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