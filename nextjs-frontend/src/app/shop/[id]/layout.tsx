import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { PAINTINGS } from "@/data/constants";
import { buildMetadata, siteUrl } from "@/lib/seo";

type ShopProductLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const painting = PAINTINGS.find((item) => item.id === Number(id));

  if (!painting) {
    return buildMetadata({
      title: "Artwork Not Found",
      description:
        "The requested artwork could not be found in the Artist Kashi collection.",
      path: `/shop/${id}`,
      noIndex: true,
    });
  }

  const price =
    typeof painting.price === "string"
      ? parseFloat(painting.price)
      : (painting.price ?? 0);
  const mediumName = painting.medium?.name || "Original Work";

  return buildMetadata({
    title: `${painting.title} - Original Painting`,
    description: `${painting.title} by Artist Kashi. ${mediumName}. Price: €${price.toLocaleString()}.`,
    path: `/shop/${painting.id}`,
    type: "article",
    image: painting.primary_image ?? undefined,
    keywords: [painting.title, "original painting", "fine art", "artist kashi"],
  });
}

export default async function ShopProductLayout({
  children,
  params,
}: ShopProductLayoutProps) {
  const { id } = await params;
  const painting = PAINTINGS.find((item) => item.id === Number(id));

  const schema = painting
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: painting.title,
        description: painting.medium?.name || "Original Work",
        image: painting.primary_image ? [painting.primary_image] : [],
        offers: {
          "@type": "Offer",
          priceCurrency: "EUR",
          price: painting.price?.toString() || "0",
          availability: painting.is_sold
            ? "https://schema.org/SoldOut"
            : "https://schema.org/InStock",
          url: `${siteUrl}/shop/${painting.id}`,
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Artwork Not Found",
        url: `${siteUrl}/shop/${id}`,
      };

  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
