import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface SimilarProductsProps {
  products: Product[];
}

export default function SimilarProducts({ products }: SimilarProductsProps) {
  if (!products.length) return null;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-baloo font-bold text-primary text-2xl">Similar Products</h2>
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {products.map((p) => (
          <div key={p._id} className="w-[180px] shrink-0">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Link
          href="/store"
          className="px-10 py-3 bg-primary text-white font-baloo font-bold text-base rounded-lg hover:bg-primary/90 transition-colors"
        >
          View More Products
        </Link>
      </div>
    </div>
  );
}
