import React from "react";
import Image from "next/image";

export default function VisionSection() {
  return (
    <section className="w-full py-16 lg:py-24 bg-background section-px">
      <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Column: Text Content */}
        <div className="flex flex-col gap-8">
          <h2 className="font-baloo font-bold text-4xl lg:text-[56px] text-primary leading-tight">
            Rooted in Clear Vision.
            <br />
            Driven by Detail.
          </h2>

          <div className="flex flex-col gap-6 font-satoshi text-lg lg:text-[20px] text-primary font-normal leading-relaxed">
            <p>
              Since day one, we've believed that spaces and people shape each other. What started as a small design studio has grown into a full-service interior design firm.
            </p>
            <p>
              Our passion for creativity, functionality, and craftsmanship drives every project. Every project we undertake is crafted with precision, attention to detail, and a deep understanding of our clients’ needs.
            </p>
          </div>

          <div className="flex items-center gap-16 mt-4">
            <div className="flex flex-col gap-1">
              <span className="font-baloo font-bold text-4xl lg:text-[56px] text-primary">
                8+
              </span>
              <span className="font-satoshi text-base text-primary/80">
                Completed Projects
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-baloo font-bold text-4xl lg:text-[56px] text-primary">
                20+
              </span>
              <span className="font-satoshi text-base text-primary/80">
                Satisfied Clients
              </span>
            </div>
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
