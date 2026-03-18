import React from "react";
import PageHero from "@/components/shared/PageHero";
import ProjectStackingSection from "@/components/pages/projects/ProjectStackingSection";
import ProductListSection from "@/components/pages/products/ProductListSection";
import DiscussWithUsContainer from "@/components/pages/products/DiscussWithUsContainer";

export default function Products() {
  return (
    <main className="flex flex-col bg-background text-foreground">
      <PageHero
        title="Products"
        description="Wonder and enjoy the works we have done over the years"
      />

      <ProductListSection />

      <DiscussWithUsContainer />

      {/* <ProjectStackingSection /> */}

      {/* Additional Products Page Content will go here */}
    </main>
  );
}
