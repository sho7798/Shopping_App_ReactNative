import {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootTabParamList, CategoryType, Product} from '../types';
import {ProductCard} from '../components/ProductCard';
import {CategoryCard} from '../components/CategoryCard';
import {EmptyState} from '../components/EmptyState';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {useProductStore} from '../store/productStore';

const CATEGORIES = [
  {id: 'all' as const, name: 'All', icon: ''},
  {id: 'electronics' as const, name: 'Electronics', icon: ''},
  {id: 'clothing' as const, name: 'Clothing', icon: ''},
  {id: 'groceries' as const, name: 'Groceries', icon: ''},
  {id: 'books' as const, name: 'Books', icon: ''},
  {id: 'sports' as const, name: 'Sports', icon: ''},
  {id: 'other' as const, name: 'Other', icon: ''},
];

type NavProp = BottomTabNavigationProp<RootTabParamList, 'Shop'>;

export function ShopScreen() {
  const navigation = useNavigation<NavProp>();
  const {products, loading, getProductsByCategory, searchProducts} =
    useProductStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>(
    'all',
  );

  const displayedProducts = useMemo(() => {
    const categoryFiltered = getProductsByCategory(selectedCategory);
    if (!search.trim()) {
      return categoryFiltered;
    }
    return categoryFiltered.filter(
      p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [selectedCategory, search, getProductsByCategory]);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('Shop', {
        screen: 'ProductDetail',
        params: {productId: product.id},
      } as any);
    },
    [navigation],
  );

  const handleAddPress = useCallback(() => {
    navigation.navigate('Shop', {
      screen: 'ProductForm',
      params: {},
    } as any);
  }, [navigation]);

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddPress}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <CategoryCard
            category={item}
            selected={selectedCategory === item.id}
            onPress={() => setSelectedCategory(item.id)}
          />
        )}
        contentContainerStyle={styles.categoriesList}
      />

      <FlatList
        data={displayedProducts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ProductCard product={item} onPress={handleProductPress} />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No products found"
            message="Try adjusting your search or add a new product."
          />
        }
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  addBtn: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  searchInput: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  productList: {
    paddingBottom: 20,
  },
});
