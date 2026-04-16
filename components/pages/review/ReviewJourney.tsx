"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Star, MessageSquare, AlertCircle, CheckCircle, ChevronLeft, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrder } from "@/lib/queries/orders";
import { useProduct } from "@/lib/queries/products";
import { useCreateReview } from "@/lib/queries/reviews";
import { useCreateSupportTicket } from "@/lib/queries/support";
import type { OrderItem } from "@/lib/types";

// ─── Star Rating Input ─────────────────────────────────────────────────────────

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < (hovered || value);
        return (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(i + 1)}
          >
            <Star
              className={cn(
                "size-8 transition-colors",
                filled ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-gray-200 text-gray-200"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

// ─── Product Image fetcher ─────────────────────────────────────────────────────

function ProductImage({ productId, name }: { productId: string; name: string }) {
  const { data } = useProduct(productId);
  const image = data?.product?.images?.[0];

  return (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-primary/10">
      {image ? (
        <Image src={image} alt={name} fill className="object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center">
          <Package className="size-6 text-primary/30" />
        </div>
      )}
    </div>
  );
}

// ─── Views ─────────────────────────────────────────────────────────────────────

type View = "items" | "review" | "review-success" | "support" | "support-success";

interface SelectedItem {
  item: OrderItem;
  orderId: string; // orderNumber used as orderId for review API
}

// Items list view
function ItemsView({
  orderId,
  items,
  customerName,
  onReview,
  onSupport,
}: {
  orderId: string;
  items: OrderItem[];
  customerName: string;
  onReview: (item: OrderItem) => void;
  onSupport: (item: OrderItem) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="font-bold text-2xl md:text-3xl text-primary"
          style={{ fontFamily: "var(--font-baloo-2)" }}
        >
          Hi {customerName.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 font-satoshi text-primary/60 text-sm">
          Order <span className="font-medium text-primary">{orderId}</span> — share your experience or get help below.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.product}
            className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white p-4 shadow-sm"
          >
            <ProductImage productId={item.product} name={item.name} />

            <div className="flex-1 min-w-0">
              <p className="font-satoshi font-semibold text-primary truncate">{item.name}</p>
              <p className="font-satoshi text-primary/50 text-sm">{item.quantity} pcs</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={() => onReview(item)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-satoshi text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                <Star className="size-3.5" />
                Leave a review
              </button>
              <button
                onClick={() => onSupport(item)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-white px-4 py-2 font-satoshi text-sm font-medium text-primary transition-colors hover:bg-primary/5"
              >
                <MessageSquare className="size-3.5" />
                Get support
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Review form view
function ReviewFormView({
  selected,
  onBack,
  onSuccess,
}: {
  selected: SelectedItem;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const { mutate, isPending, error } = useCreateReview();

  const submit = () => {
    if (!comment.trim() || !rating) return;
    mutate(
      {
        orderId: selected.orderId,
        productId: selected.item.product,
        rating,
        comment: comment.trim(),
      },
      { onSuccess }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 font-satoshi text-sm text-primary/60 hover:text-primary transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back to items
      </button>

      <div>
        <h2
          className="font-bold text-2xl text-primary"
          style={{ fontFamily: "var(--font-baloo-2)" }}
        >
          Leave a review
        </h2>
        <p className="mt-1 font-satoshi text-primary/60 text-sm">
          Share your experience with this product
        </p>
      </div>

      {/* Product */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 p-3">
        <ProductImage productId={selected.item.product} name={selected.item.name} />
        <div>
          <p className="font-satoshi font-semibold text-primary">{selected.item.name}</p>
          <p className="font-satoshi text-primary/50 text-sm">{selected.item.quantity} pcs</p>
        </div>
      </div>

      {/* Comment */}
      <div className="flex flex-col gap-2">
        <label className="font-satoshi text-sm font-medium text-primary">
          Your review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts…"
          rows={4}
          className="w-full resize-none rounded-xl border border-primary/20 bg-white px-4 py-3 font-satoshi text-sm text-primary outline-none transition-colors placeholder:text-primary/30 focus:border-primary/40"
        />
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-2">
        <label className="font-satoshi text-sm font-medium text-primary">
          Rating <span className="text-red-500">*</span>
        </label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="size-4 shrink-0" />
          {(error as any)?.response?.data?.message ?? "Failed to submit review. Please try again."}
        </div>
      )}

      <button
        onClick={submit}
        disabled={isPending || !comment.trim() || !rating}
        className="w-full rounded-xl bg-primary py-3.5 font-satoshi font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Submit review"}
      </button>
    </div>
  );
}

// Review success view
function ReviewSuccessView({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="size-8 text-green-600" />
      </div>
      <div>
        <h2
          className="font-bold text-2xl text-primary"
          style={{ fontFamily: "var(--font-baloo-2)" }}
        >
          Review submitted!
        </h2>
        <p className="mt-2 font-satoshi text-primary/60 text-sm max-w-xs mx-auto">
          Thanks for leaving a review. You are improving the trust of Article8 products.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={onBack}
          className="flex-1 rounded-xl border border-primary/20 py-3 font-satoshi font-medium text-primary text-sm transition-colors hover:bg-primary/5"
        >
          Review another item
        </button>
        <button
          onClick={onDone}
          className="flex-1 rounded-xl bg-primary py-3 font-satoshi font-medium text-white text-sm transition-colors hover:bg-primary/90"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// Support form view
function SupportFormView({
  selected,
  onBack,
  onSuccess,
}: {
  selected: SelectedItem;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [complaint, setComplaint] = useState("");
  const { mutate, isPending, error } = useCreateSupportTicket();

  const submit = () => {
    if (!complaint.trim()) return;
    mutate(
      {
        orderId: selected.orderId,
        productId: selected.item.product,
        complaint: complaint.trim(),
      },
      { onSuccess }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 font-satoshi text-sm text-primary/60 hover:text-primary transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back to items
      </button>

      <div>
        <h2
          className="font-bold text-2xl text-primary"
          style={{ fontFamily: "var(--font-baloo-2)" }}
        >
          Get support
        </h2>
        <p className="mt-1 font-satoshi text-primary/60 text-sm">
          Describe the issue and our team will get back to you
        </p>
      </div>

      {/* Product */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 p-3">
        <ProductImage productId={selected.item.product} name={selected.item.name} />
        <div>
          <p className="font-satoshi font-semibold text-primary">{selected.item.name}</p>
          <p className="font-satoshi text-primary/50 text-sm">{selected.item.quantity} pcs</p>
        </div>
      </div>

      {/* Complaint */}
      <div className="flex flex-col gap-2">
        <label className="font-satoshi text-sm font-medium text-primary">
          Describe the issue <span className="text-red-500">*</span>
        </label>
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Share your thoughts…"
          rows={5}
          className="w-full resize-none rounded-xl border border-primary/20 bg-white px-4 py-3 font-satoshi text-sm text-primary outline-none transition-colors placeholder:text-primary/30 focus:border-primary/40"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="size-4 shrink-0" />
          {(error as any)?.response?.data?.message ?? "Failed to submit. Please try again."}
        </div>
      )}

      <button
        onClick={submit}
        disabled={isPending || !complaint.trim()}
        className="w-full rounded-xl bg-primary py-3.5 font-satoshi font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Submit"}
      </button>
    </div>
  );
}

// Support success view
function SupportSuccessView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-blue-100">
        <CheckCircle className="size-8 text-blue-600" />
      </div>
      <div>
        <h2
          className="font-bold text-2xl text-primary"
          style={{ fontFamily: "var(--font-baloo-2)" }}
        >
          Ticket submitted!
        </h2>
        <p className="mt-2 font-satoshi text-primary/60 text-sm max-w-xs mx-auto">
          Our team will review your complaint and reach out to you shortly.
        </p>
      </div>
      <button
        onClick={onBack}
        className="rounded-xl bg-primary px-8 py-3 font-satoshi font-medium text-white text-sm transition-colors hover:bg-primary/90"
      >
        Back to items
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ReviewJourney() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";

  const [view, setView] = useState<View>("items");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const { data: order, isLoading, error } = useOrder(orderId);

  const handleReview = (item: OrderItem) => {
    setSelectedItem({ item, orderId });
    setView("review");
  };

  const handleSupport = (item: OrderItem) => {
    setSelectedItem({ item, orderId });
    setView("support");
  };

  const backToItems = () => {
    setView("items");
    setSelectedItem(null);
  };

  return (
    <main className="min-h-screen bg-background section-px py-16 md:py-24">
      <div className="section-container max-w-2xl mx-auto">

        {/* Missing orderId */}
        {!orderId && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <AlertCircle className="size-10 text-primary/40" />
            <p
              className="font-bold text-xl text-primary"
              style={{ fontFamily: "var(--font-baloo-2)" }}
            >
              No order ID provided
            </p>
            <p className="font-satoshi text-primary/60 text-sm">
              Please use the link from your order confirmation email.
            </p>
          </div>
        )}

        {/* Loading */}
        {orderId && isLoading && (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-8 w-48 bg-primary/10 rounded-lg" />
            <div className="h-4 w-64 bg-primary/10 rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-primary/10 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error / not found */}
        {orderId && !isLoading && error && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <AlertCircle className="size-10 text-red-400" />
            <p
              className="font-bold text-xl text-primary"
              style={{ fontFamily: "var(--font-baloo-2)" }}
            >
              Order not found
            </p>
            <p className="font-satoshi text-primary/60 text-sm">
              We couldn&apos;t find an order with ID <strong>{orderId}</strong>. Please check your email link.
            </p>
          </div>
        )}

        {/* Journey */}
        {order && !isLoading && (
          <>
            {view === "items" && (
              <ItemsView
                orderId={order.orderNumber}
                items={order.items}
                customerName={`${order.customer.firstName} ${order.customer.lastName}`}
                onReview={handleReview}
                onSupport={handleSupport}
              />
            )}

            {view === "review" && selectedItem && (
              <ReviewFormView
                selected={selectedItem}
                onBack={backToItems}
                onSuccess={() => setView("review-success")}
              />
            )}

            {view === "review-success" && (
              <ReviewSuccessView
                onBack={backToItems}
                onDone={backToItems}
              />
            )}

            {view === "support" && selectedItem && (
              <SupportFormView
                selected={selectedItem}
                onBack={backToItems}
                onSuccess={() => setView("support-success")}
              />
            )}

            {view === "support-success" && (
              <SupportSuccessView onBack={backToItems} />
            )}
          </>
        )}

      </div>
    </main>
  );
}
