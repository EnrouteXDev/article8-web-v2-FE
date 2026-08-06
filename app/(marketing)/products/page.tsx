import React from "react";
import PageHero from "@/components/shared/PageHero";
import ProjectStackingSection from "@/components/pages/projects/ProjectStackingSection";
import ProductListSection from "@/components/pages/product/ProductListSection";
import DiscussWithUsContainer from "@/components/pages/product/DiscussWithUsContainer";

export default function Products() {
  return (
    <main className="flex flex-col bg-background text-foreground">
      <PageHero
        title="Products"
        description="Wonder and enjoy the works we have done over the years"
        image="/OneDrive_1_8-6-2026 (1)/Products.png"
      />

      <ProductListSection />

      <DiscussWithUsContainer />
     </main>
  );
}
