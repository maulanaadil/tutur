import { StyleSheet, Text, View } from "react-native";
import { Mascot, type MascotId, type Mood } from "@/mascots";
import { color, radius, space, type } from "@/theme/tokens";

type MascotCornerProps = { mascot: MascotId; mood: Mood; bubble: string | null; size: number };

export function MascotCorner({ mascot, mood, bubble, size }: MascotCornerProps) {
  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <View style={[styles.disc, { borderRadius: size / 2 }]} />
      <Mascot id={mascot} mood={mood} size={size} />
      {bubble === null ? null : (
        <View style={styles.bubble} accessibilityLiveRegion="polite">
          <Text style={styles.bubbleText} numberOfLines={1}>
            {bubble}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", justifyContent: "center", zIndex: 2 },
  disc: { ...StyleSheet.absoluteFill, backgroundColor: color.sunSoft },
  bubble: {
    position: "absolute",
    top: "62%",
    left: "55%",
    minWidth: 150,
    backgroundColor: color.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: color.sun,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    zIndex: 10,
  },
  bubbleText: { ...type.heading, color: color.ink },
});
