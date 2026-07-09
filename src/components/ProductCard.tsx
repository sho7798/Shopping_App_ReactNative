import {TouchableOpacity, Text, Image, StyleSheet, View} from 'react-native';
import {Product} from '../types';
import {formatPrice} from '../utils/helpers';

interface Props {
  product: Product;
  onPress: (product: Product) => void;
}

export function ProductCard({product, onPress}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
      <Image source={{uri: product.image}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2ecc71',
    marginTop: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
});
