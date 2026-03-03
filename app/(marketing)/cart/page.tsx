"use client";

import React from "react";
import CartItem from "@/components/pages/cart/CartItem";
import CartSummary from "@/components/pages/cart/CartSummary";

const MOCK_CART_ITEMS = [
  {
    id: "1",
    name: "Article 8 shirt",
    price: "£4.99",
    image: "/demo.jpg",
    quantity: 1,
  },
  {
    id: "2",
    name: "Article 8 shirt",
    price: "£4.99",
    image: "/demo.jpg",
    quantity: 1,
  },
  {
    id: "3",
    name: "Article 8 shirt",
    price: "£4.99",
    image: "/demo.jpg",
    quantity: 1,
  },
];

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background pt-44 pb-32">
      <div className="section-container section-px">
        <h1 className="font-baloo font-medium text-3xl md:text-[36px] text-primary mb-9">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Cart Items List */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col divide-y divide-gray-200">
              {MOCK_CART_ITEMS.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <CartSummary />
          </div>
        </div>
      </div>
    </main>
  );
}