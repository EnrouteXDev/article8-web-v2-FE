"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Filter,
  MoreVertical,
  RotateCcw,
  Search,
  Star,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminPage from "@/components/admin/shared/AdminPage";
import ReviewDetailPanel, {
  type ProductReview,
  type ReviewStatus,
} from "@/components/admin/ReviewDetailPanel";

const initialReviews: ProductReview[] = [
  {
    id: "rvw-1",
    customer: "Aliyu Mudashiru",
    reviewerName: "Sarah Hassan",
    date: "15/03/21",
    detailDate: "23rd June, 2026",
    product: "Article8 Shirt",
    image: "/artifact1.jpeg",
    excerpt: "Great quality but shipping took time",
    fullReview: "Great quality but shipping took time",
    rating: 4,
    status: "Visible",
  },
  {
    id: "rvw-2",
    customer: "Aliyu Mudashiru",
    reviewerName: "Sarah Hassan",
    date: "15/03/21",
    detailDate: "23rd June, 2026",
    product: "Article8 Shirt",
    image: "/artifact2.jpeg",
    excerpt: "Great quality but shipping took time",
    fullReview: "Great quality but shipping took time",
    rating: 4,
    status: "Visible",
  },
  {
    id: "rvw-3",
    customer: "Aliyu Mudashiru",
    reviewerName: "Sarah Hassan",
    date: "15/03/21",
    detailDate: "23rd June, 2026",
    product: "Article8 Shirt",
    image: "/artifact3.jpeg",
    excerpt: "Great quality but shipping took time",
    fullReview: "Great quality but shipping took time",
    rating: 4,
    status: "Visible",
  },
  {
    id: "rvw-4",
    customer: "Aliyu Mudashiru",
    reviewerName: "Sarah Hassan",
    date: "15/03/21",
    detailDate: "23rd June, 2026",
    product: "Article8 Shirt",
    image: "/artifact4.jpeg",
    excerpt: "Great quality but shipping took time",
    fullReview: "Great quality but shipping took time",
    rating: 4,
    status: "Hidden",
  },
];

const weekdayHeaders = ["Mo", "Tu", "We", "Th", "Fr", "Sat", "Su"];
const calendarDays = [
  null,
  null,
  null,
  null,
  null,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating;

        return (
          <Star
            key={index}
            className={cn(
              "size-4",
              filled ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-gray-200 text-gray-200"
            )}
          />
        );
      })}
    </div>
  );
}

