"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, ChevronDown, X } from "lucide-react";

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

export default function HomeHero() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);

  const goToPrevious = () => {
    setCurrentSection((prev) => (prev === 0 ? heroSections.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSection((prev) => (prev === heroSections.length - 1 ? 0 : prev + 1));
  };

  const handleWatchShowreel = (e: React.MouseEvent) => {
    e.preventDefault();
    // Fade out content first
    setIsContentVisible(false);
    // Dispatch event to hide navbar
    window.dispatchEvent(new CustomEvent('videoPlayerStateChange', { detail: { isPlaying: true } }));
    // Wait for fade animation, then show video
    setTimeout(() => {
      setIsVideoPlaying(true);
    }, 500);
  };

  const handleCloseVideo = () => {
    setIsVideoPlaying(false);
    // Dispatch event to show navbar
    window.dispatchEvent(new CustomEvent('videoPlayerStateChange', { detail: { isPlaying: false } }));
    // Wait a bit, then fade content back in
    setTimeout(() => {
      setIsContentVisible(true);
    }, 100);
  };

  // Handle ESC key to close video
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoPlaying) {
        handleCloseVideo();
      }
    };

    if (isVideoPlaying) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isVideoPlaying]);

  const currentHero = heroSections[currentSection];

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* Background Image with transition */}
      <div className="absolute inset-0 z-0">
        <Image
          key={currentHero.id}
          src={currentHero.backgroundImage}
          alt={`${currentHero.title} Hero Background`}
          fill
          className="object-cover transition-opacity duration-700"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content */}
      <div
        className={`relative z-10 w-full h-full section-px flex items-center transition-opacity duration-500 ${isContentVisible ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <div className="section-container w-full flex flex-col pt-[90px]">
          {/* Index Number */}
          <div
            key={`index-${currentHero.id}`}
            className="font-satoshi font-normal text-[80px] lg:text-[96px] text-white leading-none animate-fadeIn"
          >
            {currentHero.index}
          </div>

          {/* Tagline */}
          <p
            key={`tagline-${currentHero.id}`}
            className="font-baloo-2 font-semibold text-white text-[18px] lg:text-[28px] leading-tight animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            {currentHero.tagline}
          </p>

          {/* Main Title */}
          <h1
            key={`title-${currentHero.id}`}
            className="font-baloo font-bold text-white text-[80px] lg:text-[140px] xl:text-[183px] leading-none tracking-wide animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            {currentHero.title}
          </h1>

          {/* CTA Buttons */}
          <div
            key={`buttons-${currentHero.id}`}
            className="flex flex-col sm:flex-row gap-4 mt-4 animate-fadeIn"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={handleWatchShowreel}
              className="px-8 py-4 bg-white hover:bg-primary hover:text-white text-primary font-satoshi font-medium text-base uppercase rounded-md transition-all duration-300 text-center"
            >
              WATCH SHOWREEL
            </button>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white hover:bg-primary hover:text-white text-primary font-satoshi font-medium text-base uppercase rounded-md transition-all duration-300 text-center"
            >
              START A PROJECT
            </Link>
          </div>

          {/* Bottom Label */}
          <div className="absolute bottom-8 lg:bottom-16 left-8 md:left-16">
            <p className="font-satoshi font-normal text-white text-lg lg:text-xl uppercase tracking-wider">
              CREATIONS/WORKS WE HAVE DONE
            </p>
          </div>
        </div>
      </div>

      {/* Vertical Navigation Controls */}
      <div
        className={`absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4 transition-opacity duration-500 ${isContentVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <button
          onClick={goToPrevious}
          className="w-12 h-12 rounded-full border-2 border-white/50 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all duration-300"
          aria-label="Previous hero section"
        >
          <ChevronUp className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={goToNext}
          className="w-12 h-12 rounded-full border-2 border-white/50 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all duration-300"
          aria-label="Next hero section"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Fullscreen Video Player */}
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={handleCloseVideo}
            className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border-2 border-white/50 hover:border-white flex items-center justify-center transition-all duration-300"
            aria-label="Close video"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Video Element */}
          <video
            src={DEMO_VIDEO_URL}
            controls
            autoPlay
            className="w-full h-full object-contain"
            controlsList="nodownload"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
