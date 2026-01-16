"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import SectionHeader from "@/components/shared/headers/SectionHeader";
import ArtifactCard, { Artifact } from "./ArtifactCard";
import CarouselControls from "./CarouselControls";

const ARTIFACTS: Artifact[] = [
  {
    id: "1",
    title: "Royal Ancestral Scepter",
    description: "A sacred symbol of authority, the Royal Ancestral Scepter channels the Oba's command and ancestral power. Forged from black alloy with golden inlays and glowing turquoise energy lines, it responds only to the King's voice. Embedded with a crystal orb that projects ancestral glyphs, it connects directly to palace defense systems and robotic guardians—able to awaken sentinels, unleash solar bursts, or raise a protective dome around the throne, embodying the unity of tradition, technology, and royal might.",
    image: "/artifact3.jpeg",
    tags: ["Sky Fall", "Heaven"],
  },
  {
    id: "2",
    title: "Energy Spear",
    description: "An elegant fusion of tradition and technology, the Energy Spear serves as both a ceremonial symbol and a formidable weapon. Forged from crystallized light with a bronze-gold alloy shaft, its luminous blade pulses with geometric energy patterns that awaken on command. It channels raw power to slice through metal, release shockwaves, and project a protective energy shield. When driven into the ground, it harnesses seismic vibrations to destabilize enemies—embodying grace, innovation, and unstoppable force.",
    image: "/artifact6.jpeg",
    tags: ["Energy", "Weapon"],
  },
  {
    id: "3",
    title: "Long Spear Staff",
    description: "A refined extension of light and precision, the Long Spear Staff channels concentrated blue energy along its length, crackling with controlled voltage. Its form embodies balance—ceremonial in grace yet formidable in combat. Designed for reach and power, each strike radiates pure kinetic energy capable of piercing through advanced alloys with effortless flow.",
    image: "/artifact6.jpeg",
    tags: ["Staff", "Energy"],
  },
  {
    id: "4",
    title: "Energy Scimitar",
    description: "Forged from crystallized light, the Energy Scimitar wields elegance as its edge. Its broad, curved blade shimmers with faint glowing runes that shift as though alive, responding to the wielder's movement and intent. Every swing releases a whisper of energy through the air—beautiful and deadly, merging artistry with lethal efficiency.",
    image: "/artifact9.jpeg",
    tags: ["Blade", "Light"],
  },
  {
    id: "5",
    title: "Energy Bow",
    description: "The Energy Bow embodies precision and discipline. Crafted from luminous arcs bound by crackling energy threads, it draws arrows made of pure light that hum with contained power. Each shot cuts through the air with electrified brilliance, leaving a trail of radiant energy that represents the perfect union of focus and fury.",
    image: "/artifact8.jpeg",
    tags: ["Bow", "Precision"],
  },
  {
    id: "6",
    title: "Energy Whip",
    description: "A weapon of motion and unpredictability, the Energy Whip is a flowing conduit of luminous power. Composed entirely of light and electricity, it dances through the air with a serpentine rhythm, wrapping and striking with elegance and devastation. Each swing crackles with thunderous energy—a manifestation of control, chaos, and raw force combined.",
    image: "/artifact6.jpeg",
    tags: ["Whip", "Motion"],
  },
  {
    id: "7",
    title: "Energy Shield Gauntlet",
    description: "A masterpiece of defense and design, the Energy Shield Gauntlet channels focused energy from its core to project a radiant, semi-transparent barrier at the wielder's command. When activated, arcs of blue light ripple outward, forming a protective field capable of absorbing both kinetic and energy-based impacts. Responsive to motion and intent, the shield adjusts dynamically—expanding to guard allies or condensing into a personal barrier—symbolizing the perfect balance of agility, protection, and power.",
    image: "/artifact1.jpeg",
    tags: ["Shield", "Defense"],
  },
];

