import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';

interface Props {
  message?: string;
}

export function LoadingSpinner({message}: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2ecc71" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
});
