import React from "react";
import PageHero from "@/components/shared/PageHero";
import ProjectStackingSection from "@/components/pages/projects/ProjectStackingSection";

export default function Products() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <PageHero
        title="Products"
        description="Wonder and enjoy the works we have done over the years"
        image="/OneDrive_1_8-6-2026 (1)/Products.png"
      />

      <ProjectStackingSection />

      {/* Additional Products Page Content will go here */}
    </main>
  );
}
