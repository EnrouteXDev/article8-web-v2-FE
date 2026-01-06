import React from "react";
import Image from "next/image";
import SectionHeader from "@/components/shared/headers/SectionHeader";

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  image: string;
}

const steps: ProcessStep[] = [
  {
    id: "001",
    title: "Discovery & Insight",
    description: "We begin by listening understanding your lifestyle, needs, and the essence of your space.",
    image: "/demo.jpg" // Using placeholder as planned
  },
  {
    id: "001", // Intentional duplicate ID based on design screenshot? Or should be 002? Design shows 001 for all. I will Stick to design but maybe it's a placeholder in design. I'll make them unique in data but display what's requested. Actually, let's assume 001, 002, 003 for logical progression, but the screenshot shows 001 three times. I will use 001, 002, 003 as it is likely a design mock error, but I can also just follow the mock blindly. Let's do 001 all for now to match screenshot exactly, or maybe 001, 002, 003 is safer. The user said "Process... from meeting to unveiling", implying sequence. I will use sequential numbers.
    title: "Discovery & Insight", // Screenshot shows identical content. I will use valid content if I can infer it, or just duplicate for now as per design image.
    description: "We begin by listening understanding your lifestyle, needs, and the essence of your space.",
    image: "/demo.jpg"
  },
  {
    id: "001",
    title: "Discovery & Insight",
    description: "We begin by listening understanding your lifestyle, needs, and the essence of your space.",
    image: "/demo.jpg"
  }
];

// Correcting the data to be more realistic while keeping the structure, 
// or should I stick to the screenshot exactly? 
// The screenshot shows "001 Discovery & Insight" three times. 
// I will stick to the screenshot's repetitive content for now as it's a direct reference, 
// but I'll use unique keys.

export default function ProcessSection() {
  return (
    <section className="w-full py-16 lg:py-24 bg-background section-px">
      <div className="section-container flex flex-col gap-12 lg:gap-16">

        {/* Header */}
        <div className="flex flex-col gap-6">
          <SectionHeader
            smallHeader="Our Process"
            mainHeader="A Clear, Thoughtful Design Journey"
          />
          <p className="font-satoshi font-normal text-lg lg:text-2xl leading-relaxed text-primary max-w-4xl">
            Our process, from the meeting to the unveiling, teamwork, and innovation.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-satoshi font-medium text-lg text-primary">
                  {step.id}
                </span>
                <h3 className="font-baloo font-bold text-2xl lg:text-[32px] text-primary leading-tight">
                  {step.title}
                </h3>
                <p className="font-satoshi font-normal text-lg text-primary leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Image */}
              <div className="relative w-full aspect-4/3 rounded-[16px] overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
