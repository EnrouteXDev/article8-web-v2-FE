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
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const isProductsSection =
    pathname === "/admin/dashboard" || pathname.startsWith("/admin/products");
  const [productsOpen, setProductsOpen] = useState(isProductsSection);

  return (
    <nav className="flex flex-col gap-0.5 px-3 py-3">
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
                  onClick={onLinkClick}
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

      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onLinkClick}
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
  );
}

export default function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <aside
        className="hidden md:flex w-52 shrink-0 bg-white border-r border-gray-200 flex-col"
        style={{ fontFamily: "var(--font-satoshi)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-white shadow-xl flex flex-col md:hidden"
              style={{ fontFamily: "var(--font-satoshi)" }}
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-800">Menu</span>
                <button
                  onClick={onMobileClose}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent onLinkClick={onMobileClose} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
