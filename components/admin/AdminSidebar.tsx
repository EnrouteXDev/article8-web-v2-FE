"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Headphones,
  ShieldCheck,
  ChevronDown,
  MessageSquareText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const productsSubItems = [
  { href: "/admin/dashboard", label: "Products" },
  { href: "/admin/products/category", label: "Category" },
];

const navItems = [
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/reviews", icon: MessageSquareText, label: "Reviews" },
  { href: "/admin/support", icon: Headphones, label: "Customer Support" },
  { href: "/admin/policy", icon: ShieldCheck, label: "Rules & Policy" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isProductsSection =
    pathname === "/admin/dashboard" ||
    pathname.startsWith("/admin/products");

  const [productsOpen, setProductsOpen] = useState(isProductsSection);

  return (
    <aside
      className="w-52 shrink-0 bg-white border-r border-gray-200 flex flex-col py-3"
      style={{ fontFamily: "var(--font-satoshi)" }}
    >
      <nav className="flex flex-col gap-0.5 px-3">
        {/* Products — collapsible */}
        <div>
          <button
            onClick={() => setProductsOpen((o) => !o)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              isProductsSection
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            )}
          >
            <Package className="size-4 shrink-0" />
            <span className="flex-1 text-left">Products</span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 transition-transform",
                productsOpen && "rotate-180"
              )}
            />
          </button>

          {productsOpen && (
            <div className="flex flex-col gap-0.5 mt-0.5 pl-10">
              {productsSubItems.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "text-primary font-medium"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Other nav items */}
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
