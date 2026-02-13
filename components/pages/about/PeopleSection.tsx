"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/shared/headers/SectionHeader";

interface Person {
  id: number;
  name: string;
  team: string;
  image: string;
  linkedin?: string;
  twitter?: string;
}

const people: Person[] = [
  {
    id: 1,
    name: "Femi Adeyemi",
    team: "ANYWORK",
    image: "/demo.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    id: 2,
    name: "Olumide Johnson",
    team: "ENGINEERING",
    image: "/demo.jpg",
    linkedin: "#",
  },
  {
    id: 3,
    name: "Lanre Williams",
    team: "OPERATIONS",
    image: "/demo.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    id: 4,
    name: "Tomilola Adebayo",
    team: "BUSINESS",
    image: "/demo.jpg",
    linkedin: "#",
  },
  {
    id: 5,
    name: "Amaka Okonkwo",
    team: "GROWTH",
    image: "/demo.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    id: 6,
    name: "Damian Okoro",
    team: "GROWTH",
    image: "/demo.jpg",
    linkedin: "#",
  },
];

export default function PeopleSection() {
  const [hoveredPerson, setHoveredPerson] = useState<Person>(people[0]);

  return (
    <section className="w-full py-16 bg-background overflow-hidden">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="section-px">
          <div className="section-container">
            <SectionHeader smallHeader="Meet the Team" mainHeader="People" />
          </div>
        </div>

        {/* Mobile: Horizontal Scroll Cards */}
        <div className="lg:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 px-8 snap-x snap-mandatory scrollbar-hide">
            {people.map((person, index) => (
              <motion.div
                key={person.id}
                className="flex flex-col min-w-[280px] max-w-[280px] snap-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Photo */}
                <div className="relative w-full aspect-square rounded-t-[24px] overflow-hidden bg-gray-200">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Name Banner */}
                <div className="bg-primary px-6 py-4 flex items-center gap-2">
                  <span className="text-white text-2xl">●</span>
                  <h3 className="font-satoshi font-medium text-xl text-white leading-tight">
                    {person.name}
                  </h3>
                </div>

                {/* Team & Social */}
                <div className="bg-white px-6 py-4 rounded-b-[24px] flex items-center justify-between border border-t-0 border-gray-200">
                  <span className="font-satoshi font-bold text-sm text-primary tracking-wider">
                    {person.team}
                  </span>
                  <div className="flex gap-3">
                    {person.linkedin && (
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:opacity-70 transition-opacity"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                    {person.twitter && (
                      <a
                        href={person.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:opacity-70 transition-opacity"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop: Image + List */}
        <div className="section-px">
          <div className="hidden lg:grid lg:grid-cols-2 gap-16 section-container">
            {/* Left: Fixed Image */}
            <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden bg-gray-200 sticky top-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={hoveredPerson.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={hoveredPerson.image}
                    alt={hoveredPerson.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: People List */}
            <div className="flex flex-col">
              {people.map((person, index) => (
                <motion.div
                  key={person.id}
                  onMouseEnter={() => setHoveredPerson(person)}
                  className={`py-6 border-b border-gray-300 flex items-center justify-between cursor-pointer transition-all duration-300 ${
                    hoveredPerson.id === person.id
                      ? "bg-primary/5"
                      : "hover:bg-gray-50"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex-1">
                    <h3
                      className={`font-satoshi font-medium text-2xl lg:text-[36px] leading-tight transition-colors duration-300 ${
                        hoveredPerson.id === person.id
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {person.name}
                    </h3>
                    <p
                      className={`font-satoshi font-bold text-sm tracking-wider mt-2 transition-colors duration-300 ${
                        hoveredPerson.id === person.id
                          ? "text-primary"
                          : "text-foreground/60"
                      }`}
                    >
                      {person.team}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    {person.linkedin && (
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                    {person.twitter && (
                      <a
                        href={person.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>  
        </div>
        
      </div>
    </section>
  );
}
