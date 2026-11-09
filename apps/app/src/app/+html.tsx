import { ScrollViewStyleReset, useServerDocumentContext } from "expo-router/html";
import type { PropsWithChildren } from "react";
import { DESCRIPTION } from "@/seo/metadata";
import { color } from "@/theme/tokens";

const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tutur",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Android, iOS, Web",
  inLanguage: "id",
  description: DESCRIPTION,
  audience: { "@type": "PeopleAudience", audienceType: "Anak yang sedang belajar bicara, orang tua dan terapis" },
});

/** Runs only in Node while the web build is pre-rendered; it never ships to the browser or native apps. */
export default function Root({ children }: PropsWithChildren) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } = useServerDocumentContext();
  return (
    <html lang="id" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content={color.primary} />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
        <ScrollViewStyleReset />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        <noscript>
          <h1>Tutur — Papan bicara bergambar untuk anak</h1>
          <p>{DESCRIPTION}</p>
          <p>Aktifkan JavaScript untuk memakai Tutur.</p>
        </noscript>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
