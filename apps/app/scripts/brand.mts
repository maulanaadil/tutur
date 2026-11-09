/**
 * Renders the app icon, Android adaptive layers, splash, favicon, web manifest icons and the
 * social preview image from one drawing of Tari. Run with `pnpm --filter @tutur/app brand`.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const appDir = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const symbolFile = (code: string) => fileURLToPath(new URL(`../../../packages/symbols/svg/${code}.svg`, import.meta.url));

const TEAL = "#0F7F70";
const TEAL_DEEP = "#0A5C51";
const CREAM = "#FFF8EE";
const INK = "#2A2836";

/** Tari's head from src/mascots/tari.tsx, happy mood, in its 120-unit space. */
const tariHead = `
  <ellipse cx="24" cy="32" rx="19" ry="21" fill="#9A6038"/>
  <ellipse cx="24" cy="33" rx="11" ry="13" fill="#F4A9A0"/>
  <ellipse cx="96" cy="32" rx="19" ry="21" fill="#9A6038"/>
  <ellipse cx="96" cy="33" rx="11" ry="13" fill="#F4A9A0"/>
  <ellipse cx="60" cy="56" rx="41" ry="37" fill="#B97A4B"/>
  <path d="M22 58 Q22 32 44 32 Q58 32 60 44 Q62 32 76 32 Q98 32 98 58 Q98 86 60 88 Q22 86 22 58 Z" fill="#F0D2AC"/>
  <circle cx="43" cy="55" r="14" fill="#F5A623"/>
  <circle cx="43" cy="55" r="8.1" fill="${INK}"/>
  <circle cx="46.1" cy="51.9" r="2.9" fill="#FFFFFF"/>
  <circle cx="77" cy="55" r="14" fill="#F5A623"/>
  <circle cx="77" cy="55" r="8.1" fill="${INK}"/>
  <circle cx="80.1" cy="51.9" r="2.9" fill="#FFFFFF"/>
  <path d="M56 68 Q60 72 64 68 Q60 66 56 68 Z" fill="#9A6038"/>
  <g opacity="0.55"><ellipse cx="34" cy="72" rx="6" ry="4.2" fill="#F59AA8"/><ellipse cx="86" cy="72" rx="6" ry="4.2" fill="#F59AA8"/></g>
  <path d="M53 75 Q60 82.7 67 75" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none"/>`;

/** A speech bubble with Tari inside: "tutur" means speech. Drawn in a 1024 space, centred. */
function bubbleWithTari({ bubble = CREAM, scale = 1 } = {}): string {
  const bubblePath = "M512 168 C732 168 860 290 860 470 C860 650 732 770 512 770 C470 770 430 766 394 758 L262 846 L292 724 C206 672 164 584 164 470 C164 290 292 168 512 168 Z";
  return `<g transform="translate(512 512) scale(${scale}) translate(-512 -512)">
    <path d="${bubblePath}" fill="${bubble}"/>
    <g transform="translate(212 186) scale(5)">${tariHead}</g>
  </g>`;
}

const svg = (body: string, background?: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${background ? `<rect width="1024" height="1024" fill="${background}"/>` : ""}${body}</svg>`;

/** Android masks adaptive icons to the inner 66%, so the foreground art shrinks to fit that circle. */
const ADAPTIVE_SAFE_SCALE = 0.72;

/** Themed (Material You) icons are one colour; the bubble keeps its shape and the eyes are cut out. */
const monochrome = `<path fill="#000" fill-rule="evenodd" transform="translate(512 512) scale(${ADAPTIVE_SAFE_SCALE}) translate(-512 -512)" d="M512 168 C732 168 860 290 860 470 C860 650 732 770 512 770 C470 770 430 766 394 758 L262 846 L292 724 C206 672 164 584 164 470 C164 290 292 168 512 168 Z M357 461 a70 70 0 1 0 140 0 a70 70 0 1 0 -140 0 Z M527 461 a70 70 0 1 0 140 0 a70 70 0 1 0 -140 0 Z"/>`;

async function png(markup: string, size: number, path: string) {
  await sharp(Buffer.from(markup)).resize(size, size).png().toFile(appDir(path));
}

async function symbolDataUri(code: string): Promise<string> {
  return `data:image/svg+xml;base64,${Buffer.from(await readFile(symbolFile(code))).toString("base64")}`;
}

/** 1200×630 link preview: the icon beside three board tiles that build "aku mau makan". */
async function socialPreview(): Promise<string> {
  const tiles = [
    { code: "1F64B", fill: "#FFF3C4", lip: "#E5B21B" },
    { code: "1F932", fill: "#E1F5D8", lip: "#55A84A" },
    { code: "1F374", fill: "#E1F5D8", lip: "#55A84A" },
  ];
  const tileMarkup = await Promise.all(
    tiles.map(async ({ code, fill, lip }, index) => {
      const x = 560 + index * 200;
      return `<rect x="${x}" y="226" width="176" height="184" rx="32" fill="${lip}"/>
        <rect x="${x}" y="214" width="176" height="184" rx="32" fill="${fill}"/>
        <image href="${await symbolDataUri(code)}" x="${x + 28}" y="242" width="120" height="120"/>`;
    }),
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${CREAM}"/>
    <rect x="72" y="115" width="400" height="400" rx="96" fill="${TEAL_DEEP}"/>
    <rect x="72" y="103" width="400" height="400" rx="96" fill="${TEAL}"/>
    <g transform="translate(72 103) scale(0.390625)">${bubbleWithTari()}</g>
    ${tileMarkup.join("\n")}
  </svg>`;
}

const icon = svg(bubbleWithTari(), TEAL);
const maskableIcon = svg(bubbleWithTari({ scale: 0.8 }), TEAL);

await png(icon, 1024, "assets/images/icon.png");
await png(svg(bubbleWithTari({ scale: ADAPTIVE_SAFE_SCALE })), 1024, "assets/images/android-icon-foreground.png");
await png(svg("", TEAL), 1024, "assets/images/android-icon-background.png");
await png(svg(monochrome), 1024, "assets/images/android-icon-monochrome.png");
await png(svg(`<g transform="translate(212 186) scale(5)">${tariHead}</g>`), 1024, "assets/images/splash-icon.png");
await png(icon, 48, "assets/images/favicon.png");
await png(icon, 180, "public/apple-touch-icon.png");
await png(icon, 192, "public/icon-192.png");
await png(icon, 512, "public/icon-512.png");
await png(maskableIcon, 512, "public/icon-maskable-512.png");
await sharp(Buffer.from(await socialPreview())).png().toFile(appDir("public/og-image.png"));
process.stdout.write("Rendered icons, splash and social preview.\n");
