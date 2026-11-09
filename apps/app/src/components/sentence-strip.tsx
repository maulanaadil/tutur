import { symbols } from "@tutur/symbols";
import { words } from "@tutur/vocab";
import { Image } from "expo-image";
import { Keyboard } from "phosphor-react-native";
import { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from "react-native";
import type { SentencePart } from "@/sentence/sentence";
import { color, kindColor, radius, space, type } from "@/theme/tokens";
import { ChunkyPressable } from "./chunky-pressable";

function Chip({ part }: { part: SentencePart }) {
  if (part.kind === "typed") {
    return (
      <View style={[styles.chip, { backgroundColor: color.sunSoft, borderColor: color.sun }]}>
        <Keyboard size={22} color={color.ink} weight="bold" />
        <Text style={styles.chipLabel}>{part.text}</Text>
      </View>
    );
  }
  const word = words[part.wordId];
  const { fill, lip } = kindColor[word.kind];
  return (
    <View style={[styles.chip, { backgroundColor: fill, borderColor: lip }]}>
      <Image source={symbols[word.symbol]} style={styles.chipSymbol} contentFit="contain" accessible={false} />
      <Text style={styles.chipLabel}>{word.label}</Text>
    </View>
  );
}

type SentenceStripProps = { parts: readonly SentencePart[]; onSpeak: () => void; height: number };

export function SentenceStrip({ parts, onSpeak, height }: SentenceStripProps) {
  const scroll = useRef<ScrollViewInstance>(null);
  useEffect(() => {
    scroll.current?.scrollToEnd({ animated: false });
  }, [parts.length]);

  const sentence = parts.map((part) => (part.kind === "word" ? words[part.wordId].label : part.text)).join(" ");
  return (
    <ChunkyPressable
      face={color.surface}
      lip={color.surfaceLip}
      onPress={parts.length === 0 ? undefined : onSpeak}
      accessibilityLabel={parts.length === 0 ? "Kalimat kosong" : `Bacakan: ${sentence}`}
      style={[styles.root, { height }]}
      faceStyle={styles.face}
    >
      {parts.length === 0 ? (
        <Text style={styles.empty} numberOfLines={2}>
          Ketuk gambar untuk bicara
        </Text>
      ) : (
        <ScrollView ref={scroll} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {parts.map((part) => (
            <Chip key={part.key} part={part} />
          ))}
        </ScrollView>
      )}
    </ChunkyPressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  face: { alignItems: "stretch", paddingHorizontal: space.md },
  chips: { alignItems: "center", gap: space.sm, paddingVertical: space.sm },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    borderRadius: radius.md,
    borderWidth: 2,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
  },
  chipSymbol: { width: 30, height: 30 },
  chipLabel: { ...type.tile, color: color.ink },
  empty: { ...type.label, color: color.inkSoft, textAlign: "center" },
});
