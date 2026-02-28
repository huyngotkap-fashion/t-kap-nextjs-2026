
export type Language = 'en' | 'vi';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  gender?: 'men' | 'women' | 'other';
  birthDate?: string;
  newsletter?: boolean;
}

export interface DetailHotspot {
  id: string;
  x: number;
  y: number;
  title: { en: string; vi: string };
  description: { en: string; vi: string };
  imageUrl?: string;
}

export interface ProductMedia {
  type: 'image' | 'video';
  url: string;
  hotspots?: DetailHotspot[];
}

export interface ProductHotspot {
  productId: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface Product {
  id: string;
  name: string;
  brand: string; 
  category: string;
  subCategory: string;
  price: number;
  originalPrice?: number;
  isContactOnly?: boolean;
  pricingType?: 'price' | 'quotation';
  status?: 'active' | 'hidden';
  colors?: string[];
  sizes?: string[];
  media: ProductMedia[];
  imageUrl: string;
  threeSixtyImages?: string[]; // Array of image URLs for 360 view
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  shortDescription?: string;
}

export interface Blog {
  id: string;
  title: { en: string; vi: string };
  shortDesc: { en: string; vi: string };
  content: { en: string; vi: string };
  imageUrl: string;
  videoUrl?: string;
  category?: { en: string; vi: string };
  date: string;
  author: string;
  seoTitle?: string;
  seoDescription?: string;
}

export type QuotationStatus = 'pending' | 'contacted' | 'quoted' | 'processing' | 'completed';

export interface QuotationRequest {
  id: string;
  userId?: string;
  type: 'order' | 'inquiry';
  customerName: string;
  phone: string;
  email: string;
  companyName?: string;
  productIds: string[];
  productNames: string[];
  productDetails?: { id: string; name: string; size: string; price: number }[];
  notes?: string;
  status: QuotationStatus;
  createdAt: string;
  totalAmount?: number;
}

export interface MenuItem {
  id: string;
  label: { en: string; vi: string };
  targetCategory: string;
}

export interface BrandNavItem {
  id: string;
  label: string;
  targetCategory: string;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
}

export interface PromoPopupConfig {
  isActive: boolean;
  imageUrl: string;
  title: { en: string; vi: string };
  content: { en: string; vi: string };
  link: string;
  displayDelay: number;
  showNewsletter?: boolean;
  newsletterPlaceholder?: { en: string; vi: string };
  buttonText?: { en: string; vi: string };
  countdownEnd?: string; // ISO Date string
  frequencyDays?: number; // Số ngày trước khi hiện lại
}

export interface LPBlock {
  id: string;
  type: 'Hero' | 'VideoBackground' | 'ImageText' | 'FullImage' | 'CallToAction';
  title: { en: string; vi: string };
  content: { en: string; vi: string };
  imageUrl?: string;
  videoUrl?: string;
  buttonText: { en: string; vi: string };
  buttonLink?: string;
  layout?: 'left' | 'right';
  animation: string;
}

export interface LandingPage {
  id: string;
  title: string;
  isActive: boolean;
  showInMenu?: boolean;
  blocks: LPBlock[];
}

export interface HiddenLink {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

export interface SiteConfig {
  navItems: MenuItem[];
  brandNavItems: BrandNavItem[];
  hiddenNavItems: MenuItem[];
  hiddenLinks: HiddenLink[]; // Danh sách các Link ẩn (Iframe)
  banners: BannerConfig[];
  heroDisplayMode: 'slider' | 'vertical';
  heritage: HeritageConfig;
  lookbook: LookbookConfig;
  partners: Partner[];
  promoPopup: PromoPopupConfig;
  logoImageUrl: string;
  logoRedirect: string;
  showHeritage: boolean;
  showLookbook: boolean;
  showProductShowcase: boolean;
  showPartners: boolean;
  brandPrimaryColor: string;
  contactPhone: string;
  contactEmail: string;
  contactHQ: string;
  contactBranch?: string;
  contactFactory?: string;
  contactZalo?: string;
  contactYoutube?: string;
  contactFacebook?: string;
  showZalo?: boolean;
  showYoutube?: boolean;
  showFacebook?: boolean;
  storesPage: StoresPageConfig;
}

export interface BannerConfig {
  id: string;
  type: 'video' | 'image';
  url: string;
  title: { en: string; vi: string };
  description: { en: string; vi: string };
  logoType: 'text' | 'image';
  logoText: string;
  logoUrl?: string;
  bannerLogoRedirect: string;
  primaryBtnText: { en: string; vi: string };
  primaryBtnLink: string;
  secondaryBtnText: { en: string; vi: string };
  secondaryBtnLink: string;
  displayMode: 'slider' | 'vertical';
  targetMenu: string;
  contentPosition?: 'left' | 'right' | 'center';
  sliderGroupId?: string;
  order?: number;
}

export interface HeritageConfig {
  subtitle: { en: string; vi: string };
  title: { en: string; vi: string };
  description1: { en: string; vi: string };
  description2: { en: string; vi: string };
  imageMain: string;
  imageSecondary: string;
  values: { en: string[]; vi: string[] };
}

export interface LookbookImage {
  url: string;
  title: string;
  size: 'lg' | 'sm';
  hotspots?: ProductHotspot[];
}

export interface LookbookConfig {
  title: { en: string; vi: string };
  subtitle: { en: string; vi: string };
  discoverText: { en: string; vi: string };
  discoverLink: string;
  images: LookbookImage[];
}

export interface StoresPageConfig {
  title: { en: string; vi: string };
  description: { en: string; vi: string };
  hqName: string;
  hqAddress: string;
  hqPhone: string;
  hqEmail: string;
  mapEmbedUrl: string;
  mapDirectionUrl: string;
  openingHoursWeekdays: string;
  openingHoursSunday: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface StylingAdvice {
  suggestion: string;
  occasion: string;
  itemsToPair: string[];
}
