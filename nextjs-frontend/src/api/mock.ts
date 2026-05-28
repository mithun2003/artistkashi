import { PAINTINGS, COURSES } from "@/data/constants";
import { Painting, Course } from "@/types";

// Mocking API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  paintings: {
    getAll: async (): Promise<Painting[]> => {
      await delay(500);
      return PAINTINGS;
    },
    getById: async (id: number): Promise<Painting | undefined> => {
      await delay(300);
      return PAINTINGS.find((p) => p.id === id);
    },
  },
  courses: {
    getAll: async (): Promise<Course[]> => {
      await delay(500);
      return COURSES;
    },
    getById: async (id: number): Promise<Course | undefined> => {
      await delay(300);
      return COURSES.find((c) => c.id === id);
    },
  },
};