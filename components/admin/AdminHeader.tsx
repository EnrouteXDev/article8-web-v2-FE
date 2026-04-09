"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Menu } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Products",
  "/admin/products/create": "Create Product",
  "/admin/products/category": "Products",
  "/admin/products/category/create": "Products",
  "/admin/orders": "Orders",
  "/admin/reviews": "Reviews",
  "/admin/support": "Customer Support",
  "/admin/policy": "Rules & Policy",
  "/admin/settings": "Settings",
};

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="h-14 md:h-16 bg-white border-b border-gray-200 flex items-center shrink-0 px-4">
      {/* Mobile: hamburger + logo */}
      <div className="flex items-center gap-3 md:hidden flex-1">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <Image
          src="/Logo.svg"
          alt="Article8 Media Studios"
          width={100}
          height={30}
          priority
        />
      </div>

      {/* Desktop: logo area matching sidebar width */}
      <div className="hidden md:flex w-52 shrink-0 items-center px-1">
        <Image
          src="/Logo.svg"
          alt="Article8 Media Studios"
          width={130}
          height={38}
          priority
        />
      </div>

      {/* Desktop: page title */}
      <div className="hidden md:flex flex-1 px-6">
        <span
          className="text-lg font-semibold text-gray-900"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          {title}
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 md:gap-3 md:px-6">
        <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors">
          <Bell className="size-3.5 md:size-4 text-white" />
        </button>
        <button
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs text-gray-600 font-medium">A</span>
          </div>
          <span className="hidden md:inline text-sm text-gray-700 font-medium">Admin</span>
          <ChevronDown className="hidden md:inline size-4 text-gray-500" />
        </button>
      </div>
    </header>
  );
}
