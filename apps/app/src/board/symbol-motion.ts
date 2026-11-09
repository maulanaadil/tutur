import { words, type WordId, type WordKind } from "@tutur/vocab";
import { Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withSequence, withTiming, type SharedValue } from "react-native-reanimated";
import { useMotionAllowed } from "@/settings/settings";

type Motion = "bounce" | "pop" | "wiggle" | "wave" | "nod" | "shake" | "hop" | "spin" | "droop" | "chomp" | "float" | "beat" | "tremble";

type Channel = "translateX" | "translateY" | "rotate" | "scale";
type Step = readonly [value: number, durationMs: number];

const REST: Record<Channel, number> = { translateX: 0, translateY: 0, rotate: 0, scale: 1 };

/**
 * Each motion plays once per tap, stays small and ends at rest, so a tap never leaves a symbol
 * shaking or moved. Rotation is in degrees, translation in points.
 */
const keyframes: Record<Motion, Partial<Record<Channel, readonly Step[]>>> = {
  bounce: { translateY: [[-10, 140], [0, 120], [-4, 100], [0, 100]] },
  pop: { scale: [[1.15, 150], [0.97, 120], [1, 120]] },
  wiggle: { rotate: [[-8, 90], [8, 120], [-5, 110], [0, 100]] },
  wave: { rotate: [[14, 130], [-10, 140], [10, 130], [0, 120]] },
  nod: { translateY: [[5, 120], [0, 110], [5, 120], [0, 110]] },
  shake: { translateX: [[-5, 80], [5, 90], [-4, 90], [3, 80], [0, 80]] },
  hop: { translateY: [[-12, 150], [0, 130], [-8, 130], [0, 120]] },
  spin: { rotate: [[360, 600], [0, 0]] },
  droop: { translateY: [[6, 250], [0, 350]], rotate: [[-6, 250], [0, 350]] },
  chomp: { scale: [[0.9, 100], [1.05, 110], [0.92, 100], [1, 120]] },
  float: { translateY: [[-10, 300], [0, 350]] },
  beat: { scale: [[1.12, 110], [1, 100], [1.16, 120], [1, 160]] },
  tremble: { translateX: [[-2, 50], [2, 50], [-2, 50], [2, 50], [-1, 50], [0, 50]] },
};

const motionByKind: Record<WordKind, Motion> = {
  person: "pop",
  action: "bounce",
  describe: "wiggle",
  thing: "bounce",
  social: "wiggle",
  negation: "shake",
};

/** Words whose meaning has a clearer motion than their kind's default. */
const motionByWord: Partial<Record<WordId, Motion>> = {
  ya: "nod",
  tolong: "nod",
  terima_kasih: "nod",
  halo: "wave",
  selamat_pagi: "float",
  selamat_malam: "droop",
  maaf: "droop",
  makan: "chomp",
  minum: "chomp",
  main: "hop",
  lari: "hop",
  tidur: "droop",
  berhenti: "shake",
  peluk: "beat",
  suka: "beat",
  sayang: "beat",
  senang: "hop",
  sedih: "droop",
  capek: "droop",
  ngantuk: "droop",
  sakit: "droop",
  marah: "shake",
  takut: "tremble",
  kaget: "pop",
  bola: "spin",
  balon: "float",
  burung: "float",
  kupu_kupu: "float",
  kelinci: "hop",
  katak: "hop",
};

function motionFor(wordId: WordId): Motion {
  return motionByWord[wordId] ?? motionByKind[words[wordId].kind];
}

/** Snaps back to rest first, so a quick second tap restarts the motion instead of stacking on the first. */
function play(value: SharedValue<number>, restValue: number, steps: readonly Step[] | undefined) {
  cancelAnimation(value);
  value.value = restValue;
  const [first, ...later] = steps ?? [];
  if (first === undefined) return;
  const timed = ([target, duration]: Step) => withTiming(target, { duration, easing: Easing.inOut(Easing.quad) });
  value.value = withSequence(timed(first), ...later.map(timed));
}

/** Animates a word's symbol once when its tile is tapped. Does nothing when motion is reduced. */
export function useSymbolMotion(wordId: WordId) {
  const motionAllowed = useMotionAllowed();
  const motion = motionFor(wordId);
  const translateX = useSharedValue(REST.translateX);
  const translateY = useSharedValue(REST.translateY);
  const rotate = useSharedValue(REST.rotate);
  const scale = useSharedValue(REST.scale);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { rotate: `${rotate.value}deg` }, { scale: scale.value }],
  }));

  function start() {
    if (!motionAllowed) return;
    const frames = keyframes[motion];
    play(translateX, REST.translateX, frames.translateX);
    play(translateY, REST.translateY, frames.translateY);
    play(rotate, REST.rotate, frames.rotate);
    play(scale, REST.scale, frames.scale);
  }

  /** A wave swings from the wrist, so it pivots on the bottom edge instead of the centre. */
  const transformOrigin = motion === "wave" ? "50% 100%" : "50% 50%";
  return { style: [style, { transformOrigin }], start };
}
