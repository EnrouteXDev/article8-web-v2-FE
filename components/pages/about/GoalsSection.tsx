import React from "react";
import SectionHeader from "@/components/shared/headers/SectionHeader";

interface GoalItem {
  id: string;
  title: string;
  description: string;
}

const goals: GoalItem[] = [
  {
    id: "001",
    title: "Our Goals",
    description: "Our mission is to deliver emotionally resonant and functionally brilliant spaces."
  },
  {
    id: "002",
    title: "Our Vision",
    description: "Creating timeless interiors with purpose, precision, and personality."
  },
  {
    id: "003",
    title: "Our mission",
    description: "To redefine interior design through thoughtful, lasting experiences."
  }
];

export default function GoalsSection() {
  return (
    <section className="w-full py-16 lg:py-24 bg-background section-px">
      <div className="section-container flex flex-col gap-12 lg:gap-16">

        {/* Header */}
        <div className="flex flex-col gap-6">
          <SectionHeader
            smallHeader="Our Goals"
            mainHeader="Driven by purpose & principles."
          />
          <p className="font-satoshi font-normal text-lg lg:text-2xl leading-relaxed text-primary max-w-4xl">
            Our mission is to deliver emotionally resonant and functionally brilliant spaces.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-[#FFE2E2] rounded-[16px] px-5 py-8 flex flex-col gap-4.5 "
            >
              <span className="font-satoshi font-medium text-lg text-primary">
                {goal.id}
              </span>
              <h3 className="font-baloo font-bold text-3xl lg:text-4xl text-primary">
                {goal.title}
              </h3>
              <p className="font-satoshi font-normal text-lg lg:text-xl text-primary leading-relaxed">
                {goal.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
