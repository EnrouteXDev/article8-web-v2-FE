"use client"
import React, { useState } from "react";
import Link from "next/link";
import StoreSidebar from "./StoreSidebar";
import ProductCard from "./ProductCard";
import { ArrowDown01Icon, ShoppingCart01Icon } from "hugeicons-react";
import { LayoutGrid } from "lucide-react";
import { useInfiniteProducts } from "@/lib/queries/products";
import { useCartCount } from "@/lib/queries/cart";
import type { ProductFilters } from "@/lib/types";
import { ProductAvailability, ProductPriceSort } from "@/lib/types";

const LIMIT = 12;

const SORT_OPTIONS: { label: string; value: ProductPriceSort | "" }[] = [
  { label: "Default", value: "" },
  { label: "Cheap to expensive", value: ProductPriceSort.LOW_TO_HIGH },
  { label: "Expensive to cheap", value: ProductPriceSort.HIGH_TO_LOW },
];

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
  const [filters, setFilters] = useState<Omit<ProductFilters, "page" | "limit">>({});
  const [sortOpen, setSortOpen] = useState(false);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteProducts({ ...filters, limit: LIMIT });
  const cartCount = useCartCount();

  const products = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const showing = products.length;

  const activeSort = SORT_OPTIONS.find((o) => o.value === (filters.priceSort ?? ""));

  function setFilter<K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({});
  }

  return (
    <section className="w-full py-16 lg:py-24 bg-background section-px">
      <div className="section-container flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* Sidebar */}
        <StoreSidebar filters={filters} onFilterChange={setFilter} onClear={clearFilters} />

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
              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2 border border-primary/10 rounded-lg bg-primary/5 text-primary"
                >
                  <span className="font-satoshi text-sm font-medium">
                    Sort by: {activeSort?.label ?? "Default"}
                  </span>
                  <ArrowDown01Icon size={16} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-primary/10 rounded-lg shadow-lg min-w-[200px] overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setFilter("priceSort", opt.value ? opt.value : undefined);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 font-satoshi text-sm hover:bg-primary/5 transition-colors ${
                          (filters.priceSort ?? "") === opt.value ? "text-primary font-medium" : "text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
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

          {/* Empty state */}
          {!isLoading && products.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="font-baloo font-bold text-2xl text-primary">No products found</p>
              <p className="font-satoshi text-primary/60">Try adjusting your filters</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-primary text-white font-satoshi font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Load More */}
          {!isLoading && products.length > 0 && (
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
