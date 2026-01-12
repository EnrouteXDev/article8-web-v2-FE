"use client";

import React from "react";
import Image from "next/image";

interface OrderedItemProps {
  name: string;
  price: string;
  image: string;
}

export default function OrderedItem({ name, price, image }: OrderedItemProps) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-primary/10 last:border-b-0">
      <div className="relative w-[64px] h-[64px] overflow-hidden rounded-[4px] shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col">
        <h4 className="font-satoshi font-medium text-lg text-primary leading-tight">
          {name}
        </h4>
        <span className="font-satoshi font-bold text-xl text-primary mt-1">
          {price}
        </span>
      </div>
    </div>
  );
}
