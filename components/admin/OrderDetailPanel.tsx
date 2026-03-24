"use client";

import { useState } from "react";
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
import { type Order, OrderStatus, DeliveryStatus } from "@/lib/types";
import { useOrderTracking } from "@/lib/queries/orders";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatGBP(ngn: number, rate: number) {
  return `£${(ngn / rate).toFixed(2)}`;
}

const statusBadge: Record<OrderStatus, { dot: string; text: string; bg: string }> = {
  [OrderStatus.PENDING]:    { dot: "bg-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50" },
  [OrderStatus.CONFIRMED]:  { dot: "bg-blue-500",   text: "text-blue-600",   bg: "bg-blue-50"   },
  [OrderStatus.PROCESSING]: { dot: "bg-gray-400",   text: "text-gray-600",   bg: "bg-gray-100"  },
  [OrderStatus.SHIPPED]:    { dot: "bg-purple-500", text: "text-purple-600", bg: "bg-purple-50" },
  [OrderStatus.DELIVERED]:  { dot: "bg-green-500",  text: "text-green-600",  bg: "bg-green-50"  },
  [OrderStatus.CANCELLED]:  { dot: "bg-red-500",    text: "text-red-600",    bg: "bg-red-50"    },
};

type StepState = "done" | "pending" | "success" | "cancelled";

interface Step {
  label: string;
  ts: string | null;
  state: StepState;
}

