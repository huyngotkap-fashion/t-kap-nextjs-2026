
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Slim-Fit Piqué Polo Shirt',
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
    description: 'A signature staple crafted in organic piqué cotton for breathable comfort and a refined silhouette.'
  },
  {
    id: 'p2',
    name: 'Performance Tech Polo',
    brand: 'BOSS',
    category: 'Men',
    subCategory: 'Sports',
    price: 145,
    originalPrice: 195,
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800',
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800' }],
    description: 'Engineered with moisture-wicking fabric and stretch for the active professional.'
  }
];
