"use client"
import React, { useState } from "react";
import { ArrowDown01Icon } from "hugeicons-react";

interface FilterSectionProps {
  title: string;
  items: { label: string; count?: number; checked?: boolean }[];
  isOpenDefault?: boolean;
}

const FilterSection = ({ title, items, isOpenDefault = false }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="flex flex-col gap-4">
      {/* Header - Toggleable on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between lg:pointer-events-none w-full"
      >
        <h3 className="font-baloo font-bold text-[24px] text-primary">
          {title}
        </h3>
        <div className={`lg:hidden transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ArrowDown01Icon size={24} className="text-primary" />
        </div>
      </button>

      {/* Items - Collapsible on mobile */}
      <div className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'}`}>
        {items.map((item, idx) => (
          <label
            key={idx}
            className="flex items-center justify-between p-[10px] bg-[#FFEBEB] rounded-[8px] cursor-pointer group hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-[14px] h-[14px] border border-primary rounded-[2px] flex items-center justify-center ${item.checked ? 'bg-primary' : 'bg-transparent'}`}>
                {item.checked && (
                  <div className="w-[8px] h-[8px] bg-white rounded-sm" />
                )}
              </div>
              <span className="font-satoshi text-[20px] text-primary">
                {item.label}
              </span>
            </div>
            {item.count !== undefined && (
              <span className="font-satoshi text-[20px] text-primary/60">
                {item.count}
              </span>
            )}
            <input type="checkbox" className="hidden" readOnly checked={item.checked} />
          </label>
        ))}
      </div>
    </div>
  );
};

export default function StoreSidebar() {
  return (
    <aside className="w-full lg:w-[320px] flex flex-col gap-6 lg:gap-10">
      {/* Categories Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-baloo font-bold text-[28px] text-primary">
          Categories
        </h2>
        <button className="w-[88px] h-[41px] bg-primary text-white font-satoshi text-sm rounded-[8px] hover:bg-primary/90 transition-colors">
          Clear all
        </button>
      </div>

      <div className="flex flex-col lg:gap-8 divide-y divide-primary/10 lg:divide-none">
        <div className="py-4 lg:py-0">
          <FilterSection
            title="Merch Type"
            isOpenDefault={true}
            items={[
              { label: "All", count: 200, checked: true },
              { label: "Shirts", count: 42 },
              { label: "Caps", count: 39 },
              { label: "Keys Holders", count: 39 },
              { label: "Bucket Hats", count: 39 },
            ]}
          />
        </div>

        <div className="py-4 lg:py-0">
          <FilterSection
            title="Price Range"
            items={[
              { label: "£0 - £5", count: 20 },
              { label: "£5 - £20", count: 3 },
              { label: "£20 - £40", count: 40 },
            ]}
          />
        </div>

        <div className="py-4 lg:py-0">
          <FilterSection
            title="Availability"
            items={[
              { label: "Available", count: 100 },
              { label: "Out of stock", count: 100 },
            ]}
          />
        </div>
      </div>
    </aside>
  );
}
