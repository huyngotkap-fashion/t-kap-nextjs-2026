
import { useState, useEffect } from 'react';
import { Product, Blog, QuotationRequest, LandingPage, SiteConfig } from '../types';
import { subscribeToDocument, subscribeToCollection } from '../services/firebaseService';

const DEFAULT_SITE_CONFIG: SiteConfig = {
  navItems: [],
  brandNavItems: [],
  hiddenNavItems: [],
  hiddenLinks: [],
  banners: [],
  heroDisplayMode: 'slider',
  heritage: {
    subtitle: { en: '', vi: '' },
    title: { en: '', vi: '' },
    description1: { en: '', vi: '' },
    description2: { en: '', vi: '' },
    imageMain: '',
    imageSecondary: '',
    values: { en: [], vi: [] }
  },
  lookbook: {
    title: { en: '', vi: '' },
    subtitle: { en: '', vi: '' },
    discoverText: { en: '', vi: '' },
    discoverLink: '/',
    images: []
  },
  partners: [],
  promoPopup: {
    isActive: false,
    imageUrl: '',
    title: { en: '', vi: '' },
    content: { en: '', vi: '' },
    link: '',
    displayDelay: 3
  },
  logoImageUrl: 'https://res.cloudinary.com/dozhznwuf/image/upload/v1768206325/logo-tkap_hrspdt.png',
  logoRedirect: 'All',
  showHeritage: false,
  showLookbook: false,
  showProductShowcase: true,
  showPartners: false,
  brandPrimaryColor: '#000000',
  contactPhone: '',
  contactEmail: '',
  contactHQ: '',
  storesPage: {
    title: { en: 'Our Stores', vi: 'Cửa hàng' },
    description: { en: '', vi: '' },
    hqName: '',
    hqAddress: '',
    hqPhone: '',
    hqEmail: '',
    mapEmbedUrl: '',
    mapDirectionUrl: '',
    openingHoursWeekdays: '',
    openingHoursSunday: ''
  }
};

export const useSiteData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  useEffect(() => {
    const u1 = subscribeToDocument('config', 'site', data => {
      if (data) {
        setSiteConfig(data as SiteConfig);
        setIsConfigLoaded(true);
      }
    });
    const u2 = subscribeToCollection('products', data => setProducts(data as Product[]));
    const u3 = subscribeToCollection('blogs', data => setBlogs(data as Blog[]));
    const u4 = subscribeToCollection('quotations', data => setQuotations(data as QuotationRequest[]));
    const u5 = subscribeToCollection('landingPages', data => setLandingPages(data as LandingPage[]));
    return () => { u1(); u2(); u3(); u4(); u5(); };
  }, []);

  return { products, blogs, quotations, landingPages, siteConfig, isConfigLoaded };
};
