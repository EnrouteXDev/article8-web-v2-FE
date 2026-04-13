"use client";

import Image from "next/image";
import { CheckCircle2, Circle, Package, MapPin, Truck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock data (replace with real API later) ──────────────────────────────────

const MOCK_ORDER = {
  orderNumber: "ART-2026-00123",
  customer: {
    firstName: "Risqat",
    lastName: "Fijabi",
    addressLine1: "14 Broad Street",
    city: "London",
    state: "England",
    countryCode: "GB",
  },
  status: "shipped", // pending | confirmed | processing | shipped | delivered | cancelled
  estimatedDelivery: "28 Mar, 2026",
  dhlTrackingNumber: "1234567890",
  createdAt: "26/02/26, 6:48PM",
  confirmedAt: "26/02/26, 6:48PM",
  shippedAt: "26/02/26, 6:48PM",
  deliveredAt: null as string | null,
  items: [
    { id: "1765", name: "Article8 Shirt", quantity: 1, priceGBP: 4.99, image: "/artifact1.jpeg" },
    { id: "8775", name: "Article8 Vans", quantity: 4, priceGBP: 4.99, image: "/artifact2.jpeg" },
    { id: "7685", name: "Article8 Shirt", quantity: 2, priceGBP: 4.99, image: "/artifact3.jpeg" },
    { id: "0987", name: "Article8 Vans", quantity: 1, priceGBP: 4.99, image: "/artifact4.jpeg" },
  ],
};

// ─── Steps config ─────────────────────────────────────────────────────────────

type StepKey = "created" | "confirmed" | "shipped" | "delivered";

interface Step {
  key: StepKey;
  label: string;
  icon: React.ReactNode;
  timestamp: string | null;
}

const STATUS_STEP_MAP: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 0,
};

// ─── Step Component ────────────────────────────────────────────────────────────

