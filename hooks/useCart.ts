
import { useState } from 'react';
import { Product, CartItem } from '../types';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, size?: string) => {
  setCart(prev => {
    const existing = prev.find(
      item => item.id === product.id && item.selectedSize === size
    );

    if (existing) {
      return prev.map(item =>
        item.id === product.id && item.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    const newItem: CartItem = {
  id: product.id,
  name: product.name,
  price: product.price ?? 0,
  imageUrl: product.imageUrl,
  quantity: 1,
  pricingType: product.pricingType,
  selectedSize: size
};

    return [...prev, newItem];
  });
};

  const removeFromCart = (id: string, size?: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((a, c) => a + c.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return { cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal };
};
