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
    title: "Our Vision",
    description: "To build immersive animated worlds that resonate emotionally, reflect cultural depth, and stand the test of time."
  },
  {
    id: "002",
    title: "Our Mission",
    description: "To create animation that prioritizes strong storytelling, intentional design, and meaningful collaboration, delivering work that feels grounded, deliberate, and human."
  },
  {
    id: "003",
    title: "Our Goal",
    description: "Our goal is to create original animated work that balances strong storytelling, intentional design, and emotional impact, while building a collaborative studio culture that values craft, learning, and long-term creative growth."
  }
];

export default function GoalsSection() {
  return (
    <section className="w-full py-16 lg:py-24 bg-background section-px">
      <div className="section-container flex flex-col gap-12 lg:gap-16">

        {/* Header */}
        <div className="flex flex-col gap-6">
          <SectionHeader
            smallHeader="Vision & Mission"
            mainHeader="Driven by storytelling & craft."
          />
          <p className="font-satoshi font-normal text-lg lg:text-2xl leading-relaxed text-primary max-w-4xl">
            We are committed to creating work that resonates emotionally and stands the test of time.
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
