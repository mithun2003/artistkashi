"use client";

import { useState, useCallback } from "react";
import { X, Star } from "lucide-react";
import { submitReview } from "@/api/review";
import { ReviewType } from "@/types/reviews";

interface ReviewSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  reviewType?: ReviewType;
  entityId?: number;
  entityName?: string;
}

export function ReviewSubmitModal({
  isOpen,
  onClose,
  onSuccess,
  reviewType = "site",
  entityId,
  entityName,
}: ReviewSubmitModalProps) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        await submitReview({
          type: reviewType,
          entity_id: entityId,
          rating,
          text,
        });

        setText("");
        setRating(5);
        onClose();
        onSuccess?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit review");
      } finally {
        setLoading(false);
      }
    },
    [reviewType, entityId, rating, text, onClose, onSuccess],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Share Your Review</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {entityName && (
          <p className="text-sm text-gray-600 mb-4">
            Reviewing: <span className="font-semibold">{entityName}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    className={
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="review-text" className="block text-sm font-medium mb-2">
              Your Review
            </label>
            <textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              minLength={1}
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {text.length}/1000 characters
            </p>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Your review will be moderated before appearing publicly.
        </p>
      </div>
    </div>
  );
}
