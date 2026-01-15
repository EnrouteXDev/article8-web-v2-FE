"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Gallery", href: "/gallery" },
  { name: "Services", href: "/services" },
  { name: "Store", href: "/store" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for video player state changes (only on home page)
  useEffect(() => {
    if (!isHomePage) return;

    const handleVideoStateChange = (event: CustomEvent) => {
      setIsVideoPlaying(event.detail.isPlaying);
    };

    window.addEventListener('videoPlayerStateChange', handleVideoStateChange as EventListener);

    return () => {
      window.removeEventListener('videoPlayerStateChange', handleVideoStateChange as EventListener);
    };
  }, [isHomePage]);

  // Determine if navbar should be hidden
  const shouldHideNavbar = isHomePage && isVideoPlaying;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${shouldHideNavbar
        ? "opacity-0 pointer-events-none -translate-y-full"
        : "opacity-100 translate-y-0"
        } ${isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-[1480px] mx-auto px-8 md:px-16 h-[90px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative w-[184px] h-[54px]">
          <Image
            src={"/Logo.svg"}
            alt="Article8 Media Logo"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {/* Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`font-satoshi font-medium text-base transition-all duration-300 uppercase ${isScrolled
                ? "text-gray-900 hover:text-gray-600"
                : "text-white hover:opacity-80"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Trigger (Placeholder) */}
        {/* We can add a mobile menu button here later if needed */}
      </div>
    </nav>
  );
}