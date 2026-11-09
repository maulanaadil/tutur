import type { Metadata } from "expo-router/server";

const NAME = "Tutur";
const TAGLINE = "Papan bicara bergambar untuk anak";
export const DESCRIPTION =
  "Tutur membantu anak autis dan anak yang belum lancar bicara menyampaikan keinginannya: ketuk gambar, susun kalimat, lalu dengarkan dalam suara anak berbahasa Indonesia.";

/** The deployed origin, e.g. https://tutur.example. Link previews need absolute image URLs, so set it before deploying the web build. */
const siteUrl = process.env.EXPO_PUBLIC_SITE_URL;
const absolute = (path: string) => (siteUrl === undefined ? path : new URL(path, siteUrl).toString());

export const homeMetadata: Metadata = {
  title: `${NAME} — ${TAGLINE}`,
  description: DESCRIPTION,
  applicationName: NAME,
  keywords: ["AAC", "AAC bahasa Indonesia", "komunikasi augmentatif dan alternatif", "papan komunikasi", "autisme", "anak autis", "terapi wicara", "belajar bicara", "speech delay"],
  alternates: { canonical: absolute("/") },
  openGraph: {
    type: "website",
    siteName: NAME,
    locale: "id_ID",
    title: `${NAME} — ${TAGLINE}`,
    description: DESCRIPTION,
    url: absolute("/"),
    images: [{ url: absolute("/og-image.png"), width: 1200, height: 630, alt: "Tari si tarsius di dalam balon kata, di samping kartu bergambar aku, mau, makan" }],
  },
  twitter: { card: "summary_large_image", title: `${NAME} — ${TAGLINE}`, description: DESCRIPTION, images: [absolute("/og-image.png")] },
  appleWebApp: { title: NAME, statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

/** Typing and parent settings are app screens, not pages anyone should land on from search. */
export function screenMetadata(title: string): Metadata {
  return { title: `${title} · ${NAME}`, robots: { index: false, follow: true } };
}
