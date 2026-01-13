"use client"
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowDown01Icon, ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon } from "hugeicons-react";

interface MediaPost {
  id: string;
  image: string;
  title: string;
  tags: string[];
}

interface GalleryCategory {
  id: string;
  title: string;
  subtitle: string;
  posts: MediaPost[];
}

const mockPosts: MediaPost[] = Array(6).fill(null).map((_, i) => ({
  id: `post-${i}`,
  image: "/demo.jpg",
  title: "Media Post",
  tags: ["Sky fall", "Heaven"]
}));

const categories: GalleryCategory[] = [
  {
    id: "01",
    title: "Media work",
    subtitle: "Bringing ideas to life through 2D, 3D, and motion-driven storytelling.",
    posts: mockPosts.slice(0, 3)
  },
  {
    id: "02",
    title: "Media work",
    subtitle: "Bringing ideas to life through 2D, 3D, and motion-driven storytelling.",
    posts: []
  },
  {
    id: "03",
    title: "Media work",
    subtitle: "Bringing ideas to life through 2D, 3D, and motion-driven storytelling.",
    posts: mockPosts
  }
];

export default function GalleryMediaSection() {
  const [openIds, setOpenIds] = useState<string[]>(["01"]);

  // Modal State
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
  const [activePosts, setActivePosts] = useState<MediaPost[]>([]);
  const isModalOpen = selectedPostIndex !== null;

  const toggleAccordion = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const openModal = (index: number, posts: MediaPost[]) => {
    setSelectedPostIndex(index);
    setActivePosts(posts);
  };

  const closeModal = () => {
    setSelectedPostIndex(null);
    setActivePosts([]);
  };

  const nextPost = useCallback(() => {
    if (selectedPostIndex !== null && activePosts.length > 0) {
      setSelectedPostIndex((selectedPostIndex + 1) % activePosts.length);
    }
  }, [selectedPostIndex, activePosts]);

  const prevPost = useCallback(() => {
    if (selectedPostIndex !== null && activePosts.length > 0) {
      setSelectedPostIndex((selectedPostIndex - 1 + activePosts.length) % activePosts.length);
    }
  }, [selectedPostIndex, activePosts]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextPost();
      if (e.key === "ArrowLeft") prevPost();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, nextPost, prevPost]);

  return (
    <section className="w-full py-16 lg:py-24 bg-background section-px">
      <div className="section-container flex flex-col">
        {categories.map((cat) => (
          <div key={cat.id} className="border-b border-primary/10">
            {/* Accordion Header */}
            <div
              className="flex items-start justify-between py-10 cursor-pointer group"
              onClick={() => toggleAccordion(cat.id)}
            >
              <div className="flex items-start gap-4 lg:gap-8">
                <span className="font-satoshi text-primary text-xl lg:text-2xl pt-2">[{cat.id}]</span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-baloo font-bold text-3xl lg:text-[40px] text-primary leading-tight">
                    {cat.title}
                  </h3>
                  <p className="font-satoshi text-base lg:text-lg text-primary/70 max-w-xl">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-primary flex items-center justify-center text-primary shrink-0 transition-transform duration-300 ${openIds.includes(cat.id) ? 'rotate-180' : ''}`}>
                <ArrowDown01Icon size={28} />
              </div>
            </div>

            {/* Accordion Content */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIds.includes(cat.id) ? 'max-h-[3000px] pb-16' : 'max-h-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {cat.posts.map((post, index) => (
                  <div key={post.id} className="flex flex-col gap-4">
                    {/* Image Container */}
                    <div
                      className="relative aspect-4/3 rounded-[24px] overflow-hidden border border-primary/10 cursor-pointer group/item"
                      onClick={() => openModal(index, cat.posts)}
                    >
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 font-satoshi font-medium">View Project</span>
                      </div>
                    </div>
                    {/* Post Footer */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-baloo font-semibold text-2xl lg:text-3xl text-primary">
                        {post.title}
                      </h4>
                      <div className="flex gap-2">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && selectedPostIndex !== null && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors p-2"
          >
            <Cancel01Icon size={40} />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={prevPost}
            className="absolute left-4 lg:left-8 text-white/50 hover:text-white transition-colors p-4"
          >
            <ArrowLeft01Icon size={48} />
          </button>

          <button
            onClick={nextPost}
            className="absolute right-4 lg:right-8 text-white/50 hover:text-white transition-colors p-4"
          >
            <ArrowRight01Icon size={48} />
          </button>

          {/* Image Content */}
          <div className="w-[90%] h-[80%] relative flex flex-col items-center justify-center gap-8">
            <div className="relative w-full h-full">
              <Image
                src={activePosts[selectedPostIndex].image}
                alt={activePosts[selectedPostIndex].title}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="text-center flex flex-col items-center gap-4">
              <h3 className="text-white font-baloo font-bold text-3xl lg:text-5xl">
                {activePosts[selectedPostIndex].title}
              </h3>
              <div className="flex gap-3">
                {activePosts[selectedPostIndex].tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-white/60 font-satoshi text-lg mt-2">
                {selectedPostIndex + 1} / {activePosts.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
