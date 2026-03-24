"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Share2, Star, MapPin, Minus, Plus } from "lucide-react";

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} size={14} className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"} />
      ))}
    </div>
  );
}
import { ShoppingCart01Icon } from "hugeicons-react";
import { toast } from "sonner";
import { useProduct, useProducts } from "@/lib/queries/products";
import { useAddToCart, useCart, useUpdateCartItem, useRemoveCartItem } from "@/lib/queries/cart";
import { Spinner } from "@/components/ui/spinner";
import { ProductStatus } from "@/lib/types";
import ProductReviews from "./ProductReviews";
import ProductPolicies from "./ProductPolicies";
import SimilarProducts from "./SimilarProducts";

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

function isValidImageSrc(src: string): boolean {
  if (!src) return false;
  try {
    if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")) return true;
    new URL(src);
    return true;
  } catch {
    return false;
  }
}

interface Props {
  id: string;
}

export default function ProductDetailContent({ id }: Props) {
  const router = useRouter();
  const { data, isLoading, isError } = useProduct(id);
  const { data: similarData } = useProducts({ limit: 8 });
  const { data: cart } = useCart();
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();

  const [selectedImage, setSelectedImage] = useState(0);
  const [localQty, setLocalQty] = useState(1);

  const product = data?.product;
  const validImages = (product?.images ?? []).filter(isValidImageSrc);
  const similarProducts = (similarData?.data ?? []).filter((p) => p._id !== id);

  const isOutOfStock = product?.status === ProductStatus.OUT_OF_STOCK;
  const cartItem = cart?.items?.find((i) => i.product._id === id);
  const inCart = !!cartItem;
  const isPending = isAdding || isUpdating || isRemoving;

  const prevImage = () => {
    if (!validImages.length) return;
    setSelectedImage((i) => (i === 0 ? validImages.length - 1 : i - 1));
  };

  const nextImage = () => {
    if (!validImages.length) return;
    setSelectedImage((i) => (i === validImages.length - 1 ? 0 : i + 1));
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
                    {validImages.length > 0 ? (
                      <Image
                        src={validImages[selectedImage]}
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

                    {/* Arrows */}
                    {validImages.length > 1 && (
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
                  {validImages.length > 1 && (
                    <div className="flex gap-3">
                      {validImages.map((src, i) => (
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
                      <button
                        className="hover:text-primary transition-colors"
                        onClick={() => {
                          const url = window.location.href;
                          if (navigator.share) {
                            navigator.share({ title: product.name, url });
                          } else {
                            navigator.clipboard.writeText(url);
                            toast.success("Link copied to clipboard");
                          }
                        }}
                      >
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
                    {inCart ? (
                      /* Cart qty stepper — directly updates cart */
                      <div className="flex items-center border border-primary/20 rounded-lg overflow-hidden">
                        <button
                          disabled={isPending}
                          onClick={() => {
                            if (cartItem!.quantity === 1) {
                              removeItem(product._id, { onError: () => toast.error("Failed to update cart") });
                            } else {
                              updateItem(
                                { productId: product._id, quantity: cartItem!.quantity - 1 },
                                { onError: () => toast.error("Failed to update cart") }
                              );
                            }
                          }}
                          className="w-10 h-11 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors disabled:opacity-40"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-satoshi text-sm text-primary font-medium">
                          {isUpdating ? <Spinner className="size-3 mx-auto" /> : cartItem!.quantity}
                        </span>
                        <button
                          disabled={isPending}
                          onClick={() =>
                            updateItem(
                              { productId: product._id, quantity: cartItem!.quantity + 1 },
                              { onError: () => toast.error("Failed to update cart") }
                            )
                          }
                          className="w-10 h-11 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors disabled:opacity-40"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      /* Local qty stepper — used when adding fresh */
                      <div className="flex items-center border border-primary/20 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                          className="w-10 h-11 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-satoshi text-sm text-primary font-medium">
                          {localQty}
                        </span>
                        <button
                          onClick={() => setLocalQty((q) => Math.min(product.quantity, q + 1))}
                          disabled={isOutOfStock}
                          className="w-10 h-11 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors disabled:opacity-40"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}

                    {inCart ? (
                      <button
                        onClick={() => router.push("/cart")}
                        className="flex-1 h-11 flex items-center justify-center gap-2 border border-primary rounded-lg text-primary font-satoshi text-sm font-medium hover:bg-primary/5 transition-colors"
                      >
                        <ShoppingCart01Icon size={18} />
                        View Cart
                      </button>
                    ) : (
                      <button
                        disabled={isOutOfStock || isAdding}
                        onClick={() =>
                          addToCart(
                            { productId: product._id, quantity: localQty },
                            { onError: () => toast.error("Failed to add to cart") }
                          )
                        }
                        className="flex-1 h-11 flex items-center justify-center gap-2 border border-primary/20 rounded-lg text-primary font-satoshi text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isAdding ? <Spinner className="size-4" /> : <ShoppingCart01Icon size={18} />}
                        {isAdding ? "Adding..." : "Add to Cart"}
                      </button>
                    )}
                  </div>

                  {/* Buy Now */}
                  <button
                    disabled={isOutOfStock || isPending}
                    onClick={() => {
                      if (inCart) {
                        router.push("/cart");
                        return;
                      }
                      addToCart(
                        { productId: product._id, quantity: localQty },
                        { onSuccess: () => router.push("/cart") }
                      );
                    }}
                    className="w-full h-12 bg-primary text-white font-baloo font-bold text-base rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {inCart ? "Go to Cart" : "Buy Now"}
                  </button>
                </div>
              </div>

              {/* ── Bottom: reviews + shipping ── */}
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-20">
                <ProductReviews />
                <ProductPolicies />
              </div>

              {/* ── Similar Products ── */}
              <SimilarProducts products={similarProducts} />
            </>
          ) : null}

        </div>
      </div>
    </main>
  );
}
