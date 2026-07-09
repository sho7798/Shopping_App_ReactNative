import {createContext, useContext, useState, useCallback, useEffect, ReactNode} from 'react';
import {CartItem, Product} from '../types';
import {storage} from '../utils/storage';

interface CartContextValue {
  items: CartItem[];
  loading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({children}: {children: ReactNode}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = useCallback(async () => {
    try {
      const stored = await storage.get<CartItem[]>(storage.KEYS.CART);
      if (stored) {
        setItems(stored);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback(async (updated: CartItem[]) => {
    await storage.set(storage.KEYS.CART, updated);
  }, []);

  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      setItems(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        let updated: CartItem[];
        if (existing) {
          updated = prev.map(item =>
            item.product.id === product.id
              ? {...item, quantity: item.quantity + quantity}
              : item,
          );
        } else {
          updated = [...prev, {product, quantity}];
        }
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      setItems(prev => {
        const updated = prev.filter(item => item.product.id !== productId);
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        return;
      }
      setItems(prev => {
        const updated = prev.map(item =>
          item.product.id === productId ? {...item, quantity} : item,
        );
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    await storage.remove(storage.KEYS.CART);
  }, []);

  const getItemCount = useCallback(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const getTotalPrice = useCallback(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotalPrice,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartStore(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartStore must be used within a CartProvider');
  }
  return ctx;
}
