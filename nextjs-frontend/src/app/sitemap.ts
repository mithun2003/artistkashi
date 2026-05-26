import type { MetadataRoute } from "next";
import { COURSES, PAINTINGS } from "@/data/constants";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/shop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/courses`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const shopRoutes: MetadataRoute.Sitemap = PAINTINGS.map((painting) => ({
    url: `${siteUrl}/shop/${painting.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const courseRoutes: MetadataRoute.Sitemap = COURSES.map((course) => ({
    url: `${siteUrl}/courses/${course.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...shopRoutes, ...courseRoutes];
}

