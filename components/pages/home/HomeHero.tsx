"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useHeroSlides } from "@/lib/queries/hero-slides";
import type { CreateHeroSlideInput, HeroSlide, HeroSlideButton } from "@/lib/types";

type Slide = CreateHeroSlideInput & { _id: string };

const SHOWREEL_URL =
  "https://res.cloudinary.com/dowr5xre6/video/upload/v1775721971/Website_Showreel_2_cfjcw8.mp4";

/**
 * Static slides shown only if the API is unreachable or returns nothing,
 * so the landing page never renders an empty hero.
 */
const fallbackSlides: Slide[] = [
  {
    _id: "fallback-1",
    title: "SKYFALL",
    topSubtitle: "Coming Soon to Your Screen",
    image: "/skyfall_hero_bg.png",
    backgroundVideo: SHOWREEL_URL,
    buttons: [
      { text: "WATCH SHOWREEL", variant: "solid", action: "showreel", videoUrl: SHOWREEL_URL },
      { text: "START A PROJECT", href: "/contact", variant: "outline", action: "link" },
    ],
  },
  {
    _id: "fallback-2",
    title: "CHILDREN OF THE SKY",
    topSubtitle: "Comic Series",
    bottomSubtitle: "Pre-order Starting 1st June",
    image: "/hero-media/Image (1).jfif",
    buttons: [{ text: "PRE-ORDER NOW", href: "#pre-order", variant: "solid", action: "link" }],
  },
  {
    _id: "fallback-3",
    title: "CROWDFUNDING SUPPORT",
    topSubtitle: "Get Involved",
    image: "/hero-media/kick_starter_hero.png",
    hideText: true,
    showOverlay: false,
    buttons: [{ text: "GET INVOLVED", href: "#campaign", variant: "solid", action: "link" }],
  },
  {
    _id: "fallback-4",
    title: "PODCAST SERIES",
    topSubtitle: "Coming Soon",
    image: "/hero-media/podcasht_series_hero.png",
    comingSoon: true,
    hideText: true,
    showOverlay: false,
    buttons: [],
  },
  {
    _id: "fallback-5",
    title: "GET INVOLVED",
    topSubtitle: "We'll Love to Hear Your Idea",
    bottomSubtitle:
      "An opportunity for creatives to contribute to the Skyfall Universe — Characters, Story Arc, Environments.",
    image: "/hero-media/get_involved_hero.png",
    buttons: [{ text: "GET IN TOUCH", href: "/contact", variant: "solid", action: "link" }],
  },
  {
    _id: "fallback-6",
    title: "JOIN OUR COMMUNITY",
    topSubtitle: "Never Miss an Update",
    image: "/hero-media/Image.jfif",
    comingSoon: true,
    buttons: [],
  },
  {
    _id: "fallback-7",
    title: "EXCLUSIVE OFFERS",
    topSubtitle: "Now Live in Our Store",
    image: "/OneDrive_1_8-6-2026 (1)/Store.png",
    backgroundVideo:
      "https://res.cloudinary.com/dhlpbvjcx/video/upload/v1789746407/Offer_slideshow_cr0fns.mp4",
    buttons: [{ text: "SHOP NOW", href: "/store", variant: "solid", action: "link" }],
  },
];

