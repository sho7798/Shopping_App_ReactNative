import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {CartItem as CartItemType} from '../types';
import {formatPrice} from '../utils/helpers';

interface Props {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItemRow({item, onIncrease, onDecrease, onRemove}: Props) {
  return (
    <View style={styles.container}>
      <Image source={{uri: item.product.image}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(item.product.price)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qty}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.total}>
            {formatPrice(item.product.price * item.quantity)}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
        <Text style={styles.removeText}>X</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  price: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  qty: {
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  total: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#2ecc71',
  },
  removeBtn: {
    padding: 8,
  },
  removeText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '700',
  },
});
