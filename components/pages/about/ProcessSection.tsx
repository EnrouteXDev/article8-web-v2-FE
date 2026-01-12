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
    title: "Pre-Production",
    description: "This is where the foundation of every project is built. During pre-production, we focus on defining the story, tone, and visual direction before animation begins.",
    image: "/demo.jpg"
  },
  {
    id: "002",
    title: "Production",
    description: "Production is where ideas are brought to life through animation and execution. At this stage, our team focuses on building, animating, and refining assets.",
    image: "/demo.jpg"
  },
  {
    id: "003",
    title: "Post-Production",
    description: "Post-production is where all elements come together to form the final experience. This stage focuses on polishing, enhancing, and finalizing the project.",
    image: "/demo.jpg"
  }
];

export default function ProcessSection() {
  return (
    <section className="w-full py-16 lg:py-24 bg-background section-px">
      <div className="section-container flex flex-col gap-12 lg:gap-16">

        {/* Header */}
        <div className="flex flex-col gap-6">
          <SectionHeader
            smallHeader="Our Process"
            mainHeader="A Thoughtful Animation Journey"
          />
          <p className="font-satoshi font-normal text-lg lg:text-2xl leading-relaxed text-primary max-w-4xl">
            Our process, from pre-production to finalizing the project, is rooted in storytelling and precision.
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
