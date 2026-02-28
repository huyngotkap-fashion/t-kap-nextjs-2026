
import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';

export const useWishlist = (products: Product[]) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('tkap-wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist from storage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tkap-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const wishlistProducts = useMemo(() => {
    return products.filter(p => wishlist.includes(p.id));
  }, [products, wishlist]);

  return { wishlist, toggleWishlist, wishlistProducts };
};
