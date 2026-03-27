import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFERENCES_PREFIX = "preferences:";
const NOTIFICATIONS_KEY = `${PREFERENCES_PREFIX}notifications`;

export interface Preferences {
  notificationsEnabled: boolean;
}

const DEFAULT_PREFERENCES: Preferences = {
  notificationsEnabled: true,
};

export const PreferencesService = {
  async getPreferences(): Promise<Preferences> {
    try {
      const value = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      if (value === null) {
        return DEFAULT_PREFERENCES;
      }
      return JSON.parse(value) as Preferences;
    } catch (error) {
      console.error("PreferencesService.getPreferences error:", error);
      return DEFAULT_PREFERENCES;
    }
  },

  async setNotificationsEnabled(enabled: boolean): Promise<boolean> {
    try {
      const preferences: Preferences = {
        notificationsEnabled: enabled,
      };
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error("PreferencesService.setNotificationsEnabled error:", error);
      return false;
    }
  },

  async getNotificationsEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      if (value === null) {
        return DEFAULT_PREFERENCES.notificationsEnabled;
      }
      const preferences = JSON.parse(value) as Preferences;
      return preferences.notificationsEnabled;
    } catch (error) {
      console.error("PreferencesService.getNotificationsEnabled error:", error);
      return DEFAULT_PREFERENCES.notificationsEnabled;
    }
  },
};
