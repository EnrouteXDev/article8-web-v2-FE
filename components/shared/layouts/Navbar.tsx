"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Products", href: "/products" },
  { name: "Services", href: "/services" },

  { name: "Contact Us", href: "/contact" },
];

// --- Animation Variants ---

// The 3 red stripes background
const stripeVariants = {
  initial: {
    height: "0%",
  },
  animate: (i: number) => ({
    height: "100%",
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
      delay: i * 0.1, // Stagger the stripes
    },
  }),
  exit: (i: number) => ({
    height: "0%",
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
      delay: i * 0.1,
    },
  }),
};

// The text content
const contentVariants = {
  initial: { opacity: 0, y: 50 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay: 0.6 + i * 0.1, // Wait for stripes to finish
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  // Handle Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Video State
  useEffect(() => {
    if (!isHomePage) return;
    const handleVideoStateChange = (event: CustomEvent) => {
      setIsVideoPlaying(event.detail.isPlaying);
    };
    window.addEventListener("videoPlayerStateChange", handleVideoStateChange as EventListener);
    return () => {
      window.removeEventListener("videoPlayerStateChange", handleVideoStateChange as EventListener);
    };
  }, [isHomePage]);

  // Determine if navbar should be hidden
  const shouldHideNavbar = isHomePage && isVideoPlaying;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 
        ${shouldHideNavbar ? "opacity-0 pointer-events-none -translate-y-full" : "opacity-100 translate-y-0"} 
        ${isScrolled && !isMenuOpen ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200" : "bg-transparent"}
        `}
      >
        <div className="max-w-[1480px] mx-auto px-6 md:px-16 h-[90px] flex items-center justify-between">

          {/* Logo (Changes color based on menu state) */}
          <Link href="/" className="relative z-50 w-[160px] md:w-[184px] h-[54px]">
            {/* If you have a white version of the logo for the red background, toggle src here. 
                 Otherwise, assuming SVG is adaptable or just white/colored. */}
            <Image
              src="/Logo.svg"
              alt="Article8 Media Logo"
              fill
              className={`object-contain object-left transition-opacity duration-300 ${isMenuOpen ? "brightness-0 invert" : ""}`}
              priority
            />
          </Link>

          {/* Desktop Links (Hidden when menu is open) */}
          <div className={`hidden lg:flex items-center gap-8 transition-opacity duration-300 ${isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            {navLinks.slice(1).map((link) => ( // Skipping "Home" for desktop nav as is tradition
              <Link
                key={link.name}
                href={link.href}
                className={`font-satoshi font-medium text-base transition-all duration-300 uppercase ${isScrolled ? "text-gray-900 hover:text-gray-600" : "text-white hover:opacity-80"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Hamburger / Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-50 flex flex-col justify-center items-end gap-1.5 w-10 h-10 group lg:hidden"
          >
            <span
              className={`block w-8 h-[2px] transition-all duration-300 ${isMenuOpen ? "bg-white rotate-45 translate-y-[9px]" : isScrolled ? "bg-black" : "bg-white"
                }`}
            />
            <span
              className={`block w-6 h-[2px] transition-all duration-300 ${isMenuOpen ? "opacity-0" : isScrolled ? "bg-black" : "bg-white"
                } group-hover:w-8`}
            />
            <span
              className={`block w-8 h-[2px] transition-all duration-300 ${isMenuOpen ? "bg-white -rotate-45 -translate-y-[7px]" : isScrolled ? "bg-black" : "bg-white"
                }`}
            />
          </button>
        </div>
      </nav>

      {/* --- Full Screen Menu Overlay --- */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 h-screen w-screen flex flex-col pointer-events-auto">

            {/* 3 Striped Backgrounds */}
            <div className="absolute inset-0 z-0 flex w-full h-full pointer-events-none">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={stripeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-1/3 h-full bg-[#C4302B] border-r border-white/5 last:border-none" // #C4302B is the specific red
                />
              ))}
            </div>

            {/* Menu Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">

              {/* "MENU" Label */}
              <motion.p
                variants={contentVariants}
                custom={0}
                initial="initial"
                animate="animate"
                exit="exit"
                className="font-satoshi font-bold text-white/50 text-sm tracking-widest uppercase mb-8"
              >
                Menu
              </motion.p>

              {/* Navigation Links */}
              <div className="flex flex-col items-start gap-2 md:gap-4">
                {navLinks.map((link, index) => (
                  <div key={link.name} className="overflow-hidden">
                    <motion.div
                      custom={index + 1}
                      variants={contentVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block font-baloo font-bold text-white text-[56px] md:text-[80px] lg:text-[100px] leading-[0.9] uppercase hover:text-white/80 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}