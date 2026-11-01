import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, OrderFulfilment } from '../types/index.ts';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, instructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  fulfilment: OrderFulfilment;
  setFulfilment: (method: OrderFulfilment) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  lastAddedItem: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zaytoon_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [fulfilment, setFulfilment] = useState<OrderFulfilment>('pickup');
  const [selectedLocation, setSelectedLocation] = useState('Ghazi Ghat Toll Plaza (N-70 Highway)');
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('zaytoon_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  const addToCart = (item: MenuItem, quantity = 1, instructions = '') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.item.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + quantity,
          specialInstructions: instructions || existing.specialInstructions,
        };
        return updated;
      }
      return [...prev, { item, quantity, specialInstructions: instructions }];
    });

    // Trigger visual feedback and open slide-out drawer
    setLastAddedItem(item.name);
    setIsCartOpen(true);
    setTimeout(() => {
      setLastAddedItem(null);
    }, 3000);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = cart.reduce((acc, ci) => acc + ci.quantity, 0);
  const subtotal = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
        fulfilment,
        setFulfilment,
        selectedLocation,
        setSelectedLocation,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