function getSteps(order: Order): Step[] {
  const { status, createdAt, updatedAt } = order;
  const created = formatDate(createdAt);
  const updated = formatDate(updatedAt);

  const step1: Step = { label: "Order created",      ts: created,  state: "done" };
  const step2Paid: Step = { label: "Payment confirmed", ts: updated, state: "done" };
  const step2Pend: Step = { label: "Payment confirmed", ts: null,    state: "pending" };
  const step3Done: Step = { label: "Order shipped",   ts: updated,  state: "done" };
  const step3Pend: Step = { label: "Order shipped",   ts: null,     state: "pending" };
  const step4Done: Step = { label: "Order delivered", ts: updated,  state: "success" };
  const step4Pend: Step = { label: "Order delivered", ts: null,     state: "pending" };
  const step4Cancel: Step = { label: "Order cancelled", ts: updated, state: "cancelled" };

  switch (status) {
    case OrderStatus.PENDING:
      return [step1, step2Pend, step3Pend, step4Pend];
    case OrderStatus.CONFIRMED:
    case OrderStatus.PROCESSING:
      return [step1, step2Paid, step3Pend, step4Pend];
    case OrderStatus.SHIPPED:
      return [step1, step2Paid, step3Done, step4Pend];
    case OrderStatus.DELIVERED:
      return [step1, step2Paid, step3Done, step4Done];
    case OrderStatus.CANCELLED:
      return [step1, step2Paid, step3Pend, step4Cancel];
    default:
      return [step1, step2Pend, step3Pend, step4Pend];
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StepCircle({ state }: { state: StepState }) {
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
  return (
    <div className="size-6 rounded-full border-2 border-gray-300 bg-white shrink-0" />
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
  const [cancelReason, setCancelReason] = useState("");

  const { data: tracking } = useOrderTracking(order.orderNumber);

  const badge = statusBadge[order.status];
  const steps = getSteps(order);
  const canCancel =
    order.status === OrderStatus.PROCESSING ||
    order.status === OrderStatus.CONFIRMED ||
    order.status === OrderStatus.PENDING;

  const { customer, items, subtotalNGN, shippingCostNGN, discountNGN, totalNGN, exchangeRate } = order;
  const fullName = `${customer.firstName} ${customer.lastName}`;
  const address = [customer.addressLine1, customer.city, customer.state, customer.countryCode]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-39" onClick={onClose} />

      {/* Panel */}
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
          <h2 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${badge.bg} ${badge.text}`}>
            <span className={`size-1.5 rounded-full shrink-0 ${badge.dot}`} />
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
            <div className="flex-1 flex flex-col gap-2.5">
              <p className="text-base font-bold text-gray-900">{fullName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="size-3.5 shrink-0" />
                {customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="size-3.5 shrink-0" />
                {address}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="size-3.5 shrink-0" />
                {customer.phone}
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-48">
              {[
                { label: "Order Amount",    value: formatGBP(subtotalNGN, exchangeRate) },
                { label: "Coupon Discount", value: discountNGN > 0 ? `-${formatGBP(discountNGN, exchangeRate)}` : "—" },
                { label: "Shipping Fee",    value: order.shippingCostGBP ? `£${order.shippingCostGBP.toFixed(2)}` : formatGBP(shippingCostNGN, exchangeRate) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-6">
                  <span className="text-sm text-gray-400">{label}</span>
                  <span className="text-sm text-gray-800 font-medium">{value}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2 flex justify-between gap-6">
                <span className="text-sm text-gray-400">Total</span>
                <span className="text-sm font-bold text-primary">{formatGBP(totalNGN, exchangeRate)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Tracking */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-bold text-gray-900">Tracking Details</p>
              {tracking?.dhlTrackingNumber && (
                <span className="text-xs text-gray-400 font-mono">
                  DHL: {tracking.dhlTrackingNumber}
                </span>
              )}
            </div>

            <div className="flex items-center">
              {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                const lineActive = !isLast && step.state !== "pending" && steps[i + 1].state !== "pending";
                return (
                  <div key={i} className={`flex items-center ${!isLast ? "flex-1" : ""}`}>
                    <StepCircle state={step.state} />
                    {!isLast && (
                      <div className={`flex-1 h-0.5 ${lineActive ? "bg-gray-900" : "bg-gray-200"}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-4 mt-2">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col gap-0.5 pr-2">
                  <p className={`text-xs font-medium leading-tight ${
                    step.state === "success" ? "text-green-600"
                    : step.state === "cancelled" ? "text-orange-500"
                    : step.state === "done" ? "text-gray-800"
                    : "text-gray-400"
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400">{step.ts ?? "Pending"}</p>
                </div>
              ))}
            </div>

            {tracking?.estimatedDeliveryDate && (
              <p className="text-xs text-primary mt-3">
                Estimated delivery: {formatDate(tracking.estimatedDeliveryDate)}
              </p>
            )}

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
                  {["Product", "QTY", "Unit Price", "Amount"].map((h) => (
                    <th key={h} className="pb-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className={i !== items.length - 1 ? "border-b border-gray-50" : ""}>
                    <td className="py-3 pr-4 text-sm text-gray-800">{item.name}</td>
                    <td className="py-3 pr-4 text-sm text-gray-500">x{item.quantity}</td>
                    <td className="py-3 pr-4 text-sm text-gray-500">£{item.priceGBP.toFixed(2)}</td>
                    <td className="py-3 text-sm font-medium text-gray-800">
                      £{(item.priceGBP * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Ship modal — UI shell, pending backend endpoint */}
      {showShipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl flex flex-col gap-5" style={{ fontFamily: "var(--font-satoshi)" }}>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Zap className="size-5 text-gray-600" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">Order shipped via DHL</p>
                <p className="text-sm text-gray-500 mt-1">
                  Shipment is managed automatically by DHL after payment confirmation.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowShipModal(false)}
              className="w-full h-12 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Cancel modal — UI shell, pending backend endpoint */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl flex flex-col gap-5" style={{ fontFamily: "var(--font-satoshi)" }}>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="size-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <AlertCircle className="size-5 text-red-500" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">Cancel order #{order.orderNumber}?</p>
                <p className="text-sm text-gray-500 mt-1">
                  Cancel order endpoint is not yet available. Contact the backend team.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Reason for cancellation</label>
                <textarea
                  placeholder="Enter a reason..."
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
