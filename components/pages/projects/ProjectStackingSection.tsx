"use client"
import React from "react";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  align: "left" | "right";
}

const projects: ProjectItem[] = [
  {
    id: "01",
    title: "Discovery & Insight",
    description: "We begin by listening understanding your lifestyle, needs, and the essence of your space.",
    videoUrl: "https://res.cloudinary.com/dfyiemvio/video/upload/v1767776301/file_example_MP4_480_1_5MG_ubzhtu.mp4",
    align: "right"
  },
  {
    id: "02",
    title: "Discovery & Insight",
    description: "We begin by listening understanding your lifestyle, needs, and the essence of your space.",
    videoUrl: "https://res.cloudinary.com/dfyiemvio/video/upload/v1767776301/file_example_MP4_480_1_5MG_ubzhtu.mp4",
    align: "left"
  },
  {
    id: "03",
    title: "Discovery & Insight",
    description: "We begin by listening understanding your lifestyle, needs, and the essence of your space.",
    videoUrl: "https://res.cloudinary.com/dfyiemvio/video/upload/v1767776301/file_example_MP4_480_1_5MG_ubzhtu.mp4",
    align: "right"
  }
];

export default function ProjectStackingSection() {
  return (
    <section className="relative w-full">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden border-b border-white/10"
          style={{ zIndex: index + 1 }}
        >
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={project.videoUrl} type="video/mp4" />
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="relative z-10 w-full section-px">
            <div className={`section-container flex flex-col ${project.align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
              <div className="max-w-2xl ">
                <h2 className="font-baloo font-semibold text-4xl lg:text-[50px] text-white mb-4">
                  {project.title}
                </h2>
                <p className="font-satoshi text-lg lg:text-[32px] text-white leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
