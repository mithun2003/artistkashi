import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Original Paintings & Art Prints",
  description:
    "Discover original paintings and curated art prints from Artist Kashi, with provenance and worldwide shipping.",
  path: "/shop",
  keywords: [
    "original paintings",
    "art prints",
    "fine art",
    "artist kashi shop",
  ],
});

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Artist Kashi Shop",
          url: `${siteUrl}/shop`,
          description:
            "Original paintings and curated art prints from Artist Kashi.",
        }}
      />
      {children}
    </>
  );
}
