import React from "react";
import PageHero from "@/components/shared/PageHero";

export default function Gallery() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <PageHero
        title="Gallery"
        description="Take a walk through our visual journey, where our ideas live."
      />
      {/* Additional Gallery Page Content will go here */}
    </main>
  );
}