export default function ArtifactsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % ARTIFACTS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + ARTIFACTS.length) % ARTIFACTS.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  /**
   * Calculates the relative position of an item to the current index.
   * Returns:
   * 0: Active center
   * 1: Immediate right
   * -1: Immediate left
   * 2: Far right
   * -2: Far left
   */
  const getRelativePosition = (index: number) => {
    const total = ARTIFACTS.length;
    // Calculate simple difference
    let diff = (index - currentIndex) % total;

    // Adjust for wrapping (e.g. if total is 7, moving from 0 to 6 should be -1, not 6)
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    return diff;
  };

  // Animation variants
  const cardVariants: Variants = {
    active: {
      x: "-50%", // Strictly centered
      scale: 1,
      zIndex: 30,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, type: "spring", stiffness: 150, damping: 20 }
    },
    left: {
      x: "calc(-50% - 480px)",
      scale: 0.7, // CHANGED: Reduced from 0.85 to 0.7
      zIndex: 20,
      opacity: 0.6,
      filter: "blur(2px)",
      transition: { duration: 0.6, type: "spring", stiffness: 150, damping: 20 }
    },
    right: {
      x: "calc(-50% + 480px)",
      scale: 0.7, // CHANGED: Reduced from 0.85 to 0.7
      zIndex: 20,
      opacity: 0.6,
      filter: "blur(2px)",
      transition: { duration: 0.6, type: "spring", stiffness: 150, damping: 20 }
    },
    hidden: {
      x: "-50%", // Keep centered but hidden behind
      scale: 0.5,
      zIndex: 10,
      opacity: 0,
      filter: "blur(10px)",
      transition: { duration: 0.4 } // Faster exit
    },

    // Mobile Variants
    mobileActive: {
      x: "0%",
      scale: 1,
      zIndex: 30,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    mobileHiddenLeft: {
      x: "-100%",
      scale: 0.9,
      zIndex: 10,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    mobileHiddenRight: {
      x: "100%",
      scale: 0.9,
      zIndex: 10,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-background overflow-hidden">
      <div className="section-container section-px flex flex-col gap-12 lg:gap-16">

        {/* Header Area */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 z-40 relative">
          <div className="flex flex-col gap-6 max-w-2xl">
            <SectionHeader
              smallHeader="Artifacts"
              mainHeader="Elements of our work"
              alignment="left"
            />
            <p className="font-satoshi font-normal text-lg lg:text-[24px] leading-relaxed text-primary/80">
              A growing collection of finished pieces that capture the artistry behind our stories. Each artifact reflects the craftsmanship, curiosity, and imagination that define every project we create.
            </p>
          </div>

          <div className="hidden lg:block shrink-0">
            <CarouselControls
              onPrev={prevSlide}
              onNext={nextSlide}
              currentIndex={currentIndex}
              total={ARTIFACTS.length}
              type="arrows"
            />
          </div>
        </div>

        {/* Carousel Area */}
        {/* We fix the height here because absolute children collapse the parent */}
        <div
          className="relative w-full h-[550px] sm:h-[600px] lg:h-[650px] flex justify-center items-center perspective-1000"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {ARTIFACTS.map((artifact, index) => {
            const position = getRelativePosition(index);

            // Determine animation state
            let desktopState = "hidden";
            if (position === 0) desktopState = "active";
            else if (position === -1) desktopState = "left";
            else if (position === 1) desktopState = "right";

            let mobileState = "mobileHiddenRight";
            if (position === 0) mobileState = "mobileActive";
            else if (position < 0) mobileState = "mobileHiddenLeft";

            const isActive = position === 0;

            return (
              <motion.div
                key={artifact.id}
                initial={false}
                animate={desktopState}
                variants={cardVariants}
                className={`
                  absolute top-0 
                  /* Desktop Styling */
                  hidden lg:block lg:w-[550px] lg:left-1/2 cursor-pointer
                `}
                onClick={() => {
                  if (position === -1) prevSlide();
                  if (position === 1) nextSlide();
                }}
              >
                <ArtifactCard artifact={artifact} isActive={isActive} />
              </motion.div>
            );
          })}

          {/* Mobile specific loop (separated for cleaner variants/layout) */}
          <div className="lg:hidden relative w-full h-full flex items-center justify-center">
            {ARTIFACTS.map((artifact, index) => {
              const position = getRelativePosition(index);
              const isActive = position === 0;

              // Logic for mobile only shows active, slides others out
              let mobileVariant = "mobileHiddenRight";
              if (position === 0) mobileVariant = "mobileActive";
              else if (position < 0) mobileVariant = "mobileHiddenLeft";
              else mobileVariant = "mobileHiddenRight"; // Right side hidden

              // Optimization: Don't animate elements far away
              if (Math.abs(position) > 1) return null;

              return (
                <motion.div
                  key={`mobile-${artifact.id}`}
                  initial={false}
                  animate={mobileVariant}
                  variants={cardVariants}
                  className="absolute w-[85vw] max-w-[450px]"
                >
                  <ArtifactCard artifact={artifact} isActive={isActive} />
                </motion.div>
              )
            })}

            {/* Peek Gradients for Mobile */}
            <div className="absolute top-0 bottom-0 left-0 w-[40px] bg-linear-to-r from-background to-transparent z-40 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-[40px] bg-linear-to-l from-background to-transparent z-40 pointer-events-none" />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex justify-center items-center lg:hidden z-40 relative">
          <CarouselControls
            onPrev={prevSlide}
            onNext={nextSlide}
            currentIndex={currentIndex}
            total={ARTIFACTS.length}
            onDotClick={goToSlide}
            type="all"
          />
        </div>

      </div>
    </section>
  );
}