import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ShopStackParamList, Product} from '../types';
import {formatPrice} from '../utils/helpers';
import {useProductStore} from '../store/productStore';
import {useCartStore} from '../store/cartStore';

type RouteType = RouteProp<ShopStackParamList, 'ProductDetail'>;
type NavType = NativeStackNavigationProp<ShopStackParamList, 'ProductDetail'>;

export function ProductDetailScreen() {
  const route = useRoute<RouteType>();
  const navigation = useNavigation<NavType>();
  const {getProduct, deleteProduct} = useProductStore();
  const {addItem} = useCartStore();

  const product = getProduct(route.params.productId);

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate('ProductForm', {productId: product.id});
  };

  const handleDelete = () => {
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(product.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleAddToCart = () => {
    addItem(product);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{uri: product.image}} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
            <Text style={styles.editText}>Edit Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2ecc71',
    marginTop: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  categoryText: {
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
    marginTop: 16,
  },
  addToCartBtn: {
    backgroundColor: '#2ecc71',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  editBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2ecc71',
    alignItems: 'center',
  },
  editText: {
    color: '#2ecc71',
    fontSize: 15,
    fontWeight: '600',
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e74c3c',
    alignItems: 'center',
  },
  deleteText: {
    color: '#e74c3c',
    fontSize: 15,
    fontWeight: '600',
  },
});
