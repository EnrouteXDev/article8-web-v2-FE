"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Filter,
  MoreVertical,
  RotateCcw,
  Search,
  Star,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminPage from "@/components/admin/shared/AdminPage";
import ReviewDetailPanel from "@/components/admin/ReviewDetailPanel";
import { useReviews, useHideReview } from "@/lib/queries/reviews";
import type { AdminReview, ReviewFilters } from "@/lib/types";

const LIMIT = 20;

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "size-4",
            index < rating ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
    </div>
  );
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function ReviewRowSkeleton() {
  return (
    <tr className="border-b border-[#F2F4F7]">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-gray-100 animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function ReviewCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="size-10 rounded-lg bg-gray-100 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 w-32 bg-gray-100 rounded" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-3 w-48 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function ReviewsPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [menuReviewId, setMenuReviewId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [hideReviewId, setHideReviewId] = useState<string | null>(null);

  const filters: ReviewFilters = {
    page,
    limit: LIMIT,
    ...(search.trim() ? { productName: search.trim() } : {}),
    ...(selectedRating !== null ? {} : {}), // rating filter not supported by API, done client-side
  };

  const { data, isLoading } = useReviews(filters);
  const { mutate: hideReview, isPending: isHiding } = useHideReview();

  const reviews = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  // Client-side rating filter (API doesn't support rating filter)
  const filteredReviews = selectedRating !== null
    ? reviews.filter((r) => r.rating === selectedRating)
    : reviews;

  const confirmHide = () => {
    if (!hideReviewId) return;
    hideReview(hideReviewId, {
      onSuccess: () => {
        setHideReviewId(null);
        if (selectedReview?.id === hideReviewId) setSelectedReview(null);
      },
    });
  };

  return (
    <AdminPage className="flex flex-col gap-6">
      <div className="rounded-xl bg-white p-4 md:p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[18px] font-semibold text-[#202227]">Reviews on products</h1>
            <p className="mt-1 text-xs text-[#707580]">
              {isLoading ? "Loading…" : `${total} reviews found`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-[228px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by product…"
                className="h-10 w-full rounded-lg border border-[#D0D5DD] bg-white pl-9 pr-3 text-sm text-[#344054] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#B3B8C5]"
              />
            </div>

            {/* Rating filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((o) => !o)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-4 text-sm font-medium text-[#344054] transition-colors hover:bg-gray-50"
              >
                <Filter className="size-4 text-[#667085]" />
                Filters
                {selectedRating && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                    1
                  </span>
                )}
              </button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full z-20 mt-2 w-52 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_20px_45px_rgba(16,24,40,0.16)]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-[#667085]">Filter by rating</p>
                      <button
                        type="button"
                        onClick={() => { setSelectedRating(null); setFilterOpen(false); }}
                        className="inline-flex items-center gap-1 text-xs text-[#667085] transition-colors hover:text-[#344054]"
                      >
                        <RotateCcw className="size-3.5" />
                        Reset
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <label
                          key={rating}
                          className="flex cursor-pointer items-center gap-3 text-sm text-[#475467]"
                        >
                          <input
                            type="radio"
                            name="rating-filter"
                            checked={selectedRating === rating}
                            onChange={() => { setSelectedRating(rating); setFilterOpen(false); }}
                            className="size-3.5 border-gray-300 text-primary focus:ring-primary"
                          />
                          {rating} star{rating > 1 ? "s" : ""}
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="mt-5 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="bg-[#F9FAFB] text-[10px] uppercase tracking-[0.05em] text-[#667085]">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Product</th>
                <th className="px-4 py-2 font-medium">Review</th>
                <th className="px-4 py-2 font-medium">Rating</th>
                <th className="px-4 py-2 font-medium">Customer</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => <ReviewRowSkeleton key={i} />)
                : filteredReviews.map((review) => {
                    const isActive = selectedReview?.id === review.id;
                    const productImage = review.product?.images?.[0];

                    return (
                      <tr
                        key={review.id}
                        onClick={() => setSelectedReview(review)}
                        className={cn(
                          "cursor-pointer border-b border-[#F2F4F7] text-sm text-[#344054] transition-colors",
                          isActive ? "bg-[#FCFCFD]" : "hover:bg-[#FCFCFD]"
                        )}
                      >
                        <td className="px-4 py-3 text-xs text-[#667085]">
                          {formatShortDate(review.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative size-8 overflow-hidden rounded-md bg-gray-100 shrink-0">
                              {productImage && (
                                <Image src={productImage} alt={review.productName} fill className="object-cover" />
                              )}
                            </div>
                            <span className="text-xs text-[#344054]">{review.productName}</span>
                          </div>
                        </td>
                        <td className="max-w-[220px] px-4 py-3 text-xs text-[#344054]">
                          <span className="block truncate">&quot;{review.comment}&quot;</span>
                        </td>
                        <td className="px-4 py-3">
                          <RatingStars rating={review.rating} />
                        </td>
                        <td className="px-4 py-3 text-xs text-[#344054]">{review.userName}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium",
                              review.isHidden
                                ? "bg-[#F2F4F7] text-[#667085]"
                                : "bg-[#ECFDF3] text-[#027A48]"
                            )}
                          >
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                review.isHidden ? "bg-[#98A2B3]" : "bg-[#12B76A]"
                              )}
                            />
                            {review.isHidden ? "Hidden" : "Visible"}
                          </span>
                        </td>
                        <td className="relative px-4 py-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuReviewId((id) => (id === review.id ? null : review.id));
                            }}
                            className="rounded-md p-1 text-[#98A2B3] transition-colors hover:bg-gray-100 hover:text-[#475467]"
                          >
                            <MoreVertical className="size-4" />
                          </button>

                          {menuReviewId === review.id && (
                            <div
                              className="absolute right-4 top-11 z-10 min-w-36 rounded-xl border border-gray-200 bg-white py-1.5 shadow-[0_12px_24px_rgba(16,24,40,0.12)]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => { setSelectedReview(review); setMenuReviewId(null); }}
                                className="w-full px-3 py-2 text-left text-xs text-[#344054] transition-colors hover:bg-gray-50"
                              >
                                View review
                              </button>
                              {!review.isHidden && (
                                <button
                                  type="button"
                                  onClick={() => { setHideReviewId(review.id); setMenuReviewId(null); }}
                                  className="w-full px-3 py-2 text-left text-xs text-red-500 transition-colors hover:bg-gray-50"
                                >
                                  Hide review
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-5 flex flex-col gap-3 md:hidden">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <ReviewCardSkeleton key={i} />)
            : filteredReviews.map((review) => {
                const productImage = review.product?.images?.[0];
                return (
                  <button
                    key={review.id}
                    type="button"
                    onClick={() => setSelectedReview(review)}
                    className="w-full rounded-xl border border-gray-100 p-4 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {productImage && (
                          <Image src={productImage} alt={review.productName} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-[#344054] truncate">{review.productName}</p>
                          <span
                            className={cn(
                              "shrink-0 inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium",
                              review.isHidden ? "bg-[#F2F4F7] text-[#667085]" : "bg-[#ECFDF3] text-[#027A48]"
                            )}
                          >
                            {review.isHidden ? "Hidden" : "Visible"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#667085]">{review.userName}</p>
                        <RatingStars rating={review.rating} />
                        <p className="mt-1.5 text-xs text-[#344054] line-clamp-2">&quot;{review.comment}&quot;</p>
                        <p className="mt-1 text-[10px] text-[#98A2B3]">{formatShortDate(review.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
        </div>

        {/* Empty state */}
        {!isLoading && filteredReviews.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-[#667085]">No reviews found</p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-[#344054] transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-[#667085]">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-[#344054] transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedReview && (
          <ReviewDetailPanel
            review={selectedReview}
            onClose={() => setSelectedReview(null)}
            onHide={(id) => setHideReviewId(id)}
            isHiding={isHiding}
          />
        )}
      </AnimatePresence>

      {/* Hide confirm modal */}
      <AnimatePresence>
        {hideReviewId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setHideReviewId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white px-4 py-5 shadow-[0_20px_40px_rgba(16,24,40,0.18)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex size-6 items-center justify-center rounded-full border border-[#FECACA] bg-[#FEF2F2]">
                <TriangleAlert className="size-3.5 text-[#E53E52]" />
              </div>

              <h2 className="mt-5 text-[18px] font-semibold leading-6 text-[#101828]">
                Hide this review?
              </h2>
              <p className="mt-2 text-[14px] leading-5 text-[#98A2B3]">
                The review will no longer be visible to customers. This cannot be undone.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setHideReviewId(null)}
                  className="flex-1 rounded-md border border-gray-200 px-4 py-2 text-[12px] font-semibold text-[#344054] transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isHiding}
                  onClick={confirmHide}
                  className="flex-1 rounded-md bg-[#09062A] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#151043] disabled:opacity-60"
                >
                  {isHiding ? "Hiding…" : "Hide review"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminPage>
  );
}
