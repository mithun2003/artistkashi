import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Console",
  description: "Instructor and admin management console for Artist Kashi.",
  path: "/admin",
  noIndex: true,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Artist Kashi Admin",
          url: `${siteUrl}/admin`,
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

