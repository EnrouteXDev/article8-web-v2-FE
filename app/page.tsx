import AboutSection from "@/components/pages/home/AboutSection";
import WhatWeDoSection from "@/components/pages/home/WhatWeDoSection";
import BehindTheSceneSection from "@/components/pages/home/BehindTheSceneSection";
import ContactSection from "@/components/pages/home/ContactSection";
import ToolsSection from "@/components/pages/home/ToolsSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-black">
      <AboutSection />
      <WhatWeDoSection />
      <BehindTheSceneSection />
      <ToolsSection />
      <ContactSection />
    </div>
  );
}
