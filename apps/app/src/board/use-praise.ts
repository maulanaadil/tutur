import { mascotPhrases, type PhraseId } from "@tutur/vocab";
import { phraseClips } from "@tutur/voice";
import { useCallback, useRef, useState } from "react";
import type { Mood } from "@/mascots";
import { useSettings } from "@/settings/settings";
import { useSpeech } from "@/speech/speech";

const PRAISE_ORDER = ["hebat", "bagus", "pintar"] as const satisfies readonly PhraseId[];
const MIN_WORDS_FOR_PRAISE = 2;

export function usePraise() {
  const { settings } = useSettings();
  const { speak } = useSpeech();
  const [cheering, setCheering] = useState<PhraseId | null>(null);
  const turn = useRef(0);

  const praise = useCallback(
    async (wordCount: number) => {
      if (!settings.praise || wordCount < MIN_WORDS_FOR_PRAISE) return;
      const phrase = PRAISE_ORDER[turn.current % PRAISE_ORDER.length];
      turn.current++;
      setCheering(phrase);
      await speak([{ kind: "clip", source: phraseClips[phrase] }]);
      setCheering(null);
    },
    [settings.praise, speak],
  );

  const mood: Mood = cheering === null ? "happy" : "cheer";
  const bubble = cheering === null ? null : mascotPhrases[cheering].text;
  return { praise, mood, bubble, cancelPraise: () => setCheering(null) };
}
