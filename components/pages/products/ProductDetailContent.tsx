"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MOCK_PROJECT = {
  title: "Skyfall",
  year: "2025",
  client: "Article8",
  category: "Animation & Motion Design",
  heroImage: "/images/products/skyfall.png",
  detailsImage: "/images/products/product_details_1.png",
  description: [
    "Lorem ipsum dolor sit amet consectetur. Eget placerat phasellus leo morbi tristique non. Dignissim tincidunt nulla ut et nibh. Lectus amet tempus donec donec etiam vitae orci. Hendrerit nunc quis urna ultricies ornare etiam. Massa integer sit habitant rhoncus sollicitudin pharetra posuere massa. Sed ultrices ullamcorper est urna elit. Pellentesque in sed sed pellentesque nulla. Blandit est in porta luquis. In nulla lacus viverra ultrices ultricies quam ornare eget tincidunt. Enim gravida ut pulvinar scelerisque netus nulla egestas purus eros. Sed tristique dolor enim volutpat.",
    "Nulla sodales viverra nulla odio enim tristique scelerisque ac. Scelerisque sem non risus non pharetra pharetra in aliquet. Et nulla et justo at bibendum tempus viverra neque facilisis. Aliquet adipiscing erat risus senectus euismod. Vulputate vel fermentum vel amet mi viverra arcu felis ipsum. Eu viverra enim nunc ipsum viverra adipiscing. Dolor pharetra sagittis.",
  ],
  sections: [
    {
      title: "Overview",
      content:
        "Lorem ipsum dolor sit amet consectetur. Eget placerat phasellus leo morbi tristique non. Dignissim tincidunt nulla ut et nibh. Lectus amet tempus donec donec etiam vitae orci. Hendrerit nunc quis urna ultricies ornare etiam. Massa integer sit habitant rhoncus solrra enim nunc ipsum viverra adipiscing. Dolor pharetra sagittis.\n\nsit amet consectetur. Eget placerat phasellus leo morbi tristique non. Dignissim tincidunt nulla ut et nibh. Lectus amet tempus donec donec etiam vitae orci. Hendrerit nunc quis urna ultricies ornare etiam. Massa integer",
    },
    {
      title: "Challenge & Objective",
      content:
        "Lorem ipsum dolor sit amet consectetur. Eget placerat phasellus leo morbi tristique non. Dignissim tincidunt nulla ut et nibh. Lectus amet tempus donec donec etiam vitae orci. Hendrerit nunc quis urna ultricies ornare etiam. Massa integer sit habitant rhoncus solrra enim nunc ipsum viverra adipiscing. Dolor pharetra sagittis.\n\nsit amet consectetur. Eget placerat phasellus leo morbi tristique non. Dignissim tincidunt nulla ut et nibh. Lectus amet tempus donec donec etiam vitae orci. Hendrerit nunc quis urna ultricies ornare etiam. Massa integer",
    },
    {
      title: "Creative execution",
      content:
        "Lorem ipsum dolor sit amet consectetur. Eget placerat phasellus leo morbi tristique non. Dignissim tincidunt nulla ut et nibh. Lectus amet tempus donec donec etiam vitae orci. Hendrerit nunc quis urna ultricies ornare etiam. Massa integer sit habitant rhoncus solrra enim nunc ipsum viverra adipiscing. Dolor pharetra sagittis.\n\nsit amet consectetur. Eget placerat phasellus leo morbi tristique non. Dignissim tincidunt nulla ut et nibh. Lectus amet tempus donec donec etiam vitae orci. Hendrerit nunc quis urna ultricies ornare etiam. Massa integer",
    },
    {
      title: "Outputs/ Deliverables",
      content:
        "Lorem ipsum dolor sit amet consectetur. Eget placerat phasellus leo morbi tristique non. Dignissim tincidunt nulla ut et nibh. Lectus amet tempus donec donec etiam vitae orci. Hendrerit nunc quis urna ultricies ornare etiam. Massa integer sit habitant rhoncus solrra enim nunc ipsum viverra adipiscing. Dolor pharetra sagittis.\n\nsit amet consectetur. Eget placerat phasellus leo morbi tristique non. Dignissim tincidunt nulla ut et nibh. Lectus amet tempus donec donec etiam vitae orci. Hendrerit nunc quis urna ultricies ornare etiam. Massa integer",
    },
    {
      title: "Result & Impact",
      content:
        "Lorem ipsum dolor sit amet consectetur. Eget placerat phasellus leo morbi tristique non. Dignissim tincidunt nulla ut et nibh. Lectus amet tempus donec donec etiam vitae orci. Hendrerit nunc quis urna ultricies ornare etiam. Massa integer sit habitant rhoncus solrra enim nunc ipsum viverra adipiscing. Dolor pharetra sagittis.\n\nsit amet consectetur. Eget placerat phasellus leo morbi tristique non. Dignissim tincidunt nulla ut et nibh. Lectus amet tempus donec donec etiam vitae orci. Hendrerit nunc quis urna ultricies ornare etiam. Massa integer",
    },
  ],
};

