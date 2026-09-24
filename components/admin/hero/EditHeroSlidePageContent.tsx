"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminPage from "@/components/admin/shared/AdminPage";
import { Spinner } from "@/components/ui/spinner";
import HeroSlideForm, { formValuesToInput, slideToFormValues } from "@/components/admin/hero/HeroSlideForm";
import { useHeroSlide, useUpdateHeroSlide } from "@/lib/queries/hero-slides";
import type { HeroSlideFormValues } from "@/lib/schemas";

interface Props {
  id: string;
}

export default function EditHeroSlidePageContent({ id }: Props) {
  const router = useRouter();
  const { data, isLoading, isError } = useHeroSlide(id);
  const { mutate: updateSlide, isPending, error } = useUpdateHeroSlide();

  const errorMessage =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any)?.response?.data?.message ?? (error ? "Failed to update slide." : null);

  if (isLoading) {
    return (
      <AdminPage className="bg-white rounded-xl p-6 flex items-center justify-center min-h-[300px]">
        <Spinner className="size-6 text-gray-400" />
      </AdminPage>
    );
  }

  if (isError || !data?.slide) {
    return (
      <AdminPage className="bg-white rounded-xl p-6">
        <p className="text-sm text-red-500">Slide not found.</p>
      </AdminPage>
    );
  }

  const onSubmit = (values: HeroSlideFormValues) => {
    updateSlide(
      { id, data: formValuesToInput(values) },
      {
        onSuccess: () => {
          toast.success("Slide updated");
          router.push("/admin/hero");
        },
        onError: (err) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const message = (err as any)?.response?.data?.message ?? "Failed to update slide";
          toast.error(Array.isArray(message) ? message.join(", ") : message);
        },
      },
    );
  };

  return (
    <HeroSlideForm
      key={data.slide._id}
      heading="Edit Hero Slide"
      subheading="Changes go live on the home page as soon as you save"
      submitLabel="Save changes"
      pendingLabel="Saving..."
      defaultValues={slideToFormValues(data.slide)}
      isPending={isPending}
      errorMessage={Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage}
      onSubmit={onSubmit}
    />
  );
}
