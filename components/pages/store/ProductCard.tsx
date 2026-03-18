"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart01Icon } from "hugeicons-react";
import type { Product } from "@/lib/types";
import { ProductStatus } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

function getStockLabel(product: Product): string | undefined {
  if (product.status === ProductStatus.OUT_OF_STOCK) return "Out of stock";
  if (product.quantity <= 5) return `Only ${product.quantity} left`;
  return undefined;
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0];
  const stock = getStockLabel(product);

  return (
    <div className="flex flex-col gap-4">
      {/* Image Container */}
      <Link href={`/store/${product._id}`} className="block">
      <div className="relative w-full aspect-236/244 overflow-hidden group bg-primary/5">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/20 text-xs font-satoshi">
            No image
          </div>
        )}
      </div>
      </Link>

      <div className="flex flex-col gap-3">
        {/* Name and Add to Cart */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <h4 className="font-baloo font-medium text-primary text-sm leading-tight opacity-70">
              {product.name}
            </h4>
            <span className="font-baloo font-bold text-primary text-[17px]">
              £{product.price.toFixed(2)}
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
        <button className="w-full h-10.5 bg-primary text-[#FFEBEB] font-baloo font-medium text-base rounded-lg hover:bg-primary/90 transition-colors">
          Buy Now
        </button>
      </div>
    </div>
  );
}
