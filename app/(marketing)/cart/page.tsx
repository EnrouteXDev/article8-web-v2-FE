"use client";

import React from "react";
import Link from "next/link";
import CartItem from "@/components/pages/cart/CartItem";
import CartSummary from "@/components/pages/cart/CartSummary";
import { useCart } from "@/lib/queries/cart";
import { Spinner } from "@/components/ui/spinner";
import type { Cart } from "@/lib/types";

export default function CartPage() {
  const { data: cart, isLoading } = useCart();

  return (
    <main className="min-h-screen bg-background pt-44 pb-32">
      <div className="section-container section-px">
        <h1 className="font-baloo font-medium text-3xl md:text-[36px] text-primary mb-9">
          Shopping Cart
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : !cart || (cart as Cart).items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="font-satoshi text-lg text-primary/50">Your cart is empty.</p>
            <Link
              href="/store"
              className="font-satoshi text-sm font-medium text-primary hover:underline"
            >
              Browse the store
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col divide-y divide-gray-200">
                {(cart as Cart).items.map((item) => (
                  <CartItem key={item.product._id} item={item} />
                ))}
              </div>
            </div>

            <div className="w-full lg:w-95 shrink-0">
              <CartSummary cart={cart as Cart} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
