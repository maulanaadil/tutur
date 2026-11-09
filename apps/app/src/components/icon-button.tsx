import type { Icon } from "phosphor-react-native";
import { StyleSheet, Text, type PressableProps } from "react-native";
import { color, space, type } from "@/theme/tokens";
import { ChunkyPressable } from "./chunky-pressable";

type Tone = "primary" | "plain";

const tones: Record<Tone, { face: string; lip: string; ink: string }> = {
  primary: { face: color.primary, lip: color.primaryLip, ink: color.onPrimary },
  plain: { face: color.surface, lip: color.surfaceLip, ink: color.ink },
};

type IconButtonProps = Omit<PressableProps, "children" | "style"> & {
  icon: Icon;
  label: string;
  tone?: Tone;
  size?: number;
};

export function IconButton({ icon: IconGlyph, label, tone = "plain", size = 76, ...pressable }: IconButtonProps) {
  const { face, lip, ink } = tones[tone];
  return (
    <ChunkyPressable face={face} lip={lip} accessibilityLabel={label} style={{ width: size, height: size }} {...pressable}>
      <IconGlyph size={size * 0.4} color={ink} weight="bold" />
      <Text style={[styles.label, { color: ink }]} numberOfLines={1} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    </ChunkyPressable>
  );
}

const styles = StyleSheet.create({
  label: { ...type.label, fontSize: 13, marginTop: space.xs / 2 },
});
