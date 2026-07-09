import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Category} from '../types';

interface Props {
  category: Category;
  selected: boolean;
  onPress: () => void;
}

export function CategoryCard({category, selected, onPress}: Props) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.selected]}
      onPress={onPress}>
      <Text style={[styles.icon]}>{category.icon}</Text>
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selected: {
    backgroundColor: '#2ecc71',
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedLabel: {
    color: '#fff',
  },
});
