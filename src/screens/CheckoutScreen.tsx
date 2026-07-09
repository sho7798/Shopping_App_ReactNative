import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useCartStore} from '../store/cartStore';
import {formatPrice} from '../utils/helpers';

export function CheckoutScreen() {
  const navigation = useNavigation();
  const {items, getTotalPrice, clearCart} = useCartStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const total = getTotalPrice();

  const handlePlaceOrder = () => {
    if (!name.trim() || !email.trim() || !address.trim()) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(async () => {
      await clearCart();
      setSubmitting(false);
      Alert.alert('Order Placed', 'Thank you for your purchase!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Order Summary</Text>

        {items.map(item => (
          <View key={item.product.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemTotal}>
              {formatPrice(item.product.price * item.quantity)}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Shipping Details</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="john@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="123 Main St, City"
          multiline
          numberOfLines={3}
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity
          style={[styles.placeOrderBtn, submitting && styles.disabled]}
          onPress={handlePlaceOrder}
          disabled={submitting}>
          <Text style={styles.placeOrderText}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  itemQty: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2ecc71',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2ecc71',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  placeOrderBtn: {
    backgroundColor: '#2ecc71',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
  },
  disabled: {
    opacity: 0.6,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
