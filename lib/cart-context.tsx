"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  slug: string;
  type: "analysis" | "complex";
  name: string;
  price: number;
  duration: string;
  selectedLabId?: string;
  selectedLabName?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleItem: (item: CartItem) => void;
  isInCart: (id: string) => boolean;
  selectLab: (itemId: string, labId: string, labName: string) => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Загружаем из localStorage после монтирования
  useEffect(() => {
    try {
      const saved = localStorage.getItem("labfinder_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
    setIsHydrated(true);
  }, []);

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("labfinder_cart", JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      if (prev.find((x) => x.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleItem = (item: CartItem) => {
    setItems((prev) => {
      if (prev.find((x) => x.id === item.id)) {
        return prev.filter((x) => x.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const isInCart = (id: string) => items.some((x) => x.id === id);

  const selectLab = (itemId: string, labId: string, labName: string) => {
    setItems((prev) => prev.map((item) => item.id === itemId
      ? { ...item, selectedLabId: labId, selectedLabName: labName }
      : item));
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const count = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        toggleItem,
        isInCart,
        selectLab,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
