/**
 * Thermal Monitor Example App
 * Tests react-native-nitro-thermal
 */

import React, { useCallback, useState } from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentThermalState, useThermalState, type ThermalState } from 'react-native-nitro-thermal';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={[styles.container, isDarkMode && styles.dark]}>
        <ThermalDemo />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function ThermalDemo() {
  const [currentState, setCurrentState] = useState<ThermalState | null>(null);
  const [lastCallback, setLastCallback] = useState<string | null>(null);

  const thermalState = useThermalState({
    onNominal: () => setLastCallback('onNominal'),
    onFair: () => setLastCallback('onFair'),
    onSerious: () => setLastCallback('onSerious'),
    onCritical: () => setLastCallback('onCritical'),
    onChange: (current, previous) => {
      console.log(`Thermal: ${previous} → ${current}`);
    },
  });

  const pollThermalState = useCallback(() => {
    const state = getCurrentThermalState();
    setCurrentState(state);
  }, []);

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Thermal Monitor</Text>
      <Text style={styles.subtitle}>react-native-nitro-thermal</Text>

      <View style={styles.card} testID="poll-card">
        <Text style={styles.label}>Current Thermal State (polled):</Text>
        <Text style={styles.value} testID="poll-value">
          {currentState ?? 'Press button to check'}
        </Text>
        <Button title="Get Thermal State" onPress={pollThermalState} testID="poll-button" />
      </View>

      <View style={styles.card} testID="hook-card">
        <Text style={styles.label}>Thermal State (useThermalState):</Text>
        <Text style={styles.value} testID="hook-value">
          {thermalState}
        </Text>
        {lastCallback && (
          <Text style={styles.label} testID="hook-callback">
            Last callback: {lastCallback}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dark: {
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#555',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: '#555',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
});

export default App;
