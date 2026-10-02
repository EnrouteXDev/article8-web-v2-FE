"use client";

import { ALLOWED_SIZES } from "@/lib/utils/sizes";
import type { Product, ProductSizesInput } from "@/lib/types";

export interface ProductSizesValue {
  selected: string[];
  // true → each size has its own stock; false → sizes share the product quantity
  perSizeStock: boolean;
  quantities: Record<string, string>;
  hasSizeGuide: boolean;
}

export const emptySizesValue: ProductSizesValue = {
  selected: [],
  perSizeStock: false,
  quantities: {},
  hasSizeGuide: false,
};

export function sizesValueFromProduct(product: Product): ProductSizesValue {
  const sizes = product.sizes ?? [];
  return {
    selected: sizes.map((s) => s.label),
    perSizeStock: sizes.length > 0 && sizes.every((s) => typeof s.quantity === "number"),
    quantities: Object.fromEntries(
      sizes
        .filter((s) => typeof s.quantity === "number")
        .map((s) => [s.label, String(s.quantity)])
    ),
    hasSizeGuide: !!product.hasSizeGuide,
  };
}

export function usesPerSizeStock(value: ProductSizesValue): boolean {
  return value.perSizeStock && value.selected.length > 0;
}

export function totalSizeStock(value: ProductSizesValue): number {
  return value.selected.reduce((sum, label) => {
    const qty = parseInt(value.quantities[label] ?? "", 10);
    return sum + (isNaN(qty) || qty < 0 ? 0 : qty);
  }, 0);
}

export function getSizesError(value: ProductSizesValue): string | null {
  if (!usesPerSizeStock(value)) return null;
  const missing = value.selected.filter((label) => !/^\d+$/.test((value.quantities[label] ?? "").trim()));
  return missing.length > 0 ? `Enter the stock for size ${missing.join(", ")}` : null;
}

export function buildSizesPayload(value: ProductSizesValue): {
  sizes: ProductSizesInput;
  hasSizeGuide: boolean;
} {
  const sizes: ProductSizesInput = usesPerSizeStock(value)
    ? value.selected.map((label) => ({ label, quantity: parseInt(value.quantities[label], 10) }))
    : value.selected;
  return { sizes, hasSizeGuide: value.selected.length > 0 && value.hasSizeGuide };
}

interface Props {
  value: ProductSizesValue;
  onChange: (value: ProductSizesValue) => void;
  disabled?: boolean;
}

export default function ProductSizesField({ value, onChange, disabled }: Props) {
  const toggleSize = (label: string) => {
    // Rebuild from ALLOWED_SIZES so the selection stays in display order
    const selected = ALLOWED_SIZES.filter((size) =>
      size === label ? !value.selected.includes(size) : value.selected.includes(size)
    );
    onChange({ ...value, selected });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Sizes</label>
        <p className="text-xs text-gray-500">
          Select the sizes this product comes in. Leave empty for products without sizes.
        </p>
        <div className="flex flex-wrap gap-2">
          {ALLOWED_SIZES.map((size) => {
            const selected = value.selected.includes(size);
            return (
              <button
                key={size}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                onClick={() => toggleSize(size)}
                className={`min-w-11 h-9 px-3 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 ${
                  selected
                    ? "bg-primary border-primary text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {value.selected.length > 0 && (
        <>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              disabled={disabled}
              checked={value.perSizeStock}
              onChange={(e) => onChange({ ...value, perSizeStock: e.target.checked })}
              className="size-4 accent-primary"
            />
            Track stock separately for each size
          </label>

          {value.perSizeStock && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {value.selected.map((label) => (
                <div key={label} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Stock for {label}</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    disabled={disabled}
                    value={value.quantities[label] ?? ""}
                    onChange={(e) =>
                      onChange({
                        ...value,
                        quantities: { ...value.quantities, [label]: e.target.value },
                      })
                    }
                    className="h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors disabled:opacity-50"
                  />
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              disabled={disabled}
              checked={value.hasSizeGuide}
              onChange={(e) => onChange({ ...value, hasSizeGuide: e.target.checked })}
              className="size-4 accent-primary"
            />
            Show the size guide on the product page
          </label>
        </>
      )}
    </div>
  );
}
