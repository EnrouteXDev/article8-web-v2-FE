"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Slide distance for enter/exit animations
const SLIDE_DISTANCE = 150;

export default function ArtifactsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % ARTIFACTS.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + ARTIFACTS.length) % ARTIFACTS.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Touch handlers for swipe
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

  // Calculate which cards to show (prev, current, next)
  const getVisibleIndices = () => {
    const prev = (currentIndex - 1 + ARTIFACTS.length) % ARTIFACTS.length;
    const next = (currentIndex + 1) % ARTIFACTS.length;
    return [prev, currentIndex, next];
  };

  const [prevIndex, activeIndex, nextIndex] = getVisibleIndices();

  // Animation variants for the sliding cards
  const slideVariants = {
    // For the previous card (left side)
    prevEnter: { x: -SLIDE_DISTANCE, opacity: 0, scale: 0.95 },
    prevCenter: { x: 0, opacity: 0.5, scale: 0.95 },
    prevExit: { x: -SLIDE_DISTANCE, opacity: 0, scale: 0.95 },

    // For the active card (center)
    activeEnter: (dir: number) => ({
      x: dir > 0 ? SLIDE_DISTANCE : -SLIDE_DISTANCE,
      opacity: 0.5,
      scale: 0.95,
    }),
    activeCenter: { x: 0, opacity: 1, scale: 1.02 },
    activeExit: (dir: number) => ({
      x: dir > 0 ? -SLIDE_DISTANCE : SLIDE_DISTANCE,
      opacity: 0.5,
      scale: 0.95,
    }),

    // For the next card (right side)
    nextEnter: { x: SLIDE_DISTANCE, opacity: 0, scale: 0.95 },
    nextCenter: { x: 0, opacity: 0.5, scale: 0.95 },
    nextExit: { x: SLIDE_DISTANCE, opacity: 0, scale: 0.95 },

    // Mobile variants
    mobileEnter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    mobileCenter: { x: 0, opacity: 1, scale: 1 },
    mobileExit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const transition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-background overflow-hidden">
      <div className="section-container section-px flex flex-col gap-12 lg:gap-16">

        {/* Header Area */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
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

          {/* Desktop Navigation */}
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
        <div
          className="relative w-full"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Desktop: 3 cards visible */}
          <div className="hidden lg:flex items-center justify-center gap-8">
            {/* Previous Card (Partial Left) */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`prev-${prevIndex}`}
                className="w-[400px] shrink-0 cursor-pointer"
                variants={slideVariants}
                initial="prevEnter"
                animate="prevCenter"
                exit="prevExit"
                transition={transition}
                onClick={prevSlide}
              >
                <ArtifactCard artifact={ARTIFACTS[prevIndex]} isActive={false} />
              </motion.div>
            </AnimatePresence>

            {/* Active Card (Center) */}
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.div
                key={`active-${activeIndex}`}
                className="w-[550px] shrink-0 z-10"
                custom={direction}
                variants={slideVariants}
                initial="activeEnter"
                animate="activeCenter"
                exit="activeExit"
                transition={transition}
              >
                <ArtifactCard artifact={ARTIFACTS[activeIndex]} isActive={true} />
              </motion.div>
            </AnimatePresence>

            {/* Next Card (Partial Right) */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`next-${nextIndex}`}
                className="w-[400px] shrink-0 cursor-pointer"
                variants={slideVariants}
                initial="nextEnter"
                animate="nextCenter"
                exit="nextExit"
                transition={transition}
                onClick={nextSlide}
              >
                <ArtifactCard artifact={ARTIFACTS[nextIndex]} isActive={false} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile/Tablet: Single card with peek */}
          <div className="lg:hidden relative">
            <div className="flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={`mobile-${activeIndex}`}
                  className="w-[85vw] max-w-[500px]"
                  custom={direction}
                  variants={slideVariants}
                  initial="mobileEnter"
                  animate="mobileCenter"
                  exit="mobileExit"
                  transition={transition}
                >
                  <ArtifactCard artifact={ARTIFACTS[activeIndex]} isActive={true} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Peek hints on mobile */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[40px] h-[200px] bg-linear-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[40px] h-[200px] bg-linear-to-l from-background to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex justify-center items-center lg:hidden">
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
