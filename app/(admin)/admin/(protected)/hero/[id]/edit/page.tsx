import EditHeroSlidePageContent from "@/components/admin/hero/EditHeroSlidePageContent";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditHeroSlidePage({ params }: Props) {
  const { id } = await params;
  return <EditHeroSlidePageContent id={id} />;
}
