import React from "react";
import Image from "next/image";
import SectionHeader from "@/components/shared/headers/SectionHeader";

export default function AboutSection() {
  return (
    <section className="w-full py-16 bg-background section-px">
      <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <SectionHeader
            smallHeader="About Us"
            mainHeader="We don't just make visuals, we build"
            alignment="left"
          />
          <p className="font-satoshi font-normal text-lg lg:text-[24px] leading-relaxed text-primary">
            At our core, we are committed to projecting Africa through a global lens telling stories that transcend borders while staying deeply rooted in the continent's cultural essence.
            <br />
            <br />
            We strive to redefine how African narratives are experienced, merging traditional heritage with modern storytelling to create animation that captivate audiences everywhere.
          </p>
          <button className="w-[157px] h-[57px] bg-primary text-white rounded-lg font-satoshi font-medium text-lg hover:opacity-90 transition-opacity">
            READ MORE
          </button>
        </div>

        <div className="relative w-full aspect-649/494 rounded-[32px] overflow-hidden">
          <Image
            src="/demo.jpg"
            alt="About Article8 Media"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
