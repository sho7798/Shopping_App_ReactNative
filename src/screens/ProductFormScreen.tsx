import {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {ShopStackParamList, CategoryType, ProductFormData} from '../types';
import {useProductStore} from '../store/productStore';

type RouteType = RouteProp<ShopStackParamList, 'ProductForm'>;

const CATEGORIES: CategoryType[] = [
  'electronics',
  'clothing',
  'groceries',
  'books',
  'sports',
  'other',
];

const INITIAL_FORM: ProductFormData = {
  name: '',
  price: '',
  description: '',
  image: '',
  category: 'other',
};

export function ProductFormScreen() {
  const route = useRoute<RouteType>();
  const navigation = useNavigation();
  const {getProduct, addProduct, updateProduct} = useProductStore();
  const [form, setForm] = useState<ProductFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const productId = route.params?.productId;
  const isEditing = !!productId;

  useEffect(() => {
    if (productId) {
      const product = getProduct(productId);
      if (product) {
        setForm({
          name: product.name,
          price: product.price.toString(),
          description: product.description,
          image: product.image,
          category: product.category,
        });
      }
    }
  }, [productId, getProduct]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!form.price.trim() || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    setSubmitting(true);
    try {
      if (isEditing && productId) {
        await updateProduct(productId, form);
        Alert.alert('Updated', 'Product updated successfully.');
      } else {
        await addProduct(form);
        Alert.alert('Created', 'Product created successfully.');
      }
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.title}>{isEditing ? 'Edit Product' : 'Add Product'}</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Product name"
          value={form.name}
          onChangeText={text => setForm(prev => ({...prev, name: text}))}
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={[styles.input, errors.price && styles.inputError]}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={form.price}
          onChangeText={text => setForm(prev => ({...prev, price: text}))}
        />
        {errors.price && <Text style={styles.error}>{errors.price}</Text>}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          placeholder="Product description"
          multiline
          numberOfLines={4}
          value={form.description}
          onChangeText={text => setForm(prev => ({...prev, description: text}))}
        />
        {errors.description && <Text style={styles.error}>{errors.description}</Text>}

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com/image.jpg"
          value={form.image}
          onChangeText={text => setForm(prev => ({...prev, image: text}))}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, form.category === cat && styles.categorySelected]}
              onPress={() => setForm(prev => ({...prev, category: cat}))}>
              <Text
                style={[
                  styles.categoryChipText,
                  form.category === cat && styles.categoryChipTextSelected,
                ]}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}>
          <Text style={styles.submitText}>
            {submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
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
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 20,
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
  inputError: {
    borderColor: '#e74c3c',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  error: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categorySelected: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  submitBtn: {
    backgroundColor: '#2ecc71',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
