import React from "react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
  onDotClick?: (index: number) => void;
  type?: "arrows" | "dots" | "all";
  className?: string;
}

export default function CarouselControls({
  onPrev,
  onNext,
  currentIndex,
  total,
  onDotClick,
  type = "all",
  className = ""
}: CarouselControlsProps) {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {(type === "arrows" || type === "all") && (
        <button
          onClick={onPrev}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all"
          aria-label="Previous artifact"
        >
          <ArrowLeft01Icon size={24} />
        </button>
      )}

      {(type === "dots" || type === "all") && (
        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => onDotClick?.(idx)}
              className={`
                rounded-full transition-all duration-300
                ${currentIndex === idx
                  ? 'w-3 h-3 bg-primary'
                  : 'w-2.5 h-2.5 border-2 border-primary bg-transparent hover:bg-primary/20'
                }
              `}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={currentIndex === idx ? "true" : "false"}
            />
          ))}
        </div>
      )}

      {(type === "arrows" || type === "all") && (
        <button
          onClick={onNext}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all"
          aria-label="Next artifact"
        >
          <ArrowRight01Icon size={24} />
        </button>
      )}
    </div>
  );
}