import { client } from "@/api/openapi-client/client.gen";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, "");

/**
 * Configure the global API client
 */
client.setConfig({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Helper to get the base URL for other uses (like images)
 */
export const getApiBaseUrl = () => API_BASE_URL;

/**
 * Centralized API client export
 */
export { client as apiClient };
