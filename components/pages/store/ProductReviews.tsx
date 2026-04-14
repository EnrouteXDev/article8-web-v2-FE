"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useProductReviews } from "@/lib/queries/reviews";

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}
        />
      ))}
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10" />
        <div className="h-3 w-28 bg-primary/10 rounded" />
      </div>
      <div className="pl-12 flex flex-col gap-1.5">
        <div className="h-3 w-20 bg-primary/10 rounded" />
        <div className="h-3 w-full bg-primary/10 rounded" />
        <div className="h-3 w-4/5 bg-primary/10 rounded" />
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [page, setPage] = useState(1);
  const LIMIT = 5;

  const { data, isLoading } = useProductReviews(productId, page, LIMIT);

  const reviews = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const averageRating = data?.averageRating ?? 0;

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-baloo font-bold text-primary text-2xl">Reviews</h2>
        {!isLoading && total > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={Math.round(averageRating)} />
            <span className="font-satoshi text-sm text-primary/60">
              {averageRating.toFixed(1)} · {total} review{total !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => <ReviewSkeleton key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && reviews.length === 0 && (
        <div className="py-10 text-center">
          <p className="font-satoshi text-sm text-primary/40">No reviews yet. Be the first!</p>
        </div>
      )}

      {/* Reviews list */}
      {!isLoading && reviews.length > 0 && (
        <div className="flex flex-col gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-baloo font-bold text-sm shrink-0">
                    {review.userName[0].toUpperCase()}
                  </div>
                  <span className="font-satoshi font-semibold text-sm text-primary">
                    {review.userName}
                  </span>
                </div>
                <span className="font-satoshi text-xs text-primary/40">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <div className="pl-12">
                <StarRating rating={review.rating} />
                <p className="font-satoshi text-sm text-primary/70 mt-1">{review.comment}</p>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center gap-4">
            {page > 1 && (
              <button
                onClick={() => setPage((p) => p - 1)}
                className="font-satoshi text-sm text-primary/60 hover:text-primary transition-colors"
              >
                ← Previous
              </button>
            )}
            {page < totalPages && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="font-satoshi text-sm text-primary font-medium hover:underline"
              >
                View more…
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
