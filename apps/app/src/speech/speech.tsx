import { setAudioModeAsync, useAudioPlayer, type AudioSource } from "expo-audio";
import * as DeviceSpeech from "expo-speech";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "@/theme/tokens";

export type Utterance = { kind: "clip"; source: AudioSource } | { kind: "device"; text: string };

export type SpeakResult = "finished" | "interrupted" | "failed";

type SpeechContextValue = {
  speak: (utterances: readonly Utterance[]) => Promise<SpeakResult>;
  speaking: boolean;
};

type PendingClip = { resolve: () => void; reject: (error: Error) => void };

const SpeechContext = createContext<SpeechContextValue | null>(null);

const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function SpeechProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer(null);
  const [speaking, setSpeaking] = useState(false);
  const currentRun = useRef(0);
  const pendingClip = useRef<PendingClip | null>(null);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: "duckOthers" }).catch((error: unknown) => {
      console.warn("Could not configure the audio session; speech may be silent in silent mode.", error);
    });
  }, []);

  useEffect(() => {
    const subscription = player.addListener("playbackStatusUpdate", (status) => {
      const pending = pendingClip.current;
      if (pending === null) return;
      if (status.error !== null) {
        pendingClip.current = null;
        pending.reject(new Error(status.error));
      } else if (status.didJustFinish) {
        pendingClip.current = null;
        pending.resolve();
      }
    });
    return () => subscription.remove();
  }, [player]);

  const say = useCallback(
    (utterance: Utterance) =>
      new Promise<void>((resolve, reject) => {
        if (utterance.kind === "clip") {
          pendingClip.current = { resolve, reject };
          player.replace(utterance.source);
          player.play();
          return;
        }
        DeviceSpeech.speak(utterance.text, { language: "id-ID", onDone: resolve, onStopped: resolve, onError: reject });
      }),
    [player],
  );

  const interrupt = useCallback(() => {
    player.pause();
    pendingClip.current?.resolve();
    pendingClip.current = null;
    DeviceSpeech.stop().catch((error: unknown) => console.warn("Could not stop device speech.", error));
  }, [player]);

  const speak = useCallback(
    async (utterances: readonly Utterance[]): Promise<SpeakResult> => {
      const run = ++currentRun.current;
      interrupt();
      setSpeaking(true);
      try {
        for (const [index, utterance] of utterances.entries()) {
          if (index > 0) await pause(motion.wordGapMs);
          if (run !== currentRun.current) return "interrupted";
          await say(utterance);
          if (run !== currentRun.current) return "interrupted";
        }
        return "finished";
      } catch (error) {
        console.warn("Speech playback failed.", error);
        return "failed";
      } finally {
        if (run === currentRun.current) setSpeaking(false);
      }
    },
    [interrupt, say],
  );

  const value = useMemo(() => ({ speak, speaking }), [speak, speaking]);
  return <SpeechContext value={value}>{children}</SpeechContext>;
}

export function useSpeech(): SpeechContextValue {
  const value = useContext(SpeechContext);
  if (value === null) throw new Error("useSpeech must be used inside <SpeechProvider>");
  return value;
}
