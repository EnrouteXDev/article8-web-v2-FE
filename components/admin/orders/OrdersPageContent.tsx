"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Upload, ChevronDown, Info, MoreVertical } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import AdminPage from "@/components/admin/shared/AdminPage";
import OrderDetailPanel from "@/components/admin/OrderDetailPanel";
import { useOrders, useOrderDashboard } from "@/lib/queries/orders";
import { type Order, OrderStatus } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";

const statusBadge: Record<OrderStatus, { dot: string; text: string; bg: string }> = {
  [OrderStatus.PENDING]:    { dot: "bg-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50"  },
  [OrderStatus.CONFIRMED]:  { dot: "bg-blue-500",   text: "text-blue-600",   bg: "bg-blue-50"   },
  [OrderStatus.PROCESSING]: { dot: "bg-gray-400",   text: "text-gray-600",   bg: "bg-gray-100"  },
  [OrderStatus.SHIPPED]:    { dot: "bg-purple-500", text: "text-purple-600", bg: "bg-purple-50" },
  [OrderStatus.DELIVERED]:  { dot: "bg-green-500",  text: "text-green-600",  bg: "bg-green-50"  },
  [OrderStatus.CANCELLED]:  { dot: "bg-red-500",    text: "text-red-600",    bg: "bg-red-50"    },
};

const statusLabel: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]:    "Pending",
  [OrderStatus.CONFIRMED]:  "Confirmed",
  [OrderStatus.PROCESSING]: "Processing",
  [OrderStatus.SHIPPED]:    "Shipped",
  [OrderStatus.DELIVERED]:  "Delivered",
  [OrderStatus.CANCELLED]:  "Cancelled",
};

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="py-4 pr-4">
          <div className="h-4 rounded bg-gray-100 animate-pulse" style={{ width: i === 1 ? "60px" : i === 3 ? "140px" : "100px" }} />
        </td>
      ))}
      <td className="py-4">
        <div className="size-6 rounded-md bg-gray-100 animate-pulse" />
      </td>
    </tr>
  );
}

export default function OrdersPageContent() {
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const limit = 10;

  const { data, isLoading, isError } = useOrders({ page, limit });
  const { data: dashboard, isLoading: isDashboardLoading } = useOrderDashboard();

  const orders = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const m = dashboard?.metrics;
  const fmt = (v?: number) => isDashboardLoading ? "…" : v !== undefined ? String(v) : "—";

  const stats = [
    { label: "Total sales",       value: isDashboardLoading ? "…" : m ? `£${m.totalSales.toFixed(2)}` : "—", red: false },
    { label: "Total orders",      value: fmt(m?.totalOrders),           red: false },
    { label: "Shipped orders",    value: fmt(m?.totalShippedOrders),    red: false },
    { label: "Processing orders", value: fmt(m?.totalProcessingOrders), red: false },
    { label: "Cancelled orders",  value: fmt(m?.totalCancelledOrders),  red: true  },
  ];

  return (
    <AdminPage className="flex flex-col gap-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {stats.map(({ label, value, red }) => (
          <div key={label} className="bg-white rounded-xl p-5 flex flex-col gap-2 border border-gray-100">
            <span className={`text-sm font-medium ${red ? "text-primary" : "text-gray-600"}`}>
              {label}
            </span>
            <span className={`text-2xl font-bold ${red ? "text-primary" : "text-gray-900"}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-5">
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
          </div>
        </div>

        {isError && (
          <p className="text-sm text-red-500">Failed to load orders.</p>
        )}

        {/* Mobile cards */}
        <div className="flex flex-col gap-3 md:hidden">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl border border-gray-100 animate-pulse flex flex-col gap-2">
                <div className="flex justify-between">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-5 w-20 rounded-md bg-gray-100" />
                </div>
                <div className="h-4 w-36 rounded bg-gray-100" />
                <div className="flex justify-between">
                  <div className="h-3 w-20 rounded bg-gray-100" />
                  <div className="h-4 w-16 rounded bg-gray-100" />
                </div>
              </div>
            ))
          ) : orders.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">No orders found.</p>
          ) : (
            orders.map((order) => {
              const badge = statusBadge[order.status] ?? { dot: "bg-gray-400", text: "text-gray-500", bg: "bg-gray-100" };
              const totalGBP = `£${(order.totalNGN / order.exchangeRate).toFixed(2)}`;
              const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit", month: "short", year: "numeric",
              });
              return (
                <button
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="w-full text-left p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">#{order.orderNumber}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${badge.bg} ${badge.text}`}>
                      <span className={`size-1.5 rounded-full shrink-0 ${badge.dot}`} />
                      {statusLabel[order.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{order.customer.firstName} {order.customer.lastName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{date}</span>
                    <span className="text-sm font-semibold text-gray-800">{totalGBP}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Desktop table */}
        <table className="hidden md:table w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Order ID", "Date", "Customer", "Customer Email", "Total Amount"].map((h) => (
                <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
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
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => <SkeletonRow key={i} />)
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => {
                const badge = statusBadge[order.status] ?? { dot: "bg-gray-400", text: "text-gray-500", bg: "bg-gray-100" };
                const isSelected = selectedOrder?.orderNumber === order.orderNumber;
                const totalGBP = `£${(order.totalNGN / order.exchangeRate).toFixed(2)}`;
                const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric",
                });

                return (
                  <tr
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className={`cursor-pointer transition-colors ${
                      index !== orders.length - 1 ? "border-b border-gray-100" : ""
                    } ${isSelected ? "bg-gray-50" : "hover:bg-gray-50"}`}
                  >
                    <td className="py-4 pr-4 text-sm font-medium text-gray-800">
                      #{order.orderNumber}
                    </td>
                    <td className="py-4 pr-4 text-sm text-gray-500">{date}</td>
                    <td className="py-4 pr-4 text-sm text-gray-800">
                      {order.customer.firstName} {order.customer.lastName}
                    </td>
                    <td className="py-4 pr-4 text-sm text-gray-500">{order.customer.email}</td>
                    <td className="py-4 pr-4 text-sm font-medium text-gray-800">{totalGBP}</td>
                    <td className="py-4 pr-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${badge.bg} ${badge.text}`}>
                        <span className={`size-1.5 rounded-full shrink-0 ${badge.dot}`} />
                        {statusLabel[order.status]}
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
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Spinner className="size-3.5" /> : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </AdminPage>
  );
}
