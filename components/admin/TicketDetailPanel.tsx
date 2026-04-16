"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Send,
  Upload,
  AlertTriangle,
  RotateCcw,
  Mail,
  MapPin,
  Phone,
  Bold,
  Italic,
  List,
  ListOrdered,
  Paperclip,
  MoreVertical,
  Heading1,
  Heading2,
  Quote,
  Link,
  ImageIcon,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
export type TicketStatus = "Opened" | "Closed";
export type TicketPriority = "Low" | "Medium" | "High";
export type ReturnState = "none" | "pending" | "approved" | "rejected";

export interface TicketProduct {
  id: string;
  name: string;
  image: string;
  qty: number;
  amount: string;
}

export interface Ticket {
  id: string;
  title: string;
  customer: string;
  email: string;
  address: string;
  phone: string;
  orderId: string;
  date: string;
  status: TicketStatus;
  priority: TicketPriority;
  message: string;
  attachments: { name: string; size: string }[];
  products: TicketProduct[];
  orderAmount: string;
  couponDiscount: string;
  shippingFee: string;
  total: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const priorityStyles: Record<TicketPriority, string> = {
  Low:    "text-green-600 bg-green-50",
  Medium: "text-orange-500 bg-orange-50",
  High:   "text-red-600 bg-red-50",
};

const priorityTextStyles: Record<TicketPriority, string> = {
  Low:    "text-green-600",
  Medium: "text-orange-500",
  High:   "text-red-600",
};

type TrackingStep = {
  label: string;
  ts: string | null;
  state: "done" | "pending" | "success";
};

function getSteps(returnState: ReturnState): TrackingStep[] {
  const done = (label: string): TrackingStep => ({
    label,
    ts: "26/02/26, 6:48PM",
    state: "done",
  });

  const base: TrackingStep[] = [
    done("Order created"),
    done("Payment confirmed"),
    done("Order shipped"),
    { label: "Order completed", ts: "26/02/26, 6:48PM", state: "success" },
  ];

  if (returnState === "approved") {
    return [
      ...base,
      { label: "Return request approved", ts: "26/02/26, 6:48PM", state: "success" },
    ];
  }

  return base;
}

// ── Sub-components ─────────────────────────────────────────────────────────
function StepCircle({ state }: { state: TrackingStep["state"] }) {
  if (state === "success")
    return (
      <div className="size-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
        <Check className="size-3 text-white" strokeWidth={3} />
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

function RichReplyToolbar() {
  return (
    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-100 flex-wrap">
      <button
        type="button"
        className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-600 hover:bg-gray-100 transition-colors font-medium"
      >
        Normal text
        <ChevronDown className="size-3" />
      </button>
      <div className="w-px h-4 bg-gray-200 mx-1" />
      {[Bold, Italic].map((Icon, i) => (
        <button
          key={i}
          type="button"
          className="p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Icon className="size-3.5" />
        </button>
      ))}
      {[Heading1, Heading2].map((Icon, i) => (
        <button
          key={i}
          type="button"
          className="p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Icon className="size-3.5" />
        </button>
      ))}
      <div className="w-px h-4 bg-gray-200 mx-1" />
      {[Quote, Link, ImageIcon, List, ListOrdered].map((Icon, i) => (
        <button
          key={i}
          type="button"
          className="p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function TicketDetailPanel({
  ticket,
  onClose,
}: {
  ticket: Ticket;
  onClose: () => void;
}) {
  const [replyTab, setReplyTab] = useState<"customer" | "internal">("customer");
  const [replyText, setReplyText] = useState("");
  const [rejectText, setRejectText] = useState("");
  const [returnState, setReturnState] = useState<ReturnState>("none");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(true);
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>(ticket.status);
  const [ticketPriority, setTicketPriority] = useState<TicketPriority>(ticket.priority);
  const [openProductMenuId, setOpenProductMenuId] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [replyTypeDropdownOpen, setReplyTypeDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);
  const replyTypeDropdownRef = useRef<HTMLDivElement>(null);

  const steps = getSteps(returnState);
  const stepCols = returnState === "approved" ? "grid-cols-5" : "grid-cols-4";

  const initials = ticket.customer
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    function handleDropdownClose(event: MouseEvent) {
      const target = event.target as Node;

      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(target)
      ) {
        setStatusDropdownOpen(false);
      }

      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(target)
      ) {
        setPriorityDropdownOpen(false);
      }

      if (
        replyTypeDropdownRef.current &&
        !replyTypeDropdownRef.current.contains(target)
      ) {
        setReplyTypeDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDropdownClose);

    return () => {
      document.removeEventListener("mousedown", handleDropdownClose);
    };
  }, []);

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
        className="fixed top-0 right-0 bottom-0 w-[560px] bg-white border-l border-gray-200 overflow-y-auto z-40 shadow-xl"
        style={{ fontFamily: "var(--font-satoshi)" }}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-gray-900 leading-tight truncate">
              {ticket.title}
            </h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {returnState === "approved" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-600">
                  <span className="size-1.5 rounded-full bg-green-500 shrink-0" />
                  Return request approved
                </span>
              )}
              {returnState === "pending" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-50 text-yellow-600">
                  <span className="size-1.5 rounded-full bg-yellow-400 shrink-0" />
                  Return request created
                </span>
              )}

              {/* Status dropdown */}
              <div className="relative" ref={statusDropdownRef}>
                <button
                  onClick={() => setStatusDropdownOpen((open) => !open)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {ticketStatus === "Opened" ? "Open" : "Closed"}
                  <ChevronDown className="size-3" />
                </button>
                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-28 bg-white rounded-lg border border-gray-200 shadow-md py-1 z-20">
                    {(["Opened", "Closed"] as TicketStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setTicketStatus(s);
                          setStatusDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors ${ticketStatus === s ? "text-gray-900" : "text-gray-500"}`}
                      >
                        {s === "Opened" ? "Open" : "Closed"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority dropdown */}
              <div className="relative" ref={priorityDropdownRef}>
                <button
                  onClick={() => setPriorityDropdownOpen((open) => !open)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors hover:opacity-80 ${priorityStyles[ticketPriority]}`}
                >
                  {ticketPriority} priority
                  <ChevronDown className="size-3" />
                </button>
                {priorityDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-lg border border-gray-200 shadow-md py-1 z-20">
                    {(["Low", "Medium", "High"] as TicketPriority[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setTicketPriority(p);
                          setPriorityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors ${priorityTextStyles[p]}`}
                      >
                        {p} priority
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors mt-0.5 shrink-0"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* ── Order info ──────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                Order {ticket.orderId.replace("#", "")}
              </span>
              <button
                onClick={() => setShowOrderDetails((v) => !v)}
                className="inline-flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
              >
                See order details
                {showOrderDetails ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </button>
            </div>
            {returnState === "none" && (
              <button
                onClick={() => setShowReturnModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-400 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors shrink-0"
              >
                <RotateCcw className="size-3.5" />
                Create return request
              </button>
            )}
          </div>

          {/* ── Accordion ─────────────────────────────────────────── */}
          <AnimatePresence initial={false}>
            {showOrderDetails && (
              <motion.div
                key="order-details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
                className="overflow-hidden flex flex-col gap-6"
              >
                <div className="border-t border-gray-100" />

                {/* Product table */}
                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["ID", "Product", "QTY", "Amount"].map((h) => (
                          <th key={h} className="pb-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                        {(returnState === "pending" || returnState === "approved" || returnState === "rejected") && (
                          <th className="pb-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Return</th>
                        )}
                        <th className="pb-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {ticket.products.map((p, i) => (
                        <tr key={i} className={i !== ticket.products.length - 1 ? "border-b border-gray-50" : ""}>
                          <td className="py-2.5 text-xs text-gray-500 pr-3">{p.id}</td>
                          <td className="py-2.5 pr-3">
                            <div className="flex items-center gap-2">
                              <div className="relative size-8 rounded-md overflow-hidden bg-gray-100 shrink-0">
                                <Image src={p.image} alt={p.name} fill className="object-cover" />
                              </div>
                              <span className="text-xs text-gray-800">{p.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-xs text-gray-500 pr-3">x{p.qty}</td>
                          <td className="py-2.5 text-xs font-medium text-gray-800">{p.amount}</td>
                          {(returnState === "pending" || returnState === "approved" || returnState === "rejected") && (
                            <td className="py-2.5">
                              <button className="text-xs text-primary underline underline-offset-2 hover:opacity-80">Return</button>
                            </td>
                          )}
                          <td className="py-2.5 relative">
                            <button
                              onClick={() => setOpenProductMenuId(openProductMenuId === p.id ? null : p.id)}
                              className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <MoreVertical className="size-3.5" />
                            </button>
                            {openProductMenuId === p.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenProductMenuId(null)} />
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg border border-gray-200 shadow-md py-1 z-20">
                                  <button
                                    onClick={() => { setOpenProductMenuId(null); setShowReturnModal(true); }}
                                    className="w-full text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                                  >
                                    Create return ticket
                                  </button>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-gray-100" />

                {/* Customer + pricing */}
                <div className="flex gap-6">
                  <div className="flex-1 flex flex-col gap-2">
                    <p className="text-sm font-bold text-gray-900">{ticket.customer}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail className="size-3 shrink-0" />{ticket.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="size-3 shrink-0" />{ticket.address}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone className="size-3 shrink-0" />{ticket.phone}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-44">
                    {[
                      { label: "Order Amount", value: ticket.orderAmount },
                      { label: "Coupon Discount", value: ticket.couponDiscount },
                      { label: "Shipping Fee", value: ticket.shippingFee },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-xs text-gray-400">{label}</span>
                        <span className="text-xs text-gray-800 font-medium">{value}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-100 pt-1.5 flex justify-between gap-4">
                      <span className="text-xs text-gray-400">Total</span>
                      <span className="text-xs font-bold text-primary">{ticket.total}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Tracking */}
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-4">Tracking Details</p>
                  <div className="flex items-center">
                    {steps.map((step, i) => {
                      const isLast = i === steps.length - 1;
                      const lineActive = !isLast && step.state !== "pending" && steps[i + 1].state !== "pending";
                      return (
                        <div key={i} className={`flex items-center ${!isLast ? "flex-1" : ""}`}>
                          <StepCircle state={step.state} />
                          {!isLast && <div className={`flex-1 h-0.5 ${lineActive ? "bg-gray-900" : "bg-gray-200"}`} />}
                        </div>
                      );
                    })}
                  </div>
                  <div className={`grid ${stepCols} mt-2`}>
                    {steps.map((step, i) => (
                      <div key={i} className="flex flex-col gap-0.5 pr-2">
                        <p className={`text-xs font-medium leading-tight ${step.state === "success" ? "text-green-600" : step.state === "done" ? "text-gray-800" : "text-gray-400"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-400">{step.ts ?? "Time stamp"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="border-t border-gray-100" />

          {/* ── Customer message (email-style) ────────────────────── */}
          <div className="flex flex-col gap-3">
            <div className=" gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-white font-semibold">{initials}</span>
                </div>
                <div>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-semibold text-gray-900">{ticket.customer}</span>
                    <span className="text-xs text-gray-400">({ticket.email})</span>
                  </div> 
                  <span className="text-xs text-gray-400 shrink-0">23rd June, 2026</span>
                </div>
                
              </div>
              
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{ticket.message}</p>
            {ticket.attachments.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-xs font-semibold text-gray-500">
                  {ticket.attachments.length} Attachment{ticket.attachments.length > 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ticket.attachments.map((att) => (
                    <div key={att.name} className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                      <div className="h-20 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <Paperclip className="size-5 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-2">
                        <div>
                          <p className="text-xs font-medium text-gray-800 truncate">{att.name}</p>
                          <p className="text-[10px] text-gray-400">{att.size}</p>
                        </div>
                        <button className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors shrink-0">
                          <Download className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* ── Reply thread ──────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="size-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs text-white font-semibold">A</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-800">Support Agent</span>
                  <span className="text-xs text-gray-400">26/02/26 6:48PM</span>
                </div>
                <div className={`text-sm text-gray-600 leading-relaxed overflow-hidden transition-all ${showReplies ? "" : "max-h-12"}`}>
                  Thank you for reaching out. We&apos;ve received your request and are looking into it. Our team will review your order details and get back to you within 24 hours with an update on your return or refund eligibility.
                </div>
                <button onClick={() => setShowReplies((v) => !v)} className="text-xs text-primary mt-1 hover:opacity-80">
                  {showReplies ? "Hide" : "See more"}
                </button>
              </div>
            </div>

            {(returnState === "pending" || returnState === "approved" || returnState === "rejected") && (
              <div className="flex gap-3">
                <div className="size-7 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-yellow-700 font-semibold">C</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-800">Cynthia A.</span>
                    <span className="text-xs text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded text-[10px] font-medium">Internal note</span>
                    <span className="text-xs text-gray-400">26/02/26 6:48PM</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Return request created for order {ticket.orderId}. Reason: &quot;{returnReason || "Item defective on arrival"}&quot;. Evidence uploaded.
                  </p>
                </div>
              </div>
            )}

            {returnState === "pending" && (
              <div className="flex flex-col gap-3 pl-10">
                <div className="flex gap-3">
                  <button onClick={() => setReturnState("approved")} className="flex-1 h-10 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                    Approve return
                  </button>
                  <button onClick={() => setShowRejectInput((v) => !v)} className="flex-1 h-10 rounded-lg border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors">
                    Reject return
                  </button>
                </div>
                {showRejectInput && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-gray-700">Reason for reject</label>
                    <textarea
                      rows={3}
                      placeholder="Enter reason..."
                      value={rejectText}
                      onChange={(e) => setRejectText(e.target.value)}
                      className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors resize-none"
                    />
                    <button onClick={() => setReturnState("rejected")} className="self-end flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
                      <Send className="size-3.5" />
                      Send
                    </button>
                  </div>
                )}
              </div>
            )}

            {returnState === "rejected" && (
              <div className="flex gap-3">
                <div className="size-7 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-red-600 font-semibold">C</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-800">Cynthia A.</span>
                    <span className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-[10px] font-medium">Return rejected</span>
                    <span className="text-xs text-gray-400">26/02/26 6:48PM</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {rejectText || "Return request has been rejected."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* ── Reply composer (email-style) ──────────────────────── */}
          <div>
            <div className="flex items-center gap-2 pt-3 ">
              <div className="size-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                <span className="text-[14px] text-gray-600 font-semibold">A</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">Reply</span>
                  <div className="relative" ref={replyTypeDropdownRef}>
                    <button
                      onClick={() => setReplyTypeDropdownOpen((open) => !open)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                    >
                      {replyTab === "customer" ? "To customer" : "Internal notes"}
                      <ChevronDown className="size-3" />
                    </button>
                    {replyTypeDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg border border-gray-200 shadow-md py-1 z-20">
                        <button
                          onClick={() => {
                            setReplyTab("customer");
                            setReplyTypeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors ${replyTab === "customer" ? "text-gray-900" : "text-gray-500"}`}
                        >
                          To customer
                        </button>
                        <button
                          onClick={() => {
                            setReplyTab("internal");
                            setReplyTypeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors ${replyTab === "internal" ? "text-gray-900" : "text-gray-500"}`}
                        >
                          Internal notes
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full truncate max-w-[160px]">
                    {ticket.email}
                  </span>
                </div>
                <div className="">
                  <span className="text-xs text-gray-400">23rd June, 2026</span>
                </div>
              </div>
              
            </div>

            {/* Date */}
            
          </div>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            {/* Header: avatar + Reply label + To customer dropdown + email chip */}
            

            {/* Toolbar */}
            <RichReplyToolbar />

            {/* Textarea */}
            <textarea
              rows={6}
              placeholder="Type message."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none resize-none"
            />

            {/* Footer with Send */}
            <div className="flex justify-end px-4 py-3 border-t border-gray-100">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2744] text-white text-sm font-semibold hover:bg-[#15203a] transition-colors">
                <Send className="size-3.5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Create return request modal ──────────────────────────── */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl flex flex-col gap-5" style={{ fontFamily: "var(--font-satoshi)" }}>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="size-12 rounded-full bg-yellow-50 border border-yellow-100 flex items-center justify-center">
                <AlertTriangle className="size-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">Create Return Request</p>
                <p className="text-sm text-gray-500 mt-1">
                  Order ID: <span className="font-semibold text-gray-800">{ticket.orderId}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Reason for return</label>
                <textarea
                  rows={3}
                  placeholder="Enter a description..."
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Upload evidence</label>
                <div className="h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-gray-300 transition-colors bg-gray-50">
                  <Upload className="size-5 text-gray-400" />
                  <p className="text-xs text-gray-500">Click to upload or drag &amp; drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG (max 5MB)</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowReturnModal(false)} className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => { setReturnState("pending"); setShowReturnModal(false); }}
                  className="flex-1 h-11 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
