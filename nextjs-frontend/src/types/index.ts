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

export interface Painting {
  id: number;
  title: string;
  medium: string;
  price: number;
  image: string;
  sold: boolean;
}

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  instructor: string;
  level: string;
  lessons: number;
  hours: string;
  students: number;
  rating: number;
  price: number;
  image: string;
  tags: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface CurriculumSection {
  section: string;
  lessons: string[];
}

/**
 * API Response Standardized Types
 */
export interface ApiResponseMeta {
  timestamp: string;
  error_code?: string;
}

export interface ApiResponseSuccess<T> {
  status?: number;
  success: true;
  message: string;
  data: T;
  meta: ApiResponseMeta;
}

export interface ApiResponseError {
  status?: number;
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  meta: ApiResponseMeta;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export interface UserData {
  id: number | string;
  name: string;
  email: string;
  is_active?: boolean;
}

export interface LoginResponseData {
  user: UserData;
  access_token: string;
  refresh_token?: string;
}

export type LoginResponse = ApiResponseSuccess<LoginResponseData>;
