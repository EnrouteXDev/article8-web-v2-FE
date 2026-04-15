import PageHero from "@/components/shared/PageHero";
import ServicesContent from "@/components/pages/services/ServicesContent";

export default function Services() {
  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      <PageHero
        title="Services"
        description="Explore our services"
        image="/OneDrive_1_4-15-2026 (1)/Our Services.png"
      />

      <ServicesContent />

      {/* Additional Services Page Content will go here */}
    </main>
  );
}
