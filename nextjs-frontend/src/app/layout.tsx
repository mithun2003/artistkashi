import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";

import "./globals.css";
import { MainFooter } from "@/components/layout/MainFooter";
import { MainNavbar } from "@/components/layout/MainNavbar";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ArtistKashi",
    template: "%s | ArtistKashi",
  },
  description:
    "ArtistKashi is a cinematic luxury platform for premium art education and curated painting commerce.",
  metadataBase: new URL("https://artistkashi.com"),
  openGraph: {
    title: "ArtistKashi",
    description:
      "A cinematic luxury platform for premium art education and curated painting commerce.",
    url: "https://artistkashi.com",
    siteName: "ArtistKashi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtistKashi",
    description:
      "A cinematic luxury platform for premium art education and curated painting commerce.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${interTight.variable} font-sans antialiased`}>
        <MainNavbar />
        {children}
        <MainFooter />
      </body>
    </html>
  );
}
