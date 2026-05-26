import type { Metadata } from "next";
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
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
