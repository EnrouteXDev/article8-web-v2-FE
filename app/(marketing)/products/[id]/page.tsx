import React from "react";
import ProductDetailContent from "@/components/pages/products/ProductDetailContent";
import DiscussWithUsContainer from "@/components/pages/product/DiscussWithUsContainer";

export default function ProductDetailPage() {
  return (
    <main className="flex flex-col bg-background text-foreground">
      <ProductDetailContent />
      <DiscussWithUsContainer />
    </main>
  );
}