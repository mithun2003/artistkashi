export type ReviewType = "site" | "product" | "painting";
export type ReviewStatus = "pending" | "approved" | "blocked";

export interface ReviewBase {
  type: ReviewType;
  entity_id?: number | null;
  rating: number;
  text: string;
}

export type ReviewCreate = ReviewBase;

export interface ReviewRead extends ReviewBase {
  id: string;
  user_id: string;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

export interface ReviewReadPublic extends ReviewBase {
  id: string;
  status: ReviewStatus;
  created_at: string;
}

export interface ReviewUpdate {
  status?: ReviewStatus;
  rating?: number;
  text?: string;
}
