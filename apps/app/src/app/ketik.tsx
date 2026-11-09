import { router, useFocusEffect } from "expo-router";
import type { Metadata } from "expo-router/server";
import { ArrowLeft, Plus, SpeakerHigh } from "phosphor-react-native";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "@/components/icon-button";
import { useSentence, utteranceFor } from "@/sentence/sentence";
import { useSpeech } from "@/speech/speech";
import { useVoiceServer } from "@/speech/voice-server";
import { screenMetadata } from "@/seo/metadata";
import { color, radius, space, type } from "@/theme/tokens";

const voiceNote = {
  checking: "Mencari server suara...",
  online: "Dibacakan dengan suara anak Tutur. Kata baru butuh beberapa detik saat pertama kali.",
  offline: "Server suara tidak terhubung, jadi kata ketikan memakai suara perangkat.",
} as const;

/** Rendering on the voice server is slow the first time, so a typed part starts rendering as soon as it is added. */
function warmUp(uri: string | null) {
  if (uri === null) return;
  fetch(uri).catch((error: unknown) => console.warn("Could not pre-render typed speech.", error));
}

export function generateMetadata(): Metadata {
  return screenMetadata("Ketik kata baru");
}

export default function TypeScreen() {
  const [text, setText] = useState("");
  const { speak, speaking } = useSpeech();
  const { status, speechUrl, refresh } = useVoiceServer();
  const sentence = useSentence();
  const trimmed = text.trim();
  useFocusEffect(refresh);

  const addToSentence = () => {
    warmUp(speechUrl(trimmed));
    sentence.add({ kind: "typed", text: trimmed });
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} label="Kembali" size={64} onPress={() => router.back()} />
        <Text style={styles.title} accessibilityRole="header">
          Ketik kata baru
        </Text>
      </View>
      <Text style={styles.fieldLabel} nativeID="typed-label">
        Kata atau kalimat
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        accessibilityLabelledBy="typed-label"
        placeholder="contoh: aku mau ke rumah nenek"
        placeholderTextColor={color.inkSoft}
        style={styles.input}
        autoFocus
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={trimmed.length > 0 ? addToSentence : undefined}
      />
      <Text style={styles.helper} accessibilityLiveRegion="polite">
        {voiceNote[status]}
      </Text>
      <View style={styles.actions}>
        <IconButton
          icon={SpeakerHigh}
          label={speaking ? "Tunggu" : "Dengar"}
          size={88}
          disabled={trimmed.length === 0 || speaking}
          onPress={() => void speak([utteranceFor({ kind: "typed", text: trimmed }, speechUrl)])}
        />
        <IconButton icon={Plus} label="Masukkan" tone="primary" size={88} disabled={trimmed.length === 0} onPress={addToSentence} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.canvas, padding: space.xl, gap: space.md },
  header: { flexDirection: "row", alignItems: "center", gap: space.lg },
  title: { ...type.title, color: color.ink },
  fieldLabel: { ...type.label, color: color.ink, marginTop: space.lg },
  input: {
    ...type.heading,
    color: color.ink,
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: color.line,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    minHeight: 64,
  },
  helper: { ...type.body, color: color.inkSoft },
  actions: { flexDirection: "row", gap: space.lg, marginTop: space.md },
});
