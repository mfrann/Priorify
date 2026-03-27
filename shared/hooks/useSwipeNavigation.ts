import { useCallback } from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25; // 25% of screen width
const VELOCITY_THRESHOLD = 500;

interface UseSwipeNavigationProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  enabled?: boolean;
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  enabled = true,
}: UseSwipeNavigationProps) {
  const handleSwipeLeft = useCallback(() => {
    "worklet";
    if (onSwipeLeft) {
      runOnJS(onSwipeLeft)();
    }
  }, [onSwipeLeft]);

  const handleSwipeRight = useCallback(() => {
    "worklet";
    if (onSwipeRight) {
      runOnJS(onSwipeRight)();
    }
  }, [onSwipeRight]);

  const panGesture = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetX([-10, 10]) // Ignore taps, only detect horizontal swipes
    .failOffsetY([-20, 20]) // Fail if vertical movement is too large
    .onEnd((event) => {
      "worklet";
      const { translationX, velocityX } = event;

      // Check if swipe is strong enough
      const isValidSwipe =
        Math.abs(translationX) > SWIPE_THRESHOLD ||
        Math.abs(velocityX) > VELOCITY_THRESHOLD;

      if (!isValidSwipe) {
        return;
      }

      // Determine direction
      if (translationX < 0 || velocityX < -VELOCITY_THRESHOLD) {
        // Swipe left → next tab
        handleSwipeLeft();
      } else if (translationX > 0 || velocityX > VELOCITY_THRESHOLD) {
        // Swipe right → previous tab
        handleSwipeRight();
      }
    });

  return {
    swipeGesture: panGesture,
    GestureDetector,
  };
}
