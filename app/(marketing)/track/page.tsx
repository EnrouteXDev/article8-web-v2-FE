import { Suspense } from "react";
import TrackingPage from "@/components/pages/track/TrackingPage";

export const metadata = {
  title: "Track your order — Article 8 Media Studios",
};

export default function TrackPage() {
  return (
    <Suspense>
      <TrackingPage />
    </Suspense>
  );
}
