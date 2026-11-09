import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { Eye, INK, Mouth, type Mood } from "./parts";

const FUR = "#D9662E";
const FUR_DARK = "#B64F1F";
const FACE = "#F6CBA6";

export function Oki({ mood }: { mood: Mood }) {
  const armsUp = mood === "cheer";
  return (
    <Svg viewBox="0 0 120 120" width="100%" height="100%">
      {armsUp ? (
        <>
          <Path d="M30 86 Q8 60 14 34" stroke={FUR_DARK} strokeWidth={13} strokeLinecap="round" fill="none" />
          <Path d="M90 86 Q112 60 106 34" stroke={FUR_DARK} strokeWidth={13} strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <Path d="M30 80 Q10 96 22 114" stroke={FUR_DARK} strokeWidth={13} strokeLinecap="round" fill="none" />
          <Path d="M90 80 Q110 96 98 114" stroke={FUR_DARK} strokeWidth={13} strokeLinecap="round" fill="none" />
        </>
      )}
      <Path d="M30 120 Q28 78 60 78 Q92 78 90 120 Z" fill={FUR} />
      <Ellipse cx={60} cy={104} rx={18} ry={14} fill={FUR_DARK} opacity={0.35} />
      <Path d="M42 22 L46 8 L52 20 L58 4 L64 20 L72 8 L76 22 Z" fill={FUR} />
      <Ellipse cx={60} cy={52} rx={40} ry={36} fill={FUR} />
      <Circle cx={46} cy={50} r={16} fill={FACE} />
      <Circle cx={74} cy={50} r={16} fill={FACE} />
      <Ellipse cx={60} cy={70} rx={22} ry={16} fill={FACE} />
      <Eye cx={47} cy={50} r={6} mood={mood} />
      <Eye cx={73} cy={50} r={6} mood={mood} />
      <Circle cx={56} cy={63} r={1.8} fill={INK} />
      <Circle cx={64} cy={63} r={1.8} fill={INK} />
      <Mouth cx={60} cy={71} width={18} mood={mood} />
    </Svg>
  );
}
