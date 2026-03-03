import React from "react";
import AboutHero from "@/components/pages/about/AboutHero";
import VisionSection from "@/components/pages/about/VisionSection";
import GoalsSection from "@/components/pages/about/GoalsSection";
import ProcessSection from "@/components/pages/about/ProcessSection";
import PeopleSection from "@/components/pages/about/PeopleSection";
import ToolsSection from "@/components/pages/home/ToolsSection";

export default function About() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <AboutHero />
      <VisionSection />
      <GoalsSection />
      <ProcessSection />
      <PeopleSection />
      <ToolsSection />
      {/* Additional About Page Content will go here */}
    </main>
  );
}
