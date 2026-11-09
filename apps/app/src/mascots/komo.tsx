import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";
import { Cheeks, Eye, Mouth, type Mood } from "./parts";

const SCALE = "#7E9C55";
const SCALE_DARK = "#5E7A3C";
const BELLY = "#E9E5B8";
const BAND = "#E8C25A";
const TONGUE = "#E5576A";

export function Komo({ mood }: { mood: Mood }) {
  return (
    <Svg viewBox="0 0 120 120" width="100%" height="100%">
      <Path d="M78 98 Q112 106 116 78 Q117 68 110 70 Q104 92 76 86 Z" fill={SCALE_DARK} />
      <Path d="M100 86 L104 80 M108 80 L113 76" stroke={BAND} strokeWidth={3} strokeLinecap="round" />
      <Ellipse cx={56} cy={96} rx={34} ry={21} fill={SCALE} />
      <Ellipse cx={56} cy={101} rx={21} ry={13} fill={BELLY} />
      <Path d="M30 86 Q56 78 82 86" stroke={BAND} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Ellipse cx={28} cy={110} rx={10} ry={6} fill={SCALE_DARK} />
      <Ellipse cx={84} cy={110} rx={10} ry={6} fill={SCALE_DARK} />
      <Path d="M20 50 Q22 22 60 20 Q98 22 100 50 Q100 70 84 76 L36 76 Q20 70 20 50 Z" fill={SCALE} />
      <Ellipse cx={60} cy={68} rx={30} ry={14} fill={SCALE} />
      <Path d="M44 22 L48 14 L52 21 L56 12 L60 20 L64 12 L68 21 L72 14 L76 22 Z" fill={SCALE_DARK} />
      <G fill={BAND}>
        <Circle cx={30} cy={40} r={2.5} />
        <Circle cx={90} cy={40} r={2.5} />
        <Circle cx={60} cy={30} r={2.5} />
      </G>
      <Ellipse cx={42} cy={46} rx={10} ry={9} fill="#FFFFFF" />
      <Ellipse cx={78} cy={46} rx={10} ry={9} fill="#FFFFFF" />
      <Eye cx={43} cy={47} r={5.5} mood={mood} />
      <Eye cx={77} cy={47} r={5.5} mood={mood} />
      <Circle cx={54} cy={60} r={2} fill={SCALE_DARK} />
      <Circle cx={66} cy={60} r={2} fill={SCALE_DARK} />
      <Cheeks y={62} left={28} right={92} r={6} />
      {mood === "talking" ? (
        <Path d="M60 76 L60 86 M60 86 L56 91 M60 86 L64 91" stroke={TONGUE} strokeWidth={3} strokeLinecap="round" />
      ) : null}
      <Mouth cx={60} cy={68} width={26} mood={mood === "talking" ? "happy" : mood} />
    </Svg>
  );
}
