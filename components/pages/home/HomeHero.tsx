"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

type HeroButton = {
  text: string;
  href: string;
  action?: "showreel";
  variant?: "solid" | "outline";
};

type HeroSlide = {
  id: number;
  index: string;
  title: string;
  tagline: string;
  description?: string;
  backgroundImage: string;
  backgroundVideo?: string;
  overlayImages?: string[];
  comingSoon?: boolean;
  buttons: HeroButton[];
};

const heroSections: HeroSlide[] = [
  {
    id: 1,
    index: "01",
    title: "SKYFALL",
    tagline: "Coming Soon to Your Screen",
    backgroundImage: "/skyfall_hero_bg.png",
    backgroundVideo: "https://res.cloudinary.com/dowr5xre6/video/upload/v1775723278/new-opening-corrected-3_pjC8oW6H_sabxun.mp4",
    buttons: [
      { text: "WATCH SHOWREEL", href: "#showreel", action: "showreel", variant: "solid" },
      { text: "START A PROJECT", href: "/contact", variant: "outline" },
    ],
  },
  {
    id: 2,
    index: "02",
    title: "CHILDREN OF THE SKY",
    tagline: "Comic Series",
    description: "Pre-order Starting 1st June",
    backgroundImage: "/hero-media/Image (1).jfif",
    buttons: [
      { text: "PRE-ORDER NOW", href: "#pre-order", variant: "solid" },
    ],
  },
  {
    id: 3,
    index: "03",
    title: "CROWDFUNDING SUPPORT",
    tagline: "Get Involved",
    backgroundImage: "/hero-media/Illustration32 1.png",
    buttons: [
      { text: "GET INVOLVED", href: "#campaign", variant: "solid" },
    ],
  },
  {
    id: 4,
    index: "04",
    title: "PODCAST SERIES",
    tagline: "Coming Soon",
    backgroundImage: "/hero-media/Illustration32vgx.png",
    overlayImages: [
      "/hero-media/Illustration32v 1.png",
      "/hero-media/Illustration32vx.png",
    ],
    comingSoon: true,
    buttons: [],
  },
  {
    id: 5,
    index: "05",
    title: "GET INVOLVED",
    tagline: "We'll Love to Hear Your Idea",
    description:
      "An opportunity for creatives to contribute to the Skyfall Universe — Characters, Story Arc, Environments.",
    backgroundImage: "/hero-media/Image.png",
    buttons: [
      { text: "GET IN TOUCH", href: "/contact", variant: "solid" },
    ],
  },
  {
    id: 6,
    index: "06",
    title: "JOIN OUR COMMUNITY",
    tagline: "Never Miss an Update",
    backgroundImage: "/hero-media/Image.jfif",
    comingSoon: true,
    buttons: [],
  },
];

const SHOWREEL_URL = "https://res.cloudinary.com/dowr5xre6/video/upload/v1775723278/new-opening-corrected-3_pjC8oW6H_sabxun.mp4";

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
    transition: { duration: 0.3 },
  },
};

const bgVariants: Variants = {
  initial: { scale: 1.1, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.8 },
  },
};

