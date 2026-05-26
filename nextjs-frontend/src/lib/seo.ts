import type { Metadata } from "next";

const FALLBACK_SITE_URL = "https://artistkashi.com";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  FALLBACK_SITE_URL
).replace(/\/$/, "");

export const siteName = "Artist Kashi";

const defaultOgImage =
  "https://images.unsplash.com/photo-1774126512715-5a8858c579c9?w=1800&h=1100&fit=crop&auto=format";

type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  image?: string;
};

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false,
  type = "website",
  image = defaultOgImage,
}: BuildMetadataOptions): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            "max-image-preview": "none",
            "max-snippet": 0,
            "max-video-preview": 0,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

