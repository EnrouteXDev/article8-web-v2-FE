import React from "react";
import SectionHeader from "@/components/shared/headers/SectionHeader";
import ContactForm from "@/components/pages/home/ContactForm";

export default function ContactSection() {
  return (
    <section className="w-full py-16 bg-background section-px">
      <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Left Column: Text */}
        <div className="flex flex-col gap-6">
          <SectionHeader
            smallHeader="Contact Us"
            mainHeader="GET IN TOUCH"
            alignment="left"
          />
          <p className="font-satoshi font-normal text-lg lg:text-2xl leading-relaxed text-primary">
            We're your creative partners in crafting visuals that move people and brands forward. Whether it's 3D animation, film, or digital storytelling, we collaborate with visionaries who refuse to play it safe. Got a bold idea?
            <br />
            Let's bring it to life.
          </p>
        </div>

        {/* Right Column: Form */}
        <ContactForm />
      </div>
    </section>
  );
}