export default function HomeHero() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const goToPrevious = () =>
    setCurrentSection((prev) => (prev === 0 ? heroSections.length - 1 : prev - 1));

  const goToNext = () =>
    setCurrentSection((prev) => (prev === heroSections.length - 1 ? 0 : prev + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) goToNext();
    if (distance < -minSwipeDistance) goToPrevious();
  };

  const handleShowreel = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("videoPlayerStateChange", { detail: { isPlaying: true } }));
    setIsVideoPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsVideoPlaying(false);
    window.dispatchEvent(new CustomEvent("videoPlayerStateChange", { detail: { isPlaying: false } }));
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVideoPlaying) handleCloseVideo();
    };
    if (isVideoPlaying) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isVideoPlaying]);

  const slide = heroSections[currentSection];

  return (
    <section
      className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 select-none">
        <AnimatePresence mode="popLayout">
          {!isVideoPlaying && (
            <motion.div
              key={slide.id}
              variants={bgVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              {slide.backgroundVideo ? (
                <video
                  src={slide.backgroundVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={slide.backgroundImage}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                  draggable={false}
                />
              )}
              {/* Overlay images for layered slides (e.g. podcast) */}
              {slide.overlayImages?.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  fill
                  className="object-contain object-bottom"
                  draggable={false}
                />
              ))}
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <AnimatePresence>
        {!isVideoPlaying && (
          <div className="relative z-10 w-full h-full section-px flex items-center">
            <div className="section-container w-full flex flex-col justify-center sm:justify-start pt-[60px] md:pt-[90px]">
              <motion.div
                key={`content-${slide.id}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-start max-w-full"
              >
                {/* Index */}
                <motion.div variants={fadeUpVariants} custom={0}>
                  <span className="font-satoshi font-normal text-[48px] md:text-[80px] lg:text-[96px] text-white leading-none block opacity-80">
                    {slide.index}
                  </span>
                </motion.div>

                {/* Tagline */}
                <motion.p
                  variants={fadeUpVariants}
                  custom={1}
                  className="font-baloo-2 font-semibold text-white text-sm md:text-xl lg:text-[28px] leading-tight mt-1 md:mt-2 uppercase tracking-wide"
                >
                  {slide.tagline}
                </motion.p>

                {/* Title */}
                <motion.h1
                  variants={fadeUpVariants}
                  custom={2}
                  className="font-baloo font-bold text-white text-[44px] sm:text-[80px] md:text-[110px] lg:text-[140px] xl:text-[160px] leading-[0.9] tracking-wide my-2 md:my-0"
                >
                  {slide.title}
                </motion.h1>

                {/* Description */}
                {slide.description && (
                  <motion.p
                    variants={fadeUpVariants}
                    custom={3}
                    className="font-satoshi text-white/80 text-sm md:text-base max-w-xl mt-3"
                  >
                    {slide.description}
                  </motion.p>
                )}

                {/* Coming Soon Badge */}
                {slide.comingSoon && (
                  <motion.div variants={fadeUpVariants} custom={3} className="mt-4">
                    <span className="inline-block px-4 py-1.5 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm text-white font-satoshi text-xs uppercase tracking-widest">
                      Coming Soon
                    </span>
                  </motion.div>
                )}

                {/* Buttons */}
                {slide.buttons.length > 0 && (
                  <motion.div
                    variants={fadeUpVariants}
                    custom={4}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 md:mt-8 w-full sm:w-auto"
                  >
                    {slide.buttons.map((btn) =>
                      btn.action === "showreel" ? (
                        <button
                          key={btn.text}
                          onClick={handleShowreel}
                          className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white hover:bg-primary hover:text-white text-primary font-satoshi font-medium text-sm md:text-base uppercase rounded-md transition-all duration-300 shadow-lg sm:shadow-none"
                        >
                          {btn.text}
                        </button>
                      ) : btn.variant === "solid" ? (
                        <Link
                          key={btn.text}
                          href={btn.href}
                          className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white hover:bg-primary hover:text-white text-primary font-satoshi font-medium text-sm md:text-base uppercase rounded-md transition-all duration-300 text-center shadow-lg sm:shadow-none"
                        >
                          {btn.text}
                        </Link>
                      ) : (
                        <Link
                          key={btn.text}
                          href={btn.href}
                          className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white/10 backdrop-blur-sm border border-white text-white hover:bg-white hover:text-primary font-satoshi font-medium text-sm md:text-base uppercase rounded-md transition-all duration-300 text-center"
                        >
                          {btn.text}
                        </Link>
                      )
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Bottom Label */}
              <div className="absolute bottom-8 lg:bottom-16 left-4 md:left-16 z-20 hidden sm:block">
                <p className="font-satoshi font-normal text-white/70 text-xs md:text-sm lg:text-lg uppercase tracking-wider">
                  CREATIONS / WORKS WE HAVE DONE
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation */}
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
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/30 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all duration-300 group bg-black/20 backdrop-blur-sm"
              aria-label="Previous"
            >
              <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button
              onClick={goToNext}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/30 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all duration-300 group bg-black/20 backdrop-blur-sm"
              aria-label="Next"
            >
              <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide Dots */}
      <AnimatePresence>
        {!isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
          >
            {heroSections.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSection(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSection
                    ? "w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
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

            <motion.video
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              src={SHOWREEL_URL}
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
