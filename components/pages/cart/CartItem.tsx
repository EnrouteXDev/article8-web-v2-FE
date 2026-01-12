import React from "react";
import Image from "next/image";
import { Delete02Icon } from "hugeicons-react";

interface CartItemProps {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export default function CartItem({ name, price, image, quantity }: CartItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-stretch sm:justify-between py-4 sm:py-6">
      {/* Left side - Image and Details */}
      <div className="flex items-start sm:items-stretch gap-4 sm:gap-6">
        {/* Product Image */}
        <div className="relative w-[100px] h-[112px] sm:w-[151px] sm:h-[169px] overflow-hidden rounded-[8px] shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details + Mobile Controls */}
        <div className="flex flex-col justify-between py-1 flex-1">
          <div>
            <h3 className="font-satoshi font-medium text-lg sm:text-2xl text-primary leading-tight">
              {name}
            </h3>
            <span className="font-satoshi font-bold text-2xl sm:text-[32px] text-primary block mt-1 sm:mt-2">
              {price}
            </span>
          </div>

          {/* Mobile Controls - shown below price */}
          <div className="flex sm:hidden items-center justify-between mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button className="w-[30px] h-[30px] flex items-center justify-center border border-[#E5E5E5] rounded-[4px] hover:bg-gray-50 transition-colors">
                -
              </button>
              <span className="font-baloo text-xl font-normal text-primary min-w-[20px] text-center">
                {quantity}
              </span>
              <button className="w-[30px] h-[30px] flex items-center justify-center border border-[#E5E5E5] rounded-[4px] hover:bg-gray-50 transition-colors">
                +
              </button>
            </div>

            {/* Remove Button */}
            <button className="flex items-center gap-1 text-primary hover:opacity-80 transition-opacity">
              <span className="font-satoshi font-medium text-base">Remove</span>
              <Delete02Icon size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Controls - right side */}
      <div className="hidden sm:flex flex-col justify-between items-end py-1">
        {/* Quantity Controls */}
        <div className="flex items-center gap-4">
          <button className="w-[35px] h-[35px] flex items-center justify-center border border-[#E5E5E5] rounded-[4px] hover:bg-gray-50 transition-colors">
            -
          </button>
          <span className="font-baloo text-2xl font-normal text-primary min-w-[20px] text-center">
            {quantity}
          </span>
          <button className="w-[35px] h-[35px] flex items-center justify-center border border-[#E5E5E5] rounded-[4px] hover:bg-gray-50 transition-colors">
            +
          </button>
        </div>

        {/* Remove Button */}
        <button className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <span className="font-satoshi font-medium text-2xl">Remove</span>
          <Delete02Icon size={24} />
        </button>
      </div>
    </div>
  );
}