export default function ReviewsPageContent() {
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [menuReviewId, setMenuReviewId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [hideReviewId, setHideReviewId] = useState<string | null>(null);
  const [rangeStartDay, setRangeStartDay] = useState<number | null>(6);
  const [rangeEndDay, setRangeEndDay] = useState<number | null>(13);
  const [activeRangeField, setActiveRangeField] = useState<"start" | "end">(
    "start"
  );

  const filterRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (filterRef.current && !filterRef.current.contains(target)) {
        setFilterOpen(false);
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuReviewId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesSearch =
        query.length === 0 ||
        review.product.toLowerCase().includes(query) ||
        review.customer.toLowerCase().includes(query) ||
        review.excerpt.toLowerCase().includes(query);

      const matchesRating =
        selectedRating === null || review.rating === selectedRating;

      return matchesSearch && matchesRating;
    });
  }, [reviews, search, selectedRating]);

  const selectedReview =
    reviews.find((review) => review.id === selectedReviewId) ?? null;

  const formatRangeValue = (day: number | null) =>
    day ? `Jan ${day}, 2022` : "Select dates";

  const updateReviewStatus = (reviewId: string, status: ReviewStatus) => {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === reviewId ? { ...review, status } : review
      )
    );
  };

  const confirmHideReview = () => {
    if (!hideReviewId) {
      return;
    }

    updateReviewStatus(hideReviewId, "Hidden");
    setHideReviewId(null);
  };

  const handleCalendarSelect = (day: number) => {
    if (activeRangeField === "start") {
      setRangeStartDay(day);
      setActiveRangeField("end");
      return;
    }

    setRangeEndDay(day);
  };

  return (
    <AdminPage className="flex flex-col gap-6">
      <div className="rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[18px] font-semibold text-[#202227]">
              Reviews on products
            </h1>
            <p className="mt-1 text-xs text-[#707580]">
              {filteredReviews.length} reviews found
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-[228px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="h-10 w-full rounded-lg border border-[#D0D5DD] bg-white pl-9 pr-3 text-sm text-[#344054] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#B3B8C5]"
              />
            </div>

            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={() => setFilterOpen((open) => !open)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-4 text-sm font-medium text-[#344054] transition-colors hover:bg-gray-50"
              >
                <Filter className="size-4 text-[#667085]" />
                Filters
              </button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full z-20 mt-2 w-[318px] rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_20px_45px_rgba(16,24,40,0.16)]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-[#667085]">
                        Filter by rating
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRating(null);
                          setRangeStartDay(null);
                          setRangeEndDay(null);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-[#667085] transition-colors hover:text-[#344054]"
                      >
                        <RotateCcw className="size-3.5" />
                        Reset
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <label
                          key={rating}
                          className="flex cursor-pointer items-center gap-3 text-sm text-[#475467]"
                        >
                          <input
                            type="radio"
                            name="rating-filter"
                            checked={selectedRating === rating}
                            onChange={() => setSelectedRating(rating)}
                            className="size-3.5 border-gray-300 text-primary focus:ring-primary"
                          />
                          {rating} star{rating > 1 ? "s" : ""}
                        </label>
                      ))}
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-medium text-[#667085]">
                        Custom range
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveRangeField("start")}
                          className={cn(
                            "inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-xs text-[#667085] transition-colors",
                            activeRangeField === "start"
                              ? "border-primary bg-primary/5"
                              : "border-[#D0D5DD] hover:bg-gray-50"
                          )}
                        >
                          <CalendarDays className="size-3.5" />
                          {formatRangeValue(rangeStartDay)}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveRangeField("end")}
                          className={cn(
                            "inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-xs text-[#667085] transition-colors",
                            activeRangeField === "end"
                              ? "border-primary bg-primary/5"
                              : "border-[#D0D5DD] hover:bg-gray-50"
                          )}
                        >
                          <CalendarDays className="size-3.5" />
                          {formatRangeValue(rangeEndDay)}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-gray-200 p-4 shadow-[0_10px_25px_rgba(16,24,40,0.08)]">
                      <div className="mb-4 flex items-center justify-between text-sm text-[#344054]">
                        <button className="text-gray-400 transition-colors hover:text-gray-700">
                          {"<"}
                        </button>
                        <span className="font-medium">January 2022</span>
                        <button className="text-gray-400 transition-colors hover:text-gray-700">
                          {">"}
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-y-2 text-center text-[11px] text-[#667085]">
                        {weekdayHeaders.map((day) => (
                          <span key={day}>{day}</span>
                        ))}
                        {calendarDays.map((day, index) => {
                          if (!day) {
                            return <span key={`empty-${index}`} />;
                          }

                          const isSelected =
                            day === rangeStartDay || day === rangeEndDay;

                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleCalendarSelect(day)}
                              className={cn(
                                "mx-auto flex size-7 items-center justify-center rounded-full text-[11px] transition-colors",
                                isSelected
                                  ? "bg-primary text-white"
                                  : "text-[#475467] hover:bg-gray-100"
                              )}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
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
              {filteredReviews.map((review) => {
                const isActive = selectedReviewId === review.id;
                const isVisible = review.status === "Visible";

                return (
                  <tr
                    key={review.id}
                    onClick={() => setSelectedReviewId(review.id)}
                    className={cn(
                      "cursor-pointer border-b border-[#F2F4F7] text-sm text-[#344054] transition-colors",
                      isActive ? "bg-[#FCFCFD]" : "hover:bg-[#FCFCFD]"
                    )}
                  >
                    <td className="px-4 py-3 text-xs text-[#667085]">
                      {review.date}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative size-8 overflow-hidden rounded-md bg-gray-100">
                          <Image
                            src={review.image}
                            alt={review.product}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs text-[#344054]">
                          {review.product}
                        </span>
                      </div>
                    </td>
                    <td className="max-w-[250px] px-4 py-3 text-xs text-[#344054]">
                      <span className="block truncate">
                        &quot;{review.excerpt}&quot;
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <RatingStars rating={review.rating} />
                    </td>
                    <td className="px-4 py-3 text-xs text-[#344054]">
                      {review.customer}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium",
                          isVisible
                            ? "bg-[#ECFDF3] text-[#027A48]"
                            : "bg-[#F2F4F7] text-[#667085]"
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            isVisible ? "bg-[#12B76A]" : "bg-[#98A2B3]"
                          )}
                        />
                        {review.status}
                      </span>
                    </td>
                    <td
                      className="relative px-4 py-3"
                      ref={menuReviewId === review.id ? menuRef : undefined}
                    >
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setMenuReviewId((currentId) =>
                            currentId === review.id ? null : review.id
                          );
                        }}
                        className="rounded-md p-1 text-[#98A2B3] transition-colors hover:bg-gray-100 hover:text-[#475467]"
                      >
                        <MoreVertical className="size-4" />
                      </button>

                      {menuReviewId === review.id && (
                        <div
                          className="absolute right-4 top-11 z-10 min-w-36 rounded-xl border border-gray-200 bg-white py-1.5 shadow-[0_12px_24px_rgba(16,24,40,0.12)]"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReviewId(review.id);
                              setMenuReviewId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-[#344054] transition-colors hover:bg-gray-50"
                          >
                            View review
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMenuReviewId(null);
                              if (review.status === "Visible") {
                                setHideReviewId(review.id);
                                return;
                              }
                              updateReviewStatus(review.id, "Visible");
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-[#344054] transition-colors hover:bg-gray-50"
                          >
                            {review.status === "Visible"
                              ? "Hide review"
                              : "Make visible"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedReview && (
          <ReviewDetailPanel
            review={selectedReview}
            onClose={() => setSelectedReviewId(null)}
            onStatusChange={(status) => {
              if (status === "Hidden") {
                setHideReviewId(selectedReview.id);
                return;
              }

              updateReviewStatus(selectedReview.id, status);
            }}
          />
        )}
      </AnimatePresence>

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
              className="fixed left-1/2 top-1/2 z-50 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white px-4 py-3 shadow-[0_20px_40px_rgba(16,24,40,0.18)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex size-6 items-center justify-center rounded-full border border-[#FECACA] bg-[#FEF2F2]">
                <TriangleAlert className="size-3.5 text-[#E53E52]" />
              </div>

              <h2 className="mt-5 text-[18px] font-semibold leading-6 text-[#101828]">
                Are you sure you want to hide review?
              </h2>
              <p className="mt-2 text-[14px] leading-5 text-[#98A2B3]">
                Hiding this review will not make it visible to customers
              </p>

              <button
                type="button"
                onClick={confirmHideReview}
                className="mt-5 w-full rounded-md bg-[#09062A] px-4 py-2 text-[10px] font-semibold text-white transition-colors hover:bg-[#151043]"
              >
                Hide review
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminPage>
  );
}
