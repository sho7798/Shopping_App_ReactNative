import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CART: '@shopping_app_cart',
  SETTINGS: '@shopping_app_settings',
  PRODUCTS: '@shopping_app_products',
};

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // silently fail
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // silently fail
    }
  },

  async clearAll(): Promise<void> {
    try {
      const keys = Object.values(KEYS);
      await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));
    } catch {
      // silently fail
    }
  },

  KEYS,
};
