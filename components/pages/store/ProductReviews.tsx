"use client";

import { Star } from "lucide-react";

const MOCK_REVIEWS = [
  { name: "Davio White", date: "15th May, 2022", rating: 4, text: "The shirt quality is a fantastic and my Kids Love it" },
  { name: "Davio White", date: "15th May, 2022", rating: 4, text: "The shirt quality is a fantastic and my Kids Love it" },
  { name: "Davio White", date: "15th May, 2022", rating: 4, text: "The shirt quality is a fantastic and my Kids Love it" },
  { name: "Davio White", date: "15th May, 2022", rating: 4, text: "The shirt quality is a fantastic and my Kids Love it" },
  { name: "Davio White", date: "15th May, 2022", rating: 4, text: "The shirt quality is a fantastic and my Kids Love it" },
];

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

export default function ProductReviews() {
  return (
    <div className="flex-1">
      <h2 className="font-baloo font-bold text-primary text-2xl mb-6">Reviews</h2>
      <div className="flex flex-col gap-6">
        {MOCK_REVIEWS.map((review, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-baloo font-bold text-sm shrink-0">
                  {review.name[0]}
                </div>
                <span className="font-satoshi font-semibold text-sm text-primary">
                  {review.name}
                </span>
              </div>
              <span className="font-satoshi text-xs text-primary/40">{review.date}</span>
            </div>
            <div className="pl-12">
              <StarRating rating={review.rating} />
              <p className="font-satoshi text-sm text-primary/70 mt-1">{review.text}</p>
            </div>
          </div>
        ))}
        <button className="font-satoshi text-sm text-primary font-medium hover:underline w-fit">
          View more...
        </button>
      </div>
    </div>
  );
}
