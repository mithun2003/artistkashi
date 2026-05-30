import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Search Artworks & Courses",
  description:
    "Search across Artist Kashi artworks and painting courses to quickly find what you want to collect or learn.",
  path: "/search",
  keywords: ["search artworks", "search courses", "artist kashi search"],
});

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SearchResultsPage",
          name: "Artist Kashi Search",
          url: `${siteUrl}/search`,
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
