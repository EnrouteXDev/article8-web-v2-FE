"use client";

import React from "react";
import Link from "next/link";
import type { Cart } from "@/lib/types";

interface SummaryRowProps {
  label: string;
  value: string;
  isBold?: boolean;
}

const SummaryRow = ({ label, value, isBold }: SummaryRowProps) => (
  <div className="flex items-center justify-between py-2">
    <span className="font-satoshi text-2xl font-normal text-primary">{label}</span>
    <span className={`font-satoshi text-2xl ${isBold ? "font-bold" : "font-normal"} text-primary`}>
      {value}
    </span>
  </div>
);

interface CartSummaryProps {
  cart?: Cart;
  noBackground?: boolean;
  showCheckoutButton?: boolean;
}

export default function CartSummary({
  cart,
  noBackground = false,
  showCheckoutButton = true,
}: CartSummaryProps) {
  const subtotal =
    cart?.items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;

  const formatted = `£${subtotal.toFixed(2)}`;

  return (
    <div
      className={`${noBackground ? "" : "bg-[#FFF1F0] rounded-xl p-5 md:py-4.5 md:px-5"} flex flex-col gap-6 w-full max-w-111`}
    >
      <div className="flex flex-col gap-4">
        <h2 className="font-baloo-2 font-medium text-[28px] text-primary">Summary</h2>
        <div className="w-full h-px bg-primary/10" />
      </div>

      <div className="flex flex-col gap-2">
        <SummaryRow label="Subtotal" value={formatted} isBold />
        <SummaryRow label="Shipment Cost" value="-" />
        <SummaryRow label="Discount" value="-" />
        <div className="pt-4 mt-2 border-t border-primary/10">
          <SummaryRow label="Total" value={formatted} isBold />
        </div>
      </div>

      {showCheckoutButton && (
        <Link href="/checkout" className="w-full">
          <button className="w-full h-16 bg-primary text-white rounded-lg font-satoshi font-bold text-base hover:bg-primary/90 transition-colors mt-4">
            Checkout for {formatted}
          </button>
        </Link>
      )}
    </div>
  );
}
