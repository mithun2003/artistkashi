import React, { Suspense } from "react";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sign Up",
  description:
    "Create your Artist Kashi account to enroll in courses and collect original paintings.",
  path: "/signup",
  noIndex: true,
});

export default function SignupLayout({
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
          name: "Artist Kashi Sign Up",
          url: `${siteUrl}/signup`,
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
