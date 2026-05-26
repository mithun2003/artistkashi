import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Online Painting Masterclasses",
  description:
    "Learn painting through cinematic masterclasses taught by working artists and gallery professionals.",
  path: "/courses",
  keywords: ["painting courses", "art masterclass", "online art classes", "artist kashi academy"],
});

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Artist Kashi Courses",
          url: `${siteUrl}/courses`,
          description:
            "Online painting masterclasses for beginners, intermediate, and advanced learners.",
        }}
      />
      {children}
    </>
  );
}

