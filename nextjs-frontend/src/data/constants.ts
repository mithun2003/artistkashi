import {
  ProductCardRead,
  CourseRead,
  TestimonialItem,
  FaqItem,
} from "@/api/openapi-client";
import { CurriculumSection } from "@/types";

export const PAINTINGS: ProductCardRead[] = [
  {
    id: 1,
    title: "Solitude in Ochre",
    slug: "solitude-in-ochre",
    medium: {
      id: 1,
      name: "Oil on linen, 120 × 90 cm",
      slug: "oil",
      is_active: true,
    },
    price: "4800",
    primary_image:
      "https://images.unsplash.com/photo-1541512416146-3cf58d6b27cc?w=600&h=750&fit=crop&auto=format",
    is_sold: false,
  },
  {
    id: 2,
    title: "The Weight of Silence",
    slug: "the-weight-of-silence",
    medium: {
      id: 1,
      name: "Oil on canvas, 100 × 80 cm",
      slug: "oil",
      is_active: true,
    },
    price: "3600",
    primary_image:
      "https://images.unsplash.com/photo-1566410824233-a8011929225c?w=600&h=750&fit=crop&auto=format",
    is_sold: false,
  },
  {
    id: 3,
    title: "Nocturne No. 7",
    slug: "nocturne-no-7",
    medium: {
      id: 2,
      name: "Acrylic on board, 60 × 80 cm",
      slug: "acrylic",
      is_active: true,
    },
    price: "2200",
    primary_image:
      "https://images.unsplash.com/photo-1556139930-c23fa4a4f934?w=600&h=750&fit=crop&auto=format",
    is_sold: true,
  },
];

export const COURSES: CourseRead[] = [
  {
    id: 1,
    title: "Oil Painting Fundamentals",
    subtitle: "From blank canvas to confident composition",
    instructor: "Elena Marchetti",
    duration: "18h 30m",
    students_count: 2847,
    lessons_count: 42,
    rating: 4.9,
    price: 280,
    image_url:
      "https://images.unsplash.com/photo-1621975496579-6bd9e8c6ab65?w=700&h=420&fit=crop&auto=format",
    category: "Oil",
    description: "Learn the fundamentals of oil painting.",
    featured: true,
    is_active: true,
  },
  {
    id: 2,
    title: "Advanced Portrait Mastery",
    subtitle: "Light, likeness, and emotional depth in portraiture",
    instructor: "James Okafor",
    duration: "26h 15m",
    students_count: 1203,
    lessons_count: 56,
    rating: 4.8,
    price: 420,
    image_url:
      "https://images.unsplash.com/photo-1774126512715-5a8858c579c9?w=700&h=420&fit=crop&auto=format",
    category: "Portrait",
    description: "Master the art of portraiture.",
    featured: false,
    is_active: true,
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Amara Nwosu",
    role: "Emerging Artist, Lagos",
    text: "Artist Kashi transformed how I see and work. The lesson player is distraction-free in a way no other platform has managed. I finished three completed paintings in my first month.",
    rating: 5,
    avatar: "AN",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do I own the artworks I purchase permanently?",
    answer:
      "Yes. Every purchase includes a certificate of provenance, full transfer of ownership, and lifetime access to digital documentation. Physical works ship within 7–14 days in bespoke archival packaging.",
  },
];

export const CURRICULUM: CurriculumSection[] = [
  {
    section: "01. Foundation",
    lessons: [
      "Introduction to the Artist method",
      "Understanding your materials",
      "Color theory for oil painters",
      "The value study system",
    ],
  },
];
