"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function DiscussWithUsContainer() {
  return (
    <section className="  bg-[#FFF8F6] py-10 md:py-20">
      <div className="section-container section-px lg:w-[75%] w-full">
        <div className="relative w-full bg-[#FFEBEB] rounded-[32px] md:rounded-[48px] overflow-hidden min-h-[220px] md:min-h-[340px] flex items-center">
          {/* Faint Background Designs */}
          <div className="absolute top-0 left-0 h-full w-1/2 opacity-60 pointer-events-none">
            <Image
              src="/images/products/dwu_design_1.png"
              alt=""
              fill
              className="object-contain object-top-left"
            />
          </div>
          <div className="absolute bottom-0 right-0 h-full w-1/2 opacity-60 pointer-events-none">
            <Image
              src="/images/products/dwu_design_2.png"
              alt=""
              fill
              className="object-contain object-bottom-right"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full px-6 md:px-20 py-12 md:py-0 flex flex-row items-center justify-between gap-4 md:gap-10">
            <h2 className="font-baloo font-bold text-[#DA2439] text-[20px] sm:text-[24px] md:text-[56px] lg:text-[64px] leading-[1.1] max-w-[180px] sm:max-w-[240px] md:max-w-3xl">
              Ready to discuss your project with us?
            </h2>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#DA2439] text-white font-satoshi font-bold text-[10px] md:text-[16px] px-4 md:px-12 py-3 md:py-6 rounded-lg md:rounded-2xl  uppercase tracking-widest whitespace-nowrap"
            >
              CONTACT US
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}