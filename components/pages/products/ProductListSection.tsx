"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  categoryLabel: string;
}

const CATEGORIES = [
  "Animation & Motion Design",
  "3D Modelling, Visualization & Interactive Media",
  "Creative Development & Branding",
  "Film, Audio & Post-Production",
];

// --- Mock Data ---
const MOCK_PRODUCTS: Record<string, Product[]> = {
  "Animation & Motion Design": Array.from({ length: 5 }).map((_, i) => ({
    id: `anim-${i}`,
    title: "Skyfall",
    category: "Animation & Motion Design",
    categoryLabel: "Animation & Motion Design",
    description:
      "Lorem ipsum dolor sit amet consectetur. Ut feugiat ipsum pulvinar odio tempor hac netus sagittis. Leo dui ut sit suspendisse augue tincidunt mus",
    image: "/images/products/skyfall.png",
  })),
  "3D Modelling, Visualization & Interactive Media": Array.from({
    length: 5,
  }).map((_, i) => ({
    id: `3d-${i}`,
    title: "EcoSphere",
    category: "3D Modelling, Visualization & Interactive Media",
    categoryLabel: "3D Modelling, Visualization & Interactive Media",
    description:
      "Immersive 3D environments designed for the next generation of interactive storytelling and digital exploration.",
    image: "/images/products/skyfall.png",
  })),
  "Creative Development & Branding": Array.from({ length: 5 }).map((_, i) => ({
    id: `brand-${i}`,
    title: "Minimalist Studio",
    category: "Creative Development & Branding",
    categoryLabel: "Creative Development & Branding",
    description:
      "Crafting iconic brand identities that resonate with modern audiences through thoughtful design and strategy.",
    image: "/images/products/skyfall.png",
  })),
  "Film, Audio & Post-Production": Array.from({ length: 5 }).map((_, i) => ({
    id: `film-${i}`,
    title: "Cinematic Pulse",
    category: "Film, Audio & Post-Production",
    categoryLabel: "Film, Audio & Post-Production",
    description:
      "High-end post-production services including color grading, sound design, and visual effects for film and commercials.",
    image: "/images/products/skyfall.png",
  })),
};

export default function ProductListSection() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isFilterOpen) {
        setIsFilterOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFilterOpen]);

  const currentProducts = MOCK_PRODUCTS[activeCategory] || [];

  return (
    <section className="w-full bg-[#FFF8F6] py-12 md:py-20">
      <div className="section-container section-px overflow-visible">
        {/* Desktop Filter Tabs */}
        <div className="hidden lg:flex flex-wrap items-center gap-4 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-3.5 rounded-lg text-sm font-baloo font-semibold transition-all duration-300 whitespace-nowrap",
                activeCategory === cat
                  ? "bg-[#DA2439] text-white "
                  : "bg-[#F5EEEC] text-[#1D2939] hover:bg-gray-200",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mobile Filter Button & List */}
        <div className="lg:hidden relative mb-12">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#F5EEEC] rounded-xl text-lg font-baloo font-bold text-[#1D2939]"
          >
            Filters
            <motion.div
              animate={{ rotate: isFilterOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "backOut" }}
            >
              <ChevronDown size={22} className="stroke-3" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{
                  duration: 0.2,
                  type: "spring",
                  damping: 25,
                  stiffness: 400,
                }}
                className="absolute top-full left-0 w-full mt-3 bg-white rounded-2xl  p-3 z-100 flex flex-col gap-2 border border-gray-100"
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsFilterOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-5 py-4 rounded-xl text-[17px] font-baloo font-semibold transition-all active:scale-[0.98]",
                      activeCategory === cat
                        ? "bg-[#DA2439] text-white"
                        : "bg-[#F5EEEC] text-[#1D2939]",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
          <AnimatePresence mode="popLayout">
            {currentProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.05,
                  type: "spring",
                  damping: 30,
                  stiffness: 200,
                }}
                className="flex flex-col group"
              >
                {/* Image Container - Link to detail */}
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative aspect-16/10 w-full rounded-[24px] overflow-hidden mb-6 bg-[#000000] shadow-sm ring-1 ring-black/5">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center justify-between w-full mb-4">
                    <h3 className="text-[32px] leading-tight font-baloo font-bold text-[#1D2939]">
                      {product.title}
                    </h3>
                    <span className="px-5 py-2 bg-[#F5EEEC] text-[#1D2939] text-sm font-satoshi font-semibold rounded-full">
                      {product.categoryLabel}
                    </span>
                  </div>

                  <p className="text-[#667085] font-satoshi text-[17px] leading-relaxed mb-8 max-w-[95%]">
                    {product.description}
                  </p>

                  <Link href={`/products/${product.id}`}>
                    <button className="px-8 py-3.5 bg-[#FFEBEB] text-[#DA2439] font-satoshi font-bold text-[15px] rounded-xl transition-all duration-300 hover:bg-[#DA2439] hover:text-white hover:shadow-md active:scale-95 cursor-pointer">
                      View project
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
