import React from "react";
import Image from "next/image";
import SectionHeader from "@/components/shared/headers/SectionHeader";

export default function ToolsSection() {
  const tools = [
    "Adobe",
    "Microsoft",
    "Blender",
    "Firefox",
    "Pencil",
    "Aizen",
    "Tool 7",
    "Tool 8",
    "Unreal Engine",
    "CLO",
    "Tool 11",
    "Artlist",
    "Logic Pro",
    "Tool 14",
    "DaVinci Resolve",
  ];

  return (
    <section className="w-full py-16 bg-background section-px">
      <div className="section-container flex flex-col gap-12">
        <SectionHeader
          smallHeader="Tools we use"
          mainHeader="We work with industry-leading tools to ensure every frame meets cinematic Precision"
          alignment="left"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-l border-r border-[#ED1C24] bg-[#ED1C24] gap-[1px]">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="aspect-square flex items-center justify-center bg-background p-8"
            >
              <div className="relative w-full h-full max-w-[80px] max-h-[80px]">
                {/* Placeholder for now using simple text, replacing with Image later */}
                <div className="w-full h-full flex items-center justify-center text-primary/50 font-baloo font-bold text-center">
                  {tool}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
