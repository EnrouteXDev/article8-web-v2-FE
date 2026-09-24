"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import HeroSlideForm, { emptyHeroSlideValues, formValuesToInput } from "@/components/admin/hero/HeroSlideForm";
import { useAllHeroSlides, useCreateHeroSlide } from "@/lib/queries/hero-slides";
import type { HeroSlideFormValues } from "@/lib/schemas";

export default function CreateHeroSlidePageContent() {
  const router = useRouter();
  const { data } = useAllHeroSlides();
  const { mutate: createSlide, isPending, error } = useCreateHeroSlide();

  // Default a new slide to the end of the current run.
  const nextOrder = (data?.slides ?? []).reduce((max, s) => Math.max(max, s.order ?? 0), 0) + 1;

  const errorMessage =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any)?.response?.data?.message ?? (error ? "Failed to create slide." : null);

  const onSubmit = (values: HeroSlideFormValues) => {
    createSlide(formValuesToInput(values), {
      onSuccess: () => {
        toast.success("Slide created");
        router.push("/admin/hero");
      },
      onError: (err) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = (err as any)?.response?.data?.message ?? "Failed to create slide";
        toast.error(Array.isArray(message) ? message.join(", ") : message);
      },
    });
  };

  return (
    <HeroSlideForm
      key={nextOrder}
      heading="New Hero Slide"
      subheading="Slides rotate in the hero carousel at the top of the home page"
      submitLabel="Publish"
      pendingLabel="Publishing..."
      defaultValues={{ ...emptyHeroSlideValues, order: nextOrder }}
      isPending={isPending}
      errorMessage={Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage}
      onSubmit={onSubmit}
    />
  );
}
