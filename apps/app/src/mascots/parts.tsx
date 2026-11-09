import { Circle, Ellipse, G, Path } from "react-native-svg";

export type Mood = "happy" | "talking" | "cheer";

export const INK = "#2A2836";
const MOUTH = "#5A2333";
const TONGUE = "#F28B9B";
const BLUSH = "#F59AA8";

type EyeProps = { cx: number; cy: number; r: number; mood: Mood; iris?: string };

export function Eye({ cx, cy, r, mood, iris }: EyeProps) {
  if (mood === "cheer") {
    return (
      <Path
        d={`M ${cx - r} ${cy + r * 0.25} Q ${cx} ${cy - r * 0.9} ${cx + r} ${cy + r * 0.25}`}
        stroke={INK}
        strokeWidth={Math.max(2.5, r * 0.42)}
        strokeLinecap="round"
        fill="none"
      />
    );
  }
  const pupil = iris === undefined ? r : r * 0.58;
  return (
    <G>
      {iris === undefined ? null : <Circle cx={cx} cy={cy} r={r} fill={iris} />}
      <Circle cx={cx} cy={cy} r={pupil} fill={INK} />
      <Circle cx={cx + pupil * 0.38} cy={cy - pupil * 0.38} r={pupil * 0.36} fill="#FFFFFF" />
    </G>
  );
}

type MouthProps = { cx: number; cy: number; width: number; mood: Mood };

export function Mouth({ cx, cy, width, mood }: MouthProps) {
  const half = width / 2;
  if (mood === "happy") {
    return (
      <Path
        d={`M ${cx - half} ${cy} Q ${cx} ${cy + width * 0.55} ${cx + half} ${cy}`}
        stroke={INK}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
    );
  }
  if (mood === "talking") {
    return (
      <G>
        <Ellipse cx={cx} cy={cy + width * 0.18} rx={width * 0.3} ry={width * 0.34} fill={MOUTH} />
        <Ellipse cx={cx} cy={cy + width * 0.36} rx={width * 0.2} ry={width * 0.12} fill={TONGUE} />
      </G>
    );
  }
  return (
    <G>
      <Path d={`M ${cx - half} ${cy} Q ${cx} ${cy + width * 1.0} ${cx + half} ${cy} Z`} fill={MOUTH} />
      <Ellipse cx={cx} cy={cy + width * 0.36} rx={width * 0.22} ry={width * 0.1} fill={TONGUE} />
    </G>
  );
}

export function Cheeks({ y, left, right, r }: { y: number; left: number; right: number; r: number }) {
  return (
    <G opacity={0.55}>
      <Ellipse cx={left} cy={y} rx={r} ry={r * 0.7} fill={BLUSH} />
      <Ellipse cx={right} cy={y} rx={r} ry={r * 0.7} fill={BLUSH} />
    </G>
  );
}
