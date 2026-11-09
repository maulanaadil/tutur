import { categories, type Category, type WordId } from "@tutur/vocab";
import { router } from "expo-router";
import type { Metadata } from "expo-router/server";
import { Backspace, GearSix, Keyboard, SpeakerHigh, Trash } from "phosphor-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePraise } from "@/board/use-praise";
import { CategoryNav } from "@/components/category-nav";
import { IconButton } from "@/components/icon-button";
import { MascotCorner } from "@/components/mascot-corner";
import { SentenceStrip } from "@/components/sentence-strip";
import { SymbolTile } from "@/components/symbol-tile";
import { useSentence, utteranceFor } from "@/sentence/sentence";
import { useSettings } from "@/settings/settings";
import { useSpeech } from "@/speech/speech";
import { useVoiceServer } from "@/speech/voice-server";
import { homeMetadata } from "@/seo/metadata";
import { color, space, WIDE_LAYOUT_MIN } from "@/theme/tokens";

const PARENT_HOLD_MS = 1500;
const NARROW_COLUMNS = 3;

export function generateMetadata(): Metadata {
  return homeMetadata;
}

export default function BoardScreen() {
  const { settings } = useSettings();
  const { speak } = useSpeech();
  const { speechUrl } = useVoiceServer();
  const sentence = useSentence();
  const { praise, mood, bubble, cancelPraise } = usePraise();
  const [category, setCategory] = useState<Category>(categories[0]);
  const [gridWidth, setGridWidth] = useState(0);
  const { width } = useWindowDimensions();

  const wide = width >= WIDE_LAYOUT_MIN;
  const columns = wide ? settings.columns : NARROW_COLUMNS;
  const tileSize = gridWidth > 0 ? Math.floor((gridWidth - space.md * (columns - 1)) / columns) : 0;
  const controlSize = wide ? 84 : 64;

  const tapWord = (wordId: WordId) => {
    cancelPraise();
    sentence.add({ kind: "word", wordId });
    void speak([utteranceFor({ kind: "word", wordId }, speechUrl)]);
  };

  const speakSentence = async () => {
    cancelPraise();
    const result = await speak(sentence.parts.map((part) => utteranceFor(part, speechUrl)));
    if (result === "finished") await praise(sentence.parts.length);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>
        <MascotCorner mascot={settings.mascot} mood={mood} bubble={bubble} size={controlSize + 8} />
        <SentenceStrip parts={sentence.parts} onSpeak={speakSentence} height={controlSize + 8} />
        <IconButton icon={SpeakerHigh} label="Bicara" tone="primary" size={controlSize + 8} onPress={speakSentence} disabled={sentence.parts.length === 0} />
        <IconButton icon={Backspace} label="Hapus" size={controlSize} onPress={sentence.removeLast} onLongPress={sentence.clear} disabled={sentence.parts.length === 0} />
        {wide ? <IconButton icon={Trash} label="Kosongkan" size={controlSize} onPress={sentence.clear} disabled={sentence.parts.length === 0} /> : null}
      </View>

      <View style={[styles.body, wide ? styles.bodyWide : styles.bodyNarrow]}>
        <View style={wide ? styles.navWide : undefined}>
          <CategoryNav selected={category.id} onSelect={setCategory} direction={wide ? "column" : "row"} />
        </View>
        <ScrollView style={styles.gridScroll} contentContainerStyle={styles.grid} onLayout={(event) => setGridWidth(event.nativeEvent.layout.width - space.xs * 2)}>
          {tileSize > 0 && category.words.map((wordId) => <SymbolTile key={wordId} wordId={wordId} size={tileSize} onPress={tapWord} />)}
        </ScrollView>
      </View>

      <View style={styles.bottom}>
        <IconButton icon={Keyboard} label="Ketik" size={64} onPress={() => router.push("/ketik")} />
        <IconButton
          icon={GearSix}
          label="Tahan"
          size={64}
          delayLongPress={PARENT_HOLD_MS}
          onLongPress={() => router.push("/orang-tua")}
          accessibilityLabel="Pengaturan orang tua"
          accessibilityHint="Tahan dua detik untuk membuka"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.canvas, paddingHorizontal: space.lg, gap: space.md },
  top: { flexDirection: "row", alignItems: "center", gap: space.md, paddingTop: space.md },
  body: { flex: 1, gap: space.md },
  bodyWide: { flexDirection: "row" },
  bodyNarrow: { flexDirection: "column" },
  navWide: { width: 148 },
  gridScroll: { flex: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space.md, padding: space.xs },
  bottom: { flexDirection: "row", justifyContent: "space-between", paddingBottom: space.md },
});
