import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSettingsStore} from '../store/settingsStore';
import {useCartStore} from '../store/cartStore';
import {storage} from '../utils/storage';
import {LoadingSpinner} from '../components/LoadingSpinner';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'];

export function SettingsScreen() {
  const {settings, loading, updateSettings, resetSettings} = useSettingsStore();
  const {clearCart} = useCartStore();

  if (loading) {
    return <LoadingSpinner message="Loading settings..." />;
  }

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all products, cart items, and reset settings. This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAll();
            await clearCart();
            await resetSettings();
            Alert.alert('Done', 'All local data has been cleared.');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
    <ScrollView style={styles.scrollView}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Notifications</Text>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={value =>
              updateSettings({notificationsEnabled: value})
            }
            trackColor={{false: '#ddd', true: '#2ecc71'}}
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Currency</Text>
        <View style={styles.currencyRow}>
          {CURRENCIES.map(c => (
            <TouchableOpacity
              key={c}
              style={[
                styles.currencyChip,
                settings.currency === c && styles.currencySelected,
              ]}
              onPress={() => updateSettings({currency: c})}>
              <Text
                style={[
                  styles.currencyText,
                  settings.currency === c && styles.currencyTextSelected,
                ]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity style={styles.dangerBtn} onPress={handleClearAllData}>
          <Text style={styles.dangerBtnText}>Clear All Local Data</Text>
        </TouchableOpacity>
        <Text style={styles.dangerHint}>
          Removes all products, cart items, and resets settings.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Shopping App v1.0.0</Text>
        <Text style={styles.footerSubtext}>React Native + TypeScript</Text>
      </View>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  rowLabel: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  currencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  currencyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  currencySelected: {
    backgroundColor: '#2ecc71',
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  currencyTextSelected: {
    color: '#fff',
  },
  dangerBtn: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  dangerBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  dangerHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#bbb',
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 2,
  },
});
