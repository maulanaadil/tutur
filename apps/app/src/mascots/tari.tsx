import Svg, { Ellipse, Path } from "react-native-svg";
import { Cheeks, Eye, Mouth, type Mood } from "./parts";

const FUR = "#B97A4B";
const FUR_DARK = "#9A6038";
const FACE = "#F0D2AC";
const EAR = "#F4A9A0";
const IRIS = "#F5A623";

export function Tari({ mood }: { mood: Mood }) {
  return (
    <Svg viewBox="0 0 120 120" width="100%" height="100%">
      <Ellipse cx={24} cy={32} rx={19} ry={21} fill={FUR_DARK} />
      <Ellipse cx={24} cy={33} rx={11} ry={13} fill={EAR} />
      <Ellipse cx={96} cy={32} rx={19} ry={21} fill={FUR_DARK} />
      <Ellipse cx={96} cy={33} rx={11} ry={13} fill={EAR} />
      <Path d="M32 118 Q32 80 60 80 Q88 80 88 118 Z" fill={FUR} />
      <Ellipse cx={60} cy={104} rx={16} ry={13} fill={FACE} />
      <Ellipse cx={60} cy={56} rx={41} ry={37} fill={FUR} />
      <Path d="M22 58 Q22 32 44 32 Q58 32 60 44 Q62 32 76 32 Q98 32 98 58 Q98 86 60 88 Q22 86 22 58 Z" fill={FACE} />
      <Eye cx={43} cy={55} r={14} mood={mood} iris={IRIS} />
      <Eye cx={77} cy={55} r={14} mood={mood} iris={IRIS} />
      <Path d="M56 68 Q60 72 64 68 Q60 66 56 68 Z" fill={FUR_DARK} />
      <Cheeks y={72} left={34} right={86} r={6} />
      <Mouth cx={60} cy={75} width={14} mood={mood} />
      <Ellipse cx={40} cy={96} rx={7} ry={6} fill={FUR_DARK} />
      <Ellipse cx={80} cy={96} rx={7} ry={6} fill={FUR_DARK} />
    </Svg>
  );
}
