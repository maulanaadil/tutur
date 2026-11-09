import { Baloo2_700Bold, Baloo2_800ExtraBold } from "@expo-google-fonts/baloo-2";
import { Nunito_600SemiBold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SentenceProvider } from "@/sentence/sentence";
import { SettingsProvider } from "@/settings/settings";
import { SpeechProvider } from "@/speech/speech";
import { VoiceServerProvider } from "@/speech/voice-server";
import { color } from "@/theme/tokens";

SplashScreen.preventAutoHideAsync().catch((error: unknown) => console.warn("Splash screen could not be held.", error));

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Baloo2_700Bold, Baloo2_800ExtraBold, Nunito_600SemiBold, Nunito_800ExtraBold });
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch((error: unknown) => console.warn("Splash screen could not be hidden.", error));
  }, [ready]);

  if (!ready) return null;
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <VoiceServerProvider>
          <SpeechProvider>
            <SentenceProvider>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.canvas } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="ketik" options={{ presentation: "modal" }} />
                <Stack.Screen name="orang-tua" options={{ presentation: "modal" }} />
              </Stack>
            </SentenceProvider>
          </SpeechProvider>
        </VoiceServerProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
