export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: CategoryType;
  createdAt: number;
  updatedAt: number;
}

export type CategoryType =
  | 'electronics'
  | 'clothing'
  | 'groceries'
  | 'books'
  | 'sports'
  | 'other';

export type CategoryFilter = CategoryType | 'all';

export interface Category {
  id: CategoryFilter;
  name: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export interface ProductFormData {
  name: string;
  price: string;
  description: string;
  image: string;
  category: CategoryType;
}

export type RootStackParamList = {
  Main: undefined;
};

export interface SettingsState {
  currency: string;
  notificationsEnabled: boolean;
  darkMode: boolean;
}

export type RootTabParamList = {
  Home: undefined;
  Shop: undefined;
  Cart: undefined;
  Settings: undefined;
};

export type ShopStackParamList = {
  ShopList: undefined;
  ProductDetail: {productId: string};
  ProductForm: {productId?: string};
};

export type CartStackParamList = {
  CartMain: undefined;
  Checkout: undefined;
};
