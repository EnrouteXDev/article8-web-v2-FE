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
      <div className="relative w-full aspect-236/244  overflow-hidden group">
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
            <h4 className="font-baloo font-medium text-primary text-sm leading-tight opacity-70">
              {name}
            </h4>
            <span className="font-baloo font-bold text-primary text-[17px]">
              {price}
            </span>
          </div>

          <button className="px-2 h-[22px] bg-primary text-white rounded-[4px] flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <ShoppingCart01Icon size={13} />
            <span className="font-baloo text-sm font-medium whitespace-nowrap">
              Add to cart
            </span>
          </button>
        </div>

        {/* Stock Info */}
        {stock && (
          <p className="font-baloo font-medium text-[12px] text-[#A20505]">
            {stock}
          </p>
        )}

        {/* Buy Now Button */}
        <button className="w-full h-10.5 bg-primary text-[#FFEBEB] font-baloo font-medium text-base  rounded-[8px] hover:bg-primary/90 transition-colors">
          Buy Now
        </button>
      </div>
    </div>
  );
}
