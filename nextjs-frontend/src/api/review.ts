import { apiClient } from "@/lib/api-client";
import {
  type ReviewCreate,
  type ReviewRead,
  type ReviewReadPublic,
} from "@/types/reviews";

const buildUrl = (path: string) => `${apiClient.getConfig().baseURL}${path}`;

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail ?? `Request failed with status ${response.status}`
    );
  }

  const payload = await response.json();
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "data" in payload
  ) {
    return payload.data as T;
  }

  return payload as T;
}

/**
 * Fetch approved reviews for public display
 */
export async function fetchApprovedReviews(
  type?: string,
  entityId?: number,
  skip?: number,
  limit?: number
): Promise<ReviewReadPublic[]> {
  const params = new URLSearchParams();
  if (type) params.append("review_type", type);
  if (entityId !== undefined) params.append("entity_id", entityId.toString());
  if (skip !== undefined) params.append("skip", skip.toString());
  if (limit !== undefined) params.append("limit", limit.toString());

  const query = params.toString();
  const url = `/reviews${query ? `?${query}` : ""}`;

  try {
    return await requestJson<ReviewReadPublic[]>(url);
  } catch {
    return [];
  }
}

/**
 * Submit a new review (requires authentication)
 */
export async function submitReview(review: ReviewCreate): Promise<ReviewRead> {
  return requestJson<ReviewRead>("/reviews", {
    method: "POST",
    body: JSON.stringify(review),
  });
}

/**
 * Get current user's reviews
 */
export async function fetchMyReviews(): Promise<ReviewRead[]> {
  try {
    return await requestJson<ReviewRead[]>("/reviews/user/my-reviews");
  } catch {
    return [];
  }
}

/**
 * Admin: Get all reviews with filters
 */
export async function fetchAllReviews(
  type?: string,
  entityId?: number,
  status?: string,
  skip?: number,
  limit?: number
): Promise<ReviewRead[]> {
  const params = new URLSearchParams();
  if (type) params.append("review_type", type);
  if (entityId !== undefined) params.append("entity_id", entityId.toString());
  if (status) params.append("status", status);
  if (skip !== undefined) params.append("skip", skip.toString());
  if (limit !== undefined) params.append("limit", limit.toString());

  const query = params.toString();
  const url = `/admin/reviews${query ? `?${query}` : ""}`;

  try {
    return await requestJson<ReviewRead[]>(url);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    throw error;
  }
}

/**
 * Admin: Get single review
 */
export async function fetchReview(reviewId: string): Promise<ReviewRead> {
  return requestJson<ReviewRead>(`/admin/reviews/${reviewId}`);
}

/**
 * Admin: Update review status or content
 */
export async function updateReview(
  reviewId: string,
  updates: { status?: string; rating?: number; text?: string }
): Promise<ReviewRead> {
  return requestJson<ReviewRead>(`/admin/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/**
 * Admin: Delete review
 */
export async function deleteReview(reviewId: string): Promise<void> {
  await requestJson(`/admin/reviews/${reviewId}`, {
    method: "DELETE",
  });
}
