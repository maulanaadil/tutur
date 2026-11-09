import { router } from "expo-router";
import type { Metadata } from "expo-router/server";
import { ArrowLeft } from "phosphor-react-native";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChunkyPressable } from "@/components/chunky-pressable";
import { IconButton } from "@/components/icon-button";
import { Mascot, MASCOT_IDS, mascots } from "@/mascots";
import { useSettings, type Settings } from "@/settings/settings";
import { screenMetadata } from "@/seo/metadata";
import { color, radius, space, type } from "@/theme/tokens";

const COLUMN_CHOICES: readonly Settings["columns"][] = [3, 4, 5];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

function ToggleRow({ label, helper, value, onChange }: { label: string; helper: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.helper}>{helper}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} accessibilityLabel={label} trackColor={{ true: color.primary, false: color.line }} />
    </View>
  );
}

export function generateMetadata(): Metadata {
  return screenMetadata("Pengaturan orang tua");
}

export default function ParentScreen() {
  const { settings, update } = useSettings();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} label="Kembali" size={64} onPress={() => router.back()} />
        <Text style={styles.title} accessibilityRole="header">
          Pengaturan orang tua
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Teman">
          <Text style={styles.helper}>Teman muncul di samping kalimat dan bersorak saat anak menyusun kalimat.</Text>
          <View style={styles.mascots}>
            {MASCOT_IDS.map((id) => {
              const active = settings.mascot === id;
              return (
                <ChunkyPressable
                  key={id}
                  face={active ? color.sunSoft : color.surface}
                  lip={active ? color.sun : color.surfaceLip}
                  selected={active}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  accessibilityLabel={`${mascots[id].name}, ${mascots[id].animal}`}
                  onPress={() => update({ mascot: id })}
                  style={styles.mascotCard}
                  faceStyle={styles.mascotFace}
                >
                  <Mascot id={id} mood={active ? "cheer" : "happy"} size={96} />
                  <Text style={styles.mascotName}>{mascots[id].name}</Text>
                  <Text style={styles.mascotIntro}>{mascots[id].intro}</Text>
                </ChunkyPressable>
              );
            })}
          </View>
        </Section>

        <Section title="Kenyamanan">
          <ToggleRow
            label="Kurangi gerakan"
            helper="Gambar dan teman tidak bergerak. Pengaturan gerakan di perangkat juga diikuti."
            value={settings.reduceMotion}
            onChange={(reduceMotion) => update({ reduceMotion })}
          />
          <ToggleRow
            label="Pujian dari teman"
            helper='Setelah kalimat dua kata atau lebih, teman berkata "Hebat!" dengan suaranya sendiri.'
            value={settings.praise}
            onChange={(praise) => update({ praise })}
          />
        </Section>

        <Section title="Jumlah kolom (tablet)">
          <View style={styles.choices} accessibilityRole="radiogroup">
            {COLUMN_CHOICES.map((columns) => {
              const active = settings.columns === columns;
              return (
                <ChunkyPressable
                  key={columns}
                  face={active ? color.primary : color.surface}
                  lip={active ? color.primaryLip : color.surfaceLip}
                  selected={active}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  accessibilityLabel={`${columns} kolom`}
                  onPress={() => update({ columns })}
                  style={styles.choice}
                >
                  <Text style={[styles.choiceLabel, { color: active ? color.onPrimary : color.ink }]}>{columns}</Text>
                </ChunkyPressable>
              );
            })}
          </View>
        </Section>

        <Section title="Tentang">
          <Text style={styles.helper}>Gambar simbol: OpenMoji (openmoji.org), lisensi CC BY-SA 4.0.</Text>
          <Text style={styles.helper}>Suara dibuat dengan OmniVoice (k2-fsa) melalui VoiceStudio.</Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.canvas, paddingHorizontal: space.xl, paddingTop: space.lg },
  header: { flexDirection: "row", alignItems: "center", gap: space.lg },
  title: { ...type.title, color: color.ink },
  content: { gap: space.xl, paddingVertical: space.xl, maxWidth: 880 },
  section: { gap: space.md },
  sectionTitle: { ...type.heading, color: color.ink },
  helper: { ...type.body, color: color.inkSoft },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.lg,
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  rowText: { flex: 1, gap: space.xs },
  rowLabel: { ...type.label, fontSize: 17, color: color.ink },
  mascots: { flexDirection: "row", flexWrap: "wrap", gap: space.md },
  mascotCard: { width: 196, height: 236 },
  mascotFace: { padding: space.md, gap: space.xs, justifyContent: "flex-start" },
  mascotName: { ...type.heading, color: color.ink },
  mascotIntro: { ...type.body, fontSize: 14, lineHeight: 20, color: color.inkSoft, textAlign: "center" },
  choices: { flexDirection: "row", gap: space.md },
  choice: { width: 72, height: 72 },
  choiceLabel: { ...type.title },
});
