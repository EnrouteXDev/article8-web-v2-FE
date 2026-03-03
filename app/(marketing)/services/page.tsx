import React from "react";
import PageHero from "@/components/shared/PageHero";
import ServicesContent from "@/components/pages/services/ServicesContent";

export default function Services() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <PageHero
        title="Services"
        description="Explore our services"
      />

      <ServicesContent />

      {/* Additional Services Page Content will go here */}
    </main>
  );
}
