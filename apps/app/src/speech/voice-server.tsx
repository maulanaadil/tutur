import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const SERVER_URL = process.env.EXPO_PUBLIC_VOICE_SERVER_URL;
const HEALTH_TIMEOUT_MS = 2500;

type Status = "checking" | "online" | "offline";

type VoiceServerContextValue = {
  status: Status;
  /** Address that speaks `text` in the child's voice, or null when only the device voice is available. */
  speechUrl: (text: string) => string | null;
  refresh: () => void;
};

const VoiceServerContext = createContext<VoiceServerContextValue | null>(null);

async function ping(): Promise<Status> {
  if (SERVER_URL === undefined || SERVER_URL === "") return "offline";
  try {
    const response = await fetch(`${SERVER_URL}/health`, { signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS) });
    return response.ok ? "online" : "offline";
  } catch {
    return "offline";
  }
}

export function VoiceServerProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("checking");

  const refresh = useCallback(() => {
    ping().then(setStatus, () => setStatus("offline"));
  }, []);
  useEffect(refresh, [refresh]);

  const value = useMemo<VoiceServerContextValue>(
    () => ({
      status,
      speechUrl: (text) => (status === "online" ? `${SERVER_URL}/speak?text=${encodeURIComponent(text)}` : null),
      refresh,
    }),
    [status, refresh],
  );
  return <VoiceServerContext value={value}>{children}</VoiceServerContext>;
}

export function useVoiceServer(): VoiceServerContextValue {
  const value = useContext(VoiceServerContext);
  if (value === null) throw new Error("useVoiceServer must be used inside <VoiceServerProvider>");
  return value;
}
