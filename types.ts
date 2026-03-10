export type Language = "en" | "vi";

/* =========================
   SHARED TYPES
========================= */

export type LocalizedText = {
  vi?: string
  en?: string
}

/* =========================
   NAVIGATION
========================= */

export interface MenuItem {
  id: string;

  label: LocalizedText;

  targetCategory: string;

  type?: "category" | "landing" | "external";

  order?: number;

  isActive?: boolean;
}

export interface BrandNavItem {
  id: string;

  label: LocalizedText;

  targetCategory: string;
}

/* =========================
   AI STYLIST
========================= */

export interface StylingAdvice {
  suggestion: string;
  itemsToPair: string[];
}
/* =========================
   PRODUCT
========================= */

  export interface Product {
    id: string;
    name: LocalizedText;
    brand?: string;
    category?: string;
    subCategory?: string;
    description?: LocalizedText;
    price?: number;
    originalPrice?: number;
    pricingType?: "price" | "quotation";
    imageUrl?: string;
    media?: ProductMedia[];
    colors?: string[];
    sizes?: string[];
    status?: "active" | "hidden";
    isContactOnly?: boolean;
    threeSixtyImages?: string[];
  }

/* =========================
   USER
========================= */

export interface User {
  id: string;

  email: string;

  name: string;

  role: "admin" | "customer";
}

/* =========================
   QUOTATION / ORDER
========================= */
export interface ProductDetail {
  name: string;
  size?: string;
  price?: number;
}

export const QUOTATION_STATUS = [
  "pending",
  "contacted",
  "processing",
  "approved",
  "rejected",
  "completed",
] as const;

export type QuotationStatus = typeof QUOTATION_STATUS[number];

export interface QuotationRequest {
  id: string;

  userId?: string;

  customerName: string;

  type: "quotation" | "order";

  phone?: string;
  email?: string;
  message?: string;

  companyName?: string;

  productNames?: string[];

  productDetails?: ProductDetail[];

  totalAmount?: number;

  notes?: string;

  
  productIds?: string[];

  status?: QuotationStatus;

  createdAt?: string;
}

export interface QuotationProduct {
  id: string;
  name: string;
  size?: string;
  price?: number;
}

export interface Quotation {
  id: string;

  customerName?: string;
  email?: string;
  phone?: string;

  companyName?: string;

  type?: "quotation" | "order";

  productIds: string[];

  productNames: string[];

  productDetails?: QuotationProduct[];

  notes?: string;

  status: QuotationStatus;

  createdAt: string;

  totalAmount?: number;
}

/* =========================
   LANDING PAGE
========================= */

export interface LandingPage {
  id: string;

  title: string;

  slug?: string;

  isActive: boolean;

  showInMenu?: boolean;

  blocks?: any[];
}

/* =========================
   STORE LOCATOR
========================= */
export interface LocalizedString {
  vi?: string;
  en?: string;
}

export interface StoreLocation {
  name: string;
  address: string;
  mapUrl?: string;
}

export interface StoresPageConfig {
  title?: LocalizedString;
  description?: LocalizedString;

  hqName?: string;
  hqAddress?: string;
  mapEmbedUrl?: string;

  mapDirectionUrl?: string;

  hqPhone?: string;
  hqEmail?: string;

  openingHoursWeekdays?: string;
  openingHoursSunday?: string;

  locations?: StoreLocation[];
}

/* =========================
   CATEGORY
========================= */

export interface CategoryItem {
  slug: string;

  name: string;

  subCategories?: {
    slug: string;
    name: string;
  }[];
}

/* =========================
   HIDDEN LINKS
========================= */

export interface HiddenLink {
  id: string;

  slug: string;

  title: string;

  url: string;

  isActive?: boolean;
}

/* =========================
   BANNER
========================= */

export interface BannerConfig {
  id: string;

  type: "image" | "video";

  url: string;

  title?: LocalizedText;

  description?: LocalizedText;

  /* logo */

  logoType?: "text" | "image";

  logoText?: string;

  logoImageUrl?: string;

  bannerLogoRedirect?: string;

  /* buttons */

  primaryBtnText?: LocalizedText;

  primaryBtnLink?: string;

  secondaryBtnText?: LocalizedText;

  secondaryBtnLink?: string;

  /* display */

  displayMode?: "slider" | "single";

  targetMenu?: string;

  sliderGroupId?: string;

  order?: number;

  contentPosition?: "left" | "center" | "right"

  /* legacy */

  buttonText?: LocalizedText;

