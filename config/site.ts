export const siteConfig = {
  name: "Article8 Media Studios",
  description:
    "Story-driven media studio crafting editorial, video, and immersive experiences with journalistic rigor.",
  navigation: [
    { label: "About", href: "#about" },
    { label: "Products", href: "#products" },
    { label: "Gallery", href: "/gallery" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ],
  links: {
    email: "hello@article8.media",
    instagram: "https://instagram.com/article8media",
    linkedin: "https://linkedin.com/company/article8media",
    facebook: "https://facebook.com/article8media",
    youtube: "https://youtube.com/@article8media",
    x: "https://x.com/article8media",
  },
} as const;

export type SiteConfig = typeof siteConfig;
