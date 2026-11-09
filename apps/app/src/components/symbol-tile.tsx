import { symbols } from "@tutur/symbols";
import { words, type WordId } from "@tutur/vocab";
import { Image } from "expo-image";
import { StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";
import { useSymbolMotion } from "@/board/symbol-motion";
import { color, kindColor, space, type } from "@/theme/tokens";
import { ChunkyPressable } from "./chunky-pressable";

type SymbolTileProps = { wordId: WordId; size: number; onPress: (wordId: WordId) => void };

export function SymbolTile({ wordId, size, onPress }: SymbolTileProps) {
  const word = words[wordId];
  const { fill, lip, label: kindLabel } = kindColor[word.kind];
  const symbolMotion = useSymbolMotion(wordId);
  /** Two-word labels ("kolam renang") wrap onto a second line, so their symbol gives up a little height. */
  const twoLines = word.label.includes(" ");
  const symbolSize = size * (twoLines ? 0.46 : 0.56);
  return (
    <ChunkyPressable
      face={fill}
      lip={lip}
      onPress={() => {
        onPress(wordId);
        symbolMotion.start();
      }}
      accessibilityLabel={word.label}
      accessibilityHint={kindLabel}
      style={{ width: size, height: size }}
      faceStyle={styles.face}
    >
      <Animated.View style={symbolMotion.style} testID={`symbol-${wordId}`}>
        <Image source={symbols[word.symbol]} style={{ width: symbolSize, height: symbolSize }} contentFit="contain" accessible={false} />
      </Animated.View>
      <Text style={styles.label} numberOfLines={twoLines ? 2 : 1} adjustsFontSizeToFit maxFontSizeMultiplier={1.4}>
        {word.label}
      </Text>
    </ChunkyPressable>
  );
}

const styles = StyleSheet.create({
  face: { paddingHorizontal: space.sm, gap: space.xs },
  label: { ...type.tile, color: color.ink, textAlign: "center" },
});
