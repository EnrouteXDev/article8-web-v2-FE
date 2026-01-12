import React from "react";
import Image from "next/image";

export interface Artifact {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

interface ArtifactCardProps {
  artifact: Artifact;
  isActive: boolean;
}

export default function ArtifactCard({ artifact, isActive }: ArtifactCardProps) {
  return (
    <div
      className={`
        w-full bg-[#FFF9F5] rounded-[16px] overflow-hidden flex flex-col
        transition-shadow duration-500 ease-out
        ${isActive ? 'shadow-[0_0_40px_rgba(220,38,38,0.15)]' : 'shadow-none'}
      `}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-4/3 overflow-hidden p-3 sm:p-4 pb-0">
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <Image
            src={artifact.image}
            alt={artifact.title}
            fill
            className="object-cover"
            priority={isActive}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-baloo font-bold text-lg sm:text-xl lg:text-2xl text-primary leading-tight">
            {artifact.title}
          </h3>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {artifact.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 sm:py-1 border border-primary text-primary text-[10px] sm:text-xs font-satoshi font-medium rounded-full whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="font-satoshi font-normal text-sm sm:text-base text-primary/80 line-clamp-3 sm:line-clamp-4">
          {artifact.description}
        </p>
      </div>
    </div>
  );
}