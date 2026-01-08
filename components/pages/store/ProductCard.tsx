"use client"
import React from "react";
import Image from "next/image";
import { ShoppingCart01Icon } from "hugeicons-react";

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  stock?: string;
}

export default function ProductCard({ name, price, image, stock }: ProductCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Image Container */}
      <div className="relative w-full aspect-236/244 rounded-[16px] overflow-hidden group">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col gap-3">
        {/* Name and Add to Cart */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <h4 className="font-satoshi text-primary text-[13px] leading-tight opacity-70">
              {name}
            </h4>
            <span className="font-baloo font-bold text-primary text-[17px]">
              {price}
            </span>
          </div>

          <button className="px-8 h-[32px] bg-primary text-white rounded-full flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <ShoppingCart01Icon size={12} />
            <span className="font-satoshi text-[13px] font-medium whitespace-nowrap">
              Add to cart
            </span>
          </button>
        </div>

        {/* Stock Info */}
        {stock && (
          <p className="font-satoshi text-[12px] text-primary/60 italic">
            {stock}
          </p>
        )}

        {/* Buy Now Button */}
        <button className="w-full h-[42px] bg-primary text-white font-baloo font-bold text-[18px] rounded-[8px] hover:bg-primary/90 transition-colors">
          Buy Now
        </button>
      </div>
    </div>
  );
}
