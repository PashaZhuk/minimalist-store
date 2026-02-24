import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Добавляем эти импорты
import type { Product } from '../types/database.types';

interface CartItem extends Product {
  quantity: number;
}

interface ProductState {
  filterCategory: string;
  setFilter: (category: string) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: Product['id']) => void;
  clearCart: () => void;
  decreaseQuantity: (productId: Product['id']) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      filterCategory: 'All',
      setFilter: (category) => set({ filterCategory: category }),

      cart: [],

      addToCart: (product) => set((state) => {
        const existingItem = state.cart.find((item) => item.id === product.id);
        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ),
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== productId),
      })),

      decreaseQuantity: (productId) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'tech-store-storage', // Уникальное имя ключа в localStorage
      storage: createJSONStorage(() => localStorage), // Указываем, куда сохранять
      // Можно выбрать, что именно сохранять (например, только корзину, а не фильтры)
      partialize: (state) => ({ cart: state.cart }), 
    }
  )
);