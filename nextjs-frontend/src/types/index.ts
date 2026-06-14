/**
 * Application UI specific types
 */

export type Page =
  | "home"
  | "courses"
  | "course-detail"
  | "lesson-player"
  | "shop"
  | "product-detail"
  | "dashboard"
  | "admin"
  | "login"
  | "signup"
  | "search";

export interface CurriculumSection {
  section: string;
  lessons: string[];
}
