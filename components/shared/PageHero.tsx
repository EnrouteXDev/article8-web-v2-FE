import React from "react";
import Image from "next/image";

interface PageHeroProps {
  title: string;
  description: string;
}

export default function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="relative w-full h-[80vh] min-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/heroBg.jpg"
          alt={`${title} Hero Background`}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full section-px pb-20 flex items-end">
        <div className="section-container w-full flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 lg:gap-0">
          {/* Title */}
          <h1 className="font-baloo font-bold text-white text-[80px] lg:text-[120px] leading-none">
            {title}
          </h1>

          {/* Description Paragraph */}
          <div className="max-w-[397px]">
            <p
              className="text-white text-[24px] leading-tight"
              style={{ fontFamily: 'var(--font-baloo-2)' }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
