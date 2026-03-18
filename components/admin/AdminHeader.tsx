"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown } from "lucide-react";

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

export default function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center shrink-0">
      {/* Logo area — same width as sidebar */}
      <div className="w-52 shrink-0 flex items-center px-5">
        <Image
          src="/Logo.svg"
          alt="Article8 Media Studios"
          width={130}
          height={38}
          priority
        />
      </div>

      {/* Page title */}
      <div className="flex-1 px-6">
        <span
          className="text-lg font-semibold text-gray-900"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          {title}
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 px-6">
        {/* Notification bell */}
        <button className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors">
          <Bell className="size-4 text-white" />
        </button>

        {/* User */}
        <button
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-satoshi)" }}
        >
          <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs text-gray-600 font-medium">A</span>
          </div>
          <span className="text-sm text-gray-700 font-medium">Admin</span>
          <ChevronDown className="size-4 text-gray-500" />
        </button>
      </div>
    </header>
  );
}
