"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Define hero sections data
const heroSections = [
  {
    id: 1,
    index: "01",
    tagline: "Coming Soon to Your Screens",
    title: "SKYFALL",
    backgroundImage: "/skyfall_hero_bg.png",
    buttons: [
      { text: "WATCH SHOWREEL", href: "#showreel" },
      { text: "START A PROJECT", href: "/contact" }
    ]
  },
  {
    id: 2,
    index: "02",
    tagline: "Our Latest Animation",
    title: "ECLIPSE",
    backgroundImage: "/eclipse_hero_bg.png",
    buttons: [
      { text: "WATCH SHOWREEL", href: "#showreel" },
      { text: "START A PROJECT", href: "/contact" }
    ]
  },
  {
    id: 3,
    index: "03",
    tagline: "Award-Winning Series",
    title: "HORIZON",
    backgroundImage: "/horizon_hero_bg.png",
    buttons: [
      { text: "WATCH SHOWREEL", href: "#showreel" },
      { text: "START A PROJECT", href: "/contact" }
    ]
  },
  {
    id: 4,
    index: "04",
    tagline: "Crafted with Precision",
    title: "NEXUS",
    backgroundImage: "/nexus_hero_bg.png",
    buttons: [
      { text: "WATCH SHOWREEL", href: "#showreel" },
      { text: "START A PROJECT", href: "/contact" }
    ]
  },
  {
    id: 5,
    index: "05",
    tagline: "Immersive Storytelling",
    title: "AURORA",
    backgroundImage: "/aurora_hero_bg.png",
    buttons: [
      { text: "WATCH SHOWREEL", href: "#showreel" },
      { text: "START A PROJECT", href: "/contact" }
    ]
  },
  {
    id: 6,
    index: "06",
    tagline: "Experience the Magic",
    title: "ZENITH",
    backgroundImage: "/zenith_hero_bg.png",
    buttons: [
      { text: "WATCH SHOWREEL", href: "#showreel" },
      { text: "START A PROJECT", href: "/contact" }
    ]
  }
];

const DEMO_VIDEO_URL = "https://res.cloudinary.com/dfyiemvio/video/upload/v1767776301/file_example_MP4_480_1_5MG_ubzhtu.mp4";

// Animation Variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

const bgVariants: Variants = {
  initial: { scale: 1.1, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.8 }
  }
};

export default function HomeHero() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Swipe State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const goToPrevious = () => {
    setCurrentSection((prev) => (prev === 0 ? heroSections.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSection((prev) => (prev === heroSections.length - 1 ? 0 : prev + 1));
  };

  // Swipe Handlers
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

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  const handleWatchShowreel = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('videoPlayerStateChange', { detail: { isPlaying: true } }));
    setIsVideoPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsVideoPlaying(false);
    window.dispatchEvent(new CustomEvent('videoPlayerStateChange', { detail: { isPlaying: false } }));
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoPlaying) {
        handleCloseVideo();
      }
    };
    if (isVideoPlaying) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isVideoPlaying]);

  const currentHero = heroSections[currentSection];

  return (
    <section
      className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >

      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 select-none">
        <AnimatePresence mode="popLayout">
          {!isVideoPlaying && (
            <motion.div
              key={currentHero.id}
              variants={bgVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={currentHero.backgroundImage}
                alt={`${currentHero.title} Hero Background`}
                fill
                className="object-cover"
                priority
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hero Content Layer */}
      <AnimatePresence>
        {!isVideoPlaying && (
          <div className="relative z-10 w-full h-full section-px flex items-center">
            <div className="section-container w-full flex flex-col justify-center sm:justify-start pt-[60px] md:pt-[90px]">

              <motion.div
                key={`content-${currentHero.id}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-start max-w-full"
              >
                {/* Index Number */}
                <motion.div variants={fadeUpVariants} custom={0}>
                  <span className="font-satoshi font-normal text-[48px] md:text-[80px] lg:text-[96px] text-white leading-none block opacity-80">
                    {currentHero.index}
                  </span>
                </motion.div>

                {/* Tagline */}
                <motion.p
                  variants={fadeUpVariants}
                  custom={1}
                  className="font-baloo-2 font-semibold text-white text-sm md:text-xl lg:text-[28px] leading-tight mt-1 md:mt-2 uppercase tracking-wide md:tracking-normal"
                >
                  {currentHero.tagline}
                </motion.p>

                {/* Main Title - Responsive Text Sizing */}
                <motion.h1
                  variants={fadeUpVariants}
                  custom={2}
                  className="font-baloo font-bold text-white text-[56px] sm:text-[90px] md:text-[110px] lg:text-[140px] xl:text-[183px] leading-[0.9] md:leading-none tracking-wide my-2 md:my-0"
                >
                  {currentHero.title}
                </motion.h1>

                {/* CTA Buttons */}
                <motion.div
                  variants={fadeUpVariants}
                  custom={3}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 md:mt-8 w-full sm:w-auto"
                >
                  <button
                    onClick={handleWatchShowreel}
                    className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white hover:bg-primary hover:text-white text-primary font-satoshi font-medium text-sm md:text-base uppercase rounded-md transition-all duration-300 text-center shadow-lg sm:shadow-none"
                  >
                    WATCH SHOWREEL
                  </button>
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white/10 backdrop-blur-sm border border-white text-white hover:bg-white hover:text-primary font-satoshi font-medium text-sm md:text-base uppercase rounded-md transition-all duration-300 text-center"
                  >
                    START A PROJECT
                  </Link>
                </motion.div>
              </motion.div>

              {/* Bottom Label - Hidden on very small mobile to save space, visible on sm+ */}
              <div className="absolute bottom-8 lg:bottom-16 left-4 md:left-16 z-20 hidden sm:block">
                <p className="font-satoshi font-normal text-white/70 text-xs md:text-sm lg:text-lg uppercase tracking-wider">
                  CREATIONS/WORKS WE HAVE DONE
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation Controls - Desktop: Right Center / Mobile: Bottom Right */}
      <AnimatePresence>
        {!isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-20 flex flex-col gap-3 md:gap-4 
                       bottom-8 right-4 
                       md:top-1/2 md:-translate-y-1/2 md:bottom-auto md:right-8"
          >
            <button
              onClick={goToPrevious}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/30 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all duration-300 group bg-black/20 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none"
              aria-label="Previous hero section"
            >
              <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={goToNext}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/30 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all duration-300 group bg-black/20 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none"
              aria-label="Next hero section"
            >
              <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Video Player */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 sm:p-0"
          >
            {/* Close Button */}
            <motion.button
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ delay: 0.2 }}
              onClick={handleCloseVideo}
              className="absolute top-6 right-6 md:top-8 md:right-8 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/50 hover:border-white flex items-center justify-center transition-all duration-300"
              aria-label="Close video"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.button>

            {/* Video Element */}
            <motion.video
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              src={DEMO_VIDEO_URL}
              controls
              autoPlay
              className="w-full max-h-[80vh] object-contain rounded-lg"
              controlsList="nodownload"
              playsInline
            >
              Your browser does not support the video tag.
            </motion.video>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}