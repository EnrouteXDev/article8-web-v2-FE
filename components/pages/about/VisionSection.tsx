import React from "react";
import Image from "next/image";

export default function VisionSection() {
  return (
    <section className="w-full py-16 lg:py-24 bg-background section-px">
      <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Column: Text Content */}
        <div className="flex flex-col gap-8">
          <h2 className="font-baloo font-bold text-4xl lg:text-[56px] text-primary leading-tight">
            Crafting worlds with
            <br />
            intention and craft.
          </h2>

          <div className="flex flex-col gap-6 font-satoshi text-lg lg:text-[20px] text-primary font-normal leading-relaxed">
            <p>
              We are an animation studio focused on crafting visually rich, story-driven worlds rooted in intention, culture, and craft. We believe strong stories are built long before animation begins, and we treat every project as an opportunity to explore meaning, atmosphere, and emotion through thoughtful visual language.
            </p>
            <p>
              As a studio, we value patience in process, clarity in direction, and collaboration across disciplines. Every frame we work toward is shaped by the people behind it and the world we are building together.
            </p>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="relative w-full h-[400px] lg:h-[500px] rounded-[24px] overflow-hidden">
          {/* Using demo.jpg as placeholder from the public folder based on previous list_dir */}
          <Image
            src="/demo.jpg"
            alt="Vision Abstract Image"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
