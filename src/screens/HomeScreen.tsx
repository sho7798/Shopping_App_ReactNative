import {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootTabParamList, Category, CategoryType} from '../types';
import {ProductCard} from '../components/ProductCard';
import {CategoryCard} from '../components/CategoryCard';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {useProductStore} from '../store/productStore';

const CATEGORIES: Category[] = [
  {id: 'all', name: 'All', icon: ''},
  {id: 'electronics', name: 'Electronics', icon: ''},
  {id: 'clothing', name: 'Clothing', icon: ''},
  {id: 'groceries', name: 'Groceries', icon: ''},
  {id: 'books', name: 'Books', icon: ''},
  {id: 'sports', name: 'Sports', icon: ''},
  {id: 'other', name: 'Other', icon: ''},
];

const CATEGORY_ICONS: Record<CategoryType | 'all', string> = {
  all: '',
  electronics: '',
  clothing: '',
  groceries: '',
  books: '',
  sports: '',
  other: '',
};

type NavProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const {products, loading, getProductsByCategory, searchProducts} =
    useProductStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>(
    'all',
  );

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  const filtered = getProductsByCategory(selectedCategory);
  const featured = products.slice(0, 3);

  return (
    <SafeAreaView edges={['top','bottom']} style={styles.safeArea}>
    <ScrollView style={styles.scrollView}>
      <Text style={styles.greeting}>Welcome to Shop</Text>
      <Text style={styles.subtitle}>Discover amazing products</Text>

      <Text style={styles.sectionTitle}>Featured</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {featured.map(product => (
          <TouchableOpacity
            key={product.id}
            style={styles.featuredCard}
            onPress={() =>
              navigation.navigate('Shop', {
                screen: 'ProductDetail',
                params: {productId: product.id},
              } as any)
            }>
            <Text style={styles.featuredName}>{product.name}</Text>
            <Text style={styles.featuredPrice}>${product.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesRow}>
        {CATEGORIES.map(cat => (
          <CategoryCard
            key={cat.id}
            category={cat}
            selected={selectedCategory === cat.id}
            onPress={() => setSelectedCategory(cat.id)}
          />
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <Text style={styles.emptyText}>No products in this category.</Text>
      ) : (
        <View style={styles.productList}>
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={p =>
                navigation.navigate('Shop', {
                  screen: 'ProductDetail',
                  params: {productId: p.id},
                } as any)
              }
            />
          ))}
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginTop: 20,
    marginHorizontal: 16,
  },
  subtitle: {
    fontSize: 15,
    color: '#999',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  featuredCard: {
    backgroundColor: '#2ecc71',
    borderRadius: 12,
    padding: 20,
    marginLeft: 16,
    marginRight: 8,
    width: 200,
    height: 120,
    justifyContent: 'flex-end',
  },
  featuredName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  featuredPrice: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  categoriesRow: {
    marginBottom: 8,
    paddingLeft: 16,
  },
  productList: {
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 15,
  },
});
