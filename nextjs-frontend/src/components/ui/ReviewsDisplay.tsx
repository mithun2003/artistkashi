"use client";

import { useState, useEffect } from "react";
import { Star, Plus } from "lucide-react";
import {
  listReviews,
  ReviewReadPublic,
  ReviewType,
} from "@/api/openapi-client";
import { ReviewSubmitModal } from "./ReviewSubmitModal";
import { useAuth } from "@/lib/auth-store";
import { unwrapPaginated } from "@/api/client-service";

interface ReviewsDisplayProps {
  reviewType: ReviewType;
  entityId?: number;
  entityName?: string;
  limit?: number;
  showSubmitButton?: boolean;
  onReviewSubmitted?: () => void;
}

export function ReviewsDisplay({
  reviewType,
  entityId,
  entityName,
  limit = 10,
  showSubmitButton = true,
  onReviewSubmitted,
}: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<ReviewReadPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const { data } = await unwrapPaginated(
          listReviews({
            query: {
              review_type: reviewType,
              entity_id: entityId,
              limit,
            },
          })
        );
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [reviewType, entityId, limit]);

  const handleReviewSubmitted = async () => {
    setShowModal(false);
    // Reload reviews after submission
    const { data } = await unwrapPaginated(
      listReviews({
        query: {
          review_type: reviewType,
          entity_id: entityId,
          limit,
        },
      })
    );
    setReviews(data);
    onReviewSubmitted?.();
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading reviews...</div>
    );
  }

  return (
    <div className="space-y-4">
      {showSubmitButton && user && (
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Your Review
        </button>
      )}

      {!user && showSubmitButton && (
        <p className="text-sm text-gray-600 italic">
          Please log in to submit a review.
        </p>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to review!
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{review.text}</p>
            </div>
          ))}
        </div>
      )}

      <ReviewSubmitModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleReviewSubmitted}
        reviewType={reviewType}
        entityId={entityId}
        entityName={entityName}
      />
    </div>
  );
}
