"use client";

import Image from "next/image";
import { Delete02Icon } from "hugeicons-react";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateCartItem, useRemoveCartItem } from "@/lib/queries/cart";
import type { CartItem as CartItemType } from "@/lib/types";

interface CartItemProps {
  item: CartItemType;
}

function isValidImageSrc(src: string | undefined): src is string {
  if (!src) return false;
  try {
    if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")) return true;
    new URL(src);
    return true;
  } catch {
    return false;
  }
}

export default function CartItem({ item }: CartItemProps) {
  const { product, quantity } = item;
  const image = isValidImageSrc(product.images?.[0]) ? product.images[0] : undefined;
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();

  const isPending = isUpdating || isRemoving;

  const decrement = () => {
    if (quantity === 1) {
      removeItem(product._id);
    } else {
      updateItem({ productId: product._id, quantity: quantity - 1 });
    }
  };

  const increment = () => {
    if (quantity >= product.quantity) return;
    updateItem({ productId: product._id, quantity: quantity + 1 });
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-stretch sm:justify-between py-4 sm:py-6 transition-opacity ${isPending ? "opacity-50" : ""}`}>
      {/* Left side - Image and Details */}
      <div className="flex items-start sm:items-stretch gap-4 sm:gap-6">
        {/* Product Image */}
        <div className="relative w-25 h-28 sm:w-37.75 sm:h-42.25 overflow-hidden rounded-lg shrink-0 bg-primary/5">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : null}
        </div>

        {/* Product Details + Mobile Controls */}
        <div className="flex flex-col justify-between py-1 flex-1">
          <div>
            <h3 className="font-satoshi font-medium text-lg sm:text-2xl text-primary leading-tight">
              {product.name}
            </h3>
            <span className="font-satoshi font-bold text-2xl sm:text-[32px] text-primary block mt-1 sm:mt-2">
              £{product.price.toFixed(2)}
            </span>
          </div>

          {/* Mobile Controls */}
          <div className="flex sm:hidden items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={decrement}
                disabled={isPending}
                className="w-7.5 h-7.5 flex items-center justify-center border border-[#E5E5E5] rounded-sm hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                {isUpdating ? <Spinner className="size-3" /> : "-"}
              </button>
              <span className="font-baloo text-xl font-normal text-primary min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={increment}
                disabled={isPending || quantity >= product.quantity}
                className="w-7.5 h-7.5 flex items-center justify-center border border-[#E5E5E5] rounded-sm hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(product._id)}
              disabled={isPending}
              className="flex items-center gap-1 text-primary hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              {isRemoving ? (
                <Spinner className="size-4" />
              ) : (
                <>
                  <span className="font-satoshi font-medium text-base">Remove</span>
                  <Delete02Icon size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Controls */}
      <div className="hidden sm:flex flex-col justify-between items-end py-1">
        <div className="flex items-center gap-4">
          <button
            onClick={decrement}
            disabled={isPending}
            className="w-[35px] h-[35px] flex items-center justify-center border border-[#E5E5E5] rounded-sm hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            {isUpdating ? <Spinner className="size-3" /> : "-"}
          </button>
          <span className="font-baloo text-2xl font-normal text-primary min-w-[20px] text-center">
            {quantity}
          </span>
          <button
            onClick={increment}
            disabled={isPending || quantity >= product.quantity}
            className="w-[35px] h-[35px] flex items-center justify-center border border-[#E5E5E5] rounded-sm hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeItem(product._id)}
          disabled={isPending}
          className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          {isRemoving ? (
            <Spinner className="size-5" />
          ) : (
            <>
              <span className="font-satoshi font-medium text-2xl">Remove</span>
              <Delete02Icon size={24} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
