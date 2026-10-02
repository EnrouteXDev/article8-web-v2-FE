"use client";

import { useState } from "react";
import { ChevronDown, Ruler } from "lucide-react";

// All measurements in inches
const SHIRT_SIZES = [
  { size: "S", chest: "34 - 36", waist: "34 - 36", sleeve: "32.5 - 33", neck: "14 - 14.5" },
  { size: "M", chest: "38 - 40", waist: "38 - 40", sleeve: "33.5 - 34", neck: "15 - 15.5" },
  { size: "L", chest: "42 - 44", waist: "42 - 44", sleeve: "34.5 - 35", neck: "16 - 16.5" },
  { size: "XL", chest: "46 - 48", waist: "46 - 48", sleeve: "35.5 - 36", neck: "17 - 17.5" },
  { size: "XXL", chest: "50 - 52", waist: "50 - 52", sleeve: "35.5 - 36", neck: "18 - 18.5" },
  { size: "MT", chest: "38 - 40", waist: "38 - 40", sleeve: "35.5 - 36", neck: "15 - 15.5" },
  { size: "LT", chest: "42 - 44", waist: "42 - 44", sleeve: "36.5 - 37", neck: "16 - 16.5" },
  { size: "XLT", chest: "46 - 48", waist: "46 - 48", sleeve: "36.5 - 37", neck: "17 - 17.5" },
  { size: "2XT", chest: "50 - 52", waist: "50 - 52", sleeve: "37.5 - 38", neck: "18 - 18.5" },
  { size: "3XT", chest: "54 - 56", waist: "54 - 56", sleeve: "37.5 - 38", neck: "19 - 19.5" },
  { size: "1X", chest: "49 - 51", waist: "49 - 51", sleeve: "34.5 - 35", neck: "17 - 17.5" },
  { size: "2X", chest: "53 - 55", waist: "53 - 55", sleeve: "34.5 - 35", neck: "18 - 18.5" },
  { size: "3X", chest: "57 - 59", waist: "57 - 59", sleeve: "35.5 - 36", neck: "19 - 19.5" },
  { size: "4X", chest: "61 - 63", waist: "61 - 63", sleeve: "35.5 - 36", neck: "20 - 20.5" },
];

export default function SizeGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-primary/20 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full h-11 px-4 flex items-center justify-between text-primary font-satoshi text-sm font-medium hover:bg-primary/5 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Ruler size={16} />
          Size Guide
        </span>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-primary/10 px-4 py-4 flex flex-col gap-3">
          <p className="font-satoshi text-xs text-primary/60">
            US sizes. All measurements are in inches. T sizes are tall fits with longer sleeves.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] font-satoshi text-sm text-primary">
              <thead>
                <tr className="bg-[#FFEBEB] text-left">
                  <th className="px-3 py-2 font-medium rounded-l-md">Size</th>
                  <th className="px-3 py-2 font-medium">Chest</th>
                  <th className="px-3 py-2 font-medium">Waist</th>
                  <th className="px-3 py-2 font-medium">Sleeve</th>
                  <th className="px-3 py-2 font-medium rounded-r-md">Neck</th>
                </tr>
              </thead>
              <tbody>
                {SHIRT_SIZES.map((row) => (
                  <tr key={row.size} className="border-b border-primary/10 last:border-0">
                    <td className="px-3 py-2 font-medium">{row.size}</td>
                    <td className="px-3 py-2 text-primary/70">{row.chest}</td>
                    <td className="px-3 py-2 text-primary/70">{row.waist}</td>
                    <td className="px-3 py-2 text-primary/70">{row.sleeve}</td>
                    <td className="px-3 py-2 text-primary/70">{row.neck}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
