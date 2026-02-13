"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/shared/headers/SectionHeader";

interface Team {
  id: number;
  number: string;
  name: string;
  description: string;
}

const teams: Team[] = [
  {
    id: 1,
    number: "01",
    name: "Growth",
    description:
      "Our Growth team is the driving force behind expansion. They are dedicated to increasing our user base, and penetrating new markets. With a focus on data-driven strategies, ground-breaking partnerships and innovative marketing, the Growth org ensures we're continually reaching new heights and discovering fresh opportunities to expand our business.",
  },
  {
    id: 2,
    number: "02",
    name: "Business",
    description:
      "Our Business team drives strategic initiatives, partnerships, and revenue growth. They work closely with clients to understand their needs and deliver tailored solutions that exceed expectations while ensuring sustainable business development.",
  },
  {
    id: 3,
    number: "03",
    name: "Product & Engineering",
    description:
      "Our Product & Engineering team builds innovative solutions that power our services. They combine cutting-edge technology with user-centered design to create exceptional digital experiences that push the boundaries of what's possible.",
  },
  {
    id: 4,
    number: "04",
    name: "Operations",
    description:
      "Our Operations team ensures seamless execution across all projects. They optimize processes, manage resources, and maintain the highest standards of quality to keep our organization running efficiently and effectively.",
  },
];

export default function TeamsSection() {
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);

  return (
    <section className="w-full py-16 bg-background overflow-hidden">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="section-container section-px">
          <SectionHeader smallHeader="Our People" mainHeader="Teams" />
        </div>

        {/* Mobile: Horizontal Scroll - Cards with Team Name + Focus */}
        <div className="lg:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 px-8 snap-x snap-mandatory scrollbar-hide">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                className="bg-[#FFF9F5] rounded-[24px] p-6 flex flex-col min-w-[320px] max-w-[320px] min-h-[600px] snap-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col gap-4 flex-1">
                  <span className="font-mono text-primary text-lg">
                    [{team.number}]
                  </span>
                  <h3 className="font-satoshi font-medium text-2xl text-primary leading-tight">
                    {team.name}
                  </h3>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary"
                  >
                    <path
                      d="M30 0L33.09 26.91L60 30L33.09 33.09L30 60L26.91 33.09L0 30L26.91 26.91L30 0Z"
                      fill="currentColor"
                    />
                  </svg>
                  <p className="font-satoshi text-base leading-relaxed text-primary">
                    {team.description}
                  </p>
                </div>
                <button
                  className="w-fit mt-4 bg-primary text-white rounded-lg font-satoshi font-medium text-base px-6 h-[52px] hover:opacity-90 transition-opacity"
                  onClick={() => {
                    console.log("Meet the people:", team.name);
                  }}
                >
                  Meet the People
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop: 2 Column Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-16 section-container section-px">
          {/* Left Side - Teams List */}
          <div className="flex flex-col gap-6">
            {teams.map((team, index) => (
              <motion.button
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className={`bg-[#FFE2E2] rounded-2xl p-6 flex items-center gap-4 text-left transition-all duration-300 ${
                  selectedTeam.id === team.id
                    ? "ring-2 ring-primary"
                    : "hover:bg-[#FFEBEB]"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="font-mono text-primary text-xl shrink-0">
                  [{team.number}]
                </span>
                <h3 className="font-satoshi font-medium text-2xl lg:text-[32px] text-primary leading-tight">
                  {team.name}
                </h3>
              </motion.button>
            ))}
          </div>

          {/* Right Side - Focus Card */}
          <div className="flex flex-col gap-6">
            <h3 className="font-baloo text-[56px] lg:text-[72px] leading-[0.9] font-bold text-primary">
              Focus.
            </h3>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTeam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#FFF9F5] rounded-[32px] p-8 lg:p-12 flex flex-col gap-6"
              >
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary"
                >
                  <path
                    d="M30 0L33.09 26.91L60 30L33.09 33.09L30 60L26.91 33.09L0 30L26.91 26.91L30 0Z"
                    fill="currentColor"
                  />
                </svg>
                <p className="font-satoshi text-lg lg:text-[20px] leading-relaxed text-primary">
                  {selectedTeam.description}
                </p>
                <button
                  className="w-fit mt-4 bg-primary text-white rounded-lg font-satoshi font-medium text-lg px-8 h-[57px] hover:opacity-90 transition-opacity"
                  onClick={() => {
                    console.log("Meet the people:", selectedTeam.name);
                  }}
                >
                  Meet the People
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
