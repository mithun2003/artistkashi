import * as z from "zod";

export const homePageSchema = z.object({
  // Hero Section
  hero: z.object({
    title: z.string().max(100, "Title is too long"),
    subtitle: z.string().max(250, "Description is too long"),
    primaryBtnText: z.string().max(30, "Button text too long"),
    ghostBtnText: z.string().max(30, "Button text too long"),
    bgImage: z.string().url("Invalid image URL"),
  }),

  // Featured Paintings Section
  featuredPaintings: z.object({
    label: z.string().max(50, "Label too long"),
    title: z.string().max(100, "Title too long"),
  }),

  // Featured Courses Section
  featuredCourses: z.object({
    label: z.string().max(50, "Label too long"),
    title: z.string().max(100, "Title too long"),
  }),

  // About Instructor Section
  about: z.object({
    label: z.string().max(50, "Label too long"),
    title: z.string().max(100, "Title too long"),
    description1: z.string().max(500, "Paragraph 1 too long"),
    description2: z.string().max(500, "Paragraph 2 too long"),
    description3: z.string().max(500, "Paragraph 3 too long"),
    instructorName: z.string().max(50, "Name too long"),
    instructorRole: z.string().max(50, "Role too long"),
    image: z.string().url("Invalid image URL"),
  }),

  // Video CTA Section
  videoCta: z.object({
    label: z.string().max(50, "Label too long"),
    title: z.string().max(100, "Title too long"),
    bgImage: z.string().url("Invalid image URL"),
  }),

  // FAQ Section
  faq: z.object({
    label: z.string().max(50, "Label too long"),
    title: z.string().max(100, "Title too long"),
    description: z.string().max(300, "Description too long"),
  }),

  // CTA Banner (Bottom)
  banner: z.object({
    label: z.string().max(50, "Label too long"),
    title: z.string().max(100, "Title too long"),
    description: z.string().max(300, "Description too long"),
    primaryBtnText: z.string().max(30, "Button text too long"),
    ghostBtnText: z.string().max(30, "Button text too long"),
  }),
});

export type HomePageSettings = z.infer<typeof homePageSchema>;

export const defaultHomeSettings: HomePageSettings = {
  hero: {
    title: "Paint.\nCollect.\nMaster.",
    subtitle: "A singular platform for those who take the painted world seriously — original works, masterclass curriculum, and an uncompromising aesthetic.",
    primaryBtnText: "Begin Learning",
    ghostBtnText: "View Paintings",
    bgImage: "https://images.unsplash.com/photo-1774126512715-5a8858c579c9?w=1800&h=1100&fit=crop&auto=format",
  },
  featuredPaintings: {
    label: "Original Works",
    title: "Paintings\nAvailable Now",
  },
  featuredCourses: {
    label: "Masterclass Series",
    title: "Learn from\nMaster Painters",
  },
  about: {
    label: "The Artist Behind the Vision",
    title: "Mastering the Art of Visual Storytelling",
    description1: "With over two decades of professional experience in contemporary oil painting and classical Artist techniques, Kashi has dedicated his life to the pursuit of artistic excellence and the preservation of master-level craftsmanship.",
    description2: "His work is characterized by a profound understanding of light, shadow, and the emotional resonance of color. As the founder of Artist Kashi Academy, he bridges the gap between traditional methods and modern expression, empowering thousands of students globally to find their unique voice.",
    description3: "Kashi's philosophy centers on the belief that technical mastery is the foundation of true creative freedom. Through his uncompromising curriculum, he provides the tools necessary for serious artists to transcend mere representation and create works of lasting impact.",
    instructorName: "Kashi",
    instructorRole: "Lead Instructor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&auto=format",
  },
  videoCta: {
    label: "Inside the Studio",
    title: "Watch How a Painting Comes to Life",
    bgImage: "https://images.unsplash.com/photo-1775346098886-72ab6697b331?w=1400&h=600&fit=crop&auto=format",
  },
  faq: {
    label: "Questions",
    title: "Frequently Asked",
    description: "Everything you need to know about collecting original works and enrolling in our masterclass curriculum.",
  },
  banner: {
    label: "Begin Your Journey",
    title: "The Canvas\nAwaits You",
    description: "Join a community of serious painters and collectors who have made Artist Kashi their studio, gallery, and academy.",
    primaryBtnText: "Explore Courses",
    ghostBtnText: "Browse Originals",
  },
};
