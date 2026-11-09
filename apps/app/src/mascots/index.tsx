import { useEffect, type ComponentType } from "react";
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { useMotionAllowed } from "@/settings/settings";
import { motion } from "@/theme/tokens";
import type { MascotId } from "./ids";
import { Jali } from "./jali";
import { Komo } from "./komo";
import { Oki } from "./oki";
import type { Mood } from "./parts";
import { Tari } from "./tari";

export { MASCOT_IDS, type MascotId } from "./ids";
export type { Mood } from "./parts";

type MascotInfo = {
  readonly name: string;
  readonly animal: string;
  readonly intro: string;
  readonly Art: ComponentType<{ mood: Mood }>;
};

export const mascots = {
  tari: { name: "Tari", animal: "tarsius", intro: "Telinganya besar. Tari selalu mendengarkan.", Art: Tari },
  jali: { name: "Jali", animal: "jalak Bali", intro: "Jali suka bersorak kalau kamu berhasil.", Art: Jali },
  oki: { name: "Oki", animal: "orangutan", intro: "Oki tenang dan sabar, teman saat sedih.", Art: Oki },
  komo: { name: "Komo", animal: "komodo kecil", intro: "Komo selalu siap diajak main.", Art: Komo },
} as const satisfies Record<MascotId, MascotInfo>;

type MascotProps = { id: MascotId; mood: Mood; size: number };

export function Mascot({ id, mood, size }: MascotProps) {
  const { Art, name } = mascots[id];
  const motionAllowed = useMotionAllowed();
  const lift = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(lift);
    lift.value = 0;
    if (!motionAllowed) return;
    if (mood === "talking") {
      lift.value = withRepeat(withSequence(withTiming(-3, { duration: 180 }), withTiming(0, { duration: 180 })), -1);
    } else if (mood === "cheer") {
      lift.value = withSequence(withTiming(-10, { duration: 140 }), withSpring(0, motion.spring));
    }
  }, [lift, mood, motionAllowed]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: lift.value }] }));

  return (
    <Animated.View style={[{ width: size, height: size }, style]} accessibilityRole="image" accessibilityLabel={name}>
      <Art mood={mood} />
    </Animated.View>
  );
}
