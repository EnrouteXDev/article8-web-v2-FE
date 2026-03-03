"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  X,
  Check,
  Share2,
  Zap,
  AlertCircle,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
export type OrderStatus = "Completed" | "Shipped" | "Cancelled" | "Processing";

export interface OrderProduct {
  id: string;
  name: string;
  image: string;
  qty: number;
  amount: string;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  email: string;
  address: string;
  phone: string;
  amount: string;
  status: OrderStatus;
  orderAmount: string;
  couponDiscount: string;
  shippingFee: string;
  total: string;
  products: OrderProduct[];
}

// ── Helpers ────────────────────────────────────────────────────────────────
const statusBadge: Record<
  OrderStatus,
  { dot: string; text: string; bg: string }
> = {
  Completed:  { dot: "bg-green-500",  text: "text-green-600",  bg: "bg-green-50"  },
  Shipped:    { dot: "bg-purple-500", text: "text-purple-600", bg: "bg-purple-50" },
  Cancelled:  { dot: "bg-red-500",    text: "text-red-600",    bg: "bg-red-50"    },
  Processing: { dot: "bg-gray-400",   text: "text-gray-600",   bg: "bg-gray-100"  },
};

function getSteps(status: OrderStatus) {
  const done = (label: string, ts: string) => ({ label, ts, state: "done" as const });
  const pending = (label: string) => ({ label, ts: null, state: "pending" as const });

  const base = [
    done("Order created", "26/02/26, 6:48PM"),
    done("Payment confirmed", "26/02/26, 6:48PM"),
  ];

  if (status === "Processing") {
    return [...base, pending("Order shipped"), pending("Order completed")];
  }
  if (status === "Shipped") {
    return [...base, done("Order shipped", "26/02/26, 6:48PM"), pending("Order completed")];
  }
  if (status === "Completed") {
    return [
      ...base,
      done("Order shipped", "26/02/26, 6:48PM"),
      { label: "Order completed", ts: "26/02/26, 6:48PM", state: "success" as const },
    ];
  }
  // Cancelled
  return [
    ...base,
    done("Order shipped", "26/02/26, 6:48PM"),
    { label: "Order cancelled", ts: "26/02/26, 6:48PM", state: "cancelled" as const },
  ];
}

