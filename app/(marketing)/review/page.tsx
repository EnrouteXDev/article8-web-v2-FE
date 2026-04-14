import { Suspense } from "react";
import ReviewJourney from "@/components/pages/review/ReviewJourney";

export const metadata = {
  title: "Review your order — Article 8 Media Studios",
};

export default function ReviewPage() {
  return (
    <Suspense>
      <ReviewJourney />
    </Suspense>
  );
}
