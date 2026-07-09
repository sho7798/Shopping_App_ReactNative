import {useState, useCallback, useEffect} from 'react';
import {Product, ProductFormData, CategoryType} from '../types';
import {storage} from '../utils/storage';
import {generateId} from '../utils/helpers';
import initialProducts from '../data/products.json';

const PRODUCTS_KEY = storage.KEYS.PRODUCTS;

function getInitialProducts(): Product[] {
  return (initialProducts as Product[]).map(p => ({
    ...p,
    price: Number(p.price),
    createdAt: Number(p.createdAt),
    updatedAt: Number(p.updatedAt),
  }));
}

export function useProductStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await storage.get<Product[]>(PRODUCTS_KEY);
      if (stored && stored.length > 0) {
        setProducts(stored);
      } else {
        const initial = getInitialProducts();
        setProducts(initial);
        await storage.set(PRODUCTS_KEY, initial);
      }
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback(async (updated: Product[]) => {
    await storage.set(PRODUCTS_KEY, updated);
  }, []);

  const addProduct = useCallback(
    async (data: ProductFormData) => {
      const now = Date.now();
      const product: Product = {
        id: generateId(),
        name: data.name,
        price: parseFloat(data.price),
        description: data.description,
        image: data.image,
        category: data.category,
        createdAt: now,
        updatedAt: now,
      };
      const updated = [product, ...products];
      setProducts(updated);
      await persist(updated);
      return product;
    },
    [products, persist],
  );

  const updateProduct = useCallback(
    async (id: string, data: ProductFormData) => {
      const updated = products.map(p =>
        p.id === id
          ? {
              ...p,
              name: data.name,
              price: parseFloat(data.price),
              description: data.description,
              image: data.image,
              category: data.category,
              updatedAt: Date.now(),
            }
          : p,
      );
      setProducts(updated);
      await persist(updated);
    },
    [products, persist],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      await persist(updated);
    },
    [products, persist],
  );

  const getProduct = useCallback(
    (id: string) => products.find(p => p.id === id) || null,
    [products],
  );

  const getProductsByCategory = useCallback(
    (category: CategoryType | 'all') =>
      category === 'all' ? products : products.filter(p => p.category === category),
    [products],
  );

  const searchProducts = useCallback(
    (query: string) =>
      products.filter(
        p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()),
      ),
    [products],
  );

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductsByCategory,
    searchProducts,
    refresh: loadProducts,
  };
}
