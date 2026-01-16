import React from "react";
import Image from "next/image";
import SectionHeader from "@/components/shared/headers/SectionHeader";

export default function ToolsSection() {
  const tools = [
    "/tools/tool1.svg",
    "/tools/tool2.svg",
    "/tools/tool3.svg",
    "/tools/tool4.svg",
    "/tools/tool5.svg",
    "/tools/tool6.svg",
    "/tools/tool7.svg",
    "/tools/tool8.svg",
    "/tools/tool9.svg",
    "/tools/tool10.svg",
  ];

  return (
    <section className="w-full py-16 bg-background section-px">
      <div className="section-container flex flex-col gap-12">
        <SectionHeader
          smallHeader="Tools we use"
          mainHeader="We work with industry-leading tools to ensure every frame meets cinematic Precision"
          alignment="left"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-l border-r border-[#ED1C24] bg-[#ED1C24] gap-px">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="aspect-square flex items-center justify-center bg-background p-8"
            >
              <div className="relative w-full h-full max-w-[80px] max-h-[80px] flex items-center justify-center">
                <Image
                  src={tool}
                  alt={`Tool ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-contain w-auto h-auto max-w-full max-h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
