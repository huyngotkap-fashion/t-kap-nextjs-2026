
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: {
    en: 'Slim-Fit Piqué Polo Shirt',
    vi: 'Áo Polo Slim-Fit Piqué'
  },
    brand: 'BOSS',
    category: 'Men',
    subCategory: 'Classic',
    price: 125,
    originalPrice: 175,
    imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=800',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=800' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' }
    ],
    description: {
  en: 'A signature staple crafted in organic piqué cotton for breathable comfort and a refined silhouette.',
  vi: 'Một thiết kế kinh điển được làm từ cotton piqué hữu cơ, mang lại sự thoáng khí và phom dáng tinh tế.'
}},
  {
    id: 'p2',
    name: {
    en: 'Performance Tech Polo',
    vi: 'Áo Polo Performance Tech'
  },
    brand: 'BOSS',
    category: 'Men',
    subCategory: 'Sports',
    price: 145,
    originalPrice: 195,
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800',
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800' }],
    description: {
    en: 'Engineered with moisture-wicking fabric and stretch for the active professional.',
    vi: 'Được thiết kế với vải thấm hút mồ hôi và co giãn cho phong cách năng động.'
  }
  }
];
