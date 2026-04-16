"use client";

import { motion } from "framer-motion";
import { Star, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { AdminReview } from "@/lib/types";

function ReviewStars({ rating, size = "size-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            size,
            index < rating ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
    </div>
  );
}

function formatDetailDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ReviewDetailPanel({
  review,
  onClose,
  onHide,
  isHiding,
}: {
  review: AdminReview;
  onClose: () => void;
  onHide: (reviewId: string) => void;
  isHiding?: boolean;
}) {
  const initials = review.userName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const productImage = review.product?.images?.[0];

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/10" onClick={onClose} />

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
        className="fixed inset-y-0 right-0 z-40 flex w-full md:w-[340px] flex-col border-l border-gray-200 bg-white shadow-xl"
        style={{ fontFamily: "var(--font-satoshi)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">Review</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-5">
          {/* Reviewer */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-[#F4C7B8] text-xs font-bold text-[#7A3A28]">
                {initials}
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">{review.userName}</p>
                <p className="text-xs text-[#667085]">{review.userEmail}</p>
              </div>
            </div>

            {/* Status badge */}
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
          </div>

          {/* Product */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {productImage ? (
                <Image src={productImage} alt={review.productName} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300 text-xs">No img</div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-[#1A1A1A]">{review.productName}</p>
              <p className="text-xs text-[#667085]">Qty ordered: {review.quantityOrdered}</p>
            </div>
          </div>

          {/* Review content */}
          <div>
            <p className="text-[20px] leading-8 text-[#1A1A1A]">
              &quot;{review.comment}&quot;
            </p>
            <div className="mt-3">
              <ReviewStars rating={review.rating} />
            </div>
            <p className="mt-2 text-xs text-[#666B78]">{formatDetailDate(review.createdAt)}</p>
          </div>

          {/* Order ref */}
          {review.order?.orderNumber && (
            <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-[#667085]">
              Order: <span className="font-medium text-[#344054]">{review.order.orderNumber}</span>
            </div>
          )}

          {/* Hide action */}
          {!review.isHidden && (
            <button
              type="button"
              disabled={isHiding}
              onClick={() => onHide(review.id)}
              className="mt-auto w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              {isHiding ? "Hiding…" : "Hide review"}
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}
