import ProductDetailContent from "@/components/pages/store/ProductDetailContent";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetailContent id={params.id} />;
}
