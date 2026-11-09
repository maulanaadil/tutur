import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useReducedMotion } from "react-native-reanimated";
import { z } from "zod";
import { MASCOT_IDS } from "@/mascots/ids";

const STORAGE_KEY = "tutur.settings.v1";

const SettingsSchema = z.object({
  reduceMotion: z.boolean(),
  praise: z.boolean(),
  mascot: z.enum(MASCOT_IDS),
  columns: z.union([z.literal(3), z.literal(4), z.literal(5)]),
});

export type Settings = z.infer<typeof SettingsSchema>;

const DEFAULT_SETTINGS: Settings = { reduceMotion: false, praise: true, mascot: "tari", columns: 5 };

type SettingsContextValue = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

async function loadSettings(): Promise<Settings> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored === null) return DEFAULT_SETTINGS;
  const parsed = SettingsSchema.safeParse(JSON.parse(stored));
  if (parsed.success) return parsed.data;
  console.warn("Stored settings were invalid; using defaults.", parsed.error);
  return DEFAULT_SETTINGS;
}

function LoadedSettingsProvider({ initial, children }: { initial: Settings; children: ReactNode }) {
  const [settings, setSettings] = useState(initial);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch((error: unknown) => {
      console.warn("Could not save settings; they will reset on next launch.", error);
    });
  }, [settings]);

  const value = useMemo(
    () => ({ settings, update: (patch: Partial<Settings>) => setSettings((current) => ({ ...current, ...patch })) }),
    [settings],
  );
  return <SettingsContext value={value}>{children}</SettingsContext>;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [initial, setInitial] = useState<Settings | null>(null);

  useEffect(() => {
    loadSettings().then(setInitial, (error: unknown) => {
      console.warn("Could not read stored settings; using defaults.", error);
      setInitial(DEFAULT_SETTINGS);
    });
  }, []);

  if (initial === null) return null;
  return <LoadedSettingsProvider initial={initial}>{children}</LoadedSettingsProvider>;
}

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsContext);
  if (value === null) throw new Error("useSettings must be used inside <SettingsProvider>");
  return value;
}

export function useMotionAllowed(): boolean {
  const systemReduced = useReducedMotion();
  return !useSettings().settings.reduceMotion && !systemReduced;
}
