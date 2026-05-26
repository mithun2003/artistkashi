import React, { Suspense } from "react";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Login",
  description: "Sign in to access your Artist Kashi courses, orders, and account dashboard.",
  path: "/login",
  noIndex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Artist Kashi Login",
          url: `${siteUrl}/login`,
          isPartOf: {
            "@type": "WebSite",
            name: "Artist Kashi",
            url: siteUrl,
          },
        }}
      />
      <Suspense fallback={<div />}>{children}</Suspense>
    </>
  );
}

