import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Student Dashboard",
  description:
    "Manage your enrolled courses, orders, and account settings in your dashboard.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Artist Kashi Dashboard",
          url: `${siteUrl}/dashboard`,
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
