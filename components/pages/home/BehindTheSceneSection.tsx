import React from "react";
import Image from "next/image";
import SectionHeader from "@/components/shared/headers/SectionHeader";

export default function BehindTheSceneSection() {
  const images = Array(6).fill("/demo.jpg");

  return (
    <section className="w-full py-16 bg-background section-px">
      <div className="section-container flex flex-col gap-12">
        <SectionHeader
          smallHeader="The Process"
          mainHeader="Behind the Scene"
          alignment="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative w-full aspect-400/250 rounded-[24px] overflow-hidden group"
            >
              <Image
                src={src}
                alt={`Behind the scene ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
