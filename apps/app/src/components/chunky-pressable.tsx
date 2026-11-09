import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { color, PRESS_DEPTH, radius } from "@/theme/tokens";

type ChunkyPressableProps = Omit<PressableProps, "children" | "style"> & {
  face: string;
  lip: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  faceStyle?: StyleProp<ViewStyle>;
  selected?: boolean;
};

export function ChunkyPressable({ face, lip, children, style, faceStyle, selected = false, ...pressable }: ChunkyPressableProps) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: pressable.disabled ?? false }}
      {...pressable}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.root, { backgroundColor: lip }, focused && styles.focused, pressable.disabled && styles.disabled, style]}
    >
      {({ pressed }) => (
        <View style={[styles.face, { backgroundColor: face, transform: [{ translateY: pressed || selected ? PRESS_DEPTH : 0 }] }, faceStyle]}>
          {children}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.lg,
    paddingBottom: PRESS_DEPTH,
  },
  face: {
    flex: 1,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.45 },
  focused: {
    outlineColor: color.focus,
    outlineWidth: 3,
    outlineOffset: 2,
  },
});
