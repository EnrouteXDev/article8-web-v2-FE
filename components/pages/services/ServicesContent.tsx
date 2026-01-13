"use client"
import React, { useState } from "react";
import Image from "next/image";
import SectionHeader from "@/components/shared/headers/SectionHeader";
import { ArrowDown01Icon, ArrowRight01Icon } from "hugeicons-react";

interface SubService {
  title: string;
  description?: string;
}

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  subServices: SubService[];
}

const services: ServiceItem[] = [
  {
    id: "01",
    title: "Animation & Motion Design",
    subtitle: "Bringing ideas to life through 2D, 3D, and motion-driven storytelling.",
    image: "/demo.jpg",
    subServices: [
      { title: "2D Explainer Videos", description: "Bringing ideas to life through 2D, 3D, and motion-driven storytelling." },
      { title: "Character Animation & Rigging" },
      { title: "Motion Graphics & Infographics" },
      { title: "VFX & Compositing" }
    ]
  },
  {
    id: "02",
    title: "3D Modelling, Visualization & Interactive Media",
    subtitle: "Bringing ideas to life through 2D, 3D, and motion-driven storytelling.",
    image: "/demo.jpg",
    subServices: [
      { title: "2D Explainer Videos", description: "Bringing ideas to life through 2D, 3D, and motion-driven storytelling." },
      { title: "Character Animation & Rigging" },
      { title: "Motion Graphics & Infographics" },
      { title: "VFX & Compositing" }
    ]
  },
  {
    id: "03",
    title: "Creative Development & Branding",
    subtitle: "Bringing ideas to life through 2D, 3D, and motion-driven storytelling.",
    image: "/demo.jpg",
    subServices: [
      { title: "2D Explainer Videos", description: "Bringing ideas to life through 2D, 3D, and motion-driven storytelling." },
      { title: "Character Animation & Rigging" },
      { title: "Motion Graphics & Infographics" },
      { title: "VFX & Compositing" }
    ]
  },
  {
    id: "04",
    title: "Film, Audio & Post-Production",
    subtitle: "Bringing ideas to life through 2D, 3D, and motion-driven storytelling.",
    image: "/demo.jpg",
    subServices: [
      { title: "2D Explainer Videos", description: "Bringing ideas to life through 2D, 3D, and motion-driven storytelling." },
      { title: "Character Animation & Rigging" },
      { title: "Motion Graphics & Infographics" },
      { title: "VFX & Compositing" }
    ]
  }
];

export default function ServicesContent() {
  const [openIds, setOpenIds] = useState<string[]>(["01"]);

  const toggleAccordion = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-background section-px">
      <div className="section-container flex flex-col gap-12 lg:gap-16">

        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <SectionHeader
            smallHeader="Our Services"
            mainHeader="Driven by purpose & principles."
          />
          <p className="font-satoshi font-normal text-lg lg:text-2xl leading-relaxed text-primary max-w-4xl">
            Our mission is to deliver emotionally resonant and functionally brilliant spaces.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col border-t border-primary/20">
          {services.map((service) => (
            <div key={service.id} className="border-b border-primary/20">
              {/* Header */}
              <div
                className="flex items-center justify-between py-10 cursor-pointer group"
                onClick={() => toggleAccordion(service.id)}
              >
                <div className="flex items-start gap-6 lg:gap-8">
                  <span className="font-satoshi text-primary text-xl lg:text-2xl pt-2">[{service.id}]</span>
                  <div className="flex flex-col gap-3">
                    <h3 className="font-baloo font-bold text-3xl lg:text-[48px] text-primary leading-tight">
                      {service.title}
                    </h3>
                    <p className="font-satoshi text-lg lg:text-xl text-primary leading-relaxed">
                      {service.subtitle}
                    </p>
                  </div>
                </div>

                <div className={`w-[64px] h-[64px] rounded-full border border-primary flex items-center justify-center text-primary shrink-0 transition-transform duration-300 ${openIds.includes(service.id) ? 'rotate-180' : ''}`}>
                  <ArrowDown01Icon size={32} />
                </div>
              </div>

              {/* Expanded Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIds.includes(service.id) ? 'max-h-[2000px] mb-12' : 'max-h-0'}`}>
                <div className="flex flex-col gap-12 ">
                  {/* Large Image */}
                  <div className="relative w-full aspect-video lg:aspect-21/9 rounded-[24px] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Sub-services List */}
                  <ul className="flex flex-col border-t border-primary/20">
                    {service.subServices.map((sub, idx) => (
                      <li key={idx} className="flex flex-col py-6 border-b border-primary/20">
                        <div className="flex items-center gap-4 text-primary">
                          <div className="w-4 h-4 rounded-full bg-primary shrink-0" />
                          <span className="font-baloo font-bold text-2xl lg:text-[28px] leading-tight text-primary uppercase">
                            {sub.title}
                          </span>
                        </div>
                        {sub.description && (
                          <p className="mt-2 font-satoshi text-lg lg:text-xl text-primary leading-relaxed pl-8">
                            {sub.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
