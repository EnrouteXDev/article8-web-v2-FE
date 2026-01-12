"use client";

import React from "react";
import CheckoutForm from "@/components/pages/cart/CheckoutForm";
import OrderedItem from "@/components/pages/cart/OrderedItem";
import CartSummary from "@/components/pages/cart/CartSummary";

const MOCK_CART_ITEMS = [
  {
    id: "1",
    name: "Article 8 shirt",
    price: "£4.99",
    image: "/demo.jpg",
  },
  {
    id: "2",
    name: "Article 8 shirt",
    price: "£4.99",
    image: "/demo.jpg",
  },
  {
    id: "3",
    name: "Article 8 shirt",
    price: "£4.99",
    image: "/demo.jpg",
  },
];

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-32">
      <div className="section-container section-px">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

          {/* Left Column - Shipping Progress */}
          <div className="flex-1 w-full">
            <CheckoutForm />
          </div>

          {/* Right Column - Order Sidebar */}
          <div className="w-full lg:w-[444px] shrink-0 sticky top-32">
            <div className="flex flex-col gap-8 bg-[#FFF1F0] rounded-[12px] p-6 lg:p-8">

              {/* Your Order Section */}
              <div className="flex flex-col gap-4">
                <h2 className="font-baloo font-medium text-[32px] text-primary">
                  Your Order
                </h2>
                <div className="w-full h-px bg-primary/10" />
                <div className="flex flex-col">
                  {MOCK_CART_ITEMS.map((item) => (
                    <OrderedItem key={item.id} {...item} />
                  ))}
                </div>
              </div>

              {/* Summary Section */}
              <CartSummary noBackground showCheckoutButton={false} />

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
