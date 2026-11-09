import Svg, { Ellipse, G, Path } from "react-native-svg";
import { Cheeks, Eye, INK, type Mood } from "./parts";

const FEATHER = "#FBFDFF";
const SHADE = "#DCE7F2";
const MASK = "#2D7BE0";
const BEAK = "#F2C94C";
const LEGS = "#6E86A6";

function Beak({ mood }: { mood: Mood }) {
  if (mood === "happy") return <Path d="M53 66 L67 66 L60 76 Z" fill={BEAK} />;
  return (
    <G>
      <Path d="M52 64 L68 64 L60 71 Z" fill={BEAK} />
      <Path d="M54 74 L66 74 L60 81 Z" fill="#E0AE2F" />
    </G>
  );
}

export function Jali({ mood }: { mood: Mood }) {
  const wingsUp = mood === "cheer";
  return (
    <Svg viewBox="0 0 120 120" width="100%" height="100%">
      <Path d="M80 92 L110 106 L104 84 Z" fill={SHADE} />
      <Path d="M100 99 L110 106 L106 94 Z" fill={INK} />
      <Path d="M52 108 L50 118 M66 108 L68 118" stroke={LEGS} strokeWidth={4} strokeLinecap="round" />
      <Path d="M48 22 Q50 4 58 14 Q60 0 66 14 Q74 4 72 24 Z" fill={FEATHER} stroke={SHADE} strokeWidth={2.5} />
      <Path d="M57 13 Q60 6 64 13" stroke={SHADE} strokeWidth={2} fill="none" />
      <Ellipse cx={59} cy={70} rx={37} ry={40} fill={FEATHER} stroke={SHADE} strokeWidth={3} />
      <Ellipse cx={66} cy={84} rx={26} ry={22} fill={SHADE} opacity={0.6} />
      {wingsUp ? (
        <G>
          <Path d="M24 64 Q4 40 14 28 Q26 44 34 58 Z" fill={SHADE} />
          <Path d="M14 28 Q10 34 12 40 L18 36 Z" fill={INK} />
          <Path d="M94 64 Q114 40 104 28 Q92 44 84 58 Z" fill={SHADE} />
          <Path d="M104 28 Q108 34 106 40 L100 36 Z" fill={INK} />
        </G>
      ) : (
        <G>
          <Path d="M24 62 Q14 84 30 100 Q34 82 34 64 Z" fill={SHADE} />
          <Path d="M24 92 Q26 98 30 100 L30 90 Z" fill={INK} />
          <Path d="M94 62 Q104 84 88 100 Q84 82 84 64 Z" fill={SHADE} />
          <Path d="M94 92 Q92 98 88 100 L88 90 Z" fill={INK} />
        </G>
      )}
      <Ellipse cx={46} cy={54} rx={12} ry={11} fill={MASK} />
      <Ellipse cx={72} cy={54} rx={12} ry={11} fill={MASK} />
      <Eye cx={46} cy={54} r={5.5} mood={mood} />
      <Eye cx={72} cy={54} r={5.5} mood={mood} />
      <Cheeks y={70} left={38} right={80} r={5} />
      <Beak mood={mood} />
    </Svg>
  );
}
