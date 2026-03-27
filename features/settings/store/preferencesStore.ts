import { create } from "zustand";
import { PreferencesService } from "@/features/settings/services/preferences";
import { NotificationService } from "@/shared/services/notificationService";

interface PreferencesStore {
  notificationsEnabled: boolean;
  isLoading: boolean;

  initialize: () => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  notificationsEnabled: true,
  isLoading: true,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const enabled = await PreferencesService.getNotificationsEnabled();
      set({ notificationsEnabled: enabled, isLoading: false });
    } catch (error) {
      console.error("PreferencesStore.initialize error:", error);
      set({ isLoading: false });
    }
  },

  setNotificationsEnabled: async (enabled: boolean) => {
    // Request notification permissions when enabling
    if (enabled) {
      const hasPermission = await NotificationService.requestPermissions();
      if (!hasPermission) {
        console.log("User denied notification permissions");
        // Still save the preference, but notifications won't work
      }
    }

    // Optimistic update
    set({ notificationsEnabled: enabled });

    const success = await PreferencesService.setNotificationsEnabled(enabled);
    if (!success) {
      // Rollback on failure
      set({ notificationsEnabled: !enabled });
      console.error("Failed to persist notifications preference");
    }
  },
}));
