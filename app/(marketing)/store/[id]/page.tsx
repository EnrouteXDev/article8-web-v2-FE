import { use } from "react";
import type { Metadata } from "next";
import ProductDetailContent from "@/components/pages/store/ProductDetailContent";
import { getProductById } from "@/lib/api/products";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getProductById(id);
    const product = data.product;
    return {
      title: `${product.name} — Article 8 Media Studios`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch {
    return { title: "Product — Article 8 Media Studios" };
  }
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ProductDetailContent id={id} />;
}
