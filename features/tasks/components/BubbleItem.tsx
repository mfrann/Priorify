import type { Task } from "@/features/tasks/types/task";
import {
  BUBBLE_SIZE,
  CATEGORY_COLORS,
  NO_CATEGORY_COLOR,
} from "@/shared/constants/theme";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface BubbleItemProps {
  task: Task;
  onPress: () => void;
  scale?: number;
  index?: number;
  offsetX?: number;
  offsetY?: number;
  bubbleId?: string;
}

export function BubbleItem({
  task,
  index = 0,
  onPress,
  scale: scaleProp = 1,
  offsetX = 0,
  offsetY = 0,
  bubbleId,
}: BubbleItemProps) {
  const size = BUBBLE_SIZE[task.priority] * scaleProp;
  const backgroundColor = task.category
    ? CATEGORY_COLORS[task.category]
    : NO_CATEGORY_COLOR;
  const fontSize = task.priority >= 3 ? 14 : 12;

  // Helper para hacer el color más oscuro para el borde
  const adjustColor = (hex: string, amount: number): string => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };
  const borderColor = adjustColor(backgroundColor, -15);

  const scaleAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);
  const floatAnim = useSharedValue(0);
  const pressAnim = useSharedValue(1);

  useEffect(() => {
    const delay = index * 50;
    const floatDuration = 2000 + index * 200;

    scaleAnim.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 100 }),
    );
    opacityAnim.value = withDelay(delay, withTiming(1, { duration: 300 }));

    floatAnim.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: floatDuration / 2,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handlePressIn = () => {
    pressAnim.value = withSpring(0.9, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    pressAnim.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const floatOffset = Math.sin(floatAnim.value * Math.PI) * 5;
    const radius = size / 2;

    return {
      transform: [
        // 1. Mover centro al origen (0,0)
        { translateX: offsetX - radius },
        { translateY: offsetY - radius },
        // 2. Scale desde el centro
        { scale: scaleAnim.value * pressAnim.value },
        // 3. Volver a posición + float offset
        { translateX: radius },
        { translateY: radius + floatOffset },
      ],
      // Sombra estática sutil
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      opacity: opacityAnim.value * (task.completed ? 0.5 : 1),
    };
  });

  return (
    <Animated.View
      key={bubbleId}
      style={[
        styles.container,
        { width: size, height: size },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={8}
        style={[
          styles.bubble,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
            opacity: 1,
            borderColor,
            borderWidth: 0.5,
          },
        ]}
      >
        <Text style={[styles.text, { fontSize }]} numberOfLines={2}>
          {task.title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  bubble: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    shadowColor: "#666",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
});
