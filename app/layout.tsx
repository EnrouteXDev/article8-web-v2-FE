import type { Metadata } from "next";
import { Geist, Geist_Mono, Baloo_2, Baloo_Da_2 } from "next/font/google";
import "./globals.css";
import Footer from "@/components/shared/layouts/Footer";
import Navbar from "@/components/shared/layouts/Navbar";
import { siteConfig } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

const balooDa2 = Baloo_Da_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL("https://article8.media"),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "https://article8.media",
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
          :root {
            --font-satoshi: 'Satoshi', sans-serif;
          }
        `}} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${balooDa2.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
