import { wordClips } from "@tutur/voice";
import type { WordId } from "@tutur/vocab";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { Utterance } from "@/speech/speech";

export type SentencePart = { key: number; kind: "word"; wordId: WordId } | { key: number; kind: "typed"; text: string };

type NewPart = { kind: "word"; wordId: WordId } | { kind: "typed"; text: string };

type SentenceContextValue = {
  parts: readonly SentencePart[];
  add: (part: NewPart) => void;
  removeLast: () => void;
  clear: () => void;
};

const SentenceContext = createContext<SentenceContextValue | null>(null);

/** Typed text uses the child's voice through the voice server, or the device voice when that server is unreachable. */
export function utteranceFor(part: NewPart, typedSpeechUrl: (text: string) => string | null): Utterance {
  if (part.kind === "word") return { kind: "clip", source: wordClips[part.wordId] };
  const uri = typedSpeechUrl(part.text);
  return uri === null ? { kind: "device", text: part.text } : { kind: "clip", source: { uri } };
}

export function SentenceProvider({ children }: { children: ReactNode }) {
  const [parts, setParts] = useState<readonly SentencePart[]>([]);
  const nextKey = useRef(0);

  const add = useCallback((part: NewPart) => {
    const key = nextKey.current++;
    setParts((current) => [...current, { ...part, key }]);
  }, []);
  const removeLast = useCallback(() => setParts((current) => current.slice(0, -1)), []);
  const clear = useCallback(() => setParts([]), []);

  const value = useMemo(() => ({ parts, add, removeLast, clear }), [parts, add, removeLast, clear]);
  return <SentenceContext value={value}>{children}</SentenceContext>;
}

export function useSentence(): SentenceContextValue {
  const value = useContext(SentenceContext);
  if (value === null) throw new Error("useSentence must be used inside <SentenceProvider>");
  return value;
}
