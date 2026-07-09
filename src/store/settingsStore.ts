import {useState, useCallback, useEffect} from 'react';
import {SettingsState} from '../types';
import {storage} from '../utils/storage';

const DEFAULT_SETTINGS: SettingsState = {
  currency: 'USD',
  notificationsEnabled: true,
  darkMode: false,
};

export function useSettingsStore() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const stored = await storage.get<SettingsState>(storage.KEYS.SETTINGS);
      if (stored) {
        setSettings(stored);
      } else {
        await storage.set(storage.KEYS.SETTINGS, DEFAULT_SETTINGS);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(
    async (updates: Partial<SettingsState>) => {
      setSettings(prev => {
        const updated = {...prev, ...updates};
        storage.set(storage.KEYS.SETTINGS, updated);
        return updated;
      });
    },
    [],
  );

  const resetSettings = useCallback(async () => {
    setSettings(DEFAULT_SETTINGS);
    await storage.set(storage.KEYS.SETTINGS, DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    resetSettings,
  };
}
