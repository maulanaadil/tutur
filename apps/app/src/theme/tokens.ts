import type { WordKind } from "@tutur/vocab";

export const color = {
  canvas: "#FFF8EE",
  surface: "#FFFFFF",
  surfaceLip: "#E7DCCB",
  line: "#EFE4D3",
  ink: "#2A2836",
  inkSoft: "#5F5B6E",
  primary: "#0F7F70",
  primaryLip: "#0A5C51",
  onPrimary: "#FFFFFF",
  sun: "#FFC73A",
  sunSoft: "#FFF1C7",
  focus: "#2F74BE",
} as const;

type KindStyle = { readonly fill: string; readonly lip: string; readonly label: string };

export const kindColor: Record<WordKind, KindStyle> = {
  person: { fill: "#FFF3C4", lip: "#E5B21B", label: "orang" },
  action: { fill: "#E1F5D8", lip: "#55A84A", label: "kegiatan" },
  describe: { fill: "#DEEBFF", lip: "#4A86D9", label: "sifat" },
  thing: { fill: "#FFE7D1", lip: "#E58A3A", label: "benda" },
  social: { fill: "#FDE2EE", lip: "#D9668F", label: "sapaan" },
  negation: { fill: "#FFDCD8", lip: "#D9544A", label: "tidak" },
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { md: 14, lg: 20, xl: 28, pill: 999 } as const;

export const PRESS_DEPTH = 5;

const font = {
  display: "Baloo2_700Bold",
  displayHeavy: "Baloo2_800ExtraBold",
  body: "Nunito_600SemiBold",
  bodyBold: "Nunito_800ExtraBold",
} as const;

export const type = {
  title: { fontFamily: font.displayHeavy, fontSize: 28, lineHeight: 34 },
  heading: { fontFamily: font.display, fontSize: 22, lineHeight: 28 },
  tile: { fontFamily: font.bodyBold, fontSize: 18, lineHeight: 22 },
  body: { fontFamily: font.body, fontSize: 17, lineHeight: 26 },
  label: { fontFamily: font.bodyBold, fontSize: 15, lineHeight: 20 },
} as const;

export const motion = {
  spring: { damping: 14, stiffness: 220 },
  wordGapMs: 120,
} as const;

export const WIDE_LAYOUT_MIN = 768;
