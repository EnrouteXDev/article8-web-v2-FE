"use client"
import React, { useState } from "react";
import SectionHeader from "@/components/shared/headers/SectionHeader";
import { ArrowDown01Icon, ArrowUp01Icon, CheckmarkCircle02Icon, ArrowRight01Icon } from "hugeicons-react";

interface ServiceItem {
  id: string;
  title: string;
  subServices: string[];
  description: string;
}

const services: ServiceItem[] = [
  {
    id: "01",
    title: "Animation & Motion Design",
    subServices: [
      "2D Explainer Videos",
      "Character Animation & Rigging",
      "Motion Graphics & Infographics",
      "VFX & Compositing"
    ],
    description: "Bringing ideas to life through 2D, 3D, and motion-driven storytelling."
  },
  {
    id: "02",
    title: "3D Modelling, Visualization & Interactive Media",
    subServices: [
      "Product Visualization",
      "Architectural Visualization",
      "Interactive 3D Experiences",
      "Game Assets"
    ],
    description: "Creating immersive 3D worlds and realistic visualizations that captivate your audience."
  },
  {
    id: "03",
    title: "Creative Development & Branding",
    subServices: [
      "Brand Identity",
      "Creative Strategy",
      "Visual Design",
      "Art Direction"
    ],
    description: "Building strong, memorable brands through strategic creative development and visual design."
  },
  {
    id: "04",
    title: "Film, Audio & Post-Production",
    subServices: [
      "Video Editing",
      "Sound Design",
      "Color Grading",
      "Voiceover Recording"
    ],
    description: "Polishing your visual content with professional post-production and high-quality audio services."
  }
];

export default function WhatWeDoSection() {
  const [openId, setOpenId] = useState<string | null>("01");

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full py-16 bg-background section-px">
      <div className="section-container flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <SectionHeader
            smallHeader="Services"
            mainHeader="What we do"
          />
          <p className="font-satoshi font-normal text-lg lg:text-2xl leading-relaxed text-primary max-w-4xl">
            Article8 Media Studio is where design meets motion, and brands steps into 3D storytelling that demands attention.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bg-[#FFE2E2] rounded-[16px] overflow-hidden transition-all duration-300 ${openId === service.id ? 'pb-8' : ''}`}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-6 md:p-8 cursor-pointer"
                onClick={() => toggleAccordion(service.id)}
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-primary text-xl lg:text-2xl">[{service.id}]</span>
                  <h3 className="font-satoshi font-medium text-2xl lg:text-[36px] text-primary leading-tight">
                    {service.title}
                  </h3>
                </div>

                <div className="w-[46px] h-[46px] rounded-full border border-primary flex items-center justify-center text-primary shrink-0 transition-transform duration-300 transform">
                  {openId === service.id ? (
                    <ArrowUp01Icon size={24} />
                  ) : (
                    <ArrowDown01Icon size={24} />
                  )}
                </div>
              </div>

              {/* Content */}
              {openId === service.id && (
                <div className="px-6 md:px-8 md:pl-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 animate-in slide-in-from-top-4 duration-300 fade-in">
                  {/* Left: List */}
                  <ul className="flex flex-col border-t border-primary">
                    {service.subServices.map((sub, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-4 text-primary py-4 border-b border-primary bg-transparent"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <ArrowRight01Icon size={14} className="text-white" />
                        </div>
                        <span className="font-satoshi text-lg lg:text-[24px] leading-tight">
                          {sub}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Right: Description */}
                  <div>
                    <p className="font-satoshi font-normal text-lg lg:text-[20px] leading-relaxed text-primary">
                      {service.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
