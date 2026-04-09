"use client"
import React, { useState } from "react";
import { ArrowDown01Icon } from "hugeicons-react";
import { useCategories } from "@/lib/queries/categories";
import type { ProductFilters } from "@/lib/types";
import { ProductAvailability } from "@/lib/types";

const PRICE_RANGES = [
  { label: "Under £5", min: 0, max: 5 },
  { label: "£5 – £20", min: 5, max: 20 },
  { label: "£20 – £40", min: 20, max: 40 },
  { label: "£40+", min: 40, max: undefined },
];

interface FilterSectionProps {
  title: string;
  isOpenDefault?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, children, isOpenDefault = false }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between lg:pointer-events-none w-full"
      >
        <h3 className="font-baloo font-bold text-[24px] text-primary">{title}</h3>
        <div className={`lg:hidden transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ArrowDown01Icon size={24} className="text-primary" />
        </div>
      </button>

      <div
        className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

interface FilterItemProps {
  label: string;
  count?: number;
  checked: boolean;
  onToggle: () => void;
}

function FilterItem({ label, count, checked, onToggle }: FilterItemProps) {
  return (
    <label
      onClick={onToggle}
      className="flex items-center justify-between p-2.5 bg-[#FFEBEB] rounded-lg cursor-pointer group hover:bg-primary/10 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-3.5 h-3.5 border border-primary rounded-xs flex items-center justify-center ${
            checked ? "bg-primary" : "bg-transparent"
          }`}
        >
          {checked && <div className="w-2 h-2 bg-white rounded-sm" />}
        </div>
        <span className="font-satoshi text-[20px] text-primary">{label}</span>
      </div>
      {count !== undefined && (
        <span className="font-satoshi text-[20px] text-primary/60">{count}</span>
      )}
    </label>
  );
}

type Filters = Omit<ProductFilters, "page" | "limit">;

interface StoreSidebarProps {
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onClear: () => void;
}

export default function StoreSidebar({ filters, onFilterChange, onClear }: StoreSidebarProps) {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({ limit: 50 });
  const categories = categoriesData?.data ?? [];

  // Active price range index
  const activePriceIdx = PRICE_RANGES.findIndex(
    (r) => r.min === filters.minPrice && r.max === filters.maxPrice
  );

  function toggleCategory(id: string) {
    onFilterChange("category", filters.category === id ? undefined : id);
  }

  function togglePriceRange(idx: number) {
    if (activePriceIdx === idx) {
      onFilterChange("minPrice", undefined);
      onFilterChange("maxPrice", undefined);
    } else {
      onFilterChange("minPrice", PRICE_RANGES[idx].min);
      onFilterChange("maxPrice", PRICE_RANGES[idx].max);
    }
  }

  function toggleAvailability(value: ProductAvailability) {
    onFilterChange("availability", filters.availability === value ? undefined : value);
  }

  return (
    <aside className="w-full lg:w-[320px] flex flex-col gap-6 lg:gap-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-baloo font-bold text-[28px] text-primary">Categories</h2>
        <button
          onClick={onClear}
          className="w-22 h-10.25 bg-primary text-white font-satoshi text-sm rounded-lg hover:bg-primary/90 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-col lg:gap-8 divide-y divide-primary/10 lg:divide-none">

        {/* Merch Type / Categories */}
        <div className="py-4 lg:py-0">
          <FilterSection title="Merch Type" isOpenDefault={true}>
            <FilterItem
              label="All"
              checked={!filters.category}
              onToggle={() => onFilterChange("category", undefined)}
            />
            {categoriesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-primary/10 rounded-lg animate-pulse" />
                ))
              : categories.map((cat) => (
                  <FilterItem
                    key={cat._id}
                    label={cat.name}
                    checked={filters.category === cat._id}
                    onToggle={() => toggleCategory(cat._id)}
                  />
                ))}
          </FilterSection>
        </div>

        {/* Price Range */}
        <div className="py-4 lg:py-0">
          <FilterSection title="Price Range">
            {PRICE_RANGES.map((range, idx) => (
              <FilterItem
                key={range.label}
                label={range.label}
                checked={activePriceIdx === idx}
                onToggle={() => togglePriceRange(idx)}
              />
            ))}
          </FilterSection>
        </div>

        {/* Availability */}
        <div className="py-4 lg:py-0">
          <FilterSection title="Availability">
            <FilterItem
              label="Available"
              checked={filters.availability === ProductAvailability.AVAILABLE}
              onToggle={() => toggleAvailability(ProductAvailability.AVAILABLE)}
            />
            <FilterItem
              label="Out of stock"
              checked={filters.availability === ProductAvailability.OUT_OF_STOCK}
              onToggle={() => toggleAvailability(ProductAvailability.OUT_OF_STOCK)}
            />
          </FilterSection>
        </div>

      </div>
    </aside>
  );
}
