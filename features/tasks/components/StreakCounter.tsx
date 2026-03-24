import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CATEGORY_COLORS } from "@/shared/constants/theme";

interface StreakCounterProps {
  currentStreak: number;
}

export function StreakCounter({ currentStreak }: StreakCounterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={styles.count}>{currentStreak}</Text>
      <Text style={styles.label}>day streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  fire: {
    fontSize: 20,
  },
  count: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
});
