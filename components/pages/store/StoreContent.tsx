"use client"
import React from "react";
import Link from "next/link";
import StoreSidebar from "./StoreSidebar";
import ProductCard from "./ProductCard";
import { ArrowDown01Icon, ShoppingCart01Icon } from "hugeicons-react";
import { LayoutGrid } from "lucide-react";
import { useInfiniteProducts } from "@/lib/queries/products";
import { useCartCount } from "@/lib/queries/cart";

const LIMIT = 12;

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="w-full aspect-236/244 bg-primary/10 rounded" />
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-28 bg-primary/10 rounded" />
            <div className="h-4 w-16 bg-primary/10 rounded" />
          </div>
          <div className="h-6 w-24 bg-primary/10 rounded" />
        </div>
        <div className="h-10 w-full bg-primary/10 rounded-lg" />
      </div>
    </div>
  );
}

export default function StoreContent() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteProducts({ limit: LIMIT });
  const cartCount = useCartCount();

  const products = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const showing = products.length;

  return (
    <section className="w-full py-16 lg:py-24 bg-background section-px">
      <div className="section-container flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* Sidebar */}
        <StoreSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-10">

          {/* Header & Sort */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <h3 className="font-baloo font-bold text-primary text-xl lg:text-2xl">
                Article 8 merch
              </h3>
              <span className="font-satoshi text-primary/50 text-base">
                ({isLoading ? "..." : `${total} products found`})
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 border border-primary/10 rounded-lg bg-primary/5 text-primary">
                <span className="font-satoshi text-sm font-medium">Sort by: Cheap to expensive</span>
                <ArrowDown01Icon size={16} />
              </div>

              <button className="p-2 border border-primary/10 rounded-lg text-primary/40 hover:text-primary transition-colors">
                <LayoutGrid size={20} />
              </button>

              <Link href="/cart" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <ShoppingCart01Icon size={20} />
                <span className="font-baloo font-bold text-sm">View Cart {cartCount > 0 ? `(${cartCount})` : ""}</span>
              </Link>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {isLoading
              ? Array.from({ length: LIMIT }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>

          {/* Load More */}
          {!isLoading && (
            <div className="flex flex-col items-center gap-6 mt-12">
              <p className="font-satoshi text-primary/60 text-lg">
                Showing {showing} of {total}
              </p>
              {hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-10 py-4 bg-primary text-white font-baloo font-bold text-lg rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {isFetchingNextPage ? "Loading..." : "Load More Products"}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
