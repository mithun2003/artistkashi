import React from "react";
import type { Metadata } from "next";
import { Inter_Tight, DM_Mono } from "next/font/google";

const inter = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
});

import "./globals.css";
import { AuthProvider } from "@/lib/auth-store";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Artist Kashi | Paint. Collect. Master.",
    template: "%s | Artist Kashi",
  },
  description:
    "A singular platform for those who take the painted world seriously — original works, masterclass curriculum, and an uncompromising aesthetic.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName,
    title: "Artist Kashi | Paint. Collect. Master.",
    description:
      "A singular platform for those who take the painted world seriously — original works, masterclass curriculum, and an uncompromising aesthetic.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artist Kashi | Paint. Collect. Master.",
    description:
      "A singular platform for those who take the painted world seriously — original works, masterclass curriculum, and an uncompromising aesthetic.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmMono.variable}`}>
      <head>
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1774126512715-5a8858c579c9?w=1800&h=1100&fit=crop&auto=format"
        />
      </head>
      <body className="antialiased bg-dark">
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteName,
              url: siteUrl,
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteName,
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            },
          ]}
        />
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
