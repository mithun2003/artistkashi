import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { COURSES } from "@/data/constants";
import { buildMetadata, siteUrl } from "@/lib/seo";

type CourseDetailLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const course = COURSES.find((item) => item.id === Number(id));

  if (!course) {
    return buildMetadata({
      title: "Course Not Found",
      description:
        "The requested course could not be found in the Artist Kashi academy.",
      path: `/courses/${id}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${course.title} - Masterclass`,
    description: `${course.subtitle} Learn with ${course.instructor}. ${course.lessons} lessons over ${course.hours}.`,
    path: `/courses/${course.id}`,
    type: "article",
    image: course.image,
    keywords: [
      course.title,
      course.level,
      "painting course",
      "art masterclass",
    ],
  });
}

export default async function CourseDetailLayout({
  children,
  params,
}: CourseDetailLayoutProps) {
  const { id } = await params;
  const course = COURSES.find((item) => item.id === Number(id));

  const schema = course
    ? {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.title,
        description: course.subtitle,
        provider: {
          "@type": "Organization",
          name: "Artist Kashi",
          url: siteUrl,
        },
        image: [course.image],
        offers: {
          "@type": "Offer",
          priceCurrency: "EUR",
          price: course.price.toString(),
          category: "Online Course",
          url: `${siteUrl}/courses/${course.id}`,
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Course Not Found",
        url: `${siteUrl}/courses/${id}`,
      };

  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