// ── Sub-components ─────────────────────────────────────────────────────────
function StepCircle({
  state,
  onClick,
}: {
  state: "done" | "pending" | "success" | "cancelled";
  onClick?: () => void;
}) {
  if (state === "success")
    return (
      <div className="size-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
        <Check className="size-3 text-white" strokeWidth={3} />
      </div>
    );
  if (state === "cancelled")
    return (
      <div className="size-6 rounded-full bg-orange-400 flex items-center justify-center shrink-0">
        <X className="size-3 text-white" strokeWidth={3} />
      </div>
    );
  if (state === "done")
    return (
      <div className="size-6 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
        <Check className="size-3 text-white" strokeWidth={3} />
      </div>
    );
  // pending
  return (
    <button
      onClick={onClick}
      className="size-6 rounded-full border-2 border-gray-300 bg-white shrink-0 hover:border-gray-500 transition-colors"
    />
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function OrderDetailPanel({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const [showShipModal, setShowShipModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [carrier, setCarrier] = useState("");
  const [trackingNum, setTrackingNum] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const badge = statusBadge[order.status];
  const steps = getSteps(order.status);
  const canCancel = order.status === "Processing" || order.status === "Shipped";

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-39"
        onClick={onClose}
      />

      {/* ── Panel ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
        className="fixed top-0 right-0 bottom-0 w-132.5 bg-white border-l border-gray-200 overflow-y-auto z-40 shadow-xl"
        style={{ fontFamily: "var(--font-satoshi)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Order {order.id}</h2>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${badge.bg} ${badge.text}`}
          >
            <span className={`size-1.5 rounded-full shrink-0 ${badge.dot}`} />
            {order.status}
          </span>
          <div className="flex-1" />
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <Share2 className="size-4" />
            Share
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-1"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Customer + pricing */}
          <div className="flex gap-6">
            {/* Customer */}
            <div className="flex-1 flex flex-col gap-2.5">
              <p className="text-base font-bold text-gray-900">{order.customer}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="size-3.5 shrink-0" />
                {order.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="size-3.5 shrink-0" />
                {order.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="size-3.5 shrink-0" />
                {order.phone}
              </div>
            </div>

            {/* Order summary */}
            <div className="flex flex-col gap-2 min-w-48">
              {[
                { label: "Order Amount",    value: order.orderAmount,    red: false },
                { label: "Coupon Discount", value: order.couponDiscount, red: false },
                { label: "Shipping Fee",    value: order.shippingFee,    red: false },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-6">
                  <span className="text-sm text-gray-400">{label}</span>
                  <span className="text-sm text-gray-800 font-medium">{value}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2 flex justify-between gap-6">
                <span className="text-sm text-gray-400">Total</span>
                <span className="text-sm font-bold text-primary">{order.total}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Tracking */}
          <div>
            <p className="text-base font-bold text-gray-900 mb-5">Tracking Details</p>

            {/* Stepper: circles row */}
            <div className="flex items-center">
              {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                const lineActive =
                  !isLast &&
                  step.state !== "pending" &&
                  steps[i + 1].state !== "pending";
                return (
                  <div key={i} className={`flex items-center ${!isLast ? "flex-1" : ""}`}>
                    <StepCircle
                      state={step.state}
                      onClick={() => {
                        if (step.state === "pending" && i === 2) setShowShipModal(true);
                      }}
                    />
                    {!isLast && (
                      <div
                        className={`flex-1 h-0.5 ${lineActive ? "bg-gray-900" : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Labels row */}
            <div className="grid grid-cols-4 mt-2">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col gap-0.5 pr-2">
                  <p
                    className={`text-xs font-medium leading-tight ${
                      step.state === "success"
                        ? "text-green-600"
                        : step.state === "cancelled"
                        ? "text-orange-500"
                        : step.state === "done"
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400">{step.ts ?? "Time stamp"}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-primary mt-4">
              Use checkbox to update tracking progress
            </p>
            <button
              onClick={() => canCancel && setShowCancelModal(true)}
              disabled={!canCancel}
              className="mt-3 px-4 py-2 rounded-lg border border-gray-200 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-red-500 hover:bg-red-50 disabled:hover:bg-transparent"
            >
              Cancel order
            </button>
          </div>

          <div className="border-t border-gray-100" />

          {/* Product details */}
          <div>
            <p className="text-base font-bold text-gray-900 mb-4">Product Details</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["ID", "Product", "QTY", "Amount"].map((h) => (
                    <th
                      key={h}
                      className="pb-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.products.map((p, i) => (
                  <tr
                    key={i}
                    className={i !== order.products.length - 1 ? "border-b border-gray-50" : ""}
                  >
                    <td className="py-3 text-sm text-gray-500 pr-4">{p.id}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="relative size-8 rounded-md overflow-hidden bg-gray-100 shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <span className="text-sm text-gray-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-500 pr-4">x{p.qty}</td>
                    <td className="py-3 text-sm font-medium text-gray-800">{p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ── Ship modal ────────────────────────────────────────────────── */}
      {showShipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
          <div
            className="bg-white rounded-2xl p-6 w-96 shadow-xl flex flex-col gap-5"
            style={{ fontFamily: "var(--font-satoshi)" }}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Zap className="size-5 text-gray-600" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">
                  Change status to &ldquo;Order shipped&rdquo;
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  If you update order status, buyer will receive an email for the update
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Carrier</label>
                <input
                  type="text"
                  placeholder="Carrier"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="h-11 px-4 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Tracking number</label>
                <input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNum}
                  onChange={(e) => setTrackingNum(e.target.value)}
                  className="h-11 px-4 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <button
                onClick={() => setShowShipModal(false)}
                className="w-full h-12 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel modal ──────────────────────────────────────────────── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
          <div
            className="bg-white rounded-2xl p-6 w-96 shadow-xl flex flex-col gap-5"
            style={{ fontFamily: "var(--font-satoshi)" }}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="size-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <AlertCircle className="size-5 text-red-500" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">
                  Are you sure you want to cancel order?
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  If you update order status, the buyer will receive an email for the update
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  State reason for cancel
                </label>
                <textarea
                  placeholder="Enter a description..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                  className="px-4 py-3 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors resize-none"
                />
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full h-12 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Cancel order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
