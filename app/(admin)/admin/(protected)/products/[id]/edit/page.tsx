import EditProductPageContent from "@/components/admin/products/EditProductPageContent";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  return <EditProductPageContent id={id} />;
}
