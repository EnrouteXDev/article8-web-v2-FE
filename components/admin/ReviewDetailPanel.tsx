"use client";

import { motion } from "framer-motion";
import { Send, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ReviewStatus = "Visible" | "Hidden";

export interface ProductReview {
  id: string;
  customer: string;
  reviewerName: string;
  date: string;
  detailDate: string;
  product: string;
  image: string;
  excerpt: string;
  fullReview: string;
  rating: number;
  status: ReviewStatus;
}

function ReviewStars({
  rating,
  size = "size-4",
}: {
  rating: number;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating;

        return (
          <Star
            key={index}
            className={cn(
              size,
              filled ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-gray-200 text-gray-200"
            )}
          />
        );
      })}
    </div>
  );
}

export default function ReviewDetailPanel({
  review,
  onClose,
  onStatusChange,
}: {
  review: ProductReview;
  onClose: () => void;
  onStatusChange: (status: ReviewStatus) => void;
}) {
  const isVisible = review.status === "Visible";
  const initials = review.reviewerName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/10" onClick={onClose} />

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
        className="fixed inset-y-0 right-0 z-40 flex w-[340px] flex-col border-l border-gray-200 bg-white shadow-xl"
        style={{ fontFamily: "var(--font-satoshi)" }}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">
            Review
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between px-5 py-5">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#F4C7B8] text-xs font-bold text-[#7A3A28]">
                  {initials}
                </div>
                <span className="text-sm font-medium text-[#1A1A1A]">
                  {review.reviewerName}
                </span>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isVisible}
                onClick={() =>
                  onStatusChange(isVisible ? "Hidden" : "Visible")
                }
                className={cn(
                  "flex items-center gap-2 text-xs font-medium text-[#50535B]",
                  !isVisible && "text-gray-400"
                )}
              >
                <span
                  className={cn(
                    "relative inline-flex h-[18px] w-7 items-center rounded-full transition-colors",
                    isVisible ? "bg-[#E53E52]" : "bg-gray-300"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block size-3 rounded-full bg-white transition-transform",
                      isVisible ? "translate-x-3.5" : "translate-x-0.5"
                    )}
                  />
                </span>
                {review.status}
              </button>
            </div>

            <p className="mt-5 text-[22px] leading-8 text-[#1A1A1A]">
              &quot;{review.fullReview}&quot;
            </p>

            <div className="mt-4">
              <ReviewStars rating={review.rating} />
            </div>

            <p className="mt-3 text-xs text-[#666B78]">{review.detailDate}</p>
          </div>

          <div className="mt-10">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#E4B29D] text-xs font-bold text-[#7A3A28]">
                A
              </div>
              <span className="text-sm font-medium text-[#1A1A1A]">
                Reply review
              </span>
            </div>

            <div className="rounded-xl border border-gray-200">
              <textarea
                rows={4}
                placeholder="Type message..."
                className="min-h-28 w-full resize-none rounded-t-xl px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
              <div className="flex justify-end border-t border-gray-100 px-3 py-2">
                <button className="inline-flex items-center gap-2 rounded-lg bg-[#09062A] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#151043]">
                  <Send className="size-3.5" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
