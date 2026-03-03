import React from "react";
import PageHero from "@/components/shared/PageHero";
import ContactSection from "@/components/pages/home/ContactSection";

export default function Contact() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <PageHero
        title="Contact Us"
        description="Have an Idea? We're ready to listen, collaborate, and create extraordinary."
      />

      {/* Existing Contact Section */}
      <ContactSection />

      {/* Contact Details Section */}
      <section className="w-full pb-24 bg-background section-px">
        <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

          {/* Left Column: Header & Socials */}
          <div className="flex flex-col gap-7">
            <h2 className="font-baloo font-bold text-4xl lg:text-[72px] text-primary uppercase leading-tight">
              Contact Details
            </h2>

            <div className="flex flex-wrap gap-8 text-2xl font-medium text-primary uppercase font-satoshi">
              <span className="cursor-pointer hover:opacity-80 transition-opacity">Linkedin</span>
              <span className="cursor-pointer hover:opacity-80 transition-opacity">Facebook</span>
              <span className="cursor-pointer hover:opacity-80 transition-opacity">Twitter</span>
            </div>
          </div>

          {/* Right Column: Address & Info */}
          <div className="flex flex-col gap-7 text-3xl font-normal leading-tight text-primary font-satoshi">
            <p className="max-w-xl">
              F3B4, Lagos HOMS Estate, Olu Aina Street, Mushin, Lagos
            </p>
            <a href="tel:+2348027161206" className="hover:opacity-80 transition-opacity">
              +234 802 716 1206
            </a>
            <a href="tel:+2349025999661" className="hover:opacity-80 transition-opacity">
              +234 902 599 9661
            </a>
            <a href="mailto:info@Article8.media" className="hover:opacity-80 transition-opacity text-primary">
              info@Article8.media
            </a>
          </div>

        </div>
      </section>
    </main>
  );
}
