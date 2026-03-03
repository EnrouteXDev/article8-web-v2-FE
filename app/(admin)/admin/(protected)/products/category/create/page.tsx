"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

const allProducts = [
  "Article8 Shirt",
  "Article8 Tops",
  "Article8 Vans",
  "Article8 Cap",
];

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleProduct = (product: string) => {
    setSelected((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]
    );
  };

  return (
    <div
      className="bg-white rounded-xl p-6"
      style={{ fontFamily: "var(--font-satoshi)" }}
    >
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-5">
        <span className="text-gray-800 font-medium">Products</span>
        <span className="mx-1">/</span>
        <span className="text-gray-800 font-medium">Category</span>
        <span className="mx-1">/</span>
        Create category
      </p>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Category Information
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Users will search your product by category. Use words that best
            describes the product
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
          Save changes
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-6 max-w-lg">
        {/* Category name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Category name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        {/* Select product */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Select product
          </label>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="w-full h-11 px-4 flex items-center justify-between rounded-lg border border-gray-200 text-sm text-gray-400 bg-white hover:border-gray-300 transition-colors"
            >
              <span>Select products</span>
              <ChevronDown
                className={`size-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                {allProducts.map((product) => {
                  const isSelected = selected.includes(product);
                  return (
                    <button
                      key={product}
                      type="button"
                      onClick={() => toggleProduct(product)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-primary/5 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {product}
                      {isSelected && (
                        <span className="size-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected tags */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {selected.map((product) => (
                <span
                  key={product}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700 bg-white"
                >
                  {product}
                  <button
                    type="button"
                    onClick={() => toggleProduct(product)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
