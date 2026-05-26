import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Lesson Player",
  description: "Private lesson player for enrolled Artist Kashi students.",
  path: "/lesson-player",
  noIndex: true,
});

export default function LessonPlayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Artist Kashi Lesson Player",
          url: `${siteUrl}/lesson-player`,
          isPartOf: {
            "@type": "WebSite",
            name: "Artist Kashi",
            url: siteUrl,
          },
        }}
      />
      {children}
    </>
  );
}

