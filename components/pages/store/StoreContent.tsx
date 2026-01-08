"use client"
import React from "react";
import StoreSidebar from "./StoreSidebar";
import ProductCard from "./ProductCard";
import { ArrowDown01Icon, ShoppingCart01Icon } from "hugeicons-react";
import { LayoutGrid, List } from "lucide-react";

const products = [
  { name: "Article 8 shirt", price: "£4.99", image: "/demo.jpg", stock: "Only 2 left" },
  { name: "Article 8 shirt", price: "£4.99", image: "/demo.jpg", stock: "Only 2 left" },
  { name: "Article 8 shirt", price: "£4.99", image: "/demo.jpg", stock: "Only 2 left" },
  { name: "Article 8 shirt", price: "£4.99", image: "/demo.jpg", stock: "Only 2 left" },
  { name: "Article 8 shirt", price: "£4.99", image: "/demo.jpg", stock: "Only 2 left" },
  { name: "Article 8 shirt", price: "£4.99", image: "/demo.jpg", stock: "Only 2 left" },
  { name: "Article 8 shirt", price: "£4.99", image: "/demo.jpg", stock: "Only 2 left" },
  { name: "Article 8 shirt", price: "£4.99", image: "/demo.jpg", stock: "Only 2 left" },
  { name: "Article 8 shirt", price: "£4.99", image: "/demo.jpg", stock: "Only 2 left" },
  { name: "Article 8 shirt", price: "£4.99", image: "/demo.jpg", stock: "Only 2 left" },
  { name: "Article 8 shirt", price: "£4.99", image: "/demo.jpg", stock: "Only 2 left" },
  { name: "Article 8 shirt", price: "£4.99", image: "/demo.jpg", stock: "Only 2 left" },
];

export default function StoreContent() {
  return (
    <section className="w-full py-16 lg:py-24 bg-background section-px">
      <div className="section-container flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* Sidebar */}
        <StoreSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-10">

          {/* Header & Sort */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <h3 className="font-baloo font-bold text-primary text-xl lg:text-2xl">
                Article 8 merch
              </h3>
              <span className="font-satoshi text-primary/50 text-base">
                (100 products found)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 border border-primary/10 rounded-lg bg-primary/5 text-primary">
                <span className="font-satoshi text-sm font-medium">Sort by: Cheap to expensive</span>
                <ArrowDown01Icon size={16} />
              </div>

              <button className="p-2 border border-primary/10 rounded-lg text-primary/40 hover:text-primary transition-colors">
                <LayoutGrid size={20} />
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <ShoppingCart01Icon size={20} />
                <span className="font-baloo font-bold text-sm">View Cart 0</span>
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                name={product.name}
                price={product.price}
                image={product.image}
                stock={product.stock}
              />
            ))}
          </div>

          {/* Pagination/Load More */}
          <div className="flex flex-col items-center gap-6 mt-12">
            <p className="font-satoshi text-primary/60 text-lg">
              Showing 12 of 50
            </p>
            <button className="px-10 py-4 bg-primary text-white font-baloo font-bold text-lg rounded-[8px] hover:bg-primary/90 transition-colors">
              Load More Products
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