  buttonLink?: string;

  isActive?: boolean;
}

/* =========================
   CART
========================= */

export interface CartItem {
  id: string;

  name: LocalizedText;

  price: number;

  quantity: number;

  imageUrl?: string;

  selectedSize?: string;

  pricingType?: "price" | "quotation";
}

/* =========================
   PROMO POPUP
========================= */

export interface PromoPopupConfig {
  isActive?: boolean;

  title?: LocalizedText;

  content?: LocalizedText;

  message?: LocalizedText;

  imageUrl?: string;

  buttonText?: LocalizedText;

  buttonLink?: string;

  frequencyDays?: number;

  displayDelay?: number;
  countdownEnd?: string;
  showNewsletter?: boolean;
  newsletterPlaceholder?: LocalizedText;
  newsletterButtonText?: LocalizedText;
}

/* =========================
   PARTNERS
========================= */

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  url?: string;
}

/* =========================
   HOMEPAGE SECTIONS
========================= */

export interface ProductHotspot {
  x: number;
  y: number;
  productId: string;
}

export interface LookbookImage {
  url: string;
  title?: string;
  size?: "sm" | "lg";
  hotspots?: ProductHotspot[];
}

export interface LookbookConfig {
  title?: LocalizedText;
  subtitle?: LocalizedText;
  discoverText?: LocalizedText;
  discoverLink?: string;
  images?: LookbookImage[];
}



export interface HeritageSection {
  subtitle?: LocalizedText;
  title?: LocalizedText;
  description1?: LocalizedText;
  description2?: LocalizedText;

  imageMain?: string;
  imageSecondary?: string;

  values?: {
    vi: string[];
    en: string[];
  };
}

export interface LookbookSection {
  title?: LocalizedText;
  subtitle?: LocalizedText;

  discoverText?: LocalizedText;
  discoverLink?: string;

  images?: LookbookImage[];
}
/* =========================
   SITE CONFIG
========================= */

export interface SiteConfig {
  /* navigation */

  navItems: MenuItem[];

  brandNavItems: BrandNavItem[];

  categories?: CategoryItem[];

  /* branding */

  logoImageUrl: string;

  /* contact */

  contactPhone: string;

  contactEmail: string;

  contactFacebook?: string;

  contactYoutube?: string;

  contactZalo?: string;

  /* banners */

  banners: BannerConfig[];

  /* popup */

  promoPopup?: PromoPopupConfig;

  /* stores */

  storesPage?: StoresPageConfig;

  /* heritage */

  showHeritage?: boolean;

  heritage?: HeritageSection;

  /* lookbook */

  showLookbook?: boolean;

  lookbook?: LookbookSection;

  /* hidden links */

  hiddenLinks?: HiddenLink[];

  /* partners */

  showPartners?: boolean;

  partners?: Partner[];

  /* allow extra cms fields */

  [key: string]: any;
}
/* =========================
   LANDING PAGE BLOCK
========================= */

export interface LPBlock {
  id: string;

  type:
    | "hero"
    | "text"
    | "image"
    | "image-text"
    | "video"
    | "product-grid"
    | "product-carousel"
    | "banner"
    | "spacer";

  content?: {
    title?: LocalizedText;
    subtitle?: LocalizedText;
    text?: LocalizedText;

    buttonText?: LocalizedText;
    buttonLink?: string;

    imageUrl?: string;
    videoUrl?: string;
  };

  settings?: {
    columns?: number;
    autoplay?: boolean;
    height?: string;
    backgroundColor?: string;

    animation?: string;
    layout?: "left" | "right";
  };

  products?: string[];

  order?: number;

  isActive?: boolean;
}
/* =========================
   BLOG
========================= */

export interface Blog {
  id: string;

  title: LocalizedText;

  shortDesc?: LocalizedText;

  slug: string;

  excerpt?: LocalizedText;

  content?: LocalizedText;

  coverImage?: string;

  author?: string;

  tags?: string[];

  createdAt: string;

  updatedAt?: string;

  isActive?: boolean;

  imageUrl?: string;

  videoUrl?: string;

  category?: LocalizedText;

  date: string | null;

}

export interface DetailHotspot {
  id: string;

  x: number;
  y: number;

  title: LocalizedText;

  description: LocalizedText;

  imageUrl?: string;
}

export interface ProductMedia {
  type: "image" | "video";

  url: string;

  hotspots?: DetailHotspot[];
}

export type HeritageConfig = HeritageSection & {
  title?: LocalizedText;
  imageUrl?: string;
}