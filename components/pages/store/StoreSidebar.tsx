"use client"
import React from "react";

interface FilterSectionProps {
  title: string;
  items: { label: string; count?: number; checked?: boolean }[];
}

const FilterSection = ({ title, items }: FilterSectionProps) => (
  <div className="flex flex-col gap-4">
    <h3 className="font-baloo font-bold text-[24px] text-primary">
      {title}
    </h3>
    <div className="flex flex-col gap-2">
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

export default function StoreSidebar() {
  return (
    <aside className="w-full lg:w-[320px] flex flex-col gap-10">
      {/* Categories Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-baloo font-bold text-[28px] text-primary">
          Categories
        </h2>
        <button className="w-[88px] h-[41px] bg-primary text-white font-satoshi text-sm rounded-[8px] hover:bg-primary/90 transition-colors">
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-8">
        <FilterSection
          title="Merch Type"
          items={[
            { label: "All", count: 200, checked: true },
            { label: "Shirts", count: 42 },
            { label: "Caps", count: 39 },
            { label: "Keys Holders", count: 39 },
            { label: "Bucket Hats", count: 39 },
          ]}
        />

        <FilterSection
          title="Price Range"
          items={[
            { label: "£0 - £5", count: 20 },
            { label: "£5 - £20", count: 3 },
            { label: "£20 - £40", count: 40 },
          ]}
        />

        <FilterSection
          title="Avability"
          items={[
            { label: "Available", count: 100 },
            { label: "Out of stock", count: 100 },
          ]}
        />
      </div>
    </aside>
  );
}