export default function ProductDetailContent() {
  return (
    <article className="w-full bg-white">
      {/* Hero Header - Deep Black Section */}
      <div className="w-full bg-[#050505] pt-32 pb-20 overflow-hidden">
        <div className="section-container section-px flex justify-center">
          <div className="relative w-full aspect-21/9 md:aspect-3/1 max-w-6xl overflow-hidden">
            {/* <Image
              src={MOCK_PROJECT.heroImage}
              alt={MOCK_PROJECT.title}
              fill
              priority
              className="object-contain"
            /> */}
          </div>
        </div>
      </div>

      {/* Main Content Info */}
      <div className="section-container section-px py-16 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
          {/* Sidebar Meta */}
          <div className="flex flex-col items-start gap-3 md:gap-4 md:sticky md:top-32 h-fit">
            <h1 className="font-baloo font-bold text-[#DA2439] text-[36px] md:text-[48px] leading-tight">
              {MOCK_PROJECT.title}
            </h1>
            <div className="flex flex-col gap-1 md:gap-2 text-[#667085] font-satoshi text-lg md:text-xl">
              <p>Year: {MOCK_PROJECT.year}</p>
              <p>Client: {MOCK_PROJECT.client}</p>
            </div>
            <span className="mt-2 px-6 py-2 bg-[#F5EEEC] text-[#1D2939] text-sm font-satoshi font-semibold rounded-full">
              {MOCK_PROJECT.category}
            </span>
          </div>

          {/* Intro Text */}
          <div className="flex flex-col gap-8">
            {MOCK_PROJECT.description.map((para, i) => (
              <p
                key={i}
                className="text-[#667085] font-satoshi text-[18px] md:text-[22px] leading-relaxed"
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Double Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-16 md:mt-24">
          <div className="relative aspect-square w-full rounded-[20px] overflow-hidden grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
            <Image
              src={MOCK_PROJECT.detailsImage}
              alt="Detail 1"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square w-full rounded-[20px] overflow-hidden grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
            <Image
              src={MOCK_PROJECT.detailsImage}
              alt="Detail 2"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="flex flex-col gap-20 mt-24 md:mt-40">
          {MOCK_PROJECT.sections.slice(0, 3).map((section, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-24"
            >
              <h3 className="font-baloo font-bold text-[#DA2439] text-[24px] md:text-[32px]">
                {section.title}
              </h3>
              <div className="flex flex-col gap-6">
                {section.content.split("\n\n").map((p, i) => (
                  <p
                    key={i}
                    className="text-[#667085] font-satoshi text-[18px] md:text-[20px] leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* Video Placeholder */}
          <div className="w-full aspect-video rounded-[24px] overflow-hidden bg-black relative group cursor-pointer shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-12 border-t-transparent border-l-18 border-l-white border-b-12 border-b-transparent ml-2" />
              </div>
            </div>
            {/* Visualizer bars placeholder */}
            <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between gap-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-[#DA2439]" />
            </div>
          </div>

          {/* Secondary Image for Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 overflow-hidden rounded-[20px]">
            <div className="relative aspect-4/3 w-full">
              <Image
                src={MOCK_PROJECT.detailsImage}
                alt="Output 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-4/3 w-full">
              <Image
                src={MOCK_PROJECT.detailsImage}
                alt="Output 2"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Remaining Sections */}
          {MOCK_PROJECT.sections.slice(3).map((section, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-24"
            >
              <h3 className="font-baloo font-bold text-[#DA2439] text-[24px] md:text-[32px]">
                {section.title}
              </h3>
              <div className="flex flex-col gap-6">
                {section.content.split("\n\n").map((p, i) => (
                  <p
                    key={i}
                    className="text-[#667085] font-satoshi text-[18px] md:text-[20px] leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
// junk so i can commit
