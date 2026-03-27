import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "hasSeenOnboarding";

export default function RootLayout() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        // FOR DEBUG: Always show onboarding
        // Remove this line for production
        await AsyncStorage.removeItem(ONBOARDING_KEY);
        
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasSeenOnboarding(value === "true");
      } catch (error) {
        console.error("Error checking onboarding:", error);
        setHasSeenOnboarding(false);
      }
    };

    checkOnboarding();
  }, []);

  if (hasSeenOnboarding === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F0C4B8" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!hasSeenOnboarding && (
        <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
      )}
      {hasSeenOnboarding && (
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
      )}
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
