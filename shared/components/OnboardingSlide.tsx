import { StyleSheet, View, Text, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  useSharedValue,
  withDelay,
} from "react-native-reanimated";
import { Hand } from "lucide-react-native";
import { useEffect } from "react";

interface OnboardingSlideProps {
  title: string;
  subtitle: string;
  variant: "intro" | "priority" | "complete";
  isActive?: boolean;
}

// Speech bubble component
function SpeechBubble({ message }: { message: string }) {
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 500 });
  }, [fadeAnim]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <Animated.View style={[styles.speechBubble, animatedStyle]}>
      <Text style={styles.speechText}>{message}</Text>
      <View style={styles.speechArrow} />
    </Animated.View>
  );
}

// Single-eyed alien mascot (marcianito estilo Claude)
function Mascot({ emotion, message }: { emotion: "excited" | "explaining" | "cool"; message?: string }) {
  const bounce = useSharedValue(0);
  const eyePulse = useSharedValue(1);
  const antennaWave = useSharedValue(0);
  const mouthOpen = useSharedValue(0);

  useEffect(() => {
    // Bounce animation
    bounce.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Eye pulse animation
    eyePulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Antenna wave
    antennaWave.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(-8, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Mouth talking animation
    mouthOpen.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(0, { duration: 100 }),
        withTiming(1, { duration: 150 }),
        withTiming(0, { duration: 100 }),
        withTiming(1, { duration: 150 }),
        withDelay(500, withTiming(0, { duration: 300 }))
      ),
      -1,
      true
    );
  }, [bounce, eyePulse, antennaWave, mouthOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounce.value },
    ],
  }));

  const eyeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: eyePulse.value }],
  }));

  const antennaStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${antennaWave.value}deg` }],
  }));

  const mouthStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: 0.5 + mouthOpen.value * 0.5 }],
  }));

  const getMascotColors = () => {
    switch (emotion) {
      case "excited":
        return { body: "#DBEAFE", accent: "#3B82F6" }; // Blue
      case "explaining":
        return { body: "#DBEAFE", accent: "#3B82F6" }; // Blue
      case "cool":
        return { body: "#DBEAFE", accent: "#3B82F6" }; // Blue
    }
  };

  const { body, accent } = getMascotColors();

  return (
    <View style={styles.mascotWithSpeech}>
      <View style={styles.mascotContainer}>
        <Animated.View style={[styles.mascotBody, { backgroundColor: body }, animatedStyle]}>
          {/* Antenna */}
          <Animated.View style={[styles.antenna, antennaStyle]}>
            <View style={[styles.antennaBall, { backgroundColor: accent }]} />
          </Animated.View>

          {/* Single big eye */}
          <View style={styles.eyeContainer}>
            <Animated.View style={[styles.eye, { backgroundColor: "#FFFFFF" }, eyeStyle]}>
              <View style={[styles.pupil, { backgroundColor: accent }]}>
                <View style={styles.pupilHighlight} />
              </View>
            </Animated.View>
          </View>

          {/* Animated mouth */}
          <View style={styles.mouthContainer}>
            <Animated.View style={[styles.mouth, { borderBottomColor: accent }, mouthStyle]} />
          </View>
        </Animated.View>
      </View>
      {message && <SpeechBubble message={message} />}
    </View>
  );
}

// Golden Angle Spiral (137.5°) - same pattern as sunflowers and galaxies
const GOLDEN_ANGLE = 137.5; // degrees
const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SpiralBubble {
  size: number;
  color: string;
  x: number;
  y: number;
}

function calculateSpiralPositions(count: number): SpiralBubble[] {
  const bubbles: SpiralBubble[] = [];
  const colors = ["#B5D8EB", "#D4C4E8", "#F0C4B8", "#93C5FD", "#6EE7B7", "#FDE68A"];
  const sizes = [35, 45, 55, 40, 48, 60, 32, 50]; // Larger sizes

  for (let n = 0; n < count; n++) {
    // Golden angle spiral formula
    const angle = n * GOLDEN_ANGLE;
    const radius = 25 * Math.sqrt(n + 1); // Slightly larger radius
    const radians = (angle * Math.PI) / 180;

    const x = Math.cos(radians) * radius;
    const y = Math.sin(radians) * radius;

    bubbles.push({
      size: sizes[n % sizes.length],
      color: colors[n % colors.length],
      x,
      y,
    });
  }

  return bubbles;
}

// Floating decorative bubble with golden spiral position
function FloatingBubble({
  bubble,
  delay,
  duration,
}: {
  bubble: SpiralBubble;
  delay: number;
  duration: number;
}) {
  const floatOffset = useSharedValue(0);

  useEffect(() => {
    floatOffset.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-6, {
            duration: duration,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(6, {
            duration: duration,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      ),
    );
  }, [delay, duration, floatOffset]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: bubble.x },
        { translateY: bubble.y + floatOffset.value },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: bubble.size,
          height: bubble.size,
          borderRadius: bubble.size / 2,
          backgroundColor: bubble.color,
        },
        animatedStyle,
      ]}
    />
  );
}

// Intro visual using golden angle spiral
function IntroVisual() {
  const bubbles = calculateSpiralPositions(8);

  return (
    <View style={styles.spiralContainer}>
      {bubbles.map((bubble, index) => (
        <FloatingBubble
          key={index}
          bubble={bubble}
          delay={index * 100}
          duration={1800 + index * 150}
        />
      ))}
    </View>
  );
}

// Three bubbles for priority visualization
function PriorityBubbles() {
  const bubbles = [
    { size: 50, color: "#B5D8EB", delay: 0 }, // Low - small
    { size: 90, color: "#D4C4E8", delay: 200 }, // Medium - medium
    { size: 130, color: "#F0C4B8", delay: 400 }, // High - large
  ];

  return (
    <View style={styles.priorityContainer}>
      {bubbles.map((bubble, index) => (
        <View key={index} style={styles.priorityBubbleWrapper}>
          <AnimatedBubble
            size={bubble.size}
            color={bubble.color}
            delay={bubble.delay}
          />
        </View>
      ))}
    </View>
  );
}

// Animated bubble for priority visualization
function AnimatedBubble({
  size,
  color,
  delay,
}: {
  size: number;
  color: string;
  delay: number;
}) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 500 }));
  }, [delay, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.priorityBubble,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

// Double tap gesture visualization
function DoubleTapVisual() {
  const tap1Scale = useSharedValue(1);
  const tap2Scale = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      tap1Scale.value = withSequence(
        withTiming(0.9, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      tap2Scale.value = withDelay(
        150,
        withSequence(
          withTiming(0.9, { duration: 100 }),
          withTiming(1, { duration: 100 })
        )
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [tap1Scale, tap2Scale]);

  const tap1Style = useAnimatedStyle(() => ({
    transform: [{ scale: tap1Scale.value }],
  }));

  const tap2Style = useAnimatedStyle(() => ({
    transform: [{ scale: tap2Scale.value }],
  }));

  return (
    <View style={styles.doubleTapContainer}>
      <Animated.View
        style={[
          styles.tapBubble,
          {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "#F0C4B8",
          },
          tap1Style,
        ]}
      >
        <Text style={styles.checkmark}>✓</Text>
      </Animated.View>
      <View style={styles.fingersContainer}>
        <Animated.View style={[styles.fingerIcon, tap1Style]}>
          <Hand size={32} color="#333" />
        </Animated.View>
        <Animated.View style={[styles.fingerIcon, tap2Style]}>
          <Hand size={32} color="#333" />
        </Animated.View>
      </View>
    </View>
  );
}

export function OnboardingSlide({
  title,
  subtitle,
  variant,
  isActive = true,
}: OnboardingSlideProps) {
  const getMascotEmotion = () => {
    switch (variant) {
      case "intro":
        return "excited";
      case "priority":
        return "explaining";
      case "complete":
        return "cool";
    }
  };

  const getMascotMessage = () => {
    switch (variant) {
      case "intro":
        return "Hi! I'm Bouncy";
      case "priority":
        return "Check this out!";
      case "complete":
        return "Easy, right?";
    }
  };

  return (
    <View style={styles.container}>
      <Mascot emotion={getMascotEmotion()} message={getMascotMessage()} />
      <View style={styles.visualContainer}>
        {variant === "intro" && <IntroVisual />}
        {variant === "priority" && <PriorityBubbles />}
        {variant === "complete" && <DoubleTapVisual />}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  mascotContainer: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  mascotWithSpeech: {
    position: "absolute",
    top: 30,
    left: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  speechBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginLeft: 65,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: 180,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  speechText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  speechArrow: {
    position: "absolute",
    left: -10,
    top: 10,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftWidth: 0,
    borderLeftColor: "#FFFFFF",
    transform: [{ rotate: "180deg" }],
  },
  mascotBody: {
    width: 60,
    height: 70,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  antenna: {
    position: "absolute",
    top: -15,
    width: 4,
    height: 18,
    backgroundColor: "#9CA3AF",
    borderRadius: 2,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  antennaBall: {
    position: "absolute",
    top: -6,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  eyeContainer: {
    marginTop: 8,
  },
  eye: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  pupil: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  pupilHighlight: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#FFFFFF",
  },
  mouthContainer: {
    marginTop: 8,
  },
  mouth: {
    width: 28,
    height: 14,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  visualContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 48,
  },
  spiralContainer: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    position: "absolute",
    opacity: 0.85,
  },
  priorityContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 16,
  },
  priorityBubbleWrapper: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  priorityBubble: {
    opacity: 0.9,
  },
  doubleTapContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  tapBubble: {
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
  },
  checkmark: {
    fontSize: 48,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  fingersContainer: {
    flexDirection: "row",
    gap: 30,
    marginTop: 20,
  },
  fingerIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 10,
  },
});
