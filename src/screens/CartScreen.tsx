import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CartStackParamList} from '../types';
import {CartItemRow} from '../components/CartItem';
import {EmptyState} from '../components/EmptyState';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {useCartStore} from '../store/cartStore';
import {formatPrice} from '../utils/helpers';

type NavProp = NativeStackNavigationProp<CartStackParamList, 'CartMain'>;

export function CartScreen() {
  const navigation = useNavigation<NavProp>();
  const {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
  } = useCartStore();

  if (loading) {
    return <LoadingSpinner message="Loading cart..." />;
  }

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Clear', style: 'destructive', onPress: clearCart},
    ]);
  };

  const total = getTotalPrice();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.product.id}
        renderItem={({item}) => (
          <CartItemRow
            item={item}
            onIncrease={() => addItem(item.product, 1)}
            onDecrease={() => {
              if (item.quantity <= 1) {
                removeItem(item.product.id);
              } else {
                updateQuantity(item.product.id, item.quantity - 1);
              }
            }}
            onRemove={() => removeItem(item.product.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Your cart is empty"
            message="Browse products and add items to your cart."
          />
        }
        contentContainerStyle={styles.list}
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  clearText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
  },
  list: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2ecc71',
  },
  checkoutBtn: {
    backgroundColor: '#2ecc71',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
