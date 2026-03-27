import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

const PARTICLE_COUNT = 12;
const PARTICLE_COLORS = [
  "#FFD700", // Gold
  "#FFA500", // Orange
  "#FF6347", // Tomato
  "#98FB98", // Pale green
  "#87CEEB", // Sky blue
  "#DDA0DD", // Plum
];

interface Particle {
  id: number;
  angle: number;
  color: string;
  delay: number;
}

interface CompletionParticlesProps {
  isActive: boolean;
  size: number;
  onComplete?: () => void;
}

function ParticleView({ particle, containerSize }: { particle: Particle; containerSize: number }) {
  const progress = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    progress.value = withDelay(
      particle.delay,
      withSpring(1, {
        damping: 8,
        stiffness: 150,
      }),
    );
    opacity.value = withDelay(
      particle.delay + 200,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const distance = containerSize * 0.8;
    const x = Math.cos(particle.angle) * distance * progress.value;
    const y = Math.sin(particle.angle) * distance * progress.value;
    const scale = 1 - progress.value * 0.5;
    const particleSize = 8 * (1 - progress.value * 0.5);

    return {
      transform: [{ translateX: x }, { translateY: y }, { scale }],
      opacity: opacity.value,
      width: particleSize,
      height: particleSize,
      borderRadius: particleSize / 2,
      backgroundColor: particle.color,
    };
  });

  return <Animated.View style={[styles.particle, animatedStyle]} />;
}

export function CompletionParticles({ isActive, size, onComplete }: CompletionParticlesProps) {
  const containerOpacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      containerOpacity.value = withTiming(1, { duration: 50 });
      // Reset after animation completes
      const timeout = setTimeout(() => {
        containerOpacity.value = withTiming(0, { duration: 100 });
        if (onComplete) {
          setTimeout(onComplete, 200);
        }
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  if (!isActive) return null;

  const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    angle: (360 / PARTICLE_COUNT) * i * (Math.PI / 180),
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    delay: i * 20,
  }));

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, containerStyle]}>
      {particles.map((particle) => (
        <ParticleView
          key={particle.id}
          particle={particle}
          containerSize={size}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  particle: {
    position: "absolute",
  },
});
