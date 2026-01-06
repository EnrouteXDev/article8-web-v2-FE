import React from "react";
import PageHero from "@/components/shared/PageHero";

export default function Store() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <PageHero
        title="Store"
        description="Our selection of curated items for your space."
      />
      {/* Additional Store Page Content will go here */}
    </main>
  );
}
