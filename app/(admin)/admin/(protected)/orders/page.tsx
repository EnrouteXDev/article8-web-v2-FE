"use client";

import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  Upload,
  ChevronDown,
  Info,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import OrderDetailPanel, {
  type Order,
  type OrderStatus,
} from "@/components/admin/OrderDetailPanel";

// ── Mock data ──────────────────────────────────────────────────────────────
const sharedProducts = [
  { id: "1765", name: "Article8 Shirt", image: "/artifact1.jpeg", qty: 1, amount: "£4.99" },
  { id: "8775", name: "Article8 Vans",  image: "/artifact2.jpeg", qty: 4, amount: "£4.99" },
  { id: "7665", name: "Article8 Shirt", image: "/artifact3.jpeg", qty: 2, amount: "£4.99" },
  { id: "0987", name: "Article8 Vans",  image: "/artifact4.jpeg", qty: 1, amount: "£4.99" },
];

const sharedDetail = {
  customer: "Aliyu Mudashiru",
  email: "aliyumudahiru@gmail.com",
  address: "372 Kola Lateef Jakande, Lagos",
  phone: "+2348176549880",
  orderAmount: "£420.99",
  couponDiscount: "-£20.99",
  shippingFee: "£10.99",
  total: "£410.99",
  products: sharedProducts,
};

const orders: Order[] = [
  { id: "#000010", date: "15/03/21", amount: "£84.99", status: "Completed"  as OrderStatus, ...sharedDetail },
  { id: "#000010", date: "15/03/21", amount: "£89.99", status: "Shipped"    as OrderStatus, ...sharedDetail },
  { id: "#000010", date: "15/03/21", amount: "£22.99", status: "Cancelled"  as OrderStatus, ...sharedDetail },
  { id: "#000010", date: "15/03/21", amount: "£4.99",  status: "Processing" as OrderStatus, ...sharedDetail },
];

const stats = [
  { label: "Total sales",        value: "£489.98", red: false },
  { label: "Total orders",       value: "4",       red: false },
  { label: "Shipped orders",     value: "2",       red: false },
  { label: "Processing orders",  value: "1",       red: false },
  { label: "Cancelled orders",   value: "1",       red: true  },
];

const statusBadge: Record<
  OrderStatus,
  { dot: string; text: string; bg: string }
> = {
  Completed:  { dot: "bg-green-500",  text: "text-green-600",  bg: "bg-green-50"  },
  Shipped:    { dot: "bg-purple-500", text: "text-purple-600", bg: "bg-purple-50" },
  Cancelled:  { dot: "bg-red-500",    text: "text-red-600",    bg: "bg-red-50"    },
  Processing: { dot: "bg-gray-400",   text: "text-gray-600",   bg: "bg-gray-100"  },
};

// ── Page ───────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div
      className="flex flex-col gap-5"
      style={{ fontFamily: "var(--font-satoshi)" }}
    >
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map(({ label, value, red }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-5 flex flex-col gap-2 border border-gray-100"
          >
            <span className={`text-sm font-medium ${red ? "text-primary" : "text-gray-600"}`}>
              {label}
            </span>
            <span className={`text-2xl font-bold ${red ? "text-primary" : "text-gray-900"}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl p-6 flex flex-col gap-5">
        {/* Toolbar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search item"
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <SlidersHorizontal className="size-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
              <Upload className="size-4" />
              Export CSV
              <ChevronDown className="size-4 text-gray-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
              <Plus className="size-4" />
              Add order
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Order ID", "Date", "Customer", "Customer Email", "Total Amount"].map((h) => (
                <th
                  key={h}
                  className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
              <th className="pb-3 text-left">
                <span className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Status <Info className="size-3" />
                </span>
              </th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => {
              const badge = statusBadge[order.status];
              const isSelected = selectedOrder?.id === order.id && selectedOrder?.status === order.status;
              return (
                <tr
                  key={i}
                  onClick={() => setSelectedOrder(order)}
                  className={`cursor-pointer transition-colors ${
                    i !== orders.length - 1 ? "border-b border-gray-100" : ""
                  } ${isSelected ? "bg-gray-50" : "hover:bg-gray-50"}`}
                >
                  <td className="py-4 pr-4 text-sm font-medium text-gray-800">{order.id}</td>
                  <td className="py-4 pr-4 text-sm text-gray-500">{order.date}</td>
                  <td className="py-4 pr-4 text-sm text-gray-800">{order.customer}</td>
                  <td className="py-4 pr-4 text-sm text-gray-500">{order.email}</td>
                  <td className="py-4 pr-4 text-sm font-medium text-gray-800">{order.amount}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${badge.bg} ${badge.text}`}
                    >
                      <span className={`size-1.5 rounded-full shrink-0 ${badge.dot}`} />
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