function TrackingStep({
  step,
  index,
  activeIndex,
  isLast,
}: {
  step: Step;
  index: number;
  activeIndex: number;
  isLast: boolean;
}) {
  const completed = index < activeIndex;
  const active = index === activeIndex;
  const pending = index > activeIndex;

  return (
    <div className="flex flex-col items-center flex-1 relative">
      {/* Connector line before */}
      {index > 0 && (
        <div
          className={cn(
            "absolute top-5 right-1/2 left-0 h-0.5 -translate-y-1/2",
            completed || active ? "bg-primary" : "bg-gray-200"
          )}
        />
      )}

      {/* Icon */}
      <div
        className={cn(
          "relative z-10 flex size-10 items-center justify-center rounded-full border-2 transition-all",
          completed
            ? "border-primary bg-primary text-white"
            : active
            ? "border-primary bg-white text-primary shadow-md shadow-primary/20"
            : "border-gray-200 bg-white text-gray-300"
        )}
      >
        {completed ? (
          <CheckCircle2 className="size-5" />
        ) : (
          <span className={cn("size-5", pending && "text-gray-300")}>{step.icon}</span>
        )}
      </div>

      {/* Labels */}
      <div className="mt-3 flex flex-col items-center gap-0.5 text-center">
        <span
          className={cn(
            "font-satoshi text-xs font-semibold",
            completed || active ? "text-primary" : "text-gray-400"
          )}
        >
          {step.label}
        </span>
        {step.timestamp && (
          <span className="font-satoshi text-[10px] text-primary/40">{step.timestamp}</span>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function TrackingPage() {
  const order = MOCK_ORDER;
  const activeIndex = STATUS_STEP_MAP[order.status] ?? 0;

  const steps: Step[] = [
    {
      key: "created",
      label: "Order created",
      icon: <Circle className="size-5" />,
      timestamp: order.createdAt,
    },
    {
      key: "confirmed",
      label: "Payment confirmed",
      icon: <CheckCircle2 className="size-5" />,
      timestamp: order.confirmedAt,
    },
    {
      key: "shipped",
      label: "Order shipped",
      icon: <Truck className="size-5" />,
      timestamp: order.shippedAt,
    },
    {
      key: "delivered",
      label: "Order completed",
      icon: <Package className="size-5" />,
      timestamp: order.deliveredAt,
    },
  ];

  const subtotal = order.items.reduce((sum, i) => sum + i.priceGBP * i.quantity, 0);

  return (
    <main className="min-h-screen bg-background section-px py-16 md:py-24">
      <div className="section-container max-w-2xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1
            className="font-bold text-2xl md:text-3xl text-primary"
            style={{ fontFamily: "var(--font-baloo-2)" }}
          >
            Track your order
          </h1>
          <p className="font-satoshi text-primary/50 text-sm">
            Order <span className="font-semibold text-primary">{order.orderNumber}</span>
          </p>
        </div>

        {/* Status card */}
        <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
          {/* Status badge */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-700"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    order.status === "delivered"
                      ? "bg-green-500"
                      : order.status === "shipped"
                      ? "bg-blue-500"
                      : order.status === "cancelled"
                      ? "bg-red-500"
                      : "bg-amber-500"
                  )}
                />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {order.estimatedDelivery && order.status !== "delivered" && (
              <div className="flex items-center gap-1.5 text-xs text-primary/60 font-satoshi">
                <Clock className="size-3.5" />
                Est. delivery: <span className="font-semibold text-primary">{order.estimatedDelivery}</span>
              </div>
            )}
          </div>

          {/* Stepper */}
          <div className="flex items-start w-full px-2">
            {steps.map((step, index) => (
              <TrackingStep
                key={step.key}
                step={step}
                index={index}
                activeIndex={activeIndex}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>

        {/* DHL tracking */}
        {order.dhlTrackingNumber && (
          <div className="flex items-center justify-between rounded-2xl border border-primary/10 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                <Truck className="size-4 text-primary" />
              </div>
              <div>
                <p className="font-satoshi text-xs text-primary/50">DHL Tracking number</p>
                <p className="font-satoshi font-semibold text-primary text-sm">{order.dhlTrackingNumber}</p>
              </div>
            </div>
            <a
              href={`https://www.dhl.com/gb-en/home/tracking.html?tracking-id=${order.dhlTrackingNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-primary px-4 py-2 font-satoshi text-xs font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Track on DHL
            </a>
          </div>
        )}

        {/* Delivery address */}
        <div className="rounded-2xl border border-primary/10 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="size-4 text-primary" />
            <p className="font-satoshi font-semibold text-sm text-primary">Delivery address</p>
          </div>
          <p className="font-satoshi text-sm text-primary/70">
            {order.customer.firstName} {order.customer.lastName}
          </p>
          <p className="font-satoshi text-sm text-primary/60">
            {order.customer.addressLine1}, {order.customer.city}, {order.customer.state}, {order.customer.countryCode}
          </p>
        </div>

        {/* Product details */}
        <div className="rounded-2xl border border-primary/10 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-primary/10">
            <p
              className="font-bold text-base text-primary"
              style={{ fontFamily: "var(--font-baloo-2)" }}
            >
              Product details
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary/5 text-[10px] uppercase tracking-widest text-primary/40 font-satoshi">
                  <th className="px-5 py-3 font-medium">ID</th>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium text-right">QTY</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t border-primary/5">
                    <td className="px-5 py-3 font-satoshi text-xs text-primary/40">{item.id}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-primary/10">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <span className="font-satoshi text-sm text-primary">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-satoshi text-sm text-primary/60 text-right">
                      x{item.quantity}
                    </td>
                    <td className="px-5 py-3 font-satoshi text-sm font-semibold text-primary text-right">
                      £{(item.priceGBP * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col divide-y divide-primary/5 md:hidden">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-primary/10">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-satoshi text-sm font-medium text-primary truncate">{item.name}</p>
                  <p className="font-satoshi text-xs text-primary/50">x{item.quantity}</p>
                </div>
                <p className="font-satoshi text-sm font-semibold text-primary shrink-0">
                  £{(item.priceGBP * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between border-t border-primary/10 bg-primary/5 px-5 py-4">
            <span className="font-satoshi text-sm text-primary/60">Subtotal</span>
            <span
              className="font-bold text-primary text-base"
              style={{ fontFamily: "var(--font-baloo-2)" }}
            >
              £{subtotal.toFixed(2)}
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}
