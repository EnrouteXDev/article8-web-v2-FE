import React from "react";
import Image from "next/image";
import {
  Linkedin01Icon,
  Facebook01Icon,
  TwitterIcon,
  YoutubeIcon,
  TiktokIcon,
  InstagramIcon,
} from "hugeicons-react";

export default function Footer() {
  return (
    <footer className="w-full py-15 bg-[#FFEBEB] text-foreground section-px">
      <div className="section-container grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1: Logo & Socials */}
        <div className="flex flex-col gap-6">
          <div className="relative w-[184px] h-[54px]">
            <Image
              src="/Logo.svg"
              alt="Article8 Media Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="flex flex-col gap-2 md:gap-4 text-[#ED1C24] ">
            <p className="text-base lg:text-lg font-medium">© 2026 Article8 Media Studios</p>
            <p className="text-base lg:text-lg font-medium">All rights reserved</p>
          </div>
          <div className="flex items-center gap-4 text-primary">
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Linkedin01Icon size={24} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Facebook01Icon size={24} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <TwitterIcon size={24} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <YoutubeIcon size={24} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <TiktokIcon size={24} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <InstagramIcon size={24} />
            </a>
          </div>
        </div>

        {/* Column 2: Our Story */}
        <div className="flex flex-col gap-6">
          <h3 className="font-baloo font-bold text-2xl md:text-[40px] leading-tight text-primary">
            Our Story
          </h3>
          <ul className="flex flex-col gap-4">
            {["Blog / Insights", "Animated Production", "Arch Viz", "Behind the Scenes"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="font-satoshi font-medium text-base text-primary lg:text-lg transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Events */}
        <div className="flex flex-col gap-6">
          <h3 className="font-baloo font-bold text-2xl md:text-[40px] leading-tight text-primary">
            Events
          </h3>
          <ul className="flex flex-col gap-4">
            {["Client Testimonials", "Award & Recognition", "Workshop & Master Class", "Upcoming Events"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-satoshi font-medium text-base text-primary lg:text-lg transition-colors"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div className="flex flex-col gap-6">
          <h3 className="font-baloo font-bold text-2xl md:text-[40px] leading-tight text-primary">
            Contact Us
          </h3>
          <div className="flex flex-col gap-4 font-satoshi font-medium text-base text-primary lg:text-lg">
            <p className="max-w-[250px]">
              F384, Lagos HOMS Estate, Olu Aina Street, Mushin, Lagos
            </p>
            <div className="flex flex-col text-primary">
              <a href="tel:+2348027161206">+234 802 716 1206</a>
              <a href="tel:+2349026999661">+234 902 699 9661</a>
            </div>
            <a href="mailto:info@article8.media" className="text-primary hover:underline">
              info@article8.media
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