/** Active slides inside their schedule window, ordered for display. */
function prepareSlides(slides: HeroSlide[]): Slide[] {
  const now = Date.now();
  return slides
    .filter((s) => s.isActive !== false)
    .filter((s) => !s.startDate || new Date(s.startDate).getTime() <= now)
    .filter((s) => !s.endDate || new Date(s.endDate).getTime() >= now)
    .sort((a, b) => {
      const byOrder = (a.order ?? 0) - (b.order ?? 0);
      if (byOrder !== 0) return byOrder;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
}

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

const solidButtonClass =
  "w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white hover:bg-primary hover:text-white text-primary font-satoshi font-medium text-sm md:text-base uppercase rounded-md transition-all duration-300 text-center shadow-lg sm:shadow-none";
const outlineButtonClass =
  "w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white/10 backdrop-blur-sm border border-white text-white hover:bg-white hover:text-primary font-satoshi font-medium text-sm md:text-base uppercase rounded-md transition-all duration-300 text-center";

export default function HomeHero() {
  const { data, isLoading, isError } = useHeroSlides();

  const slides = useMemo<Slide[]>(() => {
    if (isError) return fallbackSlides;
    if (!data) return [];
    const prepared = prepareSlides(data.slides ?? []);
    return prepared.length > 0 ? prepared : fallbackSlides;
  }, [data, isError]);

  const [currentSection, setCurrentSection] = useState(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const isVideoPlaying = activeVideo !== null;
  const slideCount = slides.length;
  const safeIndex = slideCount === 0 ? 0 : Math.min(currentSection, slideCount - 1);
  const slide = slides[safeIndex];

  const goToPrevious = () =>
    setCurrentSection((prev) => (prev === 0 ? slideCount - 1 : prev - 1));

  const goToNext = () =>
    setCurrentSection((prev) => (prev === slideCount - 1 ? 0 : prev + 1));

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

  const handleShowreel = (videoUrl: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("videoPlayerStateChange", { detail: { isPlaying: true } }));
    setActiveVideo(videoUrl);
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
    window.dispatchEvent(new CustomEvent("videoPlayerStateChange", { detail: { isPlaying: false } }));
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVideoPlaying) handleCloseVideo();
    };
    if (isVideoPlaying) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isVideoPlaying]);

  // While the first request is in flight, hold a black stage instead of flashing fallback content.
  if (isLoading || !slide) {
    return <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black" />;
  }

  const index = String(safeIndex + 1).padStart(2, "0");
  const showOverlay = slide.showOverlay ?? !slide.hideText;
  const overlayOpacity = slide.overlayOpacity ?? 0.5;
  const isCentered = slide.textAlign === "center";
  const imageAlt = slide.imageAlt || slide.title;

  const renderButton = (btn: HeroSlideButton) => {
    const className = btn.variant === "outline" ? outlineButtonClass : solidButtonClass;
    if (btn.action === "showreel") {
      return (
        <button
          key={btn.text}
          onClick={handleShowreel(btn.videoUrl || SHOWREEL_URL)}
          className={className}
        >
          {btn.text}
        </button>
      );
    }
    return (
      <Link key={btn.text} href={btn.href || "#"} className={className}>
        {btn.text}
      </Link>
    );
  };

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
              key={slide._id}
              variants={bgVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              {slide.backgroundVideo ? (
                <video
                  src={slide.backgroundVideo}
                  poster={slide.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : slide.mobileImage ? (
                <>
                  <Image
                    src={slide.mobileImage}
                    alt={imageAlt}
                    fill
                    className="object-cover md:hidden"
                    priority
                    draggable={false}
                  />
                  <Image
                    src={slide.image}
                    alt={imageAlt}
                    fill
                    className="object-cover hidden md:block"
                    priority
                    draggable={false}
                  />
                </>
              ) : (
                <Image
                  src={slide.image}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  priority
                  draggable={false}
                />
              )}
              {/* Overlay images for layered slides */}
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
              {/* Dark overlay only for slides that need text lifted off the artwork */}
              {showOverlay && (
                <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
              )}
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
                key={`content-${slide._id}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`flex flex-col max-w-full ${
                  isCentered ? "items-center text-center mx-auto" : "items-start text-left"
                }`}
              >
                {/* Index */}
                <motion.div variants={fadeUpVariants} custom={0}>
                  <span
                    className={`font-satoshi font-normal text-[48px] md:text-[80px] lg:text-[96px] text-white leading-none block ${
                      showOverlay ? "opacity-80" : "opacity-100"
                    }`}
                    style={{ textShadow: "0 4px 16px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)" }}
                  >
                    {index}
                  </span>
                </motion.div>

                {!slide.hideText && (
                  <>
                    {/* Top subtitle */}
                    {slide.topSubtitle && (
                      <motion.p
                        variants={fadeUpVariants}
                        custom={1}
                        className="font-baloo-2 font-semibold text-white text-sm md:text-xl lg:text-[28px] leading-tight mt-1 md:mt-2 uppercase tracking-wide"
                      >
                        {slide.topSubtitle}
                      </motion.p>
                    )}

                    {/* Title */}
                    <motion.h1
                      variants={fadeUpVariants}
                      custom={2}
                      className="font-baloo font-bold text-white text-[44px] sm:text-[80px] md:text-[110px] lg:text-[140px] xl:text-[160px] leading-[0.9] tracking-wide my-2 md:my-0"
                    >
                      {slide.title}
                    </motion.h1>

                    {/* Bottom subtitle */}
                    {slide.bottomSubtitle && (
                      <motion.p
                        variants={fadeUpVariants}
                        custom={3}
                        className="font-satoshi text-white/80 text-sm md:text-base max-w-xl mt-3"
                      >
                        {slide.bottomSubtitle}
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
                  </>
                )}

                {/* Buttons */}
                {slide.buttons.length > 0 && (
                  <motion.div
                    variants={fadeUpVariants}
                    custom={4}
                    className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 md:mt-8 w-full sm:w-auto ${
                      isCentered ? "sm:justify-center" : ""
                    }`}
                  >
                    {slide.buttons.map(renderButton)}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <AnimatePresence>
        {!isVideoPlaying && slideCount > 1 && (
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
        {!isVideoPlaying && slideCount > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
          >
            {slides.map((s, i) => (
              <button
                key={s._id}
                onClick={() => setCurrentSection(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === safeIndex
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
              src={activeVideo}
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
