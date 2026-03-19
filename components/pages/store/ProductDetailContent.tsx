"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Heart, Share2, Star, MapPin, Minus, Plus } from "lucide-react";
import { ShoppingCart01Icon } from "hugeicons-react";
import { useProduct, useProducts } from "@/lib/queries/products";
import { useAddToCart } from "@/lib/queries/cart";
import { Spinner } from "@/components/ui/spinner";
import ProductCard from "./ProductCard";
import { ProductStatus } from "@/lib/types";

// ─── Static review data (until review API is available) ──────────────────────
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

function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        <div className="flex flex-col gap-4 lg:w-[45%]">
          <div className="w-full aspect-square bg-primary/10 rounded-xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-primary/10 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-5">
          <div className="h-7 w-64 bg-primary/10 rounded" />
          <div className="h-8 w-24 bg-primary/10 rounded" />
          <div className="h-4 w-full bg-primary/10 rounded" />
          <div className="h-4 w-3/4 bg-primary/10 rounded" />
          <div className="h-12 w-full bg-primary/10 rounded-lg mt-4" />
          <div className="h-12 w-full bg-primary/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

interface Props {
  id: string;
}

export default function ProductDetailContent({ id }: Props) {
  const router = useRouter();
  const { data, isLoading, isError } = useProduct(id);
  const { data: similarData } = useProducts({ limit: 8 });
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = data?.product;
  const similarProducts = (similarData?.data ?? []).filter((p) => p._id !== id);

  const isOutOfStock = product?.status === ProductStatus.OUT_OF_STOCK;

  const prevImage = () => {
    if (!product?.images.length) return;
    setSelectedImage((i) => (i === 0 ? product.images.length - 1 : i - 1));
  };

  const nextImage = () => {
    if (!product?.images.length) return;
    setSelectedImage((i) => (i === product.images.length - 1 ? 0 : i + 1));
  };

  if (isError) {
    return (
      <main className="flex flex-col min-h-screen bg-background section-px py-24">
        <div className="section-container text-center">
          <p className="text-primary font-baloo text-xl font-bold">Product not found</p>
          <Link href="/store" className="text-sm text-primary/60 hover:text-primary mt-2 inline-block font-satoshi">
            Back to store
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="section-px py-12 lg:py-16">
        <div className="section-container">

          {/* Breadcrumb */}
          <p className="font-satoshi text-sm text-primary/50 mb-8">
            <Link href="/store" className="hover:text-primary transition-colors">Store</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{product?.name ?? "Product"}</span>
          </p>

          {isLoading ? (
            <ProductDetailSkeleton />
          ) : product ? (
            <>
              {/* ── Top: image + info ── */}
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-20">

                {/* Image Gallery */}
                <div className="flex flex-col gap-4 lg:w-[45%] shrink-0">
                  {/* Main image */}
                  <div className="relative w-full aspect-square bg-primary/5 rounded-xl overflow-hidden group">
                    {product.images.length > 0 ? (
                      <Image
                        src={product.images[selectedImage]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/20 font-satoshi text-sm">
                        No image
                      </div>
                    )}

                    {/* Drag to rotate label */}
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm text-primary text-xs font-satoshi px-3 py-1 rounded-full shadow-sm">
                      Drag to rotate
                    </span>

                    {/* Arrows */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex gap-3">
                      {product.images.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors shrink-0 ${
                            selectedImage === i ? "border-primary" : "border-transparent"
                          }`}
                        >
                          <Image src={src} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col gap-5">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1
                        className="font-baloo font-bold text-primary text-2xl lg:text-3xl"
                      >
                        {product.name}
                      </h1>
                      <span
                        className={`text-xs font-satoshi font-medium px-2 py-0.5 rounded-full ${
                          isOutOfStock
                            ? "bg-red-100 text-red-500"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {isOutOfStock ? "Out of stock" : "In stock"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary/40 shrink-0">
                      <button className="hover:text-primary transition-colors">
                        <Heart size={20} />
                      </button>
                      <button className="hover:text-primary transition-colors">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <p className="font-baloo font-bold text-primary text-3xl">
                    £{product.price.toFixed(2)}
                  </p>

                  {/* Rating + location */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={5} />
                      <span className="font-satoshi text-sm text-primary/60">
                        5.0 · 200 Reviews
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-primary/50">
                      <MapPin size={14} />
                      <span className="font-satoshi text-sm">Manchester</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-satoshi text-sm text-primary/70 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Stock count */}
                  {!isOutOfStock && product.quantity <= 10 && (
                    <p className="font-satoshi text-sm text-[#A20505] font-medium">
                      Only {product.quantity} left in stock
                    </p>
                  )}

                  {/* Quantity + Add to cart */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-primary/20 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-11 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-satoshi text-sm text-primary font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                        disabled={isOutOfStock}
                        className="w-10 h-11 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors disabled:opacity-40"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      disabled={isOutOfStock || isAddingToCart}
                      onClick={() =>
                        addToCart({ productId: product._id, quantity })
                      }
                      className="flex-1 h-11 flex items-center justify-center gap-2 border border-primary/20 rounded-lg text-primary font-satoshi text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isAddingToCart ? (
                        <Spinner className="size-4" />
                      ) : (
                        <ShoppingCart01Icon size={18} />
                      )}
                      {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>

                  {/* Buy Now */}
                  <button
                    disabled={isOutOfStock || isAddingToCart}
                    onClick={() =>
                      addToCart(
                        { productId: product._id, quantity },
                        { onSuccess: () => router.push("/cart") },
                      )
                    }
                    className="w-full h-12 bg-primary text-white font-baloo font-bold text-base rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* ── Bottom: reviews + shipping ── */}
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-20">

                {/* Reviews */}
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

                {/* Shipping & Returns */}
                <div className="lg:w-[40%] shrink-0 flex flex-col gap-5">
                  {/* Shipping */}
                  <div className="bg-[#FFEBEB] rounded-xl p-6">
                    <h3 className="font-baloo font-bold text-primary text-xl mb-3">Shipping</h3>
                    <p className="font-satoshi text-sm text-primary/70 leading-relaxed mb-3">
                      We know how exciting it is to receive your order, so we work hard to get it to you as quickly and reliably as possible. Here&apos;s what you can expect:
                    </p>
                    <p className="font-satoshi text-sm font-semibold text-primary mb-2">Processing Time</p>
                    <ul className="list-disc list-inside font-satoshi text-sm text-primary/70 leading-relaxed space-y-1">
                      <li>Orders are typically processed within 1–2 business days, Within state</li>
                      <li>During peak seasons or promotional events, processing may take up to 3 business days.</li>
                    </ul>
                  </div>

                  {/* Return Policy */}
                  <div className="bg-[#FFEBEB] rounded-xl p-6">
                    <h3 className="font-baloo font-bold text-primary text-xl mb-3">Return Policy</h3>
                    <p className="font-satoshi text-sm text-primary/70 leading-relaxed mb-3">
                      We offer a 7-day return window for items that are unused, in their original packaging, and accompanied by proof of purchase. Returns are not accepted for clearance items, custom orders, or products damaged through misuse. If you receive a defective or incorrect item, you can request an exchange within 3 days of delivery, and we&apos;ll cover the cost of shipping.
                    </p>
                    <p className="font-satoshi text-sm text-primary/70 leading-relaxed">
                      Once we receive and inspect your return, refunds are processed within 5–7 business days to your original payment method. Please note that shipping fees are non-refundable, unless the return is due to our error. For all return or exchange requests, simply reach out to our support team and we&apos;ll guide you through the process smoothly.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Similar Products ── */}
              {similarProducts.length > 0 && (
                <div className="flex flex-col gap-6">
                  <h2 className="font-baloo font-bold text-primary text-2xl">Similar Products</h2>
                  <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {similarProducts.map((p) => (
                      <div key={p._id} className="w-[180px] shrink-0">
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4">
                    <Link
                      href="/store"
                      className="px-10 py-3 bg-primary text-white font-baloo font-bold text-base rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View More Products
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : null}

        </div>
      </div>
    </main>
  );
}
